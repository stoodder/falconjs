(function() {
  $(function() {
    return $("code").each(function(index, element) {
      var $element, $runner, code, html;

      $element = $(element);
      html = $element.html().replace(/\&lt;/gi, "<").replace(/\&gt;/gi, ">");
      $element.click(function() {
        return console.log(html);
      });
      $element.text(html);
      if ($element.hasClass("runnable")) {
        code = $element.text();
        $runner = $("<div class='runner'><i class='glyphicon glyphicon-play'></div>");
        $element.append($runner);
        return $runner.on("click", function() {
          var aUrl, tUrl, _ajax;

          _ajax = $.ajax;
          $.ajax = (function() {});
          aUrl = Falcon.baseApiUrl;
          tUrl = Falcon.baseTemplateUrl;
          eval(code);
          Falcon.baseApiUrl = aUrl;
          Falcon.baseTemplateUrl = tUrl;
          return $.ajax = _ajax;
        });
      }
    });
  });

}).call(this);
