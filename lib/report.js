//todo : 是否需要产出收益分析文档报表
var util = require("./util.js");

/**
 * 产出页面使用静态资源情况的图表
 * @param resources : resource对象的数组
 * @param records : record对象的数组
 * @param outputDir : 产出的目录
 * @param projectName : 项目名称
 * @returns {string}
 */
module.exports.createStaticUrlMap = function(resources, records, outputDir, projectName){
    var csvAllHeader = " ,",
        csvAllBody = "",
        csvMainHeader = " ,",
        csvMainBody = "",
        main_file = outputDir + "/" + projectName + "/" + projectName +  "_StaticUrlMap_main.csv",
        all_file = outputDir + "/" + projectName + "/" + projectName +  "_StaticUrlMap.csv";
    for(var i=0; i<records.length; i++){
        if(records[i].get("pv") > 0){
            csvAllHeader += records[i].get("hash") + "_" + records[i].get("pv") + ",";
        }
        //同时产出一份儿pv大于一万的静态资源使用情况报表方便分析
        if(records[i].get("pv") > 10000){
            csvMainHeader += records[i].get("hash") + "_" + records[i].get("pv") + ",";
        }
    }

    for(id in resources){
        var resource = resources[id];
        if(resource.get("type") == "js"){
            csvAllBody += resource.get("id") + "_" + resource.get("pv");
            csvMainBody += resource.get("id") + "_" + resource.get("pv");
            for(var j=0; j<records.length; j++ ){
                if(records[j].get("pv") > 0){
                    var urlHash = records[j].get("hash"),
                        pages = resource.get("pages");
                    if(pages[urlHash]){
                        csvAllBody += ",1";
                    }else{
                        csvAllBody += ", ";
                    }
                }
                if(records[j].get("pv") > 10000){
                    var urlHash = records[j].get("hash"),
                        pages = resource.get("pages");
                    if(pages[urlHash]){
                        csvMainBody += ",1";
                    }else{
                        csvMainBody += ", ";
                    }
                }
            }
            csvAllBody += "\n";
            csvMainBody += "\n";
        }
    }
    util.write(all_file, csvAllHeader + "\n" + csvAllBody);
    util.write(main_file, csvMainHeader + "\n" + csvMainBody);
    return all_file;
}

/**
 * 打印出统计的Url的pv情况
 * @param records : record对象的数组
 * @param outputDir : 产出的目录
 * @param projectName : 项目名称
 * @returns {string}
 */
module.exports.printUrlPvs = function(records, outputDir, projectName){
    var urlPvs = [],
        urlStrs = "",
        infoFile = outputDir + "/" + projectName + "/" + projectName + "-url-pv.txt";
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
    return infoFile;
}

/**
 * 产出预测打包后的结果报表
 * @param records : record对象的数组
 * @param packResults :
 *      {
 *          "common_sync_js" : [resource,resource] : resource为打包后的静态资源
 *      }
 * @param outputDir : 产出的目录
 * @param projectName : 项目名称
 * @returns {*}
 */
module.exports.predictPackageResult = function(records, packResults, outputDir, projectName){
    var pageResults = {},
        predictFile;
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
    predictFile = printPackageResult(records, outputDir, projectName);
    return predictFile;
}

function printPackageResult(records, outputDir, projectName){
    var file = outputDir + "/" + projectName + "/" + projectName + "_packagePredict.csv",
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
        record.set("requestNum", num);
        recordStr += num + "," + totalSize + "," + packageStr + "," +  record.get("url") + "\n";
        resultStr += recordStr;
    });
    var totalPv = 0,
        requestCount = {},
        requestStr = "";
    util.map(records, function(index, record){
        if(!requestCount[record.get("requestNum")]){
            requestCount[record.get("requestNum")] = 0;
        }
        totalPv += parseInt(record.get("pv"));
        requestCount[record.get("requestNum")] += parseInt(record.get("pv"));
    });
    util.map(requestCount, function(num, pv){
        requestStr += "\nrequest num = " + num + " pv = " + pv + " percentage = " + Math.round((pv/totalPv) * 100) / 100;
    });
    util.write(file, resultStr + requestStr);
    return file;
}

