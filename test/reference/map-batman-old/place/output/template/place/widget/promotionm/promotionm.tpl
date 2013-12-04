{%style id="/widget/promotionm/promotionm.inline.less"%}.place-widget-promotionm{border:#e4e4e4 solid 1px;border-radius:.25em;background:#fff;overflow:hidden}.place_preferential:empty{display:none}.clear{clear:both;font-size:0;line-height:0}.place-widget-promotionm-noborder{border:0!important}.place-widget-promotionm em{font-style:normal;display:inline-block;text-align:center}.place-widget-promotionm .groupon_detail{width:70%;float:left}.place-widget-promotionm .groupon_price{width:15%;float:right;margin:0 8px 0 0}.place-widget-promotionm .groupon_icon{width:10%;float:left;height:100%}.place-widget-promotionm-premium{height:40px;line-height:22px;padding-top:0;background:url(/static/place/images/goto_92a90a7.png) 98% center no-repeat;background-size:7px 12px}.place-widget-promotionm-premium>h3{margin-right:5%;font-size:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;line-height:40px}.place-widget-promotionm-premium em{background:url(/static/place/images/place_b6c3cdf.png) no-repeat;background-size:114px 60px;width:20px;height:20px;margin-left:10px;margin-right:4px;background-position:-59px 0;vertical-align:middle}.place-widget-promotionm-groupon{line-height:22px;padding:14px 0 10px;border-bottom:solid 1px #ccced2}.place-widget-promotionm-groupon ul{list-style:none}.place-widget-promotionm-groupon ul li{margin-right:10px}.place-widget-promotionm ul li{color:#585858;margin-right:10px}.place-widget-promotionm .stitle{font-size:14px;line-height:20px;font-weight:600;text-overflow:ellipsis;white-space:nowrap;width:100%;overflow:hidden}.place-widget-promotionm .title{font-size:12px;line-height:20px;height:40px;overflow:hidden;text-overflow:ellipsis}.place-widget-promotionm .price{color:#FE9601;font-size:14px;font-weight:400;white-space:nowrap}.place-widget-promotionm .btn_buy{margin:10px 0 0}.place-widget-promotionm .btn_buy span{color:#fff;font-size:16px;background:#5DABEC;border-radius:3px;padding:7px 11px;font-weight:400}.place-widget-promotionm-groupon em.poi_icon{background:url(/static/place/images/place_b6c3cdf.png) no-repeat;background-size:114px 60px;width:20px;height:20px;margin-left:10px;margin-right:4px;background-position:-80px 0;vertical-align:top}.place-widget-promotionm-groupon>img{border:1px solid #a3a3a3;width:96px;height:72px}.place-widget-promotionm-price{color:#ff9126;font-size:16px;font-weight:700}.place-widget-promotionm-title{color:#585858;font-size:12px;line-height:20px}.place-widget-promotionm-bought{color:#868686;font-size:12px}.place-widget-promotionm-count{float:right}{%/style%}{%* 促销模块（团购，优惠） *%}
{%if ($data.widget.promotion)%}
<div class="place-widget-promotionm">
{%if !empty($widget_data.data.groupon)%}
{%$point = $data.content.ext.detail_info.point%}
<a href="{%$widget_data.data.groupon[0].groupon_webapp_url|f_escape_xml%}&uid={%$data.content.uid|f_escape_path%}&from=map_webapp_detail&loc=({%$point.x|f_escape_path%},{%$point.y|f_escape_path%})" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_GROUPON_CLICK|f_escape_xml%}, wd:'{%$widget_data.src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}'}">
{%if !empty($widget_data.data.premium2)%}
<div class="place-widget-promotionm-groupon">
{%else%}
<div class="place-widget-promotionm-groupon" style="border-bottom: none;">
{%/if%}
<div class="groupon_icon">
<em class="poi_icon"></em>
</div>
<ul class="groupon_detail">
<li class="stitle">{%$widget_data.data.groupon[0].short_title|f_escape_xml%}</li>
<li class="title">{%$widget_data.data.groupon[0].groupon_title|f_escape_xml%}</li>
</ul>
<div class="groupon_price">
<div class="price">
<div style="text-align:right;">
<span>￥</span><span>{%$widget_data.data.groupon[0].groupon_price|f_escape_xml%}元</span>
</div>
</div>
</div>
<div class="clear"></div>
</div>
</a>
{%/if%}
{%if !empty($widget_data.data.premium2)%}
<a href="{%$widget_data.data.promotion_uri|cat:'&detail_part=premium&item_index=0'%}" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_PREMIUM_CLICK|f_escape_xml%}, wd:'{%$widget_data.src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}'}">
{%if !empty($widget_data.data.groupon)%}
<div class="place-widget-promotionm-premium">
{%else%}
<div class="place-widget-promotionm-premium place-widget-promotionm-noborder">
{%/if%}
<h3>
<em></em>
{%$widget_data.data.premium2[0].discount_title|f_escape_xml%}
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
