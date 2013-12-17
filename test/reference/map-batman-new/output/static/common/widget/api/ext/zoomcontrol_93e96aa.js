define("common:widget/api/ext/zoomcontrol.js",function(o,t,n){var e=o("common:static/js/util.js"),a=o("common:widget/stat/stat.js"),i=function(){this.defaultAnchor=BMAP_ANCHOR_BOTTOM_RIGHT;var o=new BMap.Size(8,70);e.isIPad()&&(o=new BMap.Size(16,62)),this.defaultOffset=o,this.isOn=!1};i.prototype=new BMap.Control,$.extend(i.prototype,{initialize:function(o){this._map=o;var t=this._container=document.createElement("div");t.id="zoom-btn-container",t.style.position="absolute";var n=this._zoomIn=document.createElement("div");n.className="zoom_btn blue_off zoom_btn_in";var e=document.createElement("div");e.className="zin",n.appendChild(e);var a=this._zoomOut=document.createElement("div");a.className="zoom_btn blue_off zoom_btn_out";var i=document.createElement("div");return i.className="zout",a.appendChild(i),t.appendChild(n),t.appendChild(a),o.getContainer().appendChild(t),this.bind(),t},bind:function(){function o(){setTimeout(function(){18==t.getZoom()?$(n._zoomIn).addClass("blue_disable"):$(n._zoomIn).removeClass("blue_disable"),3==t.getZoom()?$(n._zoomOut).addClass("blue_disable"):$(n._zoomOut).removeClass("blue_disable")},60)}var t=this._map,n=this;n._zoomIn.onclick=function(){a.addStat(COM_STAT_CODE.MAP_ZOOMIN_ICON_CLICK),n.isOn=!0,t.zoomIn(),this.blur()},n._zoomOut.onclick=function(){a.addStat(COM_STAT_CODE.MAP_ZOOMOUT_ICON_CLICK),n.isOn=!0,t.zoomOut(),this.blur()},n._zoomIn.ontouchstart=function(){$(n._zoomIn).addClass("zoom_btn_on")},n._zoomIn.ontouchend=function(){$(n._zoomIn).removeClass("zoom_btn_on")},n._zoomOut.ontouchstart=function(){$(n._zoomOut).addClass("zoom_btn_on")},n._zoomOut.ontouchend=function(){$(n._zoomOut).removeClass("zoom_btn_on")},t.addEventListener("zoomend",o),t.addEventListener("gestureend",o),t.addEventListener("load",o)},clear:function(){me.isOn=!1}}),i._className_="ZoomControl",n.exports=i});