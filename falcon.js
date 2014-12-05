/*
	Falcon.js
	by Rick Allen (stoodder)

	Version 1.0.0rc1
	Full source at https://github.com/stoodder/falconjs
	Copyright (c) 2014 Rick Allen, http://www.stoodder.com

	MIT License, https://github.com/stoodder/falconjs/blob/master/LICENSE.md
*/


(function() {
  var Falcon, FalconCollection, FalconDataAdapter, FalconModel, FalconObject, FalconTemplateAdapter, FalconView, bindFunction, clone, isArray, isBoolean, isElement, isEmpty, isFunction, isNaN, isNumber, isObject, isString, key, trim, trimSlashes, value, _getForeachItems, _getOptionsItems, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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

  if (String.prototype.trim) {
    trim = function(str) {
      return String.prototype.trim.call(str);
    };
  } else {
    trim = function(str) {
      return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };
  }

  trimSlashes = function(str) {
    return str.replace(/^[\\/\s]+/, '').replace(/[\\/\s]+$/, '');
  };

  bindFunction = function(func, self) {
    var ret;
    ret = function() {
      return func.apply(self, arguments);
    };
    ret.__falcon_bind__length__ = func.length;
    return ret;
  };

  clone = function(object) {
    var flags, key, newInstance;
    if (!isObject(object)) {
      return object;
    }
    if (object instanceof Date) {
      return new Date(object.getTime());
    }
    if (object instanceof RegExp) {
      flags = '';
      if (object.global != null) {
        flags += 'g';
      }
      if (object.ignoreCase != null) {
        flags += 'i';
      }
      if (object.multiline != null) {
        flags += 'm';
      }
      if (object.sticky != null) {
        flags += 'y';
      }
      return new RegExp(object.source, flags);
    }
    newInstance = new object.constructor();
    for (key in object) {
      newInstance[key] = clone(object[key]);
    }
    return newInstance;
  };

  FalconObject = (function() {
    FalconObject.prototype.observables = null;

    FalconObject.prototype.defaults = null;

    FalconObject.extend = function(protoProps, staticProps) {
      var Surrogate, child, key, parent, value;
      parent = this;
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        child = function() {
          return parent.apply(this, arguments);
        };
      }
      for (key in parent) {
        value = parent[key];
        child[key] = value;
      }
      for (key in staticProps) {
        value = staticProps[key];
        child[key] = value;
      }
      Surrogate = function() {
        this.constructor = child;
      };
      Surrogate.prototype = parent.prototype;
      child.prototype = new Surrogate;
      for (key in protoProps) {
        value = protoProps[key];
        child.prototype[key] = value;
      }
      child.__super__ = parent.prototype;
      return child;
    };

    FalconObject.prototype.__falcon_object__events__ = null;

    FalconObject.prototype.__falcon_object__listeners__ = null;

    function FalconObject() {
      var attr, value, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      if (isObject(this.defaults)) {
        _ref = this.defaults;
        for (attr in _ref) {
          value = _ref[attr];
          if (isFunction(value)) {
            this[attr] = value.apply(this, arguments);
          } else if (isObject(value)) {
            this[attr] = clone(value);
          } else if (isArray(value)) {
            this[attr] = value.slice(0);
          } else {
            this[attr] = value;
          }
        }
      }
      if (isObject(this.observables)) {
        _ref1 = this.observables;
        for (attr in _ref1) {
          value = _ref1[attr];
          if (isFunction(value)) {
            this[attr] = ko.computed({
              'read': value,
              'owner': this,
              'deferEvaluation': (_ref2 = Falcon.deferEvaluation) != null ? _ref2 : true
            });
          } else if (isObject(value) && ('read' in value || 'write' in value)) {
            this[attr] = ko.computed({
              'read': value.read,
              'write': value.write,
              'owner': (_ref3 = value.owner) != null ? _ref3 : this,
              'deferEvaluation': (_ref4 = (_ref5 = value.deferEvaluation) != null ? _ref5 : Falcon.deferEvaluation) != null ? _ref4 : true,
              'disposeWhen': value.disposeWhen,
              'disposeWhenNodeIsRemoved': value.disposeWhenNodeIsRemoved
            });
          } else if (isArray(value)) {
            this[attr] = ko.observableArray(value.slice(0));
          } else {
            this[attr] = ko.observable(value);
          }
        }
      }
    }

    FalconObject.prototype.on = function(event, callback, context, allowance) {
      var _base;
      if (!(isString(event) && isFunction(callback))) {
        return this;
      }
      if (context == null) {
        context = this;
      }
      if (allowance == null) {
        allowance = -1;
      }
      event = trim(event).toLowerCase();
      if (isEmpty(event)) {
        return this;
      }
      if (this.__falcon_object__events__ == null) {
        this.__falcon_object__events__ = {};
      }
      ((_base = this.__falcon_object__events__)[event] != null ? (_base = this.__falcon_object__events__)[event] : _base[event] = []).push({
        callback: callback,
        context: context,
        allowance: allowance
      });
      return this;
    };

    FalconObject.prototype.once = function(event, callback, context) {
      return this.on(event, callback, context, 1);
    };

    FalconObject.prototype.off = function(event, callback, context) {
      var should_keep_event, update_events_for, _ref, _ref1,
        _this = this;
      if (!isObject(this.__falcon_object__events__)) {
        return this;
      }
      if (!isString(event)) {
        _ref = [event, callback, null], callback = _ref[0], context = _ref[1], event = _ref[2];
      }
      if (!isFunction(callback)) {
        _ref1 = [callback, null], context = _ref1[0], callback = _ref1[1];
      }
      if (isString(event)) {
        event = trim(event).toLowerCase();
      }
      should_keep_event = function(event_object) {
        if ((callback != null) && event_object.callback !== callback) {
          return true;
        }
        if ((context != null) && event_object.context !== context) {
          return true;
        }
        return false;
      };
      update_events_for = function(event) {
        var evt, evts;
        evts = _this.__falcon_object__events__[event];
        if (!isArray(evts)) {
          return;
        }
        evts = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = evts.length; _i < _len; _i++) {
            evt = evts[_i];
            if (should_keep_event(evt)) {
              _results.push(evt);
            }
          }
          return _results;
        })();
        return _this.__falcon_object__events__[event] = evts.length <= 0 ? null : evts;
      };
      if (isString(event)) {
        update_events_for(event);
      } else {
        for (event in this.__falcon_object__events__) {
          update_events_for(event);
        }
      }
      return this;
    };

    FalconObject.prototype.has = function(event, callback) {
      var evt, _i, _len, _ref;
      if (!isString(event)) {
        return false;
      }
      event = trim(event).toLowerCase();
      if (this.__falcon_object__events__ == null) {
        this.__falcon_object__events__ = {};
      }
      if (isEmpty(event) || (this.__falcon_object__events__[event] == null)) {
        return false;
      }
      if ((this.__falcon_object__events__[event] != null) && !isFunction(callback)) {
        return true;
      }
      _ref = this.__falcon_object__events__[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        if (evt.callback === callback) {
          return true;
        }
      }
      return false;
    };

    FalconObject.prototype.trigger = function() {
      var args, event, evt, resultant_event_array, _i, _len, _ref;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!isString(event)) {
        return this;
      }
      event = trim(event).toLowerCase();
      if (this.__falcon_object__events__ == null) {
        this.__falcon_object__events__ = {};
      }
      if (isEmpty(event) || (this.__falcon_object__events__[event] == null)) {
        return this;
      }
      resultant_event_array = [];
      _ref = this.__falcon_object__events__[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        if (evt.allowance !== 0) {
          resultant_event_array.push(evt);
          evt.callback.apply(evt.context, args);
        }
        if (evt.allowance > 0) {
          evt.allowance--;
        }
      }
      this.__falcon_object__events__[event] = resultant_event_array;
      return this;
    };

    FalconObject.prototype.listenTo = function(object, event, callback) {
      if (!Falcon.isFalconObject(object)) {
        return this;
      }
      if (!(isString(event) && isFunction(callback))) {
        return this;
      }
      object.on(event, callback, this);
      if (this.__falcon_object__listeners__ == null) {
        this.__falcon_object__listeners__ = [];
      }
      this.__falcon_object__listeners__.push({
        object: object,
        event: event,
        callback: callback
      });
      return this;
    };

    FalconObject.prototype.listenToOnce = function(object, event, callback) {
      if (!Falcon.isFalconObject(object)) {
        return this;
      }
      if (!(isString(event) && isFunction(callback))) {
        return this;
      }
      object.once(event, callback, this);
      if (this.__falcon_object__listeners__ == null) {
        this.__falcon_object__listeners__ = [];
      }
      this.__falcon_object__listeners__.push({
        object: object,
        event: event,
        callback: callback
      });
      return this;
    };

    FalconObject.prototype.stopListening = function(object, event, callback) {
      var listener, new_listeners, _callback, _event, _i, _len, _object, _ref, _ref1, _ref2, _ref3;
      if (isString(object)) {
        _ref = [object, event, null], event = _ref[0], callback = _ref[1], object = _ref[2];
      }
      if (isFunction(object)) {
        _ref1 = [object, null], callback = _ref1[0], object = _ref1[1];
      }
      if (isFunction(event)) {
        _ref2 = [event, null], callback = _ref2[0], event = _ref2[1];
      }
      _event = isString(event) ? event : null;
      _object = Falcon.isFalconObject(object) ? object : null;
      _callback = isFunction(callback) ? callback : null;
      if (this.__falcon_object__listeners__ == null) {
        this.__falcon_object__listeners__ = [];
      }
      new_listeners = [];
      _ref3 = this.__falcon_object__listeners__;
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        listener = _ref3[_i];
        object = listener.object, event = listener.event, callback = listener.callback;
        if ((_event != null) && event !== _event) {
          new_listeners.push(listener);
        } else if ((_object != null) && object !== _object) {
          new_listeners.push(listener);
        } else if ((_callback != null) && callback !== _callback) {
          new_listeners.push(listener);
        } else {
          object.off(event, callback, this);
        }
      }
      this.__falcon_object__listeners__ = new_listeners;
      return this;
    };

    return FalconObject;

  })();

  FalconDataAdapter = (function(_super) {
    var FalconDataAdapterOptions;

    __extends(FalconDataAdapter, _super);

    function FalconDataAdapter() {
      _ref = FalconDataAdapter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FalconDataAdapter.extend = FalconObject.extend;

    FalconDataAdapter.prototype.resolveRequestType = function(data_object, type, options, context) {
      if (!isString(type)) {
        return Falcon.GET;
      }
      type = trim(type).toUpperCase();
      if (__indexOf.call(Falcon.REQUEST_TYPES, type) < 0) {
        return Falcon.GET;
      }
      return type;
    };

    FalconDataAdapter.prototype.resolveContext = function(data_object, type, options, context) {
      var _ref1;
      return (_ref1 = context != null ? context : options.context) != null ? _ref1 : data_object;
    };

    FalconDataAdapterOptions = (function() {
      FalconDataAdapterOptions.prototype.id = void 0;

      FalconDataAdapterOptions.prototype.url = null;

      FalconDataAdapterOptions.prototype.data = null;

      FalconDataAdapterOptions.prototype.parent = void 0;

      FalconDataAdapterOptions.prototype.attributes = null;

      FalconDataAdapterOptions.prototype.fill_options = null;

      FalconDataAdapterOptions.prototype.success = (function() {});

      FalconDataAdapterOptions.prototype.complete = (function() {});

      FalconDataAdapterOptions.prototype.error = (function() {});

      function FalconDataAdapterOptions(options) {
        var key, value;
        if (isObject(options)) {
          for (key in options) {
            value = options[key];
            this[key] = value;
          }
        } else if (isFunction(options)) {
          this.complete = options;
        } else if (isString(options)) {
          this.attributes = trim(options).split(",");
        } else if (isArray(options)) {
          this.attributes = options;
        }
      }

      return FalconDataAdapterOptions;

    })();

    FalconDataAdapter.prototype.standardizeOptions = function(data_object, type, options, context) {
      if (options instanceof FalconDataAdapterOptions) {
        return options;
      }
      options = new FalconDataAdapterOptions(options);
      if (!(Falcon.isModel(options.parent) || options.parent === null)) {
        options.parent = data_object.parent;
      }
      options.url = this.resolveUrl(data_object, type, options, context);
      options.data = this.serializeData(data_object, type, options, context);
      return options;
    };

    FalconDataAdapter.prototype.resolveUrl = function(data_object, type, options, context) {
      var _ref1;
      return (_ref1 = options.url) != null ? _ref1 : data_object.makeUrl(type, options.parent);
    };

    FalconDataAdapter.prototype.makeBaseUrl = function(data_object, type, options, context) {
      var base_endpoint, base_endpoints, base_url, parent, period_index;
      parent = options.parent === void 0 ? data_object.parent : options.parent;
      base_endpoints = [];
      while (Falcon.isModel(parent)) {
        if (isFunction(parent.endpoint)) {
          base_endpoint = parent.endpoint(Falcon.GET, parent.parent);
        } else {
          base_endpoint = parent.endpoint;
        }
        if (!isString(base_endpoint)) {
          base_endpoint = "";
        }
        period_index = base_endpoint.lastIndexOf(".");
        if (period_index > -1) {
          base_endpoint = base_endpoint.slice(0, period_index);
        }
        base_endpoints.unshift(trimSlashes(base_endpoint) + "/" + parent.get('id'));
        parent = parent.parent;
      }
      base_url = "/" + base_endpoints.join("/") + "/";
      if (isString(Falcon.baseApiUrl)) {
        base_url = "" + Falcon.baseApiUrl + base_url;
      }
      return base_url.replace(/([^:])\/\/+/gi, "$1/").replace(/^\/\//gi, "/");
    };

    FalconDataAdapter.prototype.makeUrlComponents = function(data_object, type, options, context) {
      var base_url, endpoint, extension, id, period_index, slash_index, _ref1;
      type = this.resolveRequestType(data_object, type, options, context);
      base_url = this.makeBaseUrl(data_object, type, options, context);
      endpoint = isFunction(data_object.endpoint) ? data_object.endpoint(type, options.parent) : data_object.endpoint;
      endpoint = isString(endpoint) ? trimSlashes(endpoint) : "";
      extension = "";
      period_index = endpoint.lastIndexOf(".");
      slash_index = endpoint.lastIndexOf("/");
      if (period_index > slash_index) {
        extension = endpoint.slice(period_index);
        endpoint = endpoint.slice(0, period_index);
      }
      if (Falcon.isModel(data_object)) {
        id = "" + ((_ref1 = options.id) != null ? _ref1 : data_object.get('id'));
      } else {
        id = null;
      }
      return {
        base_url: base_url,
        endpoint: endpoint,
        id: id,
        extension: extension
      };
    };

    FalconDataAdapter.prototype.makeUrl = function(data_object, type, options, context) {
      var base_url, endpoint, extension, id, _ref1;
      _ref1 = this.makeUrlComponents(data_object, type, options, context), base_url = _ref1.base_url, endpoint = _ref1.endpoint, id = _ref1.id, extension = _ref1.extension;
      if (Falcon.isModel(data_object)) {
        if (type === Falcon.POST) {
          return "" + base_url + endpoint + extension;
        } else {
          return "" + base_url + endpoint + "/" + id + extension;
        }
      } else if (Falcon.isCollection(data_object)) {
        return "" + base_url + endpoint + extension;
      }
    };

    FalconDataAdapter.prototype.serializeData = function(data_object, type, options, context) {
      if ((options.data == null) && (type === Falcon.POST || type === Falcon.PUT)) {
        return data_object.serialize(options.attributes);
      } else {
        return options.data;
      }
    };

    FalconDataAdapter.prototype.parseRawResponseData = function(data_object, type, options, context, response_args) {
      return response_args;
    };

    FalconDataAdapter.prototype.successResponseHandler = function(data_object, type, options, context, response_args) {
      var parsed_data, raw_response_data;
      raw_response_data = this.parseRawResponseData(data_object, type, options, context, response_args);
      parsed_data = data_object.parse(raw_response_data, options);
      data_object.fill(parsed_data, options.fill_options);
      switch (type) {
        case Falcon.GET:
          data_object.trigger("fetch", parsed_data);
          break;
        case Falcon.POST:
          data_object.trigger("create", parsed_data);
          break;
        case Falcon.PUT:
          data_object.trigger("save", parsed_data);
          break;
        case Falcon.DELETE:
          data_object.trigger("destroy", parsed_data);
      }
      return options.success.call(context, data_object, raw_response_data, options, response_args);
    };

    FalconDataAdapter.prototype.errorResponseHandler = function(data_object, type, options, context, response_args) {
      var raw_response_data;
      raw_response_data = this.parseRawResponseData(data_object, type, options, context, response_args);
      return options.error.call(context, data_object, raw_response_data, options, response_args);
    };

    FalconDataAdapter.prototype.completeResponseHandler = function(data_object, type, options, context, response_args) {
      var raw_response_data;
      raw_response_data = this.parseRawResponseData(data_object, type, options, context, response_args);
      return options.complete.call(context, data_object, raw_response_data, options, response_args);
    };

    FalconDataAdapter.prototype.sync = function(data_object, type, options, context) {
      var is_valid;
      if (!Falcon.isDataObject(data_object)) {
        throw new Error("Expected data_object to be a Model or Collection");
      }
      is_valid = false;
      type = this.resolveRequestType(data_object, type, options, context);
      options = this.standardizeOptions(data_object, type, options, context);
      context = this.resolveContext(data_object, type, options, context);
      if (Falcon.isModel(data_object)) {
        if ((type === Falcon.POST || type === Falcon.PUT) && (!data_object.validate(options))) {
          return {
            data_object: data_object,
            type: type,
            options: options,
            context: context,
            is_valid: is_valid
          };
        }
      }
      is_valid = true;
      return {
        data_object: data_object,
        type: type,
        options: options,
        context: context,
        is_valid: is_valid
      };
    };

    return FalconDataAdapter;

  })(FalconObject);

  FalconTemplateAdapter = (function(_super) {
    __extends(FalconTemplateAdapter, _super);

    FalconTemplateAdapter.prototype.__falcon_templateAdapter__cache__ = null;

    FalconTemplateAdapter.extend = FalconObject.extend;

    function FalconTemplateAdapter() {
      this.__falcon_templateAdapter__cache__ = {};
      FalconTemplateAdapter.__super__.constructor.apply(this, arguments);
      document.createElement("template");
    }

    FalconTemplateAdapter.prototype.cacheTemplate = function(identifier, template) {
      if (!isString(identifier)) {
        throw new Error("identifier must be a string");
      }
      if (!isString(template)) {
        throw new Error("template must be a string");
      }
      this.__falcon_templateAdapter__cache__[identifier] = template;
      return this;
    };

    FalconTemplateAdapter.prototype.getCachedTemplate = function(identifier) {
      var _ref1;
      if (!isString(identifier)) {
        throw new Error("identifier must be a string");
      }
      return (_ref1 = this.__falcon_templateAdapter__cache__[identifier]) != null ? _ref1 : null;
    };

    FalconTemplateAdapter.prototype.resetCache = function() {
      this.__falcon_templateAdapter__cache__ = {};
      return this;
    };

    FalconTemplateAdapter.prototype.cacheAllTemplates = function() {
      var identifier, template, templates, _i, _len, _ref1;
      templates = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = document.getElementsByTagName("template");
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          template = _ref1[_i];
          _results.push(template);
        }
        return _results;
      })();
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        identifier = template.getAttribute("id");
        if (identifier != null) {
          Falcon.templateAdapter.cacheTemplate("#" + identifier, template.innerHTML);
        }
        if ((_ref1 = template.parentNode) != null) {
          _ref1.removeChild(template);
        }
      }
      return this;
    };

    FalconTemplateAdapter.prototype.resolveTemplate = function(view, callback) {
      var template, url;
      if (!Falcon.isView(view)) {
        throw new Error("view must be a Falcon.View");
      }
      if (!isFunction(callback)) {
        throw new Error("callback must be a function");
      }
      if (isString(view.template)) {
        callback(view.template);
        return this;
      }
      url = view.makeUrl();
      if (isEmpty(url)) {
        callback("");
      } else if ((template = this.getCachedTemplate(url))) {
        callback(template);
      } else {
        this.loadTemplate(url, callback);
      }
      return this;
    };

    FalconTemplateAdapter.prototype.loadTemplate = function(url, callback) {
      var _this = this;
      if (!isString(url)) {
        throw new Error("url must be a String");
      }
      if (!isFunction(callback)) {
        throw new Error("callback must be a function");
      }
      Falcon.ready(function() {
        var element, template;
        element = document.getElementById(url.slice(1));
        template = element != null ? element.innerHTML : "";
        if (!isString(template)) {
          template = "";
        }
        _this.cacheTemplate(url, template);
        return callback(template);
      });
      return this;
    };

    FalconTemplateAdapter.prototype.makeUrl = function(view) {
      var endpoint, url;
      if (!Falcon.isView(view)) {
        throw new Error("view must be an instanceof Falcon.View");
      }
      endpoint = ko.unwrap(view.endpoint);
      if (isFunction(endpoint)) {
        endpoint = endpoint.call(view);
      }
      endpoint = isString(endpoint) ? trim(endpoint) : "";
      if (isEmpty(endpoint)) {
        return endpoint;
      }
      if (endpoint.charAt(0) === '#') {
        return endpoint;
      }
      url = endpoint.charAt(0) === "/" ? endpoint : "/" + endpoint;
      if (isString(Falcon.baseTemplateUrl)) {
        url = "" + Falcon.baseTemplateUrl + url;
      }
      url = url.replace(/([^:])\/\/+/gi, "$1/");
      return url;
    };

    return FalconTemplateAdapter;

  })(FalconObject);

  FalconModel = (function(_super) {
    __extends(FalconModel, _super);

    FalconModel.extend = FalconObject.extend;

    FalconModel.prototype.id = null;

    FalconModel.prototype.endpoint = null;

    FalconModel.prototype.parent = null;

    FalconModel.prototype.__falcon_model__is_null__ = false;

    function FalconModel(data, parent) {
      var _ref1, _ref2;
      FalconModel.__super__.constructor.apply(this, arguments);
      data = ko.unwrap(data);
      parent = ko.unwrap(parent);
      if ((parent != null) && !Falcon.isModel(parent) && Falcon.isModel(data)) {
        _ref1 = [data, parent], parent = _ref1[0], data = _ref1[1];
      }
      if ((parent == null) && Falcon.isModel(data)) {
        _ref2 = [data, parent], parent = _ref2[0], data = _ref2[1];
      }
      if (!((parent == null) || Falcon.isModel(parent))) {
        throw new Error("parent must be null or a Falcon.Model");
      }
      this.__falcon_model__is_null__ = ko.observable(false);
      this.parent = parent;
      this.initialize.apply(this, arguments);
      if (!isEmpty(data)) {
        this.fill(data);
      }
      return this;
    }

    FalconModel.prototype.initialize = (function(data) {});

    FalconModel.prototype.get = function(attribute) {
      if (!isString(attribute)) {
        return void 0;
      }
      return ko.unwrap(this[attribute]);
    };

    FalconModel.prototype.set = function(attribute, value) {
      var k, v;
      if (isObject(attribute)) {
        for (k in attribute) {
          v = attribute[k];
          this.set(k, v);
        }
        return this;
      }
      if (!isString(attribute)) {
        return this;
      }
      if (ko.isObservable(this[attribute])) {
        this[attribute](value);
      } else {
        this[attribute] = value;
      }
      return this;
    };

    FalconModel.prototype.toggle = function(attribute) {
      return this.set(attribute, !this.get(attribute));
    };

    FalconModel.prototype.increment = function(attribute) {
      this.set(attribute, this.get(attribute) + 1);
      return this;
    };

    FalconModel.prototype.decrement = function(attribute) {
      this.set(attribute, this.get(attribute) - 1);
      return this;
    };

    FalconModel.prototype.parse = function(data, options) {
      return data;
    };

    FalconModel.prototype.fill = function(data) {
      var attr, rejectedAttributes, value, _ref1;
      this.__falcon_model__is_null__(data === null);
      if (isNumber(data) || isString(data)) {
        data = {
          'id': data
        };
      }
      if (!isObject(data)) {
        return this;
      }
      if (isEmpty(data)) {
        return this;
      }
      rejectedAttributes = {};
      _ref1 = Falcon.Model.prototype;
      for (attr in _ref1) {
        value = _ref1[attr];
        if (attr !== "id" && attr !== "endpoint") {
          rejectedAttributes[attr] = true;
        }
      }
      for (attr in data) {
        value = data[attr];
        if (!(!rejectedAttributes[attr])) {
          continue;
        }
        value = ko.unwrap(value);
        if (Falcon.isModel(this[attr])) {
          if (Falcon.isModel(value)) {
            this[attr] = value;
          } else {
            this[attr].fill(value);
          }
        } else if (Falcon.isCollection(this[attr])) {
          if (Falcon.isCollection(value)) {
            this[attr] = value;
          } else {
            this[attr].fill(value);
          }
        } else if (ko.isWriteableObservable(this[attr])) {
          this[attr](value);
        } else if (!isFunction(this[attr])) {
          this[attr] = value;
        } else if (attr === 'endpoint') {
          this[attr] = value;
        }
      }
      return this;
    };

    FalconModel.prototype.unwrap = function() {
      var attr, unwrapped, value;
      unwrapped = {};
      for (attr in this) {
        value = this[attr];
        if (attr === "id" || !(attr in Falcon.Model.prototype)) {
          unwrapped[attr] = Falcon.isDataObject(value) ? value.unwrap() : value;
        }
      }
      return unwrapped;
    };

    FalconModel.prototype.serialize = function(attributes) {
      var attr, new_attributes, serialized, sub_attributes, value, _i, _len;
      serialized = {};
      if (attributes == null) {
        attributes = (function() {
          var _results;
          _results = [];
          for (attr in this) {
            if (attr === "id" || !(attr in Falcon.Model.prototype)) {
              _results.push(attr);
            }
          }
          return _results;
        }).call(this);
      } else if (isString(attributes)) {
        attributes = trim(attributes).split(",");
      }
      if (isArray(attributes)) {
        new_attributes = {};
        for (_i = 0, _len = attributes.length; _i < _len; _i++) {
          attr = attributes[_i];
          new_attributes[attr] = null;
        }
        attributes = new_attributes;
      }
      if (!isObject(attributes)) {
        return serialized;
      }
      for (attr in attributes) {
        sub_attributes = attributes[attr];
        value = this[attr];
        if (Falcon.isDataObject(value)) {
          serialized[attr] = value.serialize(sub_attributes);
        } else if (ko.isObservable(value)) {
          serialized[attr] = ko.unwrap(value);
        } else if (!isFunction(value)) {
          serialized[attr] = value;
        }
      }
      return serialized;
    };

    FalconModel.prototype.makeUrl = function(type, parent, id) {
      var _ref1;
      if (id === void 0 && (isString(parent) || isNumber(parent))) {
        _ref1 = [id, parent], parent = _ref1[0], id = _ref1[1];
      }
      return Falcon.dataAdapter.makeUrl(this, type, {
        parent: parent,
        id: id
      }, this);
    };

    FalconModel.prototype.validate = function(options) {
      return true;
    };

    FalconModel.prototype.sync = function(type, options, context) {
      return Falcon.dataAdapter.sync(this, type, options, context);
    };

    FalconModel.prototype.fetch = function(options, context) {
      return this.sync(Falcon.GET, options, context);
    };

    FalconModel.prototype.create = function(options, context) {
      return this.sync(Falcon.POST, options, context);
    };

    FalconModel.prototype.save = function(options, context) {
      if (this.isNew()) {
        return this.create(options, context);
      } else {
        return this.sync(Falcon.PUT, options, context);
      }
    };

    FalconModel.prototype.destroy = function(options, context) {
      return this.sync(Falcon.DELETE, options, context);
    };

    FalconModel.prototype.equals = function(model) {
      var id, other_id;
      model = ko.unwrap(model);
      if (Falcon.isModel(model)) {
        id = this.get("id");
        other_id = model.get("id");
        if ((id != null) && (other_id != null)) {
          return model.get("id") === this.get("id");
        }
        return model === this;
      } else if (isNumber(model) || isString(model)) {
        return model === this.get("id");
      }
      return false;
    };

    FalconModel.prototype.mixin = function(mapping) {
      var key, value, _ref1;
      if (!isObject(mapping)) {
        mapping = {};
      }
      for (key in mapping) {
        value = mapping[key];
        if (Falcon.isDataObject(this[key])) {
          this[key].mixin(value);
        } else {
          if (ko.isObservable(value)) {
            if (!ko.isObservable(this[key])) {
              this[key] = ko.observable((_ref1 = this.get(key)) != null ? _ref1 : ko.unwrap(value));
            }
          } else if (isFunction(value)) {
            this[key] = bindFunction(value, this);
          } else {
            if (this[key] == null) {
              this[key] = value;
            }
          }
        }
      }
      return this;
    };

    FalconModel.prototype.clone = function(attributes, parent) {
      var _ref1;
      if (attributes === null || Falcon.isModel(attributes)) {
        _ref1 = [void 0, attributes], attributes = _ref1[0], parent = _ref1[1];
      }
      if (!(parent === null || Falcon.isModel(parent))) {
        parent = this.parent;
      }
      return new this.constructor(this.serialize(attributes), parent);
    };

    FalconModel.prototype.isNew = function() {
      return this.get("id") == null;
    };

    FalconModel.prototype.isNull = function() {
      return this.__falcon_model__is_null__();
    };

    return FalconModel;

  })(FalconObject);

  FalconCollection = (function(_super) {
    var FalconChainedCollection, _fill_addMixins, _fill_createModels, _fill_standardizeItems, _fill_standardizeOptions, _fill_updateModels, _makeIterator, _ref1;

    __extends(FalconCollection, _super);

    FalconCollection.extend = FalconObject.extend;

    _makeIterator = function(iterator) {
      var _id, _model, _model_id;
      iterator = ko.unwrap(iterator);
      if (Falcon.isCollection(iterator)) {
        iterator = iterator.models();
      }
      if (Falcon.isModel(iterator)) {
        _model = iterator;
        _model_id = _model.get('id');
        if (_model_id != null) {
          return function(item) {
            var id, model_id;
            if (!Falcon.isModel(item)) {
              return false;
            }
            id = item.get('id');
            model_id = _model.get('id');
            return id === model_id;
          };
        } else {
          return function(item) {
            if (!Falcon.isModel(item)) {
              return false;
            }
            return item === _model;
          };
        }
      }
      if (isNumber(iterator) || isString(iterator)) {
        _id = iterator;
        return function(model) {
          if (!Falcon.isModel(model)) {
            return false;
          }
          return model.get("id") === _id;
        };
      } else if (isArray(iterator)) {
        return function(model) {
          return __indexOf.call(iterator, model) >= 0;
        };
      }
      return iterator;
    };

    FalconCollection.prototype.__falcon_collection__mixins__ = null;

    FalconCollection.prototype.models = null;

    FalconCollection.prototype.model = null;

    FalconCollection.prototype.endpoint = null;

    FalconCollection.prototype.length = 0;

    FalconCollection.prototype.parent = null;

    FalconCollection.prototype.comparator = null;

    function FalconCollection(models, parent) {
      var _ref1, _ref2,
        _this = this;
      FalconCollection.__super__.constructor.apply(this, arguments);
      models = ko.unwrap(models);
      parent = ko.unwrap(parent);
      if ((parent == null) && Falcon.isModel(models)) {
        _ref1 = [models, parent], parent = _ref1[0], models = _ref1[1];
      }
      if (Falcon.isModel(models) && isArray(parent)) {
        _ref2 = [models, parent], parent = _ref2[0], models = _ref2[1];
      }
      if (!((parent == null) || Falcon.isModel(parent))) {
        throw new Error("parent must be null or a Falcon.Model");
      }
      if (this.model != null) {
        if (this.endpoint == null) {
          this.endpoint = this.model.prototype.endpoint;
        }
      }
      this.length = ko.computed({
        deferEvaluation: Falcon.deferEvaluation,
        read: function() {
          return _this.models().length;
        }
      });
      this.parent = parent;
      this.__falcon_collection__mixins__ = [];
      this.models = ko.observableArray([]);
      this.initialize.apply(this, arguments);
      if (!isEmpty(models)) {
        this.replace(models);
      }
      return this;
    }

    FalconCollection.prototype.initialize = (function(models, parent) {});

    FalconCollection.prototype.set = function(attribute, value) {
      this.each(function(model) {
        return model.set(attribute, value);
      });
      return this;
    };

    FalconCollection.prototype.parse = function(data, options) {
      return data;
    };

    FalconCollection.prototype.unwrap = function() {
      var i, raw, value, _ref1;
      raw = [];
      _ref1 = this.models();
      for (i in _ref1) {
        value = _ref1[i];
        raw[i] = Falcon.isDataObject(value) ? value.unwrap() : value;
      }
      return raw;
    };

    FalconCollection.prototype.serialize = function(attributes) {
      var i, serialized, value, _ref1;
      serialized = [];
      _ref1 = this.models();
      for (i in _ref1) {
        value = _ref1[i];
        serialized[i] = Falcon.isDataObject(value) ? value.serialize(attributes) : value;
      }
      return serialized;
    };

    FalconCollection.prototype.makeUrl = function(type, parent) {
      return Falcon.dataAdapter.makeUrl(this, type, {
        parent: parent
      }, this);
    };

    FalconCollection.prototype.sync = function(type, options, context) {
      return Falcon.dataAdapter.sync(this, type, options, context);
    };

    FalconCollection.prototype.fetch = function(options, context) {
      return this.sync(Falcon.GET, options, context);
    };

    FalconCollection.prototype.create = function(data, options, context) {
      var model, output_options,
        _this = this;
      if (this.model == null) {
        return null;
      }
      if (!(isObject(data) || Falcon.isModel(data))) {
        data = {};
      }
      model = Falcon.isModel(data) ? data : new this.model(data, this.parent);
      if (context == null) {
        context = model;
      }
      output_options = Falcon.dataAdapter.standardizeOptions(model, Falcon.POST, options, context);
      if (output_options.fill_options == null) {
        output_options.fill_options = {
          method: 'append'
        };
      }
      output_options.success = function(model) {
        _this.fill(model, output_options.fill_options);
        if (isFunction(options.success)) {
          return options.success.apply(context, arguments);
        }
      };
      return model.create(output_options, context);
    };

    FalconCollection.prototype.destroy = function(model, options, context) {
      var output_options,
        _this = this;
      if (this.model == null) {
        return null;
      }
      model = this.first(ko.unwrap(model));
      if (!Falcon.isModel(model)) {
        return null;
      }
      if (context == null) {
        context = model;
      }
      output_options = Falcon.dataAdapter.standardizeOptions(model, Falcon.DELETE, options, context);
      output_options.success = function(model) {
        _this.remove(model);
        if (isFunction(options.success)) {
          return options.success.apply(context, arguments);
        }
      };
      return model.destroy(output_options, context);
    };

    FalconCollection.prototype.remove = function(items) {
      var removedItems;
      items = ko.unwrap(items);
      if (Falcon.isCollection(items)) {
        items = items.models();
      }
      removedItems = isArray(items) ? this.models.removeAll(items) : this.models.remove(_makeIterator(items));
      return this;
    };

    _fill_standardizeItems = function(collection, items) {
      if (ko.isObservable(items)) {
        items = ko.unwrap(items);
      }
      if (items == null) {
        items = [];
      }
      if (Falcon.isCollection(items)) {
        items = items.all();
      }
      if (!isArray(items)) {
        items = [items];
      }
      items = items.slice(0);
      return items;
    };

    _fill_createModels = function(collection, items) {
      var i, item, _i, _len;
      for (i = _i = 0, _len = items.length; _i < _len; i = ++_i) {
        item = items[i];
        if (isObject(item) && !Falcon.isModel(item)) {
          items[i] = new collection.model(item, collection.parent);
        }
      }
      return items;
    };

    _fill_addMixins = function(collection, added_models) {
      var added_model, mapping, _i, _j, _len, _len1, _ref1;
      for (_i = 0, _len = added_models.length; _i < _len; _i++) {
        added_model = added_models[_i];
        _ref1 = collection.__falcon_collection__mixins__;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          mapping = _ref1[_j];
          added_model.mixin(mapping);
        }
      }
      return added_models;
    };

    _fill_standardizeOptions = function(collection, options) {
      var key, output_options, value, _ref1;
      if (!isObject(options)) {
        options = {};
      }
      output_options = {};
      for (key in options) {
        value = options[key];
        output_options[key] = value;
      }
      if (output_options.comparator == null) {
        output_options.comparator = collection.comparator;
      }
      if (!isString(output_options.method)) {
        output_options.method = 'replace';
      }
      output_options.method = trim(output_options.method.toLowerCase());
      if ((_ref1 = output_options.method) !== 'replace' && _ref1 !== 'append' && _ref1 !== 'prepend' && _ref1 !== 'insert' && _ref1 !== 'merge') {
        output_options.method = 'replace';
      }
      return output_options;
    };

    _fill_updateModels = function(collection, new_models_list, options) {
      if (isFunction(options.comparator)) {
        new_models_list.sort(options.comparator);
      }
      return collection.models(new_models_list);
    };

    FalconCollection.prototype.fill = function(items, options) {
      options = _fill_standardizeOptions(this, options);
      return this[options.method](items, options);
    };

    FalconCollection.prototype.replace = function(items, options) {
      if (this.model == null) {
        return [];
      }
      options = _fill_standardizeOptions(this, options);
      items = _fill_standardizeItems(this, items);
      items = _fill_createModels(this, items);
      _fill_addMixins(this, items);
      _fill_updateModels(this, items, options);
      return items;
    };

    FalconCollection.prototype.append = function(items, options) {
      if (this.model == null) {
        return [];
      }
      options = _fill_standardizeOptions(this, options);
      items = _fill_standardizeItems(this, items);
      items = _fill_createModels(this, items);
      _fill_addMixins(this, items, options);
      _fill_updateModels(this, this.models().concat(items), options);
      return items;
    };

    FalconCollection.prototype.prepend = function(items, options) {
      if (this.model == null) {
        return [];
      }
      options = _fill_standardizeOptions(this, options);
      items = _fill_standardizeItems(this, items);
      items = _fill_createModels(this, items);
      _fill_addMixins(this, items, options);
      _fill_updateModels(this, items.concat(this.models()), options);
      return items;
    };

    FalconCollection.prototype.insert = function(items, options) {
      var head, insert_index, new_models_list, tail, _ref1, _ref2;
      if (isFunction(options)) {
        options = {
          iterator: options
        };
      }
      if (isNumber(options) || isString(options) || Falcon.isModel(options)) {
        options = {
          model: options
        };
      }
      options = _fill_standardizeOptions(this, options);
      items = _fill_standardizeItems(this, items);
      items = _fill_createModels(this, items);
      _fill_addMixins(this, items, options);
      insert_index = (_ref1 = options.index) != null ? _ref1 : this.indexOf(_makeIterator((_ref2 = options.iterator) != null ? _ref2 : options.model));
      new_models_list = this.models();
      if (insert_index < 0 || insert_index >= new_models_list.length) {
        new_models_list = new_models_list.concat(items);
      } else {
        head = new_models_list.slice(0, insert_index);
        tail = new_models_list.slice(insert_index);
        new_models_list = head.concat(items, tail);
      }
      _fill_updateModels(this, new_models_list, options);
      return items;
    };

    FalconCollection.prototype.merge = function(items, options) {
      var added_models, existing_model, item, iterator, m, new_model, new_models_list, _i, _j, _k, _len, _len1, _len2;
      if (this.model == null) {
        return [];
      }
      options = _fill_standardizeOptions(this, options);
      items = _fill_standardizeItems(this, items);
      added_models = [];
      new_models_list = this.models();
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        existing_model = null;
        if (Falcon.isModel(item)) {
          iterator = _makeIterator(item);
          for (_j = 0, _len1 = new_models_list.length; _j < _len1; _j++) {
            m = new_models_list[_j];
            if (!(iterator(m))) {
              continue;
            }
            existing_model = m;
            break;
          }
          if (Falcon.isModel(existing_model)) {
            existing_model.fill(item.unwrap());
          } else {
            new_models_list.push(item);
            added_models.push(item);
          }
        } else if (isObject(item)) {
          iterator = _makeIterator(item.id);
          for (_k = 0, _len2 = new_models_list.length; _k < _len2; _k++) {
            m = new_models_list[_k];
            if (!(iterator(m))) {
              continue;
            }
            existing_model = m;
            break;
          }
          if (Falcon.isModel(existing_model)) {
            existing_model.fill(item);
          } else {
            new_model = new this.model(item, this.parent);
            new_models_list.push(new_model);
            added_models.push(new_model);
          }
        }
      }
      _fill_addMixins(this, added_models);
      _fill_updateModels(this, new_models_list, options);
      return added_models;
    };

    FalconCollection.prototype.unshift = function() {
      return this.prepend.apply(this, arguments);
    };

    FalconCollection.prototype.shift = function() {
      var item;
      item = this.models.shift();
      return item;
    };

    FalconCollection.prototype.push = function() {
      return this.append.apply(this, arguments);
    };

    FalconCollection.prototype.pop = function() {
      var item;
      item = this.models.pop();
      return item;
    };

    FalconCollection.prototype.sort = function(comparator) {
      if (comparator == null) {
        comparator = this.comparator;
      }
      if (!isFunction(comparator)) {
        return this;
      }
      this.models.sort(comparator);
      return this;
    };

    FalconCollection.prototype.at = function(index) {
      var models;
      index = parseInt(index);
      if (isNaN(index)) {
        return null;
      }
      models = this.models();
      if (index < 0 || index >= models.length) {
        return null;
      }
      return models[index];
    };

    FalconCollection.prototype.indexOf = function(model) {
      var index, iterator, _i, _len, _ref1;
      if (Falcon.isModel(model)) {
        return this.models.indexOf(model);
      }
      iterator = _makeIterator(model);
      if (!isFunction(iterator)) {
        return -1;
      }
      _ref1 = this.models();
      for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
        model = _ref1[index];
        if (iterator(model)) {
          return index;
        }
      }
      return -1;
    };

    FalconCollection.prototype.lastIndexOf = function(model) {
      var i, index, iterator, length, models, _i, _len;
      iterator = _makeIterator(model);
      if (!isFunction(iterator)) {
        return -1;
      }
      models = this.models();
      length = models.length;
      for (i = _i = 0, _len = models.length; _i < _len; i = ++_i) {
        model = models[i];
        index = length - i - 1;
        if (iterator(models[index])) {
          return index;
        }
      }
      return -1;
    };

    FalconCollection.prototype.each = function(iterator, context) {
      var index, item, _i, _j, _len, _len1, _ref1, _ref2;
      if (!isFunction(iterator)) {
        return this;
      }
      if (context == null) {
        context = this;
      }
      if (iterator.length === 1) {
        _ref1 = this.models();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          iterator.call(context, item);
        }
      } else {
        _ref2 = this.models();
        for (index = _j = 0, _len1 = _ref2.length; _j < _len1; index = ++_j) {
          item = _ref2[index];
          iterator.call(context, index, item);
        }
      }
      return this;
    };

    FalconCollection.prototype.first = function(iterator) {
      var item, _i, _len, _ref1;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        iterator = (function() {
          return true;
        });
      }
      _ref1 = this.models();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if (iterator(item)) {
          return item;
        }
      }
      return null;
    };

    FalconCollection.prototype.last = function(iterator) {
      var index, item, length, models, _i, _len;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        iterator = (function() {
          return true;
        });
      }
      models = this.models();
      length = models.length;
      for (index = _i = 0, _len = models.length; _i < _len; index = ++_i) {
        item = models[index];
        item = models[length - index - 1];
        if (iterator(item)) {
          return item;
        }
      }
      return null;
    };

    FalconCollection.prototype.all = function() {
      return this.models();
    };

    FalconCollection.prototype.filter = function(iterator) {
      var item;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        return this.models();
      }
      return (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.models();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (iterator(item)) {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
    };

    FalconCollection.prototype.any = function(iterator) {
      var item, _i, _len, _ref1;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        return false;
      }
      _ref1 = this.models();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        if (iterator(item)) {
          return true;
        }
      }
      return false;
    };

    FalconCollection.prototype.without = function(iterator) {
      var item;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        return this.models();
      }
      return (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.models();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (!iterator(item)) {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
    };

    FalconCollection.prototype.pluck = function(attribute, unwrap) {
      var model, models, plucked_values, _i, _len;
      if (!isString(attribute)) {
        attribute = "";
      }
      if (!isBoolean(unwrap)) {
        unwrap = true;
      }
      plucked_values = [];
      models = this.models();
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        if (model != null) {
          plucked_values.push(unwrap ? ko.unwrap(model[attribute]) : model[attribute]);
        } else {
          plucked_values.push(void 0);
        }
      }
      return plucked_values;
    };

    FalconCollection.prototype.slice = function(start, end) {
      if (end != null) {
        return this.models.slice(start, end);
      } else {
        return this.models.slice(start);
      }
    };

    FalconChainedCollection = (function(_super1) {
      __extends(FalconChainedCollection, _super1);

      function FalconChainedCollection() {
        _ref1 = FalconChainedCollection.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      FalconChainedCollection.prototype.slice = function() {
        this.models(FalconChainedCollection.__super__.slice.apply(this, arguments));
        return this;
      };

      FalconChainedCollection.prototype.filter = function() {
        this.models(FalconChainedCollection.__super__.filter.apply(this, arguments));
        return this;
      };

      FalconChainedCollection.prototype.without = function() {
        this.models(FalconChainedCollection.__super__.without.apply(this, arguments));
        return this;
      };

      return FalconChainedCollection;

    })(FalconCollection);

    FalconCollection.prototype.chain = function() {
      var chainedCollection;
      chainedCollection = new FalconChainedCollection();
      chainedCollection.model = this.model;
      chainedCollection.fill(this.models());
      return chainedCollection;
    };

    FalconCollection.prototype.mixin = function(mapping) {
      var model, _i, _len, _ref2;
      if (!isObject(mapping)) {
        return this;
      }
      _ref2 = this.models();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        model = _ref2[_i];
        if (Falcon.isDataObject(model)) {
          model.mixin(mapping);
        }
      }
      this.__falcon_collection__mixins__.push(mapping);
      return this;
    };

    FalconCollection.prototype.clone = function(attributes, parent) {
      var _ref2;
      if (attributes === null || Falcon.isModel(attributes)) {
        _ref2 = [void 0, attributes], attributes = _ref2[0], parent = _ref2[1];
      }
      if (!(parent === null || Falcon.isModel(parent))) {
        parent = this.parent;
      }
      return new this.constructor(this.serialize(attributes), parent);
    };

    FalconCollection.prototype.reset = function() {
      this.models([]);
      return this;
    };

    FalconCollection.prototype.subscribe = function(callback, context, event) {
      return this.models.subscribe(callback, context, event);
    };

    return FalconCollection;

  })(FalconObject);

  FalconView = (function(_super) {
    __extends(FalconView, _super);

    FalconView.extend = FalconObject.extend;

    FalconView.prototype.endpoint = null;

    FalconView.prototype.template = null;

    FalconView.prototype.__falcon_view__loaded_template__ = null;

    FalconView.prototype.__falcon_view__is_rendered__ = false;

    function FalconView() {
      var _this = this;
      FalconView.__super__.constructor.apply(this, arguments);
      this.__falcon_view__loaded_template__ = ko.observable();
      this.__falcon_view__is_rendered__ = false;
      this.initialize.apply(this, arguments);
      Falcon.templateAdapter.resolveTemplate(this, function(template) {
        _this.template = template;
        return _this.__falcon_view__loaded_template__(template);
      });
    }

    FalconView.prototype.initialize = (function() {});

    FalconView.prototype.makeUrl = function() {
      return Falcon.templateAdapter.makeUrl(this);
    };

    FalconView.prototype._render = function() {
      if (this.__falcon_view__is_rendered__) {
        return;
      }
      this.__falcon_view__is_rendered__ = true;
      this.display.apply(this, arguments);
    };

    FalconView.prototype._unrender = function() {
      if (!this.__falcon_view__is_rendered__) {
        return;
      }
      this.__falcon_view__is_rendered__ = false;
      this.dispose.apply(this, arguments);
    };

    FalconView.prototype.initialize = (function() {});

    FalconView.prototype.display = (function() {});

    FalconView.prototype.dispose = (function() {});

    FalconView.__falcon_view__cachedViewModel__ = null;

    FalconView.prototype.createViewModel = function() {
      var key, value, viewModel;
      if (this.__falcon_view__cachedViewModel__ != null) {
        return this.__falcon_view__cachedViewModel__;
      }
      viewModel = {};
      for (key in this) {
        value = this[key];
        if (!(!(key in Falcon.View.prototype))) {
          continue;
        }
        if (isFunction(value) && !ko.isObservable(value)) {
          value = bindFunction(value, this);
        }
        viewModel[key] = value;
      }
      return (this.__falcon_view__cachedViewModel__ = viewModel);
    };

    return FalconView;

  })(FalconObject);

  this.Falcon = Falcon = new ((function(_super) {
    __extends(_Class, _super);

    function _Class() {
      _ref1 = _Class.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    _Class.prototype.GET = 'GET';

    _Class.prototype.POST = 'POST';

    _Class.prototype.PUT = 'PUT';

    _Class.prototype.DELETE = 'DELETE';

    _Class.prototype.REQUEST_TYPES = ['GET', 'POST', 'PUT', 'DELETE'];

    _Class.prototype['Object'] = FalconObject;

    _Class.prototype['Model'] = FalconModel;

    _Class.prototype['Collection'] = FalconCollection;

    _Class.prototype['View'] = FalconView;

    _Class.prototype['DataAdapter'] = FalconDataAdapter;

    _Class.prototype['TemplateAdapter'] = FalconTemplateAdapter;

    _Class.prototype.version = "1.0.0rc1";

    _Class.prototype.applicationElement = "body";

    _Class.prototype.baseApiUrl = "";

    _Class.prototype.baseTemplateUrl = "";

    _Class.prototype.deferEvaluation = true;

    _Class.prototype.dataAdapter = new FalconDataAdapter;

    _Class.prototype.templateAdapter = new FalconTemplateAdapter;

    _Class.prototype.ready = (function() {
      var original_onreadystatechange, _DOMContentLoaded, _domLoadedEvent, _ready, _ready_callbacks;
      _ready_callbacks = [];
      _ready = function(callback) {
        if (isFunction(callback)) {
          return _ready_callbacks.push(callback);
        }
      };
      _domLoadedEvent = function() {
        var callback, _i, _len;
        _ready = function(callback) {
          if (isFunction(callback)) {
            return callback();
          }
        };
        for (_i = 0, _len = _ready_callbacks.length; _i < _len; _i++) {
          callback = _ready_callbacks[_i];
          callback();
        }
        return _ready_callbacks = null;
      };
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", _DOMContentLoaded = function() {
          _domLoadedEvent();
          return document.removeEventListener("DOMContentLoaded", _DOMContentLoaded);
        });
      } else {
        original_onreadystatechange = document.onreadystatechange;
        document.onreadystatechange = function() {
          if (document.readyState === "complete") {
            _domLoadedEvent();
            document.onreadystatechange = original_onreadystatechange;
          }
          if (isFunction(original_onreadystatechange)) {
            return original_onreadystatechange.apply(this, arguments);
          }
        };
      }
      return function() {
        return _ready.apply(null, arguments);
      };
    })();

    _Class.prototype.apply = function(root, element, callback) {
      var _ref2, _ref3;
      if (isFunction(element)) {
        _ref2 = [element, null], callback = _ref2[0], element = _ref2[1];
      }
      if (isFunction(root) && !ko.isObservable(root) && !isFunction(callback)) {
        _ref3 = [root, null], callback = _ref3[0], root = _ref3[1];
      }
      if (element == null) {
        element = Falcon.applicationElement;
      }
      Falcon.ready(function() {
        var _ref4;
        Falcon.templateAdapter.cacheAllTemplates();
        if (!isElement(element)) {
          if (!isString(element)) {
            element = "";
          }
          element = isEmpty(element) ? "body" : trim(element);
          element = (_ref4 = document.querySelectorAll(element)[0]) != null ? _ref4 : document.body;
        }
        if (root != null) {
          ko.applyBindingAccessorsToNode(element, {
            view: function() {
              return root;
            }
          });
        } else {
          ko.applyBindings({}, element);
        }
        if (isFunction(callback)) {
          return callback();
        }
      });
      return Falcon;
    };

    _Class.prototype.isModel = function(object) {
      return (object != null) && object instanceof Falcon.Model;
    };

    _Class.prototype.isCollection = function(object) {
      return (object != null) && object instanceof Falcon.Collection;
    };

    _Class.prototype.isView = function(object) {
      return (object != null) && object instanceof Falcon.View;
    };

    _Class.prototype.isDataObject = function(object) {
      return (object != null) && (object instanceof Falcon.Model || object instanceof Falcon.Collection);
    };

    _Class.prototype.isAdapter = function(object) {
      return (object != null) && object instanceof Falcon.DataAdapter;
    };

    _Class.prototype.isFalconObject = function(object) {
      return (object != null) && (object instanceof Falcon.Object);
    };

    _Class.prototype.addBinding = function(name, definition, allowVirtual) {
      var _ref2;
      if (isBoolean(definition)) {
        _ref2 = [allowVirtual, definition], definition = _ref2[0], allowVirtual = _ref2[1];
      }
      if (isFunction(definition)) {
        definition = {
          update: definition
        };
      }
      ko.bindingHandlers[name] = definition;
      if (allowVirtual) {
        ko.virtualElements.allowedBindings[name] = true;
      }
      return ko.bindingHandlers[name];
    };

    _Class.prototype.getBinding = function(name) {
      return ko.bindingHandlers[name];
    };

    _Class.prototype.addComponent = function(tag_name, view_defintion) {
      return ko.components.register(tag_name, view_defintion);
    };

    _Class.prototype.onDispose = function(element, callback) {
      return ko.utils.domNodeDisposal.addDisposeCallback(element, callback);
    };

    return _Class;

  })(FalconObject));

  ko.components.loaders.unshift({
    loadComponent: function(tag_name, view_definition, callback) {
      if (Falcon.isView(view_definition.prototype)) {
        Falcon.templateAdapter.resolveTemplate(view_definition.prototype, function(template) {
          var element;
          element = document.createElement('div');
          element.innerHTML = template;
          return callback({
            template: element.childNodes,
            createViewModel: function(params) {
              var view;
              view = new view_definition(params);
              params['__falcon_component_view__'] = view;
              view._render();
              return view.createViewModel();
            }
          });
        });
      } else {
        callback(null);
      }
    }
  });

  Falcon.addBinding('view', true, (function() {
    var _runUnobserved, _standardizeOptions, _tryUnrender;
    _standardizeOptions = function(valueAccessor) {
      var options;
      options = valueAccessor();
      if (Falcon.isView(options) || ko.isObservable(options)) {
        options = {
          data: options
        };
      }
      if (!isObject(options)) {
        options = {};
      }
      if (options['data'] == null) {
        options['data'] = null;
      }
      if (options['displayIf'] == null) {
        options['displayIf'] = true;
      }
      if (options['afterDisplay'] == null) {
        options['afterDisplay'] = null;
      }
      if (options['beforeDispose'] == null) {
        options['beforeDispose'] = null;
      }
      return options;
    };
    _runUnobserved = function(callback, context) {
      var computed;
      computed = ko.computed(function() {
        return callback.call(context != null ? context : this);
      });
      computed.peek();
      return computed.dispose();
    };
    _tryUnrender = function(view) {
      if (!Falcon.isView(view)) {
        return;
      }
      if (!view.__falcon_view__is_rendered__) {
        return;
      }
      return _runUnobserved(view._unrender, view);
    };
    return {
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var anonymous_template, container, continuation, is_displayed, is_disposing, oldView, view;
        view = null;
        oldView = null;
        is_displayed = false;
        is_disposing = false;
        continuation = (function() {});
        container = document.createElement('div');
        anonymous_template = new ko.templateSources.anonymousTemplate(element);
        anonymous_template['nodes'](container);
        anonymous_template['text']("");
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          return _tryUnrender(view);
        });
        ko.computed({
          disposeWhenNodeIsRemoved: element,
          read: function() {
            var afterDisplay, beforeDispose, beforeDispose_length, options, should_display, template, _ref2, _ref3;
            options = _standardizeOptions(valueAccessor);
            view = ko.unwrap(options.data);
            template = Falcon.isView(view) ? ko.unwrap(view.__falcon_view__loaded_template__) : "";
            if (!isString(template)) {
              template = "";
            }
            afterDisplay = ko.utils.peekObservable(options['afterDisplay']);
            beforeDispose = ko.utils.peekObservable(options['beforeDispose']);
            should_display = ko.unwrap(options['displayIf']) !== false;
            should_display = should_display && !isEmpty(template);
            continuation = function() {
              var childContext, view_model, _ref2;
              continuation = (function() {});
              is_disposing = false;
              is_displayed = false;
              if (view !== oldView) {
                _tryUnrender(oldView);
                oldView = view;
              }
              if (!should_display) {
                _tryUnrender(view);
                return ko.virtualElements.emptyNode(element);
              }
              view_model = view.createViewModel();
              childContext = context.createChildContext(viewModel).extend({
                '$rawView': view,
                '$view': view_model,
                '$data': view_model,
                '$root': (_ref2 = context['$root']) != null ? _ref2 : view_model
              });
              container.innerHTML = template;
              anonymous_template['text'](template);
              ko.renderTemplate(element, childContext, {}, element);
              is_displayed = true;
              _runUnobserved(view._render, view);
              if (isFunction(afterDisplay)) {
                return afterDisplay(ko.virtualElements.childNodes(element), view);
              }
            };
            if (is_disposing) {
              return;
            }
            if (is_displayed && isFunction(beforeDispose)) {
              beforeDispose_length = (_ref2 = (_ref3 = beforeDispose.__falcon_bind__length__) != null ? _ref3 : beforeDispose.length) != null ? _ref2 : 0;
              if (beforeDispose_length === 3) {
                is_disposing = true;
                return beforeDispose(ko.virtualElements.childNodes(element), view, function() {
                  return continuation();
                });
              } else if (beforeDispose_length === 2) {
                is_disposing = true;
                return beforeDispose(ko.virtualElements.childNodes(element), function() {
                  return continuation();
                });
              } else {
                beforeDispose(ko.virtualElements.childNodes(element), view);
                return continuation();
              }
            } else {
              return continuation();
            }
          }
        });
        return {
          controlsDescendantBindings: true
        };
      }
    };
  })());

  _getForeachItems = function(value) {
    value = ko.utils.peekObservable(value);
    if (Falcon.isCollection(value) || isArray(value)) {
      value = {
        data: value
      };
    }
    if (!isObject(value)) {
      value = {};
    }
    value.data = ko.unwrap(value.data);
    if (Falcon.isCollection(value.data)) {
      value.data = value.data.models();
    }
    if (value.data == null) {
      value.data = [];
    }
    return (function() {
      return value;
    });
  };

  Falcon.__binding__original_foreach__ = (_ref2 = Falcon.getBinding('foreach')) != null ? _ref2 : {};

  Falcon.addBinding('foreach', {
    'init': function() {
      var args, element, value, valueAccessor, _ref3;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.unwrap(valueAccessor());
      return (_ref3 = Falcon.__binding__original_foreach__)['init'].apply(_ref3, [element, _getForeachItems(value)].concat(__slice.call(args)));
    },
    'update': function() {
      var args, element, value, valueAccessor, _ref3;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.unwrap(valueAccessor());
      return (_ref3 = Falcon.__binding__original_foreach__)['update'].apply(_ref3, [element, _getForeachItems(value)].concat(__slice.call(args)));
    }
  });

  _ref3 = Falcon.__binding__original_foreach__;
  for (key in _ref3) {
    value = _ref3[key];
    if (!(key in ko.bindingHandlers['foreach'])) {
      ko.bindingHandlers['foreach'][key] = value;
    }
  }

  _getOptionsItems = function(value) {
    value = ko.unwrap(value);
    if (Falcon.isCollection(value)) {
      value = value.models();
    }
    return (function() {
      return value;
    });
  };

  Falcon.__binding__original_options__ = (_ref4 = Falcon.getBinding('options')) != null ? _ref4 : {};

  Falcon.addBinding('options', {
    'init': function() {
      var args, element, valueAccessor, _ref5;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.unwrap(valueAccessor());
      return ((_ref5 = Falcon.__binding__original_options__['init']) != null ? _ref5 : (function() {})).apply(null, [element, _getOptionsItems(value)].concat(__slice.call(args)));
    },
    'update': function() {
      var args, element, valueAccessor, _ref5;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.unwrap(valueAccessor());
      return ((_ref5 = Falcon.__binding__original_options__['update']) != null ? _ref5 : (function() {})).apply(null, [element, _getOptionsItems(value)].concat(__slice.call(args)));
    }
  });

  _ref5 = Falcon.__binding__original_options__;
  for (key in _ref5) {
    value = _ref5[key];
    if (!(key in ko.bindingHandlers['options'])) {
      ko.bindingHandlers['options'][key] = value;
    }
  }

  Falcon.addBinding('log', true, function(element, valueAccessor) {
    return console.log(ko.unwrap(valueAccessor()));
  });

  Falcon.__binding__original_component__ = (_ref6 = Falcon.getBinding('component')) != null ? _ref6 : {};

  Falcon.addBinding('component', true, {
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      Falcon.onDispose(element, function() {
        var params, view;
        if (!isObject(value = ko.unwrap(valueAccessor()))) {
          return;
        }
        if (!isObject(params = value['params'])) {
          return;
        }
        if (!Falcon.isView(view = params['__falcon_component_view__'])) {
          return;
        }
        return view._unrender();
      });
      return Falcon.__binding__original_component__['init'].apply(this, arguments);
    }
  });

  Falcon.addBinding('yield', true, {
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var defaultNodes, yieldedNodes;
      yieldedNodes = bindingContext['$componentTemplateNodes'];
      defaultNodes = ko.virtualElements.childNodes(element);
      ko.computed({
        disposeWhenNodeIsRemoved: element,
        read: function() {
          value = ko.unwrap(valueAccessor());
          if (value !== false) {
            ko.virtualElements.setDomNodeChildren(element, yieldedNodes);
          } else {
            ko.virtualElements.setDomNodeChildren(element, defaultNodes);
          }
          return ko.applyBindingsToDescendants(bindingContext, element);
        }
      });
      return {
        controlsDescendantBindings: true
      };
    }
  });

}).call(this);
