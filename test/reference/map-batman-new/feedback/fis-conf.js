
var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'feedback',

    pack : {
        'pkg/feedback.js' : '**.js'
    }
});
