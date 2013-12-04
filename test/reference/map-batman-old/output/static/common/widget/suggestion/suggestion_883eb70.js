define('common:widget/suggestion/suggestion.js', function(require, exports, module){

require("common:static/js/widget.js");

var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js');

/**
 * @file 搜索建议组件
 * @name Suggestion
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议组件
 * @import core/touch.js, core/zepto.ui.js, core/zepto.highlight.js
 * Modified By Xuanwei, Sheng @ 2013-06-04
 */

/**
 * @name suggestion
 * @desc   搜索建议组件
 * @grammar     suggestion() => self
 * @grammar     $.ui.suggestion([el [,options]]) => self
 * @desc
 * **Options**
 * - ''container''        {Selector}:                  (必选)父元素
 * - ''source''           {String}:                    (必选)请求数据的url
 * - ''param''            {String}:                    (可选)url附加参数
 * - ''formID''           {String}:                    (可选)提交搜索的表单，默认为包含input框的第一个父级form
 * - ''posAdapt''         {Boolean,默认:false}:         (可选)是否自动调整位置
 * - ''listCount''        {Number, 默认: 5}:            (可选)展现sug的条数: 5
 * - ''isCache''          {Boolean, 默认: true}:        (可选)是否缓存query: true
 * - ''isStorage''        {Boolean, 默认: true}:        (可选)是否本地存储pick项: true
 * - ''isSharing''        {Boolean, 默认: true}:        (可选)是否共享历史记录: true
 * - ''shareName''        {String}:                    (可选)共享缓存key
 * - ''autoClose''        {Boolean}:                   (可选)点击input之外自动关闭
 * - ''usePlus''          {Boolean}:                   (可选)是否启用+号
 * - ''status''           {Boolean}:                   (可选)是否开启事件，可在close时设为false，则下次sug不再弹出
 * - ''height''           {Number}:                    (可选)设置高度
 * - ''width''            {Number}:                    (可选)设置宽度
 * - ''minChars''         {Number}:                    (可选, 默认: 0)最小输入字符: 0
 * - ''maxChars''         {Number}:                    (可选, 默认: 1000)最大输入字符: 1000
 * - ''offset''           {Object}:                    (可选, 默认: {x:0, y:0})偏移量{x:0, y:0}
 * - ''renderList''       {Function}:                  (可选)自定义渲染下拉列表
 * - ''renderEvent''      {Function}:                  (可选)绑定用户事件
 * - ''sendRequest''      {Function}:                  (可选)用户自定义请求方式
 * - ''select''         {Function}:                    (可选)选中一条sug触发
 * - ''submit''         {Function}:                    (可选)提交时触发
 * - ''open''          {Function}:                    (可选)sug框展开时触发
 * - ''close''         {Function}:                     (可选)sug框关闭时触发
 */
$.ui.create('suggestion', {
    _data: {
        listCount: 50,
        isCache: true,
        isStorage: true,
        minChars: 0,
        maxChars: 1000,
        offset: {x: 0, y: 0, w: 0},
        confirmClearHistory: true
    },

    /**
     * 自定义设定maskElem，默认$input.parent();
     * @private
     */
    _create: function() {
        var me = this,
            expando = +new Date(),
            maskID = 'ui-input-mask-' + expando,
            sugID = me.data('id', "ui-suggestion-" + $.guid()),
            $input = me.widget($(me.data('container'))).attr("autocomplete", "off"),
            formID = me.data('formID'),
            $maskElem = me.data('mask') ? $(me.data('mask')) : $input.parent();
            // map = app.commonView.getViewObject('map').getMap();

        if ($input.length === 0) return;

        me.data({
            inputWidth: $input.get(0).offsetWidth,
            cacheData: {},
            form: formID ? $(formID) : $input.closest('form')
        });
        // if ($maskElem.attr('class') != 'ui-input-mask') {
        //     $maskElem = $('<div id="' + maskID + '" class="ui-input-mask"></div>').appendTo($maskElem);
        // }
        me.data('maskElem', $maskElem);
        me.data('wrapper', $('<div id="' + sugID + '" class="ui-suggestion"><div class="ui-suggestion-content"><div class="ui-suggestion-scroller"></div></div><div class="ui-suggestion-button"></div></div>').appendTo($maskElem));
        me._initSuggestionOffset();
    },

    _init: function() {
        var me = this,
            $input = me.widget(),
            form = me.data('form'),
            eventHandler = $.proxy(me._eventHandler, me);

        if ($input.length === 0) return;

        me.data('wrapper').on('touchstart', eventHandler);
        form.length && form.on('submit', eventHandler);
        $input.on('focus input', eventHandler).parent().on('touchstart', eventHandler);
        $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', eventHandler);
        me.data('autoClose') && $(document).on('tap', eventHandler);
        me.on('destroy', function() {
            var me = this,
                $elem = me.data('wrapper');
            clearInterval(me.timeId);
            // 自定义DOM销毁方式
            $elem.find('*').off();
            $elem.off().remove();
            form.length && form.off('submit', eventHandler);
            $input.off('focus input', eventHandler).parent().off('touchstart', eventHandler);
            me.data('autoClose') && $(document).off('tap', eventHandler);
            $(window).off('onorientationchange' in window ? 'orientationchange' : 'resize', eventHandler);
            eventHandler = $.fn.emptyFn;
        })._setSize();
    },

    _setup: function(){
        var me = this;
        me.data('container', me.widget()); // add container
        me._create();
    },

    /** 
     * 初始化属性
     * top样式属性里移除$input.height()
     * @private
     */
    _initSuggestionOffset: function() {
        var me = this, width,
            $elem = me.data('wrapper'),
            $input = me.widget(),
            customOffset = me.data('offset'),
            border = 2 * parseInt($elem.css('border-left-width') || 0);
        me.data('pos', (customOffset.y || 0));
        me.data('realWidth', (me.data('width') || $input.width()) - border);
        $elem.css({
            position: 'absolute',
            left: customOffset.x || 0,
            top: customOffset.y || 0
        });
        return me;
    },

    /** 
     * 设置size
     * 父元素查找将parent() ->　parents(".se-wrap")
     * @private
     */
    _setSize: function() {
        var me = this,
            width = me.data('realWidth'),
            additionWidth = me.widget().parents(".se-wrap").width() - me.data('inputWidth') - 1;
        // me.data('wrapper').css('width', width + additionWidth);
        me.data('wrapper').css('width', "100%");
        return me;
    },

    /**
     * 适配位置
     * @private
     */
    _posAdapt: function(dps) {
        var me = this;
        if (dps) {
            me._setPos();
            if (me.timeId) clearInterval(me.timeId);
            me.timeId = $.later(function() {
                me._setPos();
            }, 200, true);
        } else {
            clearInterval(me.timeId);
        }
        return me;
    },

    /**
     * 设置位置
     * top样式属性里移除parseFloat($elem.height())
     * @private
     */
    _setPos: function() {
        var me = this,
            win = window,
            $elem = me.data('wrapper'),
            $input = me.widget(),
            height = parseFloat($elem.height()),
            customOffset = me.data('offset'),
            pos =  parseFloat(me.data('pos')),
            uVal = $input.offset().top - win.pageYOffset,
            dVal = $(win).height() - uVal;

        if (me.data('posAdapt') && uVal > dVal) {
            $elem.css('top', (customOffset.y || 0) + 'px');
        } else {
            $elem.css('top', pos);
        }
        return me;
    },

    /** 
     * input输入处理
     * @private
     */
    _change: function(query) {
        var me = this,
            data = me._cacheData(query),
            isCache = me.data('isCache'),
            source = me.data('source');
        return data && isCache ? me._render(query, data) : me._sendRequest(query);
    },

    /** 
     * 事件管理器
     * @private
     */
    _eventHandler: function(e) {
        var me = this,
            type = e.type,
            target = e.target,
            maskElem = me.data('maskElem').get(0);

        if (!me.data('status')) return;
        switch (type) {
            case 'focus':
                me.trigger('focus')._setSize()._showList()._setPos().trigger('open');
                break;
            case 'touchstart':
            case 'mousedown':
                if (!e.formDelete) break;
                e.preventDefault();
            case 'input':
                me._showList();
                break;
            case 'resize':
            case 'orientationchange':
                try {
                    if (me && typeof i._setSize == "function") {
                        $.later(function() {
                            me._setSize()._setPos();
                        }, 2000);
                    }
                } catch (ex) {}
                break;
            case 'submit': // form提交时能存储历史记录
                me.data('isStorage') && me._localStorage(me.getValue());
            case 'click':
            case 'tap':
                if (!(maskElem.compareDocumentPosition(target) & 16)) me.hide();
                break;
        }
    },

    /** 
     * 显示下拉浮层
     * @private
     */
    _showList: function() {
        var me = this,
            query = me.getValue(),
            data = me._localStorage();

        if (query !== '' && (query.length < parseFloat(me.data('minChars')) || query.length > parseFloat(me.data('maxChars')))) {
            return me;
        }

        return query ? me._change(query) : data ? me._render(null, {s: data.split(encodeURIComponent(','))}) : me.hide();
    },

    /** 
     * 绑定下拉浮层中的事件
     * @private
     */
    _bindSuggestionListEvent: function() {
        var me = this,
            $input =  me.widget();
        me.data('wrapper').find(".ui-suggestion-result").on('click', function(e) {
            var elem = e.target, that = this;
            this.style.backgroundColor = 'transparent';
            me._select(that);
            setTimeout(function(){
                if (elem && elem.className == 'ui-suggestion-plus') {
                    $input.val(elem.getAttribute('data-item')).trigger('input');
                } else {
                    me._submit();
                }
            }, 400);
        });
        me.data('wrapper').find(".ui-suggestion-result").each(function(index, item) {
            $(item).on("touchstart", function(e) {
                this.style.backgroundColor = '#eef3fe';
                // e.stopPropagation();
            });
            $(item).on("touchend", function(e) {
                this.style.backgroundColor = 'transparent';
                // e.stopPropagation();
            });
        });
        // }).highlight('ui-suggestion-result-highlight');
        return me;
    },

    /** 
     * 绑定关闭按钮事件
     * button选择器增加.ui-suggestion-button约束
     * @private
     */
    _bindCloseEvent: function() {
        var me = this,
            $wrapper = me.data('wrapper');

        $wrapper.find('.ui-suggestion-button span:first-child').on('click', function() {
            stat.addStat(COM_STAT_CODE.SUG_CLEAR_HISTORY_BTN); // 清空历史记录点击统计 by jican
            $.later(function(){
                me.clearHistory();
            }, $.os.android?200:0);
        });

        $wrapper.find('.ui-suggestion-button span:last-child').on('click', function() {
            stat.addStat(COM_STAT_CODE.SUG_HISTORY_SHUTUP); // 关闭点击统计 by jican
            me.hide().leaveInput().trigger('close');
        });
        return me;
    },

    /** 
     * 发送异步请求
     * @private
     */
    _sendRequest: function(query) {
        var me = this,
            url = me.data('source'),
            param = me.data('param'),
            cb = "suggestion_" + (+new Date()),
            sendRequest = me.data('sendRequest');

        var cityCode = locator.getCityCode() || 1,
            type = 0, // 0: normal | 2: route
            // bound = me.map.getBounds(),
            bound = {},
            boundParams = '';

        // if (bound.minX == bound.maxX && bound.minY == bound.maxY) {
            if (locator.hasExactPoi()) {
                bound.minX = locator.getPointX() - 5000;
                bound.minY = locator.getPointY() - 5000;
                bound.maxX = locator.getPointX() + 5000;
                bound.maxY = locator.getPointY() + 5000;
                boundParams = "&b=("+ bound.minX +","+ bound.minY +";"+ bound.maxX +","+ bound.maxY +")";
            }
        // } else {
            // boundParams = "&b=("+ bound.minX +","+ bound.minY +";"+ bound.maxX +","+ bound.maxY +")";
        // }

        if ($.isFunction(sendRequest)) {
            sendRequest(query, function(data) {
                me._render && me._render(query, data)._cacheData(query, data);
            });
        } else if (query) {
            url += (url.indexOf("?") === -1 ? "?" : "") + "&wd=" + encodeURIComponent(query);
            if (url.indexOf("&callback=") === -1) url += "&callback=" + cb;
            if (url.indexOf("&cid=") === -1) url += "&cid=" + cityCode;
            url += boundParams;

            if (param) url += '&' + param;
            window[cb] = function(data) {
                me._render && me._render(query, data)._cacheData(query, data);
                $('[src="' + url + '"]').remove();
                delete window[cb];
            };
            $.ajax({
                url: url,
                dataType: 'jsonp',
                callback: 'cb'
            });
        }
        return me;
    },

    /**
     * @desc 获取input值
     * @name getValue
     * @grammar getValue() => string
     * @example $('#input').suggestion('getValue');
     */
    getValue: function() {
        return $.trim(this.widget().val());
    },

    /** 
     * 渲染下拉浮层
     * @private
     */
    _render: function(query, data) {
        var me = this, html,
            $elem = me.data('wrapper'),
            $content = $elem.find('.ui-suggestion-content'),
            $button = $elem.find('.ui-suggestion-button'),
            renderList = me.data('renderList'),
            renderEvent = me.data('renderEvent'),
            clearBox = '<span style="display:none;"></span><span>关闭</span>';

        query === null && (clearBox = '<span>清除历史记录</span><span>关闭</span>');
        html = renderList ? renderList.apply(me, [query, data]) : me._renderList(query, data);

        if (html) {
            $content.find('*').off(); // unbind all events in sug list
            $content.find('.ui-suggestion-scroller').html(html);
            $button.find('*').off();
            $button.html(clearBox);
            renderEvent ? renderEvent.apply(me) : me._bindSuggestionListEvent();
            me._bindCloseEvent()._show();
            $content.on('touchstart', function(e){e.preventDefault()});
        } else me.hide();
        
        return me;
    },      

    /** 
     * 渲染list HTML片段
     * @private
     */
    _renderList: function(query, data) {
        var me = this,
            listCount = me.data('listCount'),
            usePlus = me.data('usePlus'),
            items = [], html = "",
            sugs = data.s;

        if (!data || !sugs || !sugs.length) {
            this.hide();
            return;
        }
        sugs = sugs.slice(0, listCount);

        if (query == null) {
            items = sugs;
            // 如果query是null则表明是历史纪录，这里要对
            // 用户输入的内容进行过滤
            $.each(sugs, function(index, item){
                items[index] = util.encodeHTML(item);
            });
        } else {
            $.each(sugs, function(index, item) {
                $.trim(item);
                item = item.split('$');
                if (item.length == 6) {
                    items.push((item[3] ? '<span>' + item[3].replace(query, '<font>' + query + '</font>') + '</span>' : '') + '<span>' + item[0] + item[1] + '</span>');
                }
            });
        }

        return me._buildHTML(items);
        // query = this._htmlEncode(query) || null;    //FEBASE-736 修改query为空时,replace替换错误的bug
        // $.each(sugs, function(index, item) {
        //     item = me._htmlEncode(item);
        //     var str = $.trim(item).replace(query, '<span>' + query + '</span>');
        //     if (usePlus) str += '<div class="ui-suggestion-plus" data-item="' + item + '"></div>';
        //     html += '<li><div class="ui-suggestion-result">' + str + '</div></li>';
        // });
        // return html + '</ul>';
    },

    /** 
     * 创建Suggestion list HTML内容
     * @private
     */
    _buildHTML: function(list) {
        var html = "";
        if (!this.data('isSharing')) {
            if (list[0] === window['MY_GEO']) {
                if (list.length === 0) {
                    return '<ul><li><div class="ui-suggestion-result" style="color:#4C78CE;">' + '我的位置' + '</div></li></ul>';
                } else {
                    html = list.join('</div></li><li><div class="ui-suggestion-result">');
                    return '<ul><li><div class="ui-suggestion-result" style="color:#4C78CE;">' + '我的位置' + '</div></li><li><div class="ui-suggestion-result">' + html + '</div></li></ul>';
                }
            }
        }
        html = list.join('</div></li><li><div class="ui-suggestion-result">');
        return '<ul><li><div class="ui-suggestion-result">' + html + '</div></li></ul>';
    },

    _htmlEncode: function(str){
        return $('<div></div>').text(str).html();
    },

    /** 
     * 提交搜索提示
     * @private
     */
    _submit: function() {
        var me = this,
            keyValue = me.widget().val();
        me.trigger("submit");
        // if(!me.data('submit') && !(me._callbacks && me._callbacks.submit))
        //     window.location = 'http://www.baidu.com/s?wd=' + encodeURIComponent(keyValue);
        return me;
    },
        

    /** 
     * 选择搜索提示
     * 保存firstChild内容
     * @private
     */
    _select: function(target) {
        var me = this,
            targetContent = target.firstChild.textContent;

        // 在往输入框写入查询字段前判断是从历史记录发起的检索还是在线sug发起的，统计用
        if(me.getValue() === "") {
            // 历史记录点击统计
            stat.addStat(COM_STAT_CODE.SUG_HISTORY_SEARCH, {
                "from": me.widget().attr('id')
            });
            stat.addCookieStat(COM_STAT_CODE.SUG_HISTORY_SEARCH, {
                "from": me.widget().attr('id')
            });
        } else {
            // 在线SUGG点击统计
            stat.addStat(COM_STAT_CODE.SUG_ONLINE_SEARCH, {
                "from": me.widget().attr('id')
            });
            stat.addCookieStat(COM_STAT_CODE.SUG_ONLINE_SEARCH, {
                "from": me.widget().attr('id')
            });
        }

        me.widget().val(targetContent);
        me.data('isStorage') && me._localStorage(targetContent);
        return me.trigger("select", target).hide();
    },      

    /** 
     * 缓存搜索提示
     * @private
     */
    _cacheData: function(key, value) {
        var me = this;
        if (me.data('isCache')) {
            return value !== undefined ? me.data('cacheData')[key] = value : me.data('cacheData')[key];
        }
    },  

    /** 
     * 操作历史记录
     * @private
     */
    _localStorage: function(value) {
        var me = this,
            ret,
            localdata,
            data,
            shareName = me.data('shareName'),
            index,
            id = me.data('isSharing') ? shareName ? shareName + '-SUG-Sharing-History' : 'SUG-Sharing-History' : me.data('id');

        try{
            if (value === null) window.localStorage[id] = "";
            else if (value !== undefined) {
                localdata = window.localStorage[id];
                data = localdata ? localdata.split(encodeURIComponent(',')) : [];

                if (!!~$.inArray(value, data)) {
                    index = data.indexOf(value);
                    data.splice(index, 1);
                }
                data.unshift(value);
                window.localStorage[id] = data.join(encodeURIComponent(','));
            }
            ret = window.localStorage[id];
        } catch(e){}
        return ret;
    },

    /** 
     * 显示suggestion
     * @private
     */
    _show: function() {
        var me = this;
        if (me.data('wrapper') && me.data('wrapper').css("display") !=  "block") {
            stat.addStat(COM_STAT_CODE.SUG_ONLINE_SHOW); // suggestion展现量统计 by jican
        }
        me.data('wrapper') && me.data('wrapper').css("display", "block");
        me.data('posAdapt') && me._posAdapt(me.data('posAdapt'));
        return me.trigger('show');
    },  

    /**
     * @desc 隐藏suggestion
     * @name hide
     * @grammar hide() => self
     */
    hide: function() {
        var me = this;
        me.data('wrapper') && me.data('wrapper').css("display", "none");
        return me._posAdapt(0).trigger('hide');
    },

    /**
     * @desc 清除历史记录
     * @name clearHistory
     * @grammar clearHistory() => undefined
     */
    clearHistory: function() {
        var me = this, _clear = function(){
            me._localStorage(null);
            me.hide();
            // iPad清空内容之后需要刷新iScroll，否则引起页面元素渲染空白 @shengxuanwei
            if (util.isIPad()) {
                app.myScroll && app.myScroll.refresh();
            }
        };
        me.data('confirmClearHistory') ? window.confirm('是否清除全部历史记录？') && _clear() : _clear();
    },

    /**
     * @desc 设置|获取历史记录
     * @name history
     * @grammar history() => string
     * @param {String} query 搜索条件
     */
    history: function(query) {
        return this._localStorage(query);
    },

    /**
     * @desc input获得焦点
     * @name focusInput
     * @grammar focusInput() => self
     */
    focusInput: function() {
        this.widget().get(0).focus();
        return this;
    },

    /**
     * @desc input失去焦点
     * @name leaveInput
     * @grammar leaveInput() => self
     */
    leaveInput: function() {
        this.widget().get(0).blur();
        return this;
    }
});

});