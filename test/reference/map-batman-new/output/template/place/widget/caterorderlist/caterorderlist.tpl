{%style id="/widget/caterorderlist/caterorderlist.inline.less"%}#place-widget-caterorderlist .hd{height:50px;line-height:50px;font-size:15px;margin:0 10px;position:relative}#place-widget-caterorderlist .hd .change-btn{font-size:.9em;display:inline-block;padding:0 10px;border-left:1px solid #e4e4e4;position:absolute;right:-10px;line-height:50px;height:50px}#place-widget-caterorderlist .bd ul{line-height:30px;color:#999;font-size:12px}#place-widget-caterorderlist .bd li{position:relative;background-color:#fff;min-height:88px;border-top:1px solid #e4e4e4;padding:0 20px 0 10px;white-space:nowrap;cursor:pointer}#place-widget-caterorderlist .bd li.active{background-color:#f4f4f4}#place-widget-caterorderlist .bd h4{color:#3b3b3b;display:inline-block;font-size:15px;font-weight:400}#place-widget-caterorderlist .bd .person{line-height:20px;color:#333}#place-widget-caterorderlist .bd .room{font-size:15px;color:#f64a07}#place-widget-caterorderlist .bd .right{position:absolute;right:20px}#place-widget-caterorderlist .bd .list-arrow{position:absolute;background:url(/static/place/images/areo_98200f6.png) no-repeat 0 0;background-size:7px 12px;height:12px;width:7px;top:36px;right:7px}#place-widget-caterorderlist .pagenav{padding:12px;text-align:center;background-color:#F2F2F2}#place-widget-caterorderlist .pagenav .page-btn{display:inline-block;height:27px;line-height:27px;padding:0 11px;border:1px solid #CACACA;margin:0 6px;color:#000;font-size:13px;background-color:#fff}#place-widget-caterorderlist .pagenav .disabled{color:#CCC;border:1px solid #CACACA}#place-widget-caterorderlist .empty-msg{line-height:80px;text-align:center}{%/style%}<div id="place-widget-caterorderlist">
<div class="hd">
预订手机：<span data-node="mobile"></span><a href="/mobile/webapp/place/cater/force=superman&kehuduan={%$kehuduan|f_escape_path%}&qt=searchorder&osearch=1" class="change-btn">修改号码</a>
</div>
<div class="bd">
<ul data-node="list">
<li><div class="empty-msg">亲，你还没有订单哦~</div></li>
</ul>
</div>
<div class="pagenav" data-node="pageNav" style="display:none;">
<a data-node="pre" class="page-btn disabled">上一页</a>
<a data-node="next" class="page-btn ">下一页</a>
</div>
</div>
{%script%}
    require('place:widget/caterorderlist/caterorderlist.js').init({
        kehuduan: '{%$kehuduan|f_escape_js%}',
        authCode: '{%$authCode|f_escape_js%}'
    });
{%/script%}