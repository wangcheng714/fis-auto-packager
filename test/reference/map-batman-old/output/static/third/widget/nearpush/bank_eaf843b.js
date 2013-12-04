define('third:widget/nearpush/bank.js', function(require, exports, module){

/**
 * @fileOverview 周边推荐-银行
 * @author jican@baidu.com
 * @data 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'bank',
    tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.length > 0){_template_fun_array.push('    <div class="hd">        <button jsaction="bank-all" userdata="{&#39;wd&#39;:&#39;',typeof(wd)==='undefined'?'':wd,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">查看全部</button>        <h2>银行</h2>    </div>    <ul class="list">        '); for(var i = 0, l = data.length; i < l; i++){ _template_fun_array.push('            <li jsaction="bank-all" userdata="{&#39;wd&#39;:&#39;',typeof(data[i].name)==='undefined'?'':data[i].name,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                <span class="icon ',typeof(data[i].key)==='undefined'?'':data[i].key,'"></span>                <p>',typeof(data[i].name)==='undefined'?'':data[i].name,'</p>            </li>        ');}_template_fun_array.push('    </ul>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

module.exports = {

    init : function  (pagename) {
        this.pagename = pagename;
        this.render();
        this.bind();
    },

    render : function () {
        $('.index-widget-bank').html(tpl(helper.cates[id]));
    },

    bind : function () {
        $('.index-widget-bank [jsaction]').on('click', this._go);
    },

    _go : function (evt) {
        helper.go(evt, 'bank');
    }
}

});