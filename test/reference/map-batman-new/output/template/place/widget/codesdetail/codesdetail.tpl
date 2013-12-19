{%style id="/widget/codesdetail/codesdetail.inline.less"%}.place-widget-codesdetail section{margin:0 7px}.place-widget-codesdetail .page-header{height:51px;line-height:51px;color:#373a3d;text-align:left;font-size:16px;position:relative;background-color:#fafafa;-moz-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);-webkit-box-shadow:0 2px 3px -1px rgba(0,0,0,.18);box-shadow:0 2px 3px -1px rgba(0,0,0,.18)}.place-widget-codesdetail .title{text-align:center;display:inline-block;width:100%}.place-widget-codesdetail .back{background-image:-moz-linear-gradient(top,#f8f8f8,#e6e6e6);border-right:1px solid #d4d4d4;position:absolute;width:50px;height:100%;z-index:10}.place-widget-codesdetail .back:before{background:url("data:data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbBJREFUeNpizMwrYSADsANxFxAnATETEC8B4gIg/k6qQSzkWM7ExLTx379/7khiaSzMzCx//v5NJtUwJipYDgNx5AQlE5UsZ2BmYWGmpQPwWg4CZiZGv2nlAIKWa2mqMwQH+M6lhQOIsjwtKX4XGxtrAbUdQIrlfln5pb+o6QBSLf/JQCZgGkjLsTmArpajO4DuliM7YEAsBwFGYGXECbR8PT7LqQw+APFiIAbVgr+YgJXIFDpaDgICQJzLzMzcDouCOIYBAExMjDkQmpmJZSAcwMLCwgp2gKmx0Z+BcICVhRm45GQK8vdZBErh9ALcXFwMTg62DL5e7lPAIcHJyZEDzF4ys+YtdLt2/SZOjdpaGgzpyfGgoKPUDe+AeBEQV8GyIcO0id3sv3793kTIEcDsuhOYY/yBTKqVA+CCCFSwgAoYUEGDLzpA2RVUYEEbpdRzwEA6AqUyGghHYFTH9HYE1gYJPR2Bs0lGoiM2AZlsVG+UkuAIN2Dl0k+TZjmxjmBkZEyhWceEGEcAHcBK064ZIUeYGhv8pXXfEMURrs4ODOzs7PDKJSTQbwk5DgAIMACqPOUcF+B9cAAAAABJRU5ErkJggg==") no-repeat;background-size:16px 16px;content:'';position:absolute;top:16px;left:18px;width:40px;height:30px}.place-widget-codesdetail .ts{height:51px;line-height:51px;display:inline-block;text-align:center;width:100%}.place-widget-codesdetail section{margin:0 7px}.place-widget-codesdetail .list-info{background-color:#fff;margin-top:7px;border:solid 1px #d9d9d9;-webkit-border-radius:5px;border-radius:5px;position:relative;min-height:95px}.place-widget-codesdetail .poster{width:85px;height:103px;position:absolute;left:10px;top:10px}.place-widget-codesdetail .list{padding:5px 0 10px 105px}.place-widget-codesdetail .movie_title{font-size:15px;color:#3f3e3e;line-height:20px}.place-widget-codesdetail .movie_num{color:#fd4f02;font-size:14px;line-height:30px;padding-left:10px}.place-widget-codesdetail .detail{color:#5e5d5d;line-height:16px}.place-widget-codesdetail .over{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.place-widget-codesdetail .exchange{background-color:#f5f5f5;height:50px;border-top-right-radius:5px;border-top-left-radius:5px}.place-widget-codesdetail .field{font-size:16px;color:#f37c09;text-align:center;line-height:28px;height:28px}.place-widget-codesdetail .tix{padding:0 5px;color:#5e5d5d;text-align:center}.place-widget-codesdetail .txt_red{color:#ff0101}.place-widget-codesdetail .cinema{height:40px;line-height:40px;text-align:center;color:#3f3e3e;font-size:15px}.place-widget-codesdetail .date{height:35px;line-height:35px;text-align:center;color:#3f3e3e;font-size:13px;border-bottom:1px solid #eaeaea;border-top:1px solid #eaeaea;padding:0 5px}.place-widget-codesdetail .phone{color:#5e5d5d;height:50px;line-height:50px;text-align:left;padding-left:10px}.place-widget-codesdetail .input_class{background-color:#f3f3f3;border-radius:3px;border:1px solid #eaeaea;height:22px;text-indent:5px;font-size:14px}.place-widget-codesdetail .codes{text-align:left;line-height:30px;padding-left:10px}.place-widget-codesdetail .codes span{text-indent:0;font-size:14px}.place-widget-codesdetail .codes label{vertical-align:middle}.place-widget-codesdetail .codes label input{width:14px;height:14px}.place-widget-codesdetail .button_sub{font-size:17px;color:#fff;background-color:#ffa51a;border-radius:5px;width:115px;height:37px;line-height:37px;display:block;text-align:center;margin:10px auto}.place-widget-codesdetail .explanation{margin:10px;color:#7d7d7d;line-height:16px;font-size:12px}.place-widget-codesdetail .explanation_title{font-size:12px;color:#4b4b4b;line-height:24px}.place-widget-codesdetail .tsred{border:1px solid red}.place-widget-codesdetail .hide{display:none}{%/style%}{%if $data.errorNo == 0%}
{%$codesData = $data.data|f_escape_xml%}
<div class="page-header">
<span class="back" id="back"></span>
<span class="title">验证兑换码</span>
</div>
<section class="list-info">
<img class="poster" id="pic" src=""><dl class="list">
<dt class="over"><span class="movie_title" id="name"></span><span class="movie_num" id="score"></span></dt>
<dd class="detail over" id="duration"></dd>
<dd class="detail over" id="category"></dd>
<dd class="detail over" id="director"></dd>
<dd class="detail over" id="player"></dd>
<dd class="detail over" id="release"></dd>
</dl>
</section>
<section class="list-info">
<dl>
<dt class="exchange">
<p class="field">兑换场次</p>
<p class="tix over">亲爱的用户，您有<span class="txt_red">{%$data.num|f_escape_xml%}</span>张观影券可选择兑换</p>
</dt>
<dd class="cinema" id="pname"></dd>
<dd class="date over" id="day"></dd>
</dl>
<form>
<p class="phone over">请输入您的手机号：<input id="phone" class="input_class" value="{%$data.phone|f_escape_xml%}" type="tel" size="12" /></p>
{%foreach $codesData as $item%}
<p class="codes clearfix">
<label>
<input name="pid" type="checkbox" checked="checked"  value="{%$item.pid|f_escape_xml%}" />
</label>
<span>{%$item.cdkey|f_escape_xml%}</span>
</p>
{%/foreach%}
<span class="button_sub" id="subSure">确认兑换</span>
</form>
</section>
<div class="explanation">
<p class="explanation_title">使用说明：</p>
{%foreach $data.rule as $item key=index%}
<p>{%$index + 1|f_escape_xml%}.{%$item|f_escape_xml%}</p>
{%/foreach%}
</div>
{%script type="text/javascript"%}
        require('place:widget/codesdetail/codesdetail.js').initialize({%json_encode($data)%});
    {%/script%}
<div class="hide">
<script type="text/javascript">
        var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb2f5614b14af39b080fc30acfef3ccb4' type='text/javascript'%3E%3C/script%3E"));
        </script>
</div>
{%/if%}