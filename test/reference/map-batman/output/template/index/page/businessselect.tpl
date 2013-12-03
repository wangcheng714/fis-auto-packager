{%* 商圈筛选页 *%}
{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%widget name="common:widget/nav/nav.tpl"%}
    <div class="blank"></div>
    {%widget name="index:widget/locsearch/locsearch.tpl"%}
    {%widget name="index:widget/businesslist/businesslist.tpl"%}
{%require name='index:page/businessselect.tpl'%}{%/block%}