{%style id="/widget/cateinfo/cateinfo.inline.less"%}.index-widget-cateinfo{font-size:13px}.index-widget-cateinfo dl{position:relative;border:1px solid #f0f0f0;margin:0 8px 9px;background-color:#fff}.index-widget-cateinfo dl dd{float:right;width:65%;margin-left:-1px;border-left:1px solid #f6f6f6}.index-widget-cateinfo .titie-name{font-size:16px;position:absolute;top:13px;left:-41px;width:137px;height:116px;z-index:10000}.index-widget-cateinfo .sublist{width:100%;display:-webkit-box;border-bottom:1px solid #f6f6f6}.index-widget-cateinfo .sublist li{width:50%;text-align:center;padding:5px 0;border-right:1px solid #f6f6f6}.index-widget-cateinfo .sublist a{color:#3c6aa7;display:inline-block;padding:7px 10px}.index-widget-cateinfo .sublist a.active{background-color:#f7f7f7}.index-widget-cateinfo .icon{position:absolute;height:18px;width:15px;background:url(/static/index/images/indexMore_4ac6293.png) no-repeat 0 0;background-size:100px 500px;left:50%;top:12px;margin-left:-10px}.index-widget-cateinfo .back-icon{height:77px;width:78px;background:url(/static/index/images/indexMore_4ac6293.png) no-repeat 0 0;background-size:100px 500px;margin-left:-10px;float:right;margin-top:48px}.index-widget-cateinfo .cateinfo-canyin{height:120px;width:35%;left:0;text-align:center;font-size:13px;color:#555;float:left}.index-widget-cateinfo .cateinfo-canyin .icon{background-position:1px -449px;left:59px;top:13px}.index-widget-cateinfo .cateinfo-canyin .back-icon{background-position:0 3px;margin-right:-1px}.index-widget-cateinfo .cateinfo-canyin .titie-name{color:#FB9543}.index-widget-cateinfo .cateinfo-hotel{height:159px;width:35%;left:0;text-align:center;font-size:13px;color:#555;float:left}.index-widget-cateinfo .cateinfo-hotel .icon{background-position:0 -466px;height:16px;left:59px;top:15px}.index-widget-cateinfo .cateinfo-hotel .back-icon{background-position:0 -102px;margin-top:103px}.index-widget-cateinfo .cateinfo-hotel .titie-name{color:#9FCB95}.index-widget-cateinfo .cateinfo-ent{height:120px;width:35%;left:0;text-align:center;font-size:13px;color:#555;float:left}.index-widget-cateinfo .cateinfo-ent .icon{background-position:1px -481px;left:90px;top:13px}.index-widget-cateinfo .cateinfo-ent .back-icon{background-position:0 -163px;margin-top:49px}.index-widget-cateinfo .cateinfo-ent .titie-name{color:#EE7977;left:-26px}.index-widget-cateinfo .cateinfo-trf{height:120px;width:35%;left:0;text-align:center;font-size:13px;color:#555;float:left}.index-widget-cateinfo .cateinfo-trf .icon{background-position:-15px -449px;left:90px;top:13px}.index-widget-cateinfo .cateinfo-trf .back-icon{background-position:0 -251px;left:37px}.index-widget-cateinfo .cateinfo-trf .titie-name{color:#81AFDE;left:-26px}.index-widget-cateinfo .cateinfo-service{height:120px;width:35%;left:0;text-align:center;font-size:13px;color:#555;float:left}.index-widget-cateinfo .cateinfo-service .icon{background-position:-15px -466px;left:90px;top:15px}.index-widget-cateinfo .cateinfo-service .back-icon{background-position:5px -344px;margin-top:49px}.index-widget-cateinfo .cateinfo-service .titie-name{color:#9AA0C3;left:-26px}{%/style%}
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
    (require("index:widget/cateinfo/cateinfo.js")).init();
{%/script%}