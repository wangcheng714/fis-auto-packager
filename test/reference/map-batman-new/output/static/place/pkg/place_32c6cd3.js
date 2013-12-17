/**
 * @file place模块广播名称枚举
 */
/**
 * @module place:static/js/broadcastname.js
 */
define('place:static/js/broadcastname.js', function (require, exports, module) {
    module.exports = {
        DATEPICKER_DATE_CHANGE: 'datepickerdatechange',
        HOTELBOOK_OR_THIRDSRCOTA_SHOW: 'hotelbookorthirdsrcotashow'
    };
});
;define('place:widget/hotelthirdsrc/hotelthirdsrc.js', function(require, exports, module){

var util = require('common:static/js/util.js'),
    url = require("common:widget/url/url.js"),
    stat = require('common:widget/stat/stat.js'),
    action = _APP_HASH.action,
    uid,
    st, et;

function fetchThirdsrc (data) {
    var param;

    if (!data.uid) {
        return;
    }

    param = {
        st: data.st,
        et: data.et,
        uid: data.uid
    }

    st = data.st;
    et = data.et;
    uid = data.uid;

    $('#place-pagelet-hotelthirdsrc').html(
        '<div class="hotel-loading">' +
            '<span></span>' +
            '<span>正在获取实时精准报价数据...</span>' +
        '</div>'
    );

    BigPipe.asyncLoad({id: 'place-pagelet-hotelthirdsrc'}, util.jsonToUrl(param) + '&pageletGroup=third');
}
// 绑定日历value改变事件，只能绑一次，故在闭包中绑
listener.on('place.datepicker','datechange', function(e, data) {
    fetchThirdsrc(data);
});

module.exports = {
    init: function(options) {
        this.firstShowNum = 4;
        this.options = options || {};
        this.is_gwj = $('.head-act').length
        this.$el = $('#place-pagelet-hotelthirdsrc');

        // 第三方连锁酒店预订区展现量
        stat.addStat(STAT_CODE.PLACE_HOTEL_BOOKABLE_DETAIL_VIEW, {'type': options.hotelType, 'from_page': action});

        this.bind();
    },
    fetchThirdsrc: fetchThirdsrc,
    bind: function() {
        // 派生日历显示事件，当预订区渲染完成时初始化日历
        listener.trigger('place.datepicker','showcalendar');

        this.$el.find('.room-more').on('click', $.proxy(this._showAllRooms, this));
        this.$el.find('.hotel-head').on('click', $.proxy(this._hideAllRooms, this));
        this.$el.find('.bookbtn-normal').on('click', $.proxy(this._addParams, this));
    },
    _showAllRooms: function() {
        var $icon = this.$el.find('.room-more-icon');
        this.$el.find('.room-item').slice(this.firstShowNum).toggle();
        $icon.toggleClass('arrow-down');
        this.$el.find('.room-more-text').html($icon.hasClass('arrow-down') ? '收起全部房型' : '展开全部房型');
    },
    _hideAllRooms: function() {
        $('.hotel-roomlist-thirdsrc').toggle();
    },
    _addParams: function(e) {
        var $target = $(e.target),
            today = new Date().format('yyyy-MM-dd'),
            tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
            options = this.options,
            href = $target.data('url'),
            href = href + (this.is_gwj ? '&is_gwj=1' : ''),
            price = parseInt($target.data('price'), 10),
            bonus = parseInt($target.data('bonus'), 10) || 0,
            extraParams,
            pagestate = options.kehuduan ? '/kehuduan=1' : ''

        extraParams = {
            from_page: action,
            checkin_date: (st || today),
            checkout_date: (et || tomorrow),
            price: price,
            book_price: price - bonus,
            simple: 1,
            type: options.hotelType,
            uid: uid || '',
            kehuduan: options.kehuduan || 0
        };

        // 第三方连锁酒店预订点击量统计
        stat.addCookieStat(STAT_CODE.PLACE_HOTEL_THIRDSRC_BOOK_CLICK, extraParams);

        url.navigate('/mobile/webapp/place/order/'+ href + pagestate);
    }
}

});
;define('place:widget/hotelthirdota/hotelthirdota.js', function(require, exports, module){

/**
 * @file hotelbook-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
'use strict';

var util = require('common:static/js/util.js'),
    geolocation = require('common:widget/geolocation/location.js'),
    popup = require('common:widget/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    timer;

function fetchThirdota (data) {
    var param;

    if (!data.uid) {
        return;
    }

    param = {
        st: data.st,
        et: data.et,
        uid: data.uid
    }

    timer = param;
    $('#place-pagelet-hotelthirdota').html(
        '<div class="hotel-loading">' +
            '<span></span>' +
            '<span>正在获取实时精准报价数据...</span>' +
            '</div>'
    );

    BigPipe.asyncLoad({id: 'place-pagelet-hotelthirdota'}, util.jsonToUrl(param) + '&pageletGroup=third');
}
// 绑定日历value改变事件，只能绑一次，故在闭包中绑
listener.on('place.datepicker','datechange', function(e, data) {
    fetchThirdota(data);
});

/**
 * @module place/widget/hotelbook
 */
module.exports = {
    create: function () {
        var $el = this.$el = $('#place-pagelet-hotelthirdota');
        this.serverAddr = 'http://' + location.host + '/mobile/webapp/place/hotelbook/async=1&qt=';

        this.$showAllRoom = $el.find('.show-all-room');  //查看其他房型层
        this.$showAllOta = $el.find('.show-all-ota');    //展开其他报价层
        this.$hbMain = $el.find('.main'); //房型层父元素
        this.$roomsWp = $el.find('.rooms'); //房型层
        this.$rooms = $el.find('.room-list > .room-item'); //全部房型
        this.$roomsHide = $el.find('.room-list > .room-item').slice(3); //默认收起的房型元素集合
        this.$otasHide = $el.find('.ota-list > li').slice(3);  //默认收起的ota报价元素集合
        this.$otaResult = $el.find('.ota-result');  //ota结果根元素
        this.$fetchFailed = $el.find('.ota-failed'); //获取ota数据失败的页面
        this.$otaItem = $el.find('.ota-item');  //预订按钮
        this.uid = $('#uid').html(); //酒店的uid
        this.isShowAllRoom = false; //是否展示了全部房型
        this.isShowAllOta = false;  //是否展示了全部的ota报价
        //this.$targetRoom;  //当前点击的房型元素
        this.lastIndex = '0'; //上次点击的房型的索引
        this.currentIndex = '0';  //当前点击的房型的索引
        //this.sd;
        //this.ed; // 开始与结束时间
        listener.trigger('place.datepicker','showcalendar');
        this.addStatParam( this.$otaResult, '.ota-normal' );
    },

    fetchThirdota: fetchThirdota,

    /**
     * 绑定事件
     */
    bindEvents: function () {
        this.bindRoomListEvents();

    },

    /**
     * 绑定房型部分的事件
     */
    bindRoomListEvents: function () {
        this.$showAllRoom.on('click', $.proxy(this.showAllRoom, this));
        this.$showAllOta.on('click', $.proxy(this.showAllOta, this));
        this.$rooms.on('click', $.proxy(this.fetchOtas, this));
        this.$otaItem.on('click', $.proxy(this.goToBook, this));

    },

    /**
     * 解绑事件
     */
    unbindEvents: function () {
        this.unbindRoomListEvents();

    },

    /**
     * 解绑房型部分的事件
     */
    unbindRoomListEvents: function () {
        this.$showAllRoom.off('click', $.proxy(this.showAllRoom, this));
        this.$showAllOta.off('click', $.proxy(this.showAllOta, this));
        this.$rooms.off('click', $.proxy(this.fetchOtas, this));
        this.$otaItem.off('click', $.proxy(this.goToBook, this));
    },

    /**
     * 显示所有房型
     * @param {event} [e] 事件对象
     */
    showAllRoom: function (e) {
        var $showAllBtn = this.$showAllRoom;

        // 已经展开所有房型
        if ($showAllBtn.hasClass('show-all-room-open')) {
            $showAllBtn.find('span').eq(0).html('查看其他房型');
            this.$roomsHide.hide();
            this.$roomsHide.find('.arrow-icon').removeClass('arrow-icon-open');
            this.$roomsHide.next('.ota-result').hide();
        } else {   // 已经收起所有房型
            $showAllBtn.find('span').eq(0).html('收起其他房型');
            this.$roomsHide.show();
        }

        // 更多房型点击量统计
        stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_MOREROOM_CLICK, {'uid': this.uid, 'type': 'thirdota', 'from_page': _APP_HASH.action});
        this.$showAllRoom.toggleClass('show-all-room-open');

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 显示当前房型所有的ota报价
     * @param {event} [e] 事件对象
     */
    showAllOta: function (e) {
        var $target = $(e.target).closest('.show-all-ota');

        // 已经处于展开状态
        if ($target.hasClass('show-all-ota-open')) {
            $target.find('span').eq(0).html('展开其他报价');
        } else {   // 已经处于收起状态
            $target.find('span').eq(0).html('收起其他报价');
        }

        $target.closest('.ota-result').find('.ota-item').slice(3).toggleClass('hide');
        $target.toggleClass('show-all-ota-open');

        // 更多ota报价统计
        stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_MOREPRICE_CLICK, {'uid': this.uid, 'type': 'thirdota', 'from_page': _APP_HASH.action});

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 获取点击房型的ota报价信息
     * @param {event} [e] 事件对象
     */
    fetchOtas: function (e) {
        var $el = this.$el,
            action = _APP_HASH.action,
            roomtype = $(e.target).closest('.room-item').find('span').eq(1).text(),
            otaPriceUrl,
            $roomnext,
            $otaresult,
            $arrow,
            settings = {},
            fetching;

        //详情页or预订报价区所有房型点击量PV/UV
        stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_ROOM_CLICK, {'uid': this.uid, 'room_type': roomtype, 'from_page': action});

        this.$targetRoom = $(e.target).closest('.room-item');
        this.currentIndex = this.$targetRoom.attr('index');
        $roomnext= this.$targetRoom.next();
        $otaresult = ($roomnext.hasClass('ota-result') && $roomnext) ||
            ($roomnext.children('.ota-result').length && $roomnext.children('.ota-result') );

        $arrow = this.$targetRoom.find('span').eq(0);

        //$arrow.toggleClass('arrow-icon-open');

        if ($otaresult && $otaresult.length){
            $otaresult.toggle();
            $arrow.toggleClass('arrow-icon-open');
        }else if (!this.isloading){
            $arrow.toggleClass('arrow-icon-open');
            //添加ota-fetching页面
            fetching = '<div class="ota-fetching">'
                + '<span></span>'
                + '<span>正在获取实时精准报价数据...</span>'
                + '</div>';
            this.$targetRoom.after(fetching);
            this.isloading = true;

            otaPriceUrl = this.$targetRoom.attr('ota_price_url');
            settings = {
                'type': 'POST',
                'url': this.serverAddr + 'fetchotas',
                'data': {
                    'uid': this.uid,
                    'otaPriceUrl': otaPriceUrl
                },
                'dataType': 'html'
            };
            this.fetchData(settings, $.proxy(this.doFetchOtaSuccess, this), $.proxy(this.doFetchOtaError, this));
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 通过发送ajax请求获取数据
     * @param {object} [settings] ajax参数
     * @param {function} dosuccess 请求成功后的回调函数
     * @param {function} doerror 请求失败后的回调函数
     */
    fetchData: function (settings, dosuccess, doerror) {
        $.ajax({
            type: settings.type,
            url: settings.url,
            data: settings.data,
            dataType: settings.dataType,
            success: function (data) {
                dosuccess(data);
            },
            error: function (xhr, type) {
                doerror(xhr, type);
            }
        });
    },

    /**
     * 请求ota报价数据成功后的处理函数
     * @param {string} data 请求成功后返回的html页面
     */
    doFetchOtaSuccess: function (data) {
        this.$targetRoom.next().remove(); //移除ota-fetching页面

        this.$showAllOta.off('click', $.proxy(this.showAllOta, this)); //异步加载后解绑“展开其他报价”事件

        this.$targetRoom.after(data);
        //切换箭头样式为朝下

        this.$showAllOta = this.$el.find('.show-all-ota'); //异步加载后重新获取“展开其他报价”元素
        this.$otasHide = this.$el.find('.ota-list > li').slice(3); //异步加载后重新获取默认隐藏的ota报价
        this.$otaItem = this.$el.find('.ota-bookbtn');  //异步加载后重新获取预订按钮元素
        this.addStatParam( this.$targetRoom.next(), '.ota-bookbtn' );

        this.bindEvents();
        this.isloading = false;
    },

    /**
     * 请求ota报价数据失败后的处理函数
     * @param {object} xhr XMLHttpresponse对象
     * @param {string} type 描述错误类型
     */
    doFetchOtaError: function (xhr, type) {
        this.bindEvents();
        this.isloading = false;
    },


    /**
     * 请求房型数据成功后的处理函数
     * @param {string} data 请求成功后返回的html页面
     */
    doFetchRoomSuccess: function (data) {
        var $el = this.$el;
        this.unbindRoomListEvents();//解除当前元素的事件绑定
        this.$hbMain.append(data); //追加请求回来的房型信息层
        //异步加载后重新获取元素
        this.$showAllRoom = $el.find('.show-all-room');  //查看其他房型层
        this.$showAllOta = $el.find('.show-all-ota');    //展开其他报价层
        this.$rooms = $el.find('.room-list > .room-item'); //全部房型
        this.$roomsHide = $el.find('.room-list > .room-item').slice(3); //默认收起的房型元素集合
        this.$otasHide = $el.find('.ota-list > li').slice(3);  //默认收起的ota报价元素集合
        this.$roomsWp = $el.find('.rooms'); //房型层

        this.$otaItem = $el.find('.ota-item');  //异步加载后重新获取预订按钮元素
        this.bindEvents(); //绑定当前元素的事件

        //重置标志
        this.isShowAllRoom = false;
        this.isShowOta = true;
        this.isShowAllOta = false;

    },

    /**
     * 请求房型数据失败后的处理函数
     */
    doFetchRoomError: function () {
        this.bindEvents();
    },

    /**
     * 跳转到第三方的预订页面
     * @param {event} e 事件对象
     */
    goToBook: function (e) {
        var $target = $(e.currentTarget),
            action = _APP_HASH.action,
            roomtype = $target.find('.ota-type').text(),
            otaname = $target.find('.ota-name').text();

        if ($target.hasClass('ota-web')) {
            //详情页所有电脑预订方式的点击总量
            stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_BOOKBTN_PC_CLICK, {'uid': this.uid, 'type': roomtype, 'ota': otaname, 'from_page': action});

            popup.open({
                'text': '您好，此酒店报价需要在电脑端登陆：map.baidu.com，在酒店版块中进行搜索预订',
                'autoCloseTime': 3000
            });
        } else if ($target.hasClass('ota-tel')) {
            //详情页所有电话预订方式的点击总量
            stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_BOOKBTN_TEL_CLICK, {'uid': this.uid, 'type': roomtype, 'ota': otaname, 'from_page': action});
        }
    },
    addStatParam : function( $parent, selector ){
        var param = {
                from_page: _APP_HASH.action,
                checkin_date: timer.st,
                checkout_date: timer.et,
                c: geolocation.getCityCode(),
                simple: 1
            },
            $item;
        if($parent && $parent.length){
            $parent.find( selector ).each(function() {
                $item = $(this);
                this.href && (this.href = this.href + '&' + util.jsonToUrl( param ));
            });
        }
    },

    init: function () {
        var action = _APP_HASH.action;

        this.create();

        //酒店有预订功能的详情页or预订报价页展示PV/UV
        stat.addStat(STAT_CODE.PLACE_HOTEL_BOOKABLE_DETAIL_VIEW, {'uid': this.uid, 'type': 'thirdota', 'from_page': action});
        this.bindEvents();
    }
};

});
;define('place:static/js/hotel.js', function(require, exports, module) {
    var stat = require('common:widget/stat/stat.js');

    module.exports = {
        init: function( options ) {
            var me = this;

            me.$navs = $( '.hotelext-nav li' );
            me.$conts = $( '.hotelext-cont > div' );
            me.sendHotelbookAsync( options );
            me.sendExtAsync( options );
            me.lastTabIndex = -1;
            me.switchTab( 0 );
            me.bind();
        },

        bind: function() {
            this.$navs.on( 'click', $.proxy( this._clickTab, this ) );
        },

        sendHotelbookAsync: function( options ) {
            var today = (new Date()).format('yyyy-MM-dd'),
                tomorrow = (new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)).format('yyyy-MM-dd');

            (require('place:widget/hotelthirdsrc/hotelthirdsrc.js')).fetchThirdsrc({
                st: today,
                et: tomorrow,
                uid: options.uid
            });

            (require('place:widget/hotelthirdota/hotelthirdota.js')).fetchThirdota({
                st: today,
                et: tomorrow,
                uid: options.uid
            });
        },

        sendExtAsync: function(options) {
            BigPipe.asyncLoad([{
                id: 'place-pagelet-hotelextimg'},{
                id: 'place-pagelet-hotelextphone'},{
                id: 'place-pagelet-hotelextcomment'},{
                id: 'place-pagelet-hotelextshop'},{
                id: 'place-pagelet-hotelexttuan'},{
                id: 'place-pagelet-hotelextpre'},{
                id: 'place-pagelet-hotelsitelink'}
            ], 'uid=' + options.uid + '&pageletGroup=ext');
        },

        _clickTab: function( e ) {
            var $target = $(e.currentTarget),
                curIndex;

            if ( ~(curIndex = this.$navs.index( $target)) ) {
                this.switchTab( curIndex );
                stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_TAB_CLICK, {type: curIndex});
            }
        },

        switchTab: function( index ) {
            var $navs = this.$navs,
                $conts = this.$conts,
                lastIndex = this.lastTabIndex;

            if ( ~lastIndex ) {
                $navs.eq( lastIndex).removeClass( 'active' );
                $conts.eq( lastIndex ).removeClass( 'active' );
            }

            $navs.eq( index ).addClass( 'active' );
            $conts.eq( index ).addClass( 'active' );

            this.lastTabIndex = index;
        }
    }
});
;
/*
 根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
 地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
 出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
 顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
 校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

 出生日期计算方法。
 15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
 2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
 下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
 公式(1)中：
 i----表示号码字符从由至左包括校验码在内的位置序号；
 ai----表示第i位置上的号码字符值；
 Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
 i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
 Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
 */
/**
 * des: 身份证验证
 * author: zmm
 */
define('place:static/js/identityValidate.js', function (require, exports, module) {
    var config = {
        city: {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        },
        pattern: /^\d{15}$/
    }

    // 地区信息校验
    function _areaCheck(identity) {
        return !!config.city[parseInt(identity.substr(0, 2))]
    }

    // 出生年月信息检验
    function _birthCheck(identity) {

        // 15位校验规则 6位地址编码+6位出生日期+3位顺序号
        if (identity.length == 15) {
            if (config.pattern.exec(identity) == null) {
                return false;
            }

            var birth = parseInt("19" + identity.substr(6, 2)),
                month = identity.substr(8, 2),
                day = parseInt(identity.substr(10, 2)),
                nowYear = (new Date()).getYear();

            switch (month) {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    if (day > 31) {
                        return false;
                    }
                    break;
                case '04':
                case '06':
                case '09':
                case '11':
                    if (day > 30) {
                        return false;
                    }
                    break;
                case '02':
                    if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                        if (day > 29) {
                            return false;
                        }
                    }else {
                        if (day > 28) {
                            return false;
                        }
                    }
                    break;
                default:
                    return false;
            }

            // 年龄验证
            if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
                return false;
            }
        }

        return true;
    }

    // 身份证编码规范验证
    function _fomatCheck (identity) {
        var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1),
            lSum = 0,
            nNum = 0;

        // 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
        for (var i = 0; i < 17; ++i) {
            if (identity.charAt(i) < '0' || identity.charAt(i) > '9') {
                return false;
            }else {
                nNum = identity.charAt(i) - '0';
            }
            lSum += nNum * Wi[i];
        }

        if (identity.charAt(17) == 'X' || identity.charAt(17) == 'x') {
            lSum += 10 * Wi[17];
        }else if (identity.charAt(17) < '0' || identity.charAt(17) > '9') {
            return false;
        }else {
            lSum += (identity.charAt(17) - '0') * Wi[17];
        }

        if ((lSum % 11) == 1) {
            return true;
        }else {
            return false;
        }
    }

    module.exports = {
        validate: function (identity) {
            return _areaCheck(identity) && _birthCheck(identity) && _fomatCheck(identity);
        }
    }
});
;/**
 * 验证码服务
 * 坦然
 * 2013-10-23
 */
define('place:static/js/vcode.js', function (require, exports, module) {

var VCode, _option;

_option = {};

/**
 * @param {object} option
 * @param {dom}    option.el 验证码放到哪个dom节点中
 */
VCode = function(option) {
    var self = this;

    self.option = $.extend({}, _option, option);

    self.el = $(self.option.el);
    self.render();
    self.refreshVcode();
}

VCode.Const = {};
//VCode.Const.U_GET_VCODE = 'http://map.baidu.com/maps/services/captcha?cb=getVcodeCallback&t='+new Date().getTime();
VCode.Const.U_GET_VCODE = "http://map.baidu.com/maps/services/captcha?cb=?";

VCode.Const.U_GET_IMAGE = 'http://map.baidu.com/maps/services/captcha/image';
VCode.Const.T_VCODE = '' +
    '<input type="hidden" name="vcode" value="" />'+
    '<img title="点击更换验证码" width="100" height="30"  id="VerifyCodeImg" class="codeimg"  src="http://map.baidu.com/img/transparent.gif" />'+
    '<a id="changeVerifyCode" href="javascript:void(0);" class="changecode">换一张</a>';


$.extend(VCode.prototype, {
    /**
     * 渲染模板
     * @private
     */
    render: function() {
        var self = this;

        self.el.prepend($(VCode.Const.T_VCODE));
        self.el.find('#changeVerifyCode').click(function () {
            self.refreshVcode();
        });
    },
    /**
     * 设置vcode
     * @private
     */
    setVcode: function(vcode) {
        var self = this;

        self.el.find("input[name=vcode]").val(vcode);
        self.vcode = vcode;
    },
    /**
     * 刷新验证码
     * @public
     */
    refreshVcode: function() {
        var self = this;

        self.el.find(".vcode-img").prop("src", "http://map.baidu.com/img/transparent.gif");

        $.ajax({
            url: VCode.Const.U_GET_VCODE + "&t=" + (+new Date()),
            dataType: "jsonp",
            jsonp: "cb",
            success: function(data) {
                var vcode;

                if (vcode = data.content.vcode) {
                    self.setVcode(vcode);
                    self.getImage(vcode);
                }
            }
        });
    },
    getImage: function(vcode) {
        var self = this;

        this.el.find(".codeimg").prop("src", VCode.Const.U_GET_IMAGE + '?vcode=' + vcode);
    },
    /**
     * 获取验证码
     * @public
     */
    getData: function () {
        var self = this;

        return {
            vcode: self.vcode,
            code: self.el.find("input[name=code]").val()
        }
    }
});

module.exports = VCode;
});
;define('place:static/lib/mapresize.js', function(require, exports, module){

/**
 * @fileoverview 屏幕尺寸变化处理
 *
 */
var util = require('common:static/js/util.js');

// 屏幕尺寸变化处理
var mapResize = {

    h: 0,
    // 显示高度记录
    w: 0,
    // 显示宽度记录
    tm: 1000,
    // 计时器频率
    interval: null,
    ua: navigator.userAgent.toLowerCase(),

    init: function() {
        this.startMgr();
    },

    startMgr: function() {

        //var hasBind = false;
        if(typeof window.onorientationchange != 'undefined') {
            window.addEventListener('orientationchange', this.resize, false);

        } else {

            window.addEventListener('resize', this.resize, false);
            //hasBind = true;
        }

        if(util.isAndroid()) {

            window.addEventListener('resize', this.resize, false);
        }
        // 为了兼容iphone uc浏览器，绑定reseize事件
        // if((util.isIPhone() || util.isIPod()) && this.ua.indexOf("safari") < 0 && this.ua.indexOf("mqqbrowser") < 0) {
        //     if(this.ua.indexOf("os 5_1 ") > -1) {
        //         return;
        //     }
        //     this.isForUC = true;
        //     

        //     window.addEventListener('resize', this.resize, false);
        // }

        // this.w = window.innerWidth; // 初始化设置
        // this.h = window.innerHeight; // 初始化设置
    },

    endMgr: function() {
        clearInterval(this.interval);
        this.interval = null;
    },

    resize: function(evt) {
        // var win = window,
        //     winW = win.innerWidth;
        // if(mapResize.isForUC && winW === mapResize.w) { // FIXED: this -> window;
        //     return;
        // }

        // //menu.openAni(); //侧边栏打开动画？应该没有用吧 暂时没发现用处，我注释掉了 -by jz
        // //FIXED：避免5830默认浏览器不能完全缩进地址栏，页面高度不停变化的情况；
        // var span = Math.abs(win.innerHeight - mapResize.h);
        // if(span < 60) { // 经验值
        //     return;
        // }

        // mapResize.w = win.innerWidth; // 重新设置
        // mapResize.h = win.innerHeight; // 重新设置
        //listener.trigger('common', 'sizechange', {width: evt.target.innerWidth, height: evt.target.innerHeight, delay:true});

        // var cover = $('#bmap_pop_cover');
        // //重置cover的高度和宽度
        // if(cover && cover.css('display') !== 'none'){
        //     cover.css({
        //         'width' : mapResize.w,
        //         'height': mapResize.h
        //     })
        // }
        return;

        //todolyx delete mapresize
        // win.tfCon && win.tfCon.setPos(); // 调整交通流量控件的位置
        /*win.mnPop && win.mnPop.setPos(); // 调整menu的显示位置 
        win.dtCon0 && win.dtCon0.setPos(); // 调整测距控件的显示位置
        win.mapSubway && win.mapSubway.setPos(); // 调整地铁专题图的显示尺寸；
        win.dropDownList && win.dropDownList.setPos();

        win.TelBox.telBox && win.TelBox.telBox.setPos();
        win.TxtBox.tBox && win.TxtBox.tBox.setPos();

        topNav.setPageSize(function() {
            topNav.setSize();
        });*/
    }
};



module.exports = mapResize;


});
;define('place:static/lib/template.js', function(require, exports, module){

window.baidu = window.baidu || {};
baidu.template = baidu.template || {};

//HTML转义
baidu.template._encodeHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
};

//转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
baidu.template._encodeEventHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;')
        .replace(/\\\\/g,'\\')
        .replace(/\\\//g,'\/')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r');
};

});

