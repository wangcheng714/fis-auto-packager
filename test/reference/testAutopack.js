
var autopack = require("../../fis-auto-packager.js"),
    dir = __dirname + "/map-batman-old/output",
//    dir = __dirname + "/map-batman-new/output",
    //dir = __dirname + "/sample/output",
    logUrl = "http://wangcheng.fe.baidu.com/Fis_Static_Count.201311160000",
    outputDir = __dirname + "/pack/";

autopack.package(dir, outputDir, "sample", logUrl, function(error, result){
    console.log(result);
});


