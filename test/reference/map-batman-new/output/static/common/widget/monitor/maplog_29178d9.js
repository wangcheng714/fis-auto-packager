define("common:widget/monitor/maplog.js",function(e,n,t){function o(){$(window).on("pageshow",function(e){e&&e.persisted&&(P=!0)}),$(window).on("pagehide",function(){b=!0}),listener.on("common.page","switchstart",function(){j=!0})}function i(){return!P&&!b&&!j}function r(){var e=window._APP_HASH||{},n=e.module,t=e.action,o=("MAP_"+n+"_"+t).toUpperCase();return SDC.DICT[o]?SDC.createApp(SDC.DICT[o]):A}function a(){T.mark("c_map_load"),D.removeEventListener("load",a)}function c(){f=Date.now()}function d(){g=Date.now()}function s(){u=Date.now()}function v(){f&&i()&&(T.mark("c_vector_begin",f),A.mark("c_vct_st",f),S.mark("c_vct_st",f),T.mark("c_vector_load"),T.view_time(),T.ready(1),A.mark("c_vct_lt_"+E),A.view_time(),A.ready(1),S.view_time(),S.ready(1),window._perlog&&window._perlog(T)),D.removeEventListener("onvectorbegin",c),D.removeEventListener("ontilesbegin",d),D.removeEventListener("onvectorloaded",v),D.removeEventListener("ontilesloaded",m)}function m(){g&&i()&&(T.mark("c_tiles_begin",g),A.mark("c_rst_st",g),k.mark("c_rst_st",g),T.mark("c_tiles_load"),T.view_time(),T.ready(1),A.mark("c_rst_lt_"+E),A.view_time(),A.ready(1),k.view_time(),k.ready(1),window._perlog&&window._perlog(T)),D.removeEventListener("onvectorbegin",c),D.removeEventListener("ontilesbegin",d),D.removeEventListener("onvectorloaded",v),D.removeEventListener("ontilesloaded",m)}function _(){u&&i()&&(I.start_event(u),I.view_time(),I.ready(1)),D.removeEventListener("onTrafficvectorbegin",s),D.removeEventListener("onTrafficvectorloaded",_)}function l(){A=r(),T.start_event(),A.start_event(),S.start_event(),k.start_event()}function p(){T.mark("c_js_load"),T.mark("c_js_lt_"+E)}function w(e,n){D=n,D.addEventListener("load",a),D.addEventListener("onvectorbegin",c),D.addEventListener("ontilesbegin",d),D.addEventListener("onvectorloaded",v),D.addEventListener("ontilesloaded",m),D.addEventListener("onTrafficvectorbegin",s),D.addEventListener("onTrafficvectorloaded",_)}var f,g,u,D,C=e("common:static/js/util.js"),L=e("common:widget/pagemgr/pagemgr.js"),E=(e("common:widget/url/url.js"),window.netspeed,L.isLandingPage()?"ild":"uld"),A=(C.isAndroid()?"and":C.isIPad()?"ipd":C.isIPhone()?"iph":"oth",SDC.createApp(SDC.DICT.MAP_OTHER_PAGE)),T=SDC.createApp(SDC.DICT.MAP_AVG),S=SDC.createApp(SDC.DICT.MAP_VCT),k=SDC.createApp(SDC.DICT.MAP_TIL),I=SDC.createApp(SDC.DICT.TRAFFIC_LAD),P=!1,b=!1,j=!1;t.exports={init:function(){o(),listener.once("common.map","start",l),listener.once("common.map","jsloaded",p),listener.once("common.map","init",w)}}});