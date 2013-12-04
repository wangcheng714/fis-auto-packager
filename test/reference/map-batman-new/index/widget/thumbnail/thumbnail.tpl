<!-- @fileOverview 首页缩略图模板 by jican -->
<div class="index-widget-thumbnail">
    <div class="locbar">
        <div class="locbar-area">
            <span class="thumb-left"><em class="thumb-icon"></em></span>
            <span class="locbar-txt"></span>
        </div>
        <a class="in-btn" href="/mobile/webapp/index/setmylocation" data-log="{code:{%$STAT_CODE.STAT_THUNB_INPUTMYLOC%}}">修改</a>
    </div>
</div>
{%script%}
    (require("thumbnail.js")).init();
{%/script%}