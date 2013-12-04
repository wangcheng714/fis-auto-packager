define('index:widget/bizarea/bizarea.js', function(require, exports, module){

/**
 * @fileoverview 热门商圈
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('index:widget/helper/helper.js');

module.exports = {

    hasGetData : false,

    curRenderCity : '', //当前渲染过热门商圈的城市名称

    init : function (isrendered) {

        this.wrap = $('.index-widget-bizarea');

        if(!!isrendered) {
            this.curRenderCity = locator.getCityCode();
            this.wrap.show();
        } else {
            if(locator.getCityCode()!=1) {
                this._render();
            }
        }

        this._bindGeoEvent();
    },

    _render: function () {
        helper.visible(this.wrap, function(){
            this.render();
        }, this);
    },

    _bindGeoEvent : function () {
        broadcaster.subscribe('geolocation.success', this.render, this);
    },

    render : function () {

        if(
            !this.hasGetData ||
            (this.curRenderCity!=locator.getCityCode() && locator.getCityCode()!=1)
        ) {

            this.hasGetData = true;
            this.curRenderCity = locator.getCityCode();

            var tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.area && data.area.length > 0){_template_fun_array.push('    <h2>热门商区</h2>    <ul class="clearfix biz-list">            ');for(var i = 0, l = data.area.length; i < l; i++){ var item = data.area[i]; _template_fun_array.push('                <li>                    <a href="/mobile/webapp/index/casuallook/foo=bar/from=business&bd=',typeof(item)==='undefined'?'':item,'&code=',typeof(data.code)==='undefined'?'':data.code,'" jsaction="jump" user-data="item">',typeof(item)==='undefined'?'':item,'</a>                </li>            ');}_template_fun_array.push('    </ul>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

            var _this = this,
                host = '/mobile/webapp/index/index/?',
                param = {
                    'async'     : '1',
                    'fn'        : 'gethotarea',
                    'mmaptype'  : 'simple',
                    'cityname'  : locator.getCity()
                },
                requestUrl = host + util.jsonToUrl(param);

            $.ajax({
                'url': requestUrl,
                'dataType': 'jsonp',
                'success' : function(response){
                    try {
                        var json = response;
                        if(json && json.data && json.data.area) {
                            _this.wrap.show();
                            _this.wrap.html(tpl({
                                'data'  : json.data
                            }));
                        } else {
                            _this.error();
                        }
                    } catch (e){
                        _this.error();
                    }
                },
                'error': function(xhr, errorType){
                    _this.error();
                }
            });
        }
    },

    error : function () {
        this.wrap.hide();
    }
}

});