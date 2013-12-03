{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
	{%widget name="common:widget/nav/nav.tpl" title="个人中心"  logoutLink=$commonUrl.nav.map pageType="list"%}
	{%* 个人中心 *%}
    {%widget name="user:widget/mycenter/mycenter.tpl"%}

{%require name='user:page/mycenter.tpl'%}{%/block%}