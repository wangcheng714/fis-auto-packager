{%if $data.errorNo == 0%}
{%$movieData = $data.movie%}
<section class="banner">
    <img id="bannerimg" src="{%$data.banner_image_url%}"/>
</section>
<section class="mod mod_buy">
   <!--  <div class="pic">
        
        {%if !empty($movieData.imgurl)%}
            <img src="{%$movieData.imgurl%}" width="78" height="112">
        {%/if%}
    </div> -->
    <div class="info">
        <div class="info_top">
            {%htmlspecialchars_decode($data.ext_data)%}
            <p>剩余张数：<span class="txt_red">{%$data.sur_num%}</span>张</p>
        </div>
        {%if $data.sur_num == 0%}
            <div class="btn_wrap_over">
                <a class="btn_over">活动结束</a>
            </div>
        {%else%}
        <ul class="info_form">
            <li>
                <label class="col_tit">购买数量</label>
                <div class="col_main" id="buyCodeCount">
                                
                    {%if $data.sur_num < $data.per_num%}

                        {%for $foo=1 to $data.sur_num%}
                            {%if $foo==1%}
                                <span class="col_op selected">{%$foo%}张</span>
                            {%else%}
                                <span class="col_op">{%$foo%}张</span>
                            {%/if%}
                        {%/for%}

                    {%else%}
                        {%for $foo=1 to $data.per_num%}
                            {%if $foo==1%}
                                <span class="col_op selected">{%$foo%}张</span>
                            {%else%}
                                <span class="col_op">{%$foo%}张</span>
                            {%/if%}
                        {%/for%}
                    {%/if%}
                </div>
                <div class="numMsg vhide" id="numMsg">您的限额已经用完！</div>
            </li>
            <li>
                <label class="col_tit">手机号码</label>
                <div class="col_main">
                    <input id="phone" class="phone" size="12" type="text" name="phone" />
                    <spn id="phoneMsg" class="numMsg vhide">手机号有误！</spn>
                </div>
                <p class="phone_tip">手机号用于接收电子密码，请填写真实号码</p>
                
            </li>
            <li class="clearfix">
                <div class="btn_wrap">
                    <a class="btn" id="submitBtn">立即抢购</a>
                    <span class="btn_tip">本活动不支持退票</span>
                </div>
            </li>
        </ul>
        {%/if%}
    </div>
    <a class="more" href="#cinemasbox">查看活动影院&gt;&gt;</a>
</section>
<section class="mod">
    <h2 class="mod_tit_active" id="rule">活动细则</h2>
</section>
<section class="mod hide" id="rule_list">
    <ol class="rule_lst">
        {%foreach $data.rule as $item key=index%}
        <li><span class="order">{%($index+1)%}</span>{%htmlspecialchars_decode($item)%}</li>
        {%/foreach%}
    </ol>
</section>
<section class="mod">
    <h2 class="mod_tit_active" id="movieinfo">影片简介</h2>
</section>
<section class="mod mod_intro hide" id="movieinfolist">

    {%if !empty($movieData.director)%}
        <p>导演：{%$movieData.director%}</p>
    {%/if%}

    {%if !empty($movieData.actor)%}
        <p>主演：
            {%foreach $movieData.actor as $item%}
                {%$item%}
            {%/foreach%}
        </p>
    {%/if%}

    {%if !empty($movieData.intro)%}
        <p>剧情简介：{%$movieData.intro%}</p>
    {%/if%}
</section>
<section class="mod mod_city" id="cinemasbox">
    <div class="city_wrap">
        <select class="city_sel" id="citylist">

        </select>
    </div>
    <ul class="city_lst" id="cinemas">
        
    </ul>
</section>
{%script type="text/javascript"%}
    require('codesindex.js').initialize({act_id: {%json_encode($data.act_id)%},sign : {%json_encode($data.sign)%},price:{%$data.price/100%},share:{%json_encode($data.movie)%},share_content:{%json_encode($data.share_content)%}});
{%/script%}
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