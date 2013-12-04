{%style id="/widget/nearby/nearby.inline.less"%}.index-widget-nearby{padding:10px 8px;background-color:#f9f9f9}.index-widget-nearby .hd{position:relative;margin-bottom:17px}.index-widget-nearby .hd h2{font-size:14px;height:36px;line-height:38px;font-weight:400;padding-left:36px;background:url(/static/third/images/npush-icon_c8f4089.png) 0 -91px no-repeat;background-size:32px 315px}.index-widget-nearby .list .active{background-color:#f8f8f8;border:1px solid #d7d7d7}.index-widget-nearby .list{display:-webkit-box;-webkit-box-pack:justify;list-style:none;width:100%;text-align:center;font-size:12px;color:#5a5a5a}.index-widget-nearby .list>li{width:18.1%;margin-top:4px}.index-widget-nearby .list a{height:21px;background-color:#fff;border:1px solid #ececec;border-radius:1px;position:relative;color:#5A5A5A;display:block;padding-top:34px}.index-widget-nearby .icon{position:absolute;height:20px;width:20px;background:url(/static/third/images/index-nb-pic_ee586e5.png) no-repeat 0 0;background-size:24px 365px;left:50%;top:10px;margin-left:-10px}.index-widget-nearby .ui3-canyin{background-position:0 0}.index-widget-nearby .ui3-hotel{background-position:1px -23px}.index-widget-nearby .ui3-bus{background-position:1px -46px}.index-widget-nearby .ui3-sale{background-position:1px -70px}.index-widget-nearby .ui3-takeout{background-position:1px -93px}.index-widget-nearby .ui3-bank{background-position:1px -116px}.index-widget-nearby .ui3-movie{background-position:1px -140px}.index-widget-nearby .ui3-water{background-position:1px -162px}.index-widget-nearby .ui3-oil{background-position:1px -185px}.index-widget-nearby .ui3-more{background-position:0 -205px}.index-widget-nearby .ui3-ktv{background-position:0 -345px}{%/style%}
<div class="index-widget-nearby">
{%*某些页面不需要头部*%}
{%$noHeaderPages = array('index','searchnearby')%}
{%if !in_array($pagename, $noHeaderPages)%}
{%/if%}
<ul class="list">
{%for $i = 0; $i < 5; $i++ %}
<li>
{%$main = $data.main%}
{%$key = $main.fixrank[$i]%}
{%$content = $main.content[$key]%}
{%$word = $content.name%}
{%$module = $content.module%}
{%$action = $content.action%}
{%$id = $content.id%}
<a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word|f_escape_xml%}', module:'{%$module|f_escape_xml%}', action:'{%$action|f_escape_xml%}', id:'{%$id|f_escape_xml%}'}">
<b class="icon {%$main.content[$key].className|f_escape_xml%}"></b>{%$word|f_escape_xml%}
</a>
</li>
{%/for%}
</ul>
<ul class="list">
{%for $i = 5; $i < 10; $i++ %}
<li>
{%$main = $data.main%}
{%$key = $main.fixrank[$i]%}
{%$content = $main.content[$key]%}
{%$word = $content.name%}
{%$module = $content.module%}
{%$action = $content.action%}
{%$id = $content.id%}
<a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word|f_escape_xml%}', module:'{%$module|f_escape_xml%}', action:'{%$action|f_escape_xml%}', id:'{%$id|f_escape_xml%}'}">
<b class="icon {%$main.content[$key].className|f_escape_xml%}"></b>{%$word|f_escape_xml%}
</a>
</li>
{%/for%}
</ul>
</div>
{%script%}
    (require("third:widget/nearby/nearby.js")).init('{%$pagename|f_escape_js%}');
{%/script%}