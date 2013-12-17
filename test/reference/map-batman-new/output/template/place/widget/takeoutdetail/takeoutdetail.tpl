{%style id="/widget/takeoutdetail/takeoutdetail.inline.less"%}.place-widget-takeout-detail{}.place-widget-takeout-detail .star_box{display:inline-block;height:15px;width:75px;background:url(/static/place/images/star_a9ede79.png) repeat-x 0 0;background-size:15px 33px;font-size:14px;vertical-align:middle}.place-widget-takeout-detail .star_box .star_scroe{display:inline-block;height:15px;background:url(/static/place/images/star_a9ede79.png) repeat-x 0 -19px;background-size:15px 33px}.place-widget-takeout-detail .takeout,.place-widget-takeout-detail .place-widget-takeout-detail{background-color:#F2F2F2;position:relative}.place-widget-takeout-detail .rl_dt_header{margin:10px}.place-widget-takeout-detail .rl_dt_header p{line-height:22px}.place-widget-takeout-detail .rl_dt_header span{font-size:12px;color:#4C4C4C}.place-widget-takeout-detail .rl_dt_header .rl_li_title{font-size:16px;font-weight:400;color:#333}.place-widget-takeout-detail .rl_dt_header .star_wrapper{margin-right:16px}.place-widget-takeout-detail .order-phone{height:55px;width:100%;margin-bottom:10px;background-color:rgba(255,255,255,.95);text-align:center;-webkit-box-shadow:0 0 3px rgba(0,0,0,.3);box-shadow:0 0 3px rgba(0,0,0,.3)}.place-widget-takeout-detail .order-phone a{display:inline-block;width:100%;color:#518D3B;word-wrap:normal;overflow:hidden;padding:0;font-size:13px;text-decoration:none;outline:0;color:#3e8421;font-size:16px;line-height:40px}.place-widget-takeout-detail .order-phone a div{height:40px;margin:7px 10px;text-align:center;border:1px solid #BCBCBC;border-radius:.4em;background:-webkit-gradient(linear,0 100%,0 0,from(#f1f1f1),to(#f2f2f2))}.place-widget-takeout-detail .order-phone a div em{background:url(/static/place/images/tel_icon2_3049df8.png) 0 0 no-repeat;background-size:11px 16px;width:18px;height:18px;margin-top:-4px;margin-right:6px;vertical-align:middle}.place-widget-takeout-detail .rl_dt_list:last-child{border-top:0}.place-widget-takeout-detail .rl_dt_list .rl_dt_title{display:-webkit-box}.place-widget-takeout-detail .rl_dt_list .rl_dt_title span{display:-webkit-box;height:10px;line-height:10px;border-bottom:1px dashed #BCBCBC}.place-widget-takeout-detail .rl_dt_list .rl_dt_title em{font-size:14px;color:#FF3100;margin:0 10px}.place-widget-takeout-detail .rl_dt_list div{margin:10px;border:1px solid #BCBCBC;border-radius:.4em;background-color:#FEFEFE}.place-widget-takeout-detail .rl_dt_list div p{padding:0 10px;border-bottom:1px solid #E8E8E8}.place-widget-takeout-detail .rl_dt_list div p:last-child{border-bottom:0}.place-widget-takeout-detail .rl_dt_list div p span{font-size:14px;color:#333;height:34px;line-height:34px;vertical-align:middle;display:inline-block}.place-widget-takeout-detail .rl_dt_dishName{text-align:left;overflow:hidden;width:79%;white-space:nowrap;text-overflow:ellipsis}.place-widget-takeout-detail .rl_dt_dishPrice{text-align:right;width:20%;min-width:40px;overflow:hidden}.place-widget-takeout-detail .rl_li_startPrice,.place-widget-takeout-detail .rl_li_serviceFee{display:inline-block;width:45%}{%/style%}{%* 商户详情页 *%}
<div class="place-widget-takeout-detail" style="">
<div class="rl_dt_header">
{%$shop = $data.ShopDish.shopInfo%}
<strong class="rl_li_title">{%if isset($shop.shopName)%}
{%$shop.shopName|f_escape_xml%}
{%else%}
{%$shop.brandName|f_escape_xml%}
{%/if%}
</strong>
<p class="fixformargin_price">
<span class="rl_li_startPrice">起送费：{%$shop.startPrice|f_escape_xml%}元</span>
<span class="rl_li_serviceFee">送餐费：{%$shop.serviceFee|f_escape_xml%}元</span>
</p>
<p class="fixforempty fixformargin_star">
<span class="rl_li_score sm star_wrapper">
<span class="star_box">
<span class="star_scroe" style="width:{%$shop.score*15|f_escape_xml%}px"></span>
</span>
</span>
<span class="rl_li_takeoutTime">
送餐时间：{%if isset($shop.openTime)%}
{%$shop.openTime|f_escape_xml%}
{%else%}
暂无信息{%/if%}
</span>
</p>
</div>
<div class="order-phone">
<a href="tel:{%$shop.telphone|f_escape_path%}" id="telphone">
<div>
<em></em>
{%if $shop.telphone == "0"%}
暂无电话{%else%}
{%if $data.platform == 'ipad'%}
{%$shop.telphone|f_escape_xml%}
{%else%}
一键订餐{%/if%}
{%/if%}
</div>
</a>
</div>
{%foreach $data.ShopDish.list as $list%}
<div id="dishCategory_{%$list.dishCategoryId|f_escape_xml%}" class="rl_dt_list">
<p class="rl_dt_title">
<span style="width: 10px;"></span>
<em>{%$list.dishCategoryName|f_escape_xml%}</em>
<span style="-webkit-box-flex: 1;"></span>
</p>
<div>
{%foreach $list.dishlist as $dish%}
<p>
<span class="rl_dt_dishName">{%$dish.dishName|f_escape_xml%}</span>
<span class="rl_dt_dishPrice">￥{%round($dish.price)%}</span>
</p>
{%/foreach%}
</div>
</div>
{%/foreach%}
</div>
{%script%}
	$('#telphone').click(function(){
		var stat = require('common:widget/stat/stat.js');
		var name = $('.rl_li_title').text();
		stat.addStat(STAT_CODE.PLACE_TAKEOUT_DETAIL_TELPHONE, {'name':name});
	});
{%/script%}
{%if $data.platform == 'android'%}
{%script%}
		var util = require('common:static/js/util.js');
		$('.place-widget-takeout-detail .order-phone a')
			.attr('href', 'javascript:void(0)')
			.on('click', function() {
				util.TelBox.showTb('{%$shop.telphone|f_escape_js%}');
			});
	{%/script%}
{%/if%}