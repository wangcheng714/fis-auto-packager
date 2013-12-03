/**
 * $.ui
 * @description ui base
 */

var Zepto = $;


(function($) {
    //公共模块的集合
    var memoizedMods = [];

    $.ui = $.ui || {

        version: '1.0 beta',

        defineProperty: Object.defineProperty,

        /**
         * 创建组件
         * @param   {String}     name     组件名
         * @param   {Function}   base     组件父类
         * @param   {Object}     proto    原型扩展
         */
        create: function(name, base, proto) {
            if (!proto) {
                proto = base;
                base = $.ui.widget;
            }

            var attachMods = [],
                baseProto = new base(),
                rcheck = /\b_super\b/,
                superProto = baseProto.__proto__,
                constructor = function(element, options){
                    if (element) {
                        var me = this,
                            args = $.slice(arguments);
                            
                        $.each(attachMods, function(index, mod) {
                            var paths = mod.split('.'),
                                mod = memoizedMods[paths.shift()] || {},
                                key, source = {};

                            $.each(paths, function(index, val) {
                                key = val;
                                mod = mod[key];
                            });

                            mod && (key ? source[key] = mod : source = mod);
                            _attach(me, source, 'delegate');
                        });
                        // invoke component's real _create
                        me._createWidget.apply(me, args);
                    }
                };

            $.ui[name] = function(element, options) {
                return new constructor(element, options);
            };

            constructor.prototype = $.extend(baseProto, {
                widgetName: name,
                widgetBaseClass: baseProto.widgetName || base
            }, $.each(proto, function(key, method) {
                if ($.isFunction(method) && $.isFunction(superProto[key]) && rcheck.test(method.toString())) {
                    proto[key] = function() {
                        this._super = superProto[key];
                        var ret = method.apply(this, arguments);
                        delete this._super;
                        return ret;
                    };
                }
            }));

            return {
                attach: function(paths) {
                    attachMods = attachMods.concat($.isArray(paths) ? paths : paths.split(','));
                }
            };
        },

        /**
         * 定义模块
         * @param   {String}             name        模块名
         * @param   {Function || JSON}   factory     模块构造器
         */
        define: function(name, factory) {
            try {
                if(!factory){ // anonymous module
                    factory = name;
                    name = '_privateModule'
                }

                var ns = $.ui[name] || ($.ui[name] = {}),
                    exports = _checkDeps(factory);

                memoizedMods[name] = $.extend(ns, exports);
            } catch (e) {
                throw new Error(e);
            }
        }

    };

     /**
      * 加载配置项
      * @private
      */
     function _attach(target, source, mode) {
         switch (mode) {
         case 'attach':
             $.extend(target, source);
             break;

         case 'delegate':
             $.each(source, function(key, fn) {
                 if (target[key] === undefined) {
                     target[key] = function() {
                         var args = $.slice(arguments);
                         args.unshift(this.widget());
                         fn.apply(this, args);
                     };
                 }

             });
             break;
         }
     }

    /**
     * 获取模块api
     * @private
     */
    function require(module) {
        var exports = $.ui[module] || {},
            args = $.slice(arguments, 1),
            i = 0, temp;

        while( temp = exports[args[i]]){
            exports = temp;
            i++;
        }
        return args[i] ? temp : exports;
    }

    /**
     * 检查模块依赖
     * @private
     */
    function _checkDeps(factory) {
        var rdeps = /require\(\s*['"]?([^'")]*)/g,
            ret = [],
            code, match, module;

        if ($.isPlainObject(factory)) return factory;

        else if ($.isFunction(factory)) {
            code = factory.toString();

            while (match = rdeps.exec(code)) {
                if (module = match[1]) {
                    !$.ui[module] && ret.push('$.ui.' + module);
                }
            }

            if (ret.length) throw ('undefined modules: ' + ret.join(', '));
            return factory(require);
            
        } else throw ('type error: factory should be function or object');

        return factory;
    }

})(Zepto);

/**
 * $.ui.ex  
 * @description 对zepto的扩展
 */
(function($, undefined) {
    $.ui.define('ex', function() {
        var class2type = {},
            toString = Object.prototype.toString,
            timer;

        $.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        /**
         * 实现zepto接口
         */
        $.implement = function(obj, sm, force) {
            var proto = sm ? $ : $.fn;
            $.each(obj, function(name, method) {
                var previous = proto[name];
                if (previous == undefined || !previous.$ex || force) {
                    method.$ex = true;
                    proto[name] = method;
                }
            });
            return $;
        };

        $.implement({ // static
            _guid: 0,

            emptyFn: function() {},

            /**
             * 判断类型
             * @extend
             */
            type: function(o) {
                return o == null ? String(o) : class2type[toString.call(o)] || "object";
            },

            /**
             * 是否为null
             * @extend
             */
            isNull: function(o) {
                return o === null;
            },

            /**
             * 是否为undefined
             * @extend
             */
            isUndefined: function(o) {
                return o === undefined;
            },

            /**
             * 截取数组
             * @extend
             */
            slice: function(array, index) {
                return Array.prototype.slice.call(array, index || 0);
            },

            /**
             * 函数绑定
             * @extend
             */
            bind: function(fn, context, args) {
                return function() {
                    var args = (args || []).concat($.slice(arguments));
                    fn.apply(context, args);
                }
            },

            /**
             * 生成唯一id
             * @extend
             */
            guid: function() {
                return this._guid++;
            },

            /**
             * 延迟执行
             * @extend
             */
            later: function(fn, when, periodic, context, data) {
                var when = when || 0,
                    f = function() {
                        fn.apply(context, data);
                    };

                return periodic ? setInterval(f, when) : setTimeout(f, when);
            },

            /**
             * 调试alert
             * @extend
             */
            alert: function() {
                var isAlert = false;
                return function(str, once) {
                    if (isAlert) {
                        //window.alert(str);
                        once && (isAlert = true);
                    }
                };
            }(),

            /**
             * 解析模版
             * @extend
             */
            parseTpl: function(str, data) {
                var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function(match, code) {
                    return "'," + code.replace(/\\'/g, "'") + ",'";
                }).replace(/<%([\s\S]+?)%>/g, function(match, code) {
                    return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
                }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
                var func = new Function('obj', tmpl);
                return data ? func(data) : func;
            },

            /**
             * 加载script||css
             * @extend
             */
            loadFile: function(url, cb, timeout) {
                var isCSS = /\.css(?:\?|$)/i.test(url),
                    head = document.head || document.getElementsByTagName('head')[0],
                    node = document.createElement(isCSS ? 'link' : 'script'),
                    cb = cb || $.emptyFn, timer, onload;

                if (isCSS) {
                    node.rel = 'stylesheet';
                    node.href = url;
                    head.appendChild(node);
                } else {
                    onload = function() {
                        cb();
                        clearTimeout(timer);
                    };

                    timer = setTimeout(function() {
                        onload();
                        throw new Error('failed to load js file:' + url);
                    }, timeout || 50);

                    node.addEventListener('load', onload, false);
                    node.async = true;
                    node.src = url;
                    head.insertBefore(node, head.firstChild);
                }
            }

        }, true);

        var $onFn = $.fn.on,
            $offFn = $.fn.off,
            transEvent = {touchstart: 'mousedown', touchend: 'mouseup', touchmove: 'mousemove', tap: 'click'},
            transFn = function(e) { return !('ontouchstart' in window) ? (transEvent[e] ? transEvent[e] : e) : e; };

        $.implement({
            /**
             * 注册事件
             * @override
             */
            on: function(event, selector, callback) {
                return $onFn.call(this, transFn(event), selector, callback);
            },

            /**
             * 注销事件
             * @override
             */
            off: function(event, selector, callback) {
                return $offFn.call(this, transFn(event), selector, callback);
            }

        }, false, true);

        /** dispatch scrollStop事件 */
        $(window).on('scroll', function(e) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                $(document).trigger('scrollStop');
            }, 50);
        });

    });
})(Zepto);/**
 * $.ui.widget
 * @description component base
 */

