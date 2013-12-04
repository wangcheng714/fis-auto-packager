{%* 首页 *%}
{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
    <link rel="stylesheet" type="text/css" href="/static/css/index.inline.less?__inline">
    <script type="text/javascript" src="/static/js/recorder.js?__inline"></script>
{%/block%}

{%block name="cover"%}
    {%if $data.isShowCover == "true"%}
        {%widget name="common:widget/cover/cover.tpl" pagename="index" netype="{%$wise_info.netype%}"%}
    {%/if%}
{%/block%}

{%block name="header"%}
    {%widget name="common:widget/header/header.tpl"%}
{%/block%}

{%block name="main"%}
    {%widget name="index:widget/tabgroup/tabgroup.tpl"%}
    {%widget name="index:widget/searchbox/searchbox.tpl"%}
    {%if ($page_config.topbanner == 1)%}
        {%widget name="common:widget/topbanner/topbanner.tpl"%}
    {%/if%}
    {%widget name="index:widget/nearby/nearby.tpl" pagename="index" %}
    {%widget name="index:widget/thumbnail/thumbnail.tpl" pagename="index"%}
    {%widget name="index:widget/addestop/addestop.tpl" pagename="index"%}

    <script type="text/javascript">
        PDC && PDC.first_screen && PDC.first_screen();
    </script>
    {%script%}
        (require("index:widget/helper/revert.js")).init();
        (require("common:widget/login/login.js")).checkLogin();
    {%/script%}
    {%widget name="index:widget/surface/surface.tpl" pagename="index"%}
{%/block%}