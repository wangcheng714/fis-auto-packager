var TaxiBigPipe = function() {
    var idMaps = {};
    function ajax(url, cb, data) {
        var xhr = new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");

        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                cb(this.responseText);
            }
        };
        xhr.open(data?'POST':'GET', url + '&t=' + ~~(1e6 * Math.random()), true);

        if (data) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(data);
    }


    function renderPagelet(obj, pageletsMap, rendered) {
        if (obj.id in rendered) {
            return;
        }
        rendered[obj.id] = true;

        if (obj.parent_id) {
            renderPagelet(
                pageletsMap[obj.parent_id], pageletsMap, rendered);
        }

        //
        // 将pagelet填充到对应的DOM里
        //
        var dom = document.getElementById(obj.id);
        var idMap = idMaps[obj.id];
        if (idMap && idMap.html_id) {
            dom = document.getElementById(idMap.html_id);
        }

        if (!dom) {
            dom = document.createElement('div');
            dom.id = obj.id;
            document.body.appendChild(dom);
        }

        dom.innerHTML = obj.html;

        var scriptText = dom.getElementsByTagName('script');
        for (var i = scriptText.length - 1; i >= 0; i--) {
            node = scriptText[i];
            text = node.text || node.textContent || node.innerHTML || "";
            window[ "eval" ].call( window, text );
        };
    }


    function render(pagelets) {
        var i, n = pagelets.length;
        var pageletsMap = {};
        var rendered = {};

        //
        // 初始化 pagelet.id => pagelet 映射表
        //
        for(i = 0; i < n; i++) {
            var obj = pagelets[i];
            pageletsMap[obj.id] = obj;
        }

        for(i = 0; i < n; i++) {
            renderPagelet(pagelets[i], pageletsMap, rendered);
        }
    }


    function process(data) {
        var rm = data.resource_map;

        if (rm.async) {
            require.resourceMap(rm.async);
        }

        function loadNext() {
            if (rm.style) {
                var dom = document.createElement('style');
                dom.innerHTML = rm.style;
                document.getElementsByTagName('head')[0].appendChild(dom);
            }
            render(data.pagelets);

            if (rm.js) {
                LazyLoad.js(rm.js, function() {
                    rm.script && window.eval(rm.script);
                });
            }
            else {
                rm.script && window.eval(rm.script);
            }
        }

        rm.css
            ? LazyLoad.css(rm.css, loadNext)
            : loadNext();
    }


    function asyncLoad(arg, param, cb) {
        if (!(arg instanceof Array)) {
            arg = [arg];
        }
        var obj, arr = [];
        for (var i = arg.length - 1; i >= 0; i--) {
            obj = arg[i];
            if (!obj.id) {
                throw new Error('missing pagelet id');
            }

            idMaps[obj.id] = obj;
            arr.push('pagelets[]=' + obj.id);
        }

        var url = location.href.split('#')[0] + '&' + arr.join('&') + '&force_mode=1' + '&' + param;
        ajax(url, function(res) {
            var data = window.JSON?
                JSON.parse(res) :
                eval('(' + res + ')');


            if(cb && Object.prototype.toString.call(cb) === '[object Function]') {
                cb();
            }
            process(data);
        });
    }

    return {
        asyncLoad: asyncLoad
    }
}();

;/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false */

/**
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/

LazyLoad = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);

;define('taxi:widget/common/popup/popup.js', function(require, exports, module){

/**
 * @file 弹出浮层
 * @author liushuai02@baidu.com
 * @requires common:static/js/zepto
 */
/**
 * @module taxi:static/js/popup
 */
module.exports = {
    /**
     * 默认配置
     * @type {object}
     * @private
     */
    _defaultOptions: {
        autoCloseTime: 2000,
        isTouchHide: false
    },
    /**
     * popup根元素
     * @type {zepto}
     * @private
     */
    _$el: null,
    /**
     * 自动关闭计时器
     * @type {number}
     * @private
     */
    _autoCloseTimeout: null,
    /**
     * 创建一个popup
     * @param {object} options
     * @param {string} options.text popup文本
     * @returns {zepto}
     * @private
     */
    _create: function (options) {
        var $el, $layer;

        if (options.layer) {
            $layer = $('<div/>').addClass('taxi-widget-popup-layer')
                .appendTo(document.body);
        }

        $el = $('<div></div>')
            .addClass('taxi-widget-popup')
            .text(options.text || '')
            .hide()
            .appendTo(document.body);

        this._layout($el);

        this._$el = $el;
        this._$layer = $layer;
    },
    /**
     * popup根元素布局
     * @private
     */
    _layout: function ($el) {
        var offset, visibility;

        // display: none的元素无法获得其占位宽高
        if ($el.css('display') === 'none') {
            // 缓存元素之前的visibility属性
            visibility = $el.css('visibility');
            $el.css({
                visibility: 'visibile'
            }).show();
        }
        offset = $el.offset();
        $el.css({
            left: (window.innerWidth - offset.width - 20) / 2,
            top: (window.innerHeight - offset.height) / 2,
            visibility: visibility
        });
    },
    /**
     * 打开弹出层，并在设定的autoCloseTime之后自动关闭并销毁所创建的DOM元素
     * @param {object|string} options 如果类型为String，则直接作为文本附加到popup上，否则取options.text
     * @param {string} options.text popup文本
     * @param {number} [options.autoCloseTime=2000] 自动关闭时间，非真值(如0，false，null...)时不自动关闭
     * @param {function} [options.onClose] 关闭时的回调函数，context为exports
     * @param {boolean} options.isTouchHide 触碰关闭
     * @param {string} [options.layer=false] 是否需要背景层，默认为false
     */
    open: function (options) {
        var self = this;


        options = this._options = $.extend({}, this._defaultOptions,
            typeof(options) === 'string' ? {text: options} : options);

        if (!this._$el) {
            this._create(options);
        } else {
            this._$el.text(options.text);
            this._layout(this._$el);
        }

        this._$el.show();
        if (options.autoCloseTime) {
            clearTimeout(this._autoCloseTimeout);
            this._autoCloseTimeout = setTimeout($.proxy(this.close, this), options.autoCloseTime);
        }

        listener.on('common', 'sizechange', function () {
            setTimeout(function () {
                self.setPos();
            }, 1000);
        });
    },
    /**
     * 关闭弹出层
     */
    close: function () {
        var onClose;
        if (this._$layer) {
            this._$layer.remove();
            this._$layer = null;
        }
        if (this._$el) {
            this._$el.remove();
            this._$el = null;
            if ($.isFunction(onClose = this._options.onClose)) {
                onClose.call(this);
            }
            this._autoCloseTimeout = null;
        }
    },
    setPos: function () {
        if (this._$el) {
            var offset = this._$el.offset();
            var posX = (window.innerWidth - offset.width) / 2;
            var posY = (window.innerHeight - offset.height) / 2 + window.scrollY;
            this._$el.css({
                "left": posX,
                "top": posY
            });
        }
    }
};



});
;/**
 * @file localStorage封装
 */
define('taxi:static/js/storage.js', function (require, exports, module) {
    'use strict';

    function capitalize(s) {
        return s.replace(/./, function(m) {return m.toUpperCase()});
    }

    var localStorage = window.localStorage,
        page = _APP_HASH.page;

    exports = {
        /**
         * 设置值
         * @param key
         * @param value
         * @return {number} 无异常设置成功返回true，否则返回异常码
         */
        set: function (key, value) {
            try {
                localStorage.setItem('baiduTaxi'
                    + capitalize(page) + capitalize(key), value);
                return 0;
            } catch (e) {
                if (e instanceof window.DOMException) {
                    return e.code;
                }
            }
        },
        /**
         * 取值
         * @param key
         */
        get: function (key) {
            return localStorage.getItem('baiduTaxi'
                + capitalize(page) + capitalize(key));
        },
        /**
         * 移除值
         * @param key
         */
        remove: function (key) {
            localStorage.removeItem('baiduTaxi'
                + capitalize(page) + capitalize(key));
        },
        /**
         * 清除所有值
         */
        clear: function () {
            localStorage.clear();
        }
    };

    module.exports = exports;
});


