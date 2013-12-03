{%* 促销模块（团购，优惠） *%}

{%if ($data.widget.promotion)%}
<div class="place-widget-promotion">
    {%if !empty($widget_data.data.groupon)%}
    {%$point = $data.content.ext.detail_info.point%}
        <a href="{%$widget_data.data.groupon[0].groupon_webapp_url%}&uid={%$data.content.uid%}&from=map_webapp_detail&loc=({%$point.x%},{%$point.y%})" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_GROUPON_CLICK%}, wd:'{%$wd%}', name:'{%$widget_data.name%}', srcname:'{%$widget_data.src_name%}'}">
		{%if !empty($widget_data.data.premium2)%}
        	<div class="place-widget-promotion-groupon">
		{%else%}
        	<div class="place-widget-promotion-groupon" style="border-bottom: none;">
		{%/if%}
            <em></em>
            <img src="{%urldecode($widget_data.data.groupon[0].groupon_image)%}">
            <ul>
                <li class="place-widget-promotion-price">
                    <span>￥</span>
                    <span>{%$widget_data.data.groupon[0].groupon_price%}元</span>
                </li>
                <li class="place-widget-promotion-title">{%$widget_data.data.groupon[0].groupon_title|truncate:23:"...":false%}</li>
                <li class="place-widget-promotion-bought">
                    <em>{%$widget_data.data.groupon[0].groupon_num%}人已购买</em>
                    <span class="place-widget-promotion-count">
                    {%if $widget_data.data.groupon|@count>1%}
						{%$widget_data.data.groupon|@count%}条
                    {%/if%}
                    </span>
                </li>
            </ul>
        </div>
        </a>
    {%/if%}
    {%if !empty($widget_data.data.premium2)%}
        <a href="{%$widget_data.data.promotion_uri|cat:'&detail_part=premium&item_index=0'%}" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_PREMIUM_CLICK%}, wd:'{%$wd%}', srcname:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">
            {%if !empty($widget_data.data.groupon)%}
                <div class="place-widget-promotion-premium">
            {%else%}
                <div class="place-widget-promotion-premium place-widget-promotion-noborder">
            {%/if%}
                <h3>
                    <em></em>
                    {%$widget_data.data.premium2[0].discount_title%}
                </h3>
            </div>
        </a>
    {%/if%}
</div>
{%script%}
    //添加详情页团购和优惠的展现量
	var stat = require('common:widget/stat/stat.js');

	{%if !empty($widget_data.data.premium2)%}
		stat.addStat(STAT_CODE.PLACE_DETAIL_PREMIUM_VIEW, {'wd': '{%$wd%}', 'name':'{%$widget_data.name%}', 'srcname':'{%$widget_data.src_name%}'});
	{%/if%}
	{%if !empty($widget_data.data.groupon)%}
		stat.addStat(STAT_CODE.PLACE_DETAIL_GROUPON_VIEW, {'wd': '{%$wd%}', 'name':'{%$widget_data.name%}', 'srcname':'{%$widget_data.src_name%}'});
	{%/if%}
{%/script%}
{%/if%}
