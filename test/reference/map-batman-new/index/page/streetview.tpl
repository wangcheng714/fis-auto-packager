{%* 街景页面 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title="百度全景"%}
    {%widget name="common:widget/streetview/streetview.tpl"%}
{%/block%}
{%block name="footer"%}{%/block%}