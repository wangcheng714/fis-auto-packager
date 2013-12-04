define('third:widget/thumbnail/userheading.js', function(require, exports, module){

/**
 * 利用指南针传感器显示用户方位信息
 * @author jiazheng
 * @date 20130604
 */
function UserHeading(){
    /**
     * 时间戳
     * @type {number}
     */
    this._timeStamp = 0;
    /**
     * 用于显示的dom对象集合
     * @type {Array<HTMLElement>}
     */
    this._doms = [];
    /**
     * 当前指南针传感器的方位值，用来对比新旧值之间的差距
     * @type {number}
     */
    this._alpha = 0;
    /**
     * 当前用户手机姿态，由于指南针传感器返回的数据是手机
     * 头部的指向，因此需要知道手机的姿态
     * @type {number}
     */
    this._orientation = window.orientation;
}
/**
 * 启动传感器，并添加dom元素
 * @param {HTMLElement} 用于显示用的dom元素
 */
UserHeading.prototype.start = function(dom){
    var me = this;
    me._doms.push(dom);
    if (me._started) {
        // 后续事件监听仅需要执行一次
        return;
    }
    me._started = true;
    window.addEventListener('deviceorientation', function(e){
        var alpha;
        if (!e.webkitCompassHeading) {
            alpha = Math.round(e.alpha);
        } else {
            alpha = Math.round(0 - e.webkitCompassHeading);
        }
        alpha = alpha - me._orientation;
        if (e.timeStamp - me._timeStamp < 100) {
            // 过于频繁
            return;
        }
        me._timeStamp = e.timeStamp;
        var diff = Math.abs(me._alpha - alpha);
        if (diff > 5) {
            // 增加diff判断主要解决防止小范围的来回抖动
            for (var i = 0; i < me._doms.length; i ++) {
                if (!me._doms[i] || !me._doms[i].style) {
                    continue;
                }
                me._doms[i].style.transform = 
                    me._doms[i].style.webkitTransform = 
                    'rotate(' + (Math.round(0 - alpha)) + 'deg)';
            }
            me._alpha = alpha;
        }
    }, true);
    window.addEventListener('orientationchange', function(){
        me._orientation = window.orientation;
    }, true);
}
/**
 * 测试是否支持
 * @return {boolean} 是否支持
 */
UserHeading.prototype.isSupport = function(){
    var ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1 || // android暂时不开放该功能，不够准确
        !window.DeviceOrientationEvent) {   // 没有事件，不支持
        return false;
    }
    return true;
}

module.exports = new UserHeading();

});