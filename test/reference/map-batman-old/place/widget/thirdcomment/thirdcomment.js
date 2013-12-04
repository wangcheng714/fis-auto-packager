var util = require('common:static/js/util.js');

module.exports = {
    init: function() {
        if ( $( '#J_commentSelect' ) ) {
            $( '#J_commentSelect').on( 'change', this.loadMore );
        }
    },
    loadMore: function() {
        var $select = $(this),
            params = util.jsonToUrl({
                uid: $select.data( 'uid' ),
                startIndex: 0,
                maxResults: 5,
                orderBy: $select.val()
            });

        BigPipe.asyncLoad( {id: 'place-pagelet-bdcomment'}, params )
    }
}
