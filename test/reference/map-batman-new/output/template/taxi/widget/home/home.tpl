{%style id="/widget/home/home.inline.less"%}#taxi-pagelet-home{width:100%;background:url(/mobile/simple/static/taxi/widget/home/images/bg_f11b4e8.png) no-repeat center bottom;background-size:contain;box-sizing:border-box;overflow:hidden;position:relative}#taxi-pagelet-home .taxi-widget-home{overflow:hidden;height:auto;position:relative}#taxi-pagelet-home .taxi-widget-addprice{margin-bottom:20px}#taxi-pagelet-home .button-bar{position:relative}#taxi-pagelet-home form{width:100%;box-sizing:border-box;padding:0 22px;padding-bottom:20px}#taxi-pagelet-home .logo{position:relative;margin:17px auto 35px;width:120px;height:40px;box-sizing:border-box;padding-left:45px}#taxi-pagelet-home .baidu-taxi{font-size:18px;color:#666}#taxi-pagelet-home .slogan{font-size:14px;color:#999}#taxi-pagelet-home .icon{position:absolute;width:40px;height:40px;left:0;top:0;background:url(/mobile/simple/static/taxi/widget/home/images/bg-logo_35d71f6.png) no-repeat 0 0;background-size:40px 40px}#taxi-pagelet-home .btn-back{position:absolute;top:0;left:0;font-size:0;width:50px;height:50px;background:url(/mobile/simple/static/taxi/images/bg-btn-back_4b23705.png) no-repeat center center;background-size:16px 16px}#taxi-pagelet-home .btn-settings{position:absolute;top:0;right:0;font-size:0;width:50px;height:50px;background:url(/mobile/simple/static/taxi/widget/home/images/bg-settings_c2d5462.png) no-repeat center center;background-size:19px 19px}#taxi-pagelet-home .result{box-sizing:border-box;font-size:14px;line-height:15px;white-space:nowrap;text-align:center}#taxi-pagelet-home .result .text:first-child{padding-left:20px;background:url(/mobile/simple/static/taxi/images/icon-car_59fcbff.png) no-repeat left center;background-size:15px 15px}#taxi-pagelet-home .input-wrapper{position:relative;box-sizing:border-box;background:#fff;margin-bottom:8px;height:40px}#taxi-pagelet-home .home .input-wrapper::after{content:'';position:absolute;width:100%;height:100%;left:0;top:0;z-index:9}#taxi-pagelet-home input[type=text]{box-sizing:border-box;border:1px solid #999;border-radius:3px;padding:10px 10px 10px 35px;font-size:14px;line-height:20px;margin:0;height:100%;width:100%}#taxi-pagelet-home .input-icon{position:absolute;width:20px;height:20px;left:10px;top:10px;background:url(/mobile/simple/static/taxi/widget/home/images/bg-input-icon_9e9fce9.png) no-repeat 0 0;background-size:20px 40px}#taxi-pagelet-home .end .input-icon{background-position-y:-20px}#taxi-pagelet-home .nearby-car-info{text-align:center;font-size:14px;color:#a3a3a3;margin-bottom:40px}#taxi-pagelet-home .nearby-car-info .result{display:none}#taxi-pagelet-home .nearby-car-info.loaded .loading{display:none}#taxi-pagelet-home .nearby-car-info.loaded .result{display:block}#taxi-pagelet-home .nearby-car-info .count{font-size:21px;color:#3399fe}#taxi-pagelet-home .btn-submit{display:block;width:150px;height:40px;font-size:18px;color:#fff;background:url(/mobile/simple/static/taxi/widget/home/images/bg-btn-submit_a5f5c47.png) no-repeat 0 0;background-size:cover;padding:0;border:0;margin:0 auto}#taxi-pagelet-home .input-panel{position:relative;box-sizing:border-box;padding:60px 8px 0;height:100%}#taxi-pagelet-home .input-panel .input-wrapper{height:35px;margin:7px 0}#taxi-pagelet-home .input-panel .input-icon{width:15px;height:15px;background-size:15px 30px}#taxi-pagelet-home .input-panel .poi-input{height:100%;line-height:15px}#taxi-pagelet-home .input-panel .btn-confirm{position:absolute;right:8px;top:7px;background:url(/mobile/simple/static/taxi/widget/home/images/bg-btn-confirm_5d5d2b2.png) no-repeat center center;background-size:55px 35px;color:#fff;font-size:14px;width:55px;height:35px}#taxi-pagelet-home .input-panel .top-bar{box-sizing:border-box;position:absolute;top:0;left:0;width:100%;height:50px;padding:0 70px 0 60px;background:#fff}#taxi-pagelet-home .input-panel .btn-back-to-form{position:absolute;left:0;top:0;width:50px;height:50px;background:url(/mobile/simple/static/taxi/images/bg-btn-back_4b23705.png) no-repeat center center;background-size:16px 16px;border:0;padding:0;margin:0;font-size:0}#taxi-pagelet-home .input-panel .ui-suggestion{position:relative!important;box-sizing:border-box;font-size:16px;height:100%;overflow-y:auto;display:none}#taxi-pagelet-home .input-panel .ui-suggestion-content{border-style:solid;border-color:#ccc;border-width:1px 1px 0;border-radius:3px 3px 0 0;background:#fff;padding:0 12px}#taxi-pagelet-home .input-panel .ui-suggestion-button{border-style:solid;border-color:#ccc;border-width:0 1px 1px;border-radius:0 0 3px 3px;background:#fff;padding:0 12px;height:50px;line-height:50px;color:#ccc}#taxi-pagelet-home .input-panel .ui-suggestion-button span{float:left}#taxi-pagelet-home .input-panel .ui-suggestion-button span:last-child{float:right}#taxi-pagelet-home .input-panel .ui-suggestion-result{box-sizing:border-box;height:50px;line-height:50px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#333;border-bottom:1px solid #ccc}#taxi-pagelet-home .input-panel .ui-suggestion-result span:last-child{color:#ccc;font-size:12px}#taxi-pagelet-home .input-panel[data-type=route_end] .input-icon{background-position-y:-15px}.taxi-widget-dialog .content{padding-bottom:10px}.taxi-widget-dialog .content label{color:#999;font-size:12px}.taxi-widget-dialog .content .text{margin-bottom:10px}{%/style%}<div class="taxi-widget-home">
<div class="home">
{%widget name="taxi:widget/common/banner/banner.tpl"%}
<div class="button-bar">
<button class="btn-back" style="display: none;">返回</button>
<button class="btn-settings">设置</button>
</div>
<div class="logo">
<span class="icon"></span>
<div class="baidu-taxi">百度打车</div>
<div class="slogan">出行更方便</div>
</div>
<form>
<div class="input-wrapper start">
<span class="input-icon"></span>
<input type="text" readonly="readonly" name="route_start" placeholder="请输入起点"/>
</div>
<div class="input-wrapper end">
<span class="input-icon"></span>
<input type="text" readonly="readonly" name="route_end" placeholder="输入目的地"/>
</div>
<div class="nearby-car-info">
<div class="loading">正在获取附近出租车信息...</div>
<div class="result">
<span class="text">附近有</span>
<span class="count"></span>
<span class="text">辆出租车</span>
</div>
</div>
{%widget name="taxi:widget/common/addprice/addprice.tpl"%}
<input type="button" class="btn-submit" value="叫车"/>
<input type="hidden" name="lng"/>
<input type="hidden" name="lat"/>
<input type="hidden" name="city_code"/>
<input type="hidden" name="phone"/>
<input type="hidden" name="taxi_num"/>
<input type="hidden" name="price_list"/>
<input type="hidden" name="input_type" value="1"/>
<input type="hidden" name="add_price" value="0"/>
<input type="hidden" name="qt" value="userreq"/>
</form>
</div>
<div class="input-panel" style="display: none;">
<div class="top-bar">
<button class="btn-back-to-form">返回</button>
<div class="input-wrapper">
<span class="input-icon"></span>
<input type="text" autocomplete="off" class="poi-input"/>
</div>
<button class="btn-confirm">确定</button>
</div>
<div class="sug-container"></div>
</div>
</div>
{%script%}
require('taxi:widget/home/home.js').init();
{%/script%}