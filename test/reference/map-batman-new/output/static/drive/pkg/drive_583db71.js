define('drive:widget/helper/maphelper.js', function(require, exports, module){

/**
 * @fileOverview 驾车地图逻辑
 */


var util        = require('common:static/js/util.js'),
    url         = require('common:widget/url/url.js'),
    mapConst    = require('common:static/js/mapconst.js'),
    appresize   = require('common:widget/appresize/appresize.js'),
    stat        = require('common:widget/stat/stat.js'),
    mapView,
    BMap;

// 从导航页面返回后 驾车底图页被浏览器缓存 需要监听pageshow 修改页面高度 by jican
$(window).on('pageshow', function(){
    appresize.update();
});

module.exports = {


    // 关键点标注
    keyMarkers : [],

    // 关键点坐标
    keyPoiInfos : [],

    // 转弯处标注
    directionMarkers : [],

    viewOpts : {margins: mapConst.ROUTE_MARGINS, enableAnimation: false},

    _currentStep : -1,

    _showAll : true,

    init : function(_BMap,_mapView,data) {
        mapView = _mapView;
        BMap = _BMap;
        this.map = mapView.getMap();
        this.renderMap(data);
    },

    /**
     * 外部使用的入口方法，渲染某条方案在地图上
     * @param {MapView} 地图视图实例
     * @param {Object} 原始的驾车路线规划数据
     * @param {Object} pageState
     * @param {Object} query
     */
    renderMap: function(data){
        // 处理地图
        // console.log('render map drive');
        // console.log(data);
        var urlParam = url.get(),
            query = urlParam.query || {},
            pageState = urlParam.pageState || {},
            step = -1, // 默认step为-1
            clearControl = mapView._clearControl,
            pageStatePart = {}, // 将query+pagestate(不包括vt参数)作为guid，防止添加相同的地图覆盖物
            newId = util.jsonToUrl(query)
                    + '|' 
                    + util.jsonToUrl(pageStatePart),
            curId = mapView.displayId;
            

        if (typeof pageState.step != 'undefined') {
            step = pageState.step * 1;
        }
        $.extend(pageStatePart, pageState);
        // 下面排除一些不应算作id的内容，以后可能还会添加
        delete pageStatePart['vt'];
        delete pageStatePart['step'];

        // if (newId != curId) {

            mapView.clearOverlays();
            
            this.map = mapView.getMap();
            this.removeCurrentOverlay();
            this._prepareData(data);
            // 添加路线站点
            mapView.addDriveRoute(this.routePoints);
            this.addDestPoi();
            // 设置视野
            this.setView(util.getBPoints(this.routeBounds));
            // 添加上一步下一步导航按钮
            mapView.getLineStepControl().show();
            // 设置信息窗口数据
            this.addPopInfoWin();
        //     mapView.displayId = newId;
        // }

        //获取清空按钮，并重置清空按钮的样式
        if(clearControl){
            clearControl.resetCleanBtn();
        }
        
        this.selectStep(step);

        //Fix me:传递数据给traffic controll。 显示跨城市路况事件的信息
        mapView.driveData = data;
        mapView._trafficControl && (mapView._trafficControl.driveData = data);
    },
    addDestPoi: function(){
        this.startMarker = mapView.addDestPoi(this.destPoints[0], mapConst.DEST_START);
        this.endMarker = mapView.addDestPoi(this.destPoints[1], mapConst.DEST_END);
        // 添加打开起点与终点click事件
        $(this.startMarker._div).on("touchend", this.getClickHandler(0));
        $(this.endMarker._div).on("touchend", this.getClickHandler(this.stepPoints.length - 2));
    },
    /**
     * 选择某条方案中具体的步骤
     * 需要在调用renderMap之后调用该方法
     * @param {number} 步骤索引
     * @return {boolean} 表示是否选择成功
     */
    selectStep: function(step){
        // 处理前进后退可用性
        mapView.getLineStepControl().ableBtn('pre');
        mapView.getLineStepControl().ableBtn('next');
        if (step <= 0) {
            mapView.getLineStepControl().disableBtn('pre');
        } else if (step >= this.stepPoints.length - 2) {
            mapView.getLineStepControl().disableBtn('next');
        }

        // console.log('selectStep: ' + step);
        // 只有查看完整方案时才会是-1
        // 但此时仍然需要打开第一个infoWindow，因此这里将currentStep改为0
        // 否则此时点击下一步索引会有问题
        if (step == -1) {
            this._showAll = true;
            this._currentStep = 0;
            return false;
        }
        if (step < 0 || step >= this.stepPoints.length - 1) {
            return false;
        }
        if (step == this._currentStep) {
            // 只将该点移动到中心位置
            if (this._showAll == false) {
                this.map.setCenter(util.getPointByStr(this.stepPoints[step].p));
                return;
            } else {
                this._showAll = false;
            }
        }
        
        var _currentZoomLevel = mapView._map.zoomLevel;
        this._currentStep = step;
        
        mapView.iwController.get(mapConst.IW_NAV).switchTo(step);

        this.highRoute(step);
        this.addDirectionMarker(step);           //添加转向POI
        this.showKeyPoi(step);
        //低分手机在横屏后点击上一步或下一步后，地图层级变成3，在这里检查一下然后进行重置层级
        if(mapView._map.zoomLevel <= 3){
            this.map.setZoom(_currentZoomLevel);
        }
        return true;
    },
    /**
     * lineCtrl的上一步
     * @return {boolean} 是否选择成功
     */
    pre: function(){
        return this.selectStep(this._currentStep - 1);
    },
    /**
     * lineCtrl的下一步
     * @return {boolean} 是否选择成功
     */
    next: function(){
        return this.selectStep(this._currentStep + 1);
    },
    /**
     * 准备数据
     * @param {Object} 原始数据
     */
    _prepareData: function(data){
        // 解析坐标
        this.stepPath = [];
        this.routePoints = []; // 完整路线的坐标点
        this.stepPath = []; // 分段坐标点
        this.routeBounds = [];
        this.destPoints = [];
        this.stepPoints = [];
        this.popInfos = [];
        var route = data.content.routes[0];  // 目前驾车进包含一条规划方案，直接获取第一个
        for (var i = 0; i < route.legs.length; i ++) {
            var leg = route.legs[i];
            for (var j = 0; j < leg.steps.length; j ++) {
                var step = leg.steps[j];
                // 获取当前step的路径坐标
                var geo = util.parse2Geo(step.path);
                this.stepPath.push(geo.points);
                this.routeBounds.push(geo.bound);
                // 完整的路径坐标
                this.routePoints = this.routePoints.concat(this.pointsStringToArray(geo.points));
                // step点坐标和方向
                this.stepPoints.push({
                    p: util.parse2Geo(step.start_location).points,
                    a: leg.steps[j].direction
                });
                this.popInfos.push({
                    content: leg.steps[j].instructions
                });
                if (i == route.legs.length - 1 && j == leg.steps.length - 1) {
                    // 最后一个leg的一个step要多加入一个step节点
                    this.stepPoints.push({
                        p: util.parse2Geo(step.end_location).points,
                        a: 12 // 12表示没有方向
                    });
                }
                if (step.pois.length > 0 && step.pois[0]) {
                    // 这里只取第一个途径关键点
                    this.keyPoiInfos[j] = {
                        points: util.parse2Geo(step.pois[0].location).points,
                        title: step.pois[0].name
                    };
                }
            }
        }
        // 解析起终点
        this.destPoints.push(data.result.start.pt);
        this.destPoints.push(data.result.end[data.result.end.length - 1].pt);
    },

    pointsStringToArray: function(points){
        var pointStrArr = points.split(';'),
            results = [];
        $.each(pointStrArr, function(index, item){
            var pointStr = item.split(',');
            results.push(new BMap.Point(pointStr[0], pointStr[1]));
        });
        return results;
    },

    /**
     * 添加气泡点信息
     */
    addPopInfoWin:function(){
        var ppoints = this.stepPoints, ppInfos = this.popInfos,  plen = ppoints.length;
        var iwOverlay = mapView.iwController.get(mapConst.IW_NAV);
        iwOverlay.setData(mapConst.IW_NAV, {
            json: this.popInfos,
            points: this.stepPoints
        }).switchTo(0);

        mapView.getLineStepControl().setIWCon(this);

        listener.on('infowindow.' + mapConst.IW_NAV, 'click', function (name, evt) {
            var id = evt.id;

            switch(id) {
                case 'iw-c':
                    // 跳入驾车列表
                    stat.addCookieStat(COM_STAT_CODE.MAP_IW_NAV_LIST);

                    url.update({
                        pageState: {
                            vt: 'list'
                        }
                    }, {});
                    break;
                default:
                    break;
            }
        });
    },
    getClickHandler:function(step){
        var me = this;
        return function(){
            // 路线节点marker点击量
            stat.addStat(COM_STAT_CODE.MAP_NAV_DIR_MARKER_CLICK);

            me.selectStep(step);
        }
    },
    /**
     * 点击步骤在气泡内显示步骤详情
     * @param {String}  i     方案索引
     * @param {String}  step  步骤索引
     */
    swiPop:function (i, step) {
        mapView.iwController.get(mapConst.IW_NAV).switchTo(step);
    },
    /**
     * 高亮路线
     * @param {String}  index   非聚合索引 
     * @param {String}  gindex  聚合索引
     * @param {DOM}     obj     事件派发对象
     * @param {Event}   e       事件对象
     */
    highRoute:function(step){
        var me = this;
        // 注意最后一个step是没有route的
        me.unselectRoute();
        if (me.routeBounds[step]) {
            var bps = [me.routeBounds[step]];
            var points = util.getBPoints(bps);
            me.setView(points);
            me.selectRoute(step);         //飘红当前线路
        }
    },
    addDirectionMarker: function(step){
        // 先移除之前的
        for (var i = 0; i < this.directionMarkers.length; i ++){
            this.map.removeOverlay(this.directionMarkers[i]);
        }
        this.directionMarkers = [];
        var dirMarker = mapView.addDirectionMarker(this.stepPoints[step].p, this.stepPoints[step].a);
        this.directionMarkers.push(dirMarker);
        var dirMarkerNext = mapView.addDirectionMarker(this.stepPoints[step + 1].p, this.stepPoints[step + 1].a);
        this.directionMarkers.push(dirMarkerNext);
        // 点击事件
        $(dirMarker._div).on("touchend", this.getClickHandler(step));
        $(dirMarkerNext._div).on("touchend", this.getClickHandler(step + 1));
    },
    /**
     * 给当前高亮路线飘红
     * @param {String} index  非聚合索引 
     */
    selectRoute:function(index){
        // console.log('select route: ' + index);
        var _this = this, ps = [];
        ps.push(_this.stepPoints[index].p);
        ps.push(_this.stepPath[index]);
        _this.redRoute = mapView.addDriveRoute(ps.join(";"));
        mapView.selectRoute(_this.redRoute);
    },
    /**
     * 显示重要地名、加油站、服务区
     * @param {number} step
     */
    showKeyPoi:function(step){
        // 先移除之前的
        for (var i = 0; i < this.keyMarkers.length; i ++){
            this.map.removeOverlay(this.keyMarkers[i]);
        }
        this.keyMarkers = [];
      
        var info = this.keyPoiInfos[step];
        if (info) {
            this.keyMarkers.push(mapView.addKeyPoiMarker(info.points, info.title, 0));
        }
    },
    setView:function (points) {
        mapView.setViewport(points, this.viewOpts);
    },
    // 移除换乘点POI
    removePoi:function () {
        // 关键poi标注
        for (var i = 0; i < this.keyMarkers.length; i++) {
            this.map.removeOverlay(this.keyMarkers[i]);
        }
        this.keyMarkers = [];
        // 方向标注
        for (var i = 0; i < this.directionMarkers.length; i ++){
            this.map.removeOverlay(this.directionMarkers[i]);
        }
        this.directionMarkers = [];
        // 起终点标注
        this.map.removeOverlay(this.startMarker);
        this.map.removeOverlay(this.endMarker);
    },
    removeRoute: function(){
        if (this.redRoute) {
            this.map.removeOverlay(this.redRoute);
            this.redRoute = null;
        }
        mapView.removeDriveRoute();
    },
    // 取消高亮线路选择
    unselectRoute:function () {
        if (this.redRoute){
            mapView.removeRoute(this.redRoute);
            this.redRoute = null;
        }
    },

    /**
     * 移除当前覆盖物
     */
    removeCurrentOverlay: function(){
        if (!mapView) {
            return;
        }
        this.removePoi();
        this.removeRoute();
        mapView.getLineStepControl().hide();
        mapView.iwController.get(mapConst.IW_NAV).hide();
        mapView.displayId = '';
    }
};

});
;define('drive:widget/navi/navibox.js', function(require, exports, module){

/**
 * @fileoverview nichenjian@gmail.com 导航弹出框 
 */
var Popup = require('common:widget/popup/popup.js'),
    util  = require('common:static/js/util.js');
/**
* 唤起导航客户端确认
*/
var naviBox = {

    // 跳转url
    navurl: "",
    // pop实例
    navOkBox: null,

    config: {
        width: 276,
        height: 126
    },

    main: $('#navOkBox'),

    // 显示box
    showTb: function(url, opts) {
        if(!url) return;

        var me = this,
            opts = opts || {};
        me.navurl = url;
        if($("#navOkBox")[0]) {
            $('#navOkBox').remove();
        }

        var htm = [];
        htm.push('<div id="navOkBox" class="navokbox">');
        htm.push('<div class="t"></div>');
        htm.push('<div  class="c">');
        htm.push('<div class="t1">'+ opts.description +'</div><div>');
        // htm.push('<button class="bt qx cancel-navokbox" >取消</button>');
        htm.push('<a href=' + $.trim(url) + '><button class="bt qd cancel-navokbox" >'+ opts.leftBtn +'</button></a>');
        htm.push('<a href=' + $.trim(opts.naviUrl) + '><button class="bt qd cancel-navokbox" >'+ opts.rightBtn +'</button></a>');
        htm.push('</div></div></div>');
        $('#wrapper').append(htm.join(''));
        //设置当前的弹出框位置
        me.setPos();
        me.bindEvent(opts);
    },

    bindEvent: function(opts){
      var me = this;
      $('button.cancel-navokbox').on('click', function(evt){
          evt.preventDefault();
          var target = evt.target,
              value = $.trim($(target).html()), 
              url = $(target).parent().attr('href'),
              num;

          if(value == '直接网页导航' && opts.leftBtn == '确定'){
              num = 1;
          }else if(value == '直接网页导航' && opts.leftBtn == '确定下载'){
              num = 2;
          }else if(value == '确定'){
              num = 3;
          }else if(value == '确定下载'){
              num = 4;
          }
          //用户选择导航的方式统计
          //util.addStat(STAT_CODE.STAT_NAVI_USER_CHOICE, {'choice': num});
          me.c(me);
          //添加200ms的延时，保证发出统计
          setTimeout(function(){
             location.href = url;
          }, 200);
      });

      listener.on('common','sizechange', function() {
          setTimeout(function() {
              me.setPos();
          }, 100);
      });
    },
    
    setPos: function(){
        var posx = (window.innerWidth - this.config.width) / 2;
        var posy = (window.innerHeight - this.config.height) / 2 + window.scrollY;
        $('#navOkBox').css({
           "left":  posx,
           "top": posy,
           "position": "absolute"
        });
    },
    // 取消操作
    c: function() {
        if($('#navOkBox')[0]) {
            $('#navOkBox').remove();
        }
    }
};

module.exports = naviBox;


});
;define('drive:widget/navi/navi.js', function(require, exports, module){

/**
 * @fileoverview nichenjian@gmail.com 调起客户端导航及web导航入口
 */
var naviBox = require('drive:widget/navi/navibox.js'),
    util    = require('common:static/js/util.js');

var naviControl = {
    
    bindNav : function(){
        $('#nav_go_nav').on('click', $.proxy(this.goTonav, this));
    },

    bindEvent: function(){
        $('.gotonav').on('click', $.proxy(this.goTonav, this));
        $('a').on('click', $.proxy(this._hideNavBox, this));
    },
    //点击其他链接后，隐藏弹出层
    _hideNavBox: function(e){
        var target = e.target,
            a = $(target).closest('a'),
            url = a.attr('href');
        e.preventDefault();

        if(url && url != ''){
            $('#navOkBox').hide();
            window.location.href = url;
        }
    },
    goTonav: function(){
        var me = this;
        var opts = {};
        var naviUrl = "http://daohang.map.baidu.com/mobile/#navi/naving/"+
                    util.jsonToQuery(window._APP_NAVI_QUERY) + "/vt=map&state=entry";
        //浮层展示总数
        //util.addStat(DRIVE_STAT_CODE.STAT_ALL_NAVI_POPUP_SHOW);

        if (util.isAndroid()) {
            var _isTimeout = false,
                url;

            util.getNativeInfo("com.baidu.BaiduMap", function(data) {
                if (data.error == 0 && _isTimeout === false) {
                    _isTimeout = true;
                    var startlocation = me.getLLpoint(window._APP_NAVI_QUERY.start);
                    var endlocation = me.getLLpoint(window._APP_NAVI_QUERY.endp);
                    var url = 'bdapp://map/direction?origin=' + startlocation +'&destination=' + endlocation + '&mode=navigation';
                    opts.description = '检测到您已安装百度地图，是否打开百度地图导航？';
                    opts.leftBtn = '确定';
                    opts.rightBtn = '直接网页导航';
                    opts.naviUrl = naviUrl;
                    naviBox.showTb(url, opts);
                    //util.addStat(DRIVE_STAT_CODE.STAT_INSTALL_NATIVE_SHOW);
                    return;
                }
            }, function() {});
            //请求1秒以后仍无结果，则认为超时
            setTimeout(function(){
                if(_isTimeout == false){
                    _isTimeout = true;
                    url = 'http://mo.baidu.com/map/code/?from=1321';
                    me._showNavBox(url, naviUrl);  
                }        
            }, 1000);
        }else if(util.isIPhone() || util.isIPod()){
            //url = 'http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8';
            //this._showNavBox(url, naviUrl);
            location.href = naviUrl;
        }else if(util.isIPad()){
            //url = 'https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681?ls=1&mt=8';
            //this._showNavBox(url, naviUrl);
            location.href = naviUrl;
        }else{
            //未知型号，提示下载android客户端
            url = 'http://mo.baidu.com/d/map/1321/bmap_andr_1321.apk';
            me._showNavBox(url, naviUrl);  
        }
    },
    _showNavBox: function(url, naviUrl){
        var opts = {};
        opts.description = '下载百度地图，免费导航，精准专业！';
        opts.leftBtn = '确定下载';
        opts.rightBtn = ' 直接网页导航';
        opts.naviUrl = naviUrl;
        naviBox.showTb(url, opts);      
    },
    getLLpoint : function(data){
        var tmp1 = data.split(',');
        var Lpoint = {
            lng:tmp1[0],
            lat:tmp1[1]
            };
        var LLpoint = this.convertMC2LL(Lpoint);
        
        var LLpoint = (LLpoint.lat +',' + LLpoint.lng);
        return LLpoint;
   },
   convertMC2LL : function (aR){
        function convertor(aR,aS){
            if(!aR||!aS){
                return
            }
            var e=aS[0]+aS[1]*Math.abs(aR.lng);
            var i=Math.abs(aR.lat)/aS[9];
            var aT=aS[2]+aS[3]*i+aS[4]*i*i+aS[5]*i*i*i+aS[6]*i*i*i*i+aS[7]*i*i*i*i*i+aS[8]*i*i*i*i*i*i;e*=(aR.lng<0?-1:1);
                aT*=(aR.lat<0?-1:1);
                return {
                    lng:e,lat:aT
                }
            }
            var aS,aU;
            aS={lng:Math.abs(aR.lng),lat:Math.abs(aR.lat)};
            for(var aT=0;aT<[12890594.86,8362377.87,5591021,3481989.83,1678043.12,0].length;aT++){
                    if(aS.lat>=[12890594.86,8362377.87,5591021,3481989.83,1678043.12,0][aT])
                    {aU=[[1.410526172116255e-8,0.00000898305509648872,-1.9939833816331,200.9824383106796,-187.2403703815547,91.6087516669843,-23.38765649603339,2.57121317296198,-0.03801003308653,17337981.2],[-7.435856389565537e-9,0.000008983055097726239,-0.78625201886289,96.32687599759846,-1.85204757529826,-59.36935905485877,47.40033549296737,-16.50741931063887,2.28786674699375,10260144.86],[-3.030883460898826e-8,0.00000898305509983578,0.30071316287616,59.74293618442277,7.357984074871,-25.38371002664745,13.45380521110908,-3.29883767235584,0.32710905363475,6856817.37],[-1.981981304930552e-8,0.000008983055099779535,0.03278182852591,40.31678527705744,0.65659298677277,-4.44255534477492,0.85341911805263,0.12923347998204,-0.04625736007561,4482777.06],[3.09191371068437e-9,0.000008983055096812155,0.00006995724062,23.10934304144901,-0.00023663490511,-0.6321817810242,-0.00663494467273,0.03430082397953,-0.00466043876332,2555164.4],[2.890871144776878e-9,0.000008983055095805407,-3.068298e-8,7.47137025468032,-0.00000353937994,-0.02145144861037,-0.00001234426596,0.00010322952773,-0.00000323890364,826088.5]][aT];
                        break;
                    }
                }
                var e=convertor(aR,aU);
                var aR={lng: e.lng.toFixed(6),lat:e.lat.toFixed(6)};
                return aR
        }
}

module.exports = naviControl;


});