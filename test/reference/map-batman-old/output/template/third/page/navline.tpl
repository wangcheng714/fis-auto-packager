{%extends file="common/page/layout.tpl"%}
{%block name="topBanner"%}
{%widget name="common:widget/topbanner/topbanner.tpl"%}
{%/block%}
{%block name="header"%}
    {%widget name="common:widget/header/header.tpl" hideRight=true%}
{%/block%}

{%block name="main"%}
{%widget name="index:widget/navebox/navebox.tpl"%}
{%require name='third:page/navline.tpl'%}{%/block%}