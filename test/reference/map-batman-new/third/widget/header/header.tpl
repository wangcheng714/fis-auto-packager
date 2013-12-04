<!-- @fileOverview 头部模板 -->
<header class="common-widget-header">
    <div class="nav">
        <div class="side-l clearfix">
            <span class="btn-l"><a href="{%$commonUrl.header.wise%}" target="_blank">百度</a></span>
            <span class="btn-r"><a href="{%$commonUrl.header.switch_product%}">&nbsp;</a></span>
        </div>
        <div class="title"><span class="txt">百度地图</span></div>
        {%if $hideRight != true%}
            <div class="side-r">
                <a jsaction="jump" data-log="{code:'{%$COM_STAT_CODE.HEADER_BACKTO_INDEX%}'}" href="/mobile/webapp/index/index" class="hb-wrapper">
                    <span class="index-loc-pic home-btn"></span>
                </a>
                <a href="javascript:void(0)" class="sb-wrapper">
                    <span class="index-loc-pic srh-btn"></span>
                </a>
            </div>
        {%/if%}
    </div>
</header>
