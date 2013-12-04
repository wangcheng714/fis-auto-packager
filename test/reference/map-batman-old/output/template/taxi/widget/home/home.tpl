{%style id="/widget/home/home.inline.less"%}.taxi-widget-home {
  width: 100%;
  height: 100%;
  background: url(/static/taxi/widget/home/images/bg_7ad6f23.png) no-repeat center bottom;
  background-size: contain;
  box-sizing: border-box;
  overflow: hidden;
  /* 输入面板样式 */

}
.taxi-widget-home .taxi-widget-addprice {
  margin-bottom: 20px;
}
.taxi-widget-home form {
  width: 100%;
  box-sizing: border-box;
  padding: 0px 22px;
  padding-bottom: 20px;
}
.taxi-widget-home .logo {
  position: relative;
  margin: 17px auto 35px;
  width: 120px;
  height: 40px;
  box-sizing: border-box;
  padding-left: 45px;
}
.taxi-widget-home .baidu-taxi {
  font-size: 18px;
  color: #666;
}
.taxi-widget-home .slogan {
  font-size: 14px;
  color: #999;
}
.taxi-widget-home .icon {
  position: absolute;
  width: 40px;
  height: 40px;
  left: 0px;
  top: 0px;
  background: url(/static/taxi/widget/home/images/bg-logo_ca9abcd.png) no-repeat 0 0;
  background-size: 40px 40px;
}
.taxi-widget-home .btn-back {
  position: absolute;
  top: 0px;
  left: 0px;
  font-size: 0px;
  width: 50px;
  height: 50px;
  background: url(/static/taxi/images/bg-btn-back_cc27fec.png) no-repeat center center;
  background-size: 16px 16px;
}
.taxi-widget-home .btn-settings {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 0px;
  width: 50px;
  height: 50px;
  background: url(/static/taxi/widget/home/images/bg-settings_6f1db5b.png) no-repeat center center;
  background-size: 19px 19px;
}
.taxi-widget-home .result {
  box-sizing: border-box;
  font-size: 14px;
  line-height: 15px;
  white-space: nowrap;
  text-align: center;
}
.taxi-widget-home .result .text:first-child {
  padding-left: 20px;
  background: url(/static/taxi/images/icon-car_f701f6b.png) no-repeat left center;
  background-size: 15px 15px;
}
.taxi-widget-home .input-wrapper {
  position: relative;
  box-sizing: border-box;
  background: #fff;
  margin-bottom: 8px;
  height: 40px;
}
.taxi-widget-home .form .input-wrapper::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  z-index: 9;
}
.taxi-widget-home input[type=text] {
  box-sizing: border-box;
  border: 1px solid #999;
  border-radius: 3px;
  padding: 10px 10px 10px 35px;
  font-size: 14px;
  line-height: 20px;
  margin: 0px;
  height: 100%;
  width: 100%;
}
.taxi-widget-home .input-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  left: 10px;
  top: 10px;
  background: url(/static/taxi/widget/home/images/bg-input-icon_4d19c14.png) no-repeat 0 0;
  background-size: 20px 40px;
}
.taxi-widget-home .end .input-icon {
  background-position-y: -20px;
}
.taxi-widget-home .nearby-car-info {
  text-align: center;
  font-size: 14px;
  color: #a3a3a3;
  margin-bottom: 40px;
}
.taxi-widget-home .nearby-car-info .result {
  display: none;
}
.taxi-widget-home .nearby-car-info.loaded .loading {
  display: none;
}
.taxi-widget-home .nearby-car-info.loaded .result {
  display: block;
}
.taxi-widget-home .nearby-car-info .count {
  font-size: 21px;
  color: #3399fe;
}
.taxi-widget-home .btn-submit {
  display: block;
  width: 150px;
  height: 40px;
  font-size: 18px;
  color: white;
  background: url(/static/taxi/widget/home/images/bg-btn-submit_e8261b7.png) no-repeat 0 0;
  background-size: cover;
  padding: 0px;
  border: none;
  margin: 0 auto;
}
.taxi-widget-home .input-panel {
  position: relative;
  box-sizing: border-box;
  padding: 60px 8px 0px 8px;
  height: 100%;
}
.taxi-widget-home .input-panel .input-wrapper {
  height: 35px;
  margin: 7px 0px;
}
.taxi-widget-home .input-panel .input-icon {
  width: 15px;
  height: 15px;
  background-size: 15px 30px;
}
.taxi-widget-home .input-panel .poi-input {
  height: 100%;
  line-height: 15px;
}
.taxi-widget-home .input-panel .btn-confirm {
  position: absolute;
  right: 8px;
  top: 7px;
  background: url(/static/taxi/widget/home/images/bg-btn-confirm_b085b28.png) no-repeat center center;
  background-size: 55px 35px;
  color: white;
  font-size: 14px;
  width: 55px;
  height: 35px;
}
.taxi-widget-home .input-panel .top-bar {
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 50px;
  padding: 0px 70px 0px 60px;
  background: white;
}
.taxi-widget-home .input-panel .btn-back-to-form {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 50px;
  height: 50px;
  background: url(/static/taxi/images/bg-btn-back_cc27fec.png) no-repeat center center;
  background-size: 16px 16px;
  border: none;
  padding: 0px;
  margin: 0px;
  font-size: 0px;
}
.taxi-widget-home .input-panel .ui-suggestion {
  position: relative !important;
  box-sizing: border-box;
  font-size: 16px;
  height: 100%;
  overflow-y: auto;
}
.taxi-widget-home .input-panel .ui-suggestion-content {
  border-style: solid;
  border-color: #ccc;
  border-width: 1px 1px 0px 1px;
  border-radius: 3px 3px 0px 0px;
  background: white;
  padding: 0px 12px;
}
.taxi-widget-home .input-panel .ui-suggestion-button {
  border-style: solid;
  border-color: #ccc;
  border-width: 0px 1px 1px 1px;
  border-radius: 0px 0px 3px 3px;
  background: white;
  padding: 0px 12px;
  height: 50px;
  line-height: 50px;
  color: #ccc;
}
.taxi-widget-home .input-panel .ui-suggestion-button span {
  float: left;
}
.taxi-widget-home .input-panel .ui-suggestion-button span:last-child {
  float: right;
}
.taxi-widget-home .input-panel .ui-suggestion-result {
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
  border-bottom: 1px solid #ccc;
}
.taxi-widget-home .input-panel .ui-suggestion-result span:last-child {
  color: #ccc;
  font-size: 12px;
}
.taxi-widget-home .input-panel[data-type=route_end] .input-icon {
  background-position-y: -15px;
}
{%/style%}<div class="taxi-widget-home">
    <div class="form">
        <button class="btn-back" style="display: none;">返回</button>
        <button class="btn-settings">设置</button>

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
                <input type="text" autocomplete="off" class="poi-input" />
            </div>
            <button class="btn-confirm">确定</button>
        </div>
        <div class="sug-container"></div>
    </div>
</div>
{%script%}
require('taxi:widget/home/home.js').init();
{%/script%}