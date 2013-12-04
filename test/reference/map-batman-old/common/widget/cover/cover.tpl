<!--@fileOverview 下载客户端封面 -->
<div class="common-widget-cover" id ="body-cover" style="display:none;">
    <div class="cover-container" id="cover-container">
        <div class="cover-close" id="cover-close"></div>
        <div class='app-contain'>
            <div class='title-1'>
                <p>用百度地图客户端<br/>流量省<span>90%</span></p>
            </div>
            <div class='title-2'>
                <p>下载<span>离线数据</span>包<br/>轻松导航  飞速浏览</p>
            </div>
        </div>
        <p><a class="app-download" id = "app-download" href="" target="_blank"><span class="download-bg"></span><em class="download_open" id="download_open">下载</em>客户端</a></p>
        <div class="to-webapp" id = "to-webapp">访问网页版</div>
    </div>
</div>
{%script%}
    var cover = require("cover.js");
    try{
        cover.netype = {%$netype%};
    }catch(e){
        cover.netype = 0;
    }
    cover.init();
{%/script%}