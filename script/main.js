var slideIndex = 1;
function plusDivs(n) {
  showDivs(slideIndex += n);
}

function currentDiv(n) {
  showDivs(slideIndex = n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("focused_img");
  if (n > x.length) {slideIndex = 1}    
      if (n < 1) {slideIndex = x.length}
          for (i = 0; i < x.length; i++) {
           x[i].style.display = "none";  
       }

       x[slideIndex-1].style.display = "block";  
   }

   var works_loaded = false;
   var presentations_loaded = false;
   var toast_is_shown = false;
   var events_loaded=false;
   var first_event_page_downloaded = false;



$(document).ready(function(){

    $('#work_btn').click(function(){
        $('html,body').animate({
            scrollTop: $("#project_container").offset().top},
            'slow');
    });

    $('#contact_btn').click(function(){
        if(!toast_is_shown){
            toast_is_shown=true;
            M.toast({html: '<span>Excited to hear from you ^_^</span><br><span style="font-size: 13px;"><a href="mailto:soubhi.hadri@gmail.com">soubhi.hadri@gmail.com</a></span> <br><span style="font-size: 13px;"><a href="mailto:soubhi.hadri@gmail.com">s.hadri@ou.edu</a></span><br><span style="font-size: 13px;">Find Me</span><br><i class="material-icons">arrow_downward</i>',
               classes: 'toast',
               completeCallback:function(){
                toast_is_shown=false;
            }
        });
        }
    });

    $('#course_btn').click(function(){
        $('html,body').animate({
            scrollTop: $("#courses").offset().top},
            'slow');
    });

    $('#presentation_btn').click(function(){
        $('html,body').animate({
            scrollTop: $("#presentation").offset().top},
            'slow');
    });  

   // $('.modal').modal();
   $('.carousel').carousel();

   $('.a').hover(

     function () {
         $('.a #ulEle').css({
             display: 'block'
         });
         $('.a #ulEle').animate({
             left: '20px',
             background: '#ccc'
         }, 100);
     },

     function () {
         $('.a #ulEle').animate({
             left: '0',
             background: '#ccc'
         }, 100, function () {
             $('.a #ulEle').css({
                 display: 'none'
             });
         });
     });

//   $.post( "controller/controller.php",{action: 'get_events',page:0}, function( data ) {
//     $('.events').append(data);
//     first_event_page_downloaded=true;
// });



});






