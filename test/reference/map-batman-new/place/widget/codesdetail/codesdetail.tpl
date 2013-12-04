{%if $data.errorNo == 0%}
    {%$codesData = $data.data%}
    <div class="page-header">
        <span class="back" id="back"></span>
        <span class="title">验证兑换码</span>
    </div>

    <section class="list-info">
        <img class="poster" id="pic" src="">       
        <dl class="list">
            <dt class="over"><span class="movie_title" id="name"></span><span class="movie_num" id="score"></span></dt>
            <dd class="detail over" id="duration"></dd>
            <dd class="detail over" id="category"></dd>
            <dd class="detail over" id="director"></dd>
            <dd class="detail over" id="player"></dd>
            <dd class="detail over" id="release"></dd>
        </dl>
    </section>

    <section class="list-info">
        <dl>
            <dt class="exchange">
                <p class="field">兑换场次</p>
                <p class="tix over">亲爱的用户，您有<span class="txt_red">{%$data.num%}</span>张观影券可选择兑换</p>
            </dt>
            <dd class="cinema" id="pname"></dd>
            <dd class="date over" id="day"></dd>
        </dl>
        <form>
            <p class="phone over">请输入您的手机号：<input id="phone" class="input_class" value="{%$data.phone%}" type="tel" size="12" /></p>
            {%foreach $codesData as $item%}
            <p class="codes clearfix">
                <label>
                    <input name="pid" type="checkbox" checked="checked"  value="{%$item.pid%}" />

                </label>
                <span>{%$item.cdkey%}</span>
            </p>
            {%/foreach%}
            <span class="button_sub" id="subSure">确认兑换</span>
        </form>
    </section>
    <div class="explanation">
        <p class="explanation_title">使用说明：</p>
        {%foreach $data.rule as $item key=index%}
        <p>{%$index + 1%}.{%$item%}</p>
        {%/foreach%}
    </div>
    {%script type="text/javascript"%}
        require('codesdetail.js').initialize({%json_encode($data)%});
    {%/script%}
    <div class="hide">
        <script type="text/javascript">
        var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
        document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fb2f5614b14af39b080fc30acfef3ccb4' type='text/javascript'%3E%3C/script%3E"));
        </script>
    </div>
{%/if%}