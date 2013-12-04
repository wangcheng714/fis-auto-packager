{%style id="/widget/city/city.inline.less"%}.third-widget-curcity{color:#434343;font-size:15px;margin-left:24px;margin-top:63px}.third-widget-curcity span.change{color:#4c90f9;margin-left:9px}.third-widget-curcity span.change-city{color:#4c90f9;font-size:13px}{%/style%}<div class="third-widget-curcity">
<span id="current-city" data-city={%$data.city|f_escape_xml%} data-code={%$data.code|f_escape_xml%}>{%$data.city|f_escape_xml%}</span><span class="change">[<span class="change-city">切换</span>]</span>
</div>
{%script%}
require("third:widget/city/city.js").init();
{%/script%}
