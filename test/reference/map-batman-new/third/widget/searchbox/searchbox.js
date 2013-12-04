require('common:static/js/gmu/src/widget/suggestion/suggestion.js');
require('common:static/js/gmu/src/widget/suggestion/renderlist.js');
require('common:static/js/gmu/src/widget/suggestion/$quickdelete.js');
require('common:static/js/gmu/src/widget/suggestion/sendrequest.js');
/*
 * @fileoverview 搜索框View
 * @author jican@baidu.com
 * @date 2013/01/22
 */

var util        = require('common:static/js/util.js'),
    url        = require('common:widget/url/url.js'),
    geolocator  = require('common:widget/geolocation/geolocation.js'),
    locator     = require('common:widget/geolocation/location.js'),
    poisearch   = require('common:widget/search/poisearch.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function () {
        this.render();
        this.bind();
    },

    render : function () {

        var _this = this;

        // 注册suggesstion
        this._poiSug = new gmu.Suggestion('#se-input-poi', {
            // mask: '.se-form',
            source: 'http://map.baidu.com/su',
            cbKey : 'callback',
            listCount: 6,       // SUG条目
            posAdapt: false,    // 自动调整位置
            historyShare: true, // 是否共享
            autoClose: true,
            appendContanier: '#wrapper', //是否挂在body下面
            quickdelete :true
            
        });
        this._poiSug.$wrapper.offset({
            left: 0,
            top:  104
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

        listener.on('common.geolocation', 'success', this.updateMyPos, this);

        $('.index-widget-searchbox [jsaction]').on('click', $.proxy(this.go, this));
        listener.on('common.page','switchstart',function(){
            $('.ui-suggestion').length && $('.ui-suggestion').hide();
        });
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