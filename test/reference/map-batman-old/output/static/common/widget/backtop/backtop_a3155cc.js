define('common:widget/backtop/backtop.js', function(require, exports, module){

'use strict';

var $el = $('.common-widget-back-top'),
    $window = $(window);

$window.on('scroll', function() {
    if(window.scrollY < window.innerHeight/2) {
        $el.hide();
    } else {
        $el.show();
    }
});

$el.on('click', function() {
    window.scrollTo(0, 0);
});

});