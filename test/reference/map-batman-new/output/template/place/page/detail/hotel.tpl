{%* 酒店模板 *%}
{%extends file="common/page/layout.tpl"%} 
{%block name="js"%}
<style type="text/css">.mod-m15{margin-top:15px;margin-bottom:15px}.hotel-card,.hotel-subcard{background-color:#fff;border-radius:3px;border:1px solid #e4e4e4;margin-top:10px;padding:10px}.hotel-subcard{margin-top:5px;padding:0}.no-star-price{padding-top:29px}.hotel-detail{background-color:#f2f2f2;color:#3b3b3b;font:14px "微软雅黑","宋体";padding:10px 10px 0}.hotel-detail #hotel-imginfo{border-bottom:0;border-radius:3px 3px 0 0;margin-bottom:0;margin-top:0}.hotel-detail #hotel-imginfo .hotel-title{padding:0 0 10px;font:16px '微软雅黑'}.hotel-detail #hotel-imginfo .hotel-addr{font-size:12px;color:#888;margin-top:5px;word-wrap:break-word;word-break:normal}.hotelext-nav{display:-webkit-box;-webkit-box-pack:center;-webkit-box-align:center;border-radius:3px 3px 0 0;border:1px solid #e4e4e4;border-bottom:0;background-color:#f5f5f5}.hotelext-nav li{-webkit-box-flex:1;text-align:center;cursor:pointer;border-right:1px solid #e4e4e4;height:44px;line-height:44px;font-size:15px;border-bottom:1px solid #e4e4e4}.hotelext-nav li:last-child{border-right:0}.hotelext-nav li.active{background-color:#fff;color:#f07100;border-bottom:1px solid #fff}#hotel-bookinfo{margin-bottom:10px}#hotel-bookinfo .hotelext-cont>div{display:none}#hotel-bookinfo .hotelext-cont>div.active{display:block}#hotel-bookinfo .comment-cont,#hotel-bookinfo .shop-cont{background-color:#fff;border:solid 1px #CCCED2;border-top:0}#hotel-bookinfo .comment-cont{position:relative}.tit-text{font:700 15px "微软雅黑","宋体"}.hotelbook-mod .des-text{font:14px "微软雅黑","宋体";color:#9f9f9f}.hotelbook-mod .price-icon{font:12px Arial,"微软雅黑","宋体";color:#fe8a01}.hotelbook-mod .price-num{font:18px bold Arial,"微软雅黑","宋体";color:#fe8a01}.hotelbook-mod .bookbtn-item{width:60px;height:30px;background:url(/mobile/simple/static/place/images/hotelbook_btn_new_e456b46.png) no-repeat;background-size:60px;display:inline-block}.hotelbook-mod .bookbtn-normal{background-position:0 0}.hotelbook-mod .bookbtn-tel{background-position:0 -62px}.hotelbook-mod .bookbtn-web{background-position:0 -30px}.hotelbook-mod .bookbtn-up{width:60px;height:30px;display:inline-block;font:700 15px "微软雅黑","宋体";color:graytext;text-align:center;line-height:30px}.hotelbook-mod li.room-more{padding:10px}.hotelbook-mod .more-wrap{text-align:center}.hotelbook-mod span.room-more-text{color:#444d62;display:inline-block}.hotelbook-mod span.room-more-icon{width:11px;height:10px;background:url(/mobile/simple/static/place/images/hotelbook_icon_844811c.png) no-repeat 0 -58px;display:inline-block;background-size:27px 107px}.hotelbook-mod .style-none{margin:0;padding:0;background:0;border:0}.hotelbook-mod .arrow-down{-webkit-transform:rotate(180deg)}.hotelbook-mod .arrow-toggle{-webkit-transform:rotate(90deg)}.hotel-loading{height:70px;background-color:#fff;font:14px "微软雅黑","宋体";color:#90cc77;box-sizing:border-box;padding:20px 36px;text-align:center;border:1px solid #DBDBDB;margin-top:10px}.hotel-loading>span:first-child{width:15px;height:15px;display:inline-block;background:url(/mobile/simple/static/place/images/hotelbook_state_icon_31a7e5b.png) no-repeat 0 0;background-size:15px 30px}.hotelbook-detail{padding:10px}.hotelbook-detail .hotelbook-tit{padding:10px;background-color:#FFF;border:1px solid #E4E4E4;border-bottom:0}.hotelbook-detail .hotelbook-tit .hotelbook-name{font:15px "微软雅黑","宋体";color:#4E4E4E;font-weight:700}.hotelbook-detail .hotelbook-tit .hotelbook-addr{font:14px "微软雅黑","宋体";color:#747474;margin-top:5px}.hotel-detail .detail-widget-streetscape{background:#fff;border:1px solid #e4e4e4;border-radius:3px;margin-top:10px;padding:10px;margin-bottom:10px}.hotel-detail .detail-widget-streetscape a{font:14px "微软雅黑","宋体";color:#333;padding:0}.comment-cont .place-widget-commentbtn{position:absolute;border:1px solid #C5C7CB;padding:0 .6em 0 0;height:2.8em;line-height:2.8em;top:.4em;right:.6em;background:#F9F9F9;font-weight:400;font-family:"微软雅黑","宋体"}.comment-cont .place-widget-commentbtn .combtn-icon{margin-right:2px}</style>
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
<div id="place-pagelet-hotelthirdota"></div>
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
                "tpl"=>"place:widget/hotelthirdota/hotelthirdota.tpl",
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
                uid: '{%$data.content.uid|f_escape_js%}'
            });
        {%/script%}
</div>
{%require name='place:page/detail/hotel.tpl'%}{%/block%}
