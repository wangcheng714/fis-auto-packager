/**
 * @file 地铁站点
 * @param {} sid   名称；
 * @param {} lb    标注文字；
 * @param {} uid  加密编码；
 * @param {} px   坐标X；
 * @param {} py   坐标Y；
 * @param {} x    绘制坐标X；
 * @param {} y    绘制坐标Y；
 * @param {} rx   标注大小X；
 * @param {} ry   标注大小Y；
 * @param {} st   是否绘制隐藏站点，用于绘制曲线；
 * @param {} ex   是否中转站；
 * @param {} iu   是否绘制，用于隐藏并行换乘站，如四惠、四惠东；
 * @param {} rc   是否圆角，配置st参数；
 * @param {} slb  暂时无用；
 * @param {} ln   div的Name值；
 * @param {} color   颜色RGB值；
 * @param {} icon    站点图标，仅用于机场航站楼；
 * @param {} dx   站点绘制偏移X，香港和上海；
 * @param {} dy   站点绘制偏移Y，香港和上海；
 * @param {} trs_x   并行线路之间的中转站点图标的绘制偏移量
 * @param {} trs_y   并行线路之间的中转站点图标的绘制偏移量
 * @param {} interval 发车间隔；
 */
define('subway:static/js/base/station.js', function (require, exports, module) {
    function Station(sid, lb, uid, px, py, x, y, rx, ry, st, ex, iu, rc, slb, ln, color, icon, dx, dy, trs_x, trs_y) {
        this.sid = sid;
        this.lb = lb;
        this.uid = uid;
        this.px = px;
        this.py = py;
        this.x = x;
        this.y = y;
        this.rx = rx;
        this.ry = ry;
        this.st = st;
        this.ex = ex;
        this.iu = iu;
        this.rc = rc;
        this.slb = slb;
        this.ln = ln;
        this.color = color;
        this.icon = icon;
        this.dx = dx;
        this.dy = dy;
        this.trs_x = trs_x;
        this.trs_y = trs_y;
    }

    module.exports = Station;
});