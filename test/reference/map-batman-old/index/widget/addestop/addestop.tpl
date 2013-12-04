<!--@fileOverview 添加到桌面 -->
<div class="index-widget-addestop">
    <hgroup class="adddesktop-con" id="adddesktop-con" style="display:none">
        <section class="adddesktop">
            <span id="adddesktop-con-tip"></span>
            <span class="appicon"></span>
            <article>
                <header>
                    <span class="txt">先点击</span>
                    <span id="adddesktop-con-star"></span>
                </header>
                <footer>
                    <span class="txt" id="addestop">再" 发送至桌面"</span>
                </footer>   
            </article>
            <section id="adddestop_close_con">
                <span class="adddestop_close"></span>
            <section>
        </section>
    </hgroup>
</div>
{%script%}
    (require("addestop.js")).init();
{%/script%}