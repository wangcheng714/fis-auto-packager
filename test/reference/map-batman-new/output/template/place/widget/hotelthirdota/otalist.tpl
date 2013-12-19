{%* 酒店预订房型列表页子页面--ota报价列表 *%}
{%if $widget_data.errorNoOta=="0" %}
{%$baseinfo = $widget_data.room_price.base_info|f_escape_xml%}
<div class="ota-result">
{%if !empty($baseinfo.room_type_area) || !empty($baseinfo.bed_type) 
         || !empty($baseinfo.room_type_floor) || !empty($baseinfo.adsl)%}
<div class="room-info clearfix">
{%if $baseinfo.room_type_area|strip:""!="" %}
<div class="info-area">{%$baseinfo.room_type_area|f_escape_xml%}</div>
{%/if%}
{%if $baseinfo.bed_type|strip:""!="" %}
<div class="info-bedtype">{%$baseinfo.bed_type|f_escape_xml%}</div>
{%/if%}
{%if $baseinfo.room_type_floor|strip:""!="" %}
<div class="info-floor">{%$baseinfo.room_type_floor|f_escape_xml%}</div>
{%/if%}
{%if $baseinfo.adsl|strip:""!="" %}
<div class="info-internet">{%$baseinfo.adsl|f_escape_xml%}</div>
{%/if%}
</div>
{%/if%}
<div class="ota-list">
{%section name=otaprice loop=$widget_data.room_price.price_info%}
{%$book_type = $widget_data.room_price.price_info[otaprice].bd_booktype|f_escape_xml%}
{%if $book_type == 1%}
{%$price = $widget_data.room_price.price_info[otaprice].ota_price|f_escape_xml%}
{%$bonus = $widget_data.room_price.price_info[otaprice].ota_coupon_price || 0|f_escape_xml%}
{%$book_price = $price - $bonus|f_escape_xml%}
<a class="ota-item ota-normal{%if $smarty.section.otaprice.index>=3%} hide{%/if%}" target="_blank"
                   data-price="{%$widget_data.room_price.price_info[otaprice].ota_price|f_escape_xml%}"
                   data-bonus="{%$widget_data.room_price.price_info[otaprice].ota_coupon_price|f_escape_xml%}"
                   href="{%$widget_data.room_price.price_info[otaprice].ota_book_url|f_escape_xml%}&price={%$widget_data.room_price.price_info[otaprice].ota_price|f_escape_path%}&book_price={%$book_price|f_escape_path%}"
                   index="{%$smarty.section.otaprice.index%}">
{%elseif $book_type == 2%}
<a class="ota-item ota-tel{%if $smarty.section.otaprice.index>=3%} hide{%/if%}"
                   href="tel:{%$widget_data.room_price.price_info[otaprice].ota_phone|f_escape_path%}" phone="{%$widget_data.room_price.price_info[otaprice].ota_phone|f_escape_xml%}"
                   index="{%$smarty.section.otaprice.index%}">
{%elseif $book_type == 3%}
<a class="ota-item ota-web{%if $smarty.section.otaprice.index>=3%} hide{%/if%}"
                   href="javascript:void(0)"
                   index="{%$smarty.section.otaprice.index%}">
{%else%}
<a class="ota-item ota-over{%if $smarty.section.otaprice.index>=3%} hide{%/if%}"
                   href="javascript:void(0)"
                   index="{%$smarty.section.otaprice.index%}">
{%/if%}
<div class="ota-item-tf">
<div class="ota-name">
{%$widget_data.room_price.price_info[otaprice].ota_name|f_escape_xml%}
</div>
<div class="ota-type">
{%$widget_data.room_price.price_info[otaprice].ota_room_name|f_escape_xml%}
</div>
</div>
<div class="ota-item-ts">
{%if $widget_data.room_price.price_info[otaprice].ota_price!=0 %}
<div class="ota-price">
<span>¥</span>
<span>{%$widget_data.room_price.price_info[otaprice].ota_price|f_escape_xml%}</span>
</div>
{%/if%}
{%if $widget_data.room_price.price_info[otaprice].ota_coupon_price!=0 %}
<div class="ota-coupon">
<span>{%$widget_data.room_price.price_info[otaprice].ota_coupon_type|f_escape_xml%}</span>
<span>¥{%$widget_data.room_price.price_info[otaprice].ota_coupon_price|f_escape_xml%}</span>
</div>
{%/if%}
</div>
{%if $book_type==1%}
<span class="ota-bookbtn ota-bookbtn-normal"></span>
{%elseif $book_type==2%}
<span class="ota-bookbtn ota-bookbtn-tel"></span>
{%elseif $book_type==3%}
<span class="ota-bookbtn ota-bookbtn-web"></span>
{%else%}
<span class="ota-bookbtn-over">订完</span>
{%/if%}
</a>
{%/section%}
</div>
{%if $smarty.section.otaprice.total>3 %}
<div class="show-all-ota">
<span>展开其他报价</span>
<span></span>
</div>
{%/if%}
</div>
{%else%}
{%widget name="place:widget/hotelthirdota/otalistfailed.tpl"%}
{%/if%}