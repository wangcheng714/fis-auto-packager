define('common:widget/backtop/backtop.js', function(require, exports, module){

var $el = $('.common-widget-back-top');

// require阶段只会执行一次，保证scroll事件在全局只绑定一次
$(window).on('scroll', function() {
    if(window.scrollY < window.innerHeight/2) {
        $el.hide();
    } else {
        $el.show();
    }
});

module.exports = {
    /**
     * init方法每次quickling之后都会执行
     */
    init: function () {
        // 更新$el引用
        $el = $('.common-widget-back-top');
        $el.on('click', function() {
            window.scrollTo(0, 1);
        });
    }
};

});