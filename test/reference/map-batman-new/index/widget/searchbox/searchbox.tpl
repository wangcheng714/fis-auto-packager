<!-- @fileOverview 首页搜索框模板 by jican-->
<div class="index-widget-searchbox">
    <form class="se-form">
        <div class="se-wrap">
            <div class="se-inner">
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