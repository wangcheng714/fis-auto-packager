{%json file="index/setmylocation.json" assign="loc_conf"%}

<div class="index-widget-hotcity">
	<h4>热门城市</h4>
	<ul>
		{%foreach from=$loc_conf.hotCityData item=hot_item%}
			<li><span class="city-item" data-cityid="{%$hot_item.city_id%}" data-city="{%$hot_item.name%}">{%$hot_item.name%}</span></li>
		{%/foreach%}
		<!--清除浮动-->
		<br style="clear:both"/>
	</ul>
</div>


{%script%}
require("./hotcity.js").init();
{%/script%}
