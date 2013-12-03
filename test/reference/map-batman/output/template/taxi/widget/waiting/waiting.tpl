{%style id="/widget/waiting/waiting.inline.less"%}.taxi-widget-waiting {
  overflow: hidden;
  height: 100%;
}
.taxi-widget-waiting .taxi-widget-nav .btn-back {
  display: none;
}
.taxi-widget-waiting .taxi-info {
  position: absolute;
  top: 50px;
  left: 0px;
  width: 100%;
  color: #999;
  font-size: 14px;
  text-align: center;
  height: 21px;
  line-height: 21px;
  margin-top: 15px;
  white-space: nowrap;
  z-index: 999;
}
.taxi-widget-waiting .taxi-info .text:first-child {
  padding-left: 20px;
  background: url(/static/taxi/images/icon-car_f701f6b.png) no-repeat left center;
  background-size: 15px 15px;
}
.taxi-widget-waiting .num {
  font-size: 21px;
  color: #39f;
}
.taxi-widget-waiting .push-progress {
  position: fixed;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  background: #f8f8f8;
  color: #666;
  font-size: 16px;
  bottom: 0px;
  padding: 18px 0px 19px;
  text-align: center;
  box-shadow: 0px 1px 9px 0px rgba(0, 0, 0, 0.22);
}
.taxi-widget-waiting .pushed-car,
.taxi-widget-waiting .rest-time {
  display: inline-block;
  height: 23px;
  line-height: 23px;
  box-sizing: border-box;
  padding: 0px 15px;
}
.taxi-widget-waiting .pushed-car {
  border-right: 1px solid #a5aab5;
}
.taxi-widget-waiting .count,
.taxi-widget-waiting .second {
  color: #06f;
  font-size: 21px;
}
.taxi-widget-waiting .pushing {
  position: absolute;
  width: 100%;
  bottom: 75px;
  text-align: center;
  color: #666;
  font-size: 14px;
}
{%/style%}<div class="taxi-widget-waiting">
    {%widget name="taxi:widget/common/nav/nav.tpl" title="等待抢单"%}
    <div class="taxi-info">
        <span class="text">附近有</span>
        <span class="count"></span>
        <span class="text">辆车</span>
    </div>
    {%widget name="taxi:widget/common/radar/radar.tpl"%}
    <div class="pushing">
        正在推送...
    </div>
    <div class="push-progress">
        <span class="pushed-car">
            已推送<span class="count">0</span>辆车
        </span>
        <span class="rest-time">
            请等待<span class="second">120</span>秒
        </span>
    </div>
</div>
{%script%}
require('taxi:widget/waiting/waiting.js').init();
{%/script%}