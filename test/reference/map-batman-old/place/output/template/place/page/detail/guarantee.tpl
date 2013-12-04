{%* 担保通模板基类 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%widget name="common:widget/nav/nav.tpl" title="担保通" mapLink=$data.result.type%}
{%widget name="place:widget/guarantee/guarantee.tpl"%}
{%require name='place:page/detail/guarantee.tpl'%}{%/block%}