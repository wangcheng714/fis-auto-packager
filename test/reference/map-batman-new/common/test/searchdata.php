<?php

$url = "";
$path = 'http://map.baidu.com/mobile/?';
$path.=$_SERVER['QUERY_STRING'];


echo file_get_contents($path);

?>