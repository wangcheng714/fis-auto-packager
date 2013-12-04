{%style id="/widget/codes/codes.inline.less"%}.place-widget-codes section{margin:0 5px}.place-widget-codes span{padding:0;margin:0;list-style:none;font-size:12px}.place-widget-codes .list-info{background-color:#fff;margin-top:10px;border:solid 1px #d9d9d9;-webkit-border-radius:5px;border-radius:5px}.place-widget-codes .list{height:39px;margin:0 5px;position:relative;padding:15px 0}.place-widget-codes .list_boder{border-bottom:1px solid #efefef}.place-widget-codes .sn,.place-widget-codes .movie_name{font-size:15px;color:#3b3b3b;height:15px;line-height:15px;display:inline-block}.place-widget-codes .sn{width:30px;text-align:center;overflow:hidden}.place-widget-codes .movie_name{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.place-widget-codes .km{color:#de2121;height:15px;line-height:15px;position:absolute;right:25px}.place-widget-codes .addr{display:inline-block;color:#5e5e5e;padding-left:33px;height:12px;line-height:16px;max-width:80%}.place-widget-codes .trad{position:absolute;right:5px;top:25px;width:18px;height:18px;background:url(/mobile/simple/static/place/images/areo_98200f6.png) no-repeat center center;background-size:7px 11px;display:inline-block}.place-widget-codes .page-header{height:51px;color:#373a3d;text-align:left;font-size:16px;position:relative;background-color:#fafafa;-moz-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);-webkit-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);box-shadow:0 2px 3px -1px rgba(0,0,0,.18)}.place-widget-codes .page-header .title{background:url(/mobile/simple/static/place/images/codes_logo_2b70ccc.png) no-repeat left center;background-size:28px 28px;height:50px;line-height:50px;color:#f9791b;text-align:center;font-size:18px;width:160px;margin:0 auto}.place-widget-codes .page-header .area_box{position:absolute;top:10px;right:5px}.place-widget-codes .page-header .area_box .area{height:30px;outline:0;border:1px solid #ccc;font-size:16px;background:url(/mobile/simple/static/place/widget/codes/selectgb_5739ae4.jpg) no-repeat right center;background-color:#fff;background-size:16px 5px;padding-right:15px}.place-widget-codes .page-header .area_box .area .option{width:100px}.place-widget-codes .page-header .back{background-image:-moz-linear-gradient(top,#f8f8f8,#e6e6e6);border-right:1px solid #d4d4d4;position:absolute;width:50px;height:100%;z-index:10}.place-widget-codes .page-header .back:before{background:url("data:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbBJREFUeNpizMwrYSADsANxFxAnATETEC8B4gIg/k6qQSzkWM7ExLTx379/7khiaSzMzCx//v5NJtUwJipYDgNx5AQlE5UsZ2BmYWGmpQPwWg4CZiZGv2nlAIKWa2mqMwQH+M6lhQOIsjwtKX4XGxtrAbUdQIrlfln5pb+o6QBSLf/JQCZgGkjLsTmArpajO4DuliM7YEAsBwFGYGXECbR8PT7LqQw+APFiIAbVgr+YgJXIFDpaDgICQJzLzMzcDouCOIYBAExMjDkQmpmJZSAcwMLCwgp2gKmx0Z+BcICVhRm45GQK8vdZBErh9ALcXFwMTg62DL5e7lPAIcHJyZEDzF4ys+YtdLt2/SZOjdpaGgzpyfGgoKPUDe+AeBEQV8GyIcO0id3sv3793kTIEcDsuhOYY/yBTKqVA+CCCFSwgAoYUEGDLzpA2RVUYEEbpdRzwEA6AqUyGghHYFTH9HYE1gYJPR2Bs0lGoiM2AZlsVG+UkuAIN2Dl0k+TZjmxjmBkZEyhWceEGEcAHcBK064ZIUeYGhv8pXXfEMURrs4ODOzs7PDKJSTQbwk5DgAIMACqPOUcF+B9cAAAAABJRU5ErkJggg==") no-repeat;background-size:16px 16px;content:'';position:absolute;top:16px;left:18px;width:40px;height:30px}.place-widget-codes .codes_error{background:url(/mobile/simple/static/place/images/codes_error_009ce01.png) no-repeat center center;height:180px;color:#666;font-size:16px;background-size:125px 100px;text-align:center;margin-top:100px}.place-widget-codes .hide{display:none}{%/style%}{%if $data.errorNo == 0%}
<div class="page-header">
<span class="back" id="back"></span>
<div class="title">可兑换影院</div>
<div class="area_box">
<select name="city" id="city" class="area">
{%foreach $data.list as $item%}
<option value="{%$item.city_id|f_escape_xml%}">{%$item.city|f_escape_xml%}</option>
{%/foreach%}
</select>
</div>
</div>
<div id="codes_box">
<section class="list-info" id="list_info"></section>
{%script type="text/javascript"%}
        require('place:widget/codes/codes.js').initialize({%json_encode($data.code)%},{%json_encode($data.sign)%});
    {%/script%}
</div>
<div id="over" class="codes_error hide">抱歉，你所在的城市电影还没上映哦~</div>
<div class="hide">
<script type="text/javascript">
        var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb2f5614b14af39b080fc30acfef3ccb4' type='text/javascript'%3E%3C/script%3E"));
        </script>
</div>
{%elseif $data.errorNo == 300008%}
<div class="codes_error">抱歉，您所在的城市不支持此活动哦~</div>
{%elseif $data.errorNo == 300007%}
<div class="codes_error">呃，定位失败了，刷新一下吧~</div>
{%elseif $data.errorNo == 300012%}
<div class="codes_error">抱歉，你所在的城市电影还没上映哦~</div>
{%else%}
<div class="codes_error">抱歉，该活动已结束，下次早点来~</div>
{%/if%}