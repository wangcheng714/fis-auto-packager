define('common:widget/map/iwcontroller.js', function(require, exports, module){

/**
 * @file infowindow控制器
 * 封装infowindow切换、注册和显示
 * @example
 * 使用方法：
 * 1、client不需要关心infoWindow构造、维持和销毁过程
 * 2、client只需要关心需要什么类型（或者模板）的indoWindow
 * 3、client只需要调用get方法，传入指定类型（使用mapConst.IW_***常量），获取infoWindow实例
 * 4、之后，初始化iw需要调用iw.setData方法，根据不同的iw类型传入不同的预设格式的数据（具体看各类型infoWindow注释）
 * 5、最后，调用iw.switchTo方法，切换到指定索引顺序的数据并添加到地图之上
 * 6、目前，没有销毁的需求，一律采用hide方法隐藏处理
 */

var mapConst = require('common:static/js/mapconst.js');

module.exports = {

    /**
     * 预设的构造器
     * @type {Overlay}
     */
    _instances: {
        0  : 'PoiInfoWindow', // 普通检索
        1  : 'PoiInfoWindow', // 泛需求
        2  : 'TrsInfoWindow', // 公交线路
        3  : 'PoiInfoWindow', // 周边查询中心点
        4  : 'TrsInfoWindow', // 公交
        5  : 'TrsInfoWindow', // 驾车
        6  : 'TrsInfoWindow', // 步行
        7  : 'PoiInfoWindow', // 共享位置点
        10 : 'TfcInfoWindow', // 交通路况
        11 : 'PoiInfoWindow'  // 底图可点
    },

    /**
     * 内部变量，保存已创建的infoWindows
     * key/value标识
     * @type {Object}
     */
    _infoWindows: {},

    /**
     * 内部变量，保存当前激活的infoWindow
     * @type {Object}
     */
    _overlay: null,

    /**
     * 初始化方法
     */
    init: function (map) {
        this._map = map;
        return this;
    },

    /**
     * 增加一种类型的InfoWindow，并添加到map
     * @param {Number} type mapConst.IW_***
     */
    get: function(type) {
        if (!this._instances[type]) return this._overlay;

        var iwOverlay, instance;
        if (this._infoWindows[type]) {
            iwOverlay = this._infoWindows[type];
        } else {
            instance = this[this._instances[type]];
            iwOverlay = this._infoWindows[type] = instance.init(type);
            iwOverlay._type = type;
        }

        var overlays = this._map.getOverlays();
        for (var i = 0, len = overlays.length; i < len; i++) {
            if (iwOverlay == overlays[i]) {
                return this._setOverlay(iwOverlay);
            }
        }

        if (iwOverlay instanceof BMap.Overlay) {
            this._map.addOverlay(iwOverlay);
        }

        return this._setOverlay(iwOverlay);
    },

    // 保证不同类型的InfoWindow在图区只有一个弹框
    _setOverlay: function(iwOverlay) {
        if (this._overlay && this._overlay !== iwOverlay) {
            this._overlay.hide();
        }
        this._overlay = iwOverlay;
        this._overlay.show();
        return iwOverlay;
    }

};

});