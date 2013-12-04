<?php
$url = 'http://map.baidu.com/mobile/?qt=bt&sn=2%24%24%24%24%24%24%E8%A5%BF%E5%8D%95%24%24&en=2%24%24%24%24%24%24%E8%A5%BF%E4%BA%8C%E6%97%97%24%24&sc=131&ec=131&c=131&pn=0&rn=5&searchFlag=bigBox&version=5&exptype=dep&wm=1&exptime=&from=maponline&tn=m01&ie=utf-8&data_version=11252019';
$data = file_get_contents($url);
$fis_data = array(
    'data' => json_decode($data, true)
)
?>