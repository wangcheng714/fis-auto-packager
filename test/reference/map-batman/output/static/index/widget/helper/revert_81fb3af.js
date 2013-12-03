define('index:widget/helper/revert.js', function(require, exports, module){

module.exports = {
    init: function () {
        if (window.eventRecorder) {
            eventRecorder.stop();
            eventRecorder.play();
            window.eventRecorder = null;
            delete window.eventRecorder;
        }
    }
}

});