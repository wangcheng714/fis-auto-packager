{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="切换产品"%}
{%widget name="index:widget/switchproduct/switchproduct.tpl"%}
{%require name='third:page/switchproduct.tpl'%}{%/block%}
