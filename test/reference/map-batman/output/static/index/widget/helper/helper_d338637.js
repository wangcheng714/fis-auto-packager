define('index:widget/helper/helper.js', function(require, exports, module){

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