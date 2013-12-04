{%if $action == 'settrafficcity'%}
	{%json file="third/settrafficcity.json" assign="loc_conf"%}
{%else%}
	{%json file="third/setmylocation.json" assign="loc_conf"%}
{%/if%}

<div class="third-widget-allcity">
	<h4>更多城市</h4>
	<div class="select-city">
		<div class="select-letter">
			<ul>
				{%foreach from=$loc_conf.letter item=letter_item%}
					<li><span data-href="#city_{%$letter_item%}" >{%$letter_item%}</span></li>
				{%/foreach%}
				<!--清除浮动-->
				<br style="clear:both"/>
			</ul>
		</div>
		{%foreach from=$loc_conf.cityData item=city_list key=letter%}
			<div class="city">
				<h5 id="city_{%$letter%}">{%$letter%}</h5>
				<ul>
					{%foreach from=$city_list item=city_item%}
						{%if $city_item.hideWeather!="1"%}
						<li>
							<span data-cityid="{%$city_item.city_id%}" class="city-item"  data-city=
								"{%$city_item.name%}" {%if $city_item.shortName%}data-short-city="{%$city_item.shortName%}"{%/if%}
								{%if ($city_item.x && $city_item.y)%}
									data-x="{%$city_item.x%}" data-y="{%$city_item.y%}"
								{%/if%}>
							{%$city_item.name%}</span>
						</li>
						{%/if%}
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