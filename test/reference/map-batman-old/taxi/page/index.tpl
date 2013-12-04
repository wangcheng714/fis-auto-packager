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
    <link rel="stylesheet" type="text/css" href="/static/css/reset.inline.less?__inline" />
    <link rel="stylesheet" type="text/css" href="/static/css/base.inline.less?__inline" />
    <link rel="stylesheet" type="text/css" href="/static/css/popup.inline.less?__inline" />
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
    <!-- 用于统计1px透明图 -->
    <img id="statImg" style="display:none"/>

    {%script%}
        var stat = require('common:widget/stat/stat.js');
        stat.addStat(STAT_CODE.TAXI_VIEW);
        //统计组件
        (require('common:widget/statistics/statistics.js')).init();
    {%/script%}
{%/body%}
{%/html%}
