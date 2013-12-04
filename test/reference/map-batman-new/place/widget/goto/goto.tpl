{%* 路线搜索 *%}
<div class="place-widget-goto">
    <a class="to needsclick" href="{%$widget_data.to%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_TO_CLICK%}, wd:'{%$wd%}', name:'{%$bname%}', srcname: '{%$srcname%}', entry: '{%$entry%}'}">
        <span class="text">到这里去</span>
    </a>
    <a class="from needsclick" href="{%$widget_data.from%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_FROM_CLICK%}, wd:'{%$wd%}', name:'{%$bname%}', srcname: '{%$srcname%}', entry: '{%$entry%}'}">
        <span class="text">从这里出发</span>
    </a>
    <a class="near needsclick" href="{%$widget_data.nearby%}" data-log="{code: {%$STAT_CODE.PLACE_DETAIL_NEAR_CLICK%}, wd:'{%$wd%}', name:'{%$bname%}', srcname: '{%$srcname%}', entry: '{%$entry%}'}">
        <span class="text">在附近找</span>
    </a>
</div>