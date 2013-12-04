{%style id="/widget/thirdcomment/thirdcomment.inline.less"%}.comment-block {
  padding-top: 15px;
  border-bottom: solid 1px #e1e1e1;
  background-color: #f9f9f9;
  overflow: hidden;
}
.comment-block .comment-title {
  margin: 0 7px 16px;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  line-height: 25px;
  height: 25px;
}
.comment-block .comment-logo {
  width: 25px;
  height: 25px;
  vertical-align: middle;
}
.comment-block .comment-count {
  font-size: 14px;
  color: #6e6e6e;
  font-weight: normal;
}
.comment-block .comment-select {
  float: right;
  height: 25px;
  border: 1px solid #CCC;
  border-radius: 3px;
  text-align: center;
  padding: 0 3px;
}
.comment-block .comment-list {
  line-height: 20px;
  color: #6e6e6e;
  margin: 0px 7px;
}
.comment-block .comment-goto {
  display: block;
  height: 28px;
  line-height: 28px;
  margin-bottom: 17px;
  text-align: center;
  border: #adadad solid 1px;
  border-radius: .25em;
  color: #444D62;
}
.comment-block .comment-item {
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
}
.comment-block .comment-item .comment-content {
  color: #6E6E6E;
}
.comment-block .comment-item .comment-content .comment_dp_more {
  color: #9D9D9D;
}
.comment-block .comment-username {
  color: #c46221;
  font-weight: bold;
}
.comment-block .comment-source {
  float: right;
  color: #9d9d9d;
  margin-top: 12px;
}
{%/style%}{%if ereg("wd=([A-Z0-9%]+)", $smarty.server.REQUEST_URI, $regs)%}
    {%$wd = urldecode($regs[1])%}
{%/if%}
{%if $data.bdcomment && count($widget_data.data.info)%}
    {%$view_data=$widget_data.data%}
    <div class="comment-block">
        <div class="comment-title">
            <img class="comment-logo" alt="{%$view_data.cn_name%}"
                 src="http://map.baidu.com/fwmap/upload/place/icon/{%$view_data.name%}/50.png" />
            <span class="comment-src">{%$view_data.cn_name%}</span>
            <span class="comment-count">({%$view_data.review_num%}条评论信息)</span>
            <select id="J_commentSelect" class="comment-select" data-uid="{%$widget_data.uid%}">
                <option value="2" {%if $widget_data.order=="2"%}selected="selected"{%/if%}>默认排序</option>
                <option value="1" {%if $widget_data.order=="1"%}selected="selected"{%/if%}>时间排序</option>
            </select>

        </div>
        <ul class="comment-list">
            {%foreach $view_data.info as $j=>$comment_item%}
                <li class="comment-item">
                    <div class="comment-content">
                        <span class="comment-username">{%$comment_item.user_name%}：</span>{%$comment_item.content%}
                    </div>
                    <div class="comment-source">来自{%$comment_item.cn_name%}&nbsp;{%$comment_item.date%}</div>
                </li>
            {%/foreach%}
        </ul>
        {%if $view_data.review_num > 5%}
            <a class="comment-goto" href="{%$widget_data.comment_url%}"
               data-log="{code: {%$STAT_CODE.PLACE_COMMENT_BDCOMMENT_CLICK%}}">查看全部{%$view_data.review_num%}条评论</a>
        {%/if%}
    </div>
    {%script%}
        (require('place:widget/thirdcomment/thirdcomment.js')).init();
    {%/script%}
{%else%}
    {%foreach $widget_data.data as $i=>$comment_block%}
        {%if ($comment_block.name != 'baidumap')%}
            <div class="comment-block">
                <div class="comment-title">
                    <img class="comment-logo" alt="{%$comment_block.cn_name%}"
                         src="http://map.baidu.com/fwmap/upload/place/icon/{%$comment_block.name%}/50.png" />
                    <span class="comment-src">{%$comment_block.cn_name%}</span>
                    <span class="comment-count">({%$comment_block.review_num%}条评论信息)</span>
                </div>
                <ul class="comment-list">
                    {%foreach $comment_block.info as $j=>$comment_item%}
                        {%if ($j < 5)%}
                            <li class="comment-item">
                                {%if $comment_block.name=="dianping" && ($widget_data.src_name=="cater" || $widget_data.src_name=="shopping")%}
                                    {%if !empty($comment_item.one_url_mobile)%}
                                    <a target="_blank" href="{%$comment_item.one_url_mobile%}">
                                    {%else%}
                                    <a target="_blank" href="javascript:void(0);">
                                    {%/if%}
                                        <div class="comment-content">
                                            <span class="comment-username">{%$comment_item.user_name%}：</span>{%$comment_item.content|truncate:50:"...":true%}
                                            <span class="comment_dp_more">更多&gt;&gt;</span>
                                        </div>
                                    </a>
                                {%else%}
                                    <div class="comment-content">
                                        <span class="comment-username">
                                            {%if !empty($comment_item.user_name)%}
                                                {%$comment_item.user_name%}：
                                            {%/if%}
                                        </span>
                                        {%$comment_item.content%}
                                    </div>
                                {%/if%}
                                <div class="comment-source">来自{%$comment_block.cn_name%}&nbsp;{%$comment_item.date%}</div>
                            </li>
                        {%/if%}
                    {%/foreach%}
                </ul>
                {%if $comment_block.review_num > 5%}
                    <a class="comment-goto" target="_blank" href="{%$comment_block.url_mobilephone%}" data-log="{code:{%$STAT_CODE.PLACE_MORECOMMENT_WATCHALL_CLICK%}, wd: '{%$wd%}', srcname:'{%$widget_data.src_name%}', name:'{%$widget_data.name%}', dest:'{%$comment_block.cn_name%}'}">
                        到{%$comment_block.cn_name%}查看全部{%$comment_block.review_num%}条评论</a>
                {%/if%}
            </div>
        {%/if%}
    {%/foreach%}
{%/if%}