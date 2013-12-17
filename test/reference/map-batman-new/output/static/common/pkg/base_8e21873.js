/**
 * file: mod-store.js
 * ver: 1.0.0
 * auth: zhangjiachen@baidu.com
 * modify: fansekey@gmail.com
 * update: 2013-11-13
 */
var require, define;

(function(self) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        resMap = {},
        pkgMap = {};

    function loadByXHR(id, url, callback) {
        var store = localStorage
            , content
            , item;

        function _load(url, cb) {
            var xhr = new window.XMLHttpRequest;
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 ) {
                    if (xhr.status==200) {
                        content = xhr.responseText
                        var oldUrl = store.getItem(id);

                        if (oldUrl) {
                            store.removeItem(oldUrl);
                        }
                        
                        store.setItem(url, content);
                        store.setItem(id, url);

                        cb(content);
                    } else {
                        throw new Error('A unkown error occurred.');
                    }
                }
            };
            xhr.open('get', url);
            xhr.send(null);
        }

        if ((content = store.getItem(url))) {
            
            if (!store.getItem(id)) {
                store.setItem(id, url);
            }

            callback(content);
        } else {
            _load(url, callback);
        }
    }



    function createScript(url, onerror) {
        if (url in scriptsMap) return;
        scriptsMap[url] = true;

        var script = document.createElement('script');
        if (onerror) {
            var tid = setTimeout(onerror, require.timeout);

            script.onerror = function() {
                clearTimeout(tid);
                onerror();
            };

            script.onreadystatechange = function() {
                if (this.readyState == 'complete') {
                    clearTimeout(tid);
                }
            }
        }
        script.type = 'text/javascript';
        script.src = url;
        head.appendChild(script);
        return script;
    }


    function loadScript(id, callback, onerror) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        //
        // resource map query
        //
        var res = resMap[id] || {};
        var pkg = res.pkg;
        var url;

        if (pkg) {
            url = pkgMap[pkg].url;
        } else {
            url = res.url || id;
        }


        if (!window.XMLHttpRequest) {
                createScript(url, onerror && function() {
                        onerror(id);
                });
        } else {
            if (! (url in scriptsMap))  {
                scriptsMap[url] = true;
                loadByXHR(id, url, function(content) {
                    script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.innerHTML = content;
                    head.appendChild(script);
                });
            }
        }
    }

    define = function(id, factory) {
        factoryMap[id] = factory;

        var queue = loadingMap[id];
        if (queue) {
            for(var i = queue.length - 1; i >= 0; --i) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {
        id = require.alias(id);

        var mod = modulesMap[id];
        if (mod) {
            return mod.exports;
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
            throw Error('Cannot find module `' + id + '`');
        }

        mod = modulesMap[id] = {
            exports: {}
        };

        //
        // factory: function OR value
        //
        var ret = (typeof factory == 'function')
                ? factory.apply(mod, [require, mod.exports, mod])
                : factory;

        if (ret) {
            mod.exports = ret;
        }
        return mod.exports;
    };

    require.async = function(names, onload, onerror) {
        if (typeof names == 'string') {
            names = [names];
        }

        for(var i = names.length - 1; i >= 0; --i) {
            names[i] = require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for(var i = depArr.length - 1; i >= 0; --i) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) {
                    continue;
                }

                needMap[dep] = true;
                needNum++;
                loadScript(dep, updateNeed, onerror);

                var child = resMap[dep];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 == needNum--) {
                var i, n, args = [];
                for(i = 0, n = names.length; i < n; ++i) {
                    args[i] = require(names[i]);
                }
                onload && onload.apply(self, args);
            }
        }

        findNeed(names);
        updateNeed();
    };

    require.resourceMap = function(obj) {
        var k, col;

        // merge `res` & `pkg` fields
        col = obj.res;
        for(k in col) {
            if (col.hasOwnProperty(k)) {
                resMap[k] = col[k];
            }
        }

        col = obj.pkg;
        for(k in col) {
            if (col.hasOwnProperty(k)) {
                pkgMap[k] = col[k];
            }
        }
    };

    require.loadJs = function(url) {
        createScript(url);
    };

    require.loadCss = function(cfg) {
        if (cfg.content) {
            var sty = document.createElement('style');
            sty.type = 'text/css';

            if (sty.styleSheet) {       // IE
                sty.styleSheet.cssText = cfg.content;
            } else {
                sty.innerHTML = cfg.content;
            }
            head.appendChild(sty);
        }
        else if (cfg.url) {
            var link = document.createElement('link');
            link.href = cfg.url;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }
    };


    require.alias = function(id) {return id};

    require.timeout = 5000;

    define.amd = {
        'jQuery': true,
        'version': '1.0.0'
    };

})(this);
;/* Zepto v1.0-1-ga3cab6c - polyfill zepto detect event ajax form fx - zeptojs.com/license */
/**
 * @external $
 */
;(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '') }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError()
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
      if(typeof fun != 'function') throw new TypeError()
      if(len == 0 && arguments.length == 1) throw new TypeError()

      if(arguments.length >= 2)
       accumulator = arguments[1]
      else
        do{
          if(k in t){
            accumulator = t[k++]
            break
          }
          if(++k >= len) throw new TypeError()
        } while (true)

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
        k++
      }
      return accumulator
    }

})()

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]*)$/,
    tagSelectorRE = /^[\w-]+$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    if (!(name in containers)) name = '*'

    var nodes, dom, container = containers[name]
    container.innerHTML = '' + html
    dom = $.each(slice.call(container.childNodes), function(){
      container.removeChild(this)
    })
    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }
    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes. If a plain object is given, duplicate it.
      else if (isObject(selector))
        dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (isDocument(element) && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) { return str.trim() }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = null)
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return (value === undefined) ?
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
           this[0].value)
        ) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2 && typeof property == 'string')
        return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(){
      if (!this.length) return
      return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value){
      var offset, el = this[0],
        Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
      if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
        isDocument(el) ? el.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          traverseNode(parent.insertBefore(node, target), function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
'$' in window || (window.$ = Zepto)

;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
    os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)

;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={},
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.type(events) != "string") $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (handler.e == 'focus' || handler.e == 'blur') ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || type
  }

  function add(element, events, fn, selector, getDelegate, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = getDelegate && getDelegate(fn, event)
      var callback  = handler.del || fn
      handler.proxy = function (e) {
        var result = callback.apply(element, [e].concat(e.data))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      })
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.bind(event, selector || callback) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (typeof type != 'string') props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    event.isDefaultPrevented = function(){ return this.defaultPrevented }
    return event
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    if (!('type' in options)) return $.ajax(options)

    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      cleanup = function() {
        clearTimeout(abortTimeout)
        $(script).remove()
        delete window[callbackName]
      },
      abort = function(type){
        cleanup()
        // In case of manual abort or timeout, keep an empty function as callback
        // so that the SCRIPT tag that eventually loads won't result in an error.
        if (!type || type == 'timeout') window[callbackName] = empty
        ajaxError(null, type || 'abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return false
    }

    window[callbackName] = function(data){
      cleanup()
      ajaxSuccess(data, xhr, options)
    }

    script.onerror = function() { abort('error') }

    script.src = options.url.replace(/=\?/, '=' + callbackName)
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true,
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
      return $.ajaxJSONP(settings)
    }

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data)
    return {
      url:      url,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

  $.get = function(url, data, success, dataType){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function () {
    var result = []
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
    })
    return result.join('&')
  }

  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming,
    animationName, animationDuration, animationTiming,
    cssReset = {}

  function dasherize(str) { return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2')) }
  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd

    if (duration === undefined) duration = 0.4
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      }
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
    longTapDelay = 750,
    gesture

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >=
      Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  function isPrimaryTouch(event){
    return event.pointerType == event.MSPOINTER_TYPE_TOUCH && event.isPrimary
  }

  $(document).ready(function(){
    var now, delta, deltaX = 0, deltaY = 0, firstTouch

    if ('MSGesture' in window) {
      gesture = new MSGesture()
      gesture.target = document.body
    }

    $(document)
      .bind('MSGestureEnd', function(e){
        var swipeDirectionFromVelocity =
          e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
        if (swipeDirectionFromVelocity) {
          touch.el.trigger('swipe')
          touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
        }
      })
      .on('touchstart MSPointerDown', function(e){
        if(e.type == 'MSPointerDown' && !isPrimaryTouch(e)) return;
        firstTouch = e.type == 'MSPointerDown' ? e : e.touches[0]
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $('tagName' in firstTouch.target ?
          firstTouch.target : firstTouch.target.parentNode)
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = firstTouch.pageX
        touch.y1 = firstTouch.pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
        // adds the current touch contact for IE gesture recognition
        if (gesture && e.type == 'MSPointerDown') gesture.addPointer(e.pointerId);
      })
      .on('touchmove MSPointerMove', function(e){
        if(e.type == 'MSPointerMove' && !isPrimaryTouch(e)) return;
        firstTouch = e.type == 'MSPointerMove' ? e : e.touches[0]
        cancelLongTap()
        touch.x2 = firstTouch.pageX
        touch.y2 = firstTouch.pageY

        deltaX += Math.abs(touch.x1 - touch.x2)
        deltaY += Math.abs(touch.y1 - touch.y2)
      })
      .on('touchend MSPointerUp', function(e){
        if(e.type == 'MSPointerUp' && !isPrimaryTouch(e)) return;
        cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)
          // don't fire tap when delta position changed by more than 30 pixels,
          // for instance when moving to a point and back to origin
          if (deltaX < 30 && deltaY < 30) {
            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
            // ('tap' fires before 'scroll')
            tapTimeout = setTimeout(function() {

              // trigger universal 'tap' with the option to cancelTouch()
              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
              var event = $.Event('tap')
              event.cancelTouch = cancelAll
              touch.el.trigger(event)

              // trigger double tap immediately
              if (touch.isDoubleTap) {
                touch.el.trigger('doubleTap')
                touch = {}
              }

              // trigger single tap after 250ms of inactivity
              else {
                touchTimeout = setTimeout(function(){
                  touchTimeout = null
                  touch.el.trigger('singleTap')
                  touch = {}
                }, 250)
              }
            }, 0)
          } else {
            touch = {}
          }
          deltaX = deltaY = 0

      })
      // when the browser window loses focus,
      // for example when a modal dialog is shown,
      // cancel all ongoing events
      .on('touchcancel MSPointerCancel', cancelAll)

    // scrolling the window indicates intention of the user
    // to scroll, not tap or swipe, so cancel all ongoing events
    $(window).on('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
    'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
    $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
  })
})(Zepto)

;/**
 * 全局广播通知;
 * 严格的区分了频道与事件的概念
 *
 * @example
 *
 * A模块内监听'com.myTest'频道下的say事件
 * listener.on('com.myTest', 'say', function(d){alert(d);});
 *
 * B模块内触发'com.myTest'频道下的say事件
 * listener.trigger('com.myTest', 'say', 'Hello World!');
 */
window.listener = window.listener || (function() {
    var EXECTIME = 50, //连续执行时间，防止密集运算
        DELAY = 25;

    var that = {},
        timer = '',
        slice = [].slice,
        channelList = {}; //用于保存被注册过所有频道
    /**
     * 通知监听
     * @param {String} channel 频道名
     * @param {String} type 事件类型
     * @param {Function} callback 事件响应
     * @param {Object} context 上下文环境
     */
    var on = function(channel, type, callback, context) {
        var curChannel = channelList[channel];
        if (!curChannel) {
            curChannel = channelList[channel] = {};
        }
        curChannel[type] = curChannel[type] || [];
        curChannel[type].push({
            'func': callback,
            'context': context || that
        });
    };

    /**
     * 通知监听, 执行一次后销毁
     * @param  {[type]}   channel  [description]
     * @param  {[type]}   type     [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   context  [description]
     * @return {[type]}            [description]
     */
    var once = function(channel, type, callback, context) {
        var _once = function() {
            that.off(channel, type, _once);
            return callback.apply(context || that, arguments);
        };
        on(channel, type, _once, context);
    };

    /**
     * 事件触发
     * @param {String} channel
     * @param {String} type
     * @param {Object} data 要传递给相应函数的实参
     */
    var trigger = function(channel, type, data) {
        if (channelList[channel] && channelList[channel][type] && channelList[channel][type].length) {
            var taskList = channelList[channel][type];
            var curHandlers = [];
            for (var i = taskList.length; i--;) {
                curHandlers.push({
                    'handler': taskList[i],
                    'args': slice.call(arguments, 1)
                });
            }
            (function() {
                var start = +new Date();
                do {
                    var curTask = curHandlers.shift(),
                        handler = curTask.handler;
                    try {
                        handler.func.apply(handler.context, curTask.args);
                    } catch (exp) {
                        //console.log('listener: One of ' + curTask['type'] + '`s function execute error!');
                    }
                } while (curHandlers.length && (+new Date() - start < EXECTIME));
                if (curHandlers.length > 0) {
                    setTimeout(arguments.callee, DELAY);
                }
            })();
        }
    };

    /**
     * 事件监听移除
     * @param {String} channel 频道名
     * @param {String} type 事件类型
     * @param {Function} callback 要移除的事件响应函数句柄
     */
    var off = function(channel, type, callback, context) {
        context = context || that;
        if (channelList[channel] && channelList[channel][type] && channelList[channel][type].length) {
            var taskList = channelList[channel][type];
            var handler;
            for (var i = taskList.length; i--;) {
                handler = taskList[i];
                if (handler.func === callback && handler.context === context) {
                    taskList.splice(i, 1);
                }
            }
        }
    };

    that.on = on;
    that.once = once;
    that.trigger = trigger;
    that.off = off;

    return that;
})();
;window.baidu = window.baidu || {};
baidu.template = baidu.template || {};

//HTML转义
baidu.template._encodeHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
};

//转义UI UI变量使用在HTML页面标签onclick等事件函数参数中
baidu.template._encodeEventHTML = function (source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;')
        .replace(/\\\\/g,'\\')
        .replace(/\\\//g,'\/')
        .replace(/\\n/g,'\n')
        .replace(/\\r/g,'\r');
};

;define('common:static/js/gmu/src/core/gmu.js', function(require, exports, module){


// Copyright (c) 2013, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://gmu.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @file 声明gmu命名空间
 * @namespace gmu
 * @import zepto.js
*/

/**
 * GMU是基于zepto的轻量级mobile UI组件库，符合jquery ui使用规范，提供webapp、pad端简单易用的UI组件。为了减小代码量，提高性能，组件再插件化，兼容iOS3+ / android2.1+，支持国内主流移动端浏览器，如safari, chrome, UC, qq等。
 * GMU由百度GMU小组开发，基于开源BSD协议，支持商业和非商业用户的免费使用和任意修改，您可以通过[get started](http://gmu.baidu.com/getstarted)快速了解。
 *
 * ###Quick Start###
 * + **官网：**http://gmu.baidu.com/
 * + **API：**http://gmu.baidu.com/doc
 *
 * ###历史版本###
 *
 * ### 2.0.5 ###
 * + **DEMO: ** http://gmu.baidu.com/demo/2.0.5
 * + **API：** http://gmu.baidu.com/doc/2.0.5
 * + **下载：** http://gmu.baidu.com/download/2.0.5
 *
 * @module GMU
 * @title GMU API 文档
 */
window.gmu = window.gmu || {
    version: '2.1.2',
    $: window.Zepto,

    /**
     * 调用此方法，可以减小重复实例化Zepto的开销。所有通过此方法调用的，都将公用一个Zepto实例，
     * 如果想减少Zepto实例创建的开销，就用此方法。
     * @method staticCall
     * @grammar gmu.staticCall( dom, fnName, args... )
     * @param  {DOM} elem Dom对象
     * @param  {String} fn Zepto方法名。
     * @param {*} * zepto中对应的方法参数。
     * @example
     * // 复制dom的className给dom2, 调用的是zepto的方法，但是只会实例化一次Zepto类。
     * var dom = document.getElementById( '#test' );
     *
     * var className = gmu.staticCall( dom, 'attr', 'class' );
     * console.log( className );
     *
     * var dom2 = document.getElementById( '#test2' );
     * gmu.staticCall( dom, 'addClass', className );
     */
    staticCall: (function( $ ) {
        var proto = $.fn,
            slice = [].slice,

            // 公用此zepto实例
            instance = $();

        instance.length = 1;

        return function( item, fn ) {
            instance[ 0 ] = item;
            return proto[ fn ].apply( instance, slice.call( arguments, 2 ) );
        };
    })( Zepto )
};

});
;define('common:static/js/gmu/src/core/event.js', function(require, exports, module){

require("common:static/js/gmu/src/core/gmu.js");
/**
 * @file Event相关, 给widget提供事件行为。也可以给其他对象提供事件行为。
 * @import core/gmu.js
 * @module GMU
 */
(function( gmu, $ ) {
    var slice = [].slice,
        separator = /\s+/,

        returnFalse = function() {
            return false;
        },

        returnTrue = function() {
            return true;
        };

    function eachEvent( events, callback, iterator ) {

        // 不支持对象，只支持多个event用空格隔开
        (events || '').split( separator ).forEach(function( type ) {
            iterator( type, callback );
        });
    }

    // 生成匹配namespace正则
    function matcherFor( ns ) {
        return new RegExp( '(?:^| )' + ns.replace( ' ', ' .* ?' ) + '(?: |$)' );
    }

    // 分离event name和event namespace
    function parse( name ) {
        var parts = ('' + name).split( '.' );

        return {
            e: parts[ 0 ],
            ns: parts.slice( 1 ).sort().join( ' ' )
        };
    }

    function findHandlers( arr, name, callback, context ) {
        var matcher,
            obj;

        obj = parse( name );
        obj.ns && (matcher = matcherFor( obj.ns ));
        return arr.filter(function( handler ) {
            return handler &&
                    (!obj.e || handler.e === obj.e) &&
                    (!obj.ns || matcher.test( handler.ns )) &&
                    (!callback || handler.cb === callback ||
                    handler.cb._cb === callback) &&
                    (!context || handler.ctx === context);
        });
    }

    /**
     * Event类，结合gmu.event一起使用, 可以使任何对象具有事件行为。包含基本`preventDefault()`, `stopPropagation()`方法。
     * 考虑到此事件没有Dom冒泡概念，所以没有`stopImmediatePropagation()`方法。而`stopProgapation()`的作用就是
     * 让之后的handler都不执行。
     *
     * @class Event
     * @constructor
     * ```javascript
     * var obj = {};
     *
     * $.extend( obj, gmu.event );
     *
     * var etv = gmu.Event( 'beforeshow' );
     * obj.trigger( etv );
     *
     * if ( etv.isDefaultPrevented() ) {
     *     console.log( 'before show has been prevented!' );
     * }
     * ```
     * @grammar new gmu.Event( name[, props]) => instance
     * @param {String} type 事件名字
     * @param {Object} [props] 属性对象，将被复制进event对象。
     */
    function Event( type, props ) {
        if ( !(this instanceof Event) ) {
            return new Event( type, props );
        }

        props && $.extend( this, props );
        this.type = type;

        return this;
    }

    Event.prototype = {

        /**
         * @method isDefaultPrevented
         * @grammar e.isDefaultPrevented() => Boolean
         * @desc 判断此事件是否被阻止
         */
        isDefaultPrevented: returnFalse,

        /**
         * @method isPropagationStopped
         * @grammar e.isPropagationStopped() => Boolean
         * @desc 判断此事件是否被停止蔓延
         */
        isPropagationStopped: returnFalse,

        /**
         * @method preventDefault
         * @grammar e.preventDefault() => undefined
         * @desc 阻止事件默认行为
         */
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
        },

        /**
         * @method stopPropagation
         * @grammar e.stopPropagation() => undefined
         * @desc 阻止事件蔓延
         */
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
        }
    };

    /**
     * @class event
     * @static
     * @description event对象，包含一套event操作方法。可以将此对象扩张到任意对象，来增加事件行为。
     *
     * ```javascript
     * var myobj = {};
     *
     * $.extend( myobj, gmu.event );
     *
     * myobj.on( 'eventname', function( e, var1, var2, var3 ) {
     *     console.log( 'event handler' );
     *     console.log( var1, var2, var3 );    // =>1 2 3
     * } );
     *
     * myobj.trigger( 'eventname', 1, 2, 3 );
     * ```
     */
    gmu.event = {

        /**
         * 绑定事件。
         * @method on
         * @grammar on( name, fn[, context] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   context  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        on: function( name, callback, context ) {
            var me = this,
                set;

            if ( !callback ) {
                return this;
            }

            set = this._events || (this._events = []);

            eachEvent( name, callback, function( name, callback ) {
                var handler = parse( name );

                handler.cb = callback;
                handler.ctx = context;
                handler.ctx2 = context || me;
                handler.id = set.length;
                set.push( handler );
            } );

            return this;
        },

        /**
         * 绑定事件，且当handler执行完后，自动解除绑定。
         * @method one
         * @grammar one( name, fn[, context] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   context  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        one: function( name, callback, context ) {
            var me = this;

            if ( !callback ) {
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                var once = function() {
                        me.off( name, once );
                        return callback.apply( context || me, arguments );
                    };

                once._cb = callback;
                me.on( name, once, context );
            } );

            return this;
        },

        /**
         * 解除事件绑定
         * @method off
         * @grammar off( name[, fn[, context] ] ) => self
         * @param  {String}   name     事件名
         * @param  {Function} callback 事件处理器
         * @param  {Object}   context  事件处理器的上下文。
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        off: function( name, callback, context ) {
            var events = this._events;

            if ( !events ) {
                return this;
            }

            if ( !name && !callback && !context ) {
                this._events = [];
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                findHandlers( events, name, callback, context )
                        .forEach(function( handler ) {
                            delete events[ handler.id ];
                        });
            } );

            return this;
        },

        /**
         * 触发事件
         * @method trigger
         * @grammar trigger( name[, ...] ) => self
         * @param  {String | Event }   evt     事件名或gmu.Event对象实例
         * @param  {*} * 任意参数
         * @return {self} 返回自身，方便链式
         * @chainable
         */
        trigger: function( evt ) {
            var i = -1,
                args,
                events,
                stoped,
                len,
                ev;

            if ( !this._events || !evt ) {
                return this;
            }

            typeof evt === 'string' && (evt = new Event( evt ));

            args = slice.call( arguments, 1 );
            evt.args = args;    // handler中可以直接通过e.args获取trigger数据
            args.unshift( evt );

            events = findHandlers( this._events, evt.type );

            if ( events ) {
                len = events.length;

                while ( ++i < len ) {
                    if ( (stoped = evt.isPropagationStopped()) ||  false ===
                            (ev = events[ i ]).cb.apply( ev.ctx2, args )
                            ) {

                        // 如果return false则相当于stopPropagation()和preventDefault();
                        stoped || (evt.stopPropagation(), evt.preventDefault());
                        break;
                    }
                }
            }

            return this;
        }
    };

    // expose
    gmu.Event = Event;
})( gmu, gmu.$ );

});
;define('common:static/js/gmu/src/extend/parseTpl.js', function(require, exports, module){


/**
 * @file 模板解析
 * @import zepto.js
 * @module GMU
 */
(function( $, undefined ) {
    
    /**
     * 解析模版tpl。当data未传入时返回编译结果函数；当某个template需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
     * 
     * @method $.parseTpl
     * @grammar $.parseTpl(str, data)  ⇒ string
     * @grammar $.parseTpl(str)  ⇒ Function
     * @param {String} str 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'ajean'};
     * console.log($.parseTpl(str, data)); // => <p>ajean</p>
     */
    $.parseTpl = function( str, data ) {
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                .replace( /'/g, '\\\'' )
                .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                    return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                } )
                .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                    return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                } )
                .replace( /\r/g, '\\r' )
                .replace( /\n/g, '\\n' )
                .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            /* jsbint evil:true */
            func = new Function( 'obj', tmpl );
        
        return data ? func( data ) : func;
    };
})( Zepto );

});
;define('common:static/js/gmu/src/core/widget.js', function(require, exports, module){

require("common:static/js/gmu/src/core/gmu.js");
require("common:static/js/gmu/src/core/event.js");
require("common:static/js/gmu/src/extend/parseTpl.js");
/**
 * @file gmu底层，定义了创建gmu组件的方法
 * @import core/gmu.js, core/event.js, extend/parseTpl.js
 * @module GMU
 */

(function( gmu, $, undefined ) {
    var slice = [].slice,
        toString = Object.prototype.toString,
        blankFn = function() {},

        // 挂到组件类上的属性、方法
        staticlist = [ 'options', 'template', 'tpl2html' ],

        // 存储和读取数据到指定对象，任何对象包括dom对象
        // 注意：数据不直接存储在object上，而是存在内部闭包中，通过_gid关联
        // record( object, key ) 获取object对应的key值
        // record( object, key, value ) 设置object对应的key值
        // record( object, key, null ) 删除数据
        record = (function() {
            var data = {},
                id = 0,
                ikey = '_gid';    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ ikey ] || (obj[ ikey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                val !== undefined && (store[ key ] = val);
                val === null && delete store[ key ];

                return store[ key ];
            };
        })(),

        event = gmu.event;

    function isPlainObject( obj ) {
        return toString.call( obj ) === '[object Object]';
    }

    // 遍历对象
    function eachObject( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            iterator( key, obj[ key ] );
        });
    }

    // 从某个元素上读取某个属性。
    function parseData( data ) {
        try {    // JSON.parse可能报错

            // 当data===null表示，没有此属性
            data = data === 'true' ? true :
                    data === 'false' ? false : data === 'null' ? null :

                    // 如果是数字类型，则将字符串类型转成数字类型
                    +data + '' === data ? +data :
                    /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ?
                    JSON.parse( data ) : data;
        } catch ( ex ) {
            data = undefined;
        }

        return data;
    }

    // 从DOM节点上获取配置项
    function getDomOptions( el ) {
        var ret = {},
            attrs = el && el.attributes,
            len = attrs && attrs.length,
            key,
            data;

        while ( len-- ) {
            data = attrs[ len ];
            key = data.name;

            if ( key.substring(0, 5) !== 'data-' ) {
                continue;
            }

            key = key.substring( 5 );
            data = parseData( data.value );

            data === undefined || (ret[ key ] = data);
        }

        return ret;
    }

    // 在$.fn上挂对应的组件方法呢
    // $('#btn').button( options );实例化组件
    // $('#btn').button( 'select' ); 调用实例方法
    // $('#btn').button( 'this' ); 取组件实例
    // 此方法遵循get first set all原则
    function zeptolize( name ) {
        var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
            old = $.fn[ key ];

        $.fn[ key ] = function( opts ) {
            var args = slice.call( arguments, 1 ),
                method = typeof opts === 'string' && opts,
                ret,
                obj;

            $.each( this, function( i, el ) {

                // 从缓存中取，没有则创建一个
                obj = record( el, name ) || new gmu[ name ]( el,
                        isPlainObject( opts ) ? opts : undefined );

                // 取实例
                if ( method === 'this' ) {
                    ret = obj;
                    return false;    // 断开each循环
                } else if ( method ) {

                    // 当取的方法不存在时，抛出错误信息
                    if ( !$.isFunction( obj[ method ] ) ) {
                        throw new Error( '组件没有此方法：' + method );
                    }

                    ret = obj[ method ].apply( obj, args );

                    // 断定它是getter性质的方法，所以需要断开each循环，把结果返回
                    if ( ret !== undefined && ret !== obj ) {
                        return false;
                    }

                    // ret为obj时为无效值，为了不影响后面的返回
                    ret = undefined;
                }
            } );

            return ret !== undefined ? ret : this;
        };

        /*
         * NO CONFLICT
         * var gmuPanel = $.fn.panel.noConflict();
         * gmuPanel.call(test, 'fnname');
         */
        $.fn[ key ].noConflict = function() {
            $.fn[ key ] = old;
            return this;
        };
    }

    // 加载注册的option
    function loadOption( klass, opts ) {
        var me = this;

        // 先加载父级的
        if ( klass.superClass ) {
            loadOption.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'options' ), function( key, option ) {
            option.forEach(function( item ) {
                var condition = item[ 0 ],
                    fn = item[ 1 ];

                if ( condition === '*' ||
                        ($.isFunction( condition ) &&
                        condition.call( me, opts[ key ] )) ||
                        condition === opts[ key ] ) {

                    fn.call( me );
                }
            });
        } );
    }

    // 加载注册的插件
    function loadPlugins( klass, opts ) {
        var me = this;

        // 先加载父级的
        if ( klass.superClass ) {
            loadPlugins.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'plugins' ), function( opt, plugin ) {

            // 如果配置项关闭了，则不启用此插件
            if ( opts[ opt ] === false ) {
                return;
            }

            eachObject( plugin, function( key, val ) {
                var oringFn;

                if ( $.isFunction( val ) && (oringFn = me[ key ]) ) {
                    me[ key ] = function() {
                        var origin = me.origin,
                            ret;

                        me.origin = oringFn;
                        ret = val.apply( me, arguments );
                        origin === undefined ? delete me.origin :
                                (me.origin = origin);

                        return ret;
                    };
                } else {
                    me[ key ] = val;
                }
            } );

            plugin._init.call( me );
        } );
    }

    // 合并对象
    function mergeObj() {
        var args = slice.call( arguments ),
            i = args.length,
            last;

        while ( i-- ) {
            last = last || args[ i ];
            isPlainObject( args[ i ] ) || args.splice( i, 1 );
        }

        return args.length ?
                $.extend.apply( null, [ true, {} ].concat( args ) ) : last; // 深拷贝，options中某项为object时，用例中不能用==判断
    }

    // 初始化widget. 隐藏具体细节，因为如果放在构造器中的话，是可以看到方法体内容的
    // 同时此方法可以公用。
    function bootstrap( name, klass, uid, el, options ) {
        var me = this,
            opts;

        if ( isPlainObject( el ) ) {
            options = el;
            el = undefined;
        }

        // options中存在el时，覆盖el
        options && options.el && (el = $( options.el ));
        el && (me.$el = $( el ), el = me.$el[ 0 ]);

        opts = me._options = mergeObj( klass.options,
                getDomOptions( el ), options );

        me.template = mergeObj( klass.template, opts.template );

        me.tpl2html = mergeObj( klass.tpl2html, opts.tpl2html );

        // 生成eventNs widgetName
        me.widgetName = name.toLowerCase();
        me.eventNs = '.' + me.widgetName + uid;

        me._init( opts );

        // 设置setup参数，只有传入的$el在DOM中，才认为是setup模式
        me._options.setup = (me.$el && me.$el.parent()[ 0 ]) ? true: false;

        loadOption.call( me, klass, opts );
        loadPlugins.call( me, klass, opts );

        // 进行创建DOM等操作
        me._create();
        me.trigger( 'ready' );

        el && record( el, name, me ) && me.on( 'destroy', function() {
            record( el, name, null );
        } );

        return me;
    }

    /**
     * @desc 创建一个类，构造函数默认为init方法, superClass默认为Base
     * @name createClass
     * @grammar createClass(object[, superClass]) => fn
     */
    function createClass( name, object, superClass ) {
        if ( typeof superClass !== 'function' ) {
            superClass = gmu.Base;
        }

        var uuid = 1,
            suid = 1;

        function klass( el, options ) {
            if ( name === 'Base' ) {
                throw new Error( 'Base类不能直接实例化' );
            }

            if ( !(this instanceof klass) ) {
                return new klass( el, options );
            }

            return bootstrap.call( this, name, klass, uuid++, el, options );
        }

        $.extend( klass, {

            /**
             * @name register
             * @grammar klass.register({})
             * @desc 注册插件
             */
            register: function( name, obj ) {
                var plugins = record( klass, 'plugins' ) ||
                        record( klass, 'plugins', {} );

                obj._init = obj._init || blankFn;

                plugins[ name ] = obj;
                return klass;
            },

            /**
             * @name option
             * @grammar klass.option(option, value, method)
             * @desc 扩充组件的配置项
             */
            option: function( option, value, method ) {
                var options = record( klass, 'options' ) ||
                        record( klass, 'options', {} );

                options[ option ] || (options[ option ] = []);
                options[ option ].push([ value, method ]);

                return klass;
            },

            /**
             * @name inherits
             * @grammar klass.inherits({})
             * @desc 从该类继承出一个子类，不会被挂到gmu命名空间
             */
            inherits: function( obj ) {

                // 生成 Sub class
                return createClass( name + 'Sub' + suid++, obj, klass );
            },

            /**
             * @name extend
             * @grammar klass.extend({})
             * @desc 扩充现有组件
             */
            extend: function( obj ) {
                var proto = klass.prototype,
                    superProto = superClass.prototype;

                staticlist.forEach(function( item ) {
                    obj[ item ] = mergeObj( superClass[ item ], obj[ item ] );
                    obj[ item ] && (klass[ item ] = obj[ item ]);
                    delete obj[ item ];
                });

                // todo 跟plugin的origin逻辑，公用一下
                eachObject( obj, function( key, val ) {
                    if ( typeof val === 'function' && superProto[ key ] ) {
                        proto[ key ] = function() {
                            var $super = this.$super,
                                ret;

                            // todo 直接让this.$super = superProto[ key ];
                            this.$super = function() {
                                var args = slice.call( arguments, 1 );
                                return superProto[ key ].apply( this, args );
                            };

                            ret = val.apply( this, arguments );

                            $super === undefined ? (delete this.$super) :
                                    (this.$super = $super);
                            return ret;
                        };
                    } else {
                        proto[ key ] = val;
                    }
                } );
            }
        } );

        klass.superClass = superClass;
        klass.prototype = Object.create( superClass.prototype );


        /*// 可以在方法中通过this.$super(name)方法调用父级方法。如：this.$super('enable');
        object.$super = function( name ) {
            var fn = superClass.prototype[ name ];
            return $.isFunction( fn ) && fn.apply( this,
                    slice.call( arguments, 1 ) );
        };*/

        klass.extend( object );

        return klass;
    }

    /**
     * @method define
     * @grammar gmu.define( name, object[, superClass] )
     * @class
     * @param {String} name 组件名字标识符。
     * @param {Object} object
     * @desc 定义一个gmu组件
     * @example
     * ####组件定义
     * ```javascript
     * gmu.define( 'Button', {
     *     _create: function() {
     *         var $el = this.getEl();
     *
     *         $el.addClass( 'ui-btn' );
     *     },
     *
     *     show: function() {
     *         console.log( 'show' );
     *     }
     * } );
     * ```
     *
     * ####组件使用
     * html部分
     * ```html
     * <a id='btn'>按钮</a>
     * ```
     *
     * javascript部分
     * ```javascript
     * var btn = $('#btn').button();
     *
     * btn.show();    // => show
     * ```
     *
     */
    gmu.define = function( name, object, superClass ) {
        gmu[ name ] = createClass( name, object, superClass );
        zeptolize( name );
    };

    /**
     * @desc 判断object是不是 widget实例, klass不传时，默认为Base基类
     * @method isWidget
     * @grammar gmu.isWidget( anything[, klass] ) => Boolean
     * @param {*} anything 需要判断的对象
     * @param {String|Class} klass 字符串或者类。
     * @example
     * var a = new gmu.Button();
     *
     * console.log( gmu.isWidget( a ) );    // => true
     * console.log( gmu.isWidget( a, 'Dropmenu' ) );    // => false
     */
    gmu.isWidget = function( obj, klass ) {

        // 处理字符串的case
        klass = typeof klass === 'string' ? gmu[ klass ] || blankFn : klass;
        klass = klass || gmu.Base;
        return obj instanceof klass;
    };

    /**
     * @class Base
     * @description widget基类。不能直接使用。
     */
    gmu.Base = createClass( 'Base', {

        /**
         * @method _init
         * @grammar instance._init() => instance
         * @desc 组件的初始化方法，子类需要重写该方法
         */
        _init: blankFn,

        /**
         * @override
         * @method _create
         * @grammar instance._create() => instance
         * @desc 组件创建DOM的方法，子类需要重写该方法
         */
        _create: blankFn,


        /**
         * @method getEl
         * @grammar instance.getEl() => $el
         * @desc 返回组件的$el
         */
        getEl: function() {
            return this.$el;
        },

        /**
         * @method on
         * @grammar instance.on(name, callback, context) => self
         * @desc 订阅事件
         */
        on: event.on,

        /**
         * @method one
         * @grammar instance.one(name, callback, context) => self
         * @desc 订阅事件（只执行一次）
         */
        one: event.one,

        /**
         * @method off
         * @grammar instance.off(name, callback, context) => self
         * @desc 解除订阅事件
         */
        off: event.off,

        /**
         * @method trigger
         * @grammar instance.trigger( name ) => self
         * @desc 派发事件, 此trigger会优先把options上的事件回调函数先执行
         * options上回调函数可以通过调用event.stopPropagation()来阻止事件系统继续派发,
         * 或者调用event.preventDefault()阻止后续事件执行
         */
        trigger: function( name ) {
            var evt = typeof name === 'string' ? new gmu.Event( name ) : name,
                args = [ evt ].concat( slice.call( arguments, 1 ) ),
                opEvent = this._options[ evt.type ],

                // 先存起来，否则在下面使用的时候，可能已经被destory给删除了。
                $el = this.getEl();

            if ( opEvent && $.isFunction( opEvent ) ) {

                // 如果返回值是false,相当于执行stopPropagation()和preventDefault();
                false === opEvent.apply( this, args ) &&
                        (evt.stopPropagation(), evt.preventDefault());
            }

            event.trigger.apply( this, args );

            // triggerHandler不冒泡
            $el && $el.triggerHandler( evt, (args.shift(), args) );

            return this;
        },

        /**
         * @method tpl2html
         * @grammar instance.tpl2html() => String
         * @grammar instance.tpl2html( data ) => String
         * @grammar instance.tpl2html( subpart, data ) => String
         * @desc 将template输出成html字符串，当传入 data 时，html将通过$.parseTpl渲染。
         * template支持指定subpart, 当无subpart时，template本身将为模板，当有subpart时，
         * template[subpart]将作为模板输出。
         */
        tpl2html: function( subpart, data ) {
            var tpl = this.template;

            tpl =  typeof subpart === 'string' ? tpl[ subpart ] :
                    ((data = subpart), tpl);

            return data || ~tpl.indexOf( '<%' ) ? $.parseTpl( tpl, data ) : tpl;
        },

        /**
         * @method destroy
         * @grammar instance.destroy()
         * @desc 注销组件
         */
        destroy: function() {

            // 解绑element上的事件
            this.$el && this.$el.off( this.eventNs );

            this.trigger( 'destroy' );
            // 解绑所有自定义事件
            this.off();


            this.destroyed = true;
        }

    }, Object );

    // 向下兼容
    $.ui = gmu;
})( gmu, gmu.$ );

});
;define('common:static/js/gmu/src/extend/detect.js', function(require, exports, module){


/**
 * @file 平台特性检测
 * @name detect
 * @short detect
 * @desc 扩展zepto中对browser的检测
 * @import zepto.js
 */

(function( $, navigator ) {
    
    /**
     * @name $.browser
     * @desc 扩展zepto中对browser的检测
     *
     * **可用属性**
     * - ***qq*** 检测qq浏览器
     * - ***uc*** 检测uc浏览器, 有些老版本的uc浏览器，不带userAgent和appVersion标记，无法检测出来
     * - ***baidu*** 检测baidu浏览器
     * - ***version*** 浏览器版本
     *
     * @example
     * if ($.browser.qq) {      //在qq浏览器上打出此log
     *     console.log('this is qq browser');
     * }
     */
    var ua = navigator.userAgent,
        br = $.browser,
        detects = {
            qq: /MQQBrowser\/([\d.]+)/i,
            uc: /UCBrowser\/([\d.]+)/i,
            baidu: /baidubrowser\/.*?([\d.]+)/i
        },
        ret;

    $.each( detects, function( i, re ) {
        
        if ( (ret = ua.match( re )) ) {
            br[ i ] = true;
            br.version = ret[ 1 ];

            // 终端循环
            return false;
        }
    } );

    // uc还有一种规则，就是appVersion中带 Uc字符
    if ( !br.uc && /Uc/i.test( navigator.appVersion ) ) {
        br.uc = true;
    }

})( Zepto, navigator );


});
;define('common:static/js/gmu/src/extend/matchMedia.js', function(require, exports, module){


/**
 * @file 媒体查询
 * @import zepto.js
 * @module GMU
 */

(function ($) {

    /**
     * 是原生的window.matchMedia方法的polyfill，对于不支持matchMedia的方法系统和浏览器，按照[w3c window.matchMedia](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)的接口
     * 定义，对matchMedia方法进行了封装。原理是用css media query及transitionEnd事件来完成的。在页面中插入media query样式及元素，当query条件满足时改变该元素样式，同时这个样式是transition作用的属性，
     * 满足条件后即会触发transitionEnd，由此创建MediaQueryList的事件监听。由于transition的duration time为0.001ms，故若直接使用MediaQueryList对象的matches去判断当前是否与query匹配，会有部分延迟，
     * 建议注册addListener的方式去监听query的改变。$.matchMedia的详细实现原理及采用该方法实现的转屏统一解决方案详见
     * [GMU Pages: 转屏解决方案($.matchMedia)](https://github.com/gmuteam/GMU/wiki/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88$.matchMedia)
     *
     * 返回值MediaQueryList对象包含的属性<br />
     * - ***matches*** 是否满足query<br />
     * - ***query*** 查询的css query，类似\'screen and (orientation: portrait)\'<br />
     * - ***addListener*** 添加MediaQueryList对象监听器，接收回调函数，回调参数为MediaQueryList对象<br />
     * - ***removeListener*** 移除MediaQueryList对象监听器<br />
     *
     * 
     * @method $.matchMedia
     * @grammar $.matchMedia(query)  ⇒ MediaQueryList
     * @param {String} query 查询的css query，类似\'screen and (orientation: portrait)\'
     * @return {Object} MediaQueryList
     * @example 
     * $.matchMedia('screen and (orientation: portrait)').addListener(fn);
     */
    

    $.matchMedia = (function() {
        var mediaId = 0,
            cls = 'gmu-media-detect',
            transitionEnd = $.fx.transitionEnd,
            cssPrefix = $.fx.cssPrefix,
            $style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; top: -10000px;}\n').appendTo('head');

        return function (query) {
            var id = cls + mediaId++,
                $mediaElem,
                listeners = [],
                ret;

            $style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n') ;   //原生matchMedia也需要添加对应的@media才能生效
            if ('matchMedia' in window) {
                return window.matchMedia(query);
            }

            $mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>')
                .appendTo('body')
                .on(transitionEnd, function() {
                    ret.matches = $mediaElem.width() === 1;
                    $.each(listeners, function (i,fn) {
                        $.isFunction(fn) && fn.call(ret, ret);
                    });
                });

            ret = {
                matches: $mediaElem.width() === 1 ,
                media: query,
                addListener: function (callback) {
                    listeners.push(callback);
                    return this;
                },
                removeListener: function (callback) {
                    var index = listeners.indexOf(callback);
                    ~index && listeners.splice(index, 1);
                    return this;
                }
            };

            return ret;
        };
    }());
})(Zepto);


});
;define('common:static/js/gmu/src/extend/event.ortchange.js', function(require, exports, module){

require("common:static/js/gmu/src/extend/matchMedia.js");
/**
 * @file 扩展转屏事件
 * @name ortchange
 * @short ortchange
 * @desc 扩展转屏事件orientation，解决原生转屏事件的兼容性问题
 * @import zepto.js, extend/matchMedia.js
 */

$(function () {
    /**
     * @name ortchange
     * @desc 扩展转屏事件orientation，解决原生转屏事件的兼容性问题
     * - ***ortchange*** : 当转屏的时候触发，兼容uc和其他不支持orientationchange的设备，利用css media query实现，解决了转屏延时及orientation事件的兼容性问题
     * $(window).on('ortchange', function () {        //当转屏的时候触发
     *     console.log('ortchange');
     * });
     */
    //扩展常用media query
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    //通过matchMedia派生转屏事件
    $.matchMedia($.mediaQuery.ortchange).addListener(function () {
        $(window).trigger('ortchange');
    });
});

});
;define('common:static/js/gmu/src/extend/throttle.js', function(require, exports, module){


/**
 * @file 减少对方法、事件的执行频率，多次调用，在指定的时间内只会执行一次
 * @import zepto.js
 * @module GMU
 */

(function ($) {
    /**
     * 减少执行频率, 多次调用，在指定的时间内，只会执行一次。
     * ```
     * ||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
     * X    X    X    X    X    X      X    X    X    X    X    X
     * ```
     * 
     * @method $.throttle
     * @grammar $.throttle(delay, fn) ⇒ function
     * @param {Number} [delay=250] 延时时间
     * @param {Function} fn 被稀释的方法
     * @param {Boolean} [debounce_mode=false] 是否开启防震动模式, true:start, false:end
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //绑定事件
     * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//频繁滚动，每250ms，执行一次touchmoveHandler
     *
     * //解绑事件
     * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.throttle返回的function, 当然unbind那个也是一样的效果
     *
     */
    $.extend($, {
        throttle: function(delay, fn, debounce_mode) {
            var last = 0,
                timeId;

            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounce模式 && 第一次调用
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, 执行到了delay时间
                    exec();
                } else {
                    // debounce, 如果是start就clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
        },

        /**
         * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
         * **options:**
         * - ***delay***: 延时时间
         * - ***fn***: 被稀释的方法
         * - ***t***: 指定是在开始处执行，还是结束是执行, true:start, false:end
         *
         * 非at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         *                         X                                X</code>
         * at_begin模式
         * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
         * X                                X                        </code>
         *
         * @grammar $.debounce(delay, fn[, at_begin]) ⇒ function
         * @name $.debounce
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //绑定事件
         * $(document).bind('touchmove', $.debounce(250, touchmoveHander));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
         *
         * //解绑事件
         * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.debounce返回的function, 当然unbind那个也是一样的效果
         */
        debounce: function(delay, fn, t) {
            return fn === undefined ? $.throttle(250, delay, false) : $.throttle(delay, fn, t === undefined ? false : t !== false);
        }
    });
})(Zepto);

});
;define('common:static/js/gmu/src/extend/event.scrollStop.js', function(require, exports, module){

require("common:static/js/gmu/src/extend/throttle.js");
/**
 * @file 滚动停止事件
 * @name scrollStop
 * @short scrollStop
 * @desc 滚动停止事件
 * @import zepto.js, extend/throttle.js
 */
(function ($, win) {
    /**
     * @name scrollStop
     * @desc 扩展的事件，滚动停止事件
     * - ***scrollStop*** : 在document上派生的scrollStop事件上，scroll停下来时触发, 考虑前进或者后退后scroll事件不触发情况。
     * @example $(document).on('scrollStop', function () {        //scroll停下来时显示scrollStop
     *     console.log('scrollStop');
     * });
     */

    function registerScrollStop() {
        $(win).on('scroll', $.debounce(80, function () {
            $(win).trigger('scrollStop');
        }, false));
    }

    function backEventOffHandler() {
        //在离开页面，前进或后退回到页面后，重新绑定scroll, 需要off掉所有的scroll，否则scroll时间不触发
        $(win).off('scroll');
        registerScrollStop();
    }
    registerScrollStop();

    //todo 待统一解决后退事件触发问题
    $(win).on('pageshow', function (e) {
        //如果是从bfcache中加载页面，为了防止多次注册，需要先off掉
        e.persisted && $(win).off('touchstart', backEventOffHandler).one('touchstart', backEventOffHandler);
    });

})(Zepto, window);

});
;define('common:static/js/gmu/src/extend/fix.js', function(require, exports, module){

require("common:static/js/gmu/src/extend/event.scrollStop.js");
require("common:static/js/gmu/src/extend/event.ortchange.js");
/**
 * @file 实现了通用fix方法。
 * @name Fix
 * @import zepto.js, extend/event.scrollStop.js, extend/event.ortchange.js
 */

/**
 * @name fix
 * @grammar fix(options) => self
 * @desc 固顶fix方法，对不支持position:fixed的设备上将元素position设为absolute，
 * 在每次scrollstop时根据opts参数设置当前显示的位置，类似fix效果。
 *
 * Options:
 * - ''top'' {Number}: 距离顶部的px值
 * - ''left'' {Number}: 距离左侧的px值
 * - ''bottom'' {Number}: 距离底部的px值
 * - ''right'' {Number}: 距离右侧的px值
 * @example
 * var div = $('div');
 * div.fix({top:0, left:0}); //将div固顶在左上角
 * div.fix({top:0, right:0}); //将div固顶在右上角
 * div.fix({bottom:0, left:0}); //将div固顶在左下角
 * div.fix({bottom:0, right:0}); //将div固顶在右下角
 *
 */

(function ($, undefined) {
    $.extend($.fn, {
        fix: function(opts) {
            var me = this;                      //如果一个集合中的第一元素已fix，则认为这个集合的所有元素已fix，
            if(me.attr('isFixed')) return me;   //这样在操作时就可以针对集合进行操作，不必单独绑事件去操作
            me.css(opts).css('position', 'fixed').attr('isFixed', true);
            var buff = $('<div style="position:fixed;top:10px;"></div>').appendTo('body'),
                top = buff[0].getBoundingClientRect().top,
                checkFixed = function() {
                    if(window.pageYOffset > 0) {
                        if(buff[0].getBoundingClientRect().top !== top) {
                            me.css('position', 'absolute');
                            doFixed();
                            $(window).on('scrollStop', doFixed);
                            $(window).on('ortchange', doFixed);
                        }
                        $(window).off('scrollStop', checkFixed);
                        buff.remove();
                    }
                },
                doFixed = function() {
                    me.css({
                        top: window.pageYOffset + (opts.bottom !== undefined ? window.innerHeight - me.height() - opts.bottom : (opts.top ||0)),
                        left: opts.right !== undefined ? document.body.offsetWidth - me.width() - opts.right : (opts.left || 0)
                    });
                    opts.width == '100%' && me.css('width', document.body.offsetWidth);
                };

            $(window).on('scrollStop', checkFixed);

            return me;
        }
    });
}(Zepto));

});
;define('common:static/js/gmu/src/extend/highlight.js', function(require, exports, module){


/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import zepto.js
 */
(function( $ ) {
    var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时

    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );

        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     * 
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );

            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                    .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                        this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
})( Zepto );


});
;define('common:static/js/gmu/src/extend/imglazyload.js', function(require, exports, module){

require("common:static/js/gmu/src/extend/event.scrollStop.js");
require("common:static/js/gmu/src/extend/event.ortchange.js");
/**
 *  @file 基于Zepto的图片延迟加载插件
 *  @name Imglazyload
 *  @desc 图片延迟加载
 *  @import zepto.js, extend/event.scrollStop.js, extend/event.ortchange.js
 */
(function ($) {
    /**
     * @name imglazyload
     * @grammar  imglazyload(opts) => self
     * @desc 图片延迟加载
     * **Options**
     * - ''placeHolder''     {String}:              (可选, 默认值:\'\')图片显示前的占位符
     * - ''container''       {Array|Selector}:      (可选, 默认值:window)图片延迟加载容器，若innerScroll为true，则传外层wrapper容器即可
     * - ''threshold''       {Array|Selector}:      (可选, 默认值:0)阀值，为正值则提前加载
     * - ''urlName''         {String}:              (可选, 默认值:data-url)图片url名称
     * - ''eventName''       {String}:              (可选, 默认值:scrollStop)绑定事件方式
     * - --''refresh''--     {Boolean}              --(可选, 默认值:false)是否是更新操作，若是页面追加图片，可以将该参数设为true--（该参数已经删除，无需使用该参数，可以同样为追加的图片增加延迟加载）
     * - ''innerScroll''     {Boolean}              (可选, 默认值:false)是否是内滚，若内滚，则不绑定eventName事件，用户需在外部绑定相应的事件，可调$.fn.imglazyload.detect去检测图片是否出现在container中
     * - ''isVertical''      {Boolean}              (可选, 默认值:true)是否竖滚
     *
     * **events**
     * - ''startload'' 开始加载图片
     * - ''loadcomplete'' 加载完成
     * - ''error'' 加载失败
     *
     * 使用img标签作为初始标签时，placeHolder无效，可考虑在img上添加class来完成placeHolder效果，加载完成后移除。使用其他元素作为初始标签时，placeHolder将添加到标签内部，并在图片加载完成后替换。
     * 原始标签中以\"data-\"开头的属性会自动添加到加载后的图片中，故有自定义属性需要放在图片中的可以考虑以data-开头
     * @example $('.lazy-load').imglazyload();
     * $('.lazy-load').imglazyload().on('error', function (e) {
     *     e.preventDefault();      //该图片不再加载
     * });
     */
    var pedding = [];
    $.fn.imglazyload = function (opts) {
        var splice = Array.prototype.splice,
            opts = $.extend({
                threshold:0,
                container:window,
                urlName:'data-url',
                placeHolder:'',
                eventName:'scrollStop',
                innerScroll: false,
                isVertical: true
            }, opts),
            $viewPort = $(opts.container),
            isVertical = opts.isVertical,
            isWindow = $.isWindow($viewPort.get(0)),
            OFFSET = {
                win: [isVertical ? 'scrollY' : 'scrollX', isVertical ? 'innerHeight' : 'innerWidth'],
                img: [isVertical ? 'top' : 'left', isVertical ? 'height' : 'width']
            },
            $plsHolder = $(opts.placeHolder).length ? $(opts.placeHolder) : null,
            isImg = $(this).is('img');

        !isWindow && (OFFSET['win'] = OFFSET['img']);   //若container不是window，则OFFSET中取值同img

        function isInViewport(offset) {      //图片出现在可视区的条件
            var viewOffset = isWindow ? window : $viewPort.offset(),
                viewTop = viewOffset[OFFSET.win[0]],
                viewHeight = viewOffset[OFFSET.win[1]];
            return viewTop >= offset[OFFSET.img[0]] - opts.threshold - viewHeight && viewTop <= offset[OFFSET.img[0]] + offset[OFFSET.img[1]];
        }

        pedding = Array.prototype.slice.call($(pedding.reverse()).add(this), 0).reverse();    //更新pedding值，用于在页面追加图片
        if ($.isFunction($.fn.imglazyload.detect)) {    //若是增加图片，则处理placeHolder
            _addPlsHolder();
            return this;
        };

        function _load(div) {     //加载图片，并派生事件
            var $div = $(div),
                attrObj = {},
                $img = $div;

            if (!isImg) {
                $.each($div.get(0).attributes, function () {   //若不是img作为容器，则将属性名中含有data-的均增加到图片上
                    ~this.name.indexOf('data-') && (attrObj[this.name] = this.value);
                });
                $img = $('<img />').attr(attrObj);
            }
            $div.trigger('startload');
            $img.on('load',function () {
                !isImg && $div.replaceWith($img);     //若不是img，则将原来的容器替换，若是img，则直接将src替换
                $div.trigger('loadcomplete');
                $img.off('load');
            }).on('error',function () {     //图片加载失败处理
                var errorEvent = $.Event('error');       //派生错误处理的事件
                $div.trigger(errorEvent);
                errorEvent.defaultPrevented || pedding.push(div);
                $img.off('error').remove();
            }).attr('src', $div.attr(opts.urlName));
        }

        function _detect() {     //检测图片是否出现在可视区，并对满足条件的开始加载
            var i, $image, offset, div;
            for (i = pedding.length; i--;) {
                $image = $(div = pedding[i]);
                offset = $image.offset();
                isInViewport(offset) && (splice.call(pedding, i, 1), _load(div));
            }
        }

        function _addPlsHolder () {
            !isImg && $plsHolder && $(pedding).append($plsHolder);   //若是不是img，则直接append
        }

        $(document).ready(function () {    //页面加载时条件检测
            _addPlsHolder();     //初化时将placeHolder存入
            _detect();
        });

        !opts.innerScroll && $(window).on(opts.eventName + ' ortchange', function () {    //不是内滚时，在window上绑定事件
            _detect();
        });

        $.fn.imglazyload.detect = _detect;    //暴露检测方法，供外部调用

        return this;
    };

})(Zepto);


});
;define('common:static/js/gmu/src/extend/offset.js', function(require, exports, module){


/**
 * @file 修复Zepto中offset setter bug
 * 比如 被定位元素满足以下条件时，会定位不正确
 * 1. 被定位元素不是第一个节点，且prev兄弟节点中有非absolute或者fixed定位的元素
 * 2. 被定位元素为非absolute或者fixed定位。
 * issue: https://github.com/gmuteam/GMU/issues/101
 * @import zepto.js
 * @module GMU
 */

(function( $ ) {
    var _offset = $.fn.offset,
        round = Math.round;

    // zepto的offset bug的主要问题是当position:relative的时候，没有考虑元素的初始值。
    // 初始值，是指positon:relative; top: 0; left: 0; bottom:0; right:0; 的时候
    // 该元素的位置，zepto中的offset是假定了这个值就是{left:0, top: 0}; 实际上前面有兄弟
    // 节点且不为postion: absolute|fixed 定位时时，该元素的初始位置并不是{left:0, top: 0}
    // 会根据前面兄弟节点的内容大小而不一样。
    function setter( coord ) {
        return this.each(function( idx ) {
            var $el = $( this ),
                coords = $.isFunction( coord ) ? coord.call( this, idx,
                    $el.offset() ) : coord,

                position = $el.css( 'position' ),

                // position为absolute或者fixed定位的元素，跟元素的初始位置没有关系
                // 所以不需要取初始位置
                pos = position === 'absolute' || position === 'fixed' ||
                    $el.position();

            // 如果是position为relative, 且存在 top, right, bottom, left值
            // position值还不能代表初始值，需要还原一下
            // 比如 top: 1px, 那要让position取得的值减去1px才是该元素的初始位置
            // 但是如果是top:auto, bottom: 1px; 则是要加1px, 所以下面的代码要乘以个-1
            if ( position === 'relative' ) {
                pos.top -= parseFloat( $el.css( 'top' ) ) ||
                        parseFloat( $el.css( 'bottom' ) ) * -1 || 0;
                pos.left -= parseFloat( $el.css( 'left' ) ) ||
                        parseFloat( $el.css( 'right' ) ) * -1 || 0;
            }

            parentOffset = $el.offsetParent().offset(),

            // 迫于无赖，chrome下如果offset设置的top,left不是整型，会导致popOver中arrow样式有问题。
            props = {
              top:  round( coords.top - (pos.top || 0)  - parentOffset.top ),
              left: round( coords.left - (pos.left || 0) - parentOffset.left )
            }

            if ( position == 'static' ){
                props['position'] = 'relative';
            }

            // 可以考虑改用animate方法。
            if ( coords.using ) {
                coords.using.call( this, props, idx );
            } else {
                $el.css( props );
            }
        });
    }

    $.fn.offset = function( corrd ) {
        return corrd ? setter.call( this, corrd ): _offset.call( this );
    }
})( Zepto );

});
;define('common:static/js/gmu/src/extend/position.js', function(require, exports, module){

require("common:static/js/gmu/src/extend/offset.js");
/**
 * @file 基于Zepto的位置设置获取组件
 * @import zepto.js, extend/offset.js
 * @module GMU
 */

(function ($, undefined) {
    var _position = $.fn.position,
        round = Math.round,
        rhorizontal = /^(left|center|right)([\+\-]\d+%?)?$/,
        rvertical = /^(top|center|bottom)([\+\-]\d+%?)?$/,
        rpercent = /%$/;

    function str2int( persent, totol ) {
        return (parseInt( persent, 10 ) || 0) * (rpercent.test( persent ) ?
                totol / 100 : 1);
    }

    function getOffsets( pos, offset, width, height ) {
        return [
            pos[ 0 ] === 'right' ? width : pos[ 0 ] === 'center' ?
                    width / 2 : 0,

            pos[ 1 ] === 'bottom' ? height : pos[ 1 ] === 'center' ?
                    height / 2 : 0,

            str2int( offset[ 0 ], width ),

            str2int( offset[ 1 ], height )
        ];
    }

    function getDimensions( elem ) {
        var raw = elem[ 0 ],
            isEvent = raw.preventDefault;

        raw = raw.touches && raw.touches[ 0 ] || raw;

        // 特殊处理document, window和event对象
        if ( raw.nodeType === 9 || raw === window || isEvent ) {
            return {
                width: isEvent ? 0 : elem.width(),
                height: isEvent ? 0 : elem.height(),
                top: raw.pageYOffset || raw.pageY ||  0,
                left: raw.pageXOffset || raw.pageX || 0
            };
        }

        return elem.offset();
    }

    function getWithinInfo( el ) {
        var $el = $( el = (el || window) ),
            dim = getDimensions( $el );

        el = $el[ 0 ];

        return {
            $el: $el,
            width: dim.width,
            height: dim.height,
            scrollLeft: el.pageXOffset || el.scrollLeft,
            scrollTop: el.pageYOffset || el.scrollTop
        };
    }

    // 参数检测纠错
    function filterOpts( opts, offsets ) {
        [ 'my', 'at' ].forEach(function( key ) {
            var pos = ( opts[ key ] || '' ).split( ' ' ),
                opt = opts[ key ] = [ 'center', 'center' ],
                offset = offsets[ key ] = [ 0, 0 ];

            pos.length === 1 && pos[ rvertical.test( pos[ 0 ] ) ? 'unshift' :
                    'push' ]( 'center' );

            rhorizontal.test( pos[ 0 ] ) && (opt[ 0 ] = RegExp.$1) &&
                    (offset[ 0 ] = RegExp.$2);

            rvertical.test( pos[ 1 ] ) && (opt[ 1 ] = RegExp.$1) &&
                    (offset[ 1 ] = RegExp.$2);
        });
    }

    /**
     * 获取元素相对于相对父级元素（父级最近为position为relative｜abosolute｜fixed的元素）的坐标位置。
     * @method $.fn.position
     * @grammar position()  ⇒ array
     * @grammar position(opts)  ⇒ self
     * @param {String} [my=center] 设置中心点。可以为'left top', 'center bottom', 'right center'...同时还可以设置偏移量；如 'left+5 center-20%'
     * @param {String} [at=center] 设置定位到目标元素的什么位置。参数格式同my参数一致
     * @param {Object} [of=null] 设置目标元素
     * @param {Function} [collision=null] 碰撞检测回调方法
     * @param {Object} [within=window] 碰撞检测对象
     * @example
     * var position = $('#target').position();
     * $('#target').position({
     *                          my: 'center',
     *                          at: 'center',
     *                          of: document.body
     *                      });
     */
    $.fn.position = function ( opts ) {
        if ( !opts || !opts.of ) {
            return _position.call( this );
        }

        opts = $.extend( {}, opts );

        var target = $( opts.of ),
            collision = opts.collision,
            within = collision && getWithinInfo( opts.within ),
            ofses = {},
            dim = getDimensions( target ),
            bPos = {
                left: dim.left,
                top: dim.top
            },
            atOfs;

        target[ 0 ].preventDefault && (opts.at = 'left top');
        filterOpts( opts, ofses );    // 参数检测纠错

        atOfs = getOffsets( opts.at, ofses.at, dim.width, dim.height );
        bPos.left += atOfs[ 0 ] + atOfs[ 2 ];
        bPos.top += atOfs[ 1 ] + atOfs[ 3 ];

        return this.each(function() {
            var $el = $( this ),
                ofs = $el.offset(),
                pos = $.extend( {}, bPos ),
                myOfs = getOffsets( opts.my, ofses.my, ofs.width, ofs.height );

            pos.left = round( pos.left + myOfs[ 2 ] - myOfs[ 0 ] );
            pos.top = round( pos.top + myOfs[ 3 ] - myOfs[ 1 ] );

            collision && collision.call( this, pos, {
                of: dim,
                offset: ofs,
                my: opts.my,
                at: opts.at,
                within: within,
                $el : $el
            } );

            pos.using = opts.using;
            $el.offset( pos );
        });
    }
})( Zepto );

});
;define('common:static/js/gmu/src/extend/support.js', function(require, exports, module){


/**
 * @file 常用方法、属性支持性检测
 * @import zepto.js
 * @module GMU
 */

(function($, undefined) {
    
    /**
     * 检测设备对某些属性或方法的支持情况
     * @method $.support
     * @grammar $.support.orientation ⇒ Boolean
     * @param {Boolean} orientation 检测是否支持转屏事件，UC中存在orientaion，但转屏不会触发该事件，故UC属于不支持转屏事件(iOS 4上qq, chrome都有这个现象)
     * @param {Boolean} touch 检测是否支持touch相关事件
     * @param {Boolean} cssTransitions 检测是否支持css3的transition
     * @param {Boolean} has3d 检测是否支持translate3d的硬件加速
     * @example
     * if ($.support.has3d) {      //在支持3d的设备上使用
     *     console.log('you can use transtion3d');
     * }
     */

    // TODO检测是否支持position: fixed
    function detectPosFixed () {

    }

    var br = $.browser;

    $.support = $.extend($.support || {}, {
        orientation: !(br.uc || (parseFloat($.os.version)<5 && (br.qq || br.chrome))) && !($.os.android && parseFloat($.os.version) > 3) && "orientation" in window && "onorientationchange" in window,
        touch: "ontouchend" in document,
        cssTransitions: "WebKitTransitionEvent" in window,
        has3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        // fix: detectPosFixed,
        pushState: "pushState" in history && "replaceState" in history,
        scrolling: '',
        requestAnimationFrame: 'webkitRequestAnimationFrame' in window
    });

})(Zepto);

});
;define('common:static/js/gmu/src/extend/touch.js', function(require, exports, module){

/**
 * @file 来自zepto/touch.js, zepto自1.0后，已不默认打包此文件。
 * @import zepto.js
 */
//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout,
    longTapDelay = 750, longTapTimeout

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  $(document).ready(function(){
    var now, delta

    $(document.body)
      .bind('touchstart', function(e){
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $(parentIfText(e.touches[0].target))
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = e.touches[0].pageX
        touch.y1 = e.touches[0].pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
      })
      .bind('touchmove', function(e){
        cancelLongTap()
        touch.x2 = e.touches[0].pageX
        touch.y2 = e.touches[0].pageY
        if (Math.abs(touch.x1 - touch.x2) > 10)
          e.preventDefault()
      })
      .bind('touchend', function(e){
         cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)

          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function() {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap')
            event.cancelTouch = cancelAll
            touch.el.trigger(event)

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              touch.el.trigger('doubleTap')
              touch = {}
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function(){
                touchTimeout = null
                touch.el.trigger('singleTap')
                touch = {}
              }, 250)
            }

          }, 0)

      })
      .bind('touchcancel', cancelAll)

    $(window).bind('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  })
})(Zepto);


});
;define('common:static/js/gmu/src/widget/slider/lazyloadimg.js', function(require, exports, module){

/**
 * @file 图片懒加载插件
 * @import widget/slider/slider.js
 */
(function( gmu ) {

    gmu.Slider.template.item = '<div class="ui-slider-item">' +
            '<a href="<%= href %>">' +
            '<img lazyload="<%= pic %>" alt="" /></a>' +
            '<% if( title ) { %><p><%= title %></p><% } %>' +
            '</div>';

    /**
     * 图片懒加载插件
     * @class lazyloadimg
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'lazyloadimg', {
        _init: function() {
            this.on( 'ready slide', this._loadItems );
        },

        _loadItems: function() {
            var opts = this._options,
                loop = opts.loop,
                viewNum = opts.viewNum || 1,
                index = this.index,
                i,
                len;

            for ( i = index - viewNum, len = index + 2 * viewNum; i < len;
                    i++ ) {

                this.loadImage( loop ? this._circle( i ) : i );
            }
        },

        /**
         * 加载图片
         * @method loadImage
         * @param {Number} index 要加载的图片的序号
         * @for Slider
         * @uses Slider.lazyloadimg
         */
        loadImage: function( index ) {
            var item = this._items[ index ],
                images;

            if ( !item || !(images = gmu.staticCall( item, 'find',
                    'img[lazyload]' ), images.length) ) {

                return this;
            }

            images.each(function() {
                this.src = this.getAttribute( 'lazyload' );
                this.removeAttribute( 'lazyload' );
            });
        }
    } );
})( gmu );

});
;define('common:static/js/gmu/src/widget/slider/slider.js', function(require, exports, module){

/**
 * @file 图片轮播组件
 * @import extend/touch.js, extend/event.ortchange.js, core/widget.js
 * @module GMU
 */

require("common:static/js/gmu/src/extend/touch.js");
require("common:static/js/gmu/src/extend/matchMedia.js");
require("common:static/js/gmu/src/extend/event.ortchange.js");
require("common:static/js/gmu/src/extend/parseTpl.js");

(function( gmu, $, undefined ) {
    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,

        // todo 检测3d是否支持。
        translateZ = ' translateZ(0)';
    
    /**
     * 图片轮播组件
     *
     * @class Slider
     * @constructor Html部分
     * ```html
     * <div id="slider">
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image1.png"></a>
     *       <p>1,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image2.png"></a>
     *       <p>2,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image3.png"></a>
     *       <p>3,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image4.png"></a>
     *       <p>4,让Coron的太阳把自己晒黑—小天</p>
     *   </div>
     * </div>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#slider').slider();
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Slider的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Slider:options)
     * @grammar $( el ).slider( options ) => zepto
     * @grammar new gmu.Slider( el, options ) => instance
     */
    gmu.define( 'Slider', {

        options: {

            /**
             * @property {Boolean} [loop=false] 是否连续滑动
             * @namespace options
             */
            loop: false,
            
            /**
             * @property {Number} [speed=400] 动画执行速度
             * @namespace options
             */
            speed: 400,

            /**
             * @property {Number} [index=0] 初始位置
             * @namespace options
             */
            index: 0,

            /**
             * @property {Object} [selector={container:'.ui-slider-group'}] 内部结构选择器定义
             * @namespace options
             */
            selector: {
                container: '.ui-slider-group'    // 容器的选择器
            }
        },

        template: {
            item: '<div class="ui-slider-item"><a href="<%= href %>">' +
                    '<img src="<%= pic %>" alt="" /></a>' +
                    '<% if( title ) { %><p><%= title %></p><% } %>' +
                    '</div>'
        },

        _create: function() {
            var me = this,
                $el = me.getEl(),
                opts = me._options;

            me.index = opts.index;

            // 初始dom结构
            me._initDom( $el, opts );

            // 更新width
            me._initWidth( $el, me.index );
            me._container.on( transitionEnd + me.eventNs,
                    $.proxy( me._tansitionEnd, me ) );

            // 转屏事件检测
            $( window ).on( 'ortchange' + me.eventNs, function() {
                me._initWidth( $el, me.index );
            } );
        },

        _initDom: function( $el, opts ) {
            var selector = opts.selector,
                viewNum = opts.viewNum || 1,
                items,
                container;

            // 检测容器节点是否指定
            container = $el.find( selector.container );

            // 没有指定容器则创建容器
            if ( !container.length ) {
                container = $( '<div></div>' );

                // 如果没有传入content, 则将root的孩子作为可滚动item
                if ( !opts.content ) {

                    // 特殊处理直接用ul初始化slider的case
                    if ( $el.is( 'ul' ) ) {
                        this.$el = container.insertAfter( $el );
                        container = $el;
                        $el = this.$el;
                    } else {
                        container.append( $el.children() );
                    }
                } else {
                    this._createItems( container, opts.content );
                }

                container.appendTo( $el );
            }

            // 检测是否构成循环条件
            if ( (items = container.children()).length < viewNum + 1 ) {
                opts.loop = false;
            }

            // 如果节点少了，需要复制几份
            while ( opts.loop && container.children().length < 3 * viewNum ) {
                container.append( items.clone() );
            }

            this.length = container.children().length;

            this._items = (this._container = container)
                    .addClass( 'ui-slider-group' )
                    .children()
                    .addClass( 'ui-slider-item' )
                    .toArray();

            this.trigger( 'done.dom', $el.addClass( 'ui-slider' ), opts );
        },

        // 根据items里面的数据挨个render插入到container中
        _createItems: function( container, items ) {
            var i = 0,
                len = items.length;

            for ( ; i < len; i++ ) {
                container.append( this.tpl2html( 'item', items[ i ] ) );
            }
        },
        _initWidth: function( $el, index, force ) {

            var me = this,
                width;

            // width没有变化不需要重排
            if ( !force && (width = $el.width()) === me.width ) {
                return;
            }

            me.width = width;
            me._arrange( width, index );
            me.height = $el.height();
            me.trigger( 'width.change' );
        },

        // 重排items
        _arrange: function( width, index ) {
            var items = this._items,
                i = 0,
                item,
                len;

            this._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];
                
                item.style.cssText += 'width:' + width + 'px;' +
                        'left:' + (i * -width) + 'px;';
                item.setAttribute( 'data-index', i );

                this._move( i, i < index ? -width : i > index ? width : 0, 0 );
            }

            this._container.css( 'width', width * len );
        },

        _move: function( index, dist, speed, immediate ) {
            var slidePos = this._slidePos,
                items = this._items;

            if ( slidePos[ index ] === dist || !items[ index ] ) {
                return;
            }

            this._translate( index, dist, speed );
            slidePos[ index ] = dist;    // 记录目标位置

            // 强制一个reflow
            immediate && items[ index ].clientLeft;
        },

        _translate: function( index, dist, speed ) {
            var slide = this._items[ index ],
                style = slide && slide.style;

            if ( !style ) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed + 
                    'ms;' + cssPrefix + 'transform: translate(' + 
                    dist + 'px, 0)' + translateZ + ';';
        },

        _circle: function( index, arr ) {
            var len;

            arr = arr || this._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        },

        _tansitionEnd: function( e ) {

            // ~~用来类型转换，等价于parseInt( str, 10 );
            if ( ~~e.target.getAttribute( 'data-index' ) !== this.index ) {
                return;
            }
            
            this.trigger( 'slideend', this.index );
        },

        _slide: function( from, diff, dir, width, speed, opts ) {
            var me = this,
                to;

            to = me._circle( from - dir * diff );

            // 如果不是loop模式，以实际位置的方向为准
            if ( !opts.loop ) {
                dir = Math.abs( from - to ) / (from - to);
            }
            
            // 调整初始位置，如果已经在位置上不会重复处理
            this._move( to, -dir * width, 0, true );

            this._move( from, width * dir, speed );
            this._move( to, 0, speed );

            this.index = to;
            return this.trigger( 'slide', to, from );
        },

        /**
         * 切换到第几个slide
         * @method slideTo
         * @chainable
         * @param {Number} to 目标slide的序号
         * @param {Number} [speed] 切换的速度
         * @return {self} 返回本身
         */
        slideTo: function( to, speed ) {
            if ( this.index === to || this.index === this._circle( to ) ) {
                return this;
            }

            var opts = this._options,
                index = this.index,
                diff = Math.abs( index - to ),
                
                // 1向左，-1向右
                dir = diff / (index - to),
                width = this.width;

            speed = speed || opts.speed;

            return this._slide( index, diff, dir, width, speed, opts );
        },

        /**
         * 切换到上一个slide
         * @method prev
         * @chainable
         * @return {self} 返回本身
         */
        prev: function() {
            
            if ( this._options.loop || this.index > 0 ) {
                this.slideTo( this.index - 1 );
            }

            return this;
        },

        /**
         * 切换到下一个slide
         * @method next
         * @chainable
         * @return {self} 返回本身
         */
        next: function() {
            
            if ( this._options.loop || this.index + 1 < this.length ) {
                this.slideTo( this.index + 1 );
            }

            return this;
        },

        /**
         * 返回当前显示的第几个slide
         * @method getIndex
         * @chainable
         * @return {Number} 当前的silde序号
         */
        getIndex: function() {
            return this.index;
        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy: function() {
            this._container.off( this.eventNs );
            $( window ).off( 'ortchange' + this.eventNs );
            return this.$super( 'destroy' );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event done.dom
         * @param {Event} e gmu.Event对象
         * @param {Zepto} $el slider元素
         * @param {Object} opts 组件初始化时的配置项
         * @description DOM创建完成后触发
         */
        
        /**
         * @event width.change
         * @param {Event} e gmu.Event对象
         * @description slider容器宽度发生变化时触发
         */
        
        /**
         * @event slideend
         * @param {Event} e gmu.Event对象
         * @param {Number} index 当前slide的序号
         * @description slide切换完成后触发
         */
        
        /**
         * @event slide
         * @param {Event} e gmu.Event对象
         * @param {Number} to 目标slide的序号
         * @param {Number} from 当前slide的序号
         * @description slide切换时触发（如果切换时有动画，此事件触发时，slide不一定已经完成切换）
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );

})( gmu, gmu.$ );

});
;define('common:static/js/gmu/src/widget/slider/touch.js', function(require, exports, module){

/**
 * @file 图片轮播手指跟随插件
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    
    var map = {
            touchstart: '_onStart',
            touchmove: '_onMove',
            touchend: '_onEnd',
            touchcancel: '_onEnd',
            click: '_onClick'
        },

        isScrolling,
        start,
        delta,
        moved;

    // 提供默认options
    $.extend( gmu.Slider.options, {

        /**
         * @property {Boolean} [stopPropagation=false] 是否阻止事件冒泡
         * @namespace options
         * @for Slider
         * @uses Slider.touch
         */
        stopPropagation: false,

        /**
         * @property {Boolean} [disableScroll=false] 是否阻止滚动
         * @namespace options
         * @for Slider
         * @uses Slider.touch
         */
        disableScroll: false
    } );

    /**
     * 图片轮播手指跟随插件
     * @class touch
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'touch', {
        _init: function() {
            var me = this,
                $el = me.getEl();

            me._handler = function( e ) {
                me._options.stopPropagation && e.stopPropagation();
                return map[ e.type ] && me[ map[ e.type ] ].call( me, e );
            };

            me.on( 'ready', function() {

                // 绑定手势
                $el.on( 'touchstart' + me.eventNs, me._handler );
                
                // 阻止误点击, 犹豫touchmove被preventDefault了，导致长按也会触发click
                me._container.on( 'click' + me.eventNs, me._handler );
            } );
        },

        _onClick: function() {
            return !moved;
        },

        _onStart: function( e ) {
                
            // 不处理多指
            if ( e.touches.length > 1 ) {
                return false;
            }

            var me = this,
                touche = e.touches[ 0 ],
                opts = me._options,
                eventNs = me.eventNs,
                num;

            start = {
                x: touche.pageX,
                y: touche.pageY,
                time: +new Date()
            };

            delta = {};
            moved = false;
            isScrolling = undefined;

            num = opts.viewNum || 1;
            me._move( opts.loop ? me._circle( me.index - num ) :
                    me.index - num, -me.width, 0, true );
            me._move( opts.loop ? me._circle( me.index + num ) :
                    me.index + num, me.width, 0, true );

            me.$el.on( 'touchmove' + eventNs + ' touchend' + eventNs +
                    ' touchcancel' + eventNs, me._handler );
        },

        _onMove: function( e ) {

            // 多指或缩放不处理
            if ( e.touches.length > 1 || e.scale &&
                    e.scale !== 1 ) {
                return false;
            }

            var opts = this._options,
                viewNum = opts.viewNum || 1,
                touche = e.touches[ 0 ],
                index = this.index,
                i,
                len,
                pos,
                slidePos;

            opts.disableScroll && e.preventDefault();

            delta.x = touche.pageX - start.x;
            delta.y = touche.pageY - start.y;

            if ( typeof isScrolling === 'undefined' ) {
                isScrolling = Math.abs( delta.x ) <
                        Math.abs( delta.y );
            }

            if ( !isScrolling ) {
                e.preventDefault();

                if ( !opts.loop ) {

                    // 如果左边已经到头
                    delta.x /= (!index && delta.x > 0 ||

                            // 如果右边到头
                            index === this._items.length - 1 && 
                            delta.x < 0) ?

                            // 则来一定的减速
                            (Math.abs( delta.x ) / this.width + 1) : 1;
                }

                slidePos = this._slidePos;

                for ( i = index - viewNum, len = index + 2 * viewNum;
                        i < len; i++ ) {

                    pos = opts.loop ? this._circle( i ) : i;
                    this._translate( pos, delta.x + slidePos[ pos ], 0 );
                }

                moved = true;
            }
        },

        _onEnd: function() {

            // 解除事件
            this.$el.off( 'touchmove' + this.eventNs + ' touchend' +
                    this.eventNs + ' touchcancel' + this.eventNs,
                    this._handler );

            if ( !moved ) {
                return;
            }

            var me = this,
                opts = me._options,
                viewNum = opts.viewNum || 1,
                index = me.index,
                slidePos = me._slidePos,
                duration = +new Date() - start.time,
                absDeltaX = Math.abs( delta.x ),

                // 是否滑出边界
                isPastBounds = !opts.loop && (!index && delta.x > 0 ||
                    index === slidePos.length - viewNum && delta.x < 0),

                // -1 向右 1 向左
                dir = delta.x > 0 ? 1 : -1,
                speed,
                diff,
                i,
                len,
                pos;

            if ( duration < 250 ) {

                // 如果滑动速度比较快，偏移量跟根据速度来算
                speed = absDeltaX / duration;
                diff = Math.min( Math.round( speed * viewNum * 1.2 ),
                        viewNum );
            } else {
                diff = Math.round( absDeltaX / (me.perWidth || me.width) );
            }
            
            if ( diff && !isPastBounds ) {
                me._slide( index, diff, dir, me.width, opts.speed,
                        opts, true );
                
                // 在以下情况，需要多移动一张
                if ( viewNum > 1 && duration >= 250 &&
                        Math.ceil( absDeltaX / me.perWidth ) !== diff ) {

                    me.index < index ? me._move( me.index - 1, -me.perWidth,
                            opts.speed ) : me._move( me.index + viewNum,
                            me.width, opts.speed );
                }
            } else {
                
                // 滑回去
                for ( i = index - viewNum, len = index + 2 * viewNum;
                    i < len; i++ ) {

                    pos = opts.loop ? me._circle( i ) : i;
                    me._translate( pos, slidePos[ pos ], 
                            opts.speed );
                }
            }
        }
    } );
})( gmu, gmu.$ );

});
;define('common:widget/cookie/cookie.js', function(require, exports, module){

/**
* @fileoverview cookie操作实现，基于tangram修改
* @author caodongqing
*/

/**
 * @lends common:widget/cookie
 */
var cookie = {};

/**
 *
 * @param key
 * @returns {boolean}
 * @private
 */
cookie._isValidKey = function (key) {
    return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
};

/**
 *
 * @param key
 * @returns {*}
 */
cookie.getRaw = function (key) {
    if (cookie._isValidKey(key)) {
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie);

        if (result) {
            return result[2] || null;
        }
    }

    return null;
};

/**
 *
 * @param key
 * @returns {*}
 */
cookie.get = function (key) {
    var value = cookie.getRaw(key);
    if ('string' == typeof value) {
        value = decodeURIComponent(value);
        return value;
    }
    return null;
};

cookie.setRaw = function (key, value, options) {
    if (!cookie._isValidKey(key)) {
        return;
    }

    options = options || {};
    //options.path = options.path || "/"; // meizz 20100402 设定一个初始值，方便后续的操作
    //berg 20100409 去掉，因为用户希望默认的path是当前路径，这样和浏览器对cookie的定义也是一致的

    // 计算cookie过期时间
    var expires = options.expires;
    if ('number' == typeof options.expires) {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires);
    }

    document.cookie =
        key + "=" + value
        + (options.path ? "; path=" + options.path : "")
        + (expires ? "; expires=" + expires.toGMTString() : "")
        + (options.domain ? "; domain=" + options.domain : "")
        + (options.secure ? "; secure" : '');
};

cookie.remove = function (key, options) {
    options = options || {};
    options.expires = new Date(0);
    cookie.setRaw(key, '', options);
};

cookie.set = function (key, value, options) {
    cookie.setRaw(key, encodeURIComponent(value), options);
};

/**
 * @module common:widget/cookie
 */
module.exports = cookie;

});
;define('common:widget/stat/metrics-stat.js', function(require, exports, module){

/**
 * @file metrics-stat.js
 *
 * @description 为定位统计重构设计的功能指标统计程序, 将可以把定位统计的各个功能指标统计项合并成一条统计请求再提交
 *              使用示例:
 *              var metricStat = require('metrics-stat.js');
 *              metricStat.start('geo');
 *              metricStat.addStat('geo', 'geo_success');
 *              metricStat.submit('geo');
 *
 * @author lilin09@
 *
 */

var workingTargets = {};
var callbacks = {};
var expiringTargets = {};

var statType = "ms0";
var status =
    {
        success : 0,
        expire  : 1,
        suspend : 2
    };

var statUrl = "/mobile/img/transparent.gif?newmap=1";

    /**
     * @descriiption 开始对统计目标进行统计，如果该统计目标还有未完成的统计，将先停止未完成的统计并提交结果，再重新开始
     *
     * @param <String> target 统计目标
     * @param <Object> options 可选参数列表
     *        expire 超时时间，单位秒。如果指明，将在到达时间时直接提交。
     *        callback 回调函数， 将在统计请求发送50ms延时后执行回调，其回调参数为统计信息
     *
     * @return <Boolean> 是否执行成功
     */
    function start(target, options) {
        if (!target) {
            return false;
        }

        stopTarget(target, status.suspend, 1);

        var newStat = {};
        newStat.type = "ms0";
        newStat.target = target;
        newStat.ts = Date.now();
        workingTargets[target] = newStat;

        if (options) {
            var expireSec = options.expire;
            if (expireSec > 0) {
                setExpireTimeout(target, expireSec);
            }
            var callback = options.callback;
            if (callback && callback instanceof Function) {
                callbacks[target] = callback;
            }
        }
        return true;
    }

    function setExpireTimeout(target, expireSec) {
        expiringTargets[target] = setTimeout(function() {expire(target);}, expireSec * 1000);
    }

    /**
     *
     * @descriiption 为统计目标添加统计项，若已存在统计项，将重写已有的统计值。在发出统计请求不保证统计项的顺序
     *
     * @param <String> target 统计目标
     * @param <String> name 统计项名
     * @param 统计项值 其类型可以为数字，字符串或一维Hash结构
     *
     * @return <Boolean> 若start()未调用或统计请求已发送，返回false
     *
     *
     *
     */

    function addStat(target, name, value, isAdd) {
        if (!target || !name) {
            return false;
        }

        if (!value) {
            value = 1;
        }

        var targetStat = workingTargets[target];
        if (!targetStat) {
            return false;
        }
        /*
         * 当统计值为一维Hash，将把统计项展开成多个统计项
         */
        if ($.isPlainObject(value)) {
            for (var key in value) {
                var sub_name = name + "_" + key;
                targetStat[sub_name] = value[key];
            }
            targetStat[name] = setValue(targetStat[name], 1, isAdd);
        } else {
            targetStat[name] = setValue(targetStat[name], value, isAdd);
        }
        return true;
    }

    function setValue(old, value, isAdd) {
        if (!isAdd) {
            return value;
        }
        if (isNaN(old)) {
            return value;
        }
        if (isNaN(value)) {
            return value;
        } else {
            return old + value;
        }
    }

    /**
     *
     * @descriiption 统计结束时提交统计请求
     *
     * @param <String> target 统计目标
     *
     * @return <Boolean> 若start()未调用或统计请求已发送，返回false
     */

    function submit(target) {
        return stopTarget(target, status.success, 1);
    }

    /**
     *
     * @descriiption 若设定了超时时间，在超时后将调用expire停止统计并发送未完成的统计请求
     *
     * @param <String> target 统计目标
     *
     */
    function expire(target) {
        return stopTarget(target, status.expire, 1);
    }

    /**
     *
     * @descriiption 在用户将关闭页面时，将停止所有统计，并将未完成的统计请求发出
     *
     */

    function terminate() {
        if (isEmpty(workingTargets)) {
            return;
        }
        for (var target in workingTargets) {
            stopTarget(target, status.suspend, 1);
        }
    }

    function stopTarget(target, status, now) {
        if (!target) {
            return false;
        }

        var targetStat = workingTargets[target];
        if (!targetStat) {
            return false;
        }
        targetStat.status = status;
        var url = buildUrl(statUrl, targetStat);
        send(url, now);
        targetStat.url = url;
        delete workingTargets[target];

        var expireHandler = expiringTargets[target];
        if (expireHandler) {
            delete expiringTargets[target];
            clearTimeout(expireHandler);
        }

        //为不影响主流程执行，回调函数执行延时50ms
        var callback = callbacks[target];
        if (callback && callback instanceof Function) {
            setCallbackTimer(callback, targetStat, 50);
            delete callbacks[target];
        }

        return true;
    }

    function setCallbackTimer(callback, target, millSec) {
        setTimeout(function() {
            callback(target);
        }, millSec);
    }

    function buildUrl(baseUrl, stat) {
        var urlToken = baseUrl.split('?');
        var uri = urlToken[0] , query = urlToken[1];
        if (query) {
            query += '&';
        } else {
            query = '';
        }
        query += $.param(stat);

        var url = uri + '?' + query;
        return url;
    }

    function send(url, now) {
        new Image().src = url;
    }

    function isEmpty(o) {
        for ( var p in o ) {
            if ( o.hasOwnProperty( p ) ) {
                return false;
            }
        }
        return true;
    }

    //单元测试接口，非公开
    function getTarget(target) {
        if (!target) {
            return undefined;
        }
        return workingTargets[target];
    }

    //测试接口，非公开
    function sendOldStat(code, option) {
        var stat = {
                    't' : Date.now(),
                    'code' : code
                    };
        $.extend(stat, option);
        var url = buildUrl(statUrl, stat);
        send(url, 1);
    }

    //监听用户离开或关闭窗口事件
    $.each(['blur', 'pagehide', 'beforeunload', 'unload'],
                function(i, event){
                    var eventHandler = 'on' + event;
                    if (window[eventHandler] !== undefined) {
                        $(window).bind(event, terminate);
                    }
                });

/**
 * @module common:widget/stat
 */
module.exports = {
        start : start,
        addStat : addStat,
        submit : submit,
        getTarget : getTarget,
        sendOldStat : sendOldStat
};



});
;define('common:widget/geolocation/html5geolocation.js', function(require, exports, module){

/** 
* @file html5定位
* @author nichenjian@baidu.com
*/ 
'use strict';

var geolocation = require('common:widget/geolocation/location.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');
/*
* 封装百度定位接口对象
*/
var BGeoLoc = {
  
    // 定位请求host
    host    : "http://loc.map.baidu.com/wloc?",
  
    //定位请求参数
    param : {
        x     : "",
        y     : "",
        r     : "",
        prod  : "maponline"
    },
  
    /**
    * 获取定位请求参数
    * @param {Number} x 经度
    * @param {Number} y 纬度
    * @param {Number} r 误差
    */
    getReqQuery : function(x, y, r){
        var param  = { x : x || "", y : y || "", r : r || "" },
            result = [],
            query = '',
            me = this;

        $.extend(me.param, param);
        $.each(me.param, function(item){
            result.push(item + '=' + me.param[item]);
        })

        return result.join('&');
    },

    /**
    * 请求百度定位接口
    * @param {String} query 请求参数
    * @param {Function} cbk 请求成功后的回调函数
    */
    request : function(query, cbk){
        var baidu = {};
        baidu._callback = function (response){
            cbk && cbk(response);
        }
        window.baidu = baidu;
        var url = this.host + query + "&addr=city|district|street|city_code&fn=_callback&t=" + new Date().getTime();
        $.ajax({
            url: url,
            dataType : 'jsonp'
        });
        this._delay = window.setTimeout(function(){ 
            listener.trigger('common.geomethod','fail', {
                message: 'html5 geolocation fail'
            });
        }, 15000);
    }
};

/*
* 封装geolocation对象
*/
var HtmlGeoLoc = {
    getCurrentPosition : function(onSuccess, onFailure, opts){
        return navigator.geolocation.getCurrentPosition(onSuccess, onFailure, opts);
    },
    
    watchPosition      : function(onSuccess, onFailure, opts){
        return navigator.geolocation.watchPosition(onSuccess, onFailure, opts);
    },
    
    clearWatch         : function(id){
        navigator.geolocation.clearWatch(id);
    }
};

var Html5GeoLocation = {
    /**
     * html5定位的初始化
     * @param {object} data = {
     *    id : 'first' //第几次调起html5定位
     *    par: 30000   //html定位超时时间  
     * }
     */
    init: function(data){
        
        this._data = data || {};
        this._config = {
            enableHighAccuracy: true,
            maximumAge: 60000,
            timeout: this._data.par || 30000,
            accuracy: 200000000
        };
        this._getCurrentPosition(HtmlGeoLoc);
    },
    /**
     * 获取当前的位置，发起Html5定位
     * @param {object} loc 
     */
    _getCurrentPosition: function(loc){
        metricStat.addStat("geo", "html5_geo_all", 1, true);//html5定位总数统计
        loc.getCurrentPosition(this._onSuccess, this._onFailure, this._config);
    },
    /**
     * 定位成功的回调
     * @param {object} data
     */
    _onSuccess: function(data){
        var me = Html5GeoLocation,
            coords,
            accuracy;

        coords = data.coords;
        accuracy = coords.accuracy;

        //精度在允许的范围，且存在经纬度
        if(accuracy < me._config.accuracy 
            && coords.longitude != 0 
            && coords.latitude != 0){
            me._getPosSuccess(data, {success: me.onWlocSuccess});
        }else{
            listener.trigger('common.geomethod','fail',{});
        }

        //定位误差半径统计
        metricStat.addStat("geo", "wlan_geo_radius", parseInt(accuracy, 10));
    },
    /**
     * 定位失败回调
     * @param {object} data
     */
    _onFailure: function(data){
        var me = Html5GeoLocation;
            
        //html5定位失败统计
        metricStat.addStat("geo", "html5_geo_fail", {error:data.code, messgae:data.message}, true);
        listener.trigger('common.geomethod','fail',data);
    },
    /**
     * 用户是否拒绝定位
     * @param {object} msg
     * @return {bool} 
     */
    _isUserDeny : function(msg){
        if(msg && msg.code == 1){
            if((util.isIOS() 
                && msg.message.toLowerCase() == "user denied geolocation") 
                || util.isAndroid()){
                    return true;
            } else {
                return false;
            }
        }
    },
    /**
     * 获取反地理编码的结果
     * @param {object} data 定位获取的经纬度
     * @param {object} opts 
     */
    _getPosSuccess: function(data, opts){
        if(!data) return;
        var me = this,
            coords = data.coords;
        if(coords){
            var param = BGeoLoc.getReqQuery(coords.longitude, coords.latitude, coords.accuracy),
                time;
            
            me._isFirstSetLoc = true;
            var id = me._data.id;
            BGeoLoc.request(param, function(json){
                if(BGeoLoc._delay) {
                    window.clearTimeout(BGeoLoc._delay);
                }

                if(typeof json === 'object'){
                    //统计html5成功获取坐标信息
                    var data = {},
                        addr = json.addr;
                    // 如果没有point则认为定位失败，触发30min事件
                    if(!json.point) {
                        listener.trigger('common.geomethod','fail',{
                            message: 'has no point'
                        });
                        return;
                    }

                    data = {
                        addr: {
                            'city': addr.city,
                            'cityCode': addr.city_code,
                            'district': addr.district,
                            'street': addr.street,
                            'accuracy': coords.accuracy
                        },
                        point: json.point
                    };

                    $.extend(data,{
                        type: 'html5',
                        isExactPoi: json.point ? true : false,
                        isSaveLocInCookie : true
                    });
                    metricStat.addStat("geo", "html5_get_geo_suc", {id: id}, true);
                    listener.trigger('common.geomethod','success',data);
                }
            });
        }
    }
};

module.exports = Html5GeoLocation;


});
;define('common:widget/geolocation/nativegeolocation.js', function(require, exports, module){

/**
* @file native定位
* @author nichenjian@baidu.com
*/
'use strict';

var metricStat = require('common:widget/stat/metrics-stat.js'),
    geohost = 'http://127.0.0.1:6259/';

/**
 * @module common:widget/geolocation/nativegeolocation
 */
var NativeGeoLocation = {

	//host
	lochost: 'http://map.baidu.com',

	//apn接口的url
	apnUrl : geohost + 'getapn?callback=getApnCallback',
	
	//apinfo接口的url
	apinfoUrl: geohost + 'getlocstring?timeout=0&callback=getapinfo',
	
	//geolocation接口的url
	locSdkUrl: geohost + 'geolocation?timeout=12000&callback=getGeoByNative',
	
	/** 
	 * native定位初始化
	 * @param {object} data = {
	 *    id : first 当前的定位次数
	 * }
	 */
	init : function(data){
		//apn接口是否超时
		this._isApnTimeout      = false; 
		//native获取位置的接口是否Ok
		this._isNativeAvailable = false;
		//native获取位置是否超时                 
		this._isNativeTimeout   = false;
		//locsdk获取是否超时
		this._isLocsdkTimeout   = false;
		//apinfo获取是否超时
		this._isApinfoTimeout   = false;
		//当前定位是否已经成功
		this._isGeoSuc          = false;
		//apinfo定位成功
		this._isApinfoSuc       = false;
		//locsdk定位成功
		this._isLocsdkSuc       = false;
		//locsdk定位失败
		this._isLocsdkFail      = true;
		//apinfo定位失败
		this._isApinfoFail      = true;
		//是否定位超时
		this.outofdate          = false;
		//url参数
		this._data              = data || {};
		//开始native定位
		this.checkApn();
	},	
	/** 检查apn接口是否能够连接 */
	checkApn : function(){
		var me = this;
		$.ajax({
			'url': me.apnUrl,
			'dataType': 'jsonp',
			'success' : function(data) {
				if(me._isApnTimeout === false){
					if(data && data.error === 0){
						me._isNativeAvailable = true;
						me.nativeGeo && me.nativeGeo();
					}
				}
			}	
		})
		//两秒超时策略
		me.checkApnTimeout(2);
	},
	/**
	* 检查apn接口是否获取超时
	* @param {number} seconds 
	**/
	checkApnTimeout : function(seconds){
		var me = this;
		setTimeout(function(){
			if(me._isNativeAvailable === false){
				me._isApnTimeout = true;
				listener.trigger('common.geomethod','fail',{});
			}
		},1000 * seconds);
	},
	/** 
	 * native 定位入口 
     * 同时调用apinfo和locsdk两种定位方式
	 */
	nativeGeo : function(){
		//开始apinfo的定位
		this.geobyApinfo();
		//开始locsdk的定位
		this.geobyLocsdk();
        metricStat.addStat('geo', 'native_geo_all', 1, true);
	},
	/*
	*  当定位失败时调用
	*  @param {type} type: locsdk or apinfo 
	*/
	nativeGeofailed : function(type){
		var me = this;
		if(type == "locsdk"){
			me._isLocsdkFail = true;
		}else if(type == "apinfo"){
			me._isApinfoFail = true;
		}

		if(me._isLocsdkFail && me._isApinfoFail && !me.outofdate)
		{
			me.outofdate = true;
			listener.trigger('common.geomethod','fail',{});
			//native定位失败统计
            metricStat.addStat('geo', 'native_geo_fail', 1, true);
		}
	},
	/*
	* 从pushservice apinfo中获取定位信息
	*/
	geobyApinfo : function(){
		var me = this;
		$.ajax({
			'url' : me.apinfoUrl,
			'dataType' : 'jsonp',
			'success' : function(data){
				if(data.error === 0 && me._isApinfoTimeout === false){
					me.getLocation(data);
				}else{
                    metricStat.addStat('geo', 'native_geo_apinfo_fail', {id : data.error}, true);
					me.nativeGeofailed("apinfo");
				}
                metricStat.addStat('geo', 'native_get_geo_suc', {id : 'apinfo'}, true);
            }
		})
		
		me.checkApinfoTimeout(12);
	},
	/** 通过locsdk 获取定位的信息 */
	geobyLocsdk : function(){
		var me = this;
		$.ajax({
			'url': me.locSdkUrl,
			'dataType': 'jsonp',
			'success' : function(data){
				if(data.error === 0 && me._isLocsdkTimeout === false){
					me.getDetailLoc(data);
				}else{
					me.nativeGeofailed("locsdk");
				}
                metricStat.addStat('geo', 'native_get_geo_suc', {id : 'locsdk'}, true);
			}
		});

		me.checkLocsdkTimeout(12);
	},
	/**
	 * locsdk定位超时控制 
	 * @param {number} seconds 
	 */
	checkLocsdkTimeout : function(seconds){
		var me = this;
		setTimeout(function(){
			if(me._isLocsdkSuc === false || !me._isGeoSuc){
				me._isLocsdkTimeout = true;
				me.nativeGeofailed("locsdk");
			}
		}, 1000 * seconds);
	},
	/*
	* apinfo定位超时控制
	*/
	checkApinfoTimeout : function(seconds){
		var me = this;
		setTimeout(function(){
			if(me._isApinfoSuc === false || !me._isGeoSuc){
				me._isApinfoTimeout = true;
				me.nativeGeofailed("apinfo");
			}
		},1000*seconds);
	},
	/*
	* 获取定位反地理编码信息
	* @param {url} 异步请求位置的url
	*/
	getLocbyUrl : function(url){
		var me = this,
			id = me._data.id;
			$.ajax({
				url: url,
				'dataType': 'jsonp',
				success: function(data){
					var content = data && data.content,
						loc = content && content.address_detail,
						point = content && content.point,
						location;
					
					if(me.outofdate)
					{
						return;
					}

					if(data.error != 0 || content.address == "")
					{
						if(data.reqtype == 'apinfo' || data.reqtype == 'locsdk')
						{
							me.nativeGeofailed(data.reqtype);
						}
						else
						{
							me.outofdate = true;  //保证失败只能调用一次失败
							listener.trigger('common.geomethod','fail',{});
						}
						
						return;
					}

					if(data.error == 0 && data.reqtype == 'apinfo')  //定位依据成功返回定位数据显示
					{
                        metricStat.addStat('geo', 'url_geo_apinfo_suc_back', 1, true);
					}

					if(me._isGeoSuc) // 保证位置数据只能被存储一次
					{
						return;
					}
					me._isGeoSuc = true;
					location = {
						addr: {
							address: content.address || null,
							city: loc.city || null,
			 				cityCode: loc.city_code || 1,
							district: loc.district || null,
							street: loc.street || null,
							accuracy: loc.accuracy
						},
						point: {
							x: point.x || null,
							y: point.y || null
						},
						isGeoSuc: true,
						isExactPoi: true,
						type: 'native',
						isUserDeny: false,
                        isSaveLocInCookie : true
					}
					listener.trigger('common.geomethod','success',location);
                    metricStat.addStat('geo', 'native_geo_getinfo_suc', {type:data.reqtype, id:id}, true);
                }
			})
	},
	getLocation : function(data){
		var me = this;
		var apinfoarray = data.locstring.split("&");
		var totalinfo = apinfoarray[0]+"|"+apinfoarray[1];
		var url =  me.lochost + '/mobile/?qt=geo&apinfo='+totalinfo+'&type=apinfo&callback=';
		me._isApinfoSuc = true;
		me.getLocbyUrl(url);
	},
	getDetailLoc : function(data){
		var me = this,
			url = me.getRgcUrl(data);
		me._isLocsdkSuc = true;
		me.getLocbyUrl(url);
 
	},
	getRgcUrl: function(data){
		var px = data.coords.longitude,
			py = data.coords.latitude,
			radius = data.coords.accuracy,
			me = this,
			url;
		url = px && py ? me.lochost + '/mobile/?qt=geo&x=' + px + '&y=' + py + '&radius='+radius+ '&type=locsdk&callback=' : '';	
		return url;
	}
}

module.exports = NativeGeoLocation;


});
;define('common:widget/geolocation/myposition.js', function(require, exports, module){

/**
 * @fileOverview 封装我的位置读写删操作COOKIE对象
 */
 'use strict';
 
var cookie = require('common:widget/cookie/cookie.js');

module.exports = {

    // 主域
    domain: '.baidu.com',

    path: '/',

    webCookie: 'H_LOC_MI',

    nativeCookie: 'H_LOC_APP',

    baiduLoc: 'BAIDULOC',

    //cookie过期时间在2天
    expires: 2 * 24 * 60 * 60 * 1000,

    /**
     * 获取存在COOKIE中的信息
     * @param {String} key cookie key
     */
    get: function (type) {
        //获取的是新cookie格式
        if(type == 'baiduLoc'){
            var mypos = cookie.get(this.baiduLoc);
            if (!mypos){
                return;
            }

            var locData = {};
            try{
                var obj = mypos.split("_");
                locData = {
                    crd : {
                        x : obj[0],
                        y : obj[1],
                        r : obj[2]
                    },
                    cc  : obj[3],
                    t   : obj[4]
                }
            }catch(e){}

            return locData;
        }else{
            //获取的是旧cookie格式
            if (!type || !(type == "web" || type == "native")) {
                return;
            }
            var key = type === "web" ? this.webCookie : this.nativeCookie;
            var mypos = cookie.get(key);
            if (!mypos) {
                return;
            }
            var obj = JSON.parse(mypos);

            if (mypos && obj) {
                if (obj.crd) {
                    var crd = obj.crd.split('_');
                    if (crd[0] && crd[1] && crd[2]) {
                        obj.crd = { x: crd[0], y: crd[1], r: crd[2]}
                    }
                }
                return obj;
            }
        }
    },

    save: function (value) {
        if (typeof value != "object"
            && value.x
            && value.y
            && value.cityCode
            && value.accuracy
            ) {
            return;
        }
        this._save(value);
    },

    _save: function (value) {
        var t = Date.now();
        value.t = t + "";
        var _value = value.join('_');
        cookie.set(this.baiduLoc, _value, {domain: this.domain, path: this.path, expires: this.expires});
    },

    remove: function (key) {
        if (!key) {
            cookie.remove(this.webCookie, {domain: this.domain, path: this.path});
            return;
        }
        var mypos = cookie.get(this.webCookie), obj = JSON.parse(mypos), nobj = {};
        for (i in obj) {
            if (key == i) {
                continue;
            }
            nobj[i] = obj[i];
        }
        var value = JSON.stringify(nobj);
        cookie.set(this.webCookie, value, {domain: this.domain, path: this.path});
    }
}

});
;define("common:static/js/localstorage.js", function(require, exports, module){
    var localStorage = window.localStorage;
    var splitStrStart = '<#lsvalid#>';
    var splitStrEnd = '</#lsvalid#>';
    var splitReg = new RegExp("^(\<#lsvalid#\>)(.*)(\<\/#lsvalid#\>)$");

    /**
     * 数据库模块
     */
    var Storage = function() {
    };
    var storagePrototype = Storage.prototype;

    /**
     * deleteData() 删除记录
     * @param {String}       // 需要被删除的记录的name
     * @param options = {         //可选参数
     *    success : function(){} ,   //操作成功时的操作
     *    error : function(){}     //操作失败时的操作
     *  }
     */
    storagePrototype.deleteData = function(key, options) {
        if (!localStorage) {
            return;
        }
        options = options || {};
        try {
            localStorage.removeItem(key);
            options.success && options.success();
        } catch (e) {
            options.error && options.error();
        }
    };
    /**
     * addData() 添加记录
     * @param key String  //key
     * @param  value = [        //需要添加的value
     *    {"v" : "......", "n" : "......", "c" : "......"}
     *  ]
     * @param options = {         //可选参数
     *    success : function(){} ,   //操作成功时的操作
     *    error : function(){}     //操作失败时的操作
     *  }
     */
    storagePrototype.addData = function(key, value, options) {
        if (!localStorage) {
            return;
        }

        options = options || {};
        try {
            // 保证存储完整性
            localStorage.setItem(key, splitStrStart + JSON.stringify(value) + splitStrEnd);
            options.success && options.success();
        } catch (e) {
            options.error && options.error();
            Util.addStat(20155, {message: e.message, key:key, type:'ad'});
        }
    };
    /**
     * getData() 返回记录
     * @param key String 
     * @param {string} value //key对应的value
     */
    storagePrototype.getData = function(key){
        if (!localStorage) {
            return;
        }
        var value = localStorage.getItem(key);
        
        var result;

        //检查完整性
        var match = null;
        if (match = value.match(splitReg)){
            value = match[2];
            return value;
        }     
    };
    /**
     * selectData() 查找记录
     * @param n {String} //需要查询的记录的n字段
     * @param op = {          //可选参数
     *    s : function(){} ,   //操作成功时的操作
     *    f : function(){}     //操作失败时的操作
     *  }
     */
    var Util = require('common:static/js/util.js');
    storagePrototype.selectData = function(key, options) {
        if (!localStorage) {
            return;
        }
        var value = localStorage.getItem(key);
        
        var result;
        options = options || {};
        if (value === null) {
            options.success && options.success(value);
            return;
        }
        //检查完整性
        var match = null;
        if (match = value.match(splitReg)){
            value = match[2];
            try {
                result = JSON.parse(value);
                options.success && options.success(result);
            } catch (e) {
                options.error && options.error();
                Util.addStat && Util.addStat(20155,{key: key, type: 'sd', message: e.message});
            }
        } else {
            options.error && options.error();
            Util.addStat && Util.addStat(20155, {key: key, type: 'sd', message: 'data not valid'});
        }
    };

    module.exports = new Storage();
});

;define('common:widget/geolocation/sharegeolocation.js', function(require, exports, module){

/**
* @fileOverview 共享定位
* @author nichenjian
*/
'use strict';

var	myPosition  = require('common:widget/geolocation/myposition.js'),
	storage     = require('common:static/js/localstorage.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');

module.exports = {
    //cookie读取的时间，默认5分钟
	_MINUTES : 5,

    /** 
     * cookie定位初始化
     * @param opts = {
	 *   par : 5 //读取的cookie时间
	 *   id  :   //当前定位的id
     * }
     */
	init: function (opts) {
		
		opts = opts || {};
		this._MINUTES = parseInt(opts.par) || this._MINUTES;
		this._data = opts;
		this._startGeo();
	},
	/** 发起cookie 定位 */
	_startGeo: function(){
		if(typeof this._MINUTES === 'number'){
			//优先获取baiduLoc的cookie(最新的cookie格式)，再获取旧cookie格式的定位
			var cookieLoc = myPosition.get('baiduLoc') || myPosition.get('native') || myPosition.get('web'); 
			if(cookieLoc != null){
				this._setCookieLoc(cookieLoc); //获取精确的共享位置(非精确位置共享无效)
			}else{
				this._geoFailHandler();
			}
		}else{
			this._geoFailHandler();
		}
	},
	/**
	 * 当前的cookie是否在约定的时间内
	 * @param  {number} t 存储的cookie的时间戳
	 * @return {bool} 
	 */
	_isInMinutes: function(t){
		if(!t){
			return false;
		}

		var currentTime = parseInt(Date.now()); 
		var shareTime = currentTime - 1000 * 60 * this._MINUTES;

		if(t > shareTime){
			return true;
		}else{
			return false;
		}
	},
	/**
	 * 将定位的结果格式化
     * @param  {object} loc 当前定位的结果
     * @return {object} 格式化后的定位结果
     */
	_formatLoc: function(loc){
		var crd  = loc && loc.crd;
		
		if(!crd){
			return;
		}

		return {
			addr : {
				address: loc.addr,
				city: loc.city,
				district: loc.district,
				street: loc.street,
				cityCode: loc && loc.cc,
				accuracy: crd && crd.r
			},
			point: {
				x : crd && crd.x,
				y : crd && crd.y
			},
			t : loc && loc.t,
			isUserInput: (loc && loc.tp == 'ui') ? true : false,
			type: 'share',    //定位的成功类型是share
			isExactPoi: true, //cookie中读取的位置认为是精确的位置结果
			isGeoSuc: true,   //标识定位已经完成
			minutes: this._MINUTES
		}
	},
	/**
	 * 设置cookie定位的结果
	 * @param {object} shareLoc 从cookie中读取的结果
	 */
	_setCookieLoc: function(shareLoc){
		var me = this;
		var isInMinutes = me._isInMinutes(shareLoc.t);

		//验证获取的共享位置是否是精确点,且时间点是否在约定的时间内
		if(shareLoc && shareLoc.crd && isInMinutes){
			//若cookie中已经包含addr字段, 表示从旧cookie中拿到位置
			if(shareLoc.addr){
				me._addStatAndTriggerEvent(shareLoc);
			//从新cookie中拿到位置，检查storage中是否包含反地理编码信息
			}else if(me._checkLocFromStorage(shareLoc.crd)){
				me._getLocFromStorage(shareLoc);
			//异步接口获取反地理编码的信息
			}else{
				me._getRgcLoc(shareLoc);
			}
		}else{
			me._geoFailHandler();
		}
	},
    /**
     * 通过莫卡托坐标获取当前的位置反地理编码信息
     * @param {object} shareLoc 从cookie中获取的定位信息
     */
    _getRgcLoc: function(shareLoc){
    	var me = this;
        if(!shareLoc.crd.x || !shareLoc.crd.y){
            return;
        }

        var url = "http://api.map.baidu.com/?qt=rgc_standard&x=" + shareLoc.crd.x +"&y=" + shareLoc.crd.y + "&dis_poi=" + shareLoc.crd.r + "&poi_num=10&ie=utf-8&oue=1&res=api&callback=";
        $.ajax({
            url: url,
            dataType: "jsonp", 
            success: function(data){
                var address = data.content.address;
                var addressDetail = data.content.address_detail;
                $.extend(shareLoc, {
                    addr : address,
                    city : addressDetail.city,
                    district : addressDetail.district,
                    street : addressDetail.street
                });
                storage.addData('webapp-location-cookie',shareLoc);
                me._addStatAndTriggerEvent(shareLoc);
            }
        }); 
    },
    /**
     * 检查localStorage中是否包含定位的反地理编码结果
     * @param {object} 当前定位的点坐标
     * @return {bool} 是否存在与当前定位点相同的坐标位置
     */
    _checkLocFromStorage: function(poi){
    	var loc, locObj;
    	if(poi == undefined){
    		return false;
    	}
    	try{
    		var loc = storage.getData('webapp-location-cookie');
			if(loc == undefined){
				return false;
			}
			//为啥要parse两次的原因待追查
			locObj = JSON.parse(JSON.parse(loc));
    	}catch(e){
    		return false;
    	}

    	//判断存储的点x,y坐标与定位的坐标是否相同
    	if(locObj.x == poi.x &&
    		locObj.y == poi.y){
    		this._locAddress = locObj;
    		return true;
    	}else{
    		return false;
    	}
    },
    /**
     * 从localStorage中读取定位的反地理编码信息
     * @return {object} 反地理编码的结果
     */
    _getLocFromStorage: function(shareLoc){
    	var addr = this._locAddress;
        $.extend(shareLoc, {
            addr : addr.address ? addr.address : addr.city + addr.district + addr.street,
            city : addr.city,
            district : addr.district,
            street : addr.street
        });
        this._addStatAndTriggerEvent(shareLoc);
    },
    /** 发送统计和派发事件 */
    _addStatAndTriggerEvent: function(data){
    	var data = this._formatLoc(data);
        metricStat.addStat("geo", "share_geo_suc", 1, true);
        listener.trigger('common.geomethod','success', data);
    },
    /** 定位失败的回调 **/
	_geoFailHandler: function(){
		if(this._MINUTES <= 5){
			listener.trigger('common.geomethod','fail',{});
			return;
		}
		if(this._MINUTES >= 30){
			listener.trigger('common.geomethod','fail', this._data);
			return;
		}
	}
}


});
;define('common:widget/geolocation/preciseipgeolocation.js', function(require, exports, module){

/**
* @fileOverview 精确IP定位
* @author chengbo
*/
'use strict';

var PreciseIPGeoLocation = {
	/**
	 * 精确ip定位初始化
	 * @param {object} [data] 
	 */
	init : function(data){
		this._startGeo();
	},	
	/** 开始精确ip定位 */
	_startGeo : function(){		
		var addrbyip = _DEFAULT_CITY.addrbyip;
		if(addrbyip){
			this._getDetailLoc(eval('('+addrbyip+')'));			
		}else{
			listener.trigger('common.geomethod','fail',{});
		}
	},
	/*
	* 获取ip定位中的具体位置
	* @param {object} data initdata中的数据
	* @author chengbo
	*/
	_getDetailLoc : function(data){
		var me = this,
			content = data && data.content,
			loc = content && content.address_detail,
			point = content && content.point,
			location;

		if(data.error != 0 || content.address == ""){
			listener.trigger('common.geomethod','fail',{});
			return;
		}

		location = {
			addr: {
				address: content.address || null,
				city: loc.city || null,
				cityCode: loc.city_code || 1,
				district: loc.district || null,
				street: loc.street || null,
				accuracy:loc.accuracy || null
			},
			point: {
				x: point.x || null,
				y: point.y || null
			},
			isGeoSuc: true,
			isExactPoi: true,
			type: 'preciseip',
			isUserDeny: false,
            isSaveLocInCookie : true
		};
		listener.trigger('common.geomethod','success',location);
	}
};

module.exports = PreciseIPGeoLocation;

});
;define('common:widget/geolocation/urlgeolocation.js', function(require, exports, module){

/**
* @fileOverview 读取url定位定位
* @author chengbo
*/
'use strict';
//测试url: http://map.baidu.com/mobile/webapp/index/index/locMC=12948098|4845189
var	metricStat  = require('common:widget/stat/metrics-stat.js');

module.exports = {

	//host
	lochost: 'http://map.baidu.com',

	/**
	 * url定位初始化 
	 * @param {object} data 
	 */
	init : function(data){
		//发起定位
		this._startGeo();
	},	
	/** 开始url定位 */
	_startGeo : function(){	
		var me = this;
		var coords = me.getContainLoc()
		if(coords){
			me.getDetailLoc(coords);
		}else{
			listener.trigger('common.geomethod','fail',{});
		}
	},
	/**
	 * 获取反地理编码的结果
	 * @param {array} coords = [x,y] x,y分别为坐标
	 */
	getDetailLoc : function(coords){
		var me    = this;
		var point = coords || [],
			url   =  me.lochost + '/mobile/?qt=geo&x=' + point[0] + '&y=' + point[1] +'&type=url&callback=';
		if(!point[0] || !point[1]){
			listener.trigger('common.geomethod','fail',{});
			return;
		}else{
			//发起url定位的统计
	        metricStat.addStat("geo", "url_geo_startget");
			$.ajax({
				url: url,
				dataType: 'jsonp',
				success: function(data){
					var content = data && data.content,
						loc = content && content.address_detail,
						point = content && content.point,
						location;

					if(data.error != 0 || content.address == ""){
						listener.trigger('common.geomethod','fail',{});
						return;
					}

					location = {
						addr: {
							address: content.address || null,
							city: loc.city || null,
							cityCode: loc.city_code || 1,
							district: loc.district || null,
							street: loc.street || null
						},
						point: {
							x: point.x || null,
							y: point.y || null
						},
						isGeoSuc: true,
						isExactPoi: true,
						type: 'url',
	                    isSaveLocInCookie: true,
						isUserDeny: false
					}
					listener.trigger('common.geomethod','success',location);				
				},
				error: function(){
					listener.trigger('common.geomethod','fail',{});
				}
			});
		}
	},

	/** 
	 * 获取href中的坐标
     * @param {array} 坐标数组 
	 */
	getContainLoc : function(){
		var tmphref = decodeURI(window.location.href);
		var index  = tmphref.indexOf('locMC=');
		var locstring = '';
		var locindex = '';
		var coords = [];
		if(index < 0)
		{
			return;
		}
		index+=6;
		locstring = tmphref.substr(index,tmphref.length);
		locindex = locstring.indexOf('|');

		if(locindex > 0)
		{
			coords = [];
			coords[0] = locstring.substr(0,locindex);
			coords[1] = locstring.substr(locindex+1,locstring.length);
			return coords;
		}
		else
		{
			return;
		}
	}
};


});
;define('common:widget/url/url.js', function(require, exports, module){

/**
 * @fileoverview url前端处理功能
 * @author jican@baidu.com
 * @date 2013/08/01
 */

var util = require("common:static/js/util.js");

// 存储上一个页面的url
var storageKey = "_lastPageUrl";

module.exports = {

    host : 'http://' + location.host,

    /**
     * 直接更新当前页面URL
     * @param {object} hash {module:string, action:string, query:Object, pageState:Object}
     * @param {object} [options]
     */
    update : function(hash, options) {
        var newUrl,
            _options = options || {},
            newHash = this._get(hash, _options),
            curHash = window.location.pathname;
        if (newHash === curHash) {
            return;
        }
        newUrl = this.host + newHash;
        this.navigate(newUrl,options);
    },

    /**
     * 跳转函数
     * @param  {string} url     
     * @param  {object} options 
     * @return {void}
     */
    navigate : function(url, options) {

        if(typeof url !== "string") {
            return;
        }

        var curHash = window.location.pathname,
            _options = options || {};

            _options.trigger = (_options.trigger===false) ? false : true;

        // 如果配置了replace，则替换当前的历史记录
        if(_options.replace === true && _options.storageKey !== false){
            try{
                window.localStorage.setItem(storageKey,curHash);
            }catch(e){}
            appPage.redirect(url, _options);
        } else {
            appPage.redirect(url, _options);
        }
    },

    /**
     * 获取当前路由信息
     * @param {opts} {
         path: 路径 可选
         disableEncode: 不编码 可选
       }
     * @return {Object} {module:string, action:string, query:Object, pageState:Object}
     */
    get : function(opts) {
        opts = opts || {};
        path = opts.path || window.location.pathname;
        disableEncode = opts.disableEncode || false;
        var pathname = path.slice(1);
        var pathArrs = pathname.split('/');
        var product = pathArrs[0];
        var style = pathArrs[1];
        var module = pathArrs[2];
        var action = pathArrs[3];
        var query = pathArrs[4];
        var pageState = pathArrs[5] || "";
        
        if(!disableEncode) {
            // pagestate android 默认浏览器自动解码 hack case
            // 请针对自己的业务在android默认平台下编码
            var checkPageStateDictionary ={
                seachbox:function(key){
                    var ProcessDir ={
                        place:function(pkey){
                            var pageStateArr = pageState.split('from=place&'+pkey+'=');
                            pageState ='from=place&'+pkey+'=' + encodeURIComponent(pageStateArr[1]);
                        },
                        loc:function(lkey){
                            var pageStateArr = pageState.split(lkey+'=');
                            pageState = lkey+'=' + encodeURIComponent(pageStateArr[1]);
                        }
                    }
                    key && ProcessDir[key[1]](key[0]);
                }
            };
            //判断是否有和url重合的字段 如果有没被编码过的话
            if(!(/%3d|%26/ig.test(pageState)) && pageState.indexOf("=") > -1 ){
                var paramProcess = {
                    DictionaryName : "seachbox",
                    DictionaryData : ""
                };
                /*
                **路线搜索业务逻辑单独处理
                **从定位跳过来单独处理
                */
                var placeFlag = !(/^(from=place&start=word%3d|from=place&end=word%3d)/ig.test(pageState)),
                    locationFlag = !(/^(start=word%3d|end=word%3d)/ig.test(pageState));
                if (placeFlag || locationFlag) { 
                    if(pageState.indexOf("start")!==-1){
                        var parseFlag = /^start=word=/ig.test(pageState);
                        !parseFlag && placeFlag && (paramProcess.DictionaryData = ['start','place']);
                        parseFlag && locationFlag &&(paramProcess.DictionaryData = ['start','loc']);
                    }else if(pageState.indexOf("end")!==-1){
                        var EndparseFlag = /^end=word=/ig.test(pageState);
                        !EndparseFlag && placeFlag &&(paramProcess.DictionaryData = ['end','place']);
                        EndparseFlag && locationFlag &&(paramProcess.DictionaryData = ['end','loc']);
                    }
                    checkPageStateDictionary[paramProcess.DictionaryName](paramProcess.DictionaryData);
                };
            }
        }
        return {
            'product' : product,
            'style' : style,
            'module': module,
            'action': action,
            'query': util.urlToJSON(query || ''),
            'pageState': util.urlToJSON(pageState || '')
        };
    },

    /**
     * 返回首页
     * @return {void} 
     */
    toIndex : function(options) {
        var options = $.extend({
            queryReplace : true,
            pageStateReplace : true
        },options);

        this.update({
            module : "index",
            action : "index"
        } , options);
    },

    /**
     * 获取新的Url对象
     * @param {object} newHash {module:string, action:string, query:Object, pageState:Object}
     * @param {object} options
     * @private
     */
    _get : function(newHash, options) {

        var curHash = window.location.pathname.slice(1),
            hashArrs = curHash.split('/'),
            product = hashArrs[0] || "mobile",
            style = hashArrs[1] || "webapp",
            module = hashArrs[2] || 'index',
            action = hashArrs[3] || 'index',
            query = hashArrs[4] || 'foo=bar',
            pageState = hashArrs[5] || '',
            queryReplace = (options && options.queryReplace) || false,
            pageStateReplace = (options && options.pageStateReplace) || false,
            result = [];

        result.push(newHash.product || product);
        result.push(newHash.style || style);

        // 模块
        result.push(newHash.module || module);
        // 动作
        result.push(newHash.action || action);

        if (queryReplace) {
            // 完全替换现有的参数
            if (newHash.query) {
                result.push(util.jsonToUrl(newHash.query));
            }
        } else {
            // 仅仅修改某个key/value
            var queryObject = util.urlToJSON(query);
            newHash.query = newHash.query || {};
            for (var key in newHash.query) {
                if (newHash.query[key] !== '') {
                    queryObject[key] = newHash.query[key];
                } else {
                    delete queryObject[key];
                }
            }
            result.push(util.jsonToUrl(queryObject));
        }
        // 状态
        if (pageStateReplace) {
            // 完全替换现有的page state
            if (newHash.pageState) {
                result.push(util.jsonToUrl(newHash.pageState));
            }
        } else {
            // 仅仅修改某个key/value
            newHash.pageState = newHash.pageState || {};
            var pageStateObject = util.urlToJSON(pageState);
            for (var key in newHash.pageState) {
                if (newHash.pageState[key] !== '') {
                    pageStateObject[key] = newHash.pageState[key];
                } else {
                    delete pageStateObject[key];
                }
            }
            result.push(util.jsonToUrl(pageStateObject));
        }
        return '/' + result.join('/');
    }
};

});
;define('common:widget/geolocation/geolocation.js', function(require, exports, module){

require('common:static/js/gmu/src/core/widget.js'); 
/**
 * @file 定位流程处理
 * @author nichenjian@baidu.com
 */
'use strict';

var html5Geo     = require('common:widget/geolocation/html5geolocation.js'),
    nativeGeo    = require('common:widget/geolocation/nativegeolocation.js'),
    shareGeo     = require('common:widget/geolocation/sharegeolocation.js'),
    preciseipGeo = require('common:widget/geolocation/preciseipgeolocation.js'),
    urlGeo       = require('common:widget/geolocation/urlgeolocation.js'),
    myPosition   = require('common:widget/geolocation/myposition.js'),
    locator      = require('common:widget/geolocation/location.js'),
    metricStat   = require('common:widget/stat/metrics-stat.js'),
    util         = require('common:static/js/util.js'),
    storage      = require('common:static/js/localstorage.js'),
    url          = require('common:widget/url/url.js');

/**
 * @module common:widget/geolocation/geolocation
 */
module.exports = {
    //上次定位是否失败
    _IS_LAST_GEO_FAIL: false,

    //当前定位方式的索引
    _GEO_METHOD_INDEX: 0,

    //当前定位的方式组合
    _GEO_ARRAY : [],

    /**
    * 定位初始化
    * 绑定定位监听的事件，发起定位(多次init也只会调起一次定位)
    */
    init: function () {
        this._bindEvent();
        this.startGeo({
            isInitGeo: true,
            isNoCoverLoc: window._NO_COVER_LOC
        });     
    },
    _bindEvent: function () {
        var me = this;

        //避免重复绑定定位事件
        if(me._hasBindEvent === true){
            return;
        }
        me._hasBindEvent = true;

        //html5定位初始化事件
        listener.on('common.html5Geolocation', 'start', function (event,data) {
            html5Geo.init(data);
        });

        //native定位初始化事件
        listener.on('common.nativeGeolocation', 'start', function (event,data) {
            nativeGeo.init(data);
        });

        //共享位置time时间内定位初始化事件
        listener.on('common.shareGeo', 'start', function (event,data) {
            // 共享定位异步化，解决落地页图区挪图bug
            setTimeout(function () {
                shareGeo.init(data);
            }, 0);
        });

        //精确ip定位开始定位初始化事件
        listener.on('common.preciseipGeo', 'start', function (event,data) {
            setTimeout(function () {
                preciseipGeo.init(data);
            }, 0);
        });

        //url定位
        listener.on('common.urlgeolocation', 'start', function (event,data) {
            setTimeout(function () {
                urlGeo.init(data);
            }, 0);
        });

        //定位成功事件
        listener.on('common.geolocation', 'success', function (event,loc) {
            me._geoSuccess(loc);
        });

        //定位失败事件
        listener.on('common.geolocation', 'fail', function (event,msg) {
            me._geoFail(msg);
        });

        //单个定位方法失败回调
        listener.on('common.geomethod', 'fail', function (event,data) {
            me._geoMethodFail(data);
        });

        //单个定位方法成功回调
        listener.on('common.geomethod', 'success', function (event,data) {
            me._geoMethodSuccess(data);
        });
    },
    /**
     * 用户手动定位的入口
     * @param {object} [opts] 定位的参数
     * opts = {
     *    isInitGeo: 从init发起的定位（系统定位）
     *    isNoCoverLoc : 当前的位置是否不能覆盖
     *    success  : 定位成功的回调
     * }
     */
    startGeo: function (opts) {
        var _opt = opts || {};
        //上次定位是否失败
        this._IS_LAST_GEO_FAIL = false; 
        //定位开始的时间
        this._time = Date.now();   
        // 是否是系统发送的定位请求     
        this._isInitGeo = _opt.isInitGeo || false;
        //回调函数，在定位成功后执行。
        this.sucCallback = _opt.success || function () {};
        //开始定位统计
        metricStat.start("geo", {expire: 50});
        //统计定位总请求数
        metricStat.addStat('geo', 'start_geo_loc');
        //是否覆盖当前的位置, true表示不能覆盖
        window._NO_COVER_LOC = _opt.isNoCoverLoc || false;
        //系统定位
        if(_opt.isInitGeo === true){
            if(!this._checkStorageGeoStatus()
                || !this._checkStorageMyLocStatus()
                ){
                this._startGeo({isInitGeo:true});
            }
        //手动定位，获取精确的位置
        }else{
            this._startGeo();
        }
    },
    _startGeo: function(){
        //初始化定位的数据
        this._initGeoData();
        //重置当前定位的是第一种方式
        this._GEO_METHOD_INDEX = 0;
        //开始发起定位
        this._useNextMethod();
    },
    /**
     * 检查localStorage位置的状态
     * @return {bool} 是否已经拿到位置
     */
    _checkStorageGeoStatus: function(){
        var me = this;
        //读取localStorage定位成功            
        if(window._INIT_LOC_SUC === true){
            var locator = require('common:widget/geolocation/location.js');
            //增加延时,避免派发事件过早
            setTimeout(function(){
                listener.trigger('common.geolocation', 'success', locator._location);
            },0);
            return true;
        }else{
            return false;
        }
    },
    /**
     * 检查localStorage中我的位置获取状态
     * @return {bool} 是否已经拿到我的位置
     */
    _checkStorageMyLocStatus: function(){
        if(window._INIT_MYLOC_SUC === true){
            var locator = require('common:widget/geolocation/location.js');
            //增加延时,避免派发事件过早
            setTimeout(function(){
                listener.trigger('common.geolocation', 'mylocsuc', locator._mylocation);   
            },0);
            return true;
        }else{
            return false;
        }
    },
    /**
     * 定位成功后，需要将定位后的结果转换成cookie存储的格式
     * @param {object} loc 定位数据
     * @return {array} cookie中缓存的定位数据对象
     */
    _formatToCookie : function (loc) {
        var addr = loc.addr || {},
            point = loc.point || {},
            type = '',
            t = (new Date()).getTime() + "",
            locInfo = [];

        //未返回精确度，默认给出1000米的精确范围
        addr.accuracy = addr.accuracy || 1000;
        //未返回当前的城市，默认给出全国的cityCode
        addr.cityCode = addr.cityCode || 1;
        if (!point.x 
            || !point.y
            || !addr.cityCode
            ) {
            return;
        }

        locInfo.push(parseInt(point.x));
        locInfo.push(parseInt(point.y));
        locInfo.push(addr.accuracy);
        locInfo.push(addr.cityCode);
        locInfo.push(t);

        return locInfo;
    },
    /**
     * 将地址等信息保存在localStorage中
     * @param {object} loc
     */
    _saveAddressInStorage: function(loc){
        var addr = loc.addr || {},
            point = loc.point || {};

        var data = {
            address   : addr.address,
            city      : addr.city,
            district  : addr.district,
            street    : addr.street,
            x         : parseInt(point.x),
            y         : parseInt(point.y)
        };
        //保存cookie对应的address信息
        storage.addData('webapp-location-cookie', JSON.stringify(data));
    },
    /**
     * 定位成功回调
     * @param {object} 定位数据
     */
    _geoSuccess: function (loc) {
        var me = this,
            type = loc.type,
            isExactPoi = loc.isExactPoi,
            isSaveLocInCookie = loc.isSaveLocInCookie,
            saveLoc;

        //添加定位成功统计
        me._addStatGeoSuc(loc);
        //若是精确点，且非共享位置，则将位置信息记录在cookie中
        if (isExactPoi && type !== 'share' && type !== 'storage') {
            if (isSaveLocInCookie === false) {//位置是否允许存储
                return;
            } else {
                saveLoc = this._formatToCookie(loc);
                //新cookie格式将不保存address等信息，将这些信息保存在localstorage中
                this._saveAddressInStorage(loc);
                myPosition.save(saveLoc);
            }
        }

        if (isExactPoi === true) {
            me._IS_LAST_GEO_FAIL = false;//上次定位成功
        }

        me.sucCallback && me.sucCallback(loc);//定位成功时，执行回调
        me.sucCallback = null;//执行回调完成后将回调置空，防止回调的多次执行
    },
    /**
     * 定位失败回调
     * @param {object} msg 定位失败的信息
     */
    _geoFail: function (msg) {
        var me = this;
        //app.location.isGeoSuc = false;//定位失败
        me._IS_LAST_GEO_FAIL = true;//上次定位失败
        me._addStatGeoFail(msg);//添加定位失败统计
        me.sucCallback && (me.sucCallback = null);//定位失败后，若回调存在，则将回调置空，防止回调的重复执行
    },
    /**
     * 添加时间统计
     * @return {number} time 定位所需的时间(单位s)
     */
    _getStatTime: function () {
        var time = Date.now();
        time = Math.ceil((time - this._time) / 1000);
        return time;
    },
    /**
     * 添加定位的统计
     * @param {object} loc 定位数据
     */
    _addStatGeoSuc: function (loc) {
        var me = this,
            time;

        time = me._getStatTime(); //定位所需时间

        if(loc.isExactPoi && loc.type != null){
            metricStat.addStat('geo', 'geo_suc_all');//统计定位总成功数
        }

        switch(loc.type){
            case 'share' :
                if(loc.minutes == 5){
                    metricStat.addStat('geo', 'share_geo_five_suc', {time : time}); //统计五分钟内共享位置定位成功
                }
                if(loc.minutes == 30){
                    metricStat.addStat('geo', 'share_geo_thirty_suc', {time : time});//统计三十分钟内共享位置定位成功
                }
                break;
            case 'native':
                metricStat.addStat('geo', 'native_geo_suc', {time : time});//统计native定位成功
                break;
            case 'html5' :
                metricStat.addStat('geo', 'wlan_geo_success', {time : time});//统计html5定位成功
                break;
            case 'preciseip':
                metricStat.addStat('geo', 'preciseip_geo_sucess', {time : time});//添加精确IP定位统计
                break;
            case 'url':
                metricStat.addStat('geo', 'url_geo_sucess', {time : time});// 添加url定位统计
                break;
            case 'storage': 
                if(loc.isExactPoi){
                    metricStat.addStat('geo', 'storage_geo_success', {time : time});//添加localStorage定位统计
                }
                break;
        }
        //添加定位成功结束统计
        metricStat.addStat('geo', 'geo_suc_end');
        metricStat.submit("geo");
    },
    /**
     * 定位失败的统计
     * @param {object} msg 定位失败的数据
     */
    _addStatGeoFail: function (msg) {
        metricStat.addStat('geo', 'wlan_geo_error', {error:msg.code, messgae:msg.message});//统计定位失败次数，针对html5定位
        metricStat.submit("geo");
    },
    /*
     * 单个定位方法成功回调
     * @param {object} data回调参数
     * @author chengbo
     */
    _geoMethodSuccess: function (data) {
        var locator = require('common:widget/geolocation/location.js');
        locator.setAddress(data, this._isInitGeo);
        this._geoindex = 0;
    },
    /*
     * 单个定位方法失败回调
     * @param {object} data回调参数
     * @author chengbo
     */
    _geoMethodFail: function (data) {
        var me = this;
        me._useNextMethod(data);
    },
    /**
     * 初始化相关数据
     * 设置数组缓存当前的定位方式队列
     * @author chengbo
     */
    _initGeoData: function () {
        var native1 = {geostr: 'common.nativeGeolocation', type: 'start', param: {id: 'first'}},
            native2 = {geostr: 'common.nativeGeolocation', type: 'start', param: {id: 'second'}},
            share_5 = {geostr: 'common.shareGeo', type: 'start', param: {par: 5, id: '5min'}},
            share_30 = {geostr: 'common.shareGeo', type: 'start', param: {par: 30, id: '30min'}},
            preciseip = {geostr: 'common.preciseipGeo', type: 'start', param: {}},
            html51 = {geostr: 'common.html5Geolocation', type: 'start', param: {id: 'first', par: 30000}},
            html52 = {geostr: 'common.html5Geolocation', type: 'start', param: {id: 'second', par: 30000}},
            url = {geostr: 'common.urlgeolocation', type: 'start', param: {}};

        if (util.isAndroid() === true) {
            this._GEO_ARRAY = [url, share_5, native1, preciseip, html51, native2, share_30, html52];
        } else {
            this._GEO_ARRAY = [url, share_5, html51, preciseip, share_30, html52];
        }
    },
    /*
     * 一次调用定位方法
     * @param  定位失败，回传的失败信息
     * @author chengbo
     */
    _useNextMethod: function (data) {
        var tmpgeoobj = this._GEO_ARRAY[this._GEO_METHOD_INDEX];
        if (tmpgeoobj) {
            tmpgeoobj.geostr = tmpgeoobj.geostr || '';
            tmpgeoobj.param = tmpgeoobj.param || {};
	    tmpgeoobj.type = tmpgeoobj.type || '';
            this._GEO_METHOD_INDEX++;
            listener.trigger(tmpgeoobj.geostr, tmpgeoobj.type, tmpgeoobj.param);
        }
        else {
            listener.trigger('common.geolocation', 'fail', data);
        }
    }
};

});
;define('common:widget/geolocation/location.js', function(require, exports, module){

/**
 * @file 地理信息api
 * @author nichenjian@baidu.com
 */
 'use strict';

var cookie = require('common:widget/cookie/cookie.js'),
    geolocation = require('common:widget/geolocation/geolocation.js');

/**
 * @module common:widget/geolocation/location
 */
module.exports = {
    // 定位的依据(包括系统自己定位，切城, 用户选择位置等)
    _location: null,

    // 我的位置定位依据(只有系统自身定位的结果才作为我的位置)
    _mylocation: null,

    /**
     * 获取地理信息
     * @return {object} addr 地理位置信息
     */
    _getAddr: function () {
        return (this._location && this._location.addr) || {};
    },

    /**
     * 获取坐标信息
     * @return {object} point 地理坐标信息
     */
    _getPoint: function () {
        return (this._location && this._location.point) || {};
    },

    /**
     * 获取我的位置
     * @return {object} addr 我的位置地理位置信息
     */
    _getMyAddr: function () {
        return (this._mylocation && this._mylocation.addr) || {};
    },

    /**
     * 获取我的位置坐标信息
     * @return {object} point 我的位置地理位置点
     */
    _getMyPoint: function () {
        return (this._mylocation && this._mylocation.point) || {};
    },

    /**
     * 获取我的位置x坐标点
     * @return {float} x
     */
    getMyPointX: function () {
        var point = this._getMyPoint();
        return point.x ? point.x : '';
    },

    /**
     * 获取我的位置y坐标点
     * @return {float} y
     */
    getMyPointY: function () {
        var point = this._getMyPoint();
        return point.y ? point.y : '';
    },

    /**
     * 获取我的位置当前城市code
     * @return {number} 城市code
     */
    getMyCityCode: function () {
        var addr = this._getMyAddr();
        return addr.cityCode ? addr.cityCode : null;
    },

    /**
     * 返回我的位置对象
     * @return {object} 返回我当前的位置对象(系统定位)
     */
    getMyLocation: function () {
        return this._mylocation;
    },

    /**
     * 获取我的位置中心点
     * @return {object} point
     */
    getMyCenterPoi: function () {
        var me = this;
        return {
            x: me.getMyPointX(),
            y: me.getMyPointY()
        }
    },

    /**
     * 是否定位已经完成
     * return {bool}
     */
    isGeoEnd: function () {
        return this._location.isGeoEnd;
    },

    /**
     * 等待定位,默认为8秒钟
     * @param {object} {
    *   seconds         : seconds 等待的时间，默认为8秒
    *   successCallback : successCallback  获取定位信息成功的回调
    *   errorCallback   : errorCallback 获取定位信息失败的回调
    * }
     */
    waitForLoc: function (opts) {
        var me = this,
            seconds,
            successCallback,
            _hasBindEvent = false,
            errorCallback;

        //是否已经初始化完成，保证只执行一次successCallback或者errorCallback
            me._isInitSuc = false;
        if (typeof opts != 'object') {
            return;
        }

        seconds = opts.seconds || 8;
        successCallback = opts.successCallback || function () {
        };
        errorCallback = opts.errorCallback || function () {
        };

        //获取定位成功初始化操作
        function initWithLoc() {
            if (me._isInitSuc === false) {
                me._isInitSuc = true;
                successCallback();
            }
        }

        //获取定位失败初始化操作
        function initWithoutLoc() {
            if (me._isInitSuc === false) {
                me._isInitSuc = true;
                errorCallback();
            }
        }

        if(_hasBindEvent === false){
            listener.on('common.geolocation', 'success', function (event,data) {
                initWithLoc();
            });
            listener.on('common.geolocation', 'fail', function (event,data) {
                initWithoutLoc();
            });
            _hasBindEvent = true;
        }

        //判断是否已经定位成功或失败
        if (me.isGeoEnd()) {
            //若有精确位置，则进行精确位置的初始化，否则进行无位置初始化
            me.hasExactPoi() ? initWithLoc() : initWithoutLoc();
        }

        //等待8秒，若定位没有成功
        setTimeout(function () {
            initWithoutLoc();
        }, 1000 * seconds);
    },
    /**
    * 发起定位
    */
    startGeo: function(){
        this._isInitSuc = false;
        geolocation.startGeo();
    },
    /**
     * 获取上级的城市Code
     * @return {number}
     */
    getUpCityCode: function () {
        var me = this,
            addr = me._getAddr();

        return addr.upCityCode;
    },

    /**
     * 获取地理信息的全称描述
     * @return {string} address
     */
    getAddress: function () {
        var me = this,
            addr;

        addr = me._getAddr();
        return addr.address != null ? addr.address : me.getCity() + me.getDistrict() + me.getStreet();
    },

    /**
     * 获取城市名称
     * @return {string} cityName
     */
    getCity: function () {
        var addr = this._getAddr();
        return addr.city ? addr.city : '';
    },

    /**
     * 获取城市code码
     * @return {number} cityCode
     */
    getCityCode: function () {
        var addr = this._getAddr();
        return addr.cityCode ? addr.cityCode : '';
    },

    /**
     * 获取区名称
     * @return {string} district
     */
    getDistrict: function () {
        var addr = this._getAddr();
        return addr.district ? addr.district : '';
    },

    /**
     * 获取街道名称
     * @return {string} street
     */
    getStreet: function () {
        var addr = this._getAddr();
        return addr.street ? addr.street : '';
    },

    /**
     * 获取x坐标点
     * @return {float} x
     */
    getPointX: function () {
        var point = this._getPoint();
        return point.x ? point.x : '';
    },

    /**
     * 获取y坐标点
     * @return {float} y
     */
    getPointY: function () {
        var point = this._getPoint();
        return point.y ? point.y : '';
    },

    /**
     * 获取中心点
     * @return {object} point
     */
    getCenterPoi: function () {
        var me = this;
        return {
            x: me.getPointX(),
            y: me.getPointY()
        }
    },

    /**
     * 判断是否精确点
     * @return {bool}
     */
    hasExactPoi: function () {
        return !!this._location.isExactPoi;
    },

    /**
     * 返回所有定位数据
     * @return {object} location 所有的定位数据
     */
    getLocation: function () {
        return this._location;
    },

    /**
     * 返回地图的level
     * @return {number} level 地图的level
     */
    getLevel: function () {
        var me = this,
            level,
            cityCode = me.getCityCode();

        level = this._location.level;

        //定位到全国时，level展示为4
        if (cityCode == 1) {
            return 4;
        }
        //检查是否是矢量渲染，若是则level最小是16
        if (me.hasExactPoi() && cookie.get('ab')) {
            this._location.level = level > 16 ? level : 16;
        }

        return this._location.level ? this._location.level : this._location.isExactPoi ? 15 : 12;
    },

    /**
     * 返回定位成功的方式
     * @return {string} type 定位成功的方式
     */
    getType: function () {
        return this._location.type;
    },

    /**
     * 返回城市的类型
     * @return {number} cityType 定位后城市的信息，若无则返回null
     */
    getCityType: function () {
        var me = this,
            addr;

        addr = me._getAddr();
        return addr.cityType;
    },

    /**
     * 是否定位成功
     * @return {bool} isGeoSuc 判断当前是否已经定位成功
     */
    hasGeoSuc: function () {
        return this._location.isGeoSuc !== null ? this._location.isGeoSuc : null;
    },

    /**
     * 获取精确度
     * @return {number} accuracy 定位的精确度
     */
    getAccuracy: function () {
        var addr = this._getAddr();
        return addr.accuracy;
    },

    /**
     * 是否用户输入的位置
     * @return {bool}
     */
//  isUserEnterPoi: function(){
//      return this._location.type === null ? true : false;
//  },
    /**
     * 是否用户拒绝定位
     * @return {bool} isUserDeny 是否用户拒绝定位
     */
    isUserDeny: function () {
        return !!app.isUserDeny;
    },

    /**
     * 定位失败
     * @return {bool} 定位是否失败
     */
    isLocFailed: function () {
        return !!this._location.isGeoSuc;
    },

    /**
     * 是否用户输入的位置
     * @return {bool} 是否用户输入的位置
     */
    isUserInput: function () {
        return this._location.isUserInput;
    },

    /**
     * 是否用户输入的位置(内部方法)
     * @param {object} data
     * @return {bool} 是否用户输入的位置
     */
    _isUserInput: function (data) {
        var _data = data || {};
        //标识用户输入位置
        if (_data.isUserInput) {
            return true;
        }
        //定位的类型为空, 表示用户输入的位置
        if (_data.type == null) {
            return true;
        }
        return false;
    },

    /**
     * 存储定位结果在localStorage中
     */
    _saveLocInStorage: function () {
        var me = this;
        var storage = window.localStorage;
        if (storage) {
            if (me._location) {
                var isInitGeo = me._location.isInitGeo;
                delete me._location.isInitGeo;
                try {
                    storage.setItem('webapp-loc', JSON.stringify(me._location));
                } catch (e) {
                    //
                }
                me._location.isInitGeo = isInitGeo;
            }

            if (me._mylocation) {
                var isInitGeo = me._mylocation.isInitGeo;
                delete me._mylocation.isInitGeo;
                try {
                    storage.setItem('webapp-myloc', JSON.stringify(me._mylocation));
                } catch (e) {
                    //
                }
                me._mylocation.isInitGeo = isInitGeo;
            }
        }
    },
    
    /**
     * 设置我的位置
     * @param {object} data 我的位置数据
     * @param {object} data.addr
     * @param {string} data.addr.city 城市名称
     * @param {string} data.addr.code 城市code
     * @param {string} data.addr.district 区名称
     * @param {string} data.addr.street 街道名称
     * @param {string} data.addr.address 位置描述信息
     * @param {number} data.addr.accuracy 精确度
     * @param {string} data.addr.upCityCode 当前区的城市code
     * @param {object} data.point
     * @param {number} data.point.x x轴坐标
     * @param {number} data.point.y y轴坐标
     * @param {string} data.type 定位的方式
     * @param {number} data.t 定位成功的时间戳
     * @param {boolean} data.isGeoSuc 是否已定位成功
     * @param {boolean} data.isExactPoi 是否是精确点
     * @param {number} data.level 地图的级别
     * @param {boolean} data.isUserDeny 用户是否拒绝定位
     * @param {number} data.minutes 共享位置定位时间
     * @param {boolean} data.isGeoEnd 定位是否已经完成
     * @param {boolean} data.isSaveLocInCookie 定位结果是否存储在cookie中
     * @param {boolean} data.isSaveLocInStorage 定位结果是否存储在locaStorage
     */
    setAddress: function (data, isInitGeo) {
        var me = this,
            _data = data || {},
            addr = _data.addr || {},
            point = _data.point || {},
            //是否是系统定位
            isInitGeo = isInitGeo || false,
            type;
        
        //后端返回中国时，页面需要展示全国
        if(addr.city == '中国'){
            addr.city = '全国';
        }

        var _location = {
            addr: {
                city: addr.city ? addr.city : '',
                cityCode: addr.cityCode ? addr.cityCode : 1,
                district: addr.district ? addr.district : '',
                street: addr.street ? addr.street : '',
                accuracy: addr.accuracy ? addr.accuracy : null,
                address: addr.address ? addr.address : null,
                cityType: addr.cityType ? addr.cityType : null,
                upCityCode: addr.upCityCode ? addr.upCityCode : null
            },
            point: {
                x: point.x ? point.x : null,
                y: point.y ? point.y : null
            },
            //定位的方式
            type: _data.type ? _data.type : null,
            t: _data.t ? _data.t : (new Date()).getTime(),
            isGeoSuc: _data.isGeoSuc ? !!_data.isGeoSuc : null,
            isExactPoi: _data.isExactPoi ? _data.isExactPoi : false,
            level: _data.level ? _data.level : false,
            isSaveLocInCookie: _data.isSaveLocInCookie || false,
            isSaveInStorage  : _data.isSaveInStorage === false ? false : true,
            minutes: _data.minutes ? _data.minutes : null,
            isInitGeo: isInitGeo,
            isUserInput: this._isUserInput(_data),
            isGeoEnd: _data.type !== 'ip' ? true : false
        };

        //当前的定位方式
        type = _location.type;

        if(isInitGeo == false){
            me._location = _location;
        }else{
            //当前的位置如果可以覆盖，则直接覆盖当前的位置
            if(window._NO_COVER_LOC !== true){
                me._location = _location;
            }           
        }

        //当前定位点是精确点，派发我的位置定位成功事件
        if (_location.isExactPoi) {
            me._mylocation = _location;
            listener.trigger('common.geolocation','mylocsuc', _location);
        }
        
        //将定位数据存储在localStorage中
        if(_location.isSaveInStorage){   
            me._saveLocInStorage();  
        }

        //非ip定位触发定位成功事件
        if(type !== 'ip'){  
            listener.trigger('common.geolocation','success', me._location);
        }
    }
};

});
;
// 定义全站使用的常量
define('common:static/js/mapconst.js', function (require, exports, module) {
    var util = require('common:static/js/util.js');
    module.exports = {
        TILE_FOMAT: "jpeg", //底图的格式
        //TILE_COLORS = "64",//底图图片颜色
        //TILE_COLOR_DEP = "8.jpg",//底图参数
        TILE_QUALITY: "40", //底图质量
        TILE_URL: ["http://online0.map.bdimg.com/it/",
            "http://online1.map.bdimg.com/it/",
            "http://online2.map.bdimg.com/it/",
            "http://online3.map.bdimg.com/it/"
        ],
        FORMAT: '.jpg',

        /**
         * geo类型常量
         */
        GEO_TYPE_AREA: 0,
        GEO_TYPE_LINE: 1,
        GEO_TYPE_POINT: 2,
        /**
         * POI点类型常量
         */
        POI_TYPE_NORMAL: 0,
        POI_TYPE_BUSSTOP: 1,
        POI_TYPE_BUSLINE: 2,
        POI_TYPE_SUBSTOP: 3,
        POI_TYPE_SUBLINE: 4,
        /**
         * 路线类型常量
         */
        ROUTE_TYPE_DEFAULT: 0,
        ROUTE_TYPE_BUS: 1,
        ROUTE_TYPE_WALK: 2,
        ROUTE_TYPE_DRIVE: 3,
        ROUTE_TYPE_UNSURE: 6,

        TRANS_TYPE_BUS: 0,
        TRANS_TYPE_SUB: 1,
        /**
         * 起始点和终止点常量
         */
        DEST_START: 0,
        DEST_END: 1,
        DEST_MIDDLE: 2,
        DEST_SEC: 3,

        INPUT_SUG: "输入一个位置，如：西单",
        MY_GEO: "我的位置",
        ViewMargins: util.isAndroid() ? [60, 50, 50, 50] : [60, 50, 50, 0],
        ROUTE_MARGINS: util.isAndroid() ? [85, 50, 50, 50] : [85, 50, 50, 20],
        GRViewMargins: [60, 50, 60, 50],
        SvpOpts: {
            enableAnimation: false,
            margins: this.ViewMargins
        },

        PAGE_ID : {
            traffic : 3            // 交通流量
        },

        SEARCH_FOR_LOC_TIMEOUT: 8000, // 检索时，等待定位返回的超时值
        GLCON_TIMEOUT: 30000, // HTML5定位接口，超时参数值

        BUSINESS_SPLIT: "     ",

        APP_ROOT: "mobile/webapp/",
        CITY_BY_BOUNDS_URI: 'http://s0.map.baidu.com/',
        TRAFIIC_URI: 'http://its.map.baidu.com:8001/showevents.php',

        MARKERS_PATH   : '/static/common/images/markers_d2cfab5.png',
        DEST_MKR_PATH  : '/static/common/images/dest_mkr_4dfb043.png',

        ROUTE_DICT :  [
            {
                stroke: 6,
                color: "#3a6bdb",
                opacity: 0.65
            }, {
                stroke: 6,
                color: "#3a6bdb",
                opacity: 0.75
            }, {
                stroke: 4,
                color: "#30a208",
                opacity: 0.65
            }, {
                stroke: 5,
                color: "#3a6bdb",
                opacity: 0.65
            }, {
                stroke: 6,
                color: "#3a6bdb",
                opacity: 0.5
            }, {
                stroke: 4,
                color: "#30a208",
                opacity: 0.5,
                strokeStyle: "dashed"
            }, {
                stroke: 4,
                color: "#575757",
                opacity: 0.65,
                strokeStyle: "dashed"
            }
        ],

        IW_POI: 0, // 普通检索
        IW_GRT: 1, // 泛需求
        IW_BSL: 2, // 公交线路
        IW_CNT: 3, // 周边查询中心点
        IW_BUS: 4, // 公交
        IW_NAV: 5, // 驾车
        IW_WLK: 6, // 步行
        IW_SHR: 7, // 共享位置点
        IW_TFC: 10, // 交通路况
        IW_VCT: 11, // 底图可点
    };
});
;define('common:widget/pagemgr/pagemgr.js', function(require, exports, module){

/**
 * @fileOverview page管理组件
 * @author caodongqing@baidu.com
 */

var isPushState = window._isPushState,
	stepLength = 0,
	eid = 0,
    loadStatus = 1,
    statusType = {
        'switchstart' : 1,
        'pagearrived' : 2,
        'switchend' : 3,
        'pageloaded' : 4
    },
    // 页面到达类型，类型有  landing: 落地页， fromcache: 通过缓存，quickling: 通过quickling
    initiatorType = ["landing","quickling","fromcache"],
    pageInitiator = "landing",
    destoryCallback = [];


/**
 * 获取refer页面的host
 * @return {string} refer的host
 */
var getReferHost = function () {
    var refer = document.referrer,
        hostReg = /^.*?\/\/(.*?)(\/|\?|\#|$)/i,
        match = refer.match(hostReg),
        referHost;
    if(match) {
        referHost = match[1];
    }

    return referHost;
};

/**
 * 判断是否落地页
 * @return {Boolean}
 */
var isLandingPage = function () {
    if(_isPushState) {
        return stepLength === 0;
    } else {
        return window.location.host !== getReferHost();
    }
};

var isSinglePageApp = function(){
    return _isPushState;
};

var getInitiator = function(){
    return pageInitiator;
};

// 设置页面发起者
var setInitiator = function(type) {
    if(initiatorType[type]) {
        pageInitiator = initiatorType[type];
    }
};


/**
 * 判断是否是站内跳转
 * @return {Boolean}
 */
var isAppNavigate = function () {
    if(_isPushState) {
        return true;
    } else {
        return window.location.host === getReferHost();
    }
};

/**
 * 记录状态，并返回当前状态的eid
 * @param  {[type]} status [description]
 * @return {[type]}        [description]
 */
var recordAndGetEid = function(status) {

    if(!statusType[status]) {
        return;
    }

    // 页面开始加载前自增eid
    // 或者目前加载状态已经是完成态了，自增eid，这种情况是因为目前asyncload也会派发 pageloaded事件
    if( status === "switchstart" || loadStatus === statusType['pageloaded'] ) {
        eid++;
    }

    // 加载状态记录状态
    loadStatus = statusType[status];
    return eid;
};
var bindEvent = function(){
    appPage.on('onpagerenderstart', function(e) {
    	var options = e || {};
    	options.eid = recordAndGetEid('switchstart');

        listener.trigger('common.page', 'switchstart',options);

    });

    // 页面刚刚到达时间
    appPage.on('onpagearrived', function(e) {
        var options = e || {};
        options.eid = recordAndGetEid('pagearrived');

        // 设置发起者
        setInitiator(e.initiator);

        listener.trigger('common.page', 'pagearrived', options);
    });

    // 页面渲染完成时间
    appPage.on('onpagerendercomplete', function(e) {
        var options = e || {};

        options.eid = recordAndGetEid('switchend');
        stepLength++;

        // 执行销毁
        destory();

        listener.trigger('common.page', 'switchend',options);

    });

    // 所有页面脚本样式资源加载完成时间
    appPage.on('onpageloaded', function(e) {
        var options = e || {};
        options.eid = recordAndGetEid('pageloaded');

        listener.trigger('common.page', 'pageloaded', options);
    });

}

var destory = function() {
    $.each(destoryCallback,function(index,item){
        item();
    });
    destoryCallback = [];
}

var registerDestory = function(callback){
    if($.isFunction(callback)) {
        destoryCallback.push(callback);
    }
}

var init = function() {
	bindEvent();
}

module.exports = {
	init : init,
    getInitiator : getInitiator,
    registerDestory : registerDestory,
    isLandingPage : isLandingPage,
    isSinglePageApp : isSinglePageApp,
    isAppNavigate : isAppNavigate
};


});
;define('common:widget/appresize/appresize.js', function(require, exports, module){

/**
 * @fileoverview 屏幕尺寸变化处理
 * @author lbs-web@baidu.com
 * @require jican@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js');

module.exports = {

    init: function () {
        var _this = this;
        this.bind();
        this.setMainHeight();
        $(document.body).css("min-height", window.innerHeight);
    },

    bind: function () {
        listener.on('common', 'sizechange', $.proxy(this.update, this));

        if (typeof window.onorientationchange !== 'undefined') {
            window.addEventListener('orientationchange', this.resize, false);

            if (util.isAndroid()) {
                window.addEventListener('resize', this.resize, false);
            }
        } else {
            window.addEventListener('resize', this.resize, false);
        }
        
        // 每次页面加载后，需要重设内容区域的高度，使footer保持在底部 
        listener.on('common.page', 'switchend', $.proxy(this.setMainHeight,this));

    },

    getAppHeight : function () {
        var winHeight = window.innerHeight,
            headerHeight = $('.common-widget-header').height(),
            searchboxHeight = $('.index-widget-searchbox').height(),
            tabHeight = $('.index-widget-tabgroup').height(),
            navHeight = $('.common-widget-nav').height(),
            footerHeight = $('.common-widget-footer').height(),
            bottomBannerHeight = $('.common-widget-bottom-banner').height(),
            minHeight = winHeight - (headerHeight + footerHeight + bottomBannerHeight),
            mapTop = headerHeight+ searchboxHeight + navHeight + tabHeight,
            mapHeight = winHeight - mapTop;
            
        return {
            min: minHeight,
            mapTop : mapTop,
            mapHeight : mapHeight,
            header : headerHeight,
            footer : footerHeight,
            bottom: bottomBannerHeight
        };
    },

    setMainHeight : function(){
        var appHeight = this.getAppHeight();
        $('#main').css({
            'min-height': appHeight.min
        });
    },

    update: function () {

        var appHeight = this.getAppHeight();
        $('#main').css({
            'min-height': appHeight.min
        });
        $('.common-widget-map').css({
            'height': appHeight.mapHeight,
            'top': appHeight.mapTop
        });
    },
    resize : function (evt) {
            /* mod by zhijia
            *bug ios在输入法弹起的情况下，横竖屏会黑屏。
            *fix orientationchange单独处理。*/
            function _reset(){
                setTimeout(function() {
                    $(document.body).css("min-height", window.innerHeight); // 重设body的min-height
                }, 1);

                listener.trigger('common', 'sizechange',{
                    width: evt.target.innerWidth,
                    height: evt.target.innerHeight,
                    delay: true
                });
            }
            var etype = evt.type;
            var fnDictionaries = { //事件字典 方便扩展
                "onorientationchange": function() {
                    setTimeout(function() {
                        _reset();
                    }, 1000);
                },
                "resize": function() {
                    _reset();
                }
            };
            etype && fnDictionaries[etype]();
        }
};

});
;define('common:widget/map/iwcontroller.js', function(require, exports, module){

/**
 * @file infowindow控制器
 * 封装infowindow切换、注册和显示
 * @example
 * 使用方法：
 * 1、client不需要关心infoWindow构造、维持和销毁过程
 * 2、client只需要关心需要什么类型（或者模板）的indoWindow
 * 3、client只需要调用get方法，传入指定类型（使用mapConst.IW_***常量），获取infoWindow实例
 * 4、之后，初始化iw需要调用iw.setData方法，根据不同的iw类型传入不同的预设格式的数据（具体看各类型infoWindow注释）
 * 5、最后，调用iw.switchTo方法，切换到指定索引顺序的数据并添加到地图之上
 * 6、目前，没有销毁的需求，一律采用hide方法隐藏处理
 */

var mapConst = require('common:static/js/mapconst.js');

module.exports = {

    /**
     * 预设的构造器
     * @type {Overlay}
     */
    _instances: {
        0  : 'PoiInfoWindow', // 普通检索
        1  : 'PoiInfoWindow', // 泛需求
        2  : 'TrsInfoWindow', // 公交线路
        3  : 'PoiInfoWindow', // 周边查询中心点
        4  : 'TrsInfoWindow', // 公交
        5  : 'TrsInfoWindow', // 驾车
        6  : 'TrsInfoWindow', // 步行
        7  : 'PoiInfoWindow', // 共享位置点
        10 : 'TfcInfoWindow', // 交通路况
        11 : 'PoiInfoWindow'  // 底图可点
    },

    /**
     * 内部变量，保存已创建的infoWindows
     * key/value标识
     * @type {Object}
     */
    _infoWindows: {},

    /**
     * 内部变量，保存当前激活的infoWindow
     * @type {Object}
     */
    _overlay: null,

    /**
     * 初始化方法
     */
    init: function (map) {
        this._map = map;
        return this;
    },

    /**
     * 增加一种类型的InfoWindow，并添加到map
     * @param {Number} type mapConst.IW_***
     */
    get: function(type) {
        if (!this._instances[type]) return this._overlay;

        var iwOverlay, instance;
        if (this._infoWindows[type]) {
            iwOverlay = this._infoWindows[type];
        } else {
            instance = this[this._instances[type]];
            iwOverlay = this._infoWindows[type] = instance.init(type);
            iwOverlay._type = type;
        }

        var overlays = this._map.getOverlays();
        for (var i = 0, len = overlays.length; i < len; i++) {
            if (iwOverlay == overlays[i]) {
                return this._setOverlay(iwOverlay);
            }
        }

        if (iwOverlay instanceof BMap.Overlay) {
            this._map.addOverlay(iwOverlay);
        }

        return this._setOverlay(iwOverlay);
    },

    // 保证不同类型的InfoWindow在图区只有一个弹框
    _setOverlay: function(iwOverlay) {
        if (this._overlay && this._overlay !== iwOverlay) {
            this._overlay.hide();
        }
        this._overlay = iwOverlay;
        this._overlay.show();
        return iwOverlay;
    }

};

});
;define('common:widget/monitor/maplog.js', function(require, exports, module){

/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */
var util = require('common:static/js/util.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    url = require('common:widget/url/url.js');

/**
 * 底图性能统计记录起点时间变量
 */
var vct_start_time,
    ras_start_time,
    traffic_start_time;

/**
 * 底图性能统计参数
 */
var netspeed = window.netspeed,
    netMarkName = netspeed < 300 ? 'high' : 'low',
    landMarkName = pagemgr.isLandingPage()? 'ild' : 'uld',
    pltMarkName = util.isAndroid() ? 'and' : 
                  util.isIPad() ? 'ipd' : 
                  util.isIPhone() ? 'iph' : 'oth';

/**
 * 底图性能统计对象
 */
var map,
    map_page_app = SDC.createApp(SDC.DICT.MAP_OTHER_PAGE),
    map_avg_app = SDC.createApp(SDC.DICT.MAP_AVG),
    vector_app = SDC.createApp(SDC.DICT.MAP_VCT),
    raster_app = SDC.createApp(SDC.DICT.MAP_TIL),
    traffic_app = SDC.createApp(SDC.DICT.TRAFFIC_LAD);

/**
 * 记录页面和浏览器切换状态,只针对底图页
 */
var isAppBack = false,  // 重回APP
    isAppOut = false,   // 离开APP
    isPageOut = false;  // 切出页面

function bindAppStateEvent() {
    // 监听pageshow 记录切回浏览器的状态
    $(window).on('pageshow', function(evt) {
        //只有从back-forward cache才记录 by jican
        if(evt && evt.persisted) {
            isAppBack = true;
        }
    });
    // 监听pagehide 记录切出浏览器的状态
    $(window).on('pagehide', function(evt) {
        isAppOut = true;
    });
    // 监听switchstart 记录用户切出底图页状态
    listener.on('common.page', 'switchstart', function(evt){
        isPageOut = true;
    });
}

/**
 * 是否允许发送统计数据
 */
function allowSendData () {
    return !isAppBack && !isAppOut && !isPageOut;
}

/**
 * 根据HASH获取区分底图页面的性能统计APP
 */
function getMapPageApp () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        key = ('MAP_' + module + '_' + action).toUpperCase();

    if(SDC.DICT[key]) {
        return SDC.createApp(SDC.DICT[key]);
    } else {
        return map_page_app;
    }
}

/**
 * 矢量渲染开始回调函数
 */
function mapload() {
    map_avg_app.mark('c_map_load');
    map.removeEventListener("load", mapload);
}

/**
 * 矢量渲染开始回调函数
 */
function vectorbegin() {
    vct_start_time = Date.now();
}

/**
 * 栅格渲染开始回调函数
 */
function rasterbegin() {
    ras_start_time = Date.now();
}

/**
 * 矢量路况开始回调函数
 */
function trafficvectorbegin() {
    traffic_start_time = Date.now();
}

/**
 * 矢量渲染结束回调函数
 */
function vectorloaded() {
    
    if(vct_start_time && allowSendData()){
        // 为了防止事件派发导致的错误记录需要在loaded事件里记录begin时间 by jican
        map_avg_app.mark('c_vector_begin', vct_start_time);
        map_page_app.mark('c_vct_st', vct_start_time);
        vector_app.mark('c_vct_st', vct_start_time);

        // 平均矢量出图时间
        map_avg_app.mark('c_vector_load');
        map_avg_app.view_time();
        map_avg_app.ready(1);

        // 分页面统计矢量出图时间
        map_page_app.mark('c_vct_lt_' + landMarkName);
        map_page_app.view_time();
        map_page_app.ready(1);

        // 单独统计矢量出图时间
        vector_app.view_time();
        vector_app.ready(1);

        // 性能测试
        window._perlog && window._perlog(map_avg_app);
    }

    map.removeEventListener("onvectorbegin", vectorbegin);
    map.removeEventListener("ontilesbegin", rasterbegin);
    map.removeEventListener("onvectorloaded", vectorloaded);
    map.removeEventListener("ontilesloaded", rasterloaded);
}

/**
 * 栅格渲染结束回调函数
 */
function rasterloaded() {

    if(ras_start_time && allowSendData()) {
        // 为了防止事件派发导致的错误记录需要在loaded事件里记录begin时间 by jican
        map_avg_app.mark('c_tiles_begin', ras_start_time);
        map_page_app.mark('c_rst_st', ras_start_time);
        raster_app.mark('c_rst_st', ras_start_time);

        // 平均栅格出图时间
        map_avg_app.mark('c_tiles_load');
        map_avg_app.view_time();
        map_avg_app.ready(1);

        // 分页面统计栅格出图时间
        map_page_app.mark('c_rst_lt_' + landMarkName);
        map_page_app.view_time();
        map_page_app.ready(1);

        // 单独统计栅格出图时间
        raster_app.view_time();
        raster_app.ready(1);

        // 性能测试
        window._perlog && window._perlog(map_avg_app);
    }

    map.removeEventListener("onvectorbegin", vectorbegin);
    map.removeEventListener("ontilesbegin", rasterbegin);
    map.removeEventListener("onvectorloaded", vectorloaded);
    map.removeEventListener("ontilesloaded", rasterloaded);
}

/**
 * 矢量路况渲染结束回调函数
 */
function trafficvectorloaded() {
    if (traffic_start_time && allowSendData()) {
        traffic_app.start_event(traffic_start_time);
        traffic_app.view_time();
        traffic_app.ready(1);
    }
    map.removeEventListener("onTrafficvectorbegin", trafficvectorbegin);
    map.removeEventListener("onTrafficvectorloaded",  trafficvectorloaded);
}

// 记录性能统计起点时间
function mapStart() {
    map_page_app = getMapPageApp();
    map_avg_app.start_event();
    map_page_app.start_event();
    vector_app.start_event();
    raster_app.start_event();
}

// 记录JS加载完成时间
function jsLoaded() {
    map_avg_app.mark('c_js_load');
    map_avg_app.mark('c_js_lt_' + landMarkName);
}

// 地图对象实例化后监听API派发事件
function mapInit(event, mapObj) {
    map = mapObj;
    map.addEventListener("load", mapload);
    map.addEventListener("onvectorbegin", vectorbegin);
    map.addEventListener("ontilesbegin", rasterbegin);
    map.addEventListener("onvectorloaded", vectorloaded);
    map.addEventListener("ontilesloaded", rasterloaded);
    map.addEventListener("onTrafficvectorbegin", trafficvectorbegin);
    map.addEventListener("onTrafficvectorloaded", trafficvectorloaded);
}

module.exports = {
    /**
     * 底图性能统计初始化
     */
    init: function () {
        // 监听页面状态
        bindAppStateEvent();
        // 监听common.map事件
        listener.once('common.map', 'start', mapStart);
        listener.once('common.map', 'jsloaded', jsLoaded);
        listener.once('common.map', 'init', mapInit);
    }
};

});
;define('common:widget/map/map.js', function(require, exports, module){

/**
 * @fileoverview 地图组件
 * @author jican@baidu.com
 * @date 2013/10/23
 */

var mapConst = require('common:static/js/mapconst.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    util = require('common:static/js/util.js'),
    url = require('common:widget/url/url.js'),
    appresize = require('common:widget/appresize/appresize.js'),
    locator = require('common:widget/geolocation/location.js'),
    iwController = require('common:widget/map/iwcontroller.js'),
    stat = require('common:widget/stat/stat.js');

module.exports = {
    /**
     * 图片路径常量 业务模块可能会用到
     */
    MARKERS_PATH         : '/static/common/images/markers_d2cfab5.png',
    DEST_MKR_PATH        : '/static/common/images/dest_mkr_4dfb043.png',
    NAVI_MKR_PATH        : '/static/common/images/navigation_0a1010a.png',
    DRV_DIRECTION_PATH   : '/static/common/images/drv_dest_7bdf9f7.png',
    DRV_KEY_POI_PATH     : '/static/common/images/drv_pin_d247bae.png',
    BUS_DIRECTION_PATH   : '/static/common/images/bus_direction_d783d51.png',
    /**
     * 是否初始化
     */
    _initialized : false,
    /**
     * 驾车规划路线
     */
    driveRoutes: [],
    /**
     * 线路规划的起终点标注
     */
    destPois: [],
    /**
     * 地图组件初始化入口
     * @param {Function} cbk 回调
     */
    init: function (cbk) {
        if(!this._initialized) {
            this._init(cbk);
        } else {
            this.show(); // 非初始化状态需要先将地图show出来
            cbk && cbk(this._BMap);
            this.trafficControl.update();
        }
    },
    /**
     * 地图组件真正初始化函数 
     * @param {Function} cbk 回调
     */
    _init: function (cbk) {
        var _this = this;
        // 底图性能监控初始化
        (require('common:widget/monitor/maplog.js')).init();
        // 派发底图开始事件
        listener.trigger('common.map', 'start');
        // 获取异步组件 保存引用到当前对象
        this._getAsyncWidget(function(){
            var BMap = _this._BMap = arguments[0];
            listener.trigger('common.map', 'jsloaded'); // 派发JS加载完成事件
            $.each(arguments, function (index, item) {
                if(item._className_) {
                    if(/InfoWindow/.test(item._className_)) {
                        iwController[item._className_] = item;
                    } else {
                        _this[item._className_] = item;
                    }
                }
            });
            _this._initMap();
            _this._initialized = true;
            cbk && cbk(BMap);
        });
    },
    /**
     * 设置底图为矢量图
     */
    setVector: function () {
        this._map.config.vectorMapLevel = 12;
    },
    /**
     * 设置底图为栅格图
     */
    setRaster: function () {
        this._map.config.vectorMapLevel = 99;
        if(window._WISE_INFO && window._WISE_INFO.netspeed <= 300){
            this._map.enableHighResolution();
        }
    },
    /**
     * 设置地图视野 对外公开
     * @param {Array<Point>} 同map的setViewport参数第一个
     * @param {ViewportOptions} 同map的setViewport参数第二个
     */
    setViewport: function(data, options){
        var viewport = this._map.getViewport(data, options);
        var center = viewport.center;
        var zoom = viewport.zoom;
        this._centerAndZoom(center, zoom);
    },
    /**
     * 设初始化地图 如果center类型为Point时，zoom必须赋值
     * 除了首页其他模块不建议直接使用
     * @param {Point} center 中心点
     * @param {Number} zoom 级别
     */
    _centerAndZoom: function (center, zoom) {
        // 根据定位结果设置地图位置
        if (!center || !zoom) {
            center = new BMap.Point(
                locator.getPointX(),
                locator.getPointY()
            );
            zoom = locator.getLevel();
        }
        this._map.enableLoadTiles = true;
        this._map.centerAndZoom(center, zoom);
    },
    /**
     * 底图初始化 只会被执行一次 
     */
    _initMap: function () {

        // 常量
        this.DEST_MARKER_SIZE = new this._BMap.Size(29, 35);
        this.DEST_MARKER_ANCHOR = new this._BMap.Size(15, 34);
        this.DEST_DRIVER_DIR_SIZE = new this._BMap.Size(18, 18);

        // 显示地图容器
        this.show();

        // 创建地图实例
        var map = this._map = new this._BMap.Map('map-holder', {
            maxZoom: 18,
            minZoom: 3,
            drawMargin: 0,
            enableFulltimeSpotClick: true,
            enableHigholution: false, // 默认使用低分辨率效果
            vectorMapLevel: 12  // 默认开启矢量底图
        });

        // 先禁止加载瓦片
        map.enableLoadTiles = false;
        map.enableInertialDragging();

        // 绑定事件
        this._bindEvent();
        // 初始化地图控件
        this._initControl();
        // 派发JS加载完成事件
        listener.trigger('common.map', 'init', map);
    },
    /**
     * 隐藏地图容器
     */
    hide: function  () {
        $('.common-widget-map').css('visibility', 'hidden');
    },
    /**
     * 显示地图容器
     */
    show: function () {
        //显示地图容器之前需要先计算页面宽高和地图容器位置
        appresize.update();
        $('.common-widget-map').css('visibility', 'visible');
        this._fixCenterPos();
    },
    /**
     * 监听事件
     */
    _bindEvent: function () {

        var _this = this,
            map = this._map,
            BMap = this._BMap;

        // 绑定图区事件 增加底图可点功能 
        this._bindMapClick();

        // 监听定位成功
        listener.on('common.geolocation', 'success', function (event, data) {

            var href = url.get(),
                module = href.module,
                action = href.action,
                pageState = href.pageState || {},
                isLanding = pagemgr.isLandingPage(),
                center = new BMap.Point(data.point.x, data.point.y);

            if (
                data.isExactPoi &&
                data.type != null && 
                ( // 如果是系统定位,且没有指定参数，则不加气泡
                    data.isInitGeo === false ||
                    pageState.showmygeo == 1 ||
                    (module == 'index' && action == 'index' && isLanding)
                ) && !locator.isUserInput()
            ) {

                _this.addGLCenter(center);
                
            } else if( //用户输入的位置, 不添加指南针
                data.type == null && 
                _this.geolocationMarker != undefined && 
                locator.isUserInput()
            ) {
                _this._map.removeOverlay(_this.geolocationMarker);
                _this.geolocationMarker = undefined;
            }
            var radius = data.addr.﻿accuracy;
            if (radius !== null) {
                _this.addGLCircle(center, radius);
            }

            // 如果是系统定位，则不进行挪图
            // 如果是首页index/index模块并且是落地页，挪图。 by likun

            if(
                data.isInitGeo === false || 
                pageState.showmygeo == 1 || 
                (module == 'index' && action == 'index' && isLanding)
            ){
                // 根据定位点设置地图位置
                _this._map.centerAndZoom(center, locator.getLevel());
            }

            //ipad首页就有图区，所以首页定位成功后要挪图要加定位点
            if(util.isIPad()) {
                if(
                    data.isExactPoi && 
                    data.type != null &&
                    module == "index" && 
                    action == "index"
                ) {
                    _this.addGLCenter(center);
                } else {
                    _this.iwController.get().hide();
                }
                if(module == "index" && action == "index") {
                    _this._map.centerAndZoom(center, locator.getLevel());
                }
            }
            
        }, this);

        // 监听底图load事件延迟添加控件
        map.addEventListener("ontilesloaded", function () {
            _this._addLazyControl();
            map.removeEventListener("ontilesloaded", arguments.callee);
        });
        map.addEventListener('onvectorloaded', function () {
            _this._addLazyControl();
            map.removeEventListener("onvectorloaded", arguments.callee);
        });

        // 3秒未出图则强制加载控件
        _this.addControlTimer = window.setTimeout(function () {
            _this._addLazyControl();
        }, 3000);

        // 监听页面切换完成 目前只能通过pagename判断是否需要隐藏地图
        listener.on('common.page', 'pageloaded', function () {
            if(!/map/.test(window._APP_HASH.page)) {
                _this.hide();
            }
        });
    },
    /**
     * 绑定地图点击事件
     * 事件派发顺序: 
     * iw.touchstart -> map.click -> iw.click -> hotstop.click -> vector.click
     */
    _bindMapClick: function () {
        var _this = this,
            map = this._map;

        listener.on('infowindow.' + mapConst.IW_VCT, 'click', function (name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;
            switch(id) {
                case 'iw-l':
                    instance.nbSearch(data.name, data.geo);
                    break;
                case 'iw-c':
                    instance.detailSearch(data.uid);
                    break;
                case 'iw-r':
                    instance.lineSearch(data.name, data.geo);
                    break;
                default:
                    break;
            }
        });

        // 矢量底图可点
        map.addEventListener("onvectorclick", function(e) {
            if (e.form == "madian") {
                //麻点和底图派发的是同一事件 此处阻止继续进行事件调度 by zhijia
                return;
            };
            var iwOverlay = _this.iwController.get();

            // 这里有两个地方会跳过，shengxuanwei@baidu.com
            // 1. 麻点可点的情况下，不出底图可点
            // 2. 弹框下面的底图可点
            if (iwOverlay && iwOverlay.skipClickHandler) return;
            if (e.from == "base") {
                var iconInfo = e.iconInfo;
                if (iconInfo.uid && iconInfo.name && iconInfo.point) {
                    // 矢量地图可点统计
                    stat.addStat(COM_STAT_CODE.MAP_VECTOR_MARKER_CLICK);

                    var pt = map.pixelToPoint(iconInfo.point);
                    iwOverlay = _this.iwController.get(mapConst.IW_VCT);
                    iwOverlay.setData(mapConst.IW_VCT, {
                        json: [{
                            uid: iconInfo.uid,
                            name: iconInfo.name,
                            geo: "1|" + pt.lng + ',' + pt.lat
                        }]
                    }).switchTo(0);
                }
            };
        });
        map.addEventListener("click", function (e) {
            var iwOverlay = _this.iwController.get();
            if (!iwOverlay) return;
            // 最新注释如下，shengxuanwei@baidu.com，2013-11-07
            // iwOverlay.handled表示此事件交由iwOverlay内部处理，保证每次map.click都代理判断，重置skipClickHandler，此参数由iw.touchstart发起，由map.click结束；
            // iwOverlay.skipEvent表示除了iw.click事件之后的地图要素在各自click事件内部不处理；
            if (iwOverlay.handled) {
                iwOverlay.handled = false;
                iwOverlay.skipClickHandler = true;
            } else {
                iwOverlay.skipClickHandler = false;
                iwOverlay.hide();
            }

        });
        map.addEventListener('touchstart', function (e) {
            // 这里去除了iPad判断
            _this.menuControl && _this.menuControl.hideMenuDrop();
            _this.geoControl && _this.geoControl.hideInfoBar();
        });
    },

    /**
     * 添加地图控件
     */
    _addSyncControl: function () {
        var BMap = this._BMap,
            map = this._map;
        // 根据当前位置信息添加定位点,这两个点重合且非用户输入的位置才添加蓝点
        if (this.isMyCenter()) {
            var nowCenter = locator.getCenterPoi(),
                centerPoint = new BMap.Point(nowCenter.x, nowCenter.y),
                radius = locator.getAccuracy();
            this.addGLOverlay(centerPoint, radius);
        }

        // 路线规划上一步、下一步控件 需要同步添加
        this.lineStepControl = new this.LineStepControl();
        map.addControl(this.lineStepControl);
        this.lineStepControl.hide();

        // 添加信息窗口管理控件 需要同步添加
        this.iwController = iwController.init(map);
        map.addOverlay(this.iwController.get());
    },
    /**
     * 添加延迟地图控件
     */
    _addLazyControl: function () {
        if(this._isAddControl) {
            return;
        }
        this._isAddControl = true;
        var map = this._map;
        // 添加交通流量控件
        map.addControl(this.trafficControl);
        // 添加缩放控件
        map.addControl(this.zoomControl);
        // 添加菜单控件
        !util.isIPad() && map.addControl(this.menuControl);
        // 添加定位控件
        map.addControl(this.geoControl);
        // 添加比例尺控件
        map.addControl(this.scaleControl);
        listener.trigger('common.map', 'addlazycontrol');
    },
    /**
     * 初始化地图控件
     */
    _initControl: function () {
        var _this = this,
            map = this._map,
            BMap = this._BMap;

        // 初始化路况控件
        this.trafficControl = new this.TrafficControl();
        this.trafficControl.addEventListener('click', function (e) {
            // 交通路况marker点击量
            stat.addStat(COM_STAT_CODE.MAP_TRAFFIC_MARKER_CLICK);

            var iwOverlay = _this.iwController.get(mapConst.IW_TFC);
            iwOverlay.setData(mapConst.IW_TFC, {
                json: [e.data]
            }).switchTo(0);

            // todo 隐藏单点和泛需求蓝色气泡
            _this._singleMarker && _this._singleMarker.hide();
            _this.grMarker && _this.grMarker.hide();
        });
        
        this.trafficControl.addEventListener('removelayer', function (e) {
            _this.iwController.get(mapConst.IW_TFC).hide();
        });

        // 初始化缩放控件
        this.zoomControl = new this.ZoomControl();

        // 初始化菜单控件
        if(!util.isIPad()){
            this.menuControl = new this.MenuControl();
        }
        
        // 初始化定位控件
        this.geoControl = new this.GeoControl();

        // 初始化比例尺控件
        var scaleAnchor = BMAP_ANCHOR_BOTTOM_LEFT;
        var scaleOffset = new BMap.Size(52, 22);
        if (util.isIPad()) {
            scaleAnchor = BMAP_ANCHOR_BOTTOM_RIGHT;
            scaleOffset = new BMap.Size(16, 16);
        }
        this.scaleControl = new BMap.ScaleControl({
            anchor: scaleAnchor,
            offset: scaleOffset
        });

        // 添加同步控件
        this._addSyncControl();
    },
    /**
     * 获取异步组件
     * @param {function} cbk 回调函数
     */
    _getAsyncWidget : function (cbk) {
        require.async(['common:widget/api/api.js', 'common:widget/api/ext/circleoverlay.js', 'common:widget/api/ext/custommarker.js', 'common:widget/api/ext/geocontrol.js', 'common:widget/api/ext/linestepcontrol.js', 'common:widget/api/ext/menucontrol.js', 'common:widget/api/ext/zoomcontrol.js', 'common:widget/api/ext/trafficcontrol.js', 'common:widget/api/ext/userheading.js', 'common:widget/api/ext/poiinfowindow.js', 'common:widget/api/ext/trsinfowindow.js', 'common:widget/api/ext/tfcinfowindow.js'], cbk);
    },
    /**
     * 判断当前位置和定位点是否重合
     */
    isMyCenter : function () {
        var nowCenter = locator.getCenterPoi(),
            locCenter = locator.getMyCenterPoi();
        if (
            locator.hasExactPoi() && !locator.isUserInput() &&
            locCenter &&
            locCenter.x == nowCenter.x && 
            locCenter.y == nowCenter.y
        ){
            return true;
        } else {
            return false;
        }
    },
    /**
     * 自定义覆盖物Marker类
     * @return CustomMarker
     */
    getCustomMarker: function () {
        return this.CustomMarker;
    },
    /**
     * 获取地图API类
     * @return BMap
     */
    getBMap: function(){
        return this._BMap;
    },
    /**
     * 获取地图实例
     * @return Map
     */
    getMap: function(){
        return this._map || {};
    },
    /**
     * 获取InfoWindow实例
     * @param {Number} type mapConst.IW_*** 可选，不传则获取当前
     * @return {InfoWindow} 信息窗口实例
     */
    getInfoWindow: function(type){
        return this.iwController.get(type);
    },
    /**
     * 获取路线规划控件
     * @return {LineStepControl}
     */
    getLineStepControl: function(){
        return this.lineStepControl;
    },
    /**
     * 打开定位点的气泡
     */
    openGeoIw: function () {
        var pt = locator.getMyCenterPoi();
        var iwOverlay = this.iwController.get(mapConst.IW_CNT);
        iwOverlay.setData(mapConst.IW_CNT, {
            json: [{
                name: mapConst.MY_GEO,
                html: "<b>{0}</b><p>{1}</p>".format(mapConst.MY_GEO, locator.getAddress()),
                geo: "1|" + pt.x + ',' + pt.y
            }]
        }).switchTo(0);
    },
    /**
     * 定位点气泡点击事件
     */
    _bindGeoIWEvent: function () {
        listener.on('infowindow.' + mapConst.IW_CNT, 'click', function (name, evt) {
            var id = evt.id,
                data = evt.data,
                instance = evt.instance;
            switch(id) {
                case 'iw-l':
                    instance.nbSearch(data.name, data.geo);
                    break;
                case 'iw-c':
                    url.update({
                        module: 'index',
                        action: 'mylocation'
                    }, {
                        trigger: true,
                        queryReplace: true,
                        pageStateReplace: true
                    });
                    break;
                case 'iw-r':
                    instance.lineSearch(data.name, data.geo);
                    break;
                default:
                    break;
            }
        });
    },
    /**
     * 修订定位点的位置
     */
    _fixCenterPos: function () {
        var _this = this;
        setTimeout(function () {
            _this.geolocationMarker && _this.geolocationMarker.draw();
        }, 100);
    },
    /**
     * 添加定位结果的标注
     * @param {Point} 坐标
     * @return {Marker} 标注示例
     */
    addGLCenter: function(point) {
        var _this = this,
            map = this._map,
            BMap = this._BMap;

        // 定位结果标注只允许添加一个
        if (!this.geolocationMarker) {
            var icon = new BMap.Icon(this.DEST_MKR_PATH, new BMap.Size(14, 14), {
                anchor: new BMap.Size(7, 7),
                imageOffset: new BMap.Size(80, 0)
            });
            var mkr = new this.CustomMarker(icon, point, {
                className: 'dest_mkr',
                click: function () {
                    // 定位marker点击量
                    stat.addStat(COM_STAT_CODE.MAP_GEOLOCATION_MARKER_CLICK);
                    _this.openGeoIw();
                }
            });
            mkr.enableMassClear = false; // 保证不被clearOverlays清除
            map.addOverlay(mkr);
            this.geolocationMarker = mkr;
            this.addUserHeading(mkr);
            this._bindGeoIWEvent();
            this._fixCenterPos();
        } else {
            this.geolocationMarker.setPoint(point);
        }

        listener.trigger('common.map', 'addcenter');

        return this.geolocationMarker;
    },

    /**
     * 添加定位点支持显示用户方位
     * @param {CustomMarker} mkr 定位点marker
     */
    addUserHeading: function (mkr) {
        if(!mkr) {
            return;
        }
        // 用户输入的位置, 则不显示指南针
        if (this.UserHeading.isSupport() && !locator.isUserInput()) {
            mkr.setIcon(new BMap.Icon(this.NAVI_MKR_PATH, new BMap.Size(38, 40), {
                anchor: new BMap.Size(19, 20)
            }));
            mkr.setClassName('navi_mkr');
            this.UserHeading.start(mkr.getContainer());
        }
    },
    /**
     * 添加定位结果的误差范围圆圈 只会添加一次 内部保证！
     * @param {Point} 圆圈的中心点
     * @param {number} 误差半径，单位米
     * @return {Circle} 圆圈实例
     */
    addGLCircle: function(point, accuracy) {
        // 定位误差半径只允许有一个
        if (!this.geolocationCircle) {
            var circle = new this.CircleOverlay(point, accuracy);
            this._map.addOverlay(circle);
            this.geolocationCircle = circle;
        } else {
            this.geolocationCircle.setInfo(point, accuracy);
        }
        return this.geolocationCircle;
    },

    /**
     * 添加定位相关的覆盖物
     * @param {Point} 圆圈的中心点
     * @param {number} 误差半径，单位米
     */
    addGLOverlay: function (point, radius) {
        var circle,
            center = this.addGLCenter(point);
        if (radius !== null) {
            this.addGLCircle(point, radius);
        }
        return {
            center : center,
            circle : circle
        }
    },

    /**
     * 移除当前地图上所有由于与检索结果相关的覆盖物
     * 即不会移除定位标注和定位误差圆圈
     */
    clearOverlays: function() {
        // 清除麻点栅格
        if (this.grControl) {
            this.grControl.clearCache();
        }
        // 隐藏infoWindow
        var iwOverlay = this.iwController.get();
        if (iwOverlay) {
            iwOverlay.hide();
        }
        // 隐藏路线上下一步控件
        if(this.lineStepControl){
            this.lineStepControl.hide();
        }
        this._map.clearOverlays();
    },
    /**
     * 移除掉某个数组中的覆盖物
     * @param {Array<Overlay>}
     */
    removeOverlayInArray: function(overlayArr){
        for (var i = 0; i < overlayArr.length; i ++) {
            this._map.removeOverlay(overlayArr[i]);
        }
        overlayArr = [];
    },
    /**
     * 为搜索结果、公交、驾车导航结果在地图上添加路线
     * @param {string} 地理坐标
     * @param {type}   类型常量
     */
    addRoute: function(points, type) {

        var config = mapConst.ROUTE_DICT;

        if (typeof type == "undefined") {
            type = 0;
        }
        if (!config[type]) {
            return;
        }
        var conf = config[type];
        var plen = points.length;
        var opts = {
            strokeWeight: conf.stroke,
            strokeColor: conf.color,
            strokeOpacity: conf.opacity,
            strokeStyle: conf.strokeStyle
        }
        var pline = new this._BMap.Polyline(points, opts);
        this._map.addOverlay(pline);
        pline._routeType = type;

        //装饰线
        if (type == mapConst.ROUTE_TYPE_BUS) {
            var pline2 = new this._BMap.Polyline(points, {
                strokeWeight: conf.stroke - 2,
                strokeColor: "#fff",
                strokeOpacity: 0.3
            });
            pline._p = pline2;
            this._map.addOverlay(pline2);
        }
        return pline;
    },
    /**
     * 添加驾车路线
     * @param {Object} obj NavTrans
     */
    addDriveRoute: function(points) {
        var route = this.addRoute(points, mapConst.ROUTE_TYPE_DRIVE);
        this.driveRoutes.push(route);
        return route;
    },
    /**
     * 移除驾车路线
     */
    removeDriveRoute: function(){
        this.removeOverlayInArray(this.driveRoutes);
    },
    /**
     * 移除当前线路
     * @param {PolyLine} p 
     */
    removeRoute: function(p) {
        if (p && p._p instanceof this._BMap.Polyline) {
            this._map.removeOverlay(p._p);
            p._p = null;
        }
        this._map.removeOverlay(p);
        p = null;
    },
    /**
     * 选择当前线路
     * @param {PolyLine} p 
     */
    selectRoute: function(p) {
        if (!(p instanceof this._BMap.Polyline)) {
            return;
        }
        var colors = ["#ff0103", "#ff0103", "#ff0103", "#ff0103", "#ff0103", "#ff0103", "#ff0103"];
        if (colors[p._routeType]) {
            p.setStrokeColor(colors[p._routeType]);
            p.draw(); // api的bug需要重绘一下，api修复后可去掉
        }
    },
    /**
     * 取消选择当前线路
     * @param {PolyLine} p 
     */
    unselectRoute: function(p) {
        if (!(p instanceof this._BMap.Polyline)) {
            return;
        }
        var colors = ["#3a6bdb", "#3a6bdb", "#30a208", "#3a6bdb","#3a6bdb","#30a208","#575757"];
        if (colors[p._routeType]) {
            p.setStrokeColor(colors[p._routeType]);
            p.draw();// api的bug需要重绘一下，api修复后可去掉
        }
    },
    /**
     * 添加驾车途径关键点标注
     */
    addKeyPoiMarker: function(point, text, type){
        var pt = util.getPoiPoint(point);
        if (!pt){
            return;
        }

        var offsetY = type ? 0 : 22;
        var ico = new this._BMap.Icon(this.DRV_KEY_POI_PATH, new this._BMap.Size(24, 22),{
            anchor: new this._BMap.Size(12, 22),
            imageOffset: new this._BMap.Size(0, offsetY)
        });
        var mkr = new this.CustomMarker(ico, pt);
        var label = document.createElement('div');
        label.className = 'nplb';
        label.style.width = text.length + 'em';
        label.innerHTML = text;
        this._map.addOverlay(mkr);
        mkr._div.appendChild(label);
        return mkr;
    },
    /**
     * 为导航添加方向标注
     * @param Point 坐标点
     * @param Number 方向参数 0表示正北
     */
    addDirectionMarker: function(point, dir) {
        var pt = util.getPoiPoint(point);
        if (!pt) {
            return;
        }
        if (dir < 0 || dir > 12) {
            dir = 0;
        }
        var offsetX = dir * 18;
        var icon = new this._BMap.Icon(this.DRV_DIRECTION_PATH, this.DEST_DRIVER_DIR_SIZE, {
            anchor: new this._BMap.Size(9, 9),
            imageOffset: new this._BMap.Size(offsetX, 0)
        });
        var mkr = new this.CustomMarker(icon, pt, {
            className: "drv_dest"
        });
        this._map.addOverlay(mkr);
        return mkr;
    },
    /**
     * 添加起始和终点标注 公交\驾车\步行
     * @param {String} point 地理坐标点
     * @param {Number} index 标注索引
     */
    addDestPoi: function(point, index) {
        point = util.getPoiPoint(point);
        if (point) {
            var icon = new this._BMap.Icon(this.DEST_MKR_PATH, this.DEST_MARKER_SIZE, {
                anchor: this.DEST_MARKER_ANCHOR,
                imageOffset: new this._BMap.Size(29 * index, 0)
            });
            var mkr = new this.CustomMarker(icon, point, {
                className: "dest_mkr"
            });
            this._map.addOverlay(mkr);
            mkr.setZIndex(400);
            this.destPois.push(mkr);
            return mkr;
        }
    },
    /**
     * 移除起始和终点标注 跨模块
     */
    removeDestPoi: function(){
        this.removeOverlayInArray(this.destPois);
    }
};

});
;/**
 * @file 工具方法们
 */
define('common:static/js/util.js', function(require, exports, module) {
    'use strict';
    /**
     * @external Date
     */
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * @param {date} fmt 要格式化的日期对象
     * @memberof Date.prototype
     * @returns {string}
     * @example
     * (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
     * (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.format = function(fmt) {
        var o = {
            'M+': this.getMonth() + 1, //月份
            'd+': this.getDate(), //日
            'h+': this.getHours(), //小时
            'm+': this.getMinutes(), //分
            's+': this.getSeconds(), //秒
            'q+': Math.floor((this.getMonth() + 3) / 3), //季度
            'S': this.getMilliseconds() //毫秒
        }, k;
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            }
        }
        return fmt;
    };

    String.prototype.format = function() {
        var argus = [];
        argus = Array.apply(argus, arguments);
        var reStr = this.replace(/\{([0-9]+)\}/g, function($0, num) {
            var str = argus[parseInt(num, 10)];
            return typeof(str) === 'undefined' ? '' : str;
        });
        return reStr;
    };

    /**
     * @lends common:static/js/util
     */
    var util = {

        /**
         * html字符编码，防止html代码注入
         * @param {string} 原始内容
         * @returns {string} 返回编码之后的内容
         */
        encodeHTML: function(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        /**
         * 将url参数部分解析成key/value形式
         * @param {string} url，格式key=value&key=value
         * @returns {Object} json对象{key:value,key:value}
         */
        urlToJSON: function(url) {
            if (!url) {
                return {};
            }
            var result = {}, pairs = url.split('&'),
                i, keyValue, len;
            for (i = 0, len = pairs.length; i < len; i++) {
                keyValue = pairs[i].split('=');
                result[keyValue[0]] = decodeURIComponent(keyValue[1]);
            }
            return result;
        },
        /**
         * json转换为url
         * @param {Object} json数据
         * @returns {string} url
         */
        jsonToUrl: function(json) {
            if (!json) {
                return '';
            }
            var arr = [],
                key;
            for (key in json) {
                if (json.hasOwnProperty(key)) {
                    arr.push(key + '=' + encodeURIComponent(json[key]));
                }
            }
            return arr.join('&');
        },
        /**
         * 判断是否为android系统
         * @returns {boolean}
         */
        isAndroid: function() {
            return (/android/i).test(navigator.userAgent);
        },

        /**
         * 判断是否为IOS平台
         * @returns {boolean}
         */
        isIOS: function() {
            return (/iphone|ipad|ipod/i).test(navigator.userAgent);
        },
        /**
         * 判断是否为iphone
         * @returns {boolean}
         */
        isIPhone: function() {
            return (/iphone/i).test(navigator.userAgent);
        },
        /**
         * 判断是否为ipad
         * @returns {boolean}
         */
        isIPad: function() {
            return (/ipad/i).test(navigator.userAgent);
        },
        /**
         * 判断是否为ipod
         * @returns {boolean}
         */
        isIPod: function() {
            return (/ipod/i).test(navigator.userAgent);
        },
        /**
         * 判断IOS版本(暂时只是区别是否是ios7)
         * @returns {boolean}
         */
        getIosVersion: function() {
            return (/OS 7_\d[_\d]* like Mac OS X/i).test(navigator.userAgent);
        },
        /**
         * 处理geo返回的点
         * @param {Object} geo
         */
        geoToPoint: function(geo) {
            if (typeof geo !== 'string') {
                return;
            }
            var a = geo.split('|'),
                p, point;

            if (parseInt(a[0], 10) === 1) {
                p = a[1].split(',');
                point = {
                    lng: parseFloat(p[0]),
                    lat: parseFloat(p[1])
                };
                return point;
            }
        },

        /**
         * 将json对象格式化为请求串
         * @param {Object} Json对象
         * @param {Function} 编码函数
         */
        jsonToQuery: function(json, encode) {
            var s = [],
                n, value;

            encode = encode || function(v) {
                return v;
            };
            for (n in json) {
                if (json.hasOwnProperty(n)) {
                    value = json[n];
                    if (value) {
                        s.push(n + '=' + encode(value));
                    }
                }
            }
            return s.join('&');
        },
        /**
         * 当前城市是否支持路况
         */
        need2ShowTraffic: function(citycode) {
            var locator = require('common:widget/geolocation/location.js');
            var url     = require('common:widget/url/url.js');
            var query   = url.get().query;

            var code = code || query && query.code || locator.getCityCode();
            var aid = [131, 289, 257, 340, 348, 75, 167, 92, 178, 53, 132, 315, 163, 218, 180, 150, 300, 333, 58, 317, 244, 179, 332, 158, 194, 134, 119, 138, 140, 187, 236, 261, 104, 224, 233, 288];
            for (var i = 0; i < aid.length; i++) {
                if (code == aid[i]) {
                    return true;
                }
            }
            return false;
        },
        /**
         * 是否支持路况显示，判断城市和设备是否支持
         * @param {number} 城市代码或拼音名称
         * @return {string|boolean} 对应城市的名称字符串
         */
        ifSupportSubway: function(codeOrName) {
            var supportCity = {
                "131": "beijing,北京,131",
                "289": "shanghai,上海,289",
                "257": "guangzhou,广州,257",
                "340": "shenzhen,深圳,340",
                "2912": "hongkong,香港,2912",
                "75": "chengdu,成都,75",
                "53": "changchun,长春,53",
                "132": "chongqing,重庆,132",
                "167": "dalian,大连,167",
                "138": "foshan,佛山,138",
                "179": "hangzhou,杭州,179",
                "104": "kunming,昆明,104",
                "315": "nanjing,南京,315",
                "58": "shenyang,沈阳,58",
                "224": "suzhou,苏州,224",
                "332": "tianjin,天津,332",
                "218": "wuhan,武汉,218",
                "233": "xian,西安,233",
                "48": "haerbin,哈尔滨,48",

                "beijing": "beijing,北京,131",
                "shanghai": "shanghai,上海,289",
                "guangzhou": "guangzhou,广州,257",
                "shenzhen": "shenzhen,深圳,340",
                "hongkong": "hongkong,香港,2912",
                "chengdu": "chengdu,成都,75",
                "changchun": "changchun,长春,53",
                "chongqing": "chongqing,重庆,132",
                "dalian": "dalian,大连,167",
                "foshan": "foshan,佛山,138",
                "hangzhou": "hangzhou,杭州,179",
                "kunming": "kunming,昆明,104",
                "nanjing": "nanjing,南京,315",
                "shenyang": "shenyang,沈阳,58",
                "suzhou": "suzhou,苏州,224",
                "tianjin": "tianjin,天津,332",
                "wuhan": "wuhan,武汉,218",
                "xian": "xian,西安,233",
                "haerbin": "haerbin,哈尔滨,48"
            };

            var ua = navigator.userAgent;
            var unAndroid = /android((\s)*|\/)(1\.\d|2\.[12])/i;
            var unbrowser = /FlyFlow/i;
            var isbrowserSupport = !(unAndroid.test(ua) || unbrowser.test(ua));

            if (!isbrowserSupport) {
                return false;
            }

            return supportCity[codeOrName];
        },
        /**
         * 展示loading
         * @param {string} 展示loading对应的容器
         */
        showLoading: function(wrapper) {
            var me = this;
            me.$pageLoading = util.LoadingBox;
            //me.loadingNode =
            me.$pageLoading.show(wrapper);
            var postype = wrapper.css('position');
            if (postype == "static") {
                wrapper.css('position', 'relative');
            }
        },
        /**
         * 关闭loading
         * @param {timeoutc} 规定时间关闭菊花
         */
        hideLoading: function(wrapper, timeoutc) {
            var me = this,
                c = function() {
                    if ( !! wrapper) {
                        if (wrapper.children('.page-loading').length > 0) {
                            wrapper.children('.page-loading').remove();
                        }
                    } else {
                        $('.page-loading').remove();
                    }
                },
                tc = parseInt(timeoutc, 10);
            if (tc && (tc > -1)) {
                setTimeout(function() {
                    c();
                }, tc);
            } else {
                c();
            }
        },
        /*
         **创建元素添加到dom结构中
         */
        create: function(tag, attr) {
            var e = document.createElement(tag);
            attr = attr || {};
            // 设置属性
            for (var name in attr) {
                //name = {'for': 'htmlFor', 'class': 'className'}[name] || name;
                if (name === "style") {
                    e.style.cssText = attr[name];
                    continue;
                }
                if (attr[name]) {
                    if (e.setAttribute) {
                        e.setAttribute(name, attr[name]);
                    } else {
                        try {
                            e[name] = attr[name];
                        } catch (e) {}
                    }
                }
            }
            return e;
        },

        nativeInfo: {},

        /**
         * 获取本地信息
         * @param {string} packageName 包名称
         * @param {function} successCallback
         * @param {function} errorCallback
         */
        getNativeInfo: function(packageName, successCallback, errorCallback) {
            var url = "http://127.0.0.1:6259/getpackageinfo?packagename=" + packageName;
            var me = this;
            if (typeof me.nativeInfo[packageName] === 'object') {
                successCallback && successCallback(me.nativeInfo[packageName]);
            } else if (typeof me.nativeInfo[packageName] === 'number' && me.nativeInfo[packageName] >= 2) {
                errorCallback && errorCallback();
            } else {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    success: function(data) {
                        // 缓存上次结果
                        me.nativeInfo[packageName] = data;
                        successCallback && successCallback(data);
                    },
                    error: function() {
                        me.nativeInfo[packageName] = me.nativeInfo[packageName] || 0;
                        // 记录错误次数
                        me.nativeInfo[packageName]++;
                        errorCallback && errorCallback();
                    }
                });
            }
        },

        /**
         * 判断客户是否安装客户端
         */
        isInstalledClient: function(sucfn, errfn, uid) {
            var me = this;
            me.getNativeInfo("com.baidu.BaiduMap", function(data) {
                var dataerr = (data.error == 0);
                if (dataerr) {
                    $.isFunction(sucfn) && sucfn(me.getClientUrl('open', uid));
                } else {
                    $.isFunction(errfn) && errfn(me.getClientUrl('download', uid));
                }
            }, function() {
                $.isFunction(errfn) && errfn(me.getClientUrl('download', uid));
            });
        },

        /**
         * 取得打开客户端还是下载客户端的url
         */
        getClientUrl: function(utype, uid) {
            var me = this,
                url = "";
            me.os = me.isAndroid() ? "android" : me.isIPhone() ? "iphone" : me.isIPad() ? "ipad" : "unknown";
            if (utype === "download") {
                 url = "http://mo.baidu.com/map/code/?from=gw10015";
            } else if (utype = "open") {
                switch (me.os) {
                    case 'android':
                        if (uid) {
                            url = "bdapp://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
                        } else {
                            url = "bdapp://map/";
                        }
                        break;
                    case 'iphone':
                        if (uid) {
                            url = "baidumap://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
                        } else {
                            url = "baidumap://map/";
                        }
                        break;
                    case 'ipad':
                        if (uid) {
                            url = "baidumap://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
                        } else {
                            url = "baidumap://map/";
                        }
                        break;
                    case 'unknown':
                        if (uid) {
                            url = "bdapp://map/place/detail?uid=" + uid + "&src=baidu|lbswebapp";
                        } else {
                            url = "bdapp://map/";
                        }
                    default:
                        url = "http://mo.baidu.com/map";
                        break;
                }
            }
            return url;
        },
        /**
         * 设置a标签的href和data-log
         * @param {[type]} ele  元素
         * @param {[type]} href 设置的href
         * @param {[type]} code 要设置的统计code
         */
        setHrefStat: function(elem, href, code) {
            if (!elem || !href) {
                return;
            }
            if (code) {
                elem.attr('href', href).attr('data-log', "{code:" + code + "}");
            } else {
                elem.attr('href', href);
            }
            return elem;
        },
        /**
         * 用于对a标签的打开下载客户端统计绑定
         * @param  {[type]}   elem     a标签元素
         * @param  {Function} callback 回调函数，一般为发送统计的函数
         * @return {[type]}            [description]
         */
        bindHrefStat: function(elem, callback) {
            var me = this;
            var ck = function(e) {
                e.stopPropagation();
                e.preventDefault();
                callback && callback();
                setTimeout(function(){
                  if(window.navigator.standalone){
                    window.open(elem.attr('data'));            
                  }else{
                    if(elem.attr('data')){
                      window.location.href = elem.attr('data');
                    }
                  }
                }, 200);

            }
            elem.bind('click', ck);
        }
    };
    /**
     * 拨打电话TelBox
     */
    util.TelBox = {

        bindEvent: function() {

            $('#telBox').on('click .ok-telbox', function() {
                $('#telBox').off();
                $('#telBox').remove();
            });

            $('#telBox').on('click .cancel-telbox', function() {
                $('#telBox').off();
                $('#telBox').remove();
            });
        },

        // 显示box
        showTb: function(number) {
            if (!number) return;
            if ($("#telBox")[0]) {
                $('#telBox').remove();
            }

            var htm = [];
            htm.push('<div id="telBox" class="telbox">');
            htm.push('<div class="t"></div>');
            htm.push('<div  class="c">');
            htm.push('<div class="t1">拨打电话</div><div>');
            htm.push('<button class="bt qx cancel-telbox" >取消</button>');
            htm.push('<a href="wtai://wp/mc;' + $.trim(number) + '"><button class="bt qd ok-telbox" >确定</button></a>');
            htm.push('</div></div></div>');

            $('body').append(htm.join(''));

            this.bindEvent();
        }

    };
      util.DownBox = {

    bindEvent: function() {
      var $ok = $('#downBox button').eq(1),
        $cancel = $('#downBox button').eq(0);

      $ok.on('click', function() {
    require('common:widget/stat/stat.js').addCookieStat(COM_STAT_CODE.TOP_BANNER_APP_ERROR_DOWN);
        $('#downBox').remove();
      });

      $cancel.on('click', function() {
    require('common:widget/stat/stat.js').addCookieStat(COM_STAT_CODE.TOP_BANNER_APP_ERROR_CANCEL);
        $('#downBox').remove();
      });
    },

    // 显示box
    showTb: function() {
      if ($("#downBox")[0]) {
        $('#downBox').remove();
      }

      var htm = [];
      htm.push('<div id="downBox" class="downbox">');
      htm.push('<div class="t"></div>');
      htm.push('<div  class="c">');
      htm.push('<div class="t1">您还未安装百度地图客户端，立即前往下载</div><div>');
      htm.push('<button class="bt qx cancel-downbox" >继续使用网页版</button>');
      htm.push('<a href="http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8"><button class="bt qd cancel-downbox" >去下载</button></a>');
      htm.push('</div></div></div>');

      $('body').append(htm.join(''));

      this.bindEvent();

    }

  };
    util.LoadingBox = {
        show: function(wrapper) {
            //如果当前节点下已经存在loading结点，则返回当前loading结点
            if (wrapper.children('.page-loading').length > 0) {
                return wrapper.children('.page-loading');
            }
            var node = util.create('div', {
                'class': 'mappic-loading page-loading slide in',
                'id': 'loadingbox'
            });
            var inner = '<div>\
                           <span class="dot-1"></span>\
                           <span class="dot-2"></span>\
                           <span class="dot-3"></span>\
                           <span class="dot-4"></span>\
                           <span class="dot-5"></span>\
                           <span class="dot-6"></span>\
                           <span class="dot-7"></span>\
                           <span class="dot-8"></span>\
                      </div>';

            $(node).html(inner);
            wrapper && wrapper.append($(node));
            $(node).show();
            return $(node);
        }
    };




    // 扩展与gis相关的通用方法 暂时还放在util里面 by jican
    var _EXT_CHARS_ = ["=", ".", "-", "*"];
    var _MAX_DELTA_ = 0x01 << 23;
    $.extend(util, {

        /**
         * decode geo by difference
         * @type String
         */
        decode_geo_diff: function(coded) {
            var geo_type = this._decode_type(coded.charAt(0));
            var code = coded.substr(1);
            var pos = 0;
            var code_len = code.length;
            var part_vec = [];
            var geo_vec = [];
            var ret = [];
            while (pos < code_len) {
                if (code.charAt(pos) === _EXT_CHARS_[0]) {
                    if ((code_len - pos) < 13) {
                        return 0; // invalid coordinates
                    }
                    ret = this._decode_6byte_(code.substr(pos, 13), part_vec);
                    if (ret < 0) {
                        return 0;
                    }
                    pos += 13;
                } else if (code.charAt(pos) === ';') {
                    geo_vec.push(part_vec.slice(0));
                    part_vec.length = 0;
                    ++pos;
                } else {
                    if ((code_len - pos) < 8) {
                        return 0;
                    }
                    ret = this._decode_4byte_(code.substr(pos, 8), part_vec);
                    if (ret < 0) {
                        return 0;
                    }
                    pos += 8;
                }
            }
            for (var i = 0, l = geo_vec.length; i < l; i++) {
                for (var j = 0, ll = geo_vec[i].length; j < ll; j++) {
                    geo_vec[i][j] /= 100;
                }
            }
            return {
                "geoType": geo_type,
                "geo": geo_vec
            };
        },

        /**
         * get type of geo
         * @type String
         */
        _decode_type: function(c) {
            var r = -1;
            if (c === _EXT_CHARS_[1]) {
                r = 2; //mapConst.GEO_TYPE_POINT;
            } else if (c === _EXT_CHARS_[2]) {
                r = 1; //mapConst.GEO_TYPE_LINE;
            } else if (c === _EXT_CHARS_[3]) {
                r = 0; //mapConst.GEO_TYPE_AREA;
            }
            return r;
        },


        _decode_6byte_: function(code, ret) {
            var x = 0;
            var y = 0;
            var buff = 0;
            for (var i = 0; i < 6; i++) {
                buff = this._char2num_(code.substr(1 + i, 1));
                if (buff < 0) {
                    return -1 - i;
                }
                x += buff << (6 * i);
                buff = this._char2num_(code.substr(7 + i, 1));
                if (buff < 0) {
                    return -7 - i;
                }
                y += buff << (6 * i);
            }
            ret.push(x);
            ret.push(y);
            return 0;
        },

        _decode_4byte_: function(code, ret) {
            var l = ret.length;
            if (l < 2) {
                return -1;
            }
            var x = 0;
            var y = 0;
            var buff = 0;
            for (var i = 0; i < 4; i++) {
                buff = this._char2num_(code.substr(i, 1));
                if (buff < 0) {
                    return -1 - i;
                }
                x += buff << (6 * i);

                buff = this._char2num_(code.substr(4 + i, 1));
                if (buff < 0) {
                    return -5 - i;
                }
                y += buff << (6 * i);
            }
            if (x > _MAX_DELTA_) {
                x = _MAX_DELTA_ - x;
            }
            if (y > _MAX_DELTA_) {
                y = _MAX_DELTA_ - y;
            }

            ret.push(ret[l - 2] + x);
            ret.push(ret[l - 1] + y);

            return 0;
        },

        _char2num_: function(c) {
            var n = c.charCodeAt(0);
            if (c >= 'A' && c <= 'Z') {
                return n - 'A'.charCodeAt(0);
            } else if (c >= 'a' && c <= 'z') {
                return (26 + n - 'a'.charCodeAt(0));
            } else if (c >= '0' && c <= '9') {
                return (52 + n - '0'.charCodeAt(0));
            } else if (c === '+') {
                return 62;
            } else if (c === '/') {
                return 63;
            }
            return -1;
        },

        /**
         * 处理点信息，此方法将非标准格式的地理点信息进行标准化
         * @param Point|String|Array 地理坐标 "lng,lat"
         * @return Point实例
         */
        getPoiPoint: function(point) {
            var pts = [];
            var pt = null;
            if (point.toString() === "Point") {
                pt = point;
            } else {
                if (typeof point === "string") {
                    pts = $.trim(point).split(",");
                    if (pts.length < 2) {
                        return;
                    }
                    pts[0] = parseFloat($.trim(pts[0]));
                    pts[1] = parseFloat($.trim(pts[1]));
                } else {
                    pts = point.slice(0);
                    if (pts.length < 2) {
                        return;
                    }
                }
                pt = new BMap.Point(pts[0], pts[1]);
            }
            return pt;
        },

        /**
         * 将geo字符串转换成点线面geo对象
         * @param {String} geo 字符串
         * @param {Object} Geo对象
         */
        parseGeo: function(geo) {
            if (typeof(geo) != "string") return;
            var info = geo.split("|");
            var type = parseInt(info[0]);
            var bound = info[1];
            var points = info[2];
            var parts = points.split(";");
            var arr = [];
            switch (type) {
                case 1:
                    arr.push(parts[0]);
                    break;
                case 2:
                case 3:
                    for (var i = 0; i < parts.length - 1; i++) {
                        var coords = parts[i];
                        if (coords.length > 100) {
                            coords = coords.replace(/([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*)(,)/g, "$1,$2;");
                            arr.push(coords);
                        } else {
                            var str = [];
                            var ps = coords.split(",");
                            for (var j = 0; j < ps.length; j += 2) {
                                var x = ps[j];
                                var y = ps[j + 1];
                                str.push(x + "," + y);
                            };
                            arr.push(str.join(";"));
                        }
                    };
                    break;
            };
            if (arr.length <= 1) arr = arr.toString();
            return {
                type: type,
                bound: bound,
                points: arr
            };
        },

        /**
         * 将返回的压缩坐标转换成明文坐标（包含抽稀）
         * @param {String} geo 字符串
         * @param {Number} factor 抽稀因子，间隔factor个坐标抽取
         */
        parse2Geo: function(geo, factor) {

            if (!factor) {
                factor = 0;
            } else if (factor < 0.25) {
                factor = 0;
            } else if (factor > 0.25 && factor < 1) {
                factor = 1;
            } else if (factor > 32) {
                factor = 32;
            }
            var _arrG = geo.split("|");
            if (_arrG.length === 1) { //点
                var _g = this.decode_geo_diff(_arrG[0]);
                return {
                    type: _g.type,
                    bound: '',
                    points: _g.geo.join(",")
                };
            } else if (_arrG.length > 1) { //线面
                var _lines = geo.split(";.=");
                var _bs = [];
                var _ps = [];
                var _tp = 0;
                var _len = _lines.length;
                for (var i = 0; i < _len; i++) {
                    var _ln = _lines[i];
                    if (_len > 1) {
                        if (i === 0) {
                            _ln = _ln + ";";
                        };
                        if (i > 0 && i < _len - 1) {
                            _ln = ".=" + _ln + ";";
                        };
                        if (i === _len - 1) {
                            _ln = ".=" + _ln;
                        };
                    };
                    var _arrL = _ln.split("|");
                    var _b0 = this.decode_geo_diff(_arrL[0]);
                    var _b1 = this.decode_geo_diff(_arrL[1]);
                    _bs.push(_b0.geo.join(","));
                    _bs.push(_b1.geo.join(","));
                    var _g = this.decode_geo_diff(_arrL[2]);
                    _tp = _g.type;
                    var _p = _g.geo.join(",");
                    _p = _p.replace(/([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*)(,)/g, "$1,$2;");
                    if (factor > 0) {
                        var _re = new RegExp("(((-?\\d+)(\\.\\d+)?),((-?\\d+)(\\.\\d+)?);)(((-?\\d+)(\\.\\d+)?),((-?\\d+)(\\.\\d+)?);){" + factor + "}", "ig");
                        _p = _p.replace(_re, "$1");
                    };
                    _ps.push(_p);
                }
                if (_len <= 1) _ps = _ps.join(";");
                return {
                    type: _tp,
                    bound: _bs.join(";"),
                    points: _ps
                };
            }
        },
        /**
         * 将坐标字符串转化为BMap.Point对象
         * @type {Object} "lng,lat"
         */
        getPointByStr: function(point) {
            var BMap = require('common:widget/map/map.js').getBMap();
            if (typeof point != "string") {
                return;
            }
            var pts = point.split(",");
            if (pts.length < 2) {
                return;
            }
            if(BMap) {
                return new BMap.Point(pts[0], pts[1]);
            } else {
                return {
                    lng: parseFloat(pts[0]),
                    lat: parseFloat(pts[1])
                };
            }  
        },
        /**
         * 获取区域坐标
         */
        getBPoints: function(bounds) {
            if (!bounds || bounds.length === 0) return;
            var points = [];
            for (var i = 0; i < bounds.length; i++) {
                if (bounds[i]) {
                    var pts = bounds[i].split(";");
                    for (var j = 0; j < pts.length; j++) {
                        var point = util.getPointByStr(pts[j]);
                        points.push(point);
                    };
                };
            };
            return points;
        }
    });

    /**
     * @module common:static/js/util
     */
    module.exports = util;
});

;define('common:widget/stat/stat.js', function(require, exports, module){

/**
 * @fileOverview 统计代码
 */

var cookie = require("common:widget/cookie/cookie.js"),
    util = require("common:static/js/util.js");

var STAT_PV = 20138;

var isFlowCtrl = function() {
    var flowCtrl = cookie.get("flow_ctrl") || false;
    if (flowCtrl === false) {
        return false;
    } else {
        return true;
    }
}();
/**
 * webapp简版点击统计增加cookie
 * @param {number} code 统计的code
 * @param {object} opts 统计的可选参数
 * @param {function} callback 回调
 */
var addCookieStat = function(code, opts, callback) {
    var options = {
        expires: 10000,
        path: '/'
    }, //设置cookie的超时时间是10秒钟
        cookie = require('common:widget/cookie/cookie.js'),
        callback = callback || function() {},
        opts = opts || {};

    opts = $.extend({
        'module': window._APP_HASH.module,
        'action': window._APP_HASH.action,
        'page': window._APP_HASH.page,
        'third_party': window._APP_HASH.third_party
    }, opts);
    if (code) {
        opts.code = code;
        opts.trackCode = code;
    }

    //设置code的cookie值
    cookie.set('H_MAP_CLK', JSON.stringify(opts), options);

    callback();
};
var _addCookieStat = function(log) {
    if (typeof log === 'object' && log.code) {
        addCookieStat(log.code, log);
        return;
    }

    if (typeof log === 'string') {
        try {
            var info = log.replace(/[{}"']/g, '').split(',');
            var result = {};
            for (var i = 0; i < info.length; i++) {
                var item = info[i].split(':');
                result[$.trim(item[0])] = $.trim(item[1]);
            }
            addCookieStat(result.code, result);
        } catch (e) {}
    } else {
        if (cookie.get('H_MAP_CLK') == null) {
            addCookieStat('', {});
        }
    }
};
/**
 * 点击统计的初始化
 * 通过监听页面中的body点击事件
 */
var initClickStat = function() {
    if (listener) {
        listener.on('common.page', 'switchstart', function(event, eventOption) {
            var log,
                target = eventOption.target;
            if (target) {
                log = $(target).data('log');
            }
            _addCookieStat(log);
        });
    }

    $(document).on('click', 'a,[data-href]', function() {
        var log = $(this).data('log');
        _addCookieStat(log);
    })
}
// 获取统计url
var getStatUrl = (function() {
    var statPath = "/mobile/img/t.gif?newmap=1";

    if (/(&|\?)(kehuduan=1|nostat=1)(&|$|#)/.test(location.href)) {
        statPath = "/mobile/img/nostat.gif?newmap=1";
    }

    return function() {
        return statPath;
    }

})();

var $img = $("#statImg");

/**
 * 发送统计方法
 * @param {Number} code 统计code
 * @param {Object} opts
 */
var addStat = function(code, opts, callback) {
    var callback = callback || function() {};

    if (!code) {
        return;
    }

    // 组装参数
    opts = opts || {};

    if (isFlowCtrl) {
        opts.flow_ctrl = true;
    }

    opts.module = _APP_HASH.module;
    opts.action = _APP_HASH.action;
    opts.page = _APP_HASH.page;
    opts.net_type = _WISE_INFO.netype;

    var extq = util.jsonToUrl(opts);

    // 内部函数定义 - 发送统计请求
    var sendStat = function(q) {
        var statPath = getStatUrl();
        if (!q) {
            return;
        }
        addStat._sending = true;
        setTimeout(function() {
            $img[0].src = statPath + q.src;
            $(document).trigger('addStat', q.code);
        }, 50);

        callback();

    }
    // 内部函数定义 - 发送队列中下一个统计请求
    var reqNext = function() {
        var nq = addStat._reqQueue.shift()
        if (nq) {
            sendStat(nq);
        }
    }
    var ts = Date.now();
    var geolocation = require("common:widget/geolocation/location.js");
    var _sendStat = {
        src: "&t=" + ts + "&code=" + code + "&c=" + geolocation.getCityCode() + "&" + extq,
        code: code
    };

    if (addStat._sending) {
        // 将本次请求加入队列
        addStat._reqQueue.push(_sendStat);

    } else {
        // 直接发送请求
        sendStat(_sendStat);
    }

    // 添加到报表里
    // addToReport(_sendStat);

    // 绑定事件
    if (!addStat._binded) {
        $("#statImg").on("load", function() {
            addStat._sending = false;
            reqNext();
        });
        $("#statImg").on("error", function() {
            addStat._sending = false;
            reqNext();
        });
        addStat._binded = true;
    }
}
// 初始化请求队列
addStat._reqQueue = [];

// 发送pv统计函数
// 使用说明：pv统计的定义和说明可以查看 http://wiki.babel.baidu.com/twiki/bin/view/Com/Main/WebappPV统计文档
// 另外请参看 controller的 pageViewStat 的用法。
// 对于页面展示类的属性统计可以通过pv统计来完成
// 如：place结果列表页的统计，可以通过 在place/list的controller中设置 pageViewStat 为一个function
// return 所需的统计参数 如 {is_place:1}, 在每次展示页面的时候 会将此统计发送，在log平台中可以通过 page_id + is_place 参数来统计
// by caodongqing 2013-2-27
var sendPvStat = function() {
    var code = STAT_PV, //pv统计code
        refPageParam = {},
        locked = false,
        lockedTime = 200,
        staticSended = false,
        user_step = [];

    /**
     * 发送pv统计
     */
    var _sendpv = function(opts) {
        if (locked) {
            return;
        }
        var param = opts || {},
            // pid这个参数是重构前用的统计，基于配置的hash表来读取page的唯一标识
            // 为了保证原有统计正常运行保留这个参数
            pid = opts.pid || "unkown",
            // pageId 是目前推荐使用的页面唯一标识，通过 module+action+pagename来确定当前的页面展示
            // 用这种方法的好处是 新开发页面不需要重新开发pv统计
            pageId = opts.page_id || "unkown",
            pageIdParam = {
                pid: pid,
                page_id: pageId
            },
            // 记录上一个操作路劲
            ref_param = refPageParam;

        // 保存到用户操作路径
        user_step.push(pageIdParam);
        // 获取操作路劲信息
        // param.step_record = user_step.join("|");
        // 记录用户步长
        param.step_len = user_step.length;
        param.time = Date.now();

        param = $.extend({},
            param,
            pageIdParam,
            ref_param);

        addStat(code, param);
        // 用来保存上一个页面
        refPageParam = {
            ref_pid: pageIdParam.pid,
            ref_page_id: pageIdParam.page_id
        };
        // 落地页是首页静态页的时候，如果快速点路线，可能导致首页和路线页pv发送特别近
        // 记录状态，发送PV统计
        if (!window.checkLandingPage() || staticSended) {
            lockPvSend();
        }
        staticSended = true;
    }

    // 锁住pv统计发送
    // 排除因为系统原因连续发送
    var lockPvSend = function() {
        locked = true;
        var _lockTimer = setTimeout(function() {
            locked = false;
            clearTimeout(_lockTimer);
        }, lockedTime);
    }

    return _sendpv;
}();

/**
 * @module common:widget/stat
 */
module.exports = {
    addStat: addStat,
    sendPvStat: sendPvStat,
    initClickStat: initClickStat,
    addCookieStat: addCookieStat
};


});
;define('common:static/js/gmu/src/widget/suggestion/suggestion.js', function(require, exports, module){

require("common:static/js/gmu/src/core/widget.js");
require("common:static/js/gmu/src/extend/highlight.js");
var stat  = require('common:widget/stat/stat.js');
/**
 * @file 搜索建议组件
 * @import core/widget.js, extend/touch.js, extend/highlight.js
 */
(function( $, win ) {

     /**
     * 搜索建议组件
     *
     * @class Suggestion
     * @constructor Html部分
     * ```html
     * <form action="http://www.baidu.com/s" method="get">
     *     <div class="search">
     *         <div class="search-input"><input type="text" id="input" name="wd"></div>
     *         <div class="search-button"><input type="submit" value="百度一下"></div>
     *     </div>
     * </form>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#input').suggestion({
     *      source: "../../data/suggestion.php"
     *  });
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化Suggestion的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Suggestion:options)
     * @grammar $( el ).suggestion( options ) => zepto
     * @grammar new gmu.Suggestion( el, options ) => instance
     */

    var guid = 0;

    gmu.define( 'Suggestion', {

        // 默认options
        options: {

            /**
             * @property {Element | Zepto | Selector} container 父元素，若为render模式，则为必选
             * @namespace options
             */

            /**
             * @property {String} source 请求数据的url，若不自定义sendRequest，则为必选
             * @namespace options
             */

            /**
             * @property {String} [param=''] url附加参数
             * @namespace options
             */

            /**
             * @property {String | Element} [form] 提交搜索的表单，默认为包含input框的第一个父级form
             * @namespace options
             */

            /**
             * @property {Boolean | String} [historyShare=true] 多个sug之间是否共享历史记录，可传入指定的key值。若传默认传true，则使用默认key：'SUG-Sharing-History'，若传false，即表示不共享history；若传string，则为该值+'-SUG-Sharing-History'作为key值
             * @namespace options
             */
            historyShare: true,

            /**
             * @property {Boolean} [confirmClearHistory=true] 删除历史记录时是否确认
             * @namespace options
             */
            confirmClearHistory: true,

            /**
             * @property {Boolean} [autoClose=true] 点击input之外自动关闭
             * @namespace options
             */
            autoClose: false,

            /**
             * @property {String} [appendContanier=''] suggestion挂在的容器，默认挂在input的父容器下面
             * @namespace options
             */
            appendContanier: document.body
        },

        template: {

            // ui-suggestion的class必须有
            // ontent, button, clear, close这几个div必须有，其他的可以更改
            wrapper: '<div class="ui-suggestion">' +
                '<div class="ui-suggestion-content"></div>' +
                '<div class="ui-suggestion-button">' +
                '<span class="ui-suggestion-clear">清除历史记录</span>' +
                '<span class="ui-suggestion-close"></span>' +
                '</div></div>'
        },

        _initDom: function() {
            var me = this,
                $input = me.getEl().attr( 'autocomplete', 'off'),
                $parent = $input.parent('.ui-suggestion-mask');

            $parent.length ? me.$mask = $parent :
                    $input.wrap( me.$mask =
                    $( '<div class="ui-suggestion-mask"></div>' ) );

            // 采用template的wrapper项渲染列表
            // TODO 参数
            me.$wrapper = $(me.tpl2html( 'wrapper' ));
            me._options['appendContanier'] ?  $(me._options['appendContanier']).append(me.$wrapper) : me.$mask.append(me.$wrapper);

            me.$wrapper.prop('id', 'ui-suggestion-' + (guid++));
            me.$content = me.$wrapper
                    .css( 'top', $input.height() + (me.wrapperTop =
                    parseInt( me.$wrapper.css( 'top' ), 10 ) || 0) )
                    .find( '.ui-suggestion-content' );

            me.$btn = me.$wrapper.find( '.ui-suggestion-button' );
            me.$clearBtn = me.$btn.find( '.ui-suggestion-clear' );
            me.$closeBtn = me.$btn.find( '.ui-suggestion-close' );

            return me.trigger('initdom');
        },

        _bindEvent: function() {
            var me = this,
                $el = me.getEl(),
                ns = me.eventNs;

            me._options.autoClose && $( document ).on( 'click' + ns, function( e ) {

                // 若点击是的sug外边则关闭sug
                !$.contains( me.$mask.get( 0 ), e.target ) && me.hide();
            } );

            $el.on( 'focus' + ns, function() {

                // 当sug已经处于显示状态时，不需要次showlist
                !me.isShow && me._showList().trigger( 'open' );
            } );

            $el.on( 'input' + ns, function() {

                // 考虑到在手机上输入比较慢，故未进行稀释处理
                me._showList();
            } );

            me.$clearBtn.on( 'click' + ns, function() {

                //清除历史记录
                me.history( null );
            } ).highlight( 'ui-suggestion-highlight' );

            me.$closeBtn.on( 'click' + ns, function() {

                // 隐藏sug
                me.getEl().blur();
                me.hide().trigger( 'close' );
            } ).highlight( 'ui-suggestion-highlight' );

            return me;
        },

        _create: function() {
            var me = this,
                opts = me._options,
                hs = opts.historyShare;

            opts.container && (me.$el = $(opts.container));

            // 若传默认传true，则使用默认key：'SUG-Sharing-History'
            // 若传false，即表示不共享history，以该sug的id作为key值
            // 若传string，则在此基础上加上'SUG-Sharing-History'
            me.key = hs ?
                    (($.type( hs ) === 'boolean' ? '' : hs + '-') +
                    'SUG-Sharing-History') :
                    me.getEl().attr( 'id' ) || ('ui-suggestion-' + (guid++));

            // localStorage中数据分隔符
            me.separator = encodeURIComponent( ',' );

            // 创建dom，绑定事件
            me._initDom()._bindEvent();

            return me;
        },

        /**
         * 展示suglist，分为query存在和不存在
         * @private
         */
        _showList: function() {
            var me = this,
                query = me.value(),
                data;

            if ( query ) {

                // 当query不为空，即input或focus时,input有值
                // 用户自己发送请求或直接本地数据处理，可以在sendrequest中处理
                if(query == '我的位置') return me;
                me.trigger( 'sendrequest', query, $.proxy( me._render, me ),
                        $.proxy( me._cacheData, me ));

            } else {

                // query为空，即刚开始focus时，读取localstorage中的数据渲染
                (data = me._localStorage()) ?
                        me._render( query, data.split( me.separator ) ) :
                        me.hide();
            }

            return me;
        },

        _render: function( query, data ) {
            this.trigger( 'renderlist', data, query, $.proxy( this._fillWrapper, this ) );
        },

        /**
         * 根据数据填充sug wrapper
         * @listHtml 填充的sug片段，默认为'<ul><li>...</li>...</ul>'
         * @private
         */
        _fillWrapper: function( listHtml ) {

            // 数据不是来自历史记录时隐藏清除历史记录按钮
            this.$clearBtn[ this.value() ? 'hide' : 'show' ]();
            listHtml ? (this.$content.html( listHtml ), this.show()) :
                    this.hide();

            return this;
        },

        _localStorage: function( value ) {
            var me = this,
                key = me.key,
                separator = me.separator,
                localStorage,
                data;

            try {

                localStorage = win.localStorage;

                if ( value === undefined ) {    // geter
                    return localStorage[ key ];

                } else if ( value === null ) {    // setter clear
                    localStorage[ key ] = '';

                } else if ( value ) {    // setter
                    data = localStorage[ key ] ?
                            localStorage[ key ].split( separator ) : [];

                    // 数据去重处理
                    // todo 对于兼容老格式的数据中有一项会带有\u001e，暂未做判断
                    // if ( !~$.inArray( value, data ) ) {
                    //     data.unshift( value );
                    //     localStorage[ key ] = data.join( separator );
                    // }
                    if (!!~$.inArray(value, data)) {
                        index = data.indexOf(value);
                        data.splice(index, 1);
                    }
                    data.unshift(value);
                    window.localStorage[ key ] = data.join( separator );
                }

            } catch ( ex ) {
                console.log( ex.message );
            }

            return me;
        },

        _cacheData: function( key, value ) {
            this.cacheData || (this.cacheData = {});

            return value !== undefined ?
                this.cacheData[ key ] = value : this.cacheData[ key ];
        },

        /**
         * 获取input值
         * @method value
         * @return {String} input中的值
         */
        value: function() {
            return this.getEl().val();
        },

        /**
         * 设置|获取|清空历史记录
         * @method history
         * @param {String} [value] 不传value表示清除sug历史记录，传value表示存值
         */
        history: function( value ) {
            var me = this,
                clearHistory = value !== null || function() {
                    stat.addStat(COM_STAT_CODE.SUG_CLEAR_HISTORY_BTN); //清空历史记录点击统计
                    return me._localStorage( null).hide();
                };

            return value === null ? (me._options.confirmClearHistory ?
                win.confirm( '清除全部查询历史记录？' ) && clearHistory() :
                clearHistory()) : me._localStorage( value )
        },

        /**
         * 显示sug
         * @method show
         */
        show: function() {

            if ( !this.isShow ) {
                this.$wrapper.show();
                this.isShow = true;
                stat.addStat(COM_STAT_CODE.SUG_ONLINE_SHOW);
                return this.trigger( 'show' );
            }else{
                return this;
            }

        },

        /**
         * 隐藏sug
         * @method hide
         */
        hide: function() {

            if ( this.isShow ) {
                this.$wrapper.hide();
                this.isShow = false;
                stat.addStat(COM_STAT_CODE.SUG_HISTORY_SHUTUP); // 关闭点击统计
                return this.trigger( 'hide' );
            }else{
                return this;
            }

        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy: function() {
            var me = this,
                $el = me.getEl(),
                ns = me.ns;

            // 先执行父级destroy，保证插件或option中的destroy先执行
            me.trigger( 'destroy' );

            $el.off( ns );
            me.$mask.replaceWith( $el );
            me.$clearBtn.off( ns );
            me.$closeBtn.off( ns );
            me.$wrapper.children().off().remove();
            me.$wrapper.remove();
            me._options.autoClose && $( document ).off( ns );

            this.destroyed = true;

            return me;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event initdom
         * @param {Event} e gmu.Event对象
         * @param {Zepto} $el slider元素
         * @description DOM创建完成后触发
         */

        /**
         * @event show
         * @param {Event} e gmu.Event对象
         * @description 显示sug时触发
         */

        /**
         * @event hide
         * @param {Event} e gmu.Event对象
         * @param {Number} index 当前slide的序号
         * @description 隐藏sug时触发
         */

        /**
         * @event sendrequest
         * @param {Event} e gmu.Event对象
         * @param {String} query 用户输入查询串
         * @param {Function} render 数据请求完成后的渲染回调函数，其参数为query,data
         * @param {Function} cacheData 缓存query的回调函数，其参数为query, data
         * @description 发送请求时触发
         */

        /**
         * @event renderlist
         * @param {Event} e gmu.Event对象
         * @param {Array} data 渲染的数据
         * @param {String} query 用户输入的查询串
         * @param {Function} fillWrapper 列表渲染完成后的回调函数，参数为listHtml片段
         * @description 渲染sug list时触发
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    } );
})( gmu.$, window );


});
;define('common:static/js/gmu/src/widget/suggestion/quickdelete.js', function(require, exports, module){

require("common:static/js/gmu/src/widget/suggestion/suggestion.js");
/**
 * @file quickdelete插件
 * @import widget/suggestion/suggestion.js
 */
(function( gmu, $ ) {

    /**
     * quickdelete插件
     * @class quickdelete
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.register( 'quickdelete', {

        _init: function() {
            var me = this,
                $input,
                ns;

            me.on( 'ready', function() {
                $input = me.getEl();
                ns = me.eventNs;

                me.$mask.append( me.$quickDel =
                    $( '<div class="ui-suggestion-quickdel"></div>' ) );

                $input.on('focus' + ns + ' input' + ns, function() {
                    me[ '_quickDel' +
                        ($.trim( $input.val() ) ? 'Show' : 'Hide') ]();
                });

                $input.on( 'blur' + ns, function() {
                    me._quickDelHide();
                });

                // 绑tap事件，touchend会失焦点，键盘收起，故绑touchstart并阻止默认行为
                me.$quickDel.on( 'click' + ns, function( e ) {

                    e.preventDefault();    // 阻止默认事件，否则会触发blur，键盘收起
                    e.formDelete = true;    // suggestion解决删除问题
                    $input.val('');
                    me.trigger('delete').trigger('input')._quickDelHide();

                    // 中文输入时，focus失效 trace:FEBASE-779
                    $input.blur().focus();
                } );

                me.on( 'destroy', function() {
                    me.$quickDel.off().remove();
                } );
            } );
        },

        _quickDelShow: function() {

            if ( !this.quickDelShow ) {

                gmu.staticCall( this.$quickDel.get(0),
                        'css', 'visibility', 'visible' );

                this.quickDelShow = true
            }
        },

        _quickDelHide: function() {

            if ( this.quickDelShow ) {

                gmu.staticCall( this.$quickDel.get(0),
                    'css', 'visibility', 'hidden' );

                this.quickDelShow = false
            }
        }
    } );

})( gmu, gmu.$ );

});
;define('common:static/js/gmu/src/widget/suggestion/renderlist.js', function(require, exports, module){

require("common:static/js/gmu/src/widget/suggestion/suggestion.js");
require("common:static/js/gmu/src/extend/highlight.js");
var stat  = require('common:widget/stat/stat.js');
/**
 * @file renderList
 * @import widget/suggestion/suggestion.js, extend/highlight.js
 */
(function( $ ) {

    $.extend( gmu.Suggestion.options, {

        /**
         * @property {Boolean} [isHistory=true] 是否在localstorage中存储用户查询记录，相当于2.0.5以前版本中的isStorage
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        isHistory: true,

        /**
         * @property {Boolean} [usePlus=false] 是否使用+来使sug item进入input框
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        usePlus: false,

        /**
         * @property {Number} [listCount=5] sug列表条数
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        listCount: 5,

        /**
         * @property {Function} [renderlist=null] 自定义渲染列表函数，可以覆盖默认渲染列表的方法
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        renderlist: null
    } );

    /**
     * renderList，提供默认列表渲染，若需要自己渲染sug列表，即renderList为Function类型，则不需要使用此插件<br />
     * 默认以jsonp发送请求，当用户在option中配置了renderList时，需要调用用e.preventDefault来阻默认请求数据方法
     * @class renderlist
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.option( 'renderlist', function() {

        // 当renderList不是Function类型时，该option操作生效
        return $.type( this._options.renderlist ) !== 'function';

    }, function() {

        var me = this,
            $xssElem = $( '<div></div>'),
            _xssFilter = function( str ) {
                return $xssElem.text( str ).html();
            },

            // 渲染sug list列表，返回list array
            _createList = function( query, sugs ) {
                var opts = me._options,
                    html = [],
                    str = '',
                    sug,
                    len,
                    i;

                if ( !sugs || !sugs.length ) {
                    me.hide();
                    return html;
                }

                sugs = sugs.slice( 0, opts.listCount );

                // 防止xss注入，通过text()方法转换一下
                query = _xssFilter( query || '' );

                // sug列表渲染比较频繁，故不采用模板来解析
                // for ( i = 0, len = sugs.length; i < len; i++ ) {
                //     str = _xssFilter( sug = sugs[ i ] );

                //     // 若是query为空则不需要进行替换
                //     query && (str = $.trim( sug )
                //         .replace( query, '<span>' + query + '</span>' ));

                //     opts.usePlus &&
                //             (str += '<div class="ui-suggestion-plus" ' +
                //                 'data-item="' + sug + '"></div>');

                //     html.push( '<li>' + str + '</li>' );
                // }

                $.each(sugs, function(index, item) {
                    $.trim(item);
                    item = item.split('$');
                    if(query){
                        html.push('<li><div class="ui-suggestion-result">'+(item[3] ? '<span class="query-icon"></span><span>' + (query && $.trim( item[3] ).replace(query, '<font>' + query + '</font>')) + '</span>' : '') + '<span>' + item[0] + (query && item[1]) + '</span></div></li>');
                    }else{
                        html.push('<li><div class="ui-suggestion-result">'+(item[3] ? '<span>' + (query && $.trim( item[3] ).replace(query, '<font>' + query + '</font>')) + '</span>' : '') + '<span class="history-icon"></span><span>' + item[0] + (query && item[1]) + '</span></div></li>');
                    }
                    
                });

                return html;
            };

        me.on( 'ready', function() {
            var me = this,
                ns = me.eventNs,
                $form = $( me._options.form || me.getEl().closest( 'form' ));

            // 绑定form的submit事件
            $form.size() && (me.$form = $form.on( 'submit' + ns,
                    function( e ) {
                        var submitEvent = gmu.Event('submit');

                        me._options.isHistory &&
                        me._localStorage( me.value() );

                        me.trigger( submitEvent );

                        // 阻止表单默认提交事件
                        submitEvent.isDefaultPrevented() && e.preventDefault();
                    }));

            // todo 待验证，新闻页面不会有该bug，待排查原因，中文输入不跳转的bug
            //me.$content.on( 'touchstart' + ns, function(e) {
            //    e.preventDefault();
            //});

            // 注册tap事件由于中文输入法时，touch事件不能submit
            me.$content.on( 'click' + ns, function(e) {
                var $input = me.getEl(),
                    $elem = $( e.target );

                // 点击加号，input值上框
                if ( $elem.hasClass( 'ui-suggestion-plus' ) ) {
                    $input.val( $elem.attr( 'data-item' ) );
                } else if ( $.contains( me.$content.get( 0 ),
                    $elem.get( 0 ) ) ) {
                    if($input.val() ===''){
                         // 历史记录点击统计
                        stat.addStat(COM_STAT_CODE.SUG_HISTORY_SEARCH, {
                            "from": $input.attr('id')
                        });
                        stat.addCookieStat(COM_STAT_CODE.SUG_HISTORY_SEARCH, {
                            "from": $input.attr('id')
                        });
                    }else{
                        // 在线SUGG点击统计
                        stat.addStat(COM_STAT_CODE.SUG_ONLINE_SEARCH, {
                            "from": $input.attr('id')
                        });
                        stat.addCookieStat(COM_STAT_CODE.SUG_ONLINE_SEARCH, {
                            "from": $input.attr('id')
                        });
                    }
                    // 点击sug item, 防止使用tap造成穿透
                    setTimeout( function() {
                        $input.val( $elem.parent().find('span:nth-child(2)').text() );
                        me.trigger( 'select', $elem )
                            .hide();
                        $form.length && $form.submit();
                    }, 400 );
                }
            }).highlight( 'ui-suggestion-highlight' );

            me.on( 'destroy', function() {
                $form.size() && $form.off( ns );
                me.$content.off();
            } );
        } );

        me.on( 'renderlist', function( e, data, query, callback ) {
            var ret = _createList( query, data );

            // 回调渲染suglist
            return callback( ret.length ?
                        '<ul>' + ret.join( ' ' ) + '</ul>' : '' );
        } );
    } );

})( gmu.$ );


});
;define('common:static/js/gmu/src/widget/suggestion/sendrequest.js', function(require, exports, module){

require("common:static/js/gmu/src/widget/suggestion/suggestion.js");
var locator = require('common:widget/geolocation/location.js');

/**
 * @file sendRequest
 * @import widget/suggestion/suggestion.js
 */

(function( $, win ) {

    $.extend( gmu.Suggestion.options, {

        /**
         * @property {Boolean} [isCache=true] 发送请求返回数据后是否缓存query请求结果
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        isCache: true,

        /**
         * @property {String} [queryKey='wd'] 发送请求时query的key值
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        
        queryKey: 'wd',

        /**
         * @property {String} [cbKey='cb'] 发送请求时callback的name
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        cbKey: 'cb',

        /**
         * @property {Function} [sendrequest=null] 自定义发送请求函数，可以覆盖默认发送请求的方法
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        sendrequest: null,
        beforesendrequest: null
    } );

    /**
     * sendRequest，默认sendRequest为jsonp方式取数据，若用户自己用数据填充sug，即该option为Function类型，则不需要使用此插件<br />
     * 默认以jsonp发送请求，当用户在option中配置了sendRequest时，需要调用用e.preventDefault来阻默认请求数据方法
     * @class sendrequest
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.option( 'sendrequest', function() {

        // 当sendRequest不是Function类型时，该option操作生效
        return $.type( this._options.sendrequest ) !== 'function';

    }, function() {
        var me = this,
            opts = me._options,
            queryKey = opts.queryKey,
            cbKey = opts.cbKey,
            param = opts.param,
            isCache = opts.isCache,
            cdata;

        this.on( 'sendrequest', function( e, query, callback, cacheData ) {
            //TODO 需要包装开放参数
            var cityCode = locator.getCityCode() || 1,
                bound = {},
                boundParams = '';     
                if (locator.hasExactPoi()) {
                    bound.minX = locator.getPointX() - 5000;
                    bound.minY = locator.getPointY() - 5000;
                    bound.maxX = locator.getPointX() + 5000;
                    bound.maxY = locator.getPointY() + 5000;
                    boundParams = "("+ bound.minX +","+ bound.minY +";"+ bound.maxX +","+ bound.maxY +")";
                }
            var param = 'cid='+cityCode+'&b='+boundParams+'&type=0&newmap=1&ie=utf-8';

            var url = opts.source,

            // 以date作为后缀，应该不会重复，故不作origin
                cb = 'suggestion_' + (+new Date());

            // 若缓存中存数请求的query数据，则不发送请求
            if ( isCache && (cdata = cacheData( query )) ) {
                callback( query, cdata );
                return me;

            }

            // 替换url后第一个参数的连接符?&或&为?
            url = (url + '&' + queryKey + '=' + encodeURIComponent( query ))
                    .replace( /[&?]{1,2}/, '?' );

            !~url.indexOf( '&' + cbKey ) &&  (url += '&' + cbKey + '=' + cb);

            param && (url += '&' + param);

            win[ cb ] = function( data ) {

                /*
                 * 渲染数据并缓存请求数据
                 * 返回的数据格式如下：
                 * {
                 *     q: "a",
                 *     p: false,
                 *     s: ["angelababy", "akb48", "after school",
                 *     "android", "angel beats!", "a pink", "app"]
                 * }
                 */
                callback( query, data.s );

                // 缓存请求的query
                isCache && cacheData( query, data.s );

                delete win[ cb ];
            };

            // 以jsonp形式发送请求
            $.ajax({
                url: url,
                dataType: 'jsonp'
            });

            return me;
        } );

    } );
})( gmu.$, window );

});
;/*
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
/**
 * 为了适应fis的机制，这里去掉了iScroll自己的必包和最后的export代码
 * by jz
 */

 define('common:static/js/iscroll.js', function(require, exports, module){

var doc = document;
var m = Math,
	dummyStyle = doc.createElement('div').style,

	// 浏览器厂商自定义前缀识别，通过transform参数识别
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

	// Style properties
	// 为transform样式添加浏览器厂商前缀
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
    // 平台识别
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

	// perspective样式属性定义3D元素距离视角的像素距离
    has3d = prefixStyle('perspective') in dummyStyle,
    // 识别是否有touchstart事件
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    // 通过transform参数识别的浏览器厂商前缀，自然识别了是否具备transform样式属性
    hasTransform = vendor !== false,
    // 识别是否有transition样式属性
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

    // 屏幕旋转事件
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',

	// TransitionEnd事件
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),

	CLICK_EV = 'click',

	// requestAnimationFrame shim
	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),

	// Helpers
	translateZ = has3d ? ' translateZ(0)' : '',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			i;

		// DOM结构：wrapper>scroller
		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true, // 启用或禁用反弹
			bounceLock: false,
			momentum: true, // 启用或禁用惯性
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false, // 检查DOM元素变化, Experimental
			handleClick: true, // 自定义派发Click事件，解决200ms延时问题（仅在不doubleTapToZoom的时候）

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,

			// 在iOS系统上，当元素拖动超出了scroller的边界时，滚动条会收缩，设置为
			// true可以禁止滚动条超出scroller的可见区域。默认在Android上为true，
			// iOS上为false
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
			// 自定义事件方法，在touchstart事件监听函数逻辑之前执行
			// 所有的before事件均类似
			onBeforeScrollStart: function (e) { e.preventDefault(); },
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform && that.options.useTransform;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together!
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			translateZ = '';
		}
		
		// Set some default styles
		that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
		that.scroller.style[transitionDuration] = '0';
		that.scroller.style[transformOrigin] = '0 0';
		if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
		// 初始化设置滚动位置
		if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			if (that.options.wheelAction != 'none') {
				that._bind('DOMMouseScroll');
				that._bind('mousewheel');
			}
		}

		// 定时500ms检查DOM变化，
		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);

		if (this.options.handleClick) {
			if (!Event.prototype.stopImmediatePropagation) {
				document.body.removeEventListener = function(type, callback, capture) {
					var rmv = Node.prototype.removeEventListener;
					if (type === 'click') {
						rmv.call(document.body, type, callback.hijacked || callback, capture);
					} else {
						rmv.call(document.body, type, callback, capture);
					}
				};

				document.body.addEventListener = function(type, callback, capture) {
					var adv = Node.prototype.addEventListener;
					if (type === 'click') {
						adv.call(document.body, type, callback.hijacked || (callback.hijacked = function(event) {
							if (!event.propagationStopped) {
								callback(event);
							}
						}), capture);
					} else {
						adv.call(document.body, type, callback, capture);
					}
				};
			}

			that._bind(CLICK_EV, document.body, true); // 捕获阶段监听Click事件
		}
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	// 统一的回调事件函数
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			case TRNEND_EV: that._transitionEnd(e); break;
			case CLICK_EV: that._click(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
			if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		if (this.zoomed) return;

		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
		} else {
			x = m.round(x);
			y = m.round(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
	},

	_click: function(e) {
		if (e._fake === true) { // fakeClick默认均通过, 记录触发对象和时机;
			this.actualClickElement = e.target;
			this.fakeClickTimeStamp = Date.now();
			return true;
		}

		/*
		 * fakeClick触发点与actualClick触发点时机相差超过600ms;
		 * 认为不是因为浏览器默认200msDelay引起的Click;
		 * 阻止此Click事件，清空actualClickElement标识符;
		 */
		if (this.actualClickElement && this.fakeClickTimeStamp) {
			// 兼容4.1以下不会出现浏览器默认200msDelayClick的情况;
			// 则在600ms以内认为是误操作阻止，600ms以外认为是用户正常的操作;
			// 在600ms之内，出现在顶端的页面是否属于iScroll或者body均应该阻止;
			// 存在问题：若4.1默认延时Click触发事件超过600ms也会被通过，造成直接击透的现象;
			// FIXME: 是否存在一种判断是否会触发浏览里默认延时Click的条件; 或者后期全局使用fakeClick;
			var ACTUAL_CLICK_THRESHOLD = 600;
			var timeSpan = Date.now() - this.fakeClickTimeStamp;
			if (timeSpan > ACTUAL_CLICK_THRESHOLD) {
				this.actualClickElement = null;
				this.fakeClickTimeStamp = null;
				return true;
			}
		} else {
			/*
			 * 如果parent隶属于body元素，则再次点击的不属于iScroll内的元素;
			 * 保证正常点击非iScroll元素能够正常;
			 */
			var parent = e.target;
			while(parent != this.scroller && parent != document.body) {
				parent = parent.parentNode;
			}

			if (parent == document.body) {
				return true;
			}
		}

		var target = e.target;
		while (target.nodeType != 1) target = target.parentNode;
		var tagName = target.tagName.toLowerCase();
		if (tagName != 'select' && tagName != 'input' && tagName != 'textarea') {
			if (e.stopImmediatePropagation) {
				e.stopImmediatePropagation();
			} else {
				e.propagationStopped = true;
			}

			e.stopPropagation();
			e.preventDefault();

			this.actualClickElement = null;
			this.fakeClickTimeStamp = null;

			return false;
		}
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
				y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind(TRNEND_EV);
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		// 动态绑定touchmove，touchend，touchcancel事件
		that._bind(MOVE_EV, window);
		that._bind(END_EV, window);
		that._bind(CANCEL_EV, window);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true; // 这里的moved处理未考虑到小范围的距离移动
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length !== 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, tagName, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		// 动态注销事件监听
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[transitionDuration] = '200ms';
			that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else if (this.options.handleClick) { // 自定义派发Click事件，解决200ms延时问题
					// that.doubleTapTimer = setTimeout(function () {
						// that.doubleTapTimer = null;
                        
						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode; // 元素element
						tagName = target.tagName.toLowerCase();
						if (tagName != 'select' && tagName != 'input' && tagName != 'textarea') {
							ev = doc.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true; // 自定义派发的Click事件识别符
							target.dispatchEvent(ev); // 由touch元素派发Click事件
						} else {
							target.focus();
						}
					// }, that.options.zoom ? 250 : 0);  // 如果在250ms内再次tap则认为是doubleTap
				}
			}

			that._resetPos(400);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				// 复位时再次执行scrollEnd
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
		if (that.maxScrollY < 0) {
			that.scrollTo(deltaX, deltaY, 0);
		}
	},
	
	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind(TRNEND_EV);
		
		that._startAni();
	},


	/**
	*
	* Utilities
	*
	*/
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind(TRNEND_EV);
			else that._resetPos(0);
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[transitionDuration] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	*
	* Public methods
	*
	*/
	destroy: function () {
		var that = this;

		that.scroller.style[transform] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);
		
		if (!that.options.hasTouch) {
			that._unbind('DOMMouseScroll');
			that._unbind('mousewheel');
		}
		
		if (that.options.useTransition) that._unbind(TRNEND_EV);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[transitionDuration] = '0';
			that._resetPos(400);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV, window);
		this._unbind(END_EV, window);
		this._unbind(CANCEL_EV, window);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(TRNEND_EV);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[transitionDuration] = time + 'ms';
		that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

dummyStyle = null;	// for the sake of it


module.exports = iScroll;

});

;var BigPipe = function() {

    var pagelets = [],
        loadedResource = {},
        container,
        containerId,
        pageUrl = location.pathname + (location.search ? "?" + location.search : ""),
        resource,
        resourceCache = {},
        onReady,
        initiatorType = {
            LANDING     : 0,        // 发起者类型
            QUICKLING   : 1,
            FROM_CACHE  : 2
        },
        LOADED = 1,
        cacheMaxTime = 5 * 60 * 1000;

    function parseJSON (json) {
        return window.JSON? JSON.parse(json) : eval('(' + json + ')');
    }


    function ajax(url, cb, data) {
        var xhr = new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                cb(xhr.responseText);
            }
        };
        xhr.open(data?'POST':'GET', url + '&t=' + ~~(Math.random() * 1e6), true);

        if (data) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(data);
    }

    function getCommentById(html_id) {
        //
        // 取出html_id元素内保存的注释内容
        //
        var dom = document.getElementById(html_id);
        if (!dom) {
            return "";
        }
        var html = dom.firstChild.nodeValue;
        html = html.substring(1, html.length - 1).
            replace(/\\([\s\S]|$)/g,'$1');
        dom.parentNode.removeChild(dom);
        return html;
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
        if (!dom) {
            dom = document.createElement('div');
            dom.id = obj.id;
            if (container) {
                container.appendChild(dom);
            } else {
                document.body.appendChild(dom);
            }
        }
        dom.innerHTML = obj.html || getCommentById(obj.html_id);
    }


    function render(options) {
        var i, n = pagelets.length;
        var pageletsMap = {};
        var rendered = {};
        var options = options || {};

        //
        // pagelet.id => pagelet 映射表
        //
        for(i = 0; i < n; i++) {
            var obj = pagelets[i];
            pageletsMap[obj.id] = obj;
        }

        for(i = 0; i < n; i++) {
            renderPagelet(pagelets[i], pageletsMap, rendered);
        }

        if(options.trigger === true) {
            trigger('pagerendercomplete', {
                'url': pageUrl,
                'resource': resource
            });
        }
    }


    function process(rm, cb) {
        if (rm.async) {
            require.resourceMap(rm.async);
        }
        var css = getNeedLoad(rm.css);

        function loadNext() {
            var js = getNeedLoad(rm.js);

            if (rm.style) {
                var dom = document.createElement('style');
                dom.innerHTML = rm.style;
                document.getElementsByTagName('head')[0].appendChild(dom);
            }

            cb();

            if (js) {
                LazyLoad.js(js, function() {
                    recordLoaded(js);
                    rm.script && window.eval(rm.script);
                    trigger("onpageloaded");
                });
            }
            else {
                rm.script && window.eval(rm.script);
                trigger("onpageloaded");
            }
        }

        css
            ? LazyLoad.css(css.reverse(), function(){
                recordLoaded(css);
                loadNext();
            })
            : loadNext();
    }


    /**
     * 获取需要加载的资源列表
     * @param  {array|string} resource 资源地址或者数组
     * @return {array}        资源列表
     */
    function getNeedLoad (resource) {
        var needLoad = [];
        if(typeof resource === "string") {
            needLoad = [resource]
        } else if(Object.prototype.toString.call(resource) === "[object Array]") {
            for (var i = 0; i < resource.length; i++) {
                if(loadedResource[resource[i]] !== LOADED) {
                    needLoad.push(resource[i]);
                }
            };
        }

        if(needLoad.length === 0) {
            needLoad = null;
        } 

        return needLoad;

    }

    /**
     * 记录下载资源
     * @param  {array|string} resource 已下载的资源
     * @return {void}         
     */
    function recordLoaded (resource) {
        var needCache = resource;
        if(typeof needCache === "string") {
            needCache = [needCache];
        }

        for (var i = 0; i < needCache.length; i++) {
            loadedResource[resource[i]] = LOADED;
        };

    }

    function register(obj) {
        process(obj, function() {
            render({trigger:true});
            if(typeof onReady === "function") {
                onReady();
            }
        });
    }

    function fetch(url, id, options, callback) {
        //
        // Quickling请求局部
        //
        var currentPageUrl = location.href,
            options = options || {},
            eventOptions = {},
            data;
        containerId = id;

        var success = function(data, opts){
            // 如果数据返回回来前，发生切页，则不再处理，否则当前页面有可能被干掉
            if(currentPageUrl !== location.href) {
                return;
            }

            if (id == containerId) {
                pageUrl = url;
                var json = parseJSON(data);
                resource = json;

                // 处理前派发页面到达事件
                trigger('pagearrived', opts);

                onPagelets(json, id, callback);
            }
        }

        // 缓存策略
        if(isCacheAvailable(url) && options.cache !== false) {
            data = getCachedResource(url);
            // initiator标识发起者参数
            eventOptions.initiator = initiatorType.FROM_CACHE;
            success(data, eventOptions);
            // 统计URL
            statRecord(url);
        } else {
            ajax(url, function(data){
                eventOptions.initiator = initiatorType.QUICKLING;
                addResourceToCache(url,data);
                success(data, eventOptions);
            });
        }
    }

    function refresh(url, id, options, callback) {
        fetch(url, id, options, callback);
    }

    /**
     * 异步加载pagelets
     */
    function asyncLoad(pageletIDs, param) {
        if (!(pageletIDs instanceof Array)) {
            pageletIDs = [pageletIDs];
        }

        var i, args = [],
            currentPageUrl = location.href;
        for(i = pageletIDs.length - 1; i >= 0; i--) {
            var id = pageletIDs[i].id;
            if (!id) {
                throw Error('[BigPipe] missing pagelet id');
            }
            args.push('pagelets[]=' + id);
        }

        param = param ? '&' + param : '';

        var url = location.href.split('#')[0] + '&' + args.join('&') + '&force_mode=1&fis_widget=true' +param;

        // 异步请求pagelets
        ajax(url, function(res) {
            // 如果数据返回回来前，发生切页，则不再处理，否则当前页面有可能被干掉
            if(currentPageUrl !== location.href) {
                return;
            }

            var data = parseJSON(res);
            resource = data;
            pageUrl = url;
            pagelets = data.pagelets;
            process(data.resource_map, function() {
                render();
            });
        });
    }

    /**
     * 记录统计
     * @param  {String} url 
     */
    function statRecord(url){
        if(typeof url === "string") {
            var sep = url.indexOf('?') === -1 ? "/?" : "&";
            url = url + sep + "pagecache=1";
            ajax(url,function(res){
                //console.log("%ccache stat","color:red");
            });
        }
    }

    function addResourceToCache(url,resource){
        resourceCache[url] = {
            data : resource,
            time : Date.now()
        };
    }

    function getCachedResource(url) {
        if(resourceCache[url]) {
            return resourceCache[url].data;
        }
    }

    function isCacheAvailable(url) {
        return !!resourceCache[url] && Date.now() - resourceCache[url].time <= cacheMaxTime;
    }

    /**
     * 添加一个pagelet到缓冲队列
     */
    function onPageletArrived(obj) {
        pagelets.push(obj);
    }

    function onPagelets(obj, id, callback) {
        //
        // Quickling请求响应
        //
        if (obj.title) {
            document.title = obj.title;
        }

        //
        // 清空需要填充的DOM容器
        //
        container = document.getElementById(id);
        container.innerHTML = '';
        pagelets = obj.pagelets;


        process(obj.resource_map, function() {
            callback && callback();
            render({trigger:true});
        });
    }

    function onPageReady(f) {
        onReady = f;
        trigger('pageready', pagelets);
    }

    function onPageChange(pid) {
        fetch(location.pathname +
            (location.search? location.search + '&' : '?') + 'pagelets=' + pid);
    }


    // -------------------- 事件队列 --------------------
    var SLICE = [].slice;
    var events = {};

    function trigger(type /* args... */) {
        var list = events[type];
        if (!list) {
            return;
        }

        var arg = SLICE.call(arguments, 1);
        for(var i = 0, j = list.length; i < j; i++) {
            var cb = list[i];
            if (cb.f.apply(cb.o, arg) === false) {
                break;
            }
        }
    }

    function on(type, listener, context) {
        var queue = events[type] || (events[type] = []);
        queue.push({f: listener, o: context});
    }


    return {
        asyncLoad: asyncLoad,
        register: register,
        refresh: refresh,

        onPageReady: onPageReady,
        onPageChange: onPageChange,

        onPageletArrived: onPageletArrived,
        onPagelets: onPagelets,

        on: on,
        trigger: trigger
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
      || (env.ie = /MSIE|Trident/.test(ua))
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

      if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          var loaded;
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          loaded = pollWebKit();
          
          if (loaded) {
            i--;
            len = pendingUrls.length;
            continue;
          }
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
    var css = pending.css, i, ret = false;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          ret = true;
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
    return ret;
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
;(function(w, undefined) {
    var exports = w,
        cache = {},         // resourceMap cache
        cacheMaxTime = 0,   // 缓存时间
        appOptions = {},    // app页面管理的options
        curPageUrl,
        isPushState,
        layer,              // 事件代理层
        urlReg = /^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/i;

    /**
     * 启动页面管理
     * @param  {Object} options 初始化参数
     * @param {String} options["selector"] 全局代理元素的选择器匹配，写法同 document.querySeletor 函数
     * @param {Number} options["cacheMaxTime"] 页面缓存时间
     * @param {Function|RegExp} options["validate"] url验证方法，
     * @return {void}
     */

    function start(options) {

        /**
         * 默认参数 {
         *     selector : <string> // 代理元素的选择器规则
         *     cacheMaxTime: <integer> //缓存存活时间，默认5min
         * }
         */
        var defaultOptions = {
            selector: "a,[data-href]",
            cacheMaxTime: 5 * 60 * 1000,
            pushState : true,
            layer : document.body
        };

        appOptions = merge(defaultOptions, options);
        cacheMaxTime = appOptions.cacheMaxTime;
        isPushState = appOptions.pushState;
        layer = getLayer(appOptions.layer);

        curPageUrl = getCurrentUrl();

        if(isPushState === true){
            // 绑定事件
            bindEvent();
        }
    }

    /**
     * 事件绑定
     * @return {void}
     */

    function bindEvent() {
        // 处理history.back事件
        window.addEventListener('popstate', onPopState, false);
        // 全局接管指定元素点击事件
        layer.addEventListener('click', proxy, true);
        // bigpipe回调事件
        BigPipe.on('pagerendercomplete', onPagerendered, this); // 执行完页面的ready函数后触发

        // 页面数据到达的时候派发事件
        BigPipe.on('pagearrived', onPageArrived, this); 

        // 页面内所有的样式JS都被加载完成后触发
        BigPipe.on('onpageloaded', onPageLoaded, this); 
    }

    function getLayer(ele) {
        if(typeof ele === "string") {
            return document.querySelector(ele);
        } else if (ele && ele.nodeType) {
            return ele;
        } else {
            return document.body
        }

    }


    /**
     * 处理popstate事件，响应历史记录返回
     * @param  {PopStateEvent} e popstate事件对象
     * @return {void}
     */

    function onPopState(e) {

        var currentUrl = getCurrentUrl();

        if (!curPageUrl || currentUrl === curPageUrl) {
            return;
        }

        trigger('onpagerenderstart');
        fetchPage(currentUrl, e.state);
    }

    /**
     * 渲染完成事件函数
     * @param  {String} obj bigpipe回传事件参数
     * @return {void}
     */

    function onPagerendered(obj) {
        cache[obj.url] = {
            resource: obj.resource,
            time: Date.now()
        };

        //page render end
        trigger('onpagerendercomplete',{
            url : obj.url
        });
    }

    function onPageArrived(options){
        trigger('onpagearrived',options);
    }

    function onPageLoaded() {
        trigger('onpageloaded');
    }

    /**
     * 简单merge两个对象
     * @param {object} _old
     * @param {object} _new
     * @returns {*}
     */

    function merge(_old, _new) {
        for (var i in _new) {
            if (_new.hasOwnProperty(i)) {
                _old[i] = _new[i];
            }
        }
        return _old;
    }

    /**
     * 事件代理
     * @param {MouseEvent} 点击事件对象
     */

    function proxy(e) {
        var element = e.target,
            parent = element,
            selector = appOptions.selector;


        while (parent !== document.body) {

            if (matchSelector(parent, selector)) {

                urlAttr = parent.tagName.toLowerCase() === "a" ? "href" : "data-href";
                url = parent.getAttribute(urlAttr);

                // 验证url, 可以自行配置url验证规则
                if (validateUrl(url)) {

                    e.stopPropagation();
                    e.preventDefault();

                    var opt = {
                        replace: parent.getAttribute("data-replace") || false,
                        containerId: parent.getAttribute("data-area"),
                        pagelets: parent.getAttribute("data-area"),
                        target : parent
                    }

                    redirect(url, opt);
                }
                return;
            } else {
                parent = parent.parentNode;
            }
        }
    }

    /**
     * 检查元素是否匹配选择器
     * @param  {HTMLElement} element
     * @param  {String} selector 选择器规则
     * @return {boolean}
     */

    function matchSelector(element, selector) {
        if (!element || element.nodeType !== 1) {
            return false
        }

        var parent,
            match,
            matchesSelector = element.webkitMatchesSelector || element.matchesSelector;

        if (matchesSelector) {
            match = matchesSelector.call(element, selector)
        } else {
            parent = element.parentNode;
            match = !! parent.querySelector(selector);
        }

        return match;
    }

    /**
     * 验证URL是否符合validate规则
     * @param  {string} url
     * @return {boolean}
     */

    function validateUrl(url) {
        var validate = appOptions.validate,
            type = Object.prototype.toString.call(validate);

        if (type === "[object RegExp]") {
            return validate.test(url);
        } else if (type === "[object Function]") {
            return validate(url);
        } else {
            return true;
        }
    }

    /**
     * 获取url的pathname 和 query部分
     * @param  {String} url
     * @return {String}     返回url的pathname 和 query部分
     */

    function getUrl(url) {
        if (urlReg.test(url)) {
            return RegExp.$5 + (RegExp.$6 ? RegExp.$6 : "");
        } else {
            "console" in window && console.error("[url error]:", url);
        }

    }

    /**
     * 获取当前的url
     * @return {String} 获取当前url
     */

    function getCurrentUrl() {
        return getUrl(window.location.href)
    }

    /**
     * 跳转页面
     * @param {String} url      目标页面的url
     * @param {Object} options  跳转配置参数
     * @param {Array|String} options[pagelets]  请求的pagelets
     * @param {String} options[containerId]  pagelets渲染容器
     * @param {Boolean} options[trigger]  是否触发加载
     * @param {Boolean} options[forword]  是否替换URL
     * @param {Boolean} options[replace]  是否替换当前历史记录
     * @param {HTMLElement} options[target]  触发跳转的DOM元素
     */

    function redirect(url, options) {
        url = getUrl(url);

        // 如果url不变则不加载
        if(getCurrentUrl() === url) {
            return;
        }

        var method,
            defaultOptions = {
                trigger: true,
                forword: true,
                replace: false
            },
            eventsOptions = {
                url : url
            };


        options = merge(defaultOptions, options);
        eventsOptions.target = options.target || null;
        // tirgger 状态不进行页面获取，只切换URL
        if(options.trigger === false) {
            if(isPushState) {
                method = options.replace ? "replaceState" : "pushState";
                window.history[method]({}, document.title, url);
            }
            return;
        }

        if (!isPushState) {
            options.replace ? (location.replace(url)) : (location.href = url);
            return;
        }

        //page render start
        trigger('onpagerenderstart' , eventsOptions);

        // 之所以放在页面回调中替换历史记录，是因为在移动端低网速下
        // 有可能后续页面没有在下一次用户操作前返回，而造成添加无效历史记录的问题
        fetchPage(url, options, function(){
            if (options.forword) {
                method = options.replace ? "replaceState" : "pushState";
                window.history[method]({}, document.title, url);
            }
        });
    }

    function fetchPage (url, options, callback){
        if(!url) {
            return;
        }
        var now = Date.now(),
            options = options || {},
            pageletsParams = [],
            opt = {},
            containerId = options.containerId ? options.containerId : appOptions.containerId,
            pagelets = options.pagelets ? options.pagelets : appOptions.pagelets;

        if(typeof pagelets === "string" ) {
            pagelets = [pagelets]
        }

        curPageUrl = url;

        if (pagelets.length > 0) {
            for (var i = 0, len = pagelets.length; i < len; i++) {
                pageletsParams.push('pagelets[]=' + pagelets[i]);
            }
            url = (url.indexOf('?') === -1) ? url + '/?' + pageletsParams.join('&') : url + '&' + pageletsParams.join('&');
        }

        (options.cache === false) && (opt.cache = false);

        BigPipe.refresh(url, containerId, opt, function(){
            callback && callback();
        })
    }

    // -------------------- 事件队列 --------------------
    var SLICE = [].slice;
    var events = {};

    function trigger(type /* args... */ ) {
        var list = events[type];
        if (!list) {
            return;
        }

        var arg = SLICE.call(arguments, 1);
        for (var i = 0, j = list.length; i < j; i++) {
            var cb = list[i];
            if (cb.f.apply(cb.o, arg) === false) {
                break;
            }
        }
    }

    function on(type, listener, context) {
        var queue = events[type] || (events[type] = []);
        queue.push({
            f: listener,
            o: context
        });
    }

    exports.appPage = {
        start: start,
        redirect: redirect,
        on: on
    };

    // 模块化支持
    if ("define" in window && typeof module != "undefined") {
        module.exports = exports.appPage
    }

})(this);

;/**
 * @fileoverview 底层数据交互模块(简版是多页系统 修改了一些策略)
 * @author yuanzhijia@baidu.com
 */
define('common:static/js/searchdata.js', function (require, exports, module) {
 /**
*本模块一般都是在其他定位模块中引用 为了避免浪费，名字一致
 */
var util,location; 
if (!util) {
   util = require('common:static/js/util.js');
};
if (!location) {
    location = require('common:widget/geolocation/location.js');
};
var searchData = {
    _cache: {
        length: 0,
        index: 0,
        data: {}
    },
    /**
     * 获取数据
     * @param {string} 请求的url
     * @param {Function} 成功回调函数
     * @param {Function} 失败回调函数
     */
    fetch: function(url, successCallback, errorCallback) {
        if (!url) {
            return;
        }
        url = this._processUrl(url);
        if (this._getCacheData(url)) {
            successCallback && successCallback(this._getCacheData(url));
        } else {
            // 通过服务器获取数据并存入缓存
            var me = this;
            $.ajax({
                'url': "http://map.baidu.com"+url,
                'dataType': 'jsonp', // 需要指名类型为text否则zepto会自行解析，但是zepto解析会失败，具体原因尚未查明
                'success' : function(response){
                    try {
                        //eval('var json = ' + response);
                        var json = response;
                        me._saveToCache(url, json);
                        // 派发成功事件
                        successCallback && successCallback(json);
                    } catch (e){
                        errorCallback && errorCallback();
                    }
                },
                'error': function(xhr, errorType){
                    errorCallback && errorCallback();
                }
            });
        }
    },
    /**
     * 处理url，增加一些统一的参数
     * @param {string} 处理之前的url
     * @return {string} 处理之后的url
     */
    _processUrl: function(url){
        // 从老代码copy过来，把“<”和“>”改成空格，目的是啥不知道 by jiazheng
        //应该是防止Sql注入一类的事件发生 by yuanzhijia
        url = url.replace(/%3C/gi,encodeURIComponent(' ')).replace(/%3E/gi,encodeURIComponent(' '));
        // 增加统一的参数
        // format 参数作用？
        // 添加平台参数，以便和主站query区分。
        var platform = '&from=maponline';
        // tn参数，可能是以前用来统计的，需要进一步检查
        var tn = '&tn=m01';
        // 输入编码
        var inputEncode = '&ie=utf-8';
        // 添加掌百快搜项目统计参数 by jican 20110726
        // 统计参数
        // 建议这个参数通过老url适配代码进行处理
        // var uaParam = this._getUA() ? ("&" + this._getUA()) : "";
        
        // 数据版本
        // 如果某次升级导致前后数据必须进行同步处理，则数据版本号需要变化
        // 如果能够保证数据兼容，则可不进行改动
        var dataVersion = "&data_version=11252019";
        // 监测url是否包含根目录
        var urlPre = '';
        if (url.indexOf('/') != 0) {
            urlPre = '/mobile/?';
        }
        url = urlPre + url + 
            platform + 
            tn +
            inputEncode + 
            dataVersion;
        return url;
    },
    /**
     * 获取缓存数据
     * @param {string} 该数据对应的url
     * @return {object} 数据内容
     */
    _getCacheData: function(url){

        // todo: 获取cache时可以考虑将该数据的index放在最后，说明是最近一次访问过的
        return (this._cache.data[url] && this._cache.data[url].response) || null;

    },
    /**
     * 保存数据到缓存
     * @param {string} url，作为数据的key
     * @param {object} 数据结果
     */
    _saveToCache: function(url, response){
        if (this._cache.length >= searchData.MAX_CACHE) {
            this._removeOldData();
        }
        
        var index = this._cache.index;
        this._cache.data[url] = {
            'index': index,
            'response': response
        }
        this._cache.length ++;
        this._cache.index ++;
    },
    /**
     * 移除较老的数据，腾出缓存空间
     */
    _removeOldData: function(){
        var count = 5;
        var sortArr = [];
        for (var url in this._cache.data) {
            sortArr.push({'url': url, 'index': this._cache.data[url].index});
        }
        
        // 根据index排序
        sortArr.sort(function(a, b){
            return a.index - b.index;
        });
        // 将最老的数据移除
        count = count > sortArr.length ? sortArr.length : count;
        for (var i = 0; i < count; i ++) {
            delete this._cache.data[sortArr[i].url];
        }
        this._cache.length -= count;
    }
};
/**
 * 最大缓存的数据条数
 */
searchData.MAX_CACHE = 10;
// 单例输出
module.exports  = searchData;
});


;define('common:widget/popup/popup.js', function(require, exports, module){

/**
 * @fileOverview 弹出浮层
 * @author liushuai02@baidu.com
 * @requires common:static/js/zepto
 */
/**
 * @module common:widget/popup
 */
module.exports = {
    /**
     * 默认配置
     * @type {object}
     * @private
     */
    _defaultOptions: {
        autoCloseTime: 2000,
        isTouchHide :false
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
        var $el, $layer, offset;

        if (options.layer) {
            $layer = $('<div/>').addClass('common-widget-popup-layer')
                .appendTo(document.body);
        }

        $el = $('<div></div>')
            .addClass('common-widget-popup')
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
        if($el.css('display') === 'none') {
            // 缓存元素之前的visibility属性
            visibility = $el.css('visibility');
            $el.css({
                visibility: 'visibile'
            }).show();
        }
        offset = $el.offset();
        $el.css({
            left: (innerWidth - offset.width) / 2,
            top: (innerHeight - offset.height) / 2,
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
        var callback, self = this;


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
        if(options.isTouchHide){
            this._$el.on('click', function(e) {
                e.stopPropagation();
                $("#bmap_pop_cover").hide();
                self.close();
                this._boxTouchHandle = arguments.callee;
                this._$el.off("click", arguments.callee);
            });
            $(document.body).on('click', function(e) {
                e.stopPropagation();
                $("#bmap_pop_cover").hide();
                self.close();
                this._docTouchHandle = arguments.callee;
                $(document.body).off("click", arguments.callee);
            });
        }else {
            if(this._boxTouchHandle) {
                this._$el.off('click', this._boxTouchHandle);
            }
            if(this._docTouchHandle) {
                $(document.body).off('click', this._docTouchHandle);
            }
        }

        listener.on('common','sizechange', function() {
            setTimeout(function() {
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
    setPos : function() {
        if (this._$el) {
            var offset = this._$el.offset();
            var posX = (window.innerWidth - offset.width) / 2;
            var posY = (window.innerHeight - offset.height) / 2 + window.scrollY;
            this._$el.css({
              "left":  posX,
              "top": posY
            });
        }
    }
};



});
;define('common:widget/md5/md5.js', function(require, exports, module){

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */

module.exports = (function(){


  var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
  var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
  var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
  function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
  function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
  function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
  function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
  function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

  /*
   * Perform a simple self-test to see if the VM is working
   */
  function md5_vm_test()
  {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
  }

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length
   */
  function core_md5(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

      a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

      a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

      a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = safe_add(a, olda);
      b = safe_add(b, oldb);
      c = safe_add(c, oldc);
      d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

  }

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  function md5_cmn(q, a, b, x, s, t)
  {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
  }
  function md5_ff(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }
  function md5_gg(a, b, c, d, x, s, t)
  {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }
  function md5_hh(a, b, c, d, x, s, t)
  {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5_ii(a, b, c, d, x, s, t)
  {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  /*
   * Calculate the HMAC-MD5, of a key and some data
   */
  function core_hmac_md5(key, data)
  {
    var bkey = str2binl(key);
    if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
  }

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  function safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  function bit_rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  /*
   * Convert a string to an array of little-endian words
   * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
   */
  function str2binl(str)
  {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz)
      bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
    return bin;
  }

  /*
   * Convert an array of little-endian words to a string
   */
  function binl2str(bin)
  {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < bin.length * 32; i += chrsz)
      str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
    return str;
  }

  /*
   * Convert an array of little-endian words to a hex string.
   */
  function binl2hex(binarray)
  {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++)
    {
      str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
             hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
    }
    return str;
  }

  /*
   * Convert an array of little-endian words to a base-64 string
   */
  function binl2b64(binarray)
  {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i += 3)
    {
      var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                  | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                  |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
        else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
      }
    }
    return str;
  }

  return hex_md5;
})();


});
;define('common:widget/login/login.js', function(require, exports, module){

/**
 * 用于登陆跳转  by xuyihan
 */

var util = require('common:static/js/util.js');
var cookie = require("common:widget/cookie/cookie.js");
var stat = require('common:widget/stat/stat.js');
var url = require('common:widget/url/url.js');
var md5 = require('common:widget/md5/md5.js');
module.exports = {

    init: function(){
        _init();
    },
    /**
     * 判断用户是否登陆
     * @return {status: boolean, username: String}
     */
    checkLogin: function(callback){
        $.ajax({
            'type': 'GET',
            'url': 'http://mc.map.baidu.com/passport/Session3.php?t=' + Date.now(),
            'dataType': 'jsonp',
            'timeout': 2000,
            'success': function(data, status, xhr) {
                if (status == 'success' && data.bdErrCode == "0" && data.displayname != "") {
                    var options = {
                        domain: location.hostname,
                        path: '/mobile',
                        expires: 7 * 24 * 60 * 60 * 1000
                    };
                    cookie.set("myUserName", data.displayname, options);
                    if(localStorage['loginErr']){
                        stat.addCookieStat(COM_STAT_CODE.STAT_USER_LOGIN_SUCCESS);
                        localStorage.removeItem('loginErr');
                    }

                    callback && callback({
                        status: true,
                        username: data.displayname
                    });

                    return true;
                } else {
                    localStorage['loginErr'] = 1;
                    callback && callback({
                        status: false,
                        username: ""
                    });
                }
            },
            'error': function(xhr, errorType, error) {
                localStorage['loginErr'] = 1;
                callback && callback({
                    status: false,
                    username: ""
                });
                return false;
            }
        });
    },
    loginAction: function(callback) {

        stat.addCookieStat(COM_STAT_CODE.STAT_USER_LOGIN_SHOW);
        location.href = 'http://wappass.baidu.com/passport/?authsite=1&u=' + encodeURIComponent(document.location);

    },

    logoutAction: function(callback) {

        stat.addCookieStat(COM_STAT_CODE.STAT_USER_MYCENTER_LOGOUT_CLICK);
        cookie.remove('myUserName');
        location.href = 'http://wappass.baidu.com/passport/?logout&u=http://' + location.host + '/mobile/webapp/index/index/force=simple';
    },

    goMycenter: function() {
        stat.addCookieStat(COM_STAT_CODE.STAT_INDEX_HEAD_MYCENTER_CLICK);
        url.navigate('/mobile/webapp/user/mycenter/force=simple');
    },

    makeSysSign: function(a) {
        var b = [];
        var str = "";
        for (var i in a) {
            b.push(i);
        }
        for (var j = 0; j < b.length; j++) {
            str += b[j] + "=" + encodeURIComponent(a[b[j]]);
        }

        return hex_md5(str);
    },
    _init: function() {
        var url1 = location.search;
        var url2 = location.search.substr(location.search.indexOf("shopId") + 7);
        if (url2.indexOf("&") != -1) {
            window.config.shopId = url2.substr(0, url2.indexOf("&"));
            window.config.isappInstalled = url2.substr(url2.indexOf("isappInstalled") + 15);
        } else {
            window.config.shopId = url2.substr(0);
            window.config.isappInstalled = 0;
        }
        if ((/android/gi).test(navigator.appVersion)) {
            window.config.platform = "android"; //test
        }
        if ((/iphone|ipad/gi).test(navigator.appVersion)) {
            window.config.platform = "iphone";
        }
        var temp_url = url1.substr(url1.indexOf("?from=") + 6)
        $("open").href = temp_url.substr(0, temp_url.indexOf("&"));

        var para = {
            fields: '{"extends":{"more":1}}',
            sysTerminalType: window.config.platform + window.config["token_" + window.config.platform]
        };
        var sysSign = makeSysSign(para);
        var fullurl = window.config.dataSource + window.config.shopId + "?sysSign=" + sysSign + "&fields=" + para.fields + "&sysTerminalType=" + window.config.platform;
        scriptRequest(encodeURIComponent(fullurl), "makeData");
    }
};


});
;define('common:widget/apphistory/apphistory.js', function(require, exports, module){

/**
 * 判断是否是相同host
 * @return {Boolean}
 */
var isAppNavigator = function () {
	var referHost = getReferHost();
	return window.location.host === referHost;
};

var getReferHost = function () {
	var refer = document.referrer,
		hostReg = /^.*?\/\/(.*?)(\/|\?|\#|$)/i,
		match = refer.match(hostReg),
		referHost;
	if(match) {
		referHost = match[1];
	}

	return referHost;
};

var isLanding = function () {
	var referHost = getReferHost();
	return window.location.host !== referHost;
};

module.exports = {
	isLanding : isLanding,
	isAppNavigator : isAppNavigator
};

});
;define('common:widget/backtop/backtop.js', function(require, exports, module){

var $el = $('.common-widget-back-top');

// require阶段只会执行一次，保证scroll事件在全局只绑定一次
$(window).on('scroll', function() {
    if(window.scrollY < window.innerHeight/2) {
        $el.hide();
    } else {
        $el.show();
    }
});

module.exports = {
    /**
     * init方法每次quickling之后都会执行
     */
    init: function () {
        // 更新$el引用
        $el = $('.common-widget-back-top');
        $el.on('click', function() {
            window.scrollTo(0, 1);
        });
    }
};

});
;define('common:widget/bottombanner/bottombanner.js', function(require, exports, module){

'use strict';

var util = require('common:static/js/util.js'),

    bottomBanner = {
        /**
         * 加载CMS广告配置文件
         */
        loadCmsAdConfig: function (callback) {
            var t = new Date().getTime(),
                head = document.getElementsByTagName('HEAD').item(0),
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.src = 'http://map.baidu.com/zt/cms/ws.js?' + t;
            script.onload = $.proxy(callback, this);
            head.appendChild(script);
        },
        /**
         * 获取当前哈希
         * @returns {Object}
         */
        getCurrentHash: function () {
            var appHash = window._APP_HASH,
                curHashStr = window.location.pathname.replace('/mobile/webapp/', ''),
                hashArrs = curHashStr.split('/'),
                query = hashArrs[2],
                pageState = hashArrs[3];

            return {
                'module': appHash.module,
                'action': appHash.action,
                'query': util.urlToJSON(query || ''),
                'pageState': util.urlToJSON(pageState || '')
            };
        },
        checkDisplayBanner: function (hashObj) {
            var status = [], subStatus, op, v, qm, pn,
                bottomBannerDisplayRule = window.bottomBannerDisplayRule,
                module = hashObj.module,
                action = hashObj.action,
                query = hashObj.query,
                pagestate = hashObj.pageState;

            if (!bottomBannerDisplayRule) {
                return false;
            }

            $.each(bottomBannerDisplayRule, function (i, rl) {
                subStatus = [];

                if (rl['module']) {
                    op = rl['module'].substring(0, 1);
                    v = rl['module'].substring(1);

                    subStatus.push(op === '!' ? v.indexOf(module) === -1 : v.indexOf(module) > -1);
                }

                if (rl['action']) {
                    op = rl['action'].substring(0, 1);
                    v = rl['action'].substring(1);
                    subStatus.push(op === '!' ? v.indexOf(action) === -1 : v.indexOf(action) > -1);
                }

                if (rl['query']) {
                    $.each(rl['query'], function (m, qp) {
                        op = qp.substring(0, 1);
                        v = qp.substring(1);
                        qm = query[m] || undefined;
                        subStatus.push(op === '!' ? v.indexOf(qm) === -1 : v.indexOf(qm) > -1);
                    });
                }

                if (rl['pagestate']) {
                    $.each(rl['pagestate'], function (n, pp) {
                        op = pp.substring(0, 1);
                        v = pp.substring(1);
                        pn = pagestate[n] || undefined;
                        subStatus.push(op === '!' ? v.indexOf(pn) === -1 : v.indexOf(pn) > -1);
                    });
                }
                status.push(subStatus.indexOf(false) === -1);
            });

            if (status.indexOf(true) !== -1) {
                return true;
            }
            return false;
        },

        isHideBanner: function() {
            if(this.bannerHide) {
                localStorage['hbt'] = Date.now();
                return true;
            }else{
                if(localStorage['hbt']){
                    //设置有效期为15分钟
                    if(Date.now() > Number(localStorage['hbt']) + 1000*60*15){
                        localStorage.removeItem('hbt');
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return false;
                }
            }
        },
        getPageConfig: function () {
            var opts = this.getCurrentHash(),
                module = opts.module,
                action = opts.action,
                query = opts.query,
                pageState = opts.pageState,
                config = {},
                cmsList, transiWds, driveWds;
            this.cmsDisplayRule = window.bottomBannerDisplayRule;
            
            var cmsConfig = window.webapp_cms_bottom_download_img;
            if(_APP_HASH.third_party){
                var cmsThirdPartyConfig = window['third_'+_APP_HASH.third_party+'_bottom_config'];
                if(cmsThirdPartyConfig){
                    $.each(cmsThirdPartyConfig, function (k, v) {
                        cmsConfig[k] = v;
                    });
                }
            }
            //this.isHideBanner()是url中viewmode=no_ad控制，后端传递
            if (!cmsConfig || !this.checkDisplayBanner(opts) || this.isHideBanner()) {
                return null;
            }

            //try 是保证该模块都没有配置的情况，如果该模块没有配置就置null
            try {
                cmsList = cmsConfig[module][action];
            } catch (e) {
                cmsList = null;
            }

            try {
                if (cmsConfig && cmsConfig.wd) {
                    transiWds = new RegExp(cmsConfig.wd.transitType, 'g');
                    driveWds = new RegExp(cmsConfig.wd.driveType, 'g');
                }
            } catch (e) {
            }

            //如果满足公交类型关键字的检索
            if (query.wd && query.wd.search(transiWds) > -1) {
                try {
                    cmsList = cmsConfig['transit']['list'];
                    //如果抛出异常,说明  transit 这个模块配置不存在，不处理这种异常的结果
                } catch (e) {
                }
                //如果满足驾车类型关键字的检索
            } else if (query.wd && query.wd.search(driveWds) > -1) {
                try {
                    cmsList = cmsConfig['drive']['list'];
                    //如果抛出异常,说明  drive 这个模块配置不存在，不处理这种异常的结果
                } catch (e) {
                }
            } else if (pageState.detail_part === 'groupon') {
                //团购页， 如果有配置
                cmsList = cmsConfig['groupon'] || cmsList;
            }

            if (!cmsList) {
                if (cmsConfig['other']) {
                    cmsList = cmsConfig['other'];
                } else {
                    return null;
                }
            }

            if (!cmsList) {
                return null;
            }
            config.needOpen = cmsList.openUrl ? true : false;
            config.bgUrl = cmsList.openUrl && this.hasInstalled ? cmsList.openUrl : cmsList.downloadImgUrl;

            if (util.isIPhone()) {
                config.srcUrl = cmsList.iponeSrc;
            } else if (util.isAndroid()) {
                config.srcUrl = cmsList.androidSrc;
            } else if (util.isIPad()) {
                config.srcUrl = cmsList.ipadSrc;
            } else {
                config.srcUrl = cmsList.androidSrc;
            }
            return config;
        },
        renderAfterLoaded: function () {
            this.config = this.getPageConfig();

            if (this.config && this.config.bgUrl) {
                this.$el
                    .css('background-image', 'url(' + this.config.bgUrl + ')')
                    .attr('data-href', this.config.srcUrl)
                    .show();

                listener.trigger('common', 'sizechange');
            } else {
                this.$el.hide();
            }
        },
        init: function (bannerHide) {
            this.bannerHide = bannerHide || false;
            this.loadCmsAdConfig(function () {
                var me = this;
                this.$el = $('.common-widget-bottom-banner');
                this.$el.on('click', function() {
                    if(me.hasInstalled && me.config.needOpen) {
                        location.href = 'bdapp://map/';
                    } else {
                        open($(this).attr('data-href'), '_blank');
                    }
                });

                if (window.webapp_cms_bottom_download_img) {
                    if (this.hasInstalled === undefined) {
                        util.getNativeInfo('com.baidu.BaiduMap', function (data) {
                            me.hasInstalled = (data.error === 0);
                            me.renderAfterLoaded();
                        }, function () {
                            me.hasInstalled = false;
                            me.renderAfterLoaded();
                        });
                    } else {
                        me.renderAfterLoaded();
                    }
                }
            });
        }
    };

module.exports = bottomBanner;

});
;define('common:widget/cover/cover.js', function(require, exports, module){

/**
 * @fileOverview 下载客户端封面
 * @author houhongru@baidu.com
 * @date 2013-10-28
 */

/* Configuration for jshint Gutter (Sublime plugin) */
/* global $:false, require:false, module:false */

'use strict';

var cookie = require('common:widget/cookie/cookie.js'),
    stat = require('common:widget/stat/stat.js'),
    util = require("common:static/js/util.js");

module.exports = {
    netype: 0,
    os: util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown",
    /**
     * 初始化，如果符合展示封面条件，则绑定监听事件，并显示封面
     */
    init: function() {
        this.initOpenDownload();
    },

    sendStat : function() {
        if(__cover.hasClosed === true) {
            stat.addStat(COM_STAT_CODE.COVER_HIDE, {'os': this.os});
            // 重置参数，防止统计重发
            __cover.hasClosed = false;
        }
    },

    /**
     * 显示封面
     */
    showCover: function() {
        stat.addStat(COM_STAT_CODE.COVER_DISPLAY, {'os': me.os}); 
    },

    /**
     * 显示Webapp
     */
    showWebapp: function() {
        var me = this;
        stat.addStat(COM_STAT_CODE.COVER_HIDE, {'os': me.os}); 
        $('#body-cover').css({
            display: 'none'
        });
        $('#wrapper').css('display','block');
    },

    /**
     * 下载客户端
     */
    initOpenDownload: function() {
        var me = this;
        var download_open_href = $("#app-download"),
            download_open_txt = $("#download_open");
        download_open_href.attr('data', util.getClientUrl('download'));
        util.isInstalledClient(function(openurl) {
            download_open_txt.html('打开');
            download_open_href.attr('data', openurl);
            util.bindHrefStat(download_open_href, function(){
                stat.addStat(COM_STAT_CODE.COVER_APP_OPEN, {'os': me.os});
            });
        }, function(downloadurl) {
            download_open_txt.html('下载');
            download_open_href.attr('data', downloadurl);
            util.bindHrefStat(download_open_href, function(){
                stat.addStat(COM_STAT_CODE.COVER_APP_DOWNLOAD, {'os': me.os});
            });
        });
    },

    /**
     * 关闭封面
     */
    closeCover: function() {

        var options = {
            // domain: 'map.baidu.com',
            path: '/mobile',
            expires: 24 * 60 * 60 * 1000
        };

        cookie.set('hdCover', 1, options);
        this.showWebapp();
    }
    
};

});
;define('common:widget/datepicker/datepicker.js', function(require, exports, module){

/**
 *  @file 实现了通用highlight方法。
 *  @name Highlight
 *  @desc 点击高亮效果
 *  @import core/zepto.js
 */
var Zepto = $;

(function($) {
    var actElem, inited = false, timer, cls, removeCls = function(){
        clearTimeout(timer);
        if(actElem && (cls = actElem.attr('highlight-cls'))){
            actElem.removeClass(cls).attr('highlight-cls', '');
            actElem = null;
        }
    };
    $.extend($.fn, {
        /**
         * @name highlight
         * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class
         * @grammar  highlight(className)   ⇒ self
         * @example var div = $('div');
         * div.highlight('div-hover');
         *
         * $('a').highlight();// 把所有a的自带的高亮效果去掉。
         */
        highlight: function(className) {
            inited = inited || !!$(document).on('touchend.highlight touchmove.highlight touchcancel.highlight', removeCls);
            removeCls();
            return this.each(function() {
                var $el = $(this);
                $el.css('-webkit-tap-highlight-color', 'rgba(255,255,255,0)').off('touchstart.highlight');
                className && $el.on('touchstart.highlight', function() {
                    timer = setTimeout(function(){
                        actElem = $el.attr('highlight-cls', className).addClass(className);
                    }, 100);
                });
            });
        }
    });
})(Zepto);


(function($, undefined){
    var record = (function(){// getter|setter
            var rid = 0,
                records = {},
                key = 'dp' + (+new Date());
            return function(node, val){
                var id = node[key] || (node[key] = rid++);
                val!==undefined && (val ? records[id] = val: delete records[id]);
                return records[id];
            }
        })(),
        slice = Array.prototype.slice,
        monthNames = ["01月", "02月", "03月", "04月", "05月", "06月",
            "07月", "08月", "09月", "10月", "11月", "12月"],
        dayNames = ["日", "一", "二", "三", "四", "五", "六"],
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,
    //获取月份的天数
        _getDaysInMonth = function (year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },
    //获取月份中的第一天是所在星期的第几天
        _getFirstDayOfMonth = function (year, month) {
            return new Date(year, month, 1).getDay();
        };

    //@todo 支持各种格式
    $.datepicker = {
        parseDate:function (obj) {
            var dateRE = /^(\d{4})\-(\d{1,2})\-(\d{1,2})$/;//yyyy-mm-dd
            return typeof obj === 'object' ? obj: dateRE.test(obj)? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10)-1, parseInt(RegExp.$3, 10)):null;
        },
        parseDateList: function (list) {
            var rs = [];
            for (var i = 0; i < list.length; i++) {
                rs.push($.datepicker.parseDate(list[i]));
            }
            return rs;
        },
        formatDate:function (date) {
            var formatNumber = $.datepicker.formatNumber;
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        },
        formatNumber:function (val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        }
    }

    function datepicker(el, options){
        this._el = $(el);
        this._data = $.extend({
            date:null, //默认日期
            firstDay:1, //星期天用0表示, 星期一用1表示, 以此类推.
            maxDate:null, //可以选择的日期范围
            minDate:null,
            container:null, //如果为非inline模式，且不想再input的下面直接生成结构那就指定container.
            gap:true,//是否显示间隙，星期列表与天数列表之间
            dateList: [] //业务中可能存在非连续可选日期，一旦设置dateList,则不再进行minDate与maxDate判断
        }, options);
        record(el, this);
        this._init();
    }

    $.extend(datepicker.prototype, {

        /**
         * @name root
         * @grammar root() ⇒ value
         * @grammar root(el) ⇒ value
         * @desc 设置或者获取根节点
         * @example
         * $('a#btn').button({label: '按钮'});
         *
         */
        root: function(el) {
            return this._el = el || this._el;
        },
        /**
         * @name on
         * @grammar on(type, handler) ⇒ instance
         * @desc 绑定事件，此事件绑定不同于zepto上绑定事件，此On的this只想组件实例，而非zepto实例
         */
        on: function(ev, callback) {
            this.root().on(ev, $.proxy(callback, this));
            return this;
        },

        /**
         * @name off
         * @grammar off(type) ⇒ instance
         * @grammar off(type, handler) ⇒ instance
         * @desc 解绑事件
         */
        off: function(ev, callback) {
            this.root().off(ev, callback);
            return this;
        },

        /**
         * @name trigger
         * @grammar trigger(type[, data]) ⇒ instance
         * @desc 触发事件, 此trigger会优先把options上的事件回调函数先执行，然后给根DOM派送事件。
         * options上回调函数可以通过e.preventDefaualt()来组织事件派发。
         */
        trigger: function(event, data) {
            event = typeof event === 'string' ? $.Event(event) : event;
            var _data = this._data, onEvent = _data[event.type],result;
            if( onEvent && typeof onEvent === 'function' ){
                event.data = data;
                result = onEvent.apply(this, [event].concat(data));
                if(result === false || event.defaultPrevented){
                    return this;
                }
            }
            this.root().trigger(event, data);
            return this;
        },

        _init: function(){
            var data = this._data, eventHandler = $.proxy(this._eventHandler, this);
            data._container = this._el;
            this.date(data.date || new Date())
                .minDate(data.minDate)
                .maxDate(data.maxDate)
                .dateList(data.dateList)
                .refresh();
            data._container.addClass('ui-datepicker').on('click', eventHandler).highlight();
            data._isShow = data._inited =true;
        },

        _eventHandler: function(e){
            var match, me = this, data = me._data, root = data._container, target,
                cell;
            target = e.target;
            if ((match = $(target).closest('.ui-datepicker-calendar tbody a', root.get(0))) && match.length) {
                e.preventDefault();
                cell = match.parent();
                this.selectedDate(new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));
                this._commit();
                this.refresh();
            } else if ((match = $(target).closest('.ui-datepicker-prev, .ui-datepicker-next', root.get(0))) && match.length) {
                e.preventDefault();
                setTimeout(function(){
                    me.goTo((match.is('.ui-datepicker-prev') ? '-' : '+') + '1M');
                }, 0);
            }
        },
        _checkUnSelectable: function (printDate) {
            var minDate = this.minDate();
            var maxDate = this.maxDate();
            var dateList = this.dateList();
            var unselectable = false;
            var temp;
            if (dateList.length) {
                for (var i = 0; i < dateList.length; i++) {
                    temp = printDate - dateList[i];
                    if (!temp) {
                        return false;
                    }
                }
                return true;
            } else {
                return (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
            }
        },
        _generateHTML:function () {
            var data = this._data, html = '', thead, tbody, i, j, firstDay, day, leadDays, daysInMonth, rows,
                printDate, drawYear = data._drawYear, drawMonth = data._drawMonth, otherMonth, unselectable,
                tempDate = new Date(), today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()),
                minDate = this.minDate(), maxDate = this.maxDate(), selectedDate = this.selectedDate();

            firstDay = parseInt(data.firstDay, 10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);

            html += '<div class="ui-datepicker-header">' +
                '<a class="ui-datepicker-prev" href="#">&lt;&lt;</a>' +
                '<div class="ui-datepicker-title">'+data._drawYear+'年'+monthNames[data._drawMonth]+'</div>' +
                '<a class="ui-datepicker-next" href="#">&gt;&gt;</a>' +
                '</div>';

            thead = '<thead><tr>';
            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;
                thead += '<th' + ((i + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }
            thead += '</thead></tr>';

            tbody = '<tbody>';
            tbody += data.gap ? '<tr class="ui-datepicker-gap"><td colspan="7">&#xa0;</td></tr>' : '';
            daysInMonth = _getDaysInMonth(drawYear, drawMonth);
            leadDays = (_getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
            rows = Math.ceil((leadDays + daysInMonth) / 7);
            printDate = new Date(drawYear, drawMonth, 1 - leadDays);
            for (i = 0; i < rows; i++) {
                tbody += '<tr>';
                for (j = 0; j < 7; j++) {
                    otherMonth = (printDate.getMonth() !== drawMonth);
                    // unselectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                    unselectable = otherMonth || this._checkUnSelectable(printDate);
                    tbody += "<td class='" +
                        ((j + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                        (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                        (unselectable ? " ui-datepicker-unselectable ui-state-disabled" : "") + // highlight unselectable days
                        (otherMonth || unselectable ? '' :
                            (printDate.getTime() === selectedDate.getTime() ? " ui-datepicker-current-day" : "") + // highlight selected day
                                (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")
                            ) + "'" + // highlight today (if different)
                        (unselectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                        (otherMonth ? "&#xa0;" : // display for other months
                            (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                                (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                                (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                    printDate.setDate(printDate.getDate() + 1);
                }
                tbody += '</tr>';
            }
            tbody += '</tbody>';
            html += '<table  class="ui-datepicker-calendar">' + thead + tbody + '</table>';
            return html;
        },

        _commit: function(){
            var data = this._data,
                date,
                dateStr = $.datepicker.formatDate(date = this.selectedDate());

            data.date = date;
            data._inited && this.trigger('valuecommit', [date, dateStr, this]);
            return this;
        },

        /**
         * @name option
         * @grammar option(key[, value]) ⇒ instance
         * @desc 设置或获取Option，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        option:function (key, val) {
            var data = this._data, date;
            if (val !== undefined) {
                switch (key) {
                    case 'minDate':
                    case 'maxDate':
                        data[key] = val ? $.datepicker.parseDate(val) : null;
                        break;
                    case 'selectedDate':
                        val = $.datepicker.parseDate(val);
                        data._selectedYear = data._drawYear = val.getFullYear();
                        data._selectedMonth = data._drawMonth = val.getMonth();
                        data._selectedDay = val.getDate();
                        data._inited && this.trigger('select', [this.selectedDate(), this]);
                        break;
                    case 'date':
                        this.option('selectedDate', val);
                        //this._commit();
                        break;
                    case 'dateList':
                        data[key] = val ? $.datepicker.parseDateList(val) : [];
                        break;
                    case 'gap':
                        data[key] = val;
                        break;
                }
                data._invalid = true;
                return this;
            }
            return key === 'selectedDate' ? new Date(data._selectedYear, data._selectedMonth, data._selectedDay) : data[key];
        },

        /**
         * @name maxDate
         * @grammar maxDate([value]) ⇒ instance
         * @desc 设置或获取maxDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        maxDate:function (val) {
            return this.option('maxDate', val);
        },

        /**
         * @name minDate
         * @grammar minDate([value]) ⇒ instance
         * @desc 设置或获取minDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        minDate:function (val) {
            return this.option('minDate', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前date，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        date:function (val) {
            return this.option('date', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前选中的日期，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        selectedDate:function (val) {
            return this.option('selectedDate', val);
        },

        dateList: function (val) {
            return this.option('dateList', val);
        },

        /**
         * @name goTo
         * @grammar goTo(month, year) ⇒ instance
         * @grammar goTo(str) ⇒ instance
         * @desc 使组件显示某月，当第一参数为str可以+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         */
        goTo:function (month, year) {
            var data = this._data, offset, period, tmpDate, minDate = this.minDate(), maxDate = this.maxDate();
            if (typeof month === 'string' && offsetRE.test(month)) {
                offset = RegExp.$1 === '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = data._drawMonth + (period === 'm' ? offset : 0);
                year = data._drawYear + (period === 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }
            tmpDate = new Date(year, month, 1);
            tmpDate = minDate && minDate>tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate: tmpDate;//不能跳到不可选的月份
            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();
            if(month!=data._drawMonth || year!=data._drawYear){
                this.trigger('changemonthyear', [data._drawMonth = month, data._drawYear = year]);
                data._invalid = true;
                this.refresh();
            }
            return this;
        },

        /**
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 当修改option后需要调用此方法。
         */
        refresh:function () {
            var data = this._data;
            if (!data._invalid) {
                return;
            }
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', data._container).highlight();
            data._container.empty().append(this._generateHTML());
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', data._container).highlight('ui-state-hover');
            data._invalid = false;
            return this;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            var data = this._data, eventHandler = this._eventHandler;
            $('.ui-datepicker-calendar td:not(.ui-state-disabled)', data._container).highlight();
            data._container.off('click', eventHandler).remove();
        }
    });


    /**
     * 暴露接口
     * 简单说明使用
     * $('div').datepicker(options);初始化
     *  $('div').datepicker('date', new Date());调用组件内部方法
     *  var dp = $('div').datepicker('this');获得组件实例
     *  dp.goTo(12, 2012)//显示2012年12月
     *
     *  dp.minDate('2012-12-01');设置最小日期
     *  dp.maxDate('2012-12-01');设置最小日期
     *
     *  dp.refresh()每次改变option后要手动调用refresh方法来生效
     *
     *
     * @param options
     * @return {*}
     */
    $.fn.datepicker = function(options){
        //set all get first.
        var ret, args = slice.call(arguments, 1), _instance;
        $.each(this, function(){
            _instance = record(this) || new datepicker(this, $.isPlainObject(options)?options:null);
            if(typeof options ==='string' && options in _instance){
                ret = _instance[options].apply(_instance, args);
                if(ret!==_instance && ret!==undefined){
                    return false;
                }
                ret = undefined;
            }else if(options==='this'){
                ret = _instance;
                return false;
            }
        });
        return ret!==undefined?ret:this;
    }
})(Zepto);

exports = Zepto;


});
;define('common:widget/datescrollpick/datescrollpicker.js', function(require, exports, module){

/**
 * @fileoverview 实现trasit 模块首末班车时间选择器。
 * @author yuanzhijia
 */
var iscroll = require('common:static/js/iscroll.js');
var isLeapYear = function(year){
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 );
}
//获取某月的天数
var getMday = function(year, month){
    var mday = [31, 28, 31, 30, 31, 30, 31,31, 30, 31, 30, 31];
    if(isLeapYear(year)){
        mday[1] = 29;
    }
    return mday[month - 1];
}

function DateScrollPick(el, option){
    this.el = $(el);
    this.option = option || {};
    this._dateBox = null;
    this.init();
}

DateScrollPick.getMday = getMday;

$.extend(DateScrollPick.prototype, {
    lineHeight: 48,
    _createDateBox: function(){
        this._bg = $('<div class="date-box-bg"></div>');
        this._dateBox = $('<div class="date-box"/>');
        this._dateBox.html('<div ><div class="hd">设置出发时间</div><div class="bd"></div><div class="ft"></div></div>');
        this._bd = this._dateBox.find('.bd');
        this._bd.html('<div class="ymd"></div><div class="h"></div><div class="m"></div><div name="hmsp">:</div>'+
            '<div class="l1"></div><div class="l2"></div><div class="l3"></div><div class="l4"></div><div class="l5"></div><div class="l6"></div>');

        this._ymd = this._bd.find('.ymd');
        this._h = this._bd.find('.h');
        this._m = this._bd.find('.m');

        this._fd = this._dateBox.find('.ft');
        this._fd.html('<span>完成</span>');

        this._bg.appendTo(document.body);
        this._bg.hide();
    },

    _insertDateContent: function(){
        this.buildYmd();
    },

    buildYmd: function(){
        var curDate = new Date();
        var year = curDate.getFullYear();
        var curm = curDate.getMonth() + 1;
        var curd = curDate.getDate();
        var hours = curDate.getHours();
        var min = curDate.getMinutes();

        var days = [];

        var curmDays = getMday(curDate.getFullYear(), curm);

        for(var i=curd; i <= curmDays; i++){
            days.push({
                y : year,
                m : curm,
                d : i
            });
        }


        var nextMt = curm + 1 ;
        var nextYr = curDate.getFullYear();
        //如果当前月份为12月， 那取下一年的第一月
        if(curm == 12){
            nextMt = 1;
            nextYr = nextYr + 1;
        }


        var nextDays = getMday(nextYr, nextMt);
        for(var ni= 1; ni <= nextDays; ni++){
            days.push({
                y : nextYr,
                m : nextMt,
                d : ni
            });
        }

        var content = '<ul><li>&nbsp;</li>';
        days.forEach(function(item){
            var md = item.m + '月' + item.d + '日';
            var date = new Date();
            date.setFullYear(item.y);
            date.setMonth(item.m - 1);
            date.setDate(item.d);
            var dstr = date.format('yyyy-MM-dd');

            content = content + '<li id="date-' + dstr + '" data-date="' + dstr + '">' + md + '</li>';
        });

        content += '<li>&nbsp;</li></ul>';
        this._ymd.html(content);

        //小时
        var hourCt = '<ul><li>&nbsp;</li>';
        for(var h=0;  h < 24; h++){
            var cur = h == hours ? 'class="cur"' : '';
            h = h >= 10 ? h : ('0'+h);
            hourCt=hourCt + '<li id="hours-' +h+ '" ' + cur + ' data-h="' + h + '">' + h + '</li>';
        }
        hourCt = hourCt + '<li>&nbsp;</li></ul>';
        this._h.html(hourCt);

        //分钟
        var minuCt = '<ul><li>&nbsp;</li>';
        for(var m=0;  m < 60; m+=10){
            var cur = '';
            if(min >= m && min < m + 10){
                cur = 'class="cur"';
            }
            var mstr = (m == 0 ? '00' : m)
            minuCt = minuCt + '<li id="minute-'+ mstr +'" ' + cur + ' data-m="'+mstr+'">' + mstr + '</li>';
        }
        minuCt = minuCt + '<li>&nbsp;</li></ul>';
        this._m.html(minuCt);

        this._curHrEl = this._h.find('.cur');
        this._curMtEl = this._m.find('.cur');
    },

    _complete: function(){
        if(this.option.onselect){
            this.option.onselect.apply(this, [this.getSelectedDate()]);
        }
        this.hide();
    },
    init: function(){

        this._createDateBox();
        this._insertDateContent();
        this.render();

        if(!$.isFunction(iscroll)){
            app.loader.load(["common_iscroll"], $.proxy(this.initDateIscroll, this));
        }else{
            this.initDateIscroll();
        }
        this.bind();
    },
    /*
     * 初始化日历iscroll内容
     */
    initDateIscroll: function(){
        var ymdEl = this._ymd[0];
        var hEl = this._h[0];
        var mEl = this._m[0];
        var me = this;

        me.scrollerYmd = new iscroll(ymdEl, {
            hScroll:false,
            hScrollbar: false,
            vScrollbar: false,
            onScrollEnd: function(){
                me.scrollToElByY(this, ymdEl, this.y);
            }
        });
        me.scrollerHr = new iscroll(hEl, {
            hScroll:false,
            hScrollbar: false,
            vScrollbar: false,
            onScrollEnd: function(){
                me.scrollToElByY(this, hEl, this.y);
            }
        });
        me.scrollerMt = new iscroll(mEl, {
            hScroll:false,
            hScrollbar: false,
            vScrollbar: false,
            onScrollEnd: function(){
                me.scrollToElByY(this, mEl, this.y);
            }
        });
        me.scrollToCurDate();
    },
    /*
     * 获取当前的选择的日期
     */
    getSelectedDate: function(){
        var ymdY = Math.abs(this.scrollerYmd.y);
        var hrY = Math.abs(this.scrollerHr.y);
        var mtY = Math.abs(this.scrollerMt.y);

        var yindex = Math.round(ymdY / this.lineHeight);
        var hindex = Math.round(hrY / this.lineHeight);
        var mindex = Math.round(mtY / this.lineHeight);

        var $dates = this._ymd.find('li');
        var curDateEl = $($dates.get(yindex + 1));

        var $hour = this._h.find('li');
        var curHrEl = $($hour.get(hindex + 1));

        var $mt = this._m.find('li');
        var curMtEl = $($mt.get(mindex + 1));

        var rt = {
            datetime: curDateEl.attr('data-date') + ' ' + curHrEl.attr('data-h') + ':' + curMtEl.attr('data-m')
        }
        return rt;
    },

    scrollToElByY: function(scroller, ymdEl, y){
        y = Math.abs(y);
        var index = Math.round(y / this.lineHeight);

        if(index == this.last && scroller == this.lastUseScroller){
            return;
        }
        this.last = index;
        this.lastUseScroller = scroller;

        var el = $(ymdEl).find('li').get(index);
        scroller.scrollToElement(el, 100);
    },

    bind: function(){
        //防止在覆盖物上的滑动， 带动整个页面拖动。
        var hdr = function(e){
            e.preventDefault();
        }
        this._fd.on('click', $.proxy(this._complete, this));
        this._dateBox.on('touchmove', hdr);
        this._bg.on('touchmove', hdr);
        this._bg.on('click', $.proxy(this.hide, this));
        listener.on('common','sizechange',$.proxy(this._onglobalSizeChange, this));
    },
    _onglobalSizeChange: function(){
        this.setPos();
        this.refresh();
        this.scrollToCurDate();
    },
    setPos: function(){
        var posY = (window.innerHeight - 248) / 2 + window.scrollY;
        this._bg.css({
            height: window.innerHeight + window.scrollY
        });
        this._dateBox.css({top: posY});
    },
    applyTo: function(el){
        $(el).on('click', $.proxy(this.toggleHandler, this));
    },

    refresh: function(){
        this.scrollerYmd && this.scrollerYmd.refresh();
        this.scrollerHr && this.scrollerHr.refresh();
        this.scrollerMt && this.scrollerMt.refresh();
    },

    scrollToCurDate: function(){
        var date = new Date();
        var curDate = date.getDate();
        var hours = date.getHours();
        var mt = date.getMinutes();


        if(mt % 10 != 0){
            mt = Math.floor(mt / 10) * 10 + 10;
            if(mt >= 60){
                mt = '00';
                hours = hours + 1;
                date.setHours(hours);
                if(hours >= 24){
                    hours = '00';
                    curDate += 1;
                    date.setDate(curDate);
                }
            }
        }else{
            mt = mt == 0 ? '00' : mt;
        }

        var dateid = 'date-' + date.format('yyyy-MM-dd');
        var hoursid = 'hours-' + date.format('hh');
        var minuteid = 'minute-' + mt;

        this.scrollerYmd && this.scrollerYmd.scrollToElement($('#'+dateid).prev().get(0) , 0);
        this.scrollerHr && this.scrollerHr.scrollToElement($('#'+hoursid).prev().get(0) , 0);
        this.scrollerMt && this.scrollerMt.scrollToElement($('#'+minuteid).prev().get(0) , 0);
    },

    toggleHandler: function(e){
        this.show();
        this.setPos();
        this.refresh();
        this.scrollToCurDate();
    },
    render: function(){
        this._dateBox.appendTo(document.body);
    },
    show: function(){
        this._dateBox.css({
            left: '50%'
        });
        this._bg.show();
    },
    hide: function(){
        this._dateBox.css({
            left: -1000
        });
        this._bg.hide();
    }
});

module.exports = DateScrollPick;


});
;define('common:widget/fastclick/fastclick.js', function(require, exports, module){

/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.5.6
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */

function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { FastClick.prototype.onTouchCancel.apply(self, arguments); };

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return;
	}

	// Set up event handlers as required
	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires an exception for labels.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;

/**
 * Chrome requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsChrome = navigator.userAgent.indexOf('Chrome') > 0;


/**
 * iOS requires an exception for alert confirm dialogs.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'button':
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if (this.deviceIsIOS && target.type === 'file') {
			return true;
		}

		// Don't send a synthetic click to disabled inputs (issue #62)
		return target.disabled;
	case 'label':
	case 'video':
		return true;
	default:
		return (/\bneedsclick\b/).test(target.className);
	}
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
	case 'select':
		return true;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	if (this.deviceIsIOS && targetElement.setSelectionRange) {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	this.touchStartClientX = touch.clientX;
	this.touchStartClientY = touch.clientY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};

FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	var targetElement, touch, selection;

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (!this.trackingClick) {
		return true;
	}

	// 根据clientX/clientY判断是否在长页面内按住某个元素滑动之后被错误识别为tap行为@shengxuanwei
	if (Math.abs(touch.clientX - this.touchStartClientX) > 10 || Math.abs(touch.clientY - this.touchStartClientY) > 10) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};

/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0];

	if (Math.abs(touch.pageX - this.touchStartX) > 10 || Math.abs(touch.pageY - this.touchStartY) > 10) {
		return true;
	}

	return false;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	// https://github.com/ftlabs/fastclick/issues/7
	// 这里，判断trackingClick用于处理滑动时错误识别为tap行为，iOS上比较明显@shengxuanwei
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	// 这里，判断trackingClick用于处理固定页面上的滑动时错误识别为tap行为，在iScroll存在时比较明显，或者页面长度小于屏幕高度时
	if (!this.trackingClick) {
		return true;
	}

	// 避免快速双击重复触发click事件
	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset);
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {
		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		// Held clicks between 100ms and 150ms still created this behavior, so I lowered the threshold.
		// 原来阈值是100, 重构时发现影响输入框的点击触发，改为150
		if ((event.timeStamp - trackingClickStart) > 150 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// iOS4，Chrome和小米2的select元素调起不能阻止默认事件@shengxuawnei
		if ((this.deviceIsIOS4 || this.deviceIsChrome) && targetTagName === "select") {
			return false;
		} else {
			this.targetElement = null;
			event.preventDefault();
		}

		// if ((!this.deviceIsIOS4 && !this.deviceIsChrome) || targetTagName !== 'select') {
		// }

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// 根据时间阈值判断一个touch事件系列是否被识别为tap行为（PS:改版时上线此修改@2013-04-11）
	// 调整为根据clientY滑动距离判断是否识别@shengxuanwei
	/*var nonClickThreshold = 200;
	// 部分按钮在touchactive.js里增加了二态效果，导致点击时间间距过长；
	if (this.deviceIsAndroid) {
		nonClickThreshold = 1000;
	}

	// 增加点击时间间隔的判断，解决在滑动过程中的误触问题
	if ((event.timeStamp - trackingClickStart) > nonClickThreshold) {
		return false;
	}*/

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();

		if (this.deviceIsIOS) {
			this.sendClick(targetElement, event);
		} else {
			// track: https://github.com/ftlabs/fastclick/issues/27
			// Android平台存在元素点击之后页面切换时新页内的input框激活，导致键盘弹起的问题，类似于"击穿"
			// FIXED: 小米2默认浏览器和QQ无法通过此方法解决input标签击穿问题@shengxuanwei 2013-04-07
			// FIXED: #82 github里提到iOS4如果通过setTimeout方式调用新的call stack，导致input标签无法通过focus()方法被聚焦@shengxuanwei 2013-04-28
			var self = this;
			setTimeout(function() {
				self.sendClick(targetElement, event);
			}, 20);
		}
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var oldTargetElement;

	// If a target element was never set (because a touch event was never fired) allow the click
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	oldTargetElement = this.targetElement;
	this.targetElement = null;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.trackingClick = false;
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	// Derive and check the target element to see whether the click needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(oldTargetElement) || this.cancelNextClick) {
		this.cancelNextClick = false;

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If clicks are permitted, return true for the action to go through.
	return true;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchcancel', function(evt) {
		evt.preventDefault();
	}, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = function(layer) {
		'use strict';
		return new FastClick(layer);
	};

	module.exports.FastClick = FastClick;
}

module.exports = FastClick;

});
;define('common:widget/footer/footer.js', function(require, exports, module){

/**
 * @fileOverview footer脚本
 */
var stat = require('common:widget/stat/stat.js'),
	util = require('common:static/js/util.js'),
	login = require('common:widget/login/login.js');

var init = function(){
	bindEvent();
}
var bindEvent = function(){
	$('.user').on("click", function(){
		_gologin();
	});
}
var _gologin = function(e){
	login.checkLogin(function(data){
        if(!data.status){
            login.loginAction();
        }else{
            login.goMycenter();
        }
    });
}

module.exports.init = init;

});
;define('common:widget/geolocation/initgeo.js', function(require, exports, module){

/**
* @file 初始化定位
* @author nichenjian@baidu.com
* @date 2013-11-06
*/
'use strict';

var loc     = require('common:widget/geolocation/location.js'),
    cookie  = require('common:widget/cookie/cookie.js'),
    storage = require('common:static/js/localstorage.js'),
    stat    = require('common:widget/stat/stat.js'),
    url     = require('common:widget/url/url.js');

module.exports = {
    init: function(options){
        this._resetCurrentCity();

        this._initIpLocation();

        // 有些页面不需要发起定位
        if(options && options.isStartGeo !== false) {
            this._initGeoLocation();
        }
        this._changeCity();
    },
    /**
    * 重置_CURRENT_CITY
    * _DEFAULT_CITY是后端返回的ip定位的结果，而_CURRENT_CITY返回的是检索的当前城市
    */
    _resetCurrentCity: function(){
        var defaultCity = window._DEFAULT_CITY,
            storage = window.localStorage;

        //设置_DEFAULT_CITY的值，如果不存在，默认取全国
        try{
            if(defaultCity.index){
                storage.setItem('_DEFAULT_CITY', JSON.stringify(window._DEFAULT_CITY));
                cookie.set('DEFAULT_CITY', '1', {expires: 1000*60*5, path: '/'});
            }else if(storage.getItem("_DEFAULT_CITY")){
                window._DEFAULT_CITY = JSON.parse(storage.getItem("_DEFAULT_CITY")) || {};
            }else{
                window._DEFAULT_CITY = {
                    addrbyip: '{"error":1,"content":""}',
                    default_city: "全国",
                    index: '{"content":{"baike":0,"city_type":0,"cname":"\u5168\u56fd","code":1,"count_info":null,"geo":"1|11590057.96,4489812.75;11590057.96,4489812.75|11590057.96,4489812.75;","if_current":1,"level":0,"sup":0,"sup_bus":0,"sup_business_area":0,"sup_lukuang":0,"sup_subway":0,"uid":"b04c4accaab2fb7f410245f2"},"mo":{"data":{"mo_text":"\u4e0b\u8f7d\u767e\u5ea6\u624b\u673a\u5730\u56fe","mo_color":"#ff0000","mo_layer_text":"\u79bb\u7ebf\u4f7f\u7528\uff0c\u770190%\u6d41\u91cf\uff01","popup_img1":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/86bd8022f311d822940c36647c0aa131_143_221.jpg","popup_img2":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/94383d365350ba776eaee9d9daaf2387_143_221.jpg","popup_img3":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/c6c9811cff704539cc97e1fa385df81d_143_221.jpg","popup_title1":"\u641c\u7d22\u5468\u8fb9\u7f8e\u98df\u3001\u9152\u5e97\u3001\u5728\u7ebf\u9884\u5b9a","popup_title2":"\u5408\u7406\u8def\u7ebf\u89c4\u5212\uff0c\u514d\u8d39\u8bed\u97f3\u5bfc\u822a","popup_title3":"\u6700\u65b0\u56e2\u8d2d\u4f18\u60e0\u6298\u6263\u4fe1\u606f","popup_version_iphone":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/18a9fef8f8276dedb1d8129a36ceb181_25_26.png","popup_version_andriod":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/e87051a70c258e51bb947a95789ca815_25_26.png","banner_home":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-15\/8cf335e0d9f4c9e0f8656c1e369c7f67_316_100.jpg","banner_poi":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-16\/6f90db9e61476f2cd8975c3fac3c70a8_316_100.jpg","banner_bus":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-16\/b39713e7c4cbf5a27c72308d1846248f_316_100.jpg","banner_driving":"http:\/\/map.baidu.com\/fwmap\/upload\/r\/image\/2013-07-16\/8a512aa177b13df62758f7326f4a5682_316_100.jpg"}},"result":{"jump_back":0,"qid":"","time":0,"type":1},"current_city":{"code":1,"sup":0,"sup_bus":0,"sup_business_area":0,"sup_lukuang":0,"sup_subway":0,"type":0,"up_province_name":"\u4e2d\u56fd"}}',
                    loopindex: -1
                }
                cookie.set('DEFAULT_CITY', '0', {expires: -1000, path: '/'});
            }
        }catch(e){}

        //如果不存在CURRENT_CITY, 将DEFAULT_CITY的值赋给CURRENT_CITY
        if(!window._CURRENT_CITY){
            var location = JSON.parse(_DEFAULT_CITY.index) || {},
                content = location.content || {};
            window._CURRENT_CITY = {
                code: content.code || 1,
                geo: content.geo || '',
                name: content.cname || '',
                sup: content.sup || 0,
                sup_bus: content.sup_bus || 0,
                sup_business_area: content.sup_business_area || 0,
                sup_lukuang: content.sup_lukuang || 0,
                sup_subway: content.sup_subway || 0,
                type: content.city_type || 0,
                up_province_name: content.up_province_name || '',
                reset_cur: 1
            };
        }
    },

    /**
     * 初始化ip定位
     */
    _initIpLocation : function () {
        try{
            if(!this._hasStorageLoc()){
                this._initIpGeo();
            }
        }catch(e){
            //读取localStorage失败，初始化ip定位
            this._initIpGeo();
        }
    },

    /**
     * 初始化系统定位
     */
    _initGeoLocation : function () {
        //异步请求定位组件，初始化定位
        require.async('common:widget/geolocation/geolocation.js', function(exports){
                exports.init();
            });
    },

    /**
     * 从localStorage中获取定位结果
     * @param {string} name 获取的key
     * @return {object} 定位的结果
     */
    getLocFromStorage: function (name) {
        var me = this;
        var storage = window.localStorage;
        if (storage) {
            try {
                var loc = storage.getItem(name);
                return JSON.parse(loc);
            } catch (e) {
                return;
            }
        }
    },
    /**
     * 是否缓存了定位数据
     * 若已缓存5分钟内的定位，则直接缓存的定位初始化
     * 缓存的位置可能是精确位置，也可能是非精确位置，如上海等，若已经缓存了5分钟内的位置
     * 刷新页面时仍读取缓存的位置，这时候就不用初始化ip定位
     * @return {bool}
     */
    _hasStorageLoc: function () {
        var me = this;
        var _loc = me.getLocFromStorage('webapp-loc');
        var _myLoc = me.getLocFromStorage('webapp-myloc');
        var time = new Date().getTime();
        //缓存的定位在5分钟内，则直接读取缓存的数据
        if (_myLoc && _myLoc.isExactPoi === true) {
            if (parseInt(_myLoc.t) + 1000 * 60 * 5 > time) {
                loc._mylocation = _myLoc;
                //标识从localStorage中获取我的位置定位信息
                $.extend(loc._mylocation,{
                    type: 'storage'
                });
                window._INIT_MYLOC_SUC = true;
            }
        }

        //缓存的位置非ip定位，且定位时间在5分钟内
        if (_loc && _loc.type !== 'ip') {
            if (parseInt(_loc.t) + 1000 * 60 * 5 > time) {
                loc._location = _loc;
                //标识从localStorage中获取定位信息
                $.extend(loc._location,{
                    type : 'storage'
                });
                window._NO_COVER_LOC = true;
                window._INIT_LOC_SUC = true;
                return true;
            }
        }

        return false;
    },
    /**
    * 初始化ip定位
    */
    _initIpGeo: function(){
        var location, content, geo, point, level;
        location = JSON.parse(_DEFAULT_CITY.index) || {};
        content  = location && location.content;
        geo      = content && content.geo;
        level    = content.level;
        point    = geo.split(';')[1].split('|')[0].split(',');

        if(content.code == 1){
            content.name = '全国';
        }

        if(content.code != 1){
            //统计ip定位到城市级别
            stat.addStat(COM_STAT_CODE.STAT_IP_GEO_IN_CITY);
        }

        //构造定位的数据
        var locationData = {
            addr: {
                city: content.cname,
                cityCode: content.code
            },
            point: {
                x: point[0],
                y: point[1]
            },
            level: level,
            type : 'ip',
            isExactPoi: false,
            isGeoEnd: false,
            isSaveLocInStorage: false
        };
        //初始化定位信息
        loc.setAddress(locationData, true);
    },
    /**
    * 切城处理，若当前返回的城市code和定位的citycode不一致，则切换城市信息
    */
    _changeCity: function(){
        var city = window._CURRENT_CITY,
            urlParam = url.get(),
            pageState = urlParam.pageState || {},
            action = urlParam.action || {},
            module = urlParam.module || {};

        if(city && city.reset_cur != 1){
            //当前城市和定位城市不一致，或者后端标识强制替换位置
            if((city.code != loc.getCityCode() && city.code != loc.getUpCityCode())
             || city.is_update_city == 1){
                var point = city.geo && city.geo.split(';')[0].split('|')[1].split(',');

                //不存在中心点，直接返回
                if(point === undefined){
                    return;
                }

                if(city.code == 1){
                    city.name = '全国';
                }

                var upCityCode = null;
                //当前定位是区
                if(city.type === 3){
                    upCityCode = city.up_cityid;
                }
                //将全国的level切换到4
                var level = city.level != 0 ? city.level : 4;
                var locData = {
                    addr: {
                        city: city.name,
                        cityCode: city.code,
                        cityType: city.type,
                        upCityCode: upCityCode
                    },
                    point: {
                        x: point[0],
                        y: point[1]
                    },
                    level: level,
                    isSaveLocInCookie: true
                }

                //系统定位时的切城的结果不能被覆盖，除非用户手动发起定位
                window._NO_COVER_LOC = false;
                loc.setAddress(locData);
                window._NO_COVER_LOC = true;
            }
        }
    },

    /**
     * TODO 需要合并函数逻辑
     * @return {void}
     */
    changeCity : function(){
        var city = window._CURRENT_CITY,
            urlParam = url.get(),
            pageState = urlParam.pageState || {},
            action = urlParam.action || {},
            module = urlParam.module || {};

        if(city && city.reset_cur != 1){
            //当前城市和定位城市不一致，或者后端标识强制替换位置
            if((city.code != loc.getCityCode() && city.code != loc.getUpCityCode())
             || city.is_update_city == 1){
                var point = city.geo && city.geo.split(';')[0].split('|')[1].split(',');

                //不存在中心点，直接返回
                if(point === undefined){
                    return;
                }

                if(city.code == 1){
                    city.name = '全国';
                }

                var upCityCode = null;
                //当前定位是区
                if(city.type === 3){
                    upCityCode = city.up_cityid;
                }
                //将全国的level切换到4
                var level = city.level != 0 ? city.level : 4;
                var locData = {
                    addr: {
                        city: city.name,
                        cityCode: city.code,
                        cityType: city.type,
                        upCityCode: upCityCode
                    },
                    point: {
                        x: point[0],
                        y: point[1]
                    },
                    level: level
                }
                loc.setAddress(locData, false);
            }
        }
    }

}


});
;define('common:widget/header/header.js', function(require, exports, module){

/**
 * @fileOverview 头部导航逻辑
 */


var stat = require('common:widget/stat/stat.js'),
    util = require("common:static/js/util.js"),
    appresize   = require('common:widget/appresize/appresize.js');

var $appbutton = $("#header_install_button");
var os = util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown";
/**
 * 绑定用户点击事件
 * @return {void}
 */
var bind = function() {
    _initDownload();
    bindSwipeUpEvent();
};

var _initDownload = function() {
    var me = this;
    util.isInstalledClient(function(openurl) {
        $appbutton.attr('data', openurl).text("打开客户端");
        util.bindHrefStat($appbutton, function(){
            stat.addStat(COM_STAT_CODE.HEADER_APP_OPEN, {os: me.os});
        });
    }, function(downloadurl) {
        $appbutton.attr('data', downloadurl).text("下载客户端");
        util.bindHrefStat($appbutton, function(){
            stat.addStat(COM_STAT_CODE.HEADER_APP_DOWNLOAD, {os: me.os});
        });
    });
};



var bindSwipeUpEvent = function() {
    var startScreenY = 0,
        endScreenY = 0,
        touchstartCallback = function() {},
        touchmoveCallback = function() {};

    var $searchBox = $('.index-widget-searchbox, .index-widget-tabgroup');
    var $header = $(".common-widget-header");
    var _startPos = {};
    var _movePos = {};
    var _getEvPos = function(ev) {
        var pos = [],
            src = null,
            touches = ev.touches,
            len;

        // 兼容处理touches不存在的情况
        if (touches && (len = touches.length)) {
            for (var t = 0; t < len; t++) {
                src = touches[t];
                pos.push({
                    x: src.pageX,
                    y: src.pageY
                });
            }
        }
        return pos;
    };
    var touchstartHandler = function(ev) {
        _startPos = _getEvPos(ev);
        $searchBox.on("touchmove", touchmove);
    }

     var touchmove = function(ev) {
        _movePos = _getEvPos(ev);
        try {
            var distance = Math.abs(_startPos[0].y - _movePos[0].y);
        } catch (e) {
            distance = 0;
        }

        if (distance > 5) {
            $searchBox.off("touchmove", touchmove);
            if (_startPos[0].y < _movePos[0].y) {
                $header.show();
            } else {
                $header.hide();
            }
            // TODO 
            listener.trigger('common','sizechange');
        }
    }

    $searchBox.on("touchstart", touchstartHandler);
};


/**
 * 初始化
 * @return {void}
 */
module.exports.init = function() {
    bind();
}

});
;define('common:widget/initapp/initapp.js', function(require, exports, module){

/**
 * @fileOverview 初始化地图需要用到的组件
 */

var appResize = require('common:widget/appresize/appresize.js'),
	popup = require('common:widget/popup/popup.js'),
	pagemgr = require('common:widget/pagemgr/pagemgr.js'),
	FastClick =require('common:widget/fastclick/fastclick.js');


var init = function () {

	// 初始化高度
	appResize.init();

	// 初始化页面管理组件
	pagemgr.init();

	// 在多页切换时不加载FastClick, 解决android 2.3及以下的版本的击穿问题
    if (pagemgr.isSinglePageApp()) {
	   // 初始化FastClick
	   new FastClick(document.body);
    }

	// 绑定全局函数
	bind();
};

var bind = function() {
	if(pagemgr.isLandingPage()){
		listener.on('common.page', 'switchstart', showTip);
		listener.on('common.page', 'switchend', closeTip);
		listener.on('common.page', 'switchend', resetScroll);
	}
};

var preventDefault = function proxy(e) {
    var element = e.target,
        parent = element,
        selector = ".clickable";

    while (parent !== document.body) {

        if ($.zepto.matches(parent, selector)) {

    		e.preventDefault();
            return;
        } else {
            parent = parent.parentNode;
        }
    }
};

var resetScroll = function(){

	window.scrollTo(0,1);
};

var showTip = function(){
	popup.open({text:'正在加载中'});
};

var closeTip = function(){
	popup.close();
};


module.exports.init = init;



});
;define('common:widget/map/preloader/CBounds.js', function(require, exports, module){

/**
 * @fileoverview 自定义矩形地理区域类文件 
 * @author jican@baidu.com
 */

/**
 * 矩形地理区域类;
 * @param {Point} south west 西南角
 * @param {Point} north east 东北角
 */
function CBounds(sw, ne) {
    this._sw = {lng: sw.lng, lat: sw.lat};
    this._ne = {lng: ne.lng, lat: ne.lat};
    this._swLng = sw.lng;
    this._swLat = sw.lat;
    this._neLng = ne.lng;
    this._neLat = ne.lat;
}

$.extend(CBounds.prototype, {  
    /**
     * 返回该区域的中心点地理坐标
     * @return {Point} 地理点坐标对象.
     */
    getCenter: function() {
        return {
            lng : (this._swLng + this._neLng) / 2,
            lat : (this._swLat + this._neLat) / 2
        }
    },
    /**
     * 返回地理区域跨度，用坐标表示
     * @return Point
     */
    toSpan: function() {
        return {
            lng : Math.abs(this._neLng - this._swLng),
            lat : Math.abs(this._neLat - this._swLat)
        }
    }
});

module.exports = CBounds;

});
;define('common:widget/map/preloader/helper.js', function(require, exports, module){

/**
 * @fileoverview 预加载辅助函数 精简了一部分API的获取中心和层级的接口
 * @author jican@baidu.com
 */

var util = require('common:static/js/util.js'),
    mapConst = require('common:static/js/mapconst.js'),
    locator = require('common:widget/geolocation/location.js'),
    CBounds = require('common:widget/map/preloader/CBounds.js');

module.exports = {
    /**
     * 获取检索结果页预加载需要的中心点和层级
     * @param ViewportOptions
     * @return Object {center, zoom} 表示地图的中心点和级别.
     */
    getViewport: function (options) {
        var apphash = window._APP_HASH || {},
            module = apphash.module,
            action = apphash.action,
            center, zoom;

        options = options || {};

        if(window._MAP_BOUNDS) {
            // 路线类需要增加margins
            if(['transit','drive','walk'].indexOf(module)>=0){
                options.margins = mapConst.ROUTE_MARGINS;
            }
            var points = util.getBPoints([window._MAP_BOUNDS]),
                viewport = this._getViewport(points, options);
            if(viewport && viewport.center && viewport.zoom) {
                center = viewport.center;
                zoom = viewport.zoom;
            }
        }

        return {
            center: center,
            zoom: zoom
        }
    },
    /**
     * 根据地理区域或坐标获取地图最佳视野,该方法是API的简化版.
     * @param Array<Point> 点数组.
     * @param ViewportOptions
     * @return Object {center, zoom} 表示地图的中心点和级别.
     */
    _getViewport: function (view, opts) {

        if(!view || view.length==0) {
            return;
        }

        opts = opts || {};

        var points = view.slice(0),
            bounds = new CBounds(points[0], points[1]);
        
        var center = bounds.getCenter(),
            zoom = this.getBestLevel(bounds, opts);

        // 坐标偏移计算
        if (opts.margins) {
            var margins = opts.margins,
                wBias = (margins[1] - margins[3]) / 2,
                hBias = (margins[0] - margins[2]) / 2,
                zoomUnit = this.getZoomUnits(zoom);
            center.lng = center.lng + zoomUnit * wBias;
            center.lat = center.lat + zoomUnit * hBias;
        }
        
        return {
            'center': center,
            'zoom': zoom
        };
    },
    /**
     * 根据级别获取放大比例
     */
    getZoomUnits: function(zoom) {      
        var c = 1;
        /*
        暂时不用适配高分栅格图
        if(map.highResolutionEnabled() && map.getZoom() < map.config.vectorMapLevel){
            c = 2;       
        }
        */
        return Math.pow(2, (18 - zoom)) * c;
    },
    /**
     * 获取地图容器大小
     */
    getMapSize: function () {
        var apphash = window._APP_HASH || {},
            module = apphash.module,
            action = apphash.action;

        var mapHeight = window.innerHeight,
            mapWidth = window.innerWidth,
            searchboxHeight = $('.index-widget-searchbox').height() || 58,
            tabHeight = $('.index-widget-tabgroup').height() || 50,
            navHeight = $('.common-widget-nav').height() || 51;

        if(module==='index' && action==='index') {
            mapHeight = mapHeight - tabHeight - searchboxHeight;
        } else {
            mapHeight = mapHeight - navHeight;
        }

        return {
            width: mapWidth,
            height: mapHeight
        };
    },
    /**
     * 获取最小层级
     */
    getMinZoom: function () {
        return 3;
    },
    /**
     * 获取最大层级
     */
    getMaxZoom: function () {
        return 18;
    },
    /**
     * 获取最佳层级
     */
    getBestLevel: function (bounds, opts) {
        var margins = opts.margins || [10, 10, 10, 10],
            zoomFactor = opts.zoomFactor || 0,
            ew = margins[1] + margins[3],
            eh = margins[0] + margins[2],
            minLevel = this.getMinZoom(),
            maxLevel = this.getMaxZoom(),
            mapSize = this.getMapSize();
        for (var level = maxLevel; level >= minLevel; level--) {
            var zoomUnits = this.getZoomUnits(level);
            if (
                bounds.toSpan().lng / zoomUnits < mapSize.width - ew && 
                bounds.toSpan().lat / zoomUnits < mapSize.height - eh
            ) {
                break;
            }
        }
        level += zoomFactor;
        if (level < minLevel) {
            level = minLevel;
        }
        if (level > maxLevel) {
            level = maxLevel;
        }
        return level;
    }
};

});
;define('common:widget/map/preloader/plugin.js', function(require, exports, module){

/**
 * webapp的插件，此代码嵌入到webapp模块中，目的是提前下载矢量模块，使用户更早看到图。
 */

/**
 * 下载异步文件url
 */
var url = '/mobile/?qt=getMobileModules&v=2&';
/**
 * 矢量模块版本号
 */
var vectorMdlVer = {
    'tile': 'prwkzv',
    'vector': 'szzsgy'
};
/**
 * 发送请求
 * url: 异步模块url
 */
function request(url, opts){
    var s = document.createElement('script');
    s.src = url;
    
    // 脚本加载完成后进行移除
    if (s.addEventListener){
      s.addEventListener('load', function(e) {
        var t = e.target;
        t.parentNode.removeChild(t);
        if(opts && opts.from=='app' && opts.cbk) {
            opts.cbk && opts.cbk();
        }
      }, false);
    }
    document.getElementsByTagName('head')[0].appendChild(s);
    s = null;        
}

var apiPlugin = {
    mainReady : false,
    lazyReady : false,
    isPreLoaded: false,//是否在webapp非地图页已经下载了
    /** 
     * 获取矢量相关的代码，提前保存到localStorage中
     */
    getVectorMdl : function(opts){

        opts = opts || {};


        if(this.isPreLoaded){
            return;
        }
        //检查localStorage中是否存在vectorMdlVer版本的vector模块，
        //如果不存在，就去服务端下载最新的版本         
        try{
            var downLoadMdls = [],
                ls = window.localStorage;
            for(var mdl in vectorMdlVer){
                var mdlVer = 'async_' + mdl + '_' + vectorMdlVer[mdl],
                    shortMdlVer = mdl + '_' + vectorMdlVer[mdl];
                if(!ls[mdlVer] || ls[mdlVer].length <= 0){
                    downLoadMdls.push(shortMdlVer);    
                }
            }

            if(downLoadMdls.length > 0){
                this.isPreLoaded = true;//标识已经加载了
                var reqUrl = url + 'mod=' + downLoadMdls.join(',') + '&cbk=preLoadVec';
                request(reqUrl, opts);
            } else {
                if(opts && opts.from=='app' && opts.cbk) {
                    opts.cbk && opts.cbk();
                }
            }
        }catch(e){}        
    }    
}

/*
 * 回调函数,将下载的异步文件保存
 * modName: 异步模块名称
 * modCode: 异步模块代码
 */
window.preLoadVec = function(modName, modCode){
    try{
        if(!modCode){
            return;
        }
        var ls = window.localStorage,
            mdlVer = 'async_' + modName,
            oldPrefix = 'async_' + modName.split('_')[0];

        //根据旧的前缀，删除之前的旧版本文件                
        for(var l = ls.length, i = l - 1; i >= 0; i--){
          var strKey = ls.key(i);                  
          if(strKey.indexOf(oldPrefix) > -1){
            ls.removeItem(strKey);                    
          }                  
        }                
        ls.setItem(mdlVer, modCode); //保存代码  

    }catch(e){}
}

module.exports = apiPlugin;

});
;define('common:widget/map/preloader/tileloader.js', function(require, exports, module){

/**
 * 植入webapp核心代码中，预加载栅格或矢量地图数据,
 * 且针对矢量数据进行本地保存若干张, by wjp
 */
var TileLoader = {
     /**
      * 配置参数
      */
     Config: {      
        /**
         * 栅格域名池
         */
        rasterURLs: [
            "http://online0.map.bdimg.com/it/",
            "http://online1.map.bdimg.com/it/",
            "http://online2.map.bdimg.com/it/",
            "http://online3.map.bdimg.com/it/"
        ],
        /**
         * 矢量域名池
         */
        vectorURLs: [
            'http://online0.map.bdimg.com/gvd/?',
            'http://online1.map.bdimg.com/gvd/?',
            'http://online2.map.bdimg.com/gvd/?',
            'http://online3.map.bdimg.com/gvd/?'        
        ],
        /**
         * 瓦片尺寸
         */
        tileSize: 256,
        /**
         * 矢量数据key
         */
        vctMetaKey: 'vct_meta',
        /**
         * 矢量数据元数据，存储版本、存储的先后顺序
         */
        vctMeta: null,
        /**
         * 矢量数据最多存储瓦片张数
         */
        vctMaxNum: 100,
        /**
         * 满100张，删除最早保存的25张，留出空间给新进入的瓦片
         */
        vctDelNum: 25,
        /**
         * 矢量层结束级别，从18-12级
         */
        vectorMapLevel: 12
     },
    /**
     * 加载栅格或矢量数据
     * center: 中心点
     * zoom: 地图级别
     *  opts: {
     *      mapWidth: 地图宽度
     *      mapHeight: 地图高度
     *      dataType: 下载的数据类型，取值为, vector: 下载矢量; raster: 下载栅格。
     *  }    
     */
    loadTiles: function(center, zoom, opts){
        var _opts = opts || {},
            mapWidth = _opts.mapWidth || window.innerWidth,
            mapHeight = _opts.mapHeight || window.innerHeight,
            dataType = _opts.dataType || 'vector';
        
        var arrTiles = this.getCurViewTiles(center, zoom, mapWidth, mapHeight);
        if(dataType == 'vector' && zoom >= this.Config.vectorMapLevel){
            this.initVectorEnvOnce();
            this.loadVectorTiles(arrTiles); 
        } else {
            this.loadRasterTiles(arrTiles);
        }
    },
    /**
     * 获取当前视野内瓦片的行列号
     * center: 中心点
     * zoom: 地图级别
     * mapWidth: 地图宽度
     * mapHeight: 地图高度
     */
    getCurViewTiles: function(center, zoom, mapWidth, mapHeight){
        var tileSize = this.Config.tileSize,
            zoomUnits = Math.pow(2, 18 - zoom),
            levelUnits = zoomUnits * tileSize,
            row = Math.ceil(center.lng / levelUnits), 
            column = Math.ceil(center.lat / levelUnits),
            cell = [row, column, 
                    (center.lng - row * levelUnits) / levelUnits * tileSize, 
                    (center.lat - column * levelUnits) / levelUnits * tileSize],
            
            fromRow = cell[0] - Math.ceil((mapWidth / 2 - cell[2]) / tileSize),
            fromColumn = cell[1] - Math.ceil((mapHeight / 2 - cell[3]) / tileSize),
            toRow = cell[0] + Math.ceil((mapWidth / 2 + cell[2]) / tileSize),
            toColumn = cell[1] + Math.ceil((mapHeight / 2 + cell[3]) / tileSize); 

            return [fromRow, fromColumn, toRow, toColumn, zoom];
    },
    /**
     * 初始化矢量环境一次
     */
    initVectorEnvOnce: function(){
        if(this._initVectorEnv){
            return;         
        }
        this._initVectorEnv = true;
        
        //设置vct_meta的结构
        var ls = localStorage,
            metaKey = this.Config.vctMetaKey;
        if(!ls.getItem(metaKey)){
            var strVer36 = this.getVectorVersionInfo(true),
                metaValue = '{"v":"' + strVer36 + '","vcts":[]}';
            
            ls.setItem(metaKey, metaValue);
        }
        
        var meta = this.Config.vctMeta = JSON.parse(ls.getItem(metaKey));
        if(!meta){
            return;
        }

        var strVer36 = meta.v,
            vcts = meta.vcts,
            strNewVer36 = this.getVectorVersionInfo(true);
        
        //版本发生变化,清空全部数据
        if(strVer36 != strNewVer36){            
            try{
                for(var i = 0, l = vcts.length; i < l; i++){
                    ls.removeItem(vcts[i]);         
                }
            }catch(e){}

            meta.v = strNewVer36;
            vcts.length = 0;
        }
        
        //如果满100张，删除25张数据
        var maxNum = this.Config.vctMaxNum,
            delNum = this.Config.vctDelNum;
        if(vcts.length >= maxNum){
            var delVcts = vcts.splice(0, delNum);
            try{
                for(var i = 0, l = delVcts.length; i < l; i++){
                    ls.removeItem(delVcts[i]);
                }
            }catch(e){}
        }

        try{
            ls.setItem(metaKey, JSON.stringify(meta)); //序列化meta到ls中
        }catch(e){}
    },
    /**
     * 加载矢量数据
     * arrTiles: 下载瓦片的起始数据参数
     */
    loadVectorTiles: function(arrTiles){
        var fromRow = arrTiles[0], 
            fromColumn = arrTiles[1], 
            toRow = arrTiles[2], 
            toColumn = arrTiles[3],
            zoom = arrTiles[4];     
        
        for (var i = fromRow; i < toRow; i++) {
            for (var j = fromColumn; j < toColumn; j++){
                this.loadVectorData(i, j, zoom);
            }
        }               
    },
    /**
     * 加载矢量数据
     * col: 行号
     * row: 列号
     * zoom: 级别
     */
    loadVectorData: function(col, row, zoom){
        var me = this,
            URLs = me.Config.vectorURLs,
            versionInfo = me.getVectorVersionInfo(),
            ver = versionInfo.ver,
            udt = versionInfo.udt;          

        var rndNum = (col + row) % URLs.length,
            url = URLs[rndNum],
            cbkName = '_' + parseInt(col + '' + row + '' + zoom).toString(36),
            vectorDataKey = 'vct' + cbkName;

        //如果localStorage中存在所需的瓦片，则不发送请求
        //因为其值字串比较长，所以循环遍历其key
        var ls = localStorage;
        for(var i = 0, l = ls.length; i < l; i++){
            var strKey = ls.key(i);
            if(strKey == vectorDataKey){
                return;
            }
        }
        
        url += 'qt=lgvd&layers=bg,df&' + "x=" + col + "&y=" + row + "&z=" + zoom
            + '&styles=pl&f=mwebapp&v=' + ver + '&udt=' + udt + '&fn=window.' + cbkName;

        window[cbkName] = function(json){
            var content = json.content;
            if(content){
                var bg = content['bg'] || [],
                    df = content['df'] || [],
                    all = bg.concat(df),
                    vectorData = JSON.stringify(all);               
                try{
                    var vctMeta = me.Config.vctMeta,
                        vctMetaKey = me.Config.vctMetaKey;
                    
                    if(vctMeta && vctMeta.vcts.length < me.Config.vctMaxNum){
                        vctMeta.vcts.push(vectorDataKey);
                        
                        localStorage.setItem(vctMetaKey, JSON.stringify(vctMeta));                  
                        localStorage.setItem(vectorDataKey, vectorData);                    
                    }
                }catch(e){}
            }
            delete window[cbkName];
        };

        me.request(url);
    },
    /**
     * 获取矢量数据的版本信息，根据参数返回不同数据类型
     * is36Str: true返回36进制的字串,否则返回版本信息对象
     */
    getVectorVersionInfo: function(is36Str){
        var vectorVer = (typeof TVC != 'undefined') ? TVC.api_for_mobile.vector : {},
            ver = vectorVer.version ? vectorVer.version : '001',
            udt = vectorVer.updateDate ? vectorVer.updateDate : '20130501';

        if(is36Str === true){
            return parseInt(udt + ver).toString(36);    
        } else {        
            return {'ver': ver, 'udt': udt};
        }
    },
    /**
     * 发送请求
     * url: 数据url
     */
    request: function(url){
        var s = document.createElement('script');
        s.src = url;
        
        // 脚本加载完成后进行移除
        if(s.addEventListener){
            s.addEventListener('load', function(e) {
                var t = e.target;
                t.parentNode.removeChild(t);            
            }, false);
        }
        document.getElementsByTagName('head')[0].appendChild(s);
        s = null;        
    },
    /**
     * 加载栅格数据
     * arrTiles: 下载瓦片的起始数据参数
     */
    loadRasterTiles: function(arrTiles){
        var fromRow = arrTiles[0], 
            fromColumn = arrTiles[1], 
            toRow = arrTiles[2], 
            toColumn = arrTiles[3],
            zoom = arrTiles[4];
            
        var URLs = this.Config.rasterURLs,
            rasterVer = (typeof TVC != 'undefined') ? TVC.webapp.lower_normal : {},
            ver = rasterVer.version ? rasterVer.version : '014',
            udt = rasterVer.updateDate ? rasterVer.updateDate : '20130501';
        
        for (var i = fromRow; i < toRow; i++) {
            for (var j = fromColumn; j < toColumn; j++){
                var rndNum = (i + j) % URLs.length,
                    url = URLs[rndNum];

                url += 'u=x=' + i + ';y=' + j + ';z=' + zoom + ';' 
                    + 'v=' + ver + ';type=web&fm=42&f=webapp&format_add=.jpg';
                
                var img = new Image();
                img.src = url;              
            }
        }       
    }
};

module.exports = TileLoader;

});
;define('common:widget/map/preloader/preloader.js', function(require, exports, module){

/**
 * @fileoverview 底图预加载组件
 * @author jican@baidu.com
 * @date 2013/11/28
 */

var util = require('common:static/js/util.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    locator = require('common:widget/geolocation/location.js'),
    helper = require('common:widget/map/preloader/helper.js');
    tileloader = require('common:widget/map/preloader/tileloader.js');

/**
 * 页面列表 根据module+action 对应pageid
 */
var pagelist = {
    'index_index_map'       : 1,
    'index_index_index'     : 2,
    'index_index_navline'   : 3,
    'place_list'            : 4,
    'place_detail'          : 5,
    'transit_detail'        : 6,
    'drive_list'            : 7,
    'walk_list'             : 8
}

/**
 * 底图预加载配置 需要同时满足 pageid nettype apptype 才可以预加载
 * pageid: 页面id 参考pagelist
 * nettype: 网络类型 1:wifi 2:2g 3:3g
 * apptype: 页面类型 1:单页 2:多页
 */
var config = {
    //定位
    'geolocation'   : {
        'pageid'    : [2,3],  //首页周边 首页路线
        'nettype'   : [0,1,2,3],  //wifi 3g
        'apptype'   : [1,2] //单页 多页
    },
    //落地页加载完成
    'onload'        : {
        'pageid'    : [2,3,4,5,6,7,8],
        'nettype'   : [0,1,2,3],  //wifi 3g
        'apptype'   : [1,2] //单页 多页
    },
    //页面切换完成
    'switchend'     : {
        'pageid'    : [2,3,4,5,6,7,8],
        'nettype'   : [0,1,2,3],  //wifi 3g
        'apptype'   : [1] //单页
    },
    //点击地图按钮
    'mapclick'      : {
        'pageid'    : [2,3,4,5,6,7,8],
        'nettype'   : [0,1,2,3],  //wifi 2g 3g
        'apptype'   : [1]   //单页
    }
}

/**
 * 获取页面ID
 * @return {number} id
 */
function getPageID () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        page = apphash.page,
        key = '';
    if(module==='index' && action==='index') {
        return pagelist[module+'_'+action+'_'+page];
    } else {
        return pagelist[module+'_'+action];
    }
}

/**
 * 获取预加载底图的中心点和层级
 * @param ViewportOptions
 * @return Object {center, zoom} 表示地图的中心点和级别.
 */
function getViewport (options) {
    var pageid = getPageID() || 0;

    if([1,2,3].indexOf(pageid) >=0 ) {
        // 首页直接获取定位的中心点和层级
        return {
            zoom: locator.getLevel(),
            center: {
                lng: locator.getPointX(),
                lat: locator.getPointY()
            }            
        }
    } else {
        // 其他页通过后端检索返回的bounds计算
        return helper.getViewport(options);
    }
}

/**
 * 加载底图数据
 * @param {string} eventName 事件名称
 */
function loadTiles(eventName) {
    if(!allowPreload(eventName)){
        return;
    }

    var mapsize = helper.getMapSize(),
        viewport = getViewport(),
        center = viewport.center,
        zoom = viewport.zoom;

    if(center && zoom) {
        tileloader.loadTiles(center, zoom, {
            mapWidth: mapsize.width,
            mapHeight: mapsize.height
        });
    }
}

/**
 * 是否允许预加载底图数据 
 * @param {string} eventName 事件名称 
 */
function allowPreload (eventName) {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        page = apphash.page,
        nettype = parseInt(window._WISE_INFO.netype, 10) || 0,
        apptype = pagemgr.isSinglePageApp() ? 1 : 2,
        pageid = getPageID() || 0,
        filter = config[eventName] || {};

    return  !/map/.test(page) &&
            filter.nettype.indexOf(nettype) >=0 && 
            filter.apptype.indexOf(apptype) >=0 && 
            filter.pageid.indexOf(pageid) >=0;
}

module.exports = {
    /**
     * 标记是否初始化
     */
    _initialized : false,
    /**
     * 预加载初始化
     */
    init: function () {
        // 绑定事件
        this.bindEvent();
        // 预加载地图JS文件
        require.async(['common:widget/api/api.js', 'common:widget/api/ext/tfcinfowindow.js']);
        // 预加载矢量异步JS文件
        require('common:widget/map/preloader/plugin.js').getVectorMdl();
        // 标记已经初始化
        this._initialized = true;
    },
    /**
     * 加载底图数据
     * @param {string} eventName 事件名称
     */
    loadTiles: function (eventName) {
        loadTiles(eventName);
    },
    /**
     * 绑定事件 
     */
    bindEvent: function () {
        // 初始化过不需要重复绑定
        if(this._initialized) {
            return;
        }

        // 页面加载完成 预加载底图
        $(window).on('load', function () {
            loadTiles('onload');
        });

        // 监听switchend主要是为了屏蔽place详情页pageloaded多次派发的问题
        var eventList = {};
        listener.on('common.page', 'switchend', function (eventName, opts) {
            eventList[opts.eid] = 1;
        });
        // 监听页面完全切换完成 预加载底图
        listener.on('common.page', 'pageloaded', function (eventName, opts) {
            if(eventList[opts.eid]) {
                loadTiles('switchend');
                delete eventList[opts.eid];
            }
        });

        // 监听定位成功 预加载底图
        listener.on('common.geolocation', 'success', function (eventName, data) {
            loadTiles('geolocation');
        }, this);
    }
};

});
;define('common:widget/monitor/pagelog.js', function(require, exports, module){

/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */
var pagemgr = require('common:widget/pagemgr/pagemgr.js');

/**
 * 将HASH转换成性能监控的key
 * @return {string} key
 */
function hash2key () {
    var apphash = window._APP_HASH || {},
        module = apphash.module,
        action = apphash.action,
        page = apphash.page,
        key = '';

    if(/vt=map/.test(location.href)){
        key = (module+'_map').toLowerCase();
    } else {
        key = (module+'_'+action).toLowerCase();
        if(module==='index' && action==='index' && page!=='index') {
            return '';
        }
    }
    return key;
}

/**
 * 获取web监控pageid
 * @return {number} id
 */
function getPageId() {
    var key = hash2key();
    return PDC.DICT[key] ? PDC.DICT[key] : '';
}

/**
 * 获取无刷新监控appid
 * @return {number} id
 */
function getAppId() {
    var key = hash2key();
    return SDC.DICT[key] ? SDC.DICT[key] : '';
}

module.exports = {

    init : function () {

        // 监控落地页性能 通过web监控PDC完成
        var pageid = getPageId();
        if(pageid) {
            PDC && PDC.init({
                sample      : 1,
                product_id  : 16,
                page_id     : pageid
            });
        }

        // 监控切页性能 通过无刷新监控SDC完成
        var eventList = {};

        // 通过事件唯一ID匹配 记录起点时间
        listener.on('common.page', 'switchstart', function (eventName, opts) {
            eventList[opts.eid] = {
                'start': Date.now()
            };
        });

        // 通过事件唯一ID匹配 记录等待时间
        listener.on('common.page', 'pagearrived', function (eventName, opts) {
            if(eventList[opts.eid]) {
                eventList[opts.eid].wait =  Date.now();
            }
        });

        // 通过事件唯一ID匹配 记录结束时间
        listener.on('common.page', 'switchend', function (eventName, opts) {
            if(eventList[opts.eid]) {
                eventList[opts.eid].end =  Date.now();
            }
        });

        // 在页面全部加载完成后 上传性能数据
        listener.on('common.page', 'pageloaded', function (eventName, opts) {
            //落地页不需要统计
            if(pagemgr && pagemgr.isLandingPage()) {
                return;
            }
            var evt = eventList[opts.eid];
            if (evt && evt.start && evt.end && (evt.end - evt.start > 100)) {
                evt.loaded = Date.now();

                var appId = getAppId();
                if (appId) {
                    var app = SDC.createApp(getAppId());
                    app.start_event(evt.start);
                    app.view_time(evt.end);


                    //mark 等待时间
                    if (evt.wait) {
                        app.mark("c_wt", evt.wait);
                    }

                    //mark loaded 时间
                    if (evt.loaded) {
                        app.mark("c_ld", evt.loaded);
                    }

                    app.ready();
                }
            }
        });
    }
};


});
;define('common:widget/monitor/monitor.js', function(require, exports, module){

/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */


/**
 * 无刷新统计ID字典
 */
SDC.DICT = {

    // 底图不同页面性能 
    'MAP_INDEX_INDEX'       : 77,
    'MAP_PLACE_LIST'        : 78,
    'MAP_PLACE_DETAIL'      : 79,
    'MAP_TRANSIT_DETAIL'    : 80,
    'MAP_DRIVE_LIST'        : 81,
    'MAP_SEARCH_SEARCH'     : 82,
    'MAP_OTHER_PAGE'        : 83,

    // 底图综合性能
    'MAP_AVG'               : 205,   // 底图平均性能
    'MAP_VCT'               : 206,   // 底图矢量性能
    'MAP_TIL'               : 207,   // 底图栅格性能

    // 矢量路况性能
    'TRAFFIC_LAD'           : 220,

    //非落地页性能统计
    'index_index'           : 180,  //首页
    'place_list'            : 181,  //place列表
    'place_detail'          : 182,  //place详情
    'transit_list'          : 183,  //公交列表
    'transit_detail'        : 184,  //公交详情
    'drive_list'            : 185,  //驾车列表
    'walk_list'             : 186,   //步行列表
};

/**
 * web监控统计ID字典
 */
PDC.DICT = {
    'index_index'           : 10,   //首页
    'place_list'            : 11,   //place列表
    'place_detail'          : 12,   //place详情
    'transit_list'          : 13,   //公交列表
    'transit_detail'        : 14,   //公交详情
    'drive_list'            : 15,   //驾车列表
    'walk_list'             : 16,   //步行列表
    'transit_crosslist'     : 17,   //跨城公交列表
    'transit_crossdetail'   : 18,   //跨城公交详情
    'index_map'             : 19,
    'place_map'             : 20,
    'transit_map'           : 21,
    'drive_map'             : 22
};

module.exports = {
    /**
     * 性能监控初始化
     */
    init : function () {
        // 无刷新监控初始化(切页和底图)
        SDC && SDC.init({
            sample      : 1,    // 采样率，范围0-1。计算方法：100万/页面pv。
            product_id  : 16,   // 产品线ID webapp为16
            max         : 5     // 刷新一次最大上传个数
        });
        // 页面监控直接初始化
        (require('common:widget/monitor/pagelog.js')).init();
    }
};

});
;define('common:widget/nav/nav.js', function(require, exports, module){

/**
 * @file 返回条导航逻辑
 */

var url = require("common:widget/url/url.js"),
    preloader = require('common:widget/map/preloader/preloader.js'),
    pagemgr = require("common:widget/pagemgr/pagemgr.js");

// 是否返回到上一个replace的url上
var isBackReplaceAble = false;
/**
 * 绑定按钮事件
 * @return {void}
 */
var bind = function () {
    $('.common-widget-nav [jsaction]').on('click', $.proxy(function (e) {
        var target = $(e.currentTarget);
        switch(target.attr('jsaction')) {
            case 'jump': {
                back();
                break;
            }
            case 'tomap': {
                // 并行加载底图数据 需要在url.update之前执行 by jican 
                preloader.loadTiles('mapclick');

                // 拿到后端返回的url通过url.update更新 by jican
                var hash = url.get({
                    path: target.attr('link'),
                    disableEncode: true
                });
                url.update(hash);
                break;
            }
        }   
    }, this));
}

var storageKey = "_lastPageUrl";

var _historyBack = function () {
    var _lastPageUrl = window.localStorage.getItem(storageKey);
    // 如果是上一页保存了上一页信息的，从localStorage取
    // 采用replace方法，会进这个逻辑
    if (typeof _lastPageUrl === "string") {
        window.localStorage.removeItem(storageKey);
        url.navigate(_lastPageUrl,{
            replace : true,
            storageKey : false
        })
    } else {
        history.back();
    }
}


var back = function () {
    if (!pagemgr.isLandingPage() || window._APP_HASH.third_party === 'aladdin') {
        if (isBackReplaceAble === true) {
            _historyBack();
        } else {
            window.localStorage.removeItem(storageKey);
            history.back();
        }
    } else {
        //当前落地页是hao123过来的落地页，返回到hao123
        if(window._APP_HASH.module === 'third' 
            && (window._APP_HASH.action === 'transit' 
                || window._APP_HASH.action === 'weather'
                || window._APP_HASH.action === 'traffic')){
            window.localStorage.removeItem(storageKey);
            history.back();
        }else{
            window.localStorage.removeItem(storageKey);
            url.toIndex();
        }
    }
}
var init = function (isReplace) {
    isBackReplaceAble = !! isReplace;
    bind();
}

module.exports.init = init;

});
;define('common:widget/seacrhnave/searchboxmodel.js', function(require, exports, module){

/*
 * @fileoverview 搜索框Model改版适配简版搜索
 * author: yuanzhijia@baidu.com
 * date: 2013/08/03
 */

// util和 location 已经引入
//var util , location ;
var location = require('common:widget/geolocation/location.js');
// 导出搜索框Model类
var SearchboxModel = {
    
    //搜索框表单数据
    data : {
        start   : {word : ''},   //起点
        end     : {word : ''},   //终点
        geo     : {word : ''}    //定位
    },
    init : function() {

    },
    /**
     * 读写搜索框的表单值 当没有传入参数时将返回所有数据
     * @param {Object} data {
            start : {'word':'', point:'', uid:''},
            end : {'word':'', point:'', uid:''},
            place : {'word':'', point:'', uid:''}
        }
     * @return {Object} data 与传入参数一致
     * @author yuanzhijia@baidu.com
     * @date 2013/08/03
     */
    value : function (data) {
        if(data && $.isPlainObject(data)) {
            return this.set(this._deepAdaptive(data));
        } else {
            return this.get();
        }
    },

    /**
     * 深度适配
     * @param {Object} json
     * @author jican
     * @date 2013/01/21
     */
    _deepAdaptive : function (json) {
        var result = {};
        for(key in json) {
            result[key] = this._adaptive(json[key]);
        }
        return result;
    },

    /**
     * 适配数据格式
     * @param {Object} json {'wd':'西单','pt':'123'}
     * @return {Object} result {'word':'西单','point':'123'}
     * @author jican
     * @date 2013/01/21
     */
    _adaptive : function (json) {
        var result = {};
        for(key in json) {
            if(key=='name' || key=='wd') {
                result.word = json[key];
            } else if(key=='pt') {
                result.point = json[key];
            } else {
                result[key] = json[key];
            }
            if(result.word==MY_GEO) {
                //若当前app.mylocationation为undefined，则不从此处获取位置
                if(location.hasExactPoi()){
                    return result;
                }else{
                    result = this.getExactlocationData();
                }
            }
        }
        if(result.point && $.isPlainObject(result.point)) {
            result.point = result.point.lng + ',' + result.point.lat
        }

        return result;
    },

    /**
     * 设置数据 会主动派发事件 搜索框会自动更新
     * @param {String} key 数据键值
     * @param {Object} data {
            start : {'word':'', point:'', uid:''},
            end : {'word':'', point:'', uid:''},
            place : {'word':'', point:'', uid:''}
        }
     * @author mod by zhijia
     * @date 2013/08/03
     */
    set : function (key, data) {
        if(
            (key && (typeof(key) == "string")) &&
            (data && $.isPlainObject(data))
        ) {
            this.data[key] = data;
        } else if(key && $.isPlainObject(key)) {
            $.extend(this.data, key);
        }
    },

    /**
     * 设置数据 注意该方法与set区别在与不会派发事件
     * @param {String} key 数据键值
     * @param {Object} data {
            start : {'word':'', point:'', uid:''},
            end : {'word':'', point:'', uid:''},
            place : {'word':'', point:'', uid:''}
        }
     * @author jican
     * @date 2013/01/21
     */
    _set : function (key, data) {
        if(
            (key && (typeof(key) == "string")) &&
            (data && $.isPlainObject(data))
        ) {
            this.data[key] = data;
        } else if(key && $.isPlainObject(key)) {
            $.extend(this.data, key);
        }
    },

    /**
     * 获取数据 不传key将返回所有
     * @param {String} key 数据键值 
     * @author jican
     * @date 2013/01/21
     */
    get : function (key) {
        if(key && (typeof(key) == "string")) {
            return this.data[key];
        }
        return this.data;
    },

    /**
     * 获取精确当前位置并返回搜索框可用的数据格式
     * @author jican
     * @date 2013/01/21
     */
    getExactlocationData : function () {
        var result = {word : ''},
            mylocationation = location;

        if(mylocationation && mylocationation.point) {
            result = {
                word : MY_GEO,
                point : mylocationation.point.x + ',' + mylocationation.point.y,
                citycode : mylocationation.addr.cityCode
            }
        }
        return result;
    },

    /**
     * 获取中心点名称
     * @author jican
     * @date 2013/01/21
     */
    getCenterName : function () {
        if(location.hasExactPoi()) {
            return location.isUserDeny() ? location.getAddress() : MY_GEO;
        }
        return '';
    }
};
module.exports =  SearchboxModel;

});
;define('common:widget/seacrhnave/seacrhnave.js', function(require, exports, module){

require('common:static/js/gmu/src/widget/suggestion/suggestion.js');
require('common:static/js/gmu/src/widget/suggestion/renderlist.js');
require('common:static/js/gmu/src/widget/suggestion/quickdelete.js');
require('common:static/js/gmu/src/widget/suggestion/sendrequest.js');
/*
 * @fileoverview 三大金刚跳转路线搜索框
 * author: yuanzhijia@baidu.com
 * date: 2013/08/07
 */
var util = require('common:static/js/util.js'),
    locator = require('common:widget/geolocation/location.js'),
    popup = require('common:widget/popup/popup.js'),
    url = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js'),
    searchboxmodel = require("common:widget/seacrhnave/searchboxmodel.js");

var MY_GEO = "我的位置",
    IS_REALLY_LOCATION = false; //是否是真正定上位了,防止用户手动输入我的位置实际未成功定位

module.exports = {

    init: function() {
        this.render();
        this.bind();
        var pt = this._getPagetype();
        if (!pt.isSelf) {
            this[pt.elSelf].val(pt.word);
            this.model.set([pt.el], {
                word: pt.word,
                point: pt.point
            });
        }

        this.revertLast();
    },

    render: function() {
        var me = this,
            urlParam = url.get(),
            pageState = urlParam.pageState || {};
        me.seStart = $('#se_txt_start');
        me.seEnd = $('#se_txt_end');
        me.maskid = $('#se_wrap');
        me.reverseBtn = $('#se_dir_reverse');

        me.model = searchboxmodel;

        me.urlstart = me._proceedUrl(pageState.start);
        me.urlend = me._proceedUrl(pageState.end);
        me.pagetype = me._getPagetype();
        me.selement = $('#se_txt_start, #se_txt_end');
        me.submitbtn = $('.se-btn-tr');
        me.sedirform = $('.se-dir-form');
    },

    revertLast: function() {
        var me = this;
        if ($.trim(me.seEnd.val()) === "") {
            var start = this.model.get("start") || {},
                end = this.model.get("end") || {};
            start.word && me.seStart.val(start.word);
            end.word && me.seEnd.val(end.word);
        }
    },

    /*
     ** 获取url中的参数
     */
    _proceedUrl: function(udata) {

        var res = false;
        //try{
        if (udata != undefined) {
            res = {
                word: "",
                point: ""
            };
            var datarr = udata.trim().split('&');
            datarr[0] && (res.word = decodeURIComponent(datarr[0].split('=')[1]));
            datarr[1] && (res.point = decodeURIComponent(datarr[1].split('=')[1]));
        }
        //} catch(e) {

        //}
        return res;
    },
    /**
     * 绑定事件
     */
    bind: function() {
        var me = this;
        //修复默认浏览器我的位置回填
        $(window).on('pageshow', function() {
            if (IS_REALLY_LOCATION) {
                setTimeout(function() {
                    me._setLocation();
                }, 0);
            }
        });
        // 注册起点quickdeletestart
        // me._poiQuickStart = $.ui.quickdelete({
        //     container: me.seStart
        // });

        // 注册起点suggesstionstart
        me._poiSugStart = new gmu.Suggestion('#se_txt_start', {
            form: me.sedirform,
            source: 'http://map.baidu.com/su',
            cbKey: 'callback',
            listCount: 6, // SUG条目
            posAdapt: false, // 自动调整位置
            historyShare: true, // 是否共享
            autoClose: true,
            appendContanier: '#wrapper', //是否挂在body下面
            quickdelete: true
        });
        me._poiSugStart.$wrapper.offset({
            left: 0,
            top: 194
        });

        $('#se_txt_start').on('focus', function() {
            me._poiSugEnd && me._poiSugEnd.hide();
        });

        // 注册终点suggesstionstart
        me._poiSugEnd = new gmu.Suggestion('#se_txt_end', {
            form: me.sedirform,
            source: 'http://map.baidu.com/su',
            cbKey: 'callback',
            listCount: 6, // SUG条目
            posAdapt: false, // 自动调整位置
            historyShare: true, // 是否共享
            autoClose: true,
            appendContanier: '#wrapper', //是否挂在body下面
            quickdelete: true
        });
        me._poiSugEnd.$wrapper.offset({
            left: 0,
            top: 194
        });

        $('#se_txt_end').on('focus', function() {
            me._poiSugStart && me._poiSugStart.hide();
        });

        me.reverseBtn.on('touchstart', $.proxy(me['_reverse'], this));
        me.reverseBtn.on('touchend', $.proxy(me['_reverseEnd'], this));

        var updateLocation = function() {
            //IS_REALLY_LOCATION = true;
            IS_REALLY_LOCATION = !! (locator.getMyLocation().point);

            me._setLocation();
        }

        if (locator.getMyLocation()) {
            updateLocation();
        } else {
            //定位成功后更新我的位置
            listener.on('common.geolocation', 'mylocsuc', function() {
                updateLocation();
            }, this);
        }

        me.selement.on('focus', $.proxy(me._focus, this));
        me.selement.on('blur', $.proxy(me._blur, this));
        me.selement.on('mousedown', $.proxy(me._touchstart, this));
        me.submitbtn.on('click', $.proxy(me._poiSubmit, this));
        me.submitbtn.on('touchend', $.proxy(me._poiSubmitEnd, this));
        me.selement.on('mousedown', $.proxy(me._touchstart, this));
        me.sedirform.on('submit', $.proxy(this._poiSubmit, this));
        listener.on('common.page', 'switchstart', function() {
            $('.ui-suggestion').length && $('.ui-suggestion').hide();
        });
    },
    /**
     *统一判断当前页面类型
     */
    _getPagetype: function() {
        var me = this,
            result = {
                elSelf: '',
                el: "seStart",
                key: "start",
                isSelf: false,
                word: '',
                point: ''
            };
        if (me.urlend) {
            result.elSelf = "seEnd";
            result.word = me.urlend.word;
            result.point = me.urlend.point;
        } else if (me.urlstart) {
            result.key = "end";
            result.el = "seEnd";
            result.elSelf = "seStart";
            result.word = me.urlstart.word;
            result.point = me.urlend.point;
        } else {
            result.isSelf = true;
        }
        return result;
    },
    /**
     * 检查表单元素内容是否为空 自动聚焦
     * @param {Element} element
     * @return {Boolean} 是否检查通过
     */
    _checkInput: function(element) {
        if (!element) {
            return false;
        } else if (!/\S+/.test(element.val())) {
            element.focus();
            return false;
        }
        if (element.val() == MY_GEO && this.model.get('geo').word != MY_GEO) {
            element.val('');
            popup.open({
                text: '定位失败！'
            });
            return false;
        }
        return true;
    },
    /**
     *获取公用的geodata
     */
    _getGeoData: function() {
        var geoData = {
            'word': '',
            'point': '',
            'citycode': ''
        },
            data = locator.getLocation();

        if (IS_REALLY_LOCATION) {
            geoData = {
                'word': MY_GEO,
                'point': locator.getMyPointX() + ',' + locator.getMyPointY(),
                'citycode': locator.getMyCityCode()
            }
        }
        return geoData;
    },
    /**
     * 反转起点和终点
     */
    _reverse: function(e) {
        var me = this,
            se = {
                start: $('#se_txt_start').val(),
                end: $('#se_txt_end').val()
            };

        me.reverseBtn.addClass("active");
        me.seStart.val(se.end);
        me.seEnd.val(se.start);
        me.model.set('end', me.model.get('start'));
        me.model.set('start', me.model.get('end'));
        me._update();
    },
    _reverseEnd: function(e) {
        this.reverseBtn.removeClass("active");
    },
    /**
     * 更新我的位置对应的文本框状态
     */
    _update: function() {
        var me = this;
        var start = me.seStart,
            end = me.seEnd,
            geo = me.model.get('geo');
        if (start.val() == MY_GEO && geo.word == MY_GEO && IS_REALLY_LOCATION) {
            start.addClass('geo');
            end.removeClass('geo');
        } else {
            start.removeClass('geo');
        }
        if (end.val() == MY_GEO && geo.word == MY_GEO && IS_REALLY_LOCATION) {
            end.addClass('geo');
            start.removeClass('geo');
        } else {
            end.removeClass('geo');
        }
    },
    /**
     * 通过判断是否是三大金刚跳转过来还是路线搜索设置model
     */
    _setLocation: function() {
        var me = this,
            stratinput = me.seStart,
            endinput = me.seEnd,
            result = me.pagetype,
            geoData = me._getGeoData();
        if (IS_REALLY_LOCATION && $.trim(me[result.el].val()) === "") {
            me[result.el].val(MY_GEO);
        }
        result.key && me.model.set(result.key, geoData);
        var geo = me.model.get('geo');
        if (!geo.point || (geoData && geoData.point !== '')) {
            me.model.set('geo', geoData);
        }
        me._update();
    },
    /**
     * 文本框素获得焦点
     */
    _focus: function(e) {
        var el = $(e.target);
        var seInner = $('.se-inner');
        $(".ui-suggestion").css("width", "100%");
        if (el.hasClass('se_txt_start')) {
            seInner[0].style.border = "1px solid #D55959";
            seInner[1].style.border = "1px solid #d9d9d9";

        }
        if (el.hasClass('se_txt_end')) {
            seInner[0].style.border = "1px solid #d9d9d9";
            seInner[1].style.border = "1px solid #D55959";
        }
        if (el.val() == MY_GEO) {
            el.val('');
            //TODO 我的位置 focus sug不出的问题
            el.trigger('focus');
        }
        el.removeClass('geo');
    },
    /**
     * 文本框素失去焦点
     */
    _blur: function(e) {
        var me = this,
            el = $(e.target),
            key = el.attr('key'),
            geo = me.model.get('geo'),
            //根本没定位成功或者用户手工输入
            isGeoFlag = (geo.word != MY_GEO && txt == MY_GEO && IS_REALLY_LOCATION),
            //文本框发现是我的位置 但却根据定位监测到不是真正我的位置
            //isUserInput = (txt == MY_GEO && locator.isUserInput()),
            txt = el.val().trim();
        if (isGeoFlag) {
            //强制清空文本 告知定位失败
            el.val("");
            popup.open({
                text: '定位失败！'
            });
        }
        if (geo.point && txt == '' && IS_REALLY_LOCATION) {
            if (me.model.get(key).word == geo.word) {
                el.val(MY_GEO);
                el.addClass('geo');
            }
            //符合了定位 而且当前文本框是我的位置的话 强制再去检测当前位置的GEO
            var modelkey = (key == "start" ? "seStart" : "seEnd");
            if ($.trim(me["seStart"].val()) != MY_GEO && $.trim(me["seEnd"].val()) != MY_GEO) {
                me.model.set(key, me._getGeoData());
                me.model.set(modelkey, {
                    word: ""
                });
            }
        }
    },
    //修复错误数据 by zhijia
    _fixDirData: function() {
        var startendIpt = $('.se-dir-form input[type=text]'),
            fixpt = this._getPagetype()
            ptIsSelf = fixpt.isSelf,
            me = this;
        $.each(startendIpt, function() {
            var key = $(this).attr('key'),
                Ipt = $('#se_txt_' + key + ''),
                Data = me.model.get(key),
                IptFlase = (Data.word != Ipt.val());
            if (!Data.word || IptFlase) {
                if ((Ipt.val() === MY_GEO) && IS_REALLY_LOCATION) {
                    me.model.set(key, me._getGeoData());
                } else {
                    if (ptIsSelf || (Ipt.val() != fixpt.word)) {
                        me.model.set(key, {
                            word: Ipt.val()
                        });
                    } else {
                        me.model.set(key, {
                            word: fixpt.word,
                            point: fixpt.point
                        });
                    }
                }
            }
        });
    },
    _touchstart: function(evt) {
        var el = $(evt.target);
        el.focus();
        evt.stopPropagation();
    },
    /**
     * 获取路线方案请求参数
     * @param {Number} tab 1公交 2驾车 3步行 或者 'transit' 'drive' 'walk'
     * @param {Object} start 起点 {word:'',uid:'',point:''}
     * @param {Object} end 终点 {word:'',uid:'',point:''}
     * @param {Object} opts 可选参数
     * @return {Object} param
     */
    _getDirParam: function(tab, start, end, opts) {
        //start = this.model._adaptive(start); 自身适配
        //end = this.model._adaptive(end);
        var param,
            code = locator.getCityCode() || 1,
            searchIndex = this._getTabIndex('search', tab),
            startCode = start.citycode || code,
            endCode = end.citycode || code,
            cityCode = startCode || code;

        // 起终点确定或均不确定路线方案拼接
        if ((start.point && end.point) || !start.point && !end.point) {
            param = {
                'qt': ['s', 'bt', 'nav', 'walk'][searchIndex] || 'bt',
                'sn': this._joinParam(start),
                'en': this._joinParam(end),
                'sc': startCode,
                'ec': endCode,
                'c': cityCode,
                'pn': '0',
                'rn': '5'
            }
        } else {
            // 单边路线方案拼接
            var sureData,
                sureKey,
                seType,
                searchData;
            if (start.point) {
                sureData = start;
                searchData = end;
                sureKey = 'sn';
                seType = '1';
            } else {
                sureData = end;
                searchData = start;
                sureKey = 'en';
                seType = '0';
            }

            var qt = ['s', 'bse', 'nse', 'wse'][searchIndex] || 'bse',
                point = sureData.point;

            param = {
                'qt': qt,
                'ptx': point.split(',')[0],
                'pty': point.split(',')[1],
                'wd': searchData.word || '',
                'name': sureData.word || '',
                'c': code,
                'sc': start.citycode || code,
                'ec': end.citycode || code,
                'isSingle': 'true'
            };

            param[qt + 'tp'] = seType;
            param[sureKey] = this._joinParam(sureData);
        }

        if (opts && opts.from) {
            param.searchFlag = opts.from || '';
        }

        if (['nav', 'nse', 'walk', 'wse'].indexOf(param.qt) >= 0) {
            param.version = '3'; //驾车和步行采用新接口 by zhijia
        }

        if (['bse', 'bt'].indexOf(param.qt) >= 0) {
            param.version = '5'; //bt bse model 采用V5接口 by  zhijia
            param.exptype = 'dep';
        };
        return param;
    },
    /**
     * 搜索框提交
     * @param {Object} opts 可选参数
     * @author yuanzhijia@baidu.com
     * @date 2013/08/02
     */
    _poiSubmit: function(opts) {
        if (opts && opts.stopPropagation) {
            opts.stopPropagation(); /*阻止冒泡*/
        }
        if (opts && opts.preventDefault) {
            opts.preventDefault(); /*阻止表单默认事件的派发*/
        }
        var ele = opts,
            tab;
        ele.currentTarget && (tab = $(opts.currentTarget).attr('data-value'));
        var tacticsSel = $(ele.currentTarget);
        tacticsSel.addClass('active');
        var me = this,
            startIpt = me.seStart,
            endIpt = me.seEnd;
        if (!(me._checkInput(startIpt)) || !(me._checkInput(endIpt))) {
            return false;
        }
        this._fixDirData();

        switch (tab) {
            case "1":
                //公交类检索量
                stat.addCookieStat(COM_STAT_CODE.STAT_BUS_SEARCH);
                break;
            case "2":
                //驾车类检索量
                stat.addCookieStat(COM_STAT_CODE.STAT_NAV_SEARCH);
                break;
            case "3":
                //步行类检索量
                stat.addCookieStat(COM_STAT_CODE.STAT_WALK_SEARCH);
                break;
        }
        if (!tab) {
            //点击suggestion 默认走公交逻辑
            tab = "1";
        }
        var qt = me._getDirParam(tab, this.model.get('start'), this.model.get('end'), opts);
        (startIpt.val() != MY_GEO) && this._poiSugStart && this._poiSugStart.history(startIpt.val());
        (endIpt.val() != MY_GEO) && this._poiSugEnd && this._poiSugEnd.history(endIpt.val());
        url.update({
            module: "search",
            action: "search",
            query: qt
        });
    },
    _poiSubmitEnd: function(opts) {
        var ele = opts;
        var tacticsSel = $(ele.target);
        tacticsSel.removeClass("active");
    },
    /**
     * 返回索引类型的Tab值
     * @param {Number|String} tab
     * @return {Number} 0 1 2 3
     * @author jican
     * @date 2013/01/21
     */
    _getTabIndex: function(type, tab) {
        if (!isNaN(tab)) {
            var str = this._num2str(type, tab),
                num = this._str2num(type, str);
            return num;
        } else if (typeof(tab) == "string") {
            return this._str2num(type, tab);
        }
    },

    /**
     * 返回字符串类型的Tab值
     * @param {Number|String} tab
     * @return {String} 'place' 'transit' 'drive' 'walk'
     * @author jican
     * @date 2013/01/21
     */
    _getTabStr: function(type, tab) {
        if (!isNaN(tab)) {
            return this._num2str(type, tab);
        } else if (_.isString(tab)) {
            var num = this._str2num(type, tab),
                str = this._num2str(type, num);
            return str;
        }
    },

    /**
     * 字符串类型的Tab转化成数值类型
     * @param {String} str
     * @return {Number} tab
     * @author jican
     * @date 2013/02/27
     */
    _num2str: function(type, index) {
        if (type == 'tab') {
            return ['place', 'line'][index] || 'place';
        } else {
            return ['place', 'transit', 'drive', 'walk'][index] || 'place';
        }
    },

    /**
     * 数值类型的Tab转化成字符串类型
     * @param {Number} tab
     * @return {String} str
     * @author jican
     * @date 2013/02/27
     */
    _str2num: function(type, str) {
        if (type == 'tab') {
            return {
                'plcae': 0,
                'line': 1
            }[str] || 0;
        } else {
            return {
                'place': 0,
                'transit': 1,
                'drive': 2,
                'walk': 3
            }[str] || 0;
        }
    },
    /**
     * 将起终点数据连接成请求参数
     * @param {Object} data start,end
     * @author yuanzhijia
     * @date 2013/08/03
     */
    _joinParam: function(data) {
        if (!data) {
            return '';
        }
        var type = data.point ? '1' : '2',
            uid = data.uid || '',
            point = data.point || '',
            word = data.word || '';
        return [type, uid, point, word, ''].join('$$');
    }
}

});
;define('common:widget/search/poisearch.js', function(require, exports, module){

/**
 * @file 地点类检索
 */

var locator = require('common:widget/geolocation/location.js');
var url = require('common:widget/url/url.js');


/**
 * 发起地点类检索
 * @param {String} word 检索关键词
 * @param {Object} opts 可选参数
 * @author jican
 * @date 2013/01/21
 */
module.exports.search = function  (word, opts) {

    if(!word) {
        return;
    }

    opts = opts || {};
    var param = {
        'qt'            : 's',
        'wd'            : word || '',
        'c'             : locator.getCityCode() || 1,
        'searchFlag'    : opts.from || 'bigBox',
        'version'       : '5',
        'exptype'       : 'dep'
    };

    if(locator.hasExactPoi()) {
        param['nb_x'] = locator.getPointX();
        param['nb_y'] = locator.getPointY();
        param['center_rank'] = 1;
    }

    url.update({
        module : 'search',
        action : 'search',
        query : param,
        pageState : {vt:''}
    }, {
        queryReplace : true,
        pageStateReplace: true
    });
};

});
;define('common:widget/setcity/setcity.js', function(require, exports, module){

/**
 * @file 设置城市
 */

var cookie = require("common:widget/cookie/cookie.js"),
	url = require("common:widget/url/url.js"),
	pageMgr = require("common:widget/pagemgr/pagemgr.js"),
	util = require("common:static/js/util.js"),
	geoLoc = require('common:widget/geolocation/location.js');


var cookieOptions = {
		path : "/mobile/",
		expires : 60 * 60 *24
	};

var BUSINESS_SPLIT = "     ";

var _cacheCity = {
		cityName : "",
		cityId : "",
	};

var _saveCity = function (cityName,cityId) {
		_cacheCity.cityName = cityName;
		_cacheCity.cityId = cityId;
	};

/**
 * 设置城市
 * @param  {string} cityName 城市名
 * @return {string}          
 */
var setAndRedirect = function(cityName, cityId, cityEng) {
	if (typeof cityName !== "string") {
		return;
	}
	if (window._APP_HASH.page == 'setsubwaycity') {
		redirectToSubway(cityEng);
	} else {
		// 保存城市信息
		_saveCity(cityName, cityId);
		cookie.set("setCityName", cityName, cookieOptions);
		redirect();
	}
	return cityName;
};

var redirect = function () {
	var urlParam = url.get(),
		query = urlParam.query,
		pageState = urlParam.pageState,
		referQuery,
		opts;


	if(pageState.refer_query){
		try{
			referQuery = JSON.parse(decodeURIComponent(pageState.refer_query));
			referPageState = JSON.parse(decodeURIComponent(pageState.refer_pagestate));
		} catch (e) {
			url.toIndex({
				cache : false
			});
		}

		//若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
		if(referQuery.wd && referQuery.wd.split(BUSINESS_SPLIT)[1]){
			referQuery.wd = referQuery.wd.split(BUSINESS_SPLIT)[1];
		}

		//如果是外卖页的refer,则跳转到外卖，否则跳转到place页
		if(referQuery.qt === 'wm' || referPageState.search == "takeout"){
			opts = getWmOptions(referQuery,referPageState);
		} else {
			opts = getOptions(referQuery,referPageState);
		}
		redirectToRefer(opts);
	} else {
		url.toIndex({
			cache : false
		});
	}

};

var getOptions = function (query) {

	var _query = query || {};

	_query.c = _cacheCity.cityId || _query.c;
	// 删除中心点信息
	delete _query.nb_x;
	delete _query.nb_y;
	opts = {
		'module': 'place',
		'action': 'list',
		'query' :  _query,
		'pageState' : {
			'dist_name' : _cacheCity.cityName
		}
	};

	return opts;
};

var getWmOptions = function  (query, pageState) {
	var _query = query || {};
	var _pageState = pageState || {};
	_query.cityId = _cacheCity.cityId || _query.c;
	_query.c      = _query.cityId;
	_query.pageNum = 1;
	_query.m = 'searchBrands';
	// 查找城市级别的外卖，删除中心点等其他信息
	delete _query.nb_x;
	delete _query.nb_y;
	delete _query.pointX1;
	delete _query.pointY1;
	delete _query.radius;
	delete _query.sortType;
	delete _query.orderType;

	_pageState = $.extend(_pageState, {
		'citysearch' : 1,
		'center_name': _cacheCity.cityName 
	});

	opts = {
		'module' : 'place',
		'action' : 'takeout',
		'query'  : _query,
		'pageState': _pageState
	};

	return opts;
};

var redirectToRefer = function (opts) {

	if(opts && opts.module && opts.action) {
		url.update(opts);
	} else {
		url.toIndex();
	}
};

var redirectToSubway = function(city) {
	url.update({
		module : "subway",
		action : "show",
		query : {
			city : city
		}
	});
};
/**
 * 设置城市
 * @param  {string} cityName 城市名
 * @return {string}          
 */
module.exports.setAndRedirect = setAndRedirect;

});
;define('common:widget/sharefriends/sharefriends.js', function(require, exports, module){

/**
* @file 分享给好友
* @author nichenjian@baidu.com
*/


var util  = require('common:static/js/util.js'),
    href  = require('common:widget/url/url.js'),
    stat = require('common:widget/stat/stat.js');

ShareToFriends = {
	/**
	* 分享给好友初始化
	* @param {string} type 分享的页面类型，支持transit, drive, walk
	*/
	init: function(type){
		this.type = type;
		this.bindEvent();
	},
	bindEvent: function(){
		$('.send-phone').on('click', $.proxy(this.shareToFriends, this));
	},
	/**
    * 发送短信将位置共享给好友
    * 用户点击时，异步获取短信信息，获取成功后将自动触发click事件
    * @param {object} e 事件对象
    */
    shareToFriends: function(e){
        var me = this;
        var $share = $('#share-to-friends');
        var value = $share.attr('href');
        var url;
        //链接已经包含短信，直接触发短信
        if(value && value.indexOf('body') > -1){
            return;
        }
        if(this.type == 'transit'){
        	url = me.getTransitSmsUrl();
        }else{
        	url = me.getSmsUrl();
        }
        
        //成功回调
        var successCallback = function(data){
            if(!data || !data.sms_content){
                return;
            }

            var content = data.sms_content;
            $share.attr('href', 'sms:?body=' + content);
            location.href = 'sms:?body=' + content;
        }
        //失败回调
        var errorCallback = function(data){}

        $.ajax({
            url: url,
            dataType: 'jsonp',
            success: successCallback,
            error: errorCallback
        })

        e.preventDefault();
        //分享给好友的点击统计
        stat.addStat(COM_STAT_CODE.SHARESMS_CLICK);
    },
    /**
    * 获取公交详情短信的url
    * @return {string} 拼装后短信的url
    */
    getTransitSmsUrl: function(){
        var location  = href.get();
        var query = location.query || {};
        var state = location.pageState || {};
        var i = state.i + ',1,1';
        //ready接口基础url
        var BASE_READY_URL = 'http://map.baidu.com/ag/sms/ready?url=';
        //qt的url
        var BASE_QT_URL = 'http://map.baidu.com/?i='+ i + '&s=' + query.qt;

        //编码的query
        var q = encodeURIComponent('&' + util.jsonToQuery(query));
        //需要将qt和query再次编码
        var url = BASE_READY_URL + encodeURIComponent(BASE_QT_URL + q + '&sc=0&smsf=1') + '&t=' + new Date().getTime();
        return url;
    },
    /**
    * 获取短信的url, 驾车和步行进入此逻辑
    * @return {string} 拼装后短信的url
    */
    getSmsUrl: function(){
        var location = href.get();
        var query = location.query || {};
        //ready接口基础url
        var BASE_READY_URL = 'http://map.baidu.com/ag/sms/ready?url=';
        //qt的url
        var BASE_QT_URL = 'http://map.baidu.com/?s=' + query.qt;

        //删除version参数，防止短信接口不返回里程。
        delete query.version;

        //编码的query
        var q = encodeURIComponent('&' + util.jsonToQuery(query));
        //需要将qt和query再次编码
        var url = BASE_READY_URL + encodeURIComponent(BASE_QT_URL + q + '&sc=0&smsf=1') + '&t=' + new Date().getTime();
        return url;
    },
    /**
    * 触发事件
    * @param {object} dom节点
    * @param {string} evt事件，如'click' 
    */
    fireEvent: function(obj, evt){
        var fireOnThis = obj;
        if( document.createEvent ) {
            var evObj = document.createEvent('MouseEvents');
            evObj.initEvent( evt, true, false );
            fireOnThis.dispatchEvent( evObj );
        }
    }
};

module.exports = ShareToFriends;

});
;define('common:widget/statistics/statistics.js', function(require, exports, module){

/**
 * @fileOverview 异步统计模块 
 * @author yuanzhijia@baidu.com
 * @date 2013-11-05
 */
var stat = require('common:widget/stat/stat.js');
module.exports = {
    init : function () {
    	var me = this;
    	me.addestop();
    },
    addestop:function(){
	    //从桌面打开统计
        if(window.navigator.standalone){
            stat.addCookieStat(COM_STAT_CODE.STAT_FROMDESKTOP_OPEN);
        }
    }
}

});
;define('common:widget/streetview/streetview.js', function(require, exports, module){

/**
 * @fileoverview streetview 显示界面
 */
var util = require('common:static/js/util.js'),
    Popup = require('common:widget/popup/popup.js'),
    url = require('common:widget/url/url.js'),
    pagemgr = require('common:widget/pagemgr/pagemgr.js'),
    Cookie = require('common:widget/cookie/cookie.js'),
    storage = require('common:static/js/localstorage.js');


var BMap, CustomMarker;

module.exports = {
    Str: {
        DAY: 'day',
        NIGHT: 'night',
        BANNER_ID: 'app-banner-for-stv',
        STREETVIEW_CONTAINER_ID: 'streetview-container',
        MAP_CONTAINER_ID: 'eagleeye-container',
        MAP_ID: 'eagleeye-map',
        NORESULT: '未找到街景数据'
    },

    os: util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown",

    init: function(opts) {

        opts = opts || {};

        BMap = opts.BMap;
        CustomMarker = opts.CustomMarker;

        var me = this;
        this.show();
        this._updated = false; // 表示街景是否通过变更id或者position而发生了更新，用来判断是否需要统计
        this.initStreetView();
        this.initMap();
        this.updateStreetView();
        this.bind();
        this.onSizeChange();
    },

    initStreetView: function() {
        var strView;
        this.streetView = strView = new BMap.StreetView(this.Str.STREETVIEW_CONTAINER_ID);
        strView.addEventListener('position_changed', $.proxy(this.onPositionChanged, this));
        strView.addEventListener('links_changed', $.proxy(this.onPositionChanged, this));
        strView.addEventListener('dataload', $.proxy(this.onStreetDataLoaded, this));
        // 用于性能监控 by jz
        strView.addEventListener('tilesloaded', $.proxy(this.onTilesLoaded, this));

    },

    onStreetDataLoaded: function() {
        //this.sendStats(STAT_CODE.STAT_STREETVIEW_VIEW);
    },

    initMap: function() {
        var me = this;
        // 初始化地图
        var mapOptions = {
            maxZoom: 14,
            minZoom: 14,
            drawMargin: 0,
            enableFulltimeSpotClick: false,
            vectorMapLevel: 99,
            drawer: BMAP_CANVAS_DRAWER
        };
        this.eyeMap = new BMap.Map(this.Str.MAP_ID, mapOptions);
        this.eyeMap.disableHighResolution();
        this.eyeMap.disableDoubleClickZoom();
        this.eyeMap.disablePinchToZoom();
        this.eyeMap.addTileLayer(new BMap.StreetViewCoverageLayer());
        this.eyeMap.addEventListener('click', $.proxy(this.onEyeMapClick, this));
    },

    onEyeMapClick: function() {
        $('#' + this.Str.MAP_CONTAINER_ID).toggleClass('exp');
        var point = this.streetView.getPosition();
        // 容器大小发生变化，由于后面重新设置了中心点，所以这里需要强制resize一下
        // 否则地图自动监听容器变化有延时
        this.eyeMap.checkResize();
        this.eyeMap.centerAndZoom(point, 15);
    },
    //check 屏幕横竖状态 true 竖屏， false横屏 todo:不准确
    checkEyeMapDirection: function() {
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        return (ww < wh ? true : false);
    },

    toMax: function() {
        var $backNav = $('#back_nav');
        var $uninscrllWrapper = $('#uniscroll-wrapper');
        var bh = $backNav.height();

        //$backNav.addClass('hide');
        //$uninscrllWrapper.css({top: 0});

        $('#' + this.Str.MAP_CONTAINER_ID).css({
            'visibility': 'hidden',
            'left': -1000
        });
        $("#street-holder").find('.addr').show();

        listener.trigger('common', 'sizechange');
    },

    recovery: function() {
        var opts = url.get();

        $('#' + this.Str.MAP_CONTAINER_ID).css({
            'visibility': 'visible',
            'left': 5
        });
        // 容器变化需要重新设置中心点
        this.eyeMap.checkResize();
        this.eyeMap.centerAndZoom(this.streetView.getPosition(), this.eyeMap.getZoom());
        $("#street-holder").find('.addr').hide();
        listener.trigger('common', 'sizechange');
    },

    bind: function() {
        var me = this;
        this.streetView.addEventListener('click', $.proxy(this.onStreetViewClick, this));
        this.streetView.addEventListener('noresult', $.proxy(this.onNoResult, this));

        $('#eagleeye-container, #street-holder .mode').on('touchstart touchend', function(e) {
            e.stopPropagation();
        });
        $("#street-holder").find('.mode').on('click', $.proxy(this.onToggleMode, this));
        listener.on('common', 'sizechange', this._onSizeChange);

        pagemgr.registerDestory($.proxy(me.destory, this));
    },

    _onSizeChange: function() {
        return $.proxy(this.onSizeChange, this);
    },

    onSizeChange: function() {
        var opts = url.get();
        if (!this.hasAlertDisabled() && !this.checkEyeMapDirection() && !util.isIPad()) {
            //在小米1默认浏览器下,localStorage保存数据不立刻生效的问题。 
            if (this.alertDsabeld) return;

            Popup.open({
                text: '街景在横屏下体验较差，建议在竖屏下使用。',
                autoCloseTime: 3000
            });
            this.alertDsabeld = true;
            storage.addData("alertDisabled", "true", {
                error: function() { // localstorage写入失败时写入cookie
                    var options = {
                        domain: 'map.baidu.com',
                        path: '/',
                        expires: 365 * 24 * 60 * 60 * 1000
                    };
                    Cookie.set("alertDisabled", "true", options);
                }
            });

            $('.common-widget-popup').on('touchstart', function() {
                $('.common-widget-popup').remove();
            });
            // setTimeout(function(){
            //     if(pageState.vt == 'streetview'){
            //         util.TxtBox.c({
            //             clearAll:true
            //         });
            //     }
            // }, 3000);
        }

        //渲染街景后，在横屏下产品头被遮住，用延时重新滚动浏览器的页面位置
        setTimeout(function() {
            window.scrollTo(0, 0);
        }, 100);
    },

    hasAlertDisabled: function() {
        var alertDisabled;
        storage.selectData("alertDisabled", {
            success: function(result) {
                alertDisabled = result;
                if (!alertDisabled) {
                    alertDisabled = Cookie.get("alertDisabled");
                    if ("" + alertDisabled === "true") {
                        storage.addData("alertDisabled", "true", {
                            success: function() {
                                Cookie.remove("alertDisabled");
                            }
                        });
                    }
                }
            },
            error: function() {
                alertDisabled = Cookie.get("alertDisabled");
            }
        });
        return "" + alertDisabled == "true";
    },

    onNoResult: function() {
        var opts = url.get();

        Popup.open({
            text: this.Str.NORESULT,
            autoCloseTime: 1500
        });
        //clearTimeout(this.interval);
        // this.interval = setTimeout(function(){
        //     if(pageState.vt == 'streetview'){
        //         util.TxtBox.c({
        //             clearAll:true
        //         });
        //     }
        // }, 3000);
        this.onPositionChanged();
    },

    onStreetViewClick: function() {
        this.maxStatus = !this.maxStatus;
        this.maxStatus ? this.toMax() : this.recovery();
        this.setDayAndNigthMode();
        //var curControl = app.getCurController();
        //var banner = curControl.views['streetbanner'];
        //banner && banner.hideBanner();
    },

    onToggleMode: function() {
        var mode = this.streetView.getMode();
        var rel = this.streetView.getRelevants();

        if (rel[0] && rel[0]['mode']) {
            var data = rel[0]['mode'] === 'day' ? 'night' : 'day';
            if (data) {
                $("#street-holder").find('.mode').show().
                removeClass('night day').addClass(mode === 'day' ? 'night' : 'day');
            }
            this.streetView.setId(rel[0]['id']);
        }
    },

    update: function() {
        this.show();
        this.updateStreetView();
    },

    hide: function() {
        $("#street-holder").css('visibility', 'hidden');

        $('#' + this.Str.MAP_CONTAINER_ID).css('visibility', 'hidden');
        if (util.isIOS() && this.streetView) {
            // iOS6上发现svg与地图有冲突，导致无法拖拽，所以
            // 隐藏街景的时候也需要把svg元素隐藏
            this.streetView._linksContainer && (this.streetView._linksContainer.style.display = 'none');
        }
        $('#' + this.Str.BANNER_ID).hide();
        $('#iscroll-container').removeClass('hide');
    },
    show: function() {
        $('#' + this.Str.BANNER_ID).show();

        $("#street-holder").css('visibility', 'visible');
        if (util.isIOS() && this.streetView) {
            this.streetView._linksContainer && (this.streetView._linksContainer.style.display = '');
        }
        if (!this.maxStatus) {
            $('#' + this.Str.MAP_CONTAINER_ID).css('visibility', 'visible');
        }
        if (util.isIPad()) {
            $('#iscroll-container').addClass('hide');
        }
    },
    /*
     * 添加鹰眼覆盖物
     * @paras {Point}
     */
    setEye: function(point) {
        if (!this._mkr) {
            var icon = new BMap.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUY1NDYwQjhGNTIxMTFFMkIzREZGQURENzdCRDY5ODMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUY1NDYwQjlGNTIxMTFFMkIzREZGQURENzdCRDY5ODMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRjU0NjBCNkY1MjExMUUyQjNERkZBREQ3N0JENjk4MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRjU0NjBCN0Y1MjExMUUyQjNERkZBREQ3N0JENjk4MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgIQMF8AAAeYSURBVHjapJh7bFt3Fce/9r1+23EcJ3bc5tWm7VqWLVWrpkRk6/4goqWoIwO2qhKPUQQCiQ4qsU4ggTQJCRiaGOqYqJCYVvZHWLds06ptjLWjW7vRdIM2SV/O+107LzuOH/faDufc+t7YjZ045Sed+7v3+t7f53fO75zzO9e6xcVFFNN+86dXKqj7OskDJFtIaknKSXpJQiQfkbxH8s5TP/pGarXxdKuBCdhM3S9I9qO4djUziSdpAqE1gwlopu4Fku/wtdEgoq7ai631VSgrdaDEboXVYsJsKIKEJGNw5Bb6hycxPB5UhxgmeZbgzxUNJmgddSdJWkRRwM6GTWjeuRUmo2FVdadmw/jg4y70DU2ot14k+OOrgglaz+tEsqnC7UTbl5rhctqx1najbxRvnelEMqksdwfBHykIJqiNujMkTXVVHnyVoGziZbPV6XKuCy1XcCaEv7/1ERai8WWa3wl+ibpveitKcejAHrCZs5ter1egZz7pw9D4HL/OWLTsqMWmWrcygTsnEZwJ428dZ1XNDxK8nU/ELGgLQwUa/MAXd0MQ9NogDGPoqXd78NTxcwjHF6ETRMLq6Jk00skL2F7vwnPHWrFtYwXS6bQGLnc5sGd3A94/f5kvf0jSnqMxgd+g7kBT42a07PpcjpbzCzKO/PZd/OPTSXi9ZXjisUbUeO2YjybROxbG8692Q04koJPj+OnB+3D0W82kYTJnKV569Sym5+b58ifs6foMtJKhokAefF+9ZjKW9KIOjx7rwPtdMzCXuuCrLIPNaoKv3Ib1HjvcLivctDQmRwkEuxO/b+/BH1++SBYTckzfvOMedR77s03dxocN1R4lZNSHRVHE8fZLuDaRgLnECcFgxMBUAr882bPMkQwmI0RyRL2oJ/gV7H9wM2p9Ds3sdTQ2K5ZMpVpZUX3mPU6D2FhTqTyoikz+8HxHD8wOB0xWizZ4XqEJ8+8mqw0GmwPPvnxJWSZ1LD35CcMzrUXVuFF1BFVbNtW5z4Yh64ywWCw0sJG9bNX41Yts4hQ+uBKATi/keLmX8kLvoJJYmlRwDR947VTTsJn7x8MwmM0wEFQoImtpLZ2k2NWTM0VhNS6tM6fYTKtSwUpqErNCiNvMfJw0FSCaRFpfoXhuip43ipiai6HGY9bG1Os1ixlV8CyJK56QtHzMmvvK7WQuPYwEdrttRUFTyTQCUkJZU1eJOcezJVkLsYgK7ifZORdeQEVZiXJDlmV8vsEHvO6nSSyidr0dNsvqWo9MLCAYANa5LfCWWREKLe2MIRo/0/wquJPBgemQ4mDcOAFsqS5FlduEmVQKt6bjeGBH+YrQeCKFS13TpLWMtgdrkKCkkr10PH6mXVTD6UM+DIwEc8IpHo/j6CP3QorHMBlYgH8kigqXEZ6y5WK3Cui8GkKMNgSbkMLj+7YhFotpY8XiCUwG51TweRXcwYfxwCxm5iLaukSjUey534Ov7fIiFpnHlevTeONftzA0EafNP00eoqN0mkRXbwSn/jmJickQpGgEz3x3B0RdEimylDrWtb5xSh5KxLxJKTOanav/TN33q31utH6hQTMPhxXH8Qun/Tj54QQsDjuFmAkC3efNg7VJkdMkSDtDMobffbsR2zeWIBKJaGMkpCReefvfqnN9hcCns8FO6q5wTD+0exvq1i+tJycTm82GgUAcJ97242J/CPKioIFdFh32Nlbge/vuoRws50C5neu8gf6RgKrtw/n24yeo+wNviV/e04gyZ24IGSmR8ARMJhOuDs0q3l5GIVPpMivryUvD5s1u3f5RfNo9iEwlej+BhwuVPn/lAs9iNuKhpq0UXo68HmwwLMX7nTANenMU/7k2rHr2wwR9c7Vi7zXesTjT7GrYgC0bKtdUb8m0u1zs6ifzahXnCYL+oNjy9i/UHb69edhx7+YqVHld2WkvTxzL6B8Nosc/ppxzhsqUO6fXVNAT/BB1Rzm53PZwAb4KJ9xUdZpMS0Xg/EIc07MRSjLh7NcZ9mOCDhRdV4+OjmrnF/7rb5gLR8/F4rKLZEUTc71mNouwmo2XDx/ct33NnzCkqXZe4yvlrNbi87hRvc6DWcq3EdIwFpe0Zxx2C5wOKhTIIv6BUfo9xrefOdTW+mQhsLjSrHzl1hpZllqsFjOatt+umXwe14pa22jPPXvhM6XKWOm5FcGSJKdUE0ajMdjtNi2MOHlwYsmuJjmOOZ7pPcXX7ho8HZbHHObF9yRJar3mH0B97Totk3E9pTaGq0t2ucdPYEnbeNYENukTWVrjBHWt3df74S13KtoX/GCjr4axSSV2b5D8es1gSUpkX57iD26613qjd4gqUV/Bwbqv96nvth87cli6C/Cyd/g7ufU6gT1UoXAuX7Ys9JUwEZhSP8yfXi275QXL0rJ45f36Hbq/t29wDLVVnuV/A9wcVN879fTPj6TuDizntRKv9d6bAyP0vWyFmYp3tU0GZxGcmuHTLpJfFZPPC4CT+W6z1h30W9v5zh5s21RNWcpIFcs8JY1x1atPFLuR5AUnU8lCz/P/IUIyljxwqetmPosc/7/AhfZXarwLcAXxs8z3VnXmH54zat1WbPufAAMAFBGLprc91/gAAAAASUVORK5CYII=",
                new BMap.Size(40, 40), {
                    anchor: new BMap.Size(20, 40),
                    imageOffset: new BMap.Size(-5, 0)
                });

            this._mkr = new CustomMarker(icon, point, {
                className: 'eye_mrk',
                click: function() {}
            });

            this._mkr.setDraggingEnabled(true);
            this.eyeMap.addOverlay(this._mkr);
            this._mkr.addEventListener('dragend', $.proxy(this.markerDragEnd, this));
        } else {
            this._mkr.setPoint(point);
        }
    },
    markerDragEnd: function() {
        var point = this.eyeMap.getCenter();
        this.streetView.setPosition(point);
    },
    /*
     * 街景id发生变化时触发。
     */
    onPositionChanged: function() {
        var sv = this.streetView;
        var point = sv.getPosition();
        var addr = sv.getDescription();
        if (this.eyeMap) {
            this.setEye(point);
            this.eyeMap.centerAndZoom(point, 15);
        }

        this.setDayAndNigthMode();

        addr = addr || '未命名路段';

        var m = addr.match(/[^\x00-\xff]/ig);
        var s = m ? m.length : addr.length;
        //如果地址的长度超过14个中文字符的长度， 就直接截取。
        if (s > 14) {
            addr = addr.substring(0, 13) + '...';
        }
        $("#street-holder").find('.addr').text(addr);
    },
    /**
     * 街景图块加载完成的回调函数
     * 用来做性能统计
     */
    onTilesLoaded: function() {
        // if (this._updated) {
        //     var stPdc = Monitor.createPdc(PDC.DICT.ST_LOAD);
        //     stPdc.mark('c_st_load');
        //     stPdc.view_time();
        //     stPdc.ready(1);
        //     // console.log(Date.now() - window._stTime); // debug时间
        //     this._updated = false;
        // }
    },

    unbind: function() {
        listener.off('common', 'sizechange', this._onSizeChange);
    },

    destory: function() {
        this.unbind();
    },

    setDayAndNigthMode: function() {
        var rel = this.streetView.getRelevants(),
            data = rel && rel[0],
            $mode = $("#street-holder").find('.mode');

        if (data && data.mode && !this.maxStatus) {
            var relMode = (data.mode === this.Str.DAY) ? 'day' : 'night';
            $mode.removeClass('night day');
            relMode ? $mode.show().addClass(relMode) : $mode.hide();
        } else {
            $mode.hide();
        }
    },

    updateStreetView: function() {
        var opts = url.get();
        var ssid = null;
        var point = null;
        var pov = {};
        var query = opts.query || {};

        this._updated = true;
        // 从其他界面进入先清空
        this.streetView.clear();

        if (query.ss_id) {
            ssid = query.ss_id;
            if (query.ss_panoType &&
                query.ss_panoType != 'undefined' &&
                query.ss_panoType === 'inter') {
                this.streetView.setInnerId(ssid);
            } else {
                this.streetView.setId(ssid);
            }
        } else if (query.nb_x && query.nb_y) {
            point = new BMap.Point(query.nb_x, query.nb_y);
            this.streetView.setPosition(point);
        } 

        pov = this.streetView.getPov();
        if (query.ss_heading && query.ss_heading !== 'undefined') {
            pov.heading = parseFloat(query.ss_heading);
        }
        if (query.ss_pitch && query.ss_pitch !== 'undefined') {
            pov.pitch = parseFloat(query.ss_pitch);
        }
        this.streetView.setPov(pov);
    },
    sendStats: 　 function(code, params) {
        //util.addStat(code, $.extend({}, params || {}));
    }
};


});
;define('common:widget/topbanner/topbanner.js', function(require, exports, module){

/**
 * @fileOverview 顶部bannner策略
 * @authod yuanzhijia@baidu.com
 * @date 2013-10-24
 */
var cookie = require("common:widget/cookie/cookie.js"),
    util = require("common:static/js/util.js"),
    stat = require('common:widget/stat/stat.js'),
    app = require('common:widget/url/url.js');
module.exports = {
    init: function(bannerHide) {
        this.bannerHide = bannerHide || false;
        this.bind();
        this.render();
    },
    bind: function() {
        var me = this;
        me.closeBtn = $('#banner_close_button');
        me.bannerCon = $('#common-widget-top-banner');
        me.appbutton = $("#banner_install_button");
    },
    render: function() {
        var me = this,
            url = app.get();
        me.os = util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown";
        me.action = url.action;
        me.module = url.module;
        me.pageState = url.pageState;
        me.a = window.a;
        $(window).on("pageshow",function(){
            if ($('#downBox').length > 0) {
                $('#downBox').hide();

            }
            clearTimeout(window.a);
        });
        me.closeBtn.on('click', $.proxy(me._onClose, this));
        me.displayBanner();
    },
    displayBanner: function() {
        //展示banner策略
        var me = this,
            ua = navigator.userAgent,
            $info = "点击下载手机地图，省90%流量";
        if (cookie.get("hdBanner") || me.isHideBanner()) {
            me.hideBanner();
            return;
        }
        me.showBanner();
        if (util.isIPhone()&&(ua.indexOf("Safari")>0)) {
            me.appbutton.html('点击打开手机地图，省90%流量');
            util.bindHrefStat(me.appbutton, function(){
                    alert('将打开百度地图客户端');
                    $(document.body).append("<iframe src= 'baidumap://map/' id='callapp' width='0' height='0' style='border: 0;display: none;'/>");
                    window.a = setTimeout(function(){
                    util.DownBox.showTb(); 
                    stat.addStat(COM_STAT_CODE.TOP_BANNER_APP_ERROR_OPEN);}, 1500);
                    return false;
                });
     }else{
                me.appbutton.attr('data', util.getClientUrl('download'));
                util.isInstalledClient(function(openurl) {
                me.appbutton.html('点击打开手机地图，省90%流量').attr('data', openurl);
                me.appbutton.addClass("open");
                util.bindHrefStat(me.appbutton, function(){
                    stat.addStat(COM_STAT_CODE.TOP_BANNER_APP_OPEN, {os: me.os});
                });
            }, function(downloadurl) {
                me.appbutton.html($info).attr('data', downloadurl);
                util.bindHrefStat(me.appbutton, function(){
                    stat.addStat(COM_STAT_CODE.TOP_BANNER_APP_DOWNLOAD, {os: me.os});
                });
            }, me.appbutton.attr('uid'));
        }
    },
    _onClose: function(evt) {
        var me = this;
        me.hideBanner();
        var options = {
            domain: location.hostname,
            path: '/mobile',
            expires: 3 * 24 * 60 * 60 * 1000
        };
        cookie.set("hdBanner", "true", options);
        stat.addStat(COM_STAT_CODE.INDEX_TOP_BANNER_CLICK);
    },
    hideBanner: function(animate) {
        var me = this;
        me.bannerCon.hide();
    },
    showBanner: function(animate) {
        var me = this;
        me.bannerCon.show();
        stat.addStat(COM_STAT_CODE.INDEX_TOP_BANNER_SHOW);
    },
    isHideBanner: function() {
        if(this.bannerHide) {
            localStorage['hbt'] = Date.now();
            return true;
        }else{
            if(localStorage['hbt']){
                //设置有效期为15分钟
                if(Date.now() > Number(localStorage['hbt']) + 1000*60*15){
                    localStorage.removeItem('hbt');
                    return false;
                }else{
                    return true;
                }
            }else{
                return false;
            }
        }
    },
}

});