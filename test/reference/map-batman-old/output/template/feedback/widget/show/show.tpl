{%style id="/widget/show/show.inline.css"%}#feedback-wrapper {
    width: 100%;
    overflow: hidden;
    height: 100%;
}

.feedback-title {
    position: relative;
    color: #4c4c4c;
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    display: block;
    margin: 10px 20px 2px 20px;
}

.feedback-title span {
    position: absolute;
    top: 0;
}

.feedback-title span:first-child {
    left: 0;
}

.feedback-title span:last-child {
    right: 0;
}

#feedback-content, #feedback-contact {
    font-size: 12px;
    color: #333333;
    display: block;
    width: 90%;
    margin: 0 auto;
}

#feedback-content {
    height: 120px;
    padding: 5px;
    resize: none;
    border: 0;
    border: 1px solid #c7c7c7;
}

#feedback-contact {
    height: 30px;
    padding: 0 5px;
    border: 0;
    border: 1px solid #c7c7c7;
}

#feedback-submit {
    width: 122px;
    height: 40px;
    font-size: 14px;
    text-align: center;
    color: #333333;
    border-radius: 2px;
    border: 1px solid #adadad;
    box-shadow: 1px 2px 0px #f4f4f4;
    background-color: #f2f2f2;
    display: block;
    margin: 20px auto 20px auto;
}

.feedback-tips {
    color: #ba0000;
    font-size: 12px;
    height: 20px;
    margin: 2px 20px 2px 20px;
}{%/style%}<div id="feedback-wrapper">
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