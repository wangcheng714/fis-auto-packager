{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="" isReplace=true%}
{%widget name="index:widget/error/error.tpl"%}
{%script%}
	(require('index:widget/error/error.js')).init();
{%/script%}
{%require name='third:page/error.tpl'%}{%/block%}