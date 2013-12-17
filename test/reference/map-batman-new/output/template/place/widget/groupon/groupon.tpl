{%style id="/widget/groupon/groupon.inline.less"%}.place-widget-groupon{margin-bottom:10px}.place-widget-groupon-main{font-size:14px;padding:5px 0;-webkit-box-shadow:0 0 3px #b3b3b3;border-radius:2px;margin:10px 20px 9px;background-color:#fff}.place-widget-groupon-title{padding-left:10px;padding-right:6px;line-height:18px;height:50px}.place-widget-groupon-site{color:#e52e2e;margin-left:-5px}.place-widget-groupon-phone-icon{padding-left:15px;background:url(/static/place/images/groupon_phone_aaa4dc5.png) no-repeat 0 3px;background-size:10px 13px;color:#999;padding-right:5px;float:right}.place-widget-groupon-img-box{position:relative;display:block;text-align:center}.place-widget-groupon-img-box:after{content:"";display:block;width:100%;padding:2px;background:red;margin:-3px 0 0 -6px;background:url(/static/place/images/groupon_pic_bottom_fd4dc02.png) no-repeat 0 bottom;background-size:102% 8px;padding-right:10px}.place-widget-groupon-img{width:102%;height:174px;margin-left:-2%;border-left:#e4e4e4 solid 1px;border-right:#e4e4e4 solid 1px;margin-top:5px;position:relative;background-color:#fff;padding:2px}.place-widget-groupon-price{padding-left:10px;color:silver;font-size:18px;padding-bottom:5px;margin-top:3px}.place-widget-groupon-price>b{color:red}.place-widget-groupon-price del{font-size:14px;padding-left:8px}.place-widget-groupon-gosee{background:url(/static/place/images/groupon_look_18fa391.png) no-repeat 32px 0;background-size:68px 27px;float:right;line-height:27px;width:100px}.place-widget-groupon-gosee-text{font-size:15px;color:#fff;padding-left:48px}.place-widget-groupon-person-total{background:url(/static/place/images/groupon_person_5abe82a.png) no-repeat 10px 8px;background-size:15px 16px;padding-left:30px;color:#666;padding-top:8px;padding-bottom:3px}.place-widget-groupon-date{background:url(/static/place/images/groupon_time_fb50fcf.png) no-repeat 0 0;background-size:15px 15px;float:right;padding-right:30px;padding-left:23px}.place-widget-groupon-pagenum{height:30px;width:240px;margin:auto}.place-widget-groupon-pagenum button{font-size:1em;-webkit-border-radius:.2em;-webkit-box-sizing:border-box;background:-webkit-gradient(linear,50% 0,50% 100%,from(#fff),to(#fff))}.place-widget-groupon-pagenum-prev{color:#000;border:1px solid #9a9a9a;padding:6px 10px;margin-left:43px}.place-widget-groupon-pagenum-next{color:#000;border:1px solid #9a9a9a;padding:6px 10px;margin-left:10px}.place-widget-groupon-curpage{padding-left:7px}.place-widget-groupon-hide{display:none}.place-widget-groupon-disable{color:#ccc;border:1px solid #cacaca}.place-widget-groupon-poi-name,.place-widget-groupon-poi-src-name{display:none}{%/style%}{%* 团购 *%}
{%if ereg("wd=([A-Z0-9%]+)", $smarty.server.REQUEST_URI, $regs)%}
{%$wd = urldecode($regs[1])%}
{%/if%}
{%if ($data.widget.groupon)%}
{%widget name="common:widget/nav/nav.tpl" title="团购详情"%}
<div class="place-widget-groupon">
{%section name=groupon loop=$widget_data.groupon%}
{%if $smarty.section.groupon.index == 0 %}
<ul class="place-widget-groupon-main" url="{%urldecode($widget_data.groupon[groupon].groupon_url_mobile)%}">
{%else%}
<ul class="place-widget-groupon-main place-widget-groupon-hide" url="{%urldecode($widget_data.groupon[groupon].groupon_url_mobile)%}">
{%/if%}
<li class="place-widget-groupon-title">
<span class="place-widget-groupon-site">{%$widget_data.groupon[groupon].cn_name|f_escape_xml%}</span>
<span>{%$widget_data.groupon[groupon].groupon_title|truncate:45:"...":false|f_escape_xml%}</span>
<span>
{%if $widget_data.groupon[groupon].groupon_url_mobile|strip:""!=""%}
<b class="place-widget-groupon-phone-icon">可手机支付</b>
{%/if%}
</span>
</li>
<li>
<span class="place-widget-groupon-img-box">
<img class="place-widget-groupon-img" src="{%urldecode($widget_data.groupon[groupon].groupon_image)%}">
</span>
</li>
<li class="place-widget-groupon-price">
<b>￥{%$widget_data.groupon[groupon].groupon_price|f_escape_xml%}</b>
<del>原价￥{%$widget_data.groupon[groupon].regular_price|f_escape_xml%}</del>
<span class="place-widget-groupon-gosee">
<b class="place-widget-groupon-gosee-text">去看看</b>
</span>
</li>
<li class="place-widget-groupon-person-total">
<span>{%$widget_data.groupon[groupon].groupon_num|f_escape_xml%}人</span>
<span class="place-widget-groupon-date">截止日期：{%$widget_data.groupon[groupon].groupon_end|f_escape_xml%}</span>
</li>
</ul>
{%/section%}
{%if $smarty.section.groupon.total>1 %}
<div class="place-widget-groupon-pagenum">
<button class="place-widget-groupon-pagenum-prev place-widget-groupon-disable">上一条</button>
<span class="place-widget-groupon-curpage">1</span>/<span class="place-widget-groupon-totalpage">{%$smarty.section.groupon.total%}</span>
<button class="place-widget-groupon-pagenum-next">下一条</button>
</div>
{%/if%}
{%* 用于团购详情页点击去第三方的点击量统计 *%}
<span class="place-widget-groupon-poi-src-name">{%$widget_data.src_name|f_escape_xml%}</span>
<span class="place-widget-groupon-poi-name">{%$widget_data.name|f_escape_xml%}</span>
</div>
{%script%}
    var groupon = require("place:widget/groupon/groupon.js"),
        statData = {
            wd: '{%$wd|f_escape_js%}',
            name: '{%$widget_data.name|f_escape_js%}',
            srcname: '{%$widget_data.src_name|f_escape_js%}'
        };
    groupon.init(statData);
    
{%/script%}
{%/if%}