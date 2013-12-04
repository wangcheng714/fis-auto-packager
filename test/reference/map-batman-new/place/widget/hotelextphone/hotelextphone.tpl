{%if count($widget_data.ota_info)%}
    <div class="hotel-subcard">
        {%$phone = trim($widget_data.ota_info[0].ota_phone)%}
        <a href="tel:{%$phone%}" phone="{%$phone%}">订房电话：{%$phone%}</a>
    </div>
{%/if%}