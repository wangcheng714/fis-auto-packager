{%json file="index/setmylocation.json" assign="loc_conf"%}

<div class="index-widget-allcity">
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
						<li><span data-cityid="{%$city_item.city_id%}" class="city-item"  data-city=
							{%if $city_item.fullName%}
								{%$city_item.fullName%}
							{%else%}
								{%$city_item.name%}
							{%/if%}
							>
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