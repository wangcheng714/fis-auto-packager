{%style id="/widget/selectbox/selectbox.inline.less"%}.place-widget-selectbox{width:100%;height:30px;text-align:center;background-color:#f0f0f0;display:block}.place-widget-selectbox .select-box{display:inline-block;height:28px;width:28.7%;line-height:28px;padding:0 0 0 .357em;-webkit-border-radius:3px;background:#fff;position:relative;border:1px solid #c9c9c9;text-align:left;-webkit-tap-highlight-color:rgba(0,0,0,0)}.place-widget-selectbox .select-box:first-child{float:left}.place-widget-selectbox .select-box:last-child{float:right}.place-widget-selectbox .select-box .select_title{font-size:.857em;color:#333;vertical-align:top;font-style:normal}.place-widget-selectbox .select-box select{opacity:0;position:absolute;height:100%;width:100%;left:0}.place-widget-selectbox .select-box .select_icon{position:absolute;height:28px;width:9px;right:4px;top:11px}.place-widget-selectbox .select-disable select{display:none}.place-widget-selectbox .select-disable .select_title{color:#aaa}.place-widget-selectbox .select-box .select_icon{background:url(/static/place/images/select_area_060d02b.png) 0 0 no-repeat;background-size:9px 5px}.place-widget-selectbox #slct_d_dist .select_title{margin-left:4px}.place-widget-selectbox #slct_d_sort_type .select_title{margin-left:8px}.place-widget-selectbox #slct_d_sub_type .select_title{margin-left:12px}.place-widget-selectbox .city-select select{display:none}{%/style%}{%* 筛选框样式 *%}
{%json file="place/select.json" assign="select_conf"%}
{%if $isMovie %}
{%$select_type="movie"%}
{%elseif $select_type %}
{%elseif $select_type == "" && $data.listInfo.isBank%}
{%$select_type="_bank"%}
{%else%}
{%$select_type="genRequest"%}
{%/if%}
{%$place_info=$data.place_param[0]%}
{%$select_data = $select_conf[$select_type]%}
{%$select_dist = $place_info.dist%}
{%$select_sort_type = $place_info.sort_type|default:'defalut'%}
{%$select_sub_type = $data.result.what%}
{%$select_sort_rule = $place_info.sort_rule|default:0%}
{%$select_sort_type_rule = $select_sort_type|cat:'__'|cat:$select_sort_rule%}
{%if $select_data%}
<div class="place-widget-selectbox">
<form>
<span class ="select-box  {%if $data.listInfo.isShowBussinessArea && !$isMovie %}city-select{%/if%} {%if !$select_data.dist || $disableSelect == true%}select-disable{%/if%}">
<em class = "select_title">{%if $data.listInfo.isShowBussinessArea && !$isMovie %}
{%$data.listInfo.centerName|f_escape_xml%}{%else%}{%$select_data.dist[$select_dist]|default:"范围"|f_escape_xml%}{%/if%}</em>
{%if $select_data.dist%}
<select name="pl_dist" value = "{%$select_dist|default:$select_data.dist[0]|f_escape_xml%}" >
{%foreach from=$select_data.dist item=option_item key=option_key%}
<option value="{%$option_key|f_escape_xml%}" {%if $option_key == $select_dist%}selected=selected{%/if%}>{%$option_item|f_escape_xml%}</option>
{%/foreach%}
</select>
{%/if%}
<span class="select_icon"></span>
</span>
<span class ="select-box {%if !$select_data.sort_type || $disableSelect == true%}select-disable{%/if%}">
<em class = "select_title">{%$select_data.sort_type[$select_sort_type_rule]|default:"排序"|f_escape_xml%}</em>
{%if $select_data.sort_type%}
<select name="pl_sort_type" value = "{%$select_sort_type|default:$select_data.sort_type[0]|f_escape_xml%}" >
{%foreach from=$select_data.sort_type item=option_item key=option_key%}
<option value="{%$option_key|f_escape_xml%}" {%if $option_key == $select_sort_type_rule%}selected=selected{%/if%}>{%$option_item|f_escape_xml%}</option>
{%/foreach%}
</select>
{%/if%}
<span class="select_icon"></span>
</span>
<span class ="select-box {%if $isMovie %}city-select{%/if%} {%if !$select_data.sub_type%}select-disable{%/if%}">
<em class = "select_title">{%if $isMovie %}
{%$data.listInfo.centerName|f_escape_xml%}{%else%}{%$select_sub_type|default:"分类"|f_escape_xml%}{%/if%}</em>
{%if $select_data.sub_type%}
<select name="pl_sub_type" value = "{%$select_sub_type|f_escape_xml%}" >
{%foreach from=$select_data.sub_type item=option_item%}
<option value="{%$option_item|f_escape_xml%}" {%if $option_item == $select_sub_type%}selected=selected{%$hasSubType=1%}{%/if%}>{%$option_item|f_escape_xml%}</option>
{%/foreach%}
{%if $hasSubType != 1 && $select_sub_type%}
<option value="{%$select_sub_type|f_escape_xml%}" selected=selected>{%$select_sub_type|f_escape_xml%}</option>
{%/if%}
</select>
{%/if%}
<span class="select_icon"></span>
</span>
</form>
</div>
{%/if%}
{%script%}
    var selectData = {
        select_type : "{%$select_type|f_escape_js%}",
        what : "{%$data.result.what|f_escape_js%}",
        wd : "{%$data.result.wd|f_escape_js%}",
        srcname : "{%$data.content[0].ext.src_name|f_escape_js%}"
    }
    require("place:widget/selectbox/selectbox.js").init(selectData);
{%/script%}
