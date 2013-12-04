{%* hao123 切换城市页 *%}
{%extends file="common/page/layout.tpl"%}

{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title="切换城市"%}
	{%* 热门城市 *%}
	{%widget name="third:widget/hotcity/hotcity.tpl"%}

	{%* 所有城市 *%}
	{%widget name="third:widget/allcity/allcity.tpl"%}
{%/block%}