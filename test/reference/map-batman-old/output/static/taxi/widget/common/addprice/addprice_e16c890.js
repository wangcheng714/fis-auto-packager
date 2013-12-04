define('taxi:widget/common/addprice/addprice.js', function(require, exports, module){

/**
 * @file 加价模块
 */
'use strict';

var exports = {
    /**
     * 创建控件
     * @param {array} data 初始化数据，价格区间数组
     */
    create: function(data) {
        var $el = $('.taxi-widget-addprice'),
            $wrapper = $el.find('.wrapper'),
            documentFragment, $option, $label, $radio, $options;

        if($.isArray(data)) {
            documentFragment = document.createDocumentFragment();
            $.each(data, function(i, item) {
                $option = $('<div/>').addClass('option');
                $label = $('<label/>').text(item + '元').appendTo($option);
                $radio = $('<input/>').attr({
                    'type': 'radio',
                    'name': 'add_price'
                }).val(item).appendTo($option);
                $option.appendTo(documentFragment);
            });
            $wrapper.append(documentFragment);
        }

        $options = $el.find('.option');

        $options.on('click', $.proxy(this.onOptionClick, this));

        this.$el = $el;
    },
    onOptionClick: function(e) {
        this.setValue($(e.currentTarget).find('input[type=radio]').val());
    },
    /**
     * 设置值
     * @param {number} value 将要设置的值
     */
    setValue: function(value) {
        value = parseInt(value, 10) || 0;
        var $el = this.$el,
            $options = $el.find('.option'),
            $radio, $option;

        $options.each(function(i, option) {
            $option = $(option);
            $radio = $option.find('input[type=radio]');
            if(value === parseInt($radio.val(), 10)) {
                $radio.attr('checked', 'checked');
                $option.addClass('checked');
            } else {
                $radio.removeAttr('checked');
                $option.removeClass('checked');
            }
        });
    },

    /**
     * 控件初始化
     * @param {array} data 初始化数据，价格区间数组
     * @param {number} value 选中的值，默认为0
     */
    init: function(data, value) {
        this.create(data);
        this.setValue(value);
        this.$el.show();
    }
};

module.exports = exports;

});