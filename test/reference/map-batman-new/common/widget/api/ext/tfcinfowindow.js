/**
 * @fileOverview 路况类型弹窗，用于交通路况特殊事件弹框
 * @author shengxuanwei@baidu.com
 * @date 2013-11-04
 */

var mapConst = require('common:static/js/mapconst.js'),
    util = require('common:static/js/util.js'),
    InfoWindowOverlay = require('common:widget/api/ext/infowindowoverlay.js');

/**
 * 路况类弹框
 * 
 * @example
 * 数据格式要求： 
 * {
 *   json: [{
 *       title: '',
 *       starttime: '',
 *       endtime: '',
 *       des: [],
 *       geo: ''
 *   }]
 * }
 */
function TfcInfoWindow() {}
TfcInfoWindow.prototype = new InfoWindowOverlay();
$.extend(TfcInfoWindow.prototype, {

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
    offsetX: 0,

    /**
     * 重设Y坐标偏移值
     * 动态指定iw偏移高度
     * @type {Number}
     */
    offsetY: 26,

    /**
     * 重写基类create方法，自定义弹窗框架
     */
    create: function() {
        return $(this.container).append($("<li />", {
            'class': 'iw-c',
            'css': {
                'width': '254px' // 重设宽度
            },
            'data-iw-id': 'iw-c'
        }));
    },

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
     * @private
     * @return {Object}
     */
    _getPoiData: function() {
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
        var poiData = this._getPoiData();
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
        var poiData = this._getPoiData();
        if (!poiData) {
            return;
        }

        var stText, etText;
        if (poiData.starttime) {
            var st = new Date();
            st.setTime(parseInt(poiData.starttime) * 1000);
            stText = '开始时间：' + st.format('yyyy-MM-dd hh:mm');
        }

        if (poiData.endtime) {
            var et = new Date();
            et.setTime(parseInt(poiData.endtime) * 1000);
            etText = '预计结束时间：' + et.format('yyyy-MM-dd hh:mm');
        }

        var ctText = '详情：' + poiData.des;

        var content = $("<div />", {
            'id': 'iw_c_' + this.type,
            'html': "<div class='iw-c-title'>{0}</div><div class='iw-c-list'><p>{1}</p><p>{2}</p><p>{3}</p></div>".format(poiData.title, stText, etText, ctText),
            'class': 'iw-c-c'
        });

        return content;
    }
});

module.exports = {

    _className_ : 'TfcInfoWindow',

    // 输出单例
    _instances: {},

    // 保存构造器，用于controller类型匹配
    _constructor: TfcInfoWindow,

    init: function (type) {

        // 为不同类型创建各自的实例，保证数据隔离
        // 共用一个父容器#iw_ct
        // 数据切换和type设置只在setData方法触发
        var instance;
        if (!this._instances[type]) {
            instance = this._instances[type] = new this._constructor();
        }
        return instance;

    }

};