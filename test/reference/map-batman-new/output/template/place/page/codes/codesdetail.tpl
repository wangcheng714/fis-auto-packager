{%* 兑换码衔接page页面 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* 兑换码详情页 *%}
<div class="place-widget-codesdetail">
{%widget name="place:widget/codesdetail/codesdetail.tpl"%}
</div>
{%require name='place:page/codes/codesdetail.tpl'%}{%/block%}