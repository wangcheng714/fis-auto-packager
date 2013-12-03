{%style id="/widget/goto/goto.inline.less"%}.place-widget-goto{overflow:hidden}.place-widget-goto a{float:left;display:block;width:31.3%;height:57px;text-align:center;margin-right:2%;box-sizing:border-box;-webkit-box-sizing:border-box;padding:35px 10px 2px;border:#B0B0B0 solid 1px;border-radius:.25em;background:#fff no-repeat center 6px;background-size:16px 25px;color:#000}.place-widget-goto .to{background-image:url(/static/place/images/gohere_1416355.png)}.place-widget-goto .from{background-image:url(/static/place/images/fromhere_806acd3.png)}.place-widget-goto .near{background-image:url(/static/place/images/nearby_876328e.png);background-size:22px 22px;width:33.3%;margin-right:0}{%/style%}{%* 路线搜索 *%}
<div class="place-widget-goto">
<a class="to needsclick" href="{%$widget_data.to|f_escape_xml%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK|f_escape_xml%}, wd:'{%$wd|f_escape_xml%}', name:'{%$bname|f_escape_xml%}', srcname: '{%$srcname|f_escape_xml%}', entry: '{%$entry|f_escape_xml%}'}">
<span class="text">到这里去</span>
</a>
<a class="from needsclick" href="{%$widget_data.from|f_escape_xml%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_FROM_CLICK|f_escape_xml%}, wd:'{%$wd|f_escape_xml%}', name:'{%$bname|f_escape_xml%}', srcname: '{%$srcname|f_escape_xml%}', entry: '{%$entry|f_escape_xml%}'}">
<span class="text">从这里出发</span>
</a>
<a class="near needsclick" href="{%$widget_data.nearby|f_escape_xml%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_NEAR_CLICK|f_escape_xml%}, wd:'{%$wd|f_escape_xml%}', name:'{%$bname|f_escape_xml%}', srcname: '{%$srcname|f_escape_xml%}', entry: '{%$entry|f_escape_xml%}'}">
<span class="text">在附近找</span>
</a>
</div>