{%style id="/widget/recommend/recommend.inline.less"%}.place-widget-recommend h2{margin:0 5px 14px;font-size:16px;color:#303235;line-height:1}.place-widget-recommend ul{list-style:none;background-color:#f2f2f2;border:#838991 solid 1px;border-radius:.25em;overflow:hidden}.place-widget-recommend ul li{padding:10px 31px 10px 11px;line-height:20px;border-bottom:solid 1px #ccced2;background:url(/static/place/images/goto_92a90a7.png) 96% center no-repeat}.place-widget-recommend ul li:last-child{border-bottom:0}.place-widget-recommend ul li p:first-child{color:#383838}.place-widget-recommend ul li p:last-child{padding-left:23px;color:#6e6e6e}.place-widget-recommend ul li p b{background-color:#ff7800;display:inline-block;width:16px;height:16px;line-height:16px;margin-right:5px;border-radius:18px;text-align:center;font-size:9px;color:#fff}{%/style%}{%* 附近美食推荐widget模板 *%}
{%if ($data.widget.recommend)%}
<div class="place-widget-recommend">
<h2>附近美食</h2>
<ul>
{%foreach from=$widget_data item=item%}
<li data-uid="{%$item.uid|f_escape_xml%}">
<p>
<b>荐</b>{%$item.title|f_escape_xml%}
</p>
<p>{%$item.reason|f_escape_xml%}</p>
</li>
{%/foreach%}
</ul>
</div>
{%script%}
    var recommend = require("place:widget/recommend/recommend.js");
    recommend.init();
{%/script%}
{%/if%}