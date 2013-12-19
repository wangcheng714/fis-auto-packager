{%* 担保通模板基类 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="geo_config"%}
{%$isStartGeo = "true"|f_escape_data%}
{%if $kehuduan%}
{%$isStartGeo = "false"|f_escape_data%}
{%/if%}
{%$geo_config="{isStartGeo:$isStartGeo}"|f_escape_data%}
{%/block%}
{%block name="main"%}
{%if $page_type === "detailact"%}
{%$title = "返券说明"|f_escape_data%}
{%elseif $page_type === "orderact"%}
{%$title = "返券说明 "|f_escape_data%}
{%else%}
{%$title = "担保通"|f_escape_data%}
{%/if%}
{%widget name="common:widget/nav/nav.tpl" title=$title mapLink=$data.result.type%}
{%widget name="place:widget/guarantee/guarantee.tpl" page_type=$page_type%}
{%/block%}
{%block name="footer"%}{%require name='place:page/detail/guarantee.tpl'%}{%/block%}