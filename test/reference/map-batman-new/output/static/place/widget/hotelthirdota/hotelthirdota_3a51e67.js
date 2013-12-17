define('place:widget/hotelthirdota/hotelthirdota.js', function(require, exports, module){

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