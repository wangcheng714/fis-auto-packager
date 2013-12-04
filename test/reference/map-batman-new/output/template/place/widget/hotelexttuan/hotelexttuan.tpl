{%style id="/widget/hotelexttuan/hotelexttuan.inline.less"%}#place-pagelet-hotelexttuan em{background:url(/mobile/simple/static/place/images/place_b6c3cdf.png) no-repeat 0 -58px;background-size:114px 60px;width:20px;height:20px;display:block;margin-right:8px}#detail-groupon em{background-position:-80px 0}#detail-groupon{display:-webkit-box;-webkit-box-pack:justify}#detail-groupon .tuan-img{width:88px;height:75px;border:1px solid #d1d1d1}#detail-groupon .groupon-detail{-webkit-box-flex:1;margin-left:5px;padding-right:12px}.groupon-detail li{padding-bottom:5px;word-wrap:break-word;word-break:normal}.groupon-detail li.groupon-name{font-size:14px;font-weight:700;color:#333}.groupon-detail li.groupon-tit{color:#bdbdbd;font-size:12px}.groupon-detail li.groupon-price{display:-webkit-box;-webkit-box-pack:justify;-webkit-box-align:center;padding-bottom:0}.groupon-detail li.groupon-price .price-icon{color:#F43F00;margin-right:3px;font-weight:700;font-size:14px}.groupon-detail li.groupon-price>span{display:block}.groupon-detail li .groupon-count{font-size:12px;color:#868686}.groupon-detail .hotel-gotoarr{background:url(/mobile/simple/static/place/images/goto_92a90a7.png) right center no-repeat;background-size:7px 12px}{%/style%}{%if $widget_data.groupon && count($widget_data.groupon) %}
{%$groupon = $widget_data.groupon[0]%}
<a href="{%$groupon.groupon_webapp_url|f_escape_xml%}&uid={%$widget_data.uid|f_escape_path%}&from=map_webapp_detail&loc=({%$widget_data.ext.detail_info.point.x|f_escape_path%},{%$widget_data.ext.detail_info.point.y|f_escape_path%})"
       data-log="{code:{%$STAT_CODE.PLACE_DETAIL_GROUPON_CLICK|f_escape_xml%}}" id="detail-groupon" class="hotel-card">
<em></em>
<img class="tuan-img" src="{%urldecode($groupon.groupon_image)%}" />
<ul class="groupon-detail hotel-gotoarr">
<li class="groupon-name">{%$groupon.groupon_brandtag|f_escape_xml%}</li>
<li class="groupon-tit">
{%if strlen($groupon.groupon_title)%}
{%mb_substr($groupon.groupon_title, 0, 20)%}...{%else%}
{%$groupon.groupon_title|f_escape_xml%}
{%/if%}
</li>
<li class="groupon-price">
<span class="price-icon">&yen;{%$groupon.groupon_price|f_escape_xml%}元</span>
{%if count($widget_data.groupon) > 1 %}
<span class="groupon-count">{%count($widget_data.groupon)%}条</span>
{%/if%}
</li>
</ul>
</a>
{%script%}
        var stat = require('common:widget/stat/stat.js');

        // 详情页团购展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_GROUPON_VIEW);
    {%/script%}
{%/if%}