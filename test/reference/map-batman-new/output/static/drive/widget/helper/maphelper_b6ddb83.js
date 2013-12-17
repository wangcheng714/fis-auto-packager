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