;//     Underscore.js 1.5.1
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

 define('place:static/lib/underscore.js', function(require, exports, module){

(function() {
  
  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.1';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        index : index,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index < right.index ? -1 : 1;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(obj, value, context, behavior) {
    var result = {};
    var iterator = lookupIterator(value == null ? _.identity : value);
    each(obj, function(value, index) {
      var key = iterator.call(context, value, index, obj);
      behavior(result, key, value);
    });
    return result;
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key, value) {
      (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
    });
  };

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = function(obj, value, context) {
    return group(obj, value, context, function(result, key) {
      if (!_.has(result, key)) result[key] = 0;
      result[key]++;
    });
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, l = list.length; i < l; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, l = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < l; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var result;
    var timeout = null;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var values = [];
    for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var pairs = [];
    for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(window);


});

;define('place:widget/bdcomment/bdcomment.js', function(require, exports, module){


var util = require('common:static/js/util.js');

module.exports = {
    startIndex: 0,
    init: function() {
        var me = this,
            $select = $( '#J_commentSelect' );

        $select.on( 'change', $.proxy(me.loadMore, me));
        $( '.comment-loadmore').on( 'click', function() {
            me.loadMore(  true );
        } );
    },
    loadMore: function( isAsyncLoad ) {
        var me = this,
            $select = $( '#J_commentSelect' ),
            startIndex = 0,
            maxResults = 5,
            params;

        if ( isAsyncLoad ) {
            startIndex = (++me.startIndex);
            maxResults = 10;
        }

        params = util.jsonToUrl({
            uid: $select.data( 'uid' ),
            startIndex: startIndex,
            maxResults: maxResults,
            orderBy: $select.val()
        });

        BigPipe.asyncLoad( {id: 'place-pagelet-bdcomment'}, params )
    }
}

});
;define('place:widget/bookphone/bookphone.js', function(require, exports, module){

/**
 * @file bookphone-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
var util = require('common:static/js/util.js');  //商户电话
/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    var $bookphone = $('.place-widget-bookphone');
    $bookphone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    var $bookphone = $('.place-widget-bookphone');
    $bookphone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var  $target = $(e.target).closest('a');
    if(util.isAndroid()){
        $target.attr("href","javascript:void(0)");
        util.TelBox.showTb($target.attr("data-tel"));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/bookphone
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});
;define('place:widget/caterbookinfo/caterbookinfo.js', function(require, exports, module){

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
;define('place:widget/caterorderdetail/caterorderdetail.js', function(require, exports, module){

require("place:static/lib/template.js");
var url = require("common:widget/url/url.js");
var util = require('common:static/js/util.js');
var popup = require('common:widget/popup/popup.js');

var DEFAULT_ERROR_MSG = '网络连接失败';

var DATA_TYPE = 'json';

var HOST = '';
// var HOST = 'http://cq01-rdqa-pool211.cq01.baidu.com:8282';

var ORDER_LIST_URL = '/mobile/webapp/place/cater/force=superman&qt=orderlist{{kehuduan}}?mobile=';
var ORDER_SEARCH_URL = '/mobile/webapp/place/cater/force=superman&qt=searchorder{{kehuduan}}';

var CANCEL_AJAX_URL = HOST + '/detail?qt=cater_ordercancel';
var DETAIL_AJAX_URL = HOST + '/detail?qt=cater_orderdetail';

var STATUS_MSG = {
    '1': '等待确认',
    '2': '下单成功',
    '3': '订单已取消',
    '4': '预订失败'
};

var getStatusDesc = function(statusCode) {
    var key = Math.floor(statusCode / 100);
    return STATUS_MSG[key] || '';
};

var getRoomLabel = function(needRoom, size) {
    var label = '大厅';
    if (needRoom === '1') {
        size = parseInt(size, 10) || 0;
        label = '包间' + (size ? '（' + size + '人间）' : '');
    }
    return label;
};

var defError = function(rs) {
    rs = rs || {};
    popup.open(rs.errorMsg || DEFAULT_ERROR_MSG);
};

var CaterOrderDetail = function() {
    var urlData = util.urlToJSON(window.location.search.replace('?', ''));
    this.template = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if (typeof order_id !== 'undefined') {_template_fun_array.push('    <div class="orderinfo">        <p>订单状态：<span data-node="statusDesc">',typeof(status_desc) === 'undefined'?'':baidu.template._encodeHTML(status_desc),'</span></p>        <p>订单号：',typeof(order_id) === 'undefined'?'':baidu.template._encodeHTML(order_id),'</p>    </div>    <div class="item shopinfo">        <h4>',typeof(shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop_name),'</h4>        <p>            ',typeof(room) === 'undefined'?'':baidu.template._encodeHTML(room),'        ');if(typeof min_cost !== 'undefined' && min_cost) {_template_fun_array.push('            最低消费：',typeof(min_cost) === 'undefined'?'':baidu.template._encodeHTML(min_cost),'元        ');}_template_fun_array.push('        </p>        <p>入店时间：',typeof(order_time) === 'undefined'?'':baidu.template._encodeHTML(order_time),'</p>        <p>最晚到店时间：',typeof(keep_time) === 'undefined'?'':baidu.template._encodeHTML(keep_time),'</p>        <p>地址：',typeof(address) === 'undefined'?'':baidu.template._encodeHTML(address),'</p>    </div>    <div class="item">        <p class="userinfo">            <span class="username">联系人信息：                ');if(typeof gender !== 'undefined' && gender == '0') {_template_fun_array.push('                    ',typeof(user_name) === 'undefined'?'':baidu.template._encodeHTML(user_name),'先生                ');} else {_template_fun_array.push('                    ',typeof(user_name) === 'undefined'?'':baidu.template._encodeHTML(user_name),'女士                ');}_template_fun_array.push('            </span>            <span class="tel">电话：',typeof(mobile) === 'undefined'?'':baidu.template._encodeHTML(mobile),'</span>        </p>        ');if(Math.floor(status/100) > 2) {_template_fun_array.push('            <div class="help">                <p class="label">其他帮助</p>                <div class="info">                    <p class="help-tel">                        <span>百度客服电话：</span>                        <a href="tel:(400-0998-998)">                            <b class="tel-icon-b"></b>                            400-0998-998                        </a>                    </p>                </div>            </div>        ');}_template_fun_array.push('    </div>    ');if(can_cancel == '1') {_template_fun_array.push('        <div class="cancel">            <div class="btn" data-action="cancelOrder">取消订单</div>        </div>    ');}_template_fun_array.push('');} else {_template_fun_array.push('    <div class="error">订单错误</div>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
    this.mobile = urlData.mobile;
    this.orderId = urlData.orderid;
    this.$el = $('#place-widget-caterorderdetail');
    this.init();
};
CaterOrderDetail.prototype = {
    init: function() {
        this.bindEvent();
        this.getOrderDetail();
    },
    formatRS: function(data) {
        data = data || {};
        var otime = parseInt(data.order_time || 0, 10) * 1000;
        var ktime = parseInt(data.keep_time || 0, 10);
        data.status_desc = getStatusDesc(data.status);
        data.room = getRoomLabel(data.need_room, data.room_size);
        data.order_time = (new Date(otime)).format('yyyy-MM-dd hh:mm');
        data.keep_time = (new Date(otime + ktime * 60 * 1000)).format('hh:mm');
        return data;
    },
    render: function(rs) {
        var data = rs.data || [];
        this.$el.html(this.template(this.formatRS(data[0])));
        this.$statusDesc = this.$el.find('[data-node="statusDesc"]');
    },
    getOrderDetail: function() {
        $.ajax({
            url: DETAIL_AJAX_URL,
            type: 'GET',
            dataType: DATA_TYPE,
            context: this,
            data: {
                'orderId': this.orderId,
                'mobile': this.mobile
            },
            cache: false,
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    if (rs.errorNo === 8000) {
                        url.navigate(ORDER_SEARCH_URL);
                    } else {
                        url.navigate(ORDER_LIST_URL + this.mobile);
                    }
                }
                this.render(rs);
            },
            error: defError
        });
    },
    onCancelOrderClick: function(evt) {
        var $target = $(evt.currentTarget);
        $.ajax({
            url: CANCEL_AJAX_URL,
            type: 'POST',
            dataType: DATA_TYPE,
            data: {
                'orderId': this.orderId,
                'mobile': this.mobile
            },
            context: this,
            success: function(rs) {
                if (rs.errorNo !== 0) {
                    return defError(rs);
                }
                $target.remove();
                this.$statusDesc.html(STATUS_MSG['3']);

            },
            error: defError
        });
    },
    bindEvent: function() {
        this.onCancelOrderClickHandle = $.proxy(this.onCancelOrderClick, this);
        this.$el.delegate('[data-action=cancelOrder]', 'click', this.onCancelOrderClickHandle);
    },
    unbindEvent: function() {
        this.$el.undelegate('[data-action=cancelOrder]', 'click', this.onCancelOrderClickHandle);
    },
    destroy: function() {
        this.unbindEvent();
    }
};
exports.init = function(opt) {
    opt = opt || {};
    ORDER_LIST_URL = ORDER_LIST_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    ORDER_SEARCH_URL = ORDER_SEARCH_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    return new CaterOrderDetail();
};

});
;define('place:widget/caterorderlist/caterorderlist.js', function(require, exports, module){

require("place:static/lib/template.js");
var url = require('common:widget/url/url.js');
var util = require('common:static/js/util.js');
var popup = require('common:widget/popup/popup.js');

var DEF_NUM = 10;
var DISABLED = 'disabled';
var DEF_HREF = 'javascript:;';

var DEFAULT_ERROR_MSG = '网络连接失败';
var DEF_SEARCH_URL = '/mobile/webapp/place/cater/force=superman&qt=searchorder{{kehuduan}}';
var DEF_ORDER_LIST_URL = '/mobile/webapp/place/cater/force=superman&qt=orderlist{{kehuduan}}?';
var DEF_ORDER_DELTAIL_URL = '/mobile/webapp/place/cater/force=superman&qt=orderdetail{{kehuduan}}?';

var HOST = '';
// var HOST = 'http://cq01-rdqa-pool211.cq01.baidu.com:8282';

var DATA_TYPE = 'json';

var LIST_AJAX_URL = HOST + '/detail?qt=cater_orderlist';

var STATUS_MSG = {
    '1': '等待确认',
    '2': '下单成功',
    '3': '订单已取消',
    '4': '预订失败'
};

var getStatusDesc = function(statusCode) {
    var key = Math.floor(statusCode / 100);
    return STATUS_MSG[key] || '';
};

var getRoomLabel = function(needRoom, size) {
    var label = '大厅';
    if (needRoom === '1') {
        size = parseInt(size, 10) || 0;
        label = '包间' + (size ? '（' + size + '人间）' : '');
    }
    return label;
};

var defError = function(rs) {
    rs = rs || {};
    popup.open(rs.errorMsg || DEFAULT_ERROR_MSG);
    if (rs.errorNo === 8000) {
        url.navigate(DEF_SEARCH_URL, {
            replace: true
        });
    }
};

var CaterOrderList = function() {
    var urlData = util.urlToJSON(window.location.search.replace('?', ''));
    this.itemTemp = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<li data-oid="',typeof(order_id) === 'undefined'?'':baidu.template._encodeHTML(order_id),'" data-href="',typeof(order_url) === 'undefined'?'':baidu.template._encodeHTML(order_url),'">    <div class="item">        <h4> ',typeof(shop_name) === 'undefined'?'':baidu.template._encodeHTML(shop_name),' </h4>        <span class="room right">',typeof(room) === 'undefined'?'':baidu.template._encodeHTML(room),'</span>    </div>    <div class="person">        就餐人数：',typeof(person_num) === 'undefined'?'':baidu.template._encodeHTML(person_num),'位    </div>    <div class="item">        <span>预约入店时间：',typeof(order_time) === 'undefined'?'':baidu.template._encodeHTML(order_time),'</span>        <span class="right">',typeof(status_desc) === 'undefined'?'':baidu.template._encodeHTML(status_desc),'</span>    </div>    <em class="list-arrow"></em></li>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
    this.curPage = parseInt(urlData.page, 10) || 1;
    this.mobile = urlData.mobile;
    this.$el = $('#place-widget-caterorderlist');
    this.$mobile = this.$el.find('[data-node="mobile"]');
    this.$list = this.$el.find('[data-node="list"]');
    this.$pageNav = this.$el.find('[data-node="pageNav"]');
    this.$preBtn = this.$el.find('[data-node="pre"]');
    this.$nextBtn = this.$el.find('[data-node="next"]');
    this.init();
};
CaterOrderList.prototype = {
    init: function() {
        this.getOrderList();
        this.bindEvent();
    },
    bindEvent: function() {
        this.onListClickHandle = $.proxy(this.onListClick, this);
        this.$el.on('click', 'li', this.onListClickHandle);
    },
    unbindEvent: function() {
        this.$el.off('click', 'li', this.onListClickHandle);
    },
    onListClick: function(evt) {
        var $item = $(evt.currentTarget),
            href = $item.data("href");
        url.navigate(href);
        evt.stopPropagation();
        evt.stopImmediatePropagation();
    },
    getOrderList: function(cb) {
        $.ajax({
            url: LIST_AJAX_URL,
            type: 'GET',
            dataType: DATA_TYPE,
            context: this,
            cache: false,
            data: {
                'mobile': this.mobile,
                'page': this.curPage,
                'num': DEF_NUM
            },
            success: function(rs) {
                if (!rs || rs.errorNo !== 0) {
                    return defError(rs);
                }
                this.render(rs);
            },
            error: defError
        });
    },
    formatRs: function(data) {
        var rs = data || {};
        var otime = parseInt(rs.order_time, 10);
        rs.order_time = (new Date(otime * 1000)).format('yyyy-MM-dd hh:mm');
        rs.status_desc = getStatusDesc(rs.status);
        rs.room = getRoomLabel(rs.need_room, rs.room_size);
        return rs;
    },
    formatPage: function(page, countPage) {
        var action = countPage <= 1 ? 'hide' : 'show';
        var nextOk = page < countPage;
        var preOK = page > 1;
        this.$pageNav[action]();
        this.$preBtn[preOK ? 'removeClass' : 'addClass'](DISABLED);
        this.$nextBtn[nextOk ? 'removeClass' : 'addClass'](DISABLED);
        this.$preBtn.attr('href', preOK ? DEF_ORDER_LIST_URL + util.jsonToUrl({
            'mobile': this.mobile,
            'page': page - 1,
            'num': DEF_NUM
        }) : DEF_HREF);
        this.$nextBtn.attr('href', nextOk ? DEF_ORDER_LIST_URL + util.jsonToUrl({
            'mobile': this.mobile,
            'page': page + 1,
            'num': DEF_NUM
        }) : DEF_HREF);
    },
    render: function(rs) {
        this.$mobile.html(this.mobile);
        this.formatPage(this.curPage, Math.ceil(rs.total / DEF_NUM));
        var listHtml = '';
        var list = rs.data || [];
        var item;
        for (var i = 0; i < list.length; i++) {
            item = this.formatRs(list[i]);
            item.order_url = DEF_ORDER_DELTAIL_URL + util.jsonToUrl({
                'mobile': this.mobile,
                'orderid': item.order_id
            });
            listHtml += this.itemTemp(list[i]);
        }
        this.$list.html(listHtml);
    },
    destroy: function() {
        this.unbindEvent();
    }
};
exports.init = function(opt) {
    opt = opt || {};
    DEF_SEARCH_URL = DEF_SEARCH_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    DEF_ORDER_LIST_URL = DEF_ORDER_LIST_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    DEF_ORDER_DELTAIL_URL = DEF_ORDER_DELTAIL_URL.replace('{{kehuduan}}', opt.kehuduan ? '&kehuduan=1' : '');
    return new CaterOrderList();
};

});
;define('place:widget/catersearchorder/catersearchorder.js', function(require, exports, module){

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

var ORDER_LIST_URL = '/mobile/webapp/place/cater/force=superman&qt=orderlist{{kehuduan}}?mobile=';

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

});
;define('place:widget/cinemalist/cinemalist.js', function(require, exports, module){

/**
 * @description 电影检索页面
 * @author zhangyong 
 */
var HTTP = "http://"+window.location.host,
    url  = require("common:widget/url/url.js"),
    stat = require('common:widget/stat/stat.js');

var wd = $('.common-widget-nav .title span').text();
var movieInfoData;

//-----------------------------------------------------------------------
//description  展示/隐藏剧情介绍
// @param {__text} [string] 字符串
//-------------------------------------------------------------------------
function showDes() {
    var MORE = $("#more");

    if ( !! !MORE) {
        return;
    }

    var DESC = $("#desc"),
        shortDesc = DESC.html(),
        longDesc = movieInfoData.movie_description;

    MORE.click(function() {
        toggleText();
        $(this).children("img").toggleClass("active");
    });

    function toggleText() {
        if (MORE.children("img").attr('class') == 'active') {

            DESC.html(shortDesc);

        } else {

            DESC.html(longDesc);
            stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_MORECLICK, {'name': 'movieDescription'});
        }
    }
}
//--------------------------------------------
//description  翻页
//@param 
//--------------------------------------------
var bindPageBtn = function(){
    $pageNav = $(".place-widget-moviedetail .page-btn");
    $.each($pageNav, function (index,item) {
        var $dom = $(item);
        $dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("url");


            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

            if(!btn.hasClass("unclick")) {
                url.navigate(href,{
                    replace : true
                });
            }
        });
    });
};
//--------------------------------------------
//description  影院跳转
//@param 
//--------------------------------------------
var bindList = function () {
    var $poiList = $(".list-info");
    $poiList.on("click", "li", function(evt){
        var $item = $(this),
            href = $item.data("href"),
            name = $item.find('.rl_li_title').text(),
            isGen = movieInfoData && movieInfoData["isGenRequest"],
            target = evt.target;
            
        // 过滤路线按钮，防止重复触发
        if(target.tagName.toLowerCase() === "a") {
            return;
        }
        isGen = isGen == 1 ? 1 : 0;

        if($item.find("em.place_seat_icon").length == 1){
            stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_SCHEDULECLICK, {'name': name,'type':'schedule'});

        }else{

            stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_NEWSCLICK, {'name': name,'type':'news'});

        }
        stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen}, function(){
            url.navigate(href);
        });
    });
};

function initialize(__data) {
    movieInfoData = __data;
    bindPageBtn();
    bindList();
    showDes();
    stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_PV, {'movieid': movieInfoData.movie_id});
}


