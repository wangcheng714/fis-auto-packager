{%style id="/widget/allcity/allcity.inline.less"%}.index-widget-allcity h4 {
  font-size: 16px;
  color: #575757;
  font-weight: normal;
  margin-top: 21px;
  margin-left: 14px;
}
.index-widget-allcity .select-city {
  border: 2px solid #f1f1f1;
  background: white;
  -webkit-border-radius: 2px;
  margin: 9px 8px;
}
.index-widget-allcity .select-city .select-letter {
  border-bottom: 1px solid #e1e1e1;
}
.index-widget-allcity .select-city .select-letter ul li {
  font-size: 14px;
  float: left;
}
.index-widget-allcity .select-city .select-letter ul li span {
  width: 9px;
  display: block;
  color: #3c6aa7;
  padding: 8px;
  margin: 8px;
}
.index-widget-allcity .select-city .select-letter ul li span:hover {
  background: #f7f7f7;
}
.index-widget-allcity .city {
  border-bottom: 1px solid #e1e1e1;
}
.index-widget-allcity .city h5 {
  font-size: 36px;
  color: #d7d7d7;
  float: left;
  margin: 14px 7px auto 14px;
}
.index-widget-allcity .city ul {
  float: left;
  width: 81%;
}
.index-widget-allcity .city ul li {
  float: left;
}
.index-widget-allcity .city ul li span {
  color: #3c6aa7;
  display: block;
  padding: 10px 5px 10px 5px;
  margin: 10px 0;
}
.index-widget-allcity .city ul li span:hover {
  background: #f7f7f7;
}
{%/style%}{%json file="index/setmylocation.json" assign="loc_conf"%}

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
require("third:widget/allcity/allcity.js").init();
{%/script%}