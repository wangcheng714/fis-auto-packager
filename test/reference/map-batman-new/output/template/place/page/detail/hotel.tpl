{%* 酒店模板 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.mod-m15{margin-top:15px;margin-bottom:15px}.hotel-card,.hotel-subcard{background-color:#fff;border-radius:3px;border:1px solid #e4e4e4;margin-top:10px;padding:10px}.hotel-subcard{border-radius:0;margin-top:5px;padding:0}.no-star-price{padding-top:29px}.hotel-detail{background-color:#f2f2f2;color:#3b3b3b;font:14px "微软雅黑","宋体";padding:10px 10px 0}.hotel-detail #hotel-imginfo{border-bottom:0;border-radius:3px 3px 0 0;margin-bottom:0;margin-top:0}.hotel-detail #hotel-imginfo .hotel-title{padding:0 0 10px;font:16px '微软雅黑'}.hotel-detail #hotel-imginfo .hotel-addr{font-size:12px;color:#888;margin-top:5px;word-wrap:break-word;word-break:normal}#hotel-bookinfo{margin-bottom:10px;border-radius:3px;border:1px solid #e4e4e4}#hotel-bookinfo .hotelext-nav{display:-webkit-box;-webkit-box-pack:center;-webkit-box-align:center}#hotel-bookinfo .hotelext-nav li{-webkit-box-flex:1;text-align:center;cursor:pointer;border-right:1px solid #e4e4e4;height:44px;line-height:44px;font-size:15px;border-bottom:1px solid #e4e4e4}#hotel-bookinfo .hotelext-nav li:last-child{border-right:0}#hotel-bookinfo .hotelext-nav li.active{background-color:#fff;color:#f07100;border-bottom:1px solid #fff}#hotel-bookinfo .hotelext-cont>div{display:none;padding:8px;-webkit-box-sizing:border-box;background-color:#fff;border-radius:0 0 3px 3px}#hotel-bookinfo .hotelext-cont>div.active{display:block}#hotel-bookinfo .hotelext-cont .comment-cont{position:relative}.tit-text{font:700 15px "微软雅黑","宋体"}.des-text{font:14px "微软雅黑","宋体";color:#9f9f9f}.price-icon{font:12px Arial,"微软雅黑","宋体";color:#fe8a01}.price-num{font:18px bold Arial,"微软雅黑","宋体";color:#fe8a01}.hotel-cont{border:1px solid #e3e3e3;background-color:#fff;margin-bottom:10px}.hotel-head{border:1px solid #e3e3e3;border-bottom:0;background-color:#fff;padding:.5em .6em;display:-webkit-box;-webkit-box-align:center}.hotel-head .hotel-icon{display:block;margin-right:10px}.bookbtn-item{width:60px;height:30px;background:url(/static/place/images/hotelbook_btn_new_e456b46.png) no-repeat;background-size:60px;display:inline-block}.bookbtn-normal{background-position:0 0}.bookbtn-tel{background-position:0 -62px}.bookbtn-web{background-position:0 -30px}.bookbtn-up{display:inline-block;font:700 14px "微软雅黑","宋体";color:#635959;text-align:center;width:60px}.bookup-txt{display:inline-block;font:700 14px "微软雅黑","宋体";text-align:center;color:#635959}.more-text{font:14px "微软雅黑","宋体";color:#6B6A6A;font-weight:700}.hotel-arrow{display:inline-block;width:13px;height:8px;background:url(/static/place/images/hotel-arrow_df1ed34.png) no-repeat -3px -22px;-webkit-background-size:18px 30px}.hotel-rarrow{display:block;width:17px;height:17px;background:url(/static/place/images/hotel-arrow_df1ed34.png) no-repeat -1px 0;-webkit-background-size:18px 30px}.arrow-toggle{-webkit-transform:rotate(180deg)}.arrow-right{-webkit-transform:rotate(90deg)}.hotel-loading,.hotel-loadfailed{background-color:#fff;font:14px "微软雅黑","宋体";color:#90cc77;box-sizing:border-box;padding:15px 0;text-align:center}.hotel-loading>span,.hotel-loadfailed>span{display:inline-block;vertical-align:middle}.hotel-loading>span:first-child,.hotel-loadfailed>span:first-child{width:15px;height:15px;background:url(/static/place/images/hotelbook_state_icon_31a7e5b.png) no-repeat 0 0;background-size:15px 30px}.hotel-loadfailed{color:#7D7D7D}.hotel-loadfailed>span:first-child{background-position:0 -15px}.hotelbook-detail{padding:10px}.hotelbook-detail .hotelbook-tit{padding:10px;background-color:#FFF;border:1px solid #E4E4E4;margin-bottom:10px}.hotelbook-detail .hotelbook-tit .hotelbook-name{font:15px "微软雅黑","宋体";color:#4E4E4E;font-weight:700}.hotelbook-detail .hotelbook-tit .hotelbook-addr{font:14px "微软雅黑","宋体";color:#747474;margin-top:5px}.hotel-detail .detail-widget-streetscape{background:#fff;border:1px solid #e4e4e4;border-radius:3px;margin-top:10px;padding:10px;margin-bottom:10px}.hotel-detail .detail-widget-streetscape a{font:14px "微软雅黑","宋体";color:#333;padding:0}.comment-cont .place-widget-commentbtn{position:absolute;border:1px solid #C5C7CB;padding:0 .6em 0 0;height:2.8em;line-height:2.8em;top:.4em;right:.6em;background:#F9F9F9;font-weight:400;font-family:"微软雅黑","宋体"}.comment-cont .place-widget-commentbtn .combtn-icon{margin-right:2px}.hotel-actbanner{border:1px solid #d9d9d9;margin-bottom:10px;-webkit-box-sizing:border-box;display:block}.hotel-actbanner img{width:100%;vertical-align:middle}</style>
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
<style type="text/css">.hotel-head .hotel-icon-qunar{width:25px;height:20px;background:url(/static/place/widget/hotelthirdota/images/thirdota_icon_7530ff1.png) no-repeat 0 0;-webkit-background-size:25px 50px}.hotel-head .hotel-des-icon{background:url(/static/place/widget/hotelthirdota/images/thirdota_icon_7530ff1.png) no-repeat -5px -30px;display:inline-block;width:15px;height:18px;background-size:25px 50px;margin-left:5px;vertical-align:bottom}.hotel-head .hotel-full{-webkit-box-flex:1;text-align:right}.hotel-head .hotel-full .bookup-txt{display:none}.hotel-roomlist-thirdota .thirdota-item{border-bottom:solid 1px #ccced2;box-sizing:border-box;background-color:#F5F5F5}.hotel-roomlist-thirdota .thirdota-item .room-type{display:-webkit-box;padding:1em .6em;-webkit-box-align:center;background-color:#fff}.hotel-roomlist-thirdota .thirdota-item .room-type .type-name{-webkit-box-flex:2}.hotel-roomlist-thirdota .thirdota-item .room-type .type-price{-webkit-box-flex:1;text-align:right;margin-right:10px}.hotel-roomlist-thirdota .thirdota-item .ota-list{border-top:solid 1px #CCCED2}.hotel-roomlist-thirdota .thirdota-item .room-info{padding:.6em;border-bottom:solid 1px #CCCED2}.hotel-roomlist-thirdota .thirdota-item .room-info>div{float:left;min-width:50px;max-width:150px;overflow:hidden;font:14px Arial;color:#888;background:url(/static/place/images/icon_hotel_room_bdb840e.png) no-repeat 0 15px;background-size:16px 70px;padding-left:25px;margin-left:10px}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-area{background-position:0 0}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-bedtype{background-position:0 -52px}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-floor{background-position:0 -35px}.hotel-roomlist-thirdota .thirdota-item .room-info div.info-internet{background-position:0 -17px}.hotel-roomlist-thirdota .thirdota-item .ota-item{border-bottom:1px solid #e0ddd9;padding:.6em;display:-webkit-box;-webkit-box-align:center}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-name{-webkit-box-flex:1}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-price{margin-right:5px;margin-left:5px}.hotel-roomlist-thirdota .thirdota-item .ota-item .ota-price .ota-coupon{background-color:#90cc77;box-sizing:border-box;padding:2px;border-radius:3px;-webkit-border-radius:3px;font-size:12px;color:#fff}.hotel-roomlist-thirdota .thirdota-item .ota-item:last-child{border-bottom:0}.hotel-roomlist-thirdota .thirdota-item .hide{display:none}.hotel-roomlist-thirdota .thirdota-item:last-child{border-bottom:0}.hotel-roomlist-thirdota .price-more,.hotel-roomlist-thirdota .thirdota-more{display:block;text-align:center;padding:.7em 0}.hotel-roomlist-thirdota .hide{display:none}.hotel-roomlist-thirdota .hotel-loading,.hotel-roomlist-thirdota .hotel-loadfailed{border:0;margin-top:0}.hotel-collapse{border-bottom:0}.hotel-collapse .hotel-full .bookup-txt{display:inline-block}.hotel-collapse .hotel-full .hotel-arrow{-webkit-transform:rotate(180deg)}.hotel-collapse .thirdota-item{display:none}.hotel-collapse .thirdota-more{display:none}</style>
<div id="hotel-thirdota"></div>
{%*附近推荐酒店*%}
<style type="text/css">.hotel-head .hotel-icon-rec{background:url(/static/place/widget/hotelrec/images/rec_icon_8f3cdd2.png) no-repeat 0 0;width:15px;height:14px;-webkit-background-size:15px 14px}.hotel-reclist .hotel-recitem{border-bottom:1px solid #e6e6e6;padding:8px;display:-webkit-box;-webkit-box-align:center}.hotel-reclist .hotel-recitem .rec-title{-webkit-box-flex:1}.hotel-reclist .hotel-recitem .rec-title .rec-name{font:16px bold "微软雅黑","宋体";color:#333}.hotel-reclist .hotel-recitem .rec-title .rec-tag{font-size:12px;color:#666;padding-top:3px}.hotel-reclist .hotel-recitem .rec-title .rec-tag .rec-aoi{margin-right:12px}.hotel-reclist .hotel-recitem .rec-des{padding-right:10px;text-align:right}.hotel-reclist .hotel-recitem .rec-des .rec-dis{color:#666;font-size:12px}.hotel-reclist .hotel-recitem:last-child{border-bottom:0}</style>
<div id="hotel-rec"></div>
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
            var stat = require('common:widget/stat/stat.js'),
                url = require('common:widget/url/url.js'),
                bookable, fullroom, detail_from, uid;
            {%if $data.content && $data.content.ext && $data.content.ext.detail_info%}
                bookable = '{%$data.content.ext.detail_info.wap_bookable|f_escape_js%}' || 0;
                fullroom = '{%$data.content.ext.detail_info.wise_fullroom|f_escape_js%}' || 0;
                uid = '{%$data.content.uid|f_escape_js%}' || '';
            {%/if%}

            if(url && url.get().pageState) {
                detail_from = url.get().pageState.detail_from;
            }

            stat.addStat(STAT_CODE.PLACE_DETAIL_VIEW, {
                'wd': '{%$data.content.name|f_escape_js%}',
                'srcname': 'hotel',
                'detail_from': detail_from,
                'uid': uid
            });

            (require('place:static/js/hotel.js')).init({
                uid: uid,
                kehuduan: '{%$kehuduan|f_escape_js%}',
                wd: '{%$data.result.wd|f_escape_js%}',
                qid: '{%$data.result.qid|f_escape_js%}',
                bookable: bookable,
                fullroom: fullroom
            });
        {%/script%}
</div>
{%require name='place:page/detail/hotel.tpl'%}{%/block%}
