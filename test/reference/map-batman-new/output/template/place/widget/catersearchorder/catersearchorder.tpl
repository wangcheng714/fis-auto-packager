{%style id="/widget/catersearchorder/catersearchorder.inline.less"%}#place-widget-catersearchorder{margin:16px 13px 0}#place-widget-catersearchorder .input-group{display:-webkit-box;margin-bottom:10px}#place-widget-catersearchorder label{width:53px;height:32px;line-height:32px;display:-webkit-box}#place-widget-catersearchorder .input{border:1px solid #bfbfc0;border-radius:3px;-webkit-box-flex:1;display:-webkit-box;padding:5px;background-color:#fff}#place-widget-catersearchorder .input input{display:block;width:100%;outline:0;height:20px;line-height:20px;border:0;font-size:14px;padding:0;margin:0}#place-widget-catersearchorder .submit{cursor:pointer;height:38px;border:1px solid #fea340;background-color:#ff9e35;color:#fff;line-height:38px;text-align:center;border-radius:3px;font-size:18px}#place-widget-catersearchorder .vcode-btn{border-radius:3px;margin-left:5px;width:104px;height:30px;line-height:30px;text-align:center;cursor:pointer;color:#3467a5;border:1px solid #acc5e5;background-color:#e3ecf7}#place-widget-catersearchorder .disabled{background-color:#DFDCDC;border:1px solid #bfbfc0;color:#909090}{%/style%}<div id="place-widget-catersearchorder">
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
    require('place:widget/catersearchorder/catersearchorder.js').init({
        kehuduan: '{%$kehuduan|f_escape_js%}'
    });
{%/script%}