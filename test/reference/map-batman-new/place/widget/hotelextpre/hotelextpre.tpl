{%$premium = $widget_data.ext.detail_info.premium2%}
{%if $premium && count($premium) %}
    <a id="detail-premium" href="{%$widget_data.ext.detail_info.promotion_uri|cat:'&detail_part=premium&item_index=0'%}" class="hotel-card"
       data-log="{code:{%$STAT_CODE.PLACE_DETAIL_PREMIUM_CLICK%}">
        <em></em>
        <p class="premium-text hotel-gotoarr">{%$premium[0].discount_title%}</p>
    </a>
    {%script%}
        var stat = require('common:widget/stat/stat.js');

        // 详情页优惠展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_PREMIUM_VIEW);
    {%/script%}
{%/if%}