/**
 * Created by qiqi on 17/12/5.
 */
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
                            window.setTimeout(function(){
                                $loading.css('display','none');
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
    var $phone =$('#phone');

    return{
        init:function(){
            $phone.css('display','block');
        }
    }
})();


loadingRender.init();
