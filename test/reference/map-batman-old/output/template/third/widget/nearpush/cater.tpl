{%style id="/widget/nearpush/cater.inline.less"%}.index-widget-cater {
  padding: 13px 13px 6px 13px;
}
.index-widget-cater .hd {
  position: relative;
}
.index-widget-cater .hd h2 {
  font-size: 14px;
  height: 36px;
  line-height: 38px;
  font-weight: 400;
  padding-left: 36px;
  background: url(/static/third/images/npush-icon_41fdc4d.png) 1px 5px no-repeat;
  background-size: 32px 315px;
}
.index-widget-cater .hd a {
  float: right;
  width: 71px;
  height: 28px;
  line-height: 28px;
  border: 1px solid #adadad;
  text-align: center;
  margin-top: 4px;
  color: #444D62;
  border-radius: 2px;
  box-shadow: 1px 2px 0px #f4f4f4;
  background-color: #F9F9F9;
  font-size: 13px;
}
.index-widget-cater .list {
  display: -webkit-box;
}
.index-widget-cater .list dd,
.index-widget-cater .list dt {
  margin-top: 5px;
}
.index-widget-cater .name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 85%;
}
.index-widget-cater .cmt {
  font-size: 12px;
}
.index-widget-cater .count {
  color: #ba0000;
}
.index-widget-cater .tail {
  color: #5e5e5e;
}
.index-widget-cater .list li {
  width: 33.33%;
  margin: 12px 0 16px;
  padding: 0;
  border: none;
}
.index-widget-cater .a-img {
  position: relative;
  display: block;
  height: 66px;
  width: 89px;
  padding: 1px;
  border: 1px solid #b9b9b9;
}
.index-widget-cater .a-img img {
  width: 89px;
  height: 66px;
}
.index-widget-cater .icon {
  position: absolute;
  display: inline-block;
  height: 24px;
  width: 15px;
  background: url(/static/third/images/npush-icon_41fdc4d.png) no-repeat;
  background-size: 32px 340px;
  z-index: 11;
  top: 1px;
  right: 1px;
}
.index-widget-cater .groupon-icon {
  background-position: 0 -316px;
}
.index-widget-cater .sale-icon {
  background-position: -17px -316px;
}
{%/style%}<!-- @fileOverview 周边推荐美食widget容器 by jican -->
<div class="index-widget-cater"></div>
{%script%}
    (require("third:widget/nearpush/cater.js")).init("{%$pagename%}");
{%/script%}