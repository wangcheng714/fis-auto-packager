/**
 * FAQ :
 *  1. 两个静态资源合并收益计算时为什么不用考虑依赖关系？
 *      模型采用动态规划算法，正常计算依赖一定会和资源本身合并到一起，因为收益必然是最大的
 */

//todo : modjs需要做特殊处理
var benefitMap = {},
    File = require("../core/file.js"),
    util = require("../lib/util.js");

var RTT = 2,  //round trip time 不能包含建立tcp链接的时间，因为http 1.1都是用了 keep-alive 没有tcp建立的开销
    SPEED = 20,
    benefitMap = {};

module.exports.package = function(resources, defaultPackages){

    var manualResult = mergeDefaultPackage(resources, defaultPackages);
    var newResources = partResources(resources),
        autoResult = {};

    newResources = sortByPv(newResources);
    fixModjs(newResources);

    util.map(newResources, function(packageKey, partResource){
        var packageResult = [];
        if(packageKey == "common_sync_js"){

//            apphistory : 57  poisearch :  56  highlight : 53   quickdelete : 54  renderlist :  50  sendrequest :  51  suggestion :  52
//            searchdata :  55    cover :   66   header :   59   setcity :  58
//            partResource[50].mergeStatic(partResource[51]);
//            partResource[50].mergeStatic(partResource[52]);
//            partResource[50].mergeStatic(partResource[53]);
//            partResource[50].mergeStatic(partResource[54]);
//            partResource[50].mergeStatic(partResource[55]);
//            partResource[50].mergeStatic(partResource[57]);
//
//            partResource[55].mergeStatic(partResource[56]);
//            partResource[55].mergeStatic(partResource[58]);
//            partResource[55].mergeStatic(partResource[59]);
//
//            var benefitOne = getBenefit(partResource[50], partResource[55]);
        }
        if(partResource.length >= 2){
            autoResult[packageKey] = mergePackage(partResource.shift(), partResource, packageResult);
        }else{
            autoResult[packageKey] = [partResource.pop()];
        }
    });
    util.merge(autoResult, manualResult);
    return autoResult;
}

function fixModjs(newResources){
    util.map(newResources, function(key, resources){
        for(var i=0; i<resources.length; i++){
            var subpath = resources[i].get("subpath");
            if(subpath.match(/mod\.js$/)){
                resources[i].set("pv", resources[0].get("pv"));
                resources[i].set("pages", resources[0].get("pages"));
                var results = resources.splice(i, 1); //删除mod.js独享
                resources.unshift(results[0]);
                break;
            }
        }
    });
}

function hit(resource, defaultPackages){
    var type = resource.get("type"),
        subpath = resource.get("subpath"),
        module = resource.get("module");
    if(type == "js" || type == "css"){
        for(var key in defaultPackages){
            var conf = defaultPackages[key];
            if(conf["module"] == module){
                var regs = conf["regs"];
                for(var i = 0, len = regs.length; i < len; i++){
                    var reg = regs[i];
                    if(reg && util.filter(subpath, reg)){
                        return conf["file"];
                    }
                }
            }
        }
    }
    return false;
};

function mergeResources(resources){
    var originResource = resources.shift();
    util.map(resources, function(index, resource){
        originResource.mergeStatic(resource, 0);
    });
    return originResource;
}


function mergeDefaultPackage(resources, defaultPackages){
    var manualPackages = {},
        deleteResource = [],
        manualResult = {};
    util.map(resources, function(index, resource){
        var key = hit(resource, defaultPackages);
        if(key){
            if(!manualPackages[key]){
                manualPackages[key] = [];
            }
            manualPackages[key].push(resource);
            deleteResource.push(index);
        }
    });
    util.map(manualPackages, function(file, mergeFiles){
        var mergedFile = {};
        if(mergeFiles.length >= 2){
            mergedFile = mergeResources(mergeFiles);
        }else{
            mergedFile = mergeFiles[0];
        }
        var packageKey = file;
        mergedFile.set("id", file);
        mergedFile.set("packageType", "manual");
        manualResult[packageKey] = [];
        manualResult[packageKey].push(mergedFile);
    });
    for(var i=0; i<deleteResource.length; i++){
        delete(resources[deleteResource[i]]);
    }
    return manualResult;
}

function partResources(resources){
    var newResources = {};
    for(var id in resources){
        var resource = resources[id];
        //排除掉非 js和css的文件
        if(resources.hasOwnProperty(id) && resource.get("module") && (resource.get("type") == "js" || resource.get("type") == "css")){
            if(resource.get("loadType") == ""){
                resource.setLoadType("sync");
            }
            var partKey = resource.get("module") + "_" + resource.get("loadType") + "_" + resource.get("type");
            if(!newResources[partKey]){
                newResources[partKey] = [];
            }
            newResources[partKey].push(resource);
        }
    }
    return newResources;
}


function sortByPv(resources){
    for(var key in resources){
        if(resources.hasOwnProperty(key)){
            resources[key].sort(function(a, b){
                return b.get("pv") - a.get("pv");
            });
        }
    }
    return resources;
}

