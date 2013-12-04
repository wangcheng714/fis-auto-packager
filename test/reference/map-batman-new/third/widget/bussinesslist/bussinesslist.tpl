{%* 商圈筛选页 *%}

{%$list = $data.content.sub%}
<div class="index-widget-bussinesslist">
    <ul class="rl_list">
        <li li_type="top" class="category categoryparent">
            <h4>{%$data.content.area_name%}</h4>
            <span class="rl_opt"><em class="rl_opt_btn rl_opt_close"></em></span>
        </li>
        <li class="rl_sub_list">
            <ul class="rl_sub_wrapper">
                {%foreach $list as $childindex=>$childitem%}
                <li>
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
{%/script%}