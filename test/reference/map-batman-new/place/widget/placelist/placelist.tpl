{%* @file 列表页模板 *%}

{%$wd = $data.result.wd%}
{%if $data.result.type eq 41%}
    {%$content_data = $data.addrs%}
{%else%}
    {%$content_data = $data.content%}
{%/if%}
{%if ereg("searchFlag=([A-Za-z]+)", $smarty.server.REQUEST_URI, $regs)%}
    {%$entry = $regs[1]%}
{%/if%}

<div class="place-widget-placelist">
    <ul class="place-list {%if !$data.listInfo.isShowAll %}acc-list{%/if%}">
        {%foreach item=list_item from=$content_data %}
            {%if ($list_item.ext && $list_item.ext.detail_info)%}
                {%$extd=$list_item.ext.detail_info%}
                {%$isMovie=($list_item.new_catalog_id=="090300")%}
            {%/if%}
            {%if !empty($list_item.ext.src_name)%}
                {%$srcname = $list_item.ext.src_name%}
            {%else%}
                {%$srcname = ""%}
            {%/if%}                    

            {%*模板已经拆分,此处保留为其它行业的电影相关点用*%}
            {%if ($isMovie)%}
                <li jsaction="jump" data-href="{%$list_item._detailUrl%}" {%if !$data.listInfo.isShowAll && $list_item.acc_flag == 0%}class="acc-item"{%/if%} srcname="{%$srcname%}">
                    <div class="list-wrapper">
                        <h4 class="text-ellipsis">
                            <span class="list-tit text-ellipsis">{%htmlspecialchars_decode($list_item.name)%}</span>
                            {%if $list_item._hasGroupon %}
                                <em class="list-icon icon-groupon"></em>
                            {%/if%}
                            {%if $list_item._hasPremium %}
                                <em class="list-icon icon-premium"></em>
                            {%/if%}
                            {%if $list_item.pano %}
                                <em class="list-icon icon-streetscape"></em>
                            {%/if%}
                            {%if $list_item._isLifeBookable%}
                                <em class="icon-movieseat"></em>
                            {%/if%}
                        </h4>
                    {%if $list_item._isLifeBookable %}
                        <p class="addr text-ellipsis">可在线订票，现可观<span style="color:#E80F0F;">{%$extd.movie_film_count%}</span>部电影，共<span style="color:#E80F0F;">{%$extd.movie_time_count%}</span>场</p>
                    {%elseif $list_item._isMovieBookable%}
                        <p class="addr text-ellipsis">可查看影讯，现可观<span style="color:#E80F0F;">{%$extd.movie_film_count%}</span>部电影，共<span style="color:#E80F0F;">{%$extd.movie_time_count%}</span>场</p>
                    {%else%}
                        <p class="addr text-ellipsis">{%htmlspecialchars_decode($list_item.addr)%}</p>
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
                        <span class="list-dis">{%$list_item.dis%}</span>
                    {%/if%}
                    <em class="list-arrow"></em>
                </li>
            {%else%}
                <li jsaction="jump" data-href="{%$list_item._detailUrl%}" {%if !$data.listInfo.isShowAll && $list_item.acc_flag == 0%}class="acc-item"{%/if%}>
                    <div class="list-wrapper">
                        <h4 class="text-ellipsis">
                            {%$count = 0%}
                            {%if $list_item._hasGroupon%}{%$count = $count+1%}{%/if%}
                            {%if $list_item._hasPremium%}{%$count = $count+1%}{%/if%}
                            {%if $list_item.pano%}{%$count = $count+1%}{%/if%}
                            <span class="list-tit text-ellipsis tit-len{%$count%}">
                                {%htmlspecialchars_decode($list_item.name)%}
                            </span>
                            {%if $list_item._hasGroupon %}
                                <em class="list-icon icon-groupon"></em>
                            {%/if%}
                            {%if $list_item._hasPremium %}
                                <em class="list-icon icon-premium"></em>
                            {%/if%}
                            {%if $list_item.pano %}
                                <em class="list-icon icon-streetscape"></em>
                            {%/if%}
                            {%if $list_item._hasOriInfo %}
                                <em class="list-icon icon-gasstation"></em>
                            {%/if%}
                        </h4>
                        <p class="list-addr text-ellipsis">{%htmlspecialchars_decode($list_item.addr)%}</p>
                        <p class="list-star">
                            {%if $list_item.ext%}
                                {%$industry_list = array("hospital","house","education","scope")%}
                                {%if $list_item.ext.src_name && !in_array($list_item.ext.src_name, $industry_list) %}
                                    {%if $list_item.ext.detail_info && $list_item.ext.detail_info.overall_rating && $list_item.ext.detail_info.overall_rating != 0%}
                                        <span class="mg-mrapper text-ellipsis">
                                            <span class="star-wrapper">
                                                <span class="star-active" style="width:{%$list_item.ext.detail_info.overall_rating *10 /10* 15%}px"></span>
                                            </span>
                                        </span>
                                    {%/if%}
                                {%/if%}
                            {%/if%}
                            {%if $list_item.ext && $list_item.ext.detail_info && $list_item.ext.detail_info.comment_num %}
                                <span class="star-comment">{%$list_item.ext.detail_info.comment_num%}篇评价</span>
                            {%/if%}
                        </p>
                        <p class="list-price text-ellipsis">
                            {%* TODO 油价处理 *%}
                            {%if $list_item._hasOriInfo%}
                            {%* $list_item._oriPrice *%}
                            {%/if%}

                            {%* 景点的报价信息 *%}
                            {%if !empty($list_item.ext) && !empty($list_item.ext.detail_info)%}
                                {%if $list_item.ext.detail_info.ticket_book_flag===1 && !empty($list_item.ext.detail_info.list_min_price)%}
                                    <span class="mg-mrapper text-ellipsis">
                                        <span>今日报价</span>
                                        <span class="price-scope">￥
                                            {%$list_item.ext.detail_info.list_min_price%}
                                        </span>
                                    </span>
                                {%elseif $list_item.ext.detail_info.ticket_book_flag===2 && !empty($list_item.ext.detail_info.refer_price)%}
                                    <span class="mg-mrapper text-ellipsis">
                                        <span>参考价</span>
                                        <span class="price-scope">￥
                                            {%$list_item.ext.detail_info.refer_price%}
                                        </span>
                                    </span>
                                {%/if%}
                            {%/if%}

                            {%if $list_item._price%}
                                <span class="mg-mrapper text-ellipsis">
                                    {%if $list_item.ext.detail_info.wise_hotel_type == "1"%}
                                        <span class="price-orange">&yen;{%$list_item.ext.detail_info.wise_low_price%}</span>起
                                    {%elseif $list_item.ext.detail_info.wise_hotel_type == "2" %}
                                        团购价<span class="price-orange">&yen;{%$list_item.ext.detail_info.wise_low_price%}</span>
                                        <span class="price-tagdel">原价&yen;{%$list_item.ext.detail_info.wise_price%}</span>
                                    {%else%}
                                        {%if $list_item.ext.src_name =='hotel'%}
                                            {%$list_item._price.priceName%}<span class="price-grey">&yen;{%$list_item.ext.detail_info.wise_price%}</span>
                                        {%else%}
                                            {%$list_item._price.priceName%}：<span class="price-orange">&yen;{%$list_item._price.price%}</span>
                                            {%if $list_item._price.priceUnit%}
                                                {%$list_item._price.priceUnit%}
                                            {%/if%}
                                        {%/if%}
                                    {%/if%}
                                </span>
                            {%/if%}
                            {%if $list_item.ext && $list_item.ext.detail_info && $list_item.ext.detail_info.tag%}
                                {%if $list_item.ext.src_name == "hotel"%}
                                    {%if $list_item.ext.detail_info.aoi%}
                                        <span class="list-aoi">{%$list_item.ext.detail_info.aoi%}</span>
                                    {%/if%}
                                    {%if $list_item.ext.detail_info.category%}
                                        <span class="list-category">{%$list_item.ext.detail_info.category%}</span>
                                    {%/if%}
                                {%else%}
                                    {%$list_item.ext.detail_info.tag%}
								{%/if%}
                            {%/if%}
                        </p>
                        <em class="list-arrow"></em>
                    </div>

                    {%* 路线类的点 不显示路线搜索按钮*%}
                    {%if $list_item.poiType != 2 && $list_item.poiType != 4%}
                        <div class="list-btns">
                            <a href="{%$list_item._lineSearchUrl%}" class="btn-getline"
                               data-log="{code:{%$STAT_CODE.PLACE_LIST_ROUTE_CLICK%}, wd:'{%$wd%}', name: '{%htmlspecialchars_decode($list_item.name)%}'}">
                                <span class="btn-inner">路线</span>
                            </a>
                            {%if $list_item.tel %}
                                {%$tel_data = explode('，', $list_item.tel)%}
                                <a class="btn-tel" data-tel="{%$tel_data[0]%}" href="tel:{%$tel_data[0]%}"
                                   data-log="{code:{%$STAT_CODE.PLACE_LIST_TELEPHONE_CLICK%}, wd:'{%$wd%}', name: '{%htmlspecialchars_decode($list_item.name)%}'}">
                                    <span class="btn-inner"><b class="btn-tel-icon"></b>{%$tel_data[0]%}</span>
                                </a>
                            {%/if%}
                            {%if $list_item._isHotelBookable%}
                                <a href="{%$list_item._hotelBookUrl%}" class="btn-book" content="place/hotelbook/qt=otaroom"
                                   data-log="{code:{%$STAT_CODE.PLACE_LIST_BOOKBTN_CLICK%}, wd:'{%$wd%}', name: '{%htmlspecialchars_decode($list_item.name)%}', srcname: 'hotel'}"><span class="btn-inner">预订</span></a>
                            {%/if%}

                            {%if $list_item._isLifeBookable%}
                                <a href="javascript:void(0)" class="btn-book">订座</a>
                            {%elseif $list_item._isMovieBookable%}
                                <a href="javascript:void(0)" class="btn-book">影讯</a>
                            {%/if%}

                            {%* 景点的预定接入 *%}
                            {%if !empty($list_item.ext)%}
                                {%if $list_item.ext.detail_info.ticket_book_flag===1%}
                                    <a href="javascript:void(0)" class="btn-book"
                                       data-log="{code:{%$STAT_CODE.PLACE_LIST_BOOKBTN_CLICK%}, wd:'{%$wd%}', name: '{%htmlspecialchars_decode($list_item.name)%}, srcname: 'scope'}">预定</a>
                                {%/if%}
                            {%/if%}
                        </div>
                        <span class="mkr-icon marker-{%counter%}"></span>
                    {%elseif $list_item.poiType == 2%}
                        <span class="mkr-icon marker-bus"></span>
                    {%elseif $list_item.poiType == 4%}
                        <span class="mkr-icon marker-sub"></span>
                    {%/if%}
                    {%if $data.listInfo.isSameCity %}
                        <span class="list-dis">{%$list_item.dis%}</span>
                    {%/if%}
                </li>
            {%/if%}
        {%/foreach%}
    </ul>
    <script type="text/javascript">PDC && PDC.first_screen && PDC.first_screen();</script>
    {%if !$data.listInfo.isShowAll && $data.listInfo.total > 1 %}
        <div class="showall-txt" id="place-widget-placelist-showall">
            <span>点击查看全部{%$data.listInfo.total%}条结果</span><span class="showall-icon"></span>
        </div>
    {%/if%}
    {%if $data.pageInfo.hasPage && $data.result.type != 41%}
        <div class="list-pagenav" style="display:{%if $data.listInfo.isShowAll %}block{%else%}none{%/if%}">
            <span data-type="pre" jsaction="jump" data-url="{%if $data.pageInfo.isFirst%}javascript:void(0);{%else%}{%$data.pageInfo.prevPageUrl|escape:'none'%}{%/if%}"  class="page-btn {%if $data.pageInfo.isFirst%}unclick{%/if%}">上一页</span>
            <span data-type="next" jsaction="jump" data-url="{%if $data.pageInfo.isLast%}javascript:void(0);{%else%}{%$data.pageInfo.nextPageUrl|escape:'none'%}{%/if%}"  class="page-btn {%if $data.pageInfo.isLast%}unclick{%/if%}">下一页</span>
        </div>
    {%/if%}
</div>

{%script%}
    var listData = {
    isGenRequest : "{%$data.listInfo.isGRequest%}"
    }
    require("placelist.js").init(listData);

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
