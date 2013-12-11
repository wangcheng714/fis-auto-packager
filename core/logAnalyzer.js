//todo ： 后续升级为每天定义下载分析数据

var Record = require("./record.js"),
    util = require("../lib/util.js"),
    request = require("request"),
    fs = require("fs");

function miniteDate(num){
    var date = new Date();
    var yesterday_milliseconds=date.getTime()-1000*60*60*24*num;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);
    var strYear = yesterday.getFullYear();
    var strDay = yesterday.getDate();
    var strMonth = yesterday.getMonth()+1;
    if(strMonth<10){
        strMonth="0"+strMonth;
    }
    if(strDay<10){
        strDay="0"+strDay;
    }
    datastr = strYear+"-"+strMonth+"-"+strDay;
    return datastr;
}

function processLogData(data, hashTable){
    var lines = data.split(/\n|\r\n/),
        records = [];
    for(var i=0; i<lines.length; i++){
        if(util.trim(lines[i]) != ""){
            var urlTokens = lines[i].split(/\s+|\t/),
                statics = urlTokens[2].split(/,/),
                syncDepsRes = [],
                asyncDepsRes = [];
            for(var j=0; j<statics.length; j++){
                var resource = hashTable[statics[j]];
                if(resource){
                    syncDepsRes.push(resource["name"]);
                    if(resource["res"]["deps"]){
                        syncDepsRes = syncDepsRes.concat(resource["res"]["deps"]);
                    }
                    if(resource["res"]["async"]){
                        asyncDepsRes = asyncDepsRes.concat(resource["res"]["async"]);
                    }
                }
            }
//todo : 新版数据结构需要重新整理
urlTokens[5] = urlTokens[4];
urlTokens[4] = "index/page/index.tpl";
            records.push(new Record(urlTokens[1], util.array_unique(syncDepsRes), util.array_unique(asyncDepsRes), urlTokens[3], urlTokens[4], urlTokens[5]));
        }
    }
    return records;
}

/**
 * 分析log日志生成records对象数组
 * @param callback
 * @param url
 * @param hashTable
 */
module.exports.analyzeLog = function(callback, url, hashTable){
    var logUrlPrefix = "http://logdata.baidu.com/?m=Data&a=GetData&token=ns_j0vmor9lig2czsfdk78ueqbh3yapw&product=ns&item=Fis_Static_Count&date=",
        logTime = miniteDate(7),
        logUrl = logUrlPrefix + logTime;
    if(url){
        logUrl = url;
    }
    request(logUrl, function(error, response, body){
        if(error){
            callback(error);
        }else{
            var records = processLogData(body, hashTable);
            callback(null, records);
        }
    });
}