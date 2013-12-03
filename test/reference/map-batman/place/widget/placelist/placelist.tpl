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
    <div class="list-wrapper">
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
                {%else%}
                    <li jsaction="jump" data-href="{%$list_item._detailUrl%}" {%if !$data.listInfo.isShowAll && $list_item.acc_flag == 0%}class="acc-item"{%/if%} srcname="{%$srcname%}">
                    <h4>
                        <strong class="rl_li_title">{%htmlspecialchars_decode($list_item.name)%}</strong>
                        <span>
                            {%if $list_item._hasGroupon %}
                                <em class="place_groupon_icon"></em>
                            {%/if%}
                            {%if $list_item._hasPremium %}
                                <em class="premium_new premium_sale detail_list_icon"><div></div></em>
                            {%/if%}

                            {%if $list_item._hasOriInfo %}
                                <em class="gas_station detail_list_icon"><div></div></em>
                            {%/if%}
                            {%if $list_item.pano == 1%}
                                <em class="place_streetscape_icon"></em> 
                            {%/if%}
                        </span>
                    </h4>
                    <p class="addr">{%htmlspecialchars_decode($list_item.addr)%}</p>
                    <p class="fixforempty star">
                        {%if $list_item.ext && $list_item.ext.detail_info && $list_item.ext.detail_info.overall_rating && $list_item.ext.detail_info.overall_rating != 0%}
                            <span class="sm star_wrapper">
                                <span class="star_box">
                                    <span class="star_scroe" style="width:{%$list_item.ext.detail_info.overall_rating *10 /10* 15%}px"></span>
                                </span>
                            </span>
                        {%/if%}
                        {%if $list_item.ext && $list_item.ext.detail_info && $list_item.ext.detail_info.comment_num %}
                            <span class="sm2 comment">{%$list_item.ext.detail_info.comment_num%}篇评价</span>
                        {%/if%}
                    </p>
                    <p class="price">
                        {%* TODO 油价处理 *%}
                        {%if $list_item._hasOriInfo%}
                            {%* $list_item._oriPrice *%}
                        {%/if%}
                        

                        {%* 景点的报价信息 *%}
                        {%if !empty($list_item.ext) && !empty($list_item.ext.detail_info)%}
                            {%if $list_item.ext.detail_info.ticket_book_flag===1 && !empty($list_item.ext.detail_info.list_min_price)%}
                            <span>今日报价</span>
                            <span class="scope-price">￥
                                {%$list_item.ext.detail_info.list_min_price%}
                            </span>
                            {%elseif $list_item.ext.detail_info.ticket_book_flag===2 && !empty($list_item.ext.detail_info.refer_price)%}
                                <span>参考价</span>
                                <span class="scope-price">￥
                                    {%$list_item.ext.detail_info.refer_price%}
                                </span>
                            {%/if%}
                        {%/if%}

                        {%if $list_item._price%}
                            {%if $list_item.ext.detail_info.wise_hotel_type == "1"%}
                                    <span class="sm">
                                        <span style="color:#f43f00; margin-right: 3px;font-weight:bold;">&yen;{%$list_item.ext.detail_info.wise_low_price%}</span>起
                                    </span>
                                {%elseif $list_item.ext.detail_info.wise_hotel_type == "2" %}
                                     <span style="display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; vertical-align: middle;">团购价
                                    <span style="color:#f43f00; margin-right: 10px;font-weight: bold;">&yen;{%$list_item.ext.detail_info.wise_low_price%}</span>

                                    <span style="color:#a6a6a6; text-decoration: line-through;">原价<span style="margin-left:4px;">&yen;{%$list_item.ext.detail_info.wise_price%}</span></span></span>
                                {%else%}
                                    {%if $list_item.ext.src_name =='hotel'%}
                                    <span class="sm">
                                        {%$list_item._price.priceName%}
                                        <span style="color:#5e5e5e;font-weight:bold;">&yen;{%$list_item.ext.detail_info.wise_price%}</span>
                                    </span>
                                    {%else%}
                                        {%$list_item._price.priceName%}：
                                        <span style="color:#c93230">&yen;{%$list_item._price.price%}</span>
                                        {%if $list_item._price.priceUnit%}
                                            {%$list_item._price.priceUnit%}
                                        {%/if%}
                                    {%/if%}
                            {%/if%}
                        {%/if%}


                        {%if $list_item.ext && $list_item.ext.detail_info && $list_item.ext.detail_info.tag%}
                            <span class="sm2">{%$list_item.ext.detail_info.tag%}</span>
                        {%/if%}
                        </span>
                    </p>
                    {%if ($list_item.ext && $list_item.ext.detail_info && $list_item.ext.detail_info.xiecheng_sales_promotion == "1")%}
                    <p class="poi-list-onsales">促销：<span>返上再满400返25，最高再返100</span></p>
                    {%/if%}
                    {%* 路线类的点 不显示路线搜索按钮*%}
                    {%if $list_item.poiType != 2 && $list_item.poiType != 4%}
                        <div class="mod_tel">
                            <a href="{%$list_item._lineSearchUrl%}" class="btn-getline" data-log="{code:{%$STAT_CODE.PLACE_LIST_ROUTE_CLICK%}, wd:'{%$wd%}', name: '{%htmlspecialchars_decode($list_item.name)%}', entry: '{%$entry%}', srcname: '{%$srcname%}'}">
                                路线
                            </a>
                            {%if $list_item.tel %}
                                <div class="mod_tel_content">
                                    <a data-tel="{%$list_item.tel%}" href="tel:{%$list_item.tel%}">
                                        <b class="tel_icon_b" style="margin-top:-2px;vertical-align:middle;">
                                        </b>
                                        {%$list_item.tel%}
                                    </a>
                                </div>
                            {%/if%}
                            
                            {%if $list_item._isHotelBookable%}
                                <a href="{%$list_item._hotelBookUrl%}" class="btn-book" content="place/hotelbook/qt=otaroom">
                                    预订
                                </a>
                            {%/if%}

                            {%if $list_item._isLifeBookable%}
                                    <div class="btn-book">订座</div>
                            {%elseif $list_item._isMovieBookable%}
                                <div class="btn-book">影讯</div>
                            {%/if%}
                           
                            {%* 景点的预定接入 *%}
                            {%if !empty($list_item.ext)%}
                                {%if $list_item.ext.detail_info.ticket_book_flag===1%}
                                    <div class="btn-book"  industry="scope">预定</div> 
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
                        <span class="dis">{%$list_item.dis%}</span>
                    {%/if%}
                    <span class="opt-icon"><em class="rl_go_dtl"></em></span>
                    </li>
                {%/if%}
                
            {%/foreach%}
        </ul>
        <script type="text/javascript">PDC && PDC.first_screen && PDC.first_screen();</script>
        {%if !$data.listInfo.isShowAll && $data.listInfo.total > 1 %}
            <div class="showall-txt" id="place-widget-placelist-showall">
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
	require("placelist.js").init(listData);

{%/script%}