;define('taxi:widget/common/addprice/addprice.js', function(require, exports, module){

/**
 * @file 加价模块
 */
'use strict';

var exports = {
    /**
     * 创建控件
     * @param {array} data 初始化数据，价格区间数组
     */
    create: function(data) {
        var $el = $('.taxi-widget-addprice'),
            $wrapper = $el.find('.wrapper'),
            documentFragment, $option, $label, $radio, $options;

        if($.isArray(data)) {
            documentFragment = document.createDocumentFragment();
            $.each(data, function(i, item) {
                $option = $('<div/>').addClass('option');
                $label = $('<label/>').text(item + '元').appendTo($option);
                $radio = $('<input/>').attr({
                    'type': 'radio',
                    'name': 'add_price'
                }).val(item).appendTo($option);
                $option.appendTo(documentFragment);
            });
            $wrapper.append(documentFragment);
        }

        $options = $el.find('.option');

        $options.on('click', $.proxy(this.onOptionClick, this));

        this.$el = $el;
    },
    onOptionClick: function(e) {
        this.setValue($(e.currentTarget).find('input[type=radio]').val());
    },
    /**
     * 设置值
     * @param {number} value 将要设置的值
     */
    setValue: function(value) {
        value = parseInt(value, 10) || 0;
        var $el = this.$el,
            $options = $el.find('.option'),
            $radio, $option;

        $options.each(function(i, option) {
            $option = $(option);
            $radio = $option.find('input[type=radio]');
            if(value === parseInt($radio.val(), 10)) {
                $radio.attr('checked', 'checked');
                $option.addClass('checked');
            } else {
                $radio.removeAttr('checked');
                $option.removeClass('checked');
            }
        });
    },

    /**
     * 控件初始化
     * @param {array} data 初始化数据，价格区间数组
     * @param {number} value 选中的值，默认为0
     */
    init: function(data, value) {
        this.create(data);
        this.setValue(value);
        this.$el.show();
    }
};

module.exports = exports;

});
;define('taxi:widget/common/dialog/dialog.js', function(require, exports, module){

/**
 * @file Dialog Widget
 * @author liushuai02@baidu.com
 */

'use strict';

var exports, defaultOptions;

defaultOptions = {
    layer: true
};

exports = {
    /**
     * 创建对话框DOM结构
     * @param {object} options 创建参数
     * @param {object} options.buttons 按钮配置，{text: callback}，按钮文本与点击回调函数键值对
     * @param {boolean} [options.layer=true] 是否有蒙版层，默认为true
     * @param {string|element|$} [options.content] 对话框内容，可以是html字符串或者dom元素对象或者Zepto对象
     */
    create: function (options) {
        var that = this,
            $el = this.$el = $('<div/>').addClass('taxi-widget-dialog').hide(),
            $content = this.$content = $('<div/>').addClass('content').appendTo($el),
            $buttonBar = this.$buttonBar = $('<div/>').addClass('button-bar').appendTo($el),
            $layer, buttons, content;

        options = this.options = $.extend({}, defaultOptions, options);

        content = options.content;
        if(typeof(content) === 'string') {
            $content.html(content);
        } else if(typeof(content === 'object')) {
            $content.append(content);
        }

        if (options && (buttons = options.buttons)) {
            $.each(buttons, function (text, callback) {
                $('<button/>').text(text).on('click', $.proxy(callback, that)).appendTo($buttonBar);
            });
        }

        if(options.layer) {
            $layer = this.$layer = $('<div/>').addClass('taxi-widget-dialog-layer').hide();
            $layer.append($el).appendTo(document.body);
        } else {
            $el.appendTo(document.body);
        }

        return this;
    },
    close: function () {
        this.$el.hide();
        if(this.options.layer) {
            this.$layer.hide();
        }
        return this;
    },
    open: function () {
        this.$el.show();
        if(this.options.layer) {
            this.$layer.show();
        }
        return this;
    },
    destroy: function() {
        this.$buttonBar.find('button').each(function(i, button) {
            $(button).off('click');
        });
        return this;
    }
};


module.exports = exports;


});
;define('taxi:widget/common/taxirequester/taxirequester.js', function(require, exports, module){

/**
 * @file taxirequester 打车请求发送的封装
 * @author liushuai02@baidu.com
 */
var stat = require('common:widget/stat/stat.js'),
    storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    dialog = require('taxi:widget/common/dialog/dialog.js'),
    exports = {
        request: function (options) {
            var that = this;
            if (Boolean(storage.get('notShowDialogBeforeSubmit')) === false) {
                dialog.create({
                    content: [
                        '<div class="text">确定发起打车？</div>',
                        '<input type="checkbox" value="1" class="taxi-ui-checkbox" id="not-show-dialog-before-submit" />',
                        '<label for="not-show-dialog-before-submit"><span class="icon"></span>下次不再提醒</label>'
                    ].join(''),
                    buttons: {
                        '确定': function () {
                            if (this.$el.find('input').attr('checked')) {
                                storage.set('notShowDialogBeforeSubmit', true);
                            }
                            that.submit(options);
                            this.close();
                        },
                        '取消': function () {
                            this.close();
                        }
                    }
                }).open();
            } else {
                this.submit(options);
            }
        },
        submit: function (options) {
            // 发送请求
            popup.open({
                text: '正在发送打车请求...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: options,
                success: function (data) {
                    storage.set('orderId', data.info.order_id);
                    storage.set('orderStartTime', Date.now());
                    LoadManager.loadPage('waiting', $.extend({}, options, data.info));
                    stat.addStat(STAT_CODE.TAXI_USERREQ, {
                        addPrice: options.add_price
                    });
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -121:
                            text = '发单太频繁，请稍后再试！';
                            break;
                        case -101:
                            text = '请求参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        }
    };
module.exports = exports;

});
;define('taxi:widget/home/home.js', function(require, exports, module){

/**
 * @file 填写订单页js
 * @author liushuai02@baidu.com
 */
'use strict';
require('common:static/js/gmu/src/widget/suggestion/suggestion.js');
require('common:static/js/gmu/src/widget/suggestion/renderlist.js');
require('common:static/js/gmu/src/widget/suggestion/sendrequest.js');

var util = require('common:static/js/util.js'),
    storage = require('taxi:static/js/storage.js'),
    geolocation = require('common:widget/geolocation/geolocation.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    addprice = require('taxi:widget/common/addprice/addprice.js'),
    taxirequester = require('taxi:widget/common/taxirequester/taxirequester.js'),

    exports = {
        create: function () {
            var that = this,
                $el = $('.taxi-widget-home'),
                $btnSubmit = $el.find('.btn-submit'),
                $nearbyCarInfo = $el.find('.nearby-car-info'),
                $addPrice = $el.find('.add-price'),
                $routeStart = $el.find('input[name=route_start]'),
                $routeEnd = $el.find('input[name=route_end]'),
                $form = $el.find('.home'),
                $inputPanel = $el.find('.input-panel'),
                $btnBack = $el.find('.btn-back'),
                $btnBackToForm = $el.find('.btn-back-to-form'),
                $btnSettings = $el.find('.btn-settings'),
                $btnConfirm = $el.find('.btn-confirm'),
                $formInputWrapper = $el.find('.home .input-wrapper');

            if (document.referrer && document.referrer.indexOf('taxi.map.baidu.com') < 0) {
                $btnBack.show();
                $btnBack.on('click', $.proxy(this.onBtnBackClick, this));
            }

            // 绑定提交订单事件
            $btnSubmit.on('click', $.proxy(this.onBtnSubmitClick, this));
            $btnBackToForm.on('click', $.proxy(this.onBtnBackToFormClick, this));
            $btnConfirm.on('click', $.proxy(this.onBtnConfirmClick, this));
            $btnSettings.on('click', $.proxy(this.onBtnSettingsClick, this));
            $formInputWrapper.on('click', $.proxy(this.onFormInputClick, this));


            listener.on('common.geolocation', 'success', function (event, data) {
                that.onGeoSuccess(data);
            });
            listener.on('common.geolocation', 'fail', $.proxy(this.onGeoFail, this));

            this.suggestion = new gmu.Suggestion('.poi-input', {
                source: 'http://map.baidu.com/su',
                cbKey: 'callback',
                listCount: 4, // SUG条目
                appendContanier: '.input-panel', //是否挂在body下面
                historyShare: false,
                quickdelete: false
            });
            this.suggestion.on('select', $.proxy(this.onBtnConfirmClick, this));

            // 将其他方法用到的变量附加到this
            this.$el = $el;
            this.$nearbyCarInfo = $nearbyCarInfo;
            this.$addPrice = $addPrice;
            this.$btnSubmit = $btnSubmit;
            this.$form = $form;
            this.$inputPanel = $inputPanel;
            this.$routeStart = $routeStart;
            this.$routeEnd = $routeEnd;
        },
        onBtnSubmitClick: function () {
            var verifyResult = this.verifyInput(),
                params = util.urlToJSON(this.$el.find('form').serialize());

            if (!this.geoSuccess) {
                popup.open({
                    text: '定位不成功，不能发起打车请求！',
                    layer: true
                });
                return false;
            }

            if (!this.getNearbyCarInfoSuccess) {
                popup.open({
                    text: '获取附近车辆信息失败，请稍后再试！',
                    layer: true
                });
                return false;
            }

            if (verifyResult < 0) {
                switch (verifyResult) {
                    case -1:
                        LoadManager.loadPage('verify', $.extend({}, params, {
                            referrer: 'home'
                        }));
                        break;
                    case -2:
                        popup.open({
                            text: '请输入起点!',
                            layer: true
                        });
                        break;
                    case -3:
                        popup.open({
                            text: '请输入终点!',
                            layer: true
                        });
                        break;
                    default:
                        break;
                }
                return false;
            }

            taxirequester.request(util.urlToJSON(this.$el.find('form').serialize()));
        },
        onFormInputClick: function (e) {
            var $input = $(e.currentTarget).find('input'),
                type = $input.attr('name');

            this.$form.hide();
            this.$inputPanel.show();
            this.$inputPanel.attr('data-type', type);
            this.$inputPanel.find('.poi-input').val($input.val()).focus();
        },
        onBtnSettingsClick: function () {
            var phone = storage.get('phone');
            if (phone) {
                LoadManager.loadPage('settings');
            } else {
                LoadManager.loadPage('verify');
            }
        },
        onBtnBackToFormClick: function () {
            this.backToForm();
        },
        onBtnConfirmClick: function () {
            var type = this.$inputPanel.attr('data-type');
            this.$el.find('input[name=' + type + ']')
                .val(this.$inputPanel.find('.poi-input').val());

            this.backToForm();
        },
        backToForm: function () {
            this.$inputPanel.find('.poi-input').val('');
            this.$inputPanel.hide();
            this.$form.show();
        },
        onGeoSuccess: function (data) {
            var cityCode = parseInt(data.addr.cityCode, 10),
                address;

            if (this.cityList.indexOf(cityCode) > -1) {
                this.getNearByCarInfo(data.point.x, data.point.y, cityCode);

                address = data.addr;
                address = address.address || (address.city + address.district + address.street);
                this.$routeStart.val(address);

                storage.set('cityCode', cityCode);
            } else {
                popup.open({
                    text: '当前城市不支持打车！',
                    layer: true
                });
            }
            this.geoSuccess = true;
        },
        onGeoFail: function () {
            popup.open({
                text: '定位失败\n请检查定位服务，以便将打车请求发您周边的司机!',
                layer: true
            });
            this.geoFail = true;
        },
        /**
         * 校验输入是否合法
         */
        verifyInput: function () {
            var phone = storage.get('phone'),
                routeStart = this.$routeStart.val(),
                routeEnd = this.$routeEnd.val();

            if (!routeStart) {
                return -2;
            }
            if (!routeEnd) {
                return -3;
            }
            if (!phone) {
                return -1;
            }
            return true;
        },
        /**
         * 获取附近出租车信息
         * @param {number} lng
         * @param {number} lat
         * @param {number} cityCode
         */
        getNearByCarInfo: function (lng, lat, cityCode) {
            var that = this,
                $nearbyCarInfo = this.$nearbyCarInfo;

            LoadManager.request({
                data: {
                    qt: 'nearby',
                    lng: lng,
                    lat: lat,
                    city_code: cityCode
                },
                success: function (data) {
                    var price_list, $el = that.$el;

                    $nearbyCarInfo
                        .addClass('loaded')
                        .find('.count').text(data.info.taxi_num);

                    if (data.info.is_add_price && data.info.is_add_price.flag === 1
                        && (price_list = data.info.is_add_price.price_list)) {
                        price_list = price_list.split(':');
                        addprice.init(price_list);

                        // 如果有加价模块将表单域中的加价默认值删除
                        $el.find('[type=input][name=add_price]').remove();
                    }

                    //填充表单域
                    $el.find('[name=taxi_num]').val(data.info.taxi_num);
                    $el.find('[name=lng]').val(lng);
                    $el.find('[name=lat]').val(lat);
                    $el.find('[name=city_code]').val(cityCode);
                    $el.find('[name=price_list]').val(price_list);
                    $el.find('[name=phone]').val(storage.get('phone'));
                    that.getNearbyCarInfoSuccess = true;
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -105:
                            text = '当前城市不支持打车！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        /**
         * 获取当前支持打车的城市id列表
         * @param {function} callback 获取成功回调函数
         */
        getCityList: function (callback) {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'citylist',
                    city_list: 'all'
                },
                success: function (data) {
                    that.cityList = data.info;
                    callback();
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -101:
                            text = '参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        onBtnBackClick: function () {
            history.back();
        },
        destroy: function () {

        },
        init: function () {
            this.create();
            this.getCityList($.proxy(geolocation.init, geolocation));
        }
    };

module.exports = exports;


});
;define('taxi:widget/common/radar/radar.js', function(require, exports, module){

/**
 * @file 雷达动画图标
 * @author liushuai02@baidu.com
 */
'use strict';
var exports = {
    create: function() {

        this.$el = $('.taxi-widget-radar');
        this.$inner = this.$el.find('.inner');

        this.currentStep = 0;
        this.maxStep = 9;
        this.timeperframe = 150;

        // 计算雷达高度
        this.$el.css({
            height: (window.innerHeight - 110) + 'px',
            visibility: 'visible'
        });
    },
    start: function() {
        this.interval = setInterval($.proxy(this.oneMove, this), this.timeperframe);
    },
    oneMove: function() {
        var $inner = this.$inner, innerWidth = $inner.width();

        $inner.css('background-position-y', -(((++this.currentStep)%this.maxStep) * innerWidth) + 'px');
    },
    destroy: function() {
        clearInterval(this.interval);
        this.interval = -1;
    },
    init: function() {
        this.create();
        this.start();
    }
};

module.exports = exports;



});
;define('taxi:widget/waiting/waiting.js', function(require, exports, module){

/**
 * @file 等车
 * @author liushuai02@baidu.com
 */
'use strict';
var storage = require('taxi:static/js/storage.js'),
    stat = require('common:widget/stat/stat.js'),
    radar = require('taxi:widget/common/radar/radar.js'),

    exports = {
        create: function () {
            var $el = $('.taxi-widget-waiting'),
                $nearbyCarCount = $el.find('.taxi-info .count'),
                options = this.options;

            $nearbyCarCount.text(options.taxi_num);

            this.$el = $el;
        },
        /**
         * 倒计时
         * @param {number} limit 最大推送量
         */
        countDown: function () {
            var that = this, options = this.options,
                limit = Math.min(parseInt(options.limit, 10), parseInt(options.taxi_num, 10)),
                $el = this.$el,
                $pushedCount = $el.find('.pushed-car .count'),
                $restSecond = $el.find('.second'),
                count, second,
                orderStartTime = parseInt(storage.get('orderStartTime'), 10), totalTime,
                step = function () {
                    count = parseInt($pushedCount.text(), 10);
                    second = parseInt($restSecond.text(), 10);

                    count = Math.min(count + 2, limit);
                    second -= 1;

                    $pushedCount.text(count);
                    $restSecond.text(second);

                    if (second <= 0) {
                        // 进入重发逻辑
                        that.destroy();
                        LoadManager.loadPage('resubmit', options);
                    } else {
                        that.timeout.push(setTimeout(step, 1000));
                    }
                };
            if (typeof(orderStartTime) === 'number' && !isNaN(orderStartTime)) {
                totalTime = 120 - Math.ceil((Date.now() - orderStartTime) / 1000);
                if (totalTime < 0) {
                    this.destroy();
                    LoadManager.loadPage('resubmit', options);
                } else {
                    $restSecond.text(totalTime);
                }
            }

            this.timeout.push(setTimeout(step, 1000));
        },
        getCarReply: function () {
            var that = this,
                interval, options = this.options,
                order_id = options.order_id;

            interval = setInterval(function () {
                LoadManager.request({
                    data: {
                        qt: 'driverreply',
                        order_id: order_id
                    },
                    success: function (data) {
                        if (data.info) {
                            clearInterval(interval);
                            interval = null;

                            that.destroy();
                            LoadManager.loadPage('response', data.info);
                            stat.addStat(STAT_CODE.TAXI_DRIVERREPLY);
                        }
                    }
                });
            }, 5000);
            this.interval.push(interval);
        },
        destroy: function () {
            var i, len, interval = this.interval, timeout = this.timeout;
            for (i = 0, len = interval.length; i < len; i++) {
                clearInterval(interval[i]);
            }
            for(i = 0, len = timeout.length; i < len; i++) {
                clearTimeout(timeout[i]);
            }
            radar.destroy();
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions();

            if (!options) {
                this.destroy();
                LoadManager.loadPage('home');
            }
            this.timeout = [];
            this.interval = [];
            this.create();
            this.countDown();
            this.getCarReply();
        }
    };

module.exports = exports;



});
;define('taxi:widget/resubmit/resubmit.js', function(require, exports, module){

/**
 * @file
 * @author liushuai02@baidu.com
 */

'use strict';

var util = require('common:static/js/util.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    storage = require('taxi:static/js/storage.js'),
    addprice = require('taxi:widget/common/addprice/addprice.js'),
    radar = require('taxi:widget/common/radar/radar.js'),

    exports = {
        create: function () {
            var $el = $('.taxi-widget-resubmit'),
                $btnResubmit = $el.find('.btn-resubmit'),
                $btnBack = $el.find('.btn-back'),
                $form = $el.find('form'),
                $addpriceWrapper  = $el.find('.addprice-wrapper'),
                options = this.options,
                priceList;

            // 创建加价模块
            if (options.price_list) {
                priceList = options.price_list.split(',');
                addprice.init(priceList);

                // 如果有加价模块将表单域中的加价默认值删除
                $el.find('[type=input][name=add_price]').remove();
            } else {
                $addpriceWrapper.hide();
            }

            $el.find('[name=city_code]').val(options.city_code);
            $el.find('[name=order_id]').val(options.order_id);

            $btnResubmit.on('click', $.proxy(this.onBtnResubmitClick, this));
            $btnBack.on('click', $.proxy(this.onBtnBackClick, this));

            this.$el = $el;
            this.$form = $form;
        },
        onBtnResubmitClick: function () {
            var options = $.extend({
                price_list: this.options.price_list,
                taxi_num: this.options.taxi_num
            }, util.urlToJSON(this.$form.serialize()));

            popup.open({
                text: '正在提交表单...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: $.extend({}, options, {
                    qt: 'addpricereq'
                }),
                success: function (data) {
                    storage.set('orderId', data.info.order_id);

                    storage.set('orderStartTime', Date.now());
                    LoadManager.loadPage('waiting', $.extend({}, options, data.info));
                    stat.addStat(STAT_CODE.TAXI_ADDPRICEREQ);
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -304:
                            text = '订单已过期或结束！';
                            break;
                        case -113:
                            text = '请求过于频繁，请稍后再试！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true,
                        onClose: function() {
                            storage.remove('orderId');
                            LoadManager.loadPage('home');
                        }
                    });
                }
            });
        },
        onBtnBackClick: function() {
            storage.remove('orderId');
        },
        destroy: function() {
            radar.destroy();
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions(),
                orderId = storage.get('orderId');

            if(!options || !orderId) {
                LoadManager.loadPage('home');
            }
            this.create();
        }
    };

module.exports = exports;


});
;define('taxi:widget/response/response.js', function(require, exports, module){

/**
 * @file 司机响应
 * @author liushuai02@baidu.com
 */
'use strict';

var storage = require('taxi:static/js/storage.js'),
    stat = require('common:widget/stat/stat.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-response'),
                $feedbackdialog = this.$feedbackdialog = $el.find('.feedbackdialog'),
                $btnOnCar = $el.find('.btn-on-car'),
                $btnNotCome = $el.find('.btn-not-come'),
                $btnAgreement = $el.find('.btn-agreement'),
                $btnEnd = $el.find('.btn-end'),
                $dialogLayer = this.$dialogLayer = $('<div/>')
                    .addClass('taxi-widget-response-feedbackdialog-layer')
                    .hide().appendTo(document.body);

            $feedbackdialog.appendTo($dialogLayer);
            $btnEnd.on('click', $.proxy(this.onBtnEndClick, this));
            $btnOnCar.on('click', $.proxy(this.onBtnOnCarClick, this));
            $btnNotCome.on('click', $.proxy(this.onBtnNotComeClick, this));
            $btnAgreement.on('click', $.proxy(this.onBtnAgreementClick, this));

            this.$responder = $el.find('.responder');
        },
        showResponder: function () {
            var innerHTML = this.$responder.html(),
                options = this.options;

            innerHTML = innerHTML.replace(/\$\{([a-z_]+)\}/g, function (m, key) {
                return options[key];
            });

            this.$responder.html(innerHTML);
            this.$responder.show();
        },
        openDialog: function () {
            this.$feedbackdialog.show();
            this.$dialogLayer.show();
        },
        closeDialog: function () {
            this.$feedbackdialog.hide();
            this.$dialogLayer.hide();
        },
        onBtnEndClick: function () {
            this.openDialog();
        },
        onBtnOnCarClick: function () {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'ordercomment',
                    order_id: this.orderId,
                    comment_type: 4
                },
                complete: function () {
                    that.closeDialog();
                    storage.remove('orderId');
                    LoadManager.loadPage('home');
                    stat.addStat(STAT_CODE.TAXI_ON_CAR);
                }
            });
        },
        onBtnNotComeClick: function () {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'ordercomment',
                    order_id: this.orderId,
                    comment_type: 5
                },
                complete: function () {
                    that.closeDialog();
                    storage.remove('orderId');
                    LoadManager.loadPage('home');
                    stat.addStat(STAT_CODE.TAXI_NOT_COME);
                }
            });
        },
        onBtnAgreementClick: function () {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'ordercomment',
                    order_id: this.orderId,
                    comment_type: 6
                },
                complete: function () {
                    that.closeDialog();
                    storage.remove('orderId');
                    LoadManager.loadPage('home');
                    stat.addStat(STAT_CODE.TAXI_AGREEMENT);
                }
            });
        },
        resizeFeedbackdialog: function () {
            this.$feedbackdialog.css({
                width: '270px',
                height: '210px',
                left: (window.innerWidth - 270) / 2 + 'px',
                top: (window.innerHeight - 210) / 2 + 'px'
            });
        },
        getTaxiPos: function () {
            var that = this, $el = this.$el,
                $distanceCount = $el.find('.distance .count'),
                $restTimeCount = $el.find('.rest-time .count'),
                interval;

            interval = setInterval(function () {
                LoadManager.request({
                    data: {
                        qt: 'taxipos',
                        order_id: that.orderId
                    },
                    success: function (data) {
                        var info = data.info;

                        $distanceCount.text(info.distance);
                        $restTimeCount.text(info.rest_time);

                        if (info.is_arrived) {
                            clearInterval(interval);
                            interval = -1;
                        }
                    },
                    error: function () {

                    }
                });
            }, 5000);
            this.interval = interval;
        },
        destroy: function () {
            clearInterval(this.interval);
            this.interval = -1;
        },
        init: function () {
            var options = this.options = LoadManager.getPageOptions(),
                orderId = storage.get('orderId');

            if (!options || !orderId) {
                LoadManager.loadPage('home');
            }
            this.orderId = orderId;
            this.create();
            this.showResponder();
            this.resizeFeedbackdialog();
            this.getTaxiPos();
        }
    };

