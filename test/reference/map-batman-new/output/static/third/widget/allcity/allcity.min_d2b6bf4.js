define('third:widget/allcity/allcity.min.js', function(require, exports, module){

var setCity=require("third:widget/setcity/setcity.js");var indexPath="http://"+location.host+"/mobile/webapp/index/index";module.exports.init=function(){bind();
};var bind=function(){var a=$(".index-widget-allcity");a.on("click",".select-letter span",_onClickLetter);a.on("click",".city-item",_onClickCity);};var _onClickLetter=function(c){var a=$(c.target);
var b=a.data("href");window.location.replace(b);};var _onClickCity=function(c){var a=$(c.target);var b=$.trim(a.data("city"));var f=a.data("cityid");var d=a.data("short-city")||"";
setCity.setAndRedirect(b,f,d);};

});