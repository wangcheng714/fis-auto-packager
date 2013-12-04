<!-- @fileOverview 三大金刚跳转页 -->
{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="路线搜索"%}
    {%widget name="index:widget/seacrhnave/seacrhnave.tpl"%}
{%require name='index:page/linesearch.tpl'%}{%/block%}