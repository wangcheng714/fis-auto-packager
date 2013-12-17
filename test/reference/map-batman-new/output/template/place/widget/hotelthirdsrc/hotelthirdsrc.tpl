{%style id="/widget/hotelthirdsrc/hotelthirdsrc.inline.less"%}.hotel-head{padding:.5em .6em;display:-webkit-box;-webkit-box-align:center;border-bottom:1px solid #E4E4E4}.hotel-head .head-icon-thirdsrc{width:25px;height:25px}.hotel-head .head-name{margin-left:10px;font:700 15px "微软雅黑","宋体"}.hotel-head .head-act{padding:2px 8px;color:#fff;background:#f93f36;display:block;margin-left:8px;border-radius:3px;font-size:12px}.hotel-roomlist-thirdsrc li.room-item{display:-webkit-box;padding:.4em .6em;-webkit-box-align:center;border-bottom:1px solid #dbdbdb}.hotel-roomlist-thirdsrc li:last-child{border-bottom:0}.hotel-roomlist-thirdsrc .room-type{-webkit-box-flex:1}.hotel-roomlist-thirdsrc .room-count{text-align:right;margin-right:10px}.hotel-roomlist-thirdsrc .room-count .room-discount{background-color:#f93f36;box-sizing:border-box;padding:0 3px;border-radius:3px;float:right;color:#fff;height:1.5em;line-height:1.5em;font-size:12px}{%/style%}
{%if ($widget_data.widget.thirdsrcota)%}
{%assign var='thirdsrc' value=$widget_data.src_list[0]%}
<div class="hotel-subcard hotelbook-mod">
<div class="hotel-head">
<img class="head-icon-thirdsrc" src="{%$thirdsrc.hotel_info.src_logo_mobile|f_escape_xml%}"/>
<h3 class="head-name">{%$thirdsrc.hotel_info.src_name|f_escape_xml%}</h3>
{%*双旦购物节说明文案*%}
{%if $thirdsrc.hotel_info.award_tag%}
<a href="/mobile/webapp/place/guarantee/type=detailact{%if $kehuduan%}/kehuduan=1{%/if%}"
                   class="head-act"
                   data-log="{code: {%$STAT_CODE.PLACE_HOTEL_GWJ_DETAIL_ACTDES_CLICK|f_escape_xml%}, srcname:'hotel'}">
{%$thirdsrc.hotel_info.award_tag|f_escape_xml%}
</a>
{%/if%}
</div>
<ul class="hotel-roomlist-thirdsrc" {%if $widget_data.soldout %}style="display: none"{%/if%}>
{%foreach $thirdsrc.room_list as $i => $item%}
{%* 第4个之后的隐藏 *%}
<li class="room-item" {%if $i >= 4 %}style="display: none"{%/if%}>
<div class="room-type tit-text">{%$item.room_name|f_escape_xml%}</div>
<div class="room-count">
<div class="room-wrap"><span class="price-icon">¥</span>
<span class="price-num">{%$item.price|f_escape_xml%}</span>
</div>
{%*双旦购物节说明文案*%}
{%if $item.bonus%}
<div class="room-discount">{%$item.bonus|f_escape_xml%}</div>
{%/if%}
</div>
{%if ($item.bookable === '1')%}
<span class="bookbtn-item bookbtn-normal"
                              data-url="{%$item.booking_url_wise_webapp|f_escape_xml%}"
                              data-price="{%$item.price|f_escape_xml%}"
                              data-bonus="{%$item.bonus|f_escape_xml%}"></span>
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
            hotelType: '{%$widget_data.hotel_src|f_escape_js%}',
            kehuduan: '{%$kehuduan|f_escape_js%}'
        });
    {%/script%}
{%/if%}