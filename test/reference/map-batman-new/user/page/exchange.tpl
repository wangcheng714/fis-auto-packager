{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="积分兑换" ruleLink=$commonUrl.nav.map pageType="list"%}
	{%* 跨城公交的列表 *%}
	{%widget name="user:widget/exchange/exchange.tpl"%}
{%/block%}