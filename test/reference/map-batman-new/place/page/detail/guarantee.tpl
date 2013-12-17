{%* 担保通模板基类 *%}

{%extends file="common/page/layout.tpl"%}
{%block name="geo_config"%}
    {%$isStartGeo = "true"%}
    {%if $kehuduan%}
        {%$isStartGeo = "false"%}
    {%/if%}
    {%$geo_config="{isStartGeo:$isStartGeo}"%}
{%/block%}
{%block name="main"%}
    {%if $page_type === "detailact"%}
        {%$title = "返券说明"%}
    {%elseif $page_type === "orderact"%}
        {%$title = "返券说明 "%}
    {%else%}
        {%$title = "担保通"%}
    {%/if%}
    {%widget name="common:widget/nav/nav.tpl" title=$title mapLink=$data.result.type%}

    {%widget name="place:widget/guarantee/guarantee.tpl" page_type=$page_type%}
{%/block%}
{%block name="footer"%}{%/block%}