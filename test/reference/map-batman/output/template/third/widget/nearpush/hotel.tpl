{%style id="/widget/nearpush/hotel.inline.less"%}.index-widget-hotel {
  padding: 13px 13px 6px 13px;
}
.index-widget-hotel button {
  border: none;
  background: transparent;
  margin: 0;
  padding: 0;
}
.index-widget-hotel .hd {
  position: relative;
}
.index-widget-hotel .hd h2 {
  font-size: 14px;
  height: 36px;
  line-height: 38px;
  font-weight: 400;
  padding-left: 36px;
  background: url(/static/third/images/npush-icon_41fdc4d.png) 0 -28px no-repeat;
  background-size: 32px 315px;
}
.index-widget-hotel .hd a {
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
.index-widget-hotel .list li {
  margin: 12px 0 16px 0;
  padding: 0;
  border: none;
}
.index-widget-hotel .list dl {
  overflow: hidden;
  padding-left: 8px;
}
.index-widget-hotel .list dt,
.index-widget-hotel .list dd {
  margin-top: 6px;
}
.index-widget-hotel .a-img {
  height: 66px;
  width: 89px;
  padding: 1px;
  border: 1px solid #b9b9b9;
  float: left;
}
.index-widget-hotel .a-img img {
  width: 89px;
  height: 66px;
}
.index-widget-hotel .name {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 80%;
  font-size: 15px;
}
.index-widget-hotel .addr {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 90%;
  color: #4d4d4d;
  font-size: 13px;
}
.index-widget-hotel .price {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 14px;
  padding-left: 14px;
}
.index-widget-hotel .cmt {
  font-size: 12px;
}
.index-widget-hotel .count {
  color: #ba0000;
}
.index-widget-hotel .tail {
  color: #5e5e5e;
}
.index-widget-hotel .bar {
  margin-top: 8px;
  display: -webkit-box;
  width: 100%;
}
.index-widget-hotel .btn {
  text-align: center;
}
.index-widget-hotel .tel {
  -webkit-box-flex: 7;
  border: 1px solid #AFBEC8;
  border-radius: 3px;
  box-shadow: 1px 2px 0px #f4f4f4;
  background: -webkit-gradient(linear, 0 100%, 0 0, from(#f6f8f9), to(#fdfdfd));
}
.index-widget-hotel .tel a {
  height: 29px;
  line-height: 29px;
  text-decoration: none;
  color: #347e16;
  font-size: 16px;
  display: block;
}
.index-widget-hotel .icon {
  display: inline-block;
  height: 16px;
  width: 16px;
  margin-right: 10px;
  vertical-align: middle;
  margin-top: -4px;
  border: none;
  background: url(/static/third/images/npush-icon_41fdc4d.png) 0 -28px no-repeat;
}
.index-widget-hotel .icon.tel {
  background-position: 0px -273px;
  background-size: 32px 315px;
}
.index-widget-hotel .order {
  -webkit-box-flex: 2;
  border: 1px solid #e9c58c;
  border-radius: 3px;
  margin-left: 9px;
  background: -webkit-gradient(linear, 0 100%, 0 0, from(#ffedd2), to(#fef2df));
}
.index-widget-hotel .order a {
  height: 29px;
  line-height: 29px;
  color: #c16c20;
  font-size: 15px;
  display: block;
}
{%/style%}<!-- @fileOverview 周边推荐美食widget容器 by jican -->
<div class="index-widget-hotel"></div>
{%script%}
    (require("third:widget/nearpush/hotel.js")).init("{%$pagename%}");
{%/script%}