module.exports = exports;



});
;define('taxi:widget/verify/verify.js', function(require, exports, module){

/**
 * @file 验证手机界面
 * @author liushuai02@baidu.com
 */
'use strict';
var storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    taxirequester = require('taxi:widget/common/taxirequester/taxirequester.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-verify'),
                $inputPhone = this.$inputPhone = $el.find('.input-phone'),
                $inputCode = this.$inputCode = $el.find('.input-code'),
                $btnGetCode = this.$btnGetCode = $el.find('.btn-get-code'),
                $btnVerifyPhone = this.$btnVerifyPhone = $el.find('.btn-verify-phone'),
                options = this.options;

            $btnGetCode.on('click', $.proxy(this.onBtnGetCodeClick, this));
            $btnVerifyPhone.on('click', $.proxy(this.onBtnVerifyPhoneClick, this));
            $inputPhone.on('keyup', $.proxy(this.onInputPhoneKeyup, this));
            $inputCode.on('keyup', $.proxy(this.onInputCodeKeyup, this));

            $inputPhone.val(options.phone || '');
            if (Taxi.validatePhone($inputPhone.val())) {
                $btnGetCode.removeAttr('disabled');
            }

            this.$btnGetCode = $btnGetCode;
            this.$inputPhone = $inputPhone;
        },
        onBtnGetCodeClick: function () {
            var that = this,
                $btnGetCode = this.$btnGetCode,
                $inputPhone = this.$inputPhone,
                interval, time = 60,
                btnText = $btnGetCode.text(),
                phone = this.$inputPhone.val(),
                refreshText = function () {
                    $btnGetCode.text(time + '秒');
                    time--;
                };

            $btnGetCode.attr('disabled', 'disabled');
            $inputPhone.attr('disabled', 'disabled');


            LoadManager.request({
                data: {
                    qt: 'sendcode',
                    phone: phone
                },
                success: function () {
                    LoadManager.setPageOptions('phone', phone);
                    refreshText();
                    interval = that.interval = setInterval(function () {
                        if (time === 0) {
                            $btnGetCode.removeAttr('disabled');
                            $inputPhone.removeAttr('disabled');
                            $btnGetCode.text(btnText);
                            clearInterval(interval);
                            interval = -1;
                        } else {
                            refreshText();
                        }
                    }, 1000);
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -201:
                            text = '请求太频繁，请60秒后重试！';
                            break;
                        case -101:
                            text = '参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true,
                        onClose: function () {
                            $btnGetCode.removeAttr('disabled');
                            $inputPhone.removeAttr('disabled');
                            $btnGetCode.text(btnText);
                            clearInterval(that.interval);
                            that.interval = -1;
                        }
                    });
                }
            });
        },
        onBtnVerifyPhoneClick: function () {
            var phone = this.$inputPhone.val(),
                $btnVerifyPhone = this.$btnVerifyPhone,
                options = this.options,
                referrer = options['referrer'];

            $btnVerifyPhone.attr('disabled', 'disabled');

            popup.open({
                text: '正在验证手机号...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: {
                    qt: 'verifycode',
                    phone: phone,
                    code: this.$inputCode.val()
                },
                success: function (data) {
                    popup.close();
                    if (data.info.is_pass === 1) {
                        // 根据来源进入不同的页面
                        storage.set('phone', phone);

                        delete options['referrer'];
                        switch (referrer) {
                            case 'home':
                                taxirequester.request($.extend({}, options, {
                                    qt: 'userreq',
                                    phone: phone
                                }));
                                break;

                            case 'settings':
                                LoadManager.loadPage('home');
                                break;
                            default:
                                LoadManager.loadPage('home');
                                break;
                        }
                    } else {
                        popup.open({
                            text: '验证码错误！',
                            layer: true
                        });
                    }
                    $btnVerifyPhone.removeAttr('disabled');
                    stat.addStat(STAT_CODE.TAXI_VERIFYCODE);
                },
                error: function () {
                    popup.close();
                    $btnVerifyPhone.removeAttr('disabled');
                }
            });
        },
        onInputPhoneKeyup: function () {
            if (Taxi.validatePhone(this.$inputPhone.val())) {
                this.$btnGetCode.removeAttr('disabled');
            } else {
                this.$btnGetCode.attr('disabled', 'disabled');
            }
        },
        onInputCodeKeyup: function () {
            if (Taxi.validatePhone(this.$inputPhone.val()) &&
                Taxi.validateCode(this.$inputCode.val())) {
                this.$btnVerifyPhone.removeAttr('disabled');
            } else {
                this.$btnVerifyPhone.attr('disabled', 'disabled');
            }
        },
        destroy: function () {
            clearInterval(this.interval);
            this.interval = -1;
        },
        init: function () {
            this.options = LoadManager.getPageOptions();
            this.create();
        }
    };
