define('third:widget/nearpush/hotel.js', function(require, exports, module){

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
    tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.length > 0){_template_fun_array.push('    <div class="hd">        <a href="javascript:void(0);" jsaction="hotel-all" userdata="{&#39;wd&#39;:&#39;',typeof(word)==='undefined'?'':word,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">            查看全部        </a>        <h2>酒店</h2>    </div>    <ul class="list">        '); for(var i = 0, l = data.length; i < l; i++){ _template_fun_array.push('            '); var item = data[i]; ;_template_fun_array.push('            <li jsaction="hotel-detail" userdata="{&#39;uid&#39;:&#39;',typeof(item.uid)==='undefined'?'':item.uid,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                <div class="clearfix">                    <a class="a-img" href="javascript:void(0);">                        <img width="89" height="66" src="',typeof(item.image)==='undefined'?'':item.image,'">                        ',typeof(item.otherflag)==='undefined'?'':item.otherflag,'                    </a>                    <dl>                        <dt class="name">',typeof(item.name)==='undefined'?'':item.name,'</dt>                        <dd class="addr">地址：',typeof(item.addr)==='undefined'?'':item.addr,'</dd>                        <dd class="cmt">                            <span class="rate">',typeof(item.star)==='undefined'?'':item.star,'</span>                            <span class="price">                                <span class="tail">人均：</span>                                <span class="count">￥',typeof(item.price)==='undefined'?'':item.price,'</span>                            </span>                        </dd>                    </dl>                </div>                <div class="bar clearfix">                        ');if(!item.tel.num){_template_fun_array.push('                            <div class="btn tel" style="visibility:hidden">                                <a class="a-tel" href="/">                                    <b class="icon tel"></b>000-00000000                                </a>                            </div>                              ');} else {_template_fun_array.push('                            <div class="btn tel">                                <a class="a-tel" ',typeof(item.tel.url)==='undefined'?'':item.tel.url,'>                                    <b class="icon tel"></b>',typeof(item.tel.num)==='undefined'?'':item.tel.num,'                                </a>                            </div>                            ');}_template_fun_array.push('                    ');if(item.order){_template_fun_array.push('                        <div class="btn order"><a href="javascript:void(0);" jsaction="hotel-detail" userdata="{&#39;uid&#39;:&#39;',typeof(item.uid)==='undefined'?'':item.uid,'&#39;}">预订</a></div>                    ');}_template_fun_array.push('                </div>            </li>        ');}_template_fun_array.push('    </ul>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

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

});