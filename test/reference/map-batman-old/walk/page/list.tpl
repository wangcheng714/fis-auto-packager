{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%widget name="common:widget/nav/nav.tpl" widgetTitle="common:widget/traffictitle/traffictitle.tpl" trafficType="walk" mapLink=$data.result.mapUrl%}
	{%* 步行的详情页 *%}
    {%widget name="walk:widget/list/list.tpl"%}
    {%script%}
    	var shareFriends = require('common:widget/sharefriends/sharefriends.js');
    	shareFriends.init('walk');
    {%/script%}
{%/block%}