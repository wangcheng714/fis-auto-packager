/**
 * @fileoverview url前端处理功能
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require("common:static/js/util.js");

// 存储上一个页面的url
var storageKey = "_lastPageUrl";

module.exports = {

    host : 'http://' + location.host,

    /**
     * 直接更新当前页面URL
     * @param {object} hash {module:string, action:string, query:Object, pageState:Object}
     * @param {object} [options]
     */
    update : function(hash, options) {
        var newUrl,
            _options = options || {},
            newHash = this._get(hash, _options),
            curHash = window.location.pathname;
        if (newHash == curHash) {
            return;
        }
        newUrl = this.host + newHash;
        // 如果配置了replace，则替换当前的历史记录
        if(_options.replace === true){
            try{
                window.localStorage.setItem(storageKey,curHash);
            }catch(e){}
            window.location.replace(newUrl);
        } else {
            window.location.href = newUrl;
        }
    },

    /**
     * 获取当前路由信息
     * @return {Object} {module:string, action:string, query:Object, pageState:Object}
     */
    get : function() {
        var pathname = window.location.pathname.slice(1);
        var pathArrs = pathname.split('/');
        var product = pathArrs[0];
        var style = pathArrs[1];
        var module = pathArrs[2];
        var action = pathArrs[3];
        var query = pathArrs[4];
        var pageState = pathArrs[5] || "";
        /*
        **  pagestate android 默认浏览器自动解码 hack case
        */

        //请针对自己的业务在android默认平台下编码
        var checkPageStateDictionary ={
            seachbox:function(key){
                var ProcessDir ={
                    place:function(pkey){
                        var pageStateArr = pageState.split('from=place&'+pkey+'=');
                        pageState ='from=place&'+pkey+'=' + encodeURIComponent(pageStateArr[1]);
                    },
                    loc:function(lkey){
                        var pageStateArr = pageState.split(lkey+'=');
                        pageState = lkey+'=' + encodeURIComponent(pageStateArr[1]);
                    }
                }
                key && ProcessDir[key[1]](key[0]);
            }
        }
        //判断是否有和url重合的字段 如果有没被编码过的话
        if(!(/%3d|%26/ig.test(pageState)) && pageState.indexOf("=") > -1 ){
            var paramProcess = {
                DictionaryName : "seachbox",
                DictionaryData : ""
            }
            /*
            **路线搜索业务逻辑单独处理
            **从定位跳过来单独处理
            */
            var placeFlag = !(/^(from=place&start=word%3d|from=place&end=word%3d)/ig.test(pageState)),
                locationFlag = !(/^(start=word%3d|end=word%3d)/ig.test(pageState));
            if (placeFlag || locationFlag) { 
                if(pageState.indexOf("start")!=-1){
                    var parseFlag = /^start=word=/ig.test(pageState);
                    !parseFlag && placeFlag && (paramProcess.DictionaryData = ['start','place']);
                    parseFlag && locationFlag &&(paramProcess.DictionaryData = ['start','loc']);
                }else if(pageState.indexOf("end")!=-1){
                    var EndparseFlag = /^end=word=/ig.test(pageState);
                    !EndparseFlag && placeFlag &&(paramProcess.DictionaryData = ['end','place']);
                    EndparseFlag && locationFlag &&(paramProcess.DictionaryData = ['end','loc']);
                }
                checkPageStateDictionary[paramProcess.DictionaryName](paramProcess.DictionaryData);
            };

            // 这绝对是个大坑，万不得已为之，ios 5.x下，url的path部分会被自动解码，有bug
            if(pageState.indexOf("refer_query") > -1 && pageState.indexOf("refer_pagestate") > -1) {
                pageState = "refer_query=" 
                            + encodeURIComponent(pageState.match(/refer_query=(.*?)($|&refer_pagestate)/)[1])
                            + "&refer_pagestate=" 
                            + encodeURIComponent(pageState.match(/refer_pagestate=(.*?)($|&list_type)/)[1]);
            }
        }
        return {
            'product' : product,
            'style' : style,
            'module': module,
            'action': action,
            'query': util.urlToJSON(query || ''),
            'pageState': util.urlToJSON(pageState || '')
        };
    },

    /**
     * 获取新的Url对象
     * @param {object} newHash {module:string, action:string, query:Object, pageState:Object}
     * @param {object} options
     * @private
     */
    _get : function(newHash, options) {

        var curHash = window.location.pathname.slice(1),
            hashArrs = curHash.split('/'),
            product = hashArrs[0],
            style = hashArrs[1],
            module = hashArrs[2] || 'index',
            action = hashArrs[3] || 'index',
            query = hashArrs[4] || 'foo=bar',
            pageState = hashArrs[5] || '',
            queryReplace = (options && options.queryReplace) || false,
            pageStateReplace = (options && options.pageStateReplace) || false,
            result = [];

        result.push(newHash.product || product);
        result.push(newHash.style || style);

        // 模块
        result.push(newHash.module || module);
        // 动作
        result.push(newHash.action || action);

        if (queryReplace) {
            // 完全替换现有的参数
            if (newHash.query) {
                result.push(util.jsonToUrl(newHash.query));
            }
        } else {
            // 仅仅修改某个key/value
            var queryObject = util.urlToJSON(query);
            newHash.query = newHash.query || {};
            for (var key in newHash.query) {
                if (newHash.query[key] !== '') {
                    queryObject[key] = newHash.query[key];
                } else {
                    delete queryObject[key];
                }
            }
            result.push(util.jsonToUrl(queryObject));
        }
        // 状态
        if (pageStateReplace) {
            // 完全替换现有的page state
            if (newHash.pageState) {
                result.push(util.jsonToUrl(newHash.pageState));
            }
        } else {
            // 仅仅修改某个key/value
            newHash.pageState = newHash.pageState || {};
            var pageStateObject = util.urlToJSON(pageState);
            for (var key in newHash.pageState) {
                if (newHash.pageState[key] !== '') {
                    pageStateObject[key] = newHash.pageState[key];
                } else {
                    delete pageStateObject[key];
                }
            }
            result.push(util.jsonToUrl(pageStateObject));
        }
        return '/' + result.join('/');
    }
};