<?php
$fis_data = array(
    'data' => array(
        'title' => '我的位置',
        'main' => array(
            'fixrank' => array(
                'canyin',
                'hotel',
                'bus',
                'sale',
                'takeout',
                'bank',
                'movie',
                'KTV',
                'oil',
                'manage'
            ),
            'other' => array('canyin','hotel','ent'),
            'rank'  => array('manage'),
            'content' => array(
                'ent' => array(
                    'id'                => 'ent',
                    'name'              => '休闲娱乐',
                    'className'         => 'ui3-ent',
                    'className2'        => 'ui3-more-ent',
                    'code'              => '',
                    'casuallookCode'    => '',
                    'searchnearbyCode'  => '',
                    'subcate'    => array(
                        array('name' => '丽人'),
                        array('name' => 'KTV'),
                        array('name' => '网吧'),
                        array('name' => '酒吧'),
                        array('name' => '咖啡厅'),
                        array('name' => '景点')
                    )
                ),
                'canyin' => array(
                    'id' => 'canyin',
                    'name' => '美食',
                    'className' => 'ui3-canyin',
                    'className2' => 'ui3-more-canyin',
                    'code' => 20044,
                    'casuallookCode' => 20157,
                    'searchnearbyCode' => 20044,
                    'subcate'  => array(
                        array('name' =>'中餐'),
                        array('name' =>'小吃快餐'),
                        array('name' =>'火锅'),
                        array('name' =>'川菜'),
                        array('name' =>'西餐厅'),
                        array('name' =>'肯德基')
                    )
                ),
                'goodfood' => array(
                    'id' => 'goodfood',
                    'name' => '小吃快餐',
                    'className' => 'newui_1_goodfood',
                    'code' => 20045,
                    'casuallookCode' => 20158,
                    'searchnearbyCode' => 20045
                ),
                'bank' => array(
                    'id' => 'bank',
                    'name' => '银行',
                    'className' => 'ui3-bank',
                    'code' => 642,
                    'casuallookCode' => 20159,
                    'searchnearbyCode' => 642
                ),
                'hotel' => array(
                    'id' => 'hotel',
                    'name' => '酒店',
                    'className' => 'ui3-hotel',
                    'className2' => 'ui3-more-hotel',
                    'code' => 20046,
                    'casuallookCode' => 20160,
                    'searchnearbyCode' => 20046,
                    'subcate'  => array(
                        array('name' =>'快捷酒店'),
                        array('name' =>'星级酒店'),
                        array('name' =>'度假村'),
                        array('name' =>'青年旅社'),
                        array('name' =>'旅馆'),
                        array('name' =>'招待所')
                    )
                ),
                'starhotel' => array(
                    'id' => 'starhotel',
                    'name' => '星级酒店',
                    'className' => 'newui_1_star_hotel',
                    'code' => 20047,
                    'casuallookCode' => 20161,
                    'searchnearbyCode' => 20047
                ),
                'bus' => array(
                    'id' => 'bus',
                    'name' => '公交站',
                    'className' => 'ui3-bus',
                    'code' => 645,
                    'casuallookCode' => 20162,
                    'searchnearbyCode' => 645,
                    'type' => 0

                ),
                'netbar' => array(
                    'id' => 'netbar',
                    'name' => '网吧',
                    'className' => 'newui_1_netbar',
                    'code' => 20048,
                    'casuallookCode' => 20048,
                    'searchnearbyCode' => 20048
                ),
                'KTV' => array(
                    'id' => 'KTV',
                    'name' => 'KTV',
                    'className' => 'ui3-ktv',
                    'code' => 20051,
                    'casuallookCode' => 20051,
                    'searchnearbyCode' => 20051
                ),
                'oil' => array(
                    'id' => 'oil',
                    'name' => '加油站',
                    'className' => 'ui3-oil',
                    'code' => 646,
                    'casuallookCode' => 20165,
                    'searchnearbyCode' => 646,
                    'type' => 0
                ),
                'movie' => array(
                    'id' => 'movie',
                    'name' => '电影院',
                    'className' => 'ui3-movie',
                    'code' => 20050,
                    'casuallookCode' => 20163,
                    'searchnearbyCode' => 20050
                ),
                'ktv' => array(
                    'id' => 'ktv',
                    'name' => 'KTV',
                    'className' => 'newui_1_ktv',
                    'code' => 20051,
                    'casuallookCode' => 20051,
                    'searchnearbyCode' => 20051
                ),
                'takeout' => array(
                    'id' => 'takeout',
                    'name' => '外卖',
                    'className' => 'ui3-takeout',
                    'code' => 20182,
                    'casuallookCode' => 20189,
                    'searchnearbyCode' => 20188,
                    'isHot' => true,
                    'module' => 'place',
                    'action' => 'takeout'
                ),
                'manage' => array(
                    'id' => 'manage',
                    'name' => '更多',
                    'className' => 'ui3-more',
                    'code' => 20052,
                    'casuallookCode' => 20168,
                    'searchnearbyCode' => 20052,
                    'module' => 'index',
                    'action' => 'more'

                ),
                'nb' => array(
                    'id' => 'nb',
                    'name' => '随便看看',
                    'className' => 'newui_1_nb',
                    'code' => 20141,
                    'casuallookCode' => 20167,
                    'searchnearbyCode' => 20141,                    
                    'module' => 'index',
                    'action' => 'casuallook'

                ),
                'ticket' => array(
                    'id' => 'ticket',
                    'name' => '售票点',
                    'className' => 'newui_1_ticket',
                    'code' => 20192,
                    'casuallookCode' => 20193,
                    'searchnearbyCode' => 20192,
                    'isHot' => true
                ),
                'sale' => array(
                    'id' => 'sale',
                    'name' => '优惠',
                    'className' => 'ui3-sale',
                    'code' => 20265,
                    'casuallookCode' => 20193,
                    'searchnearbyCode' => 20192
                )
            )
        )
    )
);
?>