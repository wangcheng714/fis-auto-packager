{%style id="/widget/common/nav/nav.inline.less"%}.taxi-widget-nav {
  position: relative;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #333;
  text-align: center;
  background: #fafafa;
  box-shadow: 0px 1px 9px 0px rgba(0, 0, 0, 0.22);
  z-index: 9;
  width: 100%;
}
.taxi-widget-nav .btn-back {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 50px;
  height: 50px;
  border: none;
  border-right: 1px solid #ccc;
  padding: 0px;
  margin: 0px;
  background: url(/static/taxi/images/bg-btn-back_cc27fec.png) no-repeat center center;
  background-size: 16px 16px;
  font-size: 0px;
}
{%/style%}<div class="taxi-widget-nav">
    <div class="title">{%$title%}</div>
    {%if (!empty($btnBack))%}
    <button class="btn-back" data-back="{%$back%}">返回</button>
    {%/if%}
</div>
{%script%}
require('taxi:widget/common/nav/nav.js').init();
{%/script%}