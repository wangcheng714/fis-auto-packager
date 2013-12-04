/**
 * 自定义圆形覆盖物
 * @fileoverview 自定义圆形覆盖物，用于显示定位误差范围
 */
var BMap = require('common:widget/api/api.js');

function CircleOverlay(center, radius){
    this.center = center;
    this.radius = radius * 1;
    this.enableMassClear = false;
}
CircleOverlay.prototype = new BMap.Overlay();
CircleOverlay.prototype.initialize = function(map){
    this._map = map;
    var outer = this._outer = document.createElement('div');
    var style = outer.style;
    style.position = 'absolute';
    style.border = '2px solid #A4B2CC';
    style.opacity = 0.6;
    style.backgroundColor = 'rgba(70, 115, 204, 0.2)';
    map.getPanes().mapPane.appendChild(outer);
    return outer;
}
/**
 * TODO: 需要修改这个方法
 */
CircleOverlay.prototype.setInfo = function(point, radius){
    this.center = point || this.point;
    this.radius = (radius || this.radius) * 1;
    this.draw();
}
/**
 * 重绘方法
 */
CircleOverlay.prototype.draw = function(){
    var map = this._map;
    var zoom = map.getZoom();
    var zoomUnits = Math.pow(2, (map.getMapType().getMaxZoom() - zoom));
    var radiusPx =  this.radius / zoomUnits;
    // 产品策略，半径小于10个像素就不显示了
    if (radiusPx < 10) {
        this.hide();
    } else {
        this.show();
    }
    var px = map.pointToOverlayPixel(this.center);
    var style = this._outer.style;
    style.width = style.height = 2 * radiusPx + "px";
    style.left = px.x - radiusPx - 2 + "px";
    style.top = px.y - radiusPx - 2 + "px";
    style.WebkitBorderRadius = radiusPx + 2 + "px";
    style.borderRadius = radiusPx + 2 + "px";
}

CircleOverlay._className_ = 'CircleOverlay';

module.exports = CircleOverlay;