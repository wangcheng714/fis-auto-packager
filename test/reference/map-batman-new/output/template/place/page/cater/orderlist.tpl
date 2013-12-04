{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title='餐饮订单'%}
{%widget name="place:widget/caterorderlist/caterorderlist.tpl"%}
{%require name='place:page/cater/orderlist.tpl'%}{%/block%}