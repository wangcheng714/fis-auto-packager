
var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'drive',

    pack : {
        'pkg/drive.js' : ['**.js']
    }
});
