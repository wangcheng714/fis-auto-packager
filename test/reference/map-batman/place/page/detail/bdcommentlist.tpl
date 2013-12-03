{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    {%* place detail页布局样式 *%}
    <link rel="stylesheet"  type="text/css" href="/static/css/detail.inline.less?__inline">
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title="评论信息"%}

    <div class="place-page-detail">

        {%* 添加我要评论按钮 *%}
        {%widget name="place:widget/commentbtn/commentbtn.tpl" widget_data=$data%}

        {%if $data.review && $data.review.info %}
            <link rel="stylesheet"  type="text/css" href="/widget/bdcomment/bdcomment.inline.less?__inline">
            <div class="comment-title">
                <img class="comment-logo" alt="{%$data.review.cn_name%}"
                     src="http://map.baidu.com/fwmap/upload/place/icon/{%$data.review.name%}/50.png" />
                <span class="comment-name">{%$data.review.cn_name%}</span>
                <span class="comment-count">({%$data.review.review_num%}条评论信息)</span>
                <select id="J_commentSelect" class="comment-select" data-uid="{%$data.uid%}">
                    <option value="2" {%if $data.order=="2"%}selected="selected"{%/if%}>默认排序</option>
                    <option value="1" {%if $data.order=="1"%}selected="selected"{%/if%}>时间排序</option>
                </select>
            </div>
        {%/if%}

        {%widget
            name="place:widget/bdcomment/bdcomment.tpl"
            widget_data=$data.review
            pagelet_id="place-pagelet-bdcommentlist"
            mode="quickling"
        %}
        <a id="J_commentMore" class="comment-loadmore" href="javascript:void(0);">加载更多评论信息</a>
    </div>
    {%script%}
        (function(){
            var util = require('common:static/js/util.js'),
                count = 0,
                maxCount = parseInt({%$data.review.review_num%}),
                maxResults = 10,
                startIndex = 0,
                uid = '{%$data.uid%}',
                order = {%$data.order%};

            function loadMoreComments() {
                var id,
                    params = util.jsonToUrl({
                        uid: uid,
                        startIndex: startIndex++,
                        maxResults: maxResults,
                        orderBy: order
                    }),
                    $loadMore = $('.comment-loadmore')

                // 处理百度评论页连续加载的情况
                id = 'place-pagelet-bdcommentlist'+ count;
                $('<div id="'+ id + '"></div>' ).insertBefore('#J_commentMore');
                BigPipe.asyncLoad({id: 'place-pagelet-bdcommentlist', 'html_id': id}, params);

                if ((++count)*maxResults >= maxCount) {
                    $('.comment-loadmore').hide();
                }
            }

            loadMoreComments();
            $('#J_commentMore').on( 'click', loadMoreComments);
            $('#J_commentSelect').on( 'change', function() {
                location.href = location.href + "&orderBy=" + $('#J_commentSelect').val();
            } );
        })();
    {%/script%}
{%/block%}

