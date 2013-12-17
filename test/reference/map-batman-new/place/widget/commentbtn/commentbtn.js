

var login = require( 'common:widget/login/login.js' ),
    stat = require( 'common:widget/stat/stat.js'),
    url = require('common:widget/url/url.js');

module.exports = {
    $el: null,
    init: function () {
        var me = this;
        me.$el = $( '#J_commentBtn' );
        me.$el.on( 'click', $.proxy( this.commentAction, this ) );
        me.showBonus();
    },

    commentAction: function( e ) {
        login.checkLogin(function( data ) {
            if ( data.status ) {
                url.navigate( $( e.target ).closest( 'a' ).data('url') );
            } else {
                login.loginAction();
            }
        });
    },

    showBonus: function(){
        var me = this;
        if( url.get().pageState && 
            url.get().pageState.cmark === '1' && 
            url.get().pageState.detail_part === 'comment'
        ){
            var btnTpl = $( '<a>点击抽奖</a>' )
                .attr('id', 'comment-bonus')
                .attr( 'href', 'http://map.baidu.com/zt/zhuanpan/mobile/?from=app' )
                .css( { 
                    background : '#fcaf41', 
                    display : "block",
                    color : "#fff",
                    height : "40px",
                    margin : '10px 0',
                    "font" : 'normal bold 14px/40px "微软雅黑"',
                    "-webkit-border-radius" : "5px",
                    "border-radius" : "5px",
                    "text-align" : "center"
                } );

            me.$el.after( btnTpl );
        }else{
            me.$el.parent().find( '#comment-bonus' ).remove();
        }
    }
}
