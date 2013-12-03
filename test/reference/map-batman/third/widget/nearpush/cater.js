/**
 * @fileOverview 周边推荐-美食
 * @author jican@baidu.com
 * @date 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'cater',
    tpl = __inline('cater.tmpl');

module.exports = {

    hasGetData : false,
    firstShow : false,

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
        helper.visible('.index-widget-cater', function(){
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
        var _this = this,
            wrap = $('.index-widget-cater'),
            header = $('.index-page-nearby-hd');

        if(locator.getCityCode()!=1) {
            wrap.css('min-height', '160px');
            util.showLoading(wrap);
        }

        helper.getData(id, function (data) {
            helper.ready();
        },{
            page : _this.page
        });

        this.hasGetData = true;
    },

    _render : function (data) {
        var _this = this,
            wd = helper.cates[id].wd,
            wrap = $('.index-widget-cater'),
            header = $('.index-page-nearby-hd');
        if(data && data.length > 0) {
            wrap.html(tpl({
                'data'  : data, 
                'id'    : id,
                'word'  : wd,
                'page'  : _this.page
            }));
            header.show();
            if(!_this.firstShow){
                //周边推荐展首次现量 by jican
                stat.addStat(STAT_CODE.STAT_NEARPUSH_SHOW);
                _this.firstShow = true;
            }
        } else {
            wrap.css('min-height', '0');
            if(this.page=='index') {
                header.hide();
            }
        }
        util.hideLoading(wrap);
        this._bind();
    },

    _bind : function () {
        $('.index-widget-cater [jsaction]').on('click', this.jump);
    },

    jump : function (evt) {
        helper.go(evt, id);
    }
}