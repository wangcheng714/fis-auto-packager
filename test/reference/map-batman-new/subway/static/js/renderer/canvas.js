var Coords = require('subway:static/js/base/coords.js');

/**
 * $file Canvas渲染器
 */
define('subway:static/js/renderer/canvas.js', function (require, exports, module) {

    function CanvasRenderer() {}

    $.extend(CanvasRenderer.prototype, {

        /**
         * API Method
         * @public
         * 初始化Canvas渲染器
         */
        initialize: function($el, subway) {
            this.$el = $el;

            this.subway = subway;

            this.container = null;

            this.canvas = null;

            this.devicePixelRatio = this.getDevicePixelRatio();

            this.marginRatio = 0.0; // 单边溢出比例，提升用户体验，小幅移动时，边界外绘制

            this.deviceWidth = $("#subway-holder").offset().width;
            this.deviceHeight = $("#subway-holder").offset().height;

            this.canvasWidth = this.deviceWidth * this.devicePixelRatio * (1 + 2 * this.marginRatio);
            this.canvasHeight = this.deviceHeight * this.devicePixelRatio * (1 + 2 * this.marginRatio);

            this.mapWidth = subway.width;
            this.mapHeight = subway.height;

            this.scaleRatio = 1; // means px per canvas unit(px/unit);
            this.maxScaleRatio = 2.4;
            this.minScaleRatio = 0.2 * this.devicePixelRatio;

            this.scaleRate = 1.25;
            this.zoomInRate = this.scaleRate;
            this.zoomOutRate = 1 / this.scaleRate;

            this.orig_x = null; // canvas绘制中心Unit，非像素坐标，如果需要左上角Unit则加上this._toUnit(this.canvasWidth / 2)
            this.orig_y = null;

            this.tolerance = 20; // 为了解决canvas和svg在点击范围上的差异，单独设置

            this._createElement();
        },

        /**
         * 创建Canvas DOM元素
         * @private
         */
        _createElement: function() {
            this.$el.find('#sw_renderer').remove();

            var canvas = this.canvas = document.createElement('canvas');
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            canvas.style.position = 'absolute';
            canvas.style.left = this._toInt(- this.deviceWidth * this.marginRatio) + 'px';
            canvas.style.top = this._toInt(- this.deviceHeight * this.marginRatio) + 'px';
            canvas.style.width = this._toInt(this.deviceWidth * (1 + this.marginRatio * 2)) + 'px';
            canvas.style.height = this._toInt(this.deviceHeight * (1 + this.marginRatio * 2)) + 'px';

            this.container = $('<div id="sw_renderer" style="position: relative; width: 100%; height: 100%" />');

            this.$el.append(this.container.append(canvas));
        },

        /**
         * API Method
         * @public
         * 清空Canvas画布
         */
        clear: function() {
            var canvas = this.canvas;
            if (canvas) {
                var ctx = canvas.getContext('2d');
                ctx.save();
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
        },

        /**
         * API Method
         * @public
         * 绘制画布
         * @param  {int} dest_x    目标坐标X
         * @param  {int} dest_y    目标坐标Y
         * @param  {float} scale_ratio 缩放比例
         */
        plot: function(dest_x, dest_y, scale_ratio) {
            this._fitCanvas();
            this._plotCanvas();
        },

        /**
         * 绘制Canvas画布
         * 首先，按预设坐标平移绘制起始点
         * 然后，按预设比例Scale
         * 最后，调用具体绘制
         * @private
         * @param  {int} dest_x    目标坐标X
         * @param  {int} dest_y    目标坐标Y
         * @param  {float} scale_ratio 缩放比例
         */
        _plotCanvas: function(dest_x, dest_y, scale_ratio) {
            var canvas = this.canvas,
                ctx = canvas.getContext('2d'),
                subway = this.subway;

            // 参数可选
            this.orig_x = (dest_x == undefined ? - this.mapWidth / 2 : dest_x);
            this.orig_y = (dest_y == undefined ? - this.mapHeight / 2 : dest_y);
            scale_ratio = scale_ratio || this.scaleRatio;

            this._plotMap(ctx, subway);
        },

        /**
         * 绘制具体的地图，抽象出固定不变的内容
         * @private
         */
        _plotMap: function(ctx, subway) {
            this.clear();

            ctx.save();
            ctx.translate(0, 0); // unit, not px
            ctx.scale(this.scaleRatio, this.scaleRatio);
            ctx.translate(this.orig_x + this._toUnit(this.canvasWidth / 2), this.orig_y + this._toUnit(this.canvasHeight / 2)); // unit, not px

            var lines = subway.lines;

            for (var i = 0; i < lines.length; i++) {
                this._plotLine(ctx, lines[i]);
            }

            for (var j = 0; j < lines.length; j++) {
                this._plotLineStations(ctx, lines[j]);
            }

            ctx.restore();
        },

        _plotLine: function(ctx, line) {
            ctx.beginPath();
            ctx.fillStyle = line.lc;
            ctx.font = "bold 16px 微软雅黑";
            ctx.fillText(line.lb, line.lbx, line.lby);

            for (var j = 0; j < line.stations.length; j++) {
                var station = line.stations[j];

                var x = station.x,
                    y = station.y,
                    rc = station.rc;

                ctx.lineWidth = 8;
                ctx.strokeStyle = line.lc;

                if (rc) { // 圆角
                    var stP = line.stations[j - 1];
                    var stN = line.stations[j + 1];
                    var pxP = stP.x;
                    var pxN = stN.x;
                    var pyP = stP.y;
                    var pyN = stN.y;
                    var cx = 2 * x - (pxP + pxN) / 2;
                    var cy = 2 * y - (pyP + pyN) / 2;
                    ctx.quadraticCurveTo(cx, cy, pxN, pyN);
                } else { // 直线
                    ctx.lineTo(x, y);
                }

                if (line.loop) {
                    if (j == (line.stations.length - 1)) {
                        var pxS = line.stations[0].x;
                        var pyS = line.stations[0].y;
                        ctx.lineTo(pxS, pyS);
                    }
                }
            }

            ctx.stroke();
        },

        _plotLineStations: function(ctx, line) {
            for(var j = 0; j < line.stations.length; j++) {
                this._plotStation(ctx, line.stations[j]);
            }
        },

        _plotStation: function(ctx, station) {
            if (station.iu) { // 数据服务端就控制了iu站点的数量，避免了重复；
                if (station.icon) { // 绘制自定义图标站点，机场站点；
                    var icon_xy = station.icon.split(",");
                    ctx.drawImage(this.subway.imageData.airport, station.x + this._toInt(icon_xy[1]), station.y + this._toInt(icon_xy[2]), 32, 32);
                }

                if (station.ex) { // 绘制中转站；
                    ctx.drawImage(this.subway.imageData.transfer, station.x + station.trs_x, station.y + station.trs_y, 20, 20);
                } else { // 绘制站点符号；
                    ctx.beginPath();
                    ctx.arc(station.x, station.y, 6.5, 0, 2 * Math.PI, false);
                    ctx.strokeStyle = station.lc;
                    ctx.lineWidth = 2.5;
                    ctx.fillStyle = "white";
                    ctx.fill();
                    ctx.stroke();
                }

                // 绘制站点名称；
                ctx.fillStyle = "black";
                ctx.font = "normal 16px 微软雅黑";
                ctx.fillText(station.lb, station.x + station.rx, station.y + station.ry);
            }
        },

        /**
         * API Method
         * 放大地图
         * @public
         */
        zoomIn: function() {
            this.scaleRatio *= this.zoomInRate;
            this._plotCanvas(this.orig_x, this.orig_y);
        },

        /**
         * API Method
         * 缩小地图
         * @public
         */
        zoomOut: function() {
            this.scaleRatio *= this.zoomOutRate;
            this._plotCanvas(this.orig_x, this.orig_y);
        },


        /**
         * API Method
         * 放大或缩小地图
         * @param  {int} center_px 
         * @param  {int} center_py 
         * @param  {float} scale_ratio 缩放比例
         */
        zoom: function(center_px, center_py, scale_ratio) {
            scale_ratio = Math.max(Math.min(scale_ratio, this.maxScaleRatio), this.minScaleRatio);
            
            this.scaleRatio = scale_ratio;
            this._plotCanvas(this.orig_x, this.orig_y);
        },

        /**
         * API Method
         * 获取绘制起始点Canvas坐标
         * @public
         */
        getOriginPoint: function() {
            return new Coords(this.orig_x, this.orig_y);
        },

        /**
         * API Method
         * @return {int} 将devicePixelRatio转化成样式比例，取值1或者2
         */
        getDevicePixelRatio: function() {
            return window.devicePixelRatio && window.devicePixelRatio > 1.0 ? 2 : 1;
        },

        /**
         * API Method
         * 平移地图, origin:左上角坐标点
         * @public
         * @param  {int} delta_x X坐标偏移量
         * @param  {int} delta_y Y坐标偏移量
         */
        moveTo: function(dest_x, dest_y) {
            this._clearCSSTransform();
            this._plotCanvas(dest_x, dest_y, this.scaleRatio);
        },

        move: function(delta_x, delta_y) {
            this._setCSSTransform(delta_x, delta_y);
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

            // 重设Canvas尺寸
            this.canvas.width = this.canvasWidth = this.deviceWidth * this.devicePixelRatio * (1 + 2 * this.marginRatio);
            this.canvas.height = this.canvasHeight = this.deviceHeight * this.devicePixelRatio * (1 + 2 * this.marginRatio);

            this.canvas.style.width = this._toInt(this.deviceWidth * (1 + this.marginRatio * 2)) + 'px';
            this.canvas.style.height = this._toInt(this.deviceHeight * (1 + this.marginRatio * 2)) + 'px';

            this.zoom(center.x, center.y, scale_ratio);
        },

        /**
         * 适配画布尺寸
         * 保证通过首页进入地铁图，未定位的情况下绘制全城范围
         */
        _fitCanvas: function() {
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

            this.scaleRatio = curScale;
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
            return this._toUnit(value * this.devicePixelRatio);
        },

        getPixelValueFromPointUnit: function(value) {
            return this._toPixel(value) / this.devicePixelRatio;
        },

        /**
         * API Method
         * 将相对于Canvas的屏幕像素坐标转换成地图坐标
         * @puble
         * @param  {Coord} pixel 屏幕像素坐标
         * @return {Coord}       地图坐标
         */
        getPointFromPixel: function(pixel) {
            var pixel_x = pixel.x * this.devicePixelRatio,
                pixel_y = pixel.y * this.devicePixelRatio;

            if (pixel_x < 0 || pixel_y < 0 ||
                pixel_x > this.mapWidth || pixel_y > this.mapHeight) return;

            // 1，根据屏幕点击坐标，计算canvas左上角坐标
            // 2，根据canvas左上角坐标，计算左上角点所处的canvas单位unit（像素点到canvas单位的转换）
            // 3，根据左上角所处的canvas单位unit，计算相对于屏幕坐标系原点的坐标unit（还原canvas变换）
            var point_x = this._toInt(this._toUnit(pixel_x - this.canvasWidth / 2) - this.orig_x),
                point_y = this._toInt(this._toUnit(pixel_y - this.canvasHeight / 2) - this.orig_y);

            return new Coords(point_x, point_y);
        },

        getPixelFromPoint: function(point) {
            var point_x = point.x + this.orig_x,
                point_y = point.y + this.orig_y;

            var pixel_x = (this._toPixel(point_x) + this.canvasWidth / 2 / (1 + 2 * this.marginRatio)) / this.devicePixelRatio,
                pixel_y = (this._toPixel(point_y) + this.canvasHeight / 2 / (1 + 2 * this.marginRatio)) / this.devicePixelRatio;

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
         * 将像素值转换到Canvas单位
         * 用于Canvas变换或绘制
         * @private
         * @param  {int} pixel pixel
         * @return {int}      canvas unit
         */
        _toUnit: function(pixel) {
            return pixel / this.scaleRatio; // scaleRatio: px/unit
        },

        /**
         * 将Canvas单位转换到像素值
         * @private
         * @param  {int}      canvas unit
         * @return {int} pixel pixel
         */
        _toPixel: function(unit) {
            return unit * this.scaleRatio; // scaleRatio: px/unit
        }

    });

    module.exports = CanvasRenderer;
});