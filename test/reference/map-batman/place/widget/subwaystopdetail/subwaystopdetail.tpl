{%* 地铁站途径地铁页面 *%}
<div id="detail-ext" class="place-widget-subwaystopdetail">
    {%if ($widget_data.subwayHref)%}
    <div id="poiDtl5" class="info_mod mod_poiDtl_list">
        <a href="{%$widget_data.subwayHref%}">
            <p class="sw"  data-city="beijing"><span class="go_sw"></span>
                <span>地铁专题图</span>
            </p>
        </a>
    </div>
    {%/if%}
    {%if isset($widget_data.ext.line_info)%}
    <div class="info_mod mod_poiDtl_list">
        <table cellpadding="0" cellspacing="0" class="ss_time_info bj">
            <thead>
                <tr>
                    <th class="col_dirt">行驶方向</th>
                    <th class="col_time">首班车</th>
                    <th class="col_time">末班车</th>
                </tr>
            </thead>
            <tbody>
                {%foreach $widget_data.ext.line_info as $index=>$item%}
                 {%if ($item.first_time == "" && $item.last_time == "") %}
                    {%continue%}
                 {%/if%}
                    <tr>
                        <td class="col_dirt">
                            <a href="{%$item.href%}"><em class="{%$item.curLCode%}"></em>{%$item.terminals%}</a>
                        </td>
                        <td>{%$item.first_time%}</td>
                        <td>{%$item.last_time%}</td>
                    </tr>
                    </a> 
                {%/foreach%}
            </tbody>
        </table>
    </div>
    {%/if%}
</div>
