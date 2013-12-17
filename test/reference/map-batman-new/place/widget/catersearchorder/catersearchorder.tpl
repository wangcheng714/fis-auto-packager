<div id="place-widget-catersearchorder">
    <div class="input-group">
        <label>手机号</label>
        <div class="input">
            <input type="tel" data-node="tel" placeholder="联系人手机号">
        </div>
    </div>
    <div class="input-group">
        <div class="input">
            <input type="text" data-node="veriCode" placeholder="手机验证码">
        </div>
        <div class="vcode-btn" data-node="veriCodeBtn">获取验证码</div>
    </div>
    <div class="submit" data-node="submitBtn">查询</div>
</div>

{%script%}
    require('catersearchorder.js').init({
        kehuduan: '{%$kehuduan%}'
    });
    var stat = require('common:widget/stat/stat.js');
    stat.addStat(STAT_CODE.PLACE_CATER_ORDER_SEARCH_PV, {srcname: 'cater'});
{%/script%}