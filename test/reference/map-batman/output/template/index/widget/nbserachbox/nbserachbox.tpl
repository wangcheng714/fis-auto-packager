{%style id="/widget/nbserachbox/nbserachbox.inline.less"%}.index-widget-nbserachbox {
  padding: 16px 0 0 0;
}
.index-widget-nbserachbox #search-more-nearby {
  margin-bottom: 8px;
  padding-left: 8px;
  font-size: 14px;
  color: #3B3B3B;
}
.index-widget-nbserachbox #search-more-nearby .center-name {
  color: #276adc;
}
.index-widget-nbserachbox .search-form {
  margin: 0px 8px 8px 8px;
  padding: 0 85px 0 0;
  border: 1px solid #6BB1F7;
  background: white;
  position: relative;
  -webkit-border-radius: 2px;
}
.index-widget-nbserachbox .search-form form input {
  height: 36px;
  width: 100%;
  display: block;
  border: none;
  background: none;
  padding: 0 4px 0 10px;
  color: #333;
}
.index-widget-nbserachbox .search-form form .ipt-default {
  color: #b6b6b6;
}
.index-widget-nbserachbox .search-form span {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
  height: 100%;
  width: 74px;
  color: #fff;
  border-left: 1px solid #6BB1F7;
  line-height: 36px;
  text-align: center;
  background: #6bb1f7;
}
{%/style%}<!--@fileOverview 附近搜索框 -->
<div class="index-widget-nbserachbox" id="index-widget-nbserachbox">
	{%*<p id="search-more-nearby">在 <span class="center-name">我的位置</span> 附近找</p>*%}
	<div id="search-form-container">
	    <div class="search-form">
	        <form method="get" id="search-form">
	            <input  class="ipt-default" value="输入其他分类" id="search-input" type="text"/>
	        </form>
	        <span id="search-button">搜索</span></div>
	</div>
</div>
{%script%}
    (require("index:widget/nbserachbox/nbserachbox.js")).init();
{%/script%}