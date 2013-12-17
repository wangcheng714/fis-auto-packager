<!--@fileOverview 下载客户端封面 -->

<div class="common-widget-cover" id ="body-cover">
    <div class="cover-container" id="cover-container">
        <div class="cover-close" id="cover-close" onclick="cover-close"></div>
        <div class='app-contain'>
            <div class='title-1'>
                <p>用百度地图客户端<br/>流量省<span>90%</span></p>
            </div>
            <div class='title-2'>
                <p>下载<span>离线数据</span>包<br/>轻松导航  飞速浏览</p>
            </div>
        </div>
        <p><a class="app-download" id = "app-download" href="http://mo.baidu.com/map/code/?from=gw10015" target="_blank"><span class="download-bg"></span><em class="download_open" id="download_open">下载</em>客户端</a></p>
        <div class="to-webapp" id = "to-webapp" onclick="__cover.closeCover()">访问网页版</div>
    </div>
    <img src="/mobile/img/t.gif?newmap=1&t=20131202&code={%$COM_STAT_CODE.COVER_DISPLAY%}&">
</div>
<!-- cover会很快展现，需要将js内敛执行，保证用户快速可操作 -->
<script type="text/javascript">
    window.scrollTo(0,0);


    // 为能够让用户早点看到，这里可耻的用了全局变量
    var __cover = {
        hasClosed : false,

        closeCover : function(){
            var expires = new Date(),
                path = "/mobile";
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);

            document.cookie = "hdCover=1; expires=" + expires.toGMTString() + "; path=" + path;
            document.getElementById("body-cover").style.display = "none";
            document.getElementById("wrapper").style.display = "block";

            this.hasClosed = true;

            if("define" in window) {
                require("common:widget/cover/cover.js").sendStat();
            }
        }
    }
</script>

{%script%}
    var cover = require("cover.js");
    cover.init();
{%/script%}

{%style%}
#wrapper {
    display:none;
}
{%/style%}