/**
 * 计算两个静态资源合并的收益
 *      计算收益 ：
 *          找到两个静态资源的公共page，计算节省的请求数，转化为时间
 *      计算损失 ：
 *          计算 a-b的差值 遍历计算浪费的b的字节数
 *          计算 b-a的差值 遍历计算浪费的a的字节数
 *          浪费字节数/网速 计算出浪费的时间
 * @param staticA
 * @param staticB
 */
function getBenefit(staticA, staticB){
    if(benefitMap[staticA.get("id") + staticB.get("id")]){
        return benefitMap[staticA.get("id") + staticB.get("id")];
    }
    //计算收益
    var commonPages = util.array_intersect_key(staticA.get("pages"), staticB.get("pages")),
        commonPv = 0,
        benefitTime = 0;
    util.map(commonPages, function(page, pagePv){
        commonPv = commonPv + parseInt(pagePv);
    });
    benefitTime = commonPv * RTT;

    //计算损失
    var singleAPages = util.array_diff_key(staticA.get("pages"), staticB.get("pages")),
        singleBPages = util.array_diff_key(staticB.get("pages"), staticA.get("pages")),
        wasteStaticA = 0,
        wasteStaticB = 0,
        wasteTime = 0;
    util.map(singleAPages, function(page, pagePv){
        wasteStaticB = wasteStaticB + parseInt(pagePv) * parseFloat(staticB.get("size"));
    });
    util.map(singleBPages, function(page, pagePv){
        wasteStaticA = wasteStaticA + parseInt(pagePv) * parseFloat(staticA.get("size"));
    });
    wasteTime = (wasteStaticA + wasteStaticB) / SPEED;

    //最终收益
    var finalBenefit = benefitTime - wasteTime;
    benefitMap[staticA.get("id") + staticB.get("id")] = finalBenefit;

    return finalBenefit;
}

// module.exports.getBenefit = getBenefit;

/**
 * 返回合并收益最大的资源以及收益 : 从上述算法中可以分析出没有没有损失的合并一定是收益最大的，所以不用单独考虑没有损失的资源合并情况
 * @param staticA
 * @param {Array} resources
 */
function getLargestBenefit(staticA, resources){
    var largestBenefit = 0,
        largestResource = null,
        resourceIndex = null;
    util.map(resources, function(index, resource){
        if(staticA.get("id") != resource.get("id")){
            var tmpBenefit = getBenefit(staticA, resource);
            if(tmpBenefit >= largestBenefit){
                largestBenefit = tmpBenefit;
                largestResource = resource;
                resourceIndex = index;
            }
        }
    });
//todo : 记录打包的过程
if(staticA.get("module") == "common" && staticA.get("type") == "js" && largestResource != null){
    console.log(staticA.get("id") + " and " + largestResource.get("id") + " merged benefit is = " + largestBenefit);
}
    return {
        "benefit" : largestBenefit,
        "resource" : largestResource,
        "index" : resourceIndex
    };
}

//module.exports.getLargestBenefit = getLargestBenefit;

/**
 *
 * @param originStatic
 * @param {Array} resources
 * @param mergedStatics
 */
function mergePackage(originStatic, resources, mergedStatics){
    var mergeResult = getLargestBenefit(originStatic, resources),
        oldMergeStatic = mergeResult["resource"],
        oldMergeBenefit = mergeResult["benefit"],
        oldStaticIndex = mergeResult["index"];

    if(oldMergeStatic == null){ //没有找到适合合并的静态资源
        mergedStatics.push(originStatic);
        if(resources.length >= 2){
            var originStatic = resources.shift();
            mergePackage(originStatic, resources, mergedStatics);
        }else if(resources.length == 1){
            mergedStatics.push(resources.pop());
        }
    }else{ //找到适合合并的静态资源
        var newMergeResult = getLargestBenefit(oldMergeStatic, resources),
            newMergeStatic = newMergeResult["resource"],
            newMergeBenefit = newMergeResult["benefit"],
            newStaticIndex = newMergeResult["index"];



        if(newMergeBenefit > oldMergeBenefit){
            //首先移除后面item,否则会导致误删除其他的item
            if(newStaticIndex > oldStaticIndex){
                resources = util.removeByIndex(resources, newStaticIndex);
                resources = util.removeByIndex(resources, oldStaticIndex);
            }else{
                resources = util.removeByIndex(resources, oldStaticIndex);
                resources = util.removeByIndex(resources, newStaticIndex);
            }
            oldMergeStatic.mergeStatic(newMergeStatic, newMergeBenefit);
            resources.push(oldMergeStatic);
            mergePackage(originStatic, resources, mergedStatics);
        }else{
            originStatic.mergeStatic(oldMergeStatic, oldMergeBenefit);
            resources = util.removeByIndex(resources, oldStaticIndex);
            mergePackage(originStatic, resources, mergedStatics);
        }
    }
    return mergedStatics;
}

//module.exports.mergePackage = mergePackage;