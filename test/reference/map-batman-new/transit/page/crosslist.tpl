{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
    {%if $data.result.cty == 1%}
		{%$trafficType = 'air'%}
	{%else if $data.reuslt.cty == 0%}
		{%$trafficType = 'train'%}
	{%/if%}
	{%widget name="common:widget/nav/nav.tpl" widgetTitle="common:widget/traffictitle/traffictitle.tpl"%}
	{%* 跨城公交的列表 *%}
    {%widget name="transit:widget/crosslist/crosslist.tpl"%}
    {%script%}
    	(require('transit:widget/crosslist/crosslist.js')).init();
    {%/script%}
{%/block%}