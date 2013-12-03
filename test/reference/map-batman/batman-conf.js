/**
 * @file batman 全站配置
 */

module.exports = {
    deploy : {
        // receiver : "http://cq01-rdqa-dev050.cq01.baidu.com:8260/webapp/receiver.php",
        // receiver : "http://cq01-map-rdtest11q409.vm.baidu.com:8030/webapp/receiver.php",
        //receiver : "http://cq01-rdqa-pool051.cq01.baidu.com:8000/webapp/receiver.php",
        // receiver : "http://cq01-rdqa-pool041.cq01.baidu.com:8030/webapp/receiver.php",
        // receiver : "http://cq01-rdqa-dev068.cq01.baidu.com:8030/webapp/receiver.php",
        //receiver : "http://db-testing-mp365.db01.baidu.com:8008/webapp/receiver.php",
        //receiver : "http://cq01-map-rdtest11q409.vm.baidu.com:8030/webapp/receiver.php",
        //receiver : "http://cq01-rdqa-dev031.cq01.baidu.com:8030/webapp/receiver.php",
        receiver : "http://cq01-rdqa-dev034.cq01.baidu.com:8053/webapp/receiver.php",
        root : '/home/users/nichenjian/work/',
        /*receiver : "http://cq01-rdqa-dev051.cq01.baidu.com:8081/static/receiver.php",
        root : '/home/users/tanguoshuai/',
        root1: '/home/users/tanguoshuai/nodp/webroot/'*/
        //root : '/home/map/'
        //root : '/home/map/qa/wangshuang/8008/'
        //root : '/home/map/fe/lyx/workspace1/'
        //root : '/home/users/liushuai02/webroot/'

    },
    settings: {
        lint: {
            jshint: {
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                quotmark: 'single',
                maxparams: 4,
                maxdepth: 4,
                maxlen: 150,
                boss: true,
                expr: true,
                globalstrict: true,
                iterator: true,
                laxcomma: true,
                proto: true,
                scripturl: true,
                sub: true,
                validthis: true,
                browser: true,
                jquery: true,
                node: true,
                onevar: true
            }
        }
    }
};
