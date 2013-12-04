<div class="result place-widget-clarify">
    <dl class="res poi">
        <dd class="bd bd1">
            {%assign var="content" value=$data.content%}
            {%assign var="current_city" value=$data.current_city%}
            {%assign var="more_city" value=$data.more_city%}
            <ol class="s4">
                <div class='cl_tip'><img src='http://s1.map.bdimg.com/mobile/static/place/ui/images/warn_ca48f04c.png' class='rl_warn_l'>在<b>{%$current_city.name%}</b>未找到相关地点</div>
                <div class='s4-tip'>您可以选择在以下城市中搜索到的结果，或者“返回”重新输入搜索的内容</div>
            </ol>
            <ol class="list s7">
                {%foreach $content as $item%}
                    <li data-args="{%$item.code%}" data-fn="f">
                        <a href="{%$item.url%}">
                            <div class="cl_d2">
                                <b>{%$item.name%}</b>
                            </div>
                            <div class="cl_opt">
                                <em class="cl_d1"><b>{%$item.num%}</b></em>
                                <em class="gt"></em>
                            </div>
                        </a>
                    </li>
                {%/foreach%}
                {%if ($more_city)%}
                    <li><dl><dt><b>更多地区：</b></dt></dl></li>
                    {%foreach $more_city as $key => $item%}
                        <li data-args="{%$key%}" data-fn="s">
                            <a href="{%$item.url%}">
                                <div class="cl_d2">
                                    <b>{%$item.province%}</b>
                                </div>
                                <div class="cl_opt">
                                    <em class="cl_d1"><b>{%$item.num%}</b></em>
                                    <em class="gt"></em>
                                </div>
                            </a>
                        </li>
                    {%/foreach%}
                {%/if%}
            </ol>
        </dd>
    </dl>
</div>