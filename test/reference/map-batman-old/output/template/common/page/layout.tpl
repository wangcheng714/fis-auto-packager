<!DOCTYPE HTML>
{%html framework="common:static/js/mod.js" fid="map_batman" sampleRate="0.5"%}
    {%head%}
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" media="(device-height: 568px)" />
        <meta name="format-detection" content="telephone=no" searchtype="map">
        <meta name="apple-mobile-web-app-capable" content="yes"/>       
        <link rel="apple-touch-startup-image"   href="/static/common/images/startup_320_460_96280c8.jpg" />
        <link rel="apple-touch-icon-precomposed" href="/static/common/images/logo_8a799d3.png"/>   
        <title>百度地图</title>
        <script type="text/javascript">/**
 * @fileoverview webspeed性能监控头部代码。非特殊情况不允许修改，否则请联系@jican
 * @author webspeed@baidu.com
 * @require jican@baidu.com
 */
(function() {
    window.PDC = {
        _timing: {},
        _opt: {
            sample: 0.01
        },
        _analyzer: {
            loaded: false,
            url: "http://static.tieba.baidu.com/tb/pms/wpo.pda.js?v=2.9",
            callbacks: []
        },
        _render_start: +new Date,
        extend: function(b, a) {
            for (property in b) {
                a[property] = b[property]
            }
            return a
        },
        metadata: function() {
            var c = this._opt;
            var e = {
                env: {
                    user: (c.is_login == true ? 1 : 0),
                    product_id: c.product_id,
                    page_id: PDC._is_sample(c.sample) ? c.page_id: 0
                },
                render_start: this._render_start,
                timing: this._timing
            };
            var a = [];
            var d = c.special_pages || [];
            for (var b = 0; b < d.length; b++) {
                if (PDC._is_sample(d[b]["sample"])) {
                    a.push(d[b]["id"])
                }
            }
            if (a.length > 0) {
                e.env["special_id"] = "[" + a.join(",") + "]"
            }
            return e
        },
        init: function(a) {
            this.extend(a, this._opt)
        },
        mark: function(a, b) {
            this._timing[a] = b || +new Date
        },
        view_start: function() {
            this.mark("vt")
        },
        tti: function() {
            this.mark("tti")
        },
        page_ready: function() {
            this.mark("fvt")
        },
        first_screen: function() {
            var b = document.getElementsByTagName("img"),
            g = document.getElementsByTagName("IFRAME"),
            c = +new Date;
            var j = [],
            e = this;
            function f(i) {
                var l = 0;
                l = window.pageYOffset ? window.pageYOffset: document.documentElement.scrollTop;
                try {
                    l += i.getBoundingClientRect().top
                } catch(k) {} finally {
                    return l
                }
            }
            this._setFS = function() {
                var m = e._opt["fsHeight"] || document.documentElement.clientHeight;
                for (var l = 0; l < j.length; l++) {
                    var n = j[l],
                    k = n.img,
                    p = n.time,
                    o = f(k);
                    if (o > 0 && o < m) {
                        c = p > c ? p: c
                    }
                }
                e._timing.fs = c
            };
            var h = function() {
                if (this.removeEventListener) {
                    this.removeEventListener("load", h, false)
                }
                j.push({
                    img: this,
                    time: +new Date
                })
            };
            for (var a = 0; a < b.length; a++) { (function() {
                    var i = b[a];
                    if (i.addEventListener) { ! i.complete && i.addEventListener("load", h, false)
                    } else {
                        if (i.attachEvent) {
                            i.attachEvent("onreadystatechange",
                            function() {
                                if (i.readyState == "complete") {
                                    h.call(i, h)
                                }
                            })
                        }
                    }
                })()
            }
            for (var a = 0,
            d = g.length; a < d; a++) { (function() {
                    var i = g[a];
                    if (i.attachEvent) {
                        i.attachEvent("onload",
                        function() {
                            h.call(i, h)
                        })
                    } else {
                        i.addEventListener("load", h, false)
                    }
                })()
            }
        }
    };
    if (document.attachEvent) {
        window.attachEvent("onload", function() {
            PDC.mark("let");
            PDC._setFS && PDC._setFS();
            PDC._opt.ready !== false && PDC._load_analyzer()
        })
    } else {
        window.addEventListener("load", function() {
            PDC.mark("lt")
        },false)
    }
})();</script>
        <script type="text/javascript">
            //由后端返回当前页面的module,action,pagename by jican
            window._APP_HASH = {
                module : {%json_encode($module)%},
                action : {%json_encode($action)%},
                page : {%json_encode($page)%}
            };
        </script>
        <style type="text/css">/**
 * @fileOverview reset基础样式
 */

