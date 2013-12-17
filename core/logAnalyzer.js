//todo ： 后续升级为每天定时下载分析数据

var Record = require("./record.js"),
    util = require("../lib/util.js"),
    log = require("../lib/log.js"),
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

/**
 * 切分log日志，并进行容错处理，容错方案
 *      第一项 ： 通过log平台切分脚本保证永远是fid并且绝对存在  logId
 *      第二项 ； 十位hash值  pageHash
 *      第三项 ： 静态资源集合 逗号分割的七位hash值  data
 *      第四项 ： 数字pv值  pv
 *      第五项 ： 斜杠分割的路径tpl结尾  page
 *      第六项 ： http开头的url路径  url
 * @param urlLogLine : map_batman	1ab500ad37	524d8e8,e2f65bd,2a3f5c5,4c580b1	95	taxi/page/vip.tpl	http://taxi.map.baidu.com/vip
 */
function logSplite(urlLogLine){
    var urlTokens = urlLogLine.split(/\s+|\t+/),
        logToken = {},
        logMatchReg = /(\w{10})|(\w{7}(?:,\w{7})+)|(\d+)|(\w+(?:\/\w+)+\.(?:tpl|html|xhtml))|(https?:\/\/.*)/;

    logToken["fid"] = urlTokens.shift();
    for(var i=0; i<urlTokens.length; i++){
        var matchResult = urlTokens[i].match(logMatchReg);
        if(matchResult){
            if(matchResult[1]){
                logToken["pageHash"] = matchResult[1];
            }else if(matchResult[2]){
                logToken["data"] = matchResult[2];
            }else if(matchResult[3]){
                logToken["pv"] = matchResult[3];
            }else if(matchResult[4]){
                logToken["page"] = matchResult[4];
            }else if(matchResult[5]){
                logToken["url"] = matchResult[5];
            }
        }
    }
    return logToken;
}

function processLogData(data, hashTable){
    var lines = data.split(/\n|\r\n/),
        records = [];
    for(var i=0; i<lines.length; i++){
        if(util.trim(lines[i]) != ""){
            var lineTokens = logSplite(lines[i]);

            var    statics = lineTokens["data"].split(/,/),
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
            records.push(new Record(lineTokens["pageHash"], util.array_unique(syncDepsRes), util.array_unique(asyncDepsRes), lineTokens["pv"], lineTokens["page"], lineTokens["url"]));
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
    log.debug(" start [analyzeLog] " + url);
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
            log.debug(" end [analyzeLog] " + url);
            callback(null, records);
        }
    });
}