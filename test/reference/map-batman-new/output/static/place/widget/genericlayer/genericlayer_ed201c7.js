define('place:widget/genericlayer/genericlayer.js', function(require, exports, module){

/**
 * 泛需求麻点栅格图
 * shengxuanwei@baidu.com
 * 2013-10-31
 */
var loc = require('common:widget/geolocation/location.js');

function MDLayer(opts) {
    BMap.TileLayer.call(this, opts);
    this._opts = {};
    opts = opts || {};
    this._opts = $.extend(this._opts, opts);
}
MDLayer.prototype = new BMap.TileLayer();
MDLayer.prototype.initialize = function (map, container) {
    BMap.TileLayer.prototype.initialize.call(this, map, container);
    this._map = map;
};
/**
 * 实现getTilesUrl接口
 * @param Point
 * @param Number
 */
MDLayer.prototype.getTilesUrl = function (point, level) {
    var me = this;
    var column = point.y,
        row = point.x;
    var domains = ["http://gss0.map.baidu.com", "http://gss1.map.baidu.com", "http://gss2.map.baidu.com", "http://gss3.map.baidu.com"];
    var pno = Math.abs(row + column) % domains.length;
    var url = domains[pno] + "/?qt=bkg_png&c=" + loc.getCityCode() + "&ie=utf-8";
    if (!window["placeParam"]) {
        url += "&wd=" + encodeURIComponent(me._opts.json.result.return_query);
    } else {
        url += "&wd=" + encodeURIComponent(me._opts.json.result.return_query) + window["placeParam"];
    } //如果是高分屏设备，则添加高分参数，同时修改 抽稀值rn by caodongqing
    //任何设备都麻点抽稀，所以提出来强行设置 by yangjian
    url = url + "&rn=4";
    if (this._map.highResolutionEnabled()) {
        url = url + "&imgtype=hdpi";
    }
    // 中心点
    if (loc.hasExactPoi()) {
        url += '&center_rank=1';
        url += '&nb_x=' + loc.getPointX();
        url += '&nb_y=' + loc.getPointY();
    }

    //url = locationBar.updateUrl(url);
    var b = this._map.getBounds();
    var minX = b.getSouthWest().lng;
    var minY = b.getSouthWest().lat;
    var maxX = b.getNorthEast().lng;
    var maxY = b.getNorthEast().lat;
    var bs = escape("(") + minX + "," + minY + ";" + maxX + "," + maxY + escape(")");
    url += "&l=" + level + "&xy=" + row + "_" + column + "&b=" + bs + "&t=" + new Date().getTime();
    return url;
};

MDLayer._className_ = 'MDLayer';

module.exports = MDLayer;

});