

var login = require( 'common:widget/login/login.js' ),
    stat = require( 'common:widget/stat/stat.js' );

module.exports = {
    init: function () {
        $( '#J_commentBtn' ).on( 'click', $.proxy( this.commentAction, this ) );
    },

    commentAction: function( e ) {
        e.preventDefault();

        //评论入口点击总量
        //stat.addStat( STAT_CODE.PLACE_DETAIL_COMMENT_CLICK );

        login.checkLogin(function( data ) {
            if ( data.status ) {
                location.href = $( e.target ).closest( 'a' ).prop( 'href' );;
            } else {
                login.loginAction();
            }
        });
    }
}
