{%style id="/widget/allcity/allcity.inline.less"%}.index-widget-allcity h4{font-size:16px;color:#575757;font-weight:400}.index-widget-allcity .select-city{border:2px solid #f1f1f1;background:#fff;-webkit-border-radius:2px;margin:9px 8px}.index-widget-allcity .select-city .more-city{border-bottom:1px solid #e1e1e1}.index-widget-allcity .select-city .more-city h4{font-size:16px;color:#575757;font-weight:400;padding:14px}.index-widget-allcity .select-city .select-letter{border-bottom:1px solid #e1e1e1}.index-widget-allcity .select-city .select-letter ul li{font-size:14px;float:left}.index-widget-allcity .select-city .select-letter ul li span{width:9px;display:block;color:#3c6aa7;padding:8px;margin:8px}.index-widget-allcity .select-city .select-letter ul li span:hover{background:#F2F2F2}.index-widget-allcity .city{border-bottom:1px solid #e1e1e1}.index-widget-allcity .city .hotcity-title{color:#F31E1E;float:left;margin:22px 7px auto 14px;font-size:16px;font-weight:100}.index-widget-allcity .city h5{font-size:36px;color:#d7d7d7;float:left;margin:14px 7px auto 14px}.index-widget-allcity .city ul{float:left;width:79%}.index-widget-allcity .city ul li{float:left}.index-widget-allcity .city ul li span{color:#3c6aa7;display:block;padding:14px 5px 5px;margin:10px 0}.index-widget-allcity .city ul li span:hover{background:#F2F2F2}{%/style%}{%if ($action == 'setsubwaycity')%}
{%json file="index/setsubwaycity.json" assign="loc_conf"%}
{%else%}
{%json file="index/setmylocation.json" assign="loc_conf"%}
{%/if%}
<div class="index-widget-allcity">
<div class="select-city">
<div class = "more-city"><h4>全部城市</h4>
</div>
<div class="select-letter">
<ul>
{%foreach from=$loc_conf.letter item=letter_item%}
<li><span data-href="#city_{%$letter_item|f_escape_xml%}" >{%$letter_item|f_escape_xml%}</span></li>
{%/foreach%}
<br style="clear:both"/>
</ul>
</div>
<div class="city">
<h4 class="hotcity-title">热门</h4>
<ul>
{%foreach from=$loc_conf.hotCityData item=hot_item%}
<li><span class="city-item" data-cityid="{%$hot_item.city_id|f_escape_xml%}" data-city="{%$hot_item.name|f_escape_xml%}" data-cityeng="{%$hot_item.eng|f_escape_xml%}">{%$hot_item.name|f_escape_xml%}</span></li>
{%/foreach%}
<br style="clear:both"/>
</ul>
<br style="clear:both"/>
</div>
{%foreach from=$loc_conf.cityData item=city_list key=letter%}
<div class="city">
<h5 id="city_{%$letter|f_escape_xml%}">{%$letter|f_escape_xml%}</h5>
<ul>
{%foreach from=$city_list item=city_item%}
<li><span data-cityid="{%$city_item.city_id|f_escape_xml%}" class="city-item"  data-city=
							{%if $city_item.fullName%}
								{%$city_item.fullName|f_escape_xml%}
							{%else%}
								{%$city_item.name|f_escape_xml%}
							{%/if%}
							data-cityeng="{%$city_item.eng|f_escape_xml%}">
{%$city_item.name|f_escape_xml%}</span>
</li>
{%/foreach%}
</ul>
<br style="clear:both"/>
</div>
{%/foreach%}
</div>
</div>
{%script%}
require("index:widget/allcity/allcity.js").init();
{%/script%}