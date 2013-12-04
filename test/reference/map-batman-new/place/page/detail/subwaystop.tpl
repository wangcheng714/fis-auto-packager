{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
    {%* place detail页布局样式 *%}
    <link rel="stylesheet"  type="text/css" href="/static/css/detail.inline.less?__inline">
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
{%/block%}