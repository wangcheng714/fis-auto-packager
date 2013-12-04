{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="我的积分" exchangeLink=$commonUrl.nav.map pageType="list"%}
	{%* 跨城公交的列表 *%}
	{%widget name="user:widget/score/score.tpl"%}
{%require name='user:page/score.tpl'%}{%/block%}