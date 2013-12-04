{%if ($action == 'setsubwaycity')%}
    {%json file="index/setsubwaycity.json" assign="loc_conf"%}
{%else%}
    {%json file="index/setmylocation.json" assign="loc_conf"%}
{%/if%}
<div class="index-widget-allcity">

	<div class="select-city">
	<div class = "more-city">	
		<h4>全部城市</h4>
	</div>

		<div class="select-letter">
			<ul>
				{%foreach from=$loc_conf.letter item=letter_item%}
					<li><span data-href="#city_{%$letter_item%}" >{%$letter_item%}</span></li>
				{%/foreach%}
				<!--清除浮动-->
				<br style="clear:both"/>
			</ul>
		</div>
		<div class="city">
				<h4 class="hotcity-title">热门</h4>
				<ul>
					{%foreach from=$loc_conf.hotCityData item=hot_item%}
						<li><span class="city-item" data-cityid="{%$hot_item.city_id%}" data-city="{%$hot_item.name%}" data-cityeng="{%$hot_item.eng%}">{%$hot_item.name%}</span></li>
					{%/foreach%}
					<!--清除浮动-->
					<br style="clear:both"/>
				</ul>
				<!--清除浮动-->
				<br style="clear:both"/>
		</div>
		{%foreach from=$loc_conf.cityData item=city_list key=letter%}
			<div class="city">
				<h5 id="city_{%$letter%}">{%$letter%}</h5>
				<ul>
					{%foreach from=$city_list item=city_item%}
						<li><span data-cityid="{%$city_item.city_id%}" class="city-item"  data-city=
							{%if $city_item.fullName%}
								{%$city_item.fullName%}
							{%else%}
								{%$city_item.name%}
							{%/if%}
							data-cityeng="{%$city_item.eng%}">
							{%$city_item.name%}</span>
						</li>
					{%/foreach%}
				</ul>
				<!--清除浮动-->
				<br style="clear:both"/>
			</div>
		{%/foreach%}
	</div>
</div>

{%script%}
require("./allcity.js").init();
{%/script%}