html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li,
fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure, footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    /*vertical-align: baseline; delete by jican*/
}

div {
    -webkit-tap-highlight-color: rgba(0 , 0, 0, 0);
}

input{
    outline:none;
    font-size: 14px;
}
html, body, form, fieldset, p, div, h1, h2, h3, h4, h5, h6 {
    -webkit-text-size-adjust: none;
}

article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
    display: block;
}
a, input, select, button{
    font-family:'Microsoft YaHei',arial,helvetica,sans-serif;
}
a{
    text-decoration: none;
}
body {
    font-family:'Microsoft YaHei',arial,helvetica,sans-serif;
    -webkit-text-size-adjust:none;
    -webkit-user-select: none;
    font-size: 14px;
}

ol, ul {
    list-style: none;
}

blockquote, q {
    quotes: none;
}

img,table{
    border:0
}

blockquote:before, blockquote:after, q:before, q:after {
    content: '';
    content: none;
}

ins {
    text-decoration: none;
}

del {
    text-decoration: line-through;
}

select {
    -webkit-appearance:button;
    border: 0px;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

.clearfix:after {
    content: '\0020';
    display: block;
    height: 0;
    clear: both;
}

.clearfix {
    *zoom: 1;
}</style>
        <style type="text/css">/**
 * @fileOverview 通用基础样式
 */
body{
    background: #f2f2f2!important;
 /*   position: relative; *//*for 随便看看*/
}
a{
    color: #3b3b3b;
    outline: 0;
}
/*性能监控元素 by jican*/
#monitor,#stat-monitor{
    display: none;
    width: 0; height: 0;
    overflow: hidden;
}

.base-btn{
    display: inline-block;
}

/**
 * headerwrapper
 */
.anibox {
	/*position: absolute;*/
	height: 100%;
	width: 100%;
}
#header-ani-box.need-3d {
    /* 解决iOS上侧边栏出现断开的现象 ，需要开启3d加速 -by jz */
    /*开启3d加速会页面渲染延迟出现断层现象 -by yongxia */
    /* 增加class，只给iPhone和iPod添加下面的样式 -by jz */
    -webkit-transform:translate3d(0, 0, 0);
}
#menu-ani-box{
    /*overflow:hidden;*/
}


