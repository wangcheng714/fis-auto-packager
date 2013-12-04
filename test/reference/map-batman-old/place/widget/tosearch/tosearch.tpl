{%* 去百度搜索更多 *%}

<div class="place-widget-tosearch">
    <a target="_blank" href="http://m.baidu.com/s?word={%$widget_data.name%}" data-log="{code:{%$STAT_CODE.PLACE_DETAIL_TOSEARCH_CLICK%}, wd:'{%$wd%}', srcname:'{%$widget_data.ext.src_name%}', name:'{%$widget_data.name%}'}">去
        <span class="baidu">百度</span> 查看更多<span class="name">"{%htmlspecialchars_decode($widget_data.name)%}"</span></a>
</div>
{%script%}
    var tosearch = require("place:widget/tosearch/tosearch.js");
    tosearch.init();
{%/script%}