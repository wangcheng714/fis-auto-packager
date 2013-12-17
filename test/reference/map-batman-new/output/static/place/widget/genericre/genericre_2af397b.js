define('place:widget/genericre/genericre.js', function(require, exports, module){

/**
 * @fileOverview place地图hlper适配类
 * @author yuanzhijia@baidu.com
 * @data 2013-12-02
 */
var GenericreTiles = require('place:widget/genericre/genericre-tiles.js'),//栅格麻点
      GenericreVector = require('place:widget/genericre/genericre-vector.js');//矢量麻点
var Genericre = Genericre  || {};
Genericre = {
    init:function  (type) {
        /*默认为矢量麻点   如需栅格麻点请传titls*/
        if (type && (type == "titlsmd")) {
            GenericreVector = GenericreTiles;
        };
        return GenericreVector;
    }
};
//适配矢量麻点还是栅格麻点
module.exports = Genericre;

});