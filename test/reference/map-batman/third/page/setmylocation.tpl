{%* 城市选择页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="js"%}
    <link rel="stylesheet" type="text/css" href="/static/css/setmylocation.inline.less?__inline">
{%/block%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%widget name="common:widget/nav/nav.tpl" title="位置选择"%}

	<div class="index-page-headerinfo">
		{%* 当前位置 *%}
		{%widget name="index:widget/curloc/curloc.tpl"%}

		{%* 搜索框 *%}
		{%widget name="index:widget/locsearch/locsearch.tpl"%}
	</div>

	{%* 热门城市 *%}
	{%widget name="index:widget/hotcity/hotcity.tpl"%}

	{%* 所有城市 *%}
	{%widget name="index:widget/allcity/allcity.tpl"%}

{%/block%}