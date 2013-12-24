{%* 酒店模板 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.mod-m15{margin-top:15px;margin-bottom:15px}.hotel-card,.hotel-subcard{background-color:#fff;border-radius:3px;border:1px solid #e4e4e4;margin-top:10px;padding:10px}.hotel-subcard{margin-top:5px;padding:0}.no-star-price{padding-top:29px}.hotel-detail{background-color:#f2f2f2;color:#3b3b3b;font:14px "微软雅黑","宋体";padding:10px 10px 0}.hotel-detail #hotel-imginfo{border-bottom:0;border-radius:3px 3px 0 0;margin-bottom:0;margin-top:0}.hotel-detail #hotel-imginfo .hotel-title{padding:0 0 10px;font:16px '微软雅黑'}.hotel-detail #hotel-imginfo .hotel-addr{font-size:12px;color:#888;margin-top:5px;word-wrap:break-word;word-break:normal}.hotelext-nav{display:-webkit-box;-webkit-box-pack:center;-webkit-box-align:center;border-radius:3px 3px 0 0;border:1px solid #e4e4e4;border-bottom:0;background-color:#f5f5f5}.hotelext-nav li{-webkit-box-flex:1;text-align:center;cursor:pointer;border-right:1px solid #e4e4e4;height:44px;line-height:44px;font-size:15px;border-bottom:1px solid #e4e4e4}.hotelext-nav li:last-child{border-right:0}.hotelext-nav li.active{background-color:#fff;color:#f07100;border-bottom:1px solid #fff}#hotel-bookinfo{margin-bottom:10px}#hotel-bookinfo .hotelext-cont>div{display:none}#hotel-bookinfo .hotelext-cont>div.active{display:block}#hotel-bookinfo .comment-cont,#hotel-bookinfo .shop-cont{background-color:#fff;border:solid 1px #CCCED2;border-top:0}#hotel-bookinfo .comment-cont{position:relative}.tit-text{font:700 15px "微软雅黑","宋体"}.hotelbook-mod .des-text{font:14px "微软雅黑","宋体";color:#9f9f9f}.hotelbook-mod .price-icon{font:12px Arial,"微软雅黑","宋体";color:#fe8a01}.hotelbook-mod .price-num{font:18px bold Arial,"微软雅黑","宋体";color:#fe8a01}.hotelbook-mod .bookbtn-item{width:60px;height:30px;background:url(/static/place/images/hotelbook_btn_new_e456b46.png) no-repeat;background-size:60px;display:inline-block}.hotelbook-mod .bookbtn-normal{background-position:0 0}.hotelbook-mod .bookbtn-tel{background-position:0 -62px}.hotelbook-mod .bookbtn-web{background-position:0 -30px}.hotelbook-mod .bookbtn-up{width:60px;height:30px;display:inline-block;font:700 15px "微软雅黑","宋体";color:graytext;text-align:center;line-height:30px}.hotelbook-mod li.room-more{padding:10px}.hotelbook-mod .more-wrap{text-align:center}.hotelbook-mod span.room-more-text{color:#444d62;display:inline-block}.hotelbook-mod span.room-more-icon{width:11px;height:10px;background:url(/static/place/images/hotelbook_icon_844811c.png) no-repeat 0 -58px;display:inline-block;background-size:27px 107px}.hotelbook-mod .style-none{margin:0;padding:0;background:0 0;border:0}.hotelbook-mod .arrow-down{-webkit-transform:rotate(180deg)}.hotelbook-mod .arrow-toggle{-webkit-transform:rotate(90deg)}.hotel-loading,.hotel-loadfailed{background-color:#fff;font:14px "微软雅黑","宋体";color:#90cc77;box-sizing:border-box;padding:15px 0;text-align:center;border:1px solid #DBDBDB;margin-top:10px}.hotel-loading>span,.hotel-loadfailed>span{display:inline-block;vertical-align:middle}.hotel-loading>span:first-child,.hotel-loadfailed>span:first-child{width:15px;height:15px;background:url(/static/place/images/hotelbook_state_icon_31a7e5b.png) no-repeat 0 0;background-size:15px 30px}.hotel-loadfailed{color:#7D7D7D}.hotel-loadfailed>span:first-child{background-position:0 -15px}.hotelbook-detail{padding:10px}.hotelbook-detail .hotelbook-tit{padding:10px;background-color:#FFF;border:1px solid #E4E4E4;border-bottom:0}.hotelbook-detail .hotelbook-tit .hotelbook-name{font:15px "微软雅黑","宋体";color:#4E4E4E;font-weight:700}.hotelbook-detail .hotelbook-tit .hotelbook-addr{font:14px "微软雅黑","宋体";color:#747474;margin-top:5px}.hotel-detail .detail-widget-streetscape{background:#fff;border:1px solid #e4e4e4;border-radius:3px;margin-top:10px;padding:10px;margin-bottom:10px}.hotel-detail .detail-widget-streetscape a{font:14px "微软雅黑","宋体";color:#333;padding:0}.comment-cont .place-widget-commentbtn{position:absolute;border:1px solid #C5C7CB;padding:0 .6em 0 0;height:2.8em;line-height:2.8em;top:.4em;right:.6em;background:#F9F9F9;font-weight:400;font-family:"微软雅黑","宋体"}.comment-cont .place-widget-commentbtn .combtn-icon{margin-right:2px}.hotel-actbanner{border:1px solid #d9d9d9;margin-bottom:10px;-webkit-box-sizing:border-box;display:block}.hotel-actbanner img{width:100%;vertical-align:middle}</style>
{%/block%}
{%block name="main"%}
{%* 导航widget *%}
{%widget name="common:widget/nav/nav.tpl" title="详情" mapLink=$commonUrl.nav.map pageType="detail"%}
<div class="hotel-detail">
{%*头部酒店名称、地址基本信息*%}
<div id="hotel-imginfo" class="hotel-card">
<h4 class="hotel-title">{%$data.content.name|f_escape_xml%}</h4>
{%*酒店扩展详情图片区域信息(quickling区块)*%}
<div id="place-pagelet-hotelextimg">
{%widget name="place:widget/loading/loading.tpl"%}
</div>
<p class="hotel-addr">地址：{%$data.content.addr|f_escape_xml%}</p>
</div>
{%*搜索周边、到这去三大金刚*%}
{%widget name="place:widget/hotelgoto/hotelgoto.tpl" widget_data=$data.content.goto%}
{%*双旦购物节banner展示*%}
{%if $data.content.ext && $data.content.ext.detail_info && $data.content.ext.detail_info.is_gwj &&
            $data.content.ext.detail_info.activity_gwj && count($data.content.ext.detail_info.activity_gwj.groupon)%}
<a class="hotel-actbanner" href="{%$data.content.ext.detail_info.activity_gwj.groupon[0].wap_url|f_escape_xml%}"
               data-log="{code: {%$STAT_CODE.PLACE_HOTEL_GWJ_DETAIL_BANNER_CLICK|f_escape_xml%}, srcname:'hotel'}">
<img src="/static/place/images/act_banner_2054b81.png" />
</a>
{%/if%}
<div id="hotel-bookinfo">
<ul class="hotelext-nav">
<li class="hotelbook-nav">预订</li>
<li class="comment-nav">评论</li>
<li class="info-nav">详情</li>
</ul>
<div class="hotelext-cont">
<div class="hotelbook-cont">
{%*预订区时间切换日历*%}
{%widget name="place:widget/datepicker/datepicker.tpl" widget_data=$data.content%}
{%*第三方连锁酒店预订报价区*%}
<div id="place-pagelet-hotelthirdsrc"></div>
{%*ota预订报价区*%}
<style type="text/css">.tit-text{font:700 15px "微软雅黑","宋体"}.desc-text{font:14px "微软雅黑","宋体";color:#9f9f9f}.price-icon{font:12px Arial,"微软雅黑","宋体";color:#FE8A01}.price-num{font:18px bold Arial,"微软雅黑","宋体";color:#FE8A01}.hotel-head{padding:.5em .6em;display:-webkit-box;-webkit-box-align:center;border-bottom:1px solid #E4E4E4}.hotel-head .hotel-icon-qunar{width:29px;height:20px;background:url(/static/place/widget/hotelthirdota/images/qunar_logo_0aea3aa.png) no-repeat 0 0;display:block;background-size:29px 20px;margin-right:10px}.hotel-head .hotel-des-icon{background:url(/static/place/widget/hotelthirdota/images/icon_guarantee_72ffc7e.png) no-repeat 0 0;display:inline-block;width:20px;height:20px;background-size:20px 20px;margin-left:5px;vertical-align:bottom}.hotel-roomlist-thirdota .thirdota-item{border-bottom:solid 1px #ccced2;box-sizing:border-box;background-color:#F5F5F5}.hotel-roomlist-thirdota .thirdota-item .room-type{display:-webkit-box;padding:1em .6em;-webkit-box-align:center;background-color:#fff}.hotel-roomlist-thirdota .thirdota-item .room-type .type-arrow{width:20px;height:20px;background:url(/static/place/images/hotelbook_icon_844811c.png) no-repeat 0 0;background-size:21px 80px;display:block;margin-right:10px}.hotel-roomlist-thirdota .thirdota-item .room-type .type-arrow-open{-webkit-transform:rotate(90deg)}.hotel-roomlist-thirdota .thirdota-item .room-type .type-name{-webkit-box-flex:2}.hotel-roomlist-thirdota .thirdota-item .room-type .type-price{-webkit-box-flex:1;text-align:right}.hotel-roomlist-thirdota .thirdota-item .ota-list{border-top:solid 1px #CCCED2}.hotel-roomlist-thirdota .thirdota-item .room-info{padding:.6em;border-bottom:solid 1px #CCCED2}.hotel-roomlist-thirdota .thirdota-item .room-info>div{float:left;min-width:50px;max-width:150px;overflow:hidden;font:14px Arial;color:#888;background:url(/static/place/images/icon_hotel_room_bdb840e.png) no-repeat 0 15px;background-size:16px 70px;padding-left:25px;margin-left:10px}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-area{background-position:0 0}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-bedtype{background-position:0 -52px}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-floor{background-position:0 -35px}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-internet{background-position:0 -17px}.hotel-roomlist-thirdota .thirdota-item .ota-item{border-bottom:1px solid #e0ddd9;padding:.6em;display:-webkit-box;-webkit-box-align:center}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-name{-webkit-box-flex:1}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-price{padding:5px;display:-webkit-box;-webkit-box-orient:vertical;-webkit-box-align:center;width:60px}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-price .ota-coupon{background-color:#90cc77;box-sizing:border-box;padding:2px;border-radius:3px;-webkit-border-radius:3px;font-size:12px;color:#fff;text-align:center}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-bookbtn{width:60px;height:30px;background:url(/static/place/images/hotelbook_btn_new_e456b46.png) no-repeat 0 0;background-size:60px;display:block}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-bookbtn-web{background-position:0 -30px}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-bookbtn-tel{background-position:0 -62px}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-bookbtn-over{font-weight:700;font-size:15px;font-family:"微软雅黑","宋体";color:graytext}.hotel-roomlist-thirdota .thirdota-item .ota-item:last-child{border-bottom:0}.hotel-roomlist-thirdota .thirdota-item .hide{display:none}.hotel-roomlist-thirdota .price-more,.hotel-roomlist-thirdota .thirdota-more{display:block;text-align:center;padding:.7em 0}.hotel-roomlist-thirdota .price-more .more-text,.hotel-roomlist-thirdota .thirdota-more .more-text{font:14 "微软雅黑","宋体";color:#6B6A6A}.hotel-roomlist-thirdota .price-more .more-icon,.hotel-roomlist-thirdota .thirdota-more .more-icon{width:12px;height:11px;display:inline-block;background:url(/static/place/images/hotelbook_icon_844811c.png) no-repeat 0 -68px;background-size:27px 107px}.hotel-roomlist-thirdota .arrow-up .more-icon{-webkit-transform:rotate(180deg)}.hotel-roomlist-thirdota .thirdota-more{font-weight:700}.hotel-roomlist-thirdota .thirdota-more .more-icon{background-position:0 -58px}.hotel-roomlist-thirdota .hide{display:none}.hotel-roomlist-thirdota .hotel-loading,.hotel-roomlist-thirdota .hotel-loadfailed{border:0;margin-top:0}</style>
<div id="hotel-thirdota"></div>
{%*预订电话*%}
<div id="place-pagelet-hotelextphone"></div>
</div>
<div class="comment-cont">
{%*评论按钮widget*%}
{%widget name="place:widget/commentbtn/commentbtn.tpl" widget_data=$data.content%}
{%*评论tab*%}
<div id="place-pagelet-hotelextcomment">
{%widget name="place:widget/loading/loading.tpl"%}
</div>
</div>
<div class="shop-cont">
{%*商户概况tab*%}
<div id="place-pagelet-hotelextshop">
{%widget name="place:widget/loading/loading.tpl"%}
</div>
</div>
</div>
</div>
{%*街景入口*%}
{%if $data.content.pano == 1%}
{%widget name="place:widget/streetview/streetview.tpl" street_url=$data.content.streetUrl%}
{%/if%}
{%*团购card*%}
<div id="place-pagelet-hotelexttuan">
{%widget name="place:widget/loading/loading.tpl"%}
</div>
{%*优惠card*%}
<div id="place-pagelet-hotelextpre">
{%widget name="place:widget/loading/loading.tpl"%}
</div>
{%*查看更多网站链接*%}
<div id="place-pagelet-hotelsitelink">
{%widget name="place:widget/hotelsitelink/hotelsitelink.tpl"%}
</div>
{%$widget_rich_list=[
            [
                "tpl"=>"place:widget/hotelextimg/hotelextimg.tpl",
                "data"=>$data.content.ext
            ],
            [
                "tpl"=>"place:widget/hotelthirdsrc/hotelthirdsrc.tpl",
                "data"=>$data
            ],
            [
                "tpl"=>"place:widget/hotelextphone/hotelextphone.tpl",
                "data"=>$data.content.ext.detail_info
            ],
            [
                "tpl"=>"place:widget/hotelextcomment/hotelextcomment.tpl",
                "data"=>$data.content
            ],
            [
                "tpl"=>"place:widget/hotelextshop/hotelextshop.tpl",
                "data"=>$data.content.ext.rich_info
            ],
            [
                "tpl"=>"place:widget/hotelexttuan/hotelexttuan.tpl",
                "data"=>$data.content.tuan
            ],
            [
                "tpl"=>"place:widget/hotelextpre/hotelextpre.tpl",
                "data"=>$data.content
            ],
            [
            "tpl"=>"place:widget/hotelsitelink/hotelsitelink.tpl",
            "data"=>$data
            ]
        ]%}
{%foreach from=$widget_rich_list item=widget_item%}
{%widget
                name=$widget_item.tpl
                widget_data=$widget_item.data
                pagelet_id=preg_replace('/(\w+)\:widget\/(\w+)\/(\w+)\.tpl/', '$1-pagelet-$2', $widget_item.tpl)
                mode="quickling"
            %}
{%/foreach%}
{%script%}
            var stat = require('common:widget/stat/stat.js');

            stat.addStat(STAT_CODE.PLACE_DETAIL_VIEW, {'wd': '{%$data.content.name|f_escape_js%}', 'srcname': 'hotel'});

            (require('place:static/js/hotel.js')).init({
                uid: '{%$data.content.uid|f_escape_js%}',
                kehuduan: '{%$kehuduan|f_escape_js%}',
                wd: '{%$data.result.wd|f_escape_js%}',
                qid: '{%$data.result.qid|f_escape_js%}'
            });
        {%/script%}
</div>
{%require name='place:page/detail/hotel.tpl'%}{%/block%}