module.exports = {
    initialize: initialize
};

});
;define('place:widget/codes/codes.js', function(require, exports, module){

/**
 * @description 兑换码影院列表页面
 * @author zhangyong 
 */
var HTTP = "http://"+window.location.host,
    msg  ={},
    flag = true;

//自动设置影院宽度
function autoWidth() {
    //var nameWidth = $("body").width() - 115;
    var nameWidth = $("body").width() - 85;
    $(".movie_name").css("width", nameWidth);
    $("#back").click(function(){
        window.history.go(-1);
    });
}

$(window).resize(function() {
    autoWidth();
});

//影院链接
function listHref(__listData){
    $(".list").click(function() {
        var uid = this.id;
        location.href = HTTP + "/mobile/webapp/place/detail/force=simple&qt=inf&uid=" + uid +
        "&c=" + __listData.city_id + "/&code=" + __listData.code + "&sign=" + __listData.sign;

    });
}

//城市异步请求
function selectCity(){
    var city = document.getElementById("city");
    city.onchange=function(e){
        var t = this.options[this.selectedIndex].value;
        msg.city_id = t;
        request(msg);
    };
}

//更改城市地址
function changeSelect(__city_id) {

    var city = document.getElementById("city");

    for (var i = 0; i < city.length; i++){
        if (city.options[i].value == __city_id) {
            city.options[i].selected = true;
        }
    }
}


function CodesHTML(__listData) {
    var str = "";
    $.each(__listData.list, function(index, item) {
        str += '<dl class="list list_boder" id="' + item.uid + '">';
        str += '<dt><span class="sn">' + (index + 1) + '</span><span class="movie_name">' + item.name + '</span></dt>';
        str += '<dd><span class="addr">' + item.address + '</span></dd><dd class="trad"></dd></dl>';
    });

    $("#list_info").html(str);

    if (flag === true) {
        changeSelect(__listData.city_id);
        flag = false;
    }
    listHref(__listData);
}
//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.substr(1).match(reg);
    if (r !== null) {
        return decodeURIComponent(r[2]);
    } else {
        return null;
    }
}
//获取定位信息
function locator() {
    var bound = {};

    bound.point_x = GetQueryString("point_x");
    bound.point_y = GetQueryString("point_y");
    bound.city_id = GetQueryString("city_id");

    if (bound.city_id) {
        return $.param(bound);
    } else {
        return "";
    }
}


//异步请求城市信息

function request(__msg) {
    var curReqUrl;
    if (__msg.city_id) {
        curReqUrl = HTTP + "/mobile/webapp/place/codes/force=simple&qt=cinemas&code=" + __msg.code + "&sign=" + __msg.sign + "&city_id=" + __msg.city_id;
    } else {
        curReqUrl = HTTP + "/mobile/webapp/place/codes/force=simple&qt=cinemas&code=" + __msg.code + "&sign=" + __msg.sign + "&" + __msg.bound;
    }
    $.ajax({
        url: curReqUrl, //请求地址
        type: "get", //请求方式
        dataType: "json", //请求数据类型
        crossDomain: false, //是否跨域
        data: null,
        async: true, //是否异步请求，默认为异步
        error: function() {},

        success: function(__listData) {

            if(__listData.errorNo === 0){

                CodesHTML(__listData);
                $("#codes_box").removeClass("hide");
                $("#over").addClass("hide");
            }else{
                $("#codes_box").addClass("hide");
                $("#over").removeClass("hide");
            }
        }
    });
}

function initialize(__code,__sign) {
    autoWidth();
    msg.code = __code;
    msg.sign = __sign;
    msg.bound = locator();
    selectCity();
    request(msg);
}

module.exports = {
    initialize: initialize
};

});
;define('place:widget/codesdetail/codesdetail.js', function(require, exports, module){

var mData;
function mInfo() {
    $("#name").html(mData.name);

    if (parseInt(mData.score)) {

        $("#score").html(mData.score);
    }


    if (mData.duration && mData.duration != "undefined") {

        $("#duration").html("片长：" + mData.duration);
    } else {

        $("#duration").html("片长：暂无");
    }

    if (mData.category && mData.category != "undefined") {

        $("#category").html("类型：" + mData.category);
    } else {

        $("#category").html("类型：暂无");
    }


    $("#pic").attr("src", mData.pic);

    $("#pname").html(mData.pname);

    if (mData.director && mData.director != "undefined") {

        $("#director").html("导演：" + mData.director);
    } else {

        $("#director").html("导演：暂无");
    }

    if (mData.player && mData.player != "undefined") {

        $("#player").html("主演：" + mData.player);
    } else {

        $("#player").html("主演：暂无");
    }

    $("#release").html("上映时间：" + mData.release);

    var day = mData.day.split("-");

    $("#day").html(day[1] + "月" + day[2] + "日&nbsp;<span class='txt_red' id='time'>" + mData.time + "</span>&nbsp;" + mData.type);

}

function mEvent() {
    $("#back").click(function() {

        window.history.go(-1);
    });


    $("#subSure").click(function() {

        var pids = [];
        var sem = ",";
        $('input[name="pid"]:checked').each(function() {
            pids.push($(this).val());
        });
        if (pids.length == 0) {
            var t = 0;
            (function msg() {
                if (t > 5) {
                    return;
                }
                t++;
                if (t % 2 == 1) {
                    $('input[name="pid"]').each(function() {
                        this.checked = true;
                    });
                } else {
                    $('input[name="pid"]').each(function() {
                        this.checked = false;
                    });
                }
                window.setTimeout(msg, 200);
            })();
            return;
        }

        pids.join(",");

        var phone = $("#phone").val();
        var http = "http://" + window.location.host;
        var url = http + "/detail?qt=mcdkey&act=exchange&pids=" + pids + "&phone=" + phone + "&code=" + mData.code + "&sign=" + mData.sign;

        $.ajax({
            type: 'GET',
            url: url,
            data: null,
            dataType: 'json',
            success: function(data) {
                if (data.errorNo == 0) {
                    location.href = http + "/detail?qt=movie&act=select&sign=" + data.sign + "&act_id=" + data.act_id + "&act_pids=" + data.pids + "&from=webapp&uid=" + mData.uid + "&date=" + mData.day + "&seq_no=" + mData.seq_no + "&cinema_id=" + mData.cinemaid + "&movie_id=" + mData.mid + "&third_from=wangpiao&movie_info=" + encodeURIComponent(mData.info);

                } else if (data.errorNo == 300010) {
                    window.location.reload();
                } else if (data.errorNo == 200002) {
                    var t = 0;
                    (function msg() {
                        if (t > 5) {
                            return;
                        }
                        t++;
                        $("#phone").toggleClass("tsred");
                        window.setTimeout(msg, 200);
                    })();
                }
            },
            error: function(xhr, type) {

            }
        });
    });

}



function initialize(__data) {
    mData = __data;
    mInfo();
    mEvent();
}

module.exports = {
    initialize: initialize
};

});
;define('place:widget/codesindex/codesindex.js', function(require, exports, module){

/**
 * @description 兑换码抢购首页
 * @author zhangyong 
 */
var HTTP = "http://"+window.location.host,
    locator = require('common:widget/geolocation/location.js'),
    stat    = require('common:widget/stat/stat.js'),
    num = 1,
    msg  ={};
    

//获取城市定位信息
function codesLocate() {
    var cityCode = locator.getCityCode() || 1,
        bound   = {};
    if (locator.hasExactPoi()) {
        bound.point_x = locator.getPointX();
        bound.point_y = locator.getPointY();
        bound.city_id = cityCode;
    }
    return bound;
}
//动态设置banner的宽高
function bannerWidth(){
    var bannerimg = $("#bannerimg");
    var mwidth = bannerimg.width()/2 + "px",
        mheight = bannerimg.height()/2 + "px";

    bannerimg.css({
        width: mwidth,
        height:mheight
    });
}

//动态设置购买数量
function buyCodeCount(){
    var bannerimg = $("#buyCodeCount span");

    bannerimg.click(function() {
        $(this).addClass("selected").siblings("span").removeClass("selected");
        num = parseInt($(this).text());
    });
}

//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.substr(1).match(reg);
    if (r !== null) {
        return decodeURIComponent(r[2]);
    } else {
        return null;
    }
}
//--------------------------------------------
//description  ajax封装
//@param {msg} [obj]
//--------------------------------------------

function ajax(msg) {
    $.ajax({
        url: msg.url || "", //请求地址
        type: msg.type || "GET", //请求方式
        dataType: msg.dataType || "text", //请求数据类型
        crossDomain: msg.crossDomain || false, //是否跨域
        data: msg.data || "",
        contentType: msg.type == "POST" ? "application/x-www-form-urlencoded; charset=utf-8" : null,
        async: true, //是否异步请求，默认为异步

        success: function(result) {
            msg.callback(result);

        },
        error: function() {

        }
    });
}
//--------------------------------------------
//description  异步获取城市列表
//--------------------------------------------
function city(__bound){

    if(__bound.city_id){
        var locatr = "&"+$.param(__bound);
    }else{
        var locatr = "";
    }
    var url  = HTTP + "/mobile/webapp/place/codes/force=simple&qt=webappcitys"+locatr+"&act_id=" + GetQueryString("act_id");

    var msg = {
        url: url,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        data: null,
        callback: cityHTML
    };
    function cityHTML(__data) {
        var citylist = $("#citylist"),
            str = "";
        if (__data.errorNo == 0) {
            $.each(__data.list, function(index, item) {
                str += '<option class="city_opt" value="' + item.city_id + '">' + item.city + '</option>'
            });
        }
        citylist.html(str);

        // if(__bound.city_id){
        //     var locatr = __bound.city_id;
        // }else{
        //     var locatr = "";
        // }
        cinema(locatr,"",1);
    }
    ajax(msg);
}

//城市异步请求
function selectCity(){
    var city = document.getElementById("citylist");
    city.onchange=function(e){
        var t = this.options[this.selectedIndex].value;
        cinema("",t,0);
    };
}

//更改城市地址
function changeSelect(__city_id) {

    var city = document.getElementById("citylist");

    for (var i = 0; i < city.length; i++){
        if (city.options[i].value == __city_id) {
            city.options[i].selected = true;
        }
    }
}
//--------------------------------------------
//description  异步获取影院列表
//@param {__city_id} [string]
//--------------------------------------------

function cinema(__locatr, __city_id, __sn) {
    if (__sn == 0) {
        var locatr = "&city_id=" + __city_id;
    } else {
        var locatr = __locatr;
    }
    //var url = HTTP + "/mobile/webapp/place/codes/force=simple&qt=webappcinemas&city_id="+__city_id+"&act_id=" + GetQueryString("act_id"),
    var url = HTTP + "/detail?qt=mcdkey&from=webapp&act=cinemas"+locatr+"&act_id=" + GetQueryString("act_id"),
        //var url = "http://cq01-rdqa-dev051.cq01.baidu.com:8081/detail?qt=mcdkey&from=webapp&act=cinemas&act_id=" + GetQueryString("act_id")+locatr,
        CITYNAME = $("#cityname");
    var msg = {
        url: url,
        type: "GET",
        dataType: "json",
        crossDomain: false,
        data: null,
        callback: HTMLTMP
    };

    function HTMLTMP(__data) {

        if(__data.errorNo == 0){
            changeSelect(__data.city_id);

            var cinemas = $("#cinemas"),
                str = "",
                indexs = 1;

            $.each(__data.list,function(index,item){
                $.each(item.list,function(i,value){
                    str += '<li class="cinemaslist" id="'+value.uid+'"><p class="shop"><span class="order">'+indexs +'.</span>'+value.name+'</p>';
                    str += '<p class="addr">'+value.address+'</p></li>';
                    indexs++;
                });
            });
            cinemas.html(str);
            listHref(__data);
        }
    };

    ajax(msg);
}
//影院链接
function listHref(__listData){
    $(".cinemaslist").click(function() {
        var uid = this.id;
        location.href = HTTP + "/mobile/webapp/place/detail/force=simple&qt=inf&uid=" + uid +"&c=" + __listData.city_id + "&wd=电影院";
        stat.addStat(STAT_CODE.PLACE_BUYCODES_CINDEMAS_PV, {'state': __listData.city_id});
    });
}

function modaction(){
    var RULE = $("#rule"),
        RULELIST =  $("#rule_list"),
        MOVIEINFO =  $("#movieinfo"),
        MOVIEINFOLIST =  $("#movieinfolist");

    RULE.click(function(){
        RULELIST.toggle();
        $(this).toggleClass("mod_tit");
    });

    MOVIEINFO.click(function(){
        MOVIEINFOLIST.toggle();
        $(this).toggleClass("mod_tit");
    });

}


function BuyCodesfun(__buyData) {
    var GETParam = __buyData,
        phoneMsg = $("#phoneMsg"),
        numMsg = $("#numMsg");

    $("#submitBtn").click(function() {

        var phone = $("#phone").val(),
            url = HTTP + "/detail?qt=mcdkey&from=webapp&act=corder&act_id=" + GETParam.act_id + "&sign=" + GETParam.sign + "&phone=" + phone + "&num=" + num,
            
            msg = {
                url: url,
                type: "GET",
                dataType: "json",
                crossDomain: true,
                data: null,
                callback: callback
            };

            if(!num){
                return;
            }
            if(!phone){
                phoneMsg.html('手机号有误！');
                phoneMsg.removeClass("vhide");
                OBJHide(phoneMsg);
                return;
            }
        stat.addStat(STAT_CODE.PLACE_BUYCODES_PV, {'state': 'buyCodes' });
        ajax(msg);
    });
//--------------------------------------------
//description  购买回调
//@param {__data} [json]
//--------------------------------------------
    function callback(__data) {
        if (__data.errorNo == 200002) {
            phoneMsg.html('手机号有误！');
            phoneMsg.removeClass("vhide");
            OBJHide(phoneMsg);
        } else if (__data.errorNo == 300002) {
            numMsg.html('您的限额已经用完！');
            numMsg.removeClass("vhide");
            OBJHide(numMsg);
        } else if (__data.errorNo == 300003) {
            numMsg.html('您只能购买'+__data.res_num+'张票了哦！');
            numMsg.removeClass("vhide");
            OBJHide(numMsg);
        } else if (__data.errorNo == 0) {
            window.location.href = __data.topayURL;
        }
    }
}
//--------------------------------------------
//description  对象隐藏
//@param {obj，par} [object]
//--------------------------------------------
function OBJHide(obj, par) {
    var timer = window.setTimeout(function() {
        obj.addClass("vhide");
        window.clearTimeout(timer);
    }, 5000);
}

function initialize(__buyData) {
    //bannerWidth();//动态设置banner宽高
    buyCodeCount();//动态设置购买数量的状态
    var boundmsg = codesLocate();//获取城市定位
    city(boundmsg);//获取城市列表
    selectCity();
    modaction();
    BuyCodesfun(__buyData);
}



module.exports = {
    initialize: initialize
};

});
;define('place:widget/commentbtn/commentbtn.js', function(require, exports, module){



var login = require('common:widget/login/login.js'),
    stat = require('common:widget/stat/stat.js'),
    url = require('common:widget/url/url.js');

module.exports = {
    $el: null,
    init: function () {
        var me = this;
        me.$el = $( '#J_commentBtn' );
        me.$el.on( 'click', $.proxy( this.commentAction, this ) );
        me.showBonus();
    },

    commentAction: function( e ) {
        login.checkLogin(function( data ) {
            if ( data.status ) {
                url.navigate( $( e.target ).closest( 'a' ).data('url') );
            } else {
                login.loginAction();
            }
        });
    },

    showBonus: function(){
        var me = this;
        if( url.get().pageState && 
            url.get().pageState.cmark === '1' && 
            url.get().pageState.detail_part === 'comment'
        ){
            var btnTpl = $( '<a>点击抽奖</a>' )
                .attr('id', 'comment-bonus')
                .attr( 'href', 'http://map.baidu.com/zt/zhuanpan/mobile/?from=app' )
                .css( { 
                    background : '#fcaf41', 
                    display : "block",
                    color : "#fff",
                    height : "40px",
                    margin : '10px 0',
                    "font" : 'normal bold 14px/40px "微软雅黑"',
                    "-webkit-border-radius" : "5px",
                    "border-radius" : "5px",
                    "text-align" : "center"
                } );

            me.$el.after( btnTpl );
        }else{
            me.$el.parent().find( '#comment-bonus' ).remove();
        }
    }
}


});
;define('place:widget/datepicker/datepicker.js', function(require, exports, module){

'use strict';
var today = new Date(),
    tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

module.exports = {
    init: function(options) {
        var $calendar = $( '.hotel-calendar'),
            $sInput = $calendar.find('.date-ipt-start .tit-text'),
            $eInput = $calendar.find('.date-ipt-end .tit-text');
        // 初始化时间
        this.date = {};
        this.options = options;

        $sInput.text(today.format('yyyy-MM-dd'));
        $eInput.text(tomorrow.format('yyyy-MM-dd'));
        this.$sContainer = $calendar.find('.hotel-container-start');
        this.$eContainer = $calendar.find('.hotel-container-end');
        this.$sWrapper = $calendar.find('.hotel-calwrap-start');
        this.$eWrapper = $calendar.find('.hotel-calwrap-end');
        this.$sInput = $sInput;
        this.$eInput = $eInput;
        this.$calendar = $calendar;

        this.isShow = false;
        this.bindEvent();
    },
    bindEvent: function() {
        var me = this;
        listener.on('place.datepicker' , 'showcalendar', function() {
            if (!me.isShow) {
                me._initCalendar();
                me.isShow = true;
            }
        } );
    },
    _initCalendar: function() {
        var me = this,
            datepicker = require('common:widget/datepicker/datepicker.js'),
            staticDatepicker = $.datepicker,
            sIptDate = staticDatepicker.parseDate(me.$sInput.text()),
            eIptDate = staticDatepicker.parseDate(me.$eInput.text()),
            uid = me.options.uid;

        //初始化入住时间datepicker
        me.$sContainer.datepicker({
            date: sIptDate,
            minDate: sIptDate,
            valuecommit: function (e, date, dateStr) {
                var endDate = staticDatepicker.parseDate(me.$eInput.text()),
                    tomorrowDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

                // dateStr赋值给文本框
                me.$sInput.text(dateStr);

                //如果选择的入住日期大于退房日期，则退房日期变更为新的入住日期的下一天
                if (me._compareDate(date, endDate) >= 0) {
                    me.$eInput.text(tomorrowDate.format('yyyy-MM-dd'));
                    me.$eContainer.datepicker('date', tomorrowDate);
                }

                // 将结束日历的最小日期设成所选日期的下一天，最大日期为所选日期的28天之后
                me.$eContainer.datepicker( 'minDate', tomorrowDate )
                           .datepicker( 'maxDate', new Date( date.getFullYear(), date.getMonth(), date.getDate() + 28) )
                           .datepicker( 'refresh' );
                //移除样式
                me._removeActiveCss('start');

                (me.$sInput.text() !== me.date.st) &&
                    listener.trigger('place.datepicker' , 'datechange', {
                        st: me.$sInput.text(),
                        et: me.$eInput.text(),
                        uid: uid
                    } );

                me.date.st = me.$sInput.text();
            }
        });

        //初始化退房时间datepicker
        me.$eContainer.datepicker({
            date: eIptDate,
            minDate: eIptDate,
            maxDate: new Date( sIptDate.getFullYear(), sIptDate.getMonth(), sIptDate.getDate() + 28),
            valuecommit: function (e, date, dateStr) {

                // dateStr赋值给文本框
                me.$eInput.text(dateStr);

                //移除样式
                me._removeActiveCss('end');

                (me.$eInput.text() !== me.date.et) &&
                    listener.trigger('place.datepicker', 'datechange', {
                        st: me.$sInput.text(),
                        et: me.$eInput.text(),
                        uid: uid
                    } );
                me.date.et = me.$eInput.text();
            }
        });

        me.$calendar.find('.hotel-date-ipt').on('click', $.proxy(me._onDateClick, me));
        me.$calendar.show();
    },
    _removeActiveCss: function (type) {
        switch (type) {
            case 'start':
                this.$sWrapper.hide();
                this.$sInput.parents('.hotel-date-ipt').removeClass('active');
                break;
            case 'end':
                this.$eWrapper.hide();
                this.$eInput.parents('.hotel-date-ipt').removeClass('active');
                break;
            default :
        }
    },
    _compareDate: function(date1, date2) {
        return date1.getTime() - date2.getTime();
    },
    _onDateClick: function(e) {
        var me = this,
            $target = $(e.currentTarget);

        if ($target.hasClass('date-ipt-start')) {
            me._removeActiveCss('end');
            this.$sWrapper.toggle();
            $target.toggleClass('active');
        } else if($target.hasClass('date-ipt-end')) {
            me._removeActiveCss('start');
            this.$eWrapper.toggle();
            $target.toggleClass('active');
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
    }
};

});
;define('place:widget/dishcategory/dishcategory.js', function(require, exports, module){

var util = require('common:static/js/util.js'),
    mapResize = require('place:static/lib/mapresize.js'),
    iScroll = require('common:static/js/iscroll.js');

module.exports = {
    init: function() {
        $('#place-widget-dish-category').show();


        var ddlScroll = new iScroll($("#place-widget-dish-category .ddl_wrapper div").get(0), {
            hScroll: false,
            hScrollbar: false,
            vScroll: true,
            vScrollbar: true,
            handleClick: true
        });

        var height = mapResize.h || 320;
        height = height - 160;
        height = Math.min(Math.max(120, height), 360);

        $("#place-widget-dish-category .ddl_wrapper .ul_scroll").css({maxHeight : height});

        ddlScroll.refresh();


        function scrollToDish(e){
            var target = e.target;
            var dishCategoryId = target.id;

            if(dishCategoryId){
                var offset = $('#dishCategory_' + dishCategoryId).offset();
                window.scroll(0, offset.top);
            }

            $('#place-widget-dish-category').hide();
        }

        // 分类菜单点击事件
        $('#place-widget-dish-category').on('click', scrollToDish);

        // 隐藏分类菜单
        $('#place-widget-dish-category').hide();
    }
};


});
;define('place:widget/genericlayer/genericlayer.js', function(require, exports, module){

/**
 * 泛需求麻点栅格图
 * shengxuanwei@baidu.com
 * 2013-10-31
 */
var loc = require('common:widget/geolocation/location.js');

function MDLayer(opts) {
    BMap.TileLayer.call(this, opts);
    this._opts = {};
    opts = opts || {};
    this._opts = $.extend(this._opts, opts);
}
MDLayer.prototype = new BMap.TileLayer();
MDLayer.prototype.initialize = function (map, container) {
    BMap.TileLayer.prototype.initialize.call(this, map, container);
    this._map = map;
};
/**
 * 实现getTilesUrl接口
 * @param Point
 * @param Number
 */
MDLayer.prototype.getTilesUrl = function (point, level) {
    var me = this;
    var column = point.y,
        row = point.x;
    var domains = ["http://gss0.map.baidu.com", "http://gss1.map.baidu.com", "http://gss2.map.baidu.com", "http://gss3.map.baidu.com"];
    var pno = Math.abs(row + column) % domains.length;
    var url = domains[pno] + "/?qt=bkg_png&c=" + loc.getCityCode() + "&ie=utf-8";
    if (!window["placeParam"]) {
        url += "&wd=" + encodeURIComponent(me._opts.json.result.return_query);
    } else {
        url += "&wd=" + encodeURIComponent(me._opts.json.result.return_query) + window["placeParam"];
    } //如果是高分屏设备，则添加高分参数，同时修改 抽稀值rn by caodongqing
    //任何设备都麻点抽稀，所以提出来强行设置 by yangjian
    url = url + "&rn=4";
    if (this._map.highResolutionEnabled()) {
        url = url + "&imgtype=hdpi";
    }
    // 中心点
    if (loc.hasExactPoi()) {
        url += '&center_rank=1';
        url += '&nb_x=' + loc.getPointX();
        url += '&nb_y=' + loc.getPointY();
    }

    //url = locationBar.updateUrl(url);
    var b = this._map.getBounds();
    var minX = b.getSouthWest().lng;
    var minY = b.getSouthWest().lat;
    var maxX = b.getNorthEast().lng;
    var maxY = b.getNorthEast().lat;
    var bs = escape("(") + minX + "," + minY + ";" + maxX + "," + maxY + escape(")");
    url += "&l=" + level + "&xy=" + row + "_" + column + "&b=" + bs + "&t=" + new Date().getTime();
    return url;
};

MDLayer._className_ = 'MDLayer';

module.exports = MDLayer;

});
;define('place:widget/genericre/genericre-tiles.js', function(require, exports, module){

/**
 * @fileoverview 泛需求组件
 * shengxuanwei@baidu.com
 * 2013-11-06
 */
var mapConst = require('common:static/js/mapconst.js'),
    util = require('common:static/js/util.js'),
    loc = require('common:widget/geolocation/location.js'),
    searchData = require('common:static/js/searchdata.js'),
    MDLayer = require('place:widget/genericlayer/genericlayer.js');

// 泛需求底图蓝点Icon
function GenRequest() {
    // 当前JSON数据存储
    this.json = null;
    // 查询关键字，用以判断是否需要删除旧地图
    this.qWord = "";
    // 查询城市，用以判断是否需要删除旧地图
    this.qCity = -1;
    // 当前地图是否泛需求状态
    this.isGRequest = false;
    // 前端存储麻点数据
    this.genDataLst = {};
    // 前端存储麻点id的数组，用以对genDataLst数据的使用频率和删除管理
    this.genDataIdLis = [];
    // 当前已提交给底图可点系统的瓦片id
    this.spotOnId = "";
    // 气泡
    this.marker = null;
    // 当前视野的瓦片id集合
    this.curBoundTiles = [];
    // 中心点记录程序，用以判断是否发出请求
    this.curCenterPoint = null;
    // 检索type记录,type=1是普通泛需求，type=2是全国检索
    this.types = {
        /* poi检索泛需求普通结果 */
        "36": {
            "t": 1
        },
        /* 周边检索普通结果 */
        "38": {
            "t": 1
        },
        /* 视野内检索普通结果 */
        "39": {
            "t": 1
        }
    };
}

$.extend(GenRequest.prototype, {
    /**
     * 初始化，清除缓存
     */
    initialize: function () {
        this.clearCache();
    },

    /**
     * 设置mapView对象
     * @param {MapView}
     */
    setMapView: function (mapView) {
        this.mapView = mapView;
        this.map = mapView.getMap();
        this.bindSpotClickEvent();
    },

    /**
     * 绑定麻点点击的事件
     */
    bindSpotClickEvent: function () {
        var me = this;
        if (this.binded) {
            return;
        }

        this.binded = true;
        var hotspotClickHandler = function (e) {
            var iwOverlay = me.mapView.iwController.get();
            if (iwOverlay.skipClickHandler) return;

            var spotArr = e.spots;

            // 点击非麻点，如图区其他部分            
            if (!spotArr || spotArr.length < 1 || !(spotArr[0].getUserData().tag) || spotArr[0].getUserData().tag != "GR_DATA") {
                if (me.marker) {
                    me.map.removeOverlay(me.marker);
                    me.marker = null;
                }
                return;
            }

            me.onGRHotspotClick && me.onGRHotspotClick(e);

            var userData = spotArr[0].getUserData().userdata;
            var uid = userData.uid;
            var name = userData.name;

            me.showPoiInfoWindow(spotArr[0].getPosition(), uid, name);
        };

        listener.on('infowindow.' + mapConst.IW_GRT, 'click', function (name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;

            switch(id) {
                case 'iw-l':
                    instance.nbSearch(data.name, data.geo);
                    break;
                case 'iw-c':
                    instance.detailSearch(data.uid);
                    break;
                case 'iw-r':
                    instance.lineSearch(data.name, data.geo);
                    break;
                default:
                    break;
            }
        });

        this.map.addEventListener("onhotspotclick", hotspotClickHandler);
    },

    /**
     * 初始化设置数据
     * API方法
     * @public
     * @param {json} 检索的原始数据
     */
    setGRData: function (json) {
        if (!json) return;
        this.json = json;

        // 重新设置状态
        this.clearListener();
        this.resetStatus();
    },

    /**
     * 重新设置状态
     */
    resetStatus: function () {
        /*是否普通检索，还是全国检索*/
        var type = this.json.result.type.toString();
        if (!this.types[type]) return;
        this.isGRequest = true;
        if (this.types[type].t == 1) {
            // 重新添加底图
            this.addGRMap();
            // 重新添加底图麻点数据处理
            this.addMDRequest();
        } else if (this.types[type].t == 2) {
            this.clearGRMap();
            this.clearListener();
        }
        // 添加地图事件监控
        this.addMDEvent();
        // 保存当前的地图中心点
        this.curCenterPoint = this.map.centerPoint;
    },
    /**
     * 清除麻点缓存、底图、地图事件监控
     * 更换wd或组件时调用
     */
    clearCache: function () {
        //this.json = null;
        this.isGRequest = false;
        this.genDataLst = {};
        this.genDataIdLis = [];
        this.spotOnId = "";
        this.curBoundTiles = [];
        if (this.marker) {
            this.map.removeOverlay(this.marker);
            this.marker = null;
        }
        this.clearListener();
        this.map.clearHotspots();
        this.qWord = "";
        this.qCity = -1;
        this.clearGRMap();
    },
    /**
     * 清除事件监听
     */
    clearListener: function () {
        if (!this.map) {
            return;
        }

        this.map.removeEventListener("load", window.bindMDRequest);
        this.map.removeEventListener("moveend", window.bindMDRequest);
        this.map.removeEventListener("zoomend", window.bindMDRequest);
        this.map.removeEventListener("mapcontainerresize", window.bindMDRequest);
    },
    /**
     * 清除已存在的地图
     */
    clearGRMap: function () {
        var tilelayer = GenRequest.MDLayer;
        if (tilelayer) {
            this.map.removeTileLayer(tilelayer);
            this.qWord = "";
            this.qCity = -1;
            this.genDataLst = {};
            this.genDataIdLis = [];
        }
        GenRequest.MDLayer = null;

        // 隐藏气泡
        if (this.marker) {
            this.marker.hide();
        }
    },
    /**
     * 重新添加栅格麻点图
     */
    addGRMap: function () {
        if (!this.json) return;

        var wd = this.json.result.return_query || "";
        if (this.qWord != wd || this.qCity != loc.getCityCode()) {
            this.clearGRMap();
            if (this.json.result.type == 38 && this.map.zoomLevel < 11) return;

            this.qWord = wd;
            this.qCity = loc.getCityCode().cityCode;
            var bounds = new BMap.Bounds(-21364736, -10616832, 23855104, 15859712);
            var mdLayer = new MDLayer({
                json: this.json,
                transparentPng: false
            });
            this.map.addTileLayer(mdLayer);
            GenRequest.MDLayer = mdLayer;
        }
    },
    /**
     * 发送麻点图数据请求
     */
    sendMDRequest: function () {
        var me = this;
        setTimeout(function () {
            me._sendMDRequest();
        }, 1);
    },
    /**
     * 视野变化时，请求新的底图数据
     */
    _sendMDRequest: function () {
        var me = this;
        if (!me.json || !me.isGRequest) return;
        var tPOIs = this.map.getViewTiles();
        var ids = [];
        this.curBoundTiles = [];
        for (var i = 0, n = tPOIs.length; i < n; i++) {
            var tId = this.map.getZoom() + "_" + tPOIs[i].x + "_" + tPOIs[i].y;
            this.curBoundTiles.push(tId);
            if (!me.genDataLst[tId]) { // 需要限制9张
                ids.push(tPOIs[i].x + "_" + tPOIs[i].y);
            }
        }
        if (ids.length == 0) return;
        this.map.clearHotspots();
        var url = [];
        url.push("/?qt=");
        url.push("bkg_data&c=" + loc.getCityCode() + "&ie=utf-8&wd=" + encodeURIComponent(me.json.result.return_query));
        if (window["placeParam"]) {
            url.push(window["placeParam"]);
        }
        //麻点抽稀 by yangjian01
        url.push("&rn=4");
        var b = this.map.getBounds();
        var bs = "(" + b.getSouthWest().lng + "," + b.getSouthWest().lat + ";" + b.getNorthEast().lng + "," + b.getNorthEast().lat + ")";
        url.push("&l=" + this.map.zoomLevel + "&xy=" + ids.join(",") + "&callback=getMData&b=" + bs);
        $.ajaxJSONP({
            url: url.join("")
        });
    },
    /**
     * 添加底图麻点数据处理
     */
    addMDRequest: function () {
        this.sendMDRequest();
    },
    /**
     * 点击麻点数据，添加蓝色气泡和POI弹框
     */
    showPoiInfoWindow: function (pt, uid, name) {
        if (!pt || !uid || !name) return;

        pt = new BMap.Point(pt.lng, pt.lat);

        // 绘制蓝色气泡
        if (this.marker) {
            this.marker.setPoint(pt);
        } else {
            this.marker = this.addGRMarker(pt);
        }
        this.marker.show();

        // 弹出弹框
        iwOverlay = this.mapView.iwController.get(mapConst.IW_GRT);
        iwOverlay.setData(mapConst.IW_GRT, {
            json: {
                uid: uid,
                name: name,
                geo: "1|" + pt.lng + ',' + pt.lat
            }
        }).switchTo(0);
        // 跳过底图可点弹框
        iwOverlay.skipClickHandler = true;
    },
    /**
     * 添加泛需求的蓝marker
     * @param {Point} 坐标点
     * @return {Marker} 标注
     */
    addGRMarker: function(point) {
        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(23, 32), {
            anchor: new BMap.Size(12, 32),
            imageOffset: new BMap.Size(29, 352)
        });

        var marker = new this.mapView.CustomMarker(icon, point, {
            className: "fix_gr_mk"
        });

        this.map.addOverlay(marker);

        return marker;
    },
    /**
     * "i=uid,****"格式url落地，指定麻点展现
     * API方法
     * @public
     */
    sendInfRequest: function (uid) {
        if (!uid) return;
        var me = this;
        var pars = "qt=inf&uid=" + uid;
        searchData.fetch(pars, function (data) {
            var c = data.content;
            var pt = util.getPointByStr(util.parseGeo(c.geo).points);
            me.showPoiInfoWindow(pt, uid, c.name);
        });
    },
    /**
     * 麻点数据获取后的回调函数
     * @param {json} 获取的最新数据
     *   json = [
     *        {"uid_num":50, "err_no":0, "tileid":"12_790_294", "uids":[]},
     *        .....
     *        {"uid_num":50, "err_no":0, "tileid":"12_790_294", "uids":[]}
     *   ]
     */
    getGRData: function (json) {
        if (!json) return;
        for (var i = 0, n = json.length; i < n; i++) {
            var j = [];
            var js = json[i];
            for (var ii = 0, nn = js.uids.length; ii < nn; ii++) {
                j.push({
                    pt: new BMap.Point(js.uids[ii].x, js.uids[ii].y),
                    bd: [30, 16, 0, 16],
                    userdata: {
                        name: js.uids[ii].name,
                        uid: js.uids[ii].uid
                    },
                    tag: "GR_DATA"
                });
            }

            this.genDataLst[js.tileid] = j;
            this.genDataIdLis.push(js.tileid.toString());
            if (this.genDataIdLis.length > 30) {
                // 存储超出30张瓦片数据时，删除使用频率最小的一张数据
                var delId = this.genDataIdLis.shift();
                delete(this.genDataLst[delId]);
                delete delId;
            }
        }

        for (var i = 0, n = this.curBoundTiles.length; i < n; i++) {
            if (this.genDataLst[this.curBoundTiles[i]]) {
                var tmpD = this.genDataLst[this.curBoundTiles[i]];
                for (var ii = 0, nn = tmpD.length; ii < nn; ii++) {
                    var spotData = new BMap.Hotspot(tmpD[ii].pt, {
                        userData: tmpD[ii],
                        offsets: tmpD[ii].bd
                    });
                    this.map.addHotspot(spotData);

                }
            }
        }
    },

    /**
     * 判断是否移动够距离发起检索
     */
    hasNotMoved: function () {
        if (!this.curCenterPoint) {
            return true;
        }

        // 排除地图未初始化时就开始加载麻点图的情况
        if (this.curCenterPoint.lng === 0 && this.curCenterPoint.lat === 0) {
            this.curCenterPoint = this.map.centerPoint;
        }

        var px1 = this.map.pointToPixel(this.curCenterPoint);
        var px2 = this.map.pointToPixel(this.map.centerPoint);
        var dx = Math.abs(px1.x - px2.x);
        var dy = Math.abs(px1.y - px2.y);

        // 更新保存地图中心点
        this.curCenterPoint = this.map.centerPoint;

        if (dx >= 0.6 * this.map.width || dy >= 0.6 * this.map.height) {
            return false;
        }

        return true;
    },

    /**
     * 给缩放拖动增加泛需求请求事件的绑定
     */
    addMDEvent: function () {
        var me = this;

        // 优化，这里绑定一个事件处理函数
        if (!window.bindMDRequest) {
            window.bindMDRequest = function (evt) {
                if (evt.type === 'onmoveend' && me.hasNotMoved()) {
                    return;
                }
                me.sendMDRequest();
            };
        }

        this.map.addEventListener("load", window.bindMDRequest);
        this.map.addEventListener("moveend", window.bindMDRequest);
        this.map.addEventListener("zoomend", window.bindMDRequest);
        this.map.addEventListener("mapcontainerresize", window.bindMDRequest);
    }
});

/**
 * JSONP方式请求数据，全局回调函数
 */
window.getMData = function (json) {
    if (!json) return;
    var GRControl = require('place:widget/genericrequest/genericrequest.js');
    GRControl.getGRData(json);
};

module.exports = new GenRequest();

});
;define('place:widget/genericre/genericre-vector.js', function(require, exports, module){

/**
 * @fileOverview矢量麻点对原栅格麻点进行适配
 * @author yuanzhijia@baidu.com
 * @data 2013-12-03
 */
var BMap,
    mapConst = require('common:static/js/mapconst.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js'),
    GenericreVector = GenericreVector || {};
$.extend(GenericreVector, {
    init: function() {
        this.bind();
    },
    bind: function() {
        var me = this;
        if (me.hasbinded) {
            return;
        };
        me.hasbinded = true;
        listener.on('infowindow.' + mapConst.IW_GRT, 'click', function(name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;
            switch (id) {
                case 'iw-l':
                    instance.nbSearch(data.name, data.geo);
                    break;
                case 'iw-c':
                    instance.detailSearch(data.uid);
                    break;
                case 'iw-r':
                    instance.lineSearch(data.name, data.geo);
                    break;
                default:
                    break;
            }
        });
        var map = me.map;
        // 矢量底图可点
        map.addEventListener("click", function(e) {
            if (me.marker) {
                me.map.removeOverlay(me.marker);
                me.marker = null;
            }
            return;
        });
        map.addEventListener("onvectorclick", function(e) {
            var iconInfo = e.iconInfo;
            if (e.from == 'madian') {
                //添加蓝点
                var pt = new BMap.Point(iconInfo.point.x, iconInfo.point.y),
                    iwOverlay = me.mapView.iwController.get(mapConst.IW_GRT);
                /*添加蓝点*/
                if (me.marker) {
                    me.marker.setPoint(pt);
                } else {
                    me.marker = me.addGRMarker(pt);
                }
                me.marker.show();
                iwOverlay.setData(mapConst.IW_GRT, {
                    json: [{
                        uid: iconInfo.uid,
                        name: iconInfo.name,
                        geo: "1|" + pt.lng + ',' + pt.lat
                    }]
                }).switchTo(0);
                // 泛需求麻点marker点击量
                stat.addStat(COM_STAT_CODE.MAP_GR_MARKER_CLICK);
                // 跳过底图可点弹框
                iwOverlay.skipClickHandler = true;
            }
        });
    },
    addGRMarker: function(point) {
        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(23, 32), {
            anchor: new BMap.Size(11, 30),
            imageOffset: new BMap.Size(29, 352)
        });

        var marker = new this.mapView.CustomMarker(icon, point, {
            className: "fix_gr_mk"
        });

        this.map.addOverlay(marker);
        return marker;
    },
    setMapView: function(mapView) {
        //初始化map对象
        var me = this;
        me.mapView = mapView;
        me.map = mapView.getMap();
        BMap = mapView.getBMap();
        //初始化矢量适配类
        if (!me.hasbinded) {
            me.init();
        }
    },
    setGRData: function(data) {
        //初始化矢量麻点layer  将data传递给api
        var keyWord = encodeURIComponent(data['result']['return_query']),
            cityCode = locator.getCityCode() || 1,
            me = this,
            vectorMap = me.map;
        if (data.current_city) {
            if ('code' in data.current_city) {
                cityCode = data['current_city']['code'];
            };
        };
        me.vectorMdLayer = new BMap.VectorMDLayer(keyWord, cityCode);
        vectorMap.addTileLayer(me.vectorMdLayer)
    },
    clearCache: function() {
        //矢量麻点自动消除
        var me = this,
            vectorMap = me.map;
        vectorMap.removeTileLayer(me.vectorMdLayer);
        return;
    }
});
module.exports = GenericreVector;

});
;define('place:widget/genericre/genericre.js', function(require, exports, module){

/**
 * @fileOverview place地图hlper适配类
 * @author yuanzhijia@baidu.com
 * @data 2013-12-02
 */
var GenericreTiles = require('place:widget/genericre/genericre-tiles.js'),//栅格麻点
      GenericreVector = require('place:widget/genericre/genericre-vector.js');//矢量麻点
var Genericre = Genericre  || {};
Genericre = {
    init:function  (type) {
        /*默认为矢量麻点   如需栅格麻点请传titls*/
        if (type && (type == "titlsmd")) {
            GenericreVector = GenericreTiles;
        };
        return GenericreVector;
    }
};
//适配矢量麻点还是栅格麻点
module.exports = Genericre;

});
;define('place:widget/gotomovie/gotomovie.js', function(require, exports, module){

/**
 */
'use strict';



var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js');  //商户电话

stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_SHOW);
/**
 * 绑定事件
 */
function bindEvents() {
    var $telephone = $('#detail-phone');
    $telephone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    var $telephone = $('#detail-phone');
    $telephone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var wd = $('.common-widget-nav .title span').text(),
        name = $('.place-widget-captain').find('.name').text();

    stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_CLICK, {'wd': wd, 'name':name});

    var  $target = $(e.target).closest('a');
    if(util.isAndroid()){
        $target.attr('href','javascript:void(0)');
        util.TelBox.showTb($target.attr('data-tel'));
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/telephone
 */
module.exports = {
    init: function() {
        bindEvents();

    }
};

});
;define('place:widget/groupon/groupon.js', function(require, exports, module){

/**
 * @file groupon-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var $uls = $('.place-widget-groupon-main'), //团购信息层元素集合
    $prev = $('.place-widget-groupon-pagenum-prev'), //上一页元素
    $next = $('.place-widget-groupon-pagenum-next'), //上一页元素
    $curpage = $('.place-widget-groupon-curpage'), //当前页面元素
    $totalpage = $('.place-widget-groupon-totalpage'), //总页数
    stat = require('common:widget/stat/stat.js'),
    statData;

/**
 * 跳转到团购详情页
 * @param {event} e 事件对象
 */
function gotoSee(e) {
    'use strict';

    var url = $(e.target).closest('ul').attr('url'),
        dest = $('.place-widget-groupon-site').text();

    stat.addStat(STAT_CODE.PLACE_GROUPON_CLICK, {'wd': statData.wd, 'name': statData.name, 'dest':dest, 'srcname': statData.srcname});

    window.open(url);

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示上一页
 * @param {event} e 事件对象
 */
function goPrev(e) {
    var cp = $curpage.html()-0; //当前页面索引

    if($next.hasClass('place-widget-groupon-disable')){
        $next.removeClass('place-widget-groupon-disable');
    }

    if(!$prev.hasClass('place-widget-groupon-disable')){
        $next.on('click', goNext);

        $uls.hide();
        $uls.eq(cp-2).show();
        $curpage.html(cp-1);
        if(cp-2==0){
            $prev.addClass('place-widget-groupon-disable');
            $prev.off('click', goPrev);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function goNext(e) {
    var cp = $curpage.html() - 0, //当前页面索引
        total = $totalpage.html() - 0; //总页数

    if($prev.hasClass('place-widget-groupon-disable')){
        $prev.removeClass('place-widget-groupon-disable');
    }


    if(!$next.hasClass('place-widget-groupon-disable')){
        $prev.on('click', goPrev);

        $uls.hide();
        $uls.eq(cp).show();
        $curpage.html(cp+1);
        if(cp+1==total){
            $next.addClass('place-widget-groupon-disable');
            $next.off('click', goNext);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/groupon
 */
module.exports = {

    init: function( data ) {
        'use strict';

        var total = $totalpage.html()-0; //总页数
        
        statData = data || {};

        $uls.on('click', gotoSee);
        if(total>1){
            $prev.on('click', goPrev);
            $next.on('click', goNext);
        }


        stat.addStat(STAT_CODE.PLACE_GROUPON_VIEW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};

});
;define('place:widget/helper/maphelper.js', function(require, exports, module){

/**
 * @fileOverview 列表页地图页
 * @author shegnxuanwei@baidu.com
 * @data 2013-10-29
 */

var mapConst = require('common:static/js/mapconst.js'),
    url = require('common:widget/url/url.js'),
    util = require('common:static/js/util.js'),
    locator = require('common:widget/geolocation/location.js'),
    searchData = require('common:static/js/searchdata.js'),
    GRControl = (require('place:widget/genericre/genericre.js')).init(),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    /**
     * 当前选中的标注点的索引
     */
    _selectedIndex: -999,

    // 多义线自定义样式，根据索引值确定
    polylineStyles: [{
        stroke: 6,
        color: "#3a6bdb",
        opacity: 0.65
    }, {
        stroke: 6,
        color: "#3a6bdb",
        opacity: 0.75
    }, {
        stroke: 4,
        color: "#30a208",
        opacity: 0.65,
        // strokeStyle: "dashed"
    }, {
        stroke: 5,
        color: "#3a6bdb",
        opacity: 0.65
    }, {
        stroke: 6,
        color: "#3a6bdb",
        opacity: 0.5
    }, {
        stroke: 4,
        color: "#30a208",
        opacity: 0.5,
        strokeStyle: "dashed"
    }, {
        stroke: 4,
        color: "#575757",
        opacity: 0.65,
        strokeStyle: "dashed"
    }],

    // POI气泡
    poiMarkers: [],

    // 公交、地铁线路，目前只显示一条
    transitLines: [],

    // 道路的polyline对象集合
    roadPolylines: [],

    // 公交线路的polyline对象
    transitPolylines: [],

    // 公交站点点坐标
    stationPoints: [],

    // 公交站点标注
    stationMarkers: [],

    /**
     * 初始化方法
     * @param  {Object} BMap BMap单例，由外部异步请求赋值
     * @param  {Object} data 后端sAction返回数据
     */
    init: function (mapView, BMap, data, searchDataResult) {
        this.mapView = mapView || require('common:widget/map/map.js'); // map二次封装实例
        this.BMap = BMap || require('common:widget/map/map.js'); // BMap API
        this.map = this.mapView.getMap(); // map地图实例
        // 保存详情页进入时检索的searchDataResult，列表进详情采用列表数据searchDataResult
        this.data = searchDataResult && searchDataResult.content ? searchDataResult : data;
        
        // 重置选择点序号，保证重复进入时能重新选择新序号
        this._selectedIndex = -999;

        var curUrl = url.get(),
            query = curUrl.query,
            pageState = curUrl.pageState,
            index = pageState.i || 0;

        delete pageState['vt'];
        delete pageState['i'];

        var isSingle = false; // isSingle表示单点，即通过uid展现的poi或者任意分享点
        var newId = $.param(query) + '|' + $.param(pageState); // uid根据query和pagestate确定唯一性
        var curId = this.mapView.displayId;

        // 现在去掉此策略
        // if (newId != curId) {
            // 移除底图所有Overlays
            // 这里设计接口放在BMap里统一协调处理
            this.mapView.clearOverlays();

            // 添加Poi到Overlays
            this.addPoiOverlays(this.data, curUrl);

            // 添加泛需求麻点
            this.mapView.displayId = newId;
        // }

        // 选择对应的poi点
        // index字段格式例如'uid,xxxx'
        if (typeof index == 'string' && index.split(',')[0] == 'uid') {
            this.selectHotspotMarker(index.split(',')[1]);
        } else {
            this.selectPoiMarker(index);
        }
    },

    /**
     * 添加地图覆盖物(Overlays)，并设置地图视野(Viewport)
     * @param {Object} sAction返回数据
     * @param {Object} url对象
     */
    addPoiOverlays: function (data, curUrl) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var query = curUrl.query,
            pageState = curUrl.pageState;
        var isShowAll = data.listInfo ?　data.listInfo.isShowAll : undefined;
        var mapData = this.processMapData(data, curUrl.pageState, isShowAll);
        var cityCode = mapData.currentCity ? mapData.currentCity.code : 1;
        var nbSearchResultType = [36, 38, 39]; // 表示周边搜索的type，用于判断是否添加中心点标注

        if (!mapData.isSharePoint && mapData.points.length > 0) {
            // 添加标注覆盖物和信息窗口
            this.addPoiMarkers(mapData.points);

            mapView.iwController.get(mapConst.IW_POI).setData(mapConst.IW_POI, {
                json: mapData.content,
                cityCode: cityCode
            }).switchTo(0);

            listener.on('infowindow.' + mapConst.IW_POI, 'click', function (name, evt) {
                var id = evt.id,
                    data = evt.data,
                    instance = evt.instance;

                switch(id) {
                    case 'iw-l':
                        instance.nbSearch(data.name, data.geo);
                        break;
                    case 'iw-c':
                        instance.detailSearch(data.uid);
                        break;
                    case 'iw-r':
                        instance.lineSearch(data.name, data.geo);
                        break;
                    default:
                        break;
                }
            });

            // 检查是否需要添加周边检索的中心点标注
            if (nbSearchResultType.indexOf(mapData.resultType) > -1 &&
                query.center_rank == 1 &&
                query.nb_x && query.nb_y) {
                this.addCenterPoiMarker(new BMap.Point(query.nb_x, query.nb_y));
            }
        } else { // 如果没有poiMarkers，包括共享点和单纯公交(717)或者道路(玲珑路)
            me.poiMarkers = [];
            me.mapView.poiMarkers = [];
        }

        // todo
        // 任意点分享
        if (mapData.isSharePoint && mapData.points.length > 0) {
            this.addSingleMarker(mapData.points[0], mapData.content[0]);

            mapView.iwController.get(mapConst.IW_SHR).setData(mapConst.IW_SHR, {
                json: mapData.content
            }).switchTo(0);

            listener.on('infowindow.' + mapConst.IW_SHR, 'click', function (event, data) {
            });
        }

        // isSingle表示单点，即通过uid展现的poi或者任意分享点
        // 泛需求底图处理
        if (!mapData.isSingle) {
            this.addGRHotspotsLayer(this.data); // 通过详情result和列表data获取
        }

        this.transitLines = mapData.transitLines; // 处理线路和气泡均显示时，Marker点击的序号需要顺延

        // 添加线路
        if (this.transitLines.length > 0) {
            // 列表通常是2条线路，但展示地图时仅显示第一条
            this.addTransitPolyline(this.transitLines[0], function (data) {
                // 视野由所有的poi点以及公交线路上所有站点来决定
                mapView.setViewport(data.stationPoints.concat(mapData.points));
            });
        } else {
            // 根据坐标设置地图视野
            mapView.setViewport(mapData.points);
        }

        // 增加底图可点气泡消失策略
        map.addEventListener("onvectorclick", function (e) {
            var iconInfo = e.iconInfo;
            if (iconInfo.uid && iconInfo.name && iconInfo.point) {
                me.switchSelectedMarker(-999);
            }
        });
    },

    /**
     * 为地图展示准备poi数据，这里需要考虑强展现情况
     * @param {Object} 原始数据，应至少包含content字段
     * @param {Object} json化的pageState部分
     * @param {boolean} 是否展现所有数据，该内容由后端数据接口返回
     */
    processMapData: function (data, pageState, isShowAll) {
        if (!data) return;

        var result = {
            points: [],
            content: [],
            transitLines: [],
            isSingle: false,
            resultType: data.result.type,
            currentCity: data.current_city
        };

        // 是否全部显示还要考虑pageState，如果showall为1表明用户在界面上点击了显示全部
        var showAllOnMap;
        if (typeof isShowAll != 'undefined') {
            showAllOnMap = isShowAll || !! (pageState && pageState.showall == 1);
        } else {
            // 在详情页，没有showStatus，只能根据pageState来判断
            showAllOnMap = !! (pageState && pageState.showall == 1);
        }
        // 如果是泛需求，则认为一定没有强展现，即都展现
        if (result.resultType != 11) {
            showAllOnMap = true;
        }
        var poiResults = data.content;

        // 解析坐标
        if (poiResults instanceof Array) {
            // 通常为一个列表结果
            for (var i = 0; i < poiResults.length; i++) {
                var curPoi = poiResults[i];
                if (!showAllOnMap && curPoi.acc_flag != 1) {
                    // 强展现状态且该点属于非强展现点
                    continue;
                }
            
                if (curPoi.poiType == mapConst.POI_TYPE_BUSLINE ||
                    curPoi.poiType == mapConst.POI_TYPE_SUBLINE) {
                    // 只在map上显示一条
                    result.transitLines.push(curPoi);
                    // 线路类型不记入poi数组中
                    continue;
                }
                var geo = util.parseGeo(curPoi.geo);
                result.points.push(util.getPointByStr(geo.points));
                result.content.push(curPoi);
            }
        } else {
            // 认为poiResults就是一个对象，一般通过uid获取单个poi数据
            if (!poiResults.geo && poiResults.point) { // PC用户标记任意点，分享过来，数据来自于userflag/share.php
                var formatPoint = poiResults.point.replace('|', ',');
                // 将任意点坐标转换成poi单点坐标结构，为了后续数据处理保持统一
                poiResults.geo = "1|" + formatPoint + ';' + formatPoint + '|' + formatPoint;
                poiResults.poiType = mapConst.POI_TYPE_NORMAL;
                poiResults.name = poiResults.title;
                result.isSharePoint = true; // 但是，这里缺phpui逻辑... todo
            }
            var geo = util.parseGeo(poiResults.geo);
            if (poiResults.poiType != mapConst.POI_TYPE_BUSLINE &&
                poiResults.poiType != mapConst.POI_TYPE_SUBLINE) {
                result.points.push(util.getPointByStr(geo.points));
                result.content.push(poiResults);
            } else {
                // 这个“点”是条公交或地铁线路
                result.transitLines.push(poiResults);
            }

            result.isSingle = true;
        }

        return result;
    },

    /**
     * 添加poi搜索的标注，通过添加坐标点数组来创建，通常数组长度为10
     * @param {Array<Point>} 坐标点数组
     * @return {Array<Marker>} 标注数组
     */
    addPoiMarkers: function (points) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var markers = [];
        for (var i = 0, len = points.length; i < len; i++) {
            // 闭包为了保持回调函数里的index索引值
            (function () {
                var index = i;
                var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(21, 30), {
                    anchor: new BMap.Size(11, 30),
                    imageOffset: new BMap.Size(0, 32 * index)
                });

                var marker = new mapView.CustomMarker(icon, points[index], {
                    className: "mkr_trans",
                    isAnimation: false,
                    click: function () {
                        // POImarker点击量
                        stat.addStat(COM_STAT_CODE.MAP_POI_MARKER_CLICK);

                        me.selectPoiMarker(index + me.transitLines.length);
                    }
                });

                map.addOverlay(marker);
                markers.push(marker);
            })();
        }
        me.poiMarkers = markers;
        me.mapView.poiMarkers = markers; // 设置到mapView，保证有POI气泡时不自动显示定位iw

        return markers;
    },

    /**
     * 增加泛需求麻点
     * 需要异步请求泛需求数据，然后再铺图
     */
    addGRHotspotsLayer: function (data) {
        var me = this,
            mapView = this.mapView;

        // resultType不是11就说明有泛需求内容, 11表示普通检索列表页
        if (!data || !data.result || !data.result.type || data.result.type == 11) {
            return;
        }

        me.grControl = mapView.grControl = GRControl;
        GRControl.setMapView(mapView);
        GRControl.setGRData(data);
        // 增加泛需求麻点click回调方法
        GRControl.onGRHotspotClick = function (evt) {
            // 泛需求麻点marker点击量
            stat.addStat(COM_STAT_CODE.MAP_GR_MARKER_CLICK);

            me.switchSelectedMarker(-999);
        };
    },

    /**
     * 为周边检索添加中心的蓝色箭头水滴标识
     * @param {Point} 坐标点
     * @return {Marker} 标注
     */
    addCenterPoiMarker: function (point) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(22, 30), {
            anchor: new BMap.Size(11, 30),
            imageOffset: new BMap.Size(29, 320)
        });

        var marker = new mapView.CustomMarker(icon, point, {
            className: "mkr_trans",
            click: function () {
                // POImarker点击量
                stat.addStat(COM_STAT_CODE.MAP_POI_MARKER_CLICK);

                me.setCenterMarker(-999);
            }
        });

        map.addOverlay(marker);
        marker.setZIndex(250);
        this.centerPoiMarker = marker;

        return marker;
    },

    /**
     * 移除周边检索中心点标注
     */
    removeNbCenterMarker: function () {
        if (this.centerPoiMarker) {
            this.map.removeOverlay(this.centerPoiMarker);
            this.centerPoiMarker = null;
        }
    },

    /**
     * PC任意点分享过来
     * 添加单点marker，蓝色无图案标注
     * @param {Point} 点的point对象
     * @param {Object} 贡献位置点的内容信息
     * @return {Marker} 标注
     */
    addSingleMarker: function (point, content) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(23, 32), {
            anchor: new BMap.Size(12, 32),
            imageOffset: new BMap.Size(29, 352)
        });

        var marker = new mapView.CustomMarker(icon, point, {
            className: "fix_gr_mk",
            click: function () {
                // POImarker点击量
                stat.addStat(COM_STAT_CODE.MAP_POI_MARKER_CLICK);

                mapView.iwController.get(mapConst.IW_POI).setData(mapConst.IW_POI, {
                    json: content
                }).switchTo(0);
            }
        });

        map.addOverlay(marker);

        return marker;
    },

    /**
     * 增加公交、地铁线路，例如112路
     * @param {Object} 格式化之后的数据
     * @param {Function} 添加完成之后的回调函数，因为需要异步获取数据
     */
    addTransitPolyline: function (line, cbk) {
        var me = this;

        var queryData = {
            qt: 'bsl',
            uid: line.uid,
            c: line.area
        };
        searchData.fetch(util.jsonToUrl(queryData), function (data) {

            // 移除上一次的线路覆盖物
            for (var i = 0; i < me.stationMarkers.length; i++) {
                me.removePoiOverlay(me.stationMarkers[i]);
            }

            // 移除上一次的线路画线
            for (var j = 0; j < me.transitPolylines.length; j++) {
                me.removeTransitPolyline(me.transitPolylines[j]);
            }

            // 只绘制第一条线路
            firstLine = data.content[0];

            // 绘制线路
            var line = util.parseGeo(firstLine.geo);
            if (line && line.type == 2) {
                var transitPloyline = me.addPolyline(line.points, mapConst.ROUTE_TYPE_BUS);
                me.transitPolylines.push(transitPloyline);
            }

            // 添加站点，这里改变原来的逻辑
            // 如果没有站点也调用回调函数
            if (firstLine && 　firstLine.stations) {
                me.stationPoints = [];
                me.stationMarkers = [];

                var stations = firstLine.stations;
                for (var k = 0, l = stations.length; k < l; k++) {
                    var geo = util.parseGeo(stations[k].geo);
                    if (geo.type == 1) {
                        // 公交、地铁站点圈圈和气泡
                        var point = util.getPoiPoint(geo.points);
                        me.stationPoints.push(point);
                        var marker = me.addStationMarker(point);
                        me.stationMarkers.push(marker);
                    }
                }
            }

            cbk && cbk({
                'firstLine': firstLine,
                'stationPoints': me.stationPoints
            });
        });
    },

    /**
     * 移除Poi覆盖物
     */
    removePoiOverlay: function (overlay) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        map.removeOverlay(overlay);
        overlay = null;
    },

    /**
     * 移除当前线路
     * @param {PolyLine} polyline
     */
    removeTransitPolyline: function (polyline) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        // 将元素从transitPolylines数组中移除
        var index = $.inArray(polyline, this.transitPolylines);
        if (index > -1) {
            this.transitPolylines.splice(index, 1);
        }

        // 移除装饰线
        if (polyline && polyline._decorativePolyline &&
            polyline._decorativePolyline instanceof BMap.Polyline) {
            map.removeOverlay(polyline._decorativePolyline);
            polyline._decorativePolyline = null;
        }

        // 移除线路主体线
        map.removeOverlay(polyline);
        polyline = null;
    },

    /**
     * 为搜索结果、公交、驾车导航结果在地图上添加路线
     * @param {string} 地理坐标
     * @param {int}   类型常量
     */
    addPolyline: function (points, type) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        if (typeof type == "undefined") {
            type = 0;
        }

        var style = this.polylineStyles[type];
        if (!style) {
            return;
        }

        var opts = {
            strokeWeight: style.stroke,
            strokeColor: style.color,
            strokeOpacity: style.opacity,
            strokeStyle: style.strokeStyle,
        };
        var polyline = new BMap.Polyline(points, opts);
        polyline._routeType = type; // 保存多义线类型
        map.addOverlay(polyline);

        // 增加装饰线
        if (type == mapConst.ROUTE_TYPE_BUS) {
            var decorativePolyline = new BMap.Polyline(points, {
                strokeWeight: style.stroke - 2,
                strokeColor: "#fff",
                strokeOpacity: 0.3
            });
            polyline._decorativePolyline = decorativePolyline;
            map.addOverlay(decorativePolyline);
        }

        return polyline;
    },

    /**
     * 添加公交站点气泡
     * @param {Point} 地理坐标
     */
    addStationMarker: function (point) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var icon = new BMap.Icon(mapConst.DEST_MKR_PATH, new BMap.Size(11, 11), {
            anchor: new BMap.Size(5, 5),
            imageOffset: new BMap.Size(80, 15)
        });
        var marker = new mapView.CustomMarker(icon, point, {
            className: "dest_mkr"
        });
        map.addOverlay(marker);
        return marker;
    },

    /**
     * 高亮选中某麻点气泡
     * @param  {string} uid
     */
    selectHotspotMarker: function (uid) {
        var BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;
        // 其实这里就是请求qt=inf，然后弹出POI弹框
        // 有必要从genericrequest.js抽离
        GRControl.setMapView(mapView);
        GRControl.sendInfRequest(uid);
    },

    /**
     * 高亮选中某POI气泡
     * @param  {int} index 列表结果索引值（0-9）
     */
    selectPoiMarker: function (index) {
        index = parseInt(index, 10);
        if (isNaN(index)) {
            return;
        }

        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        index = index - this.transitLines.length;
        // 兼容inf接口后端只返回一条记录，而不像webapp一样返回数组，shengxuanwei
        index = Math.min(index, this.poiMarkers.length - 1);

        if (this._selectedIndex == index) {
            // 这里要重新显示信息窗口，仅处理普通点
            // 解决在地图上点击正处于选择状态的点
            if (index > -1) {
                // 选择的是普通点
                // iwControl.switchTo(0, index, this.transitLines.length);
            }
            return;
        }

        this.clearRoadPolylines();

        // 取消泛需求点的选择
        if (this.grControl && this.grControl.marker) {
            this.grControl.marker.hide();
        }

        if (index > -1) {
            var iwOverlay = mapView.iwController.get(mapConst.IW_POI);
            // 选择的是普通点
            iwOverlay.switchTo(index); // todo this.transitLines.length

            // 变换标注索引，用于poi检索的10个标注的切换
            this.switchSelectedMarker(index);

            // 检测POI是否为道路类型，如果是添加道路的多义线
            var poiData = iwOverlay.getPoiData();
            if (poiData && poiData.ty == mapConst.GEO_TYPE_LINE) {
                this.addRoadPolylines(poiData);
            }

            // 变换中心点
            this.setCenterMarker(index);
        } else {
            // 选择的是公交线路
            var newIndex = index + this.transitLines.length;
            if (this.transitLines[newIndex]) {
                this.addTransitPolyline(this.transitLines[newIndex], function (data) {
                    // 视野由所有的poi点以及公交线路上所有站点来决定
                    mapView.setViewport(data.stationPoints);

                    // infoWindow显示在第一个站点
                    var firstLine = data.firstLine,
                        firstStation = firstLine.stations[0],
                        point = util.geoToPoint(firstStation.geo);
                    // 这里调用trsInfoWindow，所以数据格式需要mock交通类数据格式
                    mapView.iwController.get(mapConst.IW_BSL).setData(mapConst.IW_BSL, {
                        json: [{
                            content: "<b>{0}</b>".format(firstLine.name),
                            uid: firstStation.uid
                        }],
                        points: [{
                            p: point.lng + "," + point.lat
                        }]
                    }).switchTo(0);

                    listener.on('infowindow.' + mapConst.IW_BSL, 'click', function (event, data) {
                        var instance = data.instance;

                        // 公交气泡进详情
                        stat.addStat(COM_STAT_CODE.MAP_IW_BSL_DETAIL);

                        url.update({
                            module: 'place',
                            action: 'detail',
                            query: {
                                foo: 'bar'
                            },
                            pageState: {
                                vt: 'list',
                                i: instance.index
                            }
                        }, {
                            trigger: true,
                            queryReplace: false,
                            pageStateReplace: true
                        });
                    });
                });
            }
        }

        this._selectedIndex = index;

        // todo, update hash
        // app.updateHash({
        //     pageState: {i: originIndex}
        // }, {replace: true});
    },

    /**
     * 更改中心点和水滴的切换效果
     * @param {number} 索引
     */
    setCenterMarker: function (index) {
        if (!this.centerPoiMarker) return;

        for (var i = 0, n = this.poiMarkers.length; i < n; i++) {
            var _p = this.poiMarkers[i]._point,
                _cp = this.centerPoiMarker._point,
                _pLat = _p.lat.toString().slice(0, -1),
                _pLng = _p.lng.toString().slice(0, -1),
                _cpLat = _cp.lat.toString().slice(0, -1),
                _cpLng = _cp.lng.toString().slice(0, -1);

            // 找到和中心点相等的点
            if (_pLat == _cpLat && _pLng == _cpLng) {
                if (index == undefined || (index > -1 && index != i)) {
                    this.centerPoiMarker.setZIndex(200);
                    this.poiMarkers[i].setZIndex(150);
                } else {
                    this.centerPoiMarker.setZIndex(150);
                    this.poiMarkers[i].setZIndex(200);
                    // todo
                    // iwControl.switchTo(0, i);
                    // iwControl.show(_p);
                }
                return;
            }
        }

        // 没有重复点时，点中心标识的处理
        if (index == -999) {
            // iwControl.hide();
        }
    },

    /**
     * 变换标注索引，用于poi检索的10个标注的切换
     * @param {number} 变换的标注索引
     */
    switchSelectedMarker: function (index) {
        if (!this.poiMarkers) return;

        // 1.还原成红色气泡
        if (this._selectedIndex >= 0) {
            var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(21, 30), {
                anchor: new BMap.Size(11, 30),
                imageOffset: new BMap.Size(0, 32 * this._selectedIndex)
            });

            if (this.poiMarkers[this._selectedIndex]) {
                this.poiMarkers[this._selectedIndex]._div.className = "";
                this.poiMarkers[this._selectedIndex].setIcon(icon);
                this.poiMarkers[this._selectedIndex].setZIndex(200);
            }
        }

        // 2.index在范围内则添加对应的蓝色气泡
        if (index < 0 || index >= this.poiMarkers.length) {
            this._selectedIndex = -999;
        } else {
            var icon = new BMap.Icon(mapConst.MARKERS_PATH, new BMap.Size(26, 36), {
                anchor: new BMap.Size(13, 36),
                imageOffset: new BMap.Size(58, 40 * index)
            });

            this.poiMarkers[index]._div.className = "mkr_trans";
            this.poiMarkers[index].setIcon(icon);
            this.poiMarkers[index].setZIndex(300);
            this._selectedIndex = index;
        }

        for (var i = 0, n = this.poiMarkers.length; i < n; i++) {
            this.poiMarkers[i]._div.className = "mkr_trans";
        }
    },

    /**
     * 显示道路，例如检索八卦一路，玲珑路等，显示POI同时显示线路
     * @param {Object} 该道路对应的poi数据
     */
    addRoadPolylines: function (poiData) {
        var me = this,
            BMap = this.BMap,
            map = this.map,
            mapView = this.mapView;

        var queryData = {
            qt: 'ext',
            uid: poiData.uid,
            c: poiData.area,
            l: 18 // 请求线路需要附带l参数
        };
        searchData.fetch(util.jsonToUrl(queryData), function (data) {
            if (data && data.content && data.content.geo) {
                var geo = util.parseGeo(data.content.geo);
                if (geo.type == 2) {
                    if (typeof geo.points == "string") {
                        me.roadPolylines.push(me.addPolyline(geo.points));
                    } else {
                        for (var i = 0, l = geo.points.length; i < l; i++) {
                            if (!geo.points[i]) {
                                continue;
                            }
                            me.roadPolylines.push(me.addPolyline(geo.points[i]));
                        }
                    }
                }
            }
        });
    },

    /**
     * 清除道路折线
     */
    clearRoadPolylines: function () {
        if (!this.roadPolylines) return;
        for (var i = 0, l = this.roadPolylines.length; i < l; i++) {
            this.removeTransitPolyline(this.roadPolylines[i]);
            this.roadPolylines[i] = null;
        }
        this.roadPolylines = [];
    }
};

});
;define('place:widget/hotelextcomment/hotelextcomment.js', function(require, exports, module){


var stat = require('common:widget/stat/stat.js'),
    url = require('common:widget/url/url.js');

module.exports = {
    init: function() {
        this.commentCfg = {
            perCount: 5,
            loadCount: 0,
            totalCount: $('.detail-comlist dt').size(),
            maxCount: 25
        }
        this.bindEvent();
    },
    bindEvent: function() {
        $('#detail-loadcomment').on('click', $.proxy(this._showMoreCmts, this));
        $('#detail-commore').on( 'click', $.proxy(this._gotoMoreComment, this) );
    },
    _showMoreCmts: function() {
        var me = this,
            commentCfg = me.commentCfg,
            $moreComment;

        (commentCfg.loadCount)++;
        $.each( ['.detail-comlist dt', '.detail-comlist dd'], function( i, item ){
            // 每次点击加载5条数据
            $(item).slice(commentCfg.perCount * commentCfg.loadCount,
                commentCfg.perCount * (commentCfg.loadCount+1) ).show();
        } )

        // 当数据加载完成后，隐藏加载更多，显示查看更多
        if ( (commentCfg.loadCount + 1) * commentCfg.perCount >= commentCfg.totalCount ) {
            $( '#detail-loadcomment' ).off().remove();
            document.body.clientLeft;
            ($moreComment = $('#detail-commore')) &&
                $moreComment.show();
        }

        // 显示更多评论的统计
        stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_SHOWCOMMENT_CLICK);
    },
    _gotoMoreComment : function(e){
        var u = $( e.currentTarget ).data( 'href' );
        url.navigate( this._filter(u) );
    },
    _filter : function(u){
        return u.replace( (/cmark=1&?/i), "" );
    }
}

});
;define('place:widget/hotelextimg/hotelextimg.js', function(require, exports, module){

/**
 * Created with JetBrains WebStorm.
 * User: chenkang01
 * Date: 13-11-6
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */

module.exports = {
    init: function () {
        'use strict';
        $( '.hotel-img' ).on( 'click', $.proxy( this.gotoPhotoDetail, this ) );
    },

    gotoPhotoDetail: function( e ) {
        'use strict';

        e.preventDefault();
        e.stopPropagation();
        //进入图片详情页
        var url = $( e.currentTarget ).data( 'href' );
        if(url){
            window.location = url;
        }
    }
}

});
;define('place:widget/icomment/icomment.js', function(require, exports, module){


var login = require("common:widget/login/login.js"),
    popup = require("common:widget/popup/popup.js"),
    stat = require('common:widget/stat/stat.js'),
    url = require('common:widget/url/url.js');

module.exports = {
    msg: {
        netError: '发送失败请检查网络连接后重试',
        nocontentError: '评论内容不能为空'
    },
    init: function() {
        $( '#J_impression li' ).on( 'click', $.proxy( this.switchScores, this ) );
        $( '#J_submitComment').on( 'click', $.proxy( this.submitComment, this ) );
    },
    switchScores: function( e ) {
        var $score;

        if ( $score = $( e.target ).closest( 'li' )) {
            $( '#J_impression li' ).removeClass( 'active' );
            $score.addClass( 'active' );
        }
    },
    submitComment: function() {
        var me = this,
            content = me._getContent(),
            score = me._getScore(),
            msg = me.msg,
            $form = $( '#J_addComment' );

        // 提交评论按钮点击总量
        stat.addStat(STAT_CODE.PLACE_COMMENT_ICOMMENT_SUBMITCLICK);

        //提交评论前验证是否存在cookie
        login.checkLogin(function(data){
            if(!data.status){
                login.loginAction();
            }else{
                if( !score || !content){
                    me.showMessage( msg['nocontentError'] );
                } else {
                    $.ajax({
                        type : 'post',
                        url : '/mobile/webapp/place/icomment/force=simple',
                        data : {
                            uid: $form.data('uid'),
                            content: content,
                            score: score
                        },
                        dataType: 'json',
                        success: function( ret ){
                            me._addCommentSuccess( ret );
                        },
                        error: function(){
                            me.showMessage( msg['netError'] );
                        }
                    });
                }
            }
        });

    },
    _getScore:function() {
        var $form = $( '#J_addComment' );
        return $form.find( '.active' ).attr( 'value' )
    },
    _getContent: function(){
        return $('#J_commentContent').val();
    },

    _addCommentSuccess: function( ret ){
        var me = this,
            $form = $( '#J_addComment' );

        if ( parseInt( ret.status ) === 0 ) {
            // 提交评论成功总量
            stat.addStat(STAT_CODE.PLACE_COMMENT_ICOMMENT_SUBMITSUCCESS);

            me.showMessage( ret.msg );
            setTimeout(function() {
                //添加用户评论标识
                url.navigate( me.addCommentMark( $form.data( 'url' ) ) );
            }, 2000)
        } else {
            me.showMessage( ret.msg );
        }
    },

    showMessage: function( msg, delayTime ) {
        popup.open({
            text: msg,
            autoCloseTime: delayTime || 2000
        });
    },

    /**
     * 添加用户评论动作
     * @param {URL|String} url  待标记的URL地址
     * @return {URL|String}     标记完成的URL地址
     **/
    addCommentMark: function(url){
        url += "&cmark=1";
        return url;
    }
}

});
;define('place:widget/listopbanner/listtopbanner.js', function(require, exports, module){

/**
 * Place电影列表页头部Banner
 */
var ListTopBanner = function () {
    this.init();
};

ListTopBanner.prototype = {
    init: function () {
        this.$el = $('#place-widget-listtopbanner');
        this.getBannerData();
    },
    getBannerData: function () {
        $.ajax({
            'url': '/detail?qt=mcdkey&act=advert&from=webapp',
            'type': 'GET',
            'dataType': 'json',
            'context': this,
            'success': function (rs) {
                var data = rs ? ($.isArray(rs.list) ? rs.list[0] : null) : null;
                if (!data) { return; }
                this.render(data);
            }
        });
    },
    render: function (data) {
        var $bg = this.$el.find('.bg');
        var $banner = this.$el.find('.banner');

        $bg.css('background-color', data.background_color || '#ffffff');
        $banner.css({
            'background-image': 'url('+data.image_url+')',
            'background-position': 'center'
        });
        $banner.attr('href', data.link_url);
        this.$el.show();
    }
};

module.exports.init = function () {
    return new ListTopBanner();
};

});
;define('place:widget/listtool/listtool.js', function(require, exports, module){

/**
 * @file 列表工具条
 */
 
var init = function(){
	var listTool = $(".place-widget-listtool");
	var btn = listTool.find(".select-btn");
	btn.on("click",function(){
		var stat = stat = require('common:widget/stat/stat.js'),
			wd = $('.common-widget-nav .title span').text();

		!$(this).hasClass('up') &&
			(stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_CLICK, {'wd': wd}))

		$(this).toggleClass("up");
		listTool.toggleClass("hide-extend");
	});
};


module.exports.init = init;

});
;define('place:widget/listtopbanner/listtopbanner.js', function(require, exports, module){

/**
 * Place电影列表页头部Banner
 */
var ListTopBanner = function () {
    this.init();
};

ListTopBanner.prototype = {
    init: function () {
        this.$el = $('#place-widget-listtopbanner');
        this.getBannerData();
    },
    getBannerData: function () {
        $.ajax({
            'url': '/detail?qt=mcdkey&act=advert&from=webapp',
            'type': 'GET',
            'dataType': 'json',
            'context': this,
            'success': function (rs) {
                var data = rs ? ($.isArray(rs.list) ? rs.list[0] : null) : null;
                if (!data) { return; }
                this.render(data);
            }
        });
    },
    render: function (data) {
        var $bg = this.$el.find('.bg');
        var $banner = this.$el.find('.banner');

        $bg.css('background-color', data.background_color || '#ffffff');
        $banner.css({
            'background-image': 'url('+data.image_url+')',
            'background-position': 'center'
        });
        $banner.attr('href', data.link_url);
        this.$el.show();
    }
};

module.exports.init = function () {
    return new ListTopBanner();
};

});
;define('place:widget/mcodeskey/mcodeskey.js', function(require, exports, module){

/**
 * @description 兑换码承接页面
 * @author zhangyong 
 */
var locator = require('common:widget/geolocation/location.js'),
	stat    = require('common:widget/stat/stat.js'),
	HTTP    = "http://"+window.location.host,
	bound   = {};

//获取城市定位信息
function codesLocate() {
	var cityCode = locator.getCityCode() || 1;
	if (locator.hasExactPoi()) {
		bound.point_x = locator.getPointX();
		bound.point_y = locator.getPointY();
		bound.city_id = cityCode;
	}
}
//获取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.href.substr(1).match(reg);
    if (r !== null) {
        return decodeURIComponent(r[2]);
    } else {
        return null;
    }
}
//跳转到影院列表页面
function exchange(){
	$("#exchange").click(function(){
		var code = GetQueryString("code"),
			sign = GetQueryString("sign");
		if(bound.city_id){
			var locatr = "&"+$.param(bound);
		}else{
			var locatr = "";
		}
        stat.addStat(STAT_CODE.PLACE_CODES_PV, {'state': 'codesreport' });
		location.href = HTTP+"/mobile/webapp/place/codes/force=simple&qt=city&code="+code+"&sign="+sign+locatr;
	});
}
//跳转到电影泛列表页
function bannerLink(){
	$("#banner").click(function(){
		location.href = HTTP + "/mobile/webapp/search/search/foo=bar&qt=s&wd=电影院&c=131&searchFlag=sort/center_name=北京市";
	});
}
//初始化
function initialize() {
	codesLocate();
	bannerLink();
	exchange();
}

module.exports = {
	initialize: initialize
};

});
;define('place:widget/movielist/movielist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
var stat = require('common:widget/stat/stat.js');

var wd = $('.common-widget-nav .title span').text();
var _cacheData;

var bindShowAll = function () {
	var $showAllBtn = $("#place-widget-movielist-showall");
	$showAllBtn.on("click",showAll);
}

var bindPageBtn = function(){
	$pageNav = $(".place-widget-movielist .page-btn");
	$.each($pageNav, function (index,item) {
		var $dom = $(item);
		$dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("url");

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

			if(!btn.hasClass("unclick")) {
				url.navigate(href,{
					replace : true
				})
			}
		});
	})
}

