'use strict';

var exports = {
    create: function() {
        var $el  = this.$el = $('.taxi-widget-banner'),
            $btnClose = $el.find('.btn-close');

        $btnClose.on('click', $.proxy(this.onBtnCloseClick, this));
    },
    onBtnCloseClick: function() {
        this.$el.hide();
    },
    init: function() {
        this.create();
    }
};

module.exports = exports;