module.exports = exports;



});
;define('taxi:widget/settings/settings.js', function(require, exports, module){

/**
 * @file 设置页js
 */
'use strict';

var storage = require('taxi:static/js/storage.js'),
    exports = {
        create: function () {
            var $el = $('.taxi-widget-settings'),
                $inputPhone = $el.find('.input-phone'),
                $btnModify = $el.find('.btn-modify'),
                $btnHelp = $el.find('.btn-help'),
                $btnTerms = $el.find('.btn-terms');


            $inputPhone.val(storage.get('phone'));
            if(!Taxi.validatePhone($inputPhone.val())) {
                $btnModify.attr('disabled', 'disabled');
            }

            $btnModify.on('click', $.proxy(this.onBtnModifyClick, this));
            $inputPhone.on('keyup', $.proxy(this.onInputPhoneKeyup, this));
            $btnHelp.on('click', $.proxy(this.onArticleButtonClick, this));
            $btnTerms.on('click', $.proxy(this.onArticleButtonClick, this));

            this.$el = $el;
            this.$btnModify = $btnModify;
            this.$inputPhone = $inputPhone;
        },
        onArticleButtonClick: function(e) {
            var type = e.currentTarget.className.split('-')[1];

            LoadManager.loadPage('about', {
                type: type
            });
        },
        onBtnModifyClick: function () {
            var phone = this.$inputPhone.val();
            LoadManager.loadPage('verify', {
                phone: phone,
                referrer: 'settings'
            });
        },
        onInputPhoneKeyup: function() {
            if(Taxi.validatePhone(this.$inputPhone.val())) {
                this.$btnModify.removeAttr('disabled');
            } else {
                this.$btnModify.attr('disabled', 'disabled');
            }
        },
        init: function () {
            this.create();
        }
    };

module.exports = exports;

});
;define('taxi:widget/about/about.js', function(require, exports, module){

/**
 * @file 文本页面
 */
'use strict';

var stat = require('common:widget/stat/stat.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    exports = {
    create: function() {
        var $el = $('.taxi-widget-about'),
            $nav = $el.find('.taxi-widget-nav'),
            options = this.options,
            type = options && options.type;

        $nav.find('.title').text(({
            help: '打车攻略',
            terms: '条款与声明'
        })[type]);
        $el.find('.' + type).show();

        if(type === 'help') {
            stat.addStat(STAT_CODE.TAXI_HELP);
        } else {
            stat.addStat(STAT_CODE.TAXI_TERMS);
        }
    },
    init: function() {
        this.options = LoadManager.getPageOptions();

        if(!this.options) {
            popup.open({
                text: '系统异常',
                layer: true,
                onClose: function() {
                    LoadManager.loadPage('home');
                }
            });
        }

        this.create();
    }
};

module.exports = exports;

});
;define('taxi:widget/common/vcode/vcode.js', function(require, exports, module){

/**
 * @file 验证码组件
 * @author liushuai02@baidu.com
 */
'use strict';
var vCodeUrl = "http://map.baidu.com/maps/services/captcha?cb=?",
    imageUrl = 'http://map.baidu.com/maps/services/captcha/image';

module.exports = {
    create: function() {
        var $el = $('.taxi-widget-common-vcode'),
            $imageCode = $el.find('.image-code'),
            $inputVCode = $el.find('.input-vcode'),
            $inputCode = $el.find('.input-code'),
            $btnRefresh = $el.find('.btn-refresh');

        $btnRefresh.on('click', $.proxy(this.fetchVCode, this));

        this.$imageCode = $imageCode;
        this.$inputVCode = $inputVCode;
        this.$inputCode = $inputCode;
    },
    fetchVCode: function () {
        var that = this, vcode;
        $.ajax({
            url: vCodeUrl + '&t=' + (new Date()).getTime(),
            dataType: 'jsonp',
            success: function (data) {
                if (data.result.error === 0) {
                    vcode = data.content.vcode;
                    that.$imageCode.attr('src', imageUrl + '?vcode=' + vcode);
                    that.$inputVCode.val(vcode);
                }
            }
        });
    },
    getCode: function() {
        return this.$inputCode.val();
    },
    getVCode: function() {
        return this.$inputVCode.val();
    },
    init: function() {
        this.create();
        this.fetchVCode();
    }
};

});
;define('taxi:widget/channel/channel.js', function(require, exports, module){

'use strict';

var util = require('common:static/js/util.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    vcode = require('taxi:widget/common/vcode/vcode.js'),

    exports = {
        create: function () {
            var $el = $('.taxi-widget-channel'),
                $btnGetTicket = $el.find('.btn-get-ticket'),
                $phoneInput = $el.find('.phone-input'),
                $btnLater = $el.find('.btn-later'),
                $dialogSuccess = $el.find('.dialog.success'),
                $dialogOne = $el.find('.dialog.one'),
                $dialogInvalid = $el.find('.dialog.invalid');

            $btnGetTicket.on('click', $.proxy(this.onBtnTicketClick, this));
            $btnLater.on('click', $.proxy(this.onBtnLaterClick, this));

            this.$el = $el;
            this.$phoneInput = $phoneInput;
            this.$dialogSuccess = $dialogSuccess;
            this.$dialogOne = $dialogOne;
            this.$dialogInvalid = $dialogInvalid;
        },
        onBtnTicketClick: function () {
            var that = this, phone;

            phone = this.$phoneInput.val();

            if (!phone) {
                popup.open({
                    text: '请输入手机号！',
                    layer: true
                });
                return false;
            }

            if (!Taxi.validatePhone(phone)) {
                popup.open({
                    text: '手机号格式错误！',
                    layer: true
                });
                return false;
            }

            if(!vcode.getCode()) {
                popup.open({
                    text: '请输入验证码！',
                    layer: true
                });
                return false;
            }

            LoadManager.request({
                data: {
                    qt: 'bddiscount',
                    phone: phone,
                    channel: util.urlToJSON(location.search.split('?')[1]).channel,
                    code: vcode.getCode(),
                    vcode: vcode.getVCode()
                },
                success: function () {
                    that.$dialogSuccess.css({
                        display: '-webkit-box'
                    });
                },
                error: function (data) {
                    if (data && typeof(data.errno) === 'number') {
                        switch (data.errno) {
                            case -400:
                                that.$dialogOne.css({
                                    display: '-webkit-box'
                                });
                                break;
                            case -401:
                            case -402:
                                that.$dialogInvalid.css({
                                    display: '-webkit-box'
                                });
                                break;
                            case -403:
                                popup.open({
                                    text: '验证码错误！',
                                    layer: true
                                });
                                break;
                            default:
                                popup.open({
                                    text: '获取失败，请稍后重试！',
                                    layer: true
                                });
                                break;
                        }
                    }
                }
            });
        },
        onBtnLaterClick: function () {
            this.$dialogSuccess.css({
                display: 'none'
            });
        },
        init: function () {
            this.create();
        }
    };

module.exports = exports;

});
;define('taxi:widget/vip/home/home.js', function(require, exports, module){

/**
 * @file 填写订单页js
 * @author liushuai02@baidu.com
 */
'use strict';
require('common:static/js/gmu/src/widget/suggestion/suggestion.js');
require('common:static/js/gmu/src/widget/suggestion/renderlist.js');
require('common:static/js/gmu/src/widget/suggestion/sendrequest.js');

var util = require('common:static/js/util.js'),
    storage = require('taxi:static/js/storage.js'),
    geolocation = require('common:widget/geolocation/geolocation.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    addprice = require('taxi:widget/common/addprice/addprice.js'),
    stat = require('common:widget/stat/stat.js'),

    exports = {
        create: function () {
            var that = this,
                $el = $('.taxi-widget-vip-home'),
                $btnSubmit = $el.find('.btn-submit'),
                $nearbyCarInfo = $el.find('.nearby-car-info'),
                $addPrice = $el.find('.add-price'),
                $routeStart = $el.find('input[name=route_start]'),
                $routeEnd = $el.find('input[name=route_end]'),
                $phone = $el.find('input[name=phone]'),
                $form = $el.find('.home'),
                $inputPanel = $el.find('.input-panel'),
                $btnBackToForm = $el.find('.btn-back-to-form'),
                $btnConfirm = $el.find('.btn-confirm'),
                $formInputWrapper = $el.find('.home .input-wrapper'),
                $btnOrderlist = $el.find('.btn-orderlist'),
                $btnRegister = $el.find('.btn-register');

            // 绑定提交订单事件
            $btnSubmit.on('click', $.proxy(this.onBtnSubmitClick, this));
            $btnBackToForm.on('click', $.proxy(this.onBtnBackToFormClick, this));
            $btnConfirm.on('click', $.proxy(this.onBtnConfirmClick, this));
            $btnOrderlist.on('click', $.proxy(this.onBtnOrderlistClick, this));
            $btnRegister.on('click', $.proxy(this.onBtnRegisterClick, this));
            $formInputWrapper.on('click', $.proxy(this.onFormInputClick, this));


            listener.on('common.geolocation', 'success', function (event, data) {
                that.onGeoSuccess(data);
            });
            listener.on('common.geolocation', 'fail', $.proxy(this.onGeoFail, this));

            this.suggestion = new gmu.Suggestion('#sug-target', {
                source: 'http://map.baidu.com/su',
                cbKey: 'callback',
                listCount: 4, // SUG条目
                appendContanier: '.input-panel', //是否挂在body下面
                historyShare: false,
                quickdelete: false
            });
            this.suggestion.on('select', $.proxy(this.onBtnConfirmClick, this));

            // 将其他方法用到的变量附加到this
            this.$el = $el;
            this.$nearbyCarInfo = $nearbyCarInfo;
            this.$addPrice = $addPrice;
            this.$btnSubmit = $btnSubmit;
            this.$form = $form;
            this.$inputPanel = $inputPanel;
            this.$routeStart = $routeStart;
            this.$routeEnd = $routeEnd;
            this.$phone = $phone;
        },
        onBtnSubmitClick: function () {
            var verifyResult = this.verifyInput(),
                options = util.urlToJSON(this.$el.find('form').serialize()),
                text;

            if (!this.geoSuccess) {
                popup.open({
                    text: '定位不成功，不能发起打车请求！',
                    layer: true
                });
                return false;
            }

            if (!this.getNearbyCarInfoSuccess) {
                popup.open({
                    text: '获取附近车辆信息失败，请稍后再试！',
                    layer: true
                });
                return false;
            }

            if(!options.phone) {
                options.phone = options['third_phone'];
            }

            if (verifyResult < 0) {
                switch (verifyResult) {
                    case -1:
                        text = "客人电话号码格式错误！";
                        break;
                    case -2:
                        text = '请输入起点!';
                        break;
                    case -3:
                        text = '请输入终点!';
                        break;
                    default:
                        break;
                }
                popup.open({
                    text: text,
                    layer: true
                });
                return false;
            }

            this.submit(options);
        },
        submit: function (options) {
            // 发送请求
            popup.open({
                text: '正在发送打车请求...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: options,
                success: function (data) {
                    storage.set('orderId', data.info.order_id);
                    storage.set('orderStartTime', Date.now());
                    popup.open({
                        text: '订单发送成功！',
                        layer: true
                    });
                    stat.addStat(STAT_CODE.TAXI_USERREQ, {
                        addPrice: options.add_price
                    });
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -121:
                            text = '发单太频繁，请稍后再试！';
                            break;
                        case -101:
                            text = '请求参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        onFormInputClick: function (e) {
            var $input = $(e.currentTarget).find('input'),
                type = $input.attr('name');

            this.$form.hide();
            this.$inputPanel.show();
            this.$inputPanel.attr('data-type', type);
            this.$inputPanel.find('.poi-input').val($input.val()).focus();
        },
        onBtnBackToFormClick: function () {
            this.backToForm();
        },
        onBtnConfirmClick: function () {
            var type = this.$inputPanel.attr('data-type');
            this.$el.find('input[name=' + type + ']')
                .val(this.$inputPanel.find('.poi-input').val());

            this.backToForm();
        },
        onBtnOrderlistClick: function() {
            LoadManager.loadPage('vip/orderlist');
        },
        onBtnRegisterClick: function() {
            LoadManager.loadPage('vip/verify', {
                referrer: 'vip/home'
            });
        },
        backToForm: function () {
            this.$inputPanel.find('.poi-input').val('');
            this.$inputPanel.hide();
            this.$form.show();
        },
        onGeoSuccess: function (data) {
            var cityCode = parseInt(data.addr.cityCode, 10),
                address;

            if (this.cityList.indexOf(cityCode) > -1) {
                this.getNearByCarInfo(data.point.x, data.point.y, cityCode);

                address = data.addr;
                address = address.address || (address.city + address.district + address.street);
                this.$routeStart.val(address);

                storage.set('cityCode', cityCode);
            } else {
                popup.open({
                    text: '当前城市不支持打车！',
                    layer: true
                });
            }
            this.geoSuccess = true;
        },
        onGeoFail: function () {
            popup.open({
                text: '定位失败\n请检查定位服务，以便将打车请求发您周边的司机!',
                layer: true
            });
            this.geoFail = true;
        },
        /**
         * 校验输入是否合法
         */
        verifyInput: function () {
            var routeStart = this.$routeStart.val(),
                routeEnd = this.$routeEnd.val(),
                phone = this.$phone.val();

            if(phone && !Taxi.validatePhone(phone)) {
                return -1;
            }
            if (!routeStart) {
                return -2;
            }
            if (!routeEnd) {
                return -3;
            }

            return true;
        },
        /**
         * 获取附近出租车信息
         * @param {number} lng
         * @param {number} lat
         * @param {number} cityCode
         */
        getNearByCarInfo: function (lng, lat, cityCode) {
            var that = this,
                $nearbyCarInfo = this.$nearbyCarInfo;

            LoadManager.request({
                data: {
                    qt: 'nearby',
                    lng: lng,
                    lat: lat,
                    city_code: cityCode
                },
                success: function (data) {
                    var price_list, $el = that.$el;

                    $nearbyCarInfo
                        .addClass('loaded')
                        .find('.count').text(data.info.taxi_num);

                    if (data.info.is_add_price && data.info.is_add_price.flag === 1
                        && (price_list = data.info.is_add_price.price_list)) {
                        price_list = price_list.split(':');
                        addprice.init(price_list);

                        // 如果有加价模块将表单域中的加价默认值删除
                        $el.find('[type=input][name=add_price]').remove();
                    }

                    //填充表单域
                    $el.find('[name=taxi_num]').val(data.info.taxi_num);
                    $el.find('[name=lng]').val(lng);
                    $el.find('[name=lat]').val(lat);
                    $el.find('[name=city_code]').val(cityCode);
                    $el.find('[name=price_list]').val(price_list);
                    $el.find('[name=third_phone]').val(storage.get('thirdPhone'));
                    that.getNearbyCarInfoSuccess = true;
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -105:
                            text = '当前城市不支持打车！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        /**
         * 获取当前支持打车的城市id列表
         * @param {function} callback 获取成功回调函数
         */
        getCityList: function (callback) {
            var that = this;
            LoadManager.request({
                data: {
                    qt: 'citylist',
                    city_list: 'all'
                },
                success: function (data) {
                    that.cityList = data.info;
                    callback();
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -101:
                            text = '参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        destroy: function () {

        },
        init: function () {
            this.create();
            this.getCityList($.proxy(geolocation.init, geolocation));
        }
    };

module.exports = exports;


});
;define('taxi:widget/vip/verify/verify.js', function(require, exports, module){

/**
 * @file 验证手机界面
 * @author liushuai02@baidu.com
 */
'use strict';
var storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    stat = require('common:widget/stat/stat.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-vip-verify'),
                $inputPhone = this.$inputPhone = $el.find('.input-phone'),
                $inputCode = this.$inputCode = $el.find('.input-code'),
                $btnGetCode = this.$btnGetCode = $el.find('.btn-get-code'),
                $btnVerifyPhone = this.$btnVerifyPhone = $el.find('.btn-verify-phone'),
                $btnBack = $el.find('.btn-back');

            $btnGetCode.on('click', $.proxy(this.onBtnGetCodeClick, this));
            $btnVerifyPhone.on('click', $.proxy(this.onBtnVerifyPhoneClick, this));
            $inputPhone.on('keyup', $.proxy(this.onInputPhoneKeyup, this));
            $inputCode.on('keyup', $.proxy(this.onInputCodeKeyup, this));
            $btnBack.on('click', $.proxy(this.onBtnBackClick, this));

            $inputPhone.val(storage.get('thirdPhone') || '');
            if (Taxi.validatePhone($inputPhone.val())) {
                $btnGetCode.removeAttr('disabled');
            }

            if(this.options && this.options.referrer) {
                $btnBack.show();
            }

            this.$btnGetCode = $btnGetCode;
            this.$inputPhone = $inputPhone;
        },
        onBtnGetCodeClick: function () {
            var that = this,
                $btnGetCode = this.$btnGetCode,
                $inputPhone = this.$inputPhone,
                interval, time = 60,
                btnText = $btnGetCode.text(),
                phone = this.$inputPhone.val(),
                refreshText = function () {
                    $btnGetCode.text(time + '秒');
                    time--;
                };

            $btnGetCode.attr('disabled', 'disabled');
            $inputPhone.attr('disabled', 'disabled');


            LoadManager.request({
                data: {
                    qt: 'sendcode',
                    phone: phone
                },
                success: function () {
                    refreshText();
                    interval = that.interval = setInterval(function () {
                        if (time === 0) {
                            $btnGetCode.removeAttr('disabled');
                            $inputPhone.removeAttr('disabled');
                            $btnGetCode.text(btnText);
                            clearInterval(interval);
                            interval = -1;
                        } else {
                            refreshText();
                        }
                    }, 1000);
                },
                error: function (data) {
                    var text = '';
                    switch (data.errno) {
                        case -201:
                            text = '请求太频繁，请60秒后重试！';
                            break;
                        case -101:
                            text = '参数错误！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true,
                        onClose: function () {
                            $btnGetCode.removeAttr('disabled');
                            $inputPhone.removeAttr('disabled');
                            $btnGetCode.text(btnText);
                            clearInterval(that.interval);
                            that.interval = -1;
                        }
                    });
                }
            });
        },
        onBtnVerifyPhoneClick: function () {
            var phone = this.$inputPhone.val(),
                $btnVerifyPhone = this.$btnVerifyPhone;

            $btnVerifyPhone.attr('disabled', 'disabled');

            popup.open({
                text: '正在验证手机号...',
                layer: true,
                autoCloseTime: 0
            });

            LoadManager.request({
                data: {
                    qt: 'verifycode',
                    phone: phone,
                    code: this.$inputCode.val()
                },
                success: function (data) {
                    popup.close();
                    if (data.info.is_pass === 1) {
                        storage.set('thirdPhone', phone);
                        LoadManager.loadPage('vip/home');
                    } else {
                        popup.open({
                            text: '验证码错误！',
                            layer: true
                        });
                    }
                    $btnVerifyPhone.removeAttr('disabled');
                    stat.addStat(STAT_CODE.TAXI_VERIFYCODE);
                },
                error: function () {
                    popup.close();
                    $btnVerifyPhone.removeAttr('disabled');
                }
            });
        },
        onInputPhoneKeyup: function () {
            if (Taxi.validatePhone(this.$inputPhone.val())) {
                this.$btnGetCode.removeAttr('disabled');
            } else {
                this.$btnGetCode.attr('disabled', 'disabled');
            }
        },
        onInputCodeKeyup: function () {
            if (Taxi.validatePhone(this.$inputPhone.val()) &&
                Taxi.validateCode(this.$inputCode.val())) {
                this.$btnVerifyPhone.removeAttr('disabled');
            } else {
                this.$btnVerifyPhone.attr('disabled', 'disabled');
            }
        },
        onBtnBackClick: function() {
            LoadManager.loadPage(this.options.referrer);
        },
        destroy: function () {
            clearInterval(this.interval);
            this.interval = -1;
        },
        init: function () {
            this.options = LoadManager.getPageOptions();
            this.create();
        }
    };
module.exports = exports;



});
;/* jshint ignore: start */
define('taxi:static/js/template.js', function (require, exports, module) {
    window.baidu = window.baidu || {};

    baidu.template = baidu.template || {};

    //HTML转义
    baidu.template._encodeHTML = function (source) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\\/g, '&#92;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    //转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
    baidu.template._encodeEventHTML = function (source) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\\\\/g, '\\')
            .replace(/\\\//g, '\/')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r');
    };
});
/* jshint ignore: end */
;define('taxi:widget/vip/orderlist/orderlist.js', function(require, exports, module){

/**
 * @file 订单列表
 */
require('taxi:static/js/template.js');
// 这句变量定义写到逗号运算符中会导致变异出错！！
/* jshint ignore: start */
var listItemTemplate = [function(_template_object) {
var _template_fun_array=[];
var fn=(function(__data__){
var _template_varName='';
for(var name in __data__){
_template_varName+=('var '+name+'=__data__["'+name+'"];');
};
eval(_template_varName);
_template_fun_array.push('<div class="captain">代叫车订单：<span class="count">',typeof(info.length) === 'undefined'?'':baidu.template._encodeHTML(info.length),'</span></div><ul class="list">    ');for(var i = 0, len = info.length; i < len; i++) {_template_fun_array.push('        <li class="list-item">            ');if(info[i].status > 1) {_template_fun_array.push('                <div class="driver-info">                    <span class="name">',typeof(info[i].driver_name) === 'undefined'?'':baidu.template._encodeHTML(info[i].driver_name),'</span>                    <span class="carno">',typeof(info[i].taxi_no) === 'undefined'?'':baidu.template._encodeHTML(info[i].taxi_no),'</span>                    <div class="reply-time">                        ');                            var date = new Date(info[i].reply_time * 1000),                                month = date.getMonth() + 1,                                day = date.getDate(),                                hours = date.getHours(),                                minutes = date.getMinutes(),                                seconds = date.getSeconds(),                                doubleReg = /\d{2}/,                                formatTime;                            month = doubleReg.test(month) ? month : '0' + month;                            day = doubleReg.test(day) ? day : '0' + day;                            minutes = doubleReg.test(minutes) ? minutes : '0' + minutes;                            seconds = doubleReg.test(seconds) ? seconds : '0' + seconds;                            formatTime = date.getFullYear() + '-'                                + month + '-' + day                                + ' ' + hours + ':' + minutes + ':' + seconds;_template_fun_array.push('                        ',typeof(formatTime) === 'undefined'?'':baidu.template._encodeHTML(formatTime),'                    </div>                </div>                <div class="status">                    已接单                </div>                <div class="phone-bar">                    <a class="client-phone" href="tel:',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'">                        ');if(info[i].phone === info[i].third_phone) {_template_fun_array.push('                            <span class="title">本人：</span>                        ');} else {_template_fun_array.push('                            <span class="title">客人：</span>                        ');}_template_fun_array.push('                        <span class="phone">',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'</span>                    </a>                    <a class="driver-phone" href="tel:',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'">                        <span class="title">司机：</span>                        <span class="phone">',typeof(info[i].driver_phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].driver_phone),'</span>                    </a>                </div>            ');} else {_template_fun_array.push('                <a class="client-phone" href="tel:',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'">                    ');if(info[i].phone === info[i].third_phone) {_template_fun_array.push('                        <span class="title">本人：</span>                    ');} else {_template_fun_array.push('                        <span class="title">客人：</span>                    ');}_template_fun_array.push('                    <span class="phone">',typeof(info[i].phone) === 'undefined'?'':baidu.template._encodeHTML(info[i].phone),'</span>                </a>                ');if(info[i].status === 1){_template_fun_array.push('                    ');if(info[i].can_retry === 1) {_template_fun_array.push('                        <button class="btn-retry" data-order-id="',typeof(info[i].order_id) === 'undefined'?'':baidu.template._encodeHTML(info[i].order_id),'">重发</button>                    ');} else {_template_fun_array.push('                        <div class="status">                            推送中                        </div>                    ');}_template_fun_array.push('                ');} else {_template_fun_array.push('                    <div class="status">                        已过期                    </div>                ');}_template_fun_array.push('            ');}_template_fun_array.push('        </li>    ');}_template_fun_array.push('</ul>');
_template_varName=null;
})(_template_object);
fn = null;
return _template_fun_array.join('');

}][0];
/* jshint ignore: end*/
var storage = require('taxi:static/js/storage.js'),
    popup = require('taxi:widget/common/popup/popup.js'),
    exports = {
        create: function () {
            var $el = $('.taxi-widget-vip-orderlist'),
                $listContainer = $el.find('.list-container');

            // 设置$listContainer高度
            $listContainer.height(window.innerHeight - 50);

            this.$listContainer = $listContainer;
            $listContainer.on('click', $.proxy(this.onListContainerClick, this));
        },
        onListContainerClick: function(e) {
            if(e.target.className === 'btn-retry') {
                this.resubmit(e.target);
            }
        },
        resubmit: function(target) {
            var $target;
            popup.open({
                text: '正在重新发送打车请求...',
                layer: true
            });
            LoadManager.request({
                data: {
                    qt: 'addpricereq',
                    city_code: storage.get('cityCode'),
                    add_price: '0',
                    order_id: target.getAttribute('data-order-id')
                },
                success: function() {
                    popup.open({
                        text: '发送成功！',
                        layer: true
                    });
                    $target = $(target);
                    $target.parent().append('<div class="status">推送中</div>');
                    $target.remove();
                },
                error: function(data) {
                    var text = '';
                    switch (data.errno) {
                        case -101:
                            text = '参数错误！';
                            break;
                        case -304:
                            text = '订单已失效，请建立新单发送！';
                            break;
                        default:
                            text = '系统错误！';
                            break;
                    }
                    popup.open({
                        text: text,
                        layer: true
                    });
                }
            });
        },
        loadList: function() {
            var $listContainer = this.$listContainer;

            LoadManager.request({
                data: {
                    qt: 'myorder',
                    third_phone: storage.get('thirdPhone')
                },
                success: function (data) {
                    $listContainer && $listContainer.html('').append(listItemTemplate(data));
                }
            });
        },
        destroy: function() {
            clearInterval(this.interval);
        },
        init: function () {
            this.create();
            this.loadList();
            this.interval = setInterval($.proxy(this.loadList, this), 30000);
        }
    };

module.exports = exports;

});
;define('taxi:widget/vip/finish/finish.js', function(require, exports, module){

/**
 * @file vip版用户已上车
 * @author liushuai02@baidu.com
 */
'use strict';

var exports = {
    create: function () {
        var $el = $('.taxi-widget-vip-finish'),
            $seconds = $el.find('.seconds'),
            $logo = $el.find('.logo'),
            $loading = $el.find('.loading'),
            $text = $el.find('.text'),
            second = 5;

        $seconds.text(second);
        this.interval = setInterval(function () {
            if (second === 0) {
                location.href = 'http://taxi.map.baidu.com';
            } else {
                $seconds.text(second--);
            }
        }, 1000);

        $logo.on('click', $.proxy(this.onLogoClick, this));

        LoadManager.request({
            data: $.extend({
                qt: 'ordercomment',
                comment_type: 4
            }, this.options),
            complete: function () {
                $loading.hide();
                $text.show();
            }
        });

        this.$logo = $logo;
    },
    onLogoClick: function () {
        location.href = 'http://taxi.map.baidu.com';
        this.$logo.off('click');
    },
    destroy: function () {
        clearInterval(this.interval);
    },
    init: function () {
        this.options = LoadManager.getPageOptions();
        this.create();
    }
};

module.exports = exports;



});
;/**
 * @file 界面加载管理器
 * @author liushuai02@baidu.com
 */

(function (global, BigPipe, undefined) {
    'use strict';

    var popup = require('taxi:widget/common/popup/popup.js'),
        util = require('common:static/js/util.js'),
        storage = require('taxi:static/js/storage.js'),
        LoadManager = {
            pageControllerMap: {
                home: require('taxi:widget/home/home.js'),
                waiting: require('taxi:widget/waiting/waiting.js'),
                resubmit: require('taxi:widget/resubmit/resubmit.js'),
                response: require('taxi:widget/response/response.js'),
                verify: require('taxi:widget/verify/verify.js'),
                settings: require('taxi:widget/settings/settings.js'),
                about: require('taxi:widget/about/about.js'),
                channel: require('taxi:widget/channel/channel.js'),
                'vip/home': require('taxi:widget/vip/home/home.js'),
                'vip/verify': require('taxi:widget/vip/verify/verify.js'),
                'vip/orderlist': require('taxi:widget/vip/orderlist/orderlist.js'),
                'vip/finish': require('taxi:widget/vip/finish/finish.js')
            },
            /**
             * 获取pageOptions值，指定key时获取指定值，否则获取全部
             * @param {string} [key] 需要获取的pageOptions键名
             * @returns {Object}
             */
            getPageOptions: function (key) {
                var options = util.urlToJSON(storage.get('pageOptions'));
                return key ? options[key] : options;
            },
            /**
             * 设置pageOptions值，可以是指定key，value，也可以直接传入options对象，将覆盖原pageOptions
             * @param {string|object} key 类型为string时作为需设置值的pageOptions键名，类型是对象时覆盖原pageOptions
             * @param {string} [value] key参数类型为string，该值作为设置的pageOptions值
             */
            setPageOptions: function (key, value) {
                var options;
                if (typeof(key) === 'string') {
                    options = this.getPageOptions();
                    options[key] = value;
                    this.setPageOptions(options);
                } else if (typeof(key) === 'object') {
                    storage.set('pageOptions', util.jsonToQuery(key));
                }
            },
            /**
             * 发起打车相关请求
             * @param {object} options 请求的参数
             * @param {object} options.data 请求的url参数
             * @param {function} options.success 请求成功回调函数
             * @param {function} options.error 请求失败回调函数
             */
            request: function (options) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: '/mobile/webapp/taxi/api/' + util.jsonToQuery($.extend({}, options.data, {
                        api: 2,
                        os: 'webapp'
                    })),
                    success: function (data) {
                        if (data && data.errno === 0) {
                            if (options.success && $.isFunction(options.success)) {
                                options.success(data);
                            }
                        } else {
                            if (options.error && $.isFunction(options.error)) {
                                if (data) {
                                    options.error(data);
                                } else {
                                    popup.open({
                                        text: '网络数据异常！'
                                    });
                                }
                            }
                        }
                    },
                    error: function (xhr) {
                        if ($.isFunction(options.error) && xhr && (xhr.errno > 0)) {
                            options.error();
                        }
                    },
                    complete: options.complete
                });
            },
            loadPage: function (page, options, config) {
                var id, that = this, lastPage, pageController, $wrapper = $('#wrapper');
                page = page || that.getPageState('lastPage') || 'home';
                if (options) {
                    if (typeof(options) === 'object') {
                        options = util.jsonToQuery(options);
                    }
                    storage.set('pageOptions', options);
                }

                id = 'taxi-pagelet-' + this.slash2dash(page);

                BigPipe.asyncLoad({id: id}, options, function () {
                    popup.close();
                    $('<div/>').attr({
                        id: id
                    }).appendTo($wrapper.html(''));

                    // 当前页与上一页不一样时，认为是页面间跳转，否则视为页面初始刷新，不做销毁处理
                    if (that.getPageState('lastPage') !== page) {
                        // 销毁上一个页面
                        lastPage = that.getPageState('lastPage');
                        pageController = that.pageControllerMap[lastPage];
                        if (pageController && pageController.destroy && $.isFunction(pageController.destroy)) {
                            pageController.destroy();
                        }

                        if (!(config && config.privacy)) {
                            that.setPageState('lastPage', page);
                        }
                    }
                });
            },
            routeVip: function () {
                var id;
                if (id = util.urlToJSON(location.search.split('?')[1]).id) {
                    this.loadPage('vip/finish', {
                        order_id: id
                    }, {
                        privacy: true
                    });
                } else if (storage.get('thirdPhone')) {
                    this.loadPage(this.getPageState('lastPage') || 'vip/home');
                } else {
                    this.loadPage('vip/verify');
                }
            },
            routeIndex: function () {
                var that = this, orderId, channel;

                if (channel = util.urlToJSON(location.search.split('?')[1]).channel) {
                    this.loadPage('channel', null, {
                       privacy: true
                    });
                } else if (orderId = storage.get('orderId')) {
                    this.request({
                        data: {
                            qt: 'orderstatus',
                            order_id: orderId
                        },
                        success: function (data) {
                            var status = data.info && data.info.status;

                            switch (status) {
                                // 第三方数据返回，但已过期120s，进入重发页面
                                case -1:
                                    that.loadPage('resubmit');
                                    break;
                                // 第三方抢单数据已返回，进入司机应答页
                                case 2:
                                    that.loadPage('response');
                                    break;
                                // 订单创建成功，进入推送页
                                case 1:
                                    that.loadPage('waiting');
                                    break;
                                // 订单过期、无效、成单、结束清除状态cookie回到首页
                                case 3:
                                case -2:
                                case 3:
                                case 4:
                                    storage.remove('pageState');
                                    that.loadPage('home');
                                    break;
                                default:
                                    storage.remove('pageState');
                                    that.loadPage('home');
                                    break;

                            }
                            // 保存订单状态
                            that.setPageState('status', status);
                            // 保存订单存在时间
                            that.setPageState('existTime', data.info.exist_time);
                        },
                        error: function () {
                            storage.remove('pageState');
                            that.loadPage('home');
                        }
                    });
                } else {
                    this.loadPage(this.getPageState('lastPage'));
                }
            },
            route: function () {
                switch (window._APP_HASH.page) {
                    case 'vip':
                        this.routeVip();
                        break;
                    default:
                        this.routeIndex();
                        break;
                }
            },
            getPageState: function (key) {
                var pageState = util.urlToJSON(storage.get('pageState'));

                return pageState && pageState[key];
            },
            setPageState: function (key, value) {
                var pageState = util.urlToJSON(storage.get('pageState'));

                pageState[key] = value;
                storage.set('pageState', util.jsonToQuery(pageState));
            },
            removePageState: function (key) {
                this.setPageState(key, undefined);
            },
            slash2dash: function (string) {
                return string.replace('/', '-');
            },
            init: function () {
                // 判断localStorage是否可用
                if (storage.set('baiduTaxiLocalStorageTest', 1) !== 0) {
                    popup.open({
                        text: '检测到您的浏览器不支持缓存，您可能开启了无痕浏览模式，将无法使用本产品功能，请关闭后再试。',
                        layer: true,
                        autoCloseTime: 0
                    });
                    return false;
                } else {
                    popup.open({
                        text: '正在加载...',
                        layer: true,
                        autoCloseTime: 0
                    });
                    storage.remove('baiduTaxiLocalStorageTest');
                }

                this.route();
            }
        };
    global.LoadManager = LoadManager;
}(window, TaxiBigPipe));
;/**
 * @file taxi模块公用方法库
 * @author liushuai02@baidu.com
 */

(function () {
    'use strict';

    var util = require('common:static/js/util.js'),
        Taxi;

    Taxi = {
        resize: function() {
            var $main = $('#main'),
                $header = $('header');

            $main.height(window.innerHeight - $header.height());
        },
        validatePhone: function (phone) {
            return (/^1\d{10}$/g).test(phone);
        },
        validateCode: function (code) {
            return (/^\d{4}$/g).test(code);
        }
    };

    if (typeof window.onorientationchange !== 'undefined') {
        window.addEventListener('orientationchange', Taxi.resize, false);
    } else {
        window.addEventListener('resize', Taxi.resize, false);
    }
    if (util.isAndroid()) {
        window.addEventListener('resize', Taxi.resize, false);
    }

    window.Taxi = Taxi;
}());


;define('taxi:widget/common/banner/banner.js', function(require, exports, module){

/**
 * @file 广告banner
 * @author liushuai02@baidu.com
 */
'use strict';

var storage = require('taxi:static/js/storage.js'),
    exports = {
        create: function () {
            var $el = this.$el = $('.taxi-widget-banner'),
                $btnClose = $el.find('.btn-close'),
                cityCode;

            $btnClose.on('click', $.proxy(this.onBtnCloseClick, this));
            listener.on('common.geolocation', 'success', $.proxy(this.onGeoSuccess, this));

            if (cityCode = storage.get('cityCode')) {
                this.loadActivate({
                    cityCode: cityCode
                });
            }
            this.$el = $el;
        },
        onGeoSuccess: function (event, data) {
            if (data.addr.cityCode) {
                this.loadActivate(data.addr);
            }
        },
        loadActivate: function (data) {
            var that = this, activityData;
            if (data.cityCode) {
                if (activityData = sessionStorage.getItem('activityData')) {
                    that.buildBanner(JSON.parse(activityData));
                }
                LoadManager.request({
                    data: {
                        qt: 'activity',
                        city_code: data.cityCode,
                        phone: storage.get('phone'),
                        width: window.innerWidth * window.devicePixelRatio
                    },
                    success: function (data) {
                        sessionStorage.setItem('activityData', JSON.stringify(data));
                        that.buildBanner(data);
                    }
                });
            }
        },
        buildBanner: function (data) {
            this.$el.html('').append([
                    '<a href="',
                    data.info.activity_url,
                    '" style="background: url(',
                    data.info.verify_ad_url,
                    ') 0 0 no-repeat; background-size: cover"',
                    ' ></a>'
                ].join('')).css({
                    'visibility': 'visible'
                });
        },
        onBtnCloseClick: function () {
            this.$el.hide();
        },
        init: function () {
            this.create();
        }
    };

module.exports = exports;

});
;define('taxi:widget/common/nav/nav.js', function(require, exports, module){

var exports = {
    create: function () {
        var $el = $('.taxi-widget-nav'),
            $btnBack = $el.find('.btn-back');

        $btnBack.on('click', $.proxy(this.onBtnBackClick, this));
    },
    onBtnBackClick: function (e) {
        var $currentTarget = $(e.currentTarget),
            back = $currentTarget.attr('data-back');
        if (back) {
            if ((/http(s)?\:\/\//i).test(back)) {
                location.href = back;
            } else {
                LoadManager.loadPage(back);
            }
        } else {
            LoadManager.loadPage('home');
        }
    },
    init: function () {
        this.create();
    }
};
module.exports = exports;

});