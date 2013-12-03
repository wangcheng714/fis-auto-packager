{%* 筛选框样式 *%}

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
    		    	{%$data.listInfo.centerName%}{%else%}{%$select_data.dist[$select_dist]|default:"范围"%}{%/if%}</em>
				{%if $select_data.dist%}
	                <select name="pl_dist" value = "{%$select_dist|default:$select_data.dist[0]%}" >
	                    {%foreach from=$select_data.dist item=option_item key=option_key%}
	                        <option value="{%$option_key%}" {%if $option_key == $select_dist%}selected=selected{%/if%}>{%$option_item%}</option>
	                    {%/foreach%}
	                </select>
                {%/if%}
                <span class="select_icon"></span>
            </span>
            <span class ="select-box {%if !$select_data.sort_type || $disableSelect == true%}select-disable{%/if%}">
    		    <em class = "select_title">{%$select_data.sort_type[$select_sort_type_rule]|default:"排序"%}</em>
				{%if $select_data.sort_type%}
	                <select name="pl_sort_type" value = "{%$select_sort_type|default:$select_data.sort_type[0]%}" >
	                    {%foreach from=$select_data.sort_type item=option_item key=option_key%}
	                        <option value="{%$option_key%}" {%if $option_key == $select_sort_type_rule%}selected=selected{%/if%}>{%$option_item%}</option>
	                    {%/foreach%}
	                </select>
                {%/if%}
                <span class="select_icon"></span>
            </span>
            <span class ="select-box {%if $isMovie %}city-select{%/if%} {%if !$select_data.sub_type%}select-disable{%/if%}">
    		    <em class = "select_title">{%if $isMovie %}
                    {%$data.listInfo.centerName%}{%else%}{%$select_sub_type|default:"分类"%}{%/if%}</em>

				{%if $select_data.sub_type%}
	                <select name="pl_sub_type" value = "{%$select_sub_type%}" >
	                    {%foreach from=$select_data.sub_type item=option_item%}
	                        <option value="{%$option_item%}" {%if $option_item == $select_sub_type%}selected=selected{%$hasSubType=1%}{%/if%}>{%$option_item%}</option>
	                    {%/foreach%}
                        {%if $hasSubType != 1 && $select_sub_type%}
                            <option value="{%$select_sub_type%}" selected=selected>{%$select_sub_type%}</option>
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
        select_type : "{%$select_type%}",
        what : "{%$data.result.what%}",
        wd : "{%$data.result.wd%}",
        srcname : "{%$data.content[0].ext.src_name%}"
    }
    require("selectbox.js").init(selectData);
{%/script%}

