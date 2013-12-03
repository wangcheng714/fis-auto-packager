{%* @file 列表页模板 *%}


{%if $data.result.type eq 41%}
    {%$content_data = $data.addrs%}
{%else%}
    {%$content_data = $data.content%}
{%/if%}

<div class="place-widget-selectlist">
    <div class="list-wrapper">
        <ul class="place-list {%if $data.result.type == 2 %} area-list {%/if%}">
            {%foreach item=list_item from=$content_data %} 
            <li data-i="{%counter name=index%}" class="">
                <strong class="rl_li_title">{%$list_item.name%}</strong>
                <p class="addr">{%$list_item.addr%}</p>
                {%* 路线类的点 不显示路线搜索按钮*%}
                {%$list_item.type%}
                <span class="mkr-icon marker-{%counter%}"></span>
            </li>
            {%/foreach%}
        </ul>
    </div>
</div>


{%script%}

var list = {%$content_data|json_encode|escape:"none"%};
var curCity = {%$data.current_city|json_encode|escape:"none"%};
var type = {%$data.result.type%};
var result = {%$data.result|json_encode|escape:"none"%};


var data = {
    list : list,
    city : curCity,
    type : type,
    result : result
};

require("selectlist.js").init(data);
{%/script%}
