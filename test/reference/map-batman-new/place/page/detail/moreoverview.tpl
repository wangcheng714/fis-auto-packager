{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* place detail页布局样式 *%}
    <link rel="stylesheet"  type="text/css" href="/static/css/detail.inline.less?__inline">
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title="更多信息"%}
    <div class="place-page-detail place-page-detail-moreoverview">
        {%$widget_rich_list=[
            [
                "tpl"=>"place:widget/overview/overview.tpl",
                "isShow"=>1,
                "data"=>["data"=>$data.content.ext.rich_info,
                         "more"=>1]
            ]
        ]%}
        {%foreach from=$widget_rich_list item=widget_item%}
            {%widget name=$widget_item.tpl widget_data=$widget_item.data%}
        {%/foreach%}
    </div>
{%/block%}
