{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="积分规则"%}
	{%* 跨城公交的列表 *%}
	{%widget name="user:widget/rule/rule.tpl"%}
	{%script%}
	(require('user:widget/rule/rule.js')).init();
	{%/script%}
{%require name='user:page/rule.tpl'%}{%/block%}