(function($, undefined){
    $.ui.create('widget', function() {}, {
    
        _createWidget: function(selector, options) {
            var me = this;

            if ($.isPlainObject(selector)) {
                options = selector || {};
                selector = undefined;
            }

            $.extend(me, {
                _element: selector && $(selector),
                _data: $.extend({status: true, plugins: {}}, me._data, options)
            });

            me._create();
            me._init();

            me.widget().on('touchstart touchend tap', function(e) { // global events
                (e['bubblesList'] || (e['bubblesList'] = [])).push(me);
            });
        },

        // @interface  _create
        _create: function() {},

        // @interface  _init
        _init: function() {},

        // destroy properties and prototype chain
        destroy: function() {
            var me = this;

            $.each(me.data('plugins'), function(id, component) {
                component.destroy();
            });

            me.trigger('destroy');
            // me.trigger('destroy').off().widget().remove();
            me.__proto__ = null;
            $.each(Object.keys ? Object.keys(me) : me, function(i, key){
                delete me[key];
            });
        },

        /**
         * 获取or设置属性
         * @param    {String}    key      参数名
         * @param    {Any}       value    参数值  
         */
        data: function(key, value){
            var _data = this._data;
            if ($.isPlainObject(key)) return $.extend(_data, key);
            else return value !== undefined ? _data[key] = value : _data[key]; 
        },

        /**
         * 获取根元素
         * @return    {Zepto Instance}   经过zepto包装后的容器元素 
         */
        widget: function(elem) {
            return this._element = elem || this._element;
        },

        /**
         * 获取or设置component
         * @param    {String}       id               component id
         * @param    {Function}     createFn         component factory  
         * @return   {Component}                     component instance
         */
        component: function(id, createFn) {
            var me = this,
                plugins = me.data('plugins');

            try {
                if ($.isFunction(createFn)) {
                    plugins[id] = createFn.apply(me);
                } else if (createFn !== undefined) {
                    if (plugins[id]) plugins[id].destroy();
                    delete plugins[id];
                }
            } catch (e) {}
            
            return plugins[id];
        },

        /**
         * 注册事件
         * @param    {String}      ev          事件名
         * @param    {Function}    callback    事件处理函数
         * @param    {Object}      context     上下文对象
         */
        on: function(ev, callback, context) {
            var me = this,
                calls = me._callbacks || (me._callbacks = {}),
                list = calls[ev] || (calls[ev] = []);

            list.push([callback, context]);

            return me;
        },

        /**
         * 注销事件
         * @param    {String}      ev          事件名
         * @param    {Function}    callback    事件处理函数
         */
        off: function(ev, callback) {
            var me = this, calls;

            if (!ev) {// 如果事件为空，移除该组件的所有事件的绑定函数
                me._callbacks = {};

            } else if (calls = me._callbacks) {
                if (!callback) {// 如果callback为空，移除该事件的所有绑定函数
                    calls[ev] = [];
                } else {
                    var list = calls[ev];
                    if (!list) return me;
                    for (var i = 0, l = list.length; i < l; i++) {
                        if (list[i] && callback === list[i][0]) {
                            list[i] = null;
                            break;
                        }
                    }
                }
            }

            return me;
        },

        /**
         * 触发事件
         * @param    {String}      ev             事件名
         * @param    {All}         arguments      需要传递的参数
         */
        trigger: function(type) {
            var me = this,
                handler = me.data('on' + type),
                args = $.slice(arguments, 1),
                list, calls, callback;

            // 先执行参数中的onevent
            handler && handler.apply(me, args);

            if (!type || !(calls = me._callbacks)) return me;

            if (list = calls[type]) {
                for (var i = 0, l = list.length; i < l; i++) {
                    callback = list[i];
                    callback[0].apply(callback[1] || me, args);
                }
            }

            return me;
        }

    });

        
    $(document).ready(function() {
        // auto-self init
        $(document).trigger('pageInit');
    });

})(Zepto);


