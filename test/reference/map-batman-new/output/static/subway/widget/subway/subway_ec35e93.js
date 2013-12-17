define('subway:widget/subway/subway.js', function(require, exports, module){

/**
 * @file 地铁专题图画布
 * @author <shengxuanwei@baidu.com>
 */

var url = require("common:widget/url/url.js"),
    appresize = require('common:widget/appresize/appresize.js'),
    Hammer = require('subway:static/js/libs/hammer.js'),
    model = require('subway:static/js/model/subway.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = $.extend({}, {

    subway: null, // 地铁专题数据

    renderer: null, // canvas或者svg渲染引擎

    init: function(data) {
        appresize.update();

        // 计算画布应占高度以占满整屏
        var $parent = this.$parent = $("#main");
        var maxHeight = $parent.height();
        $parent.children().each(function() {
            maxHeight -= $(this).height();
        });

        this.$el = $('#subway-holder');
        this.$el.css({
            'height': maxHeight,
            'visibility': 'hidden' // 提前显示DOM元素，否则fitSVG位置计算不正确
        }).show();

        this.params = url.get();

        // 相同城市重复进入，不重复渲染
        // if (data && this.subway && data.cityCode === this.subway.cityCode) {
            // this.initHammer();
            // this.initCenterLocation();
            // return;
        // }

        this.initHammer();
        this.render(data);
        this.bind();

        this.initCenterLocation();
    },

    render: function(data) {
        this.subway = data;

        var renderer = this.renderer = this._getRenderer();
        renderer.initialize(this.$el, data);

        if (model.onresourceload) {
            renderer.plot();
        } else {
            listener.once('subway', 'onresourceload', function (evt) {
                renderer.plot();
            });
        }
    },

    // 加载专题图渲染引擎
    _getRenderer: function() {
        var Renderer,
            params = this.params;

        // 增加url强制渲染器后门参数renderer
        if (params && params.pageState && params.pageState.force === 'canvas') {
            Renderer = require('subway:static/js/renderer/canvas.js');
            return new Renderer();
        }

        if (this._isSupportSVG()) {
            Renderer = require('subway:static/js/renderer/svg.js');
        } else {
            Renderer = require('subway:static/js/renderer/canvas.js');
        }
        return new Renderer();
    },

    // 特性检测浏览器是否支持SVG
    _isSupportSVG: function() {
        return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
    },

    // 利用hammer.js库绑定用户触屏事件
    initHammer: function() {
        var self = this,
            container = this.$el.get(0);

        if (this.hammer) {
            this.hammer.off("transformstart transform transformend dragstart drag dragend tap");
            this.renderer.locked = false;
            // this.hammer.enable(true);
            // return;
        }

        var hammer = this.hammer = new Hammer(container, {
            prevent_default: true,
            drag: true,
            drag_block_vertical: true,
            drag_block_horizontal: true,
            drag_min_distance: 10,

            transform: true,
            transform_always_block: true,
            tap: true
        });

        var transform_scale;
        hammer.on('transformstart', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            renderer.locked = true;
        });

        hammer.on('transform', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            evt.gesture && evt.gesture.preventDefault();
            transform_scale = renderer.scaleRatio * evt.gesture.scale;
            renderer._setCSSTransform(0, 0, evt.gesture.scale);
        });

        hammer.on('transformend', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            renderer.locked = false;
            evt.gesture && evt.gesture.preventDefault();
            evt.gesture.stopDetect();
            renderer._clearCSSTransform();
            var center = renderer.getPointFromPixel(new Coords(renderer.deviceWidth / 2, renderer.deviceHeight / 2));
            renderer.zoom(center.x, center.y, transform_scale);

            if (self.popupWindow) {
                var pixel = renderer.getPixelFromPoint(self.popupWindow.getPoint());
                self.popupWindow.setPosition(pixel.x, pixel.y);
            }

            self.trigger('transformend');
        });

        var orig_x, orig_y;
        hammer.on('dragstart', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            if (renderer.locked) return;
            evt.gesture && evt.gesture.preventDefault();

            origin = renderer.getOriginPoint(); // 获取Canvas绘制起始点Unit
            orig_x = origin.x;
            orig_y = origin.y;
        });

        hammer.on('drag', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            if (renderer.locked) return;
            evt.gesture && evt.gesture.preventDefault();

            renderer.move(evt.gesture.deltaX, evt.gesture.deltaY);
        });

        hammer.on('dragend', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            if (renderer.locked) return;
            evt.gesture && evt.gesture.preventDefault();

            if (orig_x == null || orig_y == null) {
                renderer._clearCSSTransform();
                return;
            }

            // 限制移动边界, 如果超出边界，重置delta值
            var position = renderer.isOutOfBounds(orig_x, orig_y, evt.gesture.deltaX, evt.gesture.deltaY);
            if (position) {
                evt.gesture.deltaX = position.delta_x;
                evt.gesture.deltaY = position.delta_y;
            }

            var dest_x = orig_x + renderer.getPointUnitFromPixelValue(evt.gesture.deltaX);
            var dest_y = orig_y + renderer.getPointUnitFromPixelValue(evt.gesture.deltaY);

            // 以下两步CSS操作渲染较快，延时较少
            self.popupWindow && self.popupWindow.move(evt.gesture.deltaX, evt.gesture.deltaY);

            // FIXME 中间存在视差，clearCSSTransform之后canvas将回到原位，但此时还没有重新绘制
            renderer.moveTo(dest_x, dest_y);

            orig_x = null;
            orig_y = null;
        });

        hammer.on('tap', function(evt) {
            var subway = self.subway,
                renderer = self.renderer;

            evt.gesture && evt.gesture.preventDefault();

            // 如果view的click事件触发，不再触发tap事件
            if (evt.target && (evt.target.handled || $(evt.target).parents('#sw_pw').size() > 0)) return;

            if (evt.gesture && evt.gesture.touches.length === 1) {
                var clientRect = container.getBoundingClientRect(), // 百度浏览器bug，检测svg标签的getBoundingClientRect时，返回left不是0... 故选择container计算相对位移
                    touch = evt.gesture.touches[0],
                    pixel = new Coords(touch.clientX - clientRect.left, touch.clientY - clientRect.top); // 相对于renderer的屏幕像素偏移值

                self.hidePopupWindow();

                // 计算查找站点，返回坐标点Point
                var point = renderer.getPointFromPixel(pixel);
                var station = subway.findNearestStation(point, 'pixel', renderer.tolerance || 16);

                if (station && station.uid) {
                    // 地铁站点点击量
                    stat.addStat(STAT_CODE.SUBWAY_STATION_MARKER_CLICK);

                    // 注意需要replace:true，否则不支持pushState会后退空白页
                    url.update({
                        query: {station_uid: station.uid}
                    }, {
                        replace: true,
                        trigger: false
                    });

                    self.popupStationWindow(station, {
                        zoomToNormal: false,
                        isNotification: false
                    });
                }
            }
        });
    },

    bind: function() {
        listener.on('subway', 'swZoomIn', this.zoomIn, this);
        listener.on('subway', 'swZoomOut', this.zoomOut, this);

        listener.on('common', 'sizechange', this.onSizeChange, this);
    },

    // 放大图区，并同步处理弹框
    zoomIn: function() {
        var renderer = this.renderer,
            popupWindow = this.popupWindow,
            pixel;

        if (!renderer.isMaxScale()) {
            renderer.zoomIn();

            if (popupWindow) {
                pixel = renderer.getPixelFromPoint(popupWindow.getPoint());
                popupWindow.setPosition(pixel.x, pixel.y);
            }
        }

        listener.trigger('subway', 'swZoomEnd', {
            isMinScale: renderer.isMinScale(),
            isMaxScale: renderer.isMaxScale()
        });
    },

    // 缩小图区，并同步处理弹框
    zoomOut: function() {
        var renderer = this.renderer,
            popupWindow = this.popupWindow,
            pixel;

        if (!renderer.isMinScale()) {
            renderer.zoomOut();

            if (popupWindow) {
                pixel = renderer.getPixelFromPoint(popupWindow.getPoint());
                popupWindow.setPosition(pixel.x, pixel.y);
            }
        }

        listener.trigger('subway', 'swZoomEnd', {
            isMinScale: renderer.isMinScale(),
            isMaxScale: renderer.isMaxScale()
        });
    },

    isMaxScale: function() {
        if (this.renderer) {
            return this.renderer.isMaxScale();
        } else {
            return false;
        }
    },

    isMinScale: function() {
        if (this.renderer) {
            return this.renderer.isMinScale();
        } else {
            return false;
        }
    },

    // 根据query或定位信息设定初始化的位置
    initCenterLocation: function() {
        var self = this;
        var params = this.params;

        // 落地页加载时有可能没有定位，绑定定位事件
        if (params && params.query && params.query.station_uid) {
            this.popupStationWindow({
                uid: params.query.station_uid
            }, {
                zoomToNormal: true,
                isNotification: false,
                successCallback: function() {
                    self.$el.css({'visibility': ''});
                }
            });
        } else if (params && params.query && params.query.line_uid) {
            // 兼容线路详情进入地铁专题图
        } else {
            var loc = require('common:widget/geolocation/location.js');
            if (loc.hasExactPoi()) {
                // 判断定位点和地铁所在城市是否一致
                if (this.subway.cityCode == loc.getCityCode()) {
                    this.onGeoSuccess({
                        point: loc.getCenterPoi()
                    });
                }
            } else {
                // listener.once('geolocation.success', $.proxy(this.onGeoSuccess, this));
            }
        }

        self.$el.css({'visibility': ''});
    },

    onGeoSuccess: function(data) {
        var self = this;
        if (!data) return;

        var station = this.subway.findNearestStation(data.point, 'point', 1000000);
        this.popupStationWindow(station, {
            zoomToNormal: true,
            isNotification: true,
            successCallback: function() {
                self.$el.css({'visibility': ''});
            }
        });
    },

    onSizeChange: function(evt, args) {
        var renderer = this.renderer,
            popupWindow = this.popupWindow;

        var width = args ? args.width : window.innerWidth,
            height = args ? args.height : window.innerHeight,
            wrapperHeight = height - $('.common-widget-nav').height();

        // 设置地图区域的高度
        $('#subway-holder').css('height', wrapperHeight + 'px');

        if (renderer) {
            renderer.resize(width, height);
        }

        if (popupWindow) {
            var pixel = renderer.getPixelFromPoint(popupWindow.getPoint());
            popupWindow.setPosition(pixel.x, pixel.y);
        }
        
    },

    /**
     * 聚焦站点，取消了线路高亮功能
     * @param  {object}  station        站点数据
     * @param  {boolean}  zoomToNormal   是否放大到1.0
     * @param  {boolean} isNotification 是否为定位点通知
     */
    popupStationWindow: function(station, options) {
        var self = this;

        if (self.renderer.locked) {
            return;
        }

        if (station) {
            // 异步数据请求
            this.subway.getStationExt('inf', station.uid, $.proxy(function(ext) {
                self.renderer.locked = true;
                if (options.zoomToNormal) {
                    self.renderer.zoom(ext.station.x, ext.station.y, 1.0);
                }

                self.showPopupWindow({
                    notification: options.isNotification,
                    x: ext.station.x,
                    y: ext.station.y,
                    uid: ext.station.uid,
                    lng: ext.points.split(',')[0],
                    lat: ext.points.split(',')[1],
                    station: ext.station,
                    lines: ext.lines
                });

                self.renderer.locked = false;

                if (options.successCallback) {
                    options.successCallback();
                }

           }, self), $.proxy(function(error) {
                if (options.failureCallback) {
                    options.failureCallback();
                }
           }, self));
        }
    },

    // 弹框，平移图区
    showPopupWindow: function(data) {
        var renderer = this.renderer;
        this.popupWindow = this.popupWindow || (require('subway:widget/popupwindow/popupwindow.js'));
        this.popupWindow.init(data); // 加载数据
        this.popupWindow.show({
            x: renderer.deviceWidth / 2,
            y: renderer.deviceHeight / 2
        }, function(offset_x, offset_y) { // 回调函数
            renderer.moveTo(-data.x, -data.y + renderer.getPointUnitFromPixelValue(offset_y)); // 向下平移因pw过高下拉的距离
        });
    },

    // 隐藏弹框
    hidePopupWindow: function() {
        this.popupWindow && this.popupWindow.destroy(); // 每次隐藏时均会销毁DOM和注销事件
    }
});

});