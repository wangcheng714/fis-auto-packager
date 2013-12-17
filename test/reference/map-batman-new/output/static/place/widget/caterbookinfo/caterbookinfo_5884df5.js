define('place:widget/caterbookinfo/caterbookinfo.js', function(require, exports, module){

require("place:static/lib/template.js");
var util = require('common:static/js/util.js');
var url = require("common:widget/url/url.js");
var popup = require('common:widget/popup/popup.js');
var datepicker = require('common:widget/datepicker/datepicker.js');
var stat = require('common:widget/stat/stat.js');
var DEFAULT_ERROR_MSG = '网络连接失败';

var USERNAME_EMPTY_MSG = '姓名不能为空';

var TELEPHONE_ERROR_MSG = '请输入正确的手机号码';

var DATA_TYPE = 'json';

var DETAIL_AJAX_URL = '/detail?qt=cater_bookinfo';

var BOOK_AJAX_URL = '/detail?qt=cater_bookconfirm';

var V_CODE_AJAX_URL = '/maps/services/captcha';

var CODE_IMAGE = '/maps/services/captcha/image?vcode=';

var defError = function(rs) {
    rs = rs || {};
    popup.open(rs.errorMsg || DEFAULT_ERROR_MSG);
};

var getRoomLabel = function(needRoom, size) {
    var label = '大厅';
    if (needRoom === '1') {
        size = parseInt(size, 10) || 0;
        label = '包间' + (size ? '（' + size + '人间）' : '');
    }
    return label;
};

var getData = function(ns, context) {
    var nslist = ns.split('.');
    var result = context;
    if (!context) {
        return;
    }
    for (var i = 0; i < nslist.length; i++) {
        result = result[nslist[i]];
        if (!result) {
            break;
        }
    }
    return result;
};
var checkTel = function(tel) {
    if (!tel || tel.length !== 11 || !tel.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[0-9]\d{8}|18\d{9}/g)) {
        return false;
    }
    return true;
};
var CaterBookinfo = function() {
    var urlData = util.urlToJSON(window.location.search.replace('?', ''));
    this.$el = $('#place-widget-caterbookinfo');
    this.template = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="message-info">    ');if(shop_info.discount_status == '1') {_template_fun_array.push('        <div class="message-item" data-action="showTips" data-tips="',typeof(shop_info.discount_info) === 'undefined'?'':baidu.template._encodeHTML(shop_info.discount_info),'">            <span class="discount"></span>            ',typeof(shop_info.discount_info) === 'undefined'?'':baidu.template._encodeHTML(shop_info.discount_info),'        </div>    ');}_template_fun_array.push('    ');if(shop_info.save_status == '1') {_template_fun_array.push('        <div class="message-item" data-action="showTips" data-tips="100%保证下单十分钟内反馈，如有超时，在七日内自动补偿10元话费到订座手机号；">            <span class="save"></span>            100%保证下单十分钟内反馈，如有超时，在七日内自动补偿10元话费到订座手机号；        </div>    ');}_template_fun_array.push('</div><div class="order-group date-info">    <div class="horizontal">        <div class="item vertical">            <div class="label">就餐日期</div>            <div data-action="orderDate" class="select">                <span class="select-label">                    ',typeof(book_info.showDate) === 'undefined'?'':baidu.template._encodeHTML(book_info.showDate),'                </span>            </div>        </div>        ');if (book_info.ableTime && book_info.ableTime.length) {_template_fun_array.push('            <div class="item vertical">                <div class="label">就餐时间</div>                <div class="select">                    <span class="select-label">                        ',typeof(book_info.ableTime[0]) === 'undefined'?'':baidu.template._encodeHTML(book_info.ableTime[0]),'</span>                    <select data-action="orderTime">                        ');for(var i = 0; i < book_info.ableTime.length; i++){_template_fun_array.push('                            <option value="',typeof(book_info.ableTime[i]) === 'undefined'?'':baidu.template._encodeHTML(book_info.ableTime[i]),'">                                ',typeof(book_info.ableTime[i]) === 'undefined'?'':baidu.template._encodeHTML(book_info.ableTime[i]),'                            </option>                        ');}_template_fun_array.push('                    </select>                </div>            </div>        ');}_template_fun_array.push('    </div>    <div class="datepicker-wrap" data-node="datepickerWrap">        <div data-node="datepicker" class="cater-datepicker"></div>    </div></div><div class="room-info">    <div class="order-group">        <div class="item">            <div class="label">                <div>人数：</div>            </div>            <div class="select">                <div data-action="orderPerson" class="main price">                    <div data-action="sub" class="minus"></div>                    <div class="num">                        <input data-action="personNum" name="number" type="number" value="1" min="1" max="50">                    </div>                    <div data-action="add" class="plus"></div>                </div>            </div>        </div>        ');if(book_info.room.have_room == '1') {_template_fun_array.push('            <div class="item">                <div class="label">                    <div>席位要求：</div>                </div>                <div class="select">                    <span class="select-label">大厅</span>                    <select data-action="needRoom">                        <option value="0" selected>大厅</option>                        <option value="1">包间</option>                    </select>                </div>            </div>        ');}_template_fun_array.push('    </div>    ');if(book_info.room.have_room == '1') {_template_fun_array.push('        <div class="arrow" id="arrow" style="">            <div class="arrow_border"></div>            <div class="arrow_content"></div>        </div>        <div class="choose">        ');if (book_info.room.detail && book_info.room.detail.length) {_template_fun_array.push('            <div>                <span class="room_type">选择包间类型</span>                <div class="splitLine"></div>                ');for(var i=0; i < book_info.room.detail.length; i++) {_template_fun_array.push('                    <span data-action="roomItem" class="roomItem ',typeof((i===0?'yes': '')) === 'undefined'?'':baidu.template._encodeHTML((i===0?'yes': '')),'" data-roomsize="10" data-mincost="100">',typeof(book_info.room.detail[i].capacity) === 'undefined'?'':baidu.template._encodeHTML(book_info.room.detail[i].capacity),'人间（最低￥',typeof(book_info.room.detail[i].lowest_consumption) === 'undefined'?'':baidu.template._encodeHTML(book_info.room.detail[i].lowest_consumption),'）</span>                    <div class="splitLine"></div>                ');}_template_fun_array.push('                <span class="room_type">                    <input type="checkbox" data-node="needHall" checked="checked">如果没有包间，也接受大厅</span>            </div>            <span class="no_room" style="display:none">.没有符合所选人数的包间</span>        ');} else {_template_fun_array.push('            <span class="no_room">没有包间数据</span>        ');}_template_fun_array.push('        </div>    ');}_template_fun_array.push('</div><div class="order-group">    <div class="item">        <div class="label">            <div>您贵姓：</div>        </div>        <div class="input">            <input data-node="userName" type="text" placeholder="贵姓"></div>        <div data-node="genderRadio" class="radio" data-value="0">            <div class="radio-item yes" data-action="oradioItem" data-gender="0">先生</div>            <div class="radio-item" data-action="oradioItem" data-gender="1">女士</div>        </div>    </div>    <div class="item">        <div class="label">            <div>手机号：</div>        </div>        <div class="input">            <input data-node="mobile" type="tel" placeholder="请输入您的手机号码">        </div>    </div>    </div><div class="item vcode-item">    <div class="input">        <input data-node="vcode" type="text" placeholder="请填写验证码">    </div>    <div class="vcode-img" data-action="changeVcode">        <img src="" data-node="vcodeImg">        <div class="change">换一张</div>    </div></div><div class="submit">    <div class="btn" data-action="submitOrder">提交订单</div></div>');if(shop_info.agent_text) {_template_fun_array.push('    <div class="service_src">服务由',typeof(shop_info.agent_text) === 'undefined'?'':baidu.template._encodeHTML(shop_info.agent_text),'提供</div>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
    this.success = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div id="resultPage" style="display: block;">    <div class="mess_confirm">        <p>提交成功！</p>        <p class="desc" id="desc">            订单状态为“等待确认”，稍后您将收到            <br>商家确认短信，请注意查收</p>        <div class="splitLine"></div>        <p class="name">',typeof(shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop_name),'</p>        <p>',typeof(room) === 'undefined'?'':baidu.template._encodeHTML(room),'&nbsp;最低消费：',typeof(mincost) === 'undefined'?'':baidu.template._encodeHTML(mincost),'元</p>        <p>入店时间：',typeof(order_time) === 'undefined'?'':baidu.template._encodeHTML(order_time),'</p>        <p class="keepTime">最晚到店时间：',typeof(keep_time) === 'undefined'?'':baidu.template._encodeHTML(keep_time),'</p>    </div>    <div class="goto" data-replace="true" data-action="gotoDetail" data-href="http://map.baidu.com/mobile/webapp/place/cater/force=superman&qt=orderdetail?mobile=',typeof(mobile) === 'undefined'?'':baidu.template._encodeHTML(mobile),'&orderid=',typeof(order_id) === 'undefined'?'':baidu.template._encodeHTML(order_id),'">        查看订单详情    </div>');if(agent_text) {_template_fun_array.push('    <div class="service_src">服务由',typeof(agent_text) === 'undefined'?'':baidu.template._encodeHTML(agent_text),'提供</div>');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
    this.uid = urlData.uid;
    this.thirdId = urlData.thirdId;
    this.searchDate = '';
    this.init();
};
CaterBookinfo.prototype = {
    init: function() {
        this.postData = {};
        this.getBookinfo();
        this.bindEvent();
    },
    fixAbleTime: function(timelist) {
        var rs = [];
        var item;
        for (var i = 0; i < timelist.length; i++) {
            item = timelist[i];
            if (item.bookable) {
                rs.push(item.time);
            }
        }
        return rs;
    },
    checkForm: function () {
        var name = this.$userName.val();
        if (!$.trim(name)) {
            popup.open(USERNAME_EMPTY_MSG);
            return false;
        }
        if (!checkTel(this.$mobile.val())) {
            popup.open(TELEPHONE_ERROR_MSG);
            return false;
        }
        var code = this.$code.val();
        if (!$.trim(code)) {
            popup.open('验证码不能为空');
            return false;
        }
        return true;
    },
    getBookinfo: function(searchDate) {
        $.ajax({
            url: DETAIL_AJAX_URL,
            type: 'GET',
            dataType: DATA_TYPE,
            context: this,
            data: {
                date: searchDate || '',
                thirdId: this.thirdId
            },
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    return defError(rs);
                }
                var data = rs.data;
                this.bookinfo = data.book_info;
                this.searchDate = searchDate || data.today;
                this.bookinfo.showDate = this.searchDate;
                this.bookinfo.ableTime = this.fixAbleTime(
                    getData('time.detail', this.bookinfo) || []);

                this.shopinfo = data.shop_info;
                this.render(data);
                stat.addStat(STAT_CODE.PLACE_CATER_BOOK_INFO_PAGE_PV, {
                    srcname: 'cater',
                    name: this.shopinfo.shop_name,
                    agent: this.shopinfo.agent
                });
            },
            error: defError
        });
        
    },
    getVCode: function () {
        $.ajax({
            url: V_CODE_AJAX_URL,
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function (data) {
                this.vcode = data.content.vcode;
                this.$vcodeImg.attr('src', CODE_IMAGE + this.vcode);
            }
        });
    },
    renderSuccess: function (rs) {
        stat.addStat(STAT_CODE.PLACE_CATER_BOOK_INFO_SUCCESS_PAGE_PV, {
            srcname: 'cater',
            name: this.shopinfo.shop_name,
            agent: this.shopinfo.agent
        });
        var data = rs.data;
        var otime = parseInt(data.order_time || 0, 10) * 1000;
        var ktime = parseInt(data.keep_time || 0, 10);
        data.room = getRoomLabel(data.need_room, data.room_size);
        data.order_time = (new Date(otime)).format('yyyy-MM-dd hh:mm');
        data.keep_time = (new Date(otime + ktime * 60 * 1000)).format('hh:mm');
        data.mincost = data.min_cost || 0;
        data.agent_text = data.agent_text || '';
        this.$el.html(this.success(data));
    },
    render: function(data) {
        var that = this;
        this.$el.html(this.template(data));
        this.$mobile = this.$el.find('[data-node="mobile"]');
        this.$personNum = this.$el.find('[data-action="personNum"]');
        this.$userName = this.$el.find('[data-node="userName"]');
        this.$datepicker = this.$el.find('[data-node="datepicker"]');
        this.$datepickerWrap = this.$el.find('[data-node="datepickerWrap"]');
        this.$code = this.$el.find('[data-node="vcode"]');
        this.$vcodeImg = this.$el.find('[data-node="vcodeImg"]');
        this.$genderRadio = this.$el.find('[data-node="genderRadio"]');
        this.$needHall = this.$el.find('[data-node="needHall"]');
        this.$orderGroup = this.$el.find('.order-group');
        this.getVCode();
        this.$datepicker.datepicker({
            date: this.searchDate,
            dateList: getData('time.date_list', this.bookinfo) || [],
            valuecommit: function (e, date, dateStr) {
                that.$datepickerWrap.hide();
                if (dateStr !== that.searchDate) {
                    that.getBookinfo(dateStr);
                }
            }
        });
        this.needRoom = 0;
        this.orderTime = getData('ableTime.0', this.bookinfo) || '';
    },
    onSubmitOrderClick: function(evt) {
        stat.addCookieStat(STAT_CODE.PLACE_CATER_BOOK_INFO_SUBMIT_CLICK, {
            srcname: 'cater',
            name: this.shopinfo.shop_name,
            agent: this.shopinfo.agent
        });
        if (!this.checkForm()) {
            return;
        }
        var postData = {
            'personNum': this.$personNum.val(),
            'userName': this.$userName.val(),
            'mobile': this.$mobile.val(),
            'shopId': this.shopinfo.shop_id, //餐厅id
            'bid': this.uid || '', //Place的id
            'thirdName': this.shopinfo.agent, //第三方名称
            'needRoom': this.needRoom, //是否需要包房
            'orderTime': this.searchDate + ' ' + this.orderTime, //就餐时间
            'code': this.$code.val(), //验证码
            'vcode': this.vcode, //验证码
            'from': 'webapp', //订单来源
            'gender': this.$genderRadio.data('value'), //是否是男性
            'acceptHall': this.$needHall[0] ? (this.$needHall[0].checked ? 1 : 0) : 1, //是否接受大厅
            'roomSize': this.$orderGroup.data('roomsize') || '' //包房大小
        };
        $.ajax({
            url: BOOK_AJAX_URL,
            type: 'POST',
            dataType: DATA_TYPE,
            context: this,
            data: postData,
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    return defError(rs);
                }
                this.renderSuccess(rs);
            },
            error: defError
        });
    },
    onOrderDateClick: function(evt) {
        var action = this.$datepickerWrap.css('display') === 'none' ? 'show' : 'hide';
        this.$datepickerWrap[action]();
    },
    onOrderPersonClick: function(evt) {
        var $target = $(evt.target);
        var action = $target.data('action');
        var pNum = parseInt(this.$personNum.val(), 10);
        pNum = isNaN(pNum) ? 1 : pNum;
        if (action === 'add') {
            pNum = Math.min(getData('person.max', this.bookinfo),
                pNum + 1);
            this.$personNum.val(pNum);
        } else if (action === 'sub') {
            pNum = Math.max(getData('person.min', this.bookinfo),
                pNum - 1);
            this.$personNum.val(pNum);
        }
    },
    onOradioItemClick: function(evt) {
        var $target = $(evt.currentTarget);
        var gender = $target.data('gender');
        var $rGroup = $target.parents('.radio');
        var $siblings = $target.siblings('.radio-item');
        $target.addClass('yes');
        $rGroup.data('value', gender);
        $siblings.removeClass('yes');
    },
    onRoomItemClick: function(evt) {
        var $target = $(evt.currentTarget);
        var roomsize = $target.data('roomsize');
        var mincost = $target.data('mincost');
        var $orderGroup = $target.parents('.order-group');
        var $siblings = $target.siblings('.roomItem');
        $target.addClass('yes');
        $orderGroup.data('roomsize', roomsize);
        $orderGroup.data('mincost', mincost);
        $siblings.removeClass('yes');
    },
    onShowTipsClick: function(evt) {
        var $target = $(evt.currentTarget);
        var tips = $target.data('tips');
        if (!tips) {
            return;
        }
        popup.open(tips);
    },
    onPersonNumBlur: function (evt) {
        var target = evt.currentTarget;
        var max = getData('person.max', this.bookinfo);
        var val = target.value;
        val = parseInt(val, 10) || max;
        target.value = Math.min(Math.max(1, val), max);
    },
    onNeedRoomChange: function(evt){
        var $target = $(evt.currentTarget);
        var $label = $target.siblings('.select-label');
        var $roomInfo = $target.parents('.room-info');
        var val = $target.val();
        $label.html( val === '1' ? '包间' : '大厅');
        $roomInfo[val === '1' ? 'addClass' : 'removeClass']('has-room');
        this.needRoom = val;
    },
    onOrderTimeChange: function(evt){
        var $target = $(evt.currentTarget);
        var $label = $target.siblings('.select-label');
        var val = $target.val();
        $label.html(val);
        this.orderTime = val;
    },
    onChangeVcodeClick: function (evt) {
        evt.preventDefault();
        this.getVCode();
    },
    onGotoDetailClick: function (evt) {
        evt.stopPropagation();
        stat.addCookieStat(STAT_CODE.PLACE_CATER_BOOK_INFO_GOTO_ORDER_DETAIL_CLICK, {
            srcname: 'cater',
            name: this.shopinfo.shop_name,
            agent: this.shopinfo.agent
        });
        var $target = $(evt.currentTarget);
        var href = $target.data('href');
        url.navigate(href);
    },
    bindEvent: function() {
        this.$el.on('blur', '[data-action="personNum"]', $.proxy(this.onPersonNumBlur, this));
        this.$el.on('change', '[data-action="needRoom"]', $.proxy(this.onNeedRoomChange, this));
        this.$el.on('change', '[data-action="orderTime"]', $.proxy(this.onOrderTimeChange, this));
        this.$el.on('click', '[data-action="orderPerson"]', $.proxy(this.onOrderPersonClick, this));
        this.$el.on('click', '[data-action="oradioItem"]', $.proxy(this.onOradioItemClick, this));
        this.$el.on('click', '[data-action="showTips"]', $.proxy(this.onShowTipsClick, this));
        this.$el.on('click', '[data-action="roomItem"]', $.proxy(this.onRoomItemClick, this));
        this.$el.on('click', '[data-action="orderDate"]', $.proxy(this.onOrderDateClick, this));
        this.$el.on('click', '[data-action="submitOrder"]', $.proxy(this.onSubmitOrderClick, this));
        this.$el.on('click', '[data-action="changeVcode"]', $.proxy(this.onChangeVcodeClick, this));
        this.$el.on('click', '[data-action="gotoDetail"]', $.proxy(this.onGotoDetailClick, this));
    }
};

exports.init = function() {
    return new CaterBookinfo();
};

});