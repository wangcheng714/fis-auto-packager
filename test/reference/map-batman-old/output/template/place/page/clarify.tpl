{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* 头部导航 *%}
    {%widget name="common:widget/nav/nav.tpl" title=''%}
    {%widget name="place:widget/clarify/clarify.tpl"%}
{%require name='place:page/clarify.tpl'%}{%/block%}