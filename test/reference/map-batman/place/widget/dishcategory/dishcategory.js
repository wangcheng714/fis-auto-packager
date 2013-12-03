var util = require('common:static/js/util.js'),
    mapResize = require('place:static/lib/mapresize.js'),
    iScroll = require('common:static/js/iscroll.js');

$(function() {
    $('#place-widget-dish-category').show();


    var ddlScroll = new iScroll($("#place-widget-dish-category .ddl_wrapper div").get(0), {
        hScroll: false,
        hScrollbar: false,
        vScroll: true,
        vScrollbar: true,
        handleClick: false
    });


    var height = mapResize.h || 320;
    height = height - 160;
    height = Math.min(Math.max(120, height), 360);

    $("#place-widget-dish-category .ddl_wrapper .ul_scroll").css({maxHeight : height});

    ddlScroll.refresh();


    function scrollToDish(e){
        var target = e.target;
        var dishCategoryId = target.id;
        
        if(dishCategoryId){
            var offset = $('#dishCategory_' + dishCategoryId).offset();
            window.scroll(0, offset.top);
        }

        $('#place-widget-dish-category').hide();
    }

    // 分类菜单点击事件
    $('#place-widget-dish-category').on('click', scrollToDish);
    
    // 隐藏分类菜单
    $('#place-widget-dish-category').hide();
});