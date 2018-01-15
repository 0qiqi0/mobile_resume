/**
 * Created by qiqi on 17/12/5.
 */
/*-String.prototype-*/
~function(pro){
    function queryURLParameter(){
        var reg = /([^?=&#]+)=([^?=&#]+)/g,
            obj = {};
        this.replace(reg,function(){
            obj[arguments[1]] = arguments[2];
        });
        return obj;

    }
    pro.queryURLParameter = queryURLParameter;
}(String.prototype);



/*-- LOADING --*/
var loadingRender = (function(){

    var ary =['book1.png', 'book2.png', 'book3.png', 'book4.png',
        'book5.png', 'book6.png', 'cube_bg.jpg', 'love3.png', 'love4.png',
        'love5.png', 'message_keyboard.jpg', 'message_submit.png', 'return.png',
        'teacher_logo.png', 'tech1.png', 'tech10.png', 'tech2.png', 'tech3.png',
        'tech4.png', 'tech5.png', 'tech6.png', 'tech7.png', 'work7.png', 'zf_phoneBg.jpg',
        'zf_phoneBg2.jpg', 'zf_phoneDetail.png', 'zf_phoneListen.png'];
    //获取需要操作的元素
    var $loading = $('#loading'),
        $progressEm = $loading.find('.progressEm');
    var step = 0,
        total = ary.length;

    return{
        init:function(){
            $loading.css('display','block');

            //循环加载所有的图片,控制进度条宽度
            if(ary.length ==0){
                $progressEm.css('width','100%');
                if(page ===0) return;

                window.setTimeout(function(){
                    $loading.css('display','none');
                    phoneRender.init();
                },1000)
            } else {

                $.each(ary,function(index,item){
                    var oImg = new Image;
                    oImg.onload = function(){
                        step++;
                        $progressEm.css('width',step/total*100+'%');
                        oImg = null;
                        if(step === total){
                            if(page ===0) return;

                            window.setTimeout(function(){
                                $loading.css('display','none');
                                phoneRender.init();
                            },1000)
                        }
                    };
                    //src 属性一定要写到 onload 的后面，否则程序在 IE 中会出错。
                    oImg.src = 'img/'+item;

                })

            }
        }
    }
})();

var listenMusic = $('#listernMusic')[0];

document.addEventListener("WeixinJSBridgeReady", function () {
    listenMusic.play();
}, false);

/*--PHONE--*/
var phoneRender=(function(){
    var $phone =$('#phone'),
        $listen = $phone.children('.listen'),

    $listenTouch = $listen.children('.touch'),
        $details = $phone.children('.details'),
        $detailsTouch = $details.children('.touch'),
        $time= $phone.children('.time'),

        detailsMusic = $('#detailsMusic')[0],
        musicTimer=null;
    //console.log('000',$listenTouch.singleTap)

    //播放自我介绍,计算和显示播放时间.
    function detailsMusicFn(){
        detailsMusic.play();
        musicTimer=window.setInterval(function(){
            var curTime =detailsMusic.currentTime,
                minute = Math.floor(curTime/60),
                second = Math.floor(curTime);
            minute < 10?minute ='0'+minute :null;
            second < 10?second ='0'+second :(''+second);

            $time.innerHTML = "<span>minute+':'+second</span>";
            //播放完成检测
            if(curTime === detailsMusic.duration){
                window.clearInterval(musicTimer);
                closePhone();
            }
        },1000)
    }
    //关闭当前的phone的区域,显示下一个区域
    function closePhone(){
        //detailsMusic.pause();
        $phone.css('transform','translateY('+document.documentElement.clientHeight+'px)').on('webkitTransitionEnd',function(){
            $phone.css('display','none');
        })
        messageRender.init();
    }

    return{
        init:function(){
            $phone.css('display','block');
            listenMusic.play();
            //给listern中的touch绑定单击事件,移动端的单击事件使用click,类似的有touchstart,touchmove,touchend来模拟.
            //$listenTouch.singleTap(function(){
            $listenTouch.click(function(){
                $listen.css('display','none');
                //listenMusic.pause();

                //$details.css('transform','translateY(0)');
                //$time.css('display','block');
                //detailsMusicFn();

                closePhone();
            });
            //给details中touch绑定点击事件.
            //$detailsTouch.click(closePhone);
        }
    }
})();

/*--MESSAGE--*/
var messageRender = (function(){
    var $message = $('#message'),
        $messageList=$message.children('.messageList'),
        $list = $messageList.children('li'),
        $keyBoard = $message.children('.keyboard'),
        $textTip = $keyBoard.children('.textTip'),
        $submit = $keyBoard.children('.submit');

    var autoTimer =null,
        step = -1,
        total = $list.length,
        bounceTop =0;
    //var messageMusic = $('#messageMusic')[0];  //play is not a function 解决办法

    /*--s实现消息列表一条条发送--*/
    function messageMove(){
        autoTimer = window.setInterval(function(){
            step++;
            var $cur = $list.eq(step);
            $cur.css({
                opacity:1,
                transform:'translateY(0)'

            });
            //当发送完成第三条的时候开启键盘操作.
            if(step===1){
                window.clearInterval(autoTimer);
                $keyBoard.css('transform','translateY(0)');
                $textTip.css('display','block');
                textMove();
            }
            //从第三条开始没发送一条消息都需要让整个消息区域网上移动一些.
            if(step >=3){
                bounceTop -=$cur[0].offsetHeight+10;
                $messageList.css('transform','translateY('+bounceTop+'px)');
            }
            //当消息发送完成
            if(step===total-1){
                window.clearInterval(autoTimer);
                window.setTimeout(function(){
                    //if(page ===2) return;

                    $message.css('display','none');
                    //messageMusic.pause();
                    listenMusic.pause();
                    cubeRender.init();

                },3000);
            }
        },1000);

    }
    //实现文字打印
    function textMove(){
        var text = '你有哪些擅长的前端技能呢?',
            n = -1,
            result = '';
        var textTime =window.setInterval(function(){
            n++;
            result +=text[n];
            $textTip.html(result);
            if(n === text.length-1){
                window.clearInterval(textTime);
                $submit.css('display','block').click(function(){
                    $textTip.css('display','none');
                    $keyBoard.css('transform','translateY(3.7rem)');
                    messageMove();
                });
            }
        },100);
    }
    return{
        init:function(){
            $message.css('display','block');
            messageMove();

            //messageMusic.play();
        }
    }
})();

/*魔方区域*/
var cubeRender =(function(){
    var $cube = $('.cube'),
        $cubebox = $cube.children('.cubebox'),
        $cubeBoxList  = $cubebox.children('li');

    //判断滑动和点击里的临界点
    function isSwipe(changeX,changeY){
        return Math.abs(changeX)>30 || Math.abs(changeY)>30;
    }

    // 滑动的处理
    function start(ev){
        //console.log('eeeee',$cubebox.attr('rotateX'))
        var point = ev.touches[0];  //记录多个手指操作的信息
        $(this).attr({
            strX:point.clientX,
            strY:point.clientY,
            changeX:0,
            changY:0
        })
    }

    function  move(ev){
        var point = ev.touches[0],
            changeX = point.clientX-$(this).attr('strX'), //strXY在start函数中存了
            changeY = point.clientY - $(this).attr('strY');
        $(this).attr({
            changeX:changeX,
            changeY:changeY
        })
    }

    function end(){
        var changeX = parseFloat($(this).attr('changeX')),
            changeY = parseFloat($(this).attr('changeY'));

        var rotateX = parseFloat($(this).attr('rotateX')),
            rotateY = parseFloat($(this).attr('rotateY'))
        if(isSwipe(changeX,changeY)===false) return;
        rotateX = rotateX - changeY / 2;
        rotateY = rotateY + changeX / 2;
        $(this).attr({
            rotateX:rotateX,
            rotateY:rotateY
        }).css('transform',' scale(0.6) rotateX('+rotateX+'deg) rotateY('+rotateY+'deg)')

    }
    return {
        init:function(){
            $cube.css('display','block');

            //魔方区域的滑动
            $cubebox.attr({
                rotateX: -35,
                rotateY: 45
            }).on('touchstart',start).on('touchmove',move).on('touchend',end);

            //每个页面的点击操作
            //$cubebox.singleTap(function(){

            $cubeBoxList.click(function(){
                var index = $(this).index();
                $cube.css('display','none');

                swiperRender.init(index);
            })
        }
    }
})()


/*SWIPER*/

var swiperRender = (function(){
    var $swiper = $('#swiper');
    var $makisu = $('#makisu');
    var $return = $swiper.children('.return');

    function change(){
        $makisu.makisu({
            selector:'dd',
            overlap :0.6, //折叠时的速度
            speed   :0.8   //整体速度
        });
        $makisu.makisu('open');
    }

    return{
        init:function(index){
            $swiper.css('display','block');
            change();

           /* window.setTimeout(function(){
                $makisu.makisu({
                    selector:'dd',
                    overlap:0.6,
                    speed:0.8
                });
                $makisu.makisu('close');
            },6000)
*/
            //初始化swiper实现6个页面之间的切换.   1参:目标区域;2参:配置
            var mySwiper = new Swiper('.swiper-container',{
                effect : "coverflow",

                onTransitionEnd : function(example){
                    //不管切换到下一区域还是有回到本区域,会触发swiper内置css3的电话,同样也会触发onTansitionEnd的回调
                    //example:是我们当前创建的swiper这个类的实例
                    //example.slides: 记录了当前所有的slide切换的块
                    //example.activeIndex:记录了当前正在展示的这一活动块的索引.constructor

                    var slideAry = example.slides,
                        activeIndex = example.activeIndex;
                    if(activeIndex ===0){
                        change();
                    } else {
                        $makisu.makisu({
                            selector:'dd',
                            overlap:0.6,
                            speed:0
                        });
                        $makisu.makisu('close');
                    }
                    $.each(slideAry,function(index,item){
                        if(index ===activeIndex){
                            item.id = 'page'+(activeIndex+1);
                            return;
                        }
                        item.id= null;
                    })
                }
                //onInit: function(example){}
            });
            index = index ||0;
            mySwiper.slideTo(index,0);
            //mySwiper.slideTo(index);

            //给返回按钮绑定单击事件
            $return.click(function(){
                $swiper.css('display','none');
                $('.cube').css('display','block');
            })
        }
    }
})();


var urlObj = window.location.href.queryURLParameter(),
    page = parseFloat(urlObj['page']);

if(page===0 || isNaN(page)){
    loadingRender.init();
}

if(page ===1){
    phoneRender.init();
}

if(page ===2){
    messageRender.init();
}

if(page ===3){
    cubeRender.init();
}

if(page ===4){
    swiperRender.init();
}







