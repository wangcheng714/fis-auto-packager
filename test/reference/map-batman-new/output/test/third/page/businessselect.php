<?php

// $wd = urlencode('美食');


// $url =  'http://map.baidu.com/mobile/'.
//         '?qt=s'.
//         '&wd='.
//         $wd .
//         '&searchFlag=sort&c=131&center_rank=1&nb_x=12946200.854399&nb_y=4843746.6031095&from=maponline&tn=m01&ie=utf-8&data_version=11252019';

$url = "http://map.baidu.com/mobile/?qt=sub_area_list&areacode=131&level=1&from=maponline&tn=m01&ie=utf-8&data_version=11252019";


$data = file_get_contents($url);
$fis_data = array(
    "data" => json_decode($data,TRUE)
    );

