define('common:widget/map/preloader/CBounds.js', function(require, exports, module){

/**
 * @fileoverview 自定义矩形地理区域类文件 
 * @author jican@baidu.com
 */

/**
 * 矩形地理区域类;
 * @param {Point} south west 西南角
 * @param {Point} north east 东北角
 */
function CBounds(sw, ne) {
    this._sw = {lng: sw.lng, lat: sw.lat};
    this._ne = {lng: ne.lng, lat: ne.lat};
    this._swLng = sw.lng;
    this._swLat = sw.lat;
    this._neLng = ne.lng;
    this._neLat = ne.lat;
}

$.extend(CBounds.prototype, {  
    /**
     * 返回该区域的中心点地理坐标
     * @return {Point} 地理点坐标对象.
     */
    getCenter: function() {
        return {
            lng : (this._swLng + this._neLng) / 2,
            lat : (this._swLat + this._neLat) / 2
        }
    },
    /**
     * 返回地理区域跨度，用坐标表示
     * @return Point
     */
    toSpan: function() {
        return {
            lng : Math.abs(this._neLng - this._swLng),
            lat : Math.abs(this._neLat - this._swLat)
        }
    }
});

module.exports = CBounds;

});