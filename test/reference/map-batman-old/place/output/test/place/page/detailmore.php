<?php
    $url_newdetail = 'http://map.baidu.com/detail'
                    . '?newDetail=1'
                    . '&qt=ninf'
                    . '&uid=9fbfeef26599025cede4a50b'
                    . '&from=maponline'
                    . '&tn=m01'
                    . '&ie=utf-8'
                    . '&data_version=11252019';

    $arr_detail = array();
    $data = array();

    $content_detail = file_get_contents($url_newdetail);
    $arr_detail = json_decode($content_detail, true);
    $data['data'] = $arr_detail;

    $fis_data = $data;

    unset($arr_detail);
    unset($data);
?>