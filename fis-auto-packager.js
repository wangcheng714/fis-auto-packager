
var codeAnalyzer = require("./core/codeAnalyzer.js"),
    logAnalyzer = require("./core/logAnalyzer.js"),
    packager = require("./packager/profitPackager.js"),
    packageReport = require("./lib/report.js"),
    util = require("./lib/util.js"),
    log = require("./lib/log.js"),
    JsonUtil = require("./lib/jsonUtil.js"),
    fs = require("fs"),
    AdmZip = require('adm-zip'),
    zip = new AdmZip();

/**
 * hashTable :
 */
var resources = {},
    defaultPackages = {},
    hashTable = {};


/**
 * @param resources
 *  数据结构 ：
 *      {"common_asnyc_js" : [pkg1,pkg2]}
 */
function createPackConf(resources, sourceDir, outputDir, moduels, projectName){
    var packResults = {};

    util.map(resources, function(packageKeyPrefix, packages){
        //这里注意对于生成的packageKeyPrefix是是有格式要求的：第一个是module，最后一个是type
        var tokens = packageKeyPrefix.split("_"),
            module = tokens[0],
            type = tokens[tokens.length-1];
        //只产出指定的模块
        if(util.in_array(module, moduels)){
            if(!packResults[module]){
                packResults[module] = {};
            }
            util.map(packages, function(index, pkgFile){
                //对于自定义包 ： 使用用户原生配置不再自动生成，可以保证自定义包的顺序
                if(pkgFile.get("packageType") != "manual"){
                    var files = pkgFile.get("mergedStatic"),
                        packageKey = "pkg/" + packageKeyPrefix + "_" + index + "." + type;

                    packResults[module][packageKey] = [];

                    util.map(files, function(index, file){
                        packResults[module][packageKey].push(file.replace(/\w+:/, "/"));
                    });
                }
            });
        }
    });

    util.map(packResults, function(module, packResult){
        var autopackJson = sourceDir + "/auto-pack/" + module + "-autopack.json";
        if(util.exists(autopackJson)){
            //因为自动打包里面已经排除了所有的manual文件，所以它的先后顺序不影响打包结果
            var conf = util.readJSON(autopackJson),
                packConf = conf["pack"];
            packResult = util.merge(packConf, packResult);
        }
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
 * @param sourceDir : 编译后的项目目录
 * @param outputDir : 打包结果产出目录
 * @param projectName : 项目名称
 * @param modules : 所有需要计算打包的模块名
 * @param staticType : staticTypes  需要打包的静态资源 数组 如js、css
 * @param logUrl : 获取log日志的url
 * @param callback :  callback(error, result)
 */
module.exports.package = function(sourceDir, outputDir, projectName, modules, staticType, logUrl, callback){
    resources = codeAnalyzer.getResource(sourceDir, hashTable, defaultPackages);
    logAnalyzer.analyzeLog(function(error, records){
        if(error){
            callback(error, null);
        }else{
            var resultFiles = null;
            try{
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
                //资源过滤需要在打包阶段来做，getResource阶段需要拿到完整的列表分析文件间的依赖关系
                var packageResults = packager.package(resources, staticType, defaultPackages);
                var predictPackageResultFile = packageReport.predictPackageResult(records, packageResults, outputDir, projectName);
                var resultFile = createPackConf(packageResults, sourceDir, outputDir, modules, projectName);
                resultFiles = {
                    "urlPv" : urlPvFile,
                    "staticUrlMap" : staticUrlMapFile,
                    "packagePredict" : predictPackageResultFile,
                    "packageConf" : resultFile
                }
            }catch(error){
                callback(error, null);
            }
            callback(null, resultFiles);
        }
    }, logUrl, hashTable);
}
