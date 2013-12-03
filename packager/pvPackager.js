
var util = require("../lib/util.js");

module.exports.package = function(resources){
    var newResources = partResources(resources);
    newResources = sortByPv(newResources);
    printResourcePv(newResources);
    _packageByPercentage(newResources);
    return newResources;
}

/**
 *  对静态资源进行分类 ： 分类依据
 *      module
 *      staticType : js\css\tpl
 *      loadType : sync,async
 * @param resources
 */
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

function countMerge(source1, source2, source3){
    var ver = (source1.get("pv") + source2.get("pv") + source3.get("pv")) / 3;
    var result  = Math.abs(Math.abs(Math.atan2(source3.get("pv")-source2.get("pv"), ver)) - Math.abs(Math.atan2(source2.get("pv")-source1.get("pv"), ver)));
    return result;
}

/**
 * 算法二 ： 计算两个静态资源之间的百分比
 * @param resources
 * @private
 */
function _packageByPercentage(resources){
    var countResult = {},
        packageReuslt = {};
    for(var packageKey in resources){
        if(resources.hasOwnProperty(packageKey)){
            if(resources[packageKey].length >= 2){
                var count = 0,
                    percentage = 0;
                packageReuslt[packageKey] = {};
                packageReuslt[packageKey][count] = [];
                packageReuslt[packageKey][count].push(resources[packageKey][0].get("id"));
                for(var i=1; i<resources[packageKey].length; i++){
                    percentage = (resources[packageKey][i-1].get("pv") - resources[packageKey][i].get("pv")) / resources[packageKey][i-1].get("pv");
                    if(isNaN(percentage) || percentage <= 0.3){
                        packageReuslt[packageKey][count].push(resources[packageKey][i].get("id"));
                    }else{
                        count++;
                        packageReuslt[packageKey][count] = [];
                        packageReuslt[packageKey][count].push(resources[packageKey][i].get("id"));
                    }
                }
            }else{
                packageReuslt[packageKey] = {};
                packageReuslt[packageKey][count] = [];
                packageReuslt[packageKey][count].push(resources[packageKey][0].get("id"));
            }
        }
    }
    console.log(packageReuslt);
}

function _packageBySlope(resources){
    var countResult = {},
        packageReuslt = {};
    for(var key in resources){
        if(resources.hasOwnProperty(key)){
            countResult[key] = [];
            if(resources[key].length >= 3){
                for(var i=1; i<resources[key].length-1; i++){
                    countResult[key].push({
                        "name" : resources[key][i].get("id"),
                        "value" : countMerge(resources[key][i+1],resources[key][i],resources[key][i-1])
                    });
                }
                var firstValue = countResult[key][0]["value"],
                    lastValue = countResult[key][countResult[key].length-1]["value"];
                countResult[key].unshift({
                    "name" : resources[key][0].get("id"),
                    "value" : firstValue
                });
                countResult[key].push({
                    "name" : resources[key][resources[key].length-1].get("id"),
                    "value" : lastValue
                });
            }else if(resources[key].length == 2){
                var rate = (resources[key][0].get("pv") - resources[key][1].get("pv")) / resources[key][0].get("pv");
                if(rate > 0.3){
                    countResult[key].push({
                        "name" : resources[key][0].get("id"),
                        "value" : 1
                    },{
                        "name" : resources[key][1].get("id"),
                        "value" : 1
                    });
                }else{
                    countResult[key].push({
                        "name" : resources[key][0].get("id"),
                        "value" : 0
                    },{
                        "name" : resources[key][1].get("id"),
                        "value" : 0
                    });
                }
            }else{
                countResult[key].push({
                    "name" : resources[key][0].get("id"),
                    "value" : 0
                });
            }

        }
    }
var resultStr = "";
for(var i=0; i<countResult["place_sync_js"].length; i++){
    resultStr += countResult["place_sync_js"][i]["name"] + "\t" + countResult["place_sync_js"][i]["value"] + "\n";
}
console.log(resultStr);
    for(var key in countResult){
        if(countResult.hasOwnProperty(key)){
            packageReuslt[key] = {};
            var count = 0;
            if(countResult[key].length >= 3){
                for(var j=0; j<countResult[key].length-1; j++){
                    if(countResult[key][j]["value"] < 0.3){
                        if(!packageReuslt[key][count]){
                            packageReuslt[key][count] = [];
                        }
                        packageReuslt[key][count].push(countResult[key][j]["name"]);
                    }else{
                        var pre = countResult[key][j-1]["value"],
                            next = countResult[key][j+1]["value"];

                        if(pre<next){
                            if(!packageReuslt[key][count]){
                                packageReuslt[key][count] = [];
                            }
                            packageReuslt[key][count].push(countResult[key][j]["name"]);
                            count++;
                        }else{
                            count++;
                            if(!packageReuslt[key][count]){
                                packageReuslt[key][count] = [];
                            }
                            packageReuslt[key][count].push(countResult[key][j]["name"]);
                        }
                    }
                }
                if(!packageReuslt[key][count]){
                    packageReuslt[key][count] = [];
                }
                packageReuslt[key][count].push(countResult[key][countResult[key].length-1]["name"]);
            }else if(countResult[key].length == 2){
                if(countResult[key][0].value > 0.3){
                    packageReuslt[key][0] = [];
                    packageReuslt[key][0].push(countResult[key][0]["name"]);
                    packageReuslt[key][1] = [];
                    packageReuslt[key][1].push(countResult[key][1]["name"]);
                }else{
                    packageReuslt[key][0] = [];
                    packageReuslt[key][0].push(countResult[key][0]["name"],countResult[key][1]["name"]);

                }
            }else{
                packageReuslt[key][0] = [];
                packageReuslt[key][0].push(countResult[key][0]["name"]);
            }

        }
    }
    console.log(packageReuslt);
}


function printResourcePv(resources){

    var file = __dirname + "/../test/pv.txt",
        resultStr = "";

    for(var key in resources){
        if(resources.hasOwnProperty(key)){
            resultStr += key + "\n";
            for(var i=0; i<resources[key].length; i++){
                resultStr += "\t" + resources[key][i].get("id") + "\t" + resources[key][i].get("pv") + "\n";
            }
        }
    }

    util.write(file, resultStr);
}
