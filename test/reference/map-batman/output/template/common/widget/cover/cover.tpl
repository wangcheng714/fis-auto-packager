{%style id="/widget/cover/cover.inline.less"%}.common-widget-cover {
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: #41464f;
  color: #ffffff;
  height: 100%;
  width: 100%;
  z-index: 9999;
  font-family: "Microsoft YaHei,arial,helvetica,sans-serif";
  min-height: 420px;
}
.common-widget-cover a {
  color: #fff;
  font-family: "Microsoft YaHei,arial,helvetica,sans-serif";
}
.common-widget-cover .ipad-c {
  background-color: rgba(0, 0, 0, 0.6);
}
.common-widget-cover .cover-container {
  height: 423px;
  width: 100%;
  position: absolute;
}
.common-widget-cover .ipad-c .cover-container {
  width: 320px;
  margin: 163px auto;
  background: #d9e5ea;
  height: 480px;
  position: relative;
}
.common-widget-cover .ipad-c .cover-close {
  position: relative;
  top: -12px;
  left: 12px;
  width: 26px;
  height: 24px;
  float: right;
  background: url(/static/common/images/ipad_close_276c463.png) no-repeat 0 0;
  background-size: 24px;
}
.common-widget-cover .app-contain {
  position: relative;
  width: 303px;
  height: 306px;
  background: url(/static/common/images/cover_94801d5.png) no-repeat 15px 91px;
  background-size: 280px 202px;
  margin: 0 auto;
}
.common-widget-cover .ipad-c .app-contain {
  color: #1f4a5a;
  height: 336px;
  background-position-y: 112px;
}
.common-widget-cover .app-contain .title-1 {
  position: absolute;
  font-size: 22px;
  width: 80%;
  bottom: 236px;
  margin-left: 18px;
}
.common-widget-cover .app-contain .title-1 span {
  color: #fff498;
}
.common-widget-cover .ipad-c .title-1 span {
  color: #e95e01;
}
.common-widget-cover .app-contain .title-2 {
  position: absolute;
  font-size: 20px;
  width: 80%;
  bottom: 166px;
  margin-left: 18px;
}
.common-widget-cover .app-contain .title-2 span {
  color: #80cdff;
}
.common-widget-cover .ipad-c .title-2 span {
  color: #1f4a5a;
}
.common-widget-cover .app-download {
  background-color: #00adf2;
  border-radius: 4px;
  height: 42px;
  line-height: 42px;
  width: 83%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 16px;
  display: block;
}
.common-widget-cover .ipad-c .app-download {
  background-color: #137ebc;
}
.common-widget-cover .app-download span {
  width: 18px;
  height: 18px;
  background: url(/static/common/images/download_d561fc2.png) 0 0 no-repeat;
  background-size: 17px 18px;
  display: inline-block;
  position: relative;
  top: 3px;
}
.common-widget-cover .to-webapp {
  background: #39414e;
  border-radius: 4px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  width: 83%;
  margin: 12px auto;
  border: #5a5f67 solid 1px;
  font-size: 16px;
}
.common-widget-cover .ipad-c .to-webapp {
  background-color: #a7c9d6;
  border: 0px;
}
{%/style%}<!--@fileOverview 下载客户端封面 -->
<div class="common-widget-cover" id ="body-cover" style="display:none;">
    <div class="cover-container" id="cover-container">
        <div class="cover-close" id="cover-close"></div>
        <div class='app-contain'>
            <div class='title-1'>
                <p>用百度地图客户端<br/>流量省<span>90%</span></p>
            </div>
            <div class='title-2'>
                <p>下载<span>离线数据</span>包<br/>轻松导航  飞速浏览</p>
            </div>
        </div>
        <p><a class="app-download" id = "app-download" href="" target="_blank"><span class="download-bg"></span><em class="download_open" id="download_open">下载</em>客户端</a></p>
        <div class="to-webapp" id = "to-webapp">访问网页版</div>
    </div>
</div>
{%script%}
    var cover = require("common:widget/cover/cover.js");
    try{
        cover.netype = {%$netype%};
    }catch(e){
        cover.netype = 0;
    }
    cover.init();
{%/script%}