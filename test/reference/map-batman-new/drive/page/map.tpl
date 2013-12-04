{%* 地图页 *%}
{%extends file="common/page/maplayout.tpl"%}

{%block name="main"%}
	<link rel="stylesheet" href="/static/css/navi.inline.less?__inline">
	{%widget name="common:widget/nav/nav.tpl" title="驾车方案" nav_btn="导航"%}
    {%script%}
        var mapView = require('common:widget/map/map.js');
        var data = {%json_encode($data)%};
        window._APP_NAVI_QUERY = {
            start : {%json_encode($data.result.start.pt)%},
            endp   : {%json_encode($data.result.end[0].pt)%},
            sy    : {%json_encode($data.result.sy)%}
        }

        mapView.init(function(BMap){
            // 各模块地图相关业务代码初始化
            require('drive:widget/helper/maphelper.js').init(BMap,mapView,data);
        });
        //导航的入口
        var navi = require('drive:widget/navi/navi.js');
        navi.bindNav();

    {%/script%}
{%/block%}
{%block name="footer"%}{%/block%}