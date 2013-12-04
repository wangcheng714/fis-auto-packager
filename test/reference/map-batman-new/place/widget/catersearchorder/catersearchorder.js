var popup = require('common:widget/popup/popup.js');
var url = require("common:widget/url/url.js");

var DELAY = 1000;
var SMSCODE_DELAY = 60;
var DISABLED = 'disabled';

var SMSCODE_LABEL = '重新获取';
var RESMSCOMDE_LABEL = '秒后重新获取';
var DEFAULT_ERROR_MSG = '网络连接失败';
var TELEPHONE_ERROR_MSG = '请输入正确的手机号码';
var SMSCODE_EMPTY_MSG = '验证码不能为空';

var ORDER_LIST_URL = '/mobile/webapp/place/cater/qt=orderlist{{kehuduan}}?mobile=';

var DATA_TYPE = 'json';
var HOST = '';
// var HOST = 'http://cq01-rdqa-pool211.cq01.baidu.com:8282';

var SMSCODE_AJAX_URL = HOST + '/detail?qt=cater_phonecaptcha';
var CHECKCODE_AJAX_URL = HOST + '/detail?qt=cater_verifycaptcha';

var defError = function(rs) {
    rs = rs || {};
    popup.open(rs.errorMsg || DEFAULT_ERROR_MSG);
};

var checkTel = function(tel) {
    if (!tel || tel.length !== 11 || !tel.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[0-9]\d{8}|18\d{9}/g)) {
        return false;
    }
    return true;
};

var checkVCode = function(vCode) {
    return !!vCode;
};

var CaterSearchOrder = function() {
    this.$el = $('#place-widget-catersearchorder');
    this.$submit = this.$el.find('[data-node="submitBtn"]');
    this.$tel = this.$el.find('[data-node="tel"]');
    this.$vCode = this.$el.find('[data-node="veriCode"]');
    this.$vCodeBtn = this.$el.find('[data-node="veriCodeBtn"]');
    this.init();
};

CaterSearchOrder.prototype = {
    init: function() {
        this.bindEvent();
    },
    bindEvent: function() {
        this.onSearchFormSubmitHandle = $.proxy(this.onSearchFormSubmit, this);
        this.onVCodeBtnClickHandle = $.proxy(this.onVCodeBtnClick, this);
        this.$submit.on('click', this.onSearchFormSubmitHandle);
        this.$vCodeBtn.on('click', this.onVCodeBtnClickHandle);
    },

    changeSCodeBtn: function(aDelay) {
        var that = this;
        this.timer && clearInterval(this.timer);
        var times = isNaN(aDelay) ? SMSCODE_DELAY : aDelay;
        this.$vCodeBtn.addClass(DISABLED);
        var timerFun = function() {
            if (--times) {
                that.$vCodeBtn.html(times + RESMSCOMDE_LABEL);
            } else {
                clearInterval(that.timer);
                that.$vCodeBtn.html(SMSCODE_LABEL);
                that.$vCodeBtn.removeClass(DISABLED);
            }
        };
        this.timer = setInterval(timerFun, DELAY);
    },

    getSMSCode: function(cb) {
        var tel = this.$tel.val();
        if (!checkTel(tel)) {
            return popup.open(TELEPHONE_ERROR_MSG);
        }
        $.ajax({
            url: SMSCODE_AJAX_URL,
            type: 'GET',
            dataType: DATA_TYPE,
            cache: false,
            data: {
                'phone_num': tel
            },
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    return defError(rs);
                }
                typeof cb === 'function' && cb(rs);
            },
            error: defError
        });
    },

    checkForm: function(type) {
        var tel = this.$tel.val();
        var vCode = this.$vCode.val();
        if (!checkTel(tel)) {
            popup.open(TELEPHONE_ERROR_MSG);
            return false;
        }
        if (!checkVCode(vCode)) {
            popup.open(SMSCODE_EMPTY_MSG);
            return false;
        }
        return true;
    },

    onVCodeBtnClick: function(evt) {
        var that = this;
        var disabled = this.$vCodeBtn.hasClass(DISABLED);
        if (disabled) {
            return;
        }
        var success = function(rs) {
            rs = rs || {};
            that.changeSCodeBtn(rs.delay);
        };
        this.getSMSCode(success);
    },

    onSearchFormSubmit: function(evt) {
        evt.preventDefault();
        if (!this.checkForm()) {
            return;
        }
        var vCode = this.$vCode.val();
        var tel = this.$tel.val();
        $.ajax({
            url: CHECKCODE_AJAX_URL,
            type: 'GET',
            data: {
                'captcha': vCode,
                'phone_num': tel
            },
            cache: false,
            dataType: DATA_TYPE,
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    return defError(rs);
                }
                url.navigate(ORDER_LIST_URL + tel, {
                    replace: false
                });
            },
            error: defError
        });
    },
    unbindEvent: function() {
        this.$submit.off('click', this.onSearchFormSubmitHandle);
        this.$vCodeBtn.off('click', this.onVCodeBtnClickHandle);
    },
    destroy: function() {
        this.unbindEvent();
    }
};

exports.init = function(opt) {
    opt = opt || {};
    ORDER_LIST_URL = ORDER_LIST_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    return new CaterSearchOrder();
};