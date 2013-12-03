<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js"%}
    {%head%}
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="format-detection" content="telephone=no" searchtype="map">
        <meta name="apple-mobile-web-app-capable" content="yes"/>       
        <link rel="apple-touch-startup-image"   href="ui/images/startup_320_460.jpg" />
        <link rel="apple-touch-icon-precomposed" href="ui/images/logo.png"/>   
        <title>百度地图</title>
        {%require name="common:static/css/reset.css"%}
        {%require name="common:static/css/base.css"%}
        {%require name="common:static/js/zepto.js"%}
        {%script%}
            // 由后端返回当前页面的module,action,pagename by jican
            window._APP_HASH = {
                module : {%json_encode($module)%},
                action : {%json_encode($action)%},
                page   : {%json_encode($page)%}
            };
            // 设置app高度
            require('common:widget/appresize/appresize.js');
        {%/script%}
    {%/head%}
    {%body%}
        {%widget name="common:widget/header/header.tpl"%}
        {%widget name="common:widget/nav/nav.tpl" title="获取定位" noBack=1%}
        {%widget name="index:widget/waitforloc/waitforloc.tpl"%}
        {%widget name="common:widget/footer/footer.tpl"%}
        <!-- 用于统计1px透明图 -->
        <img id="statImg" style="display:none"/>
        {%json file="common/statcode.json" assign="COM_STAT_CODE"%}
        {%script%}
            COM_STAT_CODE = {%json_encode($COM_STAT_CODE)%} || {};
        {%/script%}
        {%script%}
            window._DEFAULT_CITY = {%json_encode($initData)%} || {};
            (require('index:widget/waitforloc/waitforloc.js')).init();
        {%/script%}
    {%require name='third:page/waitforloc.tpl'%}{%/body%}
{%/html%}