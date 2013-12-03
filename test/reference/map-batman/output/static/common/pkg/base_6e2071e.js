/**
 * file: mod.js
 * ver: 1.0.3
 * auth: zhangjiachen@baidu.com
 * update: 11:48 2013/7/10
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


    function loadScript(id, callback) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        //
        // load this script
        //
        var res = resMap[id] || {};
        var url = res.pkg
                    ? pkgMap[res.pkg].url
                    : (res.url || id);

        if (! (url in scriptsMap))  {
            scriptsMap[url] = true;

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            head.appendChild(script);
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
            'exports': {}
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

    require.async = function(names, callback) {
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
                loadScript(dep, updateNeed);

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
                callback && callback.apply(self, args);
            }
        }
        
        findNeed(names);
        updateNeed();
    };

    require.resourceMap = function(obj) {
        var k, col;

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

    require.alias = function(id) {return id};

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

;var BigPipe = function() {
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

        var url = location.href.split('#')[0] + '&' + arr.join('&') + '&force_mode=1&is_widget=true' + '&' + param;

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
    getIosVersion:function(){
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

      encode = encode ||
        function(v) {
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
          /*if(!!me.loadingNode) {
                        me.loadingNode.remove();
                        me.loadingNode = undefined;
                    }*/
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
        if (name == "style") {
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
    /**
     * 获取本地信息
     * @param {string} packageName 包名称
     * @param {function} successCallback
     * @param {function} errorCallback
     */
    getNativeInfo: function(packageName, successCallback, errorCallback) {
      var url = "http://127.0.0.1:6259/getpackageinfo?packagename=" + packageName;
      $.ajax({
        url: url,
        dataType: 'jsonp',
        success: successCallback,
        error: errorCallback
      });
      
      //successCallback({error:0});
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
      if (utype == "download") {
        switch (me.os) {
          case 'android':
            url = "http://map.baidu.com/maps/download/index.php?app=map&qudao=gw10014";
            break;
          case 'iphone':
            url = "http://itunes.apple.com/cn/app/id452186370?ls=1&mt=8";
            break;
          case 'ipad':
            url = "https://itunes.apple.com/cn/app/bai-du-de-tuhd/id553771681?ls=1&mt=8";
            break;
          case 'unknown':
            url = "http://mo.baidu.com/d/map/gw/bmap_andr_gw10016.apk";
            break;
          default:
            url = "http://mo.baidu.com/d/map/gw/bmap_andr_gw10016.apk";
            break;
        }
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
    bindHrefStat: function(elem, callback){
      var me = this;
      var ck = function(e){
        e.stopPropagation();
        e.preventDefault();
        callback();
        setTimeout(function(){
          if(window.navigator.standalone){
            window.open(elem.attr('data'));            
          }else{
            window.location.href = elem.attr('data');
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
      var $ok = $('#telBox button').eq(1),
        $cancel = $('#telBox button').eq(0);

      $ok.on('click', function() {
        $('#telBox').remove();
      });

      $cancel.on('click', function() {
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
      htm.push('<a href="wtai://wp/mc;' + $.trim(number) + '"><button class="bt qd cancel-telbox" >确定</button></a>');
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
  /**
   * @module common:static/js/util
   */
  module.exports = util;
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

;define('common:static/js/map/api.js',function(require,exports,module){(function(){var W,aF=W=aF||{version:"1.3.4"};aF.guid="$BAIDU$";window[aF.guid]=window[aF.guid]||{};aF.object=aF.object||{};aF.extend=aF.object.extend=function(aS,T){for(var aR in T){if(T.hasOwnProperty(aR)){aS[aR]=T[aR]}}return aS};aF.dom=aF.dom||{};aF.dom.g=function(T){if("string"==typeof T||T instanceof String){return document.getElementById(T)}else{if(T&&T.nodeName&&(T.nodeType==1||T.nodeType==9)){return T}}return null};aF.g=aF.G=aF.dom.g;aF.dom.hide=function(T){T=aF.dom.g(T);T.style.display="none";return T};aF.hide=aF.dom.hide;aF.lang=aF.lang||{};aF.lang.isString=function(T){return"[object String]"==Object.prototype.toString.call(T)};aF.isString=aF.lang.isString;aF.dom._g=function(T){if(aF.lang.isString(T)){return document.getElementById(T)}return T};aF._g=aF.dom._g;aF.dom.contains=function(T,aR){var aS=aF.dom._g;T=aS(T);aR=aS(aR);return T.contains?T!=aR&&T.contains(aR):!!(T.compareDocumentPosition(aR)&16)};aF.browser=aF.browser||{};aF.dom._NAME_ATTRS=(function(){var T={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",rowspan:"rowSpan",valign:"vAlign",usemap:"useMap",frameborder:"frameBorder"};T.htmlFor="for";T.className="class";return T})();aF.dom.setAttr=function(aR,T,aS){aR=aF.dom.g(aR);if("style"==T){aR.style.cssText=aS}else{T=aF.dom._NAME_ATTRS[T]||T;aR.setAttribute(T,aS)}return aR};aF.setAttr=aF.dom.setAttr;aF.dom.setAttrs=function(aS,T){aS=aF.dom.g(aS);for(var aR in T){aF.dom.setAttr(aS,aR,T[aR])}return aS};aF.setAttrs=aF.dom.setAttrs;aF.string=aF.string||{};aF.dom.removeClass=function(aV,aW){aV=aF.dom.g(aV);var aT=aV.className.split(/\s+/),aX=aW.split(/\s+/),aR,T=aX.length,aS,aU=0;for(;aU<T;++aU){for(aS=0,aR=aT.length;aS<aR;++aS){if(aT[aS]==aX[aU]){aT.splice(aS,1);break}}}aV.className=aT.join(" ");return aV};aF.removeClass=aF.dom.removeClass;aF.dom.insertHTML=function(aT,T,aS){aT=aF.dom.g(aT);var aR,aU;if(aT.insertAdjacentHTML){aT.insertAdjacentHTML(T,aS)}else{aR=aT.ownerDocument.createRange();T=T.toUpperCase();if(T=="AFTERBEGIN"||T=="BEFOREEND"){aR.selectNodeContents(aT);aR.collapse(T=="AFTERBEGIN")}else{aU=T=="BEFOREBEGIN";aR[aU?"setStartBefore":"setEndAfter"](aT);aR.collapse(aU)}aR.insertNode(aR.createContextualFragment(aS))}return aT};aF.insertHTML=aF.dom.insertHTML;aF.dom.show=function(T){T=aF.dom.g(T);T.style.display="";return T};aF.show=aF.dom.show;aF.dom.getDocument=function(T){T=aF.dom.g(T);return T.nodeType==9?T:T.ownerDocument||T.document};aF.dom.addClass=function(aV,aW){aV=aF.dom.g(aV);var aR=aW.split(/\s+/),T=aV.className,aU=" "+T+" ",aT=0,aS=aR.length;for(;aT<aS;aT++){if(aU.indexOf(" "+aR[aT]+" ")<0){T+=" "+aR[aT]}}aV.className=T;return aV};aF.addClass=aF.dom.addClass;aF.dom._styleFixer=aF.dom._styleFixer||{};aF.dom._styleFilter=aF.dom._styleFilter||[];aF.dom._styleFilter.filter=function(aR,aU,aV){for(var T=0,aT=aF.dom._styleFilter,aS;aS=aT[T];T++){if(aS=aS[aV]){aU=aS(aR,aU)}}return aU};aF.string.toCamelCase=function(T){if(T.indexOf("-")<0&&T.indexOf("_")<0){return T}return T.replace(/[-_][^-_]/g,function(aR){return aR.charAt(1).toUpperCase()})};aF.dom.getStyle=function(aS,aR){var aV=aF.dom;aS=aV.g(aS);aR=aF.string.toCamelCase(aR);var aU=aS.style[aR];if(!aU){var T=aV._styleFixer[aR],aT=aS.currentStyle||getComputedStyle(aS,null);aU=T&&T.get?T.get(aS,aT):aT[T||aR]}if(T=aV._styleFilter){aU=T.filter(aR,aU,"get")}return aU};aF.getStyle=aF.dom.getStyle;if(/opera\/(\d+\.\d)/i.test(navigator.userAgent)){aF.browser.opera=+RegExp["\x241"]}aF.browser.isWebkit=/webkit/i.test(navigator.userAgent);aF.browser.isGecko=/gecko/i.test(navigator.userAgent)&&!/like gecko/i.test(navigator.userAgent);aF.browser.isStrict=document.compatMode=="CSS1Compat";aF.dom.getPosition=function(T){T=aF.dom.g(T);var aZ=aF.dom.getDocument(T),aT=aF.browser,aW=aF.dom.getStyle,aS=aT.isGecko>0&&aZ.getBoxObjectFor&&aW(T,"position")=="absolute"&&(T.style.top===""||T.style.left===""),aX={left:0,top:0},aV=(aT.ie&&!aT.isStrict)?aZ.body:aZ.documentElement,a0,aR;if(T==aV){return aX}if(T.getBoundingClientRect){aR=T.getBoundingClientRect();aX.left=Math.floor(aR.left)+Math.max(aZ.documentElement.scrollLeft,aZ.body.scrollLeft);aX.top=Math.floor(aR.top)+Math.max(aZ.documentElement.scrollTop,aZ.body.scrollTop);aX.left-=aZ.documentElement.clientLeft;aX.top-=aZ.documentElement.clientTop;var aY=aZ.body,a1=parseInt(aW(aY,"borderLeftWidth")),aU=parseInt(aW(aY,"borderTopWidth"));if(aT.ie&&!aT.isStrict){aX.left-=isNaN(a1)?2:a1;aX.top-=isNaN(aU)?2:aU}}else{a0=T;do{aX.left+=a0.offsetLeft;aX.top+=a0.offsetTop;if(aT.isWebkit>0&&aW(a0,"position")=="fixed"){aX.left+=aZ.body.scrollLeft;aX.top+=aZ.body.scrollTop;break}a0=a0.offsetParent}while(a0&&a0!=T);if(aT.opera>0||(aT.isWebkit>0&&aW(T,"position")=="absolute")){aX.top-=aZ.body.offsetTop}a0=T.offsetParent;while(a0&&a0!=aZ.body){aX.left-=a0.scrollLeft;if(!aT.opera||a0.tagName!="TR"){aX.top-=a0.scrollTop}a0=a0.offsetParent}}return aX};if(/firefox\/(\d+\.\d)/i.test(navigator.userAgent)){aF.browser.firefox=+RegExp["\x241"]}(function(){var T=navigator.userAgent;if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(T)&&!/chrome/i.test(T)){aF.browser.safari=+(RegExp["\x241"]||RegExp["\x242"])}})();if(/chrome\/(\d+\.\d)/i.test(navigator.userAgent)){aF.browser.chrome=+RegExp["\x241"]}aF.array=aF.array||{};aF.array.each=function(aV,aT){var aS,aU,aR,T=aV.length;if("function"==typeof aT){for(aR=0;aR<T;aR++){aU=aV[aR];aS=aT.call(aV,aU,aR);if(aS===false){break}}}return aV};aF.each=aF.array.each;aF.lang.guid=function(){return"TANGRAM__"+(window[aF.guid]._counter++).toString(36)};window[aF.guid]._counter=window[aF.guid]._counter||1;window[aF.guid]._instances=window[aF.guid]._instances||{};aF.lang.isFunction=function(T){return"[object Function]"==Object.prototype.toString.call(T)};aF.lang.Class=function(T){this.guid=T||aF.lang.guid();window[aF.guid]._instances[this.guid]=this};window[aF.guid]._instances=window[aF.guid]._instances||{};aF.lang.Class.prototype.dispose=function(){delete window[aF.guid]._instances[this.guid];for(var T in this){if(!aF.lang.isFunction(this[T])){delete this[T]}}this.disposed=true};aF.lang.Class.prototype.toString=function(){return"[object "+(this._className||"Object")+"]"};aF.lang.Event=function(T,aR){this.type=T;this.returnValue=true;this.target=aR||null;this.currentTarget=null};aF.lang.Class.prototype.addEventListener=function(aT,aS,aR){if(!aF.lang.isFunction(aS)){return}!this.__listeners&&(this.__listeners={});var T=this.__listeners,aU;if(typeof aR=="string"&&aR){if(/[^\w\-]/.test(aR)){throw ("nonstandard key:"+aR)}else{aS.hashCode=aR;aU=aR}}aT.indexOf("on")!=0&&(aT="on"+aT);typeof T[aT]!="object"&&(T[aT]={});aU=aU||aF.lang.guid();aS.hashCode=aU;T[aT][aU]=aS};aF.lang.Class.prototype.removeEventListener=function(aS,aR){if(aF.lang.isFunction(aR)){aR=aR.hashCode}else{if(!aF.lang.isString(aR)){return}}!this.__listeners&&(this.__listeners={});aS.indexOf("on")!=0&&(aS="on"+aS);var T=this.__listeners;if(!T[aS]){return}T[aS][aR]&&delete T[aS][aR]};aF.lang.Class.prototype.dispatchEvent=function(aT,T){if(aF.lang.isString(aT)){aT=new aF.lang.Event(aT)}!this.__listeners&&(this.__listeners={});T=T||{};for(var aS in T){aT[aS]=T[aS]}var aS,aR=this.__listeners,aU=aT.type;aT.target=aT.target||this;aT.currentTarget=this;aU.indexOf("on")!=0&&(aU="on"+aU);aF.lang.isFunction(this[aU])&&this[aU].apply(this,arguments);if(typeof aR[aU]=="object"){for(aS in aR[aU]){aR[aU][aS].apply(this,arguments)}}return aT.returnValue};aF.lang.inherits=function(aW,aU,aT){var aS,aV,T=aW.prototype,aR=new Function();aR.prototype=aU.prototype;aV=aW.prototype=new aR();for(aS in T){aV[aS]=T[aS]}aW.prototype.constructor=aW;aW.superClass=aU.prototype;if("string"==typeof aT){aV._className=aT}};aF.inherits=aF.lang.inherits;aF.lang.instance=function(T){return window[aF.guid]._instances[T]||null};aF.platform=aF.platform||{};aF.platform.isAndroid=/android/i.test(navigator.userAgent);if(/android (\d+\.\d)/i.test(navigator.userAgent)){aF.platform.android=aF.android=RegExp["\x241"]}aF.platform.isIpad=/ipad/i.test(navigator.userAgent);aF.platform.isIphone=/iphone/i.test(navigator.userAgent);aF.platform.iosVersion=/iphone os (\d)\_/i.test(navigator.userAgent)?+RegExp["\x241"]:0;aF.lang.Event.prototype.inherit=function(aS){var aR=this;this.domEvent=aS=window.event||aS;aR.clientX=aS.clientX||aS.pageX;aR.clientY=aS.clientY||aS.pageY;aR.offsetX=aS.offsetX||aS.layerX;aR.offsetY=aS.offsetY||aS.layerY;aR.screenX=aS.screenX;aR.screenY=aS.screenY;aR.ctrlKey=aS.ctrlKey||aS.metaKey;aR.shiftKey=aS.shiftKey;aR.altKey=aS.altKey;if(aS.touches){aR.touches=[];for(var T=0;T<aS.touches.length;T++){aR.touches.push({clientX:aS.touches[T].clientX,clientY:aS.touches[T].clientY,screenX:aS.touches[T].screenX,screenY:aS.touches[T].screenY,pageX:aS.touches[T].pageX,pageY:aS.touches[T].pageY,target:aS.touches[T].target,identifier:aS.touches[T].identifier})}}if(aS.changedTouches){aR.changedTouches=[];for(var T=0;T<aS.changedTouches.length;T++){aR.changedTouches.push({clientX:aS.changedTouches[T].clientX,clientY:aS.changedTouches[T].clientY,screenX:aS.changedTouches[T].screenX,screenY:aS.changedTouches[T].screenY,pageX:aS.changedTouches[T].pageX,pageY:aS.changedTouches[T].pageY,target:aS.changedTouches[T].target,identifier:aS.changedTouches[T].identifier})}}if(aS.targetTouches){aR.targetTouches=[];for(var T=0;T<aS.targetTouches.length;T++){aR.targetTouches.push({clientX:aS.targetTouches[T].clientX,clientY:aS.targetTouches[T].clientY,screenX:aS.targetTouches[T].screenX,screenY:aS.targetTouches[T].screenY,pageX:aS.targetTouches[T].pageX,pageY:aS.targetTouches[T].pageY,target:aS.targetTouches[T].target,identifier:aS.targetTouches[T].identifier})}}aR.rotation=aS.rotation;aR.scale=aS.scale;return aR};aF.lang.decontrol=function(aR){var T=window[aF.guid];T._instances&&(delete T._instances[aR])};aF.event={};aF.on=aF.event.on=function(aS,aR,T){if(!(aS=aF.g(aS))){return aS}aR=aR.replace(/^on/,"");if(aS.addEventListener){aS.addEventListener(aR,T,false)}else{if(aS.attachEvent){aS.attachEvent("on"+aR,T)}}return aS};aF.un=aF.event.un=function(aS,aR,T){if(!(aS=aF.g(aS))){return aS}aR=aR.replace(/^on/,"");if(aS.removeEventListener){aS.removeEventListener(aR,T,false)}else{if(aS.detachEvent){aS.detachEvent("on"+aR,T)}}return aS};aF.dom.hasClass=function(aS,aR){if(!aS||!aS.className||typeof aS.className!="string"){return false}var T=-1;try{T=aS.className==aR||aS.className.indexOf(aR)}catch(aT){return false}return T>-1};window.BMap=window.BMap||{};window.BMap._register=[];window.BMap.register=function(T){this._register.push(T)};BMap._streetViewRegister=[];BMap.streetViewRegister=function(T){this._streetViewRegister.push(T)};function x(aV,T){aV=aF.g(aV);if(!aV){return}var aY=this;aF.lang.Class.call(aY);aY.config={clickInterval:200,enableDragging:true,enableDblclickZoom:true,enableMouseDown:true,enablePinchToZoom:true,enableAutoResize:true,fps:25,zoomerDuration:240,actionDuration:450,minZoom:1,maxZoom:18,mapType:new aK("\u5730\u56fe",aA,{tips:"\u663e\u793a\u666e\u901a\u5730\u56fe",mapInstance:this}),enableInertialDragging:false,drawMargin:100,enableHighResolution:false,devicePixelRatio:window.devicePixelRatio||2,vectorMapLevel:12,beautifyBlackList:["chrome"]};aF.extend(aY.config,T||{});var aX=aY.config.beautifyBlackList;for(var aW=0,aU=aX.length;aW<aU;aW++){if(aF.browser[aX[aW]]){aY.config.devicePixelRatio=1;break}}aY.container=aV;aY._setStyle(aV);aV.unselectable="on";aV.innerHTML="";aV.appendChild(aY.render());var aR=aY.getSize();aY.width=aR.width;aY.height=aR.height;aY.offsetX=0;aY.offsetY=0;aY.platform=aV.firstChild;aY.maskLayer=aY.platform.firstChild;aY.maskLayer.style.width=aY.width+"px";aY.maskLayer.style.height=aY.height+"px";aY._panes={};aY.centerPoint=new f(0,0);aY.mercatorCenter=new f(0,0);aY.zoomLevel=1;aY.lastLevel=0;aY.defaultZoomLevel=null;aY.defaultCenter=null;aY.currentCity="";aY.cityCode="";aY._hotspots={};aY.currentOperation=0;T=T||{};var aT=aY.mapType=aY.config.mapType;aY.projection=aT.getProjection();var aS=aY.config;aS.userMinZoom=T.minZoom;aS.userMaxZoom=T.maxZoom;aY._checkZoom();aY.temp={operating:false,arrow:0,lastDomMoveTime:0,lastLoadTileTime:0,lastMovingTime:0,canKeyboard:false,registerIndex:-1,curSpots:[]};for(var aW=0;aW<BMap._register.length;aW++){BMap._register[aW](aY)}aY.temp.registerIndex=aW;aY._bind();ao.load("map",function(){aY._draw()});ao.load("opmb",function(){aY._asyncRegister()});aV=null;aY.enableLoadTiles=true;aY._viewTiles=[]}aF.lang.inherits(x,aF.lang.Class,"Map");aF.extend(x.prototype,{render:function(){var T=p("div");var aT=T.style;aT.overflow="visible";aT.position="absolute";aT.zIndex="0";aT.top=aT.left="0px";var aR=p("div",{"class":"BMap_mask"});var aS=aR.style;aS.position="absolute";aS.top=aS.left="0px";aS.zIndex="9";aS.overflow="hidden";aS.WebkitUserSelect="none";T.appendChild(aR);return T},_setStyle:function(aR){var T=aR.style;T.overflow="hidden";if(al(aR).position!="absolute"){T.position="relative";T.zIndex=0}T.backgroundColor="#F5F3F0";T.color="#000";T.textAlign="left"},_bind:function(){var T=this;T._watchSize=function(){var aR=T.getSize();if(T.width!=aR.width||T.height!=aR.height){var aT=new U(T.width,T.height);var aU=new av("onbeforeresize");aU.size=aT;T.dispatchEvent(aU);T._updateCenterPoint((aR.width-T.width)/2,(aR.height-T.height)/2);T.maskLayer.style.width=(T.width=aR.width)+"px";T.maskLayer.style.height=(T.height=aR.height)+"px";var aS=new av("onresize");aS.size=aR;T.dispatchEvent(aS)}};if(T.config.enableAutoResize){T.temp.autoResizeTimer=setInterval(T._watchSize,80)}},_updateCenterPoint:function(aV,aW,aU,aT){var aS=this.getMapType().getZoomUnits(this.getZoom());var aR=true;if(aU){this.centerPoint=new f(aU.lng,aU.lat);aR=false}var T=(aU&&aT)?aU:this.mercatorCenter;if(T){this.mercatorCenter=new f(T.lng+aV*aS,T.lat-aW*aS);if(this.mercatorCenter&&aR){this.centerPoint=this.mercatorCenter}}},zoomTo:function(aT,aR){if(!I(aT)){return}aT=this._getProperZoom(aT).zoom;if(aT==this.zoomLevel){return}this.lastLevel=this.zoomLevel;this.zoomLevel=aT;var aS;if(aR){aS=aR}if(aS){var T=this.pointToPixel(aS,this.lastLevel);this._updateCenterPoint(this.width/2-T.x,this.height/2-T.y,this.pixelToPoint(T,this.lastLevel),true)}this.dispatchEvent(new av("onzoomstart"));this.dispatchEvent(new av("onzoomstartcode"))},setZoom:function(T){this.zoomTo(T)},zoomIn:function(T){if(this.zoomLevel>=this.config.vectorMapLevel&&this.zoomLevel<=18){BMap.logCountError.countTouch(0,1)}this.zoomTo(this.zoomLevel+1,T)},zoomOut:function(T){if(this.zoomLevel>=this.config.vectorMapLevel&&this.zoomLevel<=18){BMap.logCountError.countTouch(0,1)}this.zoomTo(this.zoomLevel-1,T)},panTo:function(T,aR){if(!(T instanceof f)){return}this.mercatorCenter=T;if(T){this.centerPoint=new f(T.lng,T.lat)}else{this.centerPoint=this.mercatorCenter}},panBy:function(aR,T){aR=Math.round(aR)||0;T=Math.round(T)||0;this._updateCenterPoint(-aR,-T)},addControl:function(T){if(T&&au(T._i)){T._i(this);this.dispatchEvent(new av("onaddcontrol",T))}},removeControl:function(T){if(T&&au(T.remove)){T.remove();this.dispatchEvent(new av("onremovecontrol",T))}},addOverlay:function(T){if(T&&au(T._i)){T._i(this);this.dispatchEvent(new av("onaddoverlay",T))}},removeOverlay:function(T){if(T&&au(T.remove)){T.remove();this.dispatchEvent(new av("onremoveoverlay",T))}},clearOverlays:function(){this.dispatchEvent(new av("onclearoverlays"))},addTileLayer:function(T){if(T){this.dispatchEvent(new av("onaddtilelayer",T))}},removeTileLayer:function(T){if(T){this.dispatchEvent(new av("onremovetilelayer",T))}},setCenter:function(T){var aR=this;if(T instanceof f){aR.panTo(T,{noAnimation:true})}},centerAndZoom:function(T,aS,aU){var aR=this;if(!(T instanceof f)||!aS){return}aS=aR._getProperZoom(aS).zoom;aR.lastLevel=aR.zoomLevel||aS;aR.zoomLevel=aS;aR.centerPoint=new f(T.lng,T.lat);aR.mercatorCenter=aR.centerPoint;aR.defaultZoomLevel=aR.defaultZoomLevel||aR.zoomLevel;aR.defaultCenter=aR.defaultCenter||aR.centerPoint;var aV=new av("onload");var aT=new av("onloadcode");aV.point=new f(T.lng,T.lat);aV.pixel=aR.pointToPixel(aR.centerPoint,aR.zoomLevel);aV.zoom=aS;if(!aR.loaded){aR.loaded=true;aR.dispatchEvent(aV)}aR.dispatchEvent(aT);if(aU){aR.dispatchEvent(new av("onmoveend"))}else{aR.dispatchEvent(new av("onmoveend"));if(aR.lastLevel!=aR.zoomLevel){aR.dispatchEvent(new av("onzoomend"))}}},reset:function(){this.centerAndZoom(this.defaultCenter,this.defaultZoomLevel,true)},enableDragging:function(){this.config.enableDragging=true},disableDragging:function(){this.config.enableDragging=false},enableInertialDragging:function(){this.config.enableInertialDragging=true},disableInertialDragging:function(){this.config.enableInertialDragging=false},enableDoubleClickZoom:function(){this.config.enableDblclickZoom=true},disableDoubleClickZoom:function(){this.config.enableDblclickZoom=false},enablePinchToZoom:function(){this.config.enablePinchToZoom=true},disablePinchToZoom:function(){this.config.enablePinchToZoom=false},enableAutoResize:function(){this.config.enableAutoResize=true;this._watchSize();if(!this.temp.autoResizeTimer){this.temp.autoResizeTimer=setInterval(this._watchSize,80)}},disableAutoResize:function(){this.config.enableAutoResize=false;if(this.temp.autoResizeTimer){clearInterval(this.temp.autoResizeTimer);this.temp.autoResizeTimer=null}},getSize:function(){return new U(this.container.clientWidth,this.container.clientHeight)},getCenter:function(){return this.centerPoint},getZoom:function(){return this.zoomLevel},checkResize:function(){this._watchSize()},_getProperZoom:function(aS){var aR=this.config.minZoom,T=this.config.maxZoom,aT=false;if(aS<aR){aT=true;aS=aR}if(aS>T){aT=true;aS=T}return{zoom:aS,exceeded:aT}},getContainer:function(){return this.container},pointToPixel:function(T,aR){aR=aR||this.getZoom();return this.projection.pointToPixel(T,aR,this.mercatorCenter,this.getSize(),this.currentCity)},pixelToPoint:function(T,aR){aR=aR||this.getZoom();return this.projection.pixelToPoint(T,aR,this.mercatorCenter,this.getSize(),this.currentCity)},pointToOverlayPixel:function(T,aS){if(!T){return}var aT=new f(T.lng,T.lat);var aR=this.pointToPixel(aT,aS);aR.x-=this.offsetX;aR.y-=this.offsetY;return aR},overlayPixelToPoint:function(T,aS){if(!T){return}var aR=new aM(T.x,T.y);aR.x+=this.offsetX;aR.y+=this.offsetY;return this.pixelToPoint(aR,aS)},getBounds:function(){if(!this.isLoaded()){return new s()}var aU=this.getSize();this.width=aU.width;this.height=aU.height;var aR=arguments[0]||{},aT=aR.margins||[0,0,0,0],T=aR.zoom||null,aV=this.pixelToPoint({x:aT[3],y:this.height-aT[2]},T),aS=this.pixelToPoint({x:this.width-aT[1],y:aT[0]},T);return new s(aV,aS)},isLoaded:function(){return !!this.loaded},_getBestLevel:function(aR,aS){var aV=this.getMapType();var aX=aS.margins||[10,10,10,10],aU=aS.zoomFactor||0,aY=aX[1]+aX[3],aW=aX[0]+aX[2],T=aV.getMinZoom(),a0=aV.getMaxZoom();for(var aT=a0;aT>=T;aT--){var aZ=this.getMapType().getZoomUnits(aT);if(aR.toSpan().lng/aZ<this.width-aY&&aR.toSpan().lat/aZ<this.height-aW){break}}aT+=aU;if(aT<T){aT=T}if(aT>a0){aT=a0}return aT},getViewport:function(aZ,aR){var a3={center:this.getCenter(),zoom:this.getZoom()};if(!aZ||!aZ instanceof s&&aZ.length==0||aZ instanceof s&&aZ.isEmpty()){return a3}var a1=[];if(aZ instanceof s){a1.push(aZ.getNorthEast());a1.push(aZ.getSouthWest())}else{a1=aZ.slice(0)}aR=aR||{};var aV=[];for(var aW=0,aU=a1.length;aW<aU;aW++){aV.push(a1[aW])}var aS=new s();for(var aW=aV.length-1;aW>=0;aW--){aS.extend(aV[aW])}if(aS.isEmpty()){return a3}var T=aS.getCenter();var a2=this._getBestLevel(aS,aR);if(aR.margins){var aY=aR.margins,aX=(aY[1]-aY[3])/2,a0=(aY[0]-aY[2])/2,aT=this.getMapType().getZoomUnits(a2);T.lng=T.lng+aT*aX;T.lat=T.lat+aT*a0}return{center:T,zoom:a2}},setViewport:function(aR,aU){var T;if(aR&&aR.center){T=aR}else{T=this.getViewport(aR,aU)}aU=aU||{};var aS=aU.delay||200;if(T.zoom==this.zoomLevel&&aU.enableAnimation!=false){var aT=this;setTimeout(function(){aT.panTo(T.center,{duration:210})},aS)}else{this.centerAndZoom(T.center,T.zoom)}},getPanes:function(){return this._panes},getOverlays:function(){var aT=[],aU=this._overlays,aS=this._customOverlays;if(aU){for(var aR in aU){if(aU[aR] instanceof aC){aT.push(aU[aR])}}}if(aS){for(var aR=0,T=aS.length;aR<T;aR++){aT.push(aS[aR])}}return aT},getMapType:function(){return this.mapType},_asyncRegister:function(){for(var T=this.temp.registerIndex;T<BMap._register.length;T++){BMap._register[T](this)}this.temp.registerIndex=T},highResolutionEnabled:function(){return this.config.enableHighResolution&&window.devicePixelRatio>1},enableHighResolution:function(){this.config.enableHighResolution=true},disableHighResolution:function(){this.config.enableHighResolution=false},addHotspot:function(aR){if(aR instanceof J){this._hotspots[aR.guid]=aR;aR.initialize(this)}var T=this;ao.load("hotspot",function(){T._asyncRegister()})},removeHotspot:function(T){if(this._hotspots[T.guid]){delete this._hotspots[T.guid]}},clearHotspots:function(){this._hotspots={}},_checkZoom:function(){var aR=this.mapType.getMinZoom();var aS=this.mapType.getMaxZoom();var T=this.config;T.minZoom=T.userMinZoom||aR;T.maxZoom=T.userMaxZoom||aS;if(T.minZoom<aR){T.minZoom=aR}if(T.maxZoom>aS){T.maxZoom=aS}},setMinZoom:function(T){if(T>this.config.maxZoom){T=this.config.maxZoom}this.config.userMinZoom=T;this._updateZoom()},setMaxZoom:function(T){if(T<this.config.minZoom){T=this.config.minZoom}this.config.userMaxZoom=T;this._updateZoom()},_updateZoom:function(){this._checkZoom();var T=this.config;if(this.zoomLevel<T.minZoom){this.setZoom(T.minZoom)}else{if(this.zoomLevel>T.maxZoom){this.setZoom(T.maxZoom)}}var aR=new av("onzoomspanchange");aR.minZoom=T.minZoom;aR.maxZoom=T.maxZoom;this.dispatchEvent(aR)},getViewTiles:function(){return this._viewTiles}});window.BMAP_CANVAS_DRAWER=3;(function(){window.asyncMdlVer={control:"bbc4f5",hotspot:"0a23zr",map:"vva4yc",marker:"izcrfp",opmb:"c3qywy",oppc:"u1ngx2",poly:"e4badv",tile:"pkempe",streetview:"mi40eu"};window.chkVersion=function(T){try{var aR=window.localStorage;if(!aR){return false}return aR[T]&&aR[T].length>0}catch(aS){return false}};window.saveVersion=function(T,aW,aU){try{var aS=window.localStorage;if(aS){for(var aR=aS.length,aT=aR-1;aT>=0;aT--){var aX=aS.key(aT);if(aX.indexOf(aU)>-1){aS.removeItem(aX)}}aS.setItem(T,aW)}}catch(aV){}};window.getVersion=function(T){try{var aR=window.localStorage;if(!aR){return""}return aR.getItem(T)}catch(aS){return""}}})();function aG(aT){var T={duration:1000,fps:30,delay:0,transition:g.linear,onStop:function(){}};this._anis=[];if(aT){for(var aR in aT){T[aR]=aT[aR]}}this._opts=T;if(I(T.delay)){var aS=this;setTimeout(function(){aS.start()},T.delay)}else{if(T.delay!=aG.INFINITE){this.start()}}}aG.INFINITE="INFINITE";aG.prototype.start=function(){this._beginTime=w();this._endTime=this._beginTime+this._opts.duration;this._launch()};aG.prototype.add=function(T){this._anis.push(T)};aG.prototype._launch=function(){var aS=this;var T=w();if(T>=aS._endTime){if(au(aS._opts.render)){aS._opts.render(aS._opts.transition(1))}if(au(aS._opts.finish)){aS._opts.finish()}if(aS._anis.length>0){var aR=aS._anis[0];aR._anis=[].concat(aS._anis.slice(1));aR.start()}return}aS.schedule=aS._opts.transition((T-aS._beginTime)/aS._opts.duration);if(au(aS._opts.render)){aS._opts.render(aS.schedule)}if(!aS.terminative){aS._timer=setTimeout(function(){aS._launch()},1000/aS._opts.fps)}};aG.prototype.stop=function(aR){this.terminative=true;for(var T=0;T<this._anis.length;T++){this._anis[T].stop();this._anis[T]=null}this._anis.length=0;if(this._timer){clearTimeout(this._timer);this._timer=null}this._opts.onStop(this.schedule);if(aR){this._endTime=this._beginTime;this._launch()}};aG.prototype.cancel=function(){if(this._timer){clearTimeout(this._timer)}this._endTime=this._beginTime;this.schedule=0};aG.prototype.setFinishCallback=function(T){if(this._anis.length>0){this._anis[this._anis.length-1]._opts.finish=T}else{this._opts.finish=T}};var g={linear:function(T){return T},reverse:function(T){return 1-T},easeInQuad:function(T){return T*T},easeInCubic:function(T){return Math.pow(T,3)},easeOutQuad:function(T){return -(T*(T-2))},easeOutCubic:function(T){return Math.pow((T-1),3)+1},easeInOutQuad:function(T){if(T<0.5){return T*T*2}else{return -2*(T-2)*T-1}return},easeInOutCubic:function(T){if(T<0.5){return Math.pow(T,3)*4}else{return Math.pow(T-1,3)*4+1}},easeInOutSine:function(T){return(1-Math.cos(Math.PI*T))/2}};g["ease-in"]=g.easeInQuad;g["ease-out"]=g.easeOutQuad;var aP={imgPath:"http://map.baidu.com/res_mobile2/images/"};function aQ(aS,T){var aR=aS.style;aR.left=T[0]+"px";aR.top=T[1]+"px"}function m(T){T.style.MozUserSelect="none"}function o(T){return T&&T.parentNode&&T.parentNode.nodeType!=11}function V(aR,T){aF.dom.insertHTML(aR,"beforeEnd",T);return aR.lastChild}function u(T){var aR={left:0,top:0};while(T&&T.offsetParent){aR.left+=T.offsetLeft;aR.top+=T.offsetTop;T=T.offsetParent}return aR}function ad(T){var T=window.event||T;T.stopPropagation?T.stopPropagation():T.cancelBubble=true}function y(T){var T=window.event||T;T.preventDefault?T.preventDefault():T.returnValue=false;return false}function ay(T){ad(T);return y(T)}function H(){var T=document.documentElement,aR=document.body;if(T&&(T.scrollTop||T.scrollLeft)){return[T.scrollTop,T.scrollLeft]}else{if(aR){return[aR.scrollTop,aR.scrollLeft]}else{return[0,0]}}}function q(aR,T){if(!aR||!T){return}return Math.round(Math.sqrt(Math.pow(aR.x-T.x,2)+Math.pow(aR.y-T.y,2)))}function p(aR,T,aS){var aT=document.createElement(aR);if(aS){aT=document.createElementNS(aS,aR)}return aF.dom.setAttrs(aT,T||{})}function al(T){if(T.currentStyle){return T.currentStyle}else{if(T.ownerDocument&&T.ownerDocument.defaultView){return T.ownerDocument.defaultView.getComputedStyle(T,null)}}}function au(T){return typeof T=="function"}function I(T){return typeof T=="number"}function aE(T){return typeof T=="string"}function ae(T){return typeof T!="undefined"}function C(T){return typeof T=="object"}function d(T){return"[object Array]"==Object.prototype.toString.call(T)}function i(){if(typeof i.result!="boolean"){i.result=!!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape","1.1")}return i.result}function an(T){return T*Math.PI/180}var av=aF.lang.Event;function ar(){return !!(aF.platform.isIphone||aF.platform.isIpad||aF.platform.isAndroid)}function w(){return(new Date).getTime()}BMap.logCountError=(function(){var bf=true,aZ=true,bj=true,a5=true,a2=new Image(),bh=0,ba=0,bc=0,a0=0,aW=0,bn=0,bb=0,aX=0,aU=0,bg=0,a9=0,aS=0,aT=0,a7=0,be=0,a1=0,bm=0,aR=0,bl=0,T=0,bi=0,a8=0,aY=0,bk=0;function bd(){if(window.speedTest&&window.speedTest.ab){bm=window.speedTest.ab}bd=function(){return bm};return bm}function a6(bp,bq,bs,br){var bo=(12<=br&&br<=18);if(bq){if(bp){ba+=1;if(bo){aX+=1}}else{bh+=1;if(bo){bb+=1}}if(bs==1){if(bp){bn+=1;if(bo){aS+=1}}else{aW+=1;if(bo){a9+=1}}}}else{if(bp){a0+=1;if(bo){bg+=1}}else{bc+=1;if(bo){aU+=1}}}if(bf){bf=false;setTimeout(function(){var bt=(Math.random()*100000000).toFixed(0);bf=true;a2.src="http://map.baidu.com/mobile/img/transparent.gif?type=pic&newmap=1&t="+bt+"&code=20066&pic_pl_error="+bh+"&pic_ph_error="+ba+"&pic_pl_all="+bc+"&pic_ph_all="+a0+"&pic_pl_s="+aW+"&pic_ph_s="+bn+"&pic_pl_error_1="+bb+"&pic_ph_error_1="+aX+"&pic_pl_all_1="+aU+"&pic_ph_all_1="+bg+"&pic_pl_s_1="+a9+"&pic_ph_s_1="+bn+"&ab="+bd();bh=0;ba=0;bc=0;a0=0;aW=0;bn=0;bb=0;aX=0;aU=0;bg=0;a9=0;aS=0},10000)}}function a3(bo){if(bo){a7+=1}else{a1+=1}if(aZ){aZ=false;setTimeout(function(){var bp=(Math.random()*100000000).toFixed(0);aZ=true;a2.src="http://map.baidu.com/mobile/img/transparent.gif?type=vec&newmap=1&t="+bp+"&code=20066&vec_pl_error="+aT+"&vec_ph_error="+a7+"&vec_pl_all="+be+"&vec_ph_all="+a1+"&ab="+bd();aT=0;a7=0;be=0;a1=0},10000)}}function a4(bo,bp){var bq=bd();if(bq==1){aR+=bo;bl+=bp}if(bq==2){T+=bo;bi+=bp}if(bj){bj=false;setTimeout(function(){var br=(Math.random()*100000000).toFixed(0);bj=true;a2.src="http://map.baidu.com/mobile/img/transparent.gif?res=webapp&counttype=touch&newmap=1&t="+br+"&move1="+aR+"&zoom1="+bl+"&move2="+T+"&zoom2="+bi;aR=0;bl=0;T=0;bi=0},10000)}}function aV(bo,bp){if(bo){a8+=1;if(bp==1){bk+=1}}else{aY+=1}if(a5){a5=false;setTimeout(function(){var bq=(Math.random()*100000000).toFixed(0);a5=true;a2.src="http://map.baidu.com/mobile/img/transparent.gif?type=stpic&t="+bq+"&code=20066&st_pic_error="+a8+"&st_pic_all="+aY+"&st_pic_s="+bk;a8=0;aY=0;bk=0},10000)}}return{countPic:a6,countVec:a3,countTouch:a4,countStPic:aV}})();function aa(aR,T){if(aR.data("events")&&aR.data("events")[T]){return true}else{return false}}var aJ={request:function(aS,T){var aR=p("script",{src:aS,type:"text/javascript",charset:"utf-8"});if(T){BMap.logCountError.countVec(false);aR.onerror=function(){BMap.logCountError.countVec(true)}}if(aR.addEventListener){aR.addEventListener("load",function(aU){var aT=aU.target;aT.parentNode.removeChild(aT)},false)}else{if(aR.attachEvent){aR.attachEvent("onreadystatechange",function(aU){var aT=window.event.srcElement;if(aT&&(aT.readyState=="loaded"||aT.readyState=="complete")){aT.parentNode.removeChild(aT)}})}}document.getElementsByTagName("head")[0].appendChild(aR);aR=null}};window.sendReqNo=0;function ao(){}aF.object.extend(ao,{Request:{INITIAL:-1,WAITING:0,COMPLETED:1},getDependency:function(){return{poly:["marker"]}},Config:{_baseUrl:"http://map.baidu.com/mobile/?qt=getMobileModules&v=2&"},delayFlag:false,ModuleTree:{_modules:{},_arrMdls:[]},load:function(aR,aT){var T=this.getModule(aR);if(T._status==this.Request.COMPLETED){return}else{if(T._status==this.Request.INITIAL){this.combine(aR);this.pushUniqueMdl(aR);var aS=this;if(aS.delayFlag==false){aS.delayFlag=true;window.setTimeout(function(){var a0=aS.ModuleTree._arrMdls.slice(0);var a2=[];for(var aW=0,aV=a0.length;aW<aV;aW++){var a1=a0[aW],aU=window.asyncMdlVer[a1],aY="async_"+a1+"_"+aU;if(!window.chkVersion(aY)){a0[a0[aW]]="";a2.push(a1+"_"+aU)}else{a0[a0[aW]]=window.getVersion(aY)}}if(a2.length==0){for(var aW=0,aV=a0.length;aW<aV;aW++){var a3=a0[aW],aY="async_"+a3+"_"+window.asyncMdlVer[a3],aZ=window.getVersion(aY);ao.run(a3,aZ)}}else{var aX=aS.Config._baseUrl+"mod="+a2.join(",")+"&sendReqNo="+window.sendReqNo+"&cbk=_jsload";aJ.request(aX);window["sendReqNo"+window.sendReqNo]=a0;window.sendReqNo++}aS.delayFlag=false;aS.ModuleTree._arrMdls.length=0},1)}T._status=this.Request.WAITING}T._callbacks.push(aT)}},combine:function(T){var aS=this.getDependency();if(T&&aS[T]){var aS=aS[T];for(var aR=0;aR<aS.length;aR++){this.combine(aS[aR]);if(!this.ModuleTree._modules[aS[aR]]){this.pushUniqueMdl(aS[aR])}}}},pushUniqueMdl:function(aT){var T=this.ModuleTree._arrMdls;for(var aS=0,aR=T.length;aS<aR;aS++){if(T[aS]==aT){return}}T.push(aT)},getModule:function(aR){var T;if(!this.ModuleTree._modules[aR]){this.ModuleTree._modules[aR]={};this.ModuleTree._modules[aR]._status=this.Request.INITIAL;this.ModuleTree._modules[aR]._callbacks=[]}T=this.ModuleTree._modules[aR];return T},run:function(aT,aW){var aR="async_"+aT+"_"+window.asyncMdlVer[aT],aV="async_"+aT;if(!window.chkVersion(aR)){window.saveVersion(aR,aW,aV)}var aS=this.getModule(aT);try{eval(aW)}catch(aX){return}aS._status=this.Request.COMPLETED;for(var aU=0,T=aS._callbacks.length;aU<T;aU++){aS._callbacks[aU]()}aS._callbacks.length=0}});window._jsload=function(aV,aX,aW){var T=window["sendReqNo"+aW],aS=aV.split("_")[0];T[aS]=aX;var aU=true;for(var aT=0,aR=T.length;aT<aR;aT++){if(T[T[aT]].length<=0){aU=false;break}}if(aU){for(var aT=0,aR=T.length;aT<aR;aT++){var aV=T[aT],aX=T[aV];ao.run(aV,aX)}T.length=0;delete window["sendReqNo"+aW]}};function aM(T,aR){this.x=T||0;this.y=aR||0}aM.prototype.equals=function(T){return T&&T.x==this.x&&T.y==this.y};function U(aR,T){this.width=aR||0;this.height=T||0}U.prototype.equals=function(T){return T&&this.width==T.width&&this.height==T.height};function J(T,aR){if(!T){return}this._position=T;this.guid="spot"+(J.guid++);aR=aR||{};this._text=aR.text||"";this._offsets=aR.offsets?aR.offsets.slice(0):[5,5,5,5];this._userData=aR.userData||null;this._minZoom=aR.minZoom||null;this._maxZoom=aR.maxZoom||null}J.guid=0;aF.extend(J.prototype,{initialize:function(T){if(this._minZoom==null){this._minZoom=T.config.minZoom}if(this._maxZoom==null){this._maxZoom=T.config.maxZoom}},setPosition:function(T){if(T instanceof f){this._position=T}},getPosition:function(){return this._position},setText:function(T){this._text=T},getText:function(){return this._text},setUserData:function(T){this._userData=T},getUserData:function(){return this._userData}});function M(){this._map=null;this._container;this._type="control";this._visible=true}aF.lang.inherits(M,aF.lang.Class,"Control");aF.extend(M.prototype,{initialize:function(T){this._map=T;if(this._container){T.container.appendChild(this._container);return this._container}return},_i:function(T){if(!this._container&&this.initialize&&au(this.initialize)){this._container=this.initialize(T)}this._opts=this._opts||{printable:false};this._setStyle();this._setPosition();if(this._container){this._container._jsobj=this}},_setStyle:function(){var aR=this._container;if(aR){var T=aR.style;T.position="absolute";T.zIndex=this._container.style.zIndex||"10";T.MozUserSelect="none";T.WebkitTextSizeAdjust="none";if(!this._opts.printable){aF.dom.addClass(aR,"BMap_noprint")}}},remove:function(){this._map=null;if(!this._container){return}this._container.parentNode&&this._container.parentNode.removeChild(this._container);this._container._jsobj=null;this._container=null},_render:function(){this._container=V(this._map.container,"<div unselectable='on'></div>");if(this._visible==false){aF.dom.hide(this._container)}return this._container},_setPosition:function(){this.setAnchor(this._opts.anchor)},setAnchor:function(aT){if(this.anchorFixed||!I(aT)||isNaN(aT)||aT<BMAP_ANCHOR_TOP_LEFT||aT>BMAP_ANCHOR_BOTTOM_RIGHT){aT=this.defaultAnchor}this._opts=this._opts||{printable:false};this._opts.offset=this._opts.offset||this.defaultOffset;var aS=this._opts.anchor;this._opts.anchor=aT;if(!this._container){return}var aV=this._container;var T=this._opts.offset.width;var aU=this._opts.offset.height;if(this instanceof O){if(this._map&&this._map.highResolutionEnabled()){aV.childNodes[1].style.height="2px";aV.childNodes[2].style.height="4px";aV.childNodes[3].style.height="4px";aV.style.height="19px"}}aV.firstChild.style.cssText="font-size:11px;line-height:18px;";aV.style.left=aV.style.top=aV.style.right=aV.style.bottom="auto";switch(aT){case BMAP_ANCHOR_TOP_LEFT:aV.style.top=aU+"px";aV.style.left=T+"px";break;case BMAP_ANCHOR_TOP_RIGHT:aV.style.top=aU+"px";aV.style.right=T+"px";break;case BMAP_ANCHOR_BOTTOM_LEFT:aV.style.bottom=aU+"px";aV.style.left=T+"px";break;case BMAP_ANCHOR_BOTTOM_RIGHT:aV.style.bottom=aU+"px";aV.style.right=T+"px";break;default:break}var aR=["TL","TR","BL","BR"];aF.dom.removeClass(this._container,"anchor"+aR[aS]);aF.dom.addClass(this._container,"anchor"+aR[aT])},getAnchor:function(){return this._opts.anchor},setOffset:function(T){if(!(T instanceof U)){return}this._opts=this._opts||{printable:false};this._opts.offset=new U(T.width,T.height);if(!this._container){return}this.setAnchor(this._opts.anchor)},getOffset:function(){return this._opts.offset},getDom:function(){return this._container},show:function(){if(this._visible==true){return}this._visible=true;if(this._container){aF.dom.show(this._container)}},hide:function(){if(this._visible==false){return}this._visible=false;if(this._container){aF.dom.hide(this._container)}},isPrintable:function(){return !!this._opts.printable},isVisible:function(){if(!this._container&&!this._map){return false}return !!this._visible}});window.BMAP_ANCHOR_TOP_LEFT=0;window.BMAP_ANCHOR_TOP_RIGHT=1;window.BMAP_ANCHOR_BOTTOM_LEFT=2;window.BMAP_ANCHOR_BOTTOM_RIGHT=3;function O(T){M.call(this);T=T||{};this._opts={printable:false};this._opts=aF.object.extend(aF.object.extend(this._opts,{color:"black",unit:"metric"}),T);this.defaultAnchor=BMAP_ANCHOR_BOTTOM_LEFT;this.defaultOffset=new U(81,18);this.setAnchor(T.anchor);this._units={metric:{name:"metric",conv:1,incon:1000,u1:"\u7c73",u2:"\u516c\u91cc"}};if(!this._units[this._opts.unit]){this._opts.unit="metric"}this._scaleText=null;this._numberArray={};this._asyncLoadCode()}window.BMAP_UNIT_METRIC="metric";aF.lang.inherits(O,M,"ScaleControl");aF.object.extend(O.prototype,{initialize:function(T){this._map=T;return this._container},setColor:function(T){this._opts.color=T+""},getColor:function(){return this._opts.color},_asyncLoadCode:function(){var T=this;ao.load("control",function(){T._asyncDraw()})}});function s(T,aR){if(T&&!aR){aR=T}this._sw=this._ne=null;this._swLng=this._swLat=null;this._neLng=this._neLat=null;if(T){this._sw=new f(T.lng,T.lat);this._ne=new f(aR.lng,aR.lat);this._swLng=T.lng;this._swLat=T.lat;this._neLng=aR.lng;this._neLat=aR.lat}}aF.object.extend(s.prototype,{isEmpty:function(){return !this._sw||!this._ne},equals:function(T){if(!(T instanceof s)||this.isEmpty()){return false}return this.getSouthWest().equals(T.getSouthWest())&&this.getNorthEast().equals(T.getNorthEast())},getSouthWest:function(){return this._sw},getNorthEast:function(){return this._ne},getCenter:function(){if(this.isEmpty()){return null}return new f((this._swLng+this._neLng)/2,(this._swLat+this._neLat)/2)},extend:function(T){if(!(T instanceof f)){return}var aR=T.lng,aS=T.lat;if(!this._sw){this._sw=new f(0,0)}if(!this._ne){this._ne=new f(0,0)}if(!this._swLng||this._swLng>aR){this._sw.lng=this._swLng=aR}if(!this._neLng||this._neLng<aR){this._ne.lng=this._neLng=aR}if(!this._swLat||this._swLat>aS){this._sw.lat=this._swLat=aS}if(!this._neLat||this._neLat<aS){this._ne.lat=this._neLat=aS}},toSpan:function(){if(this.isEmpty()){return new f(0,0)}return new f(Math.abs(this._neLng-this._swLng),Math.abs(this._neLat-this._swLat))}});function f(T,aR){this.lng=parseFloat(T);this.lat=parseFloat(aR)}f.prototype.equals=function(T){return T&&this.lat==T.lat&&this.lng==T.lng};function ap(){}ap.prototype.lngLatToPoint=function(){throw"lngLatToPoint\u65b9\u6cd5\u672a\u5b9e\u73b0"};ap.prototype.pointToLngLat=function(){throw"pointToLngLat\u65b9\u6cd5\u672a\u5b9e\u73b0"};function ax(T){this._mapType=T}ax.prototype=new ap();aF.extend(ax.prototype,{pointToPixel:function(aR,aV,aU,aT,aW){if(!aR){return}var aS=this._mapType.getZoomUnits(aV);var T=Math.round((aR.lng-aU.lng)/aS+aT.width/2);var aX=Math.round((aU.lat-aR.lat)/aS+aT.height/2);return new aM(T,aX)},pixelToPoint:function(T,aY,aU,aS,aR){if(!T){return}var aX=this._mapType.getZoomUnits(aY);var aV=aU.lng+aX*(T.x-aS.width/2);var aT=aU.lat-aX*(T.y-aS.height/2);var aW=new f(aV,aT);return aW}});function L(){this._type="overlay"}aF.lang.inherits(L,aF.lang.Class,"Overlay");L.getZIndex=function(T){T=T*1;if(!T){return 0}return(T*-100000)<<1};aF.extend(L.prototype,{_i:function(T){if(!this.domElement&&au(this.initialize)){this.domElement=this.initialize(T);if(this.domElement){this.domElement.style.WebkitUserSelect="none"}}this.draw()},initialize:function(T){throw"initialize\u65b9\u6cd5\u672a\u5b9e\u73b0"},draw:function(){throw"draw\u65b9\u6cd5\u672a\u5b9e\u73b0"},remove:function(){if(this.domElement&&this.domElement.parentNode){this.domElement.parentNode.removeChild(this.domElement)}this.domElement=null;this.dispatchEvent(new av("onremove"))},hide:function(){if(this.domElement){aF.dom.hide(this.domElement)}},show:function(){if(this.domElement){aF.dom.show(this.domElement)}},isVisible:function(){if(!this.domElement){return false}if(this.domElement.style.display=="none"||this.domElement.style.visibility=="hidden"){return false}return true}});BMap.register(function(aS){var T=aS.temp;T.overlayDiv=aS.overlayDiv=aR(aS.platform,200);aS._panes.floatPane=aR(T.overlayDiv,800);aS._panes.markerMouseTarget=aR(T.overlayDiv,700);aS._panes.floatShadow=aR(T.overlayDiv,600);aS._panes.labelPane=aR(T.overlayDiv,500);aS._panes.markerPane=aR(T.overlayDiv,400);aS._panes.markerShadow=aR(T.overlayDiv,300);aS._panes.mapPane=aR(T.overlayDiv,200);function aR(aT,aW){var aV=p("div"),aU=aV.style;aU.position="absolute";aU.top=aU.left=aU.width=aU.height="0";aU.zIndex=aW;aT.appendChild(aV);return aV}});function aC(){aF.lang.Class.call(this);L.call(this);this.map=null;this._visible=true;this._dblclickTime=0}aF.lang.inherits(aC,L,"OverlayInternal");aF.extend(aC.prototype,{initialize:function(T){this.map=T;aF.lang.Class.call(this,this.guid);return null},getMap:function(){return this.map},draw:function(){},remove:function(){this.map=null;aF.lang.decontrol(this.guid);L.prototype.remove.call(this)},hide:function(){if(this._visible==false){return}this._visible=false},show:function(){if(this._visible==true){return}this._visible=true},isVisible:function(){if(!this.domElement){return false}return !!this._visible},getContainer:function(){return this.domElement},setConfig:function(aR){aR=aR||{};for(var T in aR){this._config[T]=aR[T]}},setZIndex:function(T){this.zIndex=T},enableMassClear:function(){this._config.enableMassClear=true},disableMassClear:function(){this._config.enableMassClear=false}});function aq(){this.map=null;this._overlays={};this._customOverlays=[]}BMap.register(function(aR){var T=new aq();T.map=aR;aR._overlays=T._overlays;aR._customOverlays=T._customOverlays;aR.addEventListener("load",function(aS){T.draw(aS)});aR.addEventListener("moveend",function(aS){T.draw(aS)});aR.addEventListener("zoomend",function(aS){T.draw(aS)});aR.addEventListener("addoverlay",function(aW){var aT=aW.target;if(aT instanceof aC){if(!T._overlays[aT.guid]){T._overlays[aT.guid]=aT}}else{var aV=false;for(var aU=0,aS=T._customOverlays.length;aU<aS;aU++){if(T._customOverlays[aU]===aT){aV=true;break}}if(!aV){T._customOverlays.push(aT)}}});aR.addEventListener("removeoverlay",function(aV){var aT=aV.target;if(aT instanceof aC){delete T._overlays[aT.guid]}else{for(var aU=0,aS=T._customOverlays.length;aU<aS;aU++){if(T._customOverlays[aU]===aT){T._customOverlays.splice(aU,1);break}}}});aR.addEventListener("clearoverlays",function(aV){for(var aU in T._overlays){if(T._overlays[aU]._config.enableMassClear){T._overlays[aU].remove();delete T._overlays[aU]}}for(var aT=0,aS=T._customOverlays.length;aT<aS;aT++){if(T._customOverlays[aT].enableMassClear!=false){T._customOverlays[aT].remove();T._customOverlays[aT]=null;T._customOverlays.splice(aT,1);aT--;aS--}}})});aq.prototype.draw=function(aS){for(var aR in this._overlays){this._overlays[aR].draw()}aF.array.each(this._customOverlays,function(aT){aT.draw()});if(BMap.DrawerSelector){var T=BMap.DrawerSelector.getDrawer(this.map);T.setPalette()}};function at(T){aC.call(this);this._config={strokeColor:"#3a6bdb",strokeWeight:5,strokeOpacity:0.65,strokeStyle:"solid",enableMassClear:true,getParseTolerance:null,getParseCacheIndex:null,enableParse:true,clickable:true};T=T||{};this.setConfig(T);if(this._config.strokeWeight<=0){this._config.strokeWeight=5}if(this._config.strokeOpacity<0||this._config.strokeOpacity>1){this._config.strokeOpacity=0.65}if(this._config.strokeStyle!="solid"&&this._config.strokeStyle!="dashed"){this._config.strokeStyle="solid"}if(ae(T.enableClicking)){this._config.clickable=T.enableClicking}this.domElement=null;this._bounds=new BMap.Bounds(0,0,0,0);this._parseCache=[];this._temp={}}aF.lang.inherits(at,aC,"Graph");at.getGraphPoints=function(aR){var T=[];if(!aR){return T}if(aE(aR)){var aS=aR.split(";");aF.array.each(aS,function(aU){var aT=aU.split(",");T.push(new f(aT[0],aT[1]))})}if(aR.constructor==Array&&aR.length>0){T=aR}return T};at.parseTolerance=[0.09,0.005,0.0001,0.00001];aF.extend(at.prototype,{initialize:function(T){this.map=T;return null},draw:function(){},setPath:function(T){this._parseCache.length=0;this.points=at.getGraphPoints(T).slice(0);this._calcBounds()},_calcBounds:function(){if(!this.points){return}var T=this;T._bounds=new s();aF.array.each(this.points,function(aR){T._bounds.extend(aR)})},getPath:function(){return this.points},setPositionAt:function(aR,T){if(!T||!this.points[aR]){return}this._parseCache.length=0;this.points[aR]=new f(T.lng,T.lat);this._calcBounds()},setStrokeColor:function(T){this._config.strokeColor=T},getStrokeColor:function(){return this._config.strokeColor},setStrokeWeight:function(T){if(T>0){this._config.strokeWeight=T}},getStrokeWeight:function(){return this._config.strokeWeight},setStrokeOpacity:function(T){if(!T||T>1||T<0){return}this._config.strokeOpacity=T},getStrokeOpacity:function(){return this._config.strokeOpacity},setStrokeStyle:function(T){if(T!="solid"&&T!="dashed"){return}this._config.strokeStyle=T},getStrokeStyle:function(){return this._config.strokeStyle},getBounds:function(){return this._bounds},remove:function(){aC.prototype.remove.call(this);this._parseCache.length=0}});function r(aR,aS,aT){if(!aR||!aS){return}this.imageUrl=aR;this.size=aS;var T=new U(Math.floor(aS.width/2),Math.floor(aS.height/2));var aU={anchor:T,imageOffset:new U(0,0)};aT=aT||{};aF.extend(aU,aT);this.anchor=aU.anchor;this.imageOffset=aU.imageOffset;this.printImageUrl=aT.printImageUrl||""}var N=r.prototype;N.setImageUrl=function(T){if(!T){return}this.imageUrl=T};N.setPrintImageUrl=function(T){if(!T){return}this.printImageUrl=T};N.setSize=function(T){if(!T){return}this.size=new U(T.width,T.height)};N.setAnchor=function(T){if(!T){return}this.anchor=new U(T.width,T.height)};N.setImageOffset=function(T){if(!T){return}this.imageOffset=new U(T.width,T.height)};N.toString=function(){return"Icon"};var af=aP.imgPath+"red_marker.png";var aD=new r(af,new U(19,25),{anchor:new U(10,25)});var F=new r(af,new U(20,11),{anchor:new U(6,11),imageOffset:new U(-19,-13)});function D(T,aS){aC.call(this);aS=aS||{};this.point=T;this.map=null;this._config={offset:new U(0,0),icon:aD,shadow:F,title:"",baseZIndex:0,clickable:true,zIndexFixed:false,isTop:false,enableMassClear:true};this.setConfig(aS);if(aS.icon&&!aS.shadow){this._config.shadow=null}if(ae(aS.enableClicking)){this._config.clickable=aS.enableClicking}var aR=this;ao.load("marker",function(){aR._draw()})}D.TOP_ZINDEX=L.getZIndex(-90)+1000000;aF.lang.inherits(D,aC,"Marker");aF.extend(D.prototype,{setIcon:function(T){if(T instanceof r){this._config.icon=T}},getIcon:function(){return this._config.icon},setShadow:function(T){if(T instanceof r){this._config.shadow=T}},getShadow:function(){return this._config.shadow},getPosition:function(){return this.point},setPosition:function(T){if(T instanceof f){this.point=new f(T.lng,T.lat)}},setTop:function(aR,T){this._config.isTop=!!aR;if(aR){this._addi=T||0}},setTitle:function(T){this._config.title=T+""},getTitle:function(){return this._config.title},setOffset:function(T){if(T instanceof U){this._config.offset=T}},getOffset:function(){return this._config.offset}});function ah(T,aS){at.call(this,aS);this.setPath(T);var aR=this;ao.load("poly",function(){aR._draw()})}aF.lang.inherits(ah,at,"Polyline");function aB(T){this.map=T;this.mapTypeLayers=[];this.tileLayers=[];this.bufferNumber=300;this.realBufferNumber=0;this.mapTiles={};this.bufferTiles={};this.numLoading=0;this.isFirstTile=true;this._mapTypeLayerContainer=this._createDiv(1);this._vectorLayerContainer=this._createDiv(2);this._normalLayerContainer=this._createDiv(3);T.platform.appendChild(this._mapTypeLayerContainer);T.platform.appendChild(this._vectorLayerContainer);T.platform.appendChild(this._normalLayerContainer)}BMap.register(function(aR){var T=new aB(aR);T.initialize();aR.tileMgr=T});aF.extend(aB.prototype,{initialize:function(){var T=this,aR=T.map;aR.addEventListener("loadcode",function(){T.loadTiles()});aR.addEventListener("addtilelayer",function(aS){T.addTileLayer(aS)});aR.addEventListener("removetilelayer",function(aS){T.removeTileLayer(aS)});aR.addEventListener("zoomstartcode",function(aS){T._zoom(aS)})},loadTiles:function(){var aT=this;if(!this.loaded){aT.initMapTypeTiles()}aT.moveGridTiles();if(!this.loaded){this.loaded=true;var T="tile",aS=window.asyncMdlVer[T],aR="async_"+T+"_"+aS,aU=window.getVersion(aR);if(aS&&aU){ao.run(T,aU);aT._asyncLoadTiles()}else{ao.load("tile",function(){aT._asyncLoadTiles()})}}},initMapTypeTiles:function(){var aR=this.map.getMapType();var aS=aR.getTileLayers();for(var T=0;T<aS.length;T++){var aT=new A();aF.extend(aT,aS[T]);this.mapTypeLayers.push(aT);aT.initialize(this.map,this._mapTypeLayerContainer)}},_createDiv:function(aR){var T=p("div");T.style.position="absolute";T.style.left=T.style.top="0";T.style.zIndex=aR;return T},_checkTilesLoaded:function(){this.numLoading--;var T=this;if(this.isFirstTile){this.map.dispatchEvent(new av("onfirsttileloaded"));this.isFirstTile=false}if(this.numLoading==0){if(this._checkLoadedTimer){clearTimeout(this._checkLoadedTimer);this._checkLoadedTimer=null}this._checkLoadedTimer=setTimeout(function(){if(T.numLoading==0){T.map.dispatchEvent(new av("ontilesloaded"));T.isFirstTile=true}T._checkLoadedTimer=null},80)}},getTileName:function(T,aR){return"TILE-"+aR.guid+"-"+T[0]+"-"+T[1]+"-"+T[2]},hideTile:function(aR){var T=aR.img;if(T){if(o(T)){T.parentNode.removeChild(T)}}delete this.mapTiles[aR.name];if(!aR.loaded){T=null;aR._callCbks();aR.img=null;aR.mgr=null}},moveGridTiles:function(){var bd=this.mapTypeLayers,bb=bd.concat(this.tileLayers),a8=bb.length;for(var be=0;be<a8;be++){var aT=bb[be];if(aT.baseLayer){this.tilesDiv=aT.tilesDiv;var aV=this.tilesDiv;if(this.map.getZoom()>=this.map.config.vectorMapLevel){aV.style.display="none";continue}else{aV.style.display="block"}}var a2=this.map,a3=a2.getMapType(),bl=a3.getProjection(),aS=a2.zoomLevel,a7=a2.mercatorCenter;this.mapCenterPoint=a7;var bh=a3.getZoomUnits(aS),aZ=a3.getZoomFactor(aS),aY=Math.ceil(a7.lng/aZ),bc=Math.ceil(a7.lat/aZ),a1=a3.getTileSize(),a4=[aY,bc,(a7.lng-aY*aZ)/aZ*a1,(a7.lat-bc*aZ)/aZ*a1],a0=a4[0]-Math.ceil((a2.width/2-a4[2])/a1),bo=a4[1]-Math.ceil((a2.height/2-a4[3])/a1),bf=a4[0]+Math.ceil((a2.width/2+a4[2])/a1),bm=0,a5=a4[1]+Math.ceil((a2.height/2+a4[3])/a1)+bm;this.areaCenter=new f(a7.lng,a7.lat);var aR=this.mapTiles,T=-this.areaCenter.lng/bh,bp=this.areaCenter.lat/bh,a9=[Math.round(T),Math.round(bp)],bi=a2.getZoom();for(var a6 in aR){var aW=aR[a6],bn=aW.info;if(bn[2]!=bi||(bn[2]==bi&&(a0>bn[0]||bf<=bn[0]||bo>bn[1]||a5<=bn[1]))){this.hideTile(aW)}}var aU=-a2.offsetX+a2.width/2,aX=-a2.offsetY+a2.height/2;aT.tilesDiv.style.left=Math.round(T+aU)-a9[0]+"px";aT.tilesDiv.style.top=Math.round(bp+aX)-a9[1]+"px";if(this.tilesOrder){this.tilesOrder.length=0}else{this.tilesOrder=[]}if(a2._viewTiles){a2._viewTiles.length=0}else{a2._viewTiles=[]}for(var bk=a0;bk<bf;bk++){for(var bj=bo;bj<a5;bj++){this.tilesOrder.push([bk,bj]);a2._viewTiles.push({x:bk,y:bj})}}this.tilesOrder.sort((function(bq){return function(br,bs){return((0.4*Math.abs(br[0]-bq[0])+0.6*Math.abs(br[1]-bq[1]))-(0.4*Math.abs(bs[0]-bq[0])+0.6*Math.abs(bs[1]-bq[1])))}})([a4[0]-1,a4[1]-1]));if(!this.map.enableLoadTiles){return}var ba=aT.baseLayer?true:false;if(ba){this.map.dispatchEvent(new av("ontilesbegin"));this.numLoading+=this.tilesOrder.length}for(var bk=0,bg=this.tilesOrder.length;bk<bg;bk++){this.showTile([this.tilesOrder[bk][0],this.tilesOrder[bk][1],bi],a9,aT)}}return},showTile:function(aV,aU,aY){var a2=this,a0=aY.baseLayer?true:false;a2.centerPos=aU;var aX=this.map.getMapType(),aS=a2.getTileName(aV,aY),a5=aX.getTileSize(),aT=(aV[0]*a5)+aU[0],aR=(-1-aV[1])*a5+aU[1],aZ=[aT,aR],a1=this.mapTiles[aS];if(a1&&a1.img){aQ(a1.img,aZ);if(a0){if(a1.loaded){this._checkTilesLoaded()}else{a1._addLoadCbk(function(){a2._checkTilesLoaded()})}}return}a1=this.bufferTiles[aS];if(a1&&a1.img){aY.tilesDiv.insertBefore(a1.img,aY.tilesDiv.lastChild);this.mapTiles[aS]=a1;aQ(a1.img,aZ);if(a0){if(a1.loaded){this._checkTilesLoaded()}else{a1._addLoadCbk(function(){a2._checkTilesLoaded()})}}return}var a4=a5*Math.pow(2,(aX.getMaxZoom()-aV[2])),a3=new f(aV[0]*a4,aV[1]*a4),aW=new aM(aV[0],aV[1]),T=aY.getTilesUrl(aW,aV[2]);a1=new aw(this,T,aZ,aV,aY);if(a0){a1._addLoadCbk(function(){a2._checkTilesLoaded()})}a1._load();this.mapTiles[aS]=a1},addTileLayer:function(aT){var aS=this,T=aT.target;for(var aR=0;aR<aS.tileLayers.length;aR++){if(aS.tileLayers[aR]==T){return}}T.initialize(this.map,this._normalLayerContainer);aS.tileLayers.push(T)},removeTileLayer:function(aU){var aT=this,aR=aU.target;for(var aS=0,T=aT.tileLayers.length;aS<T;aS++){if(aR==aT.tileLayers[aS]){aT.tileLayers.splice(aS,1)}}aR.remove()},_zoom:function(){var T=this;setTimeout(function(){T.moveGridTiles();T.map.dispatchEvent(new av("onzoomend"))},10)}});function aw(aX,T,aU,aR,aT){this.mgr=aX;this.position=aU;this._cbks=[];this.name=aX.getTileName(aR,aT);this.info=aR;this.level=parseInt(aR[2],10);this._transparentPng=aT.isTransparentPng();var aY=p("img");m(aY);aY.galleryImg=false;var aW=aY.style;var aS=aX.map.getMapType(),aZ=aS.getTileSize();aW.position="absolute";aW.width=aZ+"px";aW.height=aZ+"px";aW.left=aU[0]+"px";aW.top=aU[1]+"px";this.img=aY;this.src=T;var aV=this;this.img.onload=function(a5){aV.loaded=true;if(!aV.mgr){return}var a1=aV.mgr;var a0=a1.bufferTiles;if(!a0[aV.name]){a1.realBufferNumber++;a0[aV.name]=aV}if(aV.img&&!o(aV.img)){if(aT.tilesDiv){aT.tilesDiv.appendChild(aV.img)}}var a3=a1.realBufferNumber-a1.bufferNumber;for(var a4 in a0){if(a3<=0){break}if(!a1.mapTiles[a4]){a0[a4].mgr=null;var a2=a0[a4].img;if(a2&&a2.parentNode){a2.parentNode.removeChild(a2)}a2=null;a0[a4].img=null;delete a0[a4];a1.realBufferNumber--;a3--}}aV._callCbks()};this.isHighResolution=aX.map.highResolutionEnabled();this.img.onerror=function(){var a1=aV.img,a3=a1?a1.getAttribute("errorCount"):true;if(a1&&(!a3||a3&&a3<5)){a3=a3||0;a3++;a1.src=T;BMap.logCountError.countPic(aV.isHighResolution,false,a3,aV.level);a1.setAttribute("errorCount",a3);BMap.logCountError.countPic(aV.isHighResolution,true,a3,aV.level)}else{aV._callCbks();if(!aV.mgr){return}var a0=aV.mgr;var a2=a0.map.getMapType();if(a2.getErrorImageUrl()){aV.error=true;aV.img.src=a2.getErrorImageUrl();if(aV.img&&!o(aV.img)){aT.tilesDiv.appendChild(aV.img)}}BMap.logCountError.countPic(aV.isHighResolution,true,6,aV.level)}};aY=null}aw.prototype._addLoadCbk=function(T){this._cbks.push(T)};aw.prototype._load=function(){this.img.src=this.src;BMap.logCountError.countPic(this.isHighResolution,false,0,this.level)};aw.prototype._callCbks=function(){var aR=this;for(var T=0;T<aR._cbks.length;T++){aR._cbks[T]()}aR._cbks.length=0};function A(T){this.opts=T||{};this.transparentPng=this.opts.transparentPng||false;this.baseLayer=this.opts.baseLayer||false;this.zIndex=this.opts.zIndex||0;this.guid=A._guid++}A._guid=0;aF.lang.inherits(A,aF.lang.Class,"TileLayer");aF.extend(A.prototype,{initialize:function(aS,T){if(this.baseLayer){this.zIndex=-100}this.map=aS;if(!this.tilesDiv){var aT=p("div");var aR=aT.style;aR.position="absolute";aR.zIndex=this.zIndex;aR.left=Math.ceil(-aS.offsetX+aS.width/2)+"px";aR.top=Math.ceil(-aS.offsetY+aS.height/2)+"px";T.appendChild(aT);this.tilesDiv=aT}},remove:function(){if(this.tilesDiv&&this.tilesDiv.parentNode){this.tilesDiv.innerHTML="";this.tilesDiv.parentNode.removeChild(this.tilesDiv)}delete this.tilesDiv},isTransparentPng:function(){return this.transparentPng},getTilesUrl:function(aR,aS){var T="";if(this.opts.tileUrlTemplate){T=this.opts.tileUrlTemplate.replace(/\{X\}/,aR.x);T=T.replace(/\{Y\}/,aR.y);T=T.replace(/\{Z\}/,aS)}return T},getMapType:function(){return this.mapType}});function aH(T){A.call(this,T);this._opts={};T=T||{};this._opts=aF.object.extend(this._opts,T);if(this._opts.predictDate){if(this._opts.predictDate.weekday<1||this._opts.predictDate.weekday>7){this._opts.predictDate=1}if(this._opts.predictDate.hour<0||this._opts.predictDate.hour>23){this._opts.predictDate.hour=0}}this._tileUrl="http://its.map.baidu.com:8002/traffic/"}aH.prototype=new A();aH.prototype.initialize=function(aR,T){A.prototype.initialize.call(this,aR,T);this._map=aR};aH.prototype.isTransparentPng=function(){return true};aH.prototype.getTilesUrl=function(aW,aR){var aX="";if(this._opts.predictDate){aX="HistoryService?day="+(this._opts.predictDate.weekday-1)+"&hour="+this._opts.predictDate.hour+"&t="+new Date().getTime()+"&"}else{aX="TrafficTileService?time="+new Date().getTime()+"&"}var aS=this._map,aY=aW.x,aT=aW.y,aV=Math.floor(aY/200),aU=Math.floor(aT/200),T=this._tileUrl+aX+"level="+aR+"&x="+aY+"&y="+aT;return T.replace(/-(\d+)/gi,"M$1")};function aK(T,aR,aS){this._name=T;this._layers=aR instanceof A?[aR]:aR.slice(0);this._opts={tips:"",labelText:"",minZoom:1,maxZoom:18,tileSize:256,textColor:"black",errorImageUrl:"",projection:new ax(this)};if(this._layers.length==1){this._layers[0].baseLayer=true}aF.extend(this._opts,aS||{})}aF.extend(aK.prototype,{getName:function(){return this._name},getTips:function(){return this._opts.tips},getLabelText:function(){return this._opts.labelText},getTileLayer:function(){return this._layers[0]},getTileLayers:function(){return this._layers},getTileSize:function(){this._opts.tileSize=256;var T=this._opts.mapInstance;if(T.highResolutionEnabled()&&T.getZoom()<T.config.vectorMapLevel){this._opts.tileSize=128}return this._opts.tileSize},getMinZoom:function(){return this._opts.minZoom},getMaxZoom:function(){return this._opts.maxZoom},getTextColor:function(){return this._opts.textColor},getProjection:function(){return this._opts.projection},getErrorImageUrl:function(){return this._opts.errorImageUrl},getZoomUnits:function(T){var aS=1,aR=this._opts.mapInstance;if(aR.highResolutionEnabled()&&aR.getZoom()<aR.config.vectorMapLevel){aS=2}return Math.pow(2,(18-T))*aS},getZoomFactor:function(T){return this.getZoomUnits(T)*this.getTileSize()}});var t={pd:{host:["http://online0.map.bdimg.com/it/","http://online1.map.bdimg.com/it/","http://online2.map.bdimg.com/it/","http://online3.map.bdimg.com/it/"],params:{fm:42,f:"webapp",format_add:".jpg"}},hd:{host:["http://or1.map.baidu.com:8080/it/","http://or2.map.baidu.com:8080/it/","http://or3.map.baidu.com:8080/it/","http://or4.map.baidu.com:8080/it/"],params:{format:"jpeg",fm:41,quality:70,f:"webapp",format_add:".jpg"}}};var aA=new A();aA.getTilesUrl=function(aR,aX){var aY=aR.x,aT=aR.y,aS,aU;var aV=BMap.TILE_CONFIG||t;if(this.map.highResolutionEnabled()){aS=aV.hd;if(typeof TVC!="undefined"){aU=TVC.webapp.high_normal}}else{aS=aV.pd;if(typeof TVC!="undefined"){aU=TVC.webapp.lower_normal}}var aZ="u=x="+aY+";y="+aT+";z="+aX;if(aU&&aU.version){aZ+=";v="+aU.version}else{aZ+=";v=014"}aZ+=";type=web";var T=aS.host[Math.abs(aY+aT)%aS.host.length]+aZ;if(aU&&aU.updateDate){T+="&udt="+aU.updateDate}for(var aW in aS.params){T+="&"+aW+"="+aS.params[aW]}return T.replace(/-(\d+)/gi,"M$1")};function z(T,aT){this._container=typeof T=="string"?aF.g(T):T;this._opts={linksControl:true,enableDoubleClickZoom:true};aT=aT||{};for(var aR in aT){this._opts[aR]=aT[aR]}this._pov={heading:0,pitch:0};this._links=[];this._id=null;this._position=null;this._zoom=2;this._description="";this._mode="";var aS=this;ao.load("streetview",function(){aS._draw()})}z.MAX_ZOOM=5;z.MIN_ZOOM=0;aF.lang.inherits(z,aF.lang.Class,"StreetView");aF.extend(z.prototype,{getLinks:function(){return this._links},getId:function(){return this._id},getPosition:function(){return this._position},getPov:function(){return this._pov},getZoom:function(){return this._zoom},getDescription:function(){return this._description},getRelevants:function(){return this._relevants||[]},getMode:function(){return this._mode},setId:function(T){if(T==this._id){return}this._lastId=this._id;this._id=T;this._position=null;this._innerId=null},setInnerId:function(T){if(T==this._innerId){return}this._innerId=T;this._id=null;this._position=null},setPosition:function(T){if(T.equals(this._position)){return}this._lastId=this._id;this._position=T;this._id=null;this._innerId=null},setPov:function(T){this._pov=T;if(this._pov.pitch>45){this._pov.pitch=45}if(this._pov.pitch<-10){this._pov.pitch=-10}},setZoom:function(T){if(T==this._zoom){return}if(T>z.MAX_ZOOM){T=z.MAX_ZOOM}if(T<z.MIN_ZOOM){T=z.MIN_ZOOM}if(T!=this._zoom){this._zoom=T}},enableDoubleClickZoom:function(){this._opts.enableDoubleClickZoom=true},disableDoubleClickZoom:function(){this._opts.enableDoubleClickZoom=false},clear:function(){this._data=null;this._id=null;this._position=null;this._links=[];this.dispatchEvent(new av("onclear"))}});function k(){A.call(this)}k.URLS=["http://pcsv0.map.bdimg.com/tile/","http://pcsv1.map.bdimg.com/tile/"];k.prototype=new A();k.prototype.getTilesUrl=function(aT,aS){var T=(aT.x+aT.y)%k.URLS.length;var aR="pl";return k.URLS[T]+"?udt=v&qt=tile&styles="+aR+"&x="+aT.x+"&y="+aT.y+"&z="+aS};function E(T,aR){window.BMap[T]=aR}E("Map",x);E("Hotspot",J);E("MapType",aK);E("Point",f);E("Pixel",aM);E("Size",U);E("Bounds",s);E("TileLayer",A);E("TrafficLayer",aH);E("Overlay",L);E("Marker",D);E("Icon",r);E("Polyline",ah);E("Control",M);E("ScaleControl",O);E("StreetView",z);E("StreetViewCoverageLayer",k);})();module.exports=BMap;});

;/**
 * 自定义覆盖物实现Marker
 * @fileoverview 自定义覆盖物实现Marker
 * @author jiazheng
 */
define("common:static/js/map/custommarker.js", function(require, exports, module){
    var BMap = require('common:static/js/map/api.js');

    /**
     * 构造函数
     * @param {Icon} 标注使用的图标
     * @param {Point} 标注使用的坐标
     * @param {Object} 可选配置参数
     */
    function CustomMarker(icon, point, opts) {
        this._point = point;
        this._icon = icon;
        this._div = null;
        this._container = null;
        this.drawCount = 0;
        this.draggable = false;
        this._config = {
            click: null,
            isAnimation: false
        }
        this.setConfig(opts);
    }
    CustomMarker.prototype = new BMap.Overlay();
    CustomMarker.prototype.setConfig = function (opts) {
        opts = opts || {};
        for (var p in opts) {
            this._config[p] = opts[p];
        }
    }
    CustomMarker.prototype.initialize = function (map) {
        var me = this;
        me._map = map;
        me._div = me.getDiv();
        var container = me._container = $(me._div);
        container.on("touchend", function (e) {
            if (me._config["notstop"] != undefined) {
                return;
            }
            // // console.log('stop touchend');
            // 这是在判断什么？？？
            if (!window.dtCon0 || !dtCon0.isOn) {
                if (typeof me._config.click == "function") {
                    // console.log('click');
                    me._config.click();
                }
            }
            e.stopPropagation();
        });
        container.on("touchstart", function (e) {
            e.stopPropagation();
            e.preventDefault();
            
            me._ontouch(e);
            
            if(me.draggable){
                var handler = function(ev){
                    me._map.disableDragging();
                    me._ontouch(ev);
                }
                container.on("touchmove", handler);
                container.on("touchend", function (e) {
                    me._map.enableDragging();
                    me._ontouch(e);
                    container.off('touchmove', handler);
                });
            }
        });
        container.on("click", function (e) {
            e.stopPropagation();
        });
        
        
        map.getPanes().labelPane.appendChild(this._div);
        return me._div;
    }

    CustomMarker.prototype._ontouch = (function(){
        var _pos = {};
       
        var getPos = function(ev){  
            var pos = [],
                src = null;
            
            for(var t=0, len=ev.touches.length; t<len; t++) {
                src = ev.touches[t];
                pos.push({ x: src.pageX, y: src.pageY });
            }
            return pos;
        };
        
        var divPixes = {};
        var px = {};
        var point;
        var interVal = null;
        var arrList = [];
        return function(ev){
            if(!this.draggable)return false;
            
            var me = this;
            ev.preventDefault();
            ev.stopPropagation();
            switch(ev.type){
                case 'touchstart': 
                    _pos.start = getPos(ev);
                    divPixes = me._map.pointToOverlayPixel(me._point);
                    me.dispatchEvent('dragstart');
                    break;
                case 'touchmove':
                    _pos.move = getPos(ev);
                    
                    var diffx = _pos.move[0].x - _pos.start[0].x;
                    var diffy = _pos.move[0].y - _pos.start[0].y;
                    
                    
                    px.x =  divPixes.x + diffx;
                    px.y =  divPixes.y + diffy;
                    
                    arrList.push(px);
                    
                    if(!interVal){
                        interVal = setInterval(function(){
                            var dpx = arrList.shift();
                            if(!dpx){
                                clearInterval(interVal);
                                interVal = null;
                                return;
                            }
                            point = me._map.overlayPixelToPoint({x: dpx.x, y: dpx.y});
                            me.setPoint(point);
                            me.dispatchEvent('draging');
                        }, 25);
                    }
                    break;
                case 'touchend' :
                    function te(){
                        if(interVal){
                            setTimeout(te, 30);
                            return;
                        }
                        me._map.centerAndZoom(me._point, me._map.getZoom());
                        me.dispatchEvent('dragend');
                    }
                    te();
                    break;
            }
        }
    })();

    CustomMarker.prototype.draw = function () {
        var me = this;
        /*if (me._config.isAnimation) {
            if (me.drawCount == 0) {
                var map = me._map;
                var sz = me._icon.anchor;
                var pixel = map.pointToOverlayPixel(me._point);
                me._div.style.left = pixel.x - sz.width / 2 + "px";
                var he = me._map.offsetY < 0 ? 0 : me._map.offsetY;
                me._div.style.top = 0 - he - sz.height + "px";
                setTimeout(function () {
                    me._div.style.webkitTransform = "translate3d(0, " + parseInt(pixel.y + he, 10) + "px, 0)";
                    me._div.style.top = pixel.y - sz.height + "px";
                    me._div.style.webkitTransform = "translate3d(0,0,0)";
                }, 100);
            } else {
                me._draw();
            }
            me.drawCount++;
        } else {*/
        me._draw();
        //}
    }
    CustomMarker.prototype._draw = function () {
        var me = this;
        var map = me._map;
        var anchor = me._icon.anchor;
        var pixel = map.pointToOverlayPixel(me._point);
        var style = me._div.style;
        style.left = pixel.x - anchor.width + "px";
        style.top = pixel.y - anchor.height + "px";
        // todo: 统一使用获取ua的方法
        if (navigator.userAgent.indexOf('iPhone OS 5_') > -1) {
            style.WebkitBackfaceVisibility = 'hidden';
        }
        if (me._config && me._config["className"] && me._config["className"] != "") {
            me._container.addClass(me._config["className"]);
        }
    }

    // 更换ICON图片
    CustomMarker.prototype.setIcon = function (icon) {
        var ic = this._icon = icon;
        $.extend(this._div.style, {
            position: "absolute",
            height: ic.size.height + "px",
            width: ic.size.width + "px",
            backgroundImage: "url(" + ic.imageUrl + ")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: (0 - ic.imageOffset.width) + "px " + (0 - ic.imageOffset.height) + "px"
        });
        this.draw();
    }
    /**
     * 设置元素类名
     */
    CustomMarker.prototype.setClassName = function(className){
        this._container.removeClass(this._config["className"]);
        this._config["className"] = className;
        this._container.addClass(this._config["className"]);
    }
    // 利用icon生成div
    CustomMarker.prototype.getDiv = function () {
        var ic = this._icon;
        var div = document.createElement("div");
        $.extend(div.style, {
            position: "absolute",
            height: ic.size.height + "px",
            width: ic.size.width + "px",
            backgroundImage: "url(" + ic.imageUrl + ")",
            backgroundRepeat: "no-repeat",
            zIndex: "200",
            backgroundPosition: (0 - ic.imageOffset.width) + "px " + (0 - ic.imageOffset.height) + "px"
        });
        if (this._config.isAnimation) {
            div.className = "mkr_trans";
        }
        return div;
    }
    /**
     * 获取覆盖物dom容器
     * @return {HTMLElement} 容器
     */
    CustomMarker.prototype.getContainer = function(){
        return this._div;
    }
    /**
     * 设置Marker的坐标
     * @param {Point} 坐标
     */
    CustomMarker.prototype.setPoint = function (point) {
        this._point = point;
        this.draw();
    }

    /**
     * 设置Marker是否可拖拽
     * @param enabled {boolean} 
     */
    CustomMarker.prototype.setDraggingEnabled = function (enabled) {
        this.draggable = !!enabled;
    }

    /**
     * 修改Marker的zIndex
     * @param {number} 标注的zIndex
     */
    CustomMarker.prototype.setZIndex = function (zIndex) {
        this._div.style.zIndex = zIndex;
    }

    module.exports = CustomMarker;
});


;define('common:widget/broadcaster/broadcaster.js', function(require, exports, module){

/**
 * @file 广播收发器，实现模块间的无耦合通信，本文件不依赖任何库文件
 * @author liushuai02@baidu.com
 */
'use strict';

// 判断参数是否是函数，为使本文件不依赖其它库文件而设计
function isFunction(fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
}

/**
 * 广播名称->订阅者 映射表
 * @private
 * @type {object}
 */
var sMap = {};
/**
 * @module common:widget/broadcaster/broadcaster
 */
module.exports = {
    // 调试时使用
    __subscriberMap__: sMap,
    /**
     * 订阅广播
     * @param {string} name 广播的名称
     * @param {function} handler 收听到广播的处理函数，函数的参数分别为data - 广播数据，options - 广播配置
     * @param {object} [context] 要退订的广播处理函数的执行对象(函数中执行时this所指的对象)
     * @example
     * // 某widget模块js文件代码
     * var broadcaster = require('common:widget/broadcaster/broadcaster.js');
     *
     * // 订阅广播SOME_BROADCAST，当有任意模块(*包括本模块*)发布广播时，都会触发此处传入的handler
     * broadcaster.subscribe('SOME_BROADCAST', function(data, options) {
     *     // Bla, bla
     * }, context);
     */
    subscribe: function (name, handler, context) {
        var subscribers = (sMap[name] = sMap[name] || []),
            i, len, s;

        for (i = 0, len = subscribers.length; i < len; i++) {
            s = subscribers[i];
            if (s.handler === handler && s.context === context) {
                return false;
            }
        }
        if (isFunction(handler)) {
            subscribers.push({handler: handler, context: context });
        }
    },
    /**
     * 退订广播
     * @param {string} name 广播名称
     * @param {function} handler 要退订的广播处理函数
     * @param {object} [context] 要退订的广播处理函数的执行对象(函数中执行时this所指的对象)
     */
    unsubscribe: function (name, handler, context) {
        var subscribers = sMap[name] || [], s;
        for (var i = 0, len = subscribers.length; i < len; i++) {
            s = subscribers[i];
            if (s.handler === handler && s.context === context) {
                subscribers.splice(i, 1);
                if(subscribers.length === 0) {
                    delete sMap[name];
                }
            }
        }
    },
    /**
     * 发出广播
     * @param {string} name 广播名称
     * @param {object} [data] 广播数据
     * @param {object} [options] 广播参数，用以使收听者根据不同参数做不同处理
     */
    broadcast: function (name, data, options) {
        var subscribers = sMap[name] || [],
            i, len, s;

        for (i = 0, len = subscribers.length; i < len; i++) {
            s = subscribers[i];

            if (isFunction(s.handler)) {
                s.handler.call(s.context, data, options);
            }
        }
    }
};




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
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
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
            broadcaster.broadcast('geomethod.fail',{
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
            broadcaster.broadcast('geomethod.fail',{});
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
        broadcaster.broadcast('geomethod.fail',data);
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
                        broadcaster.broadcast('geomethod.fail',{
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
                    broadcaster.broadcast('geomethod.success',data);
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

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    metricStat = require('common:widget/stat/metrics-stat.js'),
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
				broadcaster.broadcast('geomethod.fail',{});
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
			broadcaster.broadcast('geomethod.fail',{});
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
			'url': locSdkUrl,
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
							broadcaster.broadcast('geomethod.fail',{});
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
					broadcaster.broadcast('geomethod.success',location);
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
;define('common:widget/geolocation/sharegeolocation.js', function(require, exports, module){

/**
* @fileOverview 共享定位
* @author nichenjian
*/
'use strict';

var	myPosition  = require('common:widget/geolocation/myposition.js'),
	broadcaster = require('common:widget/broadcaster/broadcaster.js'),
	storage     = require('common:static/js/localstorage.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');

var CookieGeo = {
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

                storage.addData(shareLoc);
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
        broadcaster.broadcast('geomethod.success', data);
    },
    /** 定位失败的回调 **/
	_geoFailHandler: function(){
		if(this._MINUTES <= 5){
			broadcaster.broadcast('geomethod.fail',{});
			return;
		}
		if(this._MINUTES >= 30){
			broadcaster.broadcast('geomethod.fail', this._data);
			return;
		}
	}
};

/**
 * @module common:widget/geolocation/sharegeolocation
 */
module.exports = CookieGeo;


});
;define('common:widget/geolocation/preciseipgeolocation.js', function(require, exports, module){

/**
* @fileOverview 精确IP定位
* @author chengbo
*/
'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js');

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
			broadcaster.broadcast('geomethod.fail',{});
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
			broadcaster.broadcast('geomethod.fail',{});
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
		broadcaster.broadcast('geomethod.success',location);
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
var	broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    metricStat  = require('common:widget/stat/metrics-stat.js');

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
			broadcaster.broadcast('geomethod.fail',{});
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
			broadCaster.broadcast('geomethod.fail',{});
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
						broadcaster.broadcast('geomethod.fail',{});
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
					broadcaster.broadcast('geomethod.success',location);				
				},
				error: function(){
					broadcaster.broadcast('geomethod.fail',{});
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
        if (newHash == curHash) {
            return;
        }
        newUrl = this.host + newHash;
        // 如果配置了replace，则替换当前的历史记录
        if(_options.replace === true){
            try{
                window.localStorage.setItem(storageKey,curHash);
            }catch(e){}
            window.location.replace(newUrl);
        } else {
            window.location.href = newUrl;
        }
    },

    /**
     * 获取当前路由信息
     * @return {Object} {module:string, action:string, query:Object, pageState:Object}
     */
    get : function() {
        var pathname = window.location.pathname.slice(1);
        var pathArrs = pathname.split('/');
        var product = pathArrs[0];
        var style = pathArrs[1];
        var module = pathArrs[2];
        var action = pathArrs[3];
        var query = pathArrs[4];
        var pageState = pathArrs[5] || "";
        /*
        **  pagestate android 默认浏览器自动解码 hack case
        */

        //请针对自己的业务在android默认平台下编码
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
        }
        //判断是否有和url重合的字段 如果有没被编码过的话
        if(!(/%3d|%26/ig.test(pageState)) && pageState.indexOf("=") > -1 ){
            var paramProcess = {
                DictionaryName : "seachbox",
                DictionaryData : ""
            }
            /*
            **路线搜索业务逻辑单独处理
            **从定位跳过来单独处理
            */
            var placeFlag = !(/^(from=place&start=word%3d|from=place&end=word%3d)/ig.test(pageState)),
                locationFlag = !(/^(start=word%3d|end=word%3d)/ig.test(pageState));
            if (placeFlag || locationFlag) { 
                if(pageState.indexOf("start")!=-1){
                    var parseFlag = /^start=word=/ig.test(pageState);
                    !parseFlag && placeFlag && (paramProcess.DictionaryData = ['start','place']);
                    parseFlag && locationFlag &&(paramProcess.DictionaryData = ['start','loc']);
                }else if(pageState.indexOf("end")!=-1){
                    var EndparseFlag = /^end=word=/ig.test(pageState);
                    !EndparseFlag && placeFlag &&(paramProcess.DictionaryData = ['end','place']);
                    EndparseFlag && locationFlag &&(paramProcess.DictionaryData = ['end','loc']);
                }
                checkPageStateDictionary[paramProcess.DictionaryName](paramProcess.DictionaryData);
            };

            // 这绝对是个大坑，万不得已为之，ios 5.x下，url的path部分会被自动解码，有bug
            if(pageState.indexOf("refer_query") > -1 && pageState.indexOf("refer_pagestate") > -1) {
                pageState = "refer_query=" 
                            + encodeURIComponent(pageState.match(/refer_query=(.*?)($|&refer_pagestate)/)[1])
                            + "&refer_pagestate=" 
                            + encodeURIComponent(pageState.match(/refer_pagestate=(.*?)($|&list_type)/)[1]);
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
     * 获取新的Url对象
     * @param {object} newHash {module:string, action:string, query:Object, pageState:Object}
     * @param {object} options
     * @private
     */
    _get : function(newHash, options) {

        var curHash = window.location.pathname.slice(1),
            hashArrs = curHash.split('/'),
            product = hashArrs[0],
            style = hashArrs[1],
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
    broadcaster  = require('common:widget/broadcaster/broadcaster.js'),
    metricStat   = require('common:widget/stat/metrics-stat.js'),
    util         = require('common:static/js/util.js'),
    storage      = require('common:static/js/localstorage.js'),
    url          = require('common:widget/url/url.js');

var Geolocation = {
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
        broadcaster.subscribe('html5Geolocation.start', function (data) {
            html5Geo.init(data);
        });

        //native定位初始化事件
        broadcaster.subscribe('nativeGeolocation.start', function (data) {
            nativeGeo.init(data);
        });

        //共享位置time时间内定位初始化事件
        broadcaster.subscribe('shareGeo.start', function (data) {
            // 共享定位异步化，解决落地页图区挪图bug
            setTimeout(function () {
                shareGeo.init(data);
            }, 0);
        });

        //精确ip定位开始定位初始化事件
        broadcaster.subscribe('preciseipGeo.start', function (data) {
            setTimeout(function () {
                preciseipGeo.init(data);
            }, 0);
        });

        //url定位
        broadcaster.subscribe('urlgeolocation.start', function (data) {
            setTimeout(function () {
                urlGeo.init(data);
            }, 0);
        });

        //定位成功事件
        broadcaster.subscribe('geolocation.success', function (loc) {
            me._geoSuccess(loc);
        });

        //定位失败事件
        broadcaster.subscribe('geolocation.fail', function (msg) {
            me._geoFail(msg);
        });

        //单个定位方法失败回调
        broadcaster.subscribe('geomethod.fail', function (data) {
            me._geoMethodFail(data);
        });

        //单个定位方法成功回调
        broadcaster.subscribe('geomethod.success', function (data) {
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
                this._startGeo();
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
                broadcaster.broadcast('geolocation.success', locator._location);             
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
                broadcaster.broadcast('geolocation.mylocsuc', locator._mylocation);   
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
        locator.setAddress(data, this.isInitGeo);
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
        var native1   = {geostr: 'nativeGeolocation.start', param: {id: 'first'}},
            native2   = {geostr: 'nativeGeolocation.start', param: {id: 'second'}},
            share_5   = {geostr: 'shareGeo.start', param: {par: 5, id: '5min'}},
            share_30  = {geostr: 'shareGeo.start', param: {par: 30, id: '30min'}},
            preciseip = {geostr: 'preciseipGeo.start', param: {}},
            html51    = {geostr: 'html5Geolocation.start', param: {id: 'first', par: 30000}},
            html52    = {geostr: 'html5Geolocation.start', param: {id: 'second', par: 30000}},
            url       = {geostr: 'urlgeolocation.start', param: {}};

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
            this._GEO_METHOD_INDEX++;
            broadcaster.broadcast(tmpgeoobj.geostr, tmpgeoobj.param);
        }
        else {
            broadcaster.broadcast('geolocation.fail', data);
        }
    }
};

/**
 * @module common:widget/geolocation/geolocation
 */
module.exports = Geolocation;


});
;define('common:widget/geolocation/location.js', function(require, exports, module){

/**
 * @file 地理信息api
 * @author nichenjian@baidu.com
 */
 'use strict';

var broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    cookie = require('common:widget/cookie/cookie.js'),
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
            broadcaster.subscribe('geolocation.success', function (data) {
                initWithLoc();
            });
            broadcaster.subscribe('geolocation.fail', function (data) {
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
                try {
                    storage.setItem('webapp-loc', JSON.stringify(me._location));
                } catch (e) {
                }
            }

            if (me._mylocation) {
                try {
                    storage.setItem('webapp-myloc', JSON.stringify(me._mylocation));
                } catch (e) {
                }
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
            broadcaster.broadcast('geolocation.mylocsuc', _location);
        }
        
        //将定位数据存储在localStorage中
        if(_location.isSaveInStorage){   
            me._saveLocInStorage();  
        }

        //非ip定位触发定位成功事件
        if(type !== 'ip'){  
            broadcaster.broadcast('geolocation.success', me._location);
        }
    }
};

});
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


;/**
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
;define('common:widget/appresize/appresize.js', function(require, exports, module){

/**
 * @fileoverview 屏幕尺寸变化处理
 * @author lbs-web@baidu.com
 * @require jican@baidu.com
 */
'use strict';
var util = require('common:static/js/util.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),

    appresize = {

        init: function () {
            this.update();
            this.bind();
        },

        bind: function () {
            broadcaster.subscribe('sizechange', this.update, this);
            if (typeof window.onorientationchange !== 'undefined') {
                window.addEventListener('orientationchange', this.resize, false);
            } else {
                window.addEventListener('resize', this.resize, false);
            }
            if (util.isAndroid()) {
                window.addEventListener('resize', this.resize, false);
            }
        },

        update: function () {
            var winHeight = window.innerHeight,
                headerHeight = $('.common-widget-header').height(),
                footerHeight = $('.common-widget-footer').height(),
                bottomBannerHeight = $('.common-widget-bottom-banner').height(),
                minHeight = winHeight - (headerHeight + footerHeight + bottomBannerHeight);
            $('#main').css({
                'min-height': minHeight
            });
        },

        resize: function (evt) {
            /* mod by zhijia
            *bug ios在输入法弹起的情况下，横竖屏会黑屏。
            *fix orientationchange单独处理。*/
            function _reset(){
                broadcaster.broadcast('sizechange', {
                    width: evt.target.innerWidth,
                    height: evt.target.innerHeight,
                    delay: true
                });
            }
            var etype = evt.type;
            var fnDictionaries = {  //事件字典 方便扩展
                    "onorientationchange":function(){
                        setTimeout(function(){
                            _reset();
                        },1000);
                    },
                    "resize":function(){
                        _reset();
                    }
                };
            etype && fnDictionaries[etype]();
        }
    };

appresize.init();

});
;define('common:widget/backtop/backtop.js', function(require, exports, module){

'use strict';

var $el = $('.common-widget-back-top'),
    $window = $(window);

$window.on('scroll', function() {
    if(window.scrollY < window.innerHeight/2) {
        $el.hide();
    } else {
        $el.show();
    }
});

$el.on('click', function() {
    window.scrollTo(0, 0);
});

});
;define('common:widget/bottombanner/bottombanner.js', function(require, exports, module){

'use strict';

var util = require('common:static/js/util.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    appHash = window._APP_HASH,

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
            var curHashStr = window.location.pathname.replace('/mobile/webapp/', ''),
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
        getPageConfig: function () {
            var cmsConfig = window.webapp_cms_bottom_download_img,
                opts = this.getCurrentHash(),
                module = opts.module,
                action = opts.action,
                query = opts.query,
                pageState = opts.pageState,
                config = {},
                cmsList, transiWds, driveWds;

            this.cmsDisplayRule = window.bottomBannerDisplayRule;

            if (!cmsConfig || !this.checkDisplayBanner(opts)) {
                return null;
            }

            //try 是保证该模块都没有配置的情况，如果该模块没有配置就置null
            try {
                cmsList = cmsConfig[module][action];
            } catch (e) {
                cmsList = null;
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

            config.bgUrl = this.hasInstalled ? cmsList.openUrl : cmsList.downloadImgUrl;
            config.needOpen = cmsList.needOpen == 'no' ? false : true;

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
            var me = this;
            var config = this.getPageConfig();
            me.needOpen = config.needOpen;

            if (config) {
                this.$el
                    .css('background-image', 'url(' + config.bgUrl + ')')
                    .attr('data-href', config.srcUrl)
                    .show();

                broadcaster.broadcast('sizechange');
            } else {
                this.$el.hide();
            }
        },
        init: function () {
            this.loadCmsAdConfig(function () {
                var me = this;
                this.$el = $('.common-widget-bottom-banner');
                this.$el.on('click', function() {
                    if(me.hasInstalled && me.needOpen) {
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
;define('common:widget/stat/stat.js', function(require, exports, module){

/**
 * @fileOverview 统计代码
 */

var cookie = require("common:widget/cookie/cookie.js"),
    util = require("common:static/js/util.js");

var STAT_PV = 20138;

var isFlowCtrl = function(){
    var flowCtrl = cookie.get("flow_ctrl") || false;
    if(flowCtrl === false){
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
var addCookieStat = function(code, opts, callback){
    var options = {expires: 10000, path: '/'},//设置cookie的超时时间是10秒钟
        cookie = require('common:widget/cookie/cookie.js'),
        callback = callback || function(){},
        opts = opts || {};

    if(!code){
        return;
    }

    opts = $.extend({
        'module': window._APP_HASH.module,
        'action': window._APP_HASH.action,
        'page'  : window._APP_HASH.page,
        'code'  : code 
    }, opts);

    
    //设置code的cookie值
    cookie.set('H_MAP_CLK', JSON.stringify(opts), options);

    callback();
};
var _addCookieStat = function(log){
    if(typeof log === 'object' && log.code){
        addCookieStat(log.code, log);
        return;
    }

    if(typeof log === 'string'){
        try{
            var info = log.replace(/[{}"']/g,'').split(',');
            var result = {};
            for(var i = 0; i < info.length; i++){
                var item = info[i].split(':');
                result[$.trim(item[0])] = $.trim(item[1]);
            }
            addCookieStat(result.code, result);
        }catch(e){}
    }else{
        return;
    }
};
/**
* 点击统计的初始化
* 通过监听页面中的body点击事件
*/
var initClickStat = function(){
    $('body').on('click', function(e){
        var target = e.target;
        if(target.nodeName === 'A'){
            var log = $(target).data('log');
            if(log != null){
                _addCookieStat(log);
            }
        }
    })
}
// 获取统计url
var getStatUrl = (function () {
    var statPath = "/mobile/img/t.gif?newmap=1";

    if(/(&|\?)(kehuduan=1|nostat=1)(&|$|#)/.test(location.href)){
        statPath = "/mobile/img/nostat.gif?newmap=1";
    }

    return function () {
        return statPath;
    }

})();
/**
 * 发送统计方法
 * @param {Number} code 统计code
 * @param {Object} opts
 */
var addStat = function(code, opts, callback) {
    var callback = callback || function(){};

    if(!code) {
        return;
    }

    // 组装参数
    opts = opts || {};

    if(isFlowCtrl) {
        opts.flow_ctrl = true;
    }

    opts.module = _APP_HASH.module;
    opts.action =_APP_HASH.action;
    opts.page = _APP_HASH.page;

    var extq = util.jsonToUrl(opts);

    // 内部函数定义 - 发送统计请求
    var sendStat = function(q) {
            var statPath = getStatUrl();
            if(!q) {
                return;
            }
            addStat._sending = true;
            setTimeout(function() {
                $("#statImg")[0].src = statPath + q.src
                $(document).trigger('addStat', q.code);
            }, 50);

            callback();
            
        }
        // 内部函数定义 - 发送队列中下一个统计请求
    var reqNext = function() {
            var nq = addStat._reqQueue.shift()
            if(nq) {
                sendStat(nq);
            }
        }
    var ts = Date.now();
    var geolocation = require("common:widget/geolocation/location.js");
    var _sendStat = {
            src: "&t=" + ts + "&code=" + code + "&c=" + geolocation.getCityCode() + "&" + extq,
            code : code
        };

    if(addStat._sending) {
        // 将本次请求加入队列
        addStat._reqQueue.push(_sendStat);

    } else {
        // 直接发送请求
        sendStat(_sendStat);
    }

    // 添加到报表里
    // addToReport(_sendStat);

    // 绑定事件
    if(!addStat._binded) {
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
    var code = STAT_PV,  //pv统计code
        refPageParam = {},
        locked = false,
        lockedTime = 200,
        staticSended = false,
        user_step = [];

    /**
     * 发送pv统计
     */
    var _sendpv = function(opts) {
            if(locked) {
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
                  pid : pid,
                  page_id : pageId
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
              ref_pid : pageIdParam.pid,
              ref_page_id : pageIdParam.page_id
            };
            // 落地页是首页静态页的时候，如果快速点路线，可能导致首页和路线页pv发送特别近
            // 记录状态，发送PV统计
            if(!window.checkLandingPage() || staticSended) {
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
    addStat : addStat,
    sendPvStat : sendPvStat,
    initClickStat : initClickStat,
    addCookieStat : addCookieStat
};

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
        if (this.isShowCover()) {
            this.adjustScreen();
            this.bind();
            this.initOpenDownload();
            this.showCover();
        }
    },

    /**
     * 检测是否要显示封面
     * @return {boolean} 如果需要显示返回true，否则返回false
     */
    isShowCover: function() {
        var hdCover = cookie.get('hdCover'),
            referRE = /(^$)/i,
            fromWiseTabRE = /itj=45/i,
            thirdRE = /third_party/i,
            refer = document.referrer,
            url = location.href;
        return !(hdCover == 1) // 未设置名为hdCover的cookie
        && (referRE.test(refer) // 来源为空（直接来源）
            || fromWiseTabRE.test(url)) // 来源于大搜索
        && !(thirdRE.test(url)) // 非第三方导流
        && (this.netype == 1);  //wifi网络下
    },

    /**
     * 事件绑定
     */
    bind: function() {
        //debugger;
        $('#to-webapp').on('click', $.proxy(this.closeCover, this));
        $('#cover-close').on('click', $.proxy(this.closeCover, this));

        if (this.getDevice() == 'ipad') {

            $('#cover-container').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            $('#body-cover').on('click', $.proxy(this.closeCover, this));
        }
    },

    /**
     * 显示封面
     */
    showCover: function() {
        var me = this;
        stat.addStat(COM_STAT_CODE.COVER_DISPLAY, {'os': me.os}); 
        $('#body-cover').css({
            display: 'block'
        });
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
    },

    /**
     * 获取设备类型
     * @return {String} 根据平台返回iphone、ipad、android或者unknow
     */
    getDevice: function() {

        var platform = 'unknow',
            ua = navigator.userAgent;

        if (ua.match(/Android/i)) {

            platform = 'android';

        } else if (ua.match(/iPhone/)) {

            platform = 'iphone';

        } else if (ua.match(/iPad/)) {

            platform = 'ipad';

        } else {

            platform = 'unknow';

        }

        return platform;

    },

    /**
     * 大屏幕手机适配
     */
    adjustScreen: function() {

        var offset = document.documentElement.clientHeight - 423;

        offset = (offset > 0) ? (offset / 2) : 0;

        $('#cover-container').css({
            top: offset + 'px'
        });

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
            return typeof obj == 'object' ? obj: dateRE.test(obj)? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10)-1, parseInt(RegExp.$3, 10)):null;
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
            gap:true//是否显示间隙，星期列表与天数列表之间
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
            event = typeof event == 'string' ? $.Event(event) : event;
            var _data = this._data, onEvent = _data[event.type],result;
            if( onEvent && typeof onEvent == 'function' ){
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
                    unselectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
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
                    case 'gap':
                        data[key] = val;
                        break;
                }
                data._invalid = true;
                return this;
            }
            return key == 'selectedDate' ? new Date(data._selectedYear, data._selectedMonth, data._selectedDay) : data[key];
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

        /**
         * @name goTo
         * @grammar goTo(month, year) ⇒ instance
         * @grammar goTo(str) ⇒ instance
         * @desc 使组件显示某月，当第一参数为str可以+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         */
        goTo:function (month, year) {
            var data = this._data, offset, period, tmpDate, minDate = this.minDate(), maxDate = this.maxDate();
            if (typeof month == 'string' && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = data._drawMonth + (period == 'm' ? offset : 0);
                year = data._drawYear + (period == 'y' ? offset : 0);
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
            if(typeof options =='string' && options in _instance){
                ret = _instance[options].apply(_instance, args);
                if(ret!==_instance && ret!==undefined){
                    return false;
                }
                ret = undefined;
            }else if(options=='this'){
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
var iscroll = require('common:static/js/iscroll.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js');
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
        this._dateBox.on('touchstart', hdr);
        this._bg.on('touchstart', hdr);
        this._bg.on('click', $.proxy(this.hide, this));
        broadcaster.subscribe('sizechange', this._onglobalSizeChange, this);
        //app.eventCenter.on('sizechange', $.proxy(this._onglobalSizeChange, this));
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
                    callback({
                        status: true,
                        username: data.displayname
                    });
                    return true;
                } else {
                    callback({
                        status: false,
                        username: ""
                    });
                }
            },
            'error': function(xhr, errorType, error) {
                callback({
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
        location.href = '/mobile/webapp/user/mycenter/force=simple';
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

var InitGeo = {
	init: function(){
		this._resetCurrentCity();
		this._initGeo();	
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
	* 初始化定位
	*/
	_initGeo: function(){
	    try{
            if(!this._hasStorageLoc()){
		    	this._initIpGeo();	
	    	}
	    }catch(e){
	    	//读取localStorage失败，初始化ip定位
	    	this._initIpGeo();
	    }
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
	    loc.setAddress(locationData);
	},
	/**
	* 切城处理，若当前返回的城市code和定位的citycode不一致，则切换城市信息
	*/
	_changeCity: function(){
		var city = window._CURRENT_CITY,
			pageState = url.get().pageState || {};

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
	}
}

InitGeo.init();


});
;define('common:widget/header/header.js', function(require, exports, module){

/**
 * @fileOverview 头部导航逻辑
 */

var stat = require('common:widget/stat/stat.js'),
    util = require("common:static/js/util.js"),
    broadcaster = require('common:widget/broadcaster/broadcaster.js');


var $header = $(".common-widget-header");
var $swipeTarget = $(".index-widget-searchbox");
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

    var $searchBox = $('.index-widget-searchbox');
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
                //统计待修正
                /*
                me.sendStats(STAT_CODE.STAT_APP_PRODUCTNAV_VIEW, {
                    type: "drag",
                    os: me.os
                });*/
            } else {
                $header.hide()
                //统计待修正
                /*
                me.sendStats(STAT_CODE.STAT_APP_PRODUCTNAV_VIEW, {
                    type: "drag",
                    os: me.os
                });*/
            }
            broadcaster.broadcast('sizechange');
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
;define('common:widget/monitor/monitor.js', function(require, exports, module){

/**
 * @fileOverview 性能统计监控
 * @author jican@baidu.com
 * @date 2013/08/02
 */


//性能监控参数
var _product_id     = 16,   // 产品线ID webapp为16
    _sample         = 1,    // 采样率，范围0-1。计算方法：100万/页面pv。
    _page_id        = 0,    // 监控页面ID
    _page_dict      = {     // 监控页面列表字典
        'index_index'           : 10,   //首页
        'place_list'            : 11,   //place列表
        'place_detail'          : 12,   //place详情
        'transit_list'          : 13,   //公交列表
        'transit_detail'        : 14,   //公交详情
        'drive_list'            : 15,   //驾车列表
        'walk_list'             : 16,   //步行列表
        'transit_crosslist'     : 17,   //跨城公交列表
        'transit_crossdetail'   : 18    //跨城公交详情
    }

//小流量控制的时候采样率为1
if(PDC.Cookie.get('MAPMOBILE_TYPE')=='simple') {
    _sample = 1;
    _page_dict = {
        'index_index'           : 50,   //首页
        'place_list'            : 51,   //place列表
        'place_detail'          : 52,   //place详情
        'transit_list'          : 53,   //公交列表
        'transit_detail'        : 54,   //公交详情
        'drive_list'            : 55,   //驾车列表
        'walk_list'             : 56,   //步行列表
        'transit_crosslist'     : 57,   //跨城公交列表
        'transit_crossdetail'   : 58    //跨城公交详情
    }
}

module.exports = {

    init : function () {
        this.jt();
        this.bind();
    },

    bind : function () {

        //读取当前页面信息
        var apphash = window._APP_HASH || {},
            module = apphash.module,
            action = apphash.action,
            page = apphash.page;

        //监听页面DomContentReady事件，给监控元素设置自定义属性
        /*
        $(document).ready(function(){
            $('.se-input-poi').val(Date.now() - window._drt);
            var el = $('#monitor');
            el && el.attr('user-data', JSON.stringify(apphash));
        });
        */

        //通过当前的module,action,page 确定一个监控页面的id
        if(module && action && page) {
            var key = (module+'_'+action).toLowerCase();
            _page_id = _page_dict[key];
        }
        
        //页面监控初始化
        PDC && PDC.init({
            sample      : _sample,
            product_id  : _product_id,
            page_id     : _page_id
        });
    },

    jt : function () {
        $(document).on('click', '[jsaction]', function(evt) {
            PDC && PDC._setWtCookie();
        });
    }
};

});
;define('common:widget/nav/nav.js', function(require, exports, module){

/**
 * @file 返回条导航逻辑
 */

var appHistory = require("common:widget/apphistory/apphistory.js");

var indexPath = "http://" + location.host + "/mobile/webapp/index/index";
// 是否返回到上一个replace的url上
var isBackReplaceAble = false;
/**
 * 绑定返回按钮事件
 * @return {void} 
 */
var bind = function  () {
	var backBtn = $(".common-widget-nav .back-btn");
	backBtn.on("click", function(){
		back();
	});
}


var redirectToindex = function () {
	window.location.href = indexPath;
};

var storageKey = "_lastPageUrl";

var _historyBack = function () {
    var _lastPageUrl = window.localStorage.getItem(storageKey);
	// 如果是上一页保存了上一页信息的，从localStorage取
	// 采用replace方法，会进这个逻辑
    if(typeof _lastPageUrl === "string") {
        window.localStorage.removeItem(storageKey);
        window.location.replace(_lastPageUrl);
    } else {
        history.back();
    }
}


var back = function () {

	if(appHistory.isAppNavigator()) {
		if ( isBackReplaceAble === true ) {
			_historyBack();
		} else {
		    window.localStorage.removeItem(storageKey);
			history.back();
		}
	} else {
	    window.localStorage.removeItem(storageKey);
		redirectToindex();
	}
}

var init = function (isReplace) {
	isBackReplaceAble = !!isReplace;
	bind();
}

module.exports.init = init;

});
;define('common:widget/popup/popup.js', function(require, exports, module){

/**
 * @fileOverview 弹出浮层
 * @author liushuai02@baidu.com
 * @requires common:static/js/zepto
 */
var broadcaster = require('common:widget/broadcaster/broadcaster.js');
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
            this._$el.on('touchend', function(e) {
                e.stopPropagation();
                $("#bmap_pop_cover").hide();
                self.close();
                this._boxTouchHandle = arguments.callee;
                this._$el.off("touchend", arguments.callee);
            });
            $(document.body).on('touchend', function(e) {
                e.stopPropagation();
                $("#bmap_pop_cover").hide();
                self.close();
                this._docTouchHandle = arguments.callee;
                $(document.body).off("touchend", arguments.callee);
            });
        }else {
            if(this._boxTouchHandle) {
                this._$el.off('touchend', this._boxTouchHandle);
            }
            if(this._docTouchHandle) {
                $(document.body).off('touchend', this._docTouchHandle);
            }
        }
        broadcaster.subscribe('sizechange', function() {
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
;define('common:widget/quickdelete/quickdelete.js', function(require, exports, module){

require("common:static/js/widget.js");

/**
 * @fileOverview
 * @description 快速删除组件
 */

/**
 * @description   快速删除组件
 * @class
 * @name     $.ui.quickdelete
 * @grammar  $.ui.quickdelete(el[,options])
 * @mode     支持auto-init
 * @param      {Object}         options                   参数
 * @param      {Selector}       options.container         (必选)父容器
 * @param      {Function}       options.ondelete          (可选)点击close按钮时触发
 * @param      {Number}         options.size              (可选)close按钮的大小: 20
 * @param      {Object}         options.offset            (可选)close按钮偏移量{x:0, y:0}
 */
$.ui.create('quickdelete', {
    _data: {
        size: 20,
        offset: {x: 0, y: 0}
    },
    _create: function() {
        var me = this,
            $input = me.data('input', $(me.data('container'))),
            expando = +new Date(),
            elemID = "ui-quickdelete-delete-" + expando,
            // maskID = 'ui-input-mask-' + expando,
            // $maskElem = $input.parent(),
            $deleteElem = $('<div id="' + elemID + '" class="ui-quickdelete-button"></div>').css({
                height: me.data('size'),
                width: me.data('size')
            });

            //在android2.1下-webkit-background-size不支持contain属性，
            $.os.android && $.os.android && parseFloat($.os.version).toFixed(1) == 2.1 && $deleteElem.css('-webkit-background-size', '20px 20px');
            // if ($maskElem.attr('class') != 'ui-input-mask') {
                // $maskElem = $('<div id="' + maskID + '" class="ui-input-mask"></div>').appendTo($input.parent());
            // }
            // me.widget($maskElem.append($input).append(me.data('deleteElem', $deleteElem)).css('height', $input.height()));

            $input.before(me.data('deleteElem', $deleteElem));
            me.widget($deleteElem);
            /***
             * 这里由于涉及到首页静态化，原处理方式是在$input上层增加一个包装DOM，用于定义widget;
             * 因此，存在DOM删除和插入的动作，触发input的blur状态;
             * 现在改成直接在$input同级新增button元素，将其绑定为widget对象;
            ***/
            me._initButtonOffset().trigger('create');
        },

        _init: function() {
            var me = this,
                $input = me.data('input'),
                // $maskElem = $input.parent(),
                eventHandler = $.bind(me._eventHandler, me);

            $input.on('focus input blur', eventHandler);
            me.data('deleteElem').on('touchstart', eventHandler);
            me.on('destroy', function() {
                $input.off('focus input blur', eventHandler);
                me.data('deleteElem').off('touchstart', eventHandler);
                eventHandler = $.fn.emptyFn;
                // 自定义DOM销毁方式
                // $maskElem.parent().append($input);
                // $maskElem.remove();
                $input.siblings('.ui-quickdelete-button').remove();
            });
            me.trigger('init');
        },

        _show: function() {
            this.data('deleteElem').css('visibility', 'visible');
            return this;
        },

        _hide: function() {
            this.data('deleteElem').css('visibility', 'hidden');
            return this;
        },

        _eventHandler: function(e){
            e.stopPropagation();
            var me = this,
                type = e.type,
                target = e.target,
                $input = me.data('input');

            switch (type) {
                case 'focus':
                case 'input':
                    $.trim($input.val()) ? me._show() : me._hide();
                    break;
                case 'mousedown':
                case 'touchstart': // FIXME: UC存在选择过后再点删除无效的情况，线上bug
                    if (target == me.data('deleteElem').get(0)) {
                        e.preventDefault();
                        e.formDelete = true; // suggestion解决删除问题
                        $input.val('');
                        me._hide().trigger('delete');
                        $.later(function() {
                            $input.trigger("input"); // 解决suggestion无法触发focus事件
                            $input.get(0).focus();
                        }, 0);
                    }
                    break;
                case 'blur':
                    me._hide();
                    break;
            }

        },

    _initButtonOffset: function() {
        var me = this,
            $input = me.data('input'),
            size = me.data('size'),
            padding = me.data('padding'),
            targetOffset = me.widget().parent().offset(),
            customOffset = me.data('offset'),
            offsetX = customOffset.x || 0,
            offsetY = customOffset.y || 0,
            height = targetOffset.height == 0 ? me.widget().height() : targetOffset.height,
            paddingOffsetY = Math.round((height - 2 * offsetY - size) / 2);   //padding值根据外层容器的宽度-Y的偏移量-小叉的大小

        me.data('deleteElem').css({
            //padding: padding || paddingOffsetY < 0 ? 0 : paddingOffsetY,          //modified by zmm, 使quickdelete图标可点区域更大
            padding: '6px 10px',
            top: offsetY,
            right: offsetX
        });

        // 处理输入长字符串，input挡住删除按钮问题
        $input.css({
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'auto',
            right: size + 20
        });
        return me;
    }
});

$(document).on('pageInit', function() {
    // role: data-widget = quickdelete.
    $('[data-widget=quickdelete]').each(function(i, elem) {
        var $elem = $(elem),
            size = $elem.data("quickdelete-size"),
            offsetX = $elem.data('quickdelete-offsetx'),
            offsetY = $elem.data('quickdelete-offsety');

        var quickdelete = $.ui.quickdelete({
            container: elem,
            size: parseInt(size, 10) || undefined,
            offset: {
                x: parseInt(offsetX, 10) || undefined,
                y: parseInt(offsetY, 10) || undefined
            }
        });
    });
});

module.exports = Zepto;

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

    //手动记录搜索开始时间 by jican
    PDC && PDC._setWtCookie();

    url.update({
        module : 'search',
        action : 'search',
        query : param
    }, {
        queryReplace : true
    });
};

});
;define('common:widget/setcity/setcity.js', function(require, exports, module){

/**
 * @file 设置城市
 */

var cookie = require("common:widget/cookie/cookie.js");
var url = require("common:widget/url/url.js");
var util = require("common:static/js/util.js");
var indexPath = "http://" + location.host + "/mobile/webapp/index/index";
var subwayPath = "http://" + location.host + "/mobile/#subway/show/city=";

var cookieOptions = {
	path: "/mobile/",
	expires: 60 * 60 * 24
};

var BUSINESS_SPLIT = "     ";

var _cacheCity = {
	cityName: "",
	cityId: "",
};

var redirectToindex = function() {
	window.location.href = indexPath;
};

var _saveCity = function(cityName, cityId) {
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

var redirect = function() {
	var urlParam = url.get(),
		query = urlParam.query,
		pageState = urlParam.pageState,
		referQuery,
		opts;


	if (pageState.refer_query) {
		referQuery = util.urlToJSON(pageState.refer_query);
		referPageState = util.urlToJSON(pageState.refer_pagestate);
		//若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
		if (referQuery.wd && referQuery.wd.split(BUSINESS_SPLIT)[1]) {
			referQuery.wd = referQuery.wd.split(BUSINESS_SPLIT)[1];
		}

		//如果是外卖页的refer,则跳转到外卖，否则跳转到place页
		if (referQuery.qt === 'wm' || referPageState.search == "takeout") {
			opts = getWmOptions(referQuery, referPageState);
		} else {
			opts = getOptions(referQuery, referPageState);
		}
		redirectToRefer(opts);
	} else {
		redirectToindex();
	}

};

var getOptions = function(query) {

	var _query = query || {};

	_query.c = _cacheCity.cityId || _query.c;
	// 删除中心点信息
	delete _query.nb_x;
	delete _query.nb_y;
	opts = {
		'module': 'place',
		'action': 'list',
		'query': _query,
		'pageState': {
			'dist_name': _cacheCity.cityName
		}
	};

	return opts;
};

var getWmOptions = function(query, pageState) {
	var _query = query || {};
	var _pageState = pageState || {};
	_query.cityId = _cacheCity.cityId || _query.c;
	_query.c = _query.cityId;
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
		'citysearch': 1,
		'center_name': _cacheCity.cityName
	});

	opts = {
		'module': 'place',
		'action': 'takeout',
		'query': _query,
		'pageState': _pageState
	};

	return opts;
};

// var setCity = function () {
// 	if(state.refer_query){
// 		var query = util.urlToJSON(state.refer_query) || {};
// 		var pageState = util.urlToJSON(state.refer_pagestate) || {};

// 		//若关键词包含 商圈+'     '+关键字，将商圈去掉，保留关键字
// 		if(query.wd && query.wd.split(mapConst.BUSINESS_SPLIT)[1]){
// 			query.wd = query.wd.split(mapConst.BUSINESS_SPLIT)[1];
// 		}

// 		//如果是外卖页的refer,则跳转到外卖，否则跳转到place页
// 		if(query.qt === 'wm'){
// 			query.cityId = data.cur_area_id || query.c;
// 			query.c      = query.cityId;
// 			query.pageNum = 1;
// 			query.m = 'searchBrands';
// 			// 查找城市级别的外卖，删除中心点等其他信息
// 			delete query.nb_x;
// 			delete query.nb_y;
// 			delete query.pointX1;
// 			delete query.pointY1;
// 			delete query.radius;
// 			delete query.sortType;
// 			delete query.orderType;

// 			pageState = $.extend(pageState,{
// 					'citysearch' : 1,
// 					'center_name': data.cur_area_name
// 			});

// 			opts = {
// 				'module' : 'place',
// 				'action' : 'takeout',
// 				'query'  : query,
// 				'pageState': pageState
// 			};
// 		}else{
// 			query.c = data.cur_area_id || query.c;
// 			// 删除中心点信息
// 			delete query.nb_x;
// 			delete query.nb_y;
// 			opts = {
// 				'module': 'place',
// 				'action': 'list',
// 				'query' :  query,
// 				'pageState' : {
// 					'dist_name' : data.cur_area_name
// 				}
// 			};
// 		}

// 	}else{
// 		opts = {
// 			'module': 'index',
// 			'action': 'index'
// 		};
// 	}
// };

var redirectToRefer = function(opts) {

	// return;
	if (opts && opts.module && opts.action) {
		url.update(opts);
	} else {
		redirectToindex();
	}

};

var redirectToindex = function() {

	window.location.href = indexPath;
};

var redirectToSubway = function(city) {
	window.location.href = subwayPath + city;
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
    stat  = require('common:widget/stat/stat.js');

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
        //链接已经包含短信，直接触发短信
        if(value && value.indexOf('body') > -1){
            return;
        }
        if(this.type == 'transit'){
        	var url = me.getTransitSmsUrl();
        }else{
        	var url = me.getSmsUrl();
        }
        
        //成功回调
        var successCallback = function(data){
            if(!data || !data.sms_content){
                return;
            }

            var content = data.sms_content;
            $share.attr('href', 'sms:?body=' + content);
            //模拟触发用户click事件
            me.fireEvent($share[0],'click');
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
            stat.addCookieStat(COM_STAT_CODE.STAT_FROMDESTOP_OPEN);
        }
    }
}

});
;define('common:widget/streetview/streetview.js', function(require, exports, module){

/**
 * @fileoverview streetview 显示界面
 */
var util = require('common:static/js/util.js'),
    BMap = require('common:static/js/map/api.js'),
    broadcaster = require('common:widget/broadcaster/broadcaster.js'),
    Popup = require('common:widget/popup/popup.js'),
    CustomMarker = require('common:static/js/map/custommarker.js'),
    url  = require('common:widget/url/url.js'),
    Cookie = require('common:widget/cookie/cookie.js'),
    storage = require('common:static/js/localstorage.js');
    
var StreetViewControl = {
    Str: {
       DAY  : 'day',
       NIGHT: 'night',
       BANNER_ID: 'app-banner-for-stv',
       STREETVIEW_CONTAINER_ID: 'streetview-container',
       MAP_CONTAINER_ID: 'eagleeye-container',
       MAP_ID: 'eagleeye-map',
       NORESULT:'未找到街景数据'
    },
    
    os: util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown",
    
    init: function(opts) {
        var me = this;
        this.show();
        this._updated = false; // 表示街景是否通过变更id或者position而发生了更新，用来判断是否需要统计
        this.initStreetView();
        this.initMap();
        this.updateStreetView();
        this.bind();
        this.onSizeChange();
    },
    
    initStreetView: function(){
        var strView;
        this.streetView = strView = new BMap.StreetView(this.Str.STREETVIEW_CONTAINER_ID);
        strView.addEventListener('position_changed', $.proxy(this.onPositionChanged, this));
        strView.addEventListener('links_changed', $.proxy(this.onPositionChanged, this));
        strView.addEventListener('dataload', $.proxy(this.onStreetDataLoaded, this));
        // 用于性能监控 by jz
        strView.addEventListener('tilesloaded', $.proxy(this.onTilesLoaded, this));
    },
    
    onStreetDataLoaded: function(){
        //this.sendStats(STAT_CODE.STAT_STREETVIEW_VIEW);
    },
    
    initMap: function(){
        var me = this;
        // 初始化地图
        var mapOptions = {
            maxZoom: 14,
            minZoom: 14,
            drawMargin: 0,
            enableFulltimeSpotClick: false,
            vectorMapLevel: 99,
            drawer:BMAP_CANVAS_DRAWER
        };
        this.eyeMap = new BMap.Map(this.Str.MAP_ID, mapOptions);
        this.eyeMap.disableHighResolution();
        this.eyeMap.disableDoubleClickZoom();
        this.eyeMap.disablePinchToZoom();
        this.eyeMap.addTileLayer(new BMap.StreetViewCoverageLayer());
        this.eyeMap.addEventListener('click', $.proxy(this.onEyeMapClick, this));
    },
    
    onEyeMapClick: function(){
        $('#'+this.Str.MAP_CONTAINER_ID).toggleClass('exp');
        var point = this.streetView.getPosition();
        // 容器大小发生变化，由于后面重新设置了中心点，所以这里需要强制resize一下
        // 否则地图自动监听容器变化有延时
        this.eyeMap.checkResize();
        this.eyeMap.centerAndZoom(point, 15);
    },
    //check 屏幕横竖状态 true 竖屏， false横屏 todo:不准确
    checkEyeMapDirection: function(){
        var ww = window.innerWidth;
        var wh = window.innerHeight;
        return (ww < wh ? true : false);
    },
    
    toMax: function(){
        var $backNav = $('#back_nav');
        var $uninscrllWrapper = $('#uniscroll-wrapper');
        var bh = $backNav.height();
        
        //$backNav.addClass('hide');
        //$uninscrllWrapper.css({top: 0});
        
        $('#'+this.Str.MAP_CONTAINER_ID).css({
		   'visibility':'hidden',
		   'left': -1000
		});
        $("#street-holder").find('.addr').show();
        
        broadcaster.broadcast('sizechange');
    },
    
    recovery: function(){
        var opts = url.get(); 
       
        $('#'+this.Str.MAP_CONTAINER_ID).css({
           'visibility':'visible',
           'left': 5
        });
        // 容器变化需要重新设置中心点
        this.eyeMap.checkResize();
        this.eyeMap.centerAndZoom(this.streetView.getPosition(), this.eyeMap.getZoom());
        $("#street-holder").find('.addr').hide();
        broadcaster.broadcast('sizechange');
    },
    
    bind:function(){
        var me = this;
        this.streetView.addEventListener('click', $.proxy(this.onStreetViewClick, this));
        this.streetView.addEventListener('noresult', $.proxy(this.onNoResult, this));
        
        $('#eagleeye-container, #street-holder .mode').on('touchstart touchend', function(e){
            e.stopPropagation();
        });
        $("#street-holder").find('.mode').on('click', $.proxy(this.onToggleMode, this));
        broadcaster.subscribe('sizechange', $.proxy(this.onSizeChange, this));
    },
    
    onSizeChange: function(){
        var opts = url.get();
        var pageState = opts.pageState || {};
        if(!this.hasAlertDisabled() &&
            !this.checkEyeMapDirection() &&
            !util.isIPad()){
            //在小米1默认浏览器下,localStorage保存数据不立刻生效的问题。 
			if(this.alertDsabeld)return;

            Popup.open(
                {
                    text : '街景在横屏下体验较差，建议在竖屏下使用。',
                    autoCloseTime : 3000
                }
            );
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
            
            $('.common-widget-popup').on('touchstart', function(){
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
        setTimeout(function(){
            window.scrollTo(0,0);
        },100);
    },
    
    hasAlertDisabled: function(){
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
    
    onNoResult: function(){
        var opts = url.get();
        var pageState = opts.pageState || {};

        Popup.open( 
            {
                text          : this.Str.NORESULT,
                autoCloseTime : 1500
            }
        );
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
    
    onStreetViewClick: function(){
        this.maxStatus = !this.maxStatus;
        this.maxStatus ? this.toMax() : this.recovery();
        this.setDayAndNigthMode();
		//var curControl = app.getCurController();
		//var banner = curControl.views['streetbanner'];
		//banner && banner.hideBanner();
    },
    
    onToggleMode: function(){
         var mode = this.streetView.getMode();
         var rel = this.streetView.getRelevants();
         
         if(rel[0] && rel[0]['mode']){
            var data = rel[0]['mode'] ==='day' ? 'night' : 'day';
            if(data){
                $("#street-holder").find('.mode').show().
                    removeClass('night day').addClass(mode === 'day' ? 'night' : 'day');
            }
            this.streetView.setId(rel[0]['id']);
        }
    },
    
    update: function(){
        this.show();  
        this.updateStreetView();
    },
    
    hide: function(){
        $("#street-holder").css('visibility', 'hidden');  
        
        $('#'+this.Str.MAP_CONTAINER_ID).css('visibility','hidden');
        if (util.isIOS() && this.streetView) {
            // iOS6上发现svg与地图有冲突，导致无法拖拽，所以
            // 隐藏街景的时候也需要把svg元素隐藏
            this.streetView._linksContainer && (this.streetView._linksContainer.style.display = 'none');
        }
        $('#'+this.Str.BANNER_ID).hide();
        $('#iscroll-container').removeClass('hide');
    },
    show: function(){
        $('#'+this.Str.BANNER_ID).show();
        
        $("#street-holder").css('visibility', 'visible');
        if (util.isIOS() && this.streetView) {
            this.streetView._linksContainer && (this.streetView._linksContainer.style.display = '');
        }
        if(!this.maxStatus){
            $('#'+this.Str.MAP_CONTAINER_ID).css('visibility','visible');
        }
        if(util.isIPad()){
            $('#iscroll-container').addClass('hide');
        }
    },
    /*
     * 添加鹰眼覆盖物
     * @paras {Point}
     */
    setEye: function(point){
        if(!this._mkr){
            var icon = new BMap.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAoCAYAAADpE0oSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUY1NDYwQjhGNTIxMTFFMkIzREZGQURENzdCRDY5ODMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUY1NDYwQjlGNTIxMTFFMkIzREZGQURENzdCRDY5ODMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFRjU0NjBCNkY1MjExMUUyQjNERkZBREQ3N0JENjk4MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFRjU0NjBCN0Y1MjExMUUyQjNERkZBREQ3N0JENjk4MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgIQMF8AAAeYSURBVHjapJh7bFt3Fce/9r1+23EcJ3bc5tWm7VqWLVWrpkRk6/4goqWoIwO2qhKPUQQCiQ4qsU4ggTQJCRiaGOqYqJCYVvZHWLds06ptjLWjW7vRdIM2SV/O+107LzuOH/faDufc+t7YjZ045Sed+7v3+t7f53fO75zzO9e6xcVFFNN+86dXKqj7OskDJFtIaknKSXpJQiQfkbxH8s5TP/pGarXxdKuBCdhM3S9I9qO4djUziSdpAqE1gwlopu4Fku/wtdEgoq7ai631VSgrdaDEboXVYsJsKIKEJGNw5Bb6hycxPB5UhxgmeZbgzxUNJmgddSdJWkRRwM6GTWjeuRUmo2FVdadmw/jg4y70DU2ot14k+OOrgglaz+tEsqnC7UTbl5rhctqx1najbxRvnelEMqksdwfBHykIJqiNujMkTXVVHnyVoGziZbPV6XKuCy1XcCaEv7/1ERai8WWa3wl+ibpveitKcejAHrCZs5ter1egZz7pw9D4HL/OWLTsqMWmWrcygTsnEZwJ428dZ1XNDxK8nU/ELGgLQwUa/MAXd0MQ9NogDGPoqXd78NTxcwjHF6ETRMLq6Jk00skL2F7vwnPHWrFtYwXS6bQGLnc5sGd3A94/f5kvf0jSnqMxgd+g7kBT42a07PpcjpbzCzKO/PZd/OPTSXi9ZXjisUbUeO2YjybROxbG8692Q04koJPj+OnB+3D0W82kYTJnKV569Sym5+b58ifs6foMtJKhokAefF+9ZjKW9KIOjx7rwPtdMzCXuuCrLIPNaoKv3Ib1HjvcLivctDQmRwkEuxO/b+/BH1++SBYTckzfvOMedR77s03dxocN1R4lZNSHRVHE8fZLuDaRgLnECcFgxMBUAr882bPMkQwmI0RyRL2oJ/gV7H9wM2p9Ds3sdTQ2K5ZMpVpZUX3mPU6D2FhTqTyoikz+8HxHD8wOB0xWizZ4XqEJ8+8mqw0GmwPPvnxJWSZ1LD35CcMzrUXVuFF1BFVbNtW5z4Yh64ywWCw0sJG9bNX41Yts4hQ+uBKATi/keLmX8kLvoJJYmlRwDR947VTTsJn7x8MwmM0wEFQoImtpLZ2k2NWTM0VhNS6tM6fYTKtSwUpqErNCiNvMfJw0FSCaRFpfoXhuip43ipiai6HGY9bG1Os1ixlV8CyJK56QtHzMmvvK7WQuPYwEdrttRUFTyTQCUkJZU1eJOcezJVkLsYgK7ifZORdeQEVZiXJDlmV8vsEHvO6nSSyidr0dNsvqWo9MLCAYANa5LfCWWREKLe2MIRo/0/wquJPBgemQ4mDcOAFsqS5FlduEmVQKt6bjeGBH+YrQeCKFS13TpLWMtgdrkKCkkr10PH6mXVTD6UM+DIwEc8IpHo/j6CP3QorHMBlYgH8kigqXEZ6y5WK3Cui8GkKMNgSbkMLj+7YhFotpY8XiCUwG51TweRXcwYfxwCxm5iLaukSjUey534Ov7fIiFpnHlevTeONftzA0EafNP00eoqN0mkRXbwSn/jmJickQpGgEz3x3B0RdEimylDrWtb5xSh5KxLxJKTOanav/TN33q31utH6hQTMPhxXH8Qun/Tj54QQsDjuFmAkC3efNg7VJkdMkSDtDMobffbsR2zeWIBKJaGMkpCReefvfqnN9hcCns8FO6q5wTD+0exvq1i+tJycTm82GgUAcJ97242J/CPKioIFdFh32Nlbge/vuoRws50C5neu8gf6RgKrtw/n24yeo+wNviV/e04gyZ24IGSmR8ARMJhOuDs0q3l5GIVPpMivryUvD5s1u3f5RfNo9iEwlej+BhwuVPn/lAs9iNuKhpq0UXo68HmwwLMX7nTANenMU/7k2rHr2wwR9c7Vi7zXesTjT7GrYgC0bKtdUb8m0u1zs6ifzahXnCYL+oNjy9i/UHb69edhx7+YqVHld2WkvTxzL6B8Nosc/ppxzhsqUO6fXVNAT/BB1Rzm53PZwAb4KJ9xUdZpMS0Xg/EIc07MRSjLh7NcZ9mOCDhRdV4+OjmrnF/7rb5gLR8/F4rKLZEUTc71mNouwmo2XDx/ct33NnzCkqXZe4yvlrNbi87hRvc6DWcq3EdIwFpe0Zxx2C5wOKhTIIv6BUfo9xrefOdTW+mQhsLjSrHzl1hpZllqsFjOatt+umXwe14pa22jPPXvhM6XKWOm5FcGSJKdUE0ajMdjtNi2MOHlwYsmuJjmOOZ7pPcXX7ho8HZbHHObF9yRJar3mH0B97Totk3E9pTaGq0t2ucdPYEnbeNYENukTWVrjBHWt3df74S13KtoX/GCjr4axSSV2b5D8es1gSUpkX57iD26613qjd4gqUV/Bwbqv96nvth87cli6C/Cyd/g7ufU6gT1UoXAuX7Ys9JUwEZhSP8yfXi275QXL0rJ45f36Hbq/t29wDLVVnuV/A9wcVN879fTPj6TuDizntRKv9d6bAyP0vWyFmYp3tU0GZxGcmuHTLpJfFZPPC4CT+W6z1h30W9v5zh5s21RNWcpIFcs8JY1x1atPFLuR5AUnU8lCz/P/IUIyljxwqetmPosc/7/AhfZXarwLcAXxs8z3VnXmH54zat1WbPufAAMAFBGLprc91/gAAAAASUVORK5CYII=",
               new BMap.Size(40, 40), {    
                   anchor: new BMap.Size(20, 40),    
                   imageOffset: new BMap.Size(-5, 0)
            });  
             
             this._mkr = new CustomMarker(icon, point, {
                 className: 'eye_mrk',
                 click: function(){}
             });
             
             this._mkr.setDraggingEnabled(true);
             this.eyeMap.addOverlay(this._mkr);  
             this._mkr.addEventListener('dragend', $.proxy(this.markerDragEnd, this));
         }else{
             this._mkr.setPoint(point);
         }
    },
    markerDragEnd: function(){
        var point = this.eyeMap.getCenter();
        this.streetView.setPosition(point);
    },
    /*
     * 街景id发生变化时触发。
     */
    onPositionChanged:function(){
        var sv = this.streetView;
        var point = sv.getPosition();
        var addr = sv.getDescription();
        if(this.eyeMap){
            this.setEye(point); 
            this.eyeMap.centerAndZoom(point, 15);
        }
        
        this.setDayAndNigthMode();
        
        addr = addr || '未命名路段';
        
		var m = addr.match(/[^\x00-\xff]/ig);
        var s = m ? m.length : addr.length;
		//如果地址的长度超过14个中文字符的长度， 就直接截取。
		if(s > 14){
		    addr = addr.substring(0, 13) + '...';
		}
        $("#street-holder").find('.addr').text(addr);
    },
    /**
     * 街景图块加载完成的回调函数
     * 用来做性能统计
     */
    onTilesLoaded: function(){
        // if (this._updated) {
        //     var stPdc = Monitor.createPdc(PDC.DICT.ST_LOAD);
        //     stPdc.mark('c_st_load');
        //     stPdc.view_time();
        //     stPdc.ready(1);
        //     // console.log(Date.now() - window._stTime); // debug时间
        //     this._updated = false;
        // }
    },
    
    setDayAndNigthMode: function(){
        var rel = this.streetView.getRelevants(),
            data = rel && rel[0],
            $mode = $("#street-holder").find('.mode');
            
        if(data && data.mode && !this.maxStatus){
            var relMode = (data.mode === this.Str.DAY) ? 'day' : 'night';
            $mode.removeClass('night day');
            relMode ? $mode.show().addClass(relMode) : $mode.hide();
        }else{
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

        if(query.ss_id){
            ssid = query.ss_id;
            if(query.ss_panoType &&
                query.ss_panoType != 'undefined' &&
                query.ss_panoType === 'inter'){
                this.streetView.setInnerId(ssid);
            }else{
                this.streetView.setId(ssid);
            }
        }else if(query.nb_x && query.nb_y){
            point = new BMap.Point(query.nb_x, query.nb_y);
            this.streetView.setPosition(point);
        }
        
		pov = this.streetView.getPov();
        if(query.ss_heading && query.ss_heading !== 'undefined'){
            pov.heading = parseFloat(query.ss_heading);
        }
        if(query.ss_pitch && query.ss_pitch !== 'undefined'){
            pov.pitch = parseFloat(query.ss_pitch);
        }
        this.streetView.setPov(pov);
    },
    sendStats:　function(code, params) {
        //util.addStat(code, $.extend({}, params || {}));
    }
};

module.exports = StreetViewControl;


});

;define('common:widget/suggestion/suggestion.js', function(require, exports, module){

require("common:static/js/widget.js");

var util = require('common:static/js/util.js'),
    stat = require('common:widget/stat/stat.js'),
    locator = require('common:widget/geolocation/location.js');

/**
 * @file 搜索建议组件
 * @name Suggestion
 * @desc <qrcode align="right" title="Live Demo">../gmu/_examples/widget/suggestion/suggestion_setup.html</qrcode>
 * 搜索建议组件
 * @import core/touch.js, core/zepto.ui.js, core/zepto.highlight.js
 * Modified By Xuanwei, Sheng @ 2013-06-04
 */

/**
 * @name suggestion
 * @desc   搜索建议组件
 * @grammar     suggestion() => self
 * @grammar     $.ui.suggestion([el [,options]]) => self
 * @desc
 * **Options**
 * - ''container''        {Selector}:                  (必选)父元素
 * - ''source''           {String}:                    (必选)请求数据的url
 * - ''param''            {String}:                    (可选)url附加参数
 * - ''formID''           {String}:                    (可选)提交搜索的表单，默认为包含input框的第一个父级form
 * - ''posAdapt''         {Boolean,默认:false}:         (可选)是否自动调整位置
 * - ''listCount''        {Number, 默认: 5}:            (可选)展现sug的条数: 5
 * - ''isCache''          {Boolean, 默认: true}:        (可选)是否缓存query: true
 * - ''isStorage''        {Boolean, 默认: true}:        (可选)是否本地存储pick项: true
 * - ''isSharing''        {Boolean, 默认: true}:        (可选)是否共享历史记录: true
 * - ''shareName''        {String}:                    (可选)共享缓存key
 * - ''autoClose''        {Boolean}:                   (可选)点击input之外自动关闭
 * - ''usePlus''          {Boolean}:                   (可选)是否启用+号
 * - ''status''           {Boolean}:                   (可选)是否开启事件，可在close时设为false，则下次sug不再弹出
 * - ''height''           {Number}:                    (可选)设置高度
 * - ''width''            {Number}:                    (可选)设置宽度
 * - ''minChars''         {Number}:                    (可选, 默认: 0)最小输入字符: 0
 * - ''maxChars''         {Number}:                    (可选, 默认: 1000)最大输入字符: 1000
 * - ''offset''           {Object}:                    (可选, 默认: {x:0, y:0})偏移量{x:0, y:0}
 * - ''renderList''       {Function}:                  (可选)自定义渲染下拉列表
 * - ''renderEvent''      {Function}:                  (可选)绑定用户事件
 * - ''sendRequest''      {Function}:                  (可选)用户自定义请求方式
 * - ''select''         {Function}:                    (可选)选中一条sug触发
 * - ''submit''         {Function}:                    (可选)提交时触发
 * - ''open''          {Function}:                    (可选)sug框展开时触发
 * - ''close''         {Function}:                     (可选)sug框关闭时触发
 */
$.ui.create('suggestion', {
    _data: {
        listCount: 50,
        isCache: true,
        isStorage: true,
        minChars: 0,
        maxChars: 1000,
        offset: {x: 0, y: 0, w: 0},
        confirmClearHistory: true
    },

    /**
     * 自定义设定maskElem，默认$input.parent();
     * @private
     */
    _create: function() {
        var me = this,
            expando = +new Date(),
            maskID = 'ui-input-mask-' + expando,
            sugID = me.data('id', "ui-suggestion-" + $.guid()),
            $input = me.widget($(me.data('container'))).attr("autocomplete", "off"),
            formID = me.data('formID'),
            $maskElem = me.data('mask') ? $(me.data('mask')) : $input.parent();
            // map = app.commonView.getViewObject('map').getMap();

        if ($input.length === 0) return;

        me.data({
            inputWidth: $input.get(0).offsetWidth,
            cacheData: {},
            form: formID ? $(formID) : $input.closest('form')
        });
        // if ($maskElem.attr('class') != 'ui-input-mask') {
        //     $maskElem = $('<div id="' + maskID + '" class="ui-input-mask"></div>').appendTo($maskElem);
        // }
        me.data('maskElem', $maskElem);
        me.data('wrapper', $('<div id="' + sugID + '" class="ui-suggestion"><div class="ui-suggestion-content"><div class="ui-suggestion-scroller"></div></div><div class="ui-suggestion-button"></div></div>').appendTo($maskElem));
        me._initSuggestionOffset();
    },

    _init: function() {
        var me = this,
            $input = me.widget(),
            form = me.data('form'),
            eventHandler = $.proxy(me._eventHandler, me);

        if ($input.length === 0) return;

        me.data('wrapper').on('touchstart', eventHandler);
        form.length && form.on('submit', eventHandler);
        $input.on('focus input', eventHandler).parent().on('touchstart', eventHandler);
        $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', eventHandler);
        me.data('autoClose') && $(document).on('tap', eventHandler);
        me.on('destroy', function() {
            var me = this,
                $elem = me.data('wrapper');
            clearInterval(me.timeId);
            // 自定义DOM销毁方式
            $elem.find('*').off();
            $elem.off().remove();
            form.length && form.off('submit', eventHandler);
            $input.off('focus input', eventHandler).parent().off('touchstart', eventHandler);
            me.data('autoClose') && $(document).off('tap', eventHandler);
            $(window).off('onorientationchange' in window ? 'orientationchange' : 'resize', eventHandler);
            eventHandler = $.fn.emptyFn;
        })._setSize();
    },

    _setup: function(){
        var me = this;
        me.data('container', me.widget()); // add container
        me._create();
    },

    /** 
     * 初始化属性
     * top样式属性里移除$input.height()
     * @private
     */
    _initSuggestionOffset: function() {
        var me = this, width,
            $elem = me.data('wrapper'),
            $input = me.widget(),
            customOffset = me.data('offset'),
            border = 2 * parseInt($elem.css('border-left-width') || 0);
        me.data('pos', (customOffset.y || 0));
        me.data('realWidth', (me.data('width') || $input.width()) - border);
        $elem.css({
            position: 'absolute',
            left: customOffset.x || 0,
            top: customOffset.y || 0
        });
        return me;
    },

    /** 
     * 设置size
     * 父元素查找将parent() ->　parents(".se-wrap")
     * @private
     */
    _setSize: function() {
        var me = this,
            width = me.data('realWidth'),
            additionWidth = me.widget().parents(".se-wrap").width() - me.data('inputWidth') - 1;
        // me.data('wrapper').css('width', width + additionWidth);
        me.data('wrapper').css('width', "100%");
        return me;
    },

    /**
     * 适配位置
     * @private
     */
    _posAdapt: function(dps) {
        var me = this;
        if (dps) {
            me._setPos();
            if (me.timeId) clearInterval(me.timeId);
            me.timeId = $.later(function() {
                me._setPos();
            }, 200, true);
        } else {
            clearInterval(me.timeId);
        }
        return me;
    },

    /**
     * 设置位置
     * top样式属性里移除parseFloat($elem.height())
     * @private
     */
    _setPos: function() {
        var me = this,
            win = window,
            $elem = me.data('wrapper'),
            $input = me.widget(),
            height = parseFloat($elem.height()),
            customOffset = me.data('offset'),
            pos =  parseFloat(me.data('pos')),
            uVal = $input.offset().top - win.pageYOffset,
            dVal = $(win).height() - uVal;

        if (me.data('posAdapt') && uVal > dVal) {
            $elem.css('top', (customOffset.y || 0) + 'px');
        } else {
            $elem.css('top', pos);
        }
        return me;
    },

    /** 
     * input输入处理
     * @private
     */
    _change: function(query) {
        var me = this,
            data = me._cacheData(query),
            isCache = me.data('isCache'),
            source = me.data('source');
        return data && isCache ? me._render(query, data) : me._sendRequest(query);
    },

    /** 
     * 事件管理器
     * @private
     */
    _eventHandler: function(e) {
        var me = this,
            type = e.type,
            target = e.target,
            maskElem = me.data('maskElem').get(0);

        if (!me.data('status')) return;
        switch (type) {
            case 'focus':
                me.trigger('focus')._setSize()._showList()._setPos().trigger('open');
                break;
            case 'touchstart':
            case 'mousedown':
                if (!e.formDelete) break;
                e.preventDefault();
            case 'input':
                me._showList();
                break;
            case 'resize':
            case 'orientationchange':
                try {
                    if (me && typeof i._setSize == "function") {
                        $.later(function() {
                            me._setSize()._setPos();
                        }, 2000);
                    }
                } catch (ex) {}
                break;
            case 'submit': // form提交时能存储历史记录
                me.data('isStorage') && me._localStorage(me.getValue());
            case 'click':
            case 'tap':
                if (!(maskElem.compareDocumentPosition(target) & 16)) me.hide();
                break;
        }
    },

    /** 
     * 显示下拉浮层
     * @private
     */
    _showList: function() {
        var me = this,
            query = me.getValue(),
            data = me._localStorage();

        if (query !== '' && (query.length < parseFloat(me.data('minChars')) || query.length > parseFloat(me.data('maxChars')))) {
            return me;
        }

        return query ? me._change(query) : data ? me._render(null, {s: data.split(encodeURIComponent(','))}) : me.hide();
    },

    /** 
     * 绑定下拉浮层中的事件
     * @private
     */
    _bindSuggestionListEvent: function() {
        var me = this,
            $input =  me.widget();
        me.data('wrapper').find(".ui-suggestion-result").on('click', function(e) {
            var elem = e.target, that = this;
            this.style.backgroundColor = 'transparent';
            me._select(that);
            setTimeout(function(){
                if (elem && elem.className == 'ui-suggestion-plus') {
                    $input.val(elem.getAttribute('data-item')).trigger('input');
                } else {
                    me._submit();
                }
            }, 400);
        });
        me.data('wrapper').find(".ui-suggestion-result").each(function(index, item) {
            $(item).on("touchstart", function(e) {
                this.style.backgroundColor = '#eef3fe';
                // e.stopPropagation();
            });
            $(item).on("touchend", function(e) {
                this.style.backgroundColor = 'transparent';
                // e.stopPropagation();
            });
        });
        // }).highlight('ui-suggestion-result-highlight');
        return me;
    },

    /** 
     * 绑定关闭按钮事件
     * button选择器增加.ui-suggestion-button约束
     * @private
     */
    _bindCloseEvent: function() {
        var me = this,
            $wrapper = me.data('wrapper');

        $wrapper.find('.ui-suggestion-button span:first-child').on('click', function() {
            stat.addStat(COM_STAT_CODE.SUG_CLEAR_HISTORY_BTN); // 清空历史记录点击统计 by jican
            $.later(function(){
                me.clearHistory();
            }, $.os.android?200:0);
        });

        $wrapper.find('.ui-suggestion-button span:last-child').on('click', function() {
            stat.addStat(COM_STAT_CODE.SUG_HISTORY_SHUTUP); // 关闭点击统计 by jican
            me.hide().leaveInput().trigger('close');
        });
        return me;
    },

    /** 
     * 发送异步请求
     * @private
     */
    _sendRequest: function(query) {
        var me = this,
            url = me.data('source'),
            param = me.data('param'),
            cb = "suggestion_" + (+new Date()),
            sendRequest = me.data('sendRequest');

        var cityCode = locator.getCityCode() || 1,
            type = 0, // 0: normal | 2: route
            // bound = me.map.getBounds(),
            bound = {},
            boundParams = '';

        // if (bound.minX == bound.maxX && bound.minY == bound.maxY) {
            if (locator.hasExactPoi()) {
                bound.minX = locator.getPointX() - 5000;
                bound.minY = locator.getPointY() - 5000;
                bound.maxX = locator.getPointX() + 5000;
                bound.maxY = locator.getPointY() + 5000;
                boundParams = "&b=("+ bound.minX +","+ bound.minY +";"+ bound.maxX +","+ bound.maxY +")";
            }
        // } else {
            // boundParams = "&b=("+ bound.minX +","+ bound.minY +";"+ bound.maxX +","+ bound.maxY +")";
        // }

        if ($.isFunction(sendRequest)) {
            sendRequest(query, function(data) {
                me._render && me._render(query, data)._cacheData(query, data);
            });
        } else if (query) {
            url += (url.indexOf("?") === -1 ? "?" : "") + "&wd=" + encodeURIComponent(query);
            if (url.indexOf("&callback=") === -1) url += "&callback=" + cb;
            if (url.indexOf("&cid=") === -1) url += "&cid=" + cityCode;
            url += boundParams;

            if (param) url += '&' + param;
            window[cb] = function(data) {
                me._render && me._render(query, data)._cacheData(query, data);
                $('[src="' + url + '"]').remove();
                delete window[cb];
            };
            $.ajax({
                url: url,
                dataType: 'jsonp',
                callback: 'cb'
            });
        }
        return me;
    },

    /**
     * @desc 获取input值
     * @name getValue
     * @grammar getValue() => string
     * @example $('#input').suggestion('getValue');
     */
    getValue: function() {
        return $.trim(this.widget().val());
    },

    /** 
     * 渲染下拉浮层
     * @private
     */
    _render: function(query, data) {
        var me = this, html,
            $elem = me.data('wrapper'),
            $content = $elem.find('.ui-suggestion-content'),
            $button = $elem.find('.ui-suggestion-button'),
            renderList = me.data('renderList'),
            renderEvent = me.data('renderEvent'),
            clearBox = '<span style="display:none;"></span><span>关闭</span>';

        query === null && (clearBox = '<span>清除历史记录</span><span>关闭</span>');
        html = renderList ? renderList.apply(me, [query, data]) : me._renderList(query, data);

        if (html) {
            $content.find('*').off(); // unbind all events in sug list
            $content.find('.ui-suggestion-scroller').html(html);
            $button.find('*').off();
            $button.html(clearBox);
            renderEvent ? renderEvent.apply(me) : me._bindSuggestionListEvent();
            me._bindCloseEvent()._show();
            $content.on('touchstart', function(e){e.preventDefault()});
        } else me.hide();
        
        return me;
    },      

    /** 
     * 渲染list HTML片段
     * @private
     */
    _renderList: function(query, data) {
        var me = this,
            listCount = me.data('listCount'),
            usePlus = me.data('usePlus'),
            items = [], html = "",
            sugs = data.s;

        if (!data || !sugs || !sugs.length) {
            this.hide();
            return;
        }
        sugs = sugs.slice(0, listCount);

        if (query == null) {
            items = sugs;
            // 如果query是null则表明是历史纪录，这里要对
            // 用户输入的内容进行过滤
            $.each(sugs, function(index, item){
                items[index] = util.encodeHTML(item);
            });
        } else {
            $.each(sugs, function(index, item) {
                $.trim(item);
                item = item.split('$');
                if (item.length == 6) {
                    items.push((item[3] ? '<span>' + item[3].replace(query, '<font>' + query + '</font>') + '</span>' : '') + '<span>' + item[0] + item[1] + '</span>');
                }
            });
        }

        return me._buildHTML(items);
        // query = this._htmlEncode(query) || null;    //FEBASE-736 修改query为空时,replace替换错误的bug
        // $.each(sugs, function(index, item) {
        //     item = me._htmlEncode(item);
        //     var str = $.trim(item).replace(query, '<span>' + query + '</span>');
        //     if (usePlus) str += '<div class="ui-suggestion-plus" data-item="' + item + '"></div>';
        //     html += '<li><div class="ui-suggestion-result">' + str + '</div></li>';
        // });
        // return html + '</ul>';
    },

    /** 
     * 创建Suggestion list HTML内容
     * @private
     */
    _buildHTML: function(list) {
        var html = "";
        if (!this.data('isSharing')) {
            if (list[0] === window['MY_GEO']) {
                if (list.length === 0) {
                    return '<ul><li><div class="ui-suggestion-result" style="color:#4C78CE;">' + '我的位置' + '</div></li></ul>';
                } else {
                    html = list.join('</div></li><li><div class="ui-suggestion-result">');
                    return '<ul><li><div class="ui-suggestion-result" style="color:#4C78CE;">' + '我的位置' + '</div></li><li><div class="ui-suggestion-result">' + html + '</div></li></ul>';
                }
            }
        }
        html = list.join('</div></li><li><div class="ui-suggestion-result">');
        return '<ul><li><div class="ui-suggestion-result">' + html + '</div></li></ul>';
    },

    _htmlEncode: function(str){
        return $('<div></div>').text(str).html();
    },

    /** 
     * 提交搜索提示
     * @private
     */
    _submit: function() {
        var me = this,
            keyValue = me.widget().val();
        me.trigger("submit");
        // if(!me.data('submit') && !(me._callbacks && me._callbacks.submit))
        //     window.location = 'http://www.baidu.com/s?wd=' + encodeURIComponent(keyValue);
        return me;
    },
        

    /** 
     * 选择搜索提示
     * 保存firstChild内容
     * @private
     */
    _select: function(target) {
        var me = this,
            targetContent = target.firstChild.textContent;

        // 在往输入框写入查询字段前判断是从历史记录发起的检索还是在线sug发起的，统计用
        if(me.getValue() === "") {
            // 历史记录点击统计
            stat.addStat(COM_STAT_CODE.SUG_HISTORY_SEARCH, {
                "from": me.widget().attr('id')
            });
            stat.addCookieStat(COM_STAT_CODE.SUG_HISTORY_SEARCH, {
                "from": me.widget().attr('id')
            });
        } else {
            // 在线SUGG点击统计
            stat.addStat(COM_STAT_CODE.SUG_ONLINE_SEARCH, {
                "from": me.widget().attr('id')
            });
            stat.addCookieStat(COM_STAT_CODE.SUG_ONLINE_SEARCH, {
                "from": me.widget().attr('id')
            });
        }

        me.widget().val(targetContent);
        me.data('isStorage') && me._localStorage(targetContent);
        return me.trigger("select", target).hide();
    },      

    /** 
     * 缓存搜索提示
     * @private
     */
    _cacheData: function(key, value) {
        var me = this;
        if (me.data('isCache')) {
            return value !== undefined ? me.data('cacheData')[key] = value : me.data('cacheData')[key];
        }
    },  

    /** 
     * 操作历史记录
     * @private
     */
    _localStorage: function(value) {
        var me = this,
            ret,
            localdata,
            data,
            shareName = me.data('shareName'),
            index,
            id = me.data('isSharing') ? shareName ? shareName + '-SUG-Sharing-History' : 'SUG-Sharing-History' : me.data('id');

        try{
            if (value === null) window.localStorage[id] = "";
            else if (value !== undefined) {
                localdata = window.localStorage[id];
                data = localdata ? localdata.split(encodeURIComponent(',')) : [];

                if (!!~$.inArray(value, data)) {
                    index = data.indexOf(value);
                    data.splice(index, 1);
                }
                data.unshift(value);
                window.localStorage[id] = data.join(encodeURIComponent(','));
            }
            ret = window.localStorage[id];
        } catch(e){}
        return ret;
    },

    /** 
     * 显示suggestion
     * @private
     */
    _show: function() {
        var me = this;
        if (me.data('wrapper') && me.data('wrapper').css("display") !=  "block") {
            stat.addStat(COM_STAT_CODE.SUG_ONLINE_SHOW); // suggestion展现量统计 by jican
        }
        me.data('wrapper') && me.data('wrapper').css("display", "block");
        me.data('posAdapt') && me._posAdapt(me.data('posAdapt'));
        return me.trigger('show');
    },  

    /**
     * @desc 隐藏suggestion
     * @name hide
     * @grammar hide() => self
     */
    hide: function() {
        var me = this;
        me.data('wrapper') && me.data('wrapper').css("display", "none");
        return me._posAdapt(0).trigger('hide');
    },

    /**
     * @desc 清除历史记录
     * @name clearHistory
     * @grammar clearHistory() => undefined
     */
    clearHistory: function() {
        var me = this, _clear = function(){
            me._localStorage(null);
            me.hide();
            // iPad清空内容之后需要刷新iScroll，否则引起页面元素渲染空白 @shengxuanwei
            if (util.isIPad()) {
                app.myScroll && app.myScroll.refresh();
            }
        };
        me.data('confirmClearHistory') ? window.confirm('是否清除全部历史记录？') && _clear() : _clear();
    },

    /**
     * @desc 设置|获取历史记录
     * @name history
     * @grammar history() => string
     * @param {String} query 搜索条件
     */
    history: function(query) {
        return this._localStorage(query);
    },

    /**
     * @desc input获得焦点
     * @name focusInput
     * @grammar focusInput() => self
     */
    focusInput: function() {
        this.widget().get(0).focus();
        return this;
    },

    /**
     * @desc input失去焦点
     * @name leaveInput
     * @grammar leaveInput() => self
     */
    leaveInput: function() {
        this.widget().get(0).blur();
        return this;
    }
});

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
    init: function() {
        this.render();
        this.bind();
    },
    render: function() {
        var me = this;
        me.closeBtn = $('#banner_close_button');
        me.bannerCon = $('#common-widget-top-banner');
        me.appbutton = $("#banner_install_button");
    },
    bind: function() {
        var me = this,
            url = app.get();
        me.os = util.isAndroid() ? "android" : util.isIPhone() ? "iphone" : util.isIPad() ? "ipad" : "unknown";
        me.action = url.action;
        me.module = url.module;
        me.pageState = url.pageState;
        me.closeBtn.on('click', $.proxy(me._onClose, this));
        me.displayBanner();
    },
    displayBanner: function() {
        //展示banner策略
        var me = this,
            $info = "点击下载手机地图，省90%流量";
        if (cookie.get("hdBanner")) {
            me.hideBanner();
            return;
        }
        me.showBanner();
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
    }
}

});