{%* 订房热线 *%}
{%if ($data.widget.bookphone)%}
<div class="place-widget-bookphone">
    <a data-tel="{%$widget_data.data.ota_phone%}" href="tel:{%$widget_data.data.ota_phone%}" data-log="{code:{%$STAT_CODE.PLACE_HOTEL_DETAIL_BOOKPHONE_CLICK%}}">订房热线&nbsp;{%$widget_data.data.ota_phone%}</a>
</div>
{%script%}
    var bookphone = require("place:widget/bookphone/bookphone.js");
    bookphone.init();
{%/script%}
{%/if%}
