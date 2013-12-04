define('place:widget/selectlist/selectlist.js', function(require, exports, module){

/**
 * @file 设置精确点
 */

var loc  = require('common:widget/geolocation/location.js');
var url  = require('common:widget/url/url.js');
var util   = require('common:static/js/util.js');
var setCity = require("common:widget/setcity/setcity.js");

var referQueryKey = "_refer_query";
var referPageStateKey = "_refer_pagestate";


module.exports.init = function (data) {
    saveData(data);
    bind();
}

var _cacheData;
var indexPath = "http://" + location.host + "/mobile/webapp/index/index";
var RESULT_TYPE_NONE = 0;       //没有结果
var RESULT_TYPE_NOTCUR = 1;       //本城市无结果
var RESULT_TYPE_POISUC = 2;       //成功返回结果
var RESULT_TYPE_AREA = 3;       //
var BUSINESS_SPLIT = "     ";  //商圈筛选分隔符


var saveData = function (data) {
    _cacheData = data;
}

var bind = function(){
    $list = $(".place-widget-selectlist");
    $list.on("click", "li", _onClickList);
}

var _onClickList = function(e){
    var $dom = $(this);
    var index = +$dom.data("i") - 1;


    selectPlace(index);
}

var selectPlace = function (index) {
    if(typeof index == "undefined") {
        return;
    }

    var item = _cacheData.list[index];
    var urlParam = url.get();
    var pageState = urlParam.pageState;
    var locData = getLocData(item);
    var _referPageState = pageState.refer_pagestate || window.localStorage.getItem(referPageStateKey);
    var _referQuery = pageState.refer_query || window.localStorage.getItem(referQueryKey);

    if(_referQuery && _referQuery != "undefined" ) {
        setLocation(locData,false);
        redirectToRefer(item,{
            referQuery : _referQuery,
            referPageState : _referPageState,
        });
    } else {
        setLocation(locData);
        // 城区结果处理
        if(!locData.isExactPoi && locData.addr.cityType !== 3) {
            setCity.setAndRedirect(locData.addr.city,locData.addr.cityCode);
        } else {
            redirectToindex();
        }
    }
}

var redirectToRefer = function (data,options) {
    var urlParam = url.get(),
        opts = options || {},
        pagestate = urlParam.pageState || {},
        query = util.urlToJSON(opts.referQuery) || {},
        state = util.urlToJSON(opts.referPageState) || {},
        isTakeout = query.qt === 'wm' || state.search === "takeout",
        x = isTakeout ? 'pointX1' : 'nb_x',
        y = isTakeout ? 'pointY1' : 'nb_y',
        module, action, route,type,
        city = _cacheData["city"];

    // 删除当前的缓存key
    window.localStorage.removeItem(referQueryKey);
    window.localStorage.removeItem(referPageStateKey);



    //若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
    if(query.wd && query.wd.split(BUSINESS_SPLIT)[1]){
        query.wd = query.wd.split(BUSINESS_SPLIT)[1];
    }

    query.c = city.code;

    type = _getDataType();

    //跳转到外卖页
    if(isTakeout){
        route = _switchToTakeout(data, query);
    //跳转到place页
    }else{
        route = _switchToPlace(data, query);
    }

    state = $.extend(state,{
        'center_name' : data.name || ""
    });

    // 删除可能存在的i参数，避免存在直接进入详情页
    delete state.i;

    //跳转到其他页面
    url.update({
        module : route.module,
        action :  route.action,
        query : route.query,
        pageState : state
    },{
        'queryReplace': true,
        'pageStateReplace': true
    });
}

var getLocData = function (data) {
    if(!data) return;

    var _type = _getDataType();
    var city = _cacheData.city;
    var point = util.geoToPoint(data.geo);
    var addr = getAddr(data);
    var locData;

    locData = {
        addr : addr,
        isExactPoi : addr.isExactPoi,
        point : {
            x : point.lng,
            y : point.lat
        }
    }
    return locData;
}


/**
* 设置我的位置
* @param {string} name 地理描述信息
* @param {array}  point 坐标数组, point[0]为x坐标, point[1]为y坐标
*/
var setLocation = function(locData , isSaveLocInCookie){
    if(!locData) {
        return;
    }
    locData.isSaveLocInCookie = true;

    // if( isSaveLocInCookie === false){
    //     //是否保存定位信息
    //     locData.isSaveLocInCookie = false;
    // }


    //重设我的位置	
    loc.setAddress(locData);
};


var getAddr = function (item) {
    var addr,
        isExactPoi,
        cityType,
        cityInfo = _cacheData.city;
        cityName = cityInfo.name;

    //若是特殊区域，如北京市，海淀区等,name 进行特殊处理
    if(item.cname){
        name = item.pcname ? item.pcname + item.cname : item.cname;
        isExactPoi = false;
    }else{
        name = item.name;
        isExactPoi = true;
    }
    var upCityCode = null;

    //当前位置是区
    if(item.city_type === 3){
        upCityCode = cityInfo.up_cityid;
    }

    addr = {
        address: name, 
        city: cityName,
        cityCode: item.code ? item.code : cityInfo.code,
        isExactPoi: isExactPoi,
        cityType : item.city_type ? item.city_type : cityInfo.type,
        upCityCode : item.pccode ? item.pccode : upCityCode
    }
    return addr;
}

var _getDataType = function () {
    return _cacheData["type"];
}


var redirectToindex = function () {

    window.location.href = indexPath;
};


/**
* 跳转到外卖页
*/
var _switchToTakeout = function(data, query){
	var type = _getDataType(),
		point;

    // 如果是城区结果，则不加中心点
    if(type != 2 ){
    	point = util.geoToPoint( data.geo );
        query['pointX1'] = point.lng;
        query['pointY1'] = point.lat;
        query['nb_x'] = point.lng;
        query['nb_y'] = point.lat;
        query['center_rank'] = 1;
        query['m'] = 'searchXY';
    } else {
        query['m'] = 'searchBrands';
        delete query['pointX1'];
        delete query['pointY1'];
        delete query['center_rank'];
        delete query['nb_x'];
        delete query['nb_y'];
    }

    query = $.extend(query,{
        'cityId'   : data.addr.cityCode,
        'directId' : data.addr.cityCode,
        'pageNum' : 1,
        'pageSize': 10 
    })

    return {query: query, module: 'place', action: 'takeout'};
}

    /**
    * 跳转到place页
    */
var _switchToPlace = function(data, query){
	var type = _getDataType(),
		point;

    // 如果是城区结果，则不加中心点
    if(type != 2 ){
    	point = util.geoToPoint( data.geo );
        query['nb_x'] = point.lng;
        query['nb_y'] = point.lat;
        query['center_rank'] = 1;
    } else {
        delete query['nb_x'];
        delete query['nb_y'];
        delete query['center_rank'];
        delete query['pointX1'];
        delete query['pointY1'];
    }

    query = $.extend(query,{
        'c'   : data.addr.cityCode,
        'center_rank': 1,
        'pn' : 0      // 设置页码为第一页
    });
    
    return {query: query, module: 'search', action: 'search'};
};


});