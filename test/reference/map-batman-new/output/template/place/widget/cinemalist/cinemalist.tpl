{%style id="/widget/cinemalist/cinemalist.inline.less"%}.place-widget-moviedetail section{margin:0 8px}.place-widget-moviedetail .mdetail{position:relative;min-height:95px;margin:15px 10px 10px}.place-widget-moviedetail .list-info{margin-top:2px;position:relative}.place-widget-moviedetail .list-info li{white-space:nowrap;min-height:45px;padding:0 60px 11px 42px;margin:0 0 8px;border:1px solid #ddd;border-radius:.25em;background-color:#fff;position:relative;cursor:pointer;overflow:hidden}.place-widget-moviedetail .list-info li h4{padding-top:9px;font-size:16px;color:#3b3b3b}.place-widget-moviedetail .list-info li strong.rl_li_title{color:#3b3b3b;max-width:70%;display:inline-block;overflow:hidden;text-overflow:ellipsis;font-weight:400;font-size:1.07em;height:24px}.place-widget-moviedetail .list-info li h4 em.place_groupon_icon{width:16px;height:16px;background:url(/static/place/images/tuan_icon_e357391.png) left bottom no-repeat;background-size:16px 16px;margin-left:1px}.place-widget-moviedetail .list-info li h4 em.place_seat_icon{background:url(/static/place/images/list_seat_icon_de32581.png) left bottom no-repeat;background-size:16px 16px;width:16px;height:16px;margin-left:0}.place-widget-moviedetail .list-info li p{white-space:nowrap;color:#5e5e5e;font-size:12px}.place-widget-moviedetail .list-info li .opt-icon{position:absolute;height:1.32em;right:18px;top:54%;margin-top:-.714em;padding-right:1.43em;text-align:right}.place-widget-moviedetail .list-info li .dis{position:absolute;height:1.32em;right:24px;top:22px;margin-top:-.714em;padding-right:8px;text-align:right;font-size:14px;color:#3b3b3b}.place-widget-moviedetail .list-info li .rl_go_dtl{position:absolute;background:url(/static/place/images/areo_98200f6.png) no-repeat 0 0;background-size:7px 12px;height:12px;width:7px;top:2px;right:0}.place-widget-moviedetail .list-info li .mkr-icon{position:absolute;top:10px;left:12px}.place-widget-moviedetail .poster{width:90px;height:110px;position:absolute;left:0;top:0}.place-widget-moviedetail .list{padding:0 0 10px 95px;min-height:110px}.place-widget-moviedetail .list dt{margin-bottom:5px}.place-widget-moviedetail .list dd{font-size:12px}.place-widget-moviedetail .list .int_content{font-size:12px}.place-widget-moviedetail .list .movie_title{font-size:14px;color:#383838;line-height:20px;font-weight:700}.place-widget-moviedetail .movie_num{color:#fa6a00;font-size:14px}.place-widget-moviedetail .over{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.place-widget-moviedetail .hide{display:none}.place-widget-moviedetail .vhide{visibility:hidden}.place-widget-moviedetail .txt_red{color:#ff0101}.place-widget-moviedetail .txt_gray{color:#7d7d7d}.place-widget-moviedetail .introduction{border-bottom:1px solid #c3c3c3;margin:10px 0 20px;height:20px;line-height:20px;position:relative}.place-widget-moviedetail .introduction span{position:absolute;left:50%;margin-left:-2em;top:11px;background-color:#f2f2f2;padding:0 5px;font-size:14px;font-weight:700}.place-widget-moviedetail .more{text-align:center;margin:5px 0 0}.place-widget-moviedetail .more img{-webkit-transform:rotate(90deg);transform:rotate(90deg);width:7px;height:11px;cursor:pointer;display:inline-block;padding:10px}.place-widget-moviedetail .more img.active{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.place-widget-moviedetail .pagenav{padding:12px;text-align:center}.place-widget-moviedetail .pagenav .page-btn{display:inline-block;height:27px;line-height:27px;padding:0 11px;border:1px solid #CACACA;margin:0 6px;color:#000;font-size:13px;background-color:#fff}.place-widget-moviedetail .pagenav .unclick{color:#CCC;border:1px solid #CACACA}{%/style%}{%$movie_info = $data.movie_info|f_escape_xml%}
<div class="place-widget-moviedetail">
<div class="mdetail" id="movieInfo">
<img class="poster" id="pic" src="{%$movie_info.movie_picture|f_escape_xml%}"><dl class="list">
{%if $movie_info.movie_message%}
<dt class="movie_title">
{%$len = mb_strlen($movie_info.movie_message,"utf-8")|f_escape_xml%}
{%if $len>30%}
{%mb_substr($movie_info.movie_message,$Len,30,'utf-8')%}...{%else%}
{%$movie_info.movie_message|escape:html|f_escape_xml%}
{%/if%}
</dt>
{%/if%}
<dd class="detail over">导演：{%if $movie_info.movie_director%}
{%$movie_info.movie_director|f_escape_xml%}
{%else%}
暂无{%/if%}
</dd>
<dd class="detail over">片长：{%if $movie_info.movie_length%}
{%$movie_info.movie_length|f_escape_xml%}
{%else%}
暂无{%/if%}
</dd>
<dd class="detail over">类型：{%if $movie_info.movie_type%}
{%$movie_info.movie_type|f_escape_xml%}
{%else%}
暂无{%/if%}
</dd>
<dd class="detail over">评分：{%if $movie_info.movie_score%}
<span class="movie_num" id="score">{%$movie_info.movie_score|f_escape_xml%}</span>
{%else%}
暂无{%/if%}
</dd>
</dl>
{%if $movie_info.movie_description%}
<p class="introduction"><span>剧情介绍</span></p>
<p class="txt_gray int_content" id="desc">
{%$len = mb_strlen($movie_info.movie_description,"utf-8")|f_escape_xml%}
{%if $len>65%}
{%mb_substr($movie_info.movie_description,$Len,65,'utf-8')%}...</p>
<p class="more normal" id="more"><img src="/static/place/images/areo_98200f6.png"></p>
{%else%}
{%$movie_info.movie_description|escape:html|f_escape_xml%}</p>
{%/if%}
{%/if%}
</div>
<section class="list-info">
<ul>
{%foreach $data.content as $item%}
{%if ($item.ext && $item.ext.detail_info)%}
{%$extd=$item.ext.detail_info|f_escape_xml%}
{%/if%}
<li data-href="{%$item._detailUrl|f_escape_xml%}">
<h4>
<strong class="rl_li_title">{%$item.name|f_escape_xml%}</strong>
<span class="icon_height">
{%if $item._hasGroupon %}
<em class="place_groupon_icon"></em>
{%/if%}
{%if $item._isLifeBookable%}
<em class="place_seat_icon"></em>
{%/if%}</span>
</h4>
<p class="over">{%$extd.poi_address|f_escape_xml%}</p>
<p>
{%if $data.listInfo.isSameCity %}
<span class="dis">{%$item.dis|f_escape_xml%}</span>
{%/if%}
<span class="opt-icon"><em class="rl_go_dtl"></em></span>
</p>
{%if $extd.timetable%}
{%$timeCount = count($extd.timetable)|f_escape_xml%}
<p class="addr over">近期场次：<span class="txt_red">{%$extd.timetable[0]|f_escape_xml%}</span>&nbsp;&nbsp;剩余<span class="txt_red">{%$timeCount|f_escape_xml%}</span>场</p>
{%/if%}
{%* 路线类的点 不显示路线搜索按钮*%}
{%if $item.poiType != 2 && $item.poiType != 4%}
<span class="mkr-icon marker-{%counter%}"></span>
{%elseif $item.poiType == 2%}
<span class="mkr-icon marker-bus"></span>
{%elseif $item.poiType == 4%}
<span class="mkr-icon marker-sub"></span>
{%/if%}
</li>
{%/foreach%}
</ul>
</section>
{%if $data.pageInfo.hasPage && $data.result.type != 41%}
<div class="pagenav" style="display:{%if $data.listInfo.isShowAll %}block{%else%}none{%/if%}">
<span data-type="pre" jsaction="jump" data-url="{%if $data.pageInfo.isFirst%}javascript:void(0);{%else%}{%$data.pageInfo.prevPageUrl|escape:'none'%}{%/if%}"  class="page-btn {%if $data.pageInfo.isFirst%}unclick{%/if%}">上一页</span>
<span data-type="next" jsaction="jump" data-url="{%if $data.pageInfo.isLast%}javascript:void(0);{%else%}{%$data.pageInfo.nextPageUrl|escape:'none'%}{%/if%}"  class="page-btn {%if $data.pageInfo.isLast%}unclick{%/if%}">下一页</span>
</div>
{%/if%}
{%script type="text/javascript"%}
        var listData = {
            isGenRequest : {%$data.listInfo.isGRequest|f_escape_js%},
            movie_description : {%json_encode($movie_info.movie_description)%},
            movie_id : {%json_encode($data['place_info']['d_business_id'])%}
        }
        require('place:widget/cinemalist/cinemalist.js').initialize(listData);
    {%/script%}
</div>
