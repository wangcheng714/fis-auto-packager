'use strict';
/**
  * 填写订单的处理
  * author zhangcan@baidu.com
  * date 2013-10-23
**/
var popup = require('common:widget/popup/popup.js'),
    Vcode = require('place:static/js/vcode.js'),
    util = require('common:static/js/util.js'),
    wrapper = $('#hotelOrder'),
    totalPrice = $('#priceTotal');

module.exports = {
    ERRORMSG : {
        PHONEEMPTY : '请填写手机号码',
        PHONEERROR :'您输入的手机号码有误，请重新输入',
        NAMEERROR : '请输入正确姓名确保顺利入住',
        TIMEERROR : '抱歉！预定日期范围错误，请点击屏幕重新选择！',
        PRICEERROR : '抱歉！您预订的酒店价格发生变化，请点击屏幕确认重新确认。',
        FORMORDER : '抱歉！填写内容有误，请点击屏幕返回检查填写内容！',
        VALIDATEERROR : '验证码填写错误，请点击屏幕重新填写！',
        ROOMERROR : '抱歉！您预订的房间数超过剩余房量，请点击屏幕确认重新选择。',
        DEFAULT : '抱歉！发生未知错误，请点击屏幕返回重试！'
    },
    init : function (data){
        var self = this;
        if(data){
            self.renderRoom(data); 
        }
        self.bind();
        self.vcode = new Vcode({
            el: $('.verifycode-img')
        });
        this.room_info = data;
    },

    bind : function () {
        var self = this;
        wrapper.find('select').on('change', function(e) {
            self.changeSelect(e);
        });
        $('#submitButton').on('click',$.proxy(self.submitData, self));
        
    },
    /**
      * 处理room和totalprice数据，用于渲染页面
      * 本来想用前端模板，但是觉得保持一种模板会比较clean
      * 扩展性略差，待优化，用前端模板更灵活
    **/
    maxRoom : function(data){
        if(!data) return;
        var realRoomLeft = 3;
         $.each(data, function (item) {
            if(data[item].room_left < realRoomLeft)
                realRoomLeft = data[item].room_left;
         });
         return realRoomLeft;

    },
    roomPrice : function(data){
        if(!data) return;
        var price,
            singlePrice = 0;
        $.each(data, function (item) {
            price = parseInt(data[item].price,10),
            singlePrice+=price;
        });
        return singlePrice;
    },
    renderRoom : function(data){
        var self = this,
            maxroom = self.maxRoom(data),
            roomprice  = self.roomPrice(data);
        for(var i=1; i<=maxroom;i++){
            var temp = [];
            temp.push('<option value="'+i+'">'+i+'间</option>');
            wrapper.find('select').append(temp.join(''));
        }
        totalPrice.attr('single',roomprice).html(roomprice);
    },
    /**
     * 房间数量选择
     * em为实际展示给用户的房间数量，计算总价格
     */
    changeSelect : function(e){
        var target = e.target,
            $select = $(target),
            selectedOption = $($select[0][$select[0].selectedIndex]),
            value = selectedOption.val(),
            singlePrice = totalPrice.attr('single');

            $(target).parent().children("em").html(selectedOption.text());
            totalPrice.html(singlePrice * value);
            wrapper.find('input[name=room_num]').val(value);
          //  selectedOption.attr("selected" ,"selected");
            this.guestItemOperator(value);
    },
    /**
     * 房间数量选择处理
     */
    guestItemOperator : function(roomnumber){
        var guestItem = $('#moreGuest input'),
            length = guestItem.length;
        if(roomnumber > length){
            for(var i=1; i<roomnumber-length;i++){
                var temp = [];
                temp.push('<div class="guest-item guest-name"><em class="icon guest-icon"></em><input type="text" maxlength="20" class="guest" index='+(length+i)+' name="guests" value="" placeholder="姓名,每间填1人" /></div>');
                $('#moreGuest').append(temp.join(''));
            }
        }else{
            $.each(guestItem, function (index,item) {
                var value = $(this).attr('index');
                if(value > roomnumber-1){
                    $(this).parent().remove();                
                }           
            }); 
        }
    },
    /**
     * 预订日期范围内价格处理
     * @param  {Object} data ：room_info信息
     */
    getPrices:function(data){
        var prices = [];
        if(!data) return;
        $.each(data, function (item) {
            prices.push({
                price: this.price,
                date: this.date
            });
        });
        return JSON.stringify(prices);
    },
    /**
     * 用户输入数据处理，将name和phone进行格式整理
     */
    getAllData : function(price){
        var self = this,
            data = {},
            temp = [];

        wrapper.find('input').each(function() {
            //if($(this).prop("name") != 'guests')
                data[$(this).prop('name')] = $(this).val();
        });
        
        data.prices = totalPrice.attr('room_price')?totalPrice.attr('room_price'): self.getPrices(price);
        $.each($('input[name="guests"]'), function (item) {
            temp.push(encodeURI($(this).val()));                
        });
        data.guests = temp.join(',');
        return data;
    },
    /**
     * 预订日期范围内价格处理
     * @param  {Object} data ：提交的所有用户信息，包括name和phone
     */
    validateData :function(data){
        var phone = data.phone,
            guestsArray = data.guests.split(','),
            verifycode =data.code,
            reg = /^[\u4E00-\u9FA5]+$/, //全都是汉字
            reg1 = /^[A-Za-z]+$/,//全都是英文
            flag = true;
        $.each(guestsArray, function (item) {
            var item = decodeURI(this);
            if(!(reg.test(item) || reg1.test(item))){
                flag = false;
            }
            return flag;
        });
        if(phone===''){
            popup.open({
                'text': this.ERRORMSG.PHONEEMPTY,
                'autoCloseTime': 1500
            });
        }else if(phone.search(/^((1(5[0-9]|8[0-9]|3[0-9]|47))+\d{8})$/)==-1){
            popup.open({
                'text': this.ERRORMSG.PHONEERROR,
                'autoCloseTime': 1500
            });
        }else if(!flag){
            popup.open({
                'text': this.ERRORMSG.NAMEERROR,
                'autoCloseTime': 1500
            });
        }else if(verifycode ==="" || verifycode.length!=4){
            popup.open({
                'text': this.ERRORMSG.VALIDATEERROR,
                'autoCloseTime': 1500
            });
        }else{
            return true;
        }
    },
    /**
     * 提交函数
     */
    submitData : function(){
        var self = this,
            inputData = self.getAllData(this.room_info);
         if(self.validateData(inputData)) 
            self.handleOrderSubmit(inputData);
             
    },
    addLayer : function(){
        if($("#bmap_pop_cover").length == 0) {
            var cl= document.createElement("div");
              cl.id = "bmap_pop_cover";
              $.extend(cl.style, {
                background : "rgba(0, 0, 0, 0.2)",
                height    : "100%",
                width     : "100%",
                top        : "0px",
                left        :  "0px",
                zIndex    : "80000",
                position : "absolute",
                overflow : "hidden",
                display   : "block"
              });
              $("#wrapper").append(cl);
        }else{
            $('#bmap_pop_cover').css('display', 'block');
        }

    },
    /**
     * 预订提交处理
     * @param  {object} orderdata：传入当前预订信息，包括房间数量，价格，姓名，手机等
     */
    handleOrderSubmit :function(orderdata){  
        // popup.open({'text': '正在处理，请稍候...'});
         
        var self  = this,
            hotel_price = totalPrice.attr('single'),
            params = util.urlToJSON(window.location.search.split('?')[1]),
            from = params.kehuduan? 'webview' : 'maponline',
            url = '/detail?qt=order&from='+from;
        $.ajax({
            type: 'POST',
            url: url,
            //url:"/order",
            dataType: 'json',
            data: orderdata,
            success: function(result){
                // $('.common-widget-popup').hide();              
                switch(result.errorNo) {
                    case 0:
                        window.location.href = '/mobile/webapp/place/order/qt=thirdsrc_order_success&order_id='+result.order_id;
                        break;
                    case 10004:
                        self.addLayer();
                        popup.open({'text': self.ERRORMSG.TIMEERROR,'autoCloseTime':false,'isTouchHide':true});
                        break;
                    case 10006:
                    case 10007:
                    case 10008:
                        self.addLayer();
                        popup.open({'text': self.ERRORMSG.FORMORDER,'autoCloseTime':false,'isTouchHide':true});
                        break;
                    case 10010:
                        self.addLayer();
                        popup.open({'text': self.ERRORMSG.VALIDATEERROR,'autoCloseTime':false,'isTouchHide':true});
                        //self.touchHide();
                        break;
                    case 30002:
                        self.addLayer();
                        popup.open({'text': self.ERRORMSG.ROOMERROR,'autoCloseTime':false,'isTouchHide':true});
                        /*房间不足的时候,在ajax返回后,对dom进行操作*/
                         self.HandelRoomChange(hotel_price,result.room_num);
                        break;
                    case 30005:
                        self.addLayer();
                        popup.open({'text': self.ERRORMSG.PRICEERROR,'autoCloseTime':false,'isTouchHide':true});
                        self.HandelPriceChange(result.prices);
                        break;

                    default:

                        var errNo = (result.errorNo).toString().substr(0,1),
                            errMsg = result.errorMsg;
                        switch(errNo){
                            case '1':
                            case '3':
                            case '4':  
                                self.addLayer();
                                popup.open({'text': self.ERRORMSG.DEFAULT,'autoCloseTime':false,'isTouchHide':true});
                                break;
                            case '2':
                            case '5':
                            default:
                            //跳转错误页面
                                window.location.href = '/mobile/webapp/place/order/qt=hotel_error&msg='+errMsg;
                                break;                                
                        }
                        break;
                }
                self.vcode.refreshVcode(); 
            },
            error : function(xhr, type){
                $('.common-widget-popup').hide(); 
                self.addLayer();
                popup.open({'text': self.ERRORMSG.DEFAULT,'autoCloseTime':false,'isTouchHide':true});
                self.vcode.refreshVcode();
            }
        });
    
    },
    /**
     * 房间数量不足处理
     * @param  {Number} price：传入当前预订范围的房型单价总和作为计算单价
     * @param  {Number} number ： 剩余的真实房间数量，异步接口取回
     */
    HandelRoomChange : function(price,number){
        var value,
            $title = wrapper.find('.number');
            $title.html(number+'间');
        wrapper.find('input[name=room_num]').val(number);
        var $options = $('select option');
        $.each($options, function (item) {
            value = $(this).val();
            if(value > number){
                $(this).remove();                
            }           
        });
        $($options[number-1]).attr('selected' ,'selected');
        var $nameInputs = $('#moreGuest input');
        $.each($nameInputs, function (index,item) {
            value = $(this).attr('index');
            if(value > number-1){
                $(this).parent().remove();                
            }           
        });
        totalPrice.html(price*number);
    },
    /**
     * 房间价格变化处理
     * @param  {obj} price：传入变更后的预订范围报价信息
     */
    HandelPriceChange : function(price){
        var room_price = this.getPrices(price),
            single_price = this.roomPrice(price),
            roomNumber = wrapper.find('input[name=room_num]').val();
        totalPrice.html(single_price*roomNumber);
        totalPrice.attr('single',single_price);
        totalPrice.attr('room_price',room_price);
    },


}

