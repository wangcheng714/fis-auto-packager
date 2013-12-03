{%style id="/widget/thirdsrcota/thirdsrcota.inline.less"%}/*-- 携程资源接入样式 --*/
.place-widget-thirdsrcota {
  background-color: #f2f2f2;
  border: 1px solid #838991;
  border-radius: 5px;
  margin-top: 10px;
  -webkit-box-sizing: border-box;
  margin: 10px 0px;
  /*hanting酒店预定模块 end*/

  /*酒店房型正在加载中、房价加载失败通用view样式 begin*/

}
.place-widget-thirdsrcota .room-more {
  padding: 15px 10px;
}
.place-widget-thirdsrcota .more-wrap {
  border: 1px solid #bec0c6;
  border-radius: 3px;
  padding: 10px 0;
  text-align: center;
}
.place-widget-thirdsrcota .hb-hd {
  padding: 0.8em 0.6em;
  border-bottom: 1px solid #ccced2;
  display: -webkit-box;
  -webkit-box-align: center;
}
.place-widget-thirdsrcota .hb-hd .hb-icon-hanting {
  width: 25px;
  height: 25px;
}
.place-widget-thirdsrcota .hb-hd .hb-hd-tit {
  margin-left: 10px;
}
.place-widget-thirdsrcota .hb-hanting-room-item {
  display: -webkit-box;
  padding: .8em .6em;
  -webkit-box-align: center;
  border-bottom: 1px solid #ccced2;
}
.place-widget-thirdsrcota .hb-hanting-roomlist li:last-child {
  border-bottom: none;
}
.place-widget-thirdsrcota .hb-hanting-roomlist .room-type {
  -webkit-box-flex: 1;
}
.place-widget-thirdsrcota .hb-hanting-roomlist .room-count,
.place-widget-thirdsrcota .hb-qunar-roomlist .price-count {
  width: 60px;
  overflow: hidden;
  text-align: right;
  margin-right: 10px;
}
.place-widget-thirdsrcota .hb-hanting-roomlist .room-discount,
.place-widget-thirdsrcota .hb-qunar-roomlist .price-discount {
  height: 22px;
  background-color: #90cc77;
  box-sizing: border-box;
  padding: 3px;
  border-radius: 3px;
  float: right;
  color: #ffffff;
}
.place-widget-thirdsrcota .hb-loadding,
.place-widget-thirdsrcota .hb-price-failed {
  height: 70px;
  background-color: #ffffff;
  font: 14px "微软雅黑", "宋体";
  color: #90cc77;
  box-sizing: border-box;
  padding: 20px 40px;
  text-align: center;
}
.place-widget-thirdsrcota .hb-price-failed {
  color: #9d9d9d;
}
.place-widget-thirdsrcota .hb-loadding > span:first-child,
.place-widget-thirdsrcota .hb-price-failed > span:first-child {
  width: 15px;
  height: 15px;
  display: inline-block;
  background: url("/static/place/widget/thirdsrcota/images/hotelbook_state_icon_0e07930.png") no-repeat 0 0;
  background-size: 15px 30px;
}
.place-widget-thirdsrcota .hb-price-failed > span:first-child {
  background-position: 0 -15px;
}
.place-widget-thirdsrcota .xiecheng-sales {
  height: 22px;
  background-color: #90cc77;
  box-sizing: border-box;
  padding: 3px;
  border-radius: 3px;
  color: #ffffff;
  font: 12px "微软雅黑", "宋体";
}
.place-widget-thirdsrcota .xiecheng-tit {
  -webkit-box-flex: 1;
}
.place-widget-thirdsrcota .border-active {
  border: 1px solid #94bcdf;
}
.place-widget-thirdsrcota .bookbtn-item {
  width: 60px;
  height: 30px;
  background: url("/static/place/widget/thirdsrcota/images/hotelbook_btn_new_5042bce.png") no-repeat;
  background-size: 60px;
  display: inline-block;
}
.place-widget-thirdsrcota .bookbtn-up {
  width: 60px;
  height: 30px;
  display: inline-block;
  font: bold 15px "微软雅黑", "宋体";
  color: graytext;
  text-align: center;
  line-height: 30px;
}
.place-widget-thirdsrcota .room-more-icon {
  width: 5px;
  height: 13px;
  background: url("/static/place/widget/thirdsrcota/images/hotelbook_icon_415304a.png") no-repeat 0 -47px;
  display: inline-block;
  margin-left: 10px;
  background-size: 20px 71px;
}
.place-widget-thirdsrcota .price-icon {
  font: 12px "Arial", "微软雅黑", "宋体";
  color: #fe8a01;
}
.place-widget-thirdsrcota .price-num {
  font: 18px bold "Arial", "微软雅黑", "宋体";
  color: #fe8a01;
}
.place-widget-thirdsrcota .arrow-down {
  -webkit-transform: rotate(90deg);
}
.place-widget-thirdsrcota.hidelist .hb-hd {
  border-bottom: none;
}
.place-widget-thirdsrcota.hidelist .hb-hanting-roomlist {
  display: none;
}
{%/style%}<!--携程资源接入模板-->
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