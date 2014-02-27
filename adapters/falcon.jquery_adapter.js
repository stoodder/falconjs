(function() {
  var isArray, isBoolean, isElement, isEmpty, isFunction, isNaN, isNumber, isObject, isString, jQueryAdapter, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  isObject = function(object) {
    return (object != null) && Object.prototype.toString.call(object) === "[object Object]";
  };

  isFunction = function(object) {
    return (object != null) && Object.prototype.toString.call(object) === "[object Function]";
  };

  isBoolean = function(object) {
    return (object != null) && Object.prototype.toString.call(object) === "[object Boolean]";
  };

  isArray = function(object) {
    return (object != null) && Object.prototype.toString.call(object) === "[object Array]";
  };

  isString = function(object) {
    return (object != null) && Object.prototype.toString.call(object) === "[object String]";
  };

  isNumber = function(object) {
    return (object != null) && Object.prototype.toString.call(object) === "[object Number]";
  };

  isNaN = function(object) {
    return isNumber(object) && object !== object;
  };

  isEmpty = function(object) {
    var key, value;
    if (object == null) {
      return true;
    } else if (isString(object) || isArray(object)) {
      return object.length === 0;
    } else if (isObject(object)) {
      for (key in object) {
        value = object[key];
        return false;
      }
      return true;
    }
    return false;
  };

  if (typeof HTMLElement === "object") {
    isElement = function(object) {
      return object instanceof HTMLElement;
    };
  } else {
    isElement = function(object) {
      return (object != null) && (object.nodeType === 1) && (typeof object.nodeName === "string");
    };
  }

  jQueryAdapter = (function(_super) {
    __extends(jQueryAdapter, _super);

    function jQueryAdapter() {
      _ref = jQueryAdapter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    jQueryAdapter.prototype.cache = false;

    jQueryAdapter.prototype.standardizeOptions = function(data_object, type, options, context) {
      var output_options;
      output_options = jQueryAdapter.__super__.standardizeOptions.call(this, data_object, type, options, context);
      if (!isString(output_options.dataType)) {
        output_options.dataType = "json";
      }
      if (!isString(output_options.contentType)) {
        output_options.contentType = "application/json";
      }
      if (!isObject(output_options.params)) {
        output_options.params = {};
      }
      if (!isObject(output_options.headers)) {
        output_options.headers = {};
      }
      output_options.cache = this.cache;
      return output_options;
    };

    jQueryAdapter.prototype.makeUrl = function(data_object, type, options, context) {
      var key, url, value;
      url = jQueryAdapter.__super__.makeUrl.call(this, data_object, type, options, context);
      if (!isEmpty(options.params)) {
        if (!(url.indexOf("?") > -1)) {
          url += "?";
        }
        url += ((function() {
          var _ref1, _results;
          _ref1 = options.params;
          _results = [];
          for (key in _ref1) {
            value = _ref1[key];
            _results.push("" + key + "=" + value);
          }
          return _results;
        })()).join("&");
      }
      return url;
    };

    jQueryAdapter.prototype.serializeData = function(data_object, type, options, context) {
      var serialized_data;
      serialized_data = jQueryAdapter.__super__.serializeData.call(this, data_object, type, options, context);
      if (serialized_data == null) {
        return "";
      }
      return JSON.stringify(serialized_data);
    };

    jQueryAdapter.prototype.parseRawResponseData = function(data_object, type, options, context, response_args) {
      var data, xhr, _ref1;
      _ref1 = jQueryAdapter.__super__.parseRawResponseData.call(this, data_object, type, options, context, response_args), data = _ref1.data, xhr = _ref1.xhr;
      if (isString(data)) {
        data = JSON.parse(data);
      }
      if ((data == null) && isString(xhr.responseText)) {
        data = JSON.parse(xhr.responseText);
      }
      if (data == null) {
        data = Falcon.isModel(data_object) ? {} : [];
      }
      return data;
    };

    jQueryAdapter.prototype.sync = function(data_object, type, options, context) {
      var standardized_inputs,
        _this = this;
      standardized_inputs = jQueryAdapter.__super__.sync.call(this, data_object, type, options, context);
      if (!standardized_inputs.is_valid) {
        return null;
      }
      data_object = standardized_inputs.data_object, type = standardized_inputs.type, context = standardized_inputs.context, options = standardized_inputs.options;
      return $.ajax({
        'type': type,
        'url': options.url,
        'data': options.data,
        'dataType': options.dataType,
        'contentType': options.contentType,
        'cache': options.cache,
        'headers': options.headers,
        'success': function(data, status, xhr) {
          return _this.successResponseHandler(data_object, type, options, context, {
            'data': data,
            'status': status,
            'xhr': xhr
          });
        },
        'error': function(xhr) {
          return _this.errorResponseHandler(data_object, type, options, context, {
            'xhr': xhr
          });
        },
        'complete': function(xhr, status) {
          return _this.completeResponseHandler(data_object, type, options, context, {
            'status': status,
            'xhr': xhr
          });
        }
      });
    };

    jQueryAdapter.prototype.getTemplate = function(view, url, loaded_callback) {
      var _this = this;
      if (url.charAt(0) === "#") {
        return jQueryAdapter.__super__.getTemplate.call(this, view, url, loaded_callback);
      } else {
        $.ajax({
          url: url,
          type: "GET",
          cache: this.cache,
          complete: function() {
            if (isFunction(loaded_callback)) {
              return loaded_callback();
            }
          },
          error: function() {
            return console.log("Error Loading Template: '" + url + "'");
          },
          success: function(html) {
            return Falcon.View.cacheTemplate(url, html);
          }
        });
      }
      return this;
    };

    return jQueryAdapter;

  })(Falcon.Adapter);

  Falcon.adapter = new jQueryAdapter;

}).call(this);
