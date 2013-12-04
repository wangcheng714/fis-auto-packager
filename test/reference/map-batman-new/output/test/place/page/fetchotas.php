<?php
    require('Smarty.class.php');

    $uid = $_POST['uid'];
    $otaPriceUrl = $_POST['otaPriceUrl'];

    $url = 'http://map.baidu.com/detail'
            	. '?qt=otaprice'
            	. '&uid=' . $uid
            	. '&url=' . $otaPriceUrl
            	. '&from=maponline'
            	. '&tn=m01'
            	. '&ie=utf-8'
            	. '&data_version=11252019';

    $content = file_get_contents($url);

	$otadata = json_decode($content, true);
	$otadata['errorNoOta'] = $otadata['errorNo'];
	unset($otadata['errorNo']);

    $smarty = new Smarty;
	$smarty->addPluginsDir('./plugin/');
    $smarty->addConfigDir('./config/');
    $smarty->template_dir = './template/';
    $smarty->left_delimiter = '{%';
    $smarty->right_delimiter = '%}';

    $smarty->assign('widget_data', $otadata);
    unset($otadata);
    $smarty->display('place/widget/hotelbook/otalist.tpl');

?>
