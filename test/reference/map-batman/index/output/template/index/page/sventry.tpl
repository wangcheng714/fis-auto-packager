{%* 全景中间页 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.index-widget-thumbnail{padding-top:10px}</style>
{%/block%}
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="全景" pagename="sventry"%}
{%widget name="index:widget/sventry/sventry.tpl" pagename="sventry"%}
{%require name='index:page/sventry.tpl'%}{%/block%}