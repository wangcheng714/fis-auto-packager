{%* 房型列表 *%}
<div class="room-list">
{%section name=rooms loop=$widget_data.room_info%}
{%if $smarty.section.rooms.index<3%}
<div class="room-item" ota_price_url="{%$widget_data.room_info[rooms].ota_price_url|f_escape_xml%}" index="{%$smarty.section.rooms.index%}">
{%else%}
<div class="room-item hide" ota_price_url="{%$widget_data.room_info[rooms].ota_price_url|f_escape_xml%}" index="{%$smarty.section.rooms.index%}">
{%/if%}
<span class="arrow-icon{%if $smarty.section.rooms.index==0 %} arrow-icon-open{%/if%}"></span>
<span class="room-type" style="max-width: -webkit-calc(100% - 150px); max-width: calc(100% - 150px);">{%$widget_data.room_info[rooms].room_type_name|f_escape_xml%}</span>
{%if $widget_data.room_info[rooms].lowest_price!=0 %}
<span class="room-price">
<span class="price-symbol">¥</span>{%$widget_data.room_info[rooms].lowest_price|f_escape_xml%}
</span>
<span class="room-begin">起</span>
{%else%}
<span class="room-book-over">订完</span>
{%/if%}
</div>
{%if $smarty.section.rooms.index==0 %}
{%if $widget_data.errorNoOta=="0" %}
{%widget name="place:widget/hotelthirdota/otalist.tpl"%}
{%else%}
{%widget name="place:widget/hotelthirdota/otalistfailed.tpl"%}
{%/if%}
{%/if%}
{%/section%}
</div>
{%if $smarty.section.rooms.total>3 %}
<div class="show-all-room">
<span>查看其他房型</span>
<span></span>
</div>
{%/if%}
