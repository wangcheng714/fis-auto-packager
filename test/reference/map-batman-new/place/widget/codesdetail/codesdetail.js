var mData;
function mInfo() {
    $("#name").html(mData.name);

    if (parseInt(mData.score)) {

        $("#score").html(mData.score);
    }


    if (mData.duration && mData.duration != "undefined") {

        $("#duration").html("片长：" + mData.duration + "分钟");
    } else {

        $("#duration").html("片长：暂无");
    }

    if (mData.category && mData.category != "undefined") {

        $("#category").html("类型：" + mData.category);
    } else {

        $("#category").html("类型：暂无");
    }


    $("#pic").attr("src", mData.pic);

    $("#pname").html(mData.pname);

    if (mData.director && mData.director != "undefined") {

        $("#director").html("导演：" + mData.director);
    } else {

        $("#director").html("导演：暂无");
    }

    if (mData.player && mData.player != "undefined") {

        $("#player").html("主演：" + mData.player);
    } else {

        $("#player").html("主演：暂无");
    }

    $("#release").html("上映时间：" + mData.release);

    var day = mData.day.split("-");

    $("#day").html(day[1] + "月" + day[2] + "日&nbsp;<span class='txt_red' id='time'>" + mData.time + "</span>&nbsp;" + mData.type);

}

function mEvent() {
    $("#back").click(function() {

        window.history.go(-1);
    });


    $("#subSure").click(function() {

        var pids = [];
        var sem = ",";
        $('input[name="pid"]:checked').each(function() {
            pids.push($(this).val());
        });
        if (pids.length == 0) {
            var t = 0;
            (function msg() {
                if (t > 5) {
                    return;
                }
                t++;
                if (t % 2 == 1) {
                    $('input[name="pid"]').each(function() {
                        this.checked = true;
                    });
                } else {
                    $('input[name="pid"]').each(function() {
                        this.checked = false;
                    });
                }
                window.setTimeout(msg, 200);
            })();
            return;
        }

        pids.join(",");

        var phone = $("#phone").val();
        var http = "http://" + window.location.host;
        var url = http + "/detail?qt=mcdkey&act=exchange&pids=" + pids + "&phone=" + phone + "&code=" + mData.code + "&sign=" + mData.sign;

        $.ajax({
            type: 'GET',
            url: url,
            data: null,
            dataType: 'json',
            success: function(data) {
                if (data.errorNo == 0) {
                    location.href = http + "/detail?qt=movie&act=select&sign=" + data.sign + "&act_id=" + data.act_id + "&act_pids=" + data.pids + "&from=webapp&uid=" + mData.uid + "&date=" + mData.day + "&seq_no=" + mData.seq_no + "&cinema_id=" + mData.cinemaid + "&movie_id=" + mData.mid + "&third_from=wangpiao&movie_info=" + encodeURIComponent(mData.info);

                } else if (data.errorNo == 300010) {
                    window.location.reload();
                } else if (data.errorNo == 200002) {
                    var t = 0;
                    (function msg() {
                        if (t > 5) {
                            return;
                        }
                        t++;
                        $("#phone").toggleClass("tsred");
                        window.setTimeout(msg, 200);
                    })();
                }
            },
            error: function(xhr, type) {

            }
        });
    });

}



function initialize(__data) {
    mData = __data;
    mInfo();
    mEvent();
}

module.exports = {
    initialize: initialize
};