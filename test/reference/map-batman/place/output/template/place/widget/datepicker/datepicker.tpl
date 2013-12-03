{%style id="/widget/datepicker/datepicker.inline.less"%}.place-widget-datepicker{display:none;overflow:hidden;background-color:#f3f3f3;border-radius:3px;border:#838991 solid 1px;padding:10px;margin:10px 0}.place-widget-datepicker .opt-search{overflow:hidden}.place-widget-datepicker .date{position:relative;float:left;width:50%;padding-right:5px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.place-widget-datepicker .arrow{content:'';position:absolute;top:14px;right:10px;width:0;height:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:6px solid #818181;z-index:9}.place-widget-datepicker .text{float:left;line-height:35px}.place-widget-datepicker .sd,.place-widget-datepicker .ed{background-color:#fff;height:35px;padding:8px 5px 8px 2px;border:solid 1px #ccc;-webkit-border-radius:3px;border-radius:3px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;overflow:hidden;display:block;font-size:16px;color:#000;font-weight:700;text-decoration:none}.place-widget-datepicker .tip{display:none;margin:10px 0 5px;text-align:center}.place-widget-datepicker .date.active .arrow{border-top:0;border-bottom:6px solid #1E51D6}.place-widget-datepicker .date.active a{border:1px solid #94bcdf}.place-widget-datepicker .datepicker-wrap{overflow:hidden;height:auto;-webkit-transition:height 200ms ease-in-out;-webkit-box-sizing:border-box;box-sizing:border-box}.place-widget-datepicker .datepicker-wrap p{padding:5px 10px;font-weight:700}.place-widget-datepicker .datepicker-wrap .ui-datepicker-header{background-color:#f1f1f1;padding:5px 10px;border-bottom:dashed 1px #ccc}.place-widget-datepicker .datepicker-wrap>div{background:#fafafa;margin:5px;border:solid 1px #94bcdf;display:none}{%/style%}<div class="place-widget-datepicker">
<div class="opt-search">
<div class="date">
<span class="arrow"></span>
<span class="text">入住&nbsp;</span>
<a class="sd" href="javascript:void(0);"></a>
</div>
<div class="date">
<span class="arrow"></span>
<span class="text">退房&nbsp;</span>
<a class="ed" href="javascript:void(0);"></a>
</div>
</div>
<div class="tip"></div>
<div class="datepicker-wrap">
<div class="sd-wrapper">
<p>入住时间：</p>
<div class="sd-picker"></div>
</div>
<div class="ed-wrapper">
<p>离开时间：</p>
<div class="ed-picker"></div>
</div>
</div>
</div>
{%script%}
require('place:widget/datepicker/datepicker.js');
{%/script%}