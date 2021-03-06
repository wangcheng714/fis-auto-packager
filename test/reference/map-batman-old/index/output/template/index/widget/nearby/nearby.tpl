{%style id="/widget/nearby/nearby.inline.less"%}.index-widget-nearby{padding:5px 8px 13px;background-color:#f2f2f2}.index-widget-nearby .hd{position:relative}.index-widget-nearby .hd h2{font-size:14px;height:36px;line-height:38px;font-weight:400;padding-left:36px;background:url(/static/index/images/npush-icon_c8f4089.png) 0 -91px no-repeat;background-size:32px 315px}.index-widget-nearby .list .active{background-color:#f8f8f8;border:1px solid #d7d7d7}.index-widget-nearby .list{display:-webkit-box;-webkit-box-pack:justify;list-style:none;width:100%;text-align:center;font-size:12px;color:#5a5a5a}.index-widget-nearby .list>li{overflow:hidden;width:33.1%;height:48px;border:1px solid #F2F2F2;background-color:#F2F2F2;margin-top:4px;border-radius:1px;position:relative;padding-top:37px;left:-10px}.index-widget-nearby .list>li.item-ui3-more-index{position:relative;width:128px;height:34px;line-height:34px;border-radius:4px;border:1px solid #afafaf;margin:10px auto;padding:0;background:#f0f0f0;font-size:15px;left:0}.index-widget-nearby .list>li.item-ui3-more-index .icon{display:none}.index-widget-nearby .list>li.item-ui3-more-index .ui3-font{display:block;position:static;width:100%;height:100%;color:#4c90f9}.index-widget-nearby .icon{position:absolute;background:url(/static/index/images/index-nb-pic_abb4683.png) no-repeat 0 0;left:33%;top:10px;height:54px;width:53px;background-size:52px 789px}.index-widget-nearby .ui3-font{position:absolute;top:68px;left:34px;width:53px;left:33%}.index-widget-nearby .ui3-canyin{background-position:1px 2px}.index-widget-nearby .ui3-hotel{background-position:1px -53px}.index-widget-nearby .ui3-bus{background-position:1px -165px}.index-widget-nearby .ui3-sale{background-position:1px -278px}.index-widget-nearby .ui3-takeout{background-position:1px -674px}.index-widget-nearby .ui3-bank{background-position:1px -116px}.index-widget-nearby .ui3-movie{background-position:1px -108px}.index-widget-nearby .ui3-water{background-position:1px -162px}.index-widget-nearby .ui3-oil{background-position:1px -504px}.index-widget-nearby .ui3-more{background-position:1px -448px}.index-widget-nearby .ui3-ktv{background-position:0 -617px}.index-widget-nearby .ui3-subway{background-position:1px -222px}.index-widget-nearby .ui3-streetview{background-position:1px -335px}.index-widget-nearby .newui_1_nb{background-position:1px -392px}.index-widget-nearby .ui3-youhui{background-position:1px -561px}.index-widget-nearby .ui3-taxi{background-position:0 -730px}.index-widget-nearby .index-sales-icon{line-height:1.4em;color:#FFF;display:inline-block;height:1.3em;width:9em;background:#f30909;position:absolute;-webkit-transform:rotate(45deg);top:3px;right:-43px}{%/style%}
<div class="index-widget-nearby">
{%*某些页面不需要头部*%}
{%$noHeaderPages = array('index','searchnearby')%}
{%if !in_array($pagename, $noHeaderPages)%}
<div class="hd">
<h2>附近</h2>
</div>
{%/if%}
{%$main = $data.main%}
{%$fixrank = $main.fixrank1%}
{%if $pagename != 'index'%}
{%$fixrank = $main.fixrank2%}
{%/if%}
{%* 按钮总数 *%}
{%$max = count($fixrank)%}
{%for $row = 0; $row < 4; $row++ %}
<ul class="list">
{%for $i = 3*$row; $i < 3*$row+3; $i++ %}
{%if ($i < $max)%}
{%$key = $fixrank[$i]%}
{%$content = $main.content[$key]%}
{%$word = $content.name%}
{%$module = $content.module%}
{%$action = $content.action%}
{%$id = $content.id%}
<li class="item-{%$main.content[$key].className|f_escape_xml%}-{%$page|f_escape_xml%}">
<a href="javascript:void(0);" jsaction="jump" userdata="{wd:'{%$word|f_escape_xml%}', module:'{%$module|f_escape_xml%}', action:'{%$action|f_escape_xml%}', id:'{%$id|f_escape_xml%}'}">
<b class="icon needsclick {%$main.content[$key].className|f_escape_xml%}"></b>
<span class='ui3-font'>{%$word|f_escape_xml%}
{%if ($main.content[$key].className === 'ui3-more' && $page === 'index')%}
...{%/if%}
</span>
</a>
</li>
{%/if%}
{%/for%}
</ul>
{%/for%}
</div>
{%script%}
    (require("index:widget/nearby/nearby.js")).init('{%$pagename|f_escape_js%}');
{%/script%}