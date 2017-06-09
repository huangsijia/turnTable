
function setturntable(initial) {
    /*公共参数*/
    var w, h;
    if(typeof layer.msg === "function"){
        w = 600;
        h = 600;
    }else{
        w = window.innerWidth * 0.9;
        h = window.innerWidth;
    }
    var width = w, height = h;
    var halfWidth = width / 2;
    var turnplate = {
        restaraunts: [],				//大转盘奖品名称
        colors: ["transparent"],//动态添加大转盘的奖品与奖品区域背景颜色
        outsideRadius: halfWidth * 0.8,			//大转盘外圆的半径
        textRadius: halfWidth * 0.65,				//大转盘奖品位置距离圆心的距离
        insideRadius: halfWidth / 4,			//大转盘内圆的半径
        startAngle: 0,	//开始角度
        bRotate: false,				//false:停止;ture:旋转
        fontSize: Math.floor(h / 27) + 'px Microsoft YaHei,微软雅黑,Heiti SC,helvetica neue LT'
    };
    if(typeof layer.msg === "function"){
        turnplate.outsideRadius = halfWidth;
    }
    turnplate.restaraunts = initial.gifts;
    $(".js-lotteryNum").text(initial.count);   //抽奖次数

    // 提前获得奖品图片的宽高
    var imgW, imgH, i = 0, multiple = (h / 1400).toFixed(1);
    turnplate.restaraunts.forEach(function (value, index) {
        imgReady(value.logo, function () {
            imgW = Math.ceil(this.width * multiple);
            imgH = Math.ceil(this.height * multiple);
            var img = document.createElement("img");
            img.src = turnplate.restaraunts[index].logo;
            turnplate.restaraunts[index].width = imgW;
            turnplate.restaraunts[index].height = imgH;
            turnplate.restaraunts[index].img = img;
            //全部读取完成后在绘制canvas
            if (++i >= 5) {
                bar = new Image();
                bar.src = "./images/pc/bar.png";
                bar.onload = function(){
                    window.onload = function () {
                        drawRouletteWheel();
                    };
                }
            }
        });
    });

    var rotateTimeOut = function () {
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo: 2160,
            duration: 5000,
            callback: function () {
                alert('网络超时，请检查您的网络设置！');
            }
        });
    };

    //旋转转盘 item:奖品位置; txt：提示语;
    var rotateFn = function (item, txt, winning) {
        var angles = item * (360 / turnplate.restaraunts.length);

        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle: 0,
            animateTo:360-angles+1800,//180是加了5圈，360是反方向旋转
            duration: 8000,
            callback: function () {
                if(typeof layer.msg === "function"){
                    layer.open({
                        type: 1,
                        area: ['666px', '454px'],
                        shade: [0.6, '#000'],
                        closeBtn: true,
                        title:false, //不显示标题
                        content:'<h4><i class="i1"></i><span class="layerTitle">恭喜获得</span><i class="i2"></i></h4><div class="light"><img src='+ txt.logo +' alt=""/></div><div class="bgBtn clearfix"><a href="javascript:;" class="yellow fl" onclick="recordFun()">查看奖励</a><a href="javascript:;" class="inviteBtn blue fl" onclick="inviteImg()">邀请好友</a></div>'
                    });
                }else{
                    layerAll = layer.open({
                        content:'<div class="layerOut"><a class="lightClose"><img src="images/close.png" alt=""/></a><div class="light"><img src='+ txt.logo +' alt=""/><div class="bgBtn clearfix"><a href="javascript:;" class="yellow fl" onclick="recordFun()">查看奖励</a><a href="javascript:;" class="inviteBtn blue fr" onclick="inviteImg()">邀请好友</a></div></div></div>'
                    });
                    lightCloseFun();
                }
                turnplate.bRotate = !turnplate.bRotate;
                flg = true;
            }
        });
    };

    /*开始旋转*/
    $('.pointer').click(function () {
        if (turnplate.bRotate) {
            return;
        } else {
            turnplate.bRotate = true;
            $.ajax({
                url: "/act-recommend/lottery.html",
                success: function (json) {
                    if (!json.success) {
                        loginFun();
                        turnplate.bRotate = !turnplate.bRotate;
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
                        turnplate.bRotate = !turnplate.bRotate;
                        return false;
                    }

                    if (!json.hasChance) {
                        if(typeof layer.msg === "function"){
                            layer.open({
                                type: 1,
                                area: ['666px', '300px'],
                                shade: [0.6, '#000'],
                                closeBtn: true,
                                title:false, //不显示标题
                                content: "<h4><i class='i1'></i><span class='layerTitle'>温馨提示</span><i class='i2'></i></h4><p class='layerTip'>当前&nbsp;<span class='red'>0次</span>&nbsp;抽奖机会</p><div class='bgBtn'><a href='javascript:;' class='inviteBtn blue centerBtn layui-layer-close' onclick='inviteImg()'>邀请好友</a></div>"
                            });
                        }else{
                            layerAll = layer.open({
                                content: '<div class="layerOut"><a class="lightClose"><img src="images/close.png" alt=""/></a><p>当前&nbsp;<span class="red">0次</span>&nbsp;抽奖机会</p><div class="bgBtn"><a href="javascript:;" class="inviteBtn blue centerBtn" onclick="inviteImg()">邀请好友</a></div></div>'
                            });
                            lightCloseFun();
                        }
                        turnplate.bRotate = !turnplate.bRotate;
                        return false;
                    }

                    flg = false;
                    initial.gifts.forEach(function (value, index) {
                        if (value.giftId == json.giftId) {
                            var winning = { 'giftName': json.giftName, 'logo': json.logo};
                            rotateFn(index, turnplate.restaraunts[index], winning);
                        }
                    })
                }
            });

        }

    });

    /*随机函数*/
    function rnd(n, m) {
        var random = Math.floor(Math.random() * (m - n + 1) + n);
        return random;

    }





    /*对转盘进行渲染*/
    function drawRouletteWheel() {
        var canvas = document.getElementById("wheelcanvas");
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.restaraunts.length / 2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0, 0, width, width);
            if (window.devicePixelRatio) {
                canvas.style.width = width + "px";
                canvas.style.height = width + "px";
                canvas.height = width * window.devicePixelRatio;
                canvas.width = width * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "transparent";
            //ctx.strokeStyle = "red";
            //font 属性设置或返回画布上文本内容的当前字体属性
            ctx.font = turnplate.fontSize;

            for (var i = 0; i < turnplate.restaraunts.length; i++) {
                var angle= turnplate.startAngle + i * arc+180;
                ctx.fillStyle = turnplate.colors[i];
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(halfWidth, halfWidth, turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(halfWidth, halfWidth, turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();

                //锁画布(为了保存之前的画布状态)
                ctx.save();

                //----绘制奖品开始----
                ctx.fillStyle = "#d92929";
                var text = turnplate.restaraunts[i];
                var line_height = 17;
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(halfWidth + Math.cos(angle + arc / 2) * turnplate.textRadius, halfWidth + Math.sin(angle + arc / 2) * turnplate.textRadius);

                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2);

                ctx.fillText(text.title, -ctx.measureText(text.title).width / 2, 0);
                //添加对应图标
                var move = -20;
                var radius = 240;
                var breadth = 10;
                if(typeof layer.msg === "function"){
                    move = -40;

                }else{
                    radius = window.innerWidth/2.8
                    breadth = breadth/2;
                    if(h <= 320){
                        move = -20;
                    }else if(320 < h && h <= 766 ){
                        move = -30;
                    }else if(766 <= h && h <= 768 ){
                        move = -50;
                    }else if(h > 768){
                        move = -70;
                    }
                }
                ctx.drawImage(text.img, move, 4, text.width, text.height);
                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();

                //----绘制奖品结束----
                ctx.save();//保存状态
                ctx.translate(halfWidth , halfWidth );
                ctx.rotate(angle );

                ctx.drawImage(bar,0, 0,radius , breadth);//把图片绘制在旋转的中心点，
                ctx.restore();//恢复状态
            }
        }
    }
}

