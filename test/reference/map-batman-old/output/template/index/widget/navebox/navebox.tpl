{%style id="/widget/navebox/navebox.inline.less"%}.index-widget-navebox {
  /*
     * @fileoverview 搜索框样式 选择器命名均以se开头
     * author: jican
     * date: 2013/01/22
     */

  /* 搜索框Tab切换 start */

  /* 搜索框Tab切换 end */

  /* 搜索框内框 start */

  /* 我的位置页面，增加10px上边距，否则会和阴影重叠 -by jz */

}
.index-widget-navebox .pagebody {
  /*min-height: 563px;*/

}
.index-widget-navebox #se_box {
  background-color: #FFF;
}
.index-widget-navebox .se-tabgroup {
  height: 50px;
  line-height: 50px;
  background-color: #F2F2F2;
  font-size: 15px;
  display: -webkit-box;
}
.index-widget-navebox .se-tabgroup .on {
  background-color: #252729;
  color: #4ec2ff;
  font-size: 15px;
}
.index-widget-navebox .se-tabgroup {
  height: 50px;
  line-height: 50px;
  background-color: #F2F2F2;
  font-size: 15px;
  display: -webkit-box;
}
.index-widget-navebox .se-tab {
  color: #D5D5D5;
  text-align: center;
  color: #000;
  background-color: #F2F2F2;
  border-bottom: 1px solid #D4D4D4;
  display: block;
  -webkit-box-flex: 1;
}
.index-widget-navebox .se-tab .new-se-tab-icon {
  background: url(/static/index/images/tabicon_600f854.png) no-repeat;
  background-size: 35px 167px;
  display: inline-block;
  margin-right: 9px;
  vertical-align: middle;
  margin-top: -5px;
  background-position: 0 -18px;
}
.index-widget-navebox .se-tab .icon-l {
  height: 35px;
  width: 12px;
  background-position: 0 10px;
}
.index-widget-navebox .se-tab .icon-m {
  height: 30px;
  width: 12px;
  background-position: 0 -18px;
}
.index-widget-navebox .se-tab .icon-r {
  height: 30px;
  width: 14px;
  background-position: 0 -43px;
}
.index-widget-navebox .se-tab-nav {
  background-color: #FFF;
  color: #000;
  border-bottom: 1px solid #FFF;
  border-left: 1px solid #D4D4D4;
}
.index-widget-navebox .se-tab.se-tab-map {
  border-right: 1px solid #D4D4D4;
}
.index-widget-navebox .location-area {
  background-color: #ededed;
}
.index-widget-navebox #mylocation-thumb .location-area {
  padding-top: 10px;
}
.index-widget-navebox .location-area .poipic-wrapper {
  padding: 0px 8px 8px 8px;
}
.index-widget-navebox .pad .poipic-area {
  display: none;
}
.index-widget-navebox .poipic-area {
  border: 1px solid #dadada;
  position: relative;
}
.index-widget-navebox #mylocation-thumb .poipic-area {
  display: block;
}
.index-widget-navebox .location-area .poipic-wrapper .poipic {
  position: relative;
  height: 101px;
  /*border:1px solid #dadada;*/

  background-color: #ffffff;
  padding: 2px;
}
.index-widget-navebox .location-area .poipic-wrapper .pic-area {
  /*background-color:#e5e3cf;*/

  height: 100%;
  width: 100%;
}
.index-widget-navebox .location-area .poipic .map-btn {
  position: absolute;
  right: 0px;
  bottom: 0px;
  height: 31px;
  width: 31px;
  background-color: white;
}
.index-widget-navebox .location-area .poipic .map-btn b {
  display: inline-block;
  margin: 7px 0 0 7px;
  height: 17px;
  width: 17px;
  background-position: 0px -52px;
}
.index-widget-navebox .location-area .locbar {
  position: relative;
  padding: 4px 13px 0px;
  border-bottom: 1px solid #a7a7a7;
}
.index-widget-navebox .location-area .locbar-area {
  height: 33px;
  line-height: 33px;
  width: 100%;
}
.index-widget-navebox .location-area .locbar-area .loc-icon {
  position: absolute;
  top: 13px;
  left: 15px;
  display: inline-block;
  width: 11px;
  height: 15px;
  background-position: 0px -73px;
}
.index-widget-navebox .location-area .in-btn {
  position: absolute;
  top: 6px;
  right: 17px;
  display: inline-block;
  width: 65px;
  height: 27px;
  line-height: 27px;
  text-align: center;
  background-color: #f5f5f5;
  border: 1px solid #b2b2b3;
  font-size: 12px;
  color: #535353;
  border-radius: 2px;
}
.index-widget-navebox .locbar .active {
  background-color: #efeeee;
}
.index-widget-navebox .location-area .poipic .geo-btn {
  position: absolute;
  left: 6px;
  bottom: 6px;
  height: 36px;
  width: 36px;
  background-color: #f4f4f4;
  border: 1px solid #83837c;
  border-radius: 5px;
  -webkit-box-shadow: 1px 1px 1px #dddddd;
  /*-webkit-box-shadow:inset 0px 0px 4px #157cdb;*/

}
.index-widget-navebox .location-area .poipic .geo-btn b {
  display: inline-block;
  margin: 6px 0 0 7px;
  height: 23px;
  width: 23px;
  background-position: 0px 0px;
}
.index-widget-navebox .location-area .poipic .geo-fail {
  background-color: #f4f4f4;
}
.index-widget-navebox .location-area .poipic .geo-fail b {
  background-position: 0px 0px;
}
.index-widget-navebox .location-area .poipic .geo-btn.active {
  background-color: #eeeeee;
}
.index-widget-navebox .location-area .poipic .geo-btn.active b {
  background-position: 0px 0px;
}
.index-widget-navebox .location-area .view-map-btn {
  padding-top: 41px;
  color: #4197d3;
  font-size: 14px;
  margin: 0 auto;
}
.index-widget-navebox .location-area .mypoi-txt {
  color: #5a5a5a;
  font-size: 12px;
  padding-left: 24px;
}
.index-widget-navebox .error-cnt {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  text-align: center;
}
.index-widget-navebox #route-pic .location-area {
  background-color: #F9F9F9;
  border-bottom: none;
  border-top: 1px solid #a7a7a7;
}
.index-widget-navebox #route-pic .location-area .poipic-wrapper {
  padding: 8px;
}
{%/style%}<div class="pagebody index-widget-navebox">
    <div id="se_box" class="se-box">
        <div id="se_tabgroup" class="se-tabgroup clearfix">
            <!--<a index="0" id="se_tab_poi" class="new-se-tab"  href="/mobile/webapp/index/index/">
                搜索
            </a>
            <a index="1" id="se_tab_bus" class="new-se-tab new-se-tab-r on" href="">路线</a>-->
            <a index="0" class="se-tab se-tab-map" href="/mobile/#index/index/foo=bar/vt=map"><span class="new-se-tab-icon icon-l"></span>地图</a>
            <a index="1" class="se-tab se-tab-poi" href="/mobile/webapp/index/index/force=simple"><span class="new-se-tab-icon icon-m"></span>周边</a>
            <a index="2" class="se-tab se-tab-nav" href="javascript:void(0);" jsaction="toNavSearch"><span class="new-se-tab-icon icon-r"></span>路线</a>
        </div>
         {%widget name="index:widget/seacrhnave/seacrhnave.tpl"%}
    </div>
</div>