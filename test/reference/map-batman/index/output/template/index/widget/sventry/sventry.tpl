{%style id="/widget/sventry/sventry.inline.less"%}.index-widget-sventry{font-family:"微软雅黑";font-size:15px;padding-top:2px}.index-widget-sventry .city-item{height:134px;padding:0 8px;margin-top:10px;padding-bottom:20px;display:block}.index-widget-sventry .city-pic{height:93px;background-size:527px 93px;background-position:center;margin:0 auto;background-repeat:no-repeat}.index-widget-sventry .city-name{height:41px;background:#fff;margin:0 auto}.index-widget-sventry .city-name .name{margin-left:11px;line-height:41px}.index-widget-sventry .city-name .arrow{width:7px;height:10px;background:url(/static/index/images/goto-sv_67b8690.png) no-repeat;background-size:7px 10px;background-position:0 0;display:inline-block;margin:15px 11px;float:right}{%/style%}{%json file="index/sventry.json" assign="loc_conf"%}
<div class="index-widget-sventry">
{%$citys = $data.citys%}
{%for $i = 0; $i < count($citys); $i++ %}
<a class = "city-item" href="javascript:void(0);" data="{'heading':'{%$citys[$i]->heading%}','name':'{%$citys[$i]->name%}', 'pitch':'{%$citys[$i]->pitch%}', 'sid':'{%$citys[$i]->sid%}', 'type':'{%$citys[$i]->type%}', 'x':'{%$citys[$i]->x%}','y':'{%$citys[$i]->y%}'}">
<div class="city-pic" style="background-image: url({%$citys[$i]->imageUrl%})" ></div>
<div class="city-name">
<span class="name" sidx={%$i|f_escape_xml%}>{%$citys[$i]->name%}</span>
<span class="arrow"></span>
</div>
</a>
{%/for%}
</div>
{%script%}
require("index:widget/sventry/sventry.js").init();
{%/script%}
