{%* 公交车详情页面 *%}
<section id="detail-list" class="place-widget-linedetail">
    <div id="poiLineDtl" class="result" style="display: block;">
        <div class="res poi">
            <div id="detail-line-info" class="bd">
                <div class="poi_binfo">
                    <table class="line_info_tab" cellpadding="0" cellspacing="0">
                        <tbody>
                            <tr>
                                <td>起点站首车时间</td>
                                <td>{%$widget_data.startTime%}</td>
                            </tr>
                            <tr>
                                <td>起点站末车时间</td>
                                <td>{%$widget_data.endTime%}</td>
                            </tr>
                            <tr>
                                <td>单程最高票价</td>
                                <td>{%$widget_data.maxPrice%}</td>
                            </tr>
                            <tr>
                                <td>是否月票有效</td>
                                <td>{%$widget_data.isMonTicket%}</td>
                            </tr>
                            <tr>
                                <td>所属公司</td>
                                <td>{%$widget_data.company%}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {%if isset($widget_data.stations)%}
            <div id="detail-line-stop" class="info_mod mod_poidtl_list">
                <div class="title">途经站：</div>
                <ol class="list s8 stop_list">
                    {%foreach $widget_data.stations as $index=>$data%}
                    <li><em class="no">{%$data.no%}</em><dl>
                        <dt><a href="{%$data.href%}">{%$data.name%}</a></dt>
                    </dl>
                    </li>
                    {%/foreach%}
                </ol>
            </div>
            {%/if%}
        </div>
    </div>
</section>