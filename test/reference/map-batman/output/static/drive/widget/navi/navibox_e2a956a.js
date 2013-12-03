define('drive:widget/navi/navibox.js', function(require, exports, module){

/**
 * @fileoverview nichenjian@gmail.com 导航弹出框 
 */
var Popup = require('common:widget/popup/popup.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    util  = require('common:static/js/util.js');
/**
* 唤起导航客户端确认
*/
var naviBox = {

    // 跳转url
    navurl: "",
    // pop实例
    navOkBox: null,

    config: {
        width: 276,
        height: 126
    },

    main: $('#navOkBox'),

    // 显示box
    showTb: function(url, opts) {
        if(!url) return;

        var me = this,
            opts = opts || {};
        me.navurl = url;
        if($("#navOkBox")[0]) {
            $('#navOkBox').remove();
        }

        var htm = [];
        htm.push('<div id="navOkBox" class="navokbox">');
        htm.push('<div class="t"></div>');
        htm.push('<div  class="c">');
        htm.push('<div class="t1">'+ opts.description +'</div><div>');
        // htm.push('<button class="bt qx cancel-navokbox" >取消</button>');
        htm.push('<a href=' + $.trim(url) + '><button class="bt qd cancel-navokbox" >'+ opts.leftBtn +'</button></a>');
        htm.push('<a href=' + $.trim(opts.naviUrl) + '><button class="bt qd cancel-navokbox" >'+ opts.rightBtn +'</button></a>');
        htm.push('</div></div></div>');
        $('body').append(htm.join(''));
        //设置当前的弹出框位置
        me.setPos();
        me.bindEvent(opts);
    },

    bindEvent: function(opts){
      var me = this;
      $('button.cancel-navokbox').on('click', function(evt){
          evt.preventDefault();
          var target = evt.target,
              value = $.trim($(target).html()), 
              url = $(target).parent().attr('href'),
              num;

          if(value == '直接网页导航' && opts.leftBtn == '确定'){
              num = 1;
          }else if(value == '直接网页导航' && opts.leftBtn == '确定下载'){
              num = 2;
          }else if(value == '确定'){
              num = 3;
          }else if(value == '确定下载'){
              num = 4;
          }
          //用户选择导航的方式统计
          //util.addStat(STAT_CODE.STAT_NAVI_USER_CHOICE, {'choice': num});
          me.c(me);
          //添加200ms的延时，保证发出统计
          setTimeout(function(){
             location.href = url;
          }, 200);
      });

      broadcaster.subscribe('sizechange', function() {
          setTimeout(function() {
              me.setPos();
          }, 100);
      });
      //window.onscroll = function(){
          //setTimeout(function() {
              //me.setPos();
          //}, 100);
      //}
    },
    
    setPos: function(){
        var posx = (window.innerWidth - this.config.width) / 2;
        var posy = (window.innerHeight - this.config.height) / 2 + window.scrollY;
        $('#navOkBox').css({
           "left":  posx,
           "top": posy,
           "position": "absolute"
        });
    },
    // 取消操作
    c: function() {
        if($('#navOkBox')[0]) {
            $('#navOkBox').remove();
        }
    }
};

module.exports = naviBox;


});