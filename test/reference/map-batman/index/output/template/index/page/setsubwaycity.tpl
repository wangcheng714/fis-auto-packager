{%* 地铁 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.index-widget-thumbnail{padding-top:10px}</style>
{%/block%}
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="地铁" pagename="setsubwaycity"%}
{%* 热门城市 *%}
{%widget name="index:widget/hotcity/hotcity.tpl"%}
{%* 所有城市 *%}
{%widget name="index:widget/allcity/allcity.tpl"%}
{%require name='index:page/setsubwaycity.tpl'%}{%/block%}