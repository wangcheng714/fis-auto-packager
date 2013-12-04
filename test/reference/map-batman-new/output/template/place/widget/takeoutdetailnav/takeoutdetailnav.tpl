{%style id="/widget/takeoutdetailnav/takeoutdetailnav.inline.less"%}.place-widget-takeout-detail-nav{background:#fff;padding:0;z-index:10;height:51px;position:relative;-moz-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);-webkit-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);box-shadow:0 2px 3px -1px rgba(0,0,0,.18)}.place-widget-takeout-detail-nav>div{display:inline-block}.place-widget-takeout-detail-nav .base-btn{height:51px;line-height:51px;border-right:1px solid #D4D4D4;position:absolute;height:100%}.place-widget-takeout-detail-nav .menu-btn{position:absolute;top:0;right:0;height:100%;width:74px;border-left:1px solid #D4D4D4;border-right:0;text-align:center}.place-widget-takeout-detail-nav .menu-btn span{color:#4B8FF9;position:relative;top:-2px}.place-widget-takeout-detail-nav .menu-btn em{background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAGCAMAAADAMI+zAAAABlBMVEUAAABMkPlpxw3JAAAAAXRSTlMAQObYZgAAACBJREFUeNpNx8ENAAAIwsCy/9ImRoS+rqiCdo7NzvGdBwh7ACua/CJHAAAAAElFTkSuQmCC');background-size:6px 3px;width:6px;height:3px;position:absolute;top:32px;left:34px}.place-widget-takeout-detail-nav .back-btn{position:absolute;width:50px}.place-widget-takeout-detail-nav .back-btn:before{background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbBJREFUeNpizMwrYSADsANxFxAnATETEC8B4gIg/k6qQSzkWM7ExLTx379/7khiaSzMzCx//v5NJtUwJipYDgNx5AQlE5UsZ2BmYWGmpQPwWg4CZiZGv2nlAIKWa2mqMwQH+M6lhQOIsjwtKX4XGxtrAbUdQIrlfln5pb+o6QBSLf/JQCZgGkjLsTmArpajO4DuliM7YEAsBwFGYGXECbR8PT7LqQw+APFiIAbVgr+YgJXIFDpaDgICQJzLzMzcDouCOIYBAExMjDkQmpmJZSAcwMLCwgp2gKmx0Z+BcICVhRm45GQK8vdZBErh9ALcXFwMTg62DL5e7lPAIcHJyZEDzF4ys+YtdLt2/SZOjdpaGgzpyfGgoKPUDe+AeBEQV8GyIcO0id3sv3793kTIEcDsuhOYY/yBTKqVA+CCCFSwgAoYUEGDLzpA2RVUYEEbpdRzwEA6AqUyGghHYFTH9HYE1gYJPR2Bs0lGoiM2AZlsVG+UkuAIN2Dl0k+TZjmxjmBkZEyhWceEGEcAHcBK064ZIUeYGhv8pXXfEMURrs4ODOzs7PDKJSTQbwk5DgAIMACqPOUcF+B9cAAAAABJRU5ErkJggg==") no-repeat;background-size:16px 16px;content:'';position:absolute;top:16px;left:18px;width:40px;height:30px}.place-widget-takeout-detail-nav .title{width:100%;line-height:50px;font-size:17px;color:#373a3d;text-align:center;font-weight:400}.place-widget-takeout-detail-nav .title span{margin:0 70px;color:#373A3D;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.place-widget-takeout-detail-nav .back-btn:active{background:#e7e7e7}.place-widget-takeout-detail-nav .menu-btn:active{background:#e7e7e7}{%/style%}
<div class="place-widget-takeout-detail-nav" >
<div class="base-btn back-btn" onclick="history.back()">&nbsp;</div>
<div class="title">
<span>商户详情</span>
</div>
<div class="base-btn menu-btn">
<a href="javascript:void(0);">
<span>菜单分类</span>
<em></em>
</a>
</div>
{%widget name="place:widget/dishcategory/dishcategory.tpl"%}
</div>
{%script%}
    require('place:widget/takeoutdetailnav/takeoutdetailnav.js').init();
{%/script%}