define('place:widget/bdcomment/bdcomment.js', function(require, exports, module){


var util = require('common:static/js/util.js');

module.exports = {
    startIndex: 0,
    $select: $( '#J_commentSelect' ),
    init: function() {
        var me = this;

        me.$select.on( 'change', $.proxy(me.loadMore, me));
        $( '.comment-loadmore').on( 'click', function() {
            me.loadMore(  true );
        } );
    },
    loadMore: function( isAsyncLoad ) {
        var me = this,
            $select = me.$select,
            startIndex = 0,
            maxResults = 5,
            params;

        if ( isAsyncLoad ) {
            startIndex = (++me.startIndex);
            maxResults = 10;
        }

        params = util.jsonToUrl({
            uid: $select.data( 'uid' ),
            startIndex: startIndex,
            maxResults: maxResults,
            orderBy: $select.val()
        });

        BigPipe.asyncLoad( {id: 'place-pagelet-bdcomment'}, params )
    }
}

});