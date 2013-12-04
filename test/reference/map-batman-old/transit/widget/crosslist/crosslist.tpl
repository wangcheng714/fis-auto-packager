<div id="crosslist" class="transit-widget-crosslist">
	{%$listData  = $data.listData%}
	{%$list      = $listData.list%}
	{%$stragetys = $listData.strategies%}
	{%$start     = $listData.start%}
	{%$end       = $listData.end%}
	{%$cty       = $data.result.cty%}
	{%if (count($list) > 0)%}
	<div class="cross-list">
		<div class="start">
			<div class="start-info">
				<p>{%$start.wd%}</p>
				<span>{%$start.cname%}</span>
			</div>
			<s></s>
		</div>
		<a id="switch" href="{%$data.result.plans.reverse%}">
			<s></s>
		</a>
		<div class="end">
			<div class="end-info">
				<p>{%$end.wd%}</p>
				<span>{%$end.cname%}</span>
			</div>
			<s></s>
		</div>
		<div class="filter" id="dateBox">
			<span>{%$startTime%}</span>
			<s></s>
		</div>
		<div class="filter" id="strategyBox">
			<span></span>
			<s></s>
			<select>
				{%foreach $stragetys as $i => $item%}
					{%if ($item.n == $data.result.csy)%}
						<option selected="selected">{%$item.v%}</option>
					{%else%}
						<option>{%$item.v%}</option>
					{%/if%}
				{%/foreach%}
			</select>
		</div>

		<ul id="list">
			{%foreach $list as $i => $item%}
			<li>
				<a href="{%$item.url%}">
					<s class="{%if $item.type == 1%}train{%else%}air{%/if%}"></s>
					<span class="name">{%$item.name%}</span>
					<span class="start-time">{%$item.startTime%}</span>
					<span class="price">最低价
						<b>{%if ($item['price'] != 0)%}¥{%$item.price%}{%else%}暂无{%/if%}</b>
						{%if ($item['type'] == 2 && $item['discount'] <= 10)%}
							<b>{%if $item.discount%}({%$item.discount%}折){%/if%}</b>
						{%/if%}
					</span>
					<span class="all-time">最快约{%$item.overTime%}</span>
				</a>
			</li>
			{%/foreach%}
			{%if ($listData.isNeedMore == true)%}
				<a id="more" href="{%$listData.moreUrl%}">查看更多</a>
			{%/if%}
		</ul>
	</div>
	{%else%}
	<p class="route-tips">
		{%if ($cty == 1)%}
			<em></em>未查询到合适的飞机路线，您可以查看<a class="air-to-train" href="{%$data.result.plans.train%}">火车方案</a>。
		{%else%}
			<em></em>未查询到合适的火车路线。
		{%/if%}
	</p>
	{%/if%}
</div>