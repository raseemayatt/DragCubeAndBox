

$(document).ready(function() {

    var getslide = $('.main-box li').length - 1;

    var slidecal = 12/getslide+'%';
    
    $('.box').css({"width": slidecal});
    
    $('.box').click(function(){
        $('.box').removeClass('active');
       $(this).addClass('active');
    });


    var getslide2 = $('.main-box-edit li').length - 1;

    var slidecal2 = 12/getslide2+'%';
    
    $('.box-edit').css({"width": slidecal2});
    
    $('.box-edit').click(function(){

        $('.box-edit').removeClass('active');
       $(this).addClass('active');
    });
});
