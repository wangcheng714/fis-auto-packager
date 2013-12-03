{%* UGC填写评论页*%}
<form id='J_addComment' class="place-widget-impression" data-uid="{%$uid%}" data-url="{%$url%}">
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
    (require('icomment.js')).init();
{%/script%}

