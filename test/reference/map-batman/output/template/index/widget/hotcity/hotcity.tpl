{%style id="/widget/hotcity/hotcity.inline.less"%}.index-widget-hotcity h4 {
  font-size: 16px;
  color: #575757;
  font-weight: normal;
  margin-top: 21px;
  margin-left: 14px;
}
.index-widget-hotcity ul {
  border: 2px solid #f1f1f1;
  -webkit-border-radius: 2px;
  background: white;
  margin: 9px 8px;
  padding-bottom: 14px;
}
.index-widget-hotcity ul li {
  float: left;
}
.index-widget-hotcity ul li span {
  color: #3c6aa7;
  padding: 4px 10px 4px 10px;
  margin: 15px 0px 0px 1px;
  display: block;
}
.index-widget-hotcity ul li span:hover {
  background: #F2F2F2;
}
{%/style%}
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
require("index:widget/hotcity/hotcity.js").init();
{%/script%}
