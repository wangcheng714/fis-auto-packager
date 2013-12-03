{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
{%* place detail页布局样式 *%}
<style  type="text/css">.place-page-detail{padding:0 8px 8px;background:#F2F2F2;overflow:hidden}.place-page-detail>[class^=place-widget-],.place-page-detail>[id^=place-pagelet-]>[class^=place-widget-]{margin:10px 0}.place-page-detail .place-widget-comment,.place-page-detail .place-widget-overview,.place-page-detail .place-widget-sitelink,.place-page-detail .place-widget-tosearch,.place-page-detail .place-widget-cater,.place-page-detail .place-widget-recommend{margin:20px 0}.place-page-detail.movie>[class^=place-widget-],.place-page-detail.movie>[id^=place-pagelet-]>[class^=place-widget-]{margin-bottom:0}.place-page-detail.movie div.place-widget-goto{margin:0 0 10px}.place-page-detail.movie div.place-widget-captain,.place-page-detail.movie div.place-pagelet-basicmovieinfo,.place-page-detail.movie div.place-widget-promotion{margin:10px 0 0}</style>
{%* 导航widget *%}
{%widget name="common:widget/nav/nav.tpl" title="评论信息"%}
<div class="place-page-detail">
{%* 添加我要评论按钮 *%}
{%widget name="place:widget/commentbtn/commentbtn.tpl" widget_data=$data%}
{%if $data.review && $data.review.info %}
<style  type="text/css">.comment-title{margin:0 7px 16px;font-size:16px;font-weight:700;overflow:hidden;line-height:25px;height:25px}.comment-logo{width:25px;height:25px;vertical-align:middle}.comment-count{font-size:14px;color:#6e6e6e;font-weight:400}.comment-select{float:right;height:25px;border:1px solid #CCC;border-radius:3px;text-align:center;padding:0 3px}.comment-list{line-height:20px;color:#6e6e6e;margin:0 7px}.comment-loadmore{display:block;height:28px;line-height:28px;margin-bottom:17px;text-align:center;border:#adadad solid 1px;border-radius:.25em;color:#444D62}.comment-item{position:relative;overflow:hidden;margin-bottom:15px;color:#6E6E6E;line-height:22px;padding:0 8px}.comment-username{color:#c46221;font-weight:700}.comment-source{float:right;color:#9d9d9d;margin-top:12px}</style>
<div class="comment-title">
<img class="comment-logo" alt="{%$data.review.cn_name|f_escape_xml%}"
                     src="http://map.baidu.com/fwmap/upload/place/icon/{%$data.review.name|f_escape_path%}/50.png" />
<span class="comment-name">{%$data.review.cn_name|f_escape_xml%}</span>
<span class="comment-count">({%$data.review.review_num|f_escape_xml%}条评论信息)</span>
<select id="J_commentSelect" class="comment-select" data-uid="{%$data.uid|f_escape_xml%}">
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
                maxCount = parseInt({%$data.review.review_num|f_escape_js%}),
                maxResults = 10,
                startIndex = 0,
                uid = '{%$data.uid|f_escape_js%}',
                order = {%$data.order|f_escape_js%};

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
{%require name='place:page/detail/bdcommentlist.tpl'%}{%/block%}
