{%extends file="common/page/layout.tpl"%}
{%block name="geo_config"%}
    {%$isStartGeo = "true"%}
    {%if $kehuduan%}
        {%$isStartGeo = "false"%}
    {%/if%}
    {%$geo_config="{isStartGeo:$isStartGeo}"%}
{%/block%}
{%block name="main"%}
    {%* 头部导航 *%}
    {%widget name="common:widget/nav/nav.tpl" title='订单详情'%}
    {%widget name="place:widget/catersearchorder/catersearchorder.tpl"%}
{%/block%}