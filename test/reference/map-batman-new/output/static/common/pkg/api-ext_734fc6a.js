define('common:widget/api/ext/circleoverlay.js', function(require, exports, module){

/**
 * 自定义圆形覆盖物
 * @fileoverview 自定义圆形覆盖物，用于显示定位误差范围
 */

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

});
;define('common:widget/api/ext/custommarker.js', function(require, exports, module){

/**
 * 自定义覆盖物实现Marker
 * @fileoverview 自定义覆盖物实现Marker
 * @author jiazheng
 */

var util = require('common:static/js/util.js');

/**
 * 构造函数
 * @param {Icon} 标注使用的图标
 * @param {Point} 标注使用的坐标
 * @param {Object} 可选配置参数
 */
function CustomMarker(icon, point, opts) {
    this._point = point;
    this._icon = icon;
    this._div = null;
    this._container = null;
    this.drawCount = 0;
    this.draggable = false;
    this._config = {
        click: null,
        isAnimation: false
    }
    this.setConfig(opts);
}
CustomMarker.prototype = new BMap.Overlay();
CustomMarker.prototype.setConfig = function (opts) {
    opts = opts || {};
    for (var p in opts) {
        this._config[p] = opts[p];
    }
}
CustomMarker.prototype.initialize = function (map) {
    var me = this;
    me._map = map;
    me._div = me.getDiv();
    var container = me._container = $(me._div);
    container.on("touchend", function (e) {
        if (me._config["notstop"] != undefined) {
            return;
        }
        // 这是在判断什么？？？
        if (!window.dtCon0 || !dtCon0.isOn) {
            if (typeof me._config.click == "function") {
                me._config.click();
            }
        }
        e.stopPropagation();
    });
    container.on("touchstart", function (e) {
        e.stopPropagation();
        e.preventDefault();
        
        me._ontouch(e);
        
        if(me.draggable){
            var handler = function(ev){
                me._map.disableDragging();
                me._ontouch(ev);
            }
            container.on("touchmove", handler);
            container.on("touchend", function (e) {
                me._map.enableDragging();
                me._ontouch(e);
                container.off('touchmove', handler);
            });
        }
    });
    container.on("click", function (e) {
        e.stopPropagation();
    });
    
    
    map.getPanes().labelPane.appendChild(this._div);
    return me._div;
}

CustomMarker.prototype._ontouch = (function(){
    var _pos = {};
   
    var getPos = function(ev){  
        var pos = [],
            src = null;
        
        for(var t=0, len=ev.touches.length; t<len; t++) {
            src = ev.touches[t];
            pos.push({ x: src.pageX, y: src.pageY });
        }
        return pos;
    };
    
    var divPixes = {};
    var px = {};
    var point;
    var interVal = null;
    var arrList = [];
    return function(ev){
        if(!this.draggable)return false;
        
        var me = this;
        ev.preventDefault();
        ev.stopPropagation();
        switch(ev.type){
            case 'touchstart': 
                _pos.start = getPos(ev);
                divPixes = me._map.pointToOverlayPixel(me._point);
                me.dispatchEvent('dragstart');
                break;
            case 'touchmove':
                _pos.move = getPos(ev);
                
                var diffx = _pos.move[0].x - _pos.start[0].x;
                var diffy = _pos.move[0].y - _pos.start[0].y;
                
                
                px.x =  divPixes.x + diffx;
                px.y =  divPixes.y + diffy;
                
                arrList.push(px);
                
                if(!interVal){
                    interVal = setInterval(function(){
                        var dpx = arrList.shift();
                        if(!dpx){
                            clearInterval(interVal);
                            interVal = null;
                            return;
                        }
                        point = me._map.overlayPixelToPoint({x: dpx.x, y: dpx.y});
                        me.setPoint(point);
                        me.dispatchEvent('draging');
                    }, 25);
                }
                break;
            case 'touchend' :
                function te(){
                    if(interVal){
                        setTimeout(te, 30);
                        return;
                    }
                    me._map.centerAndZoom(me._point, me._map.getZoom());
                    me.dispatchEvent('dragend');
                }
                te();
                break;
        }
    }
})();

CustomMarker.prototype.draw = function () {
    var me = this;
    /*if (me._config.isAnimation) {
        if (me.drawCount == 0) {
            var map = me._map;
            var sz = me._icon.anchor;
            var pixel = map.pointToOverlayPixel(me._point);
            me._div.style.left = pixel.x - sz.width / 2 + "px";
            var he = me._map.offsetY < 0 ? 0 : me._map.offsetY;
            me._div.style.top = 0 - he - sz.height + "px";
            setTimeout(function () {
                me._div.style.webkitTransform = "translate3d(0, " + parseInt(pixel.y + he, 10) + "px, 0)";
                me._div.style.top = pixel.y - sz.height + "px";
                me._div.style.webkitTransform = "translate3d(0,0,0)";
            }, 100);
        } else {
            me._draw();
        }
        me.drawCount++;
    } else {*/
    me._draw();
    //}
}
CustomMarker.prototype._draw = function () {
    var me = this;
    var map = me._map;
    var anchor = me._icon.anchor;
    var pixel = map.pointToOverlayPixel(me._point);
    var style = me._div.style;
    style.left = pixel.x - anchor.width + "px";
    style.top = pixel.y - anchor.height + "px";
    // todo: 统一使用获取ua的方法
    if (navigator.userAgent.indexOf('iPhone OS 5_') > -1) {
        style.WebkitBackfaceVisibility = 'hidden';
    }
    if (me._config && me._config["className"] && me._config["className"] != "") {
        me._container.addClass(me._config["className"]);
    }
}

// 更换ICON图片
CustomMarker.prototype.setIcon = function (icon) {
    var ic = this._icon = icon;
    $.extend(this._div.style, {
        position: "absolute",
        height: ic.size.height + "px",
        width: ic.size.width + "px",
        backgroundImage: "url(" + ic.imageUrl + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: (0 - ic.imageOffset.width) + "px " + (0 - ic.imageOffset.height) + "px"
    });
    this.draw();
}
/**
 * 设置元素类名
 */
CustomMarker.prototype.setClassName = function(className){
    this._container.removeClass(this._config["className"]);
    this._config["className"] = className;
    this._container.addClass(this._config["className"]);
}
// 利用icon生成div
CustomMarker.prototype.getDiv = function () {
    var ic = this._icon;
    var div = document.createElement("div");
    $.extend(div.style, {
        position: "absolute",
        height: ic.size.height + "px",
        width: ic.size.width + "px",
        backgroundImage: "url(" + ic.imageUrl + ")",
        backgroundRepeat: "no-repeat",
        zIndex: "200",
        backgroundPosition: (0 - ic.imageOffset.width) + "px " + (0 - ic.imageOffset.height) + "px"
    });
    if (this._config.isAnimation) {
        div.className = "mkr_trans";
    }
    return div;
}
/**
 * 获取覆盖物dom容器
 * @return {HTMLElement} 容器
 */
CustomMarker.prototype.getContainer = function(){
    return this._div;
}
/**
 * 设置Marker的坐标
 * @param {Point} 坐标
 */
CustomMarker.prototype.setPoint = function (point) {
    this._point = point;
    this.draw();
}

/**
 * 设置Marker是否可拖拽
 * @param enabled {boolean} 
 */
CustomMarker.prototype.setDraggingEnabled = function (enabled) {
    this.draggable = !!enabled;
}

/**
 * 修改Marker的zIndex
 * @param {number} 标注的zIndex
 */
CustomMarker.prototype.setZIndex = function (zIndex) {
    this._div.style.zIndex = zIndex;
}

CustomMarker._className_ = 'CustomMarker';

module.exports = CustomMarker;

});
;define('common:widget/api/ext/geocontrol.js', function(require, exports, module){

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    mapView = require('common:widget/map/map.js'),
    locator = ﻿require('common:widget/geolocation/location.js'),
    popup = require('common:widget/popup/popup.js'),
    stat = require('common:widget/stat/stat.js');

//定位信息控件
var GeoInfoBar = function(){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
    this.defaultOffset = new BMap.Size(48, 14);
}
GeoInfoBar.prototype = new BMap.Control();
$.extend(GeoInfoBar.prototype, {
    initialize:function(map){
        this._map = map;
        var container = this._container = document.createElement("div");
        container.className = "map-geo-info";
        $(container).html('<b></b><em></em>');
        
        map.getContainer().appendChild(container);
        this.bind();
        return container;
    },
    bind: function(){
        $(this._container).on('click', function() {
            // 地图定位地址栏的点击量
            stat.addCookieStat(COM_STAT_CODE.MAP_GEO_ADDR_CLICK);

            url.update({
                module: 'index',
                action: 'mylocation',
                pageState: {
                    vt: ''
                }
            }, {
                trigger: true
            });
        })
    },
    text: function(txt){
        $(this._container).find('b').text(txt||'');
    },
    hide: function(){
        mapView.scaleControl && mapView.scaleControl.show();
        BMap.Control.prototype.hide.call(this);
    }
});

//定位控件
function GeoControl(){
    if (util.isIPad()) {
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(16, 64 + 16);
    } else {
        this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
        this.defaultOffset = new BMap.Size(8, 14);
    }
}
GeoControl.prototype = new BMap.Control();
GeoControl.prototype.initialize = function(map){
    this._map = map;
    var container = this._container = document.createElement("div");
    container.className = "map-geo";
    this._geoBtn = document.createElement("div");
    this._geoBtn.innerHTML = '<div class="geo-btn" id="geoState"><b class="index-loc-pic"></b></div>';
    container.appendChild(this._geoBtn);
    map.getContainer().appendChild(container);
    this.bind();
    this._geo = false;
    this.resetGeoBtn();
    
    if(!util.isIPad()){
        this._infoBar = new GeoInfoBar();
        map.addControl(this._infoBar);
        this._infoBar.hide();
    }
    
    return container
};
GeoControl.prototype.bind = function(){
    var map = this._map;
    var me = this;
    //清空按钮事件
    me._geoBtn = $(me._geoBtn.children[0]);
    me._geoBtn.on('click', function(e) {
        // 地图定位的点击量
        stat.addStat(COM_STAT_CODE.MAP_GEO_ICON_CLICK);

        me._geo = true;
        locator.startGeo();
    });

    
    listener.on('common.geolocation', 'success', function(event,data){
        me.resetGeoBtn();
        var curHash = url.get();
        if(
            me._geo == true && 
            !util.isIPad() && 
            curHash.module == 'index' && 
            curHash.action == 'index'
        ){
            me._infoBar.text(locator.getAddress());
            me._infoBar.show();
            mapView.scaleControl && mapView.scaleControl.hide();
        }
    });

    listener.on('common.geolocation', 'fail', function(event, data) {
        if (me._geo == true) {
            me._geo == false;
            popup.open({
                text: '无法获取您的精确定位，请开启浏览器定位功能，刷新页面并选择允许定位。'
            });
        }
        me.resetGeoBtn();
    });

    //gmu.event.on('onswitchpagestart', function(){
        /*
        var curHash = app.getCurrentHash();
        if(curHash.module != 'index' && curHash.action != 'index'){
            me._infoBar && me._infoBar.hide();
        }
        */
    //});

}

GeoControl.prototype.resetGeoBtn = function(){
    var me = this;
    if(locator.hasExactPoi()) {
         me._geoBtn.removeClass('geo-fail');
    } else {
        me._geoBtn.addClass('geo-fail');
    }
}
GeoControl.prototype.hideInfoBar = function(){
    this._infoBar && this._infoBar.hide();
}

GeoControl._className_ = 'GeoControl';

module.exports = GeoControl;

});
;define('common:widget/api/ext/infowindowoverlay.js', function(require, exports, module){

/**
 * @fileoverview 拆分不同业务逻辑的不同样式弹窗，这里保持单例和一致性接口
 * shengxuanwei@baidu.com
 * 2013-11-04
 */
var pageMgr = require('common:widget/pagemgr/pagemgr.js');

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

});
;define('common:widget/api/ext/linestepcontrol.js', function(require, exports, module){

var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    stat = require('common:widget/stat/stat.js');

function LineStepControl(){
    this.defaultOffset = new BMap.Size(0, 0);
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
    this.isOn = false;
}
LineStepControl.prototype = new BMap.Control();
$.extend(LineStepControl.prototype, {
    initialize: function(map){
        this._map = map;
        var box = this._content = document.createElement("div"),
        	arrowTpl = "<b></b>";

        box.className = "line_step";

        var preBtn = document.createElement("div");
        preBtn.className = "step_pre";
        preBtn.innerHTML = arrowTpl;
        box.appendChild(preBtn);

        var nextBtn = document.createElement("div");
        nextBtn.className = "step_next";
        nextBtn.innerHTML = arrowTpl;
        box.appendChild(nextBtn);

        this.container = box;
        this.preBtn = preBtn;
        this.nextBtn = nextBtn;

        map.getContainer().appendChild(box);
        this.bind()
        return box;
    }
    ,bind: function(){
        var me = this;
        $(me.preBtn).on("touchend",function(){
        	me.goPreStop();
        });
        $(me.nextBtn).on("touchend",function(){
        	me.goNextStop();
        });
    }
    ,setIWCon: function(infoWindow) {
        this.iwCon = infoWindow;
    }
    /**
     * 跳转到前一个线路
     */
    ,goPreStop : function(){
        if (this.iwCon && this.iwCon.pre()){
            // 统计点击上一步的点击量
            stat.addStat(COM_STAT_CODE.MAP_LINE_STEP_PRE);
        }
    }
    /**
     * 跳转到后一个线路
     */
    ,goNextStop : function(){
        if (this.iwCon && this.iwCon.next()){
            // 统计点击下一步的点击量
            stat.addStat(COM_STAT_CODE.MAP_LINE_STEP_NEXT);
        }
    }
    ,draw : function(){
        this.container.style.margin = "";
    }

    /**
     * 启用按钮
     * @param {string} type 
     */
    ,ableBtn : function(type){
        if(typeof type !=="string"
            || !(type === "pre" || type === "next")){
            return;
        }
        var btn = type == "pre" ? this.preBtn : this.nextBtn;
        this._able(btn);
    }

    /**
     * 禁用按钮
     */
    ,disableBtn : function(type){
        if(typeof type !=="string"
            || !(type === "pre" || type === "next")){
            return;
        }
        var btn = type == "pre" ? this.preBtn : this.nextBtn;
        this._disable(btn);
    }
    /**
     * 设置按钮可点
     * @param {HTMLElement} ele    
     */
    ,_able : function(ele){
        if(!ele){
            return;
        }
        if($(ele).hasClass("able")) {
            return;
        }
        $(ele).removeClass("disable");
    }
    /**
     * 设置按钮不可点
     * @param {HTMLElement} ele    
     */
    ,_disable : function(ele){
        if(!ele){
            return;
        }
        if($(ele).hasClass("disable")) {
            return;
        }
        $(ele).addClass("disable");
    }
    /**
     * 重新设置控件位置
     */
    ,setPos : function() {
        var l = parseInt( (util.getClientSize().width - this.width)/2, 10);
        this.x = l;
        this.setPosition();
    }
    /**
     * 隐藏控件
     */
    ,hide : function(){
        this.isOn = false;
        //CtrMgr.cc["lineCtrl"].on = false;
        BMap.Control.prototype.hide.call(this);
    }
    /**
     * 显示控件
     */
    ,show : function(){
        this.isOn = true;
        //CtrMgr.cc["lineCtrl"].on = true;
        BMap.Control.prototype.show.call(this);
    }
});

LineStepControl._className_ = 'LineStepControl';

module.exports = LineStepControl;

});
;define('common:widget/api/ext/menucontrol.js', function(require, exports, module){

/**
 * @fileoverview 地图菜单组件
 * @auth lujingfeng@baidu.com
 */
var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    cookie = require('common:widget/cookie/cookie.js'),
    login = require('common:widget/login/login.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    stat = require('common:widget/stat/stat.js');

var MenuDrop = function(menuBtn){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    // 检测是否为iPad版本
    
    var offset = new BMap.Size(53, 38);
    if (util.isIPad()) {
        offset = new BMap.Size(16, 62);
    }
    this.defaultOffset = offset;
    this.menuBtn = menuBtn;
    this.isOn = false;  // 是否被点击

}
MenuDrop.prototype = new BMap.Control();
$.extend(MenuDrop.prototype, {
    initialize: function(map){
        this._map = map;
        var menuDropContainer = this._container = document.createElement('div');
        menuDropContainer.id = 'menu-drop-container';
        menuDropContainer.style.position = 'absolute';
        menuDropContainer.className = 'menu-ctrl-drop';
        
        var listContainer = document.createElement("ul");
        listContainer.className = "menu-list-con";
        menuDropContainer.appendChild(listContainer);
        
        $(listContainer).html('<li id="menu-city" data-tab="1">切换城市</li>'+
                              '<li id="menu-pano" data-tab="2">全景</li>'+
                              '<li id="menu-info-center" data-tab="3">个人中心(<span>未登录</span>)</li>'+
                              '<li id="menu-feedback" data-tab="4">意见反馈</li>'+
                              '<li id="menu-download" data-tab="5" style="color:#00c;" data="">下载手机客户端</li>');
        
        map.getContainer().appendChild(menuDropContainer);
        this.bind();
        
        this.setCmsConfig();
        
        var handlerMenuStatus = function(evt, args) {
            var curUrl = url.get();
            if (curUrl.module !== 'index' || curUrl.action !== 'index') {
                $('#menu-city, #menu-pano, #menu-info-center').hide();
            } else {
                $('#menu-city, #menu-pano, #menu-info-center').show();
            }
        };
        
        // 非首页处理menu_icon隐藏
        listener.on('common.page', 'switchend', handlerMenuStatus);
        handlerMenuStatus('init', url.get());

        return menuDropContainer;
    },
    
    setCmsConfig: function(){
        var me = this;
        $appbutton = $('#menu-download');
        util.isInstalledClient(function(openurl) {
            $appbutton.attr('data', openurl).text("打开客户端");
        }, function(downloadurl) {
            $appbutton.attr('data', downloadurl).text("下载手机客户端");
        });
    },
    
    bind: function(){
        var map = this._map;
        var me = this;
        
        // Android 2.3去掉了fastclick，click事件点击偏差，touchstart临时解决
        var eventName = pagemgr.isSinglePageApp() ? 'click' : 'touchstart';
        $(this._container).on(eventName, function(e) {
            if (eventName === 'touchstart') {
                e.preventDefault();
                e.stopPropagation();
            }

            me.onClick(e, this);
        });
        
        $(this._container).find('li').on('touchstart', function(){
            $(this).css('background', '#eee');
        });
        $(this._container).find('li').on('touchend', function(){
            $(this).css('background', 'none');
        });
    },

    onClick: function(e, context){
        var me = context;
        var opts = url.get();
        var tab = $(e.target).data('tab');
        switch(tab){
            case 1:
                // 切换城市
                stat.addCookieStat(COM_STAT_CODE.MAP_MENU_CHANGE_CITY_CLICK);

                url.update({
                    module: 'index',
                    action: 'setmylocation',
                    query: opts.query,
                    pageState: {},
                }, {
                    trigger: true,
                    queryReplace: true,
                    pageStateReplace:true
                });
                break;
            case 2:
                // 全景
                stat.addCookieStat(COM_STAT_CODE.MAP_MENU_SVENTRY_CLICK);

                url.update({
                    module : "index",
                    action : "sventry"
                },{  
                    trigger : true,
                    pageStateReplace : true,
                    queryReplace : true
                });
                break;
            case 3:
                login.checkLogin(function(data){
                    if (!data.status) {
                        // 进入百度账户登录
                        stat.addStat(COM_STAT_CODE.MAP_MENU_USER_CENTER_CLICK);
                        login.loginAction();
                    } else {
                        // 进入个人中心
                        stat.addCookieStat(COM_STAT_CODE.MAP_MENU_USER_CENTER_CLICK);
                        login.goMycenter();
                    }
                });
                break;
            case 4:
                // 意见反馈
                stat.addCookieStat(COM_STAT_CODE.MAP_MENU_FEEDBACK_CLICK);

                // 在反馈页内部直接返回
                if (opts.module == "feedback") {
                    return;
                }
                var page_id = opts.module + "/" + opts.action,
                    hash = [opts.module, opts.action, util.jsonToUrl(opts.query), util.jsonToUrl(opts.pageState)].join("/");

                var opts = {
                    module: "feedback",
                    action: "show",
                    query: {
                        page_id: encodeURIComponent(page_id),
                        hash: encodeURIComponent(hash)
                    }
                };
                url.update(opts, {
                    trigger: true,
                    pageStateReplace: true,
                    queryReplace: true
                });
                break;
            case 5:
                // 下载/打开客户端，可能有问题
                stat.addStat(COM_STAT_CODE.MAP_MENU_BDAPP_CLICK);

                setTimeout(function(){
                    window.location.href = $(e.target).attr("data");
                }, 200);
                break;
        }
        this.menuBtn.hideMenuDrop();
    }
});

var MenuControl = function(){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    // 检测是否为iPad版本
    
    var offset = new BMap.Size(8, 16);
    if (util.isIPad()) {
        offset = new BMap.Size(16, 62);
    }
    this.defaultOffset = offset;
    this.isOn = false;  // 是否被点击

}
MenuControl.prototype = new BMap.Control();
$.extend(MenuControl.prototype, {
    initialize: function(map){
        this._map = map;
        
        var menuContainer = this._container = document.createElement('div');
        menuContainer.id = 'menu-btn-container';
        menuContainer.style.position = 'absolute';
        menuContainer.className = 'menu-ctrl-btn';
        
        var menuIcon = document.createElement("div");
        menuIcon.className = "menu-ctrl-icon";
        menuContainer.appendChild(menuIcon);
        
        map.getContainer().appendChild(menuContainer);
        this.bind();
        
        return menuContainer;
    },
    bind: function(){
        var map = this._map;
        var me = this;
        
        this._container.onclick = $.proxy(function(){
            // 右下角Menu点击量
            stat.addStat(COM_STAT_CODE.MAP_MENU_ICON_CLICK);

            if(!this._menuDrop){
                this._menuDrop = new MenuDrop(me);
                map.addControl(this._menuDrop);
            }
            this._menuDrop[this.isOn ? 'hide':'show']();
            this.isOn = !this.isOn;
            var $status = $("#menu-info-center span");
            if(cookie.get('myUserName')){
                $status.text('已登录');
            }else{
                login.checkLogin(function(data) {
                    if (data.status) {
                        $status.text('已登录');
                    } else {
                        $status.text('未登录');
                    }
                });
            }
        }, this);
    },
    hideMenuDrop: function(){
        this.isOn = false;
        this._menuDrop && this._menuDrop.hide();
    }
});


MenuControl._className_ = 'MenuControl';

module.exports = MenuControl;

});
;define('common:widget/api/ext/poiinfowindow.js', function(require, exports, module){

/**
 * @fileOverview POI类型弹窗，用于气泡、麻点弹窗等一系列
 * @author shengxuanwei@baidu.com
 * @date 2013-11-04
 */

var mapConst = require('common:static/js/mapconst.js'),
    url = require('common:widget/url/url.js'),
    util = require('common:static/js/util.js'),
    locator = require('common:widget/geolocation/location.js'),
    InfoWindowOverlay = require('common:widget/api/ext/infowindowoverlay.js'),
    stat = require('common:widget/stat/stat.js');

/**
 * POI类弹框
 * 
 * @example
 * 数据格式要求： 
 * {
 *   json: [{
 *       name: '',
 *       html: '',
 *       uid: '',
 *       geo: '',
 *       pano: ''
 *   }],
 * }
 */
function PoiInfoWindow() {

    this.uid = Date.now();
}
PoiInfoWindow.prototype = new InfoWindowOverlay();
$.extend(PoiInfoWindow.prototype, {

    /**
     * 内部标识
     * 当前弹框数据所在列表数据的索引值
     * @type {Number}
     */
    index: 0,

    /**
     * 重设X坐标偏移值
     * @type {Number}
     */
    offsetX: -1,

    /**
     * 重设Y坐标偏移值
     * 动态指定iw偏移高度
     * @type {Number}
     */
    offsetY: 36,

    /**
     * 切换到对应索引值的数据，并弹框显示
     * @public
     * @param  {Number} index 数据索引值
     */
    switchTo: function(index) {
        this.index = index || 0; // 索引值
        this.point = this._getPoint(); // 坐标点
        this.content = this._getContent(); // 弹框内容
        this.show(); // 调用基类方法
    },

    /**
     * 根据索引值获取POI数据
     * @public
     * @return {Object}
     */
    getPoiData: function() {
        var index = this.index;
        var poiData = this.getData(this.type, this.index);
        if (!poiData) {
            return;
        }

        return poiData;
    },

    /**
     * 解析POI坐标点
     * @private
     * @return {Object}
     */
    _getPoint: function() {
        var poiData = this.getPoiData();
        if (!poiData) {
            return;
        }

        return util.geoToPoint(poiData.geo);
    },

    /**
     * 解析POI，动态生成HTML，备份数据保存到DOM节点的data标签
     * 这里用到的属性：name, pano，geo
     * @private
     * @return {Object}
     */
    _getContent: function() {
        var poiData = this.getPoiData();
        if (!poiData) {
            return;
        }

        var title = poiData.name.replace('\\', '');

        if (poiData.poiType == mapConst.POI_TYPE_BUSSTOP) {
            title = title + "-公交车站";
        } else if (poiData.poiType == mapConst.POI_TYPE_SUBSTOP) {
            title = title + "-地铁站";
        }

        var content = $("<div />", {
            'class': 'iw-c-title ' + (poiData.pano && poiData.pano == 1 ? 'iw-c-title-pano': ''), // pano说明有街景数据
            'text': title,
            'html': poiData.html,
            'data-name': poiData.name,
            'data-uid': poiData.uid,
            'data-geo': poiData.geo
        });

        return content;
    },

    /**
     * 跳转到周边检索
     * @public
     */
    nbSearch: function (name, geo) {
        if (!name || !geo) return;

        var point = util.geoToPoint(geo);
        var pageState = {
            nb_x: point && point.lng,
            nb_y: point && point.lat,
            center_name: name || "",
            from: "searchnearby"
        };

        // 发起周边检索的统计
        stat.addCookieStat(COM_STAT_CODE.MAP_IW_NB_SEARCH);

        url.update({
            module: 'index',
            action: 'searchnearby',
            query: {
                foo: 'bar'
            },
            pageState: pageState
        }, {
            trigger: true,
            pageStateReplace: true,
            queryReplace: true
        });
    },

    /**
     * 跳转到线路检索
     * @public
     */
    lineSearch: function (name, geo) {
        if (!name || !geo) return;

        var point = util.geoToPoint(geo);
        var queryData = {
            word: name,
            point: (point && point.lng) + ',' + (point && point.lat),
            citycode: this.cityCode || locator.getCityCode()
        };
        var pageState = {
            'end': util.jsonToQuery(queryData),
            'from': 'place'
        };

        // 发起线路检索检索的统计
        stat.addCookieStat(COM_STAT_CODE.MAP_IW_LINE_SEARCH);

        url.update({
            module: 'place',
            action: 'linesearch',
            query: {
                foo: 'bar'
            },
            pageState: pageState
        }, {
            trigger: true,
            queryReplace: true,
            pageStateReplace: true
        });
    },

    /**
     * 跳转到详情页
     * @public
     */
    detailSearch: function(uid) {

        // 发起线路检索检索的统计
        stat.addCookieStat(COM_STAT_CODE.MAP_IW_DETAIL_SEARCH);

        if (uid) { // 用于麻点和矢量底图
            url.update({
                module:'place',
                action: 'detail',
                query:{
                    qt: 'inf',
                    uid: uid
                },
                pageState: {
                    vt: ''
                }
            }, {
                trigger: true,
                queryReplace: true,
                pageStateReplace: true
            });
        } else { // 用于列表页气泡
            url.update({
                module:'place',
                action: 'detail',
                query:{
                    foo: 'bar'
                },
                pageState: {
                    vt: '',
                    i: this.index
                }
            }, {
                trigger: true,
                queryReplace: false,
                pageStateReplace: true
            });
        }
    }
});

module.exports = {

    _className_ : 'PoiInfoWindow',
    
    // 输出单例
    _instances: {},

    // 保存构造器，用于controller类型匹配
    _constructor: PoiInfoWindow,

    init: function (type) {

        // 为不同类型创建各自的实例，保证数据隔离
        // 共用一个父容器#iw_ct
        // 数据切换和type设置只在setData方法触发
        var instance;
        if (!this._instances[type]) {
            instance = this._instances[type] = new this._constructor();

            // 初始化过程中重设偏移值
            // 各自实例保存，互不影响
            switch(type) {
                case mapConst.IW_GRT:
                    instance.offsetX = 2;
                    instance.offsetY = 32;
                    break;
                case mapConst.IW_VCT:
                    instance.offsetX = 0;
                    instance.offsetY = 7;
                    break;
                case mapConst.IW_CNT:
                    instance.offsetX = 1;
                    instance.offsetY = 15;
                    break;
            }
        }
        return instance;

    }

};

});
;define('common:widget/api/ext/tfcinfowindow.js', function(require, exports, module){

/**
 * @fileOverview 路况类型弹窗，用于交通路况特殊事件弹框
 * @author shengxuanwei@baidu.com
 * @date 2013-11-04
 */

var mapConst = require('common:static/js/mapconst.js'),
    util = require('common:static/js/util.js'),
    InfoWindowOverlay = require('common:widget/api/ext/infowindowoverlay.js');

/**
 * 路况类弹框
 * 
 * @example
 * 数据格式要求： 
 * {
 *   json: [{
 *       title: '',
 *       starttime: '',
 *       endtime: '',
 *       des: [],
 *       geo: ''
 *   }]
 * }
 */
function TfcInfoWindow() {}
TfcInfoWindow.prototype = new InfoWindowOverlay();
$.extend(TfcInfoWindow.prototype, {

    /**
     * 内部标识
     * 当前弹框数据所在列表数据的索引值
     * @type {Number}
     */
    index: 0,

    /**
     * 重设X坐标偏移值
     * @type {Number}
     */
    offsetX: 0,

    /**
     * 重设Y坐标偏移值
     * 动态指定iw偏移高度
     * @type {Number}
     */
    offsetY: 26,

    /**
     * 重写基类create方法，自定义弹窗框架
     */
    create: function() {
        return $(this.container).append($("<li />", {
            'class': 'iw-c',
            'css': {
                'width': '254px' // 重设宽度
            },
            'data-iw-id': 'iw-c'
        }));
    },

    /**
     * 切换到对应索引值的数据，并弹框显示
     * @public
     * @param  {Number} index 数据索引值
     */
    switchTo: function(index) {
        this.index = index || 0; // 索引值
        this.point = this._getPoint(); // 坐标点
        this.content = this._getContent(); // 弹框内容
        this.show(); // 调用基类方法
    },

    /**
     * 根据索引值获取POI数据
     * @private
     * @return {Object}
     */
    _getPoiData: function() {
        var index = this.index;
        var poiData = this.getData(this.type, this.index);
        if (!poiData) {
            return;
        }

        return poiData;
    },

    /**
     * 解析POI坐标点
     * @private
     * @return {Object}
     */
    _getPoint: function() {
        var poiData = this._getPoiData();
        if (!poiData) {
            return;
        }

        return util.geoToPoint(poiData.geo);
    },

    /**
     * 解析POI，动态生成HTML，备份数据保存到DOM节点的data标签
     * 这里用到的属性：name, pano，geo
     * @private
     * @return {Object}
     */
    _getContent: function() {
        var poiData = this._getPoiData();
        if (!poiData) {
            return;
        }

        var stText, etText;
        if (poiData.starttime) {
            var st = new Date();
            st.setTime(parseInt(poiData.starttime) * 1000);
            stText = '开始时间：' + st.format('yyyy-MM-dd hh:mm');
        }

        if (poiData.endtime) {
            var et = new Date();
            et.setTime(parseInt(poiData.endtime) * 1000);
            etText = '预计结束时间：' + et.format('yyyy-MM-dd hh:mm');
        }

        var ctText = '详情：' + poiData.des;

        var content = $("<div />", {
            'id': 'iw_c_' + this.type,
            'html': "<div class='iw-c-title'>{0}</div><div class='iw-c-list'><p>{1}</p><p>{2}</p><p>{3}</p></div>".format(poiData.title, stText, etText, ctText),
            'class': 'iw-c-c'
        });

        return content;
    }
});

module.exports = {

    _className_ : 'TfcInfoWindow',

    // 输出单例
    _instances: {},

    // 保存构造器，用于controller类型匹配
    _constructor: TfcInfoWindow,

    init: function (type) {

        // 为不同类型创建各自的实例，保证数据隔离
        // 共用一个父容器#iw_ct
        // 数据切换和type设置只在setData方法触发
        var instance;
        if (!this._instances[type]) {
            instance = this._instances[type] = new this._constructor();
        }
        return instance;

    }

};

});
;define('common:widget/api/ext/trafficcontrol.js', function(require, exports, module){

/**
 * @fileoverview 交通路况控件
 * @author jiazheng
 */

var util = require('common:static/js/util.js'),
    popup = require('common:widget/popup/popup.js'),
    url = require('common:widget/url/url.js'),
    mapConst = require('common:static/js/mapconst.js'),
    locator = ﻿require('common:widget/geolocation/location.js'),
    stat = require('common:widget/stat/stat.js');

var TrafficControl = function(){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    if(util.isIPad()){
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(16, 16); // 63为按钮高度，16为标准间距
    }else{
        this.defaultOffset = new BMap.Size(8, 160);
    }
    
    // 表示控件的开关状态
    this.isOn = false;
    // 交通流量图层实例
    this.trafficLayer = null;
    this.PAGE_ID = "traffic_map";

    this.trafficStorageKey = "_traffic_status"
}
TrafficControl.prototype = new BMap.Control();
$.extend(TrafficControl.prototype, {
    initialize: function(map){
        var _this = this;
        this._map = map;
        var cc = document.createElement("div");
        cc.className = "tf_btn tf_close";

        cc.innerHTML = '<div class="btn_bg">\
                            <span class="tf_icon"></span>\
                        </div>';
                        
        map.getContainer().appendChild(cc);
        this._node = $(cc);
        var me = this;
        this._node.on('click', function(e){
            me.toggleTraffic.call(me, e);
            this.blur();
        });
        // 监测状态
        me.resetStatus();
        // todo api需要修改，保证级别变化时都会派发zoomend
        map.addEventListener('zoomend', function(){
            // 级别变化设置按钮状态
            me.resetStatus();
            //me.initTrafficEvents();
        });
        // todo 事件派发后获取地图级别有问题
        map.addEventListener('gestureend', function(){
            // 级别变化设置按钮状态
            setTimeout(function(){
                me.resetStatus();
                //me.initTrafficEvents();
            }, 80);
        });
        map.addEventListener('load', function(){
            // 级别变化设置按钮状态
            me.resetStatus();
        });
        
        //缩放下不触发zoomend事件， 所以监听map的touchend，然后当前level与lastLevel非等值比较。
        map.addEventListener('touchend', function(){
            if(map.lastLevel != map.zoomLevel){
                if(me.isOn){
                    //me.initTrafficEvents();
                }
            }
        });
        
        map.addEventListener('dragend', function(){
            if(me.isOn){
                var resetEvents = function(){
                    clearTimeout(me.eventTimeout);
                    me.eventTimeout = null;
                    //me.initTrafficEvents();
                }
                setTimeout(function(){
                    resetEvents();
                    setTimeout(function(){
                        resetEvents();
                    }, 200);
                }, 500);
            }
        });

        //根据url自动打开或关闭路况 by jican
        var hash = url.get(),
            pageState = hash.pageState,
            mapWidget = require('common:widget/map/map.js');
        listener.on('common.map', 'addlazycontrol', function (evt, args) {
            if (me.isTurnOnPageState()) {
                me.turnOnTraffic();
            }
        });
        
        return cc;
    },

    isTurnOnPageState : function () {
        var hash = url.get(),
            pageState = hash.pageState;


        if(pageState && pageState.traffic === 'on') {
            return true;
        }

        try{
            var isOn = localStorage.getItem(this.trafficStorageKey);
            if(isOn === "1" ) {
                return true;
            }
        } catch(e) {}

    },

    /**
     * 切换交通流量状态
     */
    toggleTraffic: function() {
        if (!this.isOn) {
            //app.updateHash({pageState: {traffic: 'on'}}, {replace: true});
            this.turnOnTraffic();
        } else {
            //app.updateHash({pageState: {traffic: 'off'}}, {replace: true});
            this.turnOffTraffic();
        }
    },
    /**
     * 打开交通流量
     */
    turnOnTraffic: function(){
        if (!this.isOn) {
            // 新版路况开关的开启量
            stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_ICON_ON);
        }
        // 打开的时候再次打开为了刷新，所以先关闭再打开，但是统计上不算
        this._node.removeClass('tf_close');
        this._node.addClass('tf_on');
        // 先进行移除
        //this._removeTrafficLayer();
        // 显示路况图层
        this._addTrafficLayer();

        //third/traffic第三方的路况落地页面需要自己控制显示和提示信息
        if(!util.need2ShowTraffic() &&
            !(window._APP_HASH.module === 'third' &&
            window._APP_HASH.action === 'traffic')){

            this._showTips();
            this.hide();
        } else {
            if (!this.isOn) {
                // 新版路况关闭PV
                stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_ON_PV);
            }
        }
        this.isOn = true;
        this.initTrafficEvents();

        try{
            // 在 loaclstroage 存储状态，路况只有按钮能够消除，单纯用URL记录状态很容易被替换掉
            localStorage.setItem(this.trafficStorageKey,"1");
        } catch(e){}

        // 注意需要replace:true，否则不支持pushState会后退空白页 by jican
        url.update({
            pageState: {traffic:'on'}
        }, {
            replace: true,
            trigger: false
        });
    },
    /**
     * 关闭交通流量
     */
    turnOffTraffic: function(){
        if (this.isOn) {
            // 新版路况开关的关闭量
            stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_ICON_OFF);
        }
        this._node.removeClass('tf_on');
        this._node.addClass('tf_close');  
        if (util.need2ShowTraffic() && this.isOn != false) {
            // 新版路况关闭PV
            stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_OFF_PV);
        }

        // 关闭时需要将存在 localStorage 的状态删掉
        try{
            localStorage.removeItem(this.trafficStorageKey);
        }catch(e){}

        // 注意需要replace:true，否则不支持pushState会后退空白页 by jican
        url.update({
            pageState: {traffic:'off'}
        }, {
            replace: true,
            trigger: false
        });

        this._removeTrafficLayer();
        this.isOn = false;
    },
    
    initTrafficEvents: function(){
        var zoom = this._map.getZoom();
        if(zoom <= 9 || !this.isOn){
            this.removeTrafficEvents();
        }else if(!this.eventTimeout && this.isOn){
            this._getTrafficEvents($.proxy(this._onTrafficEventsHandler, this));
        }
    },
    
    //5分钟刷一次
    _onTrafficEventsHandler: function(data){
        if(data.result != -1){
            this.addTrafficEvents(data.content || []);
        }

        if(!this.eventTimeout){
             this.eventTimeout = setTimeout($.proxy(function(){
                this._getTrafficEvents($.proxy(this._onTrafficEventsHandler, this));
            }, this), 1000 * 60 * 5);           
        }
    },
    
    _getCityByBounds: function(callback){
        var oHead = document.getElementsByTagName('HEAD')[0];
        
        var bounds = this._map.getBounds();
        var level = this._map.getZoom();
        var p = {
            newmap:1,
            qt: 'cen',
            b: bounds._neLng + ','+bounds._neLat +';'+ bounds._swLng +','+ bounds._swLat,
            l: level
        };
        var url = mapConst.CITY_BY_BOUNDS_URI + '?' + util.jsonToQuery(p);
        var oScript= document.createElement("script"); 
        oScript.type = "text/javascript";
        oScript.src = url
        oHead.appendChild(oScript); 
        oScript.onload = function(){
            callback && callback(_mapCenter || {});
            oHead.removeChild(oScript);
            oScript.onload = null;
        }
    },
    
    _getTrafficEvents: function(callback){
        var oHead = document.getElementsByTagName('HEAD')[0]; 
        var me = this;
        //保存先前的引用，借用下这个名称空间，防止污染
        //var preInstance = window.Instance;
        window.Instance = function(){
            this.trafficDataModel = {};
            this.trafficDataModel.setData = function(data){
                this.data = data;
            }
            return trafficDataModel;
        };
        
        var baseParas = {
            qt: 'traeve_data',
            call_back: 'HANDER_TRAFFIC_DATA',
        };
        
        this._getCityByBounds(function(data){
            var cityCode = data.current_city ? data.current_city.code : location.getCityCode();
            var citysParas = [];
            
            if(me.lastCityCode === cityCode){
                callback && callback(trafficDataModel.data);
                return;
            }
            me.lastCityCode = cityCode;
            me.removeTrafficEvents();
            
            citysParas.push($.extend({
                time: Date.now(),
                t: Date.now(),
                city_code: cityCode
            }, baseParas));
            
            try{/*
                //跨城市驾车的情况处理
                if(me.driveData){
                    var res = me.driveData.result;
                    
                    if(res.start_city){
                        var ps = $.extend({
                            time: Date.now(),
                            t: Date.now(),
                            city_code: res.start_city.code
                        }, baseParas);
                        citysParas.push(ps);
                    }
                    
                    if(res.end_city && res.end_city[0]){
                        var ec = res.end_city[0];
                        var pe = $.extend({
                            time: Date.now(),
                            t: Date.now(),
                            city_code: ec.code
                        }, baseParas);
                        citysParas.push(pe);
                    }
                }
                */
            }catch(e){
                console.log(e.message);
            }
            
            
            citysParas.forEach(function(p){
                 var url = mapConst.TRAFIIC_URI + '?' + util.jsonToQuery(p);
                 var oScript= document.createElement("script"); 
                 oScript.type = "text/javascript";
                 oScript.src = url
                 oHead.appendChild(oScript); 
                 oScript.onload = function(){
                     //归还先前的引用
                     //window.Instance = preInstance;
                     callback && callback(trafficDataModel.data);
                     oHead.removeChild(oScript);
                     oScript.onload = null;
                 }
            });
        });
    },
    
    getIconByType: function(type){
        var imageUri = '/static/common/images/trf_evt_b6419aa.png';
        var y = 0;
        switch(type){
            case '1': y = 110;break; //车辆交通事故
            case '2': y = 83;break;//道路施工事件
            case '3': y = 0;break;//管制信息
            
            case '5': y = 51;break;//积雪事件
            case '6': y = 24;break;//积水事件
            case '8': y = 134;break;//道路、建筑、山体坍塌事件
            default: y= '0'; break;
        }
        var icon = new BMap.Icon(imageUri,
           new BMap.Size(28, 28), {    
               anchor: new BMap.Size(14, 28),    
               imageOffset: new BMap.Size(-1, y)
        }); 
        return icon;
    },
    
    /**
     * 添加路况事件覆盖物
     *@paras events {Array} 事件数据数组
     */
    addTrafficEvents: function(events){

        var mapView = require('common:widget/map/map.js'),
            CustomMarker = mapView.getCustomMarker();

        var me = this;
        me.eventMarkers = me.eventMarkers || [];

        var clickHandler = function(data){
            me.dispatchEvent('click', {
                data: data
            });
        }
        
        events.forEach(function(item){
            var geo = item.geo.split(',');
            var lat = geo[0].indexOf('|') ? geo[0].split('|')[1]: geo[0];
            var point = new BMap.Point(lat, geo[1]);
            
            item.point = point;
            var _mkr = new CustomMarker(me.getIconByType(item.type), point, {
                 className: 'events_mrk',
                 click: (function(item){
                     return function(){
                         clickHandler.call(this, item);
                     }
                 })(item)
            });
            me._map.addOverlay(_mkr);  
            me.eventMarkers.push(_mkr);
        });
    },
    
    removeTrafficEvents: function(){
        this.eventMarkers = this.eventMarkers || [];
        this.eventMarkers.forEach($.proxy(function(item){
            this._map.removeOverlay(item);
        }, this));
        this.eventMarkers.length = 0;
        clearTimeout(this.eventTimeout);
        this.eventTimeout = null;
        this.dispatchEvent('remove');
    },
    /**
     * 通过地图api添加路况图层
     */
    _addTrafficLayer: function(){
        /*var tilelayer = new BMap.TrafficLayer();
        this._map.addTileLayer(tilelayer);
        this.trafficLayer = tilelayer;*/
        this._map.setTrafficOn();
    },
    /**
     * 清除交通流量图层
     */
    _removeTrafficLayer: function(){
        /*if (this.trafficLayer){
            this._map.removeTileLayer(this.trafficLayer);
            this.trafficLayer = null
            this.removeTrafficEvents();
            this.dispatchEvent('removelayer');*/
            this._map.setTrafficOff();
            this.removeTrafficEvents();
        //}
    },
    /**
     * 显示提示信息
     */
    _showTips : function() {
        var map = this._map;
        var zoom = map.getZoom();
        var vt = url.get().pageState.vt;
        var curHash = window._APP_HASH;

        if (zoom > 9 && (vt == 'map' || /map/i.test(curHash.page))) {
            // 新版路况不支持提示
            stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_TIPS);
            popup.open({text:'当前城市暂无实时路况数据'});
        }
    },
    /**
     * 重置按钮状态
     */
    resetStatus: function() {
        // todo 这个函数需要修改
        if(this._ifShow()) {
            this.show();
        } else {
            this.hide();
        }
    },
    /**
     * 监测是否需要显示
     * @return {boolean} 是否显示
     */
    _ifShow: function(){
        if (this._map.getZoom() > 5 && util.need2ShowTraffic()) {
            return true;
        }
        return false;
    },
    /**
     * 隐藏控件
     */
    hide : function(){
        $('.tf_btn').hide();
    },
    /**
     * 显示控件
     */
    show : function(){
        $('.tf_btn').show();
    },

    update: function(){
        var pageState = url.get().pageState;

        if(!util.need2ShowTraffic()){
            if(pageState && pageState.traffic === 'on'){
                this._showTips();
            }

            this.hide();
        } else{
            this.show();

            if(pageState && pageState.traffic === 'on'){
                //获取路况事件
                this._getTrafficEvents($.proxy(this._onTrafficEventsHandler, this));     
            }
        }             

    }
});

