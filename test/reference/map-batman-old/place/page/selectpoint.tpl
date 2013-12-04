{%* 列表页page页面 *%}
{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
<link rel="stylesheet" type="text/css" href="/static/css/marker.inline.css?__inline">
{%/block%}

{%block name="main"%}

	{%* 头部导航 *%}
	{%widget name="common:widget/nav/nav.tpl" title=$data.result.wd %}
    
	{%* 地点列表 *%}
    {%widget name="place:widget/selectlist/selectlist.tpl"%}
{%/block%}