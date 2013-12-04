/**
 * 时序事件记录组件，用于初始化时的事件记录与还原
 * shengxuanwei 2013-06-14
 * @param  {Window}  win Window对象
 * @param  {Element} doc Document对象
 * @return {Function}    构造函数
 */
var EventRecorder = (function(win, doc) {

    /**
     * 监听事件类型和绑定函数
     * @type {Object}
     */
    var _events = {
        /*Mouse Events - MouseEvents - event.initMouseEvent*/
        'click': true
        // 'scroll': false,

        /*Form Events - HTMLEvents - event.initEvent*/
        // 'focus': false,
        // 'blur': false,

        /*Keyboard Events - KeyboardEvent - event.initKeyboardEvent*/
        // 'input': false,

        /*Window Events - UIEvents - event.initUIEvent*/
        // 'load': false
    },

    /**
     * 监听事件初始化方法
     * @type {Object}
     */
    _eventInitMethods = {
        MouseEvent: 'initMouseEvent',
        MouseEvents: 'initMouseEvent'
        // KeyboardEvent: 'initKeyboardEvent',
        // KeyEvents: 'initKeyEvent',
        // UIEvent: 'initUIEvent',
        // UIEvents: 'initUIEvent'
    };

    //if (navigator.userAgent.match(/i(Phone|Pad|Touch)/i)) {
        _events = {
            'click': false,
            'touchstart': true,
            'touchmove': true,
            'touchend': true
        };
    //}

    var ext = {

        /**
         * 绑定预定义事件类型
         * @param  {Element} elem     DOM元素
         * @param  {Function} listener 监听事件
         */
        add: function(elem, listener) {
            var i, len, key;
            elem = elem || doc;
            for (key in _events) {
                if (_events[key]) {
                    elem.addEventListener(key, listener, false);
                }
            }
        },

        /**
         * 移除预定义事件类型
         * @param  {Element} elem     DOM元素
         * @param  {Function} listener 监听事件
         */
        remove: function(elem, listener) {
            var key;
            elem = elem || doc;
            for (key in _events) {
                if (_events[key]) {
                    elem.removeEventListener(key, listener, false);
                }
            }
        },

        /**
         * 事件回放
         * @param  {Object}   evt      自定义事件对象
         * @param  {Function} callback 回调函数
         */
        execute: function(evt, callback) {
            if (evt) {
                var simEvent = ext.simulate(evt.event);
                // 执行预定义的监听函数
                if (typeof _events[simEvent.type] == 'function') {
                    _events[simEvent.type](simEvent);
                }
                // 执行绑定的监听函数
                if (typeof callback == 'function')　callback();
            }
        },

        /**
         * 模拟事件初始化和派发
         * @param  {Event} event 事件对象
         * @return {Event} 模拟创建事件对象
         */
        simulate: function(event) {
            var newEvent = this.create(event);
            this.dispatch(event.target, newEvent); // event.target指定srcElement和target属性
            return newEvent;
        },

        /**
         * 创建事件对象
         * @param  {Event} e 事件对象
         * @return {Event}   事件对象
         */
        create: function(e) {
            var type = e.constructor.name;
            var evt = doc.createEvent(type); // 创建Event空对象
            if (_eventInitMethods[type]) { // 初始化Event对象，执行对象复制
                evt[_eventInitMethods[type]](e.type, e.bubbles, e.cancelable, win, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
                return evt;
            }
            return undefined;
        },

        /**
         * 派发事件
         * @param  {Element} elem       事件派发元素
         * @param  {Event} createdEvent 事件对象
         */
        dispatch: function(elem, createdEvent) {
            if (elem) {
                elem.dispatchEvent(createdEvent);
            }
        },

        get : function (id) {
            return doc.getElementById(id);
        }
    };

    /**
     * 正在加载中等待框
     * @type {Object}
     */
    var popup = {
        show: function() {
            var elem = ext.get("index-loading-popup");
            if (elem) {
                elem.style.left = (win.innerWidth - 124) / 2 + "px";
                elem.style.top = (win.innerHeight / 2 - 42 + win.scrollY) + "px";
                return;
            }

            elem = doc.createElement("div");
            elem.id = "index-loading-popup";
            elem.style.cssText = [
                "display:table-cell",
                "vertical-align:middle",
                "text-align:center",
                "padding:11px 27px",
                "background-color:#000",
                "opacity:0.7",
                "border-radius:5px",
                "color:#ffffff",
                "font-size:14px",
                "text-align:center",
                "margin:0 auto",
                "position:absolute",
                "z-index:80000",
                ("left:" + (win.innerWidth - 124) / 2 + "px"),
                ("top:" + (win.innerHeight / 2 - 42 + win.scrollY) + "px")].join(";");
            elem.innerText = "正在加载中";
            doc.body.appendChild(elem);
        }
        // hide: function() {
        //     var elem = ext.get("loading_popup");
        //     if (elem) {
        //         elem.style.display = "none";
        //         doc.body.removeChild(elem);
        //     }
        // }
    };

    var MODE_RECORD = 0,
        MODE_PLAY = 1,
        MODE_STOP = 2,
        MODE_REWIND = 3;

    var _recorder;

    _recorder = function(elem) {
        this.elem = elem || doc;
        this.lastEvent = null;
        this.status = MODE_STOP;
        this.captureListener = null;
    };

    _recorder.prototype.record = function() {
        var that = this;

        var clickEventListener = function(e) {
            var evt = {
                event: e || window.event,
                context: window,
                time: Date.now()
            };
            var clickTime = window.userClickTime || {};
            if (that.matchTarget(evt)) {
                // 如果有记录，则不设置新的时间
                if(clickTime.type !== "record" || typeof clickTime.time !== "number"){
                    window.userClickTime = {
                        time : Date.now(), // 定义全局变量用于记录首次点击时间
                        type : "record"
                    };
                }
                popup.show();
                that.lastEvent = evt;
            } else if (evt.event.target.id == "se-input-poi") { // 针对se_txt_poi特殊处理
                window.currInputFocused = true;
            }
        };

        var touchEvent = {};

        var _eventListener = function(e) {
            switch(e.type) {
                case 'touchstart':
                    touchEvent.x1 = e.touches[0].pageX;
                    touchEvent.y1 = e.touches[0].pageY;
                    break;
                case 'touchmove':
                    touchEvent.x2 = e.touches[0].pageX;
                    touchEvent.y2 = e.touches[0].pageY;
                    break;
                case 'touchend':
                    if ((!touchEvent.x2 && !touchEvent.y2) ||
                        ((touchEvent.x2 && Math.abs(touchEvent.x1 - touchEvent.x2) < 30) ||
                         (touchEvent.y2 && Math.abs(touchEvent.y1 - touchEvent.y2) < 30))) {
                        touchEvent = {};

                        var touch = e.changedTouches[0];
                        var clickEvent = {
                            type: 'click',
                            bubbles: true,
                            cancelable: true,
                            detail: 1,
                            screenX: touch.screenX,
                            screenY: touch.screenY,
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                            altKey: false,
                            shiftKey: false,
                            metaKey: false,
                            button: 0,
                            target: e.target,
                            relatedTarget: e.target,
                            constructor: {
                                name: 'MouseEvent'
                            }
                        };
                        clickEventListener(clickEvent);
                    }
                    break;
                case 'click':
                    clickEventListener(e);
                    break;
            }
        };
        this.status = MODE_RECORD;
        ext.add(this.elem, _eventListener);
        this.captureListener = _eventListener;
    };
    _recorder.prototype.play = function() {
        this.status = MODE_PLAY;
        this.execute(this.lastEvent, MODE_PLAY);
    };
    _recorder.prototype.stop = function() {
        this.status = MODE_STOP;
        if (this.captureListener) {
            ext.remove(this.elem, this.captureListener);
            this.captureListener = null;
        }
    };
    _recorder.prototype.execute = function(evt, currentExecuteStatus) {
        if (!evt) {
            this.stop();
            return;
        }
        if (!this.matchTarget(evt)) {
            return;
        }

        var that = this;
        if (currentExecuteStatus === this.status) {
            ext.execute(evt, function() {
                return; // 只派发最后一次有效事件，直接return
            });
        }
    };

    /**
     * 过滤可点元素，当前仅匹配自定义样式btn-link
     * @param  {Object} evt 自定义Event对象
     * @return {Boolean}    元素是否可点
     */
    _recorder.prototype.matchTarget = function(evt) {

        function detectClickable(target) {
            return  target.tagName.toLowerCase() === "a" || 
                    target.getAttribute("jsaction") == "jump" ||
                    (target.id == "se-btn" && ext.get("se-input-poi") && (/[^\s]/).test(ext.get("se-input-poi").value));
        }

        var target = evt.event.target,
            root = doc.body;
        do {
            if (detectClickable(target)) {
                return true;
            }
            target = target.parentNode;
        } while (target && target != root);

        return false;
    };

    return _recorder;
})(window, document);

if (window.EventRecorder) {
    var eventRecorder = new window.EventRecorder(document.body);
    eventRecorder.record();
}