/**
 * @fileoverview webspeed性能监控头部代码。非特殊情况不允许修改，否则请联系@jican
 * @author webspeed@baidu.com
 * @require jican@baidu.com
 */
(function () {
    window.PDC = {
        _timing: {},
        _opt: {
            sample: 0.01
        },
        _analyzer: {
            loaded: false,
            url: "http://static.tieba.baidu.com/tb/pms/wpo.mpda.js?v=2.6",
            callbacks: []
        },
        _render_start: +new Date,
        extend: function (b, a) {
            for (property in b) {
                a[property] = b[property]
            }
            return a
        },
        metadata: function () {
            var c = this._opt;
            var e = {
                env: {
                    user: (c.is_login == true ? 1 : 0),
                    product_id: c.product_id,
                    page_id: PDC._is_sample(c.sample) ? c.page_id : 0
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
        init: function (a) {
            this.extend(a, this._opt)
        },
        mark: function (a, b) {
            this._timing[a] = b || +new Date
        },
        view_start: function () {
            this.mark("vt")
        },
        tti: function () {
            this.mark("tti")
        },
        page_ready: function () {
            this.mark("fvt")
        },
        first_screen: function () {
            var c = document.getElementsByTagName("img"),
                h = document.getElementsByTagName("IFRAME"),
                d = +new Date;
            var k = [],
                f = this;
            this._setFS = function () {
                var n = f._opt["fsHeight"] || document.documentElement.clientHeight;
                for (var m = 0; m < k.length; m++) {
                    var o = k[m],
                        l = o.img,
                        q = o.time,
                        p = l.offsetTop || 0;
                    if (p > 0 && p < n) {
                        d = q > d ? q : d
                    }
                }
                f._timing.fs = d
            };
            var j = function () {
                if (this.removeEventListener) {
                    this.removeEventListener("load", j, false)
                }
                k.push({
                    img: this,
                    time: +new Date
                })
            };
            for (var a = 0; a < c.length; a++) {
                var b = c[a];
                if (b.addEventListener) {
                    !b.complete && b.addEventListener("load", j, false)
                }
            }
            for (var a = 0, e = h.length; a < e; a++) {
                var g = h[a];
                g.addEventListener("load", j, false)
            }
        }
    }
})();

(function () {
    function b(p, o, n) {
        if (p.length === +p.length) {
            for (var m = 0, j = p.length; m < j; m++) {
                if (o.call(n, m, p[m], p) === false) {
                    return
                }
            }
        } else {
            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    if (o.call(n, k, p[k], p) === false) {
                        return
                    }
                }
            }
        }
    }
    var g = [];
    var i = {
        push: function (j) {
            g.push(j);
            if (window.localStorage && window.JSON) {
                localStorage.setItem("WPO_NR", JSON.stringify(g))
            }
        },
        get: function (j) {
            var k,w;
            if (window.localStorage && window.JSON) {
                w = localStorage.getItem("WPO_NR");
                k = w ? JSON.parse(w) : [];
                j && localStorage.removeItem("WPO_NR")
            } else {
                k = g
            } if (j) {
                g = []
            }
            return k
        }
    };
    var c, f = {}, h = {}, a = {
            PDC: {

                /**
                 * 保存全局时间
                 * @author jican@baidu.com
                 */
                _timing : {},

                /**
                 * 保存当前监控实例
                 * @author jican@baidu.com
                 */
                _apps: {},

                /**
                 * 记录全局时间
                 * @param {string} value 时间
                 * @author jican@baidu.com
                 */
                mark: function (key, value) {
                    this._timing[key] = value || Date.now();
                },

                /**
                 * 记录头部时间
                 * @param {string} value 时间
                 * @author jican@baidu.com
                 */
                head: function () {
                    this.mark('ht');
                },

                /**
                 * 记录Dom ready时间
                 * @param {string} value 时间
                 * @author jican@baidu.com
                 */
                dom_ready: function () {
                    this.mark('drt');
                },
                /**
                 * 创建监控实例或者当有同id对象时直接返回
                 * @param {Number} appID 监控id
                 * @return app
                 * @author jican@baidu.com
                 */
                createApp: function (appID) {
                    var app = this._apps['app_' + appID];
                    if(app) {
                        return app;
                    } else {
                        return this.createInstance(appID);
                    }
                },

                init: function (k) {
                    var j = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {
                        type: 0
                    };
                    f = {
                        p: k.product_id,
                        is_sample: Math.random() <= (k.sample || 0.01),
                        max: k.max || 5,
                        mnt: k.mnt || j.type
                    };
                    h = {
                        p: k.product_id,
                        mnt: f.mnt,
                        b: 50
                    };
                    if (window.localStorage && window.JSON && window.addEventListener) {
                        c = i.get(true);
                        window.addEventListener("load", function () {
                            e.send(c)
                        }, false)
                    }
                },

                createInstance: function (appID) {
                    var app = new d(appID);
                    this._apps['app_' + appID] = app;
                    return app;
                }
            }
        };
    if ((!window.localStorage || !window.JSON) && document.attachEvent) {
        window.attachEvent("onbeforeunload", function () {
            e.send()
        })
    }
    var e = {
        send: function (k) {
            var m = [],
                l = [],
                o = k || i.get(true),
                n;
            if (o.length > 0) {
                b(o, function (p, r) {
                    var q = [];
                    b(r.timing, function (s, t) {
                        q.push('"' + s + '":' + t)
                    });
                    m.push('{"t":{' + q.join(",") + '},"a":' + r.appId + "}");
                    if (!n && k && r.start) {
                        n = r.start
                    }
                });
                b(h, function (p, q) {
                    l.push(p + "=" + q)
                });
                l.push("d=[" + m.join(",") + "]");
                if (n) {
                    l.push("_st=" + n)
                } else {
                    l.push("_t=" + (+new Date))
                }
                var j = new Image();
                j.src = "http://static.tieba.baidu.com/tb/pms/img/st.gif?" + l.join("&");
                window["___pms_img_" + new Date() * 1] = j
            }
        }
    };

    //将send方法公开给对外使用 方便调试 by jican
    a.PDC.send = e.send;

    var d = function (j) {
        this.appId = j;
        this.timing = {};
        this.start = +new Date
    };
    d.prototype = {
        mark: function (j, k) {
            var value = k ? (k - this.start) : (new Date - this.start)
            this.timing[j] = value;
        },
        start_event: function (value) {
            this.start = value || +new Date;
        },
        start_send: function () {
            this.mark("sts")
        },
        transfer_time: function () {
            this.mark("tt")
        },
        view_time: function (value) {
            this.mark("vt", value)
        },
        ready: function () {
            if (f.is_sample) {
                i.push(this);
                if (i.get().length >= f.max) {
                    e.send()
                }
            }
        },
        error: function (j) {}
    };
    window.SDC = a.PDC;
})();