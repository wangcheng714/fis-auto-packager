{%* 商圈筛选页 *%}

{%$list = $data.content.sub%}
<div class="index-widget-bussinesslist">
    <ul class="list">
        <li class="top-title">
            <h4>{%$data.content.area_name%}</h4>
            <span class="opt"><em class="opt_btn opt_close"></em></span>
        </li>
        <li class="sub_list">
            <ul class="sub_wrapper">
                <li data-areacode = "{%$data.content.area_code%}" jsaction="complete">
                     <h4>
                         全市
                     </h4>
                </li>
                {%foreach $list as $childindex=>$childitem%}
                <li data-areacode = "{%$childitem.area_code%}" jsaction="{%if $childitem.sup_business_area == 1%}listsub{%else%}complete{%/if%}">
                     <h4>
                         {%$childitem.area_name%}
                     </h4>
                </li>
                {%/foreach%}
            </ul>
        </li>
    </ul>
    </div>
</div>

{%script%}
var listData = {%$data.content|json_encode|escape:"none"%}
require("businesslist.js").init(listData);
{%/script%}