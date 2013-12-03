{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* place detail页布局样式 *%}
    <style  type="text/css">.place-page-detail {
  padding: 0px 8px 8px;
  background: #F2F2F2;
  overflow: hidden;
}
.place-page-detail > [class^="place-widget-"],
.place-page-detail > [id^="place-pagelet-"] > [class^="place-widget-"] {
  margin: 10px 0px;
}
.place-page-detail .place-widget-comment,
.place-page-detail .place-widget-overview,
.place-page-detail .place-widget-sitelink,
.place-page-detail .place-widget-tosearch,
.place-page-detail .place-widget-cater,
.place-page-detail .place-widget-recommend {
  margin: 20px 0px;
}
.place-page-detail.movie > [class^="place-widget-"],
.place-page-detail.movie > [id^="place-pagelet-"] > [class^="place-widget-"] {
  margin-bottom: 0px;
}
.place-page-detail.movie div.place-widget-goto {
  margin: 0px 0px 10px;
}
.place-page-detail.movie div.place-widget-captain,
.place-page-detail.movie div.place-pagelet-basicmovieinfo,
.place-page-detail.movie div.place-widget-promotion {
  margin: 10px 0px 0px;
}
</style>
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
{%require name='place:page/detail/moreoverview.tpl'%}{%/block%}
