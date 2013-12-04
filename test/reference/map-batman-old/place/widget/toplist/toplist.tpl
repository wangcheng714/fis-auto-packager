{%* 餐饮酒店排行榜widget *%}
{%if ($data.widget.toplist)%}
<div class="place-widget-toplist">
	<div>
		<div>
			<p class="place-widget-toplist-name">{%$widget_data.data.top.title%}
				<b>{%$widget_data.data.top.rank%}</b>
			</p>
			<p class="place-widget-toplist-text">{%$widget_data.data.top.week_visit%}</p>
			<div>
				<div>
					<div class="place-widget-toplist-arrow"></div>
				</div>
			</div>
		</div>
		<ul class="place-widget-toplist-others">
			{%foreach from=$widget_data.data.list item=item%}
				<li data-uid="{%$item.uid%}">
					<b class="place-widget-toplist-i-rank">{%$item.rank%}</b>
					<p class="place-widget-toplist-i-name">{%$item.name%}</p>
					<p class="place-widget-toplist-i-txt">{%$item.week_visit%}</p>
				</li>
			{%/foreach%}
		</ul>
	</div>
</div>
{%script%}
    var toplist = require("place:widget/toplist/toplist.js"),
    	statData = {
			srcname: '{%$widget_data.src_name%}',
			name: '{%$widget_data.name%}'
    	};
    toplist.init(statData);

{%/script%}
{%/if%}