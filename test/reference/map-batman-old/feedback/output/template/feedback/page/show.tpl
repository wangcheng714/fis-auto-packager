{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title="意见反馈"%}
{%widget name="feedback:widget/show/show.tpl"%}
{%require name='feedback:page/show.tpl'%}{%/block%}
