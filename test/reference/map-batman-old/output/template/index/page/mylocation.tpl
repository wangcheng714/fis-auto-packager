{%* 我的位置页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="js"%}
    <style type="text/css">.index-widget-thumbnail {
  padding-top: 10px;
}
</style>
{%/block%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl" title="我的位置" pagename="mylocation"%}
    {%widget name="index:widget/thumbnail/thumbnail.tpl" pagename="mylocation"%}
    {%widget name="index:widget/nearpush/cater.tpl" pagename="mylocation"%}
    {%widget name="index:widget/nearpush/hotel.tpl" pagename="mylocation"%}
    {%widget name="index:widget/nearpush/bank.tpl" pagename="mylocation"%}
    {%widget name="index:widget/nearby/nearby.tpl" pagename="mylocation"%}
{%require name='index:page/mylocation.tpl'%}{%/block%}