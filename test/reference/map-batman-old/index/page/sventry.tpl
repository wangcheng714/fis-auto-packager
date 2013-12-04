{%* 全景中间页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="js"%}
    <link rel="stylesheet" type="text/css" href="/static/css/sventry.inline.less?__inline">
{%/block%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title="全景" pagename="sventry"%}
    {%widget name="index:widget/sventry/sventry.tpl" pagename="sventry"%}
{%/block%}