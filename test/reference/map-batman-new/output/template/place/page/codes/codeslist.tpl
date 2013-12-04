{%* 列表页page页面 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 影院列表页面 *%}
<div class="place-widget-codes">
{%widget name="place:widget/codes/codes.tpl"%}
</div>
{%require name='place:page/codes/codeslist.tpl'%}{%/block%}