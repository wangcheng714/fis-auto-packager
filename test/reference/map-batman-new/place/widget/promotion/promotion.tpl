{%* 促销模块（团购，优惠） *%}
{%if ($data.widget.promotion)%}

{%$wdata = $widget_data.data%}
{%$tuan = $wdata.tuan%}
{%$premium = $wdata.ext.detail_info.premium2%}

<div class="place-widget-promotion">
    {%if !empty($tuan.groupon)%}
    {%$point = $data.content.ext.detail_info.point%}
        <a href="{%$tuan.groupon[0].groupon_webapp_url%}&uid={%$data.content.uid%}&from=map_webapp_detail&loc=({%$point.x%},{%$point.y%})" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_GROUPON_CLICK%}, wd:'{%$wd%}', name:'{%$widget_data.name%}', srcname:'{%$widget_data.src_name%}'}">
        {%if !empty($premium)%}
            <div class="place-widget-promotion-groupon">
        {%else%}
            <div class="place-widget-promotion-groupon" style="border-bottom: none;">
        {%/if%}
            <em></em>
            <img src="{%urldecode($tuan.groupon[0].groupon_image)%}">
            <ul>
                <li class="place-widget-promotion-price">
                    <span>￥</span>
                    <span>{%$tuan.groupon[0].groupon_price%}元</span>
                </li>
                <li class="place-widget-promotion-title">{%$tuan.groupon[0].groupon_title|truncate:23:"...":false%}</li>
                <li class="place-widget-promotion-bought">
                    <em>{%$tuan.groupon[0].groupon_num%}人已购买</em>
                    <span class="place-widget-promotion-count">
                    {%if $tuan.groupon|@count>1%}
                        {%$tuan.groupon|@count%}条
                    {%/if%}
                    </span>
                </li>
            </ul>
        </div>
        </a>
    {%/if%}
    {%if !empty($premium)%}
        <a href="{%$widget_data.data.ext.detail_info.promotion_uri|cat:'&detail_part=premium&item_index=0'%}" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_PREMIUM_CLICK%}, wd:'{%$wd%}', srcname:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">
            {%if !empty($tuan.groupon)%}
                <div class="place-widget-promotion-premium">
            {%else%}
                <div class="place-widget-promotion-premium place-widget-promotion-noborder">
            {%/if%}
                <h3>
                    <em></em>
                    {%$premium[0].discount_title%}
                </h3>
            </div>
        </a>
    {%/if%}
</div>
{%script%}
    //添加详情页团购和优惠的展现量
    var stat = require('common:widget/stat/stat.js');

    {%if !empty($premium)%}
        stat.addStat(STAT_CODE.PLACE_DETAIL_PREMIUM_VIEW, {'wd': '{%$wd%}', 'name':'{%$widget_data.name%}', 'srcname':'{%$widget_data.src_name%}'});
    {%/if%}
    {%if !empty($tuan.groupon)%}
        stat.addStat(STAT_CODE.PLACE_DETAIL_GROUPON_VIEW, {'wd': '{%$wd%}', 'name':'{%$widget_data.name%}', 'srcname':'{%$widget_data.src_name%}'});
    {%/if%}
{%/script%}
{%/if%}
