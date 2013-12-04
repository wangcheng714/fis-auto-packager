{%* 详情页UGC评论入口，我要评论按钮*%}
{%if $widget_data.ext || $widget_data.review %}
<a class="place-widget-commentbtn" id="J_commentBtn" href="javascript:void(0);"
   data-url="/mobile/webapp/place/icomment/uid={%$widget_data.uid%}&name={%$widget_data.name%}"
   data-log="{code: {%$STAT_CODE.PLACE_COMMENT_COMMENTBTN_CLICK%}, wd:'{%$src_name%}', name:'{%$widget_data.name%}'}">
    <i class="combtn-icon"></i>
    <span class="combtn-text">我要评论</span>
</a>
{%*抽奖按钮的统计码临时存储*%}
<i id="bonus-stat" data-log="{code:{%$STAT_CODE.PLACE_COMMENT_BONUS_BTN_CLICK%}}"></i>
{%script%}
    (require('commentbtn.js')).init();
{%/script%}
{%/if%}

