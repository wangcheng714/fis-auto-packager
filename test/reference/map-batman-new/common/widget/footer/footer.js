/**
 * @fileOverview footer脚本
 */
var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js'),
	login = require('common:widget/login/login.js');

var init = function(){
	bindEvent();
}
var bindEvent = function(){
	$('.user').on("click", function(){
		_gologin();
	});
}
var _gologin = function(e){
	login.checkLogin(function(data){
        if(!data.status){
            login.loginAction();
        }else{
            login.goMycenter();
        }
    });
}

module.exports.init = init;