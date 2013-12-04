var Coords = require('subway:static/js/base/coords.js'),
    SVG = require('subway:static/js/libs/svg.js');

/**
 * SVG渲染器
 */
define('subway:static/js/renderer/svg.js', function (require, exports, module) {
    function SVGRenderer() {}

    SVGRenderer.supported = SVG.supported;

    $.extend(SVGRenderer.prototype, {

        /**
         * API Method
         * @public
         * 初始化Canvas渲染器
         */
        initialize: function($el, subway) {
            this.$el = $el;

            this.subway = subway;

            this.container = null;

            this.svg = null;

            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            this.mapWidth = subway.width;
            this.mapHeight = subway.height;

            this.scaleRatio = 1; // means px per canvas unit(px/unit);
            this.maxScaleRatio = 2.0;
            this.minScaleRatio = 0.2;

            this.scaleRate = 1.25;
            this.zoomInRate = this.scaleRate;
            this.zoomOutRate = 1 / this.scaleRate;

            this.orig_x = null; // canvas绘制中心Unit，非像素坐标，如果需要左上角Unit则加上this._toUnit(this.canvasWidth / 2)
            this.orig_y = null;

            this.tolerance = 16;

            this._createElement();
        },

        /**
         * 创建Canvas DOM元素
         * @private
         */
        _createElement: function() {
            this.$el.find('#sw_renderer').remove();

            var svg = $('<svg id="sw_svg" stlye="position: absolute" />').get(0);

            this.container = $('<div id="sw_renderer" style="position: relative; width: 100%; height: 100%" />');

            this.$el.append(this.container.append(svg));

            this.svg = SVG('sw_svg').size(this.mapWidth, this.mapHeight);

            this.context = this.svg.group();

            window.svg2 = this;
            window.context = this.context;
        },


        /**
         * API Method
         * @public
         * 清空SVG画布
         */
        clear: function() {
            var ctx = this.context;
            ctx.clear();
        },

        /**
         * API Method
         * @public
         * 绘制SVG画布
         */
        plot: function() {
            this.clear();
            this._plotSVG();
            this._fitSVG();
        },

        _plotSVG: function(dest_x, dest_y, scale_ratio) {
            var ctx = this.context,
                subway = this.subway;

            this.orig_x = (dest_x == undefined ? 0 : dest_x);
            this.orig_y = (dest_y == undefined ? 0 : dest_y);
            scale_ratio = scale_ratio || this.scaleRatio;

            this._plotMap(ctx, subway);
        },

        _plotMap: function(ctx, subway) {
            var lines = subway.lines;

            // 撑起尺寸
            ctx.rect(this.mapWidth, this.mapHeight).attr({
                'fill': 'none'
            });

            for(var i = 0; i < lines.length; i++) {
                var line = lines[i];
                this._plotLine(ctx, subway, line);
            }

            for(var j = 0; j < lines.length; j++) {
                var line = lines[j];
                for(var k = 0; k < line.stations.length; k++) {
                    var station = line.stations[k];
                    this._plotStation(ctx, subway, station);
                }
            }
        },

        _plotLine: function(ctx, subway, line) {

            // 绘制线路名称；
            ctx.text(line.lb).font({
                size: 16,
                weight: 'bold'
            }).fill({
                color: line.lc
            }).move(line.lbx, line.lby - 16);

            // 绘制线路时不同于Canvas，需要一次成型绘制
            var path = ["M"];
            for (var j = 0; j < line.stations.length; j++) {
                var station = line.stations[j];

                var x = station.x,
                    y = station.y,
                    rc = station.rc;

                if (rc) { //圆角
                    var stP = line.stations[j - 1];
                    var stN = line.stations[j + 1];
                    var pxP = stP.x;
                    var pxN = stN.x;
                    var pyP = stP.y;
                    var pyN = stN.y;
                    var cx = 2 * x - (pxP + pxN) / 2;
                    var cy = 2 * y - (pyP + pyN) / 2;

                    if (j > 0) path.push("Q");
                    path.push([cx, cy, pxN, pyN].join(","));
                } else { //直线
                    if (j > 0) path.push("L");
                    path.push((x).toFixed(2) + "," + (y).toFixed(2));
                }
            }

            if (line.loop) path.push("Z");
            ctx.path(path.join(""), true).attr({
                'fill': 'none',
                'stroke': line.lc,
                'stroke-width': 8
            });
        },

        _plotStation: function(ctx, subway, station) {
            if (station.iu) { // 数据服务端就控制了iu站点的数量，避免了重复；
                if (station.icon) { // 绘制自定义图标站点，机场站点；
                    var icon_xy = station.icon.split(",");
                    ctx.image(subway.imageDataEncoded.airport, 32, 32).move(station.x + this._toInt(icon_xy[1]), station.y + this._toInt(icon_xy[2]));
                }

                if (station.ex) { // 绘制中转站；
                    ctx.image(subway.imageDataEncoded.transfer, 20, 20).move(station.x + station.trs_x, station.y + station.trs_y);
                } else { // 绘制站点符号；
                    ctx.circle(13).fill({
                        color: "white"
                    }).stroke({
                        color: station.lc,
                        width: 2.5
                    }).move(station.x - 6.5, station.y - 6.5);
                }

                // 绘制站点名称；
                ctx.text(station.lb).font({
                    size: 16,
                    weight: 'normal'
                }).fill({
                    color: "#000"
                }).move(station.x + station.rx, station.y + station.ry - 16);
            }
        },

        /**
         * API Method
         * 放大地图
         * @public
         */
        zoomIn: function(pixel_x, pixel_y) {
            pixel_x = pixel_x || this.deviceWidth / 2;
            pixel_y = pixel_y || this.deviceHeight / 2;

            var center = this.getPointFromPixel(new Coords(pixel_x, pixel_y));
            this.zoom(center.x, center.y, this.scaleRatio * this.zoomInRate);
        },

        /**
         * API Method
         * 缩小地图
         * @public
         */
        zoomOut: function(pixel_x, pixel_y) {
            pixel_x = pixel_x || this.deviceWidth / 2;
            pixel_y = pixel_y || this.deviceHeight / 2;

            var center = this.getPointFromPixel(new Coords(pixel_x, pixel_y));
            this.zoom(center.x, center.y, this.scaleRatio * this.zoomOutRate);
        },

        /**
         * API Method
         * 放大或缩小地图
         * @param  {int} center_px 
         * @param  {int} center_py 
         * @param  {float} scale_ratio 缩放比例
         */
        zoom: function(center_px, center_py, scale_ratio) {
            var ctx = this.context;

            scale_ratio = Math.max(Math.min(scale_ratio, this.maxScaleRatio), this.minScaleRatio);

            ctx.scale(scale_ratio, scale_ratio);
            this.scaleRatio = scale_ratio;

            this.center(center_px, center_py);
        },

        /**
         * 平移指定的数据中心点到屏幕中心点
         * @param  {int} point_x 
         * @param  {int} point_y 
         */
        center: function(point_x, point_y) {
            var ctx = this.context;

            ctx.move(this._toPixel(-point_x) + this.deviceWidth / 2, this._toPixel(-point_y) + this.deviceHeight / 2);

            this.orig_x = ctx.x();
            this.orig_y = ctx.y();
        },

        /**
         * API Method
         * 获取绘制起始点Canvas坐标
         * @public
         */
        getOriginPoint: function() {
            return new Coords(this._toUnit(this.orig_x - this.deviceWidth / 2), this._toUnit(this.orig_y - this.deviceHeight / 2));
        },

        /**
         * API Method
         * 平移地图，SVG采用原生move方法效率低下，故采用与Canvas类似的transform方式
         * @public
         * @param  {int} delta_x 移动像素值
         * @param  {int} delta_y 移动像素值
         */
        move: function(delta_x, delta_y) {
            var ctx = this.context;
            var dest_x = this.orig_x + delta_x,
                dest_y = this.orig_y + delta_y;

            this._setCSSTransform(delta_x, delta_y, 1.0);
        },

        /**
         * API Method
         * 平移地图, origin:左上角坐标点
         * @public
         * @param  {int} dest_x X坐标偏移量
         * @param  {int} dest_y Y坐标偏移量
         */
        moveTo: function(dest_x, dest_y) {
            var ctx = this.context;

            dest_x = this._toPixel(dest_x) + this.deviceWidth / 2;
            dest_y = this._toPixel(dest_y) + this.deviceHeight / 2;

            ctx.move(dest_x, dest_y);

            this.orig_x = dest_x;
            this.orig_y = dest_y;

            this._clearCSSTransform();
        },

        /**
         * 检测是否已超出边界
         * @param  {int} orig_x  移动初始位置
         * @param  {int} orig_y  
         * @param  {int} delta_x 移动偏移值
         * @param  {int} delta_y 
         * @return {boolean|object} 如果超出边界返回重设位置，否则返回false
         */
        isOutOfBounds: function(orig_x, orig_y, delta_x, delta_y) {
            var dest_x = orig_x + this.getPointUnitFromPixelValue(delta_x),
                dest_y = orig_y + this.getPointUnitFromPixelValue(delta_y);

            if (dest_x > 0 || dest_x < -this.mapWidth || dest_y > 0 || dest_y < -this.mapHeight) {
                return {
                    delta_x: this.getPixelValueFromPointUnit((dest_x > 0 ? 0 : dest_x < - this.mapWidth ? - this.mapWidth : dest_x) - orig_x),
                    delta_y: this.getPixelValueFromPointUnit((dest_y > 0 ? 0 : dest_y < - this.mapHeight ? - this.mapHeight: dest_y) - orig_y)
                };
            }

            return false;
        },

        resize: function(width, height) {
            if (!height || height == this.deviceHeight) return;

            var center = this.getPointFromPixel(new Coords(this.deviceWidth / 2, this.deviceHeight / 2)),
                scale_ratio = this.scaleRatio;

            // 重设容器尺寸
            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            // 重新绘制
            this.clear();
            this._plotSVG();

            this.zoom(center.x, center.y, scale_ratio);
        },

        /**
         * 适配画布尺寸
         * 保证通过首页进入地铁图，未定位的情况下绘制全城范围
         */
        _fitSVG: function() {
            var curSize, fitSize;
            var horizonal = this.deviceWidth > this.deviceHeight;

            // 匹配小的设备尺寸；
            if (horizonal) { // 横屏时匹配高度；
                curSize = this.mapHeight;
                fitSize = this.deviceHeight;
            } else { // 竖屏时匹配宽度；
                curSize = this.mapWidth;
                fitSize = this.deviceWidth;
            }

            var fitScale = 1.0,
                curScale = this.scaleRatio,
                tmpScale,
                tmpSize;

            while (curSize > fitSize) {
                tmpScale = curScale * this.zoomOutRate;
                tmpSize = curSize * this.zoomOutRate;

                if (tmpScale < this.minScaleRatio) {
                    break;
                } else {
                    curScale = tmpScale;
                    curSize = tmpSize;
                }
            }

            this.context.scale(curScale, curScale).center(this.deviceWidth / 2, this.deviceHeight / 2);
            this.orig_x = this.context.x();
            this.orig_y = this.context.y();
            this.scaleRatio = curScale;
        },

        /**
         * API Method
         * 平移画布, origin:左上角坐标点
         * @public
         * @param  {int} delta_x X坐标偏移量
         * @param  {int} delta_y Y坐标偏移量
         * @param  {float} scale transform缩放量，不同于scale_ratio
         */
        _setCSSTransform: function(dest_x, dest_y, scale) {
            if (dest_x == undefined || dest_y == undefined) {
                dest_x = this.orig_x || 0;
                dest_y = this.orig_y || 0;
            }

            if (scale == undefined) {
                scale = 1.0;
            }

            var matrix = this._getTransformMatrix(dest_x, dest_y, scale);
            this.container.css({
                'transform': matrix,
                '-webkit-transform': matrix
            });
        },

        /**
         * API Method
         * 画布移回坐标原点
         * @public
         */
        _clearCSSTransform: function() {
            this._setCSSTransform(0, 0, 1.0);
        },

        /**
         * 构建tranform2d样式字符串
         * @private
         * @param  {int} dest_x 平移坐标X
         * @param  {int} dest_y 平移坐标Y
         * @param  {float} scale  缩放比例
         * @return {string}        字符串
         */
        _getTransformMatrix: function(dest_x, dest_y, scale) {
            var matrix = [scale, 0, 0, scale, dest_x, dest_y];
            return 'matrix(' + matrix.join(',') + ')';
        },

        getPointUnitFromPixelValue: function(value) {
            return this._toUnit(value);
        },

        getPixelValueFromPointUnit: function(value) {
            return this._toPixel(value);
        },

        /**
         * API Method
         * 将相对于Canvas的屏幕像素坐标转换成地图坐标
         * @puble
         * @param  {Coord} pixel 屏幕像素坐标
         * @return {Coord}       地图坐标
         */
        getPointFromPixel: function(pixel) {
            var ctx = this.context;
            var pixel_x = pixel.x,
                pixel_y = pixel.y;

            // if (pixel_x < 0 || pixel_y < 0 ||
                // pixel_x > this.mapWidth || pixel_y > this.mapHeight) return;

            var point_x = this._toInt(this._toUnit(pixel_x - ctx.x())),
                point_y = this._toInt(this._toUnit(pixel_y - ctx.y()));

            return new Coords(point_x, point_y);
        },

        getPixelFromPoint: function(point) {
            var ctx = this.context;
            var point_x = point.x,
                point_y = point.y;

            var pixel_x = (this._toPixel(point_x) + ctx.x()),
                pixel_y = (this._toPixel(point_y) + ctx.y());

             return new Coords(pixel_x, pixel_y);
        },

        isMaxScale: function() {
            return this.scaleRatio * this.zoomInRate > this.maxScaleRatio;
        },

        isMinScale: function() {
            return this.scaleRatio * this.zoomOutRate < this.minScaleRatio;
        },

        /**
         * 将浮点数转换成整数
         * @private
         * @param  {float} n 浮点数
         * @return {int}   整数
         */
        _toInt: function(n) {
            return n >> 0;
        },

        /**
         * 将像素值转换到画布单位
         * 用于画布变换或绘制
         * @private
         * @param  {int} pixel pixel
         * @return {int}      canvas unit
         */
        _toUnit: function(pixel) {
            return pixel / this.scaleRatio; // scaleRatio: px/unit
        },

        /**
         * 将画布单位转换到像素值
         * @private
         * @param  {int}      canvas unit
         * @return {int} pixel pixel
         */
        _toPixel: function(unit) {
            return unit * this.scaleRatio; // scaleRatio: px/unit
        }
    });

    module.exports = SVGRenderer;
});