{%style id="/widget/caterorderseat/caterorderseat.inline.less"%}#place-widget-caterorderseat{background:-webkit-gradient(linear,0 100%,0 0,from(#eee),to(#fdfdfd));border:1px solid #838991;border-radius:.25em;word-wrap:normal;overflow:hidden;text-overflow:ellipsis;font-size:1.143em;color:#333;text-align:center;cursor:pointer;margin:0 0 10px}#place-widget-caterorderseat a{display:block;padding:.4em 0}#place-widget-caterorderseat span.caterorderseat-icon{background:url(/static/place/images/list_book_d8abeb1.png);background-size:20px 20px;width:20px;height:20px;position:relative;top:3px}#place-widget-caterorderseat span{display:inline-block}{%/style%}<div id="place-widget-caterorderseat">
<a href="/mobile/webapp/place/cater/force=superman&qt=bookinfo?uid={%$uid|f_escape_path%}&thirdId={%$thirdId|f_escape_path%}" data-log="{code:{%$STAT_CODE.PLACE_CATER_DETAIL_BOOK_SEAT_CLICK|f_escape_xml%}, wd:'{%$wd|f_escape_xml%}', name: '{%$bname|f_escape_xml%}', srcname: 'cater'}">
<span class="caterorderseat-icon"></span>
<span>我要订座</span>
</a>
</div>
{%script%}
    var stat = require('common:widget/stat/stat.js');
    stat.addStat(STAT_CODE.PLACE_CATER_DETAIL_BOOK_SEAT_SHOW_PV, {wd: '{%$wd|f_escape_js%}', srcname: 'cater', name: '{%$bname|f_escape_js%}'});
{%/script%}
