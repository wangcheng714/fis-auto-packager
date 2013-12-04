{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
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
{%/block%}


{%block name="main"%}
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title=$data.result.wd mapLink=$commonUrl.nav.map pageType="detail"%}

    <div class="place-page-detail">
        {%widget name="place:widget/captain/captain.tpl" widget_data=$data.content%}
        {%widget name="place:widget/goto/goto.tpl" widget_data=$data.content.goto wd=$data.content.ext.src_name bname=$data.content.name%}
        {%if $data.content.pano == 1%}
            {%widget name="place:widget/streetview/streetview.tpl" street_url=$data.content.streetUrl%}
        {%/if%}
        <script type="text/javascript">PDC && PDC.first_screen && PDC.first_screen();</script>
        {%widget name="place:widget/subwaystopdetail/subwaystopdetail.tpl" widget_data=$data.content%}
        {%widget name="place:widget/tosearch/tosearch.tpl" widget_data=$data.content%}
    </div>
{%require name='place:page/detail/subwaystop.tpl'%}{%/block%}