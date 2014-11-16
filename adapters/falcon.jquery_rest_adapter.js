(function() {
  var isArray, isBoolean, isElement, isEmpty, isFunction, isNaN, isNumber, isObject, isString, _ref, _ref1,
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
    } else if (isString(object)) {
      return trim(object).length === 0;
    } else if (isArray(object)) {
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

  this.jQueryRestDataAdapter = (function(_super) {
    __extends(jQueryRestDataAdapter, _super);

    function jQueryRestDataAdapter() {
      _ref = jQueryRestDataAdapter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    jQueryRestDataAdapter.prototype.cache = false;

    jQueryRestDataAdapter.prototype.standardizeOptions = function(data_object, type, options, context) {
      var output_options, _ref1;
      output_options = jQueryRestDataAdapter.__super__.standardizeOptions.call(this, data_object, type, options, context);
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
      output_options.cache = (_ref1 = output_options.cache) != null ? _ref1 : this.cache;
      return output_options;
    };

    jQueryRestDataAdapter.prototype.resolveUrl = function(data_object, type, options, context) {
      var key, url, value;
      url = jQueryRestDataAdapter.__super__.resolveUrl.call(this, data_object, type, options, context);
      if (!isEmpty(options.params)) {
        url += url.indexOf("?") > -1 ? "&" : "?";
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

    jQueryRestDataAdapter.prototype.serializeData = function(data_object, type, options, context) {
      var serialized_data;
      serialized_data = jQueryRestDataAdapter.__super__.serializeData.call(this, data_object, type, options, context);
      if (serialized_data == null) {
        return "";
      }
      if (isString(serialized_data)) {
        return serialized_data;
      }
      return JSON.stringify(serialized_data);
    };

    jQueryRestDataAdapter.prototype.parseRawResponseData = function(data_object, type, options, context, response_args) {
      var data, ex, xhr, _ref1;
      _ref1 = jQueryRestDataAdapter.__super__.parseRawResponseData.call(this, data_object, type, options, context, response_args), data = _ref1.data, xhr = _ref1.xhr;
      try {
        if (isString(data)) {
          data = JSON.parse(data);
        }
        if (isString(xhr != null ? xhr.responseText : void 0)) {
          if (data == null) {
            data = JSON.parse(xhr.responseText);
          }
        }
      } catch (_error) {
        ex = _error;
        data = null;
      }
      if (data == null) {
        data = Falcon.isModel(data_object) ? {} : [];
      }
      return data;
    };

    jQueryRestDataAdapter.prototype.sync = function(data_object, type, options, context) {
      var standardized_inputs,
        _this = this;
      standardized_inputs = jQueryRestDataAdapter.__super__.sync.call(this, data_object, type, options, context);
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

    return jQueryRestDataAdapter;

  })(Falcon.DataAdapter);

  this.jQueryTemplateAdapter = (function(_super) {
    __extends(jQueryTemplateAdapter, _super);

    function jQueryTemplateAdapter() {
      _ref1 = jQueryTemplateAdapter.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    jQueryTemplateAdapter.prototype.cache = false;

    jQueryTemplateAdapter.prototype.loadTemplate = function(uri, callback) {
      var _this = this;
      if (uri.charAt(0) === "#") {
        return jQueryTemplateAdapter.__super__.loadTemplate.call(this, uri, callback);
      }
      $.ajax({
        url: uri,
        type: Falcon.GET,
        cache: this.cache,
        error: function() {
          return callback("");
        },
        success: function(template) {
          _this.cacheTemplate(uri, template);
          return callback(template);
        }
      });
      return this;
    };

    return jQueryTemplateAdapter;

  })(Falcon.TemplateAdapter);

  Falcon.dataAdapter = new jQueryRestDataAdapter;

  Falcon.templateAdapter = new jQueryTemplateAdapter;

}).call(this);
