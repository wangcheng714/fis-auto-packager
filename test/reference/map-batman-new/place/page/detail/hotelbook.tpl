{%extends file="common/page/layout.tpl"%}
{%block name="main"%}
    <link rel="stylesheet" type="text/css" href="/static/css/hoteldetail.inline.less?__inline">
    {%widget name="common:widget/nav/nav.tpl" title="酒店房型报价" mapLink=$data.result.type%}

    <div class="hotelbook-detail">
        <div class="hotelbook-tit">
            <p class="hotelbook-name">{%htmlspecialchars_decode($data.name)%}</p>
            {%if $data.addr%}
                <p class="hotelbook-addr">{%htmlspecialchars_decode($data.addr)%}</p>
            {%/if%}
        </div>
        {%widget name="place:widget/datepicker/datepicker.tpl" widget_data=$data%}
        {%$widget_rich_list=[
            [
                "tpl"=>"place:widget/hotelthirdsrc/hotelthirdsrc.tpl",
                "data"=>$data
            ],
            [
                "tpl"=>"place:widget/hotelthirdota/hotelthirdota.tpl",
                "data"=>$data
            ]
        ]%}
        {%foreach from=$widget_rich_list item=widget_item%}
            {%widget name=$widget_item.tpl
                widget_data=$widget_item.data pagelet_id=preg_replace('/(\w+)\:widget\/(\w+)\/(\w+)\.tpl/', '$1-pagelet-$2', $widget_item.tpl)
                mode="quickling"%}
        {%/foreach%}
        {%script%}
            (require('place:static/js/hotel.js').sendHotelbookAsync({
                uid: '{%$data.uid%}'
            }))
        {%/script%}
    </div>
{%/block%}
