{%style id="/widget/datepicker/datepicker.inline.less"%}.hotel-calendar{background-color:#fff;border:#e4e4e4 solid 1px;border-top:0;padding:10px 8px 0;display:none}.hotel-calendar .hotel-cal-content{display:-webkit-box}.hotel-calendar .hotel-cal-content .hotel-cal-date{-webkit-box-flex:1;display:-webkit-box;-webkit-box-align:center}.hotel-calendar .hotel-cal-content .hotel-cal-date .hotel-date-text{color:#6c6c6c}.hotel-calendar .hotel-cal-content .hotel-cal-date .hotel-date-ipt{padding:8px 3px;border:solid 1px #ccc;border-radius:3px;-webkit-box-sizing:border-box;margin:0 5px;-webkit-box-flex:1;position:relative;background-color:#fff}.hotel-calendar .hotel-cal-content .hotel-cal-date .hotel-date-ipt .tit-text{font-size:14px}.hotel-calendar .hotel-cal-content .hotel-cal-date .hotel-date-ipt div.hotel-ipt-start,.hotel-calendar .hotel-cal-content .hotel-cal-date .hotel-date-ipt div.hotel-ipt-end{font-family:arial,helvetica,sans-serif}.hotel-calendar .hotel-cal-content .hotel-cal-date .hotel-date-ipt span.hotel-ipt-arrow{content:'';position:absolute;top:15px;right:6px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:6px solid #818181;z-index:9}.hotel-calendar .hotel-cal-content .hotel-cal-date .active{border:1px solid #94BCDF}.hotel-calendar .hotel-cal-wrap{-webkit-box-sizing:border-box;margin-top:10px}.hotel-calendar .hotel-cal-wrap .hotel-calwrap-start,.hotel-calendar .hotel-cal-wrap .hotel-calwrap-end{background:#fafafa;border:solid 1px #94bcdf;padding:5px;display:none;margin-bottom:10px}/*!Css widget/datepicker/datepicker.default.css*/.ui-datepicker{width:100%;line-height:25px}.ui-datepicker-header{color:#545454;text-align:center;padding:3px 0}.ui-datepicker-header a{color:#545454;text-decoration:none;display:inline-block;padding:8px 10px;margin:0 5px;text-align:center;line-height:1;position:relative;bottom:3px}.ui-datepicker-header a.ui-state-hover{background-color:#ccc}.ui-datepicker-header .ui-datepicker-title{text-align:center;font-weight:700;display:inline-block}.ui-datepicker-calendar{width:100%;border:1px solid #C9C9C9}.ui-datepicker-calendar tbody{background:#c9c9c9}.ui-datepicker-calendar td{text-align:center;color:#000;background:#fafafa;border:1px solid #c9c9c9;font-weight:700}.ui-datepicker-calendar thead tr{border:1px solid #c9c9c9}.ui-datepicker-calendar thead th{padding:10px 0;font-weight:700}.ui-datepicker-calendar a{text-decoration:none;color:#000;display:block}.ui-datepicker-calendar tr.ui-datepicker-gap td{display:none;padding:0;border:0 transparent}.ui-datepicker-calendar tbody td{padding:10px 0}.ui-datepicker-calendar tbody td:first-child{border-left:0 0}.ui-datepicker-calendar td.ui-datepicker-unselectable{background:#f6f6f6;color:#b8b8b8;font-weight:400}.ui-datepicker-calendar td.ui-datepicker-today{background:#FBF9EE}.ui-datepicker-calendar td.ui-datepicker-current-day{background:#e3f1ff;font-weight:700;border:0}.ui-datepicker-calendar td.ui-state-hover{background:#ccc}.ui-datepicker .ui-datepicker-prev{float:left}.ui-datepicker .ui-datepicker-next{float:right}.ui-datepicker-header{background-color:#f1f1f1;padding:5px 10px;border-bottom:dashed 1px #ccc}.hotel-calwrap-start>p,.hotel-calwrap-end>p{padding:5px 10px;font-weight:700}{%/style%}<div class="hotel-calendar">
<div class="hotel-cal-content">
<div class="hotel-cal-date">
<span class="hotel-date-text">入住</span>
<div class="hotel-date-ipt date-ipt-start">
<div class="tit-text"></div>
<span class="hotel-ipt-arrow"></span>
</div>
</div>
<div class="hotel-cal-date">
<span class="hotel-date-text">退房</span>
<div class="hotel-date-ipt date-ipt-end">
<div class="tit-text"></div>
<span class="hotel-ipt-arrow"></span>
</div>
</div>
</div>
<div class="hotel-cal-wrap">
<div class="hotel-calwrap-start">
<p>入住时间：</p>
<div class="hotel-container-start"></div>
</div>
<div class="hotel-calwrap-end">
<p>离店时间：</p>
<div class="hotel-container-end"></div>
</div>
</div>
</div>
{%script%}
    (require('place:widget/datepicker/datepicker.js')).init({
        uid: '{%$widget_data.uid|f_escape_js%}'
    });
{%/script%}