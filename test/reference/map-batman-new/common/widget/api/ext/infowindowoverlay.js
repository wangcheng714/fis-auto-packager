/**
 * @fileoverview 拆分不同业务逻辑的不同样式弹窗，这里保持单例和一致性接口
 * shengxuanwei@baidu.com
 * 2013-11-04
 */
var BMap = require('common:widget/api/api.js'),
    pageMgr = require('common:widget/pagemgr/pagemgr.js');

function InfoWindowOverlay() {

    /**
     * 当前显示的结果类型
     * 0,普通检索
     * 1,泛需求
     * 2,公交线路
     * 3,周边查询中心点
     * 4,公交
     * 5,驾车
     * 6,步行
     * 7,共享位置点
     * 11,底图可点
     * @type {Number}
     */
    this.type = 0;

    /**
     * Overlay对应的坐标点
     * @type {BMap.Point}
     */
    this.point = null;

    /**
     * 内容数据，根据type分类保存
     * @type {Object}
     */
    this.json = {};

    /**
     * 坐标数据，根据type分类保存
     * 跟内容数据分离，无奈之举，很不好
     * @type {Object}
     */
    this.points = {};

    /**
     * 当前城市code
     * @type {Number}
     */
    this.cityCode = null;

    /**
     * 当前显示的气泡的索引值
     * @type {Number}
     */
    this.index = -1;

    /**
     * 默认X坐标偏移值
     * @type {Number}
     */
    this.offsetX = 0;

    /**
     * 默认Y坐标偏移值
     * @type {Number}
     */
    this.offsetY = 0;

    /**
     * 是否可见
     * @type {Boolean}
     */
    this.visible = false;
}

InfoWindowOverlay.prototype = new BMap.Overlay();

