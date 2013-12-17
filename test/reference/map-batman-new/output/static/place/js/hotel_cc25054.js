define('place:static/js/hotel.js', function(require, exports, module) {
    var stat = require('common:widget/stat/stat.js');

    module.exports = {
        init: function( options ) {
            var me = this;

            me.$navs = $( '.hotelext-nav li' );
            me.$conts = $( '.hotelext-cont > div' );
            me.sendHotelbookAsync( options );
            me.sendExtAsync( options );
            me.lastTabIndex = -1;
            me.switchTab( 0 );
            me.bind();
        },

        bind: function() {
            this.$navs.on( 'click', $.proxy( this._clickTab, this ) );
        },

        sendHotelbookAsync: function( options ) {
            var today = (new Date()).format('yyyy-MM-dd'),
                tomorrow = (new Date((new Date()).getTime() + 24 * 60 * 60 * 1000)).format('yyyy-MM-dd');

            (require('place:widget/hotelthirdsrc/hotelthirdsrc.js')).fetchThirdsrc({
                st: today,
                et: tomorrow,
                uid: options.uid
            });

            (require('place:widget/hotelthirdota/hotelthirdota.js')).fetchThirdota({
                st: today,
                et: tomorrow,
                uid: options.uid
            });
        },

        sendExtAsync: function(options) {
            BigPipe.asyncLoad([{
                id: 'place-pagelet-hotelextimg'},{
                id: 'place-pagelet-hotelextphone'},{
                id: 'place-pagelet-hotelextcomment'},{
                id: 'place-pagelet-hotelextshop'},{
                id: 'place-pagelet-hotelexttuan'},{
                id: 'place-pagelet-hotelextpre'},{
                id: 'place-pagelet-hotelsitelink'}
            ], 'uid=' + options.uid + '&pageletGroup=ext');
        },

        _clickTab: function( e ) {
            var $target = $(e.currentTarget),
                curIndex;

            if ( ~(curIndex = this.$navs.index( $target)) ) {
                this.switchTab( curIndex );
                stat.addStat(STAT_CODE.PLACE_HOTEL_DETAIL_TAB_CLICK, {type: curIndex});
            }
        },

        switchTab: function( index ) {
            var $navs = this.$navs,
                $conts = this.$conts,
                lastIndex = this.lastTabIndex;

            if ( ~lastIndex ) {
                $navs.eq( lastIndex).removeClass( 'active' );
                $conts.eq( lastIndex ).removeClass( 'active' );
            }

            $navs.eq( index ).addClass( 'active' );
            $conts.eq( index ).addClass( 'active' );

            this.lastTabIndex = index;
        }
    }
});