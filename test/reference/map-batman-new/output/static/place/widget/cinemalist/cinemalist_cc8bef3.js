define('place:widget/cinemalist/cinemalist.js', function(require, exports, module){

/**
 * @description 电影检索页面
 * @author zhangyong 
 */
var HTTP = "http://"+window.location.host,
    url  = require("common:widget/url/url.js"),
    stat = require('common:widget/stat/stat.js');

var wd = $('.common-widget-nav .title span').text();
var movieInfoData;

//-----------------------------------------------------------------------
//description  展示/隐藏剧情介绍
// @param {__text} [string] 字符串
//-------------------------------------------------------------------------
function showDes() {
    var MORE = $("#more");

    if ( !! !MORE) {
        return;
    }

    var DESC = $("#desc"),
        shortDesc = DESC.html(),
        longDesc = movieInfoData.movie_description;

    MORE.click(function() {
        toggleText();
        $(this).children("img").toggleClass("active");
    });

    function toggleText() {
        if (MORE.children("img").attr('class') == 'active') {

            DESC.html(shortDesc);

        } else {

            DESC.html(longDesc);
            stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_MORECLICK, {'name': 'movieDescription'});
        }
    }
}
//--------------------------------------------
//description  翻页
//@param 
//--------------------------------------------
var bindPageBtn = function(){
    $pageNav = $(".place-widget-moviedetail .page-btn");
    $.each($pageNav, function (index,item) {
        var $dom = $(item);
        $dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("url");


            // 添加“上一页”“下一页”的点击量统计 by cdq
            stat.addCookieStat(STAT_CODE.PLACE_LIST_PAGE_CHANGE, {'wd': wd,type:type});

            if(!btn.hasClass("unclick")) {
                url.navigate(href,{
                    replace : true
                });
            }
        });
    });
};
//--------------------------------------------
//description  影院跳转
//@param 
//--------------------------------------------
var bindList = function () {
    var $poiList = $(".list-info");
    $poiList.on("click", "li", function(evt){
        var $item = $(this),
            href = $item.data("href"),
            name = $item.find('.rl_li_title').text(),
            isGen = movieInfoData && movieInfoData["isGenRequest"],
            target = evt.target;
            
        // 过滤路线按钮，防止重复触发
        if(target.tagName.toLowerCase() === "a") {
            return;
        }
        isGen = isGen == 1 ? 1 : 0;

        if($item.find("em.place_seat_icon").length == 1){
            stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_SCHEDULECLICK, {'name': name,'type':'schedule'});

        }else{

            stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_NEWSCLICK, {'name': name,'type':'news'});

        }
        stat.addCookieStat(STAT_CODE.PLACE_LIST_CLICK, {'wd': wd, 'name': name, 'is_gen' : isGen}, function(){
            url.navigate(href);
        });
    });
};

function initialize(__data) {
    movieInfoData = __data;
    bindPageBtn();
    bindList();
    showDes();
    stat.addStat(STAT_CODE.PLACE_FINDE_MOVIETHEATERS_PV, {'movieid': movieInfoData.movie_id});
}


module.exports = {
    initialize: initialize
};

});