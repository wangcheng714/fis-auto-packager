var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'third',

    pack : {
        'pkg/third.js' : 'widget/**.js'
    }
});
