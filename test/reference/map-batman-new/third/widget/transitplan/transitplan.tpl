<div class="third-widget-transitplan">
	{%if $data.type == 'site'%}
		<a href="{%$data.url%}" class="search-plan-click needsclick">方案查询</a>
		<a class="active" href="javascript:void(0);">线路/站点</a>
	{%else%}
		<a class="active">方案查询</a>
		<a href="{%$data.url%}" class="click needsclick" href="javascript:void(0);">线路/站点</a>
	{%/if%}
</div>