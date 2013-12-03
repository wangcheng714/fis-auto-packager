{%* @file 列表页模板 *%}

{%if $data.result.type eq 41%}
    {%$content_data = $data.addrs%}
    {%$wd = ''%}
{%else%}
    {%$content_data = $data.content%}
    {%$wd = $data.content.ext.src_name%}
{%/if%}

<div class="place-widget-movielist">
    <div class="list-wrapper">
        <ul class="place-list {%if !$data.listInfo.isShowAll %}acc-list{%/if%}">
            {%foreach item=list_item from=$content_data %} 
                {%if ($list_item.ext && $list_item.ext.detail_info)%}
                    {%$extd=$list_item.ext.detail_info%}
                {%/if%}
                <li jsaction="jump" data-href="{%$list_item._detailUrl%}" {%if !$data.listInfo.isShowAll && $list_item.acc_flag == 0%}class="acc-item"{%/if%}>
                    <h4>
                        <strong class="rl_li_title">{%htmlspecialchars_decode($list_item.name)%}</strong>
                        <span>
                            {%if $list_item._hasGroupon %}
                                <em class="place_groupon_icon"></em>
                            {%/if%}
                            {%if $list_item._hasPremium %}
                                <em class="premium_new premium_sale detail_list_icon"><div></div></em>
                            {%/if%}
                            {%if $list_item._isLifeBookable%}
                                <em class="place_seat_icon"></em>
                            {%/if%}
                        </span>
                    </h4>
                    {%if $list_item._isLifeBookable %}
                        <p class="addr">可在线订票，现可观<span style="color:#E80F0F;">{%$extd.movie_film_count%}</span>部电影，共<span style="color:#E80F0F;">{%$extd.movie_time_count%}</span>场</p>
                    {%elseif $list_item._isMovieBookable%}
                        <p class="addr">可查看影讯，现可观<span style="color:#E80F0F;">{%$extd.movie_film_count%}</span>部电影，共<span style="color:#E80F0F;">{%$extd.movie_time_count%}</span>场</p>
                    {%else%}
                        <p class="addr">{%htmlspecialchars_decode($list_item.addr)%}</p>
                    {%/if%}

                    {%* 路线类的点 不显示路线搜索按钮*%}
                    {%if $list_item.poiType != 2 && $list_item.poiType != 4%}
                        <span class="mkr-icon marker-{%counter%}"></span>
                    {%elseif $list_item.poiType == 2%}
                        <span class="mkr-icon marker-bus"></span>
                    {%elseif $list_item.poiType == 4%}
                        <span class="mkr-icon marker-sub"></span>
                    {%/if%}

                    {%if $data.listInfo.isSameCity %}
                        <span class="dis">{%$list_item.dis%}</span>
                    {%/if%}
                    <span class="opt-icon"><em class="rl_go_dtl"></em></span>
                </li>
            {%/foreach%}
        </ul>
        <script type="text/javascript">PDC && PDC.first_screen && PDC.first_screen();</script>
        {%if !$data.listInfo.isShowAll && $data.listInfo.total > 1 %}
            <div class="showall-txt" id="place-widget-movielist-showall">
                <span>点击查看全部{%$data.listInfo.total%}条结果</span><span class="showall_icon"></span>
            </div>
        {%/if%}
        {%if $data.pageInfo.hasPage && $data.result.type != 41%}
            <div class="pagenav" style="display:{%if $data.listInfo.isShowAll %}block{%else%}none{%/if%}">
                <span data-type="pre" jsaction="jump" data-href="{%if $data.pageInfo.isFirst%}javascript:void(0);{%else%}{%$data.pageInfo.prevPageUrl|escape:'none'%}{%/if%}"  class="page-btn {%if $data.pageInfo.isFirst%}unclick{%/if%}">上一页</span>
                <span data-type="next" jsaction="jump" data-href="{%if $data.pageInfo.isLast%}javascript:void(0);{%else%}{%$data.pageInfo.nextPageUrl|escape:'none'%}{%/if%}"  class="page-btn {%if $data.pageInfo.isLast%}unclick{%/if%}">下一页</span>
            </div>
        {%/if%}
    </div>
</div>

{%script%}
    var listData = {
        isGenRequest : "{%$data.listInfo.isGRequest%}"
    }
    require("movielist.js").init(listData);

    //添加POI结果页的展现量
    var stat = require('common:widget/stat/stat.js');
    var wd = $('.common-widget-nav .title span').text();
    stat.addStat(STAT_CODE.PLACE_LIST_VIEW, {'wd': wd});

    var loc = require('common:widget/geolocation/location.js');
    if(loc.hasExactPoi()){
        stat.addStat(STAT_CODE.PLACE_LIST_GEO_SUC);
    }else{
        stat.addStat(STAT_CODE.PLACE_LIST_GEO_FAIL);
    }
{%/script%}
