define('common:widget/streetview/streetview.js', function(require, exports, module){

/**
 * @fileoverview streetview 显示界面
 */
var util = require('common:static/js/util.js'),
    BMap = require('common:static/js/map/api.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    Popup = require('common:widget/popup/popup.js'),
    CustomMarker = require('common:static/js/map/custommarker.js'),
    url  = require('common:widget/url/url.js'),
    Cookie = require('common:widget/cookie/cookie.js'),
    storage = require('common:static/js/localstorage.js');
    
var StreetViewControl = {
    Str: {
       DAY  : 'day',
       NIGHT: 'night',
       BANNER_ID: 'app-banner-for-stv',
       STREETVIEW_CONTAINER_ID: 'streetview-container',
       MAP_CONTAINER_ID: 'eagleeye-container',
       MAP_ID: 'eagleeye-map',
       NORESULT:'未找到街景数据'
    },
    
    os: util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown",
    
    init: function(opts) {
        var me = this;
        this.show();
        this._updated = false; // 表示街景是否通过变更id或者position而发生了更新，用来判断是否需要统计
        this.initStreetView();
        this.initMap();
        this.updateStreetView();
        this.bind();
        this.onSizeChange();
    },
    
    initStreetView: function(){
        var strView;
        this.streetView = strView = new BMap.StreetView(this.Str.STREETVIEW_CONTAINER_ID);
        strView.addEventListener('position_changed', $.proxy(this.onPositionChanged, this));
        strView.addEventListener('links_changed', $.proxy(this.onPositionChanged, this));
        strView.addEventListener('dataload', $.proxy(this.onStreetDataLoaded, this));
        // 用于性能监控 by jz
        strView.addEventListener('tilesloaded', $.proxy(this.onTilesLoaded, this));
    },
    
    onStreetDataLoaded: function(){
        //this.sendStats(STAT_CODE.STAT_STREETVIEW_VIEW);
    },
    
    initMap: function(){
        var me = this;
        // 初始化地图
        var mapOptions = {
            maxZoom: 14,
            minZoom: 14,
            drawMargin: 0,
            enableFulltimeSpotClick: false,
            vectorMapLevel: 99,
            drawer:BMAP_CANVAS_DRAWER
        };
        this.eyeMap = new BMap.Map(this.Str.MAP_ID, mapOptions);
        this.eyeMap.disableHighResolution();
        this.eyeMap.disableDoubleClickZoom();
        this.eyeMap.disablePinchToZoom();
        this.eyeMap.addTileLayer(new BMap.StreetViewCoverageLayer());
        this.eyeMap.addEventListener('click', $.proxy(this.onEyeMapClick, this));
    },
    
    onEyeMapClick: function(){
        $('#'+this.Str.MAP_CONTAINER_ID).toggleClass('exp');
        var point = this.streetView.getPosition();
        // 容器大小发生变化，由于后面重新设置了中心点，所以这里需要强制resize一下
        // 否则地图自动监听容器变化有延时
        this.eyeMap.checkResize();
        this.eyeMap.centerAndZoom(point, 15);
    },
    //check 屏幕横竖状态 true 竖屏， false横屏 todo:不准确
    checkEyeMapDirection: function(){
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        return (ww < wh ? true : false);
    },
    
    toMax: function(){
        var $backNav = $('#back_nav');
        var $uninscrllWrapper = $('#uniscroll-wrapper');
        var bh = $backNav.height();
        
        //$backNav.addClass('hide');
        //$uninscrllWrapper.css({top: 0});
        
        $('#'+this.Str.MAP_CONTAINER_ID).css({
		   'visibility':'hidden',
		   'left': -1000
		});
        $("#street-holder").find('.addr').show();
        
        broadcaster.broadcast('sizechange');
    },
    
    recovery: function(){
        var opts = url.get(); 
       
        $('#'+this.Str.MAP_CONTAINER_ID).css({
           'visibility':'visible',
           'left': 5
        });
        // 容器变化需要重新设置中心点
        this.eyeMap.checkResize();
        this.eyeMap.centerAndZoom(this.streetView.getPosition(), this.eyeMap.getZoom());
        $("#street-holder").find('.addr').hide();
        broadcaster.broadcast('sizechange');
    },
    
    bind:function(){
        var me = this;
        this.streetView.addEventListener('click', $.proxy(this.onStreetViewClick, this));
        this.streetView.addEventListener('noresult', $.proxy(this.onNoResult, this));
        
        $('#eagleeye-container, #street-holder .mode').on('touchstart touchend', function(e){
            e.stopPropagation();
        });
        $("#street-holder").find('.mode').on('click', $.proxy(this.onToggleMode, this));
        broadcaster.subscribe('sizechange', $.proxy(this.onSizeChange, this));
    },
    
    onSizeChange: function(){
        var opts = url.get();
        var pageState = opts.pageState || {};
        if(!this.hasAlertDisabled() &&
            !this.checkEyeMapDirection() &&
            !util.isIPad()){
            //在小米1默认浏览器下,localStorage保存数据不立刻生效的问题。 
			if(this.alertDsabeld)return;

            Popup.open(
                {
                    text : '街景在横屏下体验较差，建议在竖屏下使用。',
                    autoCloseTime : 3000
                }
            );
            this.alertDsabeld = true;
            storage.addData("alertDisabled", "true", {
                error: function() { // localstorage写入失败时写入cookie
                    var options = {
                        domain: 'map.baidu.com',
                        path: '/',
                        expires: 365 * 24 * 60 * 60 * 1000
                    };
                    Cookie.set("alertDisabled", "true", options);
                }
            });
            
            $('.common-widget-popup').on('touchstart', function(){
                $('.common-widget-popup').remove();
            });
            // setTimeout(function(){
            //     if(pageState.vt == 'streetview'){
            //         util.TxtBox.c({
            //             clearAll:true
            //         });
            //     }
            // }, 3000);
        }
        //渲染街景后，在横屏下产品头被遮住，用延时重新滚动浏览器的页面位置
        setTimeout(function(){
            window.scrollTo(0,0);
        },100);
    },
    
    hasAlertDisabled: function(){
        var alertDisabled;
        storage.selectData("alertDisabled", {
            success: function(result) {
                alertDisabled = result;
                if (!alertDisabled) {
                    alertDisabled = Cookie.get("alertDisabled");
                    if ("" + alertDisabled === "true") {
                        storage.addData("alertDisabled", "true", {
                            success: function() {
                                Cookie.remove("alertDisabled");
                            }
                        });
                    }
                }
            },
            error: function() {
                alertDisabled = Cookie.get("alertDisabled");
            }
        });
        return "" + alertDisabled == "true";
    },
    
    onNoResult: function(){
        var opts = url.get();
        var pageState = opts.pageState || {};

        Popup.open( 
            {
                text          : this.Str.NORESULT,
                autoCloseTime : 1500
            }
        );
        //clearTimeout(this.interval);
        // this.interval = setTimeout(function(){
        //     if(pageState.vt == 'streetview'){
        //         util.TxtBox.c({
        //             clearAll:true
        //         });
        //     }
        // }, 3000);
        this.onPositionChanged();
    },
    
    onStreetViewClick: function(){
        this.maxStatus = !this.maxStatus;
        this.maxStatus ? this.toMax() : this.recovery();
        this.setDayAndNigthMode();
		//var curControl = app.getCurController();
		//var banner = curControl.views['streetbanner'];
		//banner && banner.hideBanner();
    },
    
    onToggleMode: function(){
         var mode = this.streetView.getMode();
         var rel = this.streetView.getRelevants();
         
         if(rel[0] && rel[0]['mode']){
            var data = rel[0]['mode'] ==='day' ? 'night' : 'day';
            if(data){
                $("#street-holder").find('.mode').show().
                    removeClass('night day').addClass(mode === 'day' ? 'night' : 'day');
            }
            this.streetView.setId(rel[0]['id']);
        }
    },
    
    update: function(){
        this.show();  
        this.updateStreetView();
    },
    
    hide: function(){
        $("#street-holder").css('visibility', 'hidden');  
        
        $('#'+this.Str.MAP_CONTAINER_ID).css('visibility','hidden');
        if (util.isIOS() && this.streetView) {
            // iOS6上发现svg与地图有冲突，导致无法拖拽，所以
            // 隐藏街景的时候也需要把svg元素隐藏
            this.streetView._linksContainer && (this.streetView._linksContainer.style.display = 'none');
        }
        $('#'+this.Str.BANNER_ID).hide();
        $('#iscroll-container').removeClass('hide');
    },
    show: function(){
        $('#'+this.Str.BANNER_ID).show();
        
        $("#street-holder").css('visibility', 'visible');
        if (util.isIOS() && this.streetView) {
            this.streetView._linksContainer && (this.streetView._linksContainer.style.display = '');
        }
        if(!this.maxStatus){
            $('#'+this.Str.MAP_CONTAINER_ID).css('visibility','visible');
        }
        if(util.isIPad()){
            $('#iscroll-container').addClass('hide');
        }
    },
    /*
     * 添加鹰眼覆盖物
     * @paras {Point}
     */
    setEye: function(point){
        if(!this._mkr){
            var icon = new BMap.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUY1NDYwQjhGNTIxMTFFMkIzREZGQURENzdCRDY5ODMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUY1NDYwQjlGNTIxMTFFMkIzREZGQURENzdCRDY5ODMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRjU0NjBCNkY1MjExMUUyQjNERkZBREQ3N0JENjk4MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRjU0NjBCN0Y1MjExMUUyQjNERkZBREQ3N0JENjk4MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgIQMF8AAAeYSURBVHjapJh7bFt3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",
               new BMap.Size(40, 40), {    
                   anchor: new BMap.Size(20, 40),    
                   imageOffset: new BMap.Size(-5, 0)
            });  
             
             this._mkr = new CustomMarker(icon, point, {
                 className: 'eye_mrk',
                 click: function(){}
             });
             
             this._mkr.setDraggingEnabled(true);
             this.eyeMap.addOverlay(this._mkr);  
             this._mkr.addEventListener('dragend', $.proxy(this.markerDragEnd, this));
         }else{
             this._mkr.setPoint(point);
         }
    },
    markerDragEnd: function(){
        var point = this.eyeMap.getCenter();
        this.streetView.setPosition(point);
    },
    /*
     * 街景id发生变化时触发。
     */
    onPositionChanged:function(){
        var sv = this.streetView;
        var point = sv.getPosition();
        var addr = sv.getDescription();
        if(this.eyeMap){
            this.setEye(point); 
            this.eyeMap.centerAndZoom(point, 15);
        }
        
        this.setDayAndNigthMode();
        
        addr = addr || '未命名路段';
        
		var m = addr.match(/[^\x00-\xff]/ig);
        var s = m ? m.length : addr.length;
		//如果地址的长度超过14个中文字符的长度， 就直接截取。
		if(s > 14){
		    addr = addr.substring(0, 13) + '...';
		}
        $("#street-holder").find('.addr').text(addr);
    },
    /**
     * 街景图块加载完成的回调函数
     * 用来做性能统计
     */
    onTilesLoaded: function(){
        // if (this._updated) {
        //     var stPdc = Monitor.createPdc(PDC.DICT.ST_LOAD);
        //     stPdc.mark('c_st_load');
        //     stPdc.view_time();
        //     stPdc.ready(1);
        //     // console.log(Date.now() - window._stTime); // debug时间
        //     this._updated = false;
        // }
    },
    
    setDayAndNigthMode: function(){
        var rel = this.streetView.getRelevants(),
            data = rel && rel[0],
            $mode = $("#street-holder").find('.mode');
            
        if(data && data.mode && !this.maxStatus){
            var relMode = (data.mode === this.Str.DAY) ? 'day' : 'night';
            $mode.removeClass('night day');
            relMode ? $mode.show().addClass(relMode) : $mode.hide();
        }else{
            $mode.hide();
        }
    },

    updateStreetView: function() {
        var opts = url.get(); 
        var ssid = null;
        var point = null;
        var pov = {};
        var query = opts.query || {};
        
        this._updated = true;
        // 从其他界面进入先清空
        this.streetView.clear();

        if(query.ss_id){
            ssid = query.ss_id;
            if(query.ss_panoType &&
                query.ss_panoType != 'undefined' &&
                query.ss_panoType === 'inter'){
                this.streetView.setInnerId(ssid);
            }else{
                this.streetView.setId(ssid);
            }
        }else if(query.nb_x && query.nb_y){
            point = new BMap.Point(query.nb_x, query.nb_y);
            this.streetView.setPosition(point);
        }
        
		pov = this.streetView.getPov();
        if(query.ss_heading && query.ss_heading !== 'undefined'){
            pov.heading = parseFloat(query.ss_heading);
        }
        if(query.ss_pitch && query.ss_pitch !== 'undefined'){
            pov.pitch = parseFloat(query.ss_pitch);
        }
        this.streetView.setPov(pov);
    },
    sendStats:　function(code, params) {
        //util.addStat(code, $.extend({}, params || {}));
    }
};

module.exports = StreetViewControl;


});
