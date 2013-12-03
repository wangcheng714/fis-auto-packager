{%* 街景页面 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="百度全景"%}
{%widget name="common:widget/streetview/streetview.tpl"%}
{%script%}
        (require('common:widget/streetview/streetview.js')).init();
    {%/script%}
{%require name='index:page/streetview.tpl'%}{%/block%}
