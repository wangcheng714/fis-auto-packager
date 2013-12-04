{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%$title = $data.trainstationData.name%}
	{%widget name="common:widget/nav/nav.tpl" title="$title"%}
	{%* 跨城公交的列表 *%}
    {%widget name="transit:widget/trainstation/trainstation.tpl"%}
{%require name='transit:page/trainstation.tpl'%}{%/block%}