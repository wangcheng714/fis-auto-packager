{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%widget name="common:widget/nav/nav.tpl" widgetTitle="common:widget/traffictitle/traffictitle.tpl" trafficType="transit"%}
	{%* 公交的列表 *%}
    {%widget name="transit:widget/list/list.tpl"%}
{%/block%}