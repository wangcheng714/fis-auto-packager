{%if $action == 'settrafficcity'%}
	{%json file="third/settrafficcity.json" assign="loc_conf"%}
{%else%}
	{%json file="third/setmylocation.json" assign="loc_conf"%}
{%/if%}

<div class="third-widget-hotcity">
	<h4>热门城市</h4>
	<ul>
		{%foreach from=$loc_conf.hotCityData item=hot_item%}
			<li>
				<span class="city-item" data-cityid="{%$hot_item.city_id%}" data-city="{%$hot_item.name%}"
					{%if ($hot_item.x && $hot_item.y)%}
						data-x="{%$hot_item.x%}" data-y="{%$hot_item.y%}"
					{%/if%}>{%$hot_item.name%}</span>
			</li>
		{%/foreach%}
		<!--清除浮动-->
		<br style="clear:both"/>
	</ul>
</div>


{%script%}
require("./hotcity.js").init();
{%/script%}
