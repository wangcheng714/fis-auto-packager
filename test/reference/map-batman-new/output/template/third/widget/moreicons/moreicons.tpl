{%style id="/widget/moreicons/moreicons.inline.less"%}.more-icons{padding-top:30px}.more-icons ul{margin:0 6px;display:-webkit-box;overflow:hidden;text-align:center}.more-icons ul li{-webkit-box-flex:1;width:100%}.more-icons ul.line{margin-bottom:10px}.more-icons a{color:#6f6f6f}.more-icons a s{display:inline-block;background-size:18px 315px;background-image:url(/static/third/images/more-icons_7fa2b8b.png);background-repeat:no-repeat;text-align:right;height:21px;width:22px;position:relative;top:8px}.more-icons .weather s{background-position:0 -100px}.more-icons .streetspace s{background-position:0 -238px}.more-icons .subway s{background-position:0 -179px}.more-icons .shop s{background-position:0 -260px}.more-icons .transit s{background-position:0 -40px}.more-icons .hotel s{background-position:0 -79px}.more-icons .film s{background-position:0 -200px}.more-icons .more s{background-position:0 -220px}{%/style%}<div class="more-icons">
<ul class="line">
{%if ($action == "transit")%}
<li><a class="weather" data-wd="天气"><s></s>天气</a></li>{%elseif ($action == 'weather')%}
<li><a class="transit" data-wd="公交"><s></s>公交</a></li>
{%/if%}
<li><a class="subway" data-wd="地铁图"><s></s>地铁图</a></li>
<li><a class="streetspace" data-wd="全景"><s></s>全景</a></li>
<li><a class="shop" data-wd="团购"><s></s>团购</a></li>
</ul>
<ul class="line">
<li><a class="hotel" data-wd="酒店"><s></s>酒店</a></li>
<li><a class="film" data-wd="电影院"><s></s>电影院</a></li>
<li><a class="more" data-wd="更多"><s></s>更多</a></li>
<li></li>
</ul>
</div>
{%script%}
    (require("third:widget/moreicons/moreicons.js")).init();
{%/script%}