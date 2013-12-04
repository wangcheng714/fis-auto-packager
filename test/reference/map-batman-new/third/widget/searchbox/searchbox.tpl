<!-- @fileOverview 首页搜索框模板 by jican-->
<div class="index-widget-searchbox">
    <div class="se-tabs">
        <a class="se-tab se-tab-poi" href="javascript:void(0);">搜索</a>
        <a class="se-tab se-tab-nav" href="javascript:void(0);" jsaction="toNavSearch">路线</a>
    </div>
    <form class="se-form">
        <div class="se-wrap">
            <div class="se-inner">
                <div class="se-city">
                    <a class="se-city-wd" href="/mobile/webapp/index/setmylocation/foo=bar/" data-log="{code:{%$STAT_CODE.STAT_SWITCH_CITY%}}">全国</a>
                    <em></em>
                </div>
                <div class="se-input">
                    <input key="place" type="text" class="se-input-poi" id="se-input-poi"/>
                </div>
                <div class="se-btn" id="se-btn" user-data="se-btn"><b></b></div>
            </div>
        </div>
    </form>
</div>
{%script%}
    (require("searchbox.js")).init();
{%/script%}