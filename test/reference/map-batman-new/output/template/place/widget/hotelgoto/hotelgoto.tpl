{%style id="/widget/hotelgoto/hotelgoto.inline.less"%}.hotel-goto{display:-webkit-box;-webkit-box-align:center;-webkit-box-pack:center;border:1px solid;border-color:#dadada #e4e4e4 #e4e4e4;border-radius:0 0 3px 3px;background-color:#f9f9f9;margin-bottom:10px}.hotel-goto a{-webkit-box-flex:1;display:block;-webkit-box-pack:center;-webkit-box-align:center;padding:12px 0;width:2px}.hotel-goto a .btn-wrap{border-right:1px solid #dadada;display:-webkit-box;-webkit-box-pack:center}.hotel-goto a .btn-wrap span{background:url(/static/place/widget/hotelgoto/images/gohere_logos_900b389.png) no-repeat;display:block;padding-left:22px;-webkit-background-size:20px 60px;font-size:14px;height:20px;line-height:20px}.hotel-goto a .btn-wrap span.search-btn{background-position:0 0}.hotel-goto a .btn-wrap span.goto-btn{background-position:0 -20px}.hotel-goto a .btn-wrap span.shoptel-btn{background-position:0 -40px}.hotel-goto a .btn-wrap span.shoptel-btn a{color:#4d4d4d}.hotel-goto a:last-child .btn-wrap{border-right:0}{%/style%}<div class="hotel-goto">
<a class="needsclick" href="{%$widget_data.nearby|f_escape_xml %}"
       data-log="{code: {%$STAT_CODE.PLACE_DETAIL_NEAR_CLICK|f_escape_xml%}, name:'{%$data.content.name|f_escape_xml%}', srcname:'hotel'}">
<span class="btn-wrap">
<span class="search-btn">搜周边</span>
</span>
</a>
<a class="needsclick" href="{%$widget_data.to|f_escape_xml %}"
       data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK|f_escape_xml%}, name:'{%$data.content.name|f_escape_xml%}', srcname:'hotel'}">
<span class="btn-wrap">
<span class="goto-btn">到这儿去</span>
</span>
</a>
{%if $data.content.ext && $data.content.ext.detail_info && $data.content.phone %}
<a class="needsclick" href="tel:{%$data.content.phone|f_escape_path%}"
           data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK|f_escape_xml%}, name:'{%$data.content.name|f_escape_xml%}', srcname:'hotel'}">
<span class="btn-wrap">
<span class="shoptel-btn">电话</span>
</span>
</a>
{%/if%}
</div>