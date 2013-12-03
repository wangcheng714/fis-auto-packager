{%* 房型列表 *%}
<div class="rooms">
<ul class="room-list">
{%section name=rooms loop=$widget_data.room_info%}
{%if $smarty.section.rooms.index<3%}
<li class="room-item" ota_price_url="{%$widget_data.room_info[rooms].ota_price_url|f_escape_xml%}" index="{%$smarty.section.rooms.index%}">
{%else%}
<li class="room-item hide" ota_price_url="{%$widget_data.room_info[rooms].ota_price_url|f_escape_xml%}" index="{%$smarty.section.rooms.index%}">
{%/if%}
{%if $smarty.section.rooms.index==0 %}
<span class="arrow-icon-open"></span>
{%else%}
<span class="arrow-icon"></span>
{%/if%}
<span class="room-type" style="max-width: -webkit-calc(100% - 150px); max-width: calc(100% - 150px);">{%$widget_data.room_info[rooms].room_type_name|f_escape_xml%}</span>
{%if $widget_data.room_info[rooms].tonight_sale_flag == 1 %}
<span class="special-price"></span>
{%/if%}
{%if $widget_data.room_info[rooms].lowest_price!=0 %}
<span class="room-price">
<span class="price-symbol">￥</span>{%$widget_data.room_info[rooms].lowest_price|f_escape_xml%}
</span>
<span class="room-begin">起</span>
{%else%}
<span class="room-book-over">订完</span>
{%/if%}
</li>
{%if $smarty.section.rooms.index==0 %}
{%if $widget_data.errorNoOta=="0" %}
{%widget name="place:widget/hotelbook/otalist.tpl"%}
{%else%}
{%widget name="place:widget/hotelbook/otalistfailed.tpl"%}
{%/if%}
{%/if%}
{%/section%}
</ul>
{%if $smarty.section.rooms.total>3 %}
<div class="show-all-room">
<span>查看其他房型</span>
<span></span>
</div>
{%/if%}
</div>