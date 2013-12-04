/**
 * @fileOverview 周边推荐-酒店
 * @author jican@baidu.com
 * @data 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'hotel',
    tpl = __inline('hotel.tmpl');

module.exports = {

    hasGetData : false,

    init : function (page) {
        this.page = page;
        this.bind();
    },

    bind : function () {

        broadcaster.subscribe('nearpush.dataready', function () {
            this._render(helper.cates[id].data);
        }, this);

        switch (this.page) {
            //商圈页面不需要等待定位 直接获取数据
            case 'business' : {
                this._businessAction();
                break;
            }
            //首页需要监听页面滚轮事件 按需展现
            case 'index' : {
                this._indexAction();
                break;
            }
            //默认监听定位成功事件
            default : {
                this._defaultAction();
                break;
            }
        }
    },

    _defaultAction : function () {
        this._bindGeoEvent();
    },

    _businessAction : function () {
        this._fetch();
    },

    _indexAction : function () {
        helper.visible('.index-widget-hotel', function(){
            if(!this.hasGetData) {
                this._fetch();
                this._bindGeoEvent();
            }
        }, this);
    },

    _bindGeoEvent : function () {
        broadcaster.subscribe('geolocation.success', this._fetch, this);
        broadcaster.subscribe('geolocation.fail', function () {}, this);
    },

    _fetch : function () {
        var _this = this;
        this.hasGetData = true;
        helper.getData(id, function (data) {
            helper.ready();
        },{
            page : _this.page
        });
    },

    _render : function (data) {
        var _this = this, wd = helper.cates[id].wd;
        if(data && data.length > 0) {
            $('.index-widget-hotel').html(tpl({
                'data'  : data,
                'id'    : id,
                'word'  : wd,
                'page'  : _this.page
            }));
        }
        this._bind();
    },

    _bind : function () {
        $('.index-widget-hotel [jsaction]').on('click', this.jump);
        $('.index-widget-hotel .a-tel').on('click', function (evt) {
            var target = $(evt.currentTarget),
                dataTel = target.attr('data-tel');
            if(target && dataTel){
                util.TelBox.showTb(dataTel);
            }
            evt.stopPropagation();
        });
    },

    jump : function (evt) {
        helper.go(evt, id);
    }
}