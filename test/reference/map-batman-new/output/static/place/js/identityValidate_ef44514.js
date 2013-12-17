
/*
 根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
 地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
 出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
 顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
 校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

 出生日期计算方法。
 15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
 2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
 下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
 公式(1)中：
 i----表示号码字符从由至左包括校验码在内的位置序号；
 ai----表示第i位置上的号码字符值；
 Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
 i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
 Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
 */
/**
 * des: 身份证验证
 * author: zmm
 */
define('place:static/js/identityValidate.js', function (require, exports, module) {
    var config = {
        city: {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        },
        pattern: /^\d{15}$/
    }

    // 地区信息校验
    function _areaCheck(identity) {
        return !!config.city[parseInt(identity.substr(0, 2))]
    }

    // 出生年月信息检验
    function _birthCheck(identity) {

        // 15位校验规则 6位地址编码+6位出生日期+3位顺序号
        if (identity.length == 15) {
            if (config.pattern.exec(identity) == null) {
                return false;
            }

            var birth = parseInt("19" + identity.substr(6, 2)),
                month = identity.substr(8, 2),
                day = parseInt(identity.substr(10, 2)),
                nowYear = (new Date()).getYear();

            switch (month) {
                case '01':
                case '03':
                case '05':
                case '07':
                case '08':
                case '10':
                case '12':
                    if (day > 31) {
                        return false;
                    }
                    break;
                case '04':
                case '06':
                case '09':
                case '11':
                    if (day > 30) {
                        return false;
                    }
                    break;
                case '02':
                    if ((birth % 4 == 0 && birth % 100 != 0) || birth % 400 == 0) {
                        if (day > 29) {
                            return false;
                        }
                    }else {
                        if (day > 28) {
                            return false;
                        }
                    }
                    break;
                default:
                    return false;
            }

            // 年龄验证
            if (nowYear - parseInt(birth) < 15 || nowYear - parseInt(birth) > 100) {
                return false;
            }
        }

        return true;
    }

    // 身份证编码规范验证
    function _fomatCheck (identity) {
        var Wi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1),
            lSum = 0,
            nNum = 0;

        // 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
        for (var i = 0; i < 17; ++i) {
            if (identity.charAt(i) < '0' || identity.charAt(i) > '9') {
                return false;
            }else {
                nNum = identity.charAt(i) - '0';
            }
            lSum += nNum * Wi[i];
        }

        if (identity.charAt(17) == 'X' || identity.charAt(17) == 'x') {
            lSum += 10 * Wi[17];
        }else if (identity.charAt(17) < '0' || identity.charAt(17) > '9') {
            return false;
        }else {
            lSum += (identity.charAt(17) - '0') * Wi[17];
        }

        if ((lSum % 11) == 1) {
            return true;
        }else {
            return false;
        }
    }

    module.exports = {
        validate: function (identity) {
            return _areaCheck(identity) && _birthCheck(identity) && _fomatCheck(identity);
        }
    }
});