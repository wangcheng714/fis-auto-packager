/**
 * @fileoverview webspeed性能监控头部代码。非特殊情况不允许修改，否则请联系@jican
 * @author webspeed@baidu.com
 * @require jican@baidu.com
 */
(function() {
    PDC.extend({
        _navTiming: window.performance && performance.timing,
        ready: (function(callback) {
            var readyBound = false,
            readyList = [],
            DOMContentLoaded,
            isReady = false;
            if (document.addEventListener) {
                DOMContentLoaded = function() {
                    document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    ready()
                }
            } else {
                if (document.attachEvent) {
                    DOMContentLoaded = function() {
                        if (document.readyState === "complete") {
                            document.detachEvent("onreadystatechange", DOMContentLoaded);
                            ready()
                        }
                    }
                }
            }
            function ready() {
                if (!isReady) {
                    isReady = true;
                    for (var i = 0,
                    j = readyList.length; i < j; i++) {
                        readyList[i]()
                    }
                }
            }
            function doScrollCheck() {
                try {
                    document.documentElement.doScroll("left")
                } catch(e) {
                    setTimeout(doScrollCheck, 1);
                    return
                }
                ready()
            }
            function bindReady() {
                if (readyBound) {
                    return
                }
                readyBound = true;
                if (document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
                    window.addEventListener("load", ready, false)
                } else {
                    if (document.attachEvent) {
                        document.attachEvent("onreadystatechange", DOMContentLoaded);
                        window.attachEvent("onload", ready);
                        var toplevel = false;
                        try {
                            toplevel = window.frameElement == null
                        } catch(e) {}
                        if (document.documentElement.doScroll && toplevel) {
                            doScrollCheck()
                        }
                    }
                }
            }
            bindReady();
            return function(callback) {
                isReady ? callback() : readyList.push(callback)
            }
        })(),
        Cookie: {
            set: function(name, value, max_age) {
                max_age = max_age || 10;
                var exp = new Date();
                exp.setTime(new Date().getTime() + max_age * 1000);
                document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString()
            },
            get: function(name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) {
                    return unescape(arr[2])
                }
                return null
            },
            remove: function(name) {
                this.set(name, "", -1)
            }
        },
        _is_sample: function(ratio) {
            if (!PDC._random) {
                PDC._random = Math.random()
            }
            return PDC._random <= ratio
        },
        _load_analyzer: function() {
            var special_pages = this._opt.special_pages || [];
            var radios = [this._opt.sample];
            for (var i = 0; i < special_pages.length; i++) {
                radios.push(special_pages[i]["sample"])
            }
            var radio = Math.max.apply(null, radios);
            if (PDC._is_sample(radio) == false) {
                return
            }
            PDC._analyzer.loaded = true;
            PDC._load_js(PDC._analyzer.url,
            function() {
                var callbacks = PDC._analyzer.callbacks;
                for (var i = 0,
                l = callbacks.length; i < l; i++) {
                    callbacks[i]()
                }
            })
        },
        _load_js: function(url, callback) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            script.onload = script.onreadystatechange = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    script.onload = script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(url, true)
                    }
                }
            };
            script.onerror = function(e) {
                if (typeof callback === "function") {
                    callback(url, false)
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script)
        },
        send: function() {
            if (PDC._analyzer.loaded == true) {
                WPO_PDA.send()
            } else {
                PDC._load_analyzer();
                PDC._analyzer.callbacks.push(function() {
                    WPO_PDA.send()
                })
            }
        },
        _setWtCookie: function () {
            if(!PDC._issetJT) {
                //console.log('set wt cookie');
                PDC._issetJT = true;
                PDC.Cookie.set("PMS_JT", '({"s":' + ( + new Date) + ',"r":"' + document.URL.replace(/#.*/, "") + '"})');
            }
        }
    },PDC);
    !function() {
        var Cookie = PDC.Cookie,
        jt = Cookie.get("PMS_JT"),
        isset = false;
        PDC._issetJT = false;
        if (jt) {
            Cookie.remove("PMS_JT");
            PDC._issetJT = false;
            jt = eval(jt);
            // 如果从开始点击到页面渲染起始时间（即页面跳转时间）超过100ms才统计）
            // 统计用户等待时间指标为wt（wait_time,实际的白屏是wt+头部加载，展现时已做处理)
            // 注释掉该条件判断 因为webapp简版特殊处理 by jican
            //if (!jt.r || document.referrer.replace(/#.*/, "") == jt.r) {
                //console.log('wt', PDC._render_start - jt.s);
                (PDC._render_start - jt.s) > 100 && PDC.mark("wt", (PDC._render_start - jt.s))
            //}
        }
        function findParent(tagname, el) {
            var flag = 0;
            if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
                return el
            }
            while (el = el.parentNode) {
                flag++;
                if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
                    return el
                }
                if (flag >= 4) {
                    return null
                }
            }
            return null
        }
        function clickHandle(e) {
            var e = e || window.event;
            var target = e.target || e.srcElement;
            var from = findParent("a", target);
            if (from) {
                var url = from.getAttribute("href");
                if (!/^#|javascript:/.test(url)) {
                    PDC._setWtCookie();
                    isset = true
                }
            }
            return false
        }
        if (document.attachEvent) {
            document.attachEvent("onclick", clickHandle)
        } else {
            document.addEventListener("click", clickHandle, false)
        }
    } ();
    PDC.ready(function() {
        PDC.mark("c_drt");
    });
    if (document.attachEvent) {
        window.attachEvent("onload", function() {
            PDC.mark("lt")
        }, false)
    } else {
        window.addEventListener("load", function() {
            PDC.mark("let");
            PDC._setFS && PDC._setFS();
            PDC._opt.ready !== false && PDC._load_analyzer()
        })
    }
})();