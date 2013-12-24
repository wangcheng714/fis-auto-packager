{%style id="/widget/hotcity/hotcity.inline.less"%}.third-widget-hotcity h4{font-size:16px;color:#575757;font-weight:400;margin-top:21px;margin-left:14px}.third-widget-hotcity ul{border:2px solid #f1f1f1;-webkit-border-radius:2px;background:#fff;margin:9px 8px;padding-bottom:14px}.third-widget-hotcity ul li{float:left}.third-widget-hotcity ul li span{color:#3c6aa7;padding:4px 10px;margin:15px 0 0 1px;display:block}.third-widget-hotcity ul li span:hover{background:#f7f7f7}{%/style%}{%if $action == 'settrafficcity'%}
{%json file="third/settrafficcity.json" assign="loc_conf"%}
{%else%}
{%json file="third/setmylocation.json" assign="loc_conf"%}
{%/if%}
<div class="third-widget-hotcity">
<h4>热门城市</h4>
<ul>
{%foreach from=$loc_conf.hotCityData item=hot_item%}
<li>
<span class="city-item" data-cityid="{%$hot_item.city_id|f_escape_xml%}" data-city="{%$hot_item.name|f_escape_xml%}"
					{%if ($hot_item.x && $hot_item.y)%}
						data-x="{%$hot_item.x|f_escape_xml%}" data-y="{%$hot_item.y|f_escape_xml%}"
					{%/if%}>{%$hot_item.name|f_escape_xml%}</span>
</li>
{%/foreach%}
<br style="clear:both"/>
</ul>
</div>
{%script%}
require("third:widget/hotcity/hotcity.js").init();
{%/script%}
