{%style id="/widget/selectlist/selectlist.inline.less"%}/* 结果列表页 result list */
.place-widget-selectlist {
  color: #3b3b3b;
  font-size: 1em;
  background-color: #F2F2F2;
  border-top: 1px solid #ddd;
}
.place-widget-selectlist {
  /* poi结果页 */

}
.place-widget-selectlist .mkr-icon {
  position: absolute;
  top: 10px;
  left: 15px;
}
.place-widget-selectlist li {
  min-height: 3.2em;
  padding: 10px 45px 0 49px;
  border-bottom: 1px solid #ddd;
  background-color: #f2f2f2;
  position: relative;
}
.place-widget-selectlist li.active {
  background-color: #f4f4f4;
}
.place-widget-selectlist h4 {
  padding-top: 9px;
  font-size: 15px;
  color: #3b3b3b;
}
.place-widget-selectlist li .addr {
  margin-top: 2px;
}
.place-widget-selectlist li p,
.place-widget-selectlist li h4 {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  -webkit-margin-before: 0;
  -webkit-margin-after: 0;
}
.place-widget-selectlist .list-wrapper {
  border-top: none;
}
.place-widget-selectlist .list-wrapper li {
  white-space: nowrap;
  min-height: 45px;
}
.place-widget-selectlist .list-wrapper li p.padd {
  color: #4c4c4c;
}
.place-widget-selectlist .list-wrapper li p {
  white-space: nowrap;
  color: #5e5e5e;
  font-size: 12px;
}
.place-widget-selectlist .rl_li_title {
  font-size: 1.07em;
  max-width: 80%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.place-widget-selectlist .place-list {
  border-bottom: 1px solid #fff;
}
.place-widget-selectlist .place-list strong.rl_li_title {
  max-width: 70%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.place-widget-selectlist .place-list h4 {
  font-weight: normal;
}
.place-widget-selectlist .list-wrapper .rl_opt {
  height: 2em;
  margin-top: -1em;
  line-height: 2.286em;
  padding-right: 2.5em;
  right: 0.5em;
}
.place-widget-selectlist .area-list li {
  padding-left: 8px;
}
.place-widget-selectlist .area-list .mkr-icon {
  display: none;
}
{%/style%}{%* @file 列表页模板 *%}


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

require("place:widget/selectlist/selectlist.js").init(data);
{%/script%}
