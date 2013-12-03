<?php

$url1 = 'http://cq01-map-rdtest11q409.vm.baidu.com:8000/mobile/webapp/transit/list/qt=bse&ptx=12948089.71919&pty=4845185.8966457&wd=%E4%B8%8A%E5%9C%B0&name=%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE&c=131&sc=131&ec=131&isSingle=true&bsetp=1&sn=1%24%24%24%2412948089.71919%2C4845185.8966457%24%24%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE%24%24&searchFlag=bigBox&wm=1&sy=2/vt=';
$url2 = 'http://cq01-map-rdtest11q409.vm.baidu.com:8000/mobile/webapp/transit/list/qt=bse&ptx=12948089.71919&pty=4845185.8966457&wd=%E4%B8%8A%E5%9C%B0&name=%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE&c=131&sc=131&ec=131&isSingle=true&bsetp=1&sn=1%24%24%24%2412948089.71919%2C4845185.8966457%24%24%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE%24%24&searchFlag=bigBox&wm=1&sy=0/vt=';
$url3 = 'http://cq01-map-rdtest11q409.vm.baidu.com:8000/mobile/webapp/transit/list/qt=bse&ptx=12948076.00&pty=4845138.00&wd=%E5%A5%8E%E7%A7%91%E5%A4%A7%E5%8E%A6&name=%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE&c=131&sc=131&ec=131&isSingle=true&bsetp=1&sn=1%24%24%24%2412948076.00%2C4845138.00%24%24%E6%88%91%E7%9A%84%E4%BD%8D%E7%BD%AE%24%24&searchFlag=bigBox&wm=1/vt=';
$data = file_get_contents($url2);
$fis_data = json_decode($data,TRUE);
?>