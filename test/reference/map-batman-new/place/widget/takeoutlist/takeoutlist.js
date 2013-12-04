module.exports.bind = function(){
    $pageNav = $(".place-widget-taskoutlist .page_btn");
    $.each($pageNav, function (index,item) {
        var $dom = $(item);
        $dom.on("click", function(evt){
            var btn = $(evt.target),
                type = btn.data("type"),
                href = btn.data("href");

            if(!btn.hasClass("unclick")) {
                href = "http://" + location.host + href;
                window.location.replace(href);
            }
        });
    })
};