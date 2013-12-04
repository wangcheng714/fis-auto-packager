<div class="hotel-calendar">
    <div class="hotel-cal-content">
        <div class="hotel-cal-date">
            <span class="hotel-date-text">入住</span>
            <div class="hotel-date-ipt date-ipt-start">
                <div class="tit-text"></div>
                <span class="hotel-ipt-arrow"></span>
            </div>
        </div>
        <div class="hotel-cal-date">
            <span class="hotel-date-text">退房</span>
            <div class="hotel-date-ipt date-ipt-end">
                <div class="tit-text"></div>
                <span class="hotel-ipt-arrow"></span>
            </div>
        </div>
    </div>
    <div class="hotel-cal-wrap">
        <div class="hotel-calwrap-start">
            <p>入住时间：</p>
            <div class="hotel-container-start"></div>
        </div>
        <div class="hotel-calwrap-end">
            <p>离店时间：</p>
            <div class="hotel-container-end"></div>
        </div>
    </div>
</div>

{%script%}
    (require('place:widget/datepicker/datepicker.js')).init({
        uid: '{%$widget_data.uid%}'
    });
{%/script%}