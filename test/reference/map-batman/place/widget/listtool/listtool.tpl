<!-- @fileOverview 列表页工具view -->

{%$disableSelect=false%}

{%if $type == "takeout" && $data.listInfo.enableSelect == false %}
{%$disableSelect=true%}
{%/if%}
<div class="place-widget-listtool {%if !$data.listInfo.isShowSelect%}hide-extend{%/if%}">
	<div class="toolbar-word-wrap">
		在&nbsp;<a href="{%$data.listInfo.centerNameUrl|escape:'none'%}" data-log="{code:{%$STAT_CODE.PLACE_LIST_MYPOS_AROUND_CLICK%}, wd: '{%$data.result.wd%}', srcname:'{%$data.content[0].ext.src_name%}'}"><strong  class="toolbar-place-name ellipsis">{%$data.listInfo.centerName%}</strong></a>&nbsp;附近找
	</div>
	<div class="toolbar-btn-wrap">
		<span class="base-btn select-btn">
			<b></b>
		</span>
	</div>
	<!-- 这里是列表工具条扩展容器部分 -->
	<div id="toolbar-extend" class="toolbar-extend">
		{%$select_type%}
		{%widget name="place:widget/selectbox/selectbox.tpl" select_type=$type isMovie=$isMovie disableSelect=$disableSelect%}
	</div>
</div>

{%script%}
	var listTool = require("./listtool.js");
{%/script%}