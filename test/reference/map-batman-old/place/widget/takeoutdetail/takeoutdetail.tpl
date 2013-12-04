{%* 商户详情页 *%}
<div class="place-widget-takeout-detail" style="">
	<div class="rl_dt_header">
		{%$shop = $data.ShopDish.shopInfo%}
		<strong class="rl_li_title">{%if isset($shop.shopName)%}
			{%$shop.shopName%}
		{%else%}
			{%$shop.brandName%}
		{%/if%}
		</strong>
		<p class="fixformargin_price">
			<span class="rl_li_startPrice">起送费：{%$shop.startPrice%}元</span>
			<span class="rl_li_serviceFee">送餐费：{%$shop.serviceFee%}元</span>
		</p>
		<p class="fixforempty fixformargin_star">
			<span class="rl_li_score sm star_wrapper">
				<span class="star_box">
					<span class="star_scroe" style="width:{%$shop.score*15%}px"></span>
				</span>
			</span>
			<span class="rl_li_takeoutTime">
				送餐时间：{%if isset($shop.openTime)%}
					{%$shop.openTime%}
				{%else%}
					暂无信息
				{%/if%}
			</span>
		</p>
	</div>
	<div class="order-phone">
		<a href="tel:{%$shop.telphone%}" id="telphone">
			<div>
				<em></em>
				{%if $shop.telphone == "0"%}
					暂无电话
				{%else%}
					{%if $data.platform == 'ipad'%}
						{%$shop.telphone%}
					{%else%}
						一键订餐
					{%/if%}
				{%/if%}
			</div>
		</a>
	</div>

	{%foreach $data.ShopDish.list as $list%}
	<div id="dishCategory_{%$list.dishCategoryId%}" class="rl_dt_list">
		<p class="rl_dt_title">
			<span style="width: 10px;"></span>
			<em>{%$list.dishCategoryName%}</em>
			<span style="-webkit-box-flex: 1;"></span>
		</p>
		<div>
			{%foreach $list.dishlist as $dish%}
			<p>
				<span class="rl_dt_dishName">{%$dish.dishName%}</span>
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
				util.TelBox.showTb('{%$shop.telphone%}');
			});
	{%/script%}
{%/if%}