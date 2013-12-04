{%if !empty($widget_data.data.scope_ticket)%}
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