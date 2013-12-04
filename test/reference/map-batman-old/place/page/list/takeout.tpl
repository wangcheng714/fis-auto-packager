<!-- @fileOverview 外卖列表页 -->
{%extends file="common/page/layout.tpl"%}

{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="外卖"%}
    {%widget name="place:widget/listtool/listtool.tpl" type=takeout%}
	{%widget name="place:widget/takeoutlist/takeoutlist.tpl"%}
{%/block%}