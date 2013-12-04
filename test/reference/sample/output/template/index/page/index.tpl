{%extends file="common/page/layout.tpl"%}

{%block name="main"%}
    {%widget name="index:widget/list/list.tpl" pagelet_id="pagelet_list"%}
    {%widget name="index:widget/index/index.tpl" pagelet_id="pagelet_detail"%}
{%script%}
require("index:widget/ui/aindex.js");
require.async("index:widget/ui/bindex.js");
{%/script%}
{%require name='index:page/index.tpl'%}{%/block%}

