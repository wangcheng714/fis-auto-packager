/**
 * @fileoverview 底层数据交互模块(简版是多页系统 修改了一些策略)
 * @author yuanzhijia@baidu.com
 */
define('common:static/js/searchdata.js', function (require, exports, module) {
 /**
*本模块一般都是在其他定位模块中引用 为了避免浪费，名字一致
 */
var util,location; 
if (!util) {
   util = require('common:static/js/util.js');
};
if (!location) {
    location = require('common:widget/geolocation/location.js');
};
var searchData = {
    _cache: {
        length: 0,
        index: 0,
        data: {}
    },
    /**
     * 获取数据
     * @param {string} 请求的url
     * @param {Function} 成功回调函数
     * @param {Function} 失败回调函数
     */
    fetch: function(url, successCallback, errorCallback) {
        if (!url) {
            return;
        }
        url = this._processUrl(url);
        if (this._getCacheData(url)) {
            successCallback && successCallback(this._getCacheData(url));
        } else {
            // 通过服务器获取数据并存入缓存
            var me = this;
            $.ajax({
                'url': "http://map.baidu.com"+url,
                'dataType': 'jsonp', // 需要指名类型为text否则zepto会自行解析，但是zepto解析会失败，具体原因尚未查明
                'success' : function(response){
                    try {
                        //eval('var json = ' + response);
                        var json = response;
                        me._saveToCache(url, json);
                        // 派发成功事件
                        successCallback && successCallback(json);
                    } catch (e){
                        errorCallback && errorCallback();
                    }
                },
                'error': function(xhr, errorType){
                    errorCallback && errorCallback();
                }
            });
        }
    },
    /**
     * 处理url，增加一些统一的参数
     * @param {string} 处理之前的url
     * @return {string} 处理之后的url
     */
    _processUrl: function(url){
        // 从老代码copy过来，把“<”和“>”改成空格，目的是啥不知道 by jiazheng
        //应该是防止Sql注入一类的事件发生 by yuanzhijia
        url = url.replace(/%3C/gi,encodeURIComponent(' ')).replace(/%3E/gi,encodeURIComponent(' '));
        // 增加统一的参数
        // format 参数作用？
        // 添加平台参数，以便和主站query区分。
        var platform = '&from=maponline';
        // tn参数，可能是以前用来统计的，需要进一步检查
        var tn = '&tn=m01';
        // 输入编码
        var inputEncode = '&ie=utf-8';
        // 添加掌百快搜项目统计参数 by jican 20110726
        // 统计参数
        // 建议这个参数通过老url适配代码进行处理
        // var uaParam = this._getUA() ? ("&" + this._getUA()) : "";
        
        // 数据版本
        // 如果某次升级导致前后数据必须进行同步处理，则数据版本号需要变化
        // 如果能够保证数据兼容，则可不进行改动
        var dataVersion = "&data_version=11252019";
        // 监测url是否包含根目录
        var urlPre = '';
        if (url.indexOf('/') != 0) {
            urlPre = '/mobile/?';
        }
        url = urlPre + url + 
            platform + 
            tn +
            inputEncode + 
            dataVersion;
        return url;
    },
    /**
     * 获取缓存数据
     * @param {string} 该数据对应的url
     * @return {object} 数据内容
     */
    _getCacheData: function(url){

        // todo: 获取cache时可以考虑将该数据的index放在最后，说明是最近一次访问过的
        return (this._cache.data[url] && this._cache.data[url].response) || null;

    },
    /**
     * 保存数据到缓存
     * @param {string} url，作为数据的key
     * @param {object} 数据结果
     */
    _saveToCache: function(url, response){
        if (this._cache.length >= searchData.MAX_CACHE) {
            this._removeOldData();
        }
        
        var index = this._cache.index;
        this._cache.data[url] = {
            'index': index,
            'response': response
        }
        this._cache.length ++;
        this._cache.index ++;
    },
    /**
     * 移除较老的数据，腾出缓存空间
     */
    _removeOldData: function(){
        var count = 5;
        var sortArr = [];
        for (var url in this._cache.data) {
            sortArr.push({'url': url, 'index': this._cache.data[url].index});
        }
        
        // 根据index排序
        sortArr.sort(function(a, b){
            return a.index - b.index;
        });
        // 将最老的数据移除
        count = count > sortArr.length ? sortArr.length : count;
        for (var i = 0; i < count; i ++) {
            delete this._cache.data[sortArr[i].url];
        }
        this._cache.length -= count;
    }
};
/**
 * 最大缓存的数据条数
 */
searchData.MAX_CACHE = 10;
// 单例输出
module.exports  = searchData;
});

