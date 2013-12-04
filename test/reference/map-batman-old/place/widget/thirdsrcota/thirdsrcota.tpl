<!--携程资源接入模板-->
{%if ($data.widget.thirdsrcota)%}
{%if ($widget_data.errorNoThird == '0')%}
<div class="place-widget-thirdsrcota hidelist">
    <div class="hb-hd">
        <img class="hb-icon-hanting" src="{%$widget_data.src_list[0].hotel_info.src_logo_mobile%}"/>
        <h3 class="ota-name hb-hd-tit xiecheng-tit">{%$widget_data.src_list[0].hotel_info.src_name%}</h3>
    </div>
    <ul class="hb-hanting-roomlist">
        {%foreach $widget_data.src_list[0].room_list as $i => $item%}
            {%* 第4个之后的隐藏 *%}
            {%if ($i == 4)%}
            <div class="more-items" style="display: none;">
            {%/if%}
            <li class="hb-hanting-room-item">
                <div class="room-type ota-name">{%$item.room_name%}</div>
                <div class="room-count">
                    <div class="room-wrap"><span class="price-icon">¥</span>
                        <span class="price-num">{%$item.price%}</span>
                    </div>
                    {%if (!empty($item.bonus))%}
                    <div class="room-discount">返¥{%$item.bonus%}</div>
                    {%/if%}
                </div>
                {%if ($item.bookable === '1')%}
                <span class="bookbtn-item bookbtn-xiecheng-normal"
                   data-price="{%$item.price%}"
                   data-bonus="{%$item.bonus%}"
                   data-url="{%$item.booking_url_wise_webapp%}"></span>
                {%else%}
                <span class="bookbtn-up">订完</span>
                {%/if%}
            </li>

            {%if ($i == count($widget_data.src_list[0].room_list) - 1 && $i >= 4) %}
            </div>
            <li class="room-more">
                <div class="more-wrap">
                    <span class="room-more-text tit-text">查看全部房型</span>
                    <span class="room-more-icon"></span>
                </div>
            </li>
            {%/if%}
        {%/foreach%}
    </ul>
    <input type="hidden" class="uid" value="{%$widget_data.uid%}" />
</div>
{%script%}
require('place:widget/thirdsrcota/thirdsrcota.js').init();
{%/script%}
{%/if%}
{%/if%}