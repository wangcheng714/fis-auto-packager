<?php
    $st = '2013-08-22';
    $et = '2013-08-23';
    $uid = '1020060f11e79cbf1894c604';

	$url_room = 'http://map.baidu.com/detail'
        	. '?qt=otaroom'
        	. '&uid=' . $uid
        	. '&st=' . $st
        	. '&et=' . $et
        	. '&from=webview'
        	. '&from=maponline'
        	. '&tn=m01'
        	. '&ie=utf-8'
        	. '&data_version=11252019';

    $url_newdetail = 'http://map.baidu.com/detail'
                . '?newDetail=1'
                . '&qt=ninf'
                . '&uid=' . $uid
                . '&from=maponline'
                . '&tn=m01'
                . '&ie=utf-8'
                . '&data_version=11252019';

    $content_room = file_get_contents($url_room);
    $content_detail = file_get_contents($url_newdetail);

    $rr = json_decode($content_room, true);
    $otaPriceUrl = $rr['room_info'][0]['ota_price_url'];
    $url_price = 'http://map.baidu.com/detail'
                    . '?qt=otaprice'
                    . '&uid=' . $uid
                    . '&url=' . $otaPriceUrl
                    . '&from=maponline'
                    . '&tn=m01'
                    . '&ie=utf-8'
                    . '&data_version=11252019';
    $content_price = file_get_contents($url_price);

    $arr1 = array();
    $arr2 = array();
    $arr3 = array();
    $arr4 = array();
    $arr5 = array();

    $arr1 = json_decode($content_room, true);
    $arr1['errorNoRoom'] = $arr1['errorNo'];
    unset($arr1['errorNo']);

    $arr2 = json_decode($content_price, true);
    $arr2['errorNoOta'] = $arr2['errorNo'];
    unset($arr2['errorNo']);

    $arr3 = json_decode($content_detail, true);
    $arr2['uid'] = $uid;
    $arr2['hotelname'] = $arr3['content']['name'];
    $arr2['hoteladdr'] = $arr3['content']['addr'];
    //$arr2['sd'] = date('Y-m-d');
    //$arr2['ed'] = date('Y-m-d',strtotime('+1 day'));

    $arr4 = array_merge($arr1, $arr2);
    $arr5['widget_data'] = $arr4;

	$fis_data = $arr5;
    unset($arr1);
    unset($arr2);
    unset($arr3);
    unset($arr4);
    unset($arr5);

?>
