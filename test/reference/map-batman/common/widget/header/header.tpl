<!-- @fileOverview 头部模板 -->

<header class="common-widget-header"  style="display:none">
    <div class="nav">
        <div class="side-l clearfix">
            <span class="btn-l"><a href="{%$commonUrl.header.wise%}" target="_blank">百度</a></span>
            <span class="btn-r"><a href="{%$commonUrl.header.switch_product%}">&nbsp;</a></span>
        </div>
        <div class="title"><span class="txt">百度地图</span></div>
        <div class="side-r">
            <a href="" target="_blank" id="header_install_button" class="header_install_button" uid="{%$data.content.uid%}" data-log="{code:{%$COM_STAT_CODE.HEADER_APP_DOWN%}}">
                下载客户端
            </a>  
        </div>
    </div>
</header>

{%script%}
var header = require("header.js");
header.init(); 
{%/script%}