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
                    <input class="guest" type="text" pattern="[0-9]*" name="phone" maxlength="11" value="" placeholder="用于接收确认信息" />
                </div>
                
            </div>
            
        </div>
    </div>
    <div class="pricetotal"><strong>订单金额：&yen;<span id="priceTotal">{%$data.room.single_price%}</span></strong>(到店支付)</div>
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
    <div class="submitbutton" id="submitButton">提交订单</div>
    {%if $data.hotel_info.reg_hint%}<p class="register-info">{%$data.room_info.reg_hint%}</p>{%/if%}
</div>
{%script%}
	var data = {%json_encode($data.room_price)%} || {};
    (require("order.js")).init(data);
{%/script%}