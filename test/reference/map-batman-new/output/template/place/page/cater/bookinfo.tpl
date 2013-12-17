{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title='在线订座'%}
{%widget name="place:widget/caterbookinfo/caterbookinfo.tpl"%}
{%require name='place:page/cater/bookinfo.tpl'%}{%/block%}