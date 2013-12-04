<?php

	/*设置takeoutlist页面的测试数据*/

	$takeout_list_url = "http://map.baidu.com/mobile/?qt=wm&m=searchXY&pointX1=12948013.40692&pointY1=4845143.4748877&radius=2000&cityId=131&pageNum=1&pageSize=10&sortType=104&orderType=1&rt=1375151337880&nb_x=12948013.40692&nb_y=4845143.4748877&c=131&from=maponline&tn=m01&ie=utf-8&data_version=11252019";
	
	$takeout_list = file_get_contents($takeout_list_url);
	
	$takeout_list_data = json_decode($takeout_list, true);

    if($takeout_list_data['shoplist']){
        foreach($takeout_list_data['shoplist'] as $key=>$shop){
    		$takeout_list_data['shoplist'][$key]['detailUrl'] = 'http://www.baidu.com';
        }
    }
	
	$takeout_list_data['platform'] = 'android';
	
	$fis_data = array(
		'data' => $takeout_list_data
	);
	
?>
