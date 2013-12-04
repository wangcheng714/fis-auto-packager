{%* 列表页page页面 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
<div class="place-widget-codesindex">
{%widget name="place:widget/codesindex/codesindex.tpl"%}
</div>
{%require name='place:page/codes/index.tpl'%}{%/block%}