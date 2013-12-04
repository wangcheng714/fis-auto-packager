{%if $data.errorNo == 0%}
<div class="page-header">
    <span class="back" id="back"></span>
    <div class="title">可兑换影院</div>
    <div class="area_box">
        <select name="city" id="city" class="area">
            {%foreach $data.list as $item%}
            <option value="{%$item.city_id%}">{%$item.city%}</option>
            {%/foreach%}
        </select>
    </div>
</div>
<div id="codes_box">
    <section class="list-info" id="list_info"></section>
    {%script type="text/javascript"%}
        require('codes.js').initialize({%json_encode($data.code)%},{%json_encode($data.sign)%});
    {%/script%}
</div>
<div id="over" class="codes_error hide">抱歉，你所在的城市电影还没上映哦~</div>
<div class="hide">
        <script type="text/javascript">
        var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb2f5614b14af39b080fc30acfef3ccb4' type='text/javascript'%3E%3C/script%3E"));
        </script>
    </div>
{%elseif $data.errorNo == 300008%}
<div class="codes_error">抱歉，您所在的城市不支持此活动哦~</div>
{%elseif $data.errorNo == 300007%}
<div class="codes_error">呃，定位失败了，刷新一下吧~</div>
{%elseif $data.errorNo == 300012%}
<div class="codes_error">抱歉，你所在的城市电影还没上映哦~</div>
{%else%}
<div class="codes_error">抱歉，该活动已结束，下次早点来~</div>
{%/if%}