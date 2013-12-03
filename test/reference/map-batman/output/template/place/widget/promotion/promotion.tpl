{%style id="/widget/promotion/promotion.inline.less"%}/**
*@require place:static/css/detail.less
*/
/* --start-- 详情页促销widget样式（包括团购，优惠）-- */
.place-widget-promotion {
  border: #838991 solid 1px;
  border-radius: .25em;
}
.place-widget-promotion-noborder {
  border: none !important;
}
.place-widget-promotion em {
  font-style: normal;
  display: inline-block;
  text-align: center;
}
.place-widget-promotion-premium {
  height: 40px;
  line-height: 22px;
  padding-top: 0px;
  background: url('/static/place/images/goto_0518661.png') 98% center no-repeat;
  background-size: 7px 12px;
}
.place-widget-promotion-premium > h3 {
  margin-right: 5%;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 40px;
}
.place-widget-promotion-premium em {
  background: url('/static/place/images/place_b6c3cdf.png') no-repeat;
  background-size: 114px 60px;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 4px;
  background-position: -59px 0;
  vertical-align: middle;
}
.place-widget-promotion-groupon {
  height: 90px;
  line-height: 22px;
  padding-top: 14px;
  border-bottom: solid 1px #ccced2;
}
.place-widget-promotion-groupon ul {
  list-style: none;
  margin-left: 140px;
  margin-top: -84px;
}
.place-widget-promotion-groupon ul li {
  margin-right: 10px;
}
.place-widget-promotion-groupon > em {
  background: url(/static/place/images/place_b6c3cdf.png) no-repeat;
  background-size: 114px 60px;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  margin-right: 4px;
  background-position: -80px 0;
  vertical-align: top;
}
.place-widget-promotion-groupon > img {
  border: 1px solid #a3a3a3;
  width: 96px;
  height: 72px;
}
.place-widget-promotion-price {
  color: #ff9126;
  font-size: 16px;
  font-weight: bold;
}
.place-widget-promotion-title {
  color: #585858;
  font-size: 12px;
  line-height: 20px;
}
.place-widget-promotion-bought {
  color: #868686;
  font-size: 12px;
}
.place-widget-promotion-count {
  float: right;
}
/* --end-- 详情页促销widget样式（包括团购，优惠）-- */{%/style%}{%* 促销模块（团购，优惠） *%}

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
