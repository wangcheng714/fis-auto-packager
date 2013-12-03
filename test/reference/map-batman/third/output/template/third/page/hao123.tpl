{%* hao123过来的随便看看页面 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.common-widget-header{display:none}</style>
{%/block%}
{%block name="main"%}
{%widget name="index:widget/nearpush/hao123hd.tpl" pagename="hao123"%}
{%widget name="index:widget/nearpush/cater.tpl" pagename="hao123"%}
{%widget name="index:widget/nearpush/hotel.tpl" pagename="hao123"%}
{%widget name="index:widget/nearpush/bank.tpl" pagename="hao123"%}
{%widget name="index:widget/nearby/nearby.tpl" pagename="hao123"%}
{%require name='third:page/hao123.tpl'%}{%/block%}