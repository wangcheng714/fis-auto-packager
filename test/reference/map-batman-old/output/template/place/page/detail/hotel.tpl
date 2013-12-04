{%* 酒店 *%}
{%extends file="place/page/detail/base.tpl"%}
{%block name="detailInfo"%}
    {%widget name="place:widget/basicinfo/basicinfo.tpl" widget_data=$data.content.ext pagelet_id="place-pagelet-basicinfo" mode="quickling"%}
{%/block%}
{%block name="richInfo"%}
    {%widget name="place:widget/datepicker/datepicker.tpl"%}
    {%$widget_rich_list=[
        [
            "tpl"=>"place:widget/thirdsrcota/thirdsrcota.tpl",
            "isShow"=>$data.widget.thirdsrcota,
            "data"=>$data
        ],
        [
            "tpl"=>"place:widget/hotelbook/hotelbook.tpl",
            "isShow"=>$data.widget.hotelbook,
            "data"=>$data
        ],
        [
            "tpl"=>"place:widget/bookphone/bookphone.tpl",
            "isShow"=>$data.widget.bookphone,
            "data"=>["data"=>$data.content.ext.detail_info.ota_info[0],
                     "src_name"=>$data.content.ext.src_name,
                     "name"=>$data.content.name]
        ],
        [
            "tpl"=>"place:widget/promotion/promotion.tpl",
            "isShow"=>$data.widget.promotion,
            "data"=>["data"=>$data.content.ext.detail_info,
                     "src_name"=>$data.content.ext.src_name,
                     "name"=>$data.content.name]
        ],
        [
            "tpl"=>"place:widget/toplist/toplist.tpl",
            "isShow"=>$data.widget.toplist,
            "data"=>["data"=>$data.content.ext.detail_info.toplist, 
                     "src_name"=>$data.content.ext.src_name,
                     "name"=>$data.content.name]
        ],
        [
            "tpl"=>"place:widget/overview/overview.tpl",
            "isShow"=>$data.widget.overview,
            "data"=>["data"=>$data.content.ext.rich_info, 
                     "src_name"=>$data.content.ext.src_name,
                     "name"=>$data.content.name]
        ],
        [
            "tpl"=>"place:widget/comment/comment.tpl",
            "isShow"=>$data.widget.comment,
            "data"=>["data"=>$data.content.ext, 
                     "src_name"=>$data.content.ext.src_name,
                     "name"=>$data.content.name]
        ],
        [
            "tpl"=>"place:widget/recommend/recommend.tpl",
            "isShow"=>$data.widget.recommend,
            "data"=>$data.content.ext.detail_info.nearby
        ],
        [
            "tpl"=>"place:widget/sitelink/sitelink.tpl",
            "isShow"=>$data.widget.sitelink,
            "data"=>["data"=>$data.content.ext.detail_info.link, 
                     "src_name"=>$data.content.ext.src_name,
                     "name"=>$data.content.name]
        ]
    ]%}
    {%foreach from=$widget_rich_list item=widget_item%}
        {%widget name=$widget_item.tpl widget_data=$widget_item.data pagelet_id=preg_replace('/(\w+)\:widget\/(\w+)\/(\w+)\.tpl/', '$1-pagelet-$2', $widget_item.tpl) mode="quickling"%}
    {%/foreach%}
    {%script%}
        var util = require('common:static/js/util.js'),
            param = util.jsonToUrl({uid: '{%$data.content.uid|f_escape_data|escape:none%}'});
            
        BigPipe.asyncLoad({id: 'place-pagelet-thirdsrcota'}, param);
        BigPipe.asyncLoad({id: 'place-pagelet-hotelbook'}, param);
    {%/script%}
{%require name='place:page/detail/hotel.tpl'%}{%/block%}
