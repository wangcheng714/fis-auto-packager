<?php

$url = 'http://map.baidu.com/mobile/?qt=s&wd=%E5%8D%97%E4%BA%AC%E8%B7%AF&c=131&searchFlag=bigBox&nb_x=12948026.167698&nb_y=4845144.868279&center_rank=1&from=maponline&tn=m01&ie=utf-8&data_version=11252019';
$data = file_get_contents($url);
$fis_data = json_decode($data,TRUE);