(function() {
  console.log("HERE");

  window.stopBodyScroll = function() {
    document.body.style.overflow = "hidden";
    return document.body.setAttribute("scroll", "no");
  };

  window.startBodyScroll = function() {
    document.body.style.overflow = "auto";
    return document.body.removeAttribute("scroll");
  };

}).call(this);
