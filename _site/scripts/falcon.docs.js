(function() {
  window.logger = function(logger_id, value) {
    var first_value, v;

    console.log(value);
    if ((value instanceof Array) && (first_value = value[0])) {
      if (Falcon.isModel(first_value) && (first_value.get("name") != null)) {
        value = (function() {
          var _i, _len, _results;

          _results = [];
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            v = value[_i];
            _results.push(v.get("name"));
          }
          return _results;
        })();
      }
    }
    return $("#" + logger_id).append("<div>" + value + "</div>").toggleClass("visible", true);
  };

  $(function() {
    var logger_index;

    logger_index = 0;
    return $("code").each(function(index, element) {
      var $element, $logger, $runner, code, html, logger_id;

      $element = $(element);
      html = $element.html().replace(/\&lt;/gi, "<").replace(/\&gt;/gi, ">");
      $element.text(html);
      if ($element.hasClass("runnable")) {
        code = $element.text();
        logger_id = "__logger_" + (logger_index++) + "__";
        code = code.replace(/console\.log\(/gi, "logger('" + logger_id + "',");
        $runner = $("<div class='runner'><i class='glyphicon glyphicon-play'></div>");
        $logger = $("<div class='logger' id='" + logger_id + "'></div>");
        $element.append($runner);
        $element.append($logger);
        return $runner.on("click", function() {
          var aUrl, tUrl, _ajax;

          $(this).siblings(".logger").empty();
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
