<?php

	/*设置takeoutdetail页面的测试数据*/

	$url = "http://map.baidu.com/mobile/?qt=wm&m=shopDish&id=16497564399220987857&dishCategoryId=0&pageNum=1&pageSize=0&cityId=131&rt=1375178225445&from=maponline&tn=m01&ie=utf-8&data_version=11252019";

	$data = file_get_contents($url);
	
	$fis_data = json_decode($data, true);
	
	//$fis_data['isAndroid'] = false;
?>
