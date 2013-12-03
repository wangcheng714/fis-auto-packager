<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js" fid="map_batman" sampleRate="0.5"%}
    {%head%}
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" media="(device-height: 568px)" />
        <meta name="format-detection" content="telephone=no" searchtype="map">
        <meta name="apple-mobile-web-app-capable" content="yes"/>       
        <link rel="apple-touch-startup-image"   href="/static/images/startup_320_460.jpg" />
        <link rel="apple-touch-icon-precomposed" href="/static/images/logo.png"/>   
        <title>百度地图</title>
        <script type="text/javascript" src="/static/js/pdc/pdc.js?__inline"></script>
        <script type="text/javascript">
            //由后端返回当前页面的module,action,pagename by jican
            window._APP_HASH = {
                module : {%json_encode($module)%},
                action : {%json_encode($action)%},
                page : {%json_encode($page)%}
            };
        </script>
        <link rel="stylesheet" type="text/css" href="/static/css/reset.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/static/css/base.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/static/css/layout.inline.css?__inline">
        {%require name="common:static/js/zepto.js"%}
        {%require name="common:static/js/lazyload.js"%}
        {%require name="common:static/js/BigPipe.js"%}
        {%* 引入对应模块的统计json *%}
        {%json file="{%$module%}/statcode.json" assign="STAT_CODE"%}
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
        {%script%}
            window._DEFAULT_CITY = {%json_encode($initData)%} || {};
            window._CURRENT_CITY = {%json_encode($data.current_city)%};

            // 性能监控初始化 by jican
            (require('common:widget/monitor/monitor.js')).init();

            //定位初始化
            require('common:widget/geolocation/initgeo.js');
            // 设置app高度
            require('common:widget/appresize/appresize.js');

            // 加载Fastclick
            var FastClick = require('common:widget/fastclick/fastclick.js');
            new FastClick(document.body);

            <!-- ios7不用scrollTo -->
            if(!(/OS 7_\d[_\d]* like Mac OS X/i).test(navigator.userAgent)) {
                scrollTo(0, 0);
            }
        {%/script%}
        {%block name="js"%}{%/block%}
        <!-- 性能监控 标记头部时间 by jican -->
        <script type="text/javascript">PDC && PDC.mark("ht");</script>
    {%/head%}
    {%body%}
        <div id="wrapper">
            {%* 封面 *%}
            {%block name="cover"%}{%/block%}
            {%* 头部 *%}
            {%if ($page_config.header == 1)%}
                {%block name="header"%}
                    {%widget name="common:widget/header/header.tpl"%}
                {%/block%}
            {%/if%}
            {%* 中部 *%}
            <div id="main">
                {%block name="main"%}{%/block%}
            </div>
            
            {%* 底部 *%}
            {%if ($page_config.bottombanner !== 0)%}
                {%widget name="common:widget/bottombanner/bottombanner.tpl"%}
            {%/if%}
            {%if ($page_config.footer !== 0)%}
                {%widget name="common:widget/footer/footer.tpl"%}
            {%/if%}
            {%widget name="common:widget/backtop/backtop.tpl"%}

            <!-- 性能测试和自动化测试监控容器 by jican -->
            <div id="monitor" user-data='{"module":{%json_encode($module)%},"action":{%json_encode($action)%},"page":{%json_encode($page)%}}'></div>
            
        </div>
        <!-- 用于统计1px透明图 -->
        <img id="statImg" style="display:none"/>

        <!-- 内嵌异步公共组件样式和性能监控脚本 by jican-->
        <script type="text/javascript" src="/static/js/pdc/vt.js?__inline"></script>
        <link rel="stylesheet" type="text/css" href="/widget/datepicker/datepicker.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/widget/popup/popup.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/widget/quickdelete/quickdelete.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/widget/suggestion/suggestion.inline.css?__inline">
        <script type="text/javascript" src="/static/js/pdc/pda.js?__inline"></script>
        
        {%script%}
            var stat = require('common:widget/stat/stat.js');
            var module = window._APP_HASH.module;
            var action = window._APP_HASH.action;
            stat.initClickStat();
            if((module == 'index' && action == "index") 
                || (module == 'place' && action == 'list')
                || (module == 'place' && action == 'detail')
                || (module == 'transit' && action == 'list')
                || (module == 'drive' && action == 'list') ){
                stat.addStat(COM_STAT_CODE.FRONT_PV_TIMES);
            }
            //统计组件
            (require('common:widget/statistics/statistics.js')).init();
        {%/script%}
    {%/body%}
{%/html%}
