{%* 酒店模板 *%}
{%extends file="common/page/layout.tpl"%}

{%block name="js"%}
    <link rel="stylesheet" type="text/css" href="/static/css/hoteldetail.inline.less?__inline">
{%/block%}

{%block name="main"%}
    {%* 导航widget *%}
    {%widget name="common:widget/nav/nav.tpl" title="详情" mapLink=$commonUrl.nav.map pageType="detail"%}

    <div class="hotel-detail">
        {%*头部酒店名称、地址基本信息*%}
        <div id="hotel-imginfo" class="hotel-card">
            <h4 class="hotel-title">{%$data.content.name%}</h4>

            {%*酒店扩展详情图片区域信息(quickling区块)*%}
            <div id="place-pagelet-hotelextimg">
                {%widget name="place:widget/loading/loading.tpl"%}
            </div>

            <p class="hotel-addr">地址：{%$data.content.addr%}</p>
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

            stat.addStat(STAT_CODE.PLACE_DETAIL_VIEW, {'wd': '{%$data.content.name%}', 'srcname': 'hotel'});

            (require('place:static/js/hotel.js')).init({
                uid: '{%$data.content.uid%}'
            });
        {%/script%}

    </div>
{%/block%}
