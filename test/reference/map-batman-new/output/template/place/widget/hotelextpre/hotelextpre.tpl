{%style id="/widget/hotelextpre/hotelextpre.inline.less"%}#place-pagelet-hotelextpre em{background:url(/static/place/images/place_b6c3cdf.png) no-repeat 0 -58px;background-size:114px 60px;width:20px;height:20px;display:block;margin-right:8px}#detail-premium{display:-webkit-box;-webkit-box-pack:justify}#detail-premium em{background-position:-59px 0}#detail-premium .premium-text{-webkit-box-flex:1;text-overflow:ellipsis;padding-right:10px;color:#3B3B3B;font:14px "微软雅黑","宋体"}.hotel-gotoarr{background:url(/static/place/images/goto_92a90a7.png) #fff right center no-repeat;background-size:7px 12px}{%/style%}{%$premium = $widget_data.ext.detail_info.premium2|f_escape_xml%}
{%if $premium && count($premium) %}
<a id="detail-premium" href="{%$widget_data.ext.detail_info.promotion_uri|cat:'&detail_part=premium&item_index=0'|f_escape_xml%}" class="hotel-card"
       data-log="{code:{%$STAT_CODE.PLACE_DETAIL_PREMIUM_CLICK|f_escape_xml%}">
<em></em>
<p class="premium-text hotel-gotoarr">{%$premium[0].discount_title|f_escape_xml%}</p>
</a>
{%script%}
        var stat = require('common:widget/stat/stat.js');

        // 详情页优惠展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_PREMIUM_VIEW);
    {%/script%}
{%/if%}