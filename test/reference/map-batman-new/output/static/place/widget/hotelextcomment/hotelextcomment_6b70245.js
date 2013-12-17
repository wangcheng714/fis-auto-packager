define('place:widget/hotelextcomment/hotelextcomment.js', function(require, exports, module){


var stat = require('common:widget/stat/stat.js'),
    url = require('common:widget/url/url.js');

module.exports = {
    init: function() {
        this.commentCfg = {
            perCount: 5,
            loadCount: 0,
            totalCount: $('.detail-comlist dt').size(),
            maxCount: 25
        }
        this.bindEvent();
    },
    bindEvent: function() {
        $('#detail-loadcomment').on('click', $.proxy(this._showMoreCmts, this));
        $('#detail-commore').on( 'click', $.proxy(this._gotoMoreComment, this) );
    },
    _showMoreCmts: function() {
        var me = this,
            commentCfg = me.commentCfg,
            $moreComment;

        (commentCfg.loadCount)++;
        $.each( ['.detail-comlist dt', '.detail-comlist dd'], function( i, item ){
            // 每次点击加载5条数据
            $(item).slice(commentCfg.perCount * commentCfg.loadCount,
                commentCfg.perCount * (commentCfg.loadCount+1) ).show();
        } )

        // 当数据加载完成后，隐藏加载更多，显示查看更多
        if ( (commentCfg.loadCount + 1) * commentCfg.perCount >= commentCfg.totalCount ) {
            $( '#detail-loadcomment' ).off().remove();
            document.body.clientLeft;
            ($moreComment = $('#detail-commore')) &&
                $moreComment.show();
        }

        // 显示更多评论的统计
        stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_SHOWCOMMENT_CLICK);
    },
    _gotoMoreComment : function(e){
        var u = $( e.currentTarget ).data( 'href' );
        url.navigate( this._filter(u) );
    },
    _filter : function(u){
        return u.replace( (/cmark=1&?/i), "" );
    }
}

});