/**
 * 显示所有
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
var showAll = function (evt) {
	var $poiList = $(".place-widget-movielist .place-list"),
		$pageNav = $(".place-widget-movielist .pagenav"),
		$showAllBtn = $("#place-widget-movielist-showall");

	$showAllBtn.hide();
	$poiList.removeClass("acc-list");
	$pageNav.show();

	// 添加强展现量统计  by cdq
	stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);
}

var bindList = function () {
	var $poiList = $(".place-widget-movielist");
	$poiList.on("click", "li", function(evt){
		var $item = $(this),
			href = $item.data("href"),
            name = $item.find('.rl_li_title').text(),
            isGen = _cacheData && _cacheData["isGenRequest"],
            isGwj = _cacheData && _cacheData["activity"],
            target = evt.target;
            
        // 过滤路线按钮，防止重复触发
        if(target.tagName.toLowerCase() === "a") {
        	return;
        }
        isGen = isGen == 1 ? 1 : 0;
        stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen, 'is_gwj': isGwj}, function(){
        	url.navigate(href);
        });
    });
}

var saveData = function ( data ) {
	_cacheData = data;
}

var bind = function () {
	bindShowAll();
	bindPageBtn();
	bindList();
}


var init = function ( data ) {
	saveData(data);
	bind();
}

module.exports.init = init;

});
;define('place:widget/movienews/movienews.js', function(require, exports, module){

require("place:static/lib/template.js");
var util = require('common:static/js/util.js');
var stat = require('common:widget/stat/stat.js');
var iScroll = require('common:static/js/iscroll.js');

var DETAILTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="cover">    <div id="cover-wrapper" class="cover-wrapper">        <div id="cover-scroller" class="cover-scroller">            ');for(var j = 0, len = imgs.length; j < len ; j++){_template_fun_array.push('            <img class="cover-pic needsclick" width="69" height="84" data-id="',typeof(imgs[j].id) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].id),'" data-date="',typeof(imgs[j].day) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].day),'" src="http://map.baidu.com/maps/services/thumbnails?width=96&height=128&quality=100&src=',typeof(imgs[j].url) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].url),'" style="display:',typeof(imgs[j].visible) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].visible),'" alt="',typeof(imgs[j].title) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].title),'">            ');if(imgs[j].activity){_template_fun_array.push('            <span class="activity_icon" style="display:',typeof(imgs[j].labelvis) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].labelvis),'"></span>            ');}else if(imgs[j].newm){_template_fun_array.push('            <span class="new_icon" style="display:',typeof(imgs[j].labelvis) === 'undefined'?'':baidu.template._encodeHTML(imgs[j].labelvis),'"></span>            ');}_template_fun_array.push('            ');}_template_fun_array.push('        </div>    </div></div><p class="info-tip"><br>暂无当日排期...</p><div class="info ');if(!book){_template_fun_array.push('info-unbook');}_template_fun_array.push('">    ');if(book){_template_fun_array.push('    <div class="list-opt">        <button id="btnMovieBookMore" class="btn-more">查看更多影讯<i class="icon-arrow"></i></button>        <button id="btnMovieBookClose" class="btn-close">收起<i class="icon-arrow"></i></button>    </div>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var TABSTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="tab"><div id="tab_wrapper" class="tab_wrapper"><ul class="calendar_tab">    ');for(var i = 0, len = days.length; i < len ; i++){_template_fun_array.push('    <li data-date="',typeof(days[i].date) === 'undefined'?'':baidu.template._encodeHTML(days[i].date),'" data-text="',typeof(days[i].text) === 'undefined'?'':baidu.template._encodeHTML(days[i].text),'" ');if(i == 0){_template_fun_array.push('class="current"');}_template_fun_array.push(' ');if(days[i].disabled){_template_fun_array.push('class="disabled"');}_template_fun_array.push('>',typeof(days[i].text) === 'undefined'?'':baidu.template._encodeHTML(days[i].text),'</li>    ');}_template_fun_array.push('</ul></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var INFOTPL = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<dl>    <dt><em class="tit">',typeof(name) === 'undefined'?'':baidu.template._encodeHTML(name),'</em> ');if(parseInt(score)>0){_template_fun_array.push('<em class="sco"> ',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'</em>');}_template_fun_array.push('<em data-id="',typeof(id) === 'undefined'?'':baidu.template._encodeHTML(id),'" class="movieDes des">影片简介&gt;&gt;</em></dt>    <dd>        ',typeof(times) === 'undefined'?'':baidu.template._encodeHTML(times),'    </dd></dl>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var TIMETPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<ul class="show-list ');if(schedules.length > 4){_template_fun_array.push('part');}_template_fun_array.push('">');for(var j = 0, len = schedules.length; j < len ; j++){_template_fun_array.push('<li class="show-item ');if(j == 0 && schedules[j].book && schedules[j].seatL){_template_fun_array.push('expand');}_template_fun_array.push('"><div class="show-info"><span class="meta"><em class="time">',typeof(schedules[j].time) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].time),'</em>',typeof(schedules[j].type) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].type),'</span><span class="meta-extend"><i class="icon-price">&yen;</i>',typeof(schedules[j].price) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].price),'起');if(schedules[j].url){_template_fun_array.push('<a class="btn-exchange" href="',typeof(schedules[j].url) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].url),'">兑换码</a>');}else{_template_fun_array.push('<i class="icon-arrow"></i>');}_template_fun_array.push('</span></div>');if(schedules[j].seatL){_template_fun_array.push('<ul class="compare-list">');for(var i = 0, leng = schedules[j].list.length; i < leng ; i++){_template_fun_array.push('<li><span class="brand">',typeof(schedules[j].list[i].src_name) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].src_name),'');if(schedules[j].list[i].activity_message && schedules[j].activity){_template_fun_array.push('<i class="icon-activity"></i>');}else if(i == 0 && leng > 1){_template_fun_array.push('<i class="icon-cheap"></i>');}_template_fun_array.push('</span>');if(schedules[j].list[i].price){_template_fun_array.push('<span class="price"><i class="icon-price">&yen;</i>',typeof(schedules[j].list[i].price) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].price),'</span>');}_template_fun_array.push('<span class="opt"><a class="btn-book ',typeof(schedules[j].style) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].style),'" data-day="',typeof(schedules[j].day) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].day),'" data-num="',typeof(schedules[j].list[i].seq_no) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].seq_no),'" data-cinema="',typeof(schedules[j].list[i].cinema_id) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].cinema_id),'" data-theater="',typeof(schedules[j].theater) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].theater),'" data-time="',typeof(schedules[j].time) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].time),'" data-price="',typeof(schedules[j].list[i].price) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].price),'" data-movie="',typeof(schedules[j].list[i].movie_id) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].movie_id),'" data-info="',typeof(schedules[j].info) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].info),'" data-orign="',typeof(schedules[j].list[i].src) === 'undefined'?'':baidu.template._encodeHTML(schedules[j].list[i].src),'">选座订票</a></span></li>');}_template_fun_array.push('</ul>');}_template_fun_array.push('</li>');}_template_fun_array.push('</ul>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var POPUPTPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="moviebook-popup-wrapper"><div class="moviebook-popup"><div class="header">',typeof(title) === 'undefined'?'':baidu.template._encodeHTML(title),'院线购票手机验证<a href="javascript:void(0);" id="valid-btn-close" class="btn-close"></a></div><div class="content"><p><label>手机号:&nbsp;</label><input id="valid-phone" autocomplete="false" type="tel"><span class="tip"></span></p><p><label>验证码:&nbsp;</label><input id="valid-number" autocomplete="false" type="text"><img src=""><span class="tip"></span></p><p><button id="valid-btn-submit" class="submit-btn" type="button">提交</button></p></div></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
var DESPOPUPTPL =  [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="moviebook-popup-wrapper"><div class="moviedes_popup"><div class="header">',typeof(name) === 'undefined'?'':baidu.template._encodeHTML(name),'');if(parseInt(score)>0){_template_fun_array.push('<span class="sco"> ',typeof(score) === 'undefined'?'':baidu.template._encodeHTML(score),'</span>');}_template_fun_array.push('<a href="javascript:void(0);" id="des-btn-close" class="btn_close"> X </a></div><div class="content" style="text-align:left;"><style>table.des td{vertical-align: top;}</style><table class="des"><tr><td width="45"><span class="name">版本</span>:</td><td><span>',typeof(type || "暂无") === 'undefined'?'':baidu.template._encodeHTML(type || "暂无"),'</span></td></tr><tr><td><span class="name">片长</span>:</td><td><span>',typeof(duration || "暂无") === 'undefined'?'':baidu.template._encodeHTML(duration || "暂无"),'</span></td></tr><tr><td><span class="name">上映</span>:</td><td><span>',typeof(release || "暂无") === 'undefined'?'':baidu.template._encodeHTML(release || "暂无"),'</span></td></tr> <tr><td><span class="name">地区</span>:</td><td><span>',typeof(nation || "暂无") === 'undefined'?'':baidu.template._encodeHTML(nation || "暂无"),'</span></td></tr><tr><td><span class="name">导演</span>:</td><td><span>',typeof(director || "暂无") === 'undefined'?'':baidu.template._encodeHTML(director || "暂无"),'</span></td></tr><tr><td><span class="name">主演</span>: </td><td><span>',typeof(players || "暂无") === 'undefined'?'':baidu.template._encodeHTML(players || "暂无"),'</span></td></tr><tr><td colspan="2"><span class="name">简介</span>: <p style="padding:6px 0 0;">',typeof(des || "暂无") === 'undefined'?'':baidu.template._encodeHTML(des || "暂无"),'</p></td></tr></table></div></div></div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

var is_gwj_book;

function getOrientation() {
    var ornttn = window.outerWidth > 0 ?
        (window.outerWidth > window.outerHeight ? 90 : 0) :
        (document.body.offsetWidth > document.body.offsetHeight ? 90 : 0);

    return ornttn;
}
function formatDate(objDate){
    return objDate.getFullYear() + '-' + (objDate.getMonth() < 9 ? '0' + (objDate.getMonth() + 1) : objDate.getMonth() + 1) + '-' + (objDate.getDate() < 10 ? '0' + objDate.getDate() : objDate.getDate());
}
function formateDateText(objDate, objDateNow){
    var arrDaysText = ['周日','周一','周二','周三','周四','周五','周六'];

    if(!objDate || !(objDate instanceof Date)){
        return '';
    }

    if( (objDate - objDateNow) == 0){
        return '今天';
    }
    else if( (objDate - objDateNow) == 86400000){
        return '明天';
    }
    else if( (objDate - objDateNow) == 172800000){
        return '后天';
    }
    else{
        return arrDaysText[objDate.getDay()];
    }
}
function Schedules(now, uid){
    /*var date = new Date(now.split('-')[0], parseInt(now.split('-')[1], 10) - 1, now.split('-')[2], '00', '00', '00');        */
    var eventHandler = {
        ".btn-more": this.showMore,
        ".btn-close": this.showSpecific,
        ".btn-book": this.bookMovie,
        ".calendar_tab li": this.switchTab,
        ".cover-pic": this.showMovieInfo,
        ".movieDes": this.showDesPopup,
        ".show-info": this.showCompare
    };

    this.elePlaceMovie = $('div.place-widget-movienews');         

    this.now = now;
    this.uid = uid;
    /*this.days = {};
    
    this.days[ formatDate(date) ] = 0;
    this.days[ date.setDate(date.getDate()+1) && formatDate(date) ] = 1;
    this.days[ date.setDate(date.getDate()+1) && formatDate(date) ] = 2;*/

    //初始化事件处理
    for(var selector in eventHandler){
        this.elePlaceMovie.delegate(selector, "click", $.proxy(eventHandler[selector], this));
    }
}

