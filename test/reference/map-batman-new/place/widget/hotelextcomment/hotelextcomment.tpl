
{%$detail_info = $widget_data.ext.detail_info%}
<p class="comment-from">
    {%if isset($detail_info.recommand_index) %}
        {%$detail_info.recommand_index%}%好评，源于{%$detail_info.comment_num%}篇评价
    {%/if%}
</p>
{%$reviews = $widget_data.ext.all_review%}
{%if $reviews && count($reviews) %}
    <dl class="detail-comlist">
        {%foreach $reviews as $i => $comment%}
            {%if $i>4 %}
                <dt style="display: none">
            {%else %}
                <dt>
            {%/if%}
                    {%if $comment.user_name || $comment.cn_name%}
                        <p>
                            {%if $comment.user_name%}
                                <span class="comment-user">{%$comment.user_name%}</span>
                            {%/if%}
                            [{%$comment.cn_name%}]
                        </p>
                    {%/if%}
                    {%if $comment.date%}
                        <span>{%$comment.date%}</span>
                    {%/if%}
                </dt>
            {%if $i>4 %}
                <dd style="display: none">{%$comment.content%}</dd>
            {%else%}
                <dd>{%$comment.content%}</dd>
            {%/if%}
        {%/foreach%}
    </dl>
{%else%}
    {%widget name="place:widget/loadfailed/loadfailed.tpl" widget_data="暂时没有该酒店的评论信息..."%}
{%/if%}
    {%if count($reviews) > 5 %}
        <div id="detail-loadcomment">
            <span class="comments-text">显示更多评论</span>
            <span class="comments-loadbtn"></span>
        </div>
    {%/if%}
    <!--是否展示跳到二级评论页的按钮-->
    {%if count($reviews) < $detail_info.comment_num %}
        <div id="detail-commore" style="display: none" data-href="{%$widget_data.ext.more_comment_href%}">
            <a class="comments-text"
               data-log="{code:{%$STAT_CODE.PLACE_HOTEL_DETAIL_MORECOMMENT_CLICK%}">点击查看更多</a>
            <span class="comments-morebtn"></span>
        </div>
    {%/if%}
{%script%}
    (require('place:widget/hotelextcomment/hotelextcomment.js')).init();
{%/script%}