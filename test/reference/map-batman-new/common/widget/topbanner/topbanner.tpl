
<div class="common-widget-top-banner" id="common-widget-top-banner" style="display:none">
	<div class="banner-wrapper {%if $type=='map' || ($module == "index" && $action == "streetview")%} banner-mapwrapper{%/if%}">   
		<div id="banner_install_button" class="install_button" uid="{%$data.content.uid%}">
		 	点击下载手机地图，省90%流量
		</div>    
		<span class="underline"></span>    
		 <div id="banner_close_button" class="close_button banner-close-icon">
		 </div>
	</div>
</div>
{%script%}
require('common:widget/topbanner/topbanner.js').init({%json_encode($is_hide_ads)%});
{%/script%}