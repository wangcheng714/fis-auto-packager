{%style id="/widget/comment/comment.inline.less"%}.place-widget-comment{border-bottom:1px solid #e1e1e1;overflow:hidden}.place-widget-comment .title{margin:0 5px 15px;font-size:16px;color:#303235;line-height:1.2}.place-widget-comment .place-comment-list{line-height:20px;margin:0 22px;color:#6e6e6e}.place-widget-comment li{margin-bottom:21px;overflow:hidden}.place-widget-comment .content-wrap{position:relative;overflow:hidden}.place-widget-comment .content{position:relative;overflow:hidden}.place-widget-comment .username{color:#c46221}.place-widget-comment .extra{float:right;color:#9d9d9d;margin-top:16px}.place-widget-comment .more-btn{background-color:#f2f2f2;float:right;width:103px;height:27px;line-height:27px;margin-bottom:10px;border:#adadad solid 1px;border-radius:.25em;font-size:13px;text-align:center;color:#444d62}.place-widget-comment.movie{border-bottom:1px solid #e1e1e1;overflow:hidden;padding:0;border:#e4e4e4 solid 1px;background:#fff;border-radius:3px}.place-widget-comment.movie .place_comment_list{line-height:20px;margin:10px;color:#6e6e6e}.place-widget-comment.movie .place_comment_list li{margin-bottom:21px;overflow:hidden}.place-widget-comment.movie .btn{background:url(/static/place/images/comment_drop_btn_00328c3.png) right 0 no-repeat;background-size:18px 14px;display:inline-block;width:18px;height:14px;padding-left:150px}.place-widget-comment.movie .star_box_l{background:url(/static/place/images/star_a9ede79.png) repeat-x 0 0;background-size:15px 33px;vertical-align:middle;margin-top:-.179em;display:inline-block;height:16px;width:75px}.place-widget-comment.movie .star_box_l .star_score{background:url(/static/place/images/star_a9ede79.png) repeat-x 0 -19px;background-size:15px 33px;height:15px;vertical-align:top;display:inline-block;height:16px}.place-widget-comment.movie .title{margin:0 5px 15px;font-size:14px;font-weight:600;color:#303235;line-height:1.2}.place-widget-comment.movie .num{font-size:12px;color:#B6B6B6}.place-widget-comment.movie .hd{border-bottom:#e4e4e4 solid 1px;padding:10px}.place-widget-comment.movie .btm{display:-moz-box;display:-webkit-box;display:box;background:#F9F9F9;border-top:#DADADA solid 1px}.place-widget-comment.movie .btm .comment_btn{-moz-box-flex:1;-webkit-box-flex:1;box-flex:1}.place-widget-comment.movie .btm .seemore_btn{-moz-box-flex:1;-webkit-box-flex:1;box-flex:1;padding:5px 0 0;text-align:center}.place-widget-comment.movie .more-btn{background-color:inherit;float:none;width:103px;height:100%;line-height:27px;margin-bottom:10px;border:0;border-radius:0;font-size:14px;text-align:center;color:#535353}.place-widget-comment.movie .i_want_com_mo{height:39px;text-align:center;font-weight:700;webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;color:RGB(186,93,31)}.place-widget-comment.movie .i_want_say_mo{background:-webkit-gradient(linear,0 100%,0 0,from(#eee),to(#fdfdfd));height:39px;width:auto;margin:8px;border:#838991 solid 1px;border-top:#DADADA solid 1px;text-align:center;font-weight:700;webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;color:RGB(186,93,31)}.place-widget-comment.movie .icomment_logo_mo{margin-right:10px;text-align:center;background:url(/static/place/images/comment_63b73f5.png) no-repeat 10px 8px;background-size:18px 18px;display:inline-block;height:39px;width:28px;vertical-align:middle}.place-widget-comment.movie .i_want_say_mo span{vertical-align:15px;display:inline-block}{%/style%}{%* 用户评论 *%}
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
{%$comment.user_name|f_escape_xml%}&nbsp;:&nbsp;</strong>
{%/if%}
{%$comment.content|f_escape_xml%}
<span class="opt"></span>
</p>
</div>
<p class="extra">来自{%$item.cn_name|f_escape_xml%}&nbsp;{%$comment.date|f_escape_xml%}</p>
</li>
{%/if%}
{%/foreach%}
{%/if%}
{%/foreach%}
</ul>
<a id="detail-comments" href="{%$widget_data.data.more_comment_href|f_escape_xml%}" class="more-btn" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_MORE_COMMENT_CLICK|f_escape_xml%}, wd: '{%$wd|f_escape_xml%}', srcname:'{%$widget_data.src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}'}">查看更多信息</a>
</div>
{%elseif ($data.widget.comment && $isMovie)%}
<div class="place-widget-comment movie">
<div class="hd">
<span class="title">评论</span>
<span class="num">(共{%$widget_data.data.detail_info.comment_num|f_escape_xml%}条)</span>
</div>
<ul class="place_comment_list">
<li>
<div class="content_wrap">
<p class="content">
{%if $widget_data.data.review[0].info[0].user_name%}
<strong class="username">{%$widget_data.data.review[0].info[0].user_name|f_escape_xml%}</strong>
{%/if%}
</p>
{%if ($widget_data.data.review[0].info[0].overall_rating)%}
<span class="star_box_l">
<span class="star_score" style="width:{%intval($widget_data.data.review[0].info[0].overall_rating, 10)*15%}px"></span>
</span><span style="color: #dc3c3c;">{%$widget_data.data.review[0].info[0].overall_rating|f_escape_xml%}</span>
{%/if%}
<p class="content">{%$widget_data.data.review[0].info[0].content|f_escape_xml%}<span class="opt"></span></p></div>
<p class="extra">{%$widget_data.data.review[0].info[0].date|f_escape_xml%}</p>
</li>
</ul>
<div class="btm">
<div class="comment_btn">
<div class="seemore_btn">
<a id="detail-comments" href="{%$widget_data.data.more_comment_href|f_escape_xml%}" class="more-btn" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_MORE_COMMENT_CLICK|f_escape_xml%}, wd:'{%$widget_data.src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}'}">查看更多信息</a>
</div>
</div>
</div>
{%/if%}