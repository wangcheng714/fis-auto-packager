{%style id="/widget/hotelextphone/hotelextphone.inline.less"%}#place-pagelet-hotelextphone a{text-decoration:none;color:#6a8292;font-size:16px;font-family:"微软雅黑","宋体";width:100%;display:block;text-align:center;padding:8px 0}{%/style%}{%if count($widget_data.ota_info)%}
<div class="hotel-subcard">
{%$phone = trim($widget_data.ota_info[0].ota_phone)%}
<a href="tel:{%$phone|f_escape_path%}" phone="{%$phone|f_escape_xml%}">订房电话：{%$phone|f_escape_xml%}</a>
</div>
{%/if%}