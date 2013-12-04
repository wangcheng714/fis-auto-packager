var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'walk',
    
    pack : {
        'pkg/walk.js' : ['**.js']
    }

});
