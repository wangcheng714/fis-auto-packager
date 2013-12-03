define('place:widget/takeoutdetailnav/takeoutdetailnav.js', function(require, exports, module){

$('.place-widget-takeout-detail').on('click', function() {
	$('#place-widget-dish-category').hide();
});

$('.meau-btn').click(function() {
	if ($('#place-widget-dish-category .dish-name').length > 0) {
		$('#place-widget-dish-category').toggle();
	}
})



});