var batmanConfig = require("../batman-conf.js");

fis.config.merge({
    namespace: 'taxi',

    pack : {
        'pkg/taxi.js' : '**.js'
    },

    modules: {
        spriter: 'csssprites',
        preprocessor: {
            tpl: 'inline, extlang'
        },
        lint : {
            js : 'jshint'
        },
        postpackager : 'ext-map'
    },

    settings: {
        smarty: {
            left_delimiter: '{%',
            right_delimiter: '%}',
        },
        spriter: {
            csssprites: {
                margin: 30
            }
        },
        lint : {
            jshint : batmanConfig.settings.lint.jshint
        }
    },

    tmpl : 'bdtmpl',

    roadmap : {
    	domain : "http://s1.map.bdimg.com/mobile/simple"
    },

    deploy : {
        //使用fis release --dest remote来使用这个配置
        static : {
            //如果配置了receiver，fis会把文件逐个post到接收端上
            receiver : batmanConfig.deploy.receiver,
            //从产出的结果的static目录下找文件
            from : '/static',
            //保存到远端机器的/home/fis/www/static目录下
            //这个参数会跟随post请求一起发送
            to : batmanConfig.deploy.root + 'lighttpd/htdocs/mobile/simple'
        },
        //使用fis release --dest remote来使用这个配置
        config : {
            receiver : batmanConfig.deploy.receiver,
            from : '/config',
            to : batmanConfig.deploy.root + 'phpui/webapp/smarty/'

        },
        //使用fis release --dest remote来使用这个配置
        template : {
            receiver : batmanConfig.deploy.receiver,
            from : '/template',
            to : batmanConfig.deploy.root + 'phpui/webapp/views/'

        },
        //名字随便取的，没有特殊含义
        local : {
            //from参数省略，表示从发布后的根目录开始上传
            //发布到当前项目的上一级的output目录中
            to : '../output'
        }
    }
});