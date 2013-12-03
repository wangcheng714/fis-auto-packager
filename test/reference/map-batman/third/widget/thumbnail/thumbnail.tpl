<!-- @fileOverview 首页缩略图模板 by jican -->
<div class="index-widget-thumbnail">
    <div class="thumb">
        <div class="thumb-wrap">
            <div class="mappic-loading page-loading slide in">
                <div>
                   <span class="dot-1"></span>
                   <span class="dot-2"></span>
                   <span class="dot-3"></span>
                   <span class="dot-4"></span>
                   <span class="dot-5"></span>
                   <span class="dot-6"></span>
                   <span class="dot-7"></span>
                   <span class="dot-8"></span>
              </div>
            </div>
            <a href="/mobile/webapp/index/index/foo=bar/vt=map&showmygeo=1&forcesample=old_sample_1309" class="thumb-link" data-log="{code:{%$STAT_CODE.STAT_THUMB_IMG_CLICK%},state:'fail'}">
                <img class="thumb-img" src=""/>
            </a>
            <a href="/mobile/webapp/index/index/foo=bar/vt=map&showmygeo=1&forcesample=old_sample_1309" data-log="{code:{%$STAT_CODE.STAT_THUMB_IMG_CLICK%}}" class="error-cnt" >
                <p class="view-map-btn">点击查看地图</p>
            </a>
            <div class="geo-btn"><b class="thumb-icon"></b></div>
             <a href="/mobile/webapp/index/index/foo=bar/vt=map&showmygeo=1&forcesample=old_sample_1309" class="map-btn" data-log="{code:{%$STAT_CODE.STAT_THUMB_FULL_CLICK%}}"><b class="thumb-icon"></b></a>
            <div class="center-marker"><div></div></div>
        </div>
    </div>
    <div class="locbar">
        <div class="locbar-area">
            <span class="thumb-icon"></span>
            <span class="locbar-txt"></span>
        </div>
        <a class="in-btn" href="/mobile/webapp/index/setmylocation" data-log="{code:{%$STAT_CODE.STAT_THUNB_INPUTMYLOC%}}">输入位置</a>
    </div>
</div>

{%script%}
    (require("thumbnail.js")).init();
{%/script%}