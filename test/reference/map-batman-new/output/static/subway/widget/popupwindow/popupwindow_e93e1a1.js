define('subway:widget/popupwindow/popupwindow.js', function(require, exports, module){

var url = require("common:widget/url/url.js"),
    util = require('common:static/js/util.js'),
    Coords = require('subway:static/js/base/coords.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = $.extend({}, {

    offset: {
        left: 1,
        top: -5
    },

    init: function (data) {
        this.data = data;

        var tpl = this.tpl = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div id="sw_pw">    ');if(data.notification){_template_fun_array.push('        <div class="sw-pw-notification">这是离您最近的地铁站</div>    ');}else{_template_fun_array.push('        <ul class="sw-pw-title">            <li class="sw-pw-tl"></li>            <li class="sw-pw-tc">',typeof(data.station.lb)==='undefined'?'':data.station.lb,'</li>            <li class="sw-pw-tr"></li>        </ul>        <div class="sw-pw-content">            ');for(var i=0; i<data.lines.length; i++){_template_fun_array.push('                <div class="sw-pw-line">                    <div class="sw-pw-line-title" style="border-color:',typeof(data.lines[i].color)==='undefined'?'':data.lines[i].color,'">                        <span class="line_title_content" style="background-color:',typeof(data.lines[i].color)==='undefined'?'':data.lines[i].color,'">',typeof(data.lines[i].name)==='undefined'?'':data.lines[i].name,'</span>                    </div>                    ');for(var j=0; j<data.lines[i].dirs.length; j++){_template_fun_array.push('                        ');if(data.lines[i].dirs[j].startTime && data.lines[i].dirs[j].endTime) {_template_fun_array.push('                        <ul class="sw-pw-line-list">                            <li class="sw-pw-line-dir">                                <span class="sw-pw-line-dir-name">',typeof(data.lines[i].dirs[j].name)==='undefined'?'':data.lines[i].dirs[j].name,'</span><span class="sw-pw-text-gray">方向</span>                            </li>                            <li class="sw-pw-line-time">                                <span class="sw-pw-text-gray-bkg">始</span><span class="sw-pw-text-inline-block">',typeof(data.lines[i].dirs[j].startTime || '00:00')==='undefined'?'':data.lines[i].dirs[j].startTime || '00:00','</span><span class="sw-pw-text-gray-bkg">末</span><span class="sw-pw-text-inline-block">',typeof(data.lines[i].dirs[j].endTime || '00:00')==='undefined'?'':data.lines[i].dirs[j].endTime || '00:00','</span>                            </li>                        </ul>                        ');}_template_fun_array.push('                    ');}_template_fun_array.push('                </div>            ');}_template_fun_array.push('        </div>    ');}_template_fun_array.push('</div>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
        var $el = this.$el = $(tpl({
            'data': data
        }));
        $('#sw_renderer').append($el);
        this.bind();
    },

    bind: function () {
        var self = this;

        var tlCt = $('.sw-pw-tl');
        tlCt.on("touchstart", function (evt) {
            tlCt.start = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };

            evt.target.handled = true; // 保证图区的tap事件不触发 
        });
        tlCt.on("click", function (evt) {
            if (tlCt.start) {
                var x = evt.pageX - tlCt.start.x,
                    y = evt.pageY - tlCt.start.y;
                var distance = (x * x) + (y * y);
                if (distance > 100) {
                    tlCt.start = null;
                    return;
                }
            }
            tlCt.start = null;

            self.nbSearch();
        });

        var trCt = $(".sw-pw-tr");
        trCt.on("touchstart", function (evt) {
            trCt.start = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };

            evt.target.handled = true; // 保证图区的tap事件不触发 
        });
        trCt.on("click", function (evt) {
            if (trCt.start) {
                var x = evt.pageX - trCt.start.x,
                    y = evt.pageY - trCt.start.y;
                var distance = (x * x) + (y * y);
                if (distance > 100) {
                    trCt.start = null;
                    return;
                }
            }
            trCt.start = null;

            self.lineSearch();
        });

        var contentCt = $(".sw-pw-tc, .sw-pw-content");
        contentCt.on("touchstart", function (evt) {
            contentCt.start = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            };

            evt.target.handled = true; // 保证图区的tap事件不触发 
        });
        contentCt.on('click', function (evt) {
            if (contentCt.start) {
                var x = evt.pageX - contentCt.start.x,
                    y = evt.pageY - contentCt.start.y;
                var distance = (x * x) + (y * y);
                if (distance > 100) {
                    contentCt.start = null;
                    return;
                }
            }
            contentCt.start = null;

            self.poiSearch();
        });
    },

    destroy: function () {
        $(".sw-pw-tl, .sw-pw-tr, .sw-pw-tc, .sw-pw-content").off();
        this.$el.remove();
    },

    show: function (offset, callback) {
        var $el = this.$el;

        $el.css({
            'visibility': 'hidden'
        }).show();

        var width = this.width = parseFloat($el.width());
        var height = this.height = parseFloat($el.height());

        $el.css({
            "left": offset.x - width / 2 + this.offset.left,
            "top": offset.y - height / 2 + this.offset.top,
            'visibility': ''
        });

        callback && callback(width / 2, height / 2);
    },

    hide: function () {
        this.$el.hide();
    },

    move: function (offset_x, offset_y) {
        var $el = this.$el;

        var left = parseFloat($el.css("left")),
            top = parseFloat($el.css("top"));
        $el.css({
            "left": left + offset_x,
            "top": top + offset_y
        });
    },

    setPosition: function (dest_x, dest_y) {
        var $el = this.$el;
        $el.css({
            "left": dest_x - this.width / 2 + this.offset.left,
            "top": dest_y - this.height + this.offset.top
        });
    },

    getPosition: function () {
        var $el = this.$el;
        return {
            left: parseFloat($el.css("left")),
            top: parseFloat($el.css("top"))
        };
    },

    getPoint: function () {
        return new Coords(this.data.x, this.data.y);
    },

    /**
     * 周边检索
     * @param {Point} poi 中心点
     */
    nbSearch: function () {
        // util.TxtBox.show('正在加载中...');

        // 周边搜索点击量
        stat.addCookieStat(STAT_CODE.SUBWAY_IW_NB_SEARCH);

        var data = this.data;
        var urlQuery = {
            nb_x: data.lng,
            nb_y: data.lat,
            center_name: data.station.lb || "",
            from: 'searchnearby'
        };

        url.update({
            module: 'index',
            action: 'searchnearby',
            query: {
                'foo': 'bar'
            },
            pageState: urlQuery
        }, {
            trigger: true,
            queryReplace: true,
            pageStateReplace: true
        });
    },

    /**
     * 发起线路检索
     */
    lineSearch: function () {
        // util.TxtBox.show('正在加载中...');

        // 线路检索点击量
        stat.addCookieStat(STAT_CODE.SUBWAY_IW_LINE_SEARCH);

        var data = this.data;
        var urlQuery = {
            word: data.station.lb || "", // url.js里不能解析word和point的错乱排序
            point: data.lng + ',' + data.lat
        };

        var pagestate = {};
        pagestate['end'] = util.jsonToQuery(urlQuery);

        url.update({
            module: 'place',
            action: 'linesearch',
            query: {
                'foo': 'bar'
            },
            pageState: pagestate
        }, {
            trigger: true,
            pageStateReplace: true,
            queryReplace: true
        });
    },

    /**
     * 去该点的详情页
     */
    poiSearch: function () {
        if (this.data.uid) {
            // util.TxtBox.show('正在加载中...');

            // 详情页点击量
            stat.addCookieStat(STAT_CODE.SUBWAY_IW_DETAIL_SEARCH);

            url.update({
                module: 'place',
                action: 'detail',
                query: {
                    'qt': 'inf',
                    'uid': this.data.uid
                }
            }, {
                trigger: true,
                pageStateReplace: true,
                queryReplace: true
            });
        }
    }

});

});