Schedules.prototype.renderFailInfo = function(){
    this.elePlaceMovie.find('.movienews-loading').text('暂无影讯数据！');
};
Schedules.prototype.renderMovieNews = function(obj, name){
    var me = this,
        arrMovies = ( $.isArray(obj.base) && obj.base.length > 0 ) ? obj.base :  [],
        arrMovieTimes = ( $.isArray(obj.time_table) && obj.base.length > 0 ) ? obj.time_table :  [],
        data = {
            date: {},
            imgs: [],
            book: obj.webview_style == 2 ? false : true,
            days: []
        };                        
        wrapperWidth = 0,
        date = new Date(),
        now = obj.now_time || date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
        contentTpl = '',tabsTpl = '',
        days={}; 

    this.orign = arrMovieTimes[0][0].src_info[0].src;
    this.name = name;
    me.arrMovies = arrMovies;
    me.lastOrientation = lastOrientation = -1;
    
    //天数
    $.each(arrMovieTimes, function(index, item){
        var objDate = new Date(item[0].date.split('-')[0], parseInt(item[0].date.split('-')[1], 10) - 1, item[0].date.split('-')[2], '00', '00', '00'),
            objText = item[0].date.replace(/-/g, '.').replace(/^[0-9]*./g, '');

        days[ formatDate(objDate) ] = index;
        data.days[index] = {
            text: objText + ' ' + formateDateText(objDate, new Date(now.split('-')[0], parseInt(now.split('-')[1], 10) - 1, now.split('-')[2], '00', '00', '00')),
            date: item[0].date,
            obj: objDate
        };
    });
    //填补不足三天的日期
    (function(arrDays, strNow){
        var i = 0, len = arrDays.length, date, text;

        while(arrDays.length < 3){
            (date = arrDays[arrDays.length - 1].obj) && date.setDate(date.getDate() + 1);
            text = date.getFullYear() + '-' + (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            arrDays[len + i] = {
                text: (date.getMonth() + 1) + '.' + date.getDate() + ' ' + formateDateText(date, new Date(strNow.split('-')[0], parseInt(strNow.split('-')[1], 10) - 1, strNow.split('-')[2], '00', '00', '00')),
                date: text,
                obj: date,
                disabled: true
            };

            i++;
        }
    })(data.days, now);
    this.days = days;

    //创建封面基础信息
    function generatorCover(objs){ 
        var arr = [], obj = {};

        $.each(objs, function(index, item){
            var data = {
                    'url': item.movie_picture || '', 
                    'id': item.movie_id || '',
                    'title': item.movie_name || '',
                    'day': '',
                    'newm': false
                }, 
                properties = [];

            $.each(arrMovieTimes, function(_index, _item){
                var i = 0;

                while(i < _item.length){
                    if(item.movie_id == _item[i].movie_id){
                        data['day'] += ('d' + _index);
                        //data['newm'] = ((new Date().getTime() - new Date(item.movie_release_date).getTime())<3*24*3600*1000);
                        data['newm'] = item.is_new;
                        data['activity'] = item.is_activity && is_gwj_book ? true : false;
                        break;
                    }

                    i++;
                }
            });                 
            data['visible'] = data['day'].match(/0/) ? 'block' : 'none';
            data['labelvis'] = data['visible'] =='block'? 'inline-block' : 'none';
            arr.push(data);
        });

        return arr;
    }
    //创建影片基础信息
    function generatorInfo(id, day){
        var data = {},
            times = [],
            scheduleList = [];
            //myDate = new Date(me.now.split('-')[0], parseInt(me.now.split('-')[1], 10) - 1, me.now.split('-')[2], '00', '00', '00'),
            //day = myDate.setDate(myDate.getDate()+day) && myDate.getFullYear() + '-' + (myDate.getMonth() < 9 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + '-' + (myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate());

        //查找指定ID影片
        $.each(arrMovies, function(index, item){
            if(item.movie_id == id)
                data = item;
        });
        data && (data = {
            'name': data.movie_name || '', 
            'id': data.movie_id || '',
            'duration': (data.movie_length && data.movie_length.toString().replace('分钟', '') + '分钟') || '',
            'category': (data.movie_nation ? data.movie_nation + '&nbsp;&nbsp;' : '') +  (data.movie_type || ''),
            'director': data.movie_director || '',
            'players': data.movie_starring || '',
            'score': data.movie_score || "",
            'des': data.movie_description || "",
            'pic': data.movie_picture || "",
            'release': data.movie_release_date || ""
        });
        //查找某天影讯
        $.each(arrMovieTimes, function(index, item){
            if(item[0].date == day)
                times = item;
        });

        if(!$.isArray(times))return;
        $.each(times, function (index, item) {                
            if(data.id != item.movie_id)
                return;

            var subData = {
                day: item.date,
                seatL: true,
                book: obj.webview_style == 2 ? false : true,
                time: item.time || '', 
                type: (item.src_info[0].lan && item.src_info[0].type) ? item.src_info[0].lan + '/' + item.src_info[0].type : (item.src_info[0].lan||'') + (item.src_info[0].type||''), 
                price: item.lower_price,
                style: item.src_info[0].seq_no && !item.src_info[0].src.match(/dbmovie|mtime/g) ? '' : 'unbook',
                num: item.src_info[0].seq_no,
                orign: item.src_info[0].src,
                cinema: item.src_info[0].cinema_id,
                theater: item.src_info[0].theater,
                movie: item.src_info[0].movie_id,
                name: item.src_info[0].movie_name || data.name,
                info: '{\'lan\':\'' + item.src_info[0].lan + '\',\'time\': \'' + item.time + '\',\'price\': \'' + item.src_info[0].price + '\',\'name\': \'' + data.name + '\'}',
                list: item.src_info,
                activity: is_gwj_book
            };
            if(item.src_info[0].aid){
                subData.url = me.createCodeUrl(subData,data);
                subData.seatL = false;
            }

            scheduleList.push(subData);
        });
        
        data['times'] = TIMETPL({schedules: scheduleList});
        data['date'] = day;
        data['from'] = times[0].src_info[0].src;
        
        return INFOTPL(data)
            .replace(/&amp;/g,'&')
            .replace(/&lt;/g,'<')
            .replace(/&gt;/g,'>')
            .replace(/&#92;/g,'\\')
            .replace(/&quot;/g,'"')
            .replace(/&#39;/g,'\'');
    }
    function switchMovieInfo(id, index){
        var infoEle = me.eleInfo.length ? me.eleInfo : me.elePlaceMovie.find('.info'),
            closeBtn = $('#btnMovieBookClose');
        var day = me.elePlaceMovie.find('.calendar_tab li.current').attr("data-date"), 
            domId = '#info_' + id + '_' + day, 
            tpl;

        //closeBtn.length && closeBtn[0].click();

        if($(domId).css('display') == 'block')
            return;
        if($(domId).length == 0){
            tpl = generatorInfo(id, day);
            $(tpl).prependTo(infoEle).attr('id', domId.substr(1));                
        }

        //默认选中第一个影片
        $('div.cover')
            .find("img[style='display:block']")
            .removeClass('selected')
            .eq(index)
            .addClass('selected');

        infoEle.children()
            .hide()
            .filter(domId)
            .attr('style', function(){
                if(data['book'] && $(this).find('li.show-item').length > 4){
                    infoEle.find('.list-opt').data('id', domId).show();

                    if(!$(this).find('ul.show-list').data('statue')){
                        $('#btnMovieBookMore').show();      
                        $('#btnMovieBookClose').hide();    
                    }
                    else{
                        $('#btnMovieBookMore').hide();      
                        $('#btnMovieBookClose').show();
                    }
                    
                }
                else{
                    infoEle.find('.list-opt').data('id', domId).hide();
                }
                    
                return 'display: block';
            });            
    }

    //构造影讯内容
    data['imgs'] = generatorCover(arrMovies);

    contentTpl = DETAILTPL(data);
    tbsTpl = TABSTPL(data);

    me.elePlaceMovie
        .find('.movienews-content')
        .append(tbsTpl)
        .append(contentTpl)
        .show()
        .removeClass('movienews-empty')
        .next()
        .remove();           

    me.eleCover = this.elePlaceMovie.find('.cover'); 
    me.eleInfo = me.elePlaceMovie.find('.info');
    me.eleInfotip = me.elePlaceMovie.find('.info-tip');    

    if(arrMovieTimes.length > 3 && $('.tab_wrapper').width() < 75*arrMovieTimes.length + 8){
         $('.tab_wrapper')
            .addClass('slide')
            .find('.calendar_tab')
            .width(75*arrMovieTimes.length + 12);

        me.tabScroll = new iScroll('tab_wrapper', {
            momentum: false,
            hScroll: true,
            hScrollbar: false,
            vScrollbar: false,
            vScroll: false,
            lockDirection: true,
            handleClick: false
        });
    }

    me.elePlaceMovie.find('.cover-scroller').css({'display':"block"});
    me.coverScroll = new iScroll('cover-wrapper', {
        snap: true,
        momentum: false,
        hScrollbar: false,
        vScrollbar: false,
        vScroll: false,
        lockDirection: true,
        onScrollEnd: function (e) {
            var eleImgs = me.eleCover.find("img[style='display:block']"),
                ele = eleImgs.eq(me.coverScroll.currPageX);
            var id = ele.data('id');

            if(eleImgs.length == 0){
                me.elePlaceMovie.addClass('movienews-empty');
                return false;
            }
            
            switchMovieInfo(id, me.coverScroll.currPageX);
        }
    });

    //当今天TAB选项下无影讯时的处理
    if($('div.cover').find("img[style='display:block']").length){    
        this.updateLayout(0);
    }
    else{
        this.elePlaceMovie.toggleClass('movienews-empty', true);
    }
}          

Schedules.prototype.updateLayout = function(currentIndex) {            
    var wrapperWidth = $('div.cover').width(),
        me=this,
        eleTab = $('.tab_wrapper'),
        days = eleTab.find('li').length,
        count = $('div.cover').find("img[style='display:block']").length,
        itemWidth = 69,
        lastOrientation = me.lastOrientation;
                 
    window.orientation = getOrientation();

    $('#cover-wrapper').css({
        'overflow': 'visible',
        'width': itemWidth + 13,
        'right': (wrapperWidth*3/4 - itemWidth/2 - 13)
    });
    $('#cover-scroller').css('width', (itemWidth + 13) * count);
    
    me.coverScroll.refresh();

    if(typeof currentIndex != 'undefined' && currentIndex > -1){
        this.coverScroll.scrollToPage(currentIndex, 0, 0);        
    }

    //ios6获取方向属性有延迟
    window.setTimeout(function(){
        window.orientation = getOrientation();
        
        //重置TAB滚动
        if(eleTab.width() < 75*days + 8){
            if(me.tabScroll){
                //me.tabScroll.refresh();
            }else{
                eleTab
                    .addClass('slide')
                    .find('.calendar_tab')
                    .width(75*days + 8);

                me.tabScroll = new iScroll('tab_wrapper', {
                    momentum: false,
                    hScroll: true,
                    hScrollbar: false,
                    vScrollbar: false,
                    vScroll: false,
                    lockDirection: true,
                    handleClick: false
                });
            }

            (window.orientation != lastOrientation) && me.tabScroll.scrollToPage(eleTab.find('.current').index(), 0, 0);
        }
        else{
            if(me.tabScroll){
                eleTab.removeClass('slide').find('.calendar_tab').width('auto');
                me.tabScroll.destroy();
                delete me.tabScroll;
            }
        }

        if(window.orientation != lastOrientation){
          me.lastOrientation = window.orientation;
        }
    }, 100);
}
Schedules.prototype.switchTab = function(event){
    var ele = $(event.target),
            elesImg = [],
            index = ele.index(),
            indexState = index === 0 ? true : false,
            infoState;

    if(ele.hasClass('current'))
        return false;
    if(ele.hasClass('disabled'))
        return false;

    stat.addStat(STAT_CODE.PLACE_MOVIE_TAB_CLICK, {day: index});
    
    ele.addClass('current')
        .siblings()
        .removeClass('current');

    if(!this.eleCover || !this.eleCover.length){
        return;
    }

    this.eleCover.find("img").each(function(i, item){                                                
        var ele = $(item);
        var day = ele.data('date'),
            isShow = true;
        
        ele.removeClass('selected');
        if(day.indexOf('d' + index) != -1){
            ele.attr('style', 'display:block');
            if(i == 0){
                ele.addClass('selected');
            }
            if(ele.next().hasClass("new_icon") || ele.next().hasClass("activity_icon")){
                ele.next().show();
            }
        }else{
            ele.attr('style', 'display:none');
            if(ele.next().hasClass("new_icon") || ele.next().hasClass("activity_icon")){
                ele.next().hide();
            }
            isShow = false;
        }

        isShow && elesImg.push(ele);
    });
    
    infoState = elesImg.length == 0 ? true : false;
    this.elePlaceMovie.toggleClass('movienews-empty', infoState);
    if(!infoState){
        this.updateLayout(0);
    }
}
Schedules.prototype.showDesPopup = function(event) {
    stat.addStat(STAT_CODE.PLACE_MOVIE_DESCRIBTION_CLICK);

    var id =$(event.target).attr("data-id"),
            arrMovies = this.arrMovies,star,data,desStr,
            elePopup = $('.moviebook-popup-wrapper');
        $.each(arrMovies, function(index, item){
            if(item.movie_id == id)
                data = item;
        });
        if(data.movie_starring){
            star = data.movie_starring.split("/").slice(0,4).join("、");
        }
        if(data.movie_description.length>180){
            desStr = data.movie_description.slice(0,180)+"...";
        }else{
            desStr = data.movie_description;
        }
        data = {
            'name': data.movie_name || '', 
            'id': data.movie_id || '',
            'duration': (data.movie_length && data.movie_length.toString().replace('分钟', '') + '分钟') || '',
            'nation': data.movie_nation,
            'type' : data.movie_type,
            'director': data.movie_director || '',
            'players': star,
            'score' : data.movie_score,
            'des' : desStr,
            'release' : data.movie_release_date
        };
        popupHtml = DESPOPUPTPL(data);
        $(popupHtml)
            .prependTo("#wrapper")
            .show()
            .children()
            .first()
            .css('top', window.scrollY + $(window).height()/3 );
        
    if($('body').height() < window.screen.height)
        elePopup.height(window.screen.height)
    $('#des-btn-close').click($.proxy(this.closePopup,this));
}
Schedules.prototype.showMovieInfo = function(event) {
    var me = this,
        ele = $(event.target), 
        eleCover = me.elePlaceMovie.find('.cover');
    var index = -1;

    eleCover.find("img[style='display:block']").each(function(i, item){
        $(this).removeClass('selected');                
        if(ele.data('id') == $(item).data('id')){
            $(this).addClass('selected');
            index = i;
        }
    });
    
    if(index > -1 && index != me.coverScroll.currPageX){
        stat.addStat(STAT_CODE.PLACE_MOVIE_PIC_CLICK);

        window.setTimeout(function(){
            me.coverScroll.scrollToPage(index, 0);
        }, 0);
    }
}
Schedules.prototype.showMore = function(event) {
    var relID = $(event.target).parent().data('id'), 
        relEle = $(relID),
        relListEle = relEle.find('ul.show-list');

    relListEle
        .toggleClass('part')
        .data('statue', true);
    $('#btnMovieBookMore').hide();
    $('#btnMovieBookClose').show();

    stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_LIST_MORE_CLICK);
}
Schedules.prototype.showSpecific = function(event){
    var relID = $(event.target).parent().data('id'), 
        relEle = $(relID),
        relListEle = relEle.find('ul.show-list');

    relListEle
        .toggleClass('part')
        .data('statue', false);
    $('#btnMovieBookMore').show();
    $('#btnMovieBookClose').hide();

    document.body.scrollTop = $('#place-pagelet-movienews').position().top + 125;

    stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_LIST_LESS_CLICK);
}
Schedules.prototype.bookMovie = function(event) {
    var ele = $(event.target);
    if(event.target.tagName != 'A')
        return false;

    event.preventDefault();
    
    if(ele.hasClass('unbook')){
        event.stopImmediatePropagation();
        return false;
    }

    var actionUrl = '/detail?',
        query = {
            uid: this.uid,
            date: ele.attr('data-day'),
            seq_no: ele.attr('data-num'),
            cinema_id: ele.attr('data-cinema'), 
            cinema_name: this.name,
            cc_time: ele.attr('data-time'),
            movie_id: ele.attr('data-movie'),
            third_from: ele.data('orign'),
            theater: ele.data('theater'),
            ticket_price: ele.data('price'),
            movie_info: ele.attr('data-info').replace(/\'/g, '"')
        },
        url = actionUrl + 'qt=movie&act=select&from=webapp&' + $.param(query);          
     
    if(query.third_from.match(/gewala|wanda|spider/g)){
        this.renderValidPopup(url); 
        event.stopImmediatePropagation();
        return false;
    }        

    stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_CLICK, {
        from: ele.data('orign'),
        uid: this.uid,
        activity: ele.parents('li').eq(0).find('.icon-activity').length
    });
    window.setTimeout(function(){
        window.location.href = url;
    }, 200);

    event.stopImmediatePropagation();
}        
Schedules.prototype.showCompare = function(event){
    if($('div.info').hasClass('info-unbook')){
        return false;
    }

    stat.addStat(STAT_CODE.PLACE_MOVIE_COMPARE_LIST_CLICK);

    var parentsobj = $(event.currentTarget).parent();
    var txt = parentsobj.find("a").text() ;
    if(txt ==  "兑换码"){
        return;
    }
    parentsobj.toggleClass('expand');

};
Schedules.prototype.renderValidPopup = function(url){
    var elePopup = $('.moviebook-popup-wrapper');
    var titles = {'wanda': '万达', 'gewala': '格瓦拉', 'spider': '蜘蛛网'}
        params = util.urlToJSON(url.replace('/detail?', '')),
        data = {title: titles[params['third_from']]},
        popupHtml = POPUPTPL(data),
        number = localStorage.getItem('movie_book_user_mobile');

    if(elePopup.length)return;

    elePopup = $(popupHtml);
    elePopup.prependTo("#wrapper")
        .show()
        .data('url', url)
        .children()
        .first()
        .css('top', window.scrollY + $(window).height()/2 );
    if($('body').height() < window.screen.height)
        elePopup.height(window.screen.height)

    number && $('#valid-phone').val(number);

    $('#valid-btn-close').click($.proxy(this.closePopup,this));
    $('#valid-btn-submit').click($.proxy(this.validPhone,this));
}
Schedules.prototype.closePopup = function(){
    var elePopup = $('.moviebook-popup-wrapper');

    elePopup.length && elePopup.remove();
}
Schedules.prototype.validPhone = function() {
    var eleBtn = $(event.target),
        eleNumber = $('#valid-phone'),
        eleCode = $('#valid-number'),
        eleNumberTip = eleNumber.next(),
        elePopup = $('.moviebook-popup-wrapper');
    var number = eleNumber.val(),
        oldNumber = localStorage.getItem('movie_book_user_mobile'),
        url = elePopup.data('url'),
        params = util.urlToJSON(url.replace('/detail?', ''));
    
    //创建验证码图片
    function makeValidImg(){
        var callbackName = 'mkcode',
            script = document.createElement('script'),
            cleanup = function () {
                $(script).remove()
                delete window[callbackName]
            };
       
        window[callbackName] = function(data){
            cleanup();

            if(data.content && data.content.vcode)
                elePopup.data('vcode', data.content.vcode)
                    .find('p')
                    .eq(1)
                    .show()
                    .find('img')
                    .attr('src', 'http://map.baidu.com/maps/services/captcha/image?vcode=' + data.content.vcode);
        }
                    
        script.src = 'http://map.baidu.com/maps/services/captcha?setno=1&cb=' + callbackName + '&t=' + (Math.random() * 100000000).toFixed(0);
        $('head').append(script);            
    }
    //检查输入验证码
    function validCode(args, fn){
        var callbackName = 'vdcode',
            script = document.createElement('script'),
            cleanup = function () {
                $(script).remove()
                delete window[callbackName]
            };

        args['t'] = (Math.random() * 100000000).toFixed(0);
        
        window[callbackName] = function(data){                
            cleanup();
            
            if(data.result && data.result.error != 0){
                eleCode.val('');
                elePopup.find('.tip').eq(1).show().text('验证出错，请重新输入验证码！');

                makeValidImg();
                return;
            }

            $.isFunction(fn) && fn();
        };

        script.src = 'http://map.baidu.com/maps/services/captcha/verify?cb=' + callbackName + '&' + $.param(args);
        script.setAttribute('async', 'false');
        $('head').append(script);
    }

    if(!number || number.length != 11 || !number.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[0-9]\d{8}|18\d{9}/g)){
        eleNumberTip.html('请确保输入号码正确！').show();
        return false;
    }

    if(elePopup.data('valid')){
        eleNumberTip.hide();

        validCode({code: eleCode.val(), vcode: elePopup.data('vcode')}, function(){
            number = eleNumber.val();
            //验证localStorage在IOS隐私模式下是否可用
            try{
                localStorage.setItem('movie_book_user_mobile', number);
            }
            catch(err){}

            stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_CLICK, {
                from: params['third_from'],
                uid: params['uid'],
                activity: is_gwj_book && params['third_from'].match(/wangpiao|wanda/g) ? 1 : 0
            });
            window.setTimeout(function(){
                window.location.href = url + '&user_mobile=' + number;
            }, 200);
        });
        return false;
    }
    if(!oldNumber || (oldNumber && number != oldNumber) ){
        eleNumberTip.hide();
        elePopup.data('valid', true);

        makeValidImg();
        return false;
    }        

    //验证localStorage在IOS隐私模式下是否可用
    try{
        localStorage.setItem('movie_book_user_mobile', number);
    }
    catch(err){}
    
    stat.addStat(STAT_CODE.PLACE_MOVIE_BOOK_CLICK, {
        from: params['third_from'],
        uid: params['uid'],
        activity: is_gwj_book && params['third_from'].match(/wangpiao|wanda/g) ? 1 : 0
    });
    window.setTimeout(function(){
        window.location.href = url + '&user_mobile=' + number;
    }, 200);
}       
Schedules.prototype.createCodeUrl = function(json,data){
    var urlParam=util.urlToJSON(window.location.href),url="";

    var urlJson = {
        qt : "verify",
        uid : this.uid,
        code : urlParam.code,
        sign : urlParam.sign,
        //影片名称
        name : data.name,
        //影片id
        mid : json.movie,
        //时长
        duration : data.duration,
        //评分
        score : data.score,
        //订票info
        info : json.info.replace(/\'/g, '"'),
        //场次日期
        day : json.day,
        //场次日期
        seq_no : json.num,
        //场次id
        cinemaid : json.cinema,
        //场次时间
        time : json.time,
        //屏幕分类
        type : json.type,
        pname : $("#place-widget-captain-name").html()||"",
        //上映时间
        release : data.release,
        //电影分类
        category : data.category,
        //导演
        director : data.director,
        //主演
        player : data.players,
        //封面
        pic : data.pic
    };
    if(urlParam.code && urlParam.sign){
        url = "/mobile/webapp/place/codes/force=simple&"+util.jsonToUrl(urlJson);
    }
    return url;
}
module.exports = {
    init: function(uid, bookState, now, name, activity){
        stat.addStat(STAT_CODE.PLACE_MOVIE_PV, {'state': bookState, uid: uid, activity: activity});

        is_gwj_book = activity;

        var urlParam=util.urlToJSON(window.location.href),
            dataQ = {
            qt: 'timetable', 
            act: 'timetable',
            uid: uid, 
            style: bookState,
            code:urlParam['code']||"",
            sign:urlParam['sign']||"",
            from: 'webapp'
        };

        $.ajax({
            url: '/detail?',
            data: dataQ,
            dataType: 'json',
            success: function(data){
                var schedulesObj = new Schedules(data.now_time || now, uid);
                //浏览器翻转事件
                window.addEventListener("resize", function(){schedulesObj.updateLayout();}, false); 

                if(bookState == 2){
                    data = data.other_info;
                }
                if(data.time_table && data.time_table.length){                    
                    schedulesObj.renderMovieNews(data, name);    
                }
                else{
                    schedulesObj.renderFailInfo();
                }

                stat.addStat(STAT_CODE.PLACE_MOVIE_LOADED_PV, {'state': bookState, uid: uid, action: 'loaded'});
            }
        })
    }
}


});
;define('place:widget/photodetailslider/photodetailslider.js', function(require, exports, module){

/**
 * Created by chenkang01 on 13-11-7.
 */
module.exports = {
    config: {
        iService : '',
        iServiceTpl : 'height=$h$&width=$w$&quality=70&src=$src$'
    },
//    imgItemTpl:
//            '<div class="img-area-item loading">' +
//                '<div class="absolute-center-align loading">···Hello</div>' +
//                '<img class="absolute-center-align" alt="" src="<%= pic %>">' +
//            '</div>',
    $el: null,
    photos: [],
    area: null,
    frowWhere: null,
    cIndex: null,
    imgs: null,
    init: function( wData ){
        'use strict';
        var me = this,
            idx = Number( wData.get.idx );
        me.$el = $( "#photoslider" );
        me.photos = wData.photos;
        me.area = me.$el.find( "#img-area" );
        me.imgs = me.area.find( 'img' );
        me.frowWhere = me.$el.find( ".fromwhere" );
        me.cIndex = me.$el.find( ".currentidx" );
        me.config.iService = wData.thumbnailURL + me.config.iServiceTpl;

        me.resize();
        me.bindEvent();
        me.displaySlider( idx );
//            {
//                index: me._cidx = idx,
//                imagZoom: true,
//                content: me._setImgs(wData),
//                template: {
//                    item:
//                        me.imgItemTpl
//                }
//            }).on('slideend', $.proxy(me._slide, me));
    },
    displaySlider: function( idx ) {
        'use strict';
        var me = this;
        me._setInfo( idx );
        $( "#photos-detail .place-loading" ).remove();
        me.area.slider( { index: Number( idx ) }).on( 'slideend', $.proxy( me._slide, me ) );
    },
    _slide: function( e, idx ){
        'use strict';
        var me = this;
//            instance = $("#img-area").slider('this'),
//            cidx = $.inArray(instance._active, instance._options.content);
        me._setInfo( idx );
    },
    _setInfo: function( idx ){
        'use strict';
        var me = this,
            idx = Number( idx) ;
        me.frowWhere.html( me.photos[idx].cn_name );
        me.cIndex.html( idx + 1 );
    },
    _setImgs: function( wData ){
        'use strict';
        var me = this,
            dim = me._getDim(),
            imgs = [],
            photos = wData.photos;
        for( var i in photos ){
            imgs.push({
                pic: me._getPic(photos[i], dim)
            });
        }
        return imgs;
    },
    _getPic: function( item, dim ){
        'use strict';
        return this.config.iService
            .replace( "$h$", dim.sHeight )
            .replace( "$w$", dim.sWidth )
            .replace( "$src$", encodeURIComponent( item.imgUrl ) );
    },
    bindEvent: function(){
        'use strict';
        var me = this;
        me.onImgLoading().onResize().stop;
    },
    unbindEvent: function(){
        'use strict';
        var me = this;
        me.offImgLoading().offResize();
    },
    /**
     * @description 计算所有页面的相应尺寸
     * @returns {{pHeight: number, tWidth: number, tHeight: number, sWidth: number, sHeight: number}}
     * @private
     */
    _getDim: function(){
        'use strict';
        var cs = this.getClientSize(),
            offs = this.getSliderOffset(),
            tw = (cs.width - 46) / 3,
            th = tw * .75,
            sw = cs.width * .9,
            sh = (cs.height - offs.top - 40),
            ph = cs.height - offs.top;
        return {
            pHeight: ph,
            tWidth: Math.floor( tw ),
            tHeight: Math.floor( th ),
            sWidth: Math.floor( sw ),
            sHeight: Math.floor( sh ),
            cs:cs
        };
    },
    /**
     * 计算窗口尺寸
     *
     */
    getClientSize: function() {
        'use strict';
        var w = window;
        return {
            width: w.innerWidth,
            height: w.innerHeight
        };
    },
    getSliderOffset: function(){
        'use strict';
        var me = this;
        return me.$el.offset();
    },
    resize: function(){
        'use strict';
        var me = this,
            dim = me._getDim();
        me.$el.css( { height: dim.pHeight } );
        me.area.css( { height: dim.sHeight } );
    },
    onResize: function(){
        'use strict';
        var me = this;
        !( me._resizeFun ) &&
        $( window ).on( "resize orientationchange", ( me._resizeFun = $.proxy( me.resize, me ) ) );
        return me;
    },
    offResize: function(){
        'use strict';
        var me = this;
        (me._resizeFun) &&
        ( $(window).off( "resize orientationchange", ( me._resizeFun ) ) || ( me._resizeFun = null ) );
        return me;
    },
    onImgLoading: function(){
        'use strict';
        this.imgs
            .on( "load", $.proxy( this._handleImgLoad, this ) )
            .on( "error", $.proxy( this._handleImgError, this ) );
        return this;
    },
    offImgLoading: function(){
        'use strict';
        this.imgs.off();
        return this;
    },
    _handleImgError: function(e){
        'use strict';
        $( e.currentTarget ).attr( "src", "/widget/photodetailslider/images/no_img.png" );
    },
    _handleImgLoad: function(e){
        'use strict';
        var t = $( e.target );
        t.parent().removeClass( "loading" );
    }
};

});
;define('place:widget/photodetailtile/photodetailtile.js', function(require, exports, module){

/**
 * Created with JetBrains WebStorm.
 * User: chenkang01
 * Date: 13-11-6
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */

var url = require('common:widget/url/url.js');

module.exports = {
    config: {
        iService : '',
        iServiceTpl: 'height=$h$&width=$w$&quality=70&src=$src$',
        iThreshold: 12,
    },
    imgItemTpl: '<div class="tile-arena-item" style="width:$w$px;height:$h$px"><img data-idx="$i$" src="$url$" alt="加载中……"/></div>',
    $el: null,
    tile: null,
    photos: null,
    end: 0,
    init: function(wData) {
        'use strict';
        var me = this;
        me.end = 0;
        me.$el = $("#phototile");
        me.tile = me.$el.find(".tile-arena");
        me.showFooter = me.$el.find('.tile-footer');
        me.showBtn = me.showFooter.find("a");
        me.photos = wData.photos;
        me.config.iService = wData.thumbnailURL + me.config.iServiceTpl;
        me.bindEvent();
        me.displayTile();
    },
    displayTile: function() {
        'use strict';
        var me = this,
            start = me.end,
            il = (me.end + me.config.iThreshold) >= me.photos.length,
            end = il ? me.photos.length : (me.end + me.config.iThreshold),
            imgs = [],
            dim = me._getDim(),
            urlTpl = me.config.iService.replace("$h$", dim.tHeight).replace("$w$", dim.tWidth);
        for( ; start < end; start ++ ){
            var src = urlTpl.replace("$src$", encodeURIComponent(me.photos[start].imgUrl));
            imgs.push(me.imgItemTpl.replace('$i$', start).replace('$url$', src).replace("$h$", dim.tHeight).replace("$w$", dim.tWidth));
        }
        var items = $( imgs.join( "" ) );
        $( "#photos-detail .place-loading" ).remove();
        me.tile.append( items );
        me.initImgLoading( items );
        il ? me.showFooter.hide() : me.showFooter.show();
        me.end = end;
    },
    bindEvent: function() {
        'use strict';
        var me = this;
        me.$el.on( 'click', (me._clickEl = $.proxy( me.clickHandler, me ) ) );
        $(window).on( "resize orientationchange", ( me._resizeFun = $.proxy( me.resize, me ) ) );
        return this;
    },
    unbindEvent: function() {
        'use strict';
        var me = this;
        me._clickEl && ( me.$el.off( 'click', me._clickEl ) || ( me._clickEl = null));
        me._resizeFun && ( $( window ).off( "resize orientationchange", me._resizeFun ) || ( me._resizeFun = null ) );
        return this;
    },
    clickHandler: function(e) {
        'use strict';
        var me = this,
            cTarget = $(e.target);
        if(cTarget.attr("id") === "photo-tile-more-imgs"){
            me.displayTile();
        }else if(cTarget.parent().attr('class') === 'tile-arena-item'){
            me.displayImgSlider(cTarget);
        }
    },
    /**
     * 计算窗口尺寸
     *
     */
    getClientSize: function() {
        'use strict';
        var w = window;
        return {
            width: w.innerWidth,
            height: w.innerHeight
        };
    },
    /**
     * @description 计算所有页面的相应尺寸
     * @returns {{pHeight: number, tWidth: number, tHeight: number, sWidth: number, sHeight: number}}
     * @private
     */
    _getDim: function() {
        'use strict';
        var cs = this.getClientSize(),
            tw = (cs.width - 46) / 3,
            th = tw * .75,
            sw = cs.width * .9,
            sh = (cs.height  - 51 - 40) * .9,
            ph = cs.height - 51;
        return {pHeight: ph, tWidth: Math.floor(tw), tHeight: Math.floor(th), sWidth: Math.floor(sw), sHeight: Math.floor(sh), cs:cs};
    },
    /**
     * @description 屏幕大小变化是重置相应元素的尺寸
     * @returns this
     */
    resize: function() {
        'use strict';
        var me = this,
            dim = me._getDim();
        me.$el.find(".tile-arena-item").css({width: dim.tWidth, height: dim.tHeight});
        return me;
    },
    /**
     * @description 触发slider
     * @param {Event} e 事件对象
     */
    displayImgSlider: function(cTarget) {
        'use strict';
        var me = this,
            idx = cTarget.data('idx'),
            ps = url.get();
        ps.pageState.detail_part = 'photoslider';
        ps.pageState.idx = idx;
        url.update(ps);
    },
    initImgLoading: function($img) {
        'use strict';
        $img.find("img").on("error", $.proxy(this._handleImgError, this));
    },
    _handleImgError: function(e) {
        'use strict';
        $(e.currentTarget).attr("src", "/widget/photodetailtile/images/no_img.png");
    }
};


});
;define('place:widget/placelist/placelist.js', function(require, exports, module){

/**
 * @file place列表页处理逻辑
 */

var url = require("common:widget/url/url.js"),
	util = require("common:static/js/util.js"),
	stat = require('common:widget/stat/stat.js'),
	loc = require('common:widget/geolocation/location.js'),
	_cacheData,
	searchFlag;

function bindEvents() {
	'use strict';
	$('.btn-book[industry="scope"]').on('click', scopeBookClick);
	$(".place-widget-placelist").on('click', 'li', listClick);
	$("#place-widget-placelist-showall").on("click", showAll);
	bindPageBtn();
}

function unBindEvents() {
	'use strict';

	$('.btn-book[industry="scope"]').off('click', scopeBookClick);
	$(".place-widget-placelist").off('click', 'li', listClick);
	$("#place-widget-placelist-showall").off("click",showAll);
}

function scopeBookClick( evt ) {
	'use strict';

	var $li = $(evt.target).closest('li'),
		name = find('.list-tit').text(),
		srcname = $li.attr('srcname'),
        wd = $('.common-widget-nav .title span').text();

	stat.addCookieStat(STAT_CODE.PLACE_SCOPE_LIST_BOOK_CLICK, {'wd': wd, 'name': name, 'srcname': srcname, 'entry': searchFlag});
}

function bindPageBtn(){
	'use strict';

	var $navBtns = $(".place-widget-placelist .page-btn");
	$.each($navBtns, function (index,item) {
		var $dom = $(item);
		$dom.on("click", function( evt ){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("url"),
                wd = $('.common-widget-nav .title span').text();

            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});
			if(!btn.hasClass("unclick")) {
				url.navigate(href,{
					replace : true
				})
			}

			evt.stopPropagation();
    		evt.stopImmediatePropagation();
		});
	})
}

