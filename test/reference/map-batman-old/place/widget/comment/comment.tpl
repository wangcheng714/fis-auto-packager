{%* 用户评论 *%}

{%if ($data.widget.comment && !$isMovie)%}
<div class="place-widget-comment">
    <h2 class="title">评论信息</h2>
    <ul class="place-comment-list">
        {%foreach $widget_data.data.review as $i=>$item%}
        {%if ($i < 1)%}
        {%foreach $item.info as $j=>$comment%}
        {%if ($j < 1)%}
        <li>
            <div class="content-wrap">
                <p class="content">
                    {%if (!empty($comment.user_name))%}
                    <strong class="username">
                        {%$comment.user_name%}&nbsp;:&nbsp;
                    </strong>
                    {%/if%}
                    {%$comment.content%}
                    <span class="opt"></span>
                </p>
            </div>
            <p class="extra">来自{%$item.cn_name%}&nbsp;{%$comment.date%}</p>
        </li>
        {%/if%}
        {%/foreach%}
        {%/if%}
        {%/foreach%}
    </ul>
    <a id="detail-comments" href="{%$widget_data.data.more_comment_href%}" class="more-btn" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_MORE_COMMENT_CLICK%}, wd: '{%$wd%}', srcname:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">查看更多信息</a>
</div>
{%elseif ($data.widget.comment && $isMovie)%}
<div class="place-widget-comment movie">
    <div class="hd">
        <span class="title">评论</span>
        <span class="num">(共{%$widget_data.data.detail_info.comment_num%}条)</span>
    </div>
    <!--评论入口-->  
    <ul class="place_comment_list">
        <li>
            <div class="content_wrap">
                <p class="content">
                    {%if $widget_data.data.review[0].info[0].user_name%}
                        <strong class="username">{%$widget_data.data.review[0].info[0].user_name%}</strong>
                    {%/if%}
                </p>
                {%if ($widget_data.data.review[0].info[0].overall_rating)%}
                <span class="star_box_l">
                    <span class="star_score" style="width:{%intval($widget_data.data.review[0].info[0].overall_rating, 10)*15%}px"></span>
                </span> 
                <span style="color: #dc3c3c;">{%$widget_data.data.review[0].info[0].overall_rating%}</span>
                {%/if%}
                <p class="content">{%$widget_data.data.review[0].info[0].content%}<span class="opt"></span></p></div>
            <p class="extra">{%$widget_data.data.review[0].info[0].date%}</p>
        </li>
    </ul>
    <div class="btm">
        <div class="comment_btn">
            <!-- 影讯模块 -->
            <!-- <p class="i_want_com_mo" id="i_want_say">
                <a class="place-widget-commentbtn" id="J_commentBtn" href="/mobile/webapp/place/icomment/uid={%$widget_data.uid%}&name={%$widget_data.name%}" data-log="{code: {%$STAT_CODE.PLACE_COMMENT_COMMENTBTN_CLICK%}, wd:'{%$src_name%}', name:'{%$widget_data.name%}'}">
                    <i class='icomment_logo_mo'></i>
                    <span>我要评论</span>
                </a>
            </p> 
        </div>
        <div style="width:1px;background: -webkit-linear-gradient(top, rgba(218,218,218,0) 0%,rgba(218,218,218,1) 50%,rgba(218,218,218,0) 100%);"></div> -->
        <div class="seemore_btn">
            <a id="detail-comments" href="{%$widget_data.data.more_comment_href%}" class="more-btn" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_MORE_COMMENT_CLICK%}, wd:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}'}">查看更多信息</a>
        </div>
    </div>
</div>
{%/if%}