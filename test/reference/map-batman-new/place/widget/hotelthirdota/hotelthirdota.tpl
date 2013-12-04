{%* 酒店预订房型列表页 *%}
{%if ($data.widget && $data.widget.hotelbook)%}
    <div class="hotel-subcard hotelbook-mod">
        {%if $widget_data.errorNoRoom=="0" %}
            <div class="hotel-head">
                <span class="hotel-icon-qunar"></span>
                <h3 class="tit-text hb-hd-tit">去哪儿</h3>
                <a class="des-text qunar-granantee" href="/mobile/webapp/place/guarantee/type=guarantee{%if $kehuduan%}/kehuduan=1{%/if%}"
                   data-log="{code:{%$STAT_CODE.PLACE_HOTEL_GUARANTEE_CLICK%}, name:'{%$widget_data.content.name%}'}">
                    （去哪儿网为您提供担保<span class="hotel-des-icon"></span>）</a>
            </div>
            <div class="hotel-roomlist-thirdota">
                {%widget name="place:widget/hotelthirdota/roomlist.tpl"%}
                <div id="uid" class="hide">{%$widget_data.uid%}</div>
            </div>

            {%script%}
            (require("place:widget/hotelthirdota/hotelthirdota.js")).init({
                kehuduan: '{%$kehuduan%}'
            });
            {%/script%}
        {%/if%}
    </div>
{%else%}
    {%widget name="place:widget/loadfailed/loadfailed.tpl" widget_data="暂时获取不到该酒店的预订数据..."%}
{%/if%}



