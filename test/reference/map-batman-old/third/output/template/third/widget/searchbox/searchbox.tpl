{%style id="/widget/searchbox/searchbox.inline.less"%}.index-widget-searchbox{}.index-widget-searchbox .se-tabs{height:40px;line-height:40px;background-color:#2d2f31;display:-webkit-box}.index-widget-searchbox .se-tab{display:block;color:#d5d5d5;text-align:center;font-size:14px;background-color:#2d2f31;-webkit-box-flex:1}.index-widget-searchbox .se-tab-poi{color:#4ec2ff;font-size:15px;background-color:#252729}.index-widget-searchbox .se-tab-nav{border-left:1px solid #3f4245}.index-widget-searchbox .se-form{padding:8px;background-color:#ededed;position:relative}.index-widget-searchbox .se-wrap{border:1px solid #9a9a9a;background:#fff;position:relative;height:36px}.index-widget-searchbox .se-inner{display:-webkit-box}.index-widget-searchbox .se-input{-webkit-box-flex:1;position:relative}.index-widget-searchbox .se-input-poi{color:#333;border:0;background:0;padding:5px;width:100%;height:26px}.index-widget-searchbox .se-btn{height:36px;width:49px;border-left:1px solid #9a9a9a;background:-webkit-gradient(linear,0 100%,0 0,from(#e7e7e7),to(#f5f5f5))}.index-widget-searchbox .se-btn b{display:inline-block;width:23px;height:23px;margin-top:6px;margin-left:14px;background:url(/static/third/images/search_ico_89dbc92.png) no-repeat;background-size:23px 23px}.index-widget-searchbox .se-city{display:-webkit-box;width:68px;height:36px;-webkit-box-align:center;z-index:10000;line-height:36px;left:0}.index-widget-searchbox .se-city-wd{display:inline-block;height:22px;line-height:22px;white-space:nowrap;max-width:45px;overflow:hidden;text-overflow:ellipsis;font-size:14px;color:#343434;-webkit-border-radius:3px;padding:0 20px 0 5px;position:relative}.index-widget-searchbox .se-city-wd:after{content:"";position:absolute;width:7px;height:4px;top:9px;right:8px;background:url("data:image/gif;base64,R0lGODlhDQAHAIABAJqamv///yH5BAEAAAEALAAAAAANAAcAAAIPhI8XyeGs3GtSpoojrmAXADs=") no-repeat;background-size:7px 4px}{%/style%}
<div class="index-widget-searchbox">
<div class="se-tabs">
<a class="se-tab se-tab-poi" href="javascript:void(0);">搜索</a>
<a class="se-tab se-tab-nav" href="javascript:void(0);" jsaction="toNavSearch">路线</a>
</div>
<form class="se-form">
<div class="se-wrap">
<div class="se-inner">
<div class="se-city">
<a class="se-city-wd" href="/mobile/webapp/index/setmylocation/foo=bar/" data-log="{code:{%$STAT_CODE.STAT_SWITCH_CITY|f_escape_xml%}}">全国</a>
<em></em>
</div>
<div class="se-input">
<input key="place" type="text" class="se-input-poi" id="se-input-poi"/>
</div>
<div class="se-btn" id="se-btn" user-data="se-btn"><b></b></div>
</div>
</div>
</form>
</div>
{%script%}
    (require("third:widget/searchbox/searchbox.js")).init();
{%/script%}