/**
 * 显示所有
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
function showAll( evt ) {
	'use strict';

    var $navMapLink = $("#nav_maplink");

	$("#place-widget-placelist-showall").hide();
	$(".place-widget-placelist .place-list").removeClass("acc-list");
	$(".place-widget-placelist .list-pagenav").show();
    $navMapLink.attr('href', $navMapLink.attr('href') + '&showall=1');

    // 添加强展现量统计  by cdq
    stat.addStat(STAT_CODE.PLACE_MAINRES_OPEN);

	evt.stopPropagation();
    evt.stopImmediatePropagation();
}

function listClick( evt ) {
	'use strict';

	var $item = $(this),
		href = $item.data("href"),
        name = $item.find('.list-tit').text(),
        isGen = _cacheData && _cacheData["isGenRequest"],
        target = evt.target,
        srcname = $item.attr('srcname'),
        wd = $('.common-widget-nav .title span').text();
        
    // 过滤路线按钮，防止重复触发
    if($(target).closest('a').length) {
    	return;
    }
    isGen = isGen == 1 ? 1 : 0;
    stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen, 'srcname': srcname, 'entry': searchFlag}, function(){
        url.navigate( href );
    });

    evt.stopPropagation();
    evt.stopImmediatePropagation();
}

/**
*获取URL的searchFlag参数
**/
function getFlag() {
	'use strict';

	var reg = /searchFlag=([A-Za-z]+)/g,
		matches;

	(matches = reg.exec(location.href)) && (searchFlag = matches[1])

}

