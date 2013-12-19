{%style id="/widget/tabgroup/tabgroup.inline.less"%}.index-widget-tabgroup{height:50px;line-height:50px;background-color:#F2F2F2;font-size:15px;display:-webkit-box;position:relative}.index-widget-tabgroup .tab{width:2px;color:#D5D5D5;text-align:center;color:#000;background-color:#F2F2F2;border-bottom:1px solid #D4D4D4;display:block;-webkit-box-flex:1}.index-widget-tabgroup .tab .icon{background:url(/static/index/images/tabicon_b9fb433.png) no-repeat;background-size:35px 167px;display:inline-block;margin-right:9px;vertical-align:middle;margin-top:-5px;background-position:0 -18px}.index-widget-tabgroup .tab .icon-l{height:35px;width:12px;background-position:0 10px}.index-widget-tabgroup .tab .icon-m{height:30px;width:12px;background-position:0 -18px}.index-widget-tabgroup .tab .icon-r{height:30px;width:14px;background-position:0 -43px}.index-widget-tabgroup .tab-poi{border-right:1px solid #D4D4D4;border-left:1px solid #D4D4D4}.index-widget-tabgroup .tab.on{background-color:#FFF;color:#000;border-bottom:1px solid #FFF}{%/style%}
{%*这里临时处理 后续改成数组遍历输出 by jican*%}
{%if ($tab == 'map')%}
{%$maptab = 'on'|f_escape_xml%}
{%elseif ($tab == 'nav')%}
{%$navtab = 'on'|f_escape_xml%}
{%else%}
{%$nbtab = 'on'|f_escape_xml%}
{%/if%}
<div class="index-widget-tabgroup">
<a class="tab tab-map {%$maptab|f_escape_xml%}" href="javascript:void(0);" jsaction="tomap">
<span class="icon icon-l"></span>地图</a>
<a class="tab tab-poi {%$nbtab|f_escape_xml%}" href="javascript:void(0);" jsaction="toNearBySearch">
<span class="icon icon-m"></span>周边</a>
<a class="tab tab-nav {%$navtab|f_escape_xml%}" href="/mobile/webapp/index/index/foo=bar/tab=line" jsaction="toNavSearch">
<span class="icon icon-r"></span>路线</a>
</div>
{%script%}
    (require("index:widget/tabgroup/tabgroup.js")).init();
{%/script%}