/**
 * @fileoverview webspeed性能监控头部代码。非特殊情况不允许修改，否则请联系@jican
 * @author webspeed@baidu.com
 * @require jican@baidu.com
 */
(function() {
    window.PDC = {
        _timing: {},
        _opt: {
            sample: 0.01
        },
        _analyzer: {
            loaded: false,
            url: "http://static.tieba.baidu.com/tb/pms/wpo.pda.js?v=2.9",
            callbacks: []
        },
        _render_start: +new Date,
        extend: function(b, a) {
            for (property in b) {
                a[property] = b[property]
            }
            return a
        },
        metadata: function() {
            var c = this._opt;
            var e = {
                env: {
                    user: (c.is_login == true ? 1 : 0),
                    product_id: c.product_id,
                    page_id: PDC._is_sample(c.sample) ? c.page_id: 0
                },
                render_start: this._render_start,
                timing: this._timing
            };
            var a = [];
            var d = c.special_pages || [];
            for (var b = 0; b < d.length; b++) {
                if (PDC._is_sample(d[b]["sample"])) {
                    a.push(d[b]["id"])
                }
            }
            if (a.length > 0) {
                e.env["special_id"] = "[" + a.join(",") + "]"
            }
            return e
        },
        init: function(a) {
            this.extend(a, this._opt)
        },
        mark: function(a, b) {
            this._timing[a] = b || +new Date
        },
        view_start: function() {
            this.mark("vt")
        },
        tti: function() {
            this.mark("tti")
        },
        page_ready: function() {
            this.mark("fvt")
        },
        first_screen: function() {
            var b = document.getElementsByTagName("img"),
            g = document.getElementsByTagName("IFRAME"),
            c = +new Date;
            var j = [],
            e = this;
            function f(i) {
                var l = 0;
                l = window.pageYOffset ? window.pageYOffset: document.documentElement.scrollTop;
                try {
                    l += i.getBoundingClientRect().top
                } catch(k) {} finally {
                    return l
                }
            }
            this._setFS = function() {
                var m = e._opt["fsHeight"] || document.documentElement.clientHeight;
                for (var l = 0; l < j.length; l++) {
                    var n = j[l],
                    k = n.img,
                    p = n.time,
                    o = f(k);
                    if (o > 0 && o < m) {
                        c = p > c ? p: c
                    }
                }
                e._timing.fs = c
            };
            var h = function() {
                if (this.removeEventListener) {
                    this.removeEventListener("load", h, false)
                }
                j.push({
                    img: this,
                    time: +new Date
                })
            };
            for (var a = 0; a < b.length; a++) { (function() {
                    var i = b[a];
                    if (i.addEventListener) { ! i.complete && i.addEventListener("load", h, false)
                    } else {
                        if (i.attachEvent) {
                            i.attachEvent("onreadystatechange",
                            function() {
                                if (i.readyState == "complete") {
                                    h.call(i, h)
                                }
                            })
                        }
                    }
                })()
            }
            for (var a = 0,
            d = g.length; a < d; a++) { (function() {
                    var i = g[a];
                    if (i.attachEvent) {
                        i.attachEvent("onload",
                        function() {
                            h.call(i, h)
                        })
                    } else {
                        i.addEventListener("load", h, false)
                    }
                })()
            }
        }
    };
    if (document.attachEvent) {
        window.attachEvent("onload", function() {
            PDC.mark("let");
            PDC._setFS && PDC._setFS();
            PDC._opt.ready !== false && PDC._load_analyzer()
        })
    } else {
        window.addEventListener("load", function() {
            PDC.mark("lt")
        },false)
    }
})();