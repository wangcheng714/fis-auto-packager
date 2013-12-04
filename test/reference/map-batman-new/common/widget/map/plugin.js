/**
 * webapp的插件，此代码嵌入到webapp模块中，目的是提前下载矢量模块，使用户更早看到图。
 */

/**
 * 下载异步文件url
 */
var url = '/mobile/?qt=getMobileModules&v=2&';
/**
 * 矢量模块版本号
 */
var vectorMdlVer = {
    'tile': 'uhunrl',
	'vector': 'besg3a'
};
/**
 * 发送请求
 * url: 异步模块url
 */
function request(url, opts){
    var s = document.createElement('script');
    s.src = url;
    
    // 脚本加载完成后进行移除
    if (s.addEventListener){
      s.addEventListener('load', function(e) {
        var t = e.target;
        t.parentNode.removeChild(t);
        if(opts && opts.from=='app' && opts.cbk) {
            opts.cbk && opts.cbk();
        }
      }, false);
    }
    document.getElementsByTagName('head')[0].appendChild(s);
    s = null;        
}

var apiPlugin = {
    mainReady : false,
    lazyReady : false,
    isPreLoaded: false,//是否在webapp非地图页已经下载了
    /** 
     * 获取矢量相关的代码，提前保存到localStorage中
     */
    getVectorMdl : function(opts){

        opts = opts || {};


        if(this.isPreLoaded){
            return;
        }
        //检查localStorage中是否存在vectorMdlVer版本的vector模块，
        //如果不存在，就去服务端下载最新的版本         
        try{
            var downLoadMdls = [],
                ls = window.localStorage;
            for(var mdl in vectorMdlVer){
                var mdlVer = 'async_' + mdl + '_' + vectorMdlVer[mdl],
                    shortMdlVer = mdl + '_' + vectorMdlVer[mdl];
                if(!ls[mdlVer] || ls[mdlVer].length <= 0){
                    downLoadMdls.push(shortMdlVer);    
                }
            }

            if(downLoadMdls.length > 0){
                this.isPreLoaded = true;//标识已经加载了
                var reqUrl = url + 'mod=' + downLoadMdls.join(',') + '&cbk=preLoadVec';
                request(reqUrl, opts);
            } else {
                if(opts && opts.from=='app' && opts.cbk) {
                    opts.cbk && opts.cbk();
                }
            }
        }catch(e){}        
    }    
}

/*
 * 回调函数,将下载的异步文件保存
 * modName: 异步模块名称
 * modCode: 异步模块代码
 */
window.preLoadVec = function(modName, modCode){
    try{
        if(!modCode){
            return;
        }
        var ls = window.localStorage,
            mdlVer = 'async_' + modName,
            oldPrefix = 'async_' + modName.split('_')[0];

        //根据旧的前缀，删除之前的旧版本文件                
        for(var l = ls.length, i = l - 1; i >= 0; i--){
          var strKey = ls.key(i);                  
          if(strKey.indexOf(oldPrefix) > -1){
            ls.removeItem(strKey);                    
          }                  
        }                
        ls.setItem(mdlVer, modCode); //保存代码  

    }catch(e){}
}

module.exports = apiPlugin;