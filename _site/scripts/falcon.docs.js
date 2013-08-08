(function() {
  $(function() {
    var startBodyScroll, stopBodyScroll;

    startBodyScroll = function(event) {
      document.body.style.overflow = "auto";
      document.body.removeAttribute("scroll");
      event.stopPropagation();
      return event.preventDefault();
    };
    stopBodyScroll = function(event) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("scroll", "no");
      event.stopPropagation();
      return event.preventDefault();
    };
    $("iframe").on("mouseenter", stopBodyScroll);
    $("iframe").on("mouseleave", startBodyScroll);
    return $("body").on("mouseenter", startBodyScroll);
  });

}).call(this);
