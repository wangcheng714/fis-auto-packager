{%extends file="common/page/layout.tpl"%}

{%block name="content"%}
    {%widget name="index:widget/about/about.tpl" pagelet_id="pager"%}
{%require name='index:page/about.tpl'%}{%/block%}
