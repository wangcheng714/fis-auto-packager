define('third:widget/slideopen/slideopen.js', function(require, exports, module){

/**
 * @file topbanner.js 顶部广告条
 */
'use strict';

module.exports = {
    init: function () {
        var me = this;
        
        var util = require('common:static/js/util.js'),
            stat = require('common:widget/stat/stat.js'),
            src, hasInstalled,
            topBannerClosed = Boolean(localStorage.getItem('topBannerClosed'));
            if (topBannerClosed === false) {
            // 判断是否已经安装
            util.getNativeInfo('com.baidu.BaiduMap', function (data) {
                if (data.error == 0) {
                    if($(".text").html() != null){
                        $(".text").html("");
                    }
                    $(".text").html("打开百度地图客户端"); 
                    hasInstalled = true;
                } else {
                    if($(".text").html() != null){
                        $(".text").html("");
                    }
                  $(".text").html("下载百度地图客户端");  
                    hasInstalled = false;
                }
            }, function () {
                    if($(".text").html() != null){
                        $(".text").html("");
                    }
                $(".text").html("下载百度地图客户端");
                hasInstalled = false;
            });

        }

        src = util.isIPhone() ? 'http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8'
        : (util.isIPad() ? 'https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681?ls=1&mt=8'
        : (util.isAndroid() ? 'http://mo.baidu.com/d/map/gw10014/bmap_andr_gw10014.apk' : ''));

                    var oLock = $("#unlock-slider");
            var oBtn = $("#unlock-handle");
            var olock = oLock[0];
            var obtn = oBtn[0];
            var disX = 0;
            var maxL = olock.clientWidth - obtn.offsetWidth;

            var initPageX = 0;
            var left  = 0;

            var touchStartHandler = function(e){
                 var touchs = e.touches;
                 initPageX = touchs[0].pageX;

                 var divLeft  = $(this).css('left');
                 e.preventDefault();
                 e.stopPropagation();

                 divLeft = parseInt(divLeft.replace('px', ''));
                 left = divLeft;

                 this.addEventListener('touchmove', touchMoveHandler);
                 this.addEventListener('touchend', touchEndHandler);
            };

            var touchMoveHandler = function(e){
                 var touchs = e.touches;
                 var diff = touchs[0].pageX - initPageX;

                 e.preventDefault();
                 e.stopPropagation();

                 var x = left + diff;
                 $(".text").css("opacity", 1-(parseInt(x)/120));
                 if(x < 0){
                      return;
                 }
                 if(x >= 190){
                    this.removeEventListener('touchmove', touchMoveHandler);
                    if (hasInstalled) {
                        stat.addStat(STAT_CODE.STAT_NEARPUSH_SHOW);
                        location.href = 'bdapp://map/';
                    } else {
                        stat.addStat(STAT_CODE.STAT_APP_LOADDOWN);
                        window.open("http://map.baidu.com/zt/jod.html", '_blank');
                    }
                    $("#unlock-handle").animate({left: 0}, 200 );
                    $("#slide-to-unlock").animate({opacity: 1}, 200 );
                    $(".text").css("opacity", parseInt(x)/120);
                 }else{
                     $(this).css({
                        left: x
                     });
                 }
            };

            var touchEndHandler = function(e){
                e.stopPropagation();
                this.removeEventListener('touchmove', touchMoveHandler);
                $("#unlock-handle").animate({left: 0}, 200 );
                $("#slide-to-unlock").animate({opacity: 1}, 200 );
                $(".text").css("opacity", 1);
            }

            obtn.addEventListener('touchstart', touchStartHandler); 
            stat.addStat(STAT_CODE.STAT_APPBANNER_SHOW);

    }

};

});