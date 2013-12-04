var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    // 模块命名空间
    namespace: 'common',

    // 打包配置
    pack : {
        'pkg/base.js' : [
            '/static/js/mod.js',
            '/static/js/libs/zepto.js',
            '/static/js/libs/listener.js',
            '/static/js/libs/template.js',
            /^\/(?!static\/js\/pdc\/|widget\/api\/).*\.js$/i
        ],
        'pkg/api.js' : [
            '/widget/api/api.js'
        ],
        'pkg/api-ext.js' : [
            '/widget/api/ext/**.js'
        ]
    }
});

var roadmapPath = fis.config.get('roadmap.path');

roadmapPath.unshift({
    reg: /^\/static(\/js\/gmu\/src.*\.js)$/i,
    isMod: true,
   // release: '$&'
    release : '/static/common/$1'
});