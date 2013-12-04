{%* 热门商圈页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title=$data.title%}
    {%widget name="index:widget/nearpush/cater.tpl" pagename="business"%}
    {%widget name="index:widget/nearpush/hotel.tpl" pagename="business"%}
    {%widget name="index:widget/nearpush/bank.tpl" pagename="business"%}
    {%widget name="index:widget/nearby/nearby.tpl" pagename="business"%}
{%/block%}