{%style id="/widget/hotelextcomment/hotelextcomment.inline.less"%}.comment-from{border-bottom:1px solid #DBDBDB;font-size:13px;height:4em;line-height:4em}.detail-comlist dt,.detail-comlist dd{padding:0 8px;word-wrap:break-word;word-break:normal}.detail-comlist dt .comment-user{max-width:5.6em;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.detail-comlist dt{padding-top:10px;padding-bottom:10px;font-size:14px;display:-webkit-box;-webkit-box-pack:justify}.detail-comlist dt>p{color:#303235;font-weight:700}.detail-comlist dt>span{color:#c6c6c6}.detail-comlist dd{border-bottom:1px solid #dbdbdb;padding-bottom:10px;font-size:13px;color:#828282}#detail-commore,#detail-loadcomment{padding:13px 0;text-align:center}#detail-loadcomment .comments-text,#detail-commore .comments-text{color:#444D62;display:inline-block;font:14px "微软雅黑","宋体"}#detail-loadcomment .comments-loadbtn,#detail-commore .comments-morebtn{width:11px;height:10px;background:url(/static/place/images/hotelbook_icon_844811c.png) no-repeat 0 -58px;display:inline-block;background-size:27px 107px;-webkit-transform:rotate(-90deg)}#detail-loadcomment .comments-loadbtn{-webkit-transform:rotate(0deg)}{%/style%}
{%$detail_info = $widget_data.ext.detail_info%}
<p class="comment-from">
{%if isset($detail_info.recommand_index) %}
{%$detail_info.recommand_index|f_escape_xml%}%好评，源于{%$detail_info.comment_num|f_escape_xml%}篇评价{%/if%}
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
<span class="comment-user">{%$comment.user_name|f_escape_xml%}</span>
{%/if%}
[{%$comment.cn_name|f_escape_xml%}]</p>
{%/if%}
{%if $comment.date%}
<span>{%$comment.date|f_escape_xml%}</span>
{%/if%}
</dt>
{%if $i>4 %}
<dd style="display: none">{%$comment.content|f_escape_xml%}</dd>
{%else%}
<dd>{%$comment.content|f_escape_xml%}</dd>
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
{%if count($reviews) < $detail_info.comment_num %}
<div id="detail-commore" style="display: none" data-href="{%$widget_data.ext.more_comment_href|f_escape_xml%}">
<a class="comments-text"
               data-log="{code:{%$STAT_CODE.PLACE_HOTEL_DETAIL_MORECOMMENT_CLICK|f_escape_xml%}">点击查看更多</a>
<span class="comments-morebtn"></span>
</div>
{%/if%}
{%script%}
    (require('place:widget/hotelextcomment/hotelextcomment.js')).init();
{%/script%}