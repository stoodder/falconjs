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

    jQueryAdapter.prototype.resolveRequestType = function(data_object, type, options, context) {
      return jQueryAdapter.__super__.resolveRequestType.call(this, data_object, type, options, context);
    };

    jQueryAdapter.prototype.resolveContext = function(data_object, type, options, context) {
      return jQueryAdapter.__super__.resolveContext.call(this, data_object, type, options, context);
    };

    jQueryAdapter.prototype.standardizeOptions = function(data_object, type, options, context) {
      options = jQueryAdapter.__super__.standardizeOptions.call(this, data_object, type, options, context);
      if (!isObject(options.data)) {
        options.data = null;
      }
      if (!isString(options.dataType)) {
        options.dataType = "json";
      }
      if (!isString(options.contentType)) {
        options.contentType = "application/json";
      }
      if (!isObject(options.params)) {
        options.params = {};
      }
      if (!isObject(options.headers)) {
        options.headers = {};
      }
      options.cache = this.cache;
      return options;
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
      if (serialized_data === null) {
        return "";
      }
      return JSON.stringify(options.data);
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

    jQueryAdapter.prototype.successResponseHandler = function(data_object, type, options, context, response_args) {
      return jQueryAdapter.__super__.successResponseHandler.call(this, data_object, type, options, context, response_args);
    };

    jQueryAdapter.prototype.errorResponseHandler = function(data_object, type, options, context, response_args) {
      return jQueryAdapter.__super__.errorResponseHandler.call(this, data_object, type, options, context, response_args);
    };

    jQueryAdapter.prototype.completeResponseHandler = function(data_object, type, options, context, response_args) {
      return jQueryAdapter.__super__.completeResponseHandler.call(this, data_object, type, options, context, response_args);
    };

    jQueryAdapter.prototype.sync = function(data_object, type, options, context) {
      var data, url,
        _this = this;
      jQueryAdapter.__super__.sync.call(this, data_object, type, options, context);
      type = this.resolveRequestType(data_object, type, options, context);
      options = this.standardizeOptions(data_object, type, options, context);
      context = this.resolveContext(data_object, type, options, context);
      if (Falcon.isModel(data_object)) {
        if ((type === "PUT" || type === "POST") && (!data_object.validate(options))) {
          return null;
        }
      }
      url = this.makeUrl(data_object, type, options, context);
      data = this.serializeData(data_object, type, options, context);
      return $.ajax({
        'type': type,
        'url': url,
        'data': data,
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
          error: function() {
            return console.log("[FALCON] Error Loading Template: '" + url + "'");
          },
          success: function(html) {
            Falcon.View.cacheTemplate(url, html);
            if (isFunction(loaded_callback)) {
              return loaded_callback();
            }
          }
        });
      }
      return this;
    };

    return jQueryAdapter;

  })(Falcon.Adapter);

  Falcon.adapter = new jQueryAdapter;

}).call(this);
