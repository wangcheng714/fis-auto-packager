{%style id="/widget/toplist/toplist.inline.less"%}.place-widget-toplist>div{border:#838991 solid 1px;border-radius:.25em}.place-widget-toplist>div>div{position:relative;padding:2px 0 13px 12px}.place-widget-toplist>div>div>div{height:50px;padding-top:25px;position:absolute;top:6px;right:-2px}.place-widget-toplist>div>div>div>div{height:0;width:48px;padding-top:9px;overflow:hidden}.place-widget-toplist-others{list-style:none;background-color:#f4f4f4;display:none}.place-widget-toplist-others li{position:relative;padding:12px 4px 12px 38px;border-top:1px solid #d9d9d9}.place-widget-toplist-name{font-size:14px}.place-widget-toplist-name>b{position:relative;top:3px;font-size:24px;color:#c04545}.place-widget-toplist-text{margin-top:3px;font-size:12px;color:#747474}.place-widget-toplist-arrow{position:relative;top:-53px;height:40px;width:40px;-webkit-transform:rotate(45deg);border:1px solid #AAA}.place-widget-toplist-i-rank{position:absolute;top:13px;left:12px;font-size:24px;color:#e9a387}.place-widget-toplist-i-name{font-size:14px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.place-widget-toplist-i-txt{margin-top:6px;font-size:12px;color:#747474;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.place-widget-toplist-arrowup{top:2px}.place-widget-toplist-showall{display:block}{%/style%}{%* 餐饮酒店排行榜widget *%}
{%if ($data.widget.toplist)%}
<div class="place-widget-toplist">
<div>
<div>
<p class="place-widget-toplist-name">{%$widget_data.data.top.title|f_escape_xml%}
<b>{%$widget_data.data.top.rank|f_escape_xml%}</b>
</p>
<p class="place-widget-toplist-text">{%$widget_data.data.top.week_visit|f_escape_xml%}</p>
<div>
<div>
<div class="place-widget-toplist-arrow"></div>
</div>
</div>
</div>
<ul class="place-widget-toplist-others">
{%foreach from=$widget_data.data.list item=item%}
<li data-uid="{%$item.uid|f_escape_xml%}">
<b class="place-widget-toplist-i-rank">{%$item.rank|f_escape_xml%}</b>
<p class="place-widget-toplist-i-name">{%$item.name|f_escape_xml%}</p>
<p class="place-widget-toplist-i-txt">{%$item.week_visit|f_escape_xml%}</p>
</li>
{%/foreach%}
</ul>
</div>
</div>
{%script%}
    var toplist = require("place:widget/toplist/toplist.js"),
    	statData = {
			srcname: '{%$widget_data.src_name|f_escape_js%}',
			name: '{%$widget_data.name|f_escape_js%}'
    	};
    toplist.init(statData);

{%/script%}
{%/if%}