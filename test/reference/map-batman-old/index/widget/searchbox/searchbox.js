/*
 * @fileoverview 搜索框View
 * @author jican@baidu.com
 * @date 2013/01/22
 */

var util        = require('common:static/js/util.js'),
    url        = require('common:widget/url/url.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    geolocator  = require('common:widget/geolocation/geolocation.js'),
    locator     = require('common:widget/geolocation/location.js'),
    quickdelete = require('common:widget/quickdelete/quickdelete.js'),
    suggestion  = require('common:widget/suggestion/suggestion.js'),
    poisearch   = require('common:widget/search/poisearch.js'),
    stat = require('common:widget/stat/stat.js'),
    appHistory = require("common:widget/apphistory/apphistory.js");

module.exports = {

    init : function () {
        this.render();
        this.bind();
    },

    render : function () {
        var _this = this;
         if(window.localStorage && window.localStorage.input){
            if(appHistory.isLanding()){
                localStorage.removeItem("input");
            }else{
                $("#se-input-poi").val(localStorage.input);
            }
         }
        // 注册quickdelete
        this._poiQuick = $.ui.quickdelete({
            container: '.se-input-poi',
            offset: {
                x: 0,
                y: 2
            }
        });

        // 注册suggesstion
        this._poiSug = $.ui.suggestion({
            container: '.se-input-poi',
            mask: '.se-form',
            source: 'http://map.baidu.com/su',
            listCount: 6,       // SUG条目
            posAdapt: false,    // 自动调整位置
            isSharing: true,    // 是否共享
            offset: {           // 设置初始偏移量
                x: 0,
                y: 52
            },
            param: $.param({
                type: "0",
                newmap: "1",
                ie: "utf-8"
            }),
            onsubmit: function() { //兼容widget老版，采用onEventName方式绑定
                var word = this.getValue();
                $('.se-input-poi').val(word);
                if (!word) {
                    return;
                } else {
                    _this.submit();
                }
            }
        });

    },

    bind : function () {
        $('.se-form').on('submit', $.proxy(this.submit, this));
        $('.se-btn').on('click', $.proxy(this.submit, this));
        $('.se-input-poi').on('blur', function () {
            $(".se-city").show();
        });
        $('.se-input-poi').on('focus', function () {
            $(".se-city").hide();
        });

        broadcaster.subscribe('geolocation.success', this.updateMyPos, this);

        $('.index-widget-searchbox [jsaction]').on('click', $.proxy(this.go, this));
    },

    go : function (e) {
        var target = $(e.currentTarget);
        switch(target.attr('jsaction')) {
            case 'toNavSearch' : {
                var query = {
                    'qt'        : 'cur',
                    'wd'        : locator.getCity() || '全国',
                    'from'      : 'maponline',
                    'tn'        : 'm01',
                    'ie=utf-8'  : 'utf-8'
                }
                if(window.localStorage) {
                   localStorage.input = $("#se-input-poi").val(); 
                } 
                url.update({
                    query : query,
                    pageState: {tab: 'line'}
                }, {
                    queryReplace : true
                });
                break;
            }
        }
        return false;
    },

    submit : function (evt) {

        var poiInput = $('.se-input-poi');
        if(!this._checkInput(poiInput)){
            return false;
        }

        if(evt) {
            var target = $(evt.currentTarget),
                userdata = target.attr('user-data');
            //当时搜索按钮发起的检索时需要手动把query存入历史记录 by jican
            if(userdata=='se-btn') {
                this._poiSug && this._poiSug._localStorage(poiInput.val());
            }
        }
        
        poiInput.blur();
        
        stat.addCookieStat(STAT_CODE.STAT_POI_SEARCH); //搜索框发起的检索量 @jican

        poisearch.search(poiInput.val());

        return false;
    },

    /**
     * 更新我的位置
     * @param {object} data
     */
    updateMyPos : function  (data) {
        data = data ? data : locator.getLocation();
        if(data.addr && data.addr.city) {
            $('.se-city-wd').text(data.addr.city);
        }
    },
    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     * @author jican
     * @date 2013/01/21
     */
    _checkInput : function (element) {
        if(!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        return true;
    }
}