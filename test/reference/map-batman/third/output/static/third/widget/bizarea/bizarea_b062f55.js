define("third:widget/bizarea/bizarea.js",function(require,exports,module){var util=require("common:static/js/util.js"),searchData=require("common:static/js/searchdata.js"),broadcaster=require("common:widget/broadcaster/broadcaster.js"),locator=require("common:widget/geolocation/location.js"),helper=require("index:widget/helper/helper.js");module.exports={hasGetData:!1,curRenderCity:"",init:function(e){this.wrap=$(".index-widget-bizarea"),e?(this.curRenderCity=locator.getCityCode(),this.wrap.show()):1!=locator.getCityCode()&&this._render(),this._bindGeoEvent()},_render:function(){helper.visible(this.wrap,function(){this.render()},this)},_bindGeoEvent:function(){broadcaster.subscribe("geolocation.success",this.render,this)},render:function(){if(!this.hasGetData||this.curRenderCity!=locator.getCityCode()&&1!=locator.getCityCode()){this.hasGetData=!0,this.curRenderCity=locator.getCityCode();var tpl=[function(_template_object){var _template_fun_array=[],fn=function(__data__){var _template_varName="";for(var name in __data__)_template_varName+="var "+name+'=__data__["'+name+'"];';if(eval(_template_varName),_template_fun_array.push(""),data&&data.area&&data.area.length>0){_template_fun_array.push('    <h2>热门商区</h2>    <ul class="clearfix biz-list">            ');for(var i=0,l=data.area.length;l>i;i++){var item=data.area[i];_template_fun_array.push('                <li>                    <a href="/mobile/webapp/index/casuallook/foo=bar/from=business&bd=',"undefined"==typeof item?"":item,"&code=","undefined"==typeof data.code?"":data.code,'" jsaction="jump" user-data="item">',"undefined"==typeof item?"":item,"</a>                </li>            ")}_template_fun_array.push("    </ul>")}_template_fun_array.push(""),_template_varName=null}(_template_object);return fn=null,_template_fun_array.join("")}][0],_this=this,host="/mobile/webapp/index/index/?",param={async:"1",fn:"gethotarea",mmaptype:"simple",cityname:locator.getCity()},requestUrl=host+util.jsonToUrl(param);$.ajax({url:requestUrl,dataType:"jsonp",success:function(e){try{var t=e;t&&t.data&&t.data.area?(_this.wrap.show(),_this.wrap.html(tpl({data:t.data}))):_this.error()}catch(a){_this.error()}},error:function(){_this.error()}})}},error:function(){this.wrap.hide()}}});