/*拨打电话*/
.telbox{
    position:fixed;
    top:50%;
    margin-top: -63px;
    left:50%;
    margin-left: -137px;
    display:block;
    width:274px;
    height:126px;
    border:2px solid #B4B6C3;
    -webkit-border-radius:10px;
    background:-webkit-gradient(radial, 137 -645, 675, 137 -645, 680, from(#5E657F), to(#000F38), color-stop(100%, #4D5874));
    background-color:#000F38;
    z-index: 10000;
}
.telbox .t{height:16px;background:-webkit-gradient(linear, 50% 0%, 50% 100%, from(#7D859C), to(#5E657F));-webkit-border-top-left-radius:10px;-webkit-border-top-right-radius:10px;}
.telbox .c{height:100%;-webkit-border-bottom-left-radius:10px;-webkit-border-bottom-right-radius:10px;}
.telbox .t1{font-size: 18px;text-align: center;color : #FFF;margin-top: 10px;}
.telbox .bt{width: 126px;height: 42px;margin-top: 28px; -webkit-border-radius:3px;-webkit-box-sizing:border-box;  font-size: 18px;  color: #fff;  border: 0px;}
.telbox .qx{float: left;  margin-left: 5px;border-top: 1px solid #7D849E;-webkit-box-shadow:0 1px 1px #2D3C59;background:-webkit-gradient(linear, left top, left bottom, from(#5C677D), to(#0A183D), color-stop(0.5, #273154), color-stop(0.5, #021037));}
.telbox .qd{float: right;margin-right: 5px;border-top: 1px solid #C7D1D3;-webkit-box-shadow:0 2px 1px #2D3A5C;background:-webkit-gradient(linear, left top, left bottom, from(#989BAE), to(#4F5974), color-stop(0.5, #646C81), color-stop(0.5, #3B4664));}
.telbox a{text-decoration:none}


/*圆圈 红色 蓝色*/
/*红色圆*/
/*红色水滴*/
/*加号*/
em.to{width:12px;height:16px;}
em.to.open{background-position:-343px 50%}
/*纯数字*/
em.n{width:18px;text-align:left;}
/*惊叹号*/
em.no{width:1em;height:1.2em;position:absolute;margin-left:-2em;}


/*不同列表需求*/
.list.s3 li{
    padding:6px 25px 6px 34px;
}
.list.s4{
    text-align:center;
    padding:5px;
    font-size:14px;
}
.list.s3 .s6{
    padding:6px 10px;
    font-size:24px;
}
.list.s8 li{
    padding-left:40px;
    border-bottom: 1px solid #e9e9e9;
    /*border-top: 1px solid #F2F2F2;*/
    background-color:#f6f9fb;
}
.list.s8 li dl{
    padding:0.75em 44px 0.75em 0;
    background-color:white;
}
.list.s8 li:last-child{
    border-bottom:none;
}
.list.s8 .bs{
    position: absolute;
    height: 15px;
    width: 14px;
    margin:11px 0 0 -27px;
    background-position:0 -33px;
}
.list.stop_list li{
    padding-left : 2.78em;
}
/*列表内ICO*/
.list .g{color:#666}

em {
    font-style: normal;
    display: inline-block;
    text-align: center;
}

/*结果列表页的右箭头*/
.list .gt{
  width:10px;height:10px;
  background:url(../ui/images/linelist.png) no-repeat 0 -71px; background-size:15px 81px;
  margin-right:5px;
}

/* 星级评分 */
.star-box{
    display:inline-block;
    height: 15px;
    width:75px;
    background:url(/static/common/images/new_star_c90bcb4.png) repeat-x 0 0;
    background-size:15px 33px;
    font-size:14px;
    vertical-align:middle;
}
.star-box .star-scroe{
    display:inline-block;
    height: 15px;
    background:url(/static/common/images/new_star_c90bcb4.png) repeat-x 0 -19px;
    background-size: 15px 33px;
}
/* loading*/
.rotation-keyframes from {
    -webkit-transform: scale(0.32) rotate(0);-moz-transform: scale(0.32) rotate(0);
}
.rotation-keyframes to {
    -webkit-transform: scale(0.32) rotate(360deg);
}
@-webkit-keyframes rotation {from {-webkit-transform: scale(0.32) rotate(0);-moz-transform: scale(0.32) rotate(0);}
to {-webkit-transform: scale(0.32) rotate(360deg);}
}@-moz-keyframes rotation {from {-webkit-transform: scale(0.32) rotate(0);}
to {-webkit-transform: scale(0.32) rotate(360deg);}
}@-o-keyframes rotation {from {-webkit-transform: scale(0.32) rotate(0);}
to {-webkit-transform: scale(0.32) rotate(360deg);}
}@keyframes rotation {from {-webkit-transform: scale(0.32) rotate(0);}
to {-webkit-transform: scale(0.32) rotate(360deg);}
}
.init-loadingbox {
    position: absolute;
    top:50%;
    left:50%;
    z-index: 9999;
    height: 100%;
    /*width:100%;*/
    margin: -55px 0 0 -55px;
}
.page-loading {
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-box-pack: start;
    -webkit-box-align: center;
    background: #f2f2f2;
    /*visibility: hidden;*/
    position: absolute;
    top:0px;
    left:0px;
    z-index: 9000;
    height: 100%; 
    width:100%;
    -webkit-transform-origin: 0px 0px; opacity: 1;
    -webkit-transform: scale(1, 1);
}
.init-loadingbox div, .page-loading div {
    width: 100px;
    height: 100px;
    -webkit-box-align: center;
    -moz-box-align: center;
    box-align: center;
    -webkit-animation: rotation 1.5s linear infinite;
    margin: 0 auto;
}
.init-loadingbox div span, .page-loading div span {
    width: 16px;
    height: 16px;
    -webkit-border-radius: 30px;
    background: rgb(166,166,166);
    position: absolute;
    left: 42px;
    top: 42px;
}
.init-loadingbox .dot-1, .page-loading .dot-1 {-webkit-transform: rotate(0deg) translate(0,-42px);opacity: 0.3;}
.init-loadingbox .dot-2, .page-loading .dot-2 {-webkit-transform: rotate(45deg) translate(0,-42px);opacity: 0.4;}
.init-loadingbox .dot-3, .page-loading .dot-3 {-webkit-transform: rotate(90deg) translate(0,-42px);opacity: 0.5;}
.init-loadingbox .dot-4, .page-loading .dot-4 {-webkit-transform: rotate(135deg) translate(0,-42px);opacity: 0.6;}
.init-loadingbox .dot-5, .page-loading .dot-5 {-webkit-transform: rotate(180deg) translate(0,-42px);opacity: 0.7;}
.init-loadingbox .dot-6, .page-loading .dot-6 { -webkit-transform: rotate(225deg) translate(0,-42px); opacity: 0.8;}
.init-loadingbox .dot-7, .page-loading .dot-7 {-webkit-transform: rotate(270deg) translate(0,-42px);opacity: 0.9;}
.init-loadingbox .dot-8, .page-loading .dot-8 {-webkit-transform: rotate(315deg) translate(0,-42px);opacity: 1;}
#loading-page{
    height: 100%;
    width: 100%;
    position: absolute;
    background: white;
    top: 0;
    left: 0;
}
</style>
        <style type="text/css">/**
 * @fileOverview layout样式，页面整体布局
 */

#main {
    /*position: relative;*/
    background: #f2f2f2;
    /*overflow: hidden;*/
}

#pages {
    height: 100%;
}

#wrapper {
    position: relative; /* important by jz */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

#page-header {
    position: relative;
    z-index: 10;
}

#widgets {
    width: 100%;
    height: 0;
    top: 0;
    left: 0;
    position: absolute;
}

#iscroll-container {
    background-color: #f2f2f2;
    /*min-height: 120px;*/
    position: relative;
    display: block;
}</style>
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
        <script type="text/javascript">/**
 * @fileoverview 页面可见可操作的时候需要处理的逻辑
 * @author jican@baidu.com
 */

(function() {
    // 性能监控可见可操作时间
    PDC && PDC.mark("drt");

    try{
        // 前端统计页面PV
        var module = _APP_HASH.module,
            action = _APP_HASH.action,
            page = _APP_HASH.page;

        document.getElementById('statImg').src = '/mobile/img/t.gif?newmap=1&t=' + Date.now() + '&code=common_43&module=' + module + '&action=' + action + '&page=' + page;
    } catch(e){

    }
})();</script>
        <style type="text/css">/* 日历控件 */
.ui-datepicker {
    width: 100%;
    line-height: 25px;
}

.ui-datepicker-header {
    color: #545454;
    text-align: center;
    padding: 3px 0;
}

.ui-datepicker-header a {
    color: #545454;
    text-decoration: none;
    display: inline-block;
    padding: 8px 10px;
    margin: 0 5px;
    text-align: center;
    line-height: 1.0;
    position: relative;
    bottom: 3px;
}

.ui-datepicker-header a.ui-state-hover {
    background-color: #ccc;
}

.ui-datepicker-header .ui-datepicker-title {
    text-align: center;
    font-weight: bold;
    display: inline-block;
}

.ui-datepicker-calendar {
    width: 100%;
}

.ui-datepicker-calendar tbody {
    background: #c9c9c9;
}

.ui-datepicker-calendar td {
    text-align: center;
    color: #000;
    background: #fafafa;
    border: 1px solid #c9c9c9;
    font-weight: bold;
}

.ui-datepicker-calendar thead tr {
    border: 1px solid #c9c9c9;
}

.ui-datepicker-calendar thead th {
    padding: 10px 0;
    font-weight: bold;
}

.ui-datepicker-calendar a {
    text-decoration: none;
    color: #000;
    display: block;
}

.ui-datepicker-calendar tr.ui-datepicker-gap td {
    display: none;
    padding: 0;
    border: none transparent;
}

.ui-datepicker-calendar tbody td {
    padding: 10px 0;
}

.ui-datepicker-calendar tbody td:first-child {
    border-left: none 0;
}

.ui-datepicker-calendar td.ui-datepicker-unselectable {
    background: #f6f6f6;
    color: #b8b8b8;
    font-weight: normal;
}

.ui-datepicker-calendar td.ui-datepicker-today {
    background: #FBF9EE;
}

.ui-datepicker-calendar td.ui-datepicker-current-day {
    background: #e3f1ff;
    font-weight: bold;
    border-color: #fff;
}

.ui-datepicker-calendar td.ui-state-hover {
    background: #ccc;
}

.ui-datepicker .ui-datepicker-prev {
    float: left;
}

.ui-datepicker .ui-datepicker-next {
    float: right;
}</style>
        <style type="text/css">.common-widget-popup {
    position: fixed;
	max-width: 196px;
    display: block;
    padding: 11px 27px;
    background-color: #000;
    opacity: 0.7;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin: 0 auto;
}</style>
        <style type="text/css">.ui-quickdelete-button{
    height: 20px;
    width: 20px;
    position: absolute;
    top: 1px; 
    right: 1px;
    background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAqCAYAAAAqAaJlAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALzSURBVHjaxJlpb9NAEIZ9pEmcpCWhpUiQqoJK8P9/DggooPYLLQ1J1SN1bDNTvRstrr23y0gjR44dP56daydx5Ccj0inpgHRImuDIsiYtcGRdkV77PCx2BNwnnZHuWN67IV2S/nYBjy0h35LuRWHkhvTcBjo2vIYhDx1XQids5Z+kpS8sL/M70t2oW7kj/QrfbpVU8V1G+gHL37WwUV6S3pI+2MIy6EeHAPKRBMBs5XtT2B4s+pygsltOEXR509vULz5B3vxfwkzvYTQlLEf9RPNjeQCgjeb7PumRyg04kI41GWJB+hlVKnME5aLwCauXaQL8Rs4QMuyxVCrbQE9JK9I/jsBLpKgKn02AL+uwbNW54qY1LFpJ52yBZVAh3C8cKLLSDtLZWoZ9o8mnPfj3qnbeFLgJNEYgjQ0CbiFgE7hAorlpguttgVWgU4MVYVe54HKc4s0ODZfSFtgXVFzPheIuhc/Y1H5T4FUA0H9ay55jCnqN45l0rkK2EO71JRCoSACPgTN0zJc64FCgwm8fYXselagNOAoIKjjjRNMmmgLPFcHhC7qtCUkURjJFma5CdjiF52+sGoKp7sOLAKxFYtAB2YLGHQAzY5W0deWGoG15dB4YeNsbZA4bQgFatgSTa2lW9RbLFG99EBDUt5dokl+i3LI/vDJoZGxAQwJXYq4gLDs02HLbgoYCFuOmrTUvDPZdLqCqwsFG+m6wp3uyU8hhgYFivtDHW7pWprqFY0x7xppJzVnTHuwegRYrOp8+HuZaQgXwNUBnmut/yBvGOtiRQSOeBxiArA1mE5yTv6kmMvzGe7Cgy3zMpotSyUNDjDxJVxXKZ4hBhquUsOjGxEolLLwfdTOP1eXU06hlwJwq/FK4RPpMoBtYdOnifzmcfKLx4RAihii3kUewsEtc4bpRR25xhWDSxonNwweYMs4CQXK+PtdZ0xVWyBjF44VDvi3gk5dRx38tNckugnCE3NmXcmiJqljAeuJPO+c92V8BBgA85NXw63SPuAAAAABJRU5ErkJggg%3D%3D") no-repeat;
    background-position: 0px 0px;
    background-size: 20px 20px;
    -webkit-background-size: 100%;
    -webkit-background-origin: content-box;
    cursor: pointer;
    visibility: hidden;
}</style>
        <style type="text/css">.ui-suggestion{
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    z-index: 9999;
    font-size: 16px;
    border: 1px solid #b1b1b1;
    border-left: none;
    border-right: none;
    background-color:#fff;
}

.ui-suggestion ul{
    list-style: none;
    background: #fff;
}

.ui-suggestion ul li{
    border-bottom: 1px solid #e7e7e7;
    height: 33px;
    line-height: 33px;
}

.ui-suggestion .ui-suggestion-result{
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    cursor: pointer;
}

.ui-suggestion .ui-suggestion-result font{
    color: #878787;
}

.ui-suggestion .ui-suggestion-result span:nth-child(2){
    color: silver;
    font-size: 77%;
}

.ui-suggestion .ui-suggestion-content{
    position: relative;
}

.ui-suggestion .ui-suggestion-button{
    border-top: 1px solid #e7e7e7;
    background: #F2F2F2;
    height: 33px;
    line-height: 33px;
}

.ui-suggestion-button span{
    text-decoration: none;
    text-align: center;
    color: #4B4B4B;
    display: inline-block;
    font-size: 14px;
    padding: 0 10px;
    cursor: pointer;
}

.ui-suggestion-button span:first-child{
    float: left;
    border-right: 1px solid #e7e7e7;
}

.ui-suggestion-button span:last-child{
    float: right;
    border-left: 1px solid #e7e7e7;
}

.ui-input-mask {
    position: relative;
    z-index: 100;
}</style>
        <script type="text/javascript">/**
 * @fileoverview webspeed性能监控头部代码。非特殊情况不允许修改，否则请联系@jican
 * @author webspeed@baidu.com
 * @require jican@baidu.com
 */
(function() {
    PDC.extend({
        _navTiming: window.performance && performance.timing,
        ready: (function(callback) {
            var readyBound = false,
            readyList = [],
            DOMContentLoaded,
            isReady = false;
            if (document.addEventListener) {
                DOMContentLoaded = function() {
                    document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    ready()
                }
            } else {
                if (document.attachEvent) {
                    DOMContentLoaded = function() {
                        if (document.readyState === "complete") {
                            document.detachEvent("onreadystatechange", DOMContentLoaded);
                            ready()
                        }
                    }
                }
            }
            function ready() {
                if (!isReady) {
                    isReady = true;
                    for (var i = 0,
                    j = readyList.length; i < j; i++) {
                        readyList[i]()
                    }
                }
            }
            function doScrollCheck() {
                try {
                    document.documentElement.doScroll("left")
                } catch(e) {
                    setTimeout(doScrollCheck, 1);
                    return
                }
                ready()
            }
            function bindReady() {
                if (readyBound) {
                    return
                }
                readyBound = true;
                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    window.addEventListener("load", ready, false)
                } else {
                    if (document.attachEvent) {
                        document.attachEvent("onreadystatechange", DOMContentLoaded);
                        window.attachEvent("onload", ready);
                        var toplevel = false;
                        try {
                            toplevel = window.frameElement == null
                        } catch(e) {}
                        if (document.documentElement.doScroll && toplevel) {
                            doScrollCheck()
                        }
                    }
                }
            }
            bindReady();
            return function(callback) {
                isReady ? callback() : readyList.push(callback)
            }
        })(),
        Cookie: {
            set: function(name, value, max_age) {
                max_age = max_age || 10;
                var exp = new Date();
                exp.setTime(new Date().getTime() + max_age * 1000);
                document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString()
            },
            get: function(name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) {
                    return unescape(arr[2])
                }
                return null
            },
            remove: function(name) {
                this.set(name, "", -1)
            }
        },
        _is_sample: function(ratio) {
            if (!PDC._random) {
                PDC._random = Math.random()
            }
            return PDC._random <= ratio
        },
        _load_analyzer: function() {
            var special_pages = this._opt.special_pages || [];
            var radios = [this._opt.sample];
            for (var i = 0; i < special_pages.length; i++) {
                radios.push(special_pages[i]["sample"])
            }
            var radio = Math.max.apply(null, radios);
            if (PDC._is_sample(radio) == false) {
                return
            }
            PDC._analyzer.loaded = true;
            PDC._load_js(PDC._analyzer.url,
            function() {
                var callbacks = PDC._analyzer.callbacks;
                for (var i = 0,
                l = callbacks.length; i < l; i++) {
                    callbacks[i]()
                }
            })
        },
        _load_js: function(url, callback) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    script.onload = script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(url, true)
                    }
                }
            };
            script.onerror = function(e) {
                if (typeof callback === "function") {
                    callback(url, false)
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script)
        },
        send: function() {
            if (PDC._analyzer.loaded == true) {
                WPO_PDA.send()
            } else {
                PDC._load_analyzer();
                PDC._analyzer.callbacks.push(function() {
                    WPO_PDA.send()
                })
            }
        },
        _setWtCookie: function () {
            if(!PDC._issetJT) {
                //console.log('set wt cookie');
                PDC._issetJT = true;
                PDC.Cookie.set("PMS_JT", '({"s":' + ( + new Date) + ',"r":"' + document.URL.replace(/#.*/, "") + '"})');
            }
        }
    },PDC);
    !function() {
        var Cookie = PDC.Cookie,
        jt = Cookie.get("PMS_JT"),
        isset = false;
        PDC._issetJT = false;
        if (jt) {
            Cookie.remove("PMS_JT");
            PDC._issetJT = false;
            jt = eval(jt);
            // 如果从开始点击到页面渲染起始时间（即页面跳转时间）超过100ms才统计）
            // 统计用户等待时间指标为wt（wait_time,实际的白屏是wt+头部加载，展现时已做处理)
            // 注释掉该条件判断 因为webapp简版特殊处理 by jican
            //if (!jt.r || document.referrer.replace(/#.*/, "") == jt.r) {
                //console.log('wt', PDC._render_start - jt.s);
                (PDC._render_start - jt.s) > 100 && PDC.mark("wt", (PDC._render_start - jt.s))
            //}
        }
        function findParent(tagname, el) {
            var flag = 0;
            if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
                return el
            }
            while (el = el.parentNode) {
                flag++;
                if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
                    return el
                }
                if (flag >= 4) {
                    return null
                }
            }
            return null
        }
        function clickHandle(e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            var from = findParent("a", target);
            if (from) {
                var url = from.getAttribute("href");
                if (!/^#|javascript:/.test(url)) {
                    PDC._setWtCookie();
                    isset = true
                }
            }
            return false
        }
        if (document.attachEvent) {
            document.attachEvent("onclick", clickHandle)
        } else {
            document.addEventListener("click", clickHandle, false)
        }
    } ();
    PDC.ready(function() {
        PDC.mark("c_drt");
    });
    if (document.attachEvent) {
        window.attachEvent("onload", function() {
            PDC.mark("lt")
        }, false)
    } else {
        window.addEventListener("load", function() {
            PDC.mark("let");
            PDC._setFS && PDC._setFS();
            PDC._opt.ready !== false && PDC._load_analyzer()
        })
    }
})();</script>
        
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
    {%require name='common:page/layout.tpl'%}{%/body%}
{%/html%}
