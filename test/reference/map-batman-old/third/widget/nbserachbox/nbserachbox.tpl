<!--@fileOverview 附近搜索框 -->
<div class="index-widget-nbserachbox" id="index-widget-nbserachbox">
	{%*<p id="search-more-nearby">在 <span class="center-name">我的位置</span> 附近找</p>*%}
	<div id="search-form-container">
	    <div class="search-form">
	        <form method="get" id="search-form">
	            <input class="ipt-default" value="输入其他分类" id="search-input" type="text"/>
	        </form>
	        <span id="search-button">搜索</span></div>
	</div>
</div>
{%script%}
    (require("nbserachbox.js")).init();
{%/script%}