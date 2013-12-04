{%* hao123查看公交落地页 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.common-widget-header{display:none}</style>
{%/block%}
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="查公交"%}
{%widget name="third:widget/transitplan/transitplan.tpl"%}
{%widget name="third:widget/city/city.tpl"%}
{%widget name="third:widget/searchline/searchline.tpl"%}
{%widget name="third:widget/searchbutton/searchbutton.tpl"%}
{%/block%}
{%block name="footer"%}
{%widget name="third:widget/footer/footer.tpl"%}
{%require name='third:page/hao123transit.tpl'%}{%/block%}
