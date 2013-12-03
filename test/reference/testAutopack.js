
var autopack = require("../../fis-auto-packager.js"),
    dir = __dirname + "/map-batman/output",
    outputDir = __dirname + "/pack/";

autopack.package(dir, outputDir, "batman", function(error, result){
    console.log(result);
});

