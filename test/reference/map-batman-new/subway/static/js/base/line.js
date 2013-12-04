/**
 * @file 地铁线路
 * @param {String} lid  名称；
 * @param {String} lb   标注文字；
 * @param {String} slb  简称，去除了“线”字；
 * @param {String} uid  加密编码；
 * @param {Int} n   站点数量；
 * @param {Boolean} loop 环线；
 * @param {Float} lbx  标注起始坐标X
 * @param {Float} lby  标注起始坐标Y
 * @param {Float} lbr  北京机场专线值不为0.0；
 * @param {String} lc 颜色RGB值；
 */
define('subway:static/js/base/line.js', function (require, exports, module) {
    function Line(lid, lb, slb, uid, n, loop, lbx, lby, lbr, lc) {
        this.lid = lid;
        this.lb = lb;
        this.slb = slb;
        this.uid = uid;
        this.n = n;
        this.loop = loop;
        this.lbx = lbx;
        this.lby = lby;
        this.lbr = lbr;
        this.lc = lc;
        this.stations = [];
    }

    module.exports = Line;
});