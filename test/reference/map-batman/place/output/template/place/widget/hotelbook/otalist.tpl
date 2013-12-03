{%* 酒店预订房型列表页子页面--ota报价列表 *%}
{%if $widget_data.errorNoOta=="0" %}
{%$baseinfo = $widget_data.room_price.base_info%}
<div class="ota-result">
{%if !empty($baseinfo.room_type_area) || !empty($baseinfo.bed_type) 
         || !empty($baseinfo.room_type_floor) || !empty($baseinfo.adsl)%}
<div class="ota-info">
<div>
{%if $baseinfo.room_type_area|strip:""!="" %}
<span class="room-area">
<span></span>&nbsp;{%$baseinfo.room_type_area|f_escape_xml%}
</span>
{%/if%}
{%if $baseinfo.bed_type|strip:""!="" %}
<span class="room-bed-type">
<span></span>&nbsp;{%$baseinfo.bed_type|f_escape_xml%}
</span>
{%/if%}
{%if $baseinfo.room_type_floor|strip:""!="" %}
<span class="room-floor">
<span></span>&nbsp;{%$baseinfo.room_type_floor|f_escape_xml%}
</span>
{%/if%}
{%if $baseinfo.adsl|strip:""!="" %}
<span class="room-internet">
<span></span>&nbsp;{%$baseinfo.adsl|f_escape_xml%}
</span>
{%/if%}
</div>
</div>
{%/if%}
<ul class="ota-list">
{%section name=otaprice loop=$widget_data.room_price.price_info%}
{%if $smarty.section.otaprice.index<3%}
<li class="ota-item" ota_book_url="{%$widget_data.room_price.price_info[otaprice].ota_book_url|f_escape_xml%}" index="{%$smarty.section.otaprice.index%}">
{%else%}
<li class="ota-item hide" ota_book_url="{%$widget_data.room_price.price_info[otaprice].ota_book_url|f_escape_xml%}" index="{%$smarty.section.otaprice.index%}">
{%/if%}
<table class="ota-item-tf">
<tr>
<td>
<div class="ota-name">
{%$widget_data.room_price.price_info[otaprice].ota_name|f_escape_xml%}
</div>
<div class="ota-type">
{%$widget_data.room_price.price_info[otaprice].ota_room_name|f_escape_xml%}
</div>
</td>
</tr>
</table>
<table class="ota-item-ts">
<tr>
<td>
{%if $widget_data.room_price.price_info[otaprice].ota_price!=0 %}
<div class="ota-price">
<span>￥</span>
<span>{%$widget_data.room_price.price_info[otaprice].ota_price|f_escape_xml%}</span>
</div>
{%/if%}
{%if $widget_data.room_price.price_info[otaprice].ota_coupon_type=="可返" && $widget_data.room_price.price_info[otaprice].ota_coupon_price!=0 %}
<div class="ota-coupon">
<span>返￥</span>
<span>{%$widget_data.room_price.price_info[otaprice].ota_coupon_price|f_escape_xml%}</span>
</div>
{%/if%}
</td>
</tr>
</table>
{%if $widget_data.room_price.price_info[otaprice].bd_booktype==1%}
<span class="ota-bookbtn"
                          data-url="{%$widget_data.room_price.price_info[otaprice].ota_book_url|f_escape_xml%}"
                          data-price="{%$widget_data.room_price.price_info[otaprice].ota_price|f_escape_xml%}"
                          data-bonus="{%$widget_data.room_price.price_info[otaprice].ota_coupon_price|f_escape_xml%}"></span>
{%elseif $widget_data.room_price.price_info[otaprice].bd_booktype==2%}
<a href="tel:{%$widget_data.room_price.price_info[otaprice].ota_phone|f_escape_path%}" phone="{%$widget_data.room_price.price_info[otaprice].ota_phone|f_escape_xml%}" class="ota-bookbtn ota-bookbtn-tel"></a>
{%elseif $widget_data.room_price.price_info[otaprice].bd_booktype==3%}
<span class="ota-bookbtn ota-bookbtn-web"></span>
{%else%}
<span class="ota-bookbtn-over">订完</span>
{%/if%}
</li>
{%/section%}
</ul>
{%if $smarty.section.otaprice.total>3 %}
<div class="show-all-ota">
<span>展开其他报价</span>
<span></span>
</div>
{%/if%}
</div>
{%else%}
{%widget name="place:widget/hotelbook/otalistfailed.tpl"%}
{%/if%}