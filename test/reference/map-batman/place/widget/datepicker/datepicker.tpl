<div class="place-widget-datepicker">
    <div class="opt-search">
        <div class="date">
            <span class="arrow"></span>
            <span class="text">入住&nbsp;</span>
            <a class="sd" href="javascript:void(0);"></a>
        </div>
        <div class="date">
            <span class="arrow"></span>
            <span class="text">退房&nbsp;</span>
            <a class="ed" href="javascript:void(0);"></a>
        </div>
    </div>
    <div class="tip"></div>
    <div class="datepicker-wrap">
        <div class="sd-wrapper">
            <p>入住时间：</p>
            <div class="sd-picker"></div>
        </div>
        <div class="ed-wrapper">
            <p>离开时间：</p>
            <div class="ed-picker"></div>
        </div>
    </div>
</div>
{%script%}
require('place:widget/datepicker/datepicker.js');
{%/script%}