define('place:widget/hotelbook/hotelbook.js', function(require, exports, module){

/**
 * @file hotelbook-widget的事件和动作的处理
 * @author Luke(王健鸥) <wangjianou@baidu.com>
 */
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    placeBroadcastName = require('place:static/js/broadcastname.js'),
    util = require('common:static/js/util.js'),
    geolocation = require('common:widget/geolocation/location.js'),
    popup = require('common:widget/popup/popup.js'),
    stat = require('common:widget/stat/stat.js');

/**
 * @module place/widget/hotelbook
 */
module.exports = {
    create: function () {
        var $el = this.$el = $('.place-widget-hotel-book');
        this.serverAddr = 'http://' + location.host + '/mobile/webapp/place/hotelbook/async=1&qt=';

        this.$showAllRoom = $el.find('.show-all-room');  //查看其他房型层
        this.$showAllOta = $el.find('.show-all-ota');    //展开其他报价层
        this.$hbMain = $el.find('.main'); //房型层父元素
        this.$roomsWp = $el.find('.rooms'); //房型层
        this.$rooms = $el.find('.room-list > li'); //全部房型
        this.$roomsHide = $el.find('.room-list > li').slice(3); //默认收起的房型元素集合
        this.$otasHide = $el.find('.ota-list > li').slice(3);  //默认收起的ota报价元素集合
        this.$otaResult = $el.find('.ota-result');  //ota结果根元素
        this.$fetchFailed = $el.find('.ota-failed'); //获取ota数据失败的页面
        this.$bookBtn = $el.find('.ota-bookbtn');  //预订按钮
        this.uid = $('#uid').html(); //酒店的uid
        this.isShowAllRoom = false; //是否展示了全部房型
        this.isShowAllOta = false;  //是否展示了全部的ota报价
        this.isShowOta = true;  //是否展示了ota报价
        //this.$targetRoom;  //当前点击的房型元素
        this.lastIndex = '0'; //上次点击的房型的索引
        this.currentIndex = '0';  //当前点击的房型的索引
        //this.sd;
        //this.ed; // 开始与结束时间
        broadcaster.subscribe(placeBroadcastName.DATEPICKER_DATE_CHANGE, $.proxy(this.onDatepickerDateChange, this));
        broadcaster.broadcast(placeBroadcastName.HOTELBOOK_OR_THIRDSRCOTA_SHOW);
    },
    onDatepickerDateChange: function (data) {
        if (data.sd !== this.sd || data.ed !== this.ed) {
            this.sd = data.sd;
            this.ed = data.ed;
            var param = {
                st: data.sd,
                et: data.ed,
                uid: this.uid
            };

            BigPipe.asyncLoad({id: 'place-pagelet-hotelbook'}, util.jsonToUrl(param));
        }

    },

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
        this.$bookBtn.on('click', $.proxy(this.goToBook, this));

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
        this.$bookBtn.off('click', $.proxy(this.goToBook, this));
    },

    /**
     * 显示所有房型
     * @param {event} [e] 事件对象
     */
    showAllRoom: function (e) {
        if (!this.isShowAllRoom) {
            this.$showAllRoom.find('span').eq(0).html('收起其他房型');
            this.isShowAllRoom = true;
        } else {
            if (this.lastIndex > 2) {
                this.$otaResult = this.$el.find('.ota-result'); //异步加载后重新获取ota结果根元素
                this.$otaResult.remove(); //如果当前展开的ota页面是四个或者第四个以后的房型，则删除ota页面
                //调整房型下拉箭头为水平
                this.$el.find('.arrow-icon-open').attr('class', 'arrow-icon');
                this.isShowOta = false; //设置为未展开ota
                this.isShowAllOta = false;  //设置为未展开所有ota
            }
            this.$showAllRoom.find('span').eq(0).html('查看其他房型');
            this.isShowAllRoom = false;
        }

        this.$roomsHide.toggle();
        this.$showAllRoom.toggleClass('show-all-room-open');

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 显示当前房型所有的ota报价
     * @param {event} [e] 事件对象
     */
    showAllOta: function (e) {
        if (!this.isShowAllOta) {
            this.$showAllOta.find('span').eq(0).html('收起其他报价');
            this.isShowAllOta = true;
        } else {
            this.$showAllOta.find('span').eq(0).html('展开其他报价');
            this.isShowAllOta = false;
        }

        this.$otasHide.toggle();
        this.$showAllOta.toggleClass('show-all-ota-open');

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
            roomtype = $(e.target).closest('li').find('span').eq(1).text(),
            otaPriceUrl,
            settings = {},
            fetching;

        if (action === 'detail') {
            //详情页报价区所有房型点击量PV/UV
            stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_ROOM_CLICK, {'name': this.poiname, 'type': roomtype});
        } else if (action === 'hotelbook') {
            //预订报价页所有房型点击量PV/UV
            stat.addStat(STAT_CODE.PLACE_HOTEL_BOOK_ROOM_CLICK, {'name': this.poiname, 'type': roomtype});
        }


        this.$targetRoom = $(e.target).closest('li');
        this.currentIndex = this.$targetRoom.attr('index');

        if (!this.isShowOta || this.currentIndex != this.lastIndex) {
            this.unbindEvents();

            this.$otaResult = $el.find('.ota-result'); //异步加载后重新获取ota结果根元素
            this.$otaResult.remove();  //移除ota页面
            this.$fetchFailed = $el.find('.ota-failed'); //获取ota数据失败的页面
            this.$fetchFailed.remove();

            //切换箭头样式为朝下
            this.$targetRoom.find('span').eq(0).attr('class', 'arrow-icon-open');

            //添加ota-fetching页面
            fetching = '<div class="ota-fetching">'
                + '<span></span>'
                + '<span>正在获取实时精准报价数据...</span>'
                + '</div>';
            this.$targetRoom.after(fetching);

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
            this.isShowOta = true;
            this.lastIndex = this.$targetRoom.attr('index');
        } else {
            this.$otaResult = $el.find('.ota-result'); //异步加载后重新获取ota结果根元素
            this.$otaResult.remove();
            this.$targetRoom.find('span').eq(0).attr('class', 'arrow-icon');
            this.isShowOta = false;
        }

        this.$bookBtn.off('click', this.goToBook);

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

        this.$el.find('.arrow-icon-open').attr('class', 'arrow-icon');

        this.$targetRoom.after(data);
        //切换箭头样式为朝下
        this.$targetRoom.find('span').eq(0).attr('class', 'arrow-icon-open');

        this.$showAllOta = this.$el.find('.show-all-ota'); //异步加载后重新获取“展开其他报价”元素
        this.$otasHide = this.$el.find('.ota-list > li').slice(3); //异步加载后重新获取默认隐藏的ota报价
        this.$bookBtn = this.$el.find('.ota-bookbtn');  //异步加载后重新获取预订按钮元素

        this.bindEvents();
    },

    /**
     * 请求ota报价数据失败后的处理函数
     * @param {object} xhr XMLHttpresponse对象
     * @param {string} type 描述错误类型
     */
    doFetchOtaError: function (xhr, type) {
        this.bindEvents();
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
        this.$rooms = $el.find('.room-list > li'); //全部房型
        this.$roomsHide = $el.find('.room-list > li').slice(3); //默认收起的房型元素集合
        this.$otasHide = $el.find('.ota-list > li').slice(3);  //默认收起的ota报价元素集合
        this.$roomsWp = $el.find('.rooms'); //房型层

        this.$bookBtn = $el.find('.ota-bookbtn');  //异步加载后重新获取预订按钮元素

        this.$bookBtn.on('click', goToBook);  //异步加载后重新绑定跳转到第三方预订页面事件

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
        var $target = $(e.target),
            action = _APP_HASH.action,
            url = $target.data('url'),
            roomtype = $target.closest('li').find('span').eq(1).text(),
            otaname = $target.parent().find('.ota-name').text(),
            name,
            today = new Date().format('yyyy-MM-dd'),
            tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
            price = parseInt($target.data('price'), 10),
            bonus = parseInt($target.data('bonus'), 10) || 0,
            extraParams;

        if ($target.hasClass('ota-bookbtn-web')) {
            if (action === 'detail') {
                //详情页所有电脑预订方式的点击总量
                name = $('.place-widget-captain .name').text();
                stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_BOOKBTN_PC_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            } else if (action === 'hotelbook') {
                //房型报价页所有电脑预订方式的点击总量
                stat.addStat(STAT_CODE.PLACE_HOTEL_BOOK_BOOKBTN_PC_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            }

            popup.open({
                'text': '您好，此酒店报价需要在电脑端登陆：map.baidu.com，在酒店版块中进行搜索预订',
                'autoCloseTime': 3000
            });
        } else if ($target.hasClass('ota-bookbtn-tel')) {
            if (action === 'detail') {
                //详情页所有电话预订方式的点击总量
                stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_BOOKBTN_TEL_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            } else if (action === 'hotelbook') {
                //房型报价页所有电话预订方式的点击总量
                stat.addStat(STAT_CODE.PLACE_HOTEL_BOOK_BOOKBTN_TEL_CLICK, {'name': this.poiname, 'type': roomtype, 'ota': otaname});
            }

            if (util.isAndroid()) {
                $target.attr('href', 'javascript:void(0)');
                util.TelBox.showTb($target.attr('phone'));
            }
        } else {
            extraParams = {
                from_page: action,
                checkin_date: (this.sd || today),
                checkout_date: (this.ed || tomorrow),
                c: geolocation.getCityCode(),
                price: price,
                book_price: price - bonus,
                simple: 1
            };
            window.open(url + '&' + util.jsonToQuery(extraParams), '_blank');
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
    },

    /**
     * 切换日期后再次渲染页面
     * @param {string} sd 入住日期
     * @param {string} ed 退房日期
     */
    refreshPage: function (sd, ed) {
        this.$roomsWp.remove(); //移除当前的房型信息层

        this.isShowOta = true;
        this.isShowAllRoom = false;
        this.isShowAllOta = false;

        var settings = {
            'type': 'POST',
            'url': this.serverAddr + 'fetchrooms',
            'data': {
                'uid': this.uid,
                'st': this.sd,
                'et': this.ed
            },
            'dataType': 'html'
        };

        this.fetchData(settings, $.proxy(this.doFetchRoomSuccess, this), $.proxy(this.doFetchRoomError, this));
    },


    init: function () {
        var action = _APP_HASH.action;

        this.create();

        if (action === 'detail') {
            this.poiname = $('.place-widget-captain .name').text();
        } else if (action === 'hotelbook') {
            this.poiname = $('.place-widget-hotel-info p').eq(0).text();
        }
        if (action === 'detail') {
            //酒店有预订功能的详情页展示PV/UV
            stat.addStat(STAT_CODE.PLACE_HOTEL_BOOKABLE_DETAIL_VIEW, {'name': this.poiname});
        }
        this.bindEvents();
    }
};

});