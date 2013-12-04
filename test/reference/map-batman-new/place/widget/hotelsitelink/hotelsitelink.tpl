{%* 第三方链接 *%}
{%if ($widget_data.widget.sitelink)%}
    <div class="hotel-card">
        <h2 class="hotel-sitetit">查看更多</h2>
        <ul class="hotel-sitelist clearfix">
            {%foreach $data.content.ext.detail_info.link as $obj%}
                {%if $obj.url_mobilephone || $obj.url %}
                    <li class="hotel-siteitem">
                        <a href="{%if empty($obj.url_mobilephone)%}{%urldecode($obj.url)%}{%else%}{%urldecode($obj.url_mobilephone)%}{%/if%}" target="_blank"
                            data-log="{code:{%$STAT_CODE.PLACE_DETAIL_SITELINK_CLICK%}, wd:'{%$wd%}', name:'{%$widget_data.name%}', ota:'{%$obj.cn_name%}'}">
                            <img src="http://map.baidu.com/fwmap/upload/place/icon/{%$obj.name%}/50.png" alt="{%$obj.cn_name%}" />
                        </a>
                    </li>
                {%/if%}
            {%/foreach%}
        </ul>
    </div>
{%/if%}