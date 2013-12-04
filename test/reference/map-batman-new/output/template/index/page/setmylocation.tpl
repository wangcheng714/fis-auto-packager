{%* 城市选择页 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.index-page-headerinfo{background:#f0f0f0}</style>
{%/block%}
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title="选择城市"%}
<div class="index-page-headerinfo">
{%* 当前位置 *%}
{%widget name="index:widget/curloc/curloc.tpl"%}
{%* 搜索框 *%}
{%widget name="index:widget/locsearch/locsearch.tpl"%}
</div>
{%widget name="index:widget/historycity/historycity.tpl"%}
{%* 所有城市 *%}
{%widget name="index:widget/allcity/allcity.tpl"%}
{%require name='index:page/setmylocation.tpl'%}{%/block%}