
module.exports.debug = function(str, level){
    var tab = "";
    for(var i=1; i<level; i++){
        tab += "\t";
    }
    console.log(tab + str);
}