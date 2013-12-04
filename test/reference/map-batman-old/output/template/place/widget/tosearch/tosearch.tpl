{%style id="/widget/tosearch/tosearch.inline.less"%}.place-widget-tosearch {
  height: 39px;
  line-height: 39px;
  margin: 20px 0px;
  padding: 0 4%;
  border: solid 1px #838991;
  border-radius: .25em;
  font-weight: bold;
  text-align: center;
  background: url("/static/place/images/goto_0518661.png") 98% center no-repeat;
  background-size: 7px 12px;
}
.place-widget-tosearch .name {
  white-space: nowrap;
  display: inline-block;
  margin-left: 5px;
  font: bold 15px "微软雅黑", "宋体";
  text-overflow: ellipsis;
  overflow: hidden;
}
.place-widget-tosearch a {
  display: block;
  color: #333;
}
.place-widget-tosearch .baidu {
  color: #2932e1;
}
{%/style%}{%* 去百度搜索更多 *%}

<div class="place-widget-tosearch">
    <a target="_blank" href="http://m.baidu.com/s?word={%$widget_data.name%}" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_TOSEARCH_CLICK%}, wd:'{%$wd%}', srcname:'{%$widget_data.ext.src_name%}', name:'{%$widget_data.name%}'}">去
        <span class="baidu">百度</span> 查看更多<span class="name">"{%htmlspecialchars_decode($widget_data.name)%}"</span></a>
</div>
{%script%}
    var tosearch = require("place:widget/tosearch/tosearch.js");
    tosearch.init();
{%/script%}