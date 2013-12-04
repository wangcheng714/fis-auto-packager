{%* 附近美食推荐widget模板 *%}
{%if ($data.widget.recommend)%}
<div class="place-widget-recommend">
	<h2>附近美食</h2>
	<ul>
		{%foreach from=$widget_data item=item%}
			<li data-uid="{%$item.uid%}">
				<p>
					<b>荐</b>{%$item.title%}
				</p>
				<p>{%$item.reason%}</p>
			</li>
		{%/foreach%}
	</ul>
</div>
{%script%}
    var recommend = require("place:widget/recommend/recommend.js");
    recommend.init();
{%/script%}
{%/if%}