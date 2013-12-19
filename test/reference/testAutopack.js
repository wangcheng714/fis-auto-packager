
var autopack = require("../../fis-auto-packager.js"),
//    dir = __dirname + "/map-batman-old/output",
    dir = __dirname + "/map-batman-new/output",
    //dir = __dirname + "/sample/output",
    logUrl = "http://wangcheng.fe.baidu.com/Fis_Static_Count.201312130000",
    outputDir = __dirname + "/pack/";

var modules = ["addr","common","place","index","taxi","drive","user","walk"],
    staticType = ["js"];

autopack.package(dir, outputDir, "batman", modules, staticType, logUrl, function(error, result){
    console.log(result);
});




