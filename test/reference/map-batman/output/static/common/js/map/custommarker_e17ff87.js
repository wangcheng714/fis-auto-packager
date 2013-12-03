/**
 * 自定义覆盖物实现Marker
 * @fileoverview 自定义覆盖物实现Marker
 * @author jiazheng
 */
define("common:static/js/map/custommarker.js", function(require, exports, module){
    var BMap = require('common:static/js/map/api.js');

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
            // // console.log('stop touchend');
            // 这是在判断什么？？？
            if (!window.dtCon0 || !dtCon0.isOn) {
                if (typeof me._config.click == "function") {
                    // console.log('click');
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

    module.exports = CustomMarker;
});

