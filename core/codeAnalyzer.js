var File = require("./file.js"),
    util = require("../lib/util.js"),
    log = require("../lib/log.js"),
    gzip = require('gzip-js'),
    fs = require("fs");

var depsTable = {},
    handleingDeps = {};


function mergeDeps(deps1, deps2){
    if(deps1["deps"] || deps2["deps"]){
        deps1["deps"] = deps1["deps"] ? deps1["deps"].concat(deps2["deps"]) : deps2["deps"].concat(deps1["deps"]);
    }
    if(deps1["async"] || deps2["async"]){
        deps1["async"] = deps1["async"] ? deps1["async"].concat(deps2["async"]) : deps2["async"].concat(deps1["async"]);
    }
    return deps1;
}

/**
 * 递归获取一个文件依赖的所有资源
 * @param file : 文件id, 例如 ： addr:page/list.tpl
 * @param filetype : 文件的类型, async, deps ， deps表示同步，由于历史原因修改起来比较困难暂不修改
 * @param files : 所有的文件
 * @param {Boolean} save : 是否存贮
 * @returns {*} :  返回依赖的数组
 * @private
 */
function _getDeps(file, filetype, files, save){
    var deps = {};
    if(handleingDeps[file]){
        return {};
    }else if(depsTable[file] ){
        return depsTable[file];
    }else{
        var fileinfo = files[file];
        handleingDeps[file] = true;
        if(fileinfo){
            if(fileinfo["deps"]){
                for(var i=0; i<fileinfo["deps"].length; i++){
                    deps = mergeDeps(deps, _getDeps(fileinfo["deps"][i], "deps", files, deps, false));
                }
                if(filetype != "async"){
                    if(deps["deps"]){
                        deps["deps"] = deps["deps"].concat(fileinfo["deps"]);
                    }else{
                        deps["deps"] = fileinfo["deps"];
                    }
                }else{
                    if(deps["async"]){
                        deps["async"] = deps["async"].concat(fileinfo["deps"]);
                    }else{
                        deps["async"] = fileinfo["deps"];
                    }
                }
            }
            if(fileinfo["extras"] && fileinfo["extras"]["async"]){
                for(var i=0; i<fileinfo["extras"]["async"].length; i++){
                    deps = mergeDeps(deps, _getDeps(fileinfo["extras"]["async"][i], "async",  files, false));
                }
                if(deps["async"]){
                    deps["async"] = deps["async"].concat(fileinfo["extras"]["async"]);
                }else{
                    deps["async"] = fileinfo["extras"]["async"];
                }
            }
        }
        if(deps["deps"]){
            deps["deps"] =  util.array_unique(deps["deps"]);
        }
        if(deps["async"]){
            deps["async"] = util.array_unique(deps["async"]);
        }
        if(save){
            depsTable[file] = deps;
        }
        handleingDeps[file] = false;
        return deps;
    }
}

/**
 * 获取所有的静态资源
 *     1. 需要整站编译：因为需要静态分析依赖关系，分析common模块依赖关系时需要整站的map.json文件
 *     2. 返回所有的静态资源，不排除默认打包里的，后续预测打包结果需要使用所有的静态资源
 * @param dir : 编译后目录
 * @param hashTable :
 * @param defaultPackages : 产品线默认打包配置
 * @returns {{}}
 */
module.exports.getResource = function(dir, hashTable, defaultPackages){
    log.debug(" start [getResource] " + dir);
    var configDir = dir + "/config",
        autopackDir = dir + "/auto-pack";

    var configReg = /\w+\-map\.json$/,
        autopackReg = /\w+\-autopack\.json$/,
        configFiles = util.find(configDir, configReg),
        autopackJsons = util.find(autopackDir, autopackReg),
        configRes = {},
        files = {};

    if(configFiles.length > 0){
        for(var i =0; i<configFiles.length; i++){
            var config = util.readJSON(configFiles[i]),
                tmpRes = config["res"];
            configRes = util.merge(configRes, tmpRes);
        }

        createPackageMap(autopackJsons, defaultPackages);

        for(fileId in configRes){
            if(configRes.hasOwnProperty(fileId)){
                var fileProperty = configRes[fileId],
                    widgetPreg = /\w+\/widget\/.+\.tpl$/,
                    filepath;

                //widget page uri is different, so add template
                if(widgetPreg.test(fileProperty["uri"])){
                    filepath = dir + "/template/" + fileProperty["uri"];
                }else{
                    filepath = dir + "/" + fileProperty["uri"];
                }

                var content = util.read(filepath),
                    options = {
                        level: 6,
                        timestamp: parseInt(Date.now() / 1000, 10)
                    },
                    out = gzip.zip(content, options),
                    bakFile = filepath + ".bak";

                util.write(bakFile, new Buffer(out));

                var stat = fs.statSync(bakFile),
                    filesize = stat["size"],
                    deps = [];

                if(depsTable[fileId]){
                    deps = depsTable[fileId];
                }else{
                    deps = _getDeps(fileId, "deps", configRes, true);
                }
                hashTable[fileProperty["hash"]] = {
                    "res" : deps,
                    "name" : fileId
                };
                files[fileId] = new File(fileId, fileProperty["type"], fileProperty["hash"], fileProperty["uri"], filesize, deps);
            }
        }
    }
    log.debug(" end [getResource] " + dir);
    return files;
}

function createPackageMap(autopackJsons, defaultPackages){
    var keyIndex = 0;
    util.map(autopackJsons, function(index, autopackJson){
        var filename = autopackJson.split("/").pop();
            module = filename.split("-").shift();
        if(util.exists(autopackJson)){
            var packConf = util.readJSON(autopackJson)["pack"];

            //construct package table
            util.map(packConf, function(path, patterns){
                var pid = "p" + keyIndex;
                keyIndex++;
                if(typeof patterns === 'string' || patterns instanceof RegExp){
                    patterns = [ patterns ];
                }
                var packageKey = fixManualPkgkey(path, module);
                if(util.is(patterns, 'Array') && patterns.length){
                    defaultPackages[pid] = {
                        file : packageKey,
                        regs : patterns,
                        module : module
                    };
                }else{
                    log.error('invalid pack config [' + path + ']');
                }
            });
        }
    });
}

//添加模块名前缀，防止不同模块出现相同的filename
function fixManualPkgkey(filename, module){
    filename = filename.replace(/\/|\./g, "_");
    return module + "_" + filename;
}
