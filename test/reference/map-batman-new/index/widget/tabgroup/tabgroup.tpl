<!-- @fileOverview 首页Tab模板 by jican-->
{%*这里临时处理 后续改成数组遍历输出 by jican*%}
{%if ($tab == 'map')%}
    {%$maptab = 'on'%}
{%elseif ($tab == 'nav')%}
    {%$navtab = 'on'%}
{%else%}
    {%$nbtab = 'on'%}
{%/if%}
<div class="index-widget-tabgroup">
    <a class="tab tab-map {%$maptab%}" href="/mobile/webapp/index/index/foo=bar/vt=map" jsaction="toMapSearch">
        <span class="icon icon-l"></span>地图
    </a>
    <a class="tab tab-poi {%$nbtab%}" href="javascript:void(0);" jsaction="toNearBySearch">
        <span class="icon icon-m"></span>周边
    </a>
    <a class="tab tab-nav {%$navtab%}" href="/mobile/webapp/index/index/foo=bar/tab=line" jsaction="toNavSearch">
        <span class="icon icon-r"></span>路线
    </a>
</div>
{%script%}
    (require("tabgroup.js")).init();
{%/script%}