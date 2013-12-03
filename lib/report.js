//todo : 是否需要产出收益分析文档报表
//todo : 代码正规化合理化
var util = require("./util.js");

module.exports.createCsvFile = function(resources, records){
    var csvHeader = " ,",
        csvBody = "",
        file = __dirname + "/../test/pack/staticUsed.csv";
    for(var i=0; i<records.length; i++){
        if(records[i].get("pv") > 0){
            csvHeader += records[i].get("hash") + "_" + records[i].get("pv") + ",";
        }
    }

    for(id in resources){
        var resource = resources[id];
        if(resource.get("type") == "js"){
            csvBody += resource.get("id");
            for(var j=0; j<records.length; j++ ){
                if(records[j].get("pv") > 0){
                    var urlHash = records[j].get("hash"),
                        pages = resource.get("pages");
                    if(pages[urlHash]){
                        csvBody += ",1";
                    }else{
                        csvBody += ", ";
                    }
                }
            }
            csvBody += "\n";
        }
    }
    util.write(file, csvHeader + "\n" + csvBody);
}

module.exports.printUrlPvs = function(records){
    var urlPvs = [],
        urlStrs = "",
        infoFile = __dirname + "/../test/pack/map-url-pv.txt";
    util.map(records, function(index, record){
        urlPvs.push({
            "url" : record.get("url"),
            "pv" : record.get("pv")
        });
    });
    urlPvs.sort(function(recordA, recordB){
        return recordB["pv"] - recordA["pv"];
    });
    util.map(urlPvs, function(index, record){
        urlStrs += "\n" + record["url"] + "\t" + record["pv"];
    });
    util.write(infoFile, urlStrs);
}

module.exports.predictPackageResult = function(records, packResults){
    var pageResults = {};
    util.map(packResults, function(packagePrefix, packages){
        util.map(packages, function(index, pack){
            var pages = pack.get("pages"),
                packageKey = packagePrefix + "_" + index;
            util.map(pages, function(pageHash, pv){
                if(!pageResults[pageHash]){
                    pageResults[pageHash] = {
                        "packages" : {}
                    }
                }
                pageResults[pageHash]["packages"][packageKey] = pack.get("size");
            });
        });
    });
    util.map(records, function(index, record){
        var hash = record.get("hash");
        if(pageResults[hash]){
            record.set("packages", pageResults[hash]["packages"]);
        }
    });
    printPackageResult(records);
    return records;
}

function printPackageResult(records){
    var file = __dirname + "/../test/pack/predictPackageResult.csv",
        resultStr = "tpl,hash,pv,req_num,size,detail,example\n";
    util.map(records, function(index, record){
        var packages = record.get("packages"),
            num = 0,
            totalSize = 0;
            recordStr = record.get("tpl") + "," + record.get("hash") + "," + record.get("pv") + ",",
            packageStr = "";
        util.map(packages, function(packageKey, size){
            packageStr += packageKey + ":" + Math.ceil(size) + "  ";
            totalSize += Math.ceil(size);
            num++;
        });
        recordStr += num + "," + totalSize + "," + packageStr + "," +  record.get("url") + "\n";
        resultStr += recordStr;
    });
    util.write(file, resultStr);
}

