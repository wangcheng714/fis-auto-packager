<?php
$fis_data = array(
    'data' => array(
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
                    'name' => '团购',
                    'className' => 'ui3-sale',
                    'code' => 20265,
                    'casuallookCode' => 20193,
                    'searchnearbyCode' => 20192
                )
            )
        ),
        'cateinfo'  => array(
            'other' => array('canyin', 'hotel', 'ent', 'trf','service'),
            'content' => array(
                'canyin'  =>  array(
                    'id'  => 'more-caiyin',
                    'name' => '餐饮',
                    'className' => 'cateinfo-canyin',
                    'subcate'  => array(
                        array('name' =>'中餐'),
                        array('name' =>'小吃快餐'),
                        array('name' =>'火锅'),
                        array('name' =>'川菜'),
                        array('name' =>'西餐厅'),
                        array('name' =>'肯德基')
                    )
                ),
                'hotel'  =>  array(
                    'id'  => 'more-hotel',
                    'name' => '酒店',
                    'className' => 'cateinfo-hotel',
                    'subcate'  => array(
                        array('name' =>'快捷酒店'),
                        array('name' =>'星级酒店'),
                        array('name' =>'度假村'),
                        array('name' =>'青年旅社'),
                        array('name' =>'旅馆'),
                        array('name' =>'招待所'),
                        array('name' => '今夜特价'),
                        array('name' => '如家酒店'),
                        array('name' => '7天酒店')
                    )
                ),
                'ent'  =>  array(
                    'id'  => 'more-ent',
                    'name' => '休闲娱乐',
                    'className' => 'cateinfo-ent',
                    'subcate'  => array(
                        array('name' =>'电影院'),
                        array('name' =>'KTV'),
                        array('name' =>'网吧'),
                        array('name' =>'酒吧'),
                        array('name' =>'咖啡厅'),
                        array('name' =>'景点')
                    )
                ),
                'trf'  =>  array(
                    'id'  => 'more-trf',
                    'name' => '交通出行',
                    'className' => 'cateinfo-trf',
                    'subcate'  => array(
                        array('name' =>'公交站'),
                        array('name' =>'火车站'),
                        array('name' =>'加油站'),
                        array('name' =>'停车场'),
                        array('name' =>'售票点'),
                        array('name' =>'4S店')
                    )
                ),
                'service'  =>  array(
                    'id'  => 'more-service',
                    'name' => '生活服务',
                    'className' => 'cateinfo-service',
                    'subcate'  => array(
                        array('name' =>'超市'),
                        array('name' =>'药店'),
                        array('name' =>'医院'),
                        array('name' =>'商场'),
                        array('name' =>'ATM'),
                        array('name' =>'公厕')
                    )
                )
            )
        ),
        /*
        'bizinfo' => array(
            area => array('建国门', '望京', '亚运村','东直门', '王府井', '公主坟', '五道口', '中关村', '西单', '西直门', '宣武门', '国贸'),
            cname => '北京市',
            code => 131
        )
        */
        
        /*
        'bizinfo' => array(
            '北京市'  => array(
                area => array('建国门', '望京', '亚运村','东直门', '王府井', '公主坟', '五道口', '中关村', '西单', '西直门', '宣武门', '国贸')
            ),
            '长春市'  => array(
                area => array('红旗街', '桂林路', '东盛大街','东广场', '湖西路', '建设街', '重庆路', '吉林大路', '凯旋路', '春城大街', '普阳街', '青年路')
            ),
            '长沙市'  => array(
                area => array('车站北路','韭菜园','蔡锷北路','黄土岭','梓园路','八一路','朝阳路','赤岭路','定王台','东屯渡','芙蓉北路','芙蓉苑')
            ),
            '成都市'  => array(
                area => array('蜀汉路','春熙路','草市街','建设路','抚琴','牛市口','骡马市','双楠','玉林','万年场','茶店子','盐市口')
            ),
            '大连市'  => array(
                area => array('黑石礁','太原街','星海湾','桃源','马栏','新开路','老虎滩','人民路','天津街','山东路','西安路','庙岭')
            ),
            '佛山市'  => array(
                area => array('大沥','桂城','西樵','陈村','大良','龙江','伦教','容桂')
            ),
            '福州市'  => array(
                area => array('东街口','茶亭','温泉','中亭街','左海','仓前','东升','金山','三叉街','上渡','鼓东','王庄')
            ),
            '广州市'  => array(
                area => array('江南大道','广园路','三元里','芳村','天河北','珠江新城','北京路','赤岗','新港','沙面','车陂','东圃')
            ),
            '哈尔滨市'  => array(
                area => array('抚顺','经纬','和兴','安和','共乐','康安','通江','新阳路','靖宇','南马','大成','革新')
            ),
            '杭州市'  => array(
                area => array('湖墅南路','湖滨','大关','拱宸桥','南山路','黄龙','凤起路','长河','浦沿','德胜','和睦','采荷')
            ),
            '合肥市'  => array(
                area => array('三里庵','三里街','巢湖路','宁国路','芜湖路','安庆路','亳州路','寿春','双岗','逍遥津','五里墩','长江东路')
            ),
            '济南市'  => array(
                area => array('解放路','泉城路','洪家楼','文化东路','北园大街','无影山','文化西路','堤口路','大明湖','山师东路','南辛庄','营市街')
            ),
            '昆明市'  => array(
                area => array('关上','泉城路','人民东路','北教场','三市街','西坝路')
            ),
            '南昌市'  => array(
                area => array('青山路','洪都','八一桥','彭家桥','上海路','丁公路','系马桩')
            ),
            '南京市'  => array(
                area => array('新街口','夫子庙','瑞金路','湖南路','常府街','秦虹','孝陵卫','三牌楼','长白街','大光路','光华路','淮海路')
            ),
            '南宁市'  => array(
                area => array('建政路','沙井','新竹','安吉','北湖','朝阳','翠柏路','老外滩','彩虹路','东钱湖','城隍庙','月湖')
            ),
            '南宁市'  => array(
                area => array('建政路','沙井','新竹','安吉','北湖','朝阳')
            ),
            '宁波市'  => array(
                area => array('翠柏路','老外滩','彩虹路','东钱湖','城隍庙','月湖','白沙','洪塘','孔浦','文教','白鹤','百丈')
            ),
            '青岛市'  => array(
                area => array('台东','湛山','李村','香港中路','南京路北段','海泊桥','泰州路','小村庄','河套','棘洪滩','流亭','惜福')
            ),
            '上海市'  => array(
                area => array('虹桥','南京东路','外滩','南京西路','徐家汇','古北','凉城','曲阳地区','老西门','打浦桥','淮海路','龙柏')
            ),
            '深圳市'  => array(
                area => array('香蜜湖','科技园','南油','蛇口','皇岗','南头','沙头角','八卦岭','布吉','翠竹','莲塘','西丽')
            ),
            '沈阳市'  => array(
                area => array('北陵','大东路','太原街','西塔','北行','塔湾','文艺路','中街','东塔','万莲','北市','马路湾')
            ),
            '石家庄市'  => array(
                area => array('青园','东风','西里')
            ),
            '苏州市'  => array(
                area => array('观前街','虎丘','石路','南门','狮山','凤凰街','十全街','三香路','桃花坞','木渎')
            ),
            '太原市'  => array(
                area => array('下元','柳巷','双塔西街','长风街','亲贤北街','并州北路','漪汾街','朝阳街')
            ),
            '天津市'  => array(
                area => array('芥园道','八里台','王顶堤','南市','小白楼','大王庄','大直沽','中山门','尖山','大胡同','丁字沽','邵公庄')
            ),
            '无锡市'  => array(
                area => array('河埒','东北塘','东亭','北大街','青石路','锡惠路','上马墩','中山路','清扬路')
            ),
            '武汉市'  => array(
                area => array('徐东','街道口','江汉路','西北湖','古田','水果湖','中南路','钟家村','鲁巷','百步亭','二七','常青路')
            ),
            '西安市'  => array(
                area => array('解放路','小寨','金花路','电子城','太乙路','文艺路','高新路')
            ),
            '厦门市'  => array(
                area => array('江头','湖滨北路','东渡路','鼓浪屿','中山路','塘边','国贸','禾祥西路','莲坂','杏林')
            ),
            '郑州市'  => array(
                area => array('大学路','碧沙岗','桐柏路','城东路','杜岭','金水路','汝河路','解放路','铭功路','二里岗','人民路','棉纺路')
            ),
            '重庆市'  => array(
                area => array('观音桥','石坪桥','杨家坪','天星桥','龙溪','大坪','黄桷坪','弹子石','南滨路','南坪','歌乐山','小龙坎')
            ),
            '珠海市'  => array(
                area => array('拱北','前山','唐家湾','南屏','湾仔','新香洲')
            )
        )
        */
    )
);
?>