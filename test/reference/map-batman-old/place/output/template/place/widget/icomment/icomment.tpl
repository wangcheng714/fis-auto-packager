{%style id="/widget/icomment/icomment.inline.less"%}.place-widget-impression{width:96%;padding:0 2%}.place-widget-impression .imp-scores{padding-top:10px;display:-webkit-box}.place-widget-impression .imp-scores li{-webkit-box-flex:1;font-family:'微软雅黑';font-size:14px;color:#000;padding:.9em 0;margin-right:1.5%;border:#B0B0B0 solid 1px;border-radius:.25em;text-align:center;cursor:pointer}.place-widget-impression .imp-scores li:last-child{margin-right:0}.place-widget-impression .imp-scores li i{background:url(/static/place/images/icomment_d570938.png) no-repeat;background-size:23px 69px;display:inline-block;width:23px;height:23px;margin-right:6px;vertical-align:middle}.place-widget-impression .imp-scores li span{display:inline-block;vertical-align:middle}.place-widget-impression .imp-scores li.active{color:#FFF;border:#3889b8 solid 1px;background-color:#68b3de}.place-widget-impression .imp-scores li.scores-soso i{background-position:0 0}.place-widget-impression .imp-scores li.scores-good i{background-position:0 -23px}.place-widget-impression .imp-scores li.scores-bad i{background-position:0 -46px}.imp-wrapper{margin-top:10px}.imp-wrapper .imp-content{background:#FFF;padding:2%;outline:0;border:#B0B0B0 solid 1px;font-size:14px;width:96%;height:140px;border-radius:8px;box-shadow:0 2px 3px -1px rgba(0,0,0,.18)}.place-addcomment{color:#4B8FF9;font-size:14px;position:absolute;top:0;right:10px;font-family:'微软雅黑'}.place-addcomment a{border:0;display:block;height:100%}{%/style%}{%* UGC填写评论页*%}
<form id='J_addComment' class="place-widget-impression" data-uid="{%$uid|f_escape_xml%}" data-url="{%$url|f_escape_xml%}">
<ul id="J_impression" class="imp-scores">
<li class="scores-good active" value = "10">
<i></i>
<span>满意</span>
</li>
<li class="scores-soso" value = "6">
<i></i>
<span>一般</span>
</li>
<li class="scores-bad" value = "3">
<i></i>
<span>不满意</span>
</li>
</ul>
<div class="imp-wrapper">
<textarea maxlength="3000" id="J_commentContent" class="imp-content" placeholder="亲~你想对它说点啥？"></textarea>
</div>
</form>
{%script%}
    (require('place:widget/icomment/icomment.js')).init();
{%/script%}
