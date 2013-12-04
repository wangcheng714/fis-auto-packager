{%* 外卖详情页page页面 *%}
{%extends file="common/page/layout.tpl"%}

{%block name="main"%}
	{%* 头部导航 *%}
	{%widget name="place:widget/takeoutdetailnav/takeoutdetailnav.tpl" %}
	{%widget name="place:widget/takeoutdetail/takeoutdetail.tpl"%}
{%/block%}