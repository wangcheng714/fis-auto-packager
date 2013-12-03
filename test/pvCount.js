
var fs = require("fs");

function trim(str){
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

function getPv(hash){
    var file = "./Fis_Static_Count.201311170000",
        content = fs.readFileSync(file),
        content = content.toString(),
        lines = content.split(/\n|\r\n/),
        staticPv = {};

    for(var i=0; i<lines.length; i++){
        if(trim(lines[i]) != ""){
            var urlTokens = lines[i].split(/\s+|\t/),
                statics = urlTokens[2].split(/,/);

            for(var j=0; j<statics.length; j++){
                if(staticPv[statics[j]]){
                    staticPv[statics[j]] += parseInt(urlTokens[3]);
                }else{
                    staticPv[statics[j]] = parseInt(urlTokens[3]);
                }
            }
        }
    }

    console.log(staticPv[hash]);
}

getPv("1f3d83f");