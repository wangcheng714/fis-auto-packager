<!--第三方连锁酒店资源接入模板-->

{%if ($widget_data.widget.thirdsrcota)%}
    {%assign var='thirdsrc' value=$widget_data.src_list[0]%}
    <div class="hotel-subcard hotelbook-mod">
        <div class="hotel-head">
            <img class="head-icon-thirdsrc" src="{%$thirdsrc.hotel_info.src_logo_mobile%}"/>
            <h3 class="head-name">{%$thirdsrc.hotel_info.src_name%}</h3>
            {%*双旦购物节说明文案*%}
            {%if $thirdsrc.hotel_info.award_tag%}
                <a href="/mobile/webapp/place/guarantee/type=detailact{%if $kehuduan%}/kehuduan=1{%/if%}"
                   class="head-act"
                   data-log="{code: {%$STAT_CODE.PLACE_HOTEL_GWJ_DETAIL_ACTDES_CLICK%}, srcname:'hotel'}">
                    {%$thirdsrc.hotel_info.award_tag%}
                </a>
            {%/if%}
        </div>
        <ul class="hotel-roomlist-thirdsrc" {%if $widget_data.soldout %}style="display: none"{%/if%}>
            {%foreach $thirdsrc.room_list as $i => $item%}
                {%* 第4个之后的隐藏 *%}
                <li class="room-item" {%if $i >= 4 %}style="display: none"{%/if%}>
                    <div class="room-type tit-text">{%$item.room_name%}</div>
                    <div class="room-count">
                        <div class="room-wrap"><span class="price-icon">¥</span>
                            <span class="price-num">{%$item.price%}</span>
                        </div>
                        {%*双旦购物节说明文案*%}
                        {%if $item.bonus%}
                            <div class="room-discount">{%$item.bonus%}</div>
                        {%/if%}
                    </div>
                    {%if ($item.bookable === '1')%}
                        <span class="bookbtn-item bookbtn-normal"
                              data-url="{%$item.booking_url_wise_webapp%}"
                              data-price="{%$item.price%}"
                              data-bonus="{%$item.bonus%}"></span>
                    {%else%}
                        <span class="bookbtn-up">订完</span>
                    {%/if%}
                </li>
            {%/foreach%}
            {%if (count($thirdsrc.room_list) > 4) %}
                <li class="room-more">
                    <div class="more-wrap">
                        <span class="room-more-text tit-text">查看全部房型</span>
                        <span class="room-more-icon"></span>
                    </div>
                </li>
            {%/if%}
        </ul>
    </div>
    {%script%}
        (require('place:widget/hotelthirdsrc/hotelthirdsrc.js')).init({
            hotelType: '{%$widget_data.hotel_src%}',
            kehuduan: '{%$kehuduan%}'
        });
    {%/script%}
{%/if%}