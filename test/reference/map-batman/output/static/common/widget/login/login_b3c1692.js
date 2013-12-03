define('common:widget/login/login.js', function(require, exports, module){

/**
 * 用于登陆跳转  by xuyihan
 */

var util = require('common:static/js/util.js');
var cookie = require("common:widget/cookie/cookie.js");
var stat = require('common:widget/stat/stat.js');
var md5 = require('common:widget/md5/md5.js');
module.exports = {

    init: function(){
        _init();
    },
    /**
     * 判断用户是否登陆
     * @return {status: boolean, username: String} 
     */
    checkLogin: function(callback){
        $.ajax({
            'type': 'GET',
            'url': 'http://mc.map.baidu.com/passport/Session3.php?t=' + Date.now(),
            'dataType': 'jsonp',
            'timeout': 2000,
            'success': function(data, status, xhr) {
                if (status == 'success' && data.bdErrCode == "0" && data.displayname != "") {
                var options = {
                    domain: location.hostname,
                    path: '/mobile',
                    expires: 7 * 24 * 60 * 60 * 1000
                };
                cookie.set("myUserName", data.displayname, options);
                    callback({
                        status: true,
                        username: data.displayname
                    });
                    return true;
                } else {
                    callback({
                        status: false,
                        username: ""
                    });
                }
            },
            'error': function(xhr, errorType, error) {
                callback({
                    status: false,
                    username: ""
                });
                return false;
            }
        });
    },
    loginAction: function(callback) {

        stat.addCookieStat(COM_STAT_CODE.STAT_USER_LOGIN_SHOW);
        location.href = 'http://wappass.baidu.com/passport/?authsite=1&u=' + encodeURIComponent(document.location);

    },

    logoutAction: function(callback) {

        stat.addCookieStat(COM_STAT_CODE.STAT_USER_MYCENTER_LOGOUT_CLICK);
        cookie.remove('myUserName');
        location.href = 'http://wappass.baidu.com/passport/?logout&u=http://' + location.host + '/mobile/webapp/index/index/force=simple';
    },

    goMycenter: function() {
        stat.addCookieStat(COM_STAT_CODE.STAT_INDEX_HEAD_MYCENTER_CLICK);
        location.href = '/mobile/webapp/user/mycenter/force=simple';
    },

    makeSysSign: function(a) {
        var b = [];
        var str = "";
        for (var i in a) {
            b.push(i);
        }
        for (var j = 0; j < b.length; j++) {
            str += b[j] + "=" + encodeURIComponent(a[b[j]]);
        }

        return hex_md5(str);
    },
    _init: function() {
        var url1 = location.search;
        var url2 = location.search.substr(location.search.indexOf("shopId") + 7);
        if (url2.indexOf("&") != -1) {
            window.config.shopId = url2.substr(0, url2.indexOf("&"));
            window.config.isappInstalled = url2.substr(url2.indexOf("isappInstalled") + 15);
        } else {
            window.config.shopId = url2.substr(0);
            window.config.isappInstalled = 0;
        }
        if ((/android/gi).test(navigator.appVersion)) {
            window.config.platform = "android"; //test
        }
        if ((/iphone|ipad/gi).test(navigator.appVersion)) {
            window.config.platform = "iphone";
        }
        var temp_url = url1.substr(url1.indexOf("?from=") + 6)
        $("open").href = temp_url.substr(0, temp_url.indexOf("&"));

        var para = {
            fields: '{"extends":{"more":1}}',
            sysTerminalType: window.config.platform + window.config["token_" + window.config.platform]
        };
        var sysSign = makeSysSign(para);
        var fullurl = window.config.dataSource + window.config.shopId + "?sysSign=" + sysSign + "&fields=" + para.fields + "&sysTerminalType=" + window.config.platform;
        scriptRequest(encodeURIComponent(fullurl), "makeData");
    }
};


});