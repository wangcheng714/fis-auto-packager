{%extends file="taxi/page/base.tpl"%} 
{%block name="wrapper"%}
{%widget name="taxi:widget/vip/home/home.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-home"%}
{%widget name="taxi:widget/vip/verify/verify.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-verify"%}
{%widget name="taxi:widget/vip/orderlist/orderlist.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-orderlist"%}
{%widget name="taxi:widget/vip/finish/finish.tpl" mode="quickling" pagelet_id="taxi-pagelet-vip-finish"%}
{%require name='taxi:page/vip.tpl'%}{%/block%}
