<div id="feedback-wrapper">
    <p class="feedback-title">
        <span>您的意见或建议：</span>
        <span>(0/300)</span>
    </p>
    <textarea  required="required" id="feedback-content" placeholder="请在此处详细描述您对百度地图的意见或建议" maxlength="300"></textarea>
    <p class="feedback-title">
        <span>您的联系方式（选填）：</span>
        <span>(0/70)</span>
    </p>
    <input type="text" id="feedback-contact" placeholder="手机号 / Email: 方便我们及时给您回复" maxlength="70">
    <button id="feedback-submit">提交</button>
</div>
{%script%}
    require.async('feedback:widget/show/show.js',function(exports){
        var elFeedbackContent = $('#feedback-content'),elFeedbackContact = $('#feedback-contact');
        exports.bind({
                elContent:elFeedbackContent,
                elContact:elFeedbackContact
        });
        $('#feedback-submit').click(function(){
            exports.onSubmit({
                elContent:elFeedbackContent,
                elContact:elFeedbackContact
            });
        });
        elFeedbackContent.on('touchstart',function(e){
            exports.canTouch(e);
        });
        elFeedbackContact.on('touchstart',function(e){
            exports.canTouch(e);
        });
        elFeedbackContent.on('input',function(e){
            //input 解决ios平台不同步
            exports.syncWordCount(e);
        });
        elFeedbackContact.on('input',function(e){
            exports.syncWordCount(e);
        });
        elFeedbackContent.change(function(e){
            exports.syncWordCount(e);
        });
        elFeedbackContact.change(function(e){
            exports.syncWordCount(e);
        });
    });
{%/script%}