{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%widget name="common:widget/nav/nav.tpl" title="路线详情" %}
	{%* 跨城公交的列表 *%}
    {%widget name="transit:widget/crossdetail/crossdetail.tpl"%}
    {%script%}
    	(require('transit:widget/crossdetail/crossdetail.js')).init();
    {%/script%}
{%/block%}