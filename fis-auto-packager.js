
//todo : download shell copy old version
var codeAnalyzer = require("./core/codeAnalyzer.js"),
    logAnalyzer = require("./core/logAnalyzer.js"),
    packager = require("./packager/profitPackager.js"),
    packageReport = require("./lib/report.js"),
    util = require("./lib/util.js"),
    JsonUtil = require("./lib/jsonUtil.js"),
    fs = require("fs"),
    AdmZip = require('adm-zip'),
    zip = new AdmZip();

var resources = {},
    hashTable = {};


/**
 * @param resources
 *  数据结构 ：
 *      {"common_asnyc_js" : [pkg1,pkg2]}
 */
function createPackConf(resources, outputDir, projectName){
    var packResults = {};

    util.map(resources, function(packageKeyPrefix, packages){
        var tokens = packageKeyPrefix.split("_"),
            module = tokens[0],
            type = tokens[2];
        if(!packResults[module]){
            packResults[module] = {};
        }
        util.map(packages, function(index, pkgFile){
            var files = pkgFile.get("mergedStatic"),
                packageKey = "pkg/" + packageKeyPrefix + "_" + index + "." + type;

            packResults[module][packageKey] = [];

            util.map(files, function(index, file){
                packResults[module][packageKey].push(file.replace(/\w+:/, "/"));
            });

        })
    });

    util.map(packResults, function(module, packResult){
        var packStr = JsonUtil.convertToString(packResult),
            fileName = module + "/fis-pack.json";
        zip.addFile(fileName, new Buffer(packStr));
    });
    var zipFile = outputDir + "/" +  projectName + "/" + projectName + ".zip";
    zip.writeZip(zipFile);
    return zipFile;
}

//todo : 选择网络例如2G\3G\WIFI\PC等
/**
 * @param dir : 编译后的项目目录
 * @param outputDir : 打包结果产出目录
 * @param projectName : 项目名称
 * @param logUrl : 获取log日志的url
 * @param callback :  callback(error, result)
 */
module.exports.package = function(dir, outputDir, projectName, logUrl, callback){
    resources = codeAnalyzer.getResource(dir, hashTable);
    logAnalyzer.analyzeLog(function(error, records){
        var urlPvFile = packageReport.printUrlPvs(records, outputDir, projectName);
        for(var i=0; i<records.length; i++){
            var record = records[i],
                syncStatics = record.get("sync"),
                asyncStatics = record.get("async");

            for(var j=0; j<syncStatics.length; j++){
                var resource = resources[syncStatics[j]];
                if(resource){
                    resource.addPage(record.get("hash"), record.get("pv"));
                    resource.addPv(record.get("pv"));
                    //todo : 目前策略是优先考虑sync，是否需要改成根据sync和async的pv判断应该为哪一种类型？
                    resource.setLoadType("sync");
                }
            }
            for(var k=0; j<asyncStatics.length; k++){
                var resource = resources[asyncStatics[k]];
                if(resource){
                    resource.addPv(record.get("pv"));
                    resource.setLoadType("async");
                }
            }
        }
        var staticUrlMapFile = packageReport.createStaticUrlMap(resources, records, outputDir, projectName);
        var packageResults = packager.package(resources);
        var predictPackageResultFile = packageReport.predictPackageResult(records, packageResults, outputDir, projectName);
        var resultFile = createPackConf(packageResults, outputDir, projectName);
        var resultFiles = {
            "urlPv" : urlPvFile,
            "staticUrlMap" : staticUrlMapFile,
            "packagePredict" : predictPackageResultFile,
            "packageConf" : resultFile
        }
        callback(null, resultFiles);
    }, logUrl, hashTable);
}