function saveData( data ) {
	'use strict';

	_cacheData = data;
}

module.exports = {
	init: function( data ) {
		saveData(data);
		bindEvents();
		getFlag();

		//添加POI结果页的展现量
	    var wd = $('.common-widget-nav .title span').text();
	    stat.addStat(STAT_CODE.PLACE_LIST_VIEW, {'wd': wd});

	    if(loc.hasExactPoi()){
	        stat.addStat(STAT_CODE.PLACE_LIST_GEO_SUC);
	    }else{
	        stat.addStat(STAT_CODE.PLACE_LIST_GEO_FAIL);
	    }
	}
};


});
;define('place:widget/premium/premium.js', function(require, exports, module){

var stat = require('common:widget/stat/stat.js'),
    util = require('common:static/js/util.js'),
    cookie = require("common:widget/cookie/cookie.js"),
    statData;

var MsgManager = function(){
    var saleId, saleName, $container, $tip;

    function sendMsg(){
        var tel = $('#msg-tel').val();

        if(isNaN(tel) || tel.length !== 11 || !tel.match(/^((\(\d{3}\))|(\d{3}\-))?13[0-9]\d{8}|15[89]\d{8}|18\d{9}/g)){
            $tip.addClass('tip-active');
            setTimeout(function(){
                $tip.removeClass('tip-active');
             },1000);
            return;
        }
        
        Msg.send(
            {
                en_name: saleName,
                poi_id: poiID,
                promo_id: saleId,
                mobile: tel
            }, 
            sendMsgSuccess
        );
        //hide the message
        showMessage({'type':'sendIng'});

        //stat.addStat(STAT_CODE.STAT_PREMIUM_DETAIL_CLICK_BTN, {uid: poiID, source: poiID === sourceUid ? 'qr' : ''});
    }
    function cancelSend(){
        Popup.hidePopup();
    }
    function showMessage(opts) {
        opts = opts || {};

        var ms = {       
                'noNetWork' : '请检查网络，稍后重试',
                'sendIng' : '正在发送...',
                'success' : '发送成功',
                'fail' : '发送失败'
            },
            message = opts.message || ms[opts.type] || ms['fail'],
            $msgForm = $container.find('.msg-form');
            $msgNotice = $container.find('.msg-notice');
         
         $msgForm.hide();
         $msgNotice.show().html(message);
    }
    function sendMsgSuccess(json){
        var errno = json.errorNo,
            baidu_id,
            promo_id;
         
        if(errno === 0){
            //baidu_id =  cookie.get("BAIDUID");
            // = this.get("saleId");

            //for lba
            //placeUtil.addStatForMec(1, {'stat_type':'lbc_promo', 'origin':6, 'promo_id':promo_id, 'baidu_id':baidu_id, 'action':2});
//            stat.addStat(STAT_CODE.STAT_PLACE_PREMIUM_SEND_SUCCESS,{
//              uid : poiID,
//              source: poiID === sourceUid ? 'qr' : ''
//            });
            showMessage({'type':'success'});
        }
        else{
            showMessage({'message':json.errMsg});
        }       

        //close the prompt after 2seconds
        setTimeout(function(){
            Popup.hidePopup();            
        },2000);
    }

    function init(){
            Popup.creatPopup();

            $container = $('div.msg-container');
            $tip = $container.find('.tip');
            
            $("#msg-send-btn").on("click",sendMsg);
            $("#msg-cancel-btn").on("click",cancelSend);
    }

    return {
        show : function(id, name){
            saleId = id || '';
            saleName = name || '';

            init();            

            $('.place-msg-mask').show().find('input').focus();
        }
    };
}(),
Popup = {
    creatPopup : function(){
        var popupHtml = '<div class="place-msg-mask">\
            <div class="msg-container">\
                <div class="msg-form">\
                    <p>请输入手机号</p>\
                    <p>\
                        <input type="tel" id="msg-tel"/>\
                        <span class="tip">请输入正确手机号</span>\
                    </p>\
                    <p class="opt">\
                        <a href="javascript:void(0);" id="msg-send-btn" class="msg-send-btn">发送</a>\
                        <a href="javascript:void(0);" id="msg-cancel-btn" class="msg-cancel-btn">取消</a>\
                    </p>\
                </div>\
                <div class="msg-notice"></div>\
            </div>\
        </div>';

        $(popupHtml).appendTo("#wrapper");

    },
    hidePopup : function(){
        $('.place-msg-mask').remove();
    }
},
Msg = {
    send: function(opt, callback){
        opt = $.extend({
            qt: 'sms',
            en_name: '',
            poi_id: '',
            promo_id: '',
            mobile: '',
            src: 'map',
            terminal: 'webapp',
            imei: 200000000000000
        }, opt);

        $.ajax({
            'url' : 'http://client.map.baidu.com/detail',
            'data': opt,
            'success' : callback,
            'dataType' : 'jsonp'
        });
    }
},
sourceUid = util.urlToJSON(location.href).uid,
poiID;

/**
 * 显示上一页
 * @param {event} e 事件对象
 */
function goPrev(e) {
    var $uls = $('.premium-list > li'), //优惠信息层元素集合
        $prev = $('.place-widget-premium-pagenum-prev'), //上一页元素
        $next = $('.place-widget-premium-pagenum-next'), //上一页元素
        $curpage = $('.place-widget-premium-curpage');//当前页面元素
    var cp = $curpage.html()-0; //当前页面索引

    if($next.hasClass('place-widget-premium-disable')){
        $next.removeClass('place-widget-premium-disable');
    }

    if(!$prev.hasClass('place-widget-premium-disable')){
        $next.on('click', goNext);

        $uls.hide();
        $uls.eq(cp-2).show();
        $curpage.html(cp-1);
        if(cp-2==0){
            $prev.addClass('place-widget-premium-disable');
            $prev.off('click', goPrev);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function goNext(e) {
    var $uls = $('.premium-list > li'), //优惠信息层元素集合
        $prev = $('.place-widget-premium-pagenum-prev'), //上一页元素
        $next = $('.place-widget-premium-pagenum-next'), //上一页元素
        $curpage = $('.place-widget-premium-curpage'), //当前页面元素
        $totalpage = $('.place-widget-premium-totalpage'); //总页数
    var cp = $curpage.html() - 0, //当前页面索引
        total = $totalpage.html() - 0; //总页数

    if($prev.hasClass('place-widget-premium-disable')){
        $prev.removeClass('place-widget-premium-disable');
    }


    if(!$next.hasClass('place-widget-premium-disable')){
        $prev.on('click', goPrev);

        $uls.hide();
        $uls.eq(cp).show();
        $curpage.html(cp+1);
        if(cp+1==total){
            $next.addClass('place-widget-premium-disable');
            $next.off('click', goNext);
        }
    }

    e.stopPropagation();
    e.stopImmediatePropagation();
}

module.exports = {
    init: function(arg, data){
        poiID = arg;
        statData = data || {};

        var total = $('.place-widget-premium-totalpage').html()-0; //总页数

        if(total>1){
            $('.place-widget-premium-pagenum-prev').on('click', goPrev);
            $('.place-widget-premium-pagenum-next').on('click', goNext);
        }

        $('#place-premium-msg-btn').click(function(){
            var $target = $(this),
                saleId = $target.data("saleid"),
                enName = $target.data("enname");

            window.scrollTo(0, $('#product-nav').height());

            MsgManager.show(saleId, enName);

            // 详情页短信下载点击量
            stat.addStat(STAT_CODE.PLACE_PREMIUM_SMSG_DL_CLICK, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
        });

        //添加团购页展现量
        stat.addStat(STAT_CODE.PLACE_PREMIUM_VIEW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
    }
};


});
;define('place:widget/recommend/recommend.js', function(require, exports, module){

/**
 * @file recommend-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var url = require("common:widget/url/url.js"),
    stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';
    var $rs = $('.place-widget-recommend ul li');
    $rs.on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';
    var $rs = $('.place-widget-recommend ul li');
    $rs.off('click', gotoDetail);
}

/**
 * 跳转到详情页
 * @param {event} e 事件对象
 */
function gotoDetail(e) {
    'use strict';

    var $item = $(e.target).closest('li'),
        cur_url = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_src = $('.place-widget-captain .name').text(),
        name_dest = $item.find('p').eq(0).text().substr(2),
        lastIndex = cur_url.lastIndexOf("/"),
        leftp,
        rightp;

    leftp = cur_url.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = cur_url.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_CATER_DETAIL_RECOMMEND_CLICK, {'name': name_src}, function(){
        url.navigate(newurl);
    });

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/recommend
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});
;define('place:widget/scopebook/scopebook.js', function(require, exports, module){

/**
 * @file scopebook-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var stat = require('common:widget/stat/stat.js');

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    var $rs = $('.scope-ticket-name').parent();
    $rs.on('click', toggleOta);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    var $rs = $('.scope-ticket-name').parent();
    $rs.off('click', toggleOta);
}

/**
 * 切换ota是否展现的状态
 */
function toggleOta(e) {
    var $item = $(e.target).closest('div'),
        $arrow = $item.find('span').eq(0),
        $ul = $item.next(),
        $rs = $('.scope-ticket-name').parent(),
        $widget = $('.place-widget-scope-book');

    if(!$arrow.hasClass('scope-arrow-icon-down')) {
        $rs.next().addClass('scope-book-hide');
        $rs.find('.scope-arrow-icon').removeClass('scope-arrow-icon-down');

        if($item.attr('last')) {
            $item.addClass('scope-border-bottom');
        }else{
            $rs.last().addClass('scope-border-bottom-radius');
            $rs.last().attr('style', 'border-bottom: none');
        }
    }

    $arrow.toggleClass('scope-arrow-icon-down');
    $ul.length == 0 ? null : $ul.toggleClass('scope-book-hide');

    if($item.attr('last')) {
        $item.attr('style', '');
        $item.toggleClass('scope-border-bottom-radius');
        if($item.attr('class')!='scope-border-bottom') {
            $item.attr('style', 'border-bottom: none');
        }
    }

    scrollWindow($widget);

    e.stopPropagation();
    e.stopImmediatePropagation();

 }

/**
* 滚动窗口
* @param  {Object} target 滚动到的对象
*/
function scrollWindow($target) {
    var offset = $target.offset();
    window.scrollTo(0, offset.top);
}

/**
 * @module place/widget/recommend
 */
module.exports = {

    init: function() {
        'use strict';

        bindEvents();

    }
};

});
;define('place:widget/selectbox/selectbox.js', function(require, exports, module){

/**
 * @file 筛选框逻辑
 */

var url = require("common:widget/url/url.js"),
	loc  = require('common:widget/geolocation/location.js'),
	util   = require('common:static/js/util.js'),
	stat = require('common:widget/stat/stat.js'),
	_selectType,what,
	adpatConfig = {
		takeout : {
			"pl_dist" : "radius",
			"pl_sort_type" : "sortType",
			"pl_sort_rule" : "orderType",
			"pn" : "pageNum"
		}
	},
	_data;

module.exports.init = function(data){
	var	wd, srcname;
	(_data = data || {}) && (wd = _data.wd) && (srcname = _data.srcname)
	bind();
	_selectType = _data.select_type;
	what = _data.what;

	//添加place列表页筛选条件的展现量统计
	stat.addStat(STAT_CODE.PLACE_LIST_FILTER_VIEW, {'wd': wd, 'srcname': srcname});
}

/**
 * 绑定事件
 */
var bind = function () {

	var selects = $(".place-widget-selectbox select"),
		len = selects.length,
		i = 0;

	$.each(selects, function(index, item){
		$(item).on("change",handleSelect);
	});

	$(".city-select").on("click", _onClickCity);
}

var handleSelect = function(evt){
	var target = evt.target,
        type = $(target).closest('select').attr('name'),
        selectedIndex = $(target)[0].selectedIndex,
        $selectedOption = $($(target)[0][selectedIndex]),
        value = $selectedOption.text(),
        wd = _data.wd,
		srcname = _data.srcname;
    
    //添加筛选条件的点击统计
    switch(type){
        case 'pl_dist':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_RANGE_CLICK, {'wd': wd, 'range': value, 'srcname': srcname});
            break;
        case 'pl_sort_type':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_SORT_CLICK, {'wd': wd, 'sort': value, 'srcname': srcname});
            break;
        case 'pl_sub_type':
            stat.addCookieStat(STAT_CODE.PLACE_LIST_FILTER_CATEGORY_CLICK, {'wd': wd, 'type': value, 'srcname': srcname});
            break;
        default :
    }
    
	_changeTitle(target);
	_submitSelect();
}

/**
 * 修改筛选框标题
 * @param  {HTMLElement} dom 筛选框的dom节点   
 */
var _changeTitle = function(dom){
    var $select = $(dom);
    var selectedIndex = $select[0].selectedIndex;
    var selectedOption = $($select[0][selectedIndex]);
    var value = selectedOption.text();
    var $title = $select.parent().children(".select_title");
    $title.html(value);
}

/**
 * 完成筛选
 */
var _submitSelect = function(){
	var query = url.get().query;
	var param = _getSelectParams();
	var c = loc.getCityCode();
	param = $.extend(param,{
		"pn" : 0
	});

	query = $.extend(query,param,{
		c : c
	});

	if(_selectType === "takeout") {
		query = paramAdapt(query, _selectType);
	}

    // 针对酒店行业，筛选列表中只包含酒店的检索结果, by zmm
    if ( _selectType === 'hotel' ) {
        query.pl_filt_type_section = 1;
    }

	if(query.pl_tonight_sale_flag_section) {
		delete query.pl_tonight_sale_flag_section;
	}

	// 处理筛选框全市逻辑
	if(query.pl_dist == "全市") {
		delete query.center_rank;
	} else if(query.nb_x && query.nb_y) {
		query.center_rank = 1;
	}
	// 处理电影预定逻辑
	if(query.pl_sort_type == "movie_book") {
		query.pl_movie_book_section="1,1";
	}else{
		query.pl_movie_book_section="0,+";
	}

	url.update({
		query : query,
		pageState : {
			show_select : 1
		}
	},{
		queryReplace : true,
		replace : true
	});
}

/**
 * 获取筛选参数
 */
var _getSelectParams = function(){
	var selects = $(".place-widget-selectbox select"),
		param = {},
		_name,
		_value,
		paramKey;
	$.each(selects,function(index,item){
		var _param = {},
			$item = $(item),
			parent = $item.parent("select-box");
		_name = $(item).attr("name");
		_value = $(item).val();
		switch(_name) {
			case "pl_sub_type" : 
				_param["wd"] = _value;
				_param["pl_sub_type"] = _value;
				break;
			case "pl_sort_type" :
				_param["pl_sort_type"] = _value.split("__")[0];
				_param["pl_sort_rule"] = _value.split("__")[1] || 0;
				break;
			case "pl_dist" :
				_param["pl_dist"] = _value;
				break;

		}
		param = $.extend(param,_param);
	});

	return param;
}

/**
 * 进行参数转换
 * @param  {Object} paramObj 参数
 * @return {[type]}          [description]
 */
var paramAdapt = function(paramObj,type) {
	if(!paramObj || !type) {
		return;
	}

	var _param = $.extend({},paramObj);
	var config = adpatConfig[type];

	$.each(config, function(key,transKey){

		var paramValue = _param[key];
		if(paramValue){
			_param[transKey] = paramValue;
		}
		if( key !== "pl_sort_rule" && paramValue == "0" ) {
			delete _param[transKey];
		}
		delete _param[key];
	});

	return _param;
}


var _onClickCity = function (evt) {
	var cityType = loc.getCityType(),
		cityCode = loc.getCityCode(),
		urlParam = url.get(),
		referQuery = urlParam.query || {},
		referPagestate = urlParam.pageState  || {},
		wd = _data.wd,
		srcname = _data.srcname;

	referQuery.wd = what || referQuery.wd;

	// 如果当前是区县，则获取上一级的城市code
	if(cityType === 3) {
		cityCode = loc.getUpCityCode() || cityCode;
	}

	refer_query = JSON.stringify(urlParam.query || {});
	refer_pagestate =  JSON.stringify(urlParam.pageState || {});

	// 添加城市检索统计
	stat.addCookieStat(STAT_CODE.PLACE_SELECT_CLICK_CITY, {'wd': wd, 'srcname': srcname});

	url.update({
		module : "index",
		action : "setmylocation",
		query : {
			c : cityCode
		},
		pageState : {
			refer_query : refer_query,
			refer_pagestate : refer_pagestate,
			list_type : "business_area"
		}
	},{
		queryReplace : true,
		pageStateReplace : true
	});
}


});
;define('place:widget/selectlist/selectlist.js', function(require, exports, module){

/**
 * @file 设置精确点
 */

var loc = require('common:widget/geolocation/location.js');
var url = require('common:widget/url/url.js');
var util = require('common:static/js/util.js');
var setCity = require("common:widget/setcity/setcity.js");

var referQueryKey = "_refer_query";
var referPageStateKey = "_refer_pagestate";


module.exports.init = function(data) {
    saveData(data);
    bind();
}

var _cacheData;
var RESULT_TYPE_NONE = 0; //没有结果
var RESULT_TYPE_NOTCUR = 1; //本城市无结果
var RESULT_TYPE_POISUC = 2; //成功返回结果
var RESULT_TYPE_AREA = 3; //
var BUSINESS_SPLIT = "     "; //商圈筛选分隔符


var saveData = function(data) {
    _cacheData = data;
}

var bind = function() {
    $list = $(".place-widget-selectlist");
    $list.on("click", "li", _onClickList);
}

var _onClickList = function(e) {
    var $dom = $(this);
    var index = +$dom.data("i") - 1;


    selectPlace(index);
}

var selectPlace = function(index) {
    if (typeof index == "undefined") {
        return;
    }

    var item = _cacheData.list[index];
    var urlParam = url.get();
    var pageState = urlParam.pageState;
    var locData = getLocData(item);
    var _referPageState = pageState.refer_pagestate;
    var _referQuery = pageState.refer_query;

    if (_referQuery && _referQuery != "undefined") {
        setLocation(locData, false);
        redirectToRefer(item, {
            referQuery: _referQuery,
            referPageState: _referPageState,
        });
    } else {
        setLocation(locData);
        // 城区结果处理
        if (!locData.isExactPoi && locData.addr.cityType !== 3) {
            setCity.setAndRedirect(locData.addr.city, locData.addr.cityCode);
        } else {
            url.toIndex({
                cache: false
            });
        }
    }
}

var redirectToRefer = function(data, options) {
    var urlParam = url.get(),
        opts = options || {},
        pagestate = urlParam.pageState || {},
        query = JSON.parse(opts.referQuery) || {},
        state = JSON.parse(opts.referPageState) || {},
        isTakeout = query.qt === 'wm' || state.search === "takeout",
        x = isTakeout ? 'pointX1' : 'nb_x',
        y = isTakeout ? 'pointY1' : 'nb_y',
        module, action, route, type,
        city = _cacheData["city"];

    //若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
    if (query.wd && query.wd.split(BUSINESS_SPLIT)[1]) {
        query.wd = query.wd.split(BUSINESS_SPLIT)[1];
    }

    query.c = city.code;

    type = _getDataType();

    //跳转到外卖页
    if (isTakeout) {
        route = _switchToTakeout(data, query);
        //跳转到place页
    } else {
        route = _switchToPlace(data, query);
    }

    state = $.extend(state, {
        'center_name': data.name || ""
    });

    // 删除可能存在的i参数，避免存在直接进入详情页
    delete state.i;

    //跳转到其他页面
    url.update({
        module: route.module,
        action: route.action,
        query: route.query,
        pageState: state
    }, {
        'queryReplace': true,
        'pageStateReplace': true
    });
}

var getLocData = function(data) {
    if (!data) return;

    var _type = _getDataType();
    var city = _cacheData.city;
    var point = util.geoToPoint(data.geo);
    var addr = getAddr(data);
    var locData;

    locData = {
        addr: addr,
        isExactPoi: addr.isExactPoi,
        point: {
            x: point.lng,
            y: point.lat
        }
    }
    return locData;
}


/**
 * 设置我的位置
 * @param {string} name 地理描述信息
 * @param {array}  point 坐标数组, point[0]为x坐标, point[1]为y坐标
 */
var setLocation = function(locData, isSaveLocInCookie) {
    if (!locData) {
        return;
    }
    locData.isSaveLocInCookie = true;

    // if( isSaveLocInCookie === false){
    //     //是否保存定位信息
    //     locData.isSaveLocInCookie = false;
    // }


    //重设我的位置    
    loc.setAddress(locData);
};


var getAddr = function(item) {
    var addr,
        isExactPoi,
        cityType,
        cityInfo = _cacheData.city;
    cityName = cityInfo.name;

    //若是特殊区域，如北京市，海淀区等,name 进行特殊处理
    if (item.cname) {
        name = item.pcname ? item.pcname + item.cname : item.cname;
        isExactPoi = false;
    } else {
        name = item.name;
        isExactPoi = true;
    }
    var upCityCode = null;

    //当前位置是区
    if (item.city_type === 3) {
        upCityCode = cityInfo.up_cityid;
    }

    addr = {
        address: name,
        city: cityName,
        cityCode: item.code ? item.code : cityInfo.code,
        isExactPoi: isExactPoi,
        cityType: item.city_type ? item.city_type : cityInfo.type,
        upCityCode: item.pccode ? item.pccode : upCityCode
    }
    return addr;
}

var _getDataType = function() {
    return _cacheData["type"];
}

/**
 * 跳转到外卖页
 */
var _switchToTakeout = function(data, query) {
    var type = _getDataType(),
        point;

    // 如果是城区结果，则不加中心点
    if (type != 2) {
        point = util.geoToPoint(data.geo);
        query['pointX1'] = point.lng;
        query['pointY1'] = point.lat;
        query['nb_x'] = point.lng;
        query['nb_y'] = point.lat;
        query['center_rank'] = 1;
        query['m'] = 'searchXY';
    } else {
        query['m'] = 'searchBrands';
        delete query['pointX1'];
        delete query['pointY1'];
        delete query['center_rank'];
        delete query['nb_x'];
        delete query['nb_y'];
    }

    query = $.extend(query, {
        'cityId': data.addr.cityCode,
        'directId': data.addr.cityCode,
        'pageNum': 1,
        'pageSize': 10
    })

    return {
        query: query,
        module: 'place',
        action: 'takeout'
    };
}

/**
 * 跳转到place页
 */
var _switchToPlace = function(data, query) {
    var type = _getDataType(),
        point;

    // 如果是城区结果，则不加中心点
    if (type != 2) {
        point = util.geoToPoint(data.geo);
        query['nb_x'] = point.lng;
        query['nb_y'] = point.lat;
        query['center_rank'] = 1;
    } else {
        delete query['nb_x'];
        delete query['nb_y'];
        delete query['center_rank'];
        delete query['pointX1'];
        delete query['pointY1'];
    }

    query = $.extend(query, {
        'c': data.addr.cityCode,
        'center_rank': 1,
        'pn': 0 // 设置页码为第一页
    });

    return {
        query: query,
        module: 'search',
        action: 'search'
    };
};


});
;define('place:widget/takeoutdetailnav/takeoutdetailnav.js', function(require, exports, module){

module.exports = {
    init: function() {
        $('.place-widget-takeout-detail').on('click', function() {
            $('#place-widget-dish-category').hide();
        });

        $('.menu-btn').click(function() {
            if ($('#place-widget-dish-category .dish-name').length > 0) {
                $('#place-widget-dish-category').toggle();
            }
        });
    }
};

});
;define('place:widget/takeoutlist/takeoutlist.js', function(require, exports, module){

module.exports.bind = function(){
    $pageNav = $(".place-widget-taskoutlist .page_btn");
    $.each($pageNav, function (index,item) {
        var $dom = $(item);
        $dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("href");

            if(!btn.hasClass("unclick")) {
                href = "http://" + location.host + href;
                window.location.replace(href);
            }
        });
    })
};

});
;define('place:widget/telephone/telephone.js', function(require, exports, module){

/**
 * @file telephone-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
'use strict';

var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    var $telephone = $('.place-widget-telephone');
    $telephone.on('click', showTelBox);

}

/**
 * 解绑事件
 */
function unbindEvents() {
    var $telephone = $('.place-widget-telephone');
    $telephone.off('click', showTelBox);
}

/**
 * 显示下一页
 * @param {event} e 事件对象
 */
function showTelBox(e) {
    var $target = $(e.target).closest('a'),
        reg = /searchFlag=([A-Za-z]+)/g,
        matches,
        searchFlag,
        statOpts;

    (matches = reg.exec(location.href)) && (searchFlag = matches[1])

    statOpts = {
        'wd': statData.wd, 
        'name': statData.name, 
        'srcname': statData.srcname, 
        'entry': searchFlag
    };
    stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_CLICK, statOpts);

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/telephone
 */
module.exports = {
    init: function( data ) {
        bindEvents();

        statData = data || {};

        stat.addStat(STAT_CODE.PLACE_DETAIL_TELEPHONE_SHOW, {'wd': statData.wd, 'name': statData.name, 'srcname': statData.srcname});
    }
};

});
;define('place:widget/thirdcomment/thirdcomment.js', function(require, exports, module){

var util = require('common:static/js/util.js');

module.exports = {
    init: function() {
        if ( $( '#J_commentSelect' ) ) {
            $( '#J_commentSelect').on( 'change', this.loadMore );
        }
    },
    loadMore: function() {
        var $select = $(this),
            params = util.jsonToUrl({
                uid: $select.data( 'uid' ),
                startIndex: 0,
                maxResults: 5,
                orderBy: $select.val()
            });

        BigPipe.asyncLoad( {id: 'place-pagelet-bdcomment'}, params )
    }
}


});
;define('place:widget/toplist/toplist.js', function(require, exports, module){

/**
 * @file toplist-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

var stat = require('common:widget/stat/stat.js'),
    url = require("common:widget/url/url.js"),
    wd = $('.common-widget-nav .title span').text(),
    statData;

/**
 * 绑定事件
 */
function bindEvents() {
    'use strict';

    $('.place-widget-toplist').on('click', showAll);
    $('.place-widget-toplist-others').on('click', gotoDetail);
}

/**
 * 解绑事件
 */
function unbindEvents() {
    'use strict';

    $('.place-widget-toplist').off('click', showAll);
    $('.place-widget-toplist-others').off('click', gotoDetail);
}

/**
 *处理点击排行榜显示所有排行的事件
 * @param {event} e 事件对象
 */
function showAll(e) {
    'use strict';

    $('.place-widget-toplist-arrow').toggleClass('place-widget-toplist-arrowup');
    $('.place-widget-toplist-others').toggleClass('place-widget-toplist-showall');

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * 跳转到详情页
 * @param {event} e 事件对象
 */
function gotoDetail(e) {
    'use strict';

    var $item = $(e.target).closest('li'),
        href = location.href,
        uid = $item.attr('data-uid'),
        newurl,
        name_dest = $item.find('p').eq(0).text(),
        lastIndex = href.lastIndexOf("/"),
        leftp, rightp,
        wd = $('.common-widget-nav .title span').text(),
        statOpts = {
            'wd': wd,   //注意key必须有引号
            'name_src': statData.name, 
            'name_dest': name_dest,
            'srcname': statData.srcname
        };
    
    leftp = href.slice(0, lastIndex).replace(/qt=[A-Za-z]*/g, 'qt=inf');
    rightp = href.slice(lastIndex);   
    newurl = leftp + '&uid=' + uid + rightp;

    stat.addCookieStat(STAT_CODE.PLACE_DETAIL_RANK_CLICK, statOpts, function(){
        url.navigate( newurl );
    });

    e.stopPropagation();
    e.stopImmediatePropagation();
}

/**
 * @module place/widget/toplist
 */
module.exports = {

    init: function( data ) {
        'use strict';

        bindEvents();
        statData = data || {};
        var wd = $('.common-widget-nav .title span').text();
        //添加详情页排行榜的展现量
        stat.addStat(STAT_CODE.PLACE_DETAIL_RANK_VIEW, {'wd': wd, 'name': statData.name, 'srcname': statData.srcname});

    }
};

});
;define('place:widget/tosearch/tosearch.js', function(require, exports, module){

/**
 * @file tosearch-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */

/**
 * @module place/widget/tosearch
 */
module.exports = {

    init: function() {
        'use strict';

        var $name = $('.place-widget-tosearch .name');
		$name.css('max-width', $('body').offset().width - 200 + 'px');
		$(window).on('resize', function(){
		    $name.css('max-width', $('body').offset().width - 200 + 'px');
		});

    }
};



});