$.extend(InfoWindowOverlay.prototype, {

    /**
     * BMap.Overlay初始化方法
     * @param  {BMap} map  map实例
     * @param  {Object} opts 配置参数
     */
    initialize: function (map, opts) {
        this._map = map;

        var container = this.container = this._createContainer(opts);

        this.create(opts);

        map.getPanes().floatPane.appendChild(container);

        // 设置Overlay父容器的z-index值
        $(container).parent().css({
            'z-index': 800
        });

        this._bindEvent();
    },

    /**
     * 创建公共容器DOM元素
     * @private
     */
    _createContainer: function() {
        return $("<ul />", {
            class: "iw-ct"
        }).get(0);
    },

    /**
     * 创建内容区域DOM元素
     * li元素必须包含'data-iw-id'属性，用于点击事件确定id，只有一个li元素可不写
     * 子类可重写
     * @abstract
     * @param  {Object} opts 配置参数
     */
    create: function (opts) {
        return $(this.container).append($("<li />", {
            'class': 'iw-l',
            'css': {
                'display': ''
            },
            'data-iw-id': 'iw-l'
        })).append($("<li />", {
            'class': 'iw-c',
            'data-iw-id': 'iw-c'
        })).append($("<li />", {
            'class': 'iw-r',
            'css': {
                'display': ''
            },
            'data-iw-id': 'iw-r'
        }));
    },

    /**
     * 绑定事件
     * 采用事件代理方式
     */
    _bindEvent: function () {
        var me = this,
            $li = $(this.container).find('li');

        var eventName = pageMgr.isSinglePageApp() ? 'click' : 'tap';
        $li.on(eventName, function (evt) {
            if (me.visible) {
                listener.trigger('infowindow.' + me.type, 'click', {
                    id: $(evt.target).data('iw-id') || $(evt.target).parents('[data-iw-id]').data('iw-id'),
                    data: me.getData(me.type, me.index),
                    instance: me
                });
            }
        });

        // 阻止icon的事件冒泡，否则底图会因为touchend被阻止出bug
        $li.on("touchstart", function (evt) {
            // 多指放大缩小时需要阻止冒泡，但是需要在fastclick里被监听，故仅对多指操作进行阻止
            if (evt.touches && evt.touches.length > 1) {
                evt.cancelBubble = true;
            } else {
                // 这里设置了标识符，表明事件由iwCon处理，避免package.js里spotClickMD方法里造成麻点图击穿问题；
                // 这里另外增加map.js里对图区map绑定了click事件，需要判断handled状态；
                me.handled = true;
            }
        });
    },

    /**
     * 设置type和数据，这里的data可扩展
     * 考虑到列表数据重用，这里与show方法分开
     * @public
     * @param {Number} type 类型标识
     * @param {Object} data 数据
     */
    setData: function(type, data) {
        this.type = type;

        if (data['json']) {
            this.json[type] = data['json'];
        }

        if (data['points']) {
            this.points[type] = data['points'];
        }

        if (data['cityCode']) {
            this.cityCode = data['cityCode'];
        }

        return this;
    },

    /**
     * @public
     * @param {Number} type 类型标识
     * @param {Number} data 数据索引
     */
    getData: function(type, index) {
        var data = this.json[type];
        if (!data) return;

        if (index > -1 && data[index] !== undefined) {
            return data[index];
        }

        return data;
    },

    /**
     * 隐藏控件
     * @abstract
     */
    hide: function () {
        $(this.container).hide();
        this.visible = false;
    },

    /**
     * 显示控件
     * @abstract
     */
    show: function () {
        // 这里这么处理是为了draw方法计算宽度
        $(this.container).css({'visibility': 'hidden'}).show();
        this.html().draw();
        $(this.container).css({'visibility': ''});
        this.visible = true;

        var self = this;
        if (this.timer) {
            return;
        }
        this.timer = setTimeout(function () {
            self.setPosition();
            clearTimeout(self.timer);
            self.timer = null;
        }, 100);
    },

    /**
     * 重设iw_c弹窗中间内容
     * 子类可重写
     * @abstract
     */
    html: function(content) {
        var $ct = $(this.container),
            $iw_c = $ct.find('.iw-c');

        // 这里直接用this.content封装变化
        $iw_c.html(content || this.content);

        this.width = $ct.width();
        this.height = $ct.height();

        return this;
    },

    /**
     * 重设父元素绝对定位
     * API规定接口
     */
    draw: function () {
        var $ct = $(this.container),
            ARROW_OFFSET_Y = 8,
            offsetX = this.width / 2 + (this.offsetX || 0),
            offsetY = this.height + ARROW_OFFSET_Y + (this.offsetY || 0);

        if (this.point) {
            var pixel = this._map.pointToOverlayPixel(this.point);
            var x = pixel.x - offsetX;
            var y = pixel.y - offsetY;

            $ct.css({
                'left': x + 'px',
                'top': y + 'px'
            });
        }
    },

    /**
     * 设置infowin的位置，确保能够看见
     */
    setPosition: function () {
        if (!this.point) {
            return;
        }

        var map = this._map,
            point = this.point,
            pixel = map.pointToPixel(point);

        var offset = new BMap.Pixel(0, 0),
            mapSize = map.getSize(),
            offsetX = this.width / 2 + 16,
            offsetY = this.height / 2 + 78;
       
        // 获取x方向偏移
        if (pixel.x < offsetX) {
            offset.x = offsetX - pixel.x;
        } else if (mapSize.width - pixel.x - 8 < offsetX) {
            offset.x = mapSize.width - pixel.x - 8 - offsetX;
        }

        // 获取y方向偏移
        if (pixel.y < offsetY) {
            offset.y = offsetY - pixel.y;
        } else if (mapSize.height - pixel.y < 60) {
            offset.y = mapSize.height - pixel.y - 60;
        }
        
        map.panBy(offset.x, offset.y);
        // panBy是动画，在第一次加载的时候会出现marker坐标位置不正确的情况
        // 这里450毫秒之后重新设置地图状态，以便让marker重绘，450毫秒是panBy的动画时间
        setTimeout(function(){
            map.centerAndZoom(map.getCenter(), map.getZoom());
        }, 450);
    }
});

InfoWindowOverlay._className_ = 'InfoWindowOverlay';

module.exports = InfoWindowOverlay;