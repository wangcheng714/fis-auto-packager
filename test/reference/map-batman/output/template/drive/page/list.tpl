{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%if $data.result._state != 0%}
		{%widget name="common:widget/nav/nav.tpl" widgetTitle="common:widget/traffictitle/traffictitle.tpl" trafficType="drive" mapLink=$data.result.mapUrl%}
	{%else%}
		{%widget name="common:widget/nav/nav.tpl" widgetTitle="common:widget/traffictitle/traffictitle.tpl" trafficType="drive"%}		
	{%/if%}	
	{%* 驾车的详情页 *%}
    {%widget name="drive:widget/list/list.tpl"%}
    {%script%}
    	var shareFriends = require('common:widget/sharefriends/sharefriends.js');
    	shareFriends.init('drive');
        window._APP_NAVI_QUERY = {
            start : {%json_encode($data.result.start.pt)%},
            endp   : {%json_encode($data.result.end[0].pt)%},
            sy    : {%json_encode($data.result.sy)%}
        }
        //导航的入口
        var navi = require('drive:widget/navi/navi.js');
        navi.bindEvent();
    {%/script%}
{%require name='drive:page/list.tpl'%}{%/block%}