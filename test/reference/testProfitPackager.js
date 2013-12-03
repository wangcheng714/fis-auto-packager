var File = require("../../lib/file.js"),
    profitPackager = require("../../lib/profitPackager.js");

//todo 正式版本去除到
var fis = require("C:/Users/wangcheng/AppData/Roaming/npm/node_modules/fis-cloud/node_modules/fis-cloud-kernel/fis-cloud-kernel.js");

var staticA = new File(
    "common:static/js/a.js",
    "js",
    "12345678",
    "/static/a/a_15ae23b.js",
    1089,
    ["a.js", "b.js"]
);

staticA.addPage("a.tpl", 100);
staticA.addPage("b.tpl", 100);
staticA.addPage("c.tpl", 100);
staticA.addPage("d.tpl", 100);

var staticB = new File(
    "common:static/js/b.js",
    "js",
    "12345678",
    "/static/b/b_15ae23b.js",
    867,
    ["a.js", "b.js"]
);

staticB.addPage("b.tpl", 100);
staticB.addPage("c.tpl", 100);
staticB.addPage("d.tpl", 100);

var staticC = new File(
    "common:static/js/c.js",
    "js",
    "12345678",
    "/static/c/c_15ae23b.js",
    867,
    ["a.js", "b.js"]
);

staticC.addPage("a.tpl", 100);
staticC.addPage("c.tpl", 100);
staticC.addPage("d.tpl", 100);

var staticD = new File(
    "common:static/js/d.js",
    "js",
    "12345678",
    "/static/d/d_15ae23b.js",
    867,
    ["a.js", "b.js"]
);

staticD.addPage("a.tpl", 100);
staticD.addPage("b.tpl", 100);
staticD.addPage("c.tpl", 100);
staticD.addPage("d.tpl", 100);

var staticE = new File(
    "common:static/js/e.js",
    "js",
    "12345678",
    "/static/e/e_15ae23b.js",
    867,
    ["a.js", "b.js"]
);

staticE.addPage("c.tpl", 100);
staticE.addPage("d.tpl", 100);

function testGetBenefit(){
    profitPackager.getBenefit(staticA,staticB);
}

//testGetBenefit();

function testGetLargestBenefit(){
    var resource = profitPackager.getLargestBenefit(staticA, [staticB, staticC, staticD, staticE]);
    console.log(resource);
}

//testGetLargestBenefit();

function testMergePackage(){
    var resources = [staticB, staticC, staticD, staticE],
        mergedStatics = [];
    mergedStatics = profitPackager.mergePackage(staticA, resources, mergedStatics);
    console.log(mergedStatics);
}
//testMergePackage();

