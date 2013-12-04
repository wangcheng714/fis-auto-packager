/**
 * @fileoverview 地图控件基类
 * @author jason.zhou
 * @constructor
 */
var BMap = require('common:widget/api/api.js');

var BaseControl = function() {
    // x轴偏移量
    this.x = 10;
    // y轴偏移量
    this.y = 10;
    // y轴上相关控件key数组
    this.yKeys = []; 
    // 设置地图默认值
    this.defaultOffset = new BMap.Size(this.x, this.y);
    // 控件之间y轴上的间距
    this.ySpace = 10;
}
BaseControl.prototype = new BMap.Control();
BaseControl.prototype.constructor = BaseControl;
$.extend(BaseControl.prototype, {
    /**
     * 重新设置控件位置,轮询实现相关组件避让,目前仅支持y轴上
     * @author jason.zhou
     * todo 这个方法已经没用了
     */
    setPosition : function() {
        var h = 0;
        /*var h = 0,
            yKeys = this.yKeys;
        for (var i = 0; i < yKeys.length; i++) {
            var c = CtrMgr.cc[yKeys[i]],
                o = c.o,
                tempH = 0;
            if (c.on) {
                if (o instanceof BMap.Control) {
                    tempH = o._container.offsetHeight;
                } else if (o instanceof HTMLElement) {
                    tempH = o.offsetHeight;
                }
                if (tempH == 0) {
                    // 轮询，直到地图初化也就是把元素ID为MapHolder设置为block,可取控件元素高度为止
                    setTimeout((function(o){return function(){o.setPosition();}})(this),10);
                    return;
                }
                // 特例，如果是周边控件,因为和底部没有空隙
                if (yKeys[i] == 'set_myloc') {
                    h -= this.ySpace;
                }
                h += tempH + this.ySpace;
            }
        }*/
        this.setOffset(new BMap.Size(this.x, this.y + h));
    }
});

BaseControl._className_ = 'BaseControl';

module.exports = BaseControl;