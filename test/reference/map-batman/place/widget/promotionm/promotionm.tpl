{%* 促销模块（团购，优惠） *%}
{%if ($data.widget.promotion)%}
<div class="place-widget-promotionm">
    {%if !empty($widget_data.data.groupon)%}
    {%$point = $data.content.ext.detail_info.point%}
        <a href="{%$widget_data.data.groupon[0].groupon_webapp_url%}&uid={%$data.content.uid%}&from=map_webapp_detail&loc=({%$point.x%},{%$point.y%})" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_GROUPON_CLICK%}, wd:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">
		{%if !empty($widget_data.data.premium2)%}
        	<div class="place-widget-promotionm-groupon">
		{%else%}
        	<div class="place-widget-promotionm-groupon" style="border-bottom: none;">
		{%/if%}
                <div class="groupon_icon">
                    <em class="poi_icon"></em>
                </div>
                <ul class="groupon_detail">
                    <li class="stitle">{%$widget_data.data.groupon[0].short_title%}</li>
                    <li class="title">{%$widget_data.data.groupon[0].groupon_title%}</li>
                </ul>
                <div class="groupon_price">
                    <div class="price">
                        <div style="text-align:right;">
                            <span>￥</span><span>{%$widget_data.data.groupon[0].groupon_price%}元</span>
                        </div>
                    </div>
                </div>
                <div class="clear"></div>
        </div>
        </a>
    {%/if%}
    {%if !empty($widget_data.data.premium2)%}
        <a href="{%$widget_data.data.promotion_uri|cat:'&detail_part=premium&item_index=0'%}" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_PREMIUM_CLICK%}, wd:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">
            {%if !empty($widget_data.data.groupon)%}
                <div class="place-widget-promotionm-premium">
            {%else%}
                <div class="place-widget-promotionm-premium place-widget-promotionm-noborder">
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
    var wd = $('.common-widget-nav .title span').text();
    var name = $('.place-widget-captain').find('.name').text();

	{%if !empty($widget_data.data.premium2)%}
		stat.addStat(STAT_CODE.PLACE_DETAIL_PREMIUM_VIEW, {'wd': wd, 'name':name});
	{%/if%}
	{%if !empty($widget_data.data.groupon)%}
		stat.addStat(STAT_CODE.PLACE_DETAIL_GROUPON_VIEW, {'wd': wd, 'name':name});
	{%/if%}
{%/script%}
{%/if%}
