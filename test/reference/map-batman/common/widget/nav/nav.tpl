{%* @fileoverview 通用返回条模板 *%}
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
    (require("./nav.js")).init(isReplace);
{%/script%}