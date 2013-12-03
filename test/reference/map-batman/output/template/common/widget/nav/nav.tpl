{%style id="/widget/nav/nav.inline.less"%}/**
 * @fileoverview 返回按钮css
 */
.common-widget-nav {
  background: #fff;
  padding: 0px;
  z-index: 10;
  height: 51px;
  position: relative;
  -moz-box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.18);
  -webkit-box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.18);
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.18);
}
.common-widget-nav {
  /* 查看地图按钮 */

}
.common-widget-nav > div {
  display: inline-block;
}
.common-widget-nav .base-btn {
  height: 51px;
  line-height: 51px;
  border-right: 1px solid #D4D4D4;
  position: absolute;
  height: 100%;
}
.common-widget-nav .meau-btn {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 100%;
  width: 54px;
  border-left: 1px solid #D4D4D4;
  border-right: 0px;
}
.common-widget-nav .meau-btn a {
  display: inline-block;
  height: 100%;
  color: #373a3d;
  width: 54px;
  text-align: center;
}
.common-widget-nav .meau-btn span {
  color: #4B8FF9;
  position: relative;
  top: -2px;
}
.common-widget-nav .meau-btn em {
  background: url(/static/common/images/downarrow_c1a0c8f.png);
  background-size: 6px 3px;
  width: 6px;
  height: 3px;
  position: absolute;
  top: 32px;
  left: 25px;
}
.common-widget-nav .back-btn {
  position: absolute;
  width: 50px;
}
.common-widget-nav .back-btn:before {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbBJREFUeNpizMwrYSADsANxFxAnATETEC8B4gIg/k6qQSzkWM7ExLTx379/7khiaSzMzCx//v5NJtUwJipYDgNx5AQlE5UsZ2BmYWGmpQPwWg4CZiZGv2nlAIKWa2mqMwQH+M6lhQOIsjwtKX4XGxtrAbUdQIrlfln5pb+o6QBSLf/JQCZgGkjLsTmArpajO4DuliM7YEAsBwFGYGXECbR8PT7LqQw+APFiIAbVgr+YgJXIFDpaDgICQJzLzMzcDouCOIYBAExMjDkQmpmJZSAcwMLCwgp2gKmx0Z+BcICVhRm45GQK8vdZBErh9ALcXFwMTg62DL5e7lPAIcHJyZEDzF4ys+YtdLt2/SZOjdpaGgzpyfGgoKPUDe+AeBEQV8GyIcO0id3sv3793kTIEcDsuhOYY/yBTKqVA+CCCFSwgAoYUEGDLzpA2RVUYEEbpdRzwEA6AqUyGghHYFTH9HYE1gYJPR2Bs0lGoiM2AZlsVG+UkuAIN2Dl0k+TZjmxjmBkZEyhWceEGEcAHcBK064ZIUeYGhv8pXXfEMURrs4ODOzs7PDKJSTQbwk5DgAIMACqPOUcF+B9cAAAAABJRU5ErkJggg==") no-repeat;
  background-size: 16px 16px;
  content: '';
  position: absolute;
  top: 16px;
  left: 18px;
  width: 40px;
  height: 30px;
}
.common-widget-nav .title {
  width: 100%;
  line-height: 50px;
  font-size: 17px;
  color: #373a3d;
  text-align: center;
  font-weight: normal;
}
.common-widget-nav .title span {
  margin: 0 70px;
  color: #373a3d;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.common-widget-nav .back-btn:active {
  background: #e7e7e7;
}
.common-widget-nav .meau-btn:active {
  background: #e7e7e7;
}
{%/style%}{%* @fileoverview 通用返回条模板 *%}
{%if $pageType eq "detail"%}
    {%if !empty($data.content.ext.src_name)%}
        {%$srcname = $data.content.ext.src_name%}
    {%else%}
        {%$srcname = ""%}
    {%/if%}
    {%if !empty($data.content.name)%}
        {%$bname = $data.content.name%}
    {%else%}
        {%$bname = ""%}
    {%/if%}
{%else%}
    {%$srcname = ""%}
    {%$bname = ""%}
{%/if%}
<div class="common-widget-nav" >
    {%if !isset($noBack)%}
        <div jsaction="jump" class="base-btn back-btn needsclick">&nbsp;</div>
    {%/if%}
    <div class="title">
        {%if isset($widgetTitle)%}
            {%widget name="$widgetTitle"%}
        {%else%}
            <span>{%$title%}</span>
        {%/if%}
    </div>
    {%if isset($mapLink)%}
    <div class="base-btn meau-btn">
        <a href="{%$mapLink%}" data-log="{code:{%$COM_STAT_CODE.NAV_VIEW_MAP%}, pagetype:'{%$pageType%}', wd: '{%$title%}', name: '{%$bname%}', srcname: '{%$srcname%}' }">
            <span class="rl_icon" id="nav_go_txt">地图</span>
            <em></em></a>
    </div>
    {%/if%}
    {%if isset($exchangeLink)%}
        <div class="base-btn meau-btn">
            <a href="/mobile/webapp/user/exchange/force=simple" class="needsclick" data-log="{code:{%$COM_STAT_CODE.STAT_USER_TO_EXCHANGE_CLICK%}}"><span>兑换</span>
                <em></em>
            </a>
        </div>
    {%/if%}
    {%if isset($ruleLink)%}
        <div class="base-btn meau-btn">
            <a href="/mobile/webapp/user/rule/force=simple" class="needsclick" data-log="{code:{%$COM_STAT_CODE.STAT_USER_TO_RULE_CLICK%}}"><span>详情</span>
                <em></em>
            </a>
        </div>
    {%/if%}
    {%if isset($logoutLink)%}
        <div class="base-btn meau-btn">
            <a id="logout"><span>退出</span>
                <em></em>
            </a>
        </div>
    {%/if%}
    {%if isset($addcommentLink)%}
        <div class="base-btn meau-btn place-addcomment">
            <a id="J_submitComment"><span class="rl_icon" id="nav_go_txt">完成</span>
            <em></em></a>
        </div>
    {%/if%}
    
</div>
{%if ($page_config.topbanner == 1)%}
{%widget name="common:widget/topbanner/topbanner.tpl"%}
{%/if%}
{%script%}
    var isReplace = {%$isReplace|default:0%} ? true : false;
    (require("common:widget/nav/nav.js")).init(isReplace);
{%/script%}