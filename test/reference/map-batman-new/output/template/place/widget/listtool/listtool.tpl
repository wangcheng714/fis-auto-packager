{%style id="/widget/listtool/listtool.inline.less"%}.place-widget-listtool{background-color:#F2F2F2;line-height:24px;padding:10px 8px;position:relative}.place-widget-listtool .toolbar-place-name{font-weight:400;color:#276adc;padding:3px 5px;-webkit-border-radius:2px;max-width:170px;background-color:#fff}.place-widget-listtool .ellipsis{overflow:hidden;display:inline-block;white-space:nowrap;text-overflow:ellipsis}.place-widget-listtool .toolbar-btn-wrap{position:absolute;top:10px;right:8px;line-height:30px;background-color:#FFF;width:56px;height:30px}.place-widget-listtool .base-btn{display:inline-block;height:30px;border:1px solid #b4b4b5;width:30px;line-height:28px;border-radius:2px;margin-left:5px;color:#535353;font-size:12px;background:0 0}.place-widget-listtool .toolbar-word-wrap{padding-right:50px}.place-widget-listtool .toolbar-word{max-width:100px}.place-widget-listtool .select-btn{position:relative;background:url(/static/place/images/search_sort_icon_8b2f307.png) no-repeat 0 1px;background-size:10px 12px;padding-left:14px;left:8px}.place-widget-listtool .select-btn b{position:absolute;z-index:2;left:9px;top:12px;border-color:gray transparent transparent;border-width:6px 6px 0;border-style:solid;width:0;font-size:0;height:0;-webkit-transform:rotate(180deg);display:inline-block}.place-widget-listtool .toolbar-extend{margin-top:10px}.place-widget-listtool.hide-extend .toolbar-extend{display:none}.place-widget-listtool.hide-extend .select-btn b{-webkit-transform:rotate(0)}{%/style%}
{%$disableSelect=false%}
{%if $type == "takeout" && $data.listInfo.enableSelect == false %}
{%$disableSelect=true%}
{%/if%}
<div class="place-widget-listtool {%if !$data.listInfo.isShowSelect%}hide-extend{%/if%}">
<div class="toolbar-word-wrap">
在&nbsp;<a href="{%$data.listInfo.centerNameUrl|escape:'none'%}" data-log="{code:{%$STAT_CODE.PLACE_LIST_MYPOS_AROUND_CLICK|f_escape_xml%}, wd: '{%$data.result.wd|f_escape_xml%}', srcname:'{%$data.content[0].ext.src_name|f_escape_xml%}'}"><strong  class="toolbar-place-name ellipsis">{%$data.listInfo.centerName|f_escape_xml%}</strong></a>&nbsp;附近找</div>
<div class="toolbar-btn-wrap">
<span class="select-btn">筛选</span>
</div>
<div id="toolbar-extend" class="toolbar-extend">
{%widget name="place:widget/selectbox/selectbox.tpl" select_type=$type isMovie=$isMovie disableSelect=$disableSelect%}
</div>
</div>
{%script%}
	var listTool = require("place:widget/listtool/listtool.js");
	listTool.init();
{%/script%}