/**
 * @fileoverview 交通路况控件
 * @author jiazheng
 */

var util = require('common:static/js/util.js'),
    popup = require('common:widget/popup/popup.js'),
    url = require('common:widget/url/url.js'),
    mapConst = require('common:static/js/mapconst.js'),
    BMap = require('common:widget/api/api.js'),
    CustomMarker = require('common:widget/api/ext/custommarker.js'),
    BaseControl = require('common:widget/api/ext/basecontrol.js'),
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
}
TrafficControl.prototype = new BaseControl();
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
            if (pageState && pageState.traffic === 'on') {
                me.turnOnTraffic();
            }
        });
        
        return cc;
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
        var imageUri = __uri('/static/images/trf_evt.png');
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
        //BaseControl.prototype.hide.call(this);
        //由于上面的方法无法隐藏控件，所以直接隐藏节点
        $('.tf_btn').hide();
    },
    /**
     * 显示控件
     */
    show : function(){
        //BaseControl.prototype.show.call(this);
        //由于上面的方法无法显示控件，所以直接显示节点
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