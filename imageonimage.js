/**    $(function(){
       $overlay.css({
            position: "relative",
            display: "inline-block",
            width: $(this).width(),
            height: $(this).height(),
            backgroundPosition: "center center",
            backgroundImage: "url(yellow100.PNG)"
        });
        $('#main_map').wrap($overlay);
    });
**/


$("#main_maphoge").each(function() {
    var $overlay = $('<div></div>');
    $overlay.css({
        position: "relative",
        display: "inline-block",
        width: $(this).width(),
        height: $(this).height(),
        backgroundPosition: "center center",
        backgroundImage: "url(yellow100.PNG)"
    });
    $(this).wrap($overlay);
});