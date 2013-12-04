{%style id="/widget/takeoutdetailnav/takeoutdetailnav.inline.less"%}.place-widget-takeout-detail-nav{height:51px;background:#FFF;position:relative;-moz-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);-webkit-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);box-shadow:0 2px 3px -1px rgba(0,0,0,.18);padding:0}.place-widget-takeout-detail-nav>div{display:inline-block}.place-widget-takeout-detail-nav .base-btn{height:51px;line-height:51px;border-right:1px solid #D4D4D4;position:absolute;height:100%}.place-widget-takeout-detail-nav .meau-btn{position:absolute;top:10px;right:8px;padding:0 10px;height:30px;line-height:30px;background-image:-webkit-gradient(linear,50% 0,50% 100%,from(#f8f8f8),to(#e6e6e6));border-radius:2px;border:1px solid #8A8A8A;display:inline-block}.place-widget-takeout-detail-nav .back-btn{position:absolute;width:50px}.place-widget-takeout-detail-nav .back-btn:before{background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbBJREFUeNpizMwrYSADsANxFxAnATETEC8B4gIg/k6qQSzkWM7ExLTx379/7khiaSzMzCx//v5NJtUwJipYDgNx5AQlE5UsZ2BmYWGmpQPwWg4CZiZGv2nlAIKWa2mqMwQH+M6lhQOIsjwtKX4XGxtrAbUdQIrlfln5pb+o6QBSLf/JQCZgGkjLsTmArpajO4DuliM7YEAsBwFGYGXECbR8PT7LqQw+APFiIAbVgr+YgJXIFDpaDgICQJzLzMzcDouCOIYBAExMjDkQmpmJZSAcwMLCwgp2gKmx0Z+BcICVhRm45GQK8vdZBErh9ALcXFwMTg62DL5e7lPAIcHJyZEDzF4ys+YtdLt2/SZOjdpaGgzpyfGgoKPUDe+AeBEQV8GyIcO0id3sv3793kTIEcDsuhOYY/yBTKqVA+CCCFSwgAoYUEGDLzpA2RVUYEEbpdRzwEA6AqUyGghHYFTH9HYE1gYJPR2Bs0lGoiM2AZlsVG+UkuAIN2Dl0k+TZjmxjmBkZEyhWceEGEcAHcBK064ZIUeYGhv8pXXfEMURrs4ODOzs7PDKJSTQbwk5DgAIMACqPOUcF+B9cAAAAABJRU5ErkJggg==") no-repeat;background-size:16px 16px;content:'';position:absolute;top:16px;left:18px;width:40px;height:30px}.place-widget-takeout-detail-nav .title{width:100%;line-height:51px;font-size:16px;color:#373A3D;text-align:center;font-weight:400}.place-widget-takeout-detail-nav .title span{margin:0 70px;color:#373A3D;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.place-widget-takeout-detail-nav .back-btn:active{background:#e7e7e7}.place-widget-takeout-detail-nav .meau-btn:active{background:#e7e7e7}{%/style%}
<div class="place-widget-takeout-detail-nav" >
<div class="base-btn back-btn" onclick="history.back()">&nbsp;</div>
<div class="title">
<span>商户详情</span>
</div>
<div class="meau-btn">
<span>菜单分类</span>
</div>
{%widget name="place:widget/dishcategory/dishcategory.tpl"%}
</div>
{%script%}
require('place:widget/takeoutdetailnav/takeoutdetailnav.js');
{%/script%}