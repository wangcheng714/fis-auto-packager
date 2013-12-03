{%style id="/widget/scopebook/scopebook.inline.less"%}/* 景点预订样式 */
.place-widget-scope-book {
  border-radius: 5px;
  border: #838991 solid 1px;
  margin: 8px 8px 0;
}
.place-widget-scope-book .scope-book-hide {
  display: none;
}
.place-widget-scope-book .scope-border-bottom {
  border-bottom: solid 1px #CCCED2;
}
.place-widget-scope-book .scope-border-bottom-radius {
  -webkit-border-bottom-left-radius: 5px;
  -webkit-border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.place-widget-scope-book h3 {
  font: bold 15px "微软雅黑", "宋体";
  color: #686868;
  background-color: #F9F9F9;
  padding: 10px;
  -webkit-border-top-left-radius: 5px;
  -webkit-border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  overflow: hidden;
}
.place-widget-scope-book > div > div {
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  border-bottom: solid 1px #CCCED2;
  box-sizing: border-box;
  background-color: #EFEFEF;
}
.place-widget-scope-book > div > div .scope-arrow-icon {
  width: 20px;
  height: 20px;
  float: left;
  margin-top: 14px;
  background: url("/static/place/images/hotelbook_icon_415304a.png") no-repeat 0 0;
  background-size: 21px 62px;
}
.place-widget-scope-book > div > div .scope-arrow-icon-down {
  -webkit-transform: rotate(90deg);
}
.place-widget-scope-book > div > div .scope-ticket-name {
  margin-left: 5px;
  font: bold 15px "微软雅黑", "宋体";
  width: 70%;
  display: inline-block;
  vertical-align: middle;
}
.place-widget-scope-book > div > div > div {
  position: absolute;
  display: inline-block;
  right: 17px;
}
.place-widget-scope-book > div > div > div > span {
  color: #FE8A01;
  margin: 0 0 0 10px;
}
.place-widget-scope-book > div > div > div > span > span {
  color: #999;
  margin: 0 0 0 1px;
  font: bold 15px "微软雅黑", "宋体";
}
.place-widget-scope-book > div ul {
  list-style: none;
}
.place-widget-scope-book > div ul li {
  height: 70px;
  border-bottom: solid 1px #E4E2DD;
  vertical-align: middle;
  line-height: 70px;
  padding: 0 10px;
}
.place-widget-scope-book > div ul li > span {
  width: 150px;
  font: bold 15px "微软雅黑", "宋体";
  color: #333;
  word-wrap: break-word;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  max-height: 100%;
}
.place-widget-scope-book > div ul li div {
  position: absolute;
  display: inline-block;
  right: 17px;
}
.place-widget-scope-book > div ul li div span {
  color: #FE8A01;
  margin: 0 0 0 10px;
}
.place-widget-scope-book > div ul li div a {
  top: 10px;
  width: 60px;
  height: 30px;
  background: url("/static/place/images/hotelbook_btn_new_5042bce.png") no-repeat 0 0;
  background-size: 60px;
  display: inline-block;
  position: relative;
  margin: 0 0 0 10px;
}
{%/style%}{%if !empty($widget_data.data.scope_ticket)%}
{%$scope_data = $widget_data.data.scope_ticket%}
<div class="place-widget-scope-book">
	<h3>门票在线预订</h3>
	{%section name=viewpoints loop=$scope_data%}
	<div>
		{%if $smarty.section.viewpoints.last%}
		<div style="border-bottom: none" class="scope-border-bottom-radius" last="true">
		{%else%}
		<div>
		{%/if%}
			{%if $smarty.section.viewpoints.index==0%}
			<span class="scope-arrow-icon scope-arrow-icon-down"></span>
			{%else%}
			<span class="scope-arrow-icon"></span>
			{%/if%}
			<span class="scope-ticket-name">{%$scope_data[viewpoints].name%}</span>
			<div>
				<span>
					¥{%$scope_data[viewpoints].min_price%}
					<span>
						起
						<span></span>
					</span>
				</span>
			</div>
		</div>
		{%if $smarty.section.viewpoints.index==0%}
		<ul>
		{%else%}
		<ul class="scope-book-hide">
		{%/if%}
			{%section name=otas loop=$scope_data[viewpoints].agent%}
			{%if $smarty.section.viewpoints.last%}
				{%if $smarty.section.otas.last%}
				<li style="border-bottom: none">
				{%else%}
				<li>
				{%/if%}
			{%else%}
			<li>
			{%/if%}
				<span>{%$scope_data[viewpoints].agent[otas].travel_agent%}</span>
				<div>
					<span>¥{%$scope_data[viewpoints].agent[otas].price%}</span>
					<a href="{%$scope_data[viewpoints].agent[otas].book_url_mobile%}" target="_blank"></a>
				</div>
			</li>
			{%/section%}
		</ul>
	</div>
	{%/section%}
</div>
{%/if%}
{%script%}
    var scopebook = require("place:widget/scopebook/scopebook.js");
    scopebook.init();

    //添加景点预订widget的展现量
	var stat = require('common:widget/stat/stat.js'),
    	name = $('.place-widget-captain').find('.name').text();

	stat.addStat(STAT_CODE.PLACE_SCOPE_BOOK_WIDGET_PV, {'name':name});
{%/script%}