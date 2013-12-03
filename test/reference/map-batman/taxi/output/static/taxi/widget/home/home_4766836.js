define("taxi:widget/home/home.js",function(t,i,n){"use strict";var e=t("common:static/js/util.js"),o=t("common:widget/cookie/cookie.js"),a=t("common:widget/stat/stat.js"),r=t("common:widget/geolocation/geolocation.js"),s=(t("common:widget/geolocation/location.js"),t("common:widget/broadcaster/broadcaster.js")),c=(t("common:widget/suggestion/suggestion.js"),t("common:widget/quickdelete/quickdelete.js"),t("common:widget/popup/popup.js")),d=t("taxi:widget/common/addprice/addprice.js"),i={create:function(){var t=this,i=$(".taxi-widget-home"),n=i.find(".btn-submit"),e=i.find(".nearby-car-info"),o=i.find(".add-price"),a=i.find("input[name=route_start]"),r=i.find("input[name=route_end]"),c=i.find(".form"),d=i.find(".input-panel"),u=(i.find(".poi-input"),i.find(".btn-back")),l=i.find(".btn-back-to-form"),f=i.find(".btn-settings"),p=i.find(".btn-confirm"),m=i.find(".form .input-wrapper");document.referrer&&(u.show(),u.on("click",$.proxy(this.onBtnBackClick,this))),n.on("click",$.proxy(this.onBtnSubmitClick,this)),l.on("click",$.proxy(this.onBtnBackToFormClick,this)),p.on("click",$.proxy(this.onBtnConfirmClick,this)),f.on("click",$.proxy(this.onBtnSettingsClick,this)),m.on("click",$.proxy(this.onFormInputClick,this)),s.subscribe("geolocation.mylocsuc",this.onGeoSuccess,this),s.subscribe("geolocation.fail",this.onGeoFail,this),this.suggestion=$.ui.suggestion({container:".poi-input",mask:".input-panel",source:"http://map.baidu.com/su",listCount:4,posAdapt:!1,isSharing:!0,offset:{x:0,y:0},param:$.param({type:"0",newmap:"1",ie:"utf-8"}),onsubmit:function(){t.onBtnConfirmClick.call(t)}}),this.$el=i,this.$nearbyCarInfo=e,this.$addPrice=o,this.$btnSubmit=n,this.$form=c,this.$inputPanel=d,this.$routeStart=a,this.$routeEnd=r},onBtnSubmitClick:function(){var t=this.$el,i=t.find("form"),n=e.urlToJSON(i.serialize()),r=this.verifyInput();if(!this.geoSuccess)return c.open({text:"定位不成功，不能发起打车请求！",layer:!0}),!1;if(!this.getNearbyCarInfoSuccess)return c.open({text:"获取附近车辆信息失败，请稍后再试！",layer:!0}),!1;if(r>0)c.open({text:"正在提交表单...",layer:!0,autoCloseTime:0}),LoadManager.request({data:n,success:function(t){o.set("BAIDU_TAXI_ORDER_ID",t.info.order_id,{expires:162e6}),o.set("BAIDU_TAXI_ORDER_START_TIME",Date.now()),LoadManager.loadPage("waiting",$.extend({},n,t.info)),a.addStat(STAT_CODE.TAXI_USERREQ,{addPrice:n.add_price})},error:function(t){switch(t.errno){case-121:c.open({text:"发单太频繁，请稍后再试",layer:!0});break;default:c.open({text:"系统错误！",layer:!0})}}});else switch(r){case-1:LoadManager.loadPage("verify",e.urlToJSON(n+"&referrer=home"));break;case-2:c.open({text:"请输入起点!",layer:!0});break;case-3:c.open({text:"请输入终点!",layer:!0})}},onFormInputClick:function(t){var i=$(t.currentTarget).find("input"),n=i.attr("name");this.$form.hide(),this.$inputPanel.show(),this.$inputPanel.attr("data-type",n),this.$inputPanel.find(".poi-input").val(i.val()).focus()},onBtnSettingsClick:function(){var t=o.get("BAIDU_TAXI_PHONE");t?LoadManager.loadPage("settings"):LoadManager.loadPage("verify")},onBtnBackToFormClick:function(){this.backToForm()},onBtnConfirmClick:function(){var t=this.$inputPanel.attr("data-type");this.$el.find("input[name="+t+"]").val(this.$inputPanel.find(".poi-input").val()),this.backToForm()},backToForm:function(){this.$inputPanel.find(".poi-input").val(""),this.$inputPanel.hide(),this.$form.show()},onGeoSuccess:function(t){var i,n=parseInt(t.addr.cityCode,10);this.cityList.indexOf(n)>-1?(this.getNearByCarInfo(t.point.x,t.point.y,n),i=t.addr,i=i.address||i.city+i.district+i.street,this.$routeStart.val(i)):c.open({text:"当前城市不支持打车！",layer:!0}),this.geoSuccess=!0},onGeoFail:function(){c.open({text:"定位失败\n请检查定位服务，以便将打车请求发您周边的司机!",layer:!0}),this.geoFail=!0},verifyInput:function(){var t=o.get("BAIDU_TAXI_PHONE"),i=this.$routeStart.val(),n=this.$routeEnd.val();return i?n?t?!0:-1:-3:-2},getNearByCarInfo:function(t,i,n){var e=this,a=this.$nearbyCarInfo;LoadManager.request({data:{qt:"nearby",lng:t,lat:i,city_code:n},success:function(r){var s,c=e.$el;a.addClass("loaded").find(".count").text(r.info.taxi_num),r.info.is_add_price&&1===r.info.is_add_price.flag&&(s=r.info.is_add_price.price_list)&&(s=s.split(":"),d.init(s),c.find("[type=input][name=add_price]").remove()),c.find("[name=taxi_num]").val(r.info.taxi_num),c.find("[name=lng]").val(t),c.find("[name=lat]").val(i),c.find("[name=city_code]").val(n),c.find("[name=price_list]").val(s),c.find("[name=phone]").val(o.get("BAIDU_TAXI_PHONE")),e.getNearbyCarInfoSuccess=!0},error:function(t){var i="";switch(t.errno){case-105:i="当前城市不支持打车！";break;default:i="系统错误！"}c.open({text:i,layer:!0})}})},getCityList:function(t){var i=this;LoadManager.request({data:{qt:"citylist",city_list:"all"},success:function(n){i.cityList=n.info,t()},error:function(t){var i="";switch(t.errno){case-101:i="参数错误！";break;default:i="系统错误！"}c.open({text:i,layer:!0})}})},onBtnBackClick:function(){window.location.href=document.referrer},destroy:function(){},init:function(){this.create(),this.getCityList($.proxy(r.init,r))}};n.exports=i});