{%style id="/widget/cateinfo/cateinfo.inline.less"%}.third-cateinfo{font-size:13px}.third-cateinfo dl{position:relative;border:1px solid #f0f0f0;margin:0 8px 9px;background-color:#fff}.third-cateinfo dl dt{width:22%;height:31px;position:absolute;left:0;padding-top:47px;text-align:center;font-size:13px;color:#555}.third-cateinfo dl dd{float:right;width:78%;margin-left:-1px;border-left:1px solid #f6f6f6}.third-cateinfo .sublist{width:100%;display:-webkit-box}.third-cateinfo .sublist li{width:33%;text-align:center;padding:5px 0}.third-cateinfo .sublist a{color:#3c6aa7;display:inline-block;padding:7px 10px}.third-cateinfo .sublist a.active{background-color:#f7f7f7}.third-cateinfo .icon{position:absolute;height:20px;width:20px;background:url(/static/third/images/index-nb-pic_ee586e5.png) no-repeat 0 0;background-size:24px 365px;left:50%;top:17px;margin-left:-10px}.third-cateinfo .cateinfo-hotel{margin-top:18px}.third-cateinfo .cateinfo-canyin .icon{background-position:0 -226px}.third-cateinfo .cateinfo-hotel .icon{background-position:0 -250px}.third-cateinfo .cateinfo-ent .icon{background-position:0 -273px}.third-cateinfo .cateinfo-trf .icon{background-position:0 -297px}.third-cateinfo .cateinfo-service .icon{background-position:0 -320px}{%/style%}
<div class="index-widget-cateinfo third-cateinfo">
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