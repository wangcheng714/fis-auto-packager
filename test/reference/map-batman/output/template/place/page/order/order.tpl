{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* 头部导航 *%}
    {%widget name="common:widget/nav/nav.tpl" title='填写订单信息'%}
    {%widget name="place:widget/order/order.tpl" widget_data=$data%}
{%require name='place:page/order/order.tpl'%}{%/block%}