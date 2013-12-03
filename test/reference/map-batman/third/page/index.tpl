{%* 首页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="js"%}
    <link rel="stylesheet" type="text/css" href="/static/css/third.inline.less?__inline">
    <script type="text/javascript" src="/static/js/recorder.js?__inline"></script>
{%/block%}
{%block name="header"%}
    {%widget name="third:widget/header/header.tpl" hideRight=true%}
{%/block%}
{%block name="main"%}
    {%widget name="third:widget/nearby/nearby.tpl" pagename="third" %}
    <script type="text/javascript">PDC && PDC.first_screen && PDC.first_screen();</script>
    {%widget name="third:widget/cateinfo/cateinfo.tpl" pagename="third"%}
    <div class="index-page-nearby-hd">周边推荐</div>
    {%widget name="third:widget/nearpush/cater.tpl" pagename="third"%}
    {%widget name="third:widget/nearpush/hotel.tpl" pagename="third"%}
    {%widget name="third:widget/bizarea/bizarea.tpl" pagename="third"%}
    {%widget name="third:widget/slideopen/slideopen.tpl" pagename="third"%}
    {%script%}
        (require("third:widget/helper/revert.js")).init();
    {%/script%}
{%/block%}