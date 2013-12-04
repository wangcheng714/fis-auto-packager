var util = require("./../lib/util.js");

var Record = function(hash, sync, async, pv, tpl, url){
    this.hash = hash;
    this.sync = sync;
    this.async = async;
    this.pv = pv;
    this.tpl = tpl;
    this.url = url;
    //去除async中已经存在sync中的资源
    this.async = remove_intersect(this.sync, this.async);
    //记录这个record需要使用哪些资源包
    this.packages = {};
}

Record.prototype.get = function(key){
    return this[key];
}

Record.prototype.set = function(key, value){
    this[key] = value;
}


function remove_intersect(array1, array2){
    for(var i=0; i<array1.length; i++){
        var index = util.array_search(array1[i], array2)
        if(index){
            array2.splice(index, 1);
        }
    }
    return array2;
}

module.exports = Record;
