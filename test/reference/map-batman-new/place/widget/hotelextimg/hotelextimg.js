/**
 * Created with JetBrains WebStorm.
 * User: chenkang01
 * Date: 13-11-6
 * Time: 下午2:22
 * To change this template use File | Settings | File Templates.
 */

module.exports = {
    init: function () {
        'use strict';
        $( '.hotel-img' ).on( 'click', $.proxy( this.gotoPhotoDetail, this ) );
    },

    gotoPhotoDetail: function( e ) {
        'use strict';

        e.preventDefault();
        e.stopPropagation();
        //进入图片详情页
        var url = $( e.currentTarget ).data( 'href' );
        if(url){
            window.location = url;
        }
    }
}