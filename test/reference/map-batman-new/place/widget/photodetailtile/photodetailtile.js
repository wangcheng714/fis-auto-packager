/**
 * Created with JetBrains WebStorm.
 * User: chenkang01
 * Date: 13-11-6
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */

var url = require('common:widget/url/url.js');

module.exports = {
    config: {
        iService : '',
        iServiceTpl: 'height=$h$&width=$w$&quality=70&src=$src$',
        iThreshold: 12,
    },
    imgItemTpl: '<div class="tile-arena-item" style="width:$w$px;height:$h$px"><img data-idx="$i$" src="$url$" alt="加载中……"/></div>',
    $el: null,
    tile: null,
    photos: null,
    end: 0,
    init: function(wData) {
        'use strict';
        var me = this;
        me.end = 0;
        me.$el = $("#phototile");
        me.tile = me.$el.find(".tile-arena");
        me.showFooter = me.$el.find('.tile-footer');
        me.showBtn = me.showFooter.find("a");
        me.photos = wData.photos;
        me.config.iService = wData.thumbnailURL + me.config.iServiceTpl;
        me.bindEvent();
        me.displayTile();
    },
    displayTile: function() {
        'use strict';
        var me = this,
            start = me.end,
            il = (me.end + me.config.iThreshold) >= me.photos.length,
            end = il ? me.photos.length : (me.end + me.config.iThreshold),
            imgs = [],
            dim = me._getDim(),
            urlTpl = me.config.iService.replace("$h$", dim.tHeight).replace("$w$", dim.tWidth);
        for( ; start < end; start ++ ){
            var src = urlTpl.replace("$src$", encodeURIComponent(me.photos[start].imgUrl));
            imgs.push(me.imgItemTpl.replace('$i$', start).replace('$url$', src).replace("$h$", dim.tHeight).replace("$w$", dim.tWidth));
        }
        var items = $( imgs.join( "" ) );
        $( "#photos-detail .place-loading" ).remove();
        me.tile.append( items );
        me.initImgLoading( items );
        il ? me.showFooter.hide() : me.showFooter.show();
        me.end = end;
    },
    bindEvent: function() {
        'use strict';
        var me = this;
        me.$el.on( 'click', (me._clickEl = $.proxy( me.clickHandler, me ) ) );
        $(window).on( "resize orientationchange", ( me._resizeFun = $.proxy( me.resize, me ) ) );
        return this;
    },
    unbindEvent: function() {
        'use strict';
        var me = this;
        me._clickEl && ( me.$el.off( 'click', me._clickEl ) || ( me._clickEl = null));
        me._resizeFun && ( $( window ).off( "resize orientationchange", me._resizeFun ) || ( me._resizeFun = null ) );
        return this;
    },
    clickHandler: function(e) {
        'use strict';
        var me = this,
            cTarget = $(e.target);
        if(cTarget.attr("id") === "photo-tile-more-imgs"){
            me.displayTile();
        }else if(cTarget.parent().attr('class') === 'tile-arena-item'){
            me.displayImgSlider(cTarget);
        }
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
    /**
     * @description 计算所有页面的相应尺寸
     * @returns {{pHeight: number, tWidth: number, tHeight: number, sWidth: number, sHeight: number}}
     * @private
     */
    _getDim: function() {
        'use strict';
        var cs = this.getClientSize(),
            tw = (cs.width - 46) / 3,
            th = tw * .75,
            sw = cs.width * .9,
            sh = (cs.height  - 51 - 40) * .9,
            ph = cs.height - 51;
        return {pHeight: ph, tWidth: Math.floor(tw), tHeight: Math.floor(th), sWidth: Math.floor(sw), sHeight: Math.floor(sh), cs:cs};
    },
    /**
     * @description 屏幕大小变化是重置相应元素的尺寸
     * @returns this
     */
    resize: function() {
        'use strict';
        var me = this,
            dim = me._getDim();
        me.$el.find(".tile-arena-item").css({width: dim.tWidth, height: dim.tHeight});
        return me;
    },
    /**
     * @description 触发slider
     * @param {Event} e 事件对象
     */
    displayImgSlider: function(cTarget) {
        'use strict';
        var me = this,
            idx = cTarget.data('idx'),
            ps = url.get();
        ps.pageState.detail_part = 'photoslider';
        ps.pageState.idx = idx;
        url.update(ps);
    },
    initImgLoading: function($img) {
        'use strict';
        $img.find("img").on("error", $.proxy(this._handleImgError, this));
    },
    _handleImgError: function(e) {
        'use strict';
        $(e.currentTarget).attr("src", "/widget/photodetailtile/images/no_img.png");
    }
};
