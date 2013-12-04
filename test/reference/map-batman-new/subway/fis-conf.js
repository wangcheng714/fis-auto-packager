var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'subway',
    
    pack : {
        'pkg/subway.js' : '**.js'
    }
});

fis.config.get('roadmap.path').unshift({
    reg : /^\/static\/(swf\/.*|xml\/.*)$/i,
    useHash : true
});