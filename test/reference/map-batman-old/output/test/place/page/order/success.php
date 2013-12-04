<?php

    $url = 'http://10.48.50.62:8010/mobile/webapp/place/ordercommit/force=simple&order_id=ZTsRo%252BwKnkEGow4%252B8O8xKVWs8DPSGGKP&__type__=json';
    $data = file_get_contents($url);
// $data = <<< DATA
// {
// 	errorNo: 0,
// 	errorMsg: "",
// 	query: {
// 		__m: "pal",
// 		__c: "ui",
// 		qt: "thirdsrc_ota_room_info",
// 		newDetail: "1",
// 		uid: "5376d341a7c5740b581093f3",
// 		from: "maponline",
// 		tn: "m01",
// 		ie: "utf-8",
// 		data_version: "11252019",
// 		ac: "webapp",
// 		module: "place",
// 		action: "order",
// 		force: "simple",
// 		hotel_id: "hanting_1000961",
// 		room: "TR",
// 		st: "2013-11-01",
// 		et: "2013-11-03",
// 		src: "hanting",
// 		day: 2
// 	},
// 	hotel_info: {
// 		src_prefix: "hzjt",
// 		src: "hanting",
// 		src_msg_to_client: "汉庭酒店集团直销",
// 		src_logo_pc: "http://f.hiphotos.baidu.com/maplogo/pic/item/b21c8701a18b87d6da8989df060828381e30fd23.jpg",
// 		src_logo_mobile: "http://d.hiphotos.baidu.com/maplogo/pic/item/060828381f30e924bb6ebef14d086e061c95f723.jpg",
// 		src_logo_order: "http://c.hiphotos.baidu.com/maplogo/pic/item/8326cffc1e178a8253c55d60f703738da877e871.jpg",
// 		hotel_id: "1000961",
// 		uid: "5376d341a7c5740b581093f3",
// 		hotel_name: "汉庭酒店北京西三旗桥店",
// 		hotel_addr: "北京市海淀区西三旗建材城西路50号（西三旗桥东500米）",
// 		hotel_phone: "010-52076666",
// 		reg_hint: ""
// 	},
// 	room_info: {
// 		room_type: "TR",
// 		room_id: "",
// 		room_name: "双床房",
// 		has_broadnet: 1,
// 		note: "",
// 		bed_type: "",
// 		floor: "",
// 		area: "",
// 		payment_type: "",
// 		is_close: "",
// 		tips: "",
// 		room_img: ""
// 	},
// 	room_price: [{
// 		date: "2013-11-01",
// 		breakfast: 0,
// 		price: "256",
// 		room_left: 25,
// 		bookable: 1,
// 		reserve_time: "18:00",
// 		is_close: 0
// 	},
// 	{
// 		date: "2013-11-02",
// 		breakfast: 0,
// 		price: "256",
// 		room_left: 25,
// 		bookable: 1,
// 		reserve_time: "18:00",
// 		is_close: 0
// 	}],
// 	referer: "http://map.baidu.com"
// }
// DATA;

    $data = json_decode($data, true);
    	//var_dump($data);
  	// $fis_data = array(
  	// 	"data" => $data
  	// );
    $fis_data = $data;
?>