/**
 * $.ui.control
 * @description 公共行为方法
 */

(function($, undefined) {
    $.ui.define('control', function(require) {
        var os = $.os,
            version = parseFloat(os.version),
            isDesktop = !version,
            isIos = os.ios,
            isAndorid = os.android,
            adapter = {};

        /**
         * 固定位置
         * @param    {String || HTMLElement}      elem      选择器或elements
         * @param    {Object}                     options   设置属性
         */
        adapter.fix = function(elem, options) {
            var $elem = $(elem),
                elem = $elem.get(0),
                opts = options || {}, pos;

            if (opts.bottom != undefined) {
                opts.top = window.pageYOffset + $(window).height() - elem.offsetHeight - parseInt(opts.bottom);
                delete opts.bottom;
            }

            if (opts.right != undefined) {
                opts.left = window.pageXOffset + $(window).width() - elem.offsetWidth - parseInt(opts.right);
                delete opts.right;
            }

            $elem.css($.extend({
                left: 0,
                top: 0,
                position: 'absolute',
                zIndex: 999
            }, opts));

            if ((isDesktop || isIos && version >= 5 || isAndorid) && !elem.isFixed) {
                $elem.css('position', 'fixed');
                elem.isFixed = true;
            } else if (isIos && version >= 4 && !elem.isFixed) {
                elem.isFixed = true;
                pos = parseFloat($elem.css('top'));
                $(document).on('scrollStop', function(e) {
                    $elem.css('top', window.pageYOffset + pos + 'px');
                });
            }
        };

        /**
         * 元素置顶浮动
         * @param     {String || HTMLElement}      elem      选择器或elements
         */
        adapter.setFloat = function(elem) {
            var $elem = $(elem),
                $copy = $elem.clone().css({
                    opacity: 0,
                    display: 'none'
                }).attr('id', ''),
                isFloat = false,
                touch = {},
                defaultPosition = $elem.css('position') || 'static',
                appear = function() {
                    adapter.fix($elem, {
                        x: 0,
                        y: 0
                    });
                    $copy.css('display', 'block');
                    isFloat = true;
                },
                disappear = function() {
                    $elem.css('position', defaultPosition);
                    $copy.css('display', 'none');
                    isFloat = false;
                },
                check = function(pos) {
                    var top = $copy.get(0).getBoundingClientRect().top || $elem.get(0).getBoundingClientRect().top,
                        pos = pos || 0 + top;

                    if(pos < 0 && !isFloat){
                        appear();
                    }else if(pos > 0 && isFloat){
                        disappear();
                    }
                };

            $elem.after($copy);

            $(document).on('touchstart', function(e){
                touch.y = e.touches[0].pageY;
            }).on('touchmove', function(e){
                var pos = e.touches[0].pageY - touch.y;
                touch.y = e.touches[0].pageY;
                check(pos);
            });

            $(window).on('scroll', function() {
                check();
            });
        };
        
        return adapter;
    });

})(Zepto);

define('common:static/js/widget.js', function(require, exports, module){
    module.exports = Zepto;
});