{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    <link rel="stylesheet"  type="text/css" href="/static/css/detail.inline.less?__inline">
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
                param = util.jsonToUrl({uid: '{%$data.uid%}'});

            BigPipe.asyncLoad({id: 'place-pagelet-thirdsrcota'}, param);
            BigPipe.asyncLoad({id: 'place-pagelet-hotelbook'}, param);
        {%/script%}
    </div>
{%/block%}
