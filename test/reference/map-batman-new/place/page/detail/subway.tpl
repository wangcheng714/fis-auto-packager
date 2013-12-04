{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* place detail页布局样式 *%}
    <link rel="stylesheet"  type="text/css" href="/static/css/detail.inline.less?__inline">
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title=$data.result.wd mapLink=$commonUrl.nav.map pageType="detail"%}
    <div class="place-page-detail">
        {%widget name="place:widget/captain/captain.tpl" widget_data=$data.content[0]%}
        {%widget name="place:widget/subwaydetail/subwaydetail.tpl" widget_data=$data.content[0]%}
    </div>
{%/block%}
{%block name="bottomBanner"%}
    {%widget name="common:widget/bottombanner/bottombanner.tpl"%}
{%/block%}