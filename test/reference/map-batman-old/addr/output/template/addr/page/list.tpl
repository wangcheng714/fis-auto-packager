{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title="选择准确的地点"%}
{%* 地点选择页 *%}
{%widget name="addr:widget/list/list.tpl"%}
{%require name='addr:page/list.tpl'%}{%/block%}