{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%* 头部导航 *%}
	{%$title = join('>', array($data.result.start.wd, $data.result.end.wd))%}
	{%widget name="common:widget/nav/nav.tpl" title=$title mapLink=$data.result.mapUrl%}
	{%* 公交的详情 *%}
    {%widget name="transit:widget/detail/detail.tpl"%}
    {%script%}
    	var shareFriends = require('common:widget/sharefriends/sharefriends.js');
    	shareFriends.init('transit');
    {%/script%}
{%require name='transit:page/detail.tpl'%}{%/block%}