{%* 酒店预订房型列表页 *%}
{%if ($data.widget.hotelbook)%}
{%if $widget_data.errorNoRoom=="0" %}
<div class="place-widget-hotel-book">
    <div class="hb-hd">
        <span class="hb-icon-qunar"></span>
        <h3 class="tit-text hb-hd-tit">去哪儿</h3>
        <a class="des-text qunar-granantee" href="/mobile/webapp/place/guarantee" data-log="{code:{%$STAT_CODE.PLACE_HOTEL_GUARANTEE_CLICK%}, name:'{%$widget_data.content.name%}'}">（去哪儿网为您提供担保<span class="hb-des-icon"></span>）</a>
    </div>
    <div class="main">
        {%widget name="place:widget/hotelbook/roomlist.tpl"%}
        <div id="uid" class="hide">{%$widget_data.uid%}</div>
    </div>
</div>
{%script%}
var hotelbook = require("place:widget/hotelbook/hotelbook.js");
hotelbook.init();
{%/script%}
{%else%}
{%widget name="place:widget/hotelbook/roomlistfailed.tpl"%}
{%/if%}
{%/if%}


