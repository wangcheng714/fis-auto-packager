{%* 地图页 *%}
{%extends file="common/page/maplayout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="步行方案"%}
    {%script%}
        var mapView = require('common:widget/map/map.js');
        var data = {%json_encode($data)%};
        mapView.init(function(BMap){
            // 各模块地图相关业务代码初始化
            require('walk:widget/helper/maphelper.js').init(BMap,mapView,data);
        });
    {%/script%}
{%/block%}
{%block name="footer"%}{%/block%}