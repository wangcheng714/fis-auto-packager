<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js"%}
{%head%}
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no" searchtype="map">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="apple-touch-icon-precomposed" href="/static/images/icon/57.png" />
    <link rel="apple-touch-icon-precomposed" href="/static/images/icon/114.png" sizes="114x114" />
    <link rel="apple-touch-startup-image" href="/static/images/startimage/320-460.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)" sizes="320x460"/>
    <link rel="apple-touch-startup-image" href="/static/images/startimage/640-920.png" media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)" sizes="640x920"/>
    <link rel="apple-touch-startup-image" href="/static/images/startimage/640-1096.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" sizes="640x1096"/>
    <link rel="stylesheet" type="text/css" href="/static/css/reset.inline.less?__inline" />
    <link rel="stylesheet" type="text/css" href="/static/css/base.inline.less?__inline" />
    <link rel="stylesheet" type="text/css" href="/static/css/popup.inline.less?__inline" />
    <link rel="stylesheet" type="text/css" href="/static/css/ui.inline.less?__inline" />
    <link rel="stylesheet" type="text/css" href="/widget/common/dialog/dialog.inline.less?__inline" />
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
