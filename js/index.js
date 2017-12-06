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

    var ary =[];
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
                },1000)
            } else {

                $.each(ary,function(index,item){
                    var oImg = new Image;
                    oImg.src = 'img/'+item;
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
                    }
                })

            }

        }
    }
})();

/*--PHONE--*/
var phoneRender=(function(){
    var $phone =$('#phone'),
        $listen = $phone.children('.listen'),

    $listenTouch = $listen.children('.touch'),
        $details = $phone.children('.details'),
        $detailsTouch = $details.children('.touch'),
        $time= $phone.children('.time');

    var listenMusic = $('#listernMusic')[0],
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
            second < 10?minute ='0'+second :null;
            $time.html = (minute+':'+second);
            //播放完成检测
            if(curTime === detailsMusic.duration){
                window.clearInterval(musicTimer);
                closePhone();
            }
        },1000)
    }
    //关闭当前的phone的区域,显示下一个区域
    function closePhone(){
        detailsMusic.pause();
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
                console.log('111',$listenTouch)
                $listen.css('display','none');
                listenMusic.pause();

                $details.css('transform','translateY(0)');
                $time.css('display','block');
                detailsMusicFn();

            });
            //给details中touch绑定点击事件.
            $detailsTouch.click(closePhone);
        }
    }
})();

/*--MESSAGE--*/
var messageRender = (function(){
    var $message = $('#message');
    return{
        init:function(){
            $message.css('display','block');
        }
    }
})()

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


