{%* 列表页page页面 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.marker-1,.marker-2,.marker-3,.marker-4,.marker-5,.marker-6,.marker-7,.marker-8,.marker-9,.marker-10,.marker-bus,.marker-sub{background:url(/static/place/images/markers_searchlist_3d21a2d.png) no-repeat 0 0;background-size:25px 371px;height:31px;width:25px;display:inline-block}.marker-1{background-position:0 0}.marker-2{background-position:0 -31px}.marker-3{background-position:0 -62px}.marker-4{background-position:0 -93px}.marker-5{background-position:0 -124px}.marker-6{background-position:0 -155px}.marker-7{background-position:0 -186px}.marker-8{background-position:0 -217px}.marker-9{background-position:0 -248px}.marker-10{background-position:0 -279px}.marker-bus{background-position:0 -310px}.marker-sub{background-position:0 -341px}</style>
{%/block%}
{%block name="main"%}
{%* 头部导航 *%}
{%widget name="common:widget/nav/nav.tpl" title=$data.result.wd mapLink=$commonUrl.nav.map pageType="list"%}
{%if $data.listInfo.isGRequest eq true%}
{%widget name="place:widget/listtool/listtool.tpl"  type=$data.place_info.d_data_type isMovie=$data.isMovie%}
{%/if%}
{%* 地点列表 *%}
{%if $data.isMovie%}
{%widget name="place:widget/movielist/movielist.tpl"%}
{%else%}
{%widget name="place:widget/placelist/placelist.tpl"%}
{%/if%}
{%require name='place:page/list/list.tpl'%}{%/block%}