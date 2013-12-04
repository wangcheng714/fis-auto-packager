{%* 公交车途径车站页面 *%}
{%if isset($widget_data.blinfo)%}
<div class="place-widget-lineway">
    <div id="bus-stop-list" class="info_mod mod_poiDtl_list">
        <div class="title">途经公交车：</div>
        <ol class="list s8">
            {%foreach $widget_data.blinfo as $index=>$bdata%}
                <li>
                    <em class="it bs"></em>
                    <dl>
                        <dt>
                            <a href="{%$bdata.href%}">
                                {%$bdata.addr%}（{%$bdata.name%}）
                            </a>
                        </dt>
                    </dl>
                </li>
            {%/foreach%}
        </ol>
    </div>
</div>
{%/if%}