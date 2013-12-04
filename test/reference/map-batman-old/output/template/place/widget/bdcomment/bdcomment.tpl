{%style id="/widget/bdcomment/bdcomment.inline.less"%}.comment-title {
  margin: 0 7px 16px;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
  line-height: 25px;
  height: 25px;
}
.comment-logo {
  width: 25px;
  height: 25px;
  vertical-align: middle;
}
.comment-count {
  font-size: 14px;
  color: #6e6e6e;
  font-weight: normal;
}
.comment-select {
  float: right;
  height: 25px;
  border: 1px solid #CCC;
  border-radius: 3px;
  text-align: center;
  padding: 0 3px;
}
.comment-list {
  line-height: 20px;
  color: #6e6e6e;
  margin: 0px 7px;
}
.comment-loadmore {
  display: block;
  height: 28px;
  line-height: 28px;
  margin-bottom: 17px;
  text-align: center;
  border: #adadad solid 1px;
  border-radius: .25em;
  color: #444D62;
}
.comment-item {
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
  color: #6E6E6E;
  line-height: 22px;
  padding: 0 8px;
}
.comment-username {
  color: #c46221;
  font-weight: bold;
}
.comment-source {
  float: right;
  color: #9d9d9d;
  margin-top: 12px;
}
{%/style%}{%foreach $widget_data.info as $j=>$comment_item%}
    <div class="comment-item">
        <div class="comment-content">
            <span class="comment-username">{%$comment_item.user_name%}：</span>{%$comment_item.content%}
        </div>
        <div class="comment-source">来自{%$comment_item.cn_name%}&nbsp;{%$comment_item.date%}</div>
    </div>
{%/foreach%}