{%style id="/widget/allcity/allcity.inline.less"%}.third-widget-allcity h4{font-size:16px;color:#575757;font-weight:400;margin-top:21px;margin-left:14px}.third-widget-allcity .select-city{border:2px solid #f1f1f1;background:#fff;-webkit-border-radius:2px;margin:9px 8px}.third-widget-allcity .select-city .select-letter{border-bottom:1px solid #e1e1e1}.third-widget-allcity .select-city .select-letter ul li{font-size:14px;float:left}.third-widget-allcity .select-city .select-letter ul li span{width:9px;display:block;color:#3c6aa7;padding:8px;margin:8px}.third-widget-allcity .select-city .select-letter ul li span:hover{background:#f7f7f7}.third-widget-allcity .city{border-bottom:1px solid #e1e1e1}.third-widget-allcity .city h5{font-size:36px;color:#d7d7d7;float:left;margin:14px 7px auto 14px}.third-widget-allcity .city ul{float:left;width:80%}.third-widget-allcity .city ul li{float:left}.third-widget-allcity .city ul li span{color:#3c6aa7;display:block;padding:14px 5px 10px;margin:10px 0}.third-widget-allcity .city ul li span:hover{background:#f7f7f7}{%/style%}{%if $action == 'settrafficcity'%}
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
<li><span data-href="#city_{%$letter_item|f_escape_xml%}" >{%$letter_item|f_escape_xml%}</span></li>
{%/foreach%}
<br style="clear:both"/>
</ul>
</div>
{%foreach from=$loc_conf.cityData item=city_list key=letter%}
<div class="city">
<h5 id="city_{%$letter|f_escape_xml%}">{%$letter|f_escape_xml%}</h5>
<ul>
{%foreach from=$city_list item=city_item%}
{%if $city_item.hideWeather!="1"%}
<li>
<span data-cityid="{%$city_item.city_id|f_escape_xml%}" class="city-item"  data-city=
								"{%$city_item.name|f_escape_xml%}" {%if $city_item.shortName%}data-short-city="{%$city_item.shortName|f_escape_xml%}"{%/if%}
								{%if ($city_item.x && $city_item.y)%}
									data-x="{%$city_item.x|f_escape_xml%}" data-y="{%$city_item.y|f_escape_xml%}"
								{%/if%}>
{%$city_item.name|f_escape_xml%}</span>
</li>
{%/if%}
{%/foreach%}
</ul>
<br style="clear:both"/>
</div>
{%/foreach%}
</div>
</div>
{%script%}
require("third:widget/allcity/allcity.js").init();
{%/script%}