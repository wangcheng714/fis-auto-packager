<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js"%}
{%head%}
<meta charset="utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
<meta name="format-detection" content="telephone=no" searchtype="map">
<meta name="apple-mobile-web-app-capable" content="yes"/>
<link rel="apple-touch-startup-image"   href="/static/images/startup_320_460.jpg" />
<link rel="apple-touch-icon-precomposed" href="/static/images/logo.png"/>
<style type="text/css" >html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,figcaption,figure,footer,header,hgroup,menu,nav,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;outline:0}div{-webkit-tap-highlight-color:rgba(0,0,0,0)}input{outline:0;font-size:14px}html,body,form,fieldset,p,div,h1,h2,h3,h4,h5,h6{-webkit-text-size-adjust:none}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}a,input,select,button{font-family:arial,helvetica,sans-serif}a{text-decoration:none}body{font-family:arial,helvetica,sans-serif;-webkit-text-size-adjust:none;-webkit-user-select:none;font-size:14px}ol,ul{list-style:none}blockquote,q{quotes:none}img,table{border:0}blockquote:before,blockquote:after,q:before,q:after{content:'';content:none}ins{text-decoration:none}del{text-decoration:line-through}select{-webkit-appearance:button;border:0}table{border-collapse:collapse;border-spacing:0}button{border:0;padding:0;margin:0}.clearfix:after{content:'\0020';display:block;height:0;clear:both}.clearfix{*zoom:1}</style>
<style type="text/css" >html{height:100%}body{height:100%;background:#f2f2f2;font-family:Arial,"微软雅黑"}#main{overflow:hidden}button.btn-h35{height:35px;line-height:35px;font-size:15px;color:#fff;text-align:center;background:url(/static/taxi/images/bg-btn-h35_596e296.png) repeat-x 0 0;background-size:1px 68px;border:1px solid #4678d3;border-radius:3px}button.btn-h35[disabled=disabled]{background-position:0 -34px;border-color:#cacaca;color:#666}#wrapper{position:relative;width:100%;height:100%;overflow:hidden}#wrapper>[id^=taxi-pagelet-]{position:absolute;width:100%;height:100%;box-sizing:border-box}#wrapper>[id^=taxi-pagelet-]>[class^=taxi-widget-]{height:100%}</style>
<style type="text/css" >.common-widget-popup{position:fixed;display:block;padding:10px 25px;background-color:#fff;border-radius:3px;color:#333;font-size:16px;text-align:center;margin:0 auto;z-index:1000}.common-widget-popup-layer{position:fixed;width:100%;height:100%;left:0;top:0;background:rgba(0,0,0,.3);z-index:999}</style>
{%require name="common:static/js/zepto.js"%}
{%require name="common:static/js/lazyload.js"%}
{%require name="taxi:static/js/BigPipe.js"%}
{%require name="taxi:static/js/taxi.js"%}
{%require name="taxi:static/js/loadmanager.js"%}
{%json file="taxi/statcode.json" assign="STAT_CODE"%}
{%json file="common/statcode.json" assign="COM_STAT_CODE"%}
{%script%}
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
            module : 'taxi'
        };
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
    {%/script%}
<title>百度打车</title>
{%/head%}
{%body%}
<div id="wrapper">
{%widget name="taxi:widget/home/home.tpl" mode="quickling" pagelet_id="taxi-pagelet-home"%}
{%widget name="taxi:widget/waiting/waiting.tpl" mode="quickling" pagelet_id="taxi-pagelet-waiting"%}
{%widget name="taxi:widget/resubmit/resubmit.tpl" mode="quickling" pagelet_id="taxi-pagelet-resubmit"%}
{%widget name="taxi:widget/response/response.tpl" mode="quickling" pagelet_id="taxi-pagelet-response"%}
{%widget name="taxi:widget/settings/settings.tpl" mode="quickling" pagelet_id="taxi-pagelet-settings"%}
{%widget name="taxi:widget/verify/verify.tpl" mode="quickling" pagelet_id="taxi-pagelet-verify"%}
{%widget name="taxi:widget/about/about.tpl" mode="quickling" pagelet_id="taxi-pagelet-about"%}
</div>
<img id="statImg" style="display:none"/>
{%script%}
        var stat = require('common:widget/stat/stat.js');
        stat.addStat(STAT_CODE.TAXI_VIEW);
        //统计组件
        (require('common:widget/statistics/statistics.js')).init();
    {%/script%}
{%require name='taxi:page/index.tpl'%}{%/body%}
{%/html%}
