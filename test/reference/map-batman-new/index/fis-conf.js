
var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    // 模块命名空间
    namespace: 'index',

    // 打包配置
    pack : {
        'pkg/index.js' : 'widget/**.js'
    }
});
