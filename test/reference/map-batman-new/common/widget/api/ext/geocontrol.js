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