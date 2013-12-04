define("common:widget/api/ext/trafficcontrol.js",function(t,e,i){var n=t("common:static/js/util.js"),a=t("common:widget/popup/popup.js"),s=t("common:widget/url/url.js"),o=t("common:static/js/mapconst.js"),r=t("common:widget/api/api.js"),c=t("common:widget/api/ext/custommarker.js"),f=t("common:widget/api/ext/basecontrol.js"),d=(t("common:widget/geolocation/location.js"),t("common:widget/stat/stat.js")),h=function(){this.defaultAnchor=BMAP_ANCHOR_BOTTOM_RIGHT,n.isIPad()?(this.defaultAnchor=BMAP_ANCHOR_TOP_RIGHT,this.defaultOffset=new r.Size(16,16)):this.defaultOffset=new r.Size(8,160),this.isOn=!1,this.trafficLayer=null,this.PAGE_ID="traffic_map"};h.prototype=new f,$.extend(h.prototype,{initialize:function(e){this._map=e;var i=document.createElement("div");i.className="tf_btn tf_close",i.innerHTML='<div class="btn_bg">                            <span class="tf_icon"></span>                        </div>',e.getContainer().appendChild(i),this._node=$(i);var n=this;this._node.on("click",function(t){n.toggleTraffic.call(n,t),this.blur()}),n.resetStatus(),e.addEventListener("zoomend",function(){n.resetStatus()}),e.addEventListener("gestureend",function(){setTimeout(function(){n.resetStatus()},80)}),e.addEventListener("load",function(){n.resetStatus()}),e.addEventListener("touchend",function(){e.lastLevel!=e.zoomLevel&&n.isOn}),e.addEventListener("dragend",function(){if(n.isOn){var t=function(){clearTimeout(n.eventTimeout),n.eventTimeout=null};setTimeout(function(){t(),setTimeout(function(){t()},200)},500)}});var a=s.get(),o=a.pageState;return t("common:widget/map/map.js"),listener.on("common.map","addlazycontrol",function(){o&&"on"===o.traffic&&n.turnOnTraffic()}),i},toggleTraffic:function(){this.isOn?this.turnOffTraffic():this.turnOnTraffic()},turnOnTraffic:function(){this.isOn||d.addStat(COM_STAT_CODE.MAP_TRAFFIC_ICON_ON),this._node.removeClass("tf_close"),this._node.addClass("tf_on"),this._addTrafficLayer(),n.need2ShowTraffic()||"third"===window._APP_HASH.module&&"traffic"===window._APP_HASH.action?this.isOn||d.addStat(COM_STAT_CODE.MAP_TRAFFIC_ON_PV):(this._showTips(),this.hide()),this.isOn=!0,this.initTrafficEvents(),s.update({pageState:{traffic:"on"}},{replace:!0,trigger:!1})},turnOffTraffic:function(){this.isOn&&d.addStat(COM_STAT_CODE.MAP_TRAFFIC_ICON_OFF),this._node.removeClass("tf_on"),this._node.addClass("tf_close"),n.need2ShowTraffic()&&0!=this.isOn&&d.addStat(COM_STAT_CODE.MAP_TRAFFIC_OFF_PV),s.update({pageState:{traffic:"off"}},{replace:!0,trigger:!1}),this._removeTrafficLayer(),this.isOn=!1},initTrafficEvents:function(){var t=this._map.getZoom();9>=t||!this.isOn?this.removeTrafficEvents():!this.eventTimeout&&this.isOn&&this._getTrafficEvents($.proxy(this._onTrafficEventsHandler,this))},_onTrafficEventsHandler:function(t){-1!=t.result&&this.addTrafficEvents(t.content||[]),this.eventTimeout||(this.eventTimeout=setTimeout($.proxy(function(){this._getTrafficEvents($.proxy(this._onTrafficEventsHandler,this))},this),3e5))},_getCityByBounds:function(t){var e=document.getElementsByTagName("HEAD")[0],i=this._map.getBounds(),a=this._map.getZoom(),s={newmap:1,qt:"cen",b:i._neLng+","+i._neLat+";"+i._swLng+","+i._swLat,l:a},r=o.CITY_BY_BOUNDS_URI+"?"+n.jsonToQuery(s),c=document.createElement("script");c.type="text/javascript",c.src=r,e.appendChild(c),c.onload=function(){t&&t(_mapCenter||{}),e.removeChild(c),c.onload=null}},_getTrafficEvents:function(t){var e=document.getElementsByTagName("HEAD")[0],i=this;window.Instance=function(){return this.trafficDataModel={},this.trafficDataModel.setData=function(t){this.data=t},trafficDataModel};var a={qt:"traeve_data",call_back:"HANDER_TRAFFIC_DATA"};this._getCityByBounds(function(s){var r=s.current_city?s.current_city.code:location.getCityCode(),c=[];if(i.lastCityCode===r)return t&&t(trafficDataModel.data),void 0;i.lastCityCode=r,i.removeTrafficEvents(),c.push($.extend({time:Date.now(),t:Date.now(),city_code:r},a));try{}catch(f){console.log(f.message)}c.forEach(function(i){var a=o.TRAFIIC_URI+"?"+n.jsonToQuery(i),s=document.createElement("script");s.type="text/javascript",s.src=a,e.appendChild(s),s.onload=function(){t&&t(trafficDataModel.data),e.removeChild(s),s.onload=null}})})},getIconByType:function(t){var e="/mobile/simple/static/common/images/trf_evt_04682c9.png",i=0;switch(t){case"1":i=110;break;case"2":i=83;break;case"3":i=0;break;case"5":i=51;break;case"6":i=24;break;case"8":i=134;break;default:i="0"}var n=new r.Icon(e,new r.Size(28,28),{anchor:new r.Size(14,28),imageOffset:new r.Size(-1,i)});return n},addTrafficEvents:function(t){var e=this;e.eventMarkers=e.eventMarkers||[];var i=function(t){e.dispatchEvent("click",{data:t})};t.forEach(function(t){var n=t.geo.split(","),a=n[0].indexOf("|")?n[0].split("|")[1]:n[0],s=new r.Point(a,n[1]);t.point=s;var o=new c(e.getIconByType(t.type),s,{className:"events_mrk",click:function(t){return function(){i.call(this,t)}}(t)});e._map.addOverlay(o),e.eventMarkers.push(o)})},removeTrafficEvents:function(){this.eventMarkers=this.eventMarkers||[],this.eventMarkers.forEach($.proxy(function(t){this._map.removeOverlay(t)},this)),this.eventMarkers.length=0,clearTimeout(this.eventTimeout),this.eventTimeout=null,this.dispatchEvent("remove")},_addTrafficLayer:function(){this._map.setTrafficOn()},_removeTrafficLayer:function(){this._map.setTrafficOff(),this.removeTrafficEvents()},_showTips:function(){var t=this._map,e=t.getZoom(),i=s.get().pageState.vt,n=window._APP_HASH;e>9&&("map"==i||/map/i.test(n.page))&&(d.addStat(COM_STAT_CODE.MAP_TRAFFIC_TIPS),a.open({text:"当前城市暂无实时路况数据"}))},resetStatus:function(){this._ifShow()?this.show():this.hide()},_ifShow:function(){return this._map.getZoom()>5&&n.need2ShowTraffic()?!0:!1},hide:function(){$(".tf_btn").hide()},show:function(){$(".tf_btn").show()},update:function(){var t=s.get().pageState;n.need2ShowTraffic()?(this.show(),t&&"on"===t.traffic&&this._getTrafficEvents($.proxy(this._onTrafficEventsHandler,this))):(t&&"on"===t.traffic&&this._showTips(),this.hide())}}),h._className_="TrafficControl",i.exports=h});