
var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'transit',
    
    pack : {
        'pkg/transit.js' : ['**.js']
    }
    
});
