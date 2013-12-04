{%* hao123 路况城市切换页 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="切换城市"%}
{%* 热门城市 *%}
{%widget name="third:widget/hotcity/hotcity.tpl"%}
{%* 所有城市 *%}
{%widget name="third:widget/allcity/allcity.tpl"%}
{%require name='third:page/settrafficcity.tpl'%}{%/block%}