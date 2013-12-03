{%* 列表页page页面 *%}
{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
<link rel="stylesheet" type="text/css" href="/static/css/marker.inline.css?__inline">
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
{%/block%}