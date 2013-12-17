define('common:widget/api/ext/trsinfowindow.js', function(require, exports, module){

/**
 * @fileOverview 交通类型弹窗，用于公交路线、公交、驾车、步行弹窗等一系列
 * @author shengxuanwei@baidu.com
 * @date 2013-11-04
 */

var mapConst = require('common:static/js/mapconst.js'),
    util = require('common:static/js/util.js'),
    InfoWindowOverlay = require('common:widget/api/ext/infowindowoverlay.js');

/**
 * 交通类弹框
 * 
 * @example
 * 数据格式要求： 
 * {
 *   json: [{
 *       content: ''
 *   }],
 *   points: [{
 *       p: ''
 *   }]
 * }
 * 其中，json保存路线规划，points保存站点坐标
 * json和points数量可能不一致，因为终点不需要路线规划
 */
function TrsInfoWindow() {}
TrsInfoWindow.prototype = new InfoWindowOverlay();
$.extend(TrsInfoWindow.prototype, {

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
    offsetY: 5,

    /**
     * 重写基类create方法，自定义弹窗框架
     */
    create: function() {
        return $(this.container).append($("<li />", {
            'class': 'iw-c',
            'data-iw-id': 'iw-c'
        })).css({
            'width': '228px',
            'height': 'auto',
            'min-height': '64px'
        });
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
        var index = this.index,
            point = this._getPoints(this.type, this.index);

        return util.getPointByStr(point.p);
    },

    /**
     * @param {Number} type 类型标识
     * @param {Number} data 数据索引
     */
    _getPoints: function(type, index) {
        var points = this.points[type];
        if (!points) return;

        if (index > -1 && points[index] !== undefined) {
            return points[index];
        }

        return points;
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
        
        var content = $("<div />", {
            'id': 'iw_c_' + this.type,
            'text': poiData.content,
            'html': poiData.content,
            'class': 'iw-c-c',
            'data-content': poiData.content
        });

        return content;
    }
});

module.exports = {

    _className_ : 'TrsInfoWindow',

    // 输出单例
    _instances: {},

    // 保存构造器，用于controller类型匹配
    _constructor: TrsInfoWindow,

    init: function (type) {

        // 为不同类型创建各自的实例，保证数据隔离
        // 共用一个父容器#iw_ct
        // 数据切换和type设置只在setData方法触发
        var instance;
        if (!this._instances[type]) {
            instance = this._instances[type] = new this._constructor();

            switch(type) {
                case mapConst.IW_NAV:
                    instance.offsetX = 0;
                    instance.offsetY = 8;
                    break;
            }
        }
        return instance;

    }

};

});