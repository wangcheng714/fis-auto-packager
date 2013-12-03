define('taxi:widget/about/about.js', function(require, exports, module){

/**
 * @file 文本页面
 */
'use strict';

var stat = require('common:widget/stat/stat.js'),
    exports = {
    create: function() {
        var $el = $('.taxi-widget-about'),
            $nav = $el.find('.taxi-widget-nav'),
            options = this.options,
            type = options && options.type;

        $nav.find('.title').text(({
            help: '打车攻略',
            terms: '条款与声明'
        })[type]);
        $el.find('.' + type).show();

        if(type === 'help') {
            stat.addStat(STAT_CODE.TAXI_HELP);
        } else {
            stat.addStat(STAT_CODE.TAXI_TERMS);
        }
    },
    init: function() {
        this.options = LoadManager.getPageOptions();

        if(!this.options) {
            popup.open({
                text: '系统异常',
                layer: true,
                onClose: function() {
                    LoadManager.loadPage('home');
                }
            })
        }

        this.create();
    }
};

module.exports = exports;

});