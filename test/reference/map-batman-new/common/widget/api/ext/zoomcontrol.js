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