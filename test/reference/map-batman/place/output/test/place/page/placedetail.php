<?php
$src_name = $_GET["src_name"];

switch ($src_name) {
    case 'cater':
        $data = file_get_contents('http://ditu.baidu.com/detail?newDetail=1&qt=ninf&uid=e116be546c69d062c91b9578&from=maponline&tn=m01&ie=utf-8&data_version=11252019');
        $fis_data = json_decode($data, true);
        break;
    case 'hotel':
        $data = <<< DATA
{
    "content":{
        "ext":{
            "detail_info":{
                "price":"172.0",
                "overall_rating":"4.1",
                "service_rating":"4.0",
                "owner_id":"750357486"
            },
            "rich_info":{
                "comment_yes_num":"650",
                "comment_no_num":"131",
                "brand":"\u901f8",
                "category":"\u5546\u52a1\u578b\u9152\u5e97 \u8fde\u9501\u54c1\u724c",
                "level":"\u4e8c\u661f\u7ea7",
                "description":"",
                "shop_hours":"",
                "overview":{
                    "environment_exterior":{
                        "name": "酒店环境",
                        "desc": "\u6d77\u6dc0\u533b\u9662 \u6d77\u6dc0\u6e05\u771f\u5bfa \u6d77\u6dc0\u6e05\u771f\u5bfa"
                    },
                    "inner_facility":{
                        "name": "酒店设施",
                        "desc": "\u5bbd\u5e26\u4e0a\u7f51 \u7a7a\u8c03 24\u5c0f\u65f6\u70ed\u6c34 \u5439\u98ce\u673a,\u56fd\u5185\u957f\u9014\u7535\u8bdd \u56fd\u9645\u957f\u9014\u7535\u8bdd \u62d6\u978b \u96e8\u4f1e 24\u5c0f\u65f6\u70ed\u6c34 \u5206\u4f53\u7a7a\u8c03 \u7535\u89c6\u673a,\u56fd\u5185\u957f\u9014\u7535\u8bdd \u56fd\u9645\u957f\u9014\u7535\u8bdd \u62d6\u978b \u4e66\u684c 24\u5c0f\u65f6\u70ed\u6c34 \u7535\u70ed\u6c34\u58f6 \u4e2d\u592e\u7a7a\u8c03\/\u666e\u901a\u5206\u4f53\u7a7a\u8c03 \u72ec\u7acb\u6dcb\u6d74\u95f4"
                    },
                    "hotel_facility":{
                        "name": "酒店服务",
                        "desc":"\u63a5\u5f85\u5916\u5bbe,\u7406\u53d1\u7f8e\u5bb9\u4e2d\u5fc3 \u514d\u8d39\u505c\u8f66\u573a \u7535\u68af","hotel_service":"\u65e0\u7ebf\u4e0a\u7f51\u516c\u5171\u533a\u57df \u505c\u8f66\u573a \u5546\u52a1\u4e2d\u5fc3,\u5546\u52a1\u4e2d\u5fc3 \u9001\u9910\u670d\u52a1 \u6d17\u8863\u670d\u52a1 \u53eb\u9192\u670d\u52a1 \u7f8e\u5bb9\u7f8e\u53d1 \u63d0\u4f9b\u6cca\u8f66\u4f4d ATM\u53d6\u6b3e\u673a,\u4f1a\u8bae \u65c5\u6e38\u7968\u52a1\u670d\u52a1 \u514d\u8d39\u505c\u8f66\u573a \u7406\u53d1\u7f8e\u5bb9\u5ba4 \u6d17\u8863\u670d\u52a1,\u4f1a\u8bae\u5385 \u65c5\u6e38\u7968\u52a1\u670d\u52a1 \u6d17\u8863\u670d\u52a1"
                    }
                }
            },
            "src_name":"hotel"
        }
    }
}
DATA;
        $fis_data = json_decode($data, true);
        break;
    case 'life':
        $data = file_get_contents('http://ditu.baidu.com/detail?newDetail=1&qt=ninf&uid=06d2dffdae81b7ef88f15d34&from=maponline&tn=m01&ie=utf-8&data_version=11252019');
        $fis_data = json_decode($data, true);
        break;
    case 'hospital':
        $data = file_get_contents('http://ditu.baidu.com/detail?newDetail=1&qt=ninf&uid=3a0a78bd4302e5e3631809c7&from=maponline&tn=m01&ie=utf-8&data_version=11252019');
        $fis_data = json_decode($data, true);
        break;
    case 'linedetail':
    $fis_data = array(
        'line' => array(
            'titl' => '982路(北京西站南广场-土井村西口)',
            'startTime' => '05:00',
            'endTime' => '21:00',
            'maxPrice'=> '8.00元',
            'ticketCal' => '否',
            'company' => '北京八方达客运有限责任公司门头沟分公司'
        ),
        'stations' => array(
            array(
                'no' => '01',
                'name' => '北京西站南广场',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '02',
                'name' => '莲花池',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '03',
                'name' => '五棵松桥北',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '04',
                'name' => '金沟河',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '05',
                'name' => '定慧桥南',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '06',
                'name' => '定慧桥北',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '07',
                'name' => '五路桥',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '08',
                'name' => '营慧寺',
                'href' => 'place/page/detail?inf=xxx'
            )
        ),
        'linewaystation' => array(
            array(
                'name' => '53路（四方桥西-北京西站南广场）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '53路（北京西站南广场-四方桥西）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '122路（北京西站南广场-北京站东）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '122路（北京站东-北京西站南广场）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '599路（博兴六路公交场站-方庄南口）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '599路（方庄南口-博兴六路公交场站）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '685路（动物园(枢纽站）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '685路（城外诚-动物园(枢纽站）',
                'href' => 'place/page/detail?inf=xxx'
            )
        )
    );
    break;
    case 'subwaydetail':
    $fis_data = array(
        'line' => array(
            'lineurl' => 'http://map.baidu.com/mobile/#subway/show/line_uid=1cba93042407fd57dd1e526c&city=beijing/ref=ln',
            'titl' => '地铁昌平线(西二旗-南邵)',
            'startTime' => '05:00',
            'endTime' => '23:05',
            'maxPrice'=> '8.00元',
            'ticketCal' => '否',
            'company' => '北京市地铁运营有限公司'
        ),
        'stations' => array(
            array(
                'no' => '01',
                'name' => '西二旗',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '02',
                'name' => '生命科学园',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '03',
                'name' => '朱辛庄',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '04',
                'name' => '巩华城',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '05',
                'name' => '沙河',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '06',
                'name' => '沙河高教园',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'no' => '07',
                'name' => '南邵',
                'href' => 'place/page/detail?inf=xxx'
            )
        ),
        'linewaystation' => array(
            array(
                'name' => '53路（四方桥西-北京西站南广场）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '53路（北京西站南广场-四方桥西）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '122路（北京西站南广场-北京站东）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '122路（北京站东-北京西站南广场）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '599路（博兴六路公交场站-方庄南口）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '599路（方庄南口-博兴六路公交场站）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '685路（动物园(枢纽站）',
                'href' => 'place/page/detail?inf=xxx'
            ),
            array(
                'name' => '685路（城外诚-动物园(枢纽站）',
                'href' => 'place/page/detail?inf=xxx'
            )
        )
    );
    break;
    default:
        $data = file_get_contents('http://ditu.baidu.com/detail?newDetail=1&qt=ninf&uid=e116be546c69d062c91b9578&from=maponline&tn=m01&ie=utf-8&data_version=11252019');
        $fis_data = json_decode($data, true);
        break;
}
?>