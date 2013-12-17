define('common:widget/map/preloader/preloader.js', function(require, exports, module){

/**
 * @fileoverview 底图预加载组件
 * @author jican@baidu.com
 * @date 2013/11/28
 */

var util = require('common:static/js/util.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('common:widget/map/preloader/helper.js');
    tileloader = require('common:widget/map/preloader/tileloader.js');

/**
 * 页面列表 根据module+action 对应pageid
 */
var pagelist = {
    'index_index_map'       : 1,
    'index_index_index'     : 2,
    'index_index_navline'   : 3,
    'place_list'            : 4,
    'place_detail'          : 5,
    'transit_detail'        : 6,
    'drive_list'            : 7,
    'walk_list'             : 8
}

/**
 * 底图预加载配置 需要同时满足 pageid nettype apptype 才可以预加载
 * pageid: 页面id 参考pagelist
 * nettype: 网络类型 1:wifi 2:2g 3:3g
 * apptype: 页面类型 1:单页 2:多页
 */
var config = {
    //定位
    'geolocation'   : {
        'pageid'    : [2,3],  //首页周边 首页路线
        'nettype'   : [0,1,2,3],  //wifi 3g
        'apptype'   : [1,2] //单页 多页
    },
    //落地页加载完成
    'onload'        : {
        'pageid'    : [2,3,4,5,6,7,8],
        'nettype'   : [0,1,2,3],  //wifi 3g
        'apptype'   : [1,2] //单页 多页
    },
    //页面切换完成
    'switchend'     : {
        'pageid'    : [2,3,4,5,6,7,8],
        'nettype'   : [0,1,2,3],  //wifi 3g
        'apptype'   : [1] //单页
    },
    //点击地图按钮
    'mapclick'      : {
        'pageid'    : [2,3,4,5,6,7,8],
        'nettype'   : [0,1,2,3],  //wifi 2g 3g
        'apptype'   : [1]   //单页
    }
}

/**
 * 获取页面ID
 * @return {number} id
 */
function getPageID () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        page = apphash.page,
        key = '';
    if(module==='index' && action==='index') {
        return pagelist[module+'_'+action+'_'+page];
    } else {
        return pagelist[module+'_'+action];
    }
}

/**
 * 获取预加载底图的中心点和层级
 * @param ViewportOptions
 * @return Object {center, zoom} 表示地图的中心点和级别.
 */
function getViewport (options) {
    var pageid = getPageID() || 0;

    if([1,2,3].indexOf(pageid) >=0 ) {
        // 首页直接获取定位的中心点和层级
        return {
            zoom: locator.getLevel(),
            center: {
                lng: locator.getPointX(),
                lat: locator.getPointY()
            }            
        }
    } else {
        // 其他页通过后端检索返回的bounds计算
        return helper.getViewport(options);
    }
}

/**
 * 加载底图数据
 * @param {string} eventName 事件名称
 */
function loadTiles(eventName) {
    if(!allowPreload(eventName)){
        return;
    }

    var mapsize = helper.getMapSize(),
        viewport = getViewport(),
        center = viewport.center,
        zoom = viewport.zoom;

    if(center && zoom) {
        tileloader.loadTiles(center, zoom, {
            mapWidth: mapsize.width,
            mapHeight: mapsize.height
        });
    }
}

/**
 * 是否允许预加载底图数据 
 * @param {string} eventName 事件名称 
 */
function allowPreload (eventName) {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        page = apphash.page,
        nettype = parseInt(window._WISE_INFO.netype, 10) || 0,
        apptype = pagemgr.isSinglePageApp() ? 1 : 2,
        pageid = getPageID() || 0,
        filter = config[eventName] || {};

    return  !/map/.test(page) &&
            filter.nettype.indexOf(nettype) >=0 && 
            filter.apptype.indexOf(apptype) >=0 && 
            filter.pageid.indexOf(pageid) >=0;
}

module.exports = {
    /**
     * 标记是否初始化
     */
    _initialized : false,
    /**
     * 预加载初始化
     */
    init: function () {
        // 绑定事件
        this.bindEvent();
        // 预加载地图JS文件
        require.async(['common:widget/api/api.js', 'common:widget/api/ext/tfcinfowindow.js']);
        // 预加载矢量异步JS文件
        require('common:widget/map/preloader/plugin.js').getVectorMdl();
        // 标记已经初始化
        this._initialized = true;
    },
    /**
     * 加载底图数据
     * @param {string} eventName 事件名称
     */
    loadTiles: function (eventName) {
        loadTiles(eventName);
    },
    /**
     * 绑定事件 
     */
    bindEvent: function () {
        // 初始化过不需要重复绑定
        if(this._initialized) {
            return;
        }

        // 页面加载完成 预加载底图
        $(window).on('load', function () {
            loadTiles('onload');
        });

        // 监听switchend主要是为了屏蔽place详情页pageloaded多次派发的问题
        var eventList = {};
        listener.on('common.page', 'switchend', function (eventName, opts) {
            eventList[opts.eid] = 1;
        });
        // 监听页面完全切换完成 预加载底图
        listener.on('common.page', 'pageloaded', function (eventName, opts) {
            if(eventList[opts.eid]) {
                loadTiles('switchend');
                delete eventList[opts.eid];
            }
        });

        // 监听定位成功 预加载底图
        listener.on('common.geolocation', 'success', function (eventName, data) {
            loadTiles('geolocation');
        }, this);
    }
};

});