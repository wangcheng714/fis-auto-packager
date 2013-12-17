define('place:widget/icomment/icomment.js', function(require, exports, module){


var login = require("common:widget/login/login.js"),
    popup = require("common:widget/popup/popup.js"),
    stat = require('common:widget/stat/stat.js'),
    url = require('common:widget/url/url.js');

module.exports = {
    msg: {
        netError: '发送失败请检查网络连接后重试',
        nocontentError: '评论内容不能为空'
    },
    init: function() {
        $( '#J_impression li' ).on( 'click', $.proxy( this.switchScores, this ) );
        $( '#J_submitComment').on( 'click', $.proxy( this.submitComment, this ) );
    },
    switchScores: function( e ) {
        var $score;

        if ( $score = $( e.target ).closest( 'li' )) {
            $( '#J_impression li' ).removeClass( 'active' );
            $score.addClass( 'active' );
        }
    },
    submitComment: function() {
        var me = this,
            content = me._getContent(),
            score = me._getScore(),
            msg = me.msg,
            $form = $( '#J_addComment' );

        // 提交评论按钮点击总量
        stat.addStat(STAT_CODE.PLACE_COMMENT_ICOMMENT_SUBMITCLICK);

        //提交评论前验证是否存在cookie
        login.checkLogin(function(data){
            if(!data.status){
                login.loginAction();
            }else{
                if( !score || !content){
                    me.showMessage( msg['nocontentError'] );
                } else {
                    $.ajax({
                        type : 'post',
                        url : '/mobile/webapp/place/icomment/force=simple',
                        data : {
                            uid: $form.data('uid'),
                            content: content,
                            score: score
                        },
                        dataType: 'json',
                        success: function( ret ){
                            me._addCommentSuccess( ret );
                        },
                        error: function(){
                            me.showMessage( msg['netError'] );
                        }
                    });
                }
            }
        });

    },
    _getScore:function() {
        var $form = $( '#J_addComment' );
        return $form.find( '.active' ).attr( 'value' )
    },
    _getContent: function(){
        return $('#J_commentContent').val();
    },

    _addCommentSuccess: function( ret ){
        var me = this,
            $form = $( '#J_addComment' );

        if ( parseInt( ret.status ) === 0 ) {
            // 提交评论成功总量
            stat.addStat(STAT_CODE.PLACE_COMMENT_ICOMMENT_SUBMITSUCCESS);

            me.showMessage( ret.msg );
            setTimeout(function() {
                //添加用户评论标识
                url.navigate( me.addCommentMark( $form.data( 'url' ) ) );
            }, 2000)
        } else {
            me.showMessage( ret.msg );
        }
    },

    showMessage: function( msg, delayTime ) {
        popup.open({
            text: msg,
            autoCloseTime: delayTime || 2000
        });
    },

    /**
     * 添加用户评论动作
     * @param {URL|String} url  待标记的URL地址
     * @return {URL|String}     标记完成的URL地址
     **/
    addCommentMark: function(url){
        url += "&cmark=1";
        return url;
    }
}

});