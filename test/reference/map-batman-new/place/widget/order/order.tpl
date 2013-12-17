{%*订单填写 坦然*%}
<div id="hotelOrder" class="hotelorder">
    <div class="info-container">
        <div class="hotelinfo">
            <span class="title">{%$data.hotel_info.hotel_name%}</span>
            <span class="time">{%$data.query.st%}入住，{%$data.query.et%}离店，共{%count($data.room_price)%}天</span>
        </div>
        <div id="roomInfo" class="roominfo">
            <div class="roomtype">
                <span class="left">{%$data.room_info.room_name%}</span>
                <span class="right">
                    <em class="number">1间</em>
                    <select>
                    	                 
                    </select>
                    <span class="select_icon"></span>
                </span>
            </div>
            <div class="guestinfo">
                <div class="guest-item guest-name">
                    <em class="icon guest-icon"></em>
                    <input class="guest" type="text" name="guests" maxlength="20" value="" placeholder="姓名,每间填1人" />
                </div>
                <div id="moreGuest">
                    
                    
                </div>
                <div class="guest-item guest-phone">
                    <em class="icon phone-icon"></em>
                    <input class="guest" type="text" pattern="[0-9]*" name="phone" maxlength="11" value=""
                           placeholder="{%if $data.is_gwj%}用于接收确认短信及返券短信{%else%}用于接收确认信息{%/if%}" />
                </div>
                
            </div>
        </div>
    </div>
    {%if $data.hotel_info.src_need_identity === "1"%}
        <div class="identity">
            <p class="identity-tit">身份信息</p>
            <div class="guest-item identity-name">
                <span class="identity-des">姓名</span>
                <input type="text" name="contact_name" maxlength="10" placeholder="请填写真实姓名" />
            </div>
            <div class="guest-item identity-num">
                <span class="identity-des">身份证</span>
                <input type="text" name="contact_identity" maxlength="18" placeholder="请填写有效身份证号" />
            </div>
        </div>
    {%/if%}
    <div class="pricetotal">
        <p><strong>订单金额：&yen;<span id="priceTotal">{%$data.room.single_price%}</span></strong>(到店支付)</p>
        {%if $data.is_gwj%}
            {%if $kehuduan%}
                <a attr-href="/mobile/webapp/place/guarantee/type=orderact{%if $kehuduan%}/kehuduan=1{%/if%}"
                    class="gwj-kehuduan-bonus"
                    data-log="{code: {%$STAT_CODE.PLACE_HOTEL_GWJ_ORDER_ACTDES_CLICK%}, srcname:'hotel'}">
            {%else%}
                <a href="/mobile/webapp/place/guarantee/type=orderact"
                   class="gwj-bonus"
                   data-log="{code: {%$STAT_CODE.PLACE_HOTEL_GWJ_ORDER_ACTDES_CLICK%}, srcname:'hotel'}">
            {%/if%}
                可返：&yen;30×<span class="gwj-bonusnum" data-datenum="{%count($data.room_price)%}">{%count($data.room_price)%}</span> 团购券 >
        {%/if%}
        </a>
    </div>
    <div class="verifycode">
        <div class="verifyinput"><input type="text" name="code" class="verifycode" placeholder="请填写验证码" value="" /></div>
        <div class="verifycode-img"></div>
    </div>
    <input type="hidden" name="uid" value="{%$data.query.uid%}" />
    <input type="hidden" name="src" value="{%$data.query.src%}" />
    <input type="hidden" name="hotel_id" value="{%$data.hotel_info.hotel_id%}" />
    <input type="hidden" name="room_type" value="{%$data.query.room%}" />
    <input type="hidden" name="checkin_time" value="{%$data.query.st%}" />
    <input type="hidden" name="checkout_time" value="{%$data.query.et%}" />
    <input type="hidden" name="room_num" value="1" />
    <input type="hidden" name="src_need_identity" value="{%$data.hotel_info.src_need_identity%}" />
    <div class="submitbutton" id="submitButton">提交订单</div>
    {%if $data.hotel_info.reg_hint%}<p class="register-info">{%$data.hotel_info.reg_hint%}</p>{%/if%}
</div>
{%script%}
	var data = {%json_encode($data.room_price)%} || {};
    (require("order.js")).init({
        data: data,
        kehuduan: '{%$kehuduan%}'
    });
{%/script%}