var u = navigator.userAgent; // 排名
var host = "";
var layerAll=""
num();//第三重列表邀请人
traversal();
//是否登录
//奖品接口
function traversal() {
    $.ajax({
        url: "./data.json",
        success: function (json) {
            if(!json.type){
                if (typeof layer.msg === "function") {
                    layer.msg(json.message);
                } else {
                    layer.open({
                        content: json.message,
                        skin: 'msg',
                        time: 2
                    });
                }
            }
            // 先渲染模板，在初始化转盘数据，避免不支持canvas的浏览器，阻塞，连列表数据都不能加载
            $(".list ul").html(template('tp-test',json));



            var canvas = document.getElementById("wheelcanvas");

            if (!canvas.getContext){
                $(".realCanvas").hide();
                $(".reserve").show();
                return false;
            }else{
                $(".realCanvas").show();
                // $(".reserve").hide();


            }

            setturntable(json);
        }
        ,error:function(){
            $(".reserve").show();
        }
    });
    $('.reserve').on('click',  function(event) {
        var layerReserve=layer.open({
            type: 1,
            area: ['666px', '600px'],
            shade: [0.6, '#000'],
            closeBtn: true,
            title:false, //不显示标题
            content:
            "<h4><i class='i1'></i><span class='layerTitle'>温馨提示</span><i class='i2'></i></h4>"+
            "<p class='layerBower'>当前浏览器版本太低<br>请扫二维码参加活动</p>"+
            '<div class="qr"><img src="images/pc/qr.jpg" alt="" /></div>'+
            "<div class='bgBtn close'><a href='javascript:;' class='blue centerBtn closeLayer'>知道了</a></div>"
        });
        $(".closeLayer").on("click",function(){
            layer.close(layerReserve);
        });
        return false
    });
}
//第三重列表
function num() {
    $.ajax({
        url:"./invite.json",
        success: function (json) {
            if(!json.type){
                if (typeof layer.msg === "function") {
                    layer.msg(json.message);
                } else {
                    layer.open({
                        content: json.message,
                        skin: 'msg',
                        time: 2
                    });
                }
            }

			//手机只显示10条数据
			if(!!u.match(/AppleWebKit.*Mobile.*/) && !!u.match(/AppleWebKit/)){
                json.data= json.data.slice(0,10);
            }else{
                if(json.data.length < 10){
                    var arr = {"count":"","memberId":'0',"userName":""};
                    for(i = json.data.length;i < 10 ;i++){
                        json.data.push(arr)
                    }
                }
                json.first = json.data.slice(0,5);
                json.next = json.data.slice(5,10);
            }

            $(".num").html(template('num-test',json));
        }
    });
}
//是否实名
function realName() {
    $.ajax({
        url:"./record.json",
        success: function (json) {
            if(!json.success){
                loginFun();
                return false;
            }
            if(!json.authed){
                if(typeof layer.msg === "function"){
                    layer.open({
                        type: 1,
                        area: ['666px', '300px'],
                        shade: [0.6, '#000'],
                        closeBtn: true,
                        title:false, //不显示标题
                        content: "<h4><i class='i1'></i><span class='layerTitle'>温馨提示</span><i class='i2'></i></h4><p class='layerTip'>请先完成实名认证才能参与活动哦。</p><div class='bgBtn'><a href='"+host+"/center/recharge/index' class='blue centerBtn'>实名认证</a></div>"
                    });
                    return false;
                }else{
                    layerAll = layer.open({
                        content: '<div class="layerOut"><a class="lightClose closeLayer"><img src="images/close.png" alt=""/></a><p>请先完成实名认证才能参与活动哦。</p><div class="bgBtn"><a href="'+host+'/center/recharge/index" class="blue centerBtn appUrl" data-app-url="baoxiang://APPTopUp">实名认证</a></div></div>'
                    });
                    lightCloseFun();
                    return false;
                }
            }
        }
    });
}
//个人获奖记录弹框
$(".recordBtn").on("click",function(e){
    e.preventDefault();
    recordFun();
});
//个人获奖记录
function recordFun() {
    $.ajax({
        url: host+'/act-recommend/my-gift.html?t=' + new Date().getTime(),
        success: function (json) {
            if(!json.success){
                loginFun();
                return false;
            }
            if (!json.type) {
                if (typeof layer.msg === "function") {
                    layer.msg(json.message);
                } else {
                    layer.open({
                        content: json.message,
                        skin: 'msg',
                        time: 2
                    });
                }
                return false;
            }

            if(typeof layer.msg === "function"){
                var layerRecord=layer.open({
                    type: 1,
                    area: ['666px', '600px'],
                    shade: [0.6, '#000'],
                    closeBtn: true,
                    title:false, //不显示标题
                    content:'<h4><i class="i1"></i><span class="layerTitle">获奖记录</span><i class="i2"></i></h4><div class="layerRecord"></div><div class="layerRecordBlue"><a href="javascript:;" class="blue centerBtn closeLayer">知道了</a></div>'
                });
            }else{
                layerAll = layer.open({
                    content:'<div class="layerOut"><a class="lightClose"><img src="images/close.png" alt=""/></a><h4 class="recordH4"><i class="i1"></i><span class="layerTitle">获奖记录</span><i class="i2"></i></h4><div class="layerRecord"></div><div class="bgBtn bgBtnTop"><a href="javascript:;" class="yellow centerBtn lightClose">知道了</a></div></div>'
                })
                lightCloseFun();
            }
            $(".closeLayer").on("click",function(){
                layer.close(layerRecord);
            });
            //手机只显示10条数据
            $(".layerRecord").html(template('record-test',json));
        }
    });
}
//act-recommend/is-run.html活动是否运行
//act-recommend/getPic.html 邀请二维码
$(".inviteBtn").on("click", function (e) {
    e.preventDefault();
    inviteImg();
});
function inviteImg(){
    $.ajax({
        url: host+"/act-recommend/is-run.html?t=" + new Date().getTime(),
        success: function (json) {
            if (!json.success) {
                loginFun();
                return false;
            }
            if (!json.type) {
                if (typeof layer.msg === "function") {
                    layer.msg(json.message);
                } else {
                    layer.open({
                        content: json.message,
                        skin: 'msg',
                        time: 2
                    });
                }
                return false;
            }

            if(typeof layer.msg === "function"){
                layer.open({
                    type: 1,
                    area: ['666px', '300px'],
                    shade: [0.6, '#000'],
                    closeBtn: true,
                    title:false, //不显示标题
                    content: '<h4><i class="i1"></i><span class="layerTitle">温馨提示</span><i class="i2"></i></h4><p class="layerTip">保存图片并分享。</p><div class="bgBtn"><a href="'+host+'/act-recommend/getPic.html" target="_blank" class="blue centerBtn" onclick="loadingFun()">继续邀请</a></div>'
                });
                return false;
            }else{
                layerAll = layer.open({
                    content:'<div class="layerOut"><a class="lightClose closeLayer"><img src="images/close.png" alt=""/></a><p>保存图片并分享</p><div class="bgBtn"><a href="'+host+'/act-recommend/getPic.html" class="blue centerBtn" onclick="loadingFun()">继续邀请</a></div></div>'
                });
                lightCloseFun();
                return false;
            }
        }
    });
}
function lightCloseFun(){
    $(".lightClose").on("click",function(){
        layer.close(layerAll);
    });
}
function loadingFun(){
    if (typeof layer.msg === "function") {
        var index = layer.load(1, {
            shade: [0.6,'#000'] //0.1透明度的白色背景
            ,time: 200
        });
    }else{
        var index = layer.open({type: 2});
    }
}

