define('common:widget/api/ext/poiinfowindow.js', function(require, exports, module){

/**
 * @fileOverview POI类型弹窗，用于气泡、麻点弹窗等一系列
 * @author shengxuanwei@baidu.com
 * @date 2013-11-04
 */

var mapConst = require('common:static/js/mapconst.js'),
    url = require('common:widget/url/url.js'),
    util = require('common:static/js/util.js'),
    locator = require('common:widget/geolocation/location.js'),
    InfoWindowOverlay = require('common:widget/api/ext/infowindowoverlay.js'),
    stat = require('common:widget/stat/stat.js');

/**
 * POI类弹框
 * 
 * @example
 * 数据格式要求： 
 * {
 *   json: [{
 *       name: '',
 *       html: '',
 *       uid: '',
 *       geo: '',
 *       pano: ''
 *   }],
 * }
 */
function PoiInfoWindow() {

    this.uid = Date.now();
}
PoiInfoWindow.prototype = new InfoWindowOverlay();
$.extend(PoiInfoWindow.prototype, {

    /**
     * 内部标识
     * 当前弹框数据所在列表数据的索引值
     * @type {Number}
     */
    index: 0,

    /**
     * 重设X坐标偏移值
     * @type {Number}
     */
    offsetX: -1,

    /**
     * 重设Y坐标偏移值
     * 动态指定iw偏移高度
     * @type {Number}
     */
    offsetY: 36,

    /**
     * 切换到对应索引值的数据，并弹框显示
     * @public
     * @param  {Number} index 数据索引值
     */
    switchTo: function(index) {
        this.index = index || 0; // 索引值
        this.point = this._getPoint(); // 坐标点
        this.content = this._getContent(); // 弹框内容
        this.show(); // 调用基类方法
    },

    /**
     * 根据索引值获取POI数据
     * @public
     * @return {Object}
     */
    getPoiData: function() {
        var index = this.index;
        var poiData = this.getData(this.type, this.index);
        if (!poiData) {
            return;
        }

        return poiData;
    },

    /**
     * 解析POI坐标点
     * @private
     * @return {Object}
     */
    _getPoint: function() {
        var poiData = this.getPoiData();
        if (!poiData) {
            return;
        }

        return util.geoToPoint(poiData.geo);
    },

    /**
     * 解析POI，动态生成HTML，备份数据保存到DOM节点的data标签
     * 这里用到的属性：name, pano，geo
     * @private
     * @return {Object}
     */
    _getContent: function() {
        var poiData = this.getPoiData();
        if (!poiData) {
            return;
        }

        var title = poiData.name.replace('\\', '');

        if (poiData.poiType == mapConst.POI_TYPE_BUSSTOP) {
            title = title + "-公交车站";
        } else if (poiData.poiType == mapConst.POI_TYPE_SUBSTOP) {
            title = title + "-地铁站";
        }

        var content = $("<div />", {
            'class': 'iw-c-title ' + (poiData.pano && poiData.pano == 1 ? 'iw-c-title-pano': ''), // pano说明有街景数据
            'text': title,
            'html': poiData.html,
            'data-name': poiData.name,
            'data-uid': poiData.uid,
            'data-geo': poiData.geo
        });

        return content;
    },

    /**
     * 跳转到周边检索
     * @public
     */
    nbSearch: function (name, geo) {
        if (!name || !geo) return;

        var point = util.geoToPoint(geo);
        var pageState = {
            nb_x: point && point.lng,
            nb_y: point && point.lat,
            center_name: name || "",
            from: "searchnearby"
        };

        // 发起周边检索的统计
        stat.addCookieStat(COM_STAT_CODE.MAP_IW_NB_SEARCH);

        url.update({
            module: 'index',
            action: 'searchnearby',
            query: {
                foo: 'bar'
            },
            pageState: pageState
        }, {
            trigger: true,
            pageStateReplace: true,
            queryReplace: true
        });
    },

    /**
     * 跳转到线路检索
     * @public
     */
    lineSearch: function (name, geo) {
        if (!name || !geo) return;

        var point = util.geoToPoint(geo);
        var queryData = {
            word: name,
            point: (point && point.lng) + ',' + (point && point.lat),
            citycode: this.cityCode || locator.getCityCode()
        };
        var pageState = {
            'end': util.jsonToQuery(queryData),
            'from': 'place'
        };

        // 发起线路检索检索的统计
        stat.addCookieStat(COM_STAT_CODE.MAP_IW_LINE_SEARCH);

        url.update({
            module: 'place',
            action: 'linesearch',
            query: {
                foo: 'bar'
            },
            pageState: pageState
        }, {
            trigger: true,
            queryReplace: true,
            pageStateReplace: true
        });
    },

    /**
     * 跳转到详情页
     * @public
     */
    detailSearch: function(uid) {

        // 发起线路检索检索的统计
        stat.addCookieStat(COM_STAT_CODE.MAP_IW_DETAIL_SEARCH);

        if (uid) { // 用于麻点和矢量底图
            url.update({
                module:'place',
                action: 'detail',
                query:{
                    qt: 'inf',
                    uid: uid
                },
                pageState: {
                    vt: ''
                }
            }, {
                trigger: true,
                queryReplace: true,
                pageStateReplace: true
            });
        } else { // 用于列表页气泡
            url.update({
                module:'place',
                action: 'detail',
                query:{
                    foo: 'bar'
                },
                pageState: {
                    vt: '',
                    i: this.index
                }
            }, {
                trigger: true,
                queryReplace: false,
                pageStateReplace: true
            });
        }
    }
});

module.exports = {

    _className_ : 'PoiInfoWindow',
    
    // 输出单例
    _instances: {},

    // 保存构造器，用于controller类型匹配
    _constructor: PoiInfoWindow,

    init: function (type) {

        // 为不同类型创建各自的实例，保证数据隔离
        // 共用一个父容器#iw_ct
        // 数据切换和type设置只在setData方法触发
        var instance;
        if (!this._instances[type]) {
            instance = this._instances[type] = new this._constructor();

            // 初始化过程中重设偏移值
            // 各自实例保存，互不影响
            switch(type) {
                case mapConst.IW_GRT:
                    instance.offsetX = 2;
                    instance.offsetY = 32;
                    break;
                case mapConst.IW_VCT:
                    instance.offsetX = 0;
                    instance.offsetY = 7;
                    break;
                case mapConst.IW_CNT:
                    instance.offsetX = 1;
                    instance.offsetY = 15;
                    break;
            }
        }
        return instance;

    }

};

});