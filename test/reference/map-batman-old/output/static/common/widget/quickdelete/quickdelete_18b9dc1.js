define('common:widget/quickdelete/quickdelete.js', function(require, exports, module){

require("common:static/js/widget.js");

/**
 * @fileOverview
 * @description 快速删除组件
 */

/**
 * @description   快速删除组件
 * @class
 * @name     $.ui.quickdelete
 * @grammar  $.ui.quickdelete(el[,options])
 * @mode     支持auto-init
 * @param      {Object}         options                   参数
 * @param      {Selector}       options.container         (必选)父容器
 * @param      {Function}       options.ondelete          (可选)点击close按钮时触发
 * @param      {Number}         options.size              (可选)close按钮的大小: 20
 * @param      {Object}         options.offset            (可选)close按钮偏移量{x:0, y:0}
 */
$.ui.create('quickdelete', {
    _data: {
        size: 20,
        offset: {x: 0, y: 0}
    },
    _create: function() {
        var me = this,
            $input = me.data('input', $(me.data('container'))),
            expando = +new Date(),
            elemID = "ui-quickdelete-delete-" + expando,
            // maskID = 'ui-input-mask-' + expando,
            // $maskElem = $input.parent(),
            $deleteElem = $('<div id="' + elemID + '" class="ui-quickdelete-button"></div>').css({
                height: me.data('size'),
                width: me.data('size')
            });

            //在android2.1下-webkit-background-size不支持contain属性，
            $.os.android && $.os.android && parseFloat($.os.version).toFixed(1) == 2.1 && $deleteElem.css('-webkit-background-size', '20px 20px');
            // if ($maskElem.attr('class') != 'ui-input-mask') {
                // $maskElem = $('<div id="' + maskID + '" class="ui-input-mask"></div>').appendTo($input.parent());
            // }
            // me.widget($maskElem.append($input).append(me.data('deleteElem', $deleteElem)).css('height', $input.height()));

            $input.before(me.data('deleteElem', $deleteElem));
            me.widget($deleteElem);
            /***
             * 这里由于涉及到首页静态化，原处理方式是在$input上层增加一个包装DOM，用于定义widget;
             * 因此，存在DOM删除和插入的动作，触发input的blur状态;
             * 现在改成直接在$input同级新增button元素，将其绑定为widget对象;
            ***/
            me._initButtonOffset().trigger('create');
        },

        _init: function() {
            var me = this,
                $input = me.data('input'),
                // $maskElem = $input.parent(),
                eventHandler = $.bind(me._eventHandler, me);

            $input.on('focus input blur', eventHandler);
            me.data('deleteElem').on('touchstart', eventHandler);
            me.on('destroy', function() {
                $input.off('focus input blur', eventHandler);
                me.data('deleteElem').off('touchstart', eventHandler);
                eventHandler = $.fn.emptyFn;
                // 自定义DOM销毁方式
                // $maskElem.parent().append($input);
                // $maskElem.remove();
                $input.siblings('.ui-quickdelete-button').remove();
            });
            me.trigger('init');
        },

        _show: function() {
            this.data('deleteElem').css('visibility', 'visible');
            return this;
        },

        _hide: function() {
            this.data('deleteElem').css('visibility', 'hidden');
            return this;
        },

        _eventHandler: function(e){
            e.stopPropagation();
            var me = this,
                type = e.type,
                target = e.target,
                $input = me.data('input');

            switch (type) {
                case 'focus':
                case 'input':
                    $.trim($input.val()) ? me._show() : me._hide();
                    break;
                case 'mousedown':
                case 'touchstart': // FIXME: UC存在选择过后再点删除无效的情况，线上bug
                    if (target == me.data('deleteElem').get(0)) {
                        e.preventDefault();
                        e.formDelete = true; // suggestion解决删除问题
                        $input.val('');
                        me._hide().trigger('delete');
                        $.later(function() {
                            $input.trigger("input"); // 解决suggestion无法触发focus事件
                            $input.get(0).focus();
                        }, 0);
                    }
                    break;
                case 'blur':
                    me._hide();
                    break;
            }

        },

    _initButtonOffset: function() {
        var me = this,
            $input = me.data('input'),
            size = me.data('size'),
            padding = me.data('padding'),
            targetOffset = me.widget().parent().offset(),
            customOffset = me.data('offset'),
            offsetX = customOffset.x || 0,
            offsetY = customOffset.y || 0,
            height = targetOffset.height == 0 ? me.widget().height() : targetOffset.height,
            paddingOffsetY = Math.round((height - 2 * offsetY - size) / 2);   //padding值根据外层容器的宽度-Y的偏移量-小叉的大小

        me.data('deleteElem').css({
            //padding: padding || paddingOffsetY < 0 ? 0 : paddingOffsetY,          //modified by zmm, 使quickdelete图标可点区域更大
            padding: '6px 10px',
            top: offsetY,
            right: offsetX
        });

        // 处理输入长字符串，input挡住删除按钮问题
        $input.css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'auto',
            right: size + 20
        });
        return me;
    }
});

$(document).on('pageInit', function() {
    // role: data-widget = quickdelete.
    $('[data-widget=quickdelete]').each(function(i, elem) {
        var $elem = $(elem),
            size = $elem.data("quickdelete-size"),
            offsetX = $elem.data('quickdelete-offsetx'),
            offsetY = $elem.data('quickdelete-offsety');

        var quickdelete = $.ui.quickdelete({
            container: elem,
            size: parseInt(size, 10) || undefined,
            offset: {
                x: parseInt(offsetX, 10) || undefined,
                y: parseInt(offsetY, 10) || undefined
            }
        });
    });
});

module.exports = Zepto;

});