/**
 * @fileoverview nichenjian@gmail.com 调起客户端导航及web导航入口
 */
var naviBox = require('drive:widget/navi/navibox.js'),
    util    = require('common:static/js/util.js');

var naviControl = {
    bindEvent: function(){
        $('.gotonav').on('click', $.proxy(this.goTonav, this));
        $('a').on('click', $.proxy(this._hideNavBox, this));
    },
    //点击其他链接后，隐藏弹出层
    _hideNavBox: function(e){
        var target = e.target,
            a = $(target).closest('a');
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
            var _isTimeout = false;

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
                    url = 'http://mo.baidu.com/d/map/1321/bmap_andr_1321.apk';
                    me._showNavBox(url, naviUrl);  
                }        
            }, 1000);
        }else if(util.isIPhone() || util.isIPod()){
            url = 'http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8';
            this._showNavBox(url, naviUrl);
        }else if(util.isIPad()){
            url = 'https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681?ls=1&mt=8';
            this._showNavBox(url, naviUrl);
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
                        break
                    }
                }
                var e=convertor(aR,aU);
                var aR={lng: e.lng.toFixed(6),lat:e.lat.toFixed(6)};
                return aR
        }
}

module.exports = naviControl;
