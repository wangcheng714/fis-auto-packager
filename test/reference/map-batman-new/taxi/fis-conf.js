var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'taxi',

    pack : {
        'pkg/taxi.js' : ['**.js']
    }
});
