{%* 首页地图页 *%}
{%extends file="common/page/maplayout.tpl"%}
{%block name="main"%}
    {%widget name="index:widget/tabgroup/tabgroup.tpl" tab="map"%}
    {%widget name="index:widget/searchbox/searchbox.tpl" pagename="map" %}
    {%if ($page_config.topbanner == 1)%}
        {%widget name="common:widget/topbanner/topbanner.tpl" type="map"%}
    {%/if%}
    {%script%}
        require('common:widget/map/map.js').init(function(BMap){
            // 各模块地图相关业务代码初始化
            require('index:widget/helper/maphelper.js').init('indexmap');
            require("common:widget/login/login.js").checkLogin();
        });
    {%/script%}
{%/block%}
{%block name="footer"%}{%/block%}