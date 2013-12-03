{%* 更多分类 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="附近搜索"%}
{%widget name="index:widget/nbserachbox/nbserachbox.tpl"%}
{%widget name="index:widget/nearby/nearby.tpl" pagename="searchnearby"%}
{%require name='third:page/searchnearby.tpl'%}{%/block%}
