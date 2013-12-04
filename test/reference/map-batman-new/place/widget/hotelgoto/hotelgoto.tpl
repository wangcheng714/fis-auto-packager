<div class="hotel-goto">
    <a class="needsclick" href="{%$widget_data.nearby %}"
       data-log="{code: {%$STAT_CODE.PLACE_DETAIL_NEAR_CLICK%}, name:'{%$data.content.name%}', srcname:'hotel'">
        <span class="btn-wrap">
            <span class="search-btn">搜周边</span>
        </span>
    </a>
    <a class="needsclick" href="{%$widget_data.to %}"
       data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK%}, name:'{%$data.content.name%}', srcname:'hotel'}">
        <span class="btn-wrap">
            <span class="goto-btn">到这儿去</span>
        </span>
    </a>
    {%if $data.content.ext && $data.content.ext.detail_info && $data.content.phone %}
        <a class="needsclick" href="tel:{%$data.content.phone%}"
           data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK%}, name:'{%$data.content.name%}', srcname:'hotel'}">
            <span class="btn-wrap">
                <span class="shoptel-btn">电话</span>
            </span>
        </a>
    {%/if%}
</div>