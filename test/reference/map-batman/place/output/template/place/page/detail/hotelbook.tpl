{%extends file="common/page/layout.tpl"%} 
{%block name="main"%}
<style  type="text/css">.place-page-detail{padding:0 8px 8px;background:#F2F2F2;overflow:hidden}.place-page-detail>[class^=place-widget-],.place-page-detail>[id^=place-pagelet-]>[class^=place-widget-]{margin:10px 0}.place-page-detail .place-widget-comment,.place-page-detail .place-widget-overview,.place-page-detail .place-widget-sitelink,.place-page-detail .place-widget-tosearch,.place-page-detail .place-widget-cater,.place-page-detail .place-widget-recommend{margin:20px 0}.place-page-detail.movie>[class^=place-widget-],.place-page-detail.movie>[id^=place-pagelet-]>[class^=place-widget-]{margin-bottom:0}.place-page-detail.movie div.place-widget-goto{margin:0 0 10px}.place-page-detail.movie div.place-widget-captain,.place-page-detail.movie div.place-pagelet-basicmovieinfo,.place-page-detail.movie div.place-widget-promotion{margin:10px 0 0}</style>
{%widget name="common:widget/nav/nav.tpl" title="酒店房型报价" mapLink=$data.result.type%}
<div class="place-page-detail">
{%widget name="place:widget/captain/captain.tpl" widget_data=$data%}
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
            ]
        ]%}
{%foreach from=$widget_rich_list item=widget_item%}
{%widget name=$widget_item.tpl widget_data=$widget_item.data pagelet_id=preg_replace('/(\w+)\:widget\/(\w+)\/(\w+)\.tpl/', '$1-pagelet-$2', $widget_item.tpl) mode="quickling"%}
{%/foreach%}
{%script%}
            var util = require('common:static/js/util.js'),
                param = util.jsonToUrl({uid: '{%$data.uid|f_escape_js%}'});

            BigPipe.asyncLoad({id: 'place-pagelet-thirdsrcota'}, param);
            BigPipe.asyncLoad({id: 'place-pagelet-hotelbook'}, param);
        {%/script%}
</div>
{%require name='place:page/detail/hotelbook.tpl'%}{%/block%}
