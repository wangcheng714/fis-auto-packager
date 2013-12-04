
{%if ($action == 'setsubwaycity')%}
    {%json file="index/setsubwaycity.json" assign="loc_conf"%}
{%else%}
    {%json file="index/setmylocation.json" assign="loc_conf"%}
{%/if%}
<div class="index-widget-hotcity">
	<h4>热门城市</h4>
	<ul>
		{%foreach from=$loc_conf.hotCityData item=hot_item%}
			<li><span class="city-item" data-cityid="{%$hot_item.city_id%}" data-city="{%$hot_item.name%}" data-cityeng="{%$hot_item.eng%}">{%$hot_item.name%}</span></li>
		{%/foreach%}
		<!--清除浮动-->
		<br style="clear:both"/>
	</ul>
</div>


{%script%}
require("./hotcity.js").init();
{%/script%}
