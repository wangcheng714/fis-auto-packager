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