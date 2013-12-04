define('common:widget/geolocation/myposition.js', function(require, exports, module){

/**
 * @fileOverview 封装我的位置读写删操作COOKIE对象
 */
 'use strict';
 
var cookie = require('common:widget/cookie/cookie.js');

module.exports = {

    // 主域
    domain: '.baidu.com',

    path: '/',

    webCookie: 'H_LOC_MI',

    nativeCookie: 'H_LOC_APP',

    baiduLoc: 'BAIDULOC',

    //cookie过期时间在2天
    expires: 2 * 24 * 60 * 60 * 1000,

    /**
     * 获取存在COOKIE中的信息
     * @param {String} key cookie key
     */
    get: function (type) {
        //获取的是新cookie格式
        if(type == 'baiduLoc'){
            var mypos = cookie.get(this.baiduLoc);
            if (!mypos){
                return;
            }

            var locData = {};
            try{
                var obj = mypos.split("_");
                locData = {
                    crd : {
                        x : obj[0],
                        y : obj[1],
                        r : obj[2]
                    },
                    cc  : obj[3],
                    t   : obj[4]
                }
            }catch(e){}

            return locData;
        }else{
            //获取的是旧cookie格式
            if (!type || !(type == "web" || type == "native")) {
                return;
            }
            var key = type === "web" ? this.webCookie : this.nativeCookie;
            var mypos = cookie.get(key);
            if (!mypos) {
                return;
            }
            var obj = JSON.parse(mypos);

            if (mypos && obj) {
                if (obj.crd) {
                    var crd = obj.crd.split('_');
                    if (crd[0] && crd[1] && crd[2]) {
                        obj.crd = { x: crd[0], y: crd[1], r: crd[2]}
                    }
                }
                return obj;
            }
        }
    },

    save: function (value) {
        if (typeof value != "object"
            && value.x
            && value.y
            && value.cityCode
            && value.accuracy
            ) {
            return;
        }
        this._save(value);
    },

    _save: function (value) {
        var t = Date.now();
        value.t = t + "";
        var _value = value.join('_');
        cookie.set(this.baiduLoc, _value, {domain: this.domain, path: this.path, expires: this.expires});
    },

    remove: function (key) {
        if (!key) {
            cookie.remove(this.webCookie, {domain: this.domain, path: this.path});
            return;
        }
        var mypos = cookie.get(this.webCookie), obj = JSON.parse(mypos), nobj = {};
        for (i in obj) {
            if (key == i) {
                continue;
            }
            nobj[i] = obj[i];
        }
        var value = JSON.stringify(nobj);
        cookie.set(this.webCookie, value, {domain: this.domain, path: this.path});
    }
}

});