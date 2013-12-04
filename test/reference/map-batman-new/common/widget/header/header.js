/**
 * @fileOverview 头部导航逻辑
 */


var stat = require('common:widget/stat/stat.js'),
    util = require("common:static/js/util.js"),
    appresize   = require('common:widget/appresize/appresize.js');

var $appbutton = $("#header_install_button");
var os = util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown";
/**
 * 绑定用户点击事件
 * @return {void}
 */
var bind = function() {
    _initDownload();
    bindSwipeUpEvent();
};

var _initDownload = function() {
    var me = this;
    util.isInstalledClient(function(openurl) {
        $appbutton.attr('data', openurl).text("打开客户端");
        util.bindHrefStat($appbutton, function(){
            stat.addStat(COM_STAT_CODE.HEADER_APP_OPEN, {os: me.os});
        });
    }, function(downloadurl) {
        $appbutton.attr('data', downloadurl).text("下载客户端");
        util.bindHrefStat($appbutton, function(){
            stat.addStat(COM_STAT_CODE.HEADER_APP_DOWNLOAD, {os: me.os});
        });
    });
};



var bindSwipeUpEvent = function() {
    var startScreenY = 0,
        endScreenY = 0,
        touchstartCallback = function() {},
        touchmoveCallback = function() {};

    var $searchBox = $('.index-widget-searchbox, .index-widget-tabgroup');
    var $header = $(".common-widget-header");
    var _startPos = {};
    var _movePos = {};
    var _getEvPos = function(ev) {
        var pos = [],
            src = null,
            touches = ev.touches,
            len;

        // 兼容处理touches不存在的情况
        if (touches && (len = touches.length)) {
            for (var t = 0; t < len; t++) {
                src = touches[t];
                pos.push({
                    x: src.pageX,
                    y: src.pageY
                });
            }
        }
        return pos;
    };
    var touchstartHandler = function(ev) {
        _startPos = _getEvPos(ev);
        $searchBox.on("touchmove", touchmove);
    }

     var touchmove = function(ev) {
        _movePos = _getEvPos(ev);
        try {
            var distance = Math.abs(_startPos[0].y - _movePos[0].y);
        } catch (e) {
            distance = 0;
        }

        if (distance > 5) {
            $searchBox.off("touchmove", touchmove);
            if (_startPos[0].y < _movePos[0].y) {
                $header.show();
            } else {
                $header.hide();
            }
            // TODO 
            listener.trigger('common','sizechange');
        }
    }

    $searchBox.on("touchstart", touchstartHandler);
};


/**
 * 初始化
 * @return {void}
 */
module.exports.init = function() {
    bind();
}