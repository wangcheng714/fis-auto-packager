{%extends file="common/page/layout.tpl"%} 
{%block name="geo_config"%}
{%$isStartGeo = "true"|f_escape_data%}
{%if $kehuduan%}
{%$isStartGeo = "false"|f_escape_data%}
{%/if%}
{%$geo_config="{isStartGeo:$isStartGeo}"|f_escape_data%}
{%/block%}
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title='错误提示'%}
{%widget name="place:widget/ordererror/error.tpl"%}
{%require name='place:page/order/error.tpl'%}{%/block%}