{%* 发送PV空图统计请求，包括原LOG平台和UDW平台统计 *%}
{%if ($pvStatImg)%}
{%script%}
    var cookie = require("common:widget/cookie/cookie.js");
    var imgUrl='{%$pvStatImg|escape:"none"%}',
        img = new Image(),
        clkCookie = cookie.get('H_MAP_CLK');

    {%* 当从cache中刷新page时，从cookie中重置da_src字段 *%}
    if (clkCookie) {
        var da_src = buildDaSrc(clkCookie);
        if (da_src) {
            imgUrl = replaceQueryParam(imgUrl, 'da_src', da_src);
        }
    }
    imgUrl = replaceQueryParam(imgUrl, 't', Date.now());
    img.src = imgUrl;
    
    function buildDaSrc(clkCookie) {
        try {
            var clkCookieFields = JSON.parse(clkCookie),
                da_src_page, da_src;
            if (clkCookieFields && clkCookieFields.module){
                da_src_page = clkCookieFields.module + '_' + clkCookieFields.action +'_' + clkCookieFields.page;
                da_src = da_src_page + '.' + (clkCookieFields.trackCode||'');
            }
            return da_src;
        } catch (err) {
            return null;
        }
    }
    
    function replaceQueryParam(uri, key, value) {
        var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
        separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }
{%/script%}
{%/if%}
{%script%}

    var stat = require('common:widget/stat/stat.js');
    var module = window._APP_HASH.module;
    var action = window._APP_HASH.action;

    if((module == 'index' && action == "index") 
        || (module == 'place' && action == 'list')
        || (module == 'place' && action == 'detail')
        || (module == 'transit' && action == 'list')
        || (module == 'drive' && action == 'list') ){
        stat.addStat(COM_STAT_CODE.FRONT_PV_TIMES);
    }
{%/script%}
