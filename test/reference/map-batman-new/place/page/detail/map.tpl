{%* 列表页map页 *%}
{%extends file="common/page/maplayout.tpl"%}
{%block name="main"%}
    {%* 头部导航 *%}
    {%widget name="common:widget/nav/nav.tpl" title=$data.result.wd pageType="map"%}
    {%script%}
        var data = {%json_encode($data)%};
        var searchDataResult = {%json_encode($searchDataResult)%};
        var mapWidget = require('common:widget/map/map.js');
        mapWidget.init(function(BMap) {
            (require("place:widget/helper/maphelper.js")).init(mapWidget, BMap, data, searchDataResult);
        });
    {%/script%}
{%/block%}
{%block name="footer"%}{%/block%}