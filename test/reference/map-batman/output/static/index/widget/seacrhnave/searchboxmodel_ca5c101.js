define('index:widget/seacrhnave/searchboxmodel.js', function(require, exports, module){

/*
 * @fileoverview 搜索框Model改版适配简版搜索
 * author: yuanzhijia@baidu.com
 * date: 2013/08/03
 */

// util和 location 已经引入
//var util , location ;
var location = require('common:widget/geolocation/location.js');
// 导出搜索框Model类
var SearchboxModel = {
    
    //搜索框表单数据
    data : {
        start   : {word : ''},   //起点
        end     : {word : ''},   //终点
        geo     : {word : ''}    //定位
    },
    init : function() {

    },
    /**
     * 读写搜索框的表单值 当没有传入参数时将返回所有数据
     * @param {Object} data {
            start : {'word':'', point:'', uid:''},
            end : {'word':'', point:'', uid:''},
            place : {'word':'', point:'', uid:''}
        }
     * @return {Object} data 与传入参数一致
     * @author yuanzhijia@baidu.com
     * @date 2013/08/03
     */
    value : function (data) {
        if(data && $.isPlainObject(data)) {
            return this.set(this._deepAdaptive(data));
        } else {
            return this.get();
        }
    },

    /**
     * 深度适配
     * @param {Object} json
     * @author jican
     * @date 2013/01/21
     */
    _deepAdaptive : function (json) {
        var result = {};
        for(key in json) {
            result[key] = this._adaptive(json[key]);
        }
        return result;
    },

    /**
     * 适配数据格式
     * @param {Object} json {'wd':'西单','pt':'123'}
     * @return {Object} result {'word':'西单','point':'123'}
     * @author jican
     * @date 2013/01/21
     */
    _adaptive : function (json) {
        var result = {};
        for(key in json) {
            if(key=='name' || key=='wd') {
                result.word = json[key];
            } else if(key=='pt') {
                result.point = json[key];
            } else {
                result[key] = json[key];
            }
            if(result.word==MY_GEO) {
                //若当前app.mylocationation为undefined，则不从此处获取位置
                if(location.hasExactPoi()){
                    return result;
                }else{
                    result = this.getExactlocationData();
                }
            }
        }
        if(result.point && $.isPlainObject(result.point)) {
            result.point = result.point.lng + ',' + result.point.lat
        }

        return result;
    },

    /**
     * 设置数据 会主动派发事件 搜索框会自动更新
     * @param {String} key 数据键值
     * @param {Object} data {
            start : {'word':'', point:'', uid:''},
            end : {'word':'', point:'', uid:''},
            place : {'word':'', point:'', uid:''}
        }
     * @author mod by zhijia
     * @date 2013/08/03
     */
    set : function (key, data) {
        if(
            (key && (typeof(key) == "string")) &&
            (data && $.isPlainObject(data))
        ) {
            this.data[key] = data;
        } else if(key && $.isPlainObject(key)) {
            $.extend(this.data, key);
        }
    },

    /**
     * 设置数据 注意该方法与set区别在与不会派发事件
     * @param {String} key 数据键值
     * @param {Object} data {
            start : {'word':'', point:'', uid:''},
            end : {'word':'', point:'', uid:''},
            place : {'word':'', point:'', uid:''}
        }
     * @author jican
     * @date 2013/01/21
     */
    _set : function (key, data) {
        if(
            (key && (typeof(key) == "string")) &&
            (data && $.isPlainObject(data))
        ) {
            this.data[key] = data;
        } else if(key && $.isPlainObject(key)) {
            $.extend(this.data, key);
        }
    },

    /**
     * 获取数据 不传key将返回所有
     * @param {String} key 数据键值 
     * @author jican
     * @date 2013/01/21
     */
    get : function (key) {
        if(key && (typeof(key) == "string")) {
            return this.data[key];
        }
        return this.data;
    },

    /**
     * 获取精确当前位置并返回搜索框可用的数据格式
     * @author jican
     * @date 2013/01/21
     */
    getExactlocationData : function () {
        var result = {word : ''},
            mylocationation = location;

        if(mylocationation && mylocationation.point) {
            result = {
                word : MY_GEO,
                point : mylocationation.point.x + ',' + mylocationation.point.y,
                citycode : mylocationation.addr.cityCode
            }
        }
        return result;
    },

    /**
     * 获取中心点名称
     * @author jican
     * @date 2013/01/21
     */
    getCenterName : function () {
        if(location.hasExactPoi()) {
            return location.isUserDeny() ? location.getAddress() : MY_GEO;
        }
        return '';
    }
};
module.exports =  SearchboxModel;

});