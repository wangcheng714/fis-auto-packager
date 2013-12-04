<div class="taxi-widget-vip-home">
    <div class="home">
        <div class="button-bar">
            <button class="btn-register">注册</button>
            <button class="btn-orderlist">订单</button>
        </div>

        <div class="logo">
            <span class="icon"></span>
            <div class="baidu-taxi">百度打车</div>
            <div class="slogan">专业代叫版</div>
        </div>

        <form>
            <div class="input-wrapper start">
                <span class="input-icon"></span>
                <input class="poi-input" type="text" readonly="readonly" name="route_start" placeholder="请输入起点"/>
            </div>
            <div class="input-wrapper end">
                <span class="input-icon"></span>
                <input class="poi-input" type="text" readonly="readonly" name="route_end" placeholder="输入目的地"/>
            </div>
            <div class="nearby-car-info">
                <div class="loading">正在获取附近出租车信息...</div>
                <div class="result">
                    <span class="text">附近有</span>
                    <span class="count"></span>
                    <span class="text">辆出租车</span>
                </div>
            </div>
            <div class="client-info">
                <div class="title">代叫车信息</div>
                <div class="field">
                    <!--input type="checkbox" class="taxi-ui-checkbox size-24" id="check-client"/-->
                    <label for="check-client"><!--span class="icon"></span-->客人电话</label>
                    <input type="text" class="client-phone" name="phone" placeholder="输入客人电话（可选）" />
                </div>
            </div>
            {%widget name="taxi:widget/common/addprice/addprice.tpl"%}
            <input type="button" class="btn-submit" value="叫车"/>
            <input type="hidden" name="lng"/>
            <input type="hidden" name="lat"/>
            <input type="hidden" name="city_code"/>
            <input type="hidden" name="third_phone"/>
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
                <input type="text" autocomplete="off" class="poi-input" id="sug-target"/>
            </div>
            <button class="btn-confirm">确定</button>
        </div>
        <div class="sug-container"></div>
    </div>
</div>
{%script%}
require('home.js').init();
{%/script%}