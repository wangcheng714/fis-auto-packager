{%* 详情页UGC评论入口，我要评论按钮*%}
{%if $widget_data.ext || $widget_data.review %}
<a class="place-widget-commentbtn" id="J_commentBtn"
   href="/mobile/webapp/place/icomment/uid={%$widget_data.uid%}&name={%$widget_data.name%}"
   data-log="{code: {%$STAT_CODE.PLACE_COMMENT_COMMENTBTN_CLICK%}, wd:'{%$src_name%}', name:'{%$widget_data.name%}'}">
    <i class="combtn-icon"></i>
    <span class="combtn-text">我要评论</span>
</a>
{%script%}
    (require('commentbtn.js')).init();
{%/script%}
{%/if%}

