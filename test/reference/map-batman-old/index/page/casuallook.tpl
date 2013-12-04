{%* 随便看看页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title="随便看看"%}
    {%widget name="index:widget/nearpush/cater.tpl" pagename="casuallook"%}
    {%widget name="index:widget/nearpush/hotel.tpl" pagename="casuallook"%}
    {%widget name="index:widget/nearpush/bank.tpl" pagename="casuallook"%}
    {%widget name="index:widget/nearby/nearby.tpl" pagename="casuallook"%}
{%/block%}