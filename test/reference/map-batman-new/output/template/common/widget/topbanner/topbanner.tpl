{%style id="/widget/topbanner/topbanner.inline.less"%}.banner-wrapper{width:100%;display:block;overflow:hidden;border-top:1px solid #d4d4d4;position:relative;background:#f2f2f2;border-bottom:1px solid #d4d4d4;height:38px;z-index:9}.banner-mapwrapper{background:#f9f9f9;opacity:.95}.close_button{width:21px;height:100%;background:url(/mobile/simple/static/common/widget/topbanner/images/banner_close_467563b.png) no-repeat;background-size:12px 12px;background-position:center;padding:0 6px;float:right}.install_button{display:block;height:100%;position:absolute;top:0;left:0;line-height:38px;color:#333;margin-left:8px}.underline{height:1px;border-bottom:1px solid #333;display:inline-block;width:197px;position:absolute;left:0;top:25px;margin-left:8px}{%/style%}
<div class="common-widget-top-banner" id="common-widget-top-banner" style="display:none">
<div class="banner-wrapper {%if $type=='map' || ($module == "index" && $action == "streetview")%} banner-mapwrapper{%/if%}"><div id="banner_install_button" class="install_button" uid="{%$data.content.uid|f_escape_xml%}">
点击下载手机地图，省90%流量</div><span class="underline"></span><div id="banner_close_button" class="close_button banner-close-icon">
</div>
</div>
</div>
{%script%}
require('common:widget/topbanner/topbanner.js').init({%json_encode($is_hide_ads)%});
{%/script%}