<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js"%}
{%head%}
<meta charset="utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no" searchtype="map">
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="apple-touch-icon-precomposed" href="/mobile/simple/static/taxi/images/icon/57_af723f2.png" />
<link rel="apple-touch-icon-precomposed" href="/mobile/simple/static/taxi/images/icon/114_cd55616.png" sizes="114x114" />
<link rel="apple-touch-startup-image" href="/mobile/simple/static/taxi/images/startimage/320-460_f9b6fbf.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)" sizes="320x460"/>
<link rel="apple-touch-startup-image" href="/mobile/simple/static/taxi/images/startimage/640-920_5c13135.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)" sizes="640x920"/>
<link rel="apple-touch-startup-image" href="/mobile/simple/static/taxi/images/startimage/640-1096_262020a.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" sizes="640x1096"/>
<style type="text/css" >html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,figcaption,figure,footer,header,hgroup,menu,nav,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;outline:0}div{-webkit-tap-highlight-color:rgba(0,0,0,0)}input{outline:0;font-size:14px}html,body,form,fieldset,p,div,h1,h2,h3,h4,h5,h6{-webkit-text-size-adjust:none}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}a,input,select,button{font-family:arial,helvetica,sans-serif}a{text-decoration:none}body{font-family:arial,helvetica,sans-serif;-webkit-text-size-adjust:none;-webkit-user-select:none;font-size:14px}ol,ul{list-style:none}blockquote,q{quotes:none}img,table{border:0}blockquote:before,blockquote:after,q:before,q:after{content:'';content:none}ins{text-decoration:none}del{text-decoration:line-through}select{-webkit-appearance:button;border:0}table{border-collapse:collapse;border-spacing:0}button{border:0;padding:0;margin:0}.clearfix:after{content:'\0020';display:block;height:0;clear:both}.clearfix{*zoom:1}</style>
<style type="text/css" >html{height:100%}body{height:100%;background:#f2f2f2;font-family:Arial,"微软雅黑"}#main{overflow:hidden}button.btn-h35{height:35px;line-height:35px;font-size:15px;color:#fff;text-align:center;background:url(/mobile/simple/static/taxi/images/bg-btn-h35_596e296.png) repeat-x 0 0;background-size:1px 68px;border:1px solid #4678d3;border-radius:3px}button.btn-h35[disabled=disabled]{background-position:0 -34px;border-color:#cacaca;color:#666}#wrapper{position:relative;width:100%;height:100%;overflow:hidden}[id^=taxi-pagelet-]{position:absolute;width:100%;height:100%;box-sizing:border-box}[id^=taxi-pagelet-]>[class^=taxi-widget-]{height:100%}</style>
<style type="text/css" >.taxi-widget-popup{position:fixed;display:block;box-sizing:border-box;padding:10px 25px;background-color:#fff;border-radius:3px;color:#333;font-size:16px;text-align:center;margin:0 10px;z-index:1000}.taxi-widget-popup-layer{position:fixed;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.3);z-index:999}</style>
<style type="text/css" >.taxi-ui-checkbox{display:none}.taxi-ui-checkbox+label{display:inline-block;position:relative;padding-left:15px;height:20px;line-height:20px;font-size:12px}.taxi-ui-checkbox+label span.icon{position:absolute;left:0;top:5px;box-sizing:border-box;width:10px;height:10px;border:1px solid #ababab;border-radius:2px}.taxi-ui-checkbox:checked+label span.icon{background:url(/mobile/simple/static/taxi/images/bg-checkbox_402d905.png) no-repeat center center;background-size:8px 8px}.taxi-ui-checkbox.size-24+label{height:30px;line-height:30px;padding-left:30px;font-size:16px}.taxi-ui-checkbox.size-24+label span.icon{width:24px;height:24px;background:#fff;top:3px}.taxi-ui-checkbox.size-24:checked+label span.icon{background:#fff url(/mobile/simple/static/taxi/images/bg-checkbox-24_654fe00.png) no-repeat center center;background-size:16px 16px}</style>
<style type="text/css" >.taxi-widget-dialog{box-sizing:border-box;width:260px;background:-webkit-gradient(linear,left top,left bottom,from(rgba(231,231,231,.9)),to(rgba(243,243,243,.9)));border:1px solid rgba(207,207,207,.9);border-radius:5px;font-size:16px;line-height:21px;text-align:center;color:#333}.taxi-widget-dialog .content{padding:20px 10px}.taxi-widget-dialog .button-bar{display:-webkit-box;-webkit-box-align:justify;height:36px;border-top:1px solid rgba(207,207,207,.9)}.taxi-widget-dialog .button-bar button{display:block;-webkit-box-flex:1;text-align:center;height:36px;line-height:36px;background:transparent;font-size:16px;border-right:1px solid rgba(207,207,207,.9)}.taxi-widget-dialog .button-bar button:last-child{border-right:0}.taxi-widget-dialog-layer{display:-webkit-box;-webkit-box-align:center;-webkit-box-pack:center;position:fixed;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.5);z-index:9999}</style>
{%require name="common:static/js/libs/zepto.js"%}
{%require name="taxi:static/js/lazyload.js"%}
{%require name="common:static/js/libs/listener.js"%}
{%require name="taxi:static/js/BigPipe.js"%}
{%require name="taxi:static/js/taxi.js"%}
{%require name="taxi:static/js/loadmanager.js"%}
{%json file="taxi/statcode.json" assign="STAT_CODE"%}
{%json file="common/statcode.json" assign="COM_STAT_CODE"%}
{%script%}
        window.onorientationchange = function(e) {e.preventDefault();};
        STAT_CODE = {%json_encode($STAT_CODE)%};
        if(!STAT_CODE) {
            throw "STAT_CODE parse error";
        }
        COM_STAT_CODE = {%json_encode($COM_STAT_CODE)%};
        if(!COM_STAT_CODE) {
            throw "COM_STAT_CODE parse error";
        }
    {%/script%}
<script type="text/javascript">
        //由后端返回当前页面的module,action,pagename by jican
        window._APP_HASH = {
            module : 'taxi',
            page: {%json_encode($page)%},
            third_party : {%json_encode($third_party)%} || ''
        };
        window._WISE_INFO = {%json_encode($wise_info)%} || {};
    </script>
{%script%}
        window._DEFAULT_CITY = {%json_encode($initData)%} || {};
        window._CURRENT_CITY = {%json_encode($data.current_city)%};
        window.PARAMS = {%json_encode($params)%};

        COM_STAT_CODE = {%json_encode($COM_STAT_CODE)%};
        if(!COM_STAT_CODE) {
            throw "COM_STAT_CODE parse error";
        }

        //定位初始化
        require('common:widget/geolocation/initgeo.js');
        // 加载Fastclick
        var FastClick = require('common:widget/fastclick/fastclick.js');
        new FastClick(document.body);
        LoadManager.init({version: _APP_HASH.page});
    {%/script%}
<title>百度打车</title>
{%/head%}
{%body%}
<div id="wrapper">
{%widget name="taxi:widget/vip/home/home.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-home"%}
{%widget name="taxi:widget/vip/verify/verify.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-verify"%}
{%widget name="taxi:widget/vip/orderlist/orderlist.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-orderlist"%}
</div>
<img id="statImg" style="display:none"/>
{%script%}
        var stat = require('common:widget/stat/stat.js');
        stat.addStat(STAT_CODE.TAXI_VIEW);
        //统计组件
        (require('common:widget/statistics/statistics.js')).init();
    {%/script%}
{%require name='taxi:page/vip.tpl'%}{%/body%}
{%/html%}
