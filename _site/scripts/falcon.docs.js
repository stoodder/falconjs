(function() {
  $(function() {
    return $("code").each(function(index, element) {
      var $element, $runner, code;

      $element = $(element);
      $element.text($element.html());
      if ($element.hasClass("runnable")) {
        code = $element.text();
        $runner = $("<div class='runner'><i class='glyphicon glyphicon-play'></div>");
        $element.append($runner);
        return $runner.on("click", function() {
          return eval(code);
        });
      }
    });
  });

}).call(this);
