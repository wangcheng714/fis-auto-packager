
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
staticC.addPage("e.tpl", 100);


function testMergeStatic(){
    staticB.mergeStatic(staticC, 200);
    staticA.mergeStatic(staticB, 100);
    console.log(staticA);
}
testMergeStatic();


