

var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'user',

    pack : {
        'pkg/user.js' : ['**.js']
    }
});
