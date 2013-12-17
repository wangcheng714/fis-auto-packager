/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */
var util = require('common:static/js/util.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    url = require('common:widget/url/url.js');

/**
 * 底图性能统计记录起点时间变量
 */
var vct_start_time,
    ras_start_time,
    traffic_start_time;

/**
 * 底图性能统计参数
 */
var netspeed = window.netspeed,
    netMarkName = netspeed < 300 ? 'high' : 'low',
    landMarkName = pagemgr.isLandingPage()? 'ild' : 'uld',
    pltMarkName = util.isAndroid() ? 'and' : 
                  util.isIPad() ? 'ipd' : 
                  util.isIPhone() ? 'iph' : 'oth';

/**
 * 底图性能统计对象
 */
var map,
    map_page_app = SDC.createApp(SDC.DICT.MAP_OTHER_PAGE),
    map_avg_app = SDC.createApp(SDC.DICT.MAP_AVG),
    vector_app = SDC.createApp(SDC.DICT.MAP_VCT),
    raster_app = SDC.createApp(SDC.DICT.MAP_TIL),
    traffic_app = SDC.createApp(SDC.DICT.TRAFFIC_LAD);

/**
 * 记录页面和浏览器切换状态,只针对底图页
 */
var isAppBack = false,  // 重回APP
    isAppOut = false,   // 离开APP
    isPageOut = false;  // 切出页面

function bindAppStateEvent() {
    // 监听pageshow 记录切回浏览器的状态
    $(window).on('pageshow', function(evt) {
        //只有从back-forward cache才记录 by jican
        if(evt && evt.persisted) {
            isAppBack = true;
        }
    });
    // 监听pagehide 记录切出浏览器的状态
    $(window).on('pagehide', function(evt) {
        isAppOut = true;
    });
    // 监听switchstart 记录用户切出底图页状态
    listener.on('common.page', 'switchstart', function(evt){
        isPageOut = true;
    });
}

/**
 * 是否允许发送统计数据
 */
function allowSendData () {
    return !isAppBack && !isAppOut && !isPageOut;
}

/**
 * 根据HASH获取区分底图页面的性能统计APP
 */
function getMapPageApp () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        key = ('MAP_' + module + '_' + action).toUpperCase();

    if(SDC.DICT[key]) {
        return SDC.createApp(SDC.DICT[key]);
    } else {
        return map_page_app;
    }
}

/**
 * 矢量渲染开始回调函数
 */
function mapload() {
    map_avg_app.mark('c_map_load');
    map.removeEventListener("load", mapload);
}

/**
 * 矢量渲染开始回调函数
 */
function vectorbegin() {
    vct_start_time = Date.now();
}

/**
 * 栅格渲染开始回调函数
 */
function rasterbegin() {
    ras_start_time = Date.now();
}

/**
 * 矢量路况开始回调函数
 */
function trafficvectorbegin() {
    traffic_start_time = Date.now();
}

/**
 * 矢量渲染结束回调函数
 */
function vectorloaded() {
    
    if(vct_start_time && allowSendData()){
        // 为了防止事件派发导致的错误记录需要在loaded事件里记录begin时间 by jican
        map_avg_app.mark('c_vector_begin', vct_start_time);
        map_page_app.mark('c_vct_st', vct_start_time);
        vector_app.mark('c_vct_st', vct_start_time);

        // 平均矢量出图时间
        map_avg_app.mark('c_vector_load');
        map_avg_app.view_time();
        map_avg_app.ready(1);

        // 分页面统计矢量出图时间
        map_page_app.mark('c_vct_lt_' + landMarkName);
        map_page_app.view_time();
        map_page_app.ready(1);

        // 单独统计矢量出图时间
        vector_app.view_time();
        vector_app.ready(1);

        // 性能测试
        window._perlog && window._perlog(map_avg_app);
    }

    map.removeEventListener("onvectorbegin", vectorbegin);
    map.removeEventListener("ontilesbegin", rasterbegin);
    map.removeEventListener("onvectorloaded", vectorloaded);
    map.removeEventListener("ontilesloaded", rasterloaded);
}

/**
 * 栅格渲染结束回调函数
 */
function rasterloaded() {

    if(ras_start_time && allowSendData()) {
        // 为了防止事件派发导致的错误记录需要在loaded事件里记录begin时间 by jican
        map_avg_app.mark('c_tiles_begin', ras_start_time);
        map_page_app.mark('c_rst_st', ras_start_time);
        raster_app.mark('c_rst_st', ras_start_time);

        // 平均栅格出图时间
        map_avg_app.mark('c_tiles_load');
        map_avg_app.view_time();
        map_avg_app.ready(1);

        // 分页面统计栅格出图时间
        map_page_app.mark('c_rst_lt_' + landMarkName);
        map_page_app.view_time();
        map_page_app.ready(1);

        // 单独统计栅格出图时间
        raster_app.view_time();
        raster_app.ready(1);

        // 性能测试
        window._perlog && window._perlog(map_avg_app);
    }

    map.removeEventListener("onvectorbegin", vectorbegin);
    map.removeEventListener("ontilesbegin", rasterbegin);
    map.removeEventListener("onvectorloaded", vectorloaded);
    map.removeEventListener("ontilesloaded", rasterloaded);
}

/**
 * 矢量路况渲染结束回调函数
 */
function trafficvectorloaded() {
    if (traffic_start_time && allowSendData()) {
        traffic_app.start_event(traffic_start_time);
        traffic_app.view_time();
        traffic_app.ready(1);
    }
    map.removeEventListener("onTrafficvectorbegin", trafficvectorbegin);
    map.removeEventListener("onTrafficvectorloaded",  trafficvectorloaded);
}

// 记录性能统计起点时间
function mapStart() {
    map_page_app = getMapPageApp();
    map_avg_app.start_event();
    map_page_app.start_event();
    vector_app.start_event();
    raster_app.start_event();
}

// 记录JS加载完成时间
function jsLoaded() {
    map_avg_app.mark('c_js_load');
    map_avg_app.mark('c_js_lt_' + landMarkName);
}

// 地图对象实例化后监听API派发事件
function mapInit(event, mapObj) {
    map = mapObj;
    map.addEventListener("load", mapload);
    map.addEventListener("onvectorbegin", vectorbegin);
    map.addEventListener("ontilesbegin", rasterbegin);
    map.addEventListener("onvectorloaded", vectorloaded);
    map.addEventListener("ontilesloaded", rasterloaded);
    map.addEventListener("onTrafficvectorbegin", trafficvectorbegin);
    map.addEventListener("onTrafficvectorloaded", trafficvectorloaded);
}

module.exports = {
    /**
     * 底图性能统计初始化
     */
    init: function () {
        // 监听页面状态
        bindAppStateEvent();
        // 监听common.map事件
        listener.once('common.map', 'start', mapStart);
        listener.once('common.map', 'jsloaded', jsLoaded);
        listener.once('common.map', 'init', mapInit);
    }
};