var util = require("./util.js"),
    date = new Date(),
    day = date.getYear().toString() + date.getMonth().toString() + date.getDate().toString(),
    errorLog = __dirname + "/../log/error." + day + ".log",
    noticeLog = __dirname + "/../log/notice." + day + ".log",
    debugLog = __dirname +  "/../log/debug." + day + ".log";

function now(withoutMilliseconds){
    var d = new Date(), str;
    str = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ].join(':').replace(/\b\d\b/g, '0$&');
    if(!withoutMilliseconds){
        str += '.' + ('00' + d.getMilliseconds()).substr(-4);
    }
    return str;
};

module.exports.error = function(error){
    if(!(error instanceof Error)){
        error = new Error(error.msg || error);
    }
    util.write(errorLog, now() + error.stack + "\n", "utf-8", true);
    throw error;
}

module.exports.debug = function(msg, level){
    var tab = "";
    for(var i=0; i<level; i++){
        tab += "\t";
    }
    console.log(tab + now() + msg + "\n");
    util.write(debugLog, tab + now() + msg + "\n", "utf-8", true);
}