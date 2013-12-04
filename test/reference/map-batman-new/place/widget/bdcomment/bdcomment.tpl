{%foreach $widget_data.info as $j=>$comment_item%}
    <div class="comment-item">
        <div class="comment-content">
            <span class="comment-username">{%$comment_item.user_name%}：</span>{%$comment_item.content%}
        </div>
        <div class="comment-source">来自{%$comment_item.cn_name%}&nbsp;{%$comment_item.date%}</div>
    </div>
{%/foreach%}