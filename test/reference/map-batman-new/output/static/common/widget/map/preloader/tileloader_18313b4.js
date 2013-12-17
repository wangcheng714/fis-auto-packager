define('common:widget/map/preloader/tileloader.js', function(require, exports, module){

/**
 * 植入webapp核心代码中，预加载栅格或矢量地图数据,
 * 且针对矢量数据进行本地保存若干张, by wjp
 */
var TileLoader = {
     /**
      * 配置参数
      */
     Config: {      
        /**
         * 栅格域名池
         */
        rasterURLs: [
            "http://online0.map.bdimg.com/it/",
            "http://online1.map.bdimg.com/it/",
            "http://online2.map.bdimg.com/it/",
            "http://online3.map.bdimg.com/it/"
        ],
        /**
         * 矢量域名池
         */
        vectorURLs: [
            'http://online0.map.bdimg.com/gvd/?',
            'http://online1.map.bdimg.com/gvd/?',
            'http://online2.map.bdimg.com/gvd/?',
            'http://online3.map.bdimg.com/gvd/?'        
        ],
        /**
         * 瓦片尺寸
         */
        tileSize: 256,
        /**
         * 矢量数据key
         */
        vctMetaKey: 'vct_meta',
        /**
         * 矢量数据元数据，存储版本、存储的先后顺序
         */
        vctMeta: null,
        /**
         * 矢量数据最多存储瓦片张数
         */
        vctMaxNum: 100,
        /**
         * 满100张，删除最早保存的25张，留出空间给新进入的瓦片
         */
        vctDelNum: 25,
        /**
         * 矢量层结束级别，从18-12级
         */
        vectorMapLevel: 12
     },
    /**
     * 加载栅格或矢量数据
     * center: 中心点
     * zoom: 地图级别
     *  opts: {
     *      mapWidth: 地图宽度
     *      mapHeight: 地图高度
     *      dataType: 下载的数据类型，取值为, vector: 下载矢量; raster: 下载栅格。
     *  }    
     */
    loadTiles: function(center, zoom, opts){
        var _opts = opts || {},
            mapWidth = _opts.mapWidth || window.innerWidth,
            mapHeight = _opts.mapHeight || window.innerHeight,
            dataType = _opts.dataType || 'vector';
        
        var arrTiles = this.getCurViewTiles(center, zoom, mapWidth, mapHeight);
        if(dataType == 'vector' && zoom >= this.Config.vectorMapLevel){
            this.initVectorEnvOnce();
            this.loadVectorTiles(arrTiles); 
        } else {
            this.loadRasterTiles(arrTiles);
        }
    },
    /**
     * 获取当前视野内瓦片的行列号
     * center: 中心点
     * zoom: 地图级别
     * mapWidth: 地图宽度
     * mapHeight: 地图高度
     */
    getCurViewTiles: function(center, zoom, mapWidth, mapHeight){
        var tileSize = this.Config.tileSize,
            zoomUnits = Math.pow(2, 18 - zoom),
            levelUnits = zoomUnits * tileSize,
            row = Math.ceil(center.lng / levelUnits), 
            column = Math.ceil(center.lat / levelUnits),
            cell = [row, column, 
                    (center.lng - row * levelUnits) / levelUnits * tileSize, 
                    (center.lat - column * levelUnits) / levelUnits * tileSize],
            
            fromRow = cell[0] - Math.ceil((mapWidth / 2 - cell[2]) / tileSize),
            fromColumn = cell[1] - Math.ceil((mapHeight / 2 - cell[3]) / tileSize),
            toRow = cell[0] + Math.ceil((mapWidth / 2 + cell[2]) / tileSize),
            toColumn = cell[1] + Math.ceil((mapHeight / 2 + cell[3]) / tileSize); 

            return [fromRow, fromColumn, toRow, toColumn, zoom];
    },
    /**
     * 初始化矢量环境一次
     */
    initVectorEnvOnce: function(){
        if(this._initVectorEnv){
            return;         
        }
        this._initVectorEnv = true;
        
        //设置vct_meta的结构
        var ls = localStorage,
            metaKey = this.Config.vctMetaKey;
        if(!ls.getItem(metaKey)){
            var strVer36 = this.getVectorVersionInfo(true),
                metaValue = '{"v":"' + strVer36 + '","vcts":[]}';
            
            ls.setItem(metaKey, metaValue);
        }
        
        var meta = this.Config.vctMeta = JSON.parse(ls.getItem(metaKey));
        if(!meta){
            return;
        }

        var strVer36 = meta.v,
            vcts = meta.vcts,
            strNewVer36 = this.getVectorVersionInfo(true);
        
        //版本发生变化,清空全部数据
        if(strVer36 != strNewVer36){            
            try{
                for(var i = 0, l = vcts.length; i < l; i++){
                    ls.removeItem(vcts[i]);         
                }
            }catch(e){}

            meta.v = strNewVer36;
            vcts.length = 0;
        }
        
        //如果满100张，删除25张数据
        var maxNum = this.Config.vctMaxNum,
            delNum = this.Config.vctDelNum;
        if(vcts.length >= maxNum){
            var delVcts = vcts.splice(0, delNum);
            try{
                for(var i = 0, l = delVcts.length; i < l; i++){
                    ls.removeItem(delVcts[i]);
                }
            }catch(e){}
        }

        try{
            ls.setItem(metaKey, JSON.stringify(meta)); //序列化meta到ls中
        }catch(e){}
    },
    /**
     * 加载矢量数据
     * arrTiles: 下载瓦片的起始数据参数
     */
    loadVectorTiles: function(arrTiles){
        var fromRow = arrTiles[0], 
            fromColumn = arrTiles[1], 
            toRow = arrTiles[2], 
            toColumn = arrTiles[3],
            zoom = arrTiles[4];     
        
        for (var i = fromRow; i < toRow; i++) {
            for (var j = fromColumn; j < toColumn; j++){
                this.loadVectorData(i, j, zoom);
            }
        }               
    },
    /**
     * 加载矢量数据
     * col: 行号
     * row: 列号
     * zoom: 级别
     */
    loadVectorData: function(col, row, zoom){
        var me = this,
            URLs = me.Config.vectorURLs,
            versionInfo = me.getVectorVersionInfo(),
            ver = versionInfo.ver,
            udt = versionInfo.udt;          

        var rndNum = (col + row) % URLs.length,
            url = URLs[rndNum],
            cbkName = '_' + parseInt(col + '' + row + '' + zoom).toString(36),
            vectorDataKey = 'vct' + cbkName;

        //如果localStorage中存在所需的瓦片，则不发送请求
        //因为其值字串比较长，所以循环遍历其key
        var ls = localStorage;
        for(var i = 0, l = ls.length; i < l; i++){
            var strKey = ls.key(i);
            if(strKey == vectorDataKey){
                return;
            }
        }
        
        url += 'qt=lgvd&layers=bg,df&' + "x=" + col + "&y=" + row + "&z=" + zoom
            + '&styles=pl&f=mwebapp&v=' + ver + '&udt=' + udt + '&fn=window.' + cbkName;

        window[cbkName] = function(json){
            var content = json.content;
            if(content){
                var bg = content['bg'] || [],
                    df = content['df'] || [],
                    all = bg.concat(df),
                    vectorData = JSON.stringify(all);               
                try{
                    var vctMeta = me.Config.vctMeta,
                        vctMetaKey = me.Config.vctMetaKey;
                    
                    if(vctMeta && vctMeta.vcts.length < me.Config.vctMaxNum){
                        vctMeta.vcts.push(vectorDataKey);
                        
                        localStorage.setItem(vctMetaKey, JSON.stringify(vctMeta));                  
                        localStorage.setItem(vectorDataKey, vectorData);                    
                    }
                }catch(e){}
            }
            delete window[cbkName];
        };

        me.request(url);
    },
    /**
     * 获取矢量数据的版本信息，根据参数返回不同数据类型
     * is36Str: true返回36进制的字串,否则返回版本信息对象
     */
    getVectorVersionInfo: function(is36Str){
        var vectorVer = (typeof TVC != 'undefined') ? TVC.api_for_mobile.vector : {},
            ver = vectorVer.version ? vectorVer.version : '001',
            udt = vectorVer.updateDate ? vectorVer.updateDate : '20130501';

        if(is36Str === true){
            return parseInt(udt + ver).toString(36);    
        } else {        
            return {'ver': ver, 'udt': udt};
        }
    },
    /**
     * 发送请求
     * url: 数据url
     */
    request: function(url){
        var s = document.createElement('script');
        s.src = url;
        
        // 脚本加载完成后进行移除
        if(s.addEventListener){
            s.addEventListener('load', function(e) {
                var t = e.target;
                t.parentNode.removeChild(t);            
            }, false);
        }
        document.getElementsByTagName('head')[0].appendChild(s);
        s = null;        
    },
    /**
     * 加载栅格数据
     * arrTiles: 下载瓦片的起始数据参数
     */
    loadRasterTiles: function(arrTiles){
        var fromRow = arrTiles[0], 
            fromColumn = arrTiles[1], 
            toRow = arrTiles[2], 
            toColumn = arrTiles[3],
            zoom = arrTiles[4];
            
        var URLs = this.Config.rasterURLs,
            rasterVer = (typeof TVC != 'undefined') ? TVC.webapp.lower_normal : {},
            ver = rasterVer.version ? rasterVer.version : '014',
            udt = rasterVer.updateDate ? rasterVer.updateDate : '20130501';
        
        for (var i = fromRow; i < toRow; i++) {
            for (var j = fromColumn; j < toColumn; j++){
                var rndNum = (i + j) % URLs.length,
                    url = URLs[rndNum];

                url += 'u=x=' + i + ';y=' + j + ';z=' + zoom + ';' 
                    + 'v=' + ver + ';type=web&fm=42&f=webapp&format_add=.jpg';
                
                var img = new Image();
                img.src = url;              
            }
        }       
    }
};

module.exports = TileLoader;

});