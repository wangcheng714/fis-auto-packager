{%style id="/widget/cateinfo/cateinfo.inline.less"%}.index-widget-cateinfo{font-size:13px}.index-widget-cateinfo dl{position:relative;border:1px solid #f0f0f0;margin:0 8px 9px;background-color:#fff}.index-widget-cateinfo dl dt{width:22%;height:31px;position:absolute;left:0;padding-top:47px;text-align:center;font-size:13px;color:#555}.index-widget-cateinfo dl dd{float:right;width:78%;margin-left:-1px;border-left:1px solid #f6f6f6}.index-widget-cateinfo .sublist{width:100%;display:-webkit-box}.index-widget-cateinfo .sublist li{width:33%;text-align:center;padding:5px 0}.index-widget-cateinfo .sublist a{color:#3c6aa7;display:inline-block;padding:7px 10px}.index-widget-cateinfo .sublist a.active{background-color:#f7f7f7}.index-widget-cateinfo .icon{position:absolute;height:20px;width:20px;background:url(/static/third/images/index-nb-pic_ee586e5.png) no-repeat 0 0;background-size:24px 365px;left:50%;top:17px;margin-left:-10px}.index-widget-cateinfo .cateinfo-hotel{margin-top:18px}.index-widget-cateinfo .cateinfo-canyin .icon{background-position:0 -226px}.index-widget-cateinfo .cateinfo-hotel .icon{background-position:0 -250px}.index-widget-cateinfo .cateinfo-ent .icon{background-position:0 -273px}.index-widget-cateinfo .cateinfo-trf .icon{background-position:0 -297px}.index-widget-cateinfo .cateinfo-service .icon{background-position:0 -320px}{%/style%}
<div class="index-widget-cateinfo">
{%$cateinfo = $data.cateinfo%}
{%for $i = 0; $i < count($cateinfo.other); $i++ %}
{%$key = $cateinfo.other[$i]%}
{%$cate = $cateinfo.content[$key]%}
<dl class="clearfix">
<dt class="{%$cate.className|f_escape_xml%}">
<div class="icon"></div>{%$cate.name|f_escape_xml%}
</dt>
<dd class="subwrap">
{%for $index=0, $j = 0; $j < count($cate.subcate); $j++ %}
{%$word = $cate.subcate[$j].name%}
{%$id = $cate.id%}
{%if $index%3==0 %}
<ul class="sublist">
{%/if%}
<li>
<a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word|f_escape_xml%}',cate:'{%$id|f_escape_xml%}'}">
{%$word|f_escape_xml%}
</a>
</li>
{%if $index%3==2 %}
</ul>
{%/if%}
{%$index = $index+1%}
{%/for%}
</dd>
</dl>
{%/for%}
</div>
{%script%}
    (require("third:widget/cateinfo/cateinfo.js")).init();
{%/script%}