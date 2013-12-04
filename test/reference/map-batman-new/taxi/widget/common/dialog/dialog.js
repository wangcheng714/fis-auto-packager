/**
 * @file Dialog Widget
 * @author liushuai02@baidu.com
 */

'use strict';

var exports, defaultOptions;

defaultOptions = {
    layer: true
};

exports = {
    /**
     * 创建对话框DOM结构
     * @param {object} options 创建参数
     * @param {object} options.buttons 按钮配置，{text: callback}，按钮文本与点击回调函数键值对
     * @param {boolean} [options.layer=true] 是否有蒙版层，默认为true
     * @param {string|element|$} [options.content] 对话框内容，可以是html字符串或者dom元素对象或者Zepto对象
     */
    create: function (options) {
        var that = this,
            $el = this.$el = $('<div/>').addClass('taxi-widget-dialog').hide(),
            $content = this.$content = $('<div/>').addClass('content').appendTo($el),
            $buttonBar = this.$buttonBar = $('<div/>').addClass('button-bar').appendTo($el),
            $layer, buttons, content;

        options = this.options = $.extend({}, defaultOptions, options);

        content = options.content;
        if(typeof(content) === 'string') {
            $content.html(content);
        } else if(typeof(content === 'object')) {
            $content.append(content);
        }

        if (options && (buttons = options.buttons)) {
            $.each(buttons, function (text, callback) {
                $('<button/>').text(text).on('click', $.proxy(callback, that)).appendTo($buttonBar);
            });
        }

        if(options.layer) {
            $layer = this.$layer = $('<div/>').addClass('taxi-widget-dialog-layer').hide();
            $layer.append($el).appendTo(document.body);
        } else {
            $el.appendTo(document.body);
        }

        return this;
    },
    close: function () {
        this.$el.hide();
        if(this.options.layer) {
            this.$layer.hide();
        }
        return this;
    },
    open: function () {
        this.$el.show();
        if(this.options.layer) {
            this.$layer.show();
        }
        return this;
    },
    destroy: function() {
        this.$buttonBar.find('button').each(function(i, button) {
            $(button).off('click');
        });
        return this;
    }
};


module.exports = exports;
