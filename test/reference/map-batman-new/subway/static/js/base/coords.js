/**
 * @file 抽象坐标点
 * 
 */
define('subway:static/js/base/coords.js', function (require, exports, module) {
    function Coords(x, y) {
        this.x = x;
        this.y = y;
    }

    Coords.prototype.toString = function() {
        return [this.x, this.y].join(",");
    };

    Coords.prototype.floor = function() {
        return new Coords(this.x>>0, this.y>>0);
    };

    module.exports = Coords;
});