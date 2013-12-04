<?php
	require('Smarty.class.php');

    $st = '2013-08-22';
    $et = '2013-08-23';
    $uid = '8d96925c02abe75cc1f1cf14';

    $url_newdetail = 'http://map.baidu.com/detail'
                . '?newDetail=1'
                . '&qt=ninf'
                . '&uid=' . $uid
                . '&from=maponline'
                . '&tn=m01'
                . '&ie=utf-8'
                . '&data_version=11252019';

    $content_detail = file_get_contents($url_newdetail);

	$arr1 = array();
    $arr1 = json_decode($content_detail, true);

	$smarty = new Smarty;
	$smarty->addPluginsDir('./plugin/');
	$smarty->addConfigDir('./config/');
	$smarty->template_dir = './template/';
	$smarty->left_delimiter = '{%';
	$smarty->right_delimiter = '%}';

	$smarty->assign('data', $arr1);
	$smarty->display('place/page/detail/cater.tpl');

    unset($arr1);
?>
