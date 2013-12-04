<!-- @fileOverview 首页搜索框模板 by jican-->
<div class="index-widget-searchbox">
    <div class="se-tabs">
        <a class="se-tab se-tab-map" href="/mobile/#index/index/foo=bar/vt=map"><span class="new-se-tab-icon icon-l"></span>地图</a>
        <a class="se-tab se-tab-poi" href="javascript:void(0);"><span class="new-se-tab-icon icon-m"></span>周边</a>
        <a class="se-tab se-tab-nav" href="javascript:void(0);" jsaction="toNavSearch"><span class="new-se-tab-icon icon-r"></span>路线</a>
    </div>
    <form class="se-form">
        <div class="se-wrap">
            <div class="se-inner">
                <!--<div class="se-city">
                    <a class="se-city-wd" href="/mobile/webapp/index/setmylocation/foo=bar/" data-log="{code:{%$STAT_CODE.STAT_SWITCH_CITY%}}">全国</a>
                    <em></em>
                </div>-->
                <div class="se-input">
                    <input key="place" type="text" class="se-input-poi" id="se-input-poi" placeholder="搜索地点、公交车、路线"/>
                </div>
                <div class="se-btn" id="se-btn" user-data="se-btn">搜索</div>
            </div>
        </div>
    </form>
</div>
{%script%}
    (require("searchbox.js")).init();
{%/script%}