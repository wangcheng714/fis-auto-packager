var SUPERMAN_CONFIG = {
    deploy: {
        receiver: 'http://cq01-rdqa-dev050.cq01.baidu.com:8022/webapp/receiver.php',
        root: '/home/users/caodongqing/8033/'
    }
};


fis.config.merge({
    namespace: 'third',

    pack: {
        'pkg/third.js': 'widget/**.js'
    },

    roadmap : {
        domain : {
            //所有图片文件，使用 http://img.example.com 作为域名
            'image' : ['http://s1.map.bdimg.com/mobile/simple']
        }
    },

    // 插件配置
    modules: {
        // 自动css sprites插件
        spriter: 'csssprites',
        // inline插件
        preprocessor: {
            tpl: 'inline, extlang'
        },
        lint: {
            js: 'jshint'
        },
        postpackager : 'ext-map'
    },

    settings: {
        // smarty 左右界定符配置
        smarty: {
            left_delimiter: '{%',
            right_delimiter: '%}',
        },
        // 自动cssspriter 插件
        // @wiki: https://github.com/xiangshouding/fis-spriter-csssprites
        spriter: {
            csssprites: {
                margin: 30
            }
        },
        lint: {
            jshint: {
                curly: true,
                eqeqeq: true,
                forin: false,
                latedef: "nofunc",
                newcap: true,
                noarg: true,
                nonew: true,
                undef: true,
                unused: true,
                trailing: true,
                maxparams: 4,
                maxdepth: 4,
                maxlen: 100,
                maxstatements: 25,
                freeze: true,
                strict: false,

                boss: true,
                expr: true,
                laxcomma: true,
                laxbreak: true,
                sub: true,
                lastsemic: true,
                eqnull: true,
                multistr: true,

                browser: true,
                jquery: true,
                node: true,

                ignored: [
                    'static/js/gmu/**.js',
                    'static/lib/**.js',
                    'static/js/libs/**.js',
                    'static/js/pdc/**.js',
                    'static/js/iscroll.js',
                    'widget/api/**.js',
                    /\.tmpl$/i
                ],
                globals: {
                    "require": false,
                    "define": false,
                    "listener": false,
                    "__inline": false,
                    "gmu": false,
                    "BMap": false,
                    "STAT_CODE": false,
                    "_APP_HASH": false,
                    "COM_STAT_CODE": false,
                    "appPage": false,
                    "SDC": false,
                    "PDC": false,
                    "MY_GEO": false
                }
            }
        }
    },

    // 采用百度的前端模板
    // 语法文档: http://baidufe.github.io/BaiduTemplate/
    tmpl: 'bdtmpl',

    // 部署配置
    deploy: {
        //使用fis release --dest remote来使用这个配置
        static: {
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver: SUPERMAN_CONFIG.deploy.receiver,
            //从产出的结果的static目录下找文件
            from: '/static',
            //保存到远端机器的/home/fis/www/static目录下
            //这个参数会跟随post请求一起发送
            to: SUPERMAN_CONFIG.deploy.root + 'lighttpd/htdocs/mobile/simple'
        },
        //使用fis release --dest remote来使用这个配置
        config: {
            receiver: SUPERMAN_CONFIG.deploy.receiver,
            from: '/config',
            to: SUPERMAN_CONFIG.deploy.root + 'phpui/webapp/smarty/'
        },
        //使用fis release --dest remote来使用这个配置x
        plugin: {
            receiver: SUPERMAN_CONFIG.deploy.receiver,
            from: '/plugin/',
            to: SUPERMAN_CONFIG.deploy.root + 'phpui/webapp/smarty/'
        },
        //使用fis release --dest remote来使用这个配置
        template: {
            receiver: SUPERMAN_CONFIG.deploy.receiver,
            from: '/template',
            to: SUPERMAN_CONFIG.deploy.root + 'phpui/webapp/views/'
        },
        //名字随便取的，没有特殊含义
        local: {
            //from参数省略，表示从发布后的根目录开始上传
            //发布到当前项目的上一级的output目录中
            to: '../output'
        }
    }

});
