define('index:widget/nearpush/cater.js', function(require, exports, module){

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
    tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.length > 0){_template_fun_array.push('    <div class="hd">        <a href="javascript:void(0);" jsaction="cater-all" userdata="{&#39;wd&#39;:&#39;',typeof(word)==='undefined'?'':word,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">            查看全部        </a>        <h2>美食</h2>    </div>    <ul class="list">        '); for(var i = 0, l = data.length; i < 3; i++){ _template_fun_array.push('            <li jsaction="cater-detail" userdata="{&#39;uid&#39;:&#39;',typeof(data[i].uid)==='undefined'?'':data[i].uid,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                <a class="a-img" href="javascript:void(0);">                    <img width="89" height="66" src="',typeof(data[i].image)==='undefined'?'':data[i].image,'">                    ',typeof(data[i].otherflag)==='undefined'?'':data[i].otherflag,'                </a>                <dl>                    <dt class="name">',typeof(data[i].name)==='undefined'?'':data[i].name,'</dt>                    <dd class="rate">',typeof(data[i].star)==='undefined'?'':data[i].star,'</dd>                    <dd class="cmt">                        <span class="count">',typeof(data[i].comment)==='undefined'?'':data[i].comment,'</span>                        <span class="tail">条评论</span>                    </dd>                </dl>            </li>        ');}_template_fun_array.push('    </ul>    ');if(page=="hao123"){_template_fun_array.push('        <ul class="list">            '); for(var i = 3, l = data.length; i < 6; i++){ _template_fun_array.push('                <li jsaction="cater-detail" userdata="{&#39;uid&#39;:&#39;',typeof(data[i].uid)==='undefined'?'':data[i].uid,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                    <a class="a-img" href="javascript:void(0);">                        <img width="89" height="66" src="',typeof(data[i].image)==='undefined'?'':data[i].image,'">                        ',typeof(data[i].otherflag)==='undefined'?'':data[i].otherflag,'                    </a>                    <dl>                        <dt class="name">',typeof(data[i].name)==='undefined'?'':data[i].name,'</dt>                        <dd class="rate">',typeof(data[i].star)==='undefined'?'':data[i].star,'</dd>                        <dd class="cmt">                            <span class="count">',typeof(data[i].comment)==='undefined'?'':data[i].comment,'</span>                            <span class="tail">条评论</span>                        </dd>                    </dl>                </li>            ');}_template_fun_array.push('        </ul>    ');}_template_fun_array.push('');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

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

});