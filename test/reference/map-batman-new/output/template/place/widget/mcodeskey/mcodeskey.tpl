<div class="place-widget-mcodeskey">
{%if $data.errorNo == 0%}
{%$list = $data.list%}
<div class="page_header">
<p class="title">百度地图电影兑换码</p>
</div>
<section>
<p class="mbg"></p>
<div class="codes_msg layoutbox">
<p>恭喜您，您已使用<span class="fback">{%$data.phone|f_escape_xml%}</span>的手机号成功在百度地图购买了<span class="fred">{%$data.num|f_escape_xml%}</span>张兑换码</p>
{%foreach $list as $item%}
{%if $item.is_used==2%}
<p class="fgray">{%$item.cdkey|f_escape_xml%}</p>
{%else%}
<p class="fred">{%$item.cdkey|f_escape_xml%}</p>{%/if%}
{%/foreach%}
{%if $data.res_num == 0%}
<p class="fred">您的兑换码已经全部兑换，祝您观影愉快！</p>
{%else%}
<p>请您留意活动规则，并在指定时间内完成兑换，祝您观影愉快！</p>
{%/if%}
</div>
<div class="codes_exchange layoutbox">
{%if $data.day > 0%}
<p class="txt"></p>
{%else%}
<p class="txt_active"></p>
{%/if%}
{%if $data.day != 0%}
<p class="text_center">离可兑换时间还有：<span class="day">{%$data.day|f_escape_xml%}</span>天</p>
{%/if%}
{%if $data.day > 0%}
<p class="botton_gray">点击兑换</p>
{%else%}
{%if $data.res_num == 0%}
<p class="botton_gray">点击兑换</p>
{%else%}
<p id="exchange" class="botton">点击兑换</p>
{%/if%}
{%/if%}
</div><div class="text_msg layoutbox">
<p>百度地图温馨提示您，兑换码的使用方式为：</p>
{%foreach $data.rule as $item key=index%}
<p>{%$index+1%}.{%$item|f_escape_xml%}</p>
{%/foreach%}
</div>
<p class="mbg"></p>
</section>
<div id="banner" class="banner">
<img src="/mobile/simple/static/place/widget/mcodeskey/banner_cf56912.jpg"/>
</div>
{%script type="text/javascript"%}
        require('place:widget/mcodeskey/mcodeskey.js').initialize();
    {%/script%}
<div class="hide">
<script type="text/javascript">
        var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb2f5614b14af39b080fc30acfef3ccb4' type='text/javascript'%3E%3C/script%3E"));
        </script>
</div>
{%elseif $data.errorNo == 300021%}
<div class="codes_error">抱歉，该活动已结束，下次早点来~</div>
{%/if%}
</div>
