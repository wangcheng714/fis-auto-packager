var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'place',

    pack : {
        'pkg/order.js' : [/\/widget\/order\/(.*\.js)$/i],
        'pkg/place.js' : '**.js'
    }
});
