
var util = require("./../lib/util.js");

/**
 *
 * @param id
 * @param type 文件类型
 * @param hash
 * @param url
 * @param size
 * @param deps
 * @constructor
 */
var File = function(id, type, hash, url, size, deps){
    this.id = id;
    this.type = type;
    this.hash = hash;
    this.url = url;
    this.deps = deps;

    this.size = fixStaticSize(size);
    this.pages = {};
    this.loadType = "";
    this.pv = 0; //pv 表示为资源理论应该被被下载的次数
    var result = parseId(id);
    if(result){
        this.module =result["module"];
        this.subpath =result["subpath"];
    }
    this.mergedStatic = [id];
    this.benefit = 0;
    //packageType 有两种类型 ： 手动和自动，手动的为产品线自定义的不需要产出管理， 默认为auto
    this.packageType = "auto";
};

function parseId(id){
    var modulePreg = /(\w+):([^:]*)/,
        matchResult = id.match(modulePreg);
    if(matchResult){
        return {
            module : matchResult[1],
            subpath : "/" + matchResult[2]
        };
    }
    return null;
}

function fixStaticSize(size){
    var size =  size / 1024;
    return size;
}

File.prototype.addPage = function(hash, pv){
    //会出现hash相同的情况，所以pv需要累加
    if(this.pages[hash]){
        this.pages[hash] += pv;
    }else{
        this.pages[hash] = pv;
    }
}

File.prototype.addPv = function(value){
    this.pv += parseInt(value);
};

// loadType : sync和async, sync模式优先考虑
File.prototype.setLoadType = function(loadType){
    if(this.loadType != "sync"){
        this.loadType = loadType;
    }
}

/**
 * 合并静态资源 ：
 *   id ：
 *   size ： 相加
 *   pages ： 取并集
 *   pv ： pages并集的累加
 *   benefit ： 各自benefit + 合并benefit
 *   mergedStatic ： 数组合并排重
 *   loadType : 合并前已经按照loadType进行了分组，所以loadType都是相同不需要处理
 *   deps ： 不影响打包暂时不考虑
 * @param fileB
 * @param benefit
 */
File.prototype.mergeStatic = function(fileB, benefit){
    this.size = this.size + fileB.get("size");
    this.pages = util.merge(this.pages, fileB.get("pages"));
    this.pv = 0;
    util.map(this.pages, function(page, pv){
        this.pv = parseInt(this.pv) + parseInt(pv);
    }.bind(this));
    this.benefit += fileB.get("benefit") + benefit;
    this.mergedStatic = util.array_unique(this.mergedStatic.concat(fileB.get("mergedStatic")));
    var idTokens = fileB.get("id").split("/"),
        name = idTokens.pop();
    this.id = this.id + "_" + name;
}

File.prototype.get = function(key){
    return this[key];
}

File.prototype.set = function(key, value){
    this[key] = value;
}

module.exports = File;
