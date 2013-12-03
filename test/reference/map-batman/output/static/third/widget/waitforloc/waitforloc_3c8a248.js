define('third:widget/waitforloc/waitforloc.js', function(require, exports, module){

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