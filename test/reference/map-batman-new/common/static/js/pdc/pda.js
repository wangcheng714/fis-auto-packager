(function () {
    PDC.extend({
        _navTiming: window.performance && window.performance.timing,
        ready: function (callback) {
            if (document.readyState === "complete" || document.readyState === "loaded") {
                callback()
            }
            document.addEventListener("DOMContentLoaded", callback, false)
        },
        Cookie: {
            set: function (name, value, max_age) {
                max_age = max_age || 10;
                var exp = new Date();
                exp.setTime(new Date().getTime() + max_age * 1000);
                document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString()
            },
            get: function (name) {
                var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                if (arr != null) {
                    return unescape(arr[2])
                }
                return null
            },
            remove: function (name) {
                this.set(name, "", -1)
            }
        },
        _is_sample: function (ratio) {
            if (!PDC._random) {
                PDC._random = Math.random()
            }
            return PDC._random <= ratio
        },
        _load_analyzer: function () {
            var special_pages = this._opt.special_pages || [];
            var radios = [this._opt.sample];
            for (var i = 0; i < special_pages.length; i++) {
                radios.push(special_pages[i]["sample"])
            }
            var radio = Math.max.apply(null, radios);
            if (PDC._is_sample(radio) === false) {
                return
            }
            PDC._analyzer.loaded = true;
            PDC._load_js(PDC._analyzer.url, function () {
                var callbacks = PDC._analyzer.callbacks;
                for (var i = 0, l = callbacks.length; i < l; i++) {
                    callbacks[i]()
                }
            })
        },
        _load_js: function (url, callback) {
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", url);
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                    script.onload = script.onreadystatechange = null;
                    if (typeof callback === "function") {
                        callback(url, true)
                    }
                }
            };
            script.onerror = function (e) {
                if (typeof callback === "function") {
                    callback(url, false)
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script)
        },
        send: function () {
            if (PDC._analyzer.loaded === true) {
                WPO_PDA.send();
            } else {
                PDC._load_analyzer();
                PDC._analyzer.callbacks.push(function () {
                    WPO_PDA.send();
                })
            }
        }
    }, PDC);


    var serverTime,rttTime,waitTime,
        ts,img;
    (function () {
        //将render_start时间提前至页面顶部,因为页面在解析PDC代码将有耗时(2g约90ms)
        if (window.c_t0 !== undefined) {
            PDC.render_start = PDC._render_start = window.c_t0;
        }

        //当前服务响应时间
        serverTime = parseInt(window._SERVER_TIME,10) || 0;

        //RTT测试空图
        img = new Image();

        //空图测试完成后再发送性能数据
        img.onload=function() {
            rttTime = (+new Date - ts);

            //用空图RTT时间 + 服务时间计算等待时间
            waitTime =  serverTime + rttTime;
            if (serverTime > 0 && rttTime > 0) {
                PDC.mark("p_rtt", rttTime);
                PDC.mark("p_srt", serverTime);
                PDC.mark("wt", waitTime);
            }

            //用Timing API 计算等待时间
            if (window.performance && window.performance.timing) {
            var timing = window.performance.timing,
                dnsStart = timing.domainLookupStart;
                PDC.mark("p_wtt", PDC._render_start - dnsStart);
            }

            PDC._setFS && PDC._setFS();
            PDC._opt.ready !== false && PDC._load_analyzer();
        };

    })();

    PDC.ready(function () {
        PDC.mark("c_drt");

    });

    window.addEventListener("load", function () {
        PDC.mark("let");

        //执行空图RTT测试
        var imgSrc = "/mobile/img/t.gif";
        setTimeout(function() {
            ts = +new Date;
            img.src=imgSrc + "?_t=" + ts;
        }, 1000);
    });
})();
