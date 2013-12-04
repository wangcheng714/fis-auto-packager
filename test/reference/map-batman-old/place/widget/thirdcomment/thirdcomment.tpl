{%if ereg("wd=([A-Z0-9%]+)", $smarty.server.REQUEST_URI, $regs)%}
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