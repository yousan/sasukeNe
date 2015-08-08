$("#main_map").each(function() {
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