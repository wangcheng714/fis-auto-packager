{%style id="/widget/commentbtn/commentbtn.inline.less"%}.place-widget-commentbtn{background:-webkit-gradient(linear,0 100%,0 0,from(#eee),to(#fdfdfd));border-radius:.25em;border:#838991 solid 1px;text-align:center;font-weight:700;-webkit-box-sizing:border-box;color:RGB(186,93,31);display:block;height:39px;line-height:39px}.place-widget-commentbtn .combtn-icon{margin-right:10px;text-align:center;background:url(/mobile/simple/static/place/images/comment_63b73f5.png) no-repeat 10px 8px;background-size:18px 18px;display:inline-block;height:39px;width:28px}.place-widget-commentbtn .combtn-text{vertical-align:15px;display:inline-block}{%/style%}{%* 详情页UGC评论入口，我要评论按钮*%}
{%if $widget_data.ext || $widget_data.review %}
<a class="place-widget-commentbtn" id="J_commentBtn" href="javascript:void(0);"
   data-url="/mobile/webapp/place/icomment/uid={%$widget_data.uid|f_escape_xml%}&name={%$widget_data.name|f_escape_xml%}"
   data-log="{code: {%$STAT_CODE.PLACE_COMMENT_COMMENTBTN_CLICK|f_escape_xml%}, wd:'{%$src_name|f_escape_xml%}', name:'{%$widget_data.name|f_escape_xml%}'}">
<i class="combtn-icon"></i>
<span class="combtn-text">我要评论</span>
</a>
{%*抽奖按钮的统计码临时存储*%}
<i id="bonus-stat" data-log="{code:{%$STAT_CODE.PLACE_COMMENT_BONUS_BTN_CLICK|f_escape_xml%}}"></i>
{%script%}
    (require('place:widget/commentbtn/commentbtn.js')).init();
{%/script%}
{%/if%}
