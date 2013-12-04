{%if $widget_data.groupon && count($widget_data.groupon) %}
    {%$groupon = $widget_data.groupon[0]%}
    <a href="{%$groupon.groupon_webapp_url%}&uid={%$widget_data.uid%}&from=map_webapp_detail&loc=({%$widget_data.ext.detail_info.point.x%},{%$widget_data.ext.detail_info.point.y%})"
       data-log="{code:{%$STAT_CODE.PLACE_DETAIL_GROUPON_CLICK%}}" id="detail-groupon" class="hotel-card">
        <em></em>
        <img class="tuan-img" src="{%urldecode($groupon.groupon_image)%}" />
        <ul class="groupon-detail hotel-gotoarr">
            <li class="groupon-name">{%$groupon.groupon_brandtag%}</li>
            <li class="groupon-tit">
                {%if strlen($groupon.groupon_title)%}
                    {%mb_substr($groupon.groupon_title, 0, 20)%}...
                {%else%}
                    {%$groupon.groupon_title%}
                {%/if%}
            </li>
            <li class="groupon-price">
                <span class="price-icon">&yen;{%$groupon.groupon_price%}元</span>
                {%if count($widget_data.groupon) > 1 %}
                    <span class="groupon-count">{%count($widget_data.groupon)%}条</span>
                {%/if%}
            </li>
        </ul>
    </a>
    {%script%}
        var stat = require('common:widget/stat/stat.js');

        // 详情页团购展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_GROUPON_VIEW);
    {%/script%}
{%/if%}