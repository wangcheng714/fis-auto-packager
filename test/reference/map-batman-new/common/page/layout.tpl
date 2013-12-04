<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js"%}
    {%head%}
        <script type="text/javascript">var c_t0=+new Date;</script>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" media="(device-height: 568px)" />
        <meta name="format-detection" content="telephone=no" searchtype="map">
        <meta name="apple-mobile-web-app-capable" content="yes"/>       
        <meta name="apple-mobile-web-app-status-bar-style" content="black" /> 
        <link rel="apple-touch-startup-image"   href="/static/images/startup_320_460.jpg" />
        <link rel="apple-touch-icon-precomposed" href="/static/images/logo.png"/>   
        <title>百度地图</title>
        <script type="text/javascript" src="/static/js/pdc/pdc.js?__inline"></script>
        <script type="text/javascript">
            window._APP_HASH = {
                module : {%json_encode($module)%},
                action : {%json_encode($action)%},
                page : {%json_encode($page)%},
                third_party : {%json_encode($third_party)%} || ''
            };
            window._WISE_INFO = {%json_encode($wise_info)%} || {};
            window._SERVER_TIME = {%json_encode($server_time)%} || 0;
        </script>
        <link rel="stylesheet" type="text/css" href="/static/css/reset.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/static/css/base.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/static/css/layout.inline.css?__inline">
        {%require name="common:static/js/libs/zepto.js"%}
        {%require name="common:static/js/libs/listener.js"%}
        {%require name="common:static/js/libs/lazyload.js"%}
        {%require name="common:static/js/libs/BigPipe.js"%}
        {%require name="common:static/js/libs/page.js"%}
        {%* 引入对应模块的统计json *%}
        {%json file="{%$module%}/statcode.json" assign="STAT_CODE"%}
        {%json file="common/statcode.json" assign="COM_STAT_CODE"%}


        {%widget_block pagelet_id="page_data"%}
            {%* page数据，这里的数据每次都会被加载（单页和多页） *%}
            {%script%}
                STAT_CODE = {%json_encode($STAT_CODE)%} || {};
                if(!STAT_CODE) {
                    throw "STAT_CODE parse error";
                }
            {%/script%}
        {%/widget_block%}
        {%script%}

            COM_STAT_CODE = {%json_encode($COM_STAT_CODE)%} || {};
            if(!COM_STAT_CODE) {
                throw "COM_STAT_CODE parse error";
            }


            window._DEFAULT_CITY = {%json_encode($initData)%} || {};
            //initGeo的时候，会重置_CURRENT_CITY，但是下面的设置_CURRENT_CITY时机太晚了，所以需要保留这里的设置
            window._CURRENT_CITY = {%json_encode($data.current_city)%};
            window._isPushState = "{%$isPushState%}" === "true";

            // 性能监控初始化 by jican
            (require('common:widget/monitor/monitor.js')).init();

            appPage.start({
                selector : "a,[data-href]",
                validate : /^\/mobile\/webapp/i,
                pagelets : ["pager","page_data"],
                containerId : "wrapper",
                pushState : window._isPushState,
                layer : "#wrapper"
            });

            //初始化app，包括发起定位，初始化屏幕高度，设置fastclick等
            require('common:widget/initapp/initapp.js').init();

            <!-- ios7不用scrollTo -->
            if(!(/OS 7_\d[_\d]* like Mac OS X/i).test(navigator.userAgent)) {
                window.scrollTo(0, 0);
            }
        {%/script%}
        <!-- 性能监控 标记头部时间 by jican -->
        <script type="text/javascript">PDC && PDC.mark("ht");</script>
    {%/head%}
    {%body%}

        {%* 封面 *%}
        {%block name="cover"%}{%/block%}
        
        <div id="wrapper" {%if ($module == 'third' && ($action == 'transit' || $action == 'weather'))%}
                            class="bg-white"
                        {%/if%}>
            {%widget_block pagelet_id="pager"%}
                {%* 这里的逻辑每次切页都会被执行 *%}
                {%script%}
                    // 保存当前城市，如果城市发生变化，需要重设当前城市
                    window._CURRENT_CITY = {%json_encode($data.current_city)%} || window._CURRENT_CITY;
                   require('common:widget/geolocation/initgeo.js').changeCity();
                    // 由后端返回当前页面的module,action,pagename,third_party
                    window._APP_HASH = {
                        module : {%json_encode($module)%},
                        action : {%json_encode($action)%},
                        page : {%json_encode($page)%},
                        third_party : {%json_encode($third_party)%} || ''
                    };
                    
                    // 重设server_time 和 wise_info, 统计切页时性能
                    window._WISE_INFO = {%json_encode($wise_info)%} || {};
                    window._SERVER_TIME = {%json_encode($server_time)%} || 0;

                {%/script%}                
                {%block name="js"%}{%/block%}

                <div id="page-wrapper">
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
                    {%widget name="common:widget/stat/pvstat.tpl"%}
                    {%block name="footer"%}
                        {%if !$kehuduan%}   {%*增加客户端套壳页面中是否显示footer的逻辑 by zmm*%}
                            {%widget name="common:widget/bottombanner/bottombanner.tpl"%}
                            {%widget name="common:widget/footer/footer.tpl"%}
                            {%widget name="common:widget/backtop/backtop.tpl"%}
                        {%/if%}
                    {%/block%}
                    
                    <!-- 性能测试和自动化测试监控容器 by jican -->
                    <div id="monitor" user-data='{"module":{%json_encode($module)%},"action":{%json_encode($action)%},"page":{%json_encode($page)%}}'></div>
                </div>  
            {%/widget_block%}
            
        </div>

        <!-- 底图相关 -->
        {%widget name="common:widget/map/map.tpl"%}

        <!-- 用于统计1px透明图 -->
        <img id="statImg" style="display:none"/>

        <!-- 内嵌异步公共组件样式和性能监控脚本 by jican-->
        <script type="text/javascript" src="/static/js/pdc/vt.js?__inline"></script>
        <link rel="stylesheet" type="text/css" href="/widget/datepicker/datepicker.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/widget/map/apiext.inline.less?__inline">
        <link rel="stylesheet" type="text/css" href="/widget/popup/popup.inline.css?__inline">
        <link rel="stylesheet" type="text/css" href="/static/css/gmu.inline.css?__inline"> 
        <script type="text/javascript" src="/static/js/pdc/pda.js?__inline"></script>

        
        {%script%}
            var stat = require('common:widget/stat/stat.js');
            stat.initClickStat();
            require.async('common:widget/geolocation/geolocation.js', function(exports){
                exports.init();
            });
            //统计组件
            (require('common:widget/statistics/statistics.js')).init();
        {%/script%}

    {%/body%}
{%/html%}
