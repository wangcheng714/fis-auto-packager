define('place:widget/photodetailslider/photodetailslider.js', function(require, exports, module){

/**
 * Created by chenkang01 on 13-11-7.
 */
module.exports = {
    config: {
        iService : '',
        iServiceTpl : 'height=$h$&width=$w$&quality=70&src=$src$'
    },
//    imgItemTpl:
//            '<div class="img-area-item loading">' +
//                '<div class="absolute-center-align loading">···Hello</div>' +
//                '<img class="absolute-center-align" alt="" src="<%= pic %>">' +
//            '</div>',
    $el: null,
    photos: [],
    area: null,
    frowWhere: null,
    cIndex: null,
    imgs: null,
    init: function( wData ){
        'use strict';
        var me = this,
            idx = Number( wData.get.idx );
        me.$el = $( "#photoslider" );
        me.photos = wData.photos;
        me.area = me.$el.find( "#img-area" );
        me.imgs = me.area.find( 'img' );
        me.frowWhere = me.$el.find( ".fromwhere" );
        me.cIndex = me.$el.find( ".currentidx" );
        me.config.iService = wData.thumbnailURL + me.config.iServiceTpl;

        me.resize();
        me.bindEvent();
        me.displaySlider( idx );
//            {
//                index: me._cidx = idx,
//                imagZoom: true,
//                content: me._setImgs(wData),
//                template: {
//                    item:
//                        me.imgItemTpl
//                }
//            }).on('slideend', $.proxy(me._slide, me));
    },
    displaySlider: function( idx ) {
        'use strict';
        var me = this;
        me._setInfo( idx );
        $( "#photos-detail .place-loading" ).remove();
        me.area.slider( { index: Number( idx ) }).on( 'slideend', $.proxy( me._slide, me ) );
    },
    _slide: function( e, idx ){
        'use strict';
        var me = this;
//            instance = $("#img-area").slider('this'),
//            cidx = $.inArray(instance._active, instance._options.content);
        me._setInfo( idx );
    },
    _setInfo: function( idx ){
        'use strict';
        var me = this,
            idx = Number( idx) ;
        me.frowWhere.html( me.photos[idx].cn_name );
        me.cIndex.html( idx + 1 );
    },
    _setImgs: function( wData ){
        'use strict';
        var me = this,
            dim = me._getDim(),
            imgs = [],
            photos = wData.photos;
        for( var i in photos ){
            imgs.push({
                pic: me._getPic(photos[i], dim)
            });
        }
        return imgs;
    },
    _getPic: function( item, dim ){
        'use strict';
        return this.config.iService
            .replace( "$h$", dim.sHeight )
            .replace( "$w$", dim.sWidth )
            .replace( "$src$", encodeURIComponent( item.imgUrl ) );
    },
    bindEvent: function(){
        'use strict';
        var me = this;
        me.onImgLoading().onResize().stop;
    },
    unbindEvent: function(){
        'use strict';
        var me = this;
        me.offImgLoading().offResize();
    },
    /**
     * @description 计算所有页面的相应尺寸
     * @returns {{pHeight: number, tWidth: number, tHeight: number, sWidth: number, sHeight: number}}
     * @private
     */
    _getDim: function(){
        'use strict';
        var cs = this.getClientSize(),
            offs = this.getSliderOffset(),
            tw = (cs.width - 46) / 3,
            th = tw * .75,
            sw = cs.width * .9,
            sh = (cs.height - offs.top - 40),
            ph = cs.height - offs.top;
        return {
            pHeight: ph,
            tWidth: Math.floor( tw ),
            tHeight: Math.floor( th ),
            sWidth: Math.floor( sw ),
            sHeight: Math.floor( sh ),
            cs:cs
        };
    },
    /**
     * 计算窗口尺寸
     *
     */
    getClientSize: function() {
        'use strict';
        var w = window;
        return {
            width: w.innerWidth,
            height: w.innerHeight
        };
    },
    getSliderOffset: function(){
        'use strict';
        var me = this;
        return me.$el.offset();
    },
    resize: function(){
        'use strict';
        var me = this,
            dim = me._getDim();
        me.$el.css( { height: dim.pHeight } );
        me.area.css( { height: dim.sHeight } );
    },
    onResize: function(){
        'use strict';
        var me = this;
        !( me._resizeFun ) &&
        $( window ).on( "resize orientationchange", ( me._resizeFun = $.proxy( me.resize, me ) ) );
        return me;
    },
    offResize: function(){
        'use strict';
        var me = this;
        (me._resizeFun) &&
        ( $(window).off( "resize orientationchange", ( me._resizeFun ) ) || ( me._resizeFun = null ) );
        return me;
    },
    onImgLoading: function(){
        'use strict';
        this.imgs
            .on( "load", $.proxy( this._handleImgLoad, this ) )
            .on( "error", $.proxy( this._handleImgError, this ) );
        return this;
    },
    offImgLoading: function(){
        'use strict';
        this.imgs.off();
        return this;
    },
    _handleImgError: function(e){
        'use strict';
        $( e.currentTarget ).attr( "src", "/widget/photodetailslider/images/no_img.png" );
    },
    _handleImgLoad: function(e){
        'use strict';
        var t = $( e.target );
        t.parent().removeClass( "loading" );
    }
};

});