TrafficControl._className_ = 'TrafficControl';

module.exports = TrafficControl;

});
;define('common:widget/api/ext/trsinfowindow.js', function(require, exports, module){

/**
 * @fileOverview 交通类型弹窗，用于公交路线、公交、驾车、步行弹窗等一系列
 * @author shengxuanwei@baidu.com
 * @date 2013-11-04
 */

var mapConst = require('common:static/js/mapconst.js'),
    util = require('common:static/js/util.js'),
    InfoWindowOverlay = require('common:widget/api/ext/infowindowoverlay.js');

/**
 * 交通类弹框
 * 
 * @example
 * 数据格式要求： 
 * {
 *   json: [{
 *       content: ''
 *   }],
 *   points: [{
 *       p: ''
 *   }]
 * }
 * 其中，json保存路线规划，points保存站点坐标
 * json和points数量可能不一致，因为终点不需要路线规划
 */
function TrsInfoWindow() {}
TrsInfoWindow.prototype = new InfoWindowOverlay();
$.extend(TrsInfoWindow.prototype, {

    /**
     * 内部标识
     * 当前弹框数据所在列表数据的索引值
     * @type {Number}
     */
    index: 0,

    /**
     * 重设X坐标偏移值
     * @type {Number}
     */
    offsetX: 0,

    /**
     * 重设Y坐标偏移值
     * 动态指定iw偏移高度
     * @type {Number}
     */
    offsetY: 5,

    /**
     * 重写基类create方法，自定义弹窗框架
     */
    create: function() {
        return $(this.container).append($("<li />", {
            'class': 'iw-c',
            'data-iw-id': 'iw-c'
        })).css({
            'width': '228px',
            'height': 'auto',
            'min-height': '64px'
        });
    },

    /**
     * 切换到对应索引值的数据，并弹框显示
     * @public
     * @param  {Number} index 数据索引值
     */
    switchTo: function(index) {
        this.index = index || 0; // 索引值
        this.point = this._getPoint(); // 坐标点
        this.content = this._getContent(); // 弹框内容
        this.show(); // 调用基类方法
    },

    /**
     * 根据索引值获取POI数据
     * @private
     * @return {Object}
     */
    _getPoiData: function() {
        var index = this.index;
        var poiData = this.getData(this.type, this.index);
        if (!poiData) {
            return;
        }

        return poiData;
    },

    /**
     * 解析POI坐标点
     * @private
     * @return {Object}
     */
    _getPoint: function() {
        var index = this.index,
            point = this._getPoints(this.type, this.index);

        return util.getPointByStr(point.p);
    },

    /**
     * @param {Number} type 类型标识
     * @param {Number} data 数据索引
     */
    _getPoints: function(type, index) {
        var points = this.points[type];
        if (!points) return;

        if (index > -1 && points[index] !== undefined) {
            return points[index];
        }

        return points;
    },

    /**
     * 解析POI，动态生成HTML，备份数据保存到DOM节点的data标签
     * 这里用到的属性：name, pano，geo
     * @private
     * @return {Object}
     */
    _getContent: function() {
        var poiData = this._getPoiData();
        if (!poiData) {
            return;
        }
        
        var content = $("<div />", {
            'id': 'iw_c_' + this.type,
            'text': poiData.content,
            'html': poiData.content,
            'class': 'iw-c-c',
            'data-content': poiData.content
        });

        return content;
    }
});

module.exports = {

    _className_ : 'TrsInfoWindow',

    // 输出单例
    _instances: {},

    // 保存构造器，用于controller类型匹配
    _constructor: TrsInfoWindow,

    init: function (type) {

        // 为不同类型创建各自的实例，保证数据隔离
        // 共用一个父容器#iw_ct
        // 数据切换和type设置只在setData方法触发
        var instance;
        if (!this._instances[type]) {
            instance = this._instances[type] = new this._constructor();

            switch(type) {
                case mapConst.IW_NAV:
                    instance.offsetX = 0;
                    instance.offsetY = 8;
                    break;
            }
        }
        return instance;

    }

};

});
;define('common:widget/api/ext/userheading.js', function(require, exports, module){

/**
 * 利用指南针传感器显示用户方位信息
 * @author jiazheng
 * @date 20130604
 */
function UserHeading(){
    /**
     * 时间戳
     * @type {number}
     */
    this._timeStamp = 0;
    /**
     * 用于显示的dom对象集合
     * @type {Array<HTMLElement>}
     */
    this._doms = [];
    /**
     * 当前指南针传感器的方位值，用来对比新旧值之间的差距
     * @type {number}
     */
    this._alpha = 0;
    /**
     * 当前用户手机姿态，由于指南针传感器返回的数据是手机
     * 头部的指向，因此需要知道手机的姿态
     * @type {number}
     */
    this._orientation = window.orientation;
}
/**
 * 启动传感器，并添加dom元素
 * @param {HTMLElement} 用于显示用的dom元素
 */
UserHeading.prototype.start = function(dom){
    var me = this;
    me._doms.push(dom);
    if (me._started) {
        // 后续事件监听仅需要执行一次
        return;
    }
    me._started = true;
    window.addEventListener('deviceorientation', function(e){
        var alpha;
        if (!e.webkitCompassHeading) {
            alpha = Math.round(e.alpha);
        } else {
            alpha = Math.round(0 - e.webkitCompassHeading);
        }
        alpha = alpha - me._orientation;
        if (e.timeStamp - me._timeStamp < 100) {
            // 过于频繁
            return;
        }
        me._timeStamp = e.timeStamp;
        var diff = Math.abs(me._alpha - alpha);
        if (diff > 5) {
            // 增加diff判断主要解决防止小范围的来回抖动
            for (var i = 0; i < me._doms.length; i ++) {
                if (!me._doms[i] || !me._doms[i].style) {
                    continue;
                }
                me._doms[i].style.transform = 
                    me._doms[i].style.webkitTransform = 
                    'rotate(' + (Math.round(0 - alpha)) + 'deg)';
            }
            me._alpha = alpha;
        }
    }, true);
    window.addEventListener('orientationchange', function(){
        me._orientation = window.orientation;
    }, true);
}
/**
 * 测试是否支持
 * @return {boolean} 是否支持
 */
UserHeading.prototype.isSupport = function(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('android') > -1 || // android暂时不开放该功能，不够准确
        !window.DeviceOrientationEvent
        || (ua.indexOf('ucweb') > -1 
            && ua.indexOf('linux') > -1)) {   // 没有事件，不支持
        return false;
    }
    return true;
}

UserHeading.prototype._className_ = 'UserHeading';

module.exports = new UserHeading();

});
;define('common:widget/api/ext/zoomcontrol.js', function(require, exports, module){

/**
 * @fileoverview 缩放控件
 */
var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js');

var ZoomControl = function(){
    this.defaultAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
    // 检测是否为iPad版本
    var offset = new BMap.Size(8, 70);
    if (util.isIPad()) {
        offset = new BMap.Size(16, 62);
    }
    this.defaultOffset = offset;
    this.isOn = false;  // 是否被点击
}
ZoomControl.prototype = new BMap.Control();
$.extend(ZoomControl.prototype, {
    initialize: function(map){
        this._map = map;
        
        var zoomContainer = this._container = document.createElement('div');
        zoomContainer.id = 'zoom-btn-container';
        zoomContainer.style.position = 'absolute';
        
        var zoomInContainer = this._zoomIn = document.createElement("div");
        zoomInContainer.className = "zoom_btn blue_off" + " zoom_btn_in";
        var zoomInInner = document.createElement("div");
        zoomInInner.className = "zin";
        zoomInContainer.appendChild(zoomInInner);
        
        var zoomOutContainer = this._zoomOut = document.createElement("div");
        zoomOutContainer.className = "zoom_btn blue_off" + " zoom_btn_out";
        var zoomOutInner = document.createElement("div");
        zoomOutInner.className = "zout";
        zoomOutContainer.appendChild(zoomOutInner);
        
        zoomContainer.appendChild(zoomInContainer);
        zoomContainer.appendChild(zoomOutContainer);
        
        map.getContainer().appendChild(zoomContainer);
        
        this.bind();
        
        return zoomContainer;
    },
    bind: function(){
        var map = this._map;
        var me = this;
        me._zoomIn.onclick = function(){
            // 地图页放大的点击量
            stat.addStat(COM_STAT_CODE.MAP_ZOOMIN_ICON_CLICK);

            me.isOn = true;
            map.zoomIn();
            // 部分andorid的uc出现焦点蓝框无法消失的问题
            // 这里通过blur方法解决
            this.blur();
        }
        me._zoomOut.onclick = function(){
            // 地图页缩小的点击量
            stat.addStat(COM_STAT_CODE.MAP_ZOOMOUT_ICON_CLICK);

            me.isOn = true;
            map.zoomOut();
            // 部分andorid的uc出现焦点蓝框无法消失的问题
            // 这里通过blur方法解决
            this.blur();
        }
        me._zoomIn.ontouchstart = function(){
            $(me._zoomIn).addClass("zoom_btn_on");
        }
        me._zoomIn.ontouchend = function(){
            $(me._zoomIn).removeClass("zoom_btn_on");
        }
        me._zoomOut.ontouchstart = function(){
            $(me._zoomOut).addClass("zoom_btn_on");
        }
        me._zoomOut.ontouchend = function(){
            $(me._zoomOut).removeClass("zoom_btn_on");
        }
        function zoomChangeHandler(){
            setTimeout(function(){
                if (map.getZoom() == 18) {
                    $(me._zoomIn).addClass('blue_disable');
                } else {
                    $(me._zoomIn).removeClass('blue_disable');   
                }
                if (map.getZoom() == 3) {
                    $(me._zoomOut).addClass('blue_disable');
                } else {
                    $(me._zoomOut).removeClass('blue_disable');
                }
            }, 60); // 延迟是因为gestureend事件派发时，zoom还没有发生变化
        }
        // todo load和gestureend事件不用监听，需要api在以下两种情况也要派发zoomend事件
        // 因为zoom确实发生变化了
        map.addEventListener("zoomend", zoomChangeHandler);
        map.addEventListener("gestureend", zoomChangeHandler);
        map.addEventListener("load", zoomChangeHandler);
    },
    clear : function() {
        me.isOn = false;
    }
});

ZoomControl._className_ = 'ZoomControl';

module.exports = ZoomControl;

});