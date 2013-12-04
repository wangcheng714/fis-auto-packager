{%* hao123路况落地页 *%}
{%extends file="common/page/maplayout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="路况" trafficLink="$data.url"%}
    {%script%}
    	require('third:widget/city/city.js').init();
        require('common:widget/map/map.js').init(function(BMap){
            // 各模块地图相关业务代码初始化
            require('third:widget/helper/maphelper.js').init();
        });
    {%/script%}
{%/block%}
{%block name="footer"%}{%/block%}