define('third:widget/allcity/allcity.js', function(require, exports, module){

/**
 * @file 所有城市组件逻辑
 */

var setCity = require("common:widget/setcity/setcity.js");
var indexPath = "http://" + location.host + "/mobile/webapp/index/index";


module.exports.init = function () {
	bind();
}

var bind = function	(){
	var $cityWrap = $(".index-widget-allcity");
	$cityWrap.on("click", ".select-letter span", _onClickLetter);
	$cityWrap.on("click", ".city-item", _onClickCity);

}

var _onClickLetter = function(e) {
	var $dom = $(e.target);
	var href = $dom.data("href");
	window.location.replace(href);
}

var _onClickCity = function(e) {
	var $dom = $(e.target);
	var cityName = $.trim($dom.data("city"));
	var cityId = $dom.data("cityid");
	setCity.setAndRedirect(cityName,cityId);
}

});
;define('third:widget/bizarea/bizarea.js', function(require, exports, module){

/**
 * @fileoverview 热门商圈
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('index:widget/helper/helper.js');

module.exports = {

    hasGetData : false,

    curRenderCity : '', //当前渲染过热门商圈的城市名称

    init : function (isrendered) {

        this.wrap = $('.index-widget-bizarea');

        if(!!isrendered) {
            this.curRenderCity = locator.getCityCode();
            this.wrap.show();
        } else {
            if(locator.getCityCode()!=1) {
                this._render();
            }
        }

        this._bindGeoEvent();
    },

    _render: function () {
        helper.visible(this.wrap, function(){
            this.render();
        }, this);
    },

    _bindGeoEvent : function () {
        broadcaster.subscribe('geolocation.success', this.render, this);
    },

    render : function () {

        if(
            !this.hasGetData ||
            (this.curRenderCity!=locator.getCityCode() && locator.getCityCode()!=1)
        ) {

            this.hasGetData = true;
            this.curRenderCity = locator.getCityCode();

            var tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.area && data.area.length > 0){_template_fun_array.push('    <h2>热门商区</h2>    <ul class="clearfix biz-list">            ');for(var i = 0, l = data.area.length; i < l; i++){ var item = data.area[i]; _template_fun_array.push('                <li>                    <a href="/mobile/webapp/index/casuallook/foo=bar/from=business&bd=',typeof(item)==='undefined'?'':item,'&code=',typeof(data.code)==='undefined'?'':data.code,'" jsaction="jump" user-data="item">',typeof(item)==='undefined'?'':item,'</a>                </li>            ');}_template_fun_array.push('    </ul>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

            var _this = this,
                host = '/mobile/webapp/index/index/?',
                param = {
                    'async'     : '1',
                    'fn'        : 'gethotarea',
                    'mmaptype'  : 'simple',
                    'cityname'  : locator.getCity()
                },
                requestUrl = host + util.jsonToUrl(param);

            $.ajax({
                'url': requestUrl,
                'dataType': 'jsonp',
                'success' : function(response){
                    try {
                        var json = response;
                        if(json && json.data && json.data.area) {
                            _this.wrap.show();
                            _this.wrap.html(tpl({
                                'data'  : json.data
                            }));
                        } else {
                            _this.error();
                        }
                    } catch (e){
                        _this.error();
                    }
                },
                'error': function(xhr, errorType){
                    _this.error();
                }
            });
        }
    },

    error : function () {
        this.wrap.hide();
    }
}

});
;define('third:widget/businesslist/businesslist.js', function(require, exports, module){

/**
 * @fileOverview 商圈筛选逻辑
 */

var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
var searchData = require("common:static/js/searchdata.js");


var _dataCache,
	_areaList = {},
	cityData,
	BUSINESS_SPLIT = "     ",
	dataPath = "/mobile/?&from=maponline&tn=m01&ie=utf-8&data_version=11252019";


var saveData = function (content) {
	if(!content) {
		return;
	}

	addAreaItem(content.area_code,content);
	// 保存城市信息
	if(content.area_type == 2) {
		cityData = content;
	}

	if( content.sub ) {
		$.each(content.sub,function (index,item) {
			addAreaItem(item.area_code, item);
		});
	}

}

var addAreaItem = function (areaCode,areaData) {
	if(!areaData || !areaCode) {
		return;
	}
	_areaList[areaCode] = areaData;
}

var getAreaItem = function (areaCode) {
	return _areaList[areaCode];
}

var bind = function () {
	var $wrapper = $(".index-widget-bussinesslist");
	$wrapper.on("click", ".top-title", toggleList);
	$wrapper.on("click", "[jsaction]", eventHandler);

}

/**
 * 完成商圈选择
 * @return {void}
 */
var completeSelete = function (areaCode) {
	if(!areaCode) {
		return;
	}


	var areaItem = getAreaItem(areaCode),
		urlParam = url.get(),
		query = urlParam.query || {},
		pageState = urlParam.pageState || {},
		referQuery = util.urlToJSON(pageState.refer_query) || {},
		referPagestate = util.urlToJSON(pageState.refer_pagestate) || {},
		_state = {},
		_qurey = {},
		wd = referQuery.wd,
		c;


	_state = $.extend({},_state,referPagestate,{
		dist_name : areaItem.area_name,
		"keep_stay" : 1
	});

	if( wd && wd.indexOf(BUSINESS_SPLIT) > -1) {
		wd = wd.split(BUSINESS_SPLIT)[1];
	}

	// 如果是商圈，需要添加空白分隔符
	if( areaItem.area_type == 10 ) {
		wd = areaItem.area_name + BUSINESS_SPLIT + wd;
		c = cityData.area_code;
	} else {
		c = areaItem.area_code;
	}

	_qurey = $.extend(_qurey,referQuery,{
		c : c,
		wd : wd,
		pn : 0
	});


	delete _qurey.nb_x;
	delete _qurey.nb_y;
	delete _qurey.center_rank;

	url.update({
		module: 'place',
		action: 'list',
		query : _qurey,
		pageState : _state
	});

}

var listSub = function (areaCode, container) {
	if(!areaCode || !container) {
		return;
	}
	var loaded = container.data("loaded");
	var _query = "/?qt=sub_area_list&level=1&business_flag=1";
	var list = container.next();
	var visible;
	if( container.data("loaded") == 1 ) {
		if(list.hasClass("hide")) {
			list.data("visible","1");
			hideOther();
			scrollToEle(container);
		} else {
			hideOther();
		}
	} else {
		_query += "&areacode=" +  areaCode;
		searchData.fetch(_query,function(json){
			var _json = json || {};
			var content = json.content;
			hideOther();
			if(content) {
				saveData(content);
				appendSubList(content, container);
			}
		}, function () {

		});
	}

}

var scrollToEle = function (ele) {
	if(!ele){
		return;
	}
	var top = ele.offset().top;

	window.scrollTo(0,top);

}

var hideOther = function () {
	$(".index-widget-bussinesslist .sub_list .sub_list").not("hide").each(function (index,item) {
		if($(item).data("visible") == 1) {
			$(item).removeClass("hide");
		} else {
			$(item).addClass("hide");
		}
		// 重设item
		$(item).data("visible","0");
	});

}

var appendSubList = function (data, ele) {
	var tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<li class="sub_list"><ul class="sub_wrapper"><li data-areacode = "',typeof(area_code)==='undefined'?'':area_code,'" jsaction="complete"><h4>全区</h4><span class="rl_opt"><em class="rl_opt_btn rl_opt_close"></em></span>               </li>');for(var i = 0, l = sub.length; i < l; i++){ _template_fun_array.push('<li data-areacode = "',typeof(sub[i]['area_code'])==='undefined'?'':sub[i]['area_code'],'" jsaction="complete"><h4>',typeof(sub[i]['area_name'])==='undefined'?'':sub[i]['area_name'],'</h4><span class="rl_opt"><em class="rl_opt_btn rl_opt_close"></em></span>               </li>');}_template_fun_array.push('</ul></li>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
	var html = tpl(data);


	$(html).insertAfter(ele);
	ele.data("loaded", "1");
	ele.data("visible", "1");
	scrollToEle(ele);

}

/**
	* 跳转到list页
	* @param {object} data 事件返回的数据
	*/
var switchToList = function(data){
	var me = this,
		pagestate,
		query,
		searchQuery,
		state;

	pagestate = me.get('pagestate');
	query = util.getReqParam(pagestate.refer_query) || {};
	state = util.getReqParam(pagestate.refer_pagestate) || {};


	state = $.extend(state,{
		dist_name : data.isBusiness ? '' : data.name,
		"keep_stay" : 1
	});

	//切分关键字
	var wd = query.wd.split(mapConst.BUSINESS_SPLIT);
	wd = wd[1] ? wd[1] : query.wd;

	searchQuery = {
		wd: data.isBusiness ? data.name + '     ' +wd : wd,
		c : data.isBusiness ? data.cityCode : data.subCode,
		pn : 0	// 设置页码为第一个页
	}

	$.extend(query, searchQuery);

	app.updateHash({
		module: 'place',
		action: 'list',
		query: query,
		pageState: state
	},{
		trigger: true,
		queryReplace: true,
		pageStateReplace: true
	})
};


/**
 * 切换列表显示状态
 * @param  {Event} evt
 * @return {void}
 */
var toggleList = function (evt) {
	var $dom = $(this);
	$dom.next().toggleClass("hide");
}

var eventHandler = function (evt) {
	var $ele = $(this),
		areaCode = $ele.data("areacode"),
		action = $ele.attr("jsaction"),
		jsactionHandler = {
			"complete" : completeSelete,
			"listsub" : listSub,
		},
		handler = jsactionHandler[action];

	if($.isFunction(handler)) {
		handler(areaCode, $ele);
	}

}


module.exports.init = function (data) {
	saveData(data);

	bind();
}


});
;define('third:widget/bussinesslist/bussinesslist.js', function(require, exports, module){



});
;define('third:widget/cateinfo/cateinfo.js', function(require, exports, module){

/**
 * @fileoverview 行业细分
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    helper = require('index:widget/helper/helper.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function () {
        this.bind();
    },

    bind : function () {
        var _this = this;
        $('.index-widget-cateinfo [jsaction]').on('click', function (evt) {
            var target = $(evt.currentTarget);
            _this.search(target.attr('userdata'));
        });
    },

    search : function (userdata) {
        eval('var hash = ' + userdata);

        //九宫格点击量 by jican
        stat.addCookieStat(STAT_CODE.STAT_CATEINFO_CLICK, {
            cate: hash.cate,
            name: hash.wd
        });

        url.update(helper.getHash(hash));
    }
}

});
;define('third:widget/curloc/curloc.js', function(require, exports, module){

/**
 * @file 当前位置
 */

var broadcaster  = require('common:widget/broadcaster/broadcaster.js');
var loc  = require('common:widget/geolocation/location.js');

module.exports.init =  function () {
    broadcaster.subscribe('geolocation.success', updateMyPos, this);
};

var updateMyPos = function (data) {	
	var $dom = $(".widget-index-curloc .current-city"),
		locTxt = loc.getAddress();
	$dom.html(locTxt);
}




});
;define('third:widget/error/error.js', function(require, exports, module){

/**
 * @file 错误页处理逻辑
 */

var storageKey = "_lastPageUrl";

var init = function(){
	$('.back-last-page').on('click', function(){
		back();
	})

}

var back = function () {
    var _lastPageUrl = window.localStorage.getItem(storageKey);
	// 如果是上一页保存了上一页信息的，从localStorage取
	// 采用replace方法，会进这个逻辑
    if(typeof _lastPageUrl === "string") {
        window.localStorage.removeItem(storageKey);
        window.location.replace(_lastPageUrl);
    } else {
        history.back();
    }
}

module.exports.init = init;

});
;define('third:widget/header/header.js', function(require, exports, module){

/**
 * @fileOverview 头部导航逻辑
 */

var quickdelete = require('common:widget/quickdelete/quickdelete.js');
var suggestion  = require('common:widget/suggestion/suggestion.js');
var poisearch   = require('common:widget/search/poisearch.js');
var stat        = require('common:widget/stat/stat.js');


var $header = $(".common-widget-header");

/**
 * 绑定用户点击事件
 * @return {void}
 */
var bind = function () {
	var $searchBtn = $header.find(".sb-wrapper");
	$searchBtn.on("click", _onClickSearchBtn);
	$header.find(".se-poi-form").on("submit", _onFormSubmit);
	$header.find(".p-btn-submit").on("click", _submit);

	initSug();
}


/**
 * 处理点击下拉搜索框
 * @return {[type]}
 */
var _onClickSearchBtn = function () {
	var $searchBar = $header.find(".se-wrap");
	$searchBar.toggleClass("hide");

	// 搜索按钮点击量  add by cdq
	stat.addStat(COM_STAT_CODE.HEADER_SEARCH_CLICK);
}

var _onFormSubmit = function (evt) {
	evt.preventDefault();
	_submit();
}

var _getValue = function () {
	return $header.find("input").val();
}

var _submit = function () {
	var word = _getValue();
	var $input = $header.find("input");
	if(!_checkInput($input)){
        return false;
    }

	// 通过头部搜索框发起检索的量 by cdq
    stat.addCookieStat(COM_STAT_CODE.HEADER_USER_SEARCH_TOTAL);

    poisearch.search(word);
}

    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     * @author jican
     * @date 2013/01/21
     */
var _checkInput = function (element) {
        if(!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        return true;
    }

/**
 * 初始化suggestion
 * @return {[type]}
 */
var initSug = function () {
	// 注册quickdelete
	var _poiQuick = $.ui.quickdelete({
            container: '#pro_txt_poi',
            offset: {
                x: 0,
                y: 2
            }
        });
	
    var poiSearchSugg = $.ui.suggestion({
        container: "#pro_txt_poi",
        mask: "#p_se_poi",
        source: "http://map.baidu.com/su",
        listCount: 6, // SUG条目
        posAdapt: false, // 自动调整位置
        isSharing: true, // 是否共享
        offset: { // 设置初始偏移量
            x: 0,
            y: 52
        },
        param: $.param({
            type: "0",
            newmap: "1",
            ie: "utf-8"
        }),
        onsubmit: function() { //兼容widget老版，采用onEventName方式绑定
            var word = this.getValue();
			var $input = $header.find("input");
            $input.val(word);
            if (!word) {
                return;
            } else {
	            _submit();
            }
        }
    });
}

/**
 * 初始化
 * @return {void}
 */
module.exports.init = function () {
	bind();

}

});
;define('third:widget/helper/helper.js', function(require, exports, module){

/**
 * @fileOverview 首页helper
 * @author jican@baidu.com
 * @data 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js');


module.exports = {

    cates : {
        'cater' : {
            'wd'    : '美食',
            'id'    : 'cater',
            'count' : 3,
            'data'  : undefined
        },
        'hotel' : {
            'wd'    : '快捷酒店',
            'id'    : 'hotel',
            'count' : 2,
            'data'  : undefined
        },
        'bank' : {
            'wd'    : '银行',
            'id'    : 'bank',
            'data'  : [
                {name : '工商银行', key  : 'icbc'},
                {name : '农业银行', key : 'abc'},
                {name : '建设银行', key : 'cbc'},
                {name : '中国银行', key : 'bc'},
                {name : 'ATM', key : 'atm'}
            ]
        }
    },

    thumbConfig : {
        host : "http://map.baidu.com/maps/services/thumbnails",
        imgWidth: 180,
        imgHeight: 135,
        oneStarW: 15
    },

    getData: function(type, cbk, opts) {

        //如果当前城市为全国 则不获取周边数据
        if(this.getCityCode()==1) {
            this.cates[type].data = [];
            cbk && cbk([]);
            return;
        }

        opts = opts || {};

        this.cates[type].data = undefined;

        if(opts.page && opts.page=='hao123') {
            this.cates['cater'].count = 6;
            this.cates['hotel'].count = 3;
        }

        var _this = this,
            word = this.cates[type].wd,
            query = this.getHash({query : {'wd' : word}}).query;

        searchData.fetch(util.jsonToQuery(query), function(json) {
            var data = [];
            if(json && json.content) {
                data = _this._formatData(word, json.content)
            }
            _this.cates[type].data = data;
            cbk && cbk(data);
        }, function () {
            cbk && cbk([]);
        });
    },

    getHash : function (hash, opts) {

        var module = hash.module || 'search',
            action = hash.action || 'search',
            query  = {
                'qt' : 's',
                'wd' : '',
                'c'  : this.getCityCode()
            },
            pageState = {};

        // 对query做兼容处理
        if(hash.query) {
            query = $.extend(query, hash.query);
        } else {
            query.wd = (hash.wd || hash.word || hash.name);
            query.searchFlag = 'sort';
        }

        var curUrl = url.get(),
            curQuery = curUrl.query,
            curPageState = curUrl.pageState || {};

        var from = curPageState['from'] || '',
            centername = decodeURIComponent(
                curPageState['center_name'] || locator.getCity()
            );

        // 针对外卖做特殊处理
        if(module=='place' && action=='takeout'){
            pageState.search = 'takeout';
            centername = locator.hasExactPoi() ? (locator.isUserInput() ? 
            locator.getAddress() : '我的位置') : locator.getCity();
        }


        switch(from){
            // 周边
            case 'searchnearby' : {
                query['center_rank'] = 1; //以位置为中心点进行周边检索 
                query['nb_x'] = curQuery['nb_x'] || curPageState['nb_x'];
                query['nb_y'] = curQuery['nb_y'] || curPageState['nb_y'];
                pageState['from'] = 'searchnearby';
                pageState['type'] = 'searchnearby';
                if(module=='place' && action=='takeout'){
                    centername = decodeURIComponent(curPageState['center_name']);
                }
                break;
            }
            // 商圈
            case 'business' : {
                query['wd'] = curPageState['bd'] + "     " + (query.wd);
                if(module=='place' && action=='takeout'){
                    if(locator.hasExactPoi()) {
                        query["center_rank"] = 1; //以位置为中心点进行周边检索 
                        query["nb_x"] = locator.getPointX();
                        query["nb_y"] = locator.getPointY();
                    }
                }
                break;
            }
            // 默认
            default : {
                if(locator.hasExactPoi()) {
                    centername = locator.isUserInput() ? locator.getAddress() : '我的位置';
                    query["center_rank"] = 1; //以位置为中心点进行周边检索 
                    query["nb_x"] = locator.getPointX();
                    query["nb_y"] = locator.getPointY();
                }
                break;
            }
        }

        pageState["center_name"] = centername;

        // 今夜特价逻辑
        if(query['wd']  === '今夜特价'){
            query['pl_tonight_sale_flag_section'] = 1;
            query['pl_data_type'] = 'hotel';
        }
        
        return {
            'module'    : module,
            'action'    : action,
            'query'     : query,
            'pageState' : pageState
        };
    },

    ready : function () {
        if(this.cates['cater'].data && this.cates['hotel'].data){
            broadcaster.broadcast('nearpush.dataready');
        }
    },

    go : function (evt, key) {
        var target = $(evt.currentTarget);
        switch(target.attr('jsaction')) {
            case key + '-detail' : {
                eval('var data = ' + target.attr('userdata'));
                var uid = data.uid;

                //附近推荐 查看详情击量 by jican
                stat.addCookieStat(STAT_CODE.STAT_NEARPUSH_DETAIL_CLICK, {
                    id: data.id
                });

                url.update({
                    module: 'place',
                    action: 'detail',
                    query: {
                        qt  : 'inf',
                        uid : uid,
                        c   : this.getCityCode()
                    }
                }, {
                    trigger: true,
                    queryReplace: true
                });
                break;
            }
            case key + '-all' : {
                eval('var data = ' + target.attr('userdata'));
                var word = data.wd || this.cates[key].wd,
                    hash = this.getHash({
                        'module' : 'search',
                        'action' : 'search',
                        'query'  : {wd : word}
                    });

                //附近推荐 查看全部击量 by jican
                stat.addCookieStat(STAT_CODE.STAT_NEARPUSH_ALL_CLICK, {
                    id: data.id
                });

                url.update({
                    module: hash.module,
                    action: hash.action,
                    query: hash.query,
                    pageState: hash.pageState
                }, {
                    trigger: true,
                    queryReplace: true,
                    pageStateReplace: true
                });
                break;
            }
        }
        return false;
    },

    getCityCode : function () {
        var curUrl = url.get(),
            curQuery = curUrl.query,
            curPageState = curUrl.pageState || {};
        if(curPageState.code && curPageState.code!=1) {
            return curPageState.code
        } else {
            return locator.getCityCode() || 1;
        }
    },

    /**
     * 根据分类信息设置渲染页面的数据
     * @param  {string} word ：检索关键字 data：获取到的数据
     * @return {}
     */
    _formatData : function(word, data) {
        var _this = this;
        switch(word) {
            case '美食': {
                return _this._formatDataCY(data);
                break;
            }
            case '快捷酒店': {
                return _this._formatDataHotel(data);
                break;
            }
        }
    },

    /**
     * 设置美食的页面数据
     * @param  {Object} data：获取到的数据
     * @return {}
     */
    _formatDataCY: function(data) {

        var _this = this,
            limit = this.cates['cater'].count,
            listData = [],
            fliterData = [],
            imgsrc = "";

        for(var i = 0, len = data.length; i < len; i++) {
            var item = {};
            item["name"] = data[i].name;
            item["uid"] = data[i].uid;
            var isPlace = undefined;
            if(data[i].ext != undefined && data[i].ext.detail_info != undefined) {
                isPlace = true;
                placeInfo = data[i].ext.detail_info;
            } 
            if(placeInfo.image != "" && !!isPlace) {
                item.image = _this._getImgSrc(placeInfo.image) || '';
                if(placeInfo.groupon != "" && placeInfo.groupon != null) {
                    item.otherflag = '<em class="icon groupon-icon"></em>';
                } else if(placeInfo.premium2 != "" && placeInfo.premium2 != 0 && placeInfo.premium2 != null) {
                    item.otherflag = '<em class="icon sale-icon"></em>';
                }
                item.star = _this._getStar(placeInfo.overall_rating) || '';
                item.comment = placeInfo.comment_num || '';
                listData.push(item);
                if(listData.length === limit) {
                    return listData;
                }
            } else {
                fliterData.push(item);
            }
        }

        listData = listData.concat(fliterData.slice(0, limit - listData.length));
        
        return listData;
    },

    /**
     * 设置快捷酒店的页面数据
     * @param  {Object} data：获取到的数据
     * @return {}
     */
    _formatDataHotel: function(data) {

        var _this = this,
            limit = this.cates['hotel'].count,
            listData = [],
            fliterData = [];
        for(var i = 0, len = data.length; i < len; i++) {
            var item = {};
            item["name"] = data[i].name;
            item["uid"] = data[i].uid;
            item["addr"] = data[i].addr;
            var isPlace = undefined;
            if(data[i].ext != undefined && data[i].ext.detail_info != undefined) {
                isPlace = true;
                placeInfo = data[i].ext.detail_info;
            } 
            item["price"] = placeInfo.price || "";
            if(data[i].image != "" && !!placeInfo && data[i].tel != "") {
                item.image = _this._getImgSrc(placeInfo.image) || '';
                item.star = _this._getStar(placeInfo.overall_rating) || '';
                item.tel = _this._getTel(data[i].tel) || {};
                placeInfo["uid"] = data[i].uid;
                item.order = _this._getOrder(placeInfo);
                listData.push(item);
                if(listData.length === limit) {
                    return listData;
                } else {
                    fliterData.push(item);
                }
            }
        }
        listData = listData.concat(fliterData.slice(0, limit - listData.length))
        return listData;
    },

 
    visible : function (element, handler, context) {
        var container = $(element)[0],
            _onscroll = function() {
            var elementTop = container.getBoundingClientRect().top,
                innerHeight = window.innerHeight;
            if(elementTop <= innerHeight) {
                if(handler) {
                    if(context) {
                        handler.call(context);
                    } else {
                        handler();
                    }
                } 
            }
        }
        _onscroll();
        $(window).on('scroll', _onscroll);
    },

    /**
     * 设置电话号码
     * @param  {String} tel：电话
     * @return {}
     */
    _getTel: function(tel) {

        var num, url;

        if(tel == undefined || tel == "") {
            return {};
        }
        if(tel.indexOf(",") > -1) {
            num = tel.split(",");
        } else {
            num = tel.split(";");
        }

        num = num[0].replace(/\(/ig, "").replace(/\)/ig, "-");

        if(!util.isAndroid()) {
            url = 'href="tel:' + num + '"';
        } else {
            url = 'href="javascript:void(0);" data-tel="' + num + '"';
        }

        return {
            url : url,
            num : num
        }
    },

    _getOrder: function(data) {
        var html = [],
            info = data.hotel_ori_info,
            url  = data.ota_url;
        if(info == "" || info.length == 0) {
            return false;
        }
        for(var i = 0, len = info.length, item = info[i]; i<len; i++){
            if(item.src == 'qunar' && item.hotel_flag == '可预定酒店') {
                for(var j = 0, length = url.length, it = url[j]; j < length; j++){
                    if(it.src == 'qunar') {
                        return true;
                    }
                }
            }
        }      
    },

    /**
     * 获取star的宽度
     * @param{Number} rate 评分
     */
    _getStar: function(rate) {
        if(!rate) {
            return;
        }
        var width = parseInt(rate * 10) / 10 * this.thumbConfig.oneStarW;
        var star = '<span class="star-box">\
                            <span class ="star-scroe" style = "width:#rate#px"></span>\
                    </span>'.replace('#rate#', width);
        return star;
    },

    /**
     * 获取缩略图开发
     * @param {String} src 图片原地址
     * @return {String}
     */
    _getImgSrc: function(src) {

        if(typeof src != "string" || src == "") {
            return F.uri('/static/img/no_img.png');
        }

        var thumbConfig = this.thumbConfig;

        if(src.indexOf("&nbsp;&nbsp;&nbsp;") > -1) {
            src = $.trim(src.split("&nbsp;&nbsp;&nbsp;")[0]);
        }
        src = src.replace("(", "%28");
        src = src.replace(")", "%29");

        var url = thumbConfig.host + "?width=" + 
                  thumbConfig.imgWidth + "&height=" +
                  thumbConfig.imgHeight + "&src=" +
                  encodeURIComponent(src);

        return url;
    }
}

});
;define('third:widget/helper/revert.js', function(require, exports, module){

module.exports = {
    init: function () {
        if (window.eventRecorder) {
            eventRecorder.stop();
            eventRecorder.play();
            window.eventRecorder = null;
            delete window.eventRecorder;
        }
    }
}

});
;define('third:widget/hotcity/hotcity.js', function(require, exports, module){

/**
 * @file 所有城市组件逻辑
 */

var setCity = require("common:widget/setcity/setcity.js");


module.exports.init = function () {
	bind();
}

var bind = function	(){
	var $hotCity = $(".index-widget-hotcity");
	$hotCity.on("click", ".city-item", _onClickCity);
}

var _onClickCity = function(e) {
	var $dom = $(e.target);
	var cityName = $dom.text();
	var cityId = $dom.data("cityid");
	setCity.setAndRedirect(cityName,cityId);
}

});
;define('third:widget/locsearch/locsearch.js', function(require, exports, module){

/**
 * @file 位置页检索
 */

var $inputBox = $(".index-widget-locsearch");
var DEFAULT_VALUE = "输入城市或者其他位置";
var loc  = require('common:widget/geolocation/location.js');
var url = require("common:widget/url/url.js");
var referQueryKey = "_refer_query";
var referPageStateKey = "_refer_pagestate";

module.exports.init = function(){
	bind();
	processRefer();
}

var bind = function () {
	var $input = $("#search-input");
	var $searchBtn = $inputBox.find("#search-button");
	var $form = $inputBox.find("form");

	$input.on("focus",$.proxy(_onClickInput,this));
	$input.on("blur",_onBlurInput);
	$input.on("foucs",_onClickInput);
	$searchBtn.on("click",_onSubmit);
	$form.on("submit",_onSubmit);
}


var processRefer = function () {
	window.localStorage.removeItem(referQueryKey);
	window.localStorage.removeItem(referPageStateKey);
}

var _onClickInput = function (evt) {

	var $dom = $(evt.target);

	if($dom.val() === DEFAULT_VALUE) {
		$dom.val('');
		$dom.removeClass('ipt');
	}
}

var _onBlurInput = function(evt){
	var $dom = $(evt.target);

	if($.trim($dom.val()) === "") {
		$dom.val(DEFAULT_VALUE);
		$dom.addClass('ipt');
	}
}

/**
* 获取地点点选的请求query
* @param {string} value 用户的输入
* @return {string} query 
*/
var _getSelectPoiQuery = function(value){
	var query = {
		qt : 's',
		wd : $.trim(value),
		c  : loc.getCityCode()
	}
	return query;
}


var _onSubmit = function (evt) {

	var $input = $("#search-input");
	var wd = $input.val();
	var query = _getSelectPoiQuery(wd);
	var _state = url.get().pageState || {};


	window.localStorage.setItem(referQueryKey, _state.refer_query);
	window.localStorage.setItem(referPageStateKey, _state.refer_pagestate);

	url.update({
		module : "place",
		action : "selectpoint",
		query : query,
		pageState : {}
	},{
		queryReplace : true,
		pageStateReplace : true
	});
	evt.preventDefault();
}


});
;define('third:widget/morecategory/morecategory.js', function(require, exports, module){

/**
 * @fileOverview 更多分类
 * @author yuanzhijia@baidu.com
 * @date 2013-08-06
 */
MY_GEO = "我的位置";
var loc = require('common:widget/geolocation/location.js'),
    parseurl = (require('common:widget/url/url.js')).get();
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    /**
    * 反将页面元素填充至this
    */
    render : function () {
       this.parentele = $('.categoryparent');
       this.morecategory = $('#more-category');
       this.childele = $('.categorychild h4');
    },
    /**
    * 给元素绑定事件
    */
    bind : function () {
        var me = this;
        me.parentele.on('click', $.proxy(me['_handleClickEvent'], this));
        me._setCenterName();
        me.childele.on('click',$.proxy(me['_redirect'], this));
    },
    /**
    *单击标题转向
    */
    _redirect : function(e){
        var opts = this.getUrl($(e.target).text()),
            url = "/mobile/webapp/"+opts.action+"/"+opts.module+"/"+$.param(opts.query)+"/"+$.param(opts.pageState);
        location.href = url;
    },
    /*
    ** 展示和折叠下部详细内容
    */
    _handleClickEvent: function(e){
        var me = this,
            target = e.target;
        me.toggleClickedLiIcon(e);
    },
    /**
    * 获取检索的中心点名称
    */
    _setCenterName : function(){
        var pageState =  parseurl.pageState;
        var query =  parseurl.query;

        //若关键字wd如'建国门 美食'则展示中心点在建国门
        var wd = (query.wd || '').split('     ');
        if(wd[1] === '更多'){
            this.centerName = wd[0];
            return this.centerName;
        }

        if(pageState.center_name){
            return decodeURIComponent(pageState.center_name);
        } else if(loc.hasExactPoi()) {
            return MY_GEO;
        } else {
            return loc.getCity();
        }
    },
    /**
    * 切换点击的li元素的图标
    */
    toggleClickedLiIcon: function(e){
        var me = this,
                element = $(e.target).parent();
                childli = element.next('.rl_sub_list');
        if(childli.css('display') == 'none'){
            element.find('em').removeClass('rl_opt_close');
            element.find('em').addClass('rl_opt_open');
            $('.rl_sub_list').hide();
            childli.show();
        }else{
            element.find('em').removeClass('rl_opt_open');
            element.find('em').addClass('rl_opt_close');
            childli.hide();
        }
        me.currentLi = me.getCurrentLi(e.target);
        me._scrollToCurrentCategory();
    },
    /**
    *用户切换的时候滚动到用户可见的区域内
    */
    _scrollToCurrentCategory: function(){
        var me = this;
        var offset = $(me.currentLi).offset();
        window.scroll(0, offset.top);
    },
    /**
    * 获取点击的dom节点邻近li元素
    * @param {object} target 鼠标点击的dom节点
    * @return {object} parent 获取target邻近的li元素
    */
    getCurrentLi: function(target){
        var parent = target;

        if(parent.nodeName !== 'LI'){
            while(target.parentNode != null){
                if(target.parentNode.nodeName === 'LI'){
                    parent = target.parentNode;
                    break;
                }else{
                    target = target.parentNode;
                }
            }
        }

        return parent;
    },
    /**
    * 切换页面
    * @param {string} wd 关键字
    */
    getUrl: function(wd){
        //更多分类页各个类别的点击量        
        var opts = {
            module : "search",
            action : "search",
            query  : { 
                qt          : "s",
                wd          : this.centerName ? wd + ' ' + this.centerName : wd,
                searchFlag  : "more_cate",
                c           : loc.getCityCode() || 1
            },
            pageState : {

            }
        };

        opts = this.setCenterPoi(opts);

        //如果包含centerName变量，表示从某区发起的检索，删除中心点
        if(this.centerName){
            delete opts.query.nb_x;
            delete opts.query.nb_y;
            delete opts.query.center_rank;
            delete opts.pageState.center_name;
        }
        return opts;
    },
    // 设置中心点参数
    setCenterPoi : function(opts){
        var _opts = opts || {};
        _opts.query = _opts.query || {};
        _opts.pageState = _opts.pageState || {};

        var pageState = parseurl.pageState,
            query = parseurl.query;
        if(pageState && pageState.type == "searchnearby" || pageState && pageState.from == "searchnearby") {
            _opts.query["center_rank"] = 1;
            _opts.query["nb_x"] = query.nb_x;
            _opts.query["nb_y"] = query.nb_y;
            _opts.pageState["center_name"] = pageState.center_name;
            return _opts;
        }

        if(loc.hasExactPoi()) { //非周边检索
            _opts.query["center_rank"] = 1; //以位置为中心点进行周边检索 
            _opts.query["nb_x"] = loc.getPointX();
            _opts.query["nb_y"] = loc.getPointY();

            _opts.pageState["center_name"] = loc.isUserInput() ? loc.getAddress() : '我的位置';
        }
        return _opts;
    }
}

});
;define('third:widget/navebox/navebox.js', function(require, exports, module){



});
;define('third:widget/navethumbnail/navethumbnail.js', function(require, exports, module){

/**
 * @fileOverview 线路页缩略图
 * @author yuanzhijia@baidu.com
 * @date 2013-08-01
 */
var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    util = require("common:static/js/util.js"),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    locator    = require('common:widget/geolocation/location.js'),
    loc = locator,
    searchData    = require("common:static/js/searchdata.js"),
    stat = require('common:widget/stat/stat.js');
// 私有常量
var GEO_TIMEOUT     = 8,
    THUMB_DATA      = {
        type    : "0,2",
        level   : 16,
        height  : 101,
        width   : window.innerWidth-22,
        url     : null,
        host    : 'http://snap.map.baidu.com/?qt=snap&data='
    },
data = window['_CURRENT_CITY'],
cname = data.name;
util.showLoading($('#poipic-area'));
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    render : function () {
        this.thumbImage     = $('#mapimg');
        this.errorCnt       = $('.error-cnt');  
        this.thumbImageA  = $('#right-a');
        this.subwayBtn = $('#subwayBtn');
        this.cityNameCnt = $('#cityNameCnt');
        this.nearbus =  $('#nb-bus');
        this.nearbusspan = $('#busspan');
        this.nearsubway = $('#nb-subway');
        this.nearsubwayspan = $('#stationspan');
        this.imgcon = $('#route-pic');
    },

    bind : function () {
        var _this = this;
        broadcaster.subscribe('geolocation.mylocsuc', function  () {

            _this.setLocation();
        }, this);
        broadcaster.subscribe('geolocation.fail', function  () {

            _this.thumbImageA.hide();
            _this.errorCnt.show();
        }, this);
        broadcaster.subscribe('sizechange', function (argument) {
            _this._appReSize();
        }, this);
        _this._trafficsubway();
    },
    /**
    *地铁和路况优先load 如果等待定位会load很长时间 相信同步的code
    */
    _trafficsubway:function(){
        var me  = this;
        if(cname!="全国"){
            me.imgcon.show();
            me._setThumbUrl();
            //检查当前城市是否有地铁
            var supportCityInfo = util.ifSupportSubway(locator.getCityCode());
            if(!supportCityInfo) {
                me.subwayBtn.hide();
            } else {
                var sarr = supportCityInfo.split(',')
                me.subwayBtn.attr("href","/mobile/webapp/subway/show/city="+sarr[0]+"/ref=index&forcesample=old_sample_1309");
                me.cityNameCnt.html(sarr[1]+"市地铁线路图");
                me.subwayBtn.show();
                stat.addStat(STAT_CODE.STAT_LINEINDEX_SUBWAYBTN_DISPLAY);
            }
        }
    },
    /**
     * 页面重设宽度
     */
    _appReSize : function  () {
        var _this = this;
        if(util.isAndroid()) {
            setTimeout(function() {
                THUMB_DATA['width'] = window.innerWidth - 22;
            },800)
        } else {
            THUMB_DATA['width'] =  window.innerWidth - 22;
        }
        _this._setThumbUrl();
    },
    /**
     * 通过解析GEO 获取当前城市的 point
     */
    setLocation: function(){
        var me = this;
        //if(cname!="全国"){
            if (locator.getMyCityCode() == data.code) {
                //附近公交和地铁
                me._getNearbyData();
            };
        //}
    },
    /**
     * 设置缩略图
     */
    _setThumbUrl : function() {
        var _this = this,
            url = _this._getThumbUrl();
        /*if(locator.hasExactPoi()) {
            //_this.centerMarker.show();
        } else {
           // _this.centerMarker.hide();
        }*/
        _this.thumbImage.attr("src", url);
        util.hideLoading($('#poipic-area'));
    },
    /**
     * 根据传入坐标获取缩略图服务的url
     */
    _getThumbUrl: function() {
        //根据获取图的类型设置不同级别
        if(THUMB_DATA['type'] == 0) {
            if(locator.getCity() == "全国") {
                THUMB_DATA['level'] = 3;
            } else if(locator.hasExactPoi()) {
                THUMB_DATA['level'] = 16;
            } else {
                THUMB_DATA['level'] = 10;
            }
        } else {
            THUMB_DATA['level'] = 10;
        }
        var point;
        if(data) {
            //data = data.index);
            JSONdata = data.geo;
            cityPoint = util.geoToPoint(JSONdata);
            point ={
                x:0,
                y:0
            }
            point.x = cityPoint.lng;
            point.y = cityPoint.lat;           
        }else{
            point = locator.getCenterPoi();
        }
        var param = {
            'retype'    : 1,
            'src'       : 'webapp',
            'level'     : THUMB_DATA['level'],
            'center'    : point.x + " " + point.y,
            'height'    : 101,
            'width'     : THUMB_DATA['width'],
            'coordtype' : 'M',
            'pictype'   : THUMB_DATA['type']
        }
        //var data = '{"retype":"1","src":"webapp", "level":' + THUMB_DATA['level'] + ',"center":"' + point.x + " " + point.y + '","height":101,"width":' + THUMB_DATA['width'] +',"coordtype":"M","pictype":"' + THUMB_DATA['type'] + '"}';
        return THUMB_DATA.host + JSON.stringify(param);
    },
    /**
     *取数据附近的地铁站和公交站
     *@author yuanzhijia@baidu.com
     */
    _getNearbyData : function() {
        var me = this;
        //if(locator.hasExactPoi()) { //非周边检索
            var queryBus = $.param(me._getQueryByWd("公交站").query);
            var querySubway = $.param(me._getQueryByWd("地铁站").query);

            searchData.fetch(queryBus, $.proxy(me._cbGetBusStation, this));
            searchData.fetch(querySubway, $.proxy(me._cbGetSubwayStation, this));
        //}
    },
    /**
     *取附近公交站和地铁站的URL组合
     *@author yuanzhijia@baidu.com
     */
    _getQueryByWd: function(wd) {
        var query = {
            qt: 's',
            wd: wd,           
            c: locator.getMyCityCode()
        };

        var pageState = {};

        //if(locator.hasExactPoi()) { //非周边检索
            query["center_rank"] = 1; //以位置为中心点进行周边检索 
            query["nb_x"] = locator.getMyPointX();
            query["nb_y"] = locator.getMyPointY();
        //}
        return {query:query,pageState:pageState};
    },
    /**
     *取附近公交站回调
     *@author yuanzhijia@baidu.com
     */
    _cbGetBusStation: function(json) {

        var me = this;
        if(json == undefined || json.content.length == 0)  return;
        var st = json.content[0] || "";
        me.nearbusspan.text(st.name + '-公交站');
        me.nearbusspan.attr('href','/mobile/webapp/place/detail/qt=inf&uid='+st.uid+'&c='+locator.getMyCityCode()+'/tab=line');
        me.nearbus.show();
        stat.addStat(STAT_CODE.STAT_LINEINDEX_BUS_DISPLAY);
    },
    /**
     *取附近地铁站回调
     *@author yuanzhijia@baidu.com
     */
    _cbGetSubwayStation: function(json) {
        var me = this;
        if(json == undefined || json.content.length == 0)  return;
        var sub = undefined;
        // debugger;
        for(var i = 0, len = json.content.length; i < len; i++) {
            if(json.content[i].poiType == 3) {
                sub = json.content[i];
                break;
            }
        }

        if(sub == undefined) return;

        var st = sub || "",
            sName = st.name + '-地铁站';
        me.nearsubwayspan.text(sName);
        me.nearsubwayspan.attr('href','/mobile/webapp/place/detail/qt=inf&uid='+st.uid+'&c='+locator.getMyCityCode()+'/tab=line');
        me.nearsubway.show();
        stat.addStat(STAT_CODE.STAT_LINEINDEX_SUBWAY_DISPLAY);
    }
}

});
;define('third:widget/nbserachbox/nbserachbox.js', function(require, exports, module){

/**
 * @fileOverview 更多分类
 * @author yuanzhijia@baidu.com
 * @date 2013-08-06
 */
MY_GEO = "我的位置";
var loc = require('common:widget/geolocation/location.js'),
    parseurl = (require('common:widget/url/url.js').get()),
    stat = require('common:widget/stat/stat.js');
module.exports = {
    init : function () {
        this.render();
        this.bind();
    },
    /**
    * 反将页面元素填充至this
    */
    render : function () {
       this.searchmorenearby = $('#index-widget-nbserachbox');
       this.searchInput = $('#search-input');
       this.DEFAULT_VALUE = "输入其他分类";
       this.searchBtn = $('#search-button');
       this.searcForm = $('#search-form');
    },
    /**
    * 给元素绑定事件
    */
    bind : function () {
        var me = this;
        me._renderCenterName();
        me.searchInput.on('focus', $.proxy(me._clearInput, this));
        me.searchInput.on('blur', $.proxy(me._resetInput, this));
        me.searcForm.on('submit', $.proxy(me._searchPoint, this));
        me.searchBtn.on('click', $.proxy(me._searchPoint, this));
    },
    _renderCenterName: function(){
       var centerName = this._getCenterName()
        me  = this;
        me.searchmorenearby.prepend('<p id="search-more-nearby">在 <span class="center-name">' + centerName + '</span> 的附近找</p>');
    },
    // 获取检索的中心点名称
    _getCenterName : function(){
        var pageState =  parseurl.pageState;
        var query =  parseurl.query;
        //若关键字wd如'建国门 美食'则展示中心点在建国门
        var wd = (query.wd || '').split('     ');
        if(wd[1] === '更多'){
            this.centerName = wd[0];
            return this.centerName;
        }

        if(pageState.center_name){
            return pageState.center_name;
        } else if(loc.hasExactPoi()) {
            return MY_GEO;
        } else {
            return loc.getCity();
        }
    },
    _clearInput: function(e){
        var me = this;
        var $input = $(e.target);
        if($input.val() === me.DEFAULT_VALUE){
            $input.val('');
            $input.removeClass('ipt-default');
        }
    },
    _resetInput: function(e){
        var me = this;
        var $input = $(e.target);
        var value = $input.val();
        if($.trim(value) === ''){
            $input.val(me.DEFAULT_VALUE);
            $input.addClass('ipt-default');
        }
    },
    /**
    * 检索地点
    * @param {object} e 事件对象
    */
    _searchPoint: function(opts){
        if(opts && opts.stopPropagation) {
            opts.stopPropagation(); /*阻止冒泡*/
        }
        if(opts && opts.preventDefault) {
            opts.preventDefault(); /*阻止表单默认事件的派发*/
        }
        var me = this;
        var $input = $('#search-input');
        var value = $input.val();

        //收起输入框
        $input.get(0).blur();

        if(me._checkValueValid(value)){
            me.search($.trim(value));
        }else{
            return;
        }
        return false;
    },
    /**
    * 检查用户输入是否合法
    * @param {string} value 用户输入
    * @return {bool} 
    */
    _checkValueValid: function(value){
        if($.trim(value) !== '' && $.trim(value) !== this.DEFAULT_VALUE){
            return true;
        }else{
            return false;
        }
    },
    search : function(val){
        if (parseurl.action == "more") {
            stat.addStat(STAT_CODE.STAT_MORE_CATEGORY_SEARCH_INPUT);
        };
        var me = this ,param = me._getDirParam($.trim(val));
        location.href = "/mobile/webapp/search/search/"+$.param(param);
    },
    _getDirParam: function(word, opts){
        if(!word || !(typeof(word)=="string")) {
            return;
        }

        opts = opts || {};
        var param = {
            'qt'            : 's',
            'wd'            : this.centerName ? word + ' ' + this.centerName : word ,
            'c'             : loc.getCityCode() || 1,
            'searchFlag'    : opts.from || ''
        };  

        var pagestate =  parseurl.pageState;

        //若pagestate中存在x,y点，则将点放入query中进行检索，否则检查是否精确定位成功，将精确点放入query
        if(pagestate.nb_x && pagestate.nb_x){
            param['nb_x'] = pagestate.nb_x;
            param['nb_y'] = pagestate.nb_y;
            param['center_rank'] = 1; 
            param['center_name'] = pagestate.center_name;        
        }else if(loc.hasExactPoi()) {
            param['nb_x'] = loc.getPointX();
            param['nb_y'] = loc.getPointY();
            param['center_rank'] = 1;
        }
        
        param['searchFlag'] = "more_cate";
        return param;     
    }
}

});
;define('third:widget/nearby/nearby.js', function(require, exports, module){

/**
 * @fileoverview 附近搜索
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    helper = require('index:widget/helper/helper.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function (pagename) {
        this.bind();
        this.page = pagename;
    },

    bind : function () {
        var _this = this;
        $('.index-widget-nearby [jsaction]').on('click', function (evt) {
            var target = $(evt.currentTarget);
            _this.search(target.attr('userdata'));
        });
    },

    search : function (userdata) {
        eval('var hash = ' + userdata);

        //九宫格点击量 by jican
        stat.addCookieStat(STAT_CODE.STAT_NEARBY_CLICK, {
            id: hash.id
        });

        if(hash.wd=='团购') {
            var host = 'http://mtuan.baidu.com/view?z=2&from=map_webapp&to_url=';
            window.location = host + encodeURIComponent(location.href);
        } else {
            url.update(helper.getHash(hash));
        }
    }
}

});
;define('third:widget/nearpush/bank.js', function(require, exports, module){

/**
 * @fileOverview 周边推荐-银行
 * @author jican@baidu.com
 * @data 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'bank',
    tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.length > 0){_template_fun_array.push('    <div class="hd">        <button jsaction="bank-all" userdata="{&#39;wd&#39;:&#39;',typeof(wd)==='undefined'?'':wd,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">查看全部</button>        <h2>银行</h2>    </div>    <ul class="list">        '); for(var i = 0, l = data.length; i < l; i++){ _template_fun_array.push('            <li jsaction="bank-all" userdata="{&#39;wd&#39;:&#39;',typeof(data[i].name)==='undefined'?'':data[i].name,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                <span class="icon ',typeof(data[i].key)==='undefined'?'':data[i].key,'"></span>                <p>',typeof(data[i].name)==='undefined'?'':data[i].name,'</p>            </li>        ');}_template_fun_array.push('    </ul>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

module.exports = {

    init : function  (pagename) {
        this.pagename = pagename;
        this.render();
        this.bind();
    },

    render : function () {
        $('.index-widget-bank').html(tpl(helper.cates[id]));
    },

    bind : function () {
        $('.index-widget-bank [jsaction]').on('click', this._go);
    },

    _go : function (evt) {
        helper.go(evt, 'bank');
    }
}

});
;define('third:widget/nearpush/cater.js', function(require, exports, module){

/**
 * @fileOverview 周边推荐-美食
 * @author jican@baidu.com
 * @date 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'cater',
    tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.length > 0){_template_fun_array.push('    <div class="hd">        <a href="javascript:void(0);" jsaction="cater-all" userdata="{&#39;wd&#39;:&#39;',typeof(word)==='undefined'?'':word,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">            查看全部        </a>        <h2>美食</h2>    </div>    <ul class="list">        '); for(var i = 0, l = data.length; i < 3; i++){ _template_fun_array.push('            <li jsaction="cater-detail" userdata="{&#39;uid&#39;:&#39;',typeof(data[i].uid)==='undefined'?'':data[i].uid,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                <a class="a-img" href="javascript:void(0);">                    <img width="89" height="66" src="',typeof(data[i].image)==='undefined'?'':data[i].image,'">                    ',typeof(data[i].otherflag)==='undefined'?'':data[i].otherflag,'                </a>                <dl>                    <dt class="name">',typeof(data[i].name)==='undefined'?'':data[i].name,'</dt>                    <dd class="rate">',typeof(data[i].star)==='undefined'?'':data[i].star,'</dd>                    <dd class="cmt">                        <span class="count">',typeof(data[i].comment)==='undefined'?'':data[i].comment,'</span>                        <span class="tail">条评论</span>                    </dd>                </dl>            </li>        ');}_template_fun_array.push('    </ul>    ');if(page=="hao123"){_template_fun_array.push('        <ul class="list">            '); for(var i = 3, l = data.length; i < 6; i++){ _template_fun_array.push('                <li jsaction="cater-detail" userdata="{&#39;uid&#39;:&#39;',typeof(data[i].uid)==='undefined'?'':data[i].uid,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                    <a class="a-img" href="javascript:void(0);">                        <img width="89" height="66" src="',typeof(data[i].image)==='undefined'?'':data[i].image,'">                        ',typeof(data[i].otherflag)==='undefined'?'':data[i].otherflag,'                    </a>                    <dl>                        <dt class="name">',typeof(data[i].name)==='undefined'?'':data[i].name,'</dt>                        <dd class="rate">',typeof(data[i].star)==='undefined'?'':data[i].star,'</dd>                        <dd class="cmt">                            <span class="count">',typeof(data[i].comment)==='undefined'?'':data[i].comment,'</span>                            <span class="tail">条评论</span>                        </dd>                    </dl>                </li>            ');}_template_fun_array.push('        </ul>    ');}_template_fun_array.push('');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

module.exports = {

    hasGetData : false,
    firstShow : false,

    init : function (page) {
        this.page = page;
        this.bind();
    },

    bind : function () {

        broadcaster.subscribe('nearpush.dataready', function () {
            this._render(helper.cates[id].data);
        }, this);

        switch (this.page) {
            //商圈页面不需要等待定位 直接获取数据
            case 'business' : {
                this._businessAction();
                break;
            }
            //首页需要监听页面滚轮事件 按需展现
            case 'index' : {
                this._indexAction();
                break;
            }
            //默认监听定位成功事件
            default : {
                this._defaultAction();
                break;
            }
        }
    },

    _defaultAction : function () {
        this._bindGeoEvent();
    },

    _businessAction : function () {
        this._fetch();
    },

    _indexAction : function () {
        helper.visible('.index-widget-cater', function(){
            if(!this.hasGetData) {
                this._fetch();
                this._bindGeoEvent();
            }
        }, this);
    },

    _bindGeoEvent : function () {
        broadcaster.subscribe('geolocation.success', this._fetch, this);
        broadcaster.subscribe('geolocation.fail', function () {}, this);
    },

    _fetch : function () {
        var _this = this,
            wrap = $('.index-widget-cater'),
            header = $('.index-page-nearby-hd');

        if(locator.getCityCode()!=1) {
            wrap.css('min-height', '160px');
            util.showLoading(wrap);
        }

        helper.getData(id, function (data) {
            helper.ready();
        },{
            page : _this.page
        });

        this.hasGetData = true;
    },

    _render : function (data) {
        var _this = this,
            wd = helper.cates[id].wd,
            wrap = $('.index-widget-cater'),
            header = $('.index-page-nearby-hd');
        if(data && data.length > 0) {
            wrap.html(tpl({
                'data'  : data, 
                'id'    : id,
                'word'  : wd,
                'page'  : _this.page
            }));
            header.show();
            if(!_this.firstShow){
                //周边推荐展首次现量 by jican
                stat.addStat(STAT_CODE.STAT_NEARPUSH_SHOW);
                _this.firstShow = true;
            }
        } else {
            wrap.css('min-height', '0');
            if(this.page=='index') {
                header.hide();
            }
        }
        util.hideLoading(wrap);
        this._bind();
    },

    _bind : function () {
        $('.index-widget-cater [jsaction]').on('click', this.jump);
    },

    jump : function (evt) {
        helper.go(evt, id);
    }
}

});
;define('third:widget/nearpush/hotel.js', function(require, exports, module){

/**
 * @fileOverview 周边推荐-酒店
 * @author jican@baidu.com
 * @data 2013/08/02
 */

var util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    searchData = require('common:static/js/searchdata.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator = require('common:widget/geolocation/location.js'),
    geolocator = require('common:widget/geolocation/geolocation.js'),
    helper = require('index:widget/helper/helper.js');

var id = 'hotel',
    tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('');if(data && data.length > 0){_template_fun_array.push('    <div class="hd">        <a href="javascript:void(0);" jsaction="hotel-all" userdata="{&#39;wd&#39;:&#39;',typeof(word)==='undefined'?'':word,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">            查看全部        </a>        <h2>酒店</h2>    </div>    <ul class="list">        '); for(var i = 0, l = data.length; i < l; i++){ _template_fun_array.push('            '); var item = data[i]; ;_template_fun_array.push('            <li jsaction="hotel-detail" userdata="{&#39;uid&#39;:&#39;',typeof(item.uid)==='undefined'?'':item.uid,'&#39;,&#39;id&#39;:&#39;',typeof(id)==='undefined'?'':id,'&#39;}">                <div class="clearfix">                    <a class="a-img" href="javascript:void(0);">                        <img width="89" height="66" src="',typeof(item.image)==='undefined'?'':item.image,'">                        ',typeof(item.otherflag)==='undefined'?'':item.otherflag,'                    </a>                    <dl>                        <dt class="name">',typeof(item.name)==='undefined'?'':item.name,'</dt>                        <dd class="addr">地址：',typeof(item.addr)==='undefined'?'':item.addr,'</dd>                        <dd class="cmt">                            <span class="rate">',typeof(item.star)==='undefined'?'':item.star,'</span>                            <span class="price">                                <span class="tail">人均：</span>                                <span class="count">￥',typeof(item.price)==='undefined'?'':item.price,'</span>                            </span>                        </dd>                    </dl>                </div>                <div class="bar clearfix">                        ');if(!item.tel.num){_template_fun_array.push('                            <div class="btn tel" style="visibility:hidden">                                <a class="a-tel" href="/">                                    <b class="icon tel"></b>000-00000000                                </a>                            </div>                              ');} else {_template_fun_array.push('                            <div class="btn tel">                                <a class="a-tel" ',typeof(item.tel.url)==='undefined'?'':item.tel.url,'>                                    <b class="icon tel"></b>',typeof(item.tel.num)==='undefined'?'':item.tel.num,'                                </a>                            </div>                            ');}_template_fun_array.push('                    ');if(item.order){_template_fun_array.push('                        <div class="btn order"><a href="javascript:void(0);" jsaction="hotel-detail" userdata="{&#39;uid&#39;:&#39;',typeof(item.uid)==='undefined'?'':item.uid,'&#39;}">预订</a></div>                    ');}_template_fun_array.push('                </div>            </li>        ');}_template_fun_array.push('    </ul>');}_template_fun_array.push('');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];

module.exports = {

    hasGetData : false,

    init : function (page) {
        this.page = page;
        this.bind();
    },

    bind : function () {

        broadcaster.subscribe('nearpush.dataready', function () {
            this._render(helper.cates[id].data);
        }, this);

        switch (this.page) {
            //商圈页面不需要等待定位 直接获取数据
            case 'business' : {
                this._businessAction();
                break;
            }
            //首页需要监听页面滚轮事件 按需展现
            case 'index' : {
                this._indexAction();
                break;
            }
            //默认监听定位成功事件
            default : {
                this._defaultAction();
                break;
            }
        }
    },

    _defaultAction : function () {
        this._bindGeoEvent();
    },

    _businessAction : function () {
        this._fetch();
    },

    _indexAction : function () {
        helper.visible('.index-widget-hotel', function(){
            if(!this.hasGetData) {
                this._fetch();
                this._bindGeoEvent();
            }
        }, this);
    },

    _bindGeoEvent : function () {
        broadcaster.subscribe('geolocation.success', this._fetch, this);
        broadcaster.subscribe('geolocation.fail', function () {}, this);
    },

    _fetch : function () {
        var _this = this;
        this.hasGetData = true;
        helper.getData(id, function (data) {
            helper.ready();
        },{
            page : _this.page
        });
    },

    _render : function (data) {
        var _this = this, wd = helper.cates[id].wd;
        if(data && data.length > 0) {
            $('.index-widget-hotel').html(tpl({
                'data'  : data,
                'id'    : id,
                'word'  : wd,
                'page'  : _this.page
            }));
        }
        this._bind();
    },

    _bind : function () {
        $('.index-widget-hotel [jsaction]').on('click', this.jump);
        $('.index-widget-hotel .a-tel').on('click', function (evt) {
            var target = $(evt.currentTarget),
                dataTel = target.attr('data-tel');
            if(target && dataTel){
                util.TelBox.showTb(dataTel);
            }
            evt.stopPropagation();
        });
    },

    jump : function (evt) {
        helper.go(evt, id);
    }
}

});
;define('third:widget/seacrhnave/seacrhnave.js', function(require, exports, module){

/*
 * @fileoverview 三大金刚跳转路线搜索框
 * author: yuanzhijia@baidu.com
 * date: 2013/08/07
 */
var util        = require('common:static/js/util.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    locator     = require('common:widget/geolocation/location.js'),
    quickdelete = require('common:widget/quickdelete/quickdelete.js'),
    suggestion  = require('common:widget/suggestion/suggestion.js'),
    popup = require('common:widget/popup/popup.js'),
    parseurl = (require('common:widget/url/url.js')).get(),
    stat = require('common:widget/stat/stat.js');

var MY_GEO = "我的位置",
    IS_REALLY_LOCATION = false;//是否是真正定上位了,防止用户手动输入我的位置实际未成功定位
module.exports = {

    init : function () {
        this.render();
        this.bind();
        var pt = this._getPagetype();
        if(!pt.isSelf){
            this[pt.elSelf].val(pt.word);
            this.model.set([pt.el],{word:pt.word,point:pt.point});
        }
    },

    render : function () {
        var me = this;
        me.sestart = $('#se_txt_start');
        me.seend  = $('#se_txt_end');
        me.maskid = $('#se_wrap');
        me.reverseBtn = $('#se_dir_reverse');
        me.model  = require("index:widget/seacrhnave/searchboxmodel.js");
        me.urlstart  = me._proceedUrl(parseurl.pageState.start);
        me.urlend  = me._proceedUrl(parseurl.pageState.end);
        me.pagetype = me._getPagetype();
        me.selement = $('#se_txt_start, #se_txt_end');
        me.submitbtn  = $('.se-btn-tr');
        me.sedirform = $('.se-dir-form');
    },
    /*
    ** 获取url中的参数
    */
    _proceedUrl : function(udata){

        var res = false;
        //try{
            if(udata != undefined){
                res={
                    word:"",
                    point:""
                };
                datarr = udata.trim().split('&');
                datarr[0] && (res.word = decodeURIComponent(datarr[0].split('=')[1]));
                datarr[1] && (res.point= decodeURIComponent(datarr[1].split('=')[1]));
            }
        //} catch(e) {

        //}
        return res;
    },
    /**
     * 绑定事件
     */
    bind : function () {
        var me = this;
        //修复默认浏览器我的位置回填
        $(window).on('pageshow',function(){
            if(IS_REALLY_LOCATION){
                setTimeout(function(){
                    me._setLocation();
                },0);
            }
        });
        // 注册起点quickdeletestart
        me._poiQuickStart = $.ui.quickdelete({
            container: me.sestart
        });

        // 注册起点suggesstionstart
        me._poiSugStart = $.ui.suggestion({
            container: me.sestart,
            mask: me.maskid,
            source: 'http://map.baidu.com/su',
            listCount: 6,       // SUG条目
            posAdapt: false,    // 自动调整位置
            isSharing: true,    // 是否共享
            offset: {           // 设置初始偏移量
                x: 0,
                y: 132
            },
            param: $.param({
                type: "0",
                newmap: "1",
                ie: "utf-8"
            }),
            onsubmit: function() { //兼容widget老版，采用onEventName方式绑定
               /*var word = this.getValue();
                me.sestart.val(word);
                if (!word) {
                    return;
                } else {
                    me._poiSubmit();
                }*/
                me._poiSugStart && me._poiSugStart.hide();
            },
            onfocus: function() {
                me._poiSugEnd && me._poiSugEnd.hide();
            }
        });

        // 注册终点quickdeletestart
        me._poiQuickEnd = $.ui.quickdelete({
            container: me.seend
        });

        // 注册终点suggesstionstart
        me._poiSugEnd = $.ui.suggestion({
            container: me.seend,
            mask: me.maskid,
            source: 'http://map.baidu.com/su',
            listCount: 6,       // SUG条目
            posAdapt: false,    // 自动调整位置
            isSharing: true,    // 是否共享
            offset: {           // 设置初始偏移量
                x: 0,
                y: 132
            },
            param: $.param({
                type: "0",
                newmap: "1",
                ie: "utf-8"
            }),
            onsubmit: function() { //兼容widget老版，采用onEventName方式绑定
               /*var word = this.getValue();
                me.seend.val(word);
                if (!word) {
                    return;
                } else {
                    me._poiSubmit();
                }*/
                me._poiSugEnd && me._poiSugEnd.hide();
            },
            onfocus: function() {
                 me._poiSugStart && me._poiSugStart.hide();
            }
        });
        me.reverseBtn.on('click', $.proxy(me['_reverse'], this));
        //定位成功后更新我的位置
        broadcaster.subscribe('geolocation.mylocsuc', function  () {
            var me = this;
            //IS_REALLY_LOCATION = true;
            IS_REALLY_LOCATION = !!(locator.getMyLocation().point);

            me._setLocation();
        }, this);
        me.selement.on('focus', $.proxy(me._focus, this));
        me.selement.on('blur', $.proxy(me._blur, this));
        me.selement.on('mousedown', $.proxy(me._touchstart, this));
        me.submitbtn.on('click', $.proxy(me._poiSubmit, this));
        me.selement.on('mousedown', $.proxy(me._touchstart, this));
        me.sedirform.on('submit', $.proxy(this._poiSubmit, this));
    },
    /**
    *统一判断当前页面类型
    */
    _getPagetype : function(){
            var me = this;
                result = {elSelf:'',el:"sestart",key:"start",isSelf:false,word:'',point:''};
            if(me.urlend){
                result.elSelf = "seend";
                result.word = me.urlend.word;
                result.point = me.urlend.point;
            }else if(me.urlstart){
                result.key = "end";
                result.el = "seend";
                result.elSelf = "sestart";
                result.word = me.urlstart.word;
                result.point = me.urlend.point;
            }else{
                result.isSelf = true;
            }
            return result;
    },
    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     */
    _checkInput : function (element) {
        if(!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        if(element.val() == MY_GEO && this.model.get('geo').word != MY_GEO) {
            element.val('');
            popup.open({text:'定位失败！'});
            return false;
        } 
        return true;
    },
    /**
    *获取公用的geodata
    */
    _getGeoData : function(){
        var geoData = {'word' : '','point' : '','citycode' : ''},
            data    = locator.getLocation();

        if(IS_REALLY_LOCATION) {
            geoData = {
                'word' : MY_GEO,
                'point' : locator.getMyPointX() + ',' + locator.getMyPointY(),
                'citycode' : locator.getMyCityCode()
            }
        }
        return geoData;
    },
    /**
    * 反转起点和终点
    */
    _reverse:function(e) {
        var me = this , se= {
            start : $('#se_txt_start').val(),
            end : $('#se_txt_end').val()
       };
       me.reverseBtn.addClass("active");
       me.sestart.val(se.end);
       me.seend.val(se.start);
       
       setTimeout(function(){
            me.reverseBtn.removeClass("active");
       },100);
       me.model.set('end',{word:se.start});
       me.model.set('start',{word:se.end});
       me._update();
    },
    /**
     * 更新我的位置对应的文本框状态
     */
    _update:function(){
        var me = this;
        var start = me.sestart,end = me.seend,geo = me.model.get('geo');
            if(start.val() == MY_GEO && geo.word == MY_GEO && IS_REALLY_LOCATION) {
                start.addClass('geo');
                end.removeClass('geo');
            } else {
                start.removeClass('geo');                 
            }
            if(end.val() == MY_GEO && geo.word == MY_GEO && IS_REALLY_LOCATION) {
                end.addClass('geo');
                start.removeClass('geo');
            } else {
                end.removeClass('geo');
            }
    },
    /**
     * 通过判断是否是三大金刚跳转过来还是路线搜索设置model
     */
    _setLocation: function(){
        var me = this,
            stratinput = me.sestart,
            endinput = me.seend;
            result = me.pagetype,
            geoData = me._getGeoData();
        if (IS_REALLY_LOCATION) {
            me[result.el].val(MY_GEO);
        }
        result.key && me.model.set(result.key,geoData);
        var geo = me.model.get('geo');
        if(!geo.point || (geoData && geoData.point !== '')){
            me.model.set('geo',geoData);
        }
        me._update();
    },
    /**
     * 文本框素获得焦点
     */
    _focus:function(e){
        var el = $(e.target);
        if(el.val()==MY_GEO) {
            el.val('');
        }
        el.removeClass('geo');
    },
    /**
     * 文本框素失去焦点
     */
    _blur : function (e) {
        var me = this,
            el = $(e.target),
            key = el.attr('key'),
            geo = me.model.get('geo'),
            //根本没定位成功或者用户手工输入
            isGeoFlag = (geo.word != MY_GEO && txt == MY_GEO && IS_REALLY_LOCATION),
            //文本框发现是我的位置 但却根据定位监测到不是真正我的位置
            //isUserInput = (txt == MY_GEO && locator.isUserInput()),
            txt = el.val().trim();
        if(isGeoFlag) {
            //强制清空文本 告知定位失败
            el.val("");
            popup.open({text:'定位失败！'});
        }
        if(geo.point && txt=='' && IS_REALLY_LOCATION) {
            if(me.model.get(key).word==geo.word) {
                el.val(MY_GEO);
                el.addClass('geo');
            }
            //符合了定位 而且当前文本框是我的位置的话 强制再去检测当前位置的GEO
            var modelkey =(key == "start" ? "start" :"end");
            if(me["se"+modelkey].val()!=MY_GEO) {
                me.model.set(key, me._getGeoData());
                me.model.set(modelkey,{word:""});
            }
        }
    },
    //修复错误数据 by zhijia
    _fixDirData : function () {
        var startendIpt = $('.se-dir-form input[type=text]'),
            fixpt = this._getPagetype()
            ptIsSelf = fixpt.isSelf,
            me  = this;
        $.each(startendIpt,function(){
            var key = $(this).attr('key'),
                      Ipt = $('#se_txt_'+key+''),
                      Data = me.model.get(key),
                      IptFlase = (Data.word!=Ipt.val());
            if(!Data.word || IptFlase) {
                if ((Ipt.val()=== MY_GEO) && IS_REALLY_LOCATION) {
                    me.model.set(key, me._getGeoData());
                }else{
                    if(ptIsSelf || (Ipt.val()!=fixpt.word)){
                        me.model.set(key, {word : Ipt.val()});
                    }else{
                        me.model.set(key, {word : fixpt.word,point:fixpt.point});
                    }
                }
            }       
        });
    },
    _touchstart : function (evt) {
        var el = $(evt.target);
        el.focus();
        evt.stopPropagation();
    },
    /**
     * 获取路线方案请求参数
     * @param {Number} tab 1公交 2驾车 3步行 或者 'transit' 'drive' 'walk'
     * @param {Object} start 起点 {word:'',uid:'',point:''}
     * @param {Object} end 终点 {word:'',uid:'',point:''}
     * @param {Object} opts 可选参数
     * @return {Object} param
     */
    _getDirParam : function(tab, start, end, opts) {
        //start = this.model._adaptive(start); 自身适配
        //end = this.model._adaptive(end);
        var param,
            code        = locator.getCityCode() || 1,
            searchIndex    = this._getTabIndex('search', tab),
            startCode   = start.citycode || code,
            endCode     = end.citycode || code,
            cityCode    = startCode || code;

        // 起终点确定或均不确定路线方案拼接
        if((start.point && end.point) || !start.point && !end.point) {
            param = {
                'qt' : ['s','bt','nav','walk'][searchIndex] || 'bt',
                'sn' : this._joinParam(start), 
                'en' : this._joinParam(end),
                'sc' : startCode,
                'ec' : endCode,
                'c'  : cityCode,
                'pn' : '0',
                'rn' : '5'
            }
        } else {
            // 单边路线方案拼接
            var sureData,
                sureKey,
                seType,
                searchData;
            if(start.point) {
                sureData = start;
                searchData = end;
                sureKey = 'sn';
                seType = '1';
            } else {
                sureData = end;
                searchData = start;
                sureKey = 'en';
                seType = '0';
            }

            var qt = ['s','bse','nse','wse'][searchIndex] || 'bse',
                point = sureData.point;

            param   = {
                'qt'        : qt,
                'ptx'       : point.split(',')[0],
                'pty'       : point.split(',')[1],
                'wd'        : searchData.word || '',
                'name'      : sureData.word || '',
                'c'         : code,
                'sc'        : start.citycode || code,
                'ec'        : end.citycode || code,
                'isSingle'  : 'true'
            };

            param[qt+'tp'] = seType;
            param[sureKey] = this._joinParam(sureData);
        }

        if(opts && opts.from) {
            param.searchFlag = opts.from || '';
        }

        if(['nav','nse','walk','wse'].indexOf(param.qt) >=0) {
            param.version = '3'; //驾车和步行采用新接口 by jican
        }

        return param;
    },
    /**
     * 搜索框提交
     * @param {Object} opts 可选参数
     * @author yuanzhijia@baidu.com
     * @date 2013/08/02
     */
    _poiSubmit : function (opts) {
        if(opts && opts.stopPropagation) {
            opts.stopPropagation(); /*阻止冒泡*/
        }
        if(opts && opts.preventDefault) {
            opts.preventDefault(); /*阻止表单默认事件的派发*/
        }
        var ele = opts,tab;
            ele.target && (tab = $(opts.target).attr('data-value'));
        if(!tab){
            tab=1;
        }
        var me =   this,
            startIpt = me.sestart,
            endIpt = me.seend;
        if(!(me._checkInput(startIpt)) || !(me._checkInput(endIpt))){
            return false;
        }
        this._fixDirData();

        switch(tab){
            case "1":
            //公交类检索量
            stat.addCookieStat(STAT_CODE.STAT_BUS_SEARCH);
            break;
            case "2":
            //驾车类检索量
            stat.addCookieStat(STAT_CODE.STAT_NAV_SEARCH);
            break;
            case "3":
            //步行类检索量
            stat.addCookieStat(STAT_CODE.STAT_WALK_SEARCH);
            break;
        }
        var qt = me._getDirParam(tab,this.model.get('start'),this.model.get('end'),opts);
        //location.href = "http://map.baidu.com/mobile/#seach/search/" + $.param(qt);
        location.href = "/mobile/webapp/search/search/" + $.param(qt);
    },
    /**
     * 返回索引类型的Tab值
     * @param {Number|String} tab
     * @return {Number} 0 1 2 3
     * @author jican
     * @date 2013/01/21
     */
    _getTabIndex : function (type, tab) {
        if(!isNaN(tab)) {
            var str = this._num2str(type, tab),
                num = this._str2num(type, str);
            return num;
        } else if(typeof(tab)=="string"){
            return this._str2num(type, tab);
        }
    },

    /**
     * 返回字符串类型的Tab值
     * @param {Number|String} tab
     * @return {String} 'place' 'transit' 'drive' 'walk'
     * @author jican
     * @date 2013/01/21
     */
    _getTabStr : function (type, tab) {
        if(!isNaN(tab)) {
            return this._num2str(type, tab);
        } else if(_.isString(tab)){
            var num = this._str2num(type, tab),
                str = this._num2str(type, num);
            return str;
        }
    },

    /**
     * 字符串类型的Tab转化成数值类型
     * @param {String} str
     * @return {Number} tab
     * @author jican
     * @date 2013/02/27
     */
    _num2str : function (type, index) {
        if(type == 'tab') {
            return ['place', 'line'][index] || 'place';
        } else {
            return ['place', 'transit', 'drive', 'walk'][index] || 'place';
        }
    },

    /**
     * 数值类型的Tab转化成字符串类型
     * @param {Number} tab
     * @return {String} str
     * @author jican
     * @date 2013/02/27
     */
    _str2num : function (type, str) {
        if(type == 'tab') {
            return {'plcae': 0, 'line':1}[str] || 0;
        } else {
            return {'place': 0, 'transit': 1, 'drive': 2, 'walk': 3}[str] || 0;
        }
    },
    /**
     * 将起终点数据连接成请求参数
     * @param {Object} data start,end
     * @author yuanzhijia
     * @date 2013/08/03
     */
    _joinParam : function(data) {
        if(!data) {
            return '';
        }
        var type  = data.point ? '1' : '2',
            uid   = data.uid || '',
            point = data.point || '',
            word  = data.word || '';
        return [type, uid, point, word, ''].join('$$');
    }
}

});
;define('third:widget/seacrhnave/searchboxmodel.js', function(require, exports, module){

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
;define('third:widget/searchbox/searchbox.js', function(require, exports, module){

/*
 * @fileoverview 搜索框View
 * @author jican@baidu.com
 * @date 2013/01/22
 */

var util        = require('common:static/js/util.js'),
    url        = require('common:widget/url/url.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    geolocator  = require('common:widget/geolocation/geolocation.js'),
    locator     = require('common:widget/geolocation/location.js'),
    quickdelete = require('common:widget/quickdelete/quickdelete.js'),
    suggestion  = require('common:widget/suggestion/suggestion.js'),
    poisearch   = require('common:widget/search/poisearch.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {

    init : function () {
        this.render();
        this.bind();
    },

    render : function () {

        var _this = this;

        // 注册quickdelete
        this._poiQuick = $.ui.quickdelete({
            container: '.se-input-poi',
            offset: {
                x: 0,
                y: 2
            }
        });

        // 注册suggesstion
        this._poiSug = $.ui.suggestion({
            container: '.se-input-poi',
            mask: '.se-form',
            source: 'http://map.baidu.com/su',
            listCount: 6,       // SUG条目
            posAdapt: false,    // 自动调整位置
            isSharing: true,    // 是否共享
            offset: {           // 设置初始偏移量
                x: 0,
                y: 52
            },
            param: $.param({
                type: "0",
                newmap: "1",
                ie: "utf-8"
            }),
            onsubmit: function() { //兼容widget老版，采用onEventName方式绑定
                var word = this.getValue();
                $('.se-input-poi').val(word);
                if (!word) {
                    return;
                } else {
                    _this.submit();
                }
            }
        });

    },

    bind : function () {
        $('.se-form').on('submit', $.proxy(this.submit, this));
        $('.se-btn').on('click', $.proxy(this.submit, this));
        $('.se-input-poi').on('blur', function () {
            $(".se-city").show();
        });
        $('.se-input-poi').on('focus', function () {
            $(".se-city").hide();
        });

        broadcaster.subscribe('geolocation.success', this.updateMyPos, this);

        $('.index-widget-searchbox [jsaction]').on('click', $.proxy(this.go, this));
    },

    go : function (e) {
        var target = $(e.currentTarget);
        switch(target.attr('jsaction')) {
            case 'toNavSearch' : {
                var query = {
                    'qt'        : 'cur',
                    'wd'        : locator.getCity() || '全国',
                    'from'      : 'maponline',
                    'tn'        : 'm01',
                    'ie=utf-8'  : 'utf-8'
                }
                url.update({
                    query : query,
                    pageState: {tab: 'line'}
                }, {
                    queryReplace : true
                });
                break;
            }
        }
        return false;
    },

    submit : function (evt) {

        var poiInput = $('.se-input-poi');
        if(!this._checkInput(poiInput)){
            return false;
        }

        if(evt) {
            var target = $(evt.currentTarget),
                userdata = target.attr('user-data');
            //当时搜索按钮发起的检索时需要手动把query存入历史记录 by jican
            if(userdata=='se-btn') {
                this._poiSug && this._poiSug._localStorage(poiInput.val());
            }
        }
        
        poiInput.blur();
        stat.addCookieStat(STAT_CODE.STAT_POI_SEARCH); //搜索框发起的检索量 @jican

        poisearch.search(poiInput.val());

        return false;
    },

    /**
     * 更新我的位置
     * @param {object} data
     */
    updateMyPos : function  (data) {
        data = data ? data : locator.getLocation();
        if(data.addr && data.addr.city) {
            $('.se-city-wd').text(data.addr.city);
        }
    },
    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     * @author jican
     * @date 2013/01/21
     */
    _checkInput : function (element) {
        if(!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        return true;
    }
}

});
;define('third:widget/slideopen/slideopen.js', function(require, exports, module){

/**
 * @file topbanner.js 顶部广告条
 */
'use strict';

module.exports = {
    init: function () {
        var me = this;
        
        var util = require('common:static/js/util.js'),
            stat = require('common:widget/stat/stat.js'),
            src, hasInstalled,
            topBannerClosed = Boolean(localStorage.getItem('topBannerClosed'));
            if (topBannerClosed === false) {
            // 判断是否已经安装
            util.getNativeInfo('com.baidu.BaiduMap', function (data) {
                if (data.error == 0) {
                    if($(".text").html() != null){
                        $(".text").html("");
                    }
                    $(".text").html("打开百度地图客户端"); 
                    hasInstalled = true;
                } else {
                    if($(".text").html() != null){
                        $(".text").html("");
                    }
                  $(".text").html("下载百度地图客户端");  
                    hasInstalled = false;
                }
            }, function () {
                    if($(".text").html() != null){
                        $(".text").html("");
                    }
                $(".text").html("下载百度地图客户端");
                hasInstalled = false;
            });

        }

        src = util.isIPhone() ? 'http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8'
        : (util.isIPad() ? 'https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681?ls=1&mt=8'
        : (util.isAndroid() ? 'http://mo.baidu.com/d/map/gw10014/bmap_andr_gw10014.apk' : ''));

                    var oLock = $("#unlock-slider");
            var oBtn = $("#unlock-handle");
            var olock = oLock[0];
            var obtn = oBtn[0];
            var disX = 0;
            var maxL = olock.clientWidth - obtn.offsetWidth;

            var initPageX = 0;
            var left  = 0;

            var touchStartHandler = function(e){
                 var touchs = e.touches;
                 initPageX = touchs[0].pageX;

                 var divLeft  = $(this).css('left');
                 e.preventDefault();
                 e.stopPropagation();

                 divLeft = parseInt(divLeft.replace('px', ''));
                 left = divLeft;

                 this.addEventListener('touchmove', touchMoveHandler);
                 this.addEventListener('touchend', touchEndHandler);
            };

            var touchMoveHandler = function(e){
                 var touchs = e.touches;
                 var diff = touchs[0].pageX - initPageX;

                 e.preventDefault();
                 e.stopPropagation();

                 var x = left + diff;
                 $(".text").css("opacity", 1-(parseInt(x)/120));
                 if(x < 0){
                      return;
                 }
                 if(x >= 190){
                    this.removeEventListener('touchmove', touchMoveHandler);
                    if (hasInstalled) {
                        stat.addStat(STAT_CODE.STAT_NEARPUSH_SHOW);
                        location.href = 'bdapp://map/';
                    } else {
                        stat.addStat(STAT_CODE.STAT_APP_LOADDOWN);
                        window.open("http://map.baidu.com/zt/jod.html", '_blank');
                    }
                    $("#unlock-handle").animate({left: 0}, 200 );
                    $("#slide-to-unlock").animate({opacity: 1}, 200 );
                    $(".text").css("opacity", parseInt(x)/120);
                 }else{
                     $(this).css({
                        left: x
                     });
                 }
            };

            var touchEndHandler = function(e){
                e.stopPropagation();
                this.removeEventListener('touchmove', touchMoveHandler);
                $("#unlock-handle").animate({left: 0}, 200 );
                $("#slide-to-unlock").animate({opacity: 1}, 200 );
                $(".text").css("opacity", 1);
            }

            obtn.addEventListener('touchstart', touchStartHandler); 
            stat.addStat(STAT_CODE.STAT_APPBANNER_SHOW);

    }

};

});
;define('third:widget/thumbnail/userheading.js', function(require, exports, module){

/**
 * 利用指南针传感器显示用户方位信息
 * @author jiazheng
 * @date 20130604
 */
function UserHeading(){
    /**
     * 时间戳
     * @type {number}
     */
    this._timeStamp = 0;
    /**
     * 用于显示的dom对象集合
     * @type {Array<HTMLElement>}
     */
    this._doms = [];
    /**
     * 当前指南针传感器的方位值，用来对比新旧值之间的差距
     * @type {number}
     */
    this._alpha = 0;
    /**
     * 当前用户手机姿态，由于指南针传感器返回的数据是手机
     * 头部的指向，因此需要知道手机的姿态
     * @type {number}
     */
    this._orientation = window.orientation;
}
/**
 * 启动传感器，并添加dom元素
 * @param {HTMLElement} 用于显示用的dom元素
 */
UserHeading.prototype.start = function(dom){
    var me = this;
    me._doms.push(dom);
    if (me._started) {
        // 后续事件监听仅需要执行一次
        return;
    }
    me._started = true;
    window.addEventListener('deviceorientation', function(e){
        var alpha;
        if (!e.webkitCompassHeading) {
            alpha = Math.round(e.alpha);
        } else {
            alpha = Math.round(0 - e.webkitCompassHeading);
        }
        alpha = alpha - me._orientation;
        if (e.timeStamp - me._timeStamp < 100) {
            // 过于频繁
            return;
        }
        me._timeStamp = e.timeStamp;
        var diff = Math.abs(me._alpha - alpha);
        if (diff > 5) {
            // 增加diff判断主要解决防止小范围的来回抖动
            for (var i = 0; i < me._doms.length; i ++) {
                if (!me._doms[i] || !me._doms[i].style) {
                    continue;
                }
                me._doms[i].style.transform = 
                    me._doms[i].style.webkitTransform = 
                    'rotate(' + (Math.round(0 - alpha)) + 'deg)';
            }
            me._alpha = alpha;
        }
    }, true);
    window.addEventListener('orientationchange', function(){
        me._orientation = window.orientation;
    }, true);
}
/**
 * 测试是否支持
 * @return {boolean} 是否支持
 */
UserHeading.prototype.isSupport = function(){
    var ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1 || // android暂时不开放该功能，不够准确
        !window.DeviceOrientationEvent) {   // 没有事件，不支持
        return false;
    }
    return true;
}

module.exports = new UserHeading();

});
;define('third:widget/thumbnail/thumbnail.js', function(require, exports, module){

/**
 * @fileOverview 首页缩略图
 * @author jican@baidu.com
 * @date 2013-7-30
 */

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    util = require("common:static/js/util.js"),
    url = require('common:widget/url/url.js'),
    popup = require('common:widget/popup/popup.js'),
    locator = require('common:widget/geolocation/location.js');
    stat = require('common:widget/stat/stat.js');

var STATE = {
        'start'     : 1, //开始 即定位中
        'success'   : 2, //成功
        'fail'      : 0  //失败
    },
    THUMB_DATA = {
        type    : 0,
        level   : 16,
        height  : 101,
        width   : window.innerWidth-22,
        url     : null,
        host    : 'http://snap.map.baidu.com/?qt=snap&data='
    };


module.exports = {

    flag : {
        'appreszie' : false,
        'wait'      : undefined
    },

    state : 'start',

    init : function () {
        this.prevPoint = undefined;
        this.render();
        this.bind();
    },

    render : function () {
        this.thumbImg       = $('.thumb-img');
        this.thumbWrap      = $('.thumb-wrap');
        this.locbarTxt      = $('.locbar-txt');
        this.centerMarker   = $('.center-marker');
        this.geoBtn         = $('.geo-btn');
        this.inBtn          = $('.in-btn');
        this.errorCnt       = $('.error-cnt');
        this.thumbLink      = $('.thumb-link');

        this.setState('start');
        this.setUserHeading();
    },

    bind : function () {

        var _this = this;

        _this.geoBtn.on('click', function (e) {
            //增加首页“定位”按钮点击量
            stat.addStat(STAT_CODE.STAT_THUNB_START_GEO);
            _this.startGeo();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return;
        });

        _this.thumbImg.on('load', function(){           
            _this.errorCnt.hide();
            _this.thumbImg.show();
            _this.geoBtn.show();
            _this.hideLoading();
        });

        _this.thumbImg.on('error', function(){
            _this.errorCnt.show();
            _this.thumbImg.hide();
            _this.centerMarker.hide();
            _this.hideLoading();
        });
        
        broadcaster.subscribe('geolocation.success', function () {
            this.successCBK();
        }, this);

        broadcaster.subscribe('geolocation.fail', function () {
            this.failCBK();
        }, this);

    },

    //定位成功回调函数
    successCBK: function () {
        if(!this.flag.appreszie) {
            broadcaster.subscribe('sizechange', function () {
                this._appReSize();
            }, this);
            this.flag.appreszie = true;
        }
        this.setState('success');
    },

    //定位失败回调
    failCBK: function () {
        this.setState('fail');
    },

    //设置当前状态
    setState: function(state){
        this.flag.state = state;
        this.addStateToLog(state);
        switch(state){
            case 'start': {     //开始定位
                this.state = 'start';
                this.showLoading();
                this.waitForLoc(8);
                break;
            }
            case 'success':  {  //定位成功
                this.state = 'success';
                this.hideLoading();
                this.setLocation();
                break;
            }
            case 'fail': {          //定位失败
                this.state = 'fail';
                this.hideLoading();
                this.centerMarker.hide();
                popup.open({text:'定位失败'});
                this.setLocation();
                if(this.flag.wait) {
                    window.clearTimeout(this.flag.wait);
                }
                break;
            }
        }
    },

    addStateToLog : function (state) {
        if(state !== "success" && state !== "fail") {
            return;
        }

        var log = {
            code : STAT_CODE.STAT_THUMB_IMG_CLICK,
            state : state
        }
        this.thumbLink.data("log",JSON.stringify(log));
    },

    //主动发起定位请求
    startGeo: function(){
        this.setState('start');
        locator.startGeo(); 
    },

    waitForLoc : function (second) {
        var _this = this;
        if(_this.flag.wait) {
            window.clearTimeout(_this.flag.wait);
        }
        _this.flag.wait = window.setTimeout(function () {
            if(_this.state!='success'){
                _this.failCBK();
            }
        }, second * 1000);
    },

    //设置用户方向
    setUserHeading : function () {
        var userHeading = require('third:widget/thumbnail/userheading.js');
        if (userHeading.isSupport()) {
            this.centerMarker.addClass('navi-marker');
            var dom = $('.center-marker div').get(0);
            userHeading.start(dom);
        }
    },

    //设置当前位置
    setLocation: function(){
        var isExactPoi,
            address,
            point = locator.getCenterPoi();

        if(this._unEqualPoint(point)) {
            this.prevPoint = point;
            this._setThumbUrl();
        } else if(this.prevPoint != undefined) {
            this.hideLoading();
        } 

        this._setLocBarAddress();
        this._setGeoBtnStatus();
        this._setSearchBoxCity();
    },

    //显示loading
    showLoading : function () {
        util.showLoading(this.thumbWrap);
        this.locbarTxt.html('正在定位您的位置...');
    },

    //隐藏loading
    hideLoading : function () {
        util.hideLoading(this.thumbWrap);
    },

    _setLocBarAddress : function(address) {
        var addr = address || locator.getAddress();
        this.locbarTxt.html(addr);
    },

    _setSearchBoxCity : function (city) {
        var city = city || locator.getCity();
        $('.se-city-wd').html(city);
    },

    _setGeoBtnStatus : function() {
        if(locator.hasExactPoi()) {
            this.geoBtn.removeClass('geo-fail');
        } else {
            this.geoBtn.addClass('geo-fail');
        }
    },

    _setThumbUrl : function(imgUrl) {
        var _this = this,
            url = imgUrl || _this._getThumbUrl();

        if(locator.hasExactPoi()) {
            _this.centerMarker.show();
        } else {
            _this.centerMarker.hide();
        }
        _this.thumbImg.attr("src", url);
    },

    _appReSize : function  () {
        var _this = this;
        if(util.isAndroid()) {
            setTimeout(function() {
                THUMB_DATA['width'] = window.innerWidth - 22;
            },800)
        } else {
            THUMB_DATA['width'] =  window.innerWidth - 22;
        }
        _this._setThumbUrl();
    },

    _equalPoint : function (point) {
        return (
            this.prevPoint && 
            this.prevPoint.x == point.x && 
            this.prevPoint.y == point.y
        );
    },

    _unEqualPoint : function (point) {
        return (
            this.prevPoint == undefined ||
            point.x != this.prevPoint.x ||
            point.y != this.prevPoint.y
        );
    },

    _getThumbUrl: function(point) {

        //根据获取图的类型设置不同级别
        if(THUMB_DATA['type'] == 0) {
            if(locator.getCity() == "全国") {
                THUMB_DATA['level'] = 3;
            } else if(locator.hasExactPoi()) {
                THUMB_DATA['level'] = 16;
            } else {
                THUMB_DATA['level'] = 10;
            }
        } else {
            THUMB_DATA['level'] = 10;
        }

        //如果传入中心点为空，取当前定位中心点
        if(point == undefined) {
            point = locator.getCenterPoi();
        }

        var param = {
            'retype'    : 1,
            'src'       : 'webapp',
            'level'     : THUMB_DATA['level'],
            'center'    : point.x + " " + point.y,
            'height'    : 101,
            'width'     : THUMB_DATA['width'],
            'coordtype' : 'M',
            'pictype'   : THUMB_DATA['type']
        }

        return THUMB_DATA.host + JSON.stringify(param);
    }
}

});
;define('third:widget/waitforloc/waitforloc.js', function(require, exports, module){

var geolocation = require('common:widget/geolocation/geolocation.js'),
	broadcaster = require('common:widget/broadcaster/broadcaster.js'),
	url         = require('common:widget/url/url.js'),
	loc         = require('common:widget/geolocation/location.js');

module.exports = {
	config : {
        // 线路类检索类型映射
        lineQtMap : {
            "bt" : "bse"
        },
        // 检索类型配置
        qtMap : {
            "place" : "s|con|nb|bd",
            "transit" : "bt|bse",
            "drive" : "nav|nse",
            "walk" : "walk|wse"
        }
    },
	init: function(){
        this.initIpGeo();
		this.bindEvent();
		this.initGeo();
	},
    initIpGeo: function(){
        try{
            var storage = window.localStorage;
            //后端返回_DEFAULT_CITY, 将_DEFAULT_CITY缓存
            if(window._DEFAULT_CITY.index){
                storage.setItem('_DEFAULT_CITY', JSON.stringify(window._DEFAULT_CITY));
                cookie.set('DEFAULT_CITY', '1', {expires: 1000*60*5, domain: 'baidu.com', path: '/'})
            }else{      
                window._DEFAULT_CITY = JSON.parse(storage.getItem("_DEFAULT_CITY")) || {};
            }           
        }catch(e){}

        var location, content, geo, point, level;
        location = JSON.parse(_DEFAULT_CITY.index) || {};
        content  = location && location.content;
        geo      = content && content.geo;
        level    = content.level;
        point    = geo.split(';')[1].split('|')[0].split(',');

        if(content.code == 1){
            content.name = '全国';
        }
        //构造定位的数据
        locationData = {
            addr: {
                city: content.cname,
                cityCode: content.code
            },
            point: {
                x: point[0],
                y: point[1]
            },
            level: level,
            type : 'ip',
            isExactPoi: false,
            isGeoEnd: false
        };
        //初始化定位信息
        loc.setAddress(locationData);
    },

	bindEvent: function(){
		var me = this;
		broadcaster.subscribe('geolocation.success', function () {
            me.geoSuccess();
        });

       	broadcaster.subscribe('geolocation.fail', function () {
            me.geoFail();
        }); 
	},
	initGeo: function(){
		var me = this;
		geolocation.init();
		//定位等待8秒，若仍没有定位成功，则执行定位失败回调
		setTimeout(function(){
			me.geoFail()
		}, 8*1000);
	},
	geoSuccess: function(){
		var options = url.get();
		this._initMixLocOptionsPage(options);
	},
	geoFail: function(){
		var options = url.get();
		this.locErrorCallback(options);
	},
	/**
    * 渲染包含定位信息的place页面
    */
    _initMixLocOptionsPage: function(options){
        var me = this;
        var needloc = options.pageState && options.pageState.needloc;
        var query = options.query;

        //若needloc=1，则渲染place页，否则渲染公交/驾车等
        //目前不能在非place中添加needloc参数， 如果需要添加，需要修改这个逻辑
        if(needloc && needloc === '1'){
            me._initPlacePage(options);
        }else{
            me._initTransitPage(options);
        }
    },
    /**
    * 渲染包含定位信息的 公交/驾车/步行 页面
    */
    _initTransitPage: function(options){
        var me = this,
        	MY_GEO = '我的位置',
        	query = options.query || {},
        	sn = query.sn || '',
        	en = query.en || ''
        	geoQuery = query,
        	key = 'sn',
        	snArr = ""+sn.split('$$')[3],
        	enArr = ""+en.split('$$')[3],
        	q = '1$$$$' + loc.getPointX() +','+ loc.getPointY() + '$$我的位置$$',
        	wd = geoQuery.wd ? geoQuery.wd : (snArr != MY_GEO ? snArr : enArr);

        //判断起点或者终点是否包含我的位置，优先判断起点，设置位置
        if(snArr === MY_GEO || enArr === MY_GEO){
            if(enArr === MY_GEO){
                key = 'en';
            }
        }else{
            //判断起点或终点是否包含空字符串，优先判断起点，设置位置
            if($.trim(snArr) === ''){
                key = 'sn';
            }else{
                key = 'en';
            }
        }

        geoQuery[key] = q;

        // 补全bse请求
        geoQuery = $.extend(geoQuery,{
            "ptx" : loc.getPointX(),
            "pty" : loc.getPointY(),
            "bsetp" : 1,
            "ec" : loc.getCityCode(),
            "sc" : loc.getCityCode(),
            "isSingle" : "true",
            "name" : MY_GEO,
            "wd" : wd,
        });

        geoQuery["qt"] = this.config.lineQtMap[geoQuery.qt] || geoQuery.qt;

        url.update({
            module : "search",
            action : "search",
            query : geoQuery,
            pageState: {
                    "has_handle_geo" : 1,
                    "needloc" : ''
                }
            },{
                trigger: true,
                replace: true
        });
    },
    getSearchTypeConfig : function(){
        var qtMap = this.config.qtMap;
        var _config = {};
        $.each(qtMap,function(key,item){
            _qt = item.split("|");

            $.each(_qt,function(index,value){
                _config[value] = key;
            });
        });
        return _config;
    },
    /**
    * 渲染获取定位信息后的place页
    */
    _initPlacePage: function(options){
        var me = this;

        var query = {
            'center_rank': 1,
            'nb_x': loc.getPointX(),
            'nb_y': loc.getPointY(),
            'c' : loc.getCityCode()
        }
        //获取增加定位信息后的参数
        var mixOptions = me._getOptions(options, query);

        //更改hash
        url.update({
            module : "search",
            action : "search",
            query:{
                center_rank: query.center_rank,
                nb_x : query.nb_x,
                nb_y : query.nb_y,
                c    : query.c 
            },
            pageState : {
                "center_name" : '我的位置',
                "has_handle_geo" : 1,
                "needloc" : ''
            }
            },{
                replace : true
            }
        )

        //me._initPage(mixOptions);       
    },
    /**
    * 设置参数
    * @param {object} options 页面的query等参数 
    * @param {object} query 需要重新设置的参数
    */
    _getOptions: function(options, query){
        for(var key in query){
            options['query'][key] = query[key]
        }
        return options;
    },
    /**
    * 初始化页面
    */
    _initPage: function(options){
        this._searchData();
    },
    /**
 	* 定位失败以后的处理方法
 	* 需要区别place和线路类检索
 	*/
    locErrorCallback : function(options){
        var qt = this.getSearchType(options);
        switch(qt){
            case "place" : 
                this._initPage(options);
                break;
            case "walk" : 
            case "transit" : 
            case "drive" :
                this.setSearchBoxValue(options);
            default : 
                this._switchToIndex(options);
        }
    },
    /**
    * 获取检索的类型
    * @return {String} place : 地点类检索  bus : 公交类检索  nav : 驾车类检索
    */
    getSearchType : function(options){
        if(!options){
            return;
        }
        var query = options.query || {};
        var qt = query.qt;
        var searchTypeConfig = this.searchTypeConfig || this.getSearchTypeConfig();
        this.searchTypeConfig = searchTypeConfig;

        return searchTypeConfig[qt];

    },
    /**
     * 设置检索结果到搜索框上
     */
    setSearchBoxValue : function(options){
        var destination = this._getStartAndEndWord(options) || {};
        var switchValue = {};
        var MY_GEO = '我的位置';
        if(destination.start && destination.start != MY_GEO){
            this.start = 'word='+ encodeURIComponent(destination.start);
        }
        if(destination.end && destination.end != MY_GEO){
            this.end = 'word='+ encodeURIComponent(destination.end);
        }
    },
    _getUrl : function(){
        var urlInfo = url.get().query || {};

        // 落地页特殊处理
        if(this.isLanding){
            //获取第三方来源名字
            third_party = location.href.match(/[\?\&]third_party=([^&^#]+)/);

            if(third_party){
                //设置检索标记
                urlInfo.searchFlag = third_party[1] || "";
                
                // 百度框推送添加push参数
                if(third_party[1] === "baidukuangpush"){
                    urlInfo.tg = "push";
                }
            }
        }

        // 如果没有添加称城市code,则取当前城市code码
        if(!urlInfo.c) {
            urlInfo.c = loc.getCityCode();
        }

        if(['nav','nse','walk','wse'].indexOf(urlInfo.qt) >=0) {
            urlInfo.version = '3'; //兼容旧的驾车协议 by jican
        }

        // 如果只有wd1,wd2, 没有sn,en参数，需要添加驾车线路的关键词
        if(urlInfo.qt == 'nav' || urlInfo.qt == "bt") {
            if(urlInfo.wd1 && !urlInfo.sn){
                urlInfo.sn = '2$$$$$$' + urlInfo.wd1 +'$$'
            }
            if(urlInfo.wd2 && !urlInfo.en){
                urlInfo.en = '2$$$$$$' + urlInfo.wd2 +'$$'
            }
        }

        return urlInfo;
    },
    _searchData : function(){
        var query = this._getUrl();

        // 更新url参数
        url.update({
            module : "search",
            action : "search",
            query : query,
            pageState:{
                'needloc': ''
            }
        }, {
            replace : true,
            queryReplace : true
        });
    },
    _switchToIndex: function(options){
        var searchType = this.getSearchType(options);
        var state = options.pagestate || {};
        var query = options.query || {};
        var tab = "";
        state.tab = searchType;

        if(state.tab === "walk" || state.tab === "drive" || state.tab === "transit") {
            tab = 'line';
        }

        //切换到首页，同时切换对应的tab  
        url.update({
            module: 'index',
            action: 'index',
            query : query,
            pageState: {
                start: this.start || '',
                end  : this.end   || '',
                tab  : tab
            }
        },{
            trigger : true,
            replace : true,
            queryReplace : true,
            pageStateReplace : true
        })  
    },
    _getStartAndEndWord : function(options){
        if(!options || !options.query) {
            return;
        }
        var query = options.query;

        var sn = query.sn || '';
        var en = query.en || '';
        var snArr = sn.split('$$')[3] || query.name;
        var enArr = en.split('$$')[3] || query.wd;

        return {
            start : snArr,
            end : enArr,
        }
    }
}

});