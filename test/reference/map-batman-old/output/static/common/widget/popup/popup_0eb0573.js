define('common:widget/popup/popup.js', function(require, exports, module){

/**
 * @fileOverview 弹出浮层
 * @author liushuai02@baidu.com
 * @requires common:static/js/zepto
 */
var broadcaster = require('common:widget/broadcaster/broadcaster.js');
/**
 * @module common:widget/popup
 */
module.exports = {
    /**
     * 默认配置
     * @type {object}
     * @private
     */
    _defaultOptions: {
        autoCloseTime: 2000,
        isTouchHide :false
    },
    /**
     * popup根元素
     * @type {zepto}
     * @private
     */
    _$el: null,
    /**
     * 自动关闭计时器
     * @type {number}
     * @private
     */
    _autoCloseTimeout: null,
    /**
     * 创建一个popup
     * @param {object} options
     * @param {string} options.text popup文本
     * @returns {zepto}
     * @private
     */
    _create: function (options) {
        var $el, $layer, offset;

        if (options.layer) {
            $layer = $('<div/>').addClass('common-widget-popup-layer')
                .appendTo(document.body);
        }

        $el = $('<div></div>')
            .addClass('common-widget-popup')
            .text(options.text || '')
            .hide()
            .appendTo(document.body);

        this._layout($el);

        this._$el = $el;
        this._$layer = $layer;
    },
    /**
     * popup根元素布局
     * @private
     */
    _layout: function ($el) {
        var offset, visibility;

        // display: none的元素无法获得其占位宽高
        if($el.css('display') === 'none') {
            // 缓存元素之前的visibility属性
            visibility = $el.css('visibility');
            $el.css({
                visibility: 'visibile'
            }).show();
        }
        offset = $el.offset();
        $el.css({
            left: (innerWidth - offset.width) / 2,
            top: (innerHeight - offset.height) / 2,
            visibility: visibility
        });
    },
    /**
     * 打开弹出层，并在设定的autoCloseTime之后自动关闭并销毁所创建的DOM元素
     * @param {object|string} options 如果类型为String，则直接作为文本附加到popup上，否则取options.text
     * @param {string} options.text popup文本
     * @param {number} [options.autoCloseTime=2000] 自动关闭时间，非真值(如0，false，null...)时不自动关闭
     * @param {function} [options.onClose] 关闭时的回调函数，context为exports
     * @param {boolean} options.isTouchHide 触碰关闭     
     * @param {string} [options.layer=false] 是否需要背景层，默认为false
     */
    open: function (options) {
        var callback, self = this;

        options = this._options = $.extend({}, this._defaultOptions,
            typeof(options) === 'string' ? {text: options} : options);

        if (!this._$el) {
            this._create(options);
        } else {
            this._$el.text(options.text);
            this._layout(this._$el);
        }

        this._$el.show();
        if (options.autoCloseTime) {
            clearTimeout(this._autoCloseTimeout);
            this._autoCloseTimeout = setTimeout($.proxy(this.close, this), options.autoCloseTime);
        }
        if(options.isTouchHide){
            this._$el.on('touchend', function(e) {
                e.stopPropagation();
                $("#bmap_pop_cover").hide();
                self.close();
                this._boxTouchHandle = arguments.callee;
                this._$el.off("touchend", arguments.callee);
            });
            $(document.body).on('touchend', function(e) {
                e.stopPropagation();
                $("#bmap_pop_cover").hide();
                self.close();
                this._docTouchHandle = arguments.callee;
                $(document.body).off("touchend", arguments.callee);
            });
        }else {
            if(this._boxTouchHandle) {
                this._$el.off('touchend', this._boxTouchHandle);
            }
            if(this._docTouchHandle) {
                $(document.body).off('touchend', this._docTouchHandle);
            }
        }
        broadcaster.subscribe('sizechange', function() {
            setTimeout(function() {
              self.setPos();
            }, 1000);
        });

    },
    /**
     * 关闭弹出层
     */
    close: function () {
        var onClose;
        if (this._$layer) {
            this._$layer.remove();
            this._$layer = null;
        }
        if (this._$el) {
            this._$el.remove();
            this._$el = null;
            if ($.isFunction(onClose = this._options.onClose)) {
                onClose.call(this);
            }
            this._autoCloseTimeout = null;
        }
    },
    setPos : function() {
        if (this._$el) {
            var offset = this._$el.offset();
            var posX = (window.innerWidth - offset.width) / 2;
            var posY = (window.innerHeight - offset.height) / 2 + window.scrollY;
            this._$el.css({
              "left":  posX,
              "top": posY
            });
        }
    }
};



});