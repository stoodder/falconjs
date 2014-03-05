/*
	Falcon.js
	by Rick Allen (stoodder)

	Version {{VERSION}}
	Full source at https://github.com/stoodder/falconjs
	Copyright (c) 2013 Rick Allen, http://www.stoodder.com

	MIT License, https://github.com/stoodder/falconjs/blob/master/LICENSE.md
*/


(function() {
  var ChainedCollection, Falcon, arrayRemove, arrayUnique, clone, extend, findKey, isArray, isBoolean, isElement, isEmpty, isFunction, isNaN, isNumber, isObject, isString, key, objectKeys, startsWith, trim, value, _foreach, _getItems, _options, _ready, _ref, _ref1, _ref2, _ref3, _shouldUpdate,
    __slice = [].slice,
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

  if (String.prototype.trim) {
    trim = function(str) {
      return String.prototype.trim.call(str);
    };
  } else {
    trim = function(str) {
      return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };
  }

  startsWith = function(haystack, needle) {
    return haystack.indexOf(needle) === 0;
  };

  objectKeys = function(obj) {
    var key, _results;
    _results = [];
    for (key in obj) {
      _results.push(key);
    }
    return _results;
  };

  extend = function(obj, extender) {
    var key, value;
    if (obj == null) {
      obj = {};
    }
    if (!isObject(extender)) {
      extender = {};
    }
    for (key in extender) {
      value = extender[key];
      obj[key] = value;
    }
    return obj;
  };

  findKey = function(obj, value) {
    var k, v;
    for (k in obj) {
      v = obj[k];
      if (v === value) {
        return k;
      }
    }
    return void 0;
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

  arrayUnique = function(arr) {
    var key, obj, value, _i, _len;
    obj = {};
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      key = arr[_i];
      obj[key] = true;
    }
    return (function() {
      var _results;
      _results = [];
      for (key in obj) {
        value = obj[key];
        _results.push(key);
      }
      return _results;
    })();
  };

  arrayRemove = function(arr, items) {
    var item, _i, _item, _len;
    if (!isArray(arr)) {
      return [];
    }
    if (!isArray(items)) {
      items = [items];
    }
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      arr = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = arr.length; _j < _len1; _j++) {
          _item = arr[_j];
          if (_item !== item) {
            _results.push(_item);
          }
        }
        return _results;
      })();
    }
    return arr;
  };

  _ready = null;

  this.Falcon = Falcon = {
    version: "0.10.0",
    applicationElement: "body",
    baseApiUrl: "",
    baseTemplateUrl: "",
    deferEvaluation: true,
    adapter: null,
    apply: function(root, element, callback) {
      var _ref;
      if (isFunction(element)) {
        _ref = [callback, element], element = _ref[0], callback = _ref[1];
      }
      if (element == null) {
        element = Falcon.applicationElement;
      }
      _ready(function() {
        var _ref1;
        if (!isElement(element)) {
          if (!isString(element)) {
            element = "";
          }
          element = isEmpty(element) ? "body" : trim(element);
          element = (_ref1 = document.querySelectorAll(element)[0]) != null ? _ref1 : document.body;
        }
        element.setAttribute("data-bind", "view: $data");
        ko.applyBindings(ko.observable(root), element);
        if (isFunction(callback)) {
          return callback();
        }
      });
      return Falcon;
    },
    isModel: function(object) {
      return (object != null) && object instanceof Falcon.Model;
    },
    isCollection: function(object) {
      return (object != null) && object instanceof Falcon.Collection;
    },
    isView: function(object) {
      return (object != null) && object instanceof Falcon.View;
    },
    isDataObject: function(object) {
      return (object != null) && (object instanceof Falcon.Model || object instanceof Falcon.Collection);
    },
    isAdapter: function(object) {
      return (object != null) && object instanceof Falcon.Adapter;
    },
    isFalconObject: function(object) {
      return (object != null) && (object instanceof Falcon.Object);
    },
    addBinding: function(name, definition, allowVirtual) {
      var _ref;
      if (isBoolean(definition)) {
        _ref = [allowVirtual, definition], definition = _ref[0], allowVirtual = _ref[1];
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
    },
    getBinding: function(name) {
      return ko.bindingHandlers[name];
    },
    register: function(name, view_definition) {}
  };

  (function() {
    var handler, _domLoadedEvent, _ready_callbacks;
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
      document.addEventListener("DOMContentLoaded", handler = function() {
        _domLoadedEvent();
        return document.removeEventListener("DOMContentLoaded", handler, false);
      }, false);
    } else if (document.attachEvent) {
      document.attachEvent("readystatechange", handler = function() {
        if (document.readyState === "complete") {
          _domLoadedEvent();
          return document.detachEvent("readystatechange", handler);
        }
      });
    }
    document.createElement("template");
    return _ready(function() {
      return Falcon.View.cacheTemplates();
    });
  })();

  Falcon.Object = (function() {
    var __falcon_object__current_cid__;

    __falcon_object__current_cid__ = 0;

    Object.prototype.observables = null;

    Object.prototype.defaults = null;

    Object.extend = function(protoProps, staticProps) {
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

    Object.prototype.__falcon_object__events__ = null;

    Object.prototype.__falcon_object__cid__ = null;

    function Object() {
      var attr, value, _ref, _ref1, _ref2, _ref3, _ref4;
      this.__falcon_object__events__ = {};
      this.__falcon_object__cid__ = __falcon_object__current_cid__++;
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
              'deferEvaluation': (_ref4 = Falcon.deferEvaluation) != null ? _ref4 : true,
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

    Object.prototype.on = function(event, callback, context) {
      var _base;
      if (!(isString(event) && isFunction(callback))) {
        return this;
      }
      if (context == null) {
        context = this;
      }
      event = trim(event).toLowerCase();
      if (isEmpty(event)) {
        return this;
      }
      ((_base = this.__falcon_object__events__)[event] != null ? (_base = this.__falcon_object__events__)[event] : _base[event] = []).push({
        callback: callback,
        context: context
      });
      return this;
    };

    Object.prototype.off = function(event, callback) {
      var evt;
      if (!isString(event)) {
        return this;
      }
      event = trim(event).toLowerCase();
      if (isEmpty(event) || (this.__falcon_object__events__[event] == null)) {
        return this;
      }
      if (isFunction(callback)) {
        this.__falcon_object__events__[event] = (function() {
          var _i, _len, _ref, _results;
          _ref = this.__falcon_object__events__[event];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            evt = _ref[_i];
            if (evt.callback !== callback) {
              _results.push(evt);
            }
          }
          return _results;
        }).call(this);
        if (this.__falcon_object__events__[event].length <= 0) {
          this.__falcon_object__events__[event] = null;
        }
      } else {
        this.__falcon_object__events__[event] = null;
      }
      return this;
    };

    Object.prototype.has = function(event, callback) {
      var evt, _i, _len, _ref;
      if (!isString(event)) {
        return false;
      }
      event = trim(event).toLowerCase();
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

    Object.prototype.trigger = function() {
      var args, event, evt, _i, _len, _ref;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!isString(event)) {
        return this;
      }
      event = trim(event).toLowerCase();
      if (isEmpty(event) || (this.__falcon_object__events__[event] == null)) {
        return this;
      }
      _ref = this.__falcon_object__events__[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        evt.callback.apply(evt.context, args);
      }
      return this;
    };

    return Object;

  })();

  Falcon.Adapter = (function(_super) {
    __extends(Adapter, _super);

    function Adapter() {
      _ref = Adapter.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Adapter.extend = Falcon.Object.extend;

    Adapter.prototype.resolveRequestType = function(data_object, type, options, context) {
      if (!isString(type)) {
        return "GET";
      }
      type = trim(type).toUpperCase();
      if (type !== "GET" && type !== "PUT" && type !== "POST" && type !== "DELETE") {
        return "GET";
      }
      return type;
    };

    Adapter.prototype.resolveContext = function(data_object, type, options, context) {
      var _ref1;
      return (_ref1 = context != null ? context : options.context) != null ? _ref1 : data_object;
    };

    Adapter.prototype.standardizeOptions = function(data_object, type, options, context) {
      var key, output_options, value;
      if (isObject(options)) {
        output_options = {};
        for (key in options) {
          value = options[key];
          output_options[key] = value;
        }
      } else if (isFunction(options)) {
        output_options = {
          complete: options
        };
      } else if (isString(options)) {
        output_options = {
          attributes: trim(options).split(",")
        };
      } else if (isArray(options)) {
        output_options = {
          attributes: options
        };
      } else {
        output_options = {};
      }
      if (!isFunction(output_options.success)) {
        output_options.success = (function() {});
      }
      if (!isFunction(output_options.complete)) {
        output_options.complete = (function() {});
      }
      if (!isFunction(output_options.error)) {
        output_options.error = (function() {});
      }
      if (!(Falcon.isModel(output_options.parent) || output_options.parent === null)) {
        output_options.parent = data_object.parent;
      }
      if (!(isArray(output_options.attributes) || isObject(output_options.attributes))) {
        output_options.attributes = null;
      }
      if (!isObject(output_options.fill_options)) {
        output_options.fill_options = null;
      }
      output_options.url = this.makeUrl(data_object, type, output_options, context);
      output_options.data = this.serializeData(data_object, type, output_options, context);
      return output_options;
    };

    Adapter.prototype.makeUrl = function(data_object, type, options, context) {
      var _ref1;
      return (_ref1 = options.url) != null ? _ref1 : data_object.makeUrl(type, options.parent);
    };

    Adapter.prototype.serializeData = function(data_object, type, options, context) {
      if ((options.data == null) && (type === "POST" || type === "PUT")) {
        return data_object.serialize(options.attributes);
      } else {
        return options.data;
      }
    };

    Adapter.prototype.parseRawResponseData = function(data_object, type, options, context, response_args) {
      return response_args;
    };

    Adapter.prototype.successResponseHandler = function(data_object, type, options, context, response_args) {
      var parsed_data, raw_response_data;
      raw_response_data = this.parseRawResponseData(data_object, type, options, context, response_args);
      parsed_data = data_object.parse(raw_response_data, options);
      data_object.fill(parsed_data, options.fill_options);
      switch (type) {
        case "GET":
          data_object.trigger("fetch", parsed_data);
          break;
        case "POST":
          data_object.trigger("create", parsed_data);
          break;
        case "PUT":
          data_object.trigger("save", parsed_data);
          break;
        case "DELETE":
          data_object.trigger("destroy", parsed_data);
      }
      return options.success.call(context, data_object, raw_response_data, options, response_args);
    };

    Adapter.prototype.errorResponseHandler = function(data_object, type, options, context, response_args) {
      var raw_response_data;
      raw_response_data = this.parseRawResponseData(data_object, type, options, context, response_args);
      return options.error.call(context, data_object, raw_response_data, options, response_args);
    };

    Adapter.prototype.completeResponseHandler = function(data_object, type, options, context, response_args) {
      var raw_response_data;
      raw_response_data = this.parseRawResponseData(data_object, type, options, context, response_args);
      return options.complete.call(context, data_object, raw_response_data, options, response_args);
    };

    Adapter.prototype.sync = function(data_object, type, options, context) {
      var is_valid;
      if (!Falcon.isDataObject(data_object)) {
        throw new Error("Expected data_object to be a Model or Collection");
      }
      is_valid = false;
      type = this.resolveRequestType(data_object, type, options, context);
      options = this.standardizeOptions(data_object, type, options, context);
      context = this.resolveContext(data_object, type, options, context);
      if (Falcon.isModel(data_object)) {
        if ((type === "PUT" || type === "POST") && (!data_object.validate(options))) {
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

    Adapter.prototype.getTemplate = function(view, uri, loaded_callback) {
      var template, _ref1, _ref2;
      template = (_ref1 = (_ref2 = document.getElementById(uri.slice(1))) != null ? _ref2.innerHTML : void 0) != null ? _ref1 : "";
      Falcon.View.cacheTemplate(uri, template);
      if (isFunction(loaded_callback)) {
        loaded_callback();
      }
      return this;
    };

    return Adapter;

  })(Falcon.Object);

  Falcon.adapter = new Falcon.Adapter;

  Falcon.Model = (function(_super) {
    __extends(Model, _super);

    Model.extend = Falcon.Object.extend;

    Model.prototype.id = null;

    Model.prototype.url = null;

    Model.prototype.parent = null;

    function Model(data, parent) {
      var _ref1, _ref2;
      Model.__super__.constructor.apply(this, arguments);
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
      this.parent = parent;
      this.initialize.apply(this, arguments);
      if (!isEmpty(data)) {
        this.fill(data);
      }
      return this;
    }

    Model.prototype.initialize = function(data) {};

    Model.prototype.get = function(attribute) {
      if (!isString(attribute)) {
        return thisundefined;
      }
      return ko.unwrap(this[attribute]);
    };

    Model.prototype.set = function(attribute, value) {
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

    Model.prototype.toggle = function(attribute) {
      return this.set(attribute, !this.get(attribute));
    };

    Model.prototype.increment = function(attribute) {
      this.set(attribute, this.get(attribute) + 1);
      return this;
    };

    Model.prototype.decrement = function(attribute) {
      this.set(attribute, this.get(attribute) - 1);
      return this;
    };

    Model.prototype.parse = function(data, options, xhr) {
      return data;
    };

    Model.prototype.fill = function(data) {
      var attr, rejectedAttributes, value, _ref1;
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
        if (attr !== "id" && attr !== "url") {
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
        } else {
          this[attr] = value;
        }
      }
      return this;
    };

    Model.prototype.unwrap = function() {
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

    Model.prototype.serialize = function(attributes) {
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

    Model.prototype.makeUrl = function(type, parent, id) {
      var ext, parentPeriodIndex, parentSlashIndex, parentUrl, periodIndex, url, _ref1;
      url = isFunction(this.url) ? this.url() : this.url;
      if (!isString(url)) {
        url = "";
      }
      url = trim(url);
      if (!isString(type)) {
        type = "";
      }
      type = type.toUpperCase();
      if (type !== 'GET' && type !== 'PUT' && type !== 'POST' && type !== 'DELETE') {
        type = 'GET';
      }
      if (id === void 0 && (isString(parent) || isNumber(parent))) {
        _ref1 = [id, parent], parent = _ref1[0], id = _ref1[1];
      }
      parent = parent !== void 0 ? parent : this.parent;
      ext = "";
      periodIndex = url.lastIndexOf(".");
      if (periodIndex > -1) {
        ext = url.slice(periodIndex);
        url = url.slice(0, periodIndex);
      }
      if (!startsWith(url, "/")) {
        url = "/" + url;
      }
      if (Falcon.isModel(parent)) {
        parentUrl = parent.makeUrl();
        parentPeriodIndex = parentUrl.lastIndexOf(".");
        parentSlashIndex = parentUrl.lastIndexOf("/");
        if (parentSlashIndex < parentPeriodIndex) {
          if (parentPeriodIndex > -1) {
            parentUrl = parentUrl.slice(0, parentPeriodIndex);
          }
          parentUrl = trim(parentUrl);
        }
        url = "" + parentUrl + url;
      } else if (isString(Falcon.baseApiUrl)) {
        url = "" + Falcon.baseApiUrl + url;
      }
      if (type === "GET" || type === "PUT" || type === "DELETE") {
        if (url.slice(-1) !== "/") {
          url += "/";
        }
        url += id != null ? id : this.get('id');
      }
      url = url.replace(/([^:])\/\/+/gi, "$1/").replace(/^\/\//gi, "/");
      return "" + url + ext;
    };

    Model.prototype.validate = function(options) {
      return true;
    };

    Model.prototype.sync = function(type, options, context) {
      return Falcon.adapter.sync(this, type, options, context);
    };

    Model.prototype.fetch = function(options, context) {
      return this.sync('GET', options, context);
    };

    Model.prototype.create = function(options, context) {
      return this.sync('POST', options, context);
    };

    Model.prototype.save = function(options, context) {
      return (this.isNew() ? this.create(options, context) : this.sync('PUT', options, context));
    };

    Model.prototype.destroy = function(options, context) {
      return this.sync('DELETE', options, context);
    };

    Model.prototype.equals = function(model) {
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

    Model.prototype.mixin = function(mapping) {
      var key, value, _ref1,
        _this = this;
      if (!isObject(mapping)) {
        mapping = {};
      }
      for (key in mapping) {
        value = mapping[key];
        if (Falcon.isDataObject(this[key])) {
          this[key].mixin(value);
        } else {
          if (ko.isObservable(value)) {
            this[key] = ko.observable((_ref1 = this[key]) != null ? _ref1 : ko.unwrap(value));
          } else if (isFunction(value)) {
            (function() {
              var _value;
              _value = value;
              return _this[key] = function() {
                var args;
                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                return _value.call.apply(_value, [_this, _this].concat(__slice.call(args)));
              };
            })();
          } else {
            if (this[key] == null) {
              this[key] = value;
            }
          }
        }
      }
      return this;
    };

    Model.prototype.clone = function(attributes, parent) {
      var _ref1;
      if (attributes === null || Falcon.isModel(attributes)) {
        _ref1 = [void 0, attributes], attributes = _ref1[0], parent = _ref1[1];
      }
      if (!(parent === null || Falcon.isModel(parent))) {
        parent = this.parent;
      }
      return new this.constructor(this.serialize(attributes), parent);
    };

    Model.prototype.isNew = function() {
      return this.get("id") == null;
    };

    return Model;

  })(Falcon.Object);

  Falcon.View = (function(_super) {
    var __falcon_view__template_cache__;

    __extends(View, _super);

    __falcon_view__template_cache__ = {};

    View.cacheTemplate = function(identifier, template) {
      if (!isString(identifier)) {
        identifier = "";
      }
      if (!isString(template)) {
        template = "";
      }
      identifier = trim(identifier);
      __falcon_view__template_cache__[identifier] = template;
      return Falcon.View;
    };

    View.cacheTemplates = function() {
      var identifier, template, templates, _i, _len, _ref1;
      templates = Array.prototype.slice.call(document.getElementsByTagName("template"));
      for (_i = 0, _len = templates.length; _i < _len; _i++) {
        template = templates[_i];
        identifier = template.getAttribute("id");
        if (identifier != null) {
          Falcon.View.cacheTemplate("#" + identifier, template.innerHTML);
        }
        if ((_ref1 = template.parentNode) != null) {
          _ref1.removeChild(template);
        }
      }
      return Falcon.View;
    };

    View.resetCache = function() {
      __falcon_view__template_cache__ = {};
      return Falcon.View;
    };

    View.extend = Falcon.Object.extend;

    View.prototype.url = null;

    View.prototype.is_loaded = false;

    View.prototype._is_rendered = false;

    View.prototype.__falcon_view__child_views__ = null;

    View.prototype.__falcon_view__loaded_url__ = null;

    function View() {
      var url, _loaded,
        _this = this;
      View.__super__.constructor.apply(this, arguments);
      url = this.makeUrl();
      this._is_rendered = false;
      this.is_loaded = ko.observable(false);
      this.__falcon_view__child_views__ = [];
      _loaded = function() {
        _this.__falcon_view__loaded_url__ = url;
        return _this.is_loaded(true);
      };
      this.initialize.apply(this, arguments);
      if (isEmpty(url) || url in __falcon_view__template_cache__) {
        _loaded();
      } else {
        Falcon.adapter.getTemplate(this, url, _loaded);
      }
    }

    View.prototype.makeUrl = function() {
      var url;
      if (this.url == null) {
        return null;
      }
      url = ko.utils.unwrapObservable(this.url);
      if (isFunction(url)) {
        url = url();
      }
      if (!isString(url)) {
        url = "";
      }
      url = trim(url);
      if (url.charAt(0) === '#') {
        return url;
      }
      if (url.charAt(0) !== '/') {
        url = "/" + url;
      }
      if (isString(Falcon.baseTemplateUrl)) {
        url = "" + Falcon.baseTemplateUrl + url;
      }
      url = url.replace(/([^:])\/\/+/gi, "$1/");
      return url;
    };

    View.prototype.template = function() {
      var _ref1;
      if (!ko.utils.unwrapObservable(this.is_loaded)) {
        return "";
      }
      return (_ref1 = __falcon_view__template_cache__[this.__falcon_view__loaded_url__]) != null ? _ref1 : "";
    };

    View.prototype._render = function() {
      if (this._is_rendered) {
        return;
      }
      this.display.apply(this, arguments);
      this._is_rendered = true;
    };

    View.prototype._unrender = function() {
      var child_view, _i, _len, _ref1;
      if (!this._is_rendered) {
        return;
      }
      _ref1 = this.__falcon_view__child_views__;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child_view = _ref1[_i];
        child_view._unrender();
      }
      this.__falcon_view__child_views__ = [];
      this.dispose.apply(this, arguments);
      this._is_rendered = false;
    };

    View.prototype._addChildView = function(view) {
      if (!Falcon.isView(view)) {
        return;
      }
      return this.__falcon_view__child_views__.push(view);
    };

    View.prototype.initialize = (function() {});

    View.prototype.display = (function() {});

    View.prototype.dispose = (function() {});

    View.__falcon_view__viewModel__ = null;

    View.prototype.viewModel = function() {
      var key, value, viewModel,
        _this = this;
      if (this.__falcon_view__viewModel__ != null) {
        return this.__falcon_view__viewModel__;
      }
      viewModel = {
        "__falcon_view__addChildView__": function(view) {
          return _this._addChildView(view);
        }
      };
      for (key in this) {
        value = this[key];
        if (!(!(key in Falcon.View.prototype))) {
          continue;
        }
        if (isFunction(value) && !ko.isObservable(value)) {
          value = (function() {
            var _value;
            _value = value;
            return function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _value.call.apply(_value, [_this].concat(__slice.call(args)));
            };
          })();
        }
        viewModel[key] = value;
      }
      return (this.__falcon_view__viewModel__ = viewModel);
    };

    return View;

  })(Falcon.Object);

  Falcon.Collection = (function(_super) {
    var _makeIterator;

    __extends(Collection, _super);

    Collection.extend = Falcon.Object.extend;

    _makeIterator = function(iterator) {
      var _id, _model, _model_id;
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
      }
      return iterator;
    };

    Collection.prototype.__falcon_collection__mixins__ = null;

    Collection.prototype.__falcon_collection__change_count__ = 0;

    Collection.prototype.models = null;

    Collection.prototype.model = null;

    Collection.prototype.url = null;

    Collection.prototype.length = 0;

    Collection.prototype.parent = null;

    Collection.prototype.comparator = null;

    function Collection(models, parent) {
      var _ref1, _ref2,
        _this = this;
      Collection.__super__.constructor.apply(this, arguments);
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
        if (this.url == null) {
          this.url = this.model.prototype.url;
        }
      }
      this.length = ko.computed({
        deferEvaluation: true,
        read: function() {
          return _this.models().length;
        }
      });
      this.parent = parent;
      this.__falcon_collection__mixins__ = [];
      this.reset();
      this.initialize.apply(this, arguments);
      if (!isEmpty(models)) {
        this.fill(models);
      }
      return this;
    }

    Collection.prototype.initialize = (function(models, parent) {});

    Collection.prototype.set = function(attribute, value) {
      this.each(function(model) {
        return model.set(attribute, value);
      });
      return this;
    };

    Collection.prototype.parse = function(data, options, xhr) {
      return data;
    };

    Collection.prototype.fill = function(items, options) {
      var added_model, added_models, comparator, existing_model, head, i, insert_index, item, iterator, m, mapping, method, new_model, new_models_list, tail, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _length, _m, _n, _o, _ref1, _ref2, _ref3;
      if (this.model == null) {
        return [];
      }
      if (items == null) {
        items = [];
      }
      if (Falcon.isCollection(items)) {
        items = items.all();
      }
      if (ko.isObservable(items)) {
        items = ko.unwrap(items);
      }
      if (!isArray(items)) {
        items = [items];
      }
      items = items.slice(0);
      new_models_list = [];
      added_models = [];
      if (!isObject(options)) {
        options = {};
      }
      method = options.method;
      if (!isString(method)) {
        method = '';
      }
      method = method.toLowerCase();
      if (method !== 'replace' && method !== 'append' && method !== 'prepend' && method !== 'insert' && method !== 'merge') {
        method = 'replace';
      }
      comparator = (_ref1 = options.comparator) != null ? _ref1 : this.comparator;
      if (method !== 'replace' && isEmpty(items)) {
        return [];
      }
      this.__falcon_collection__change_count__++;
      if (method === 'merge') {
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
      } else {
        for (i = _l = 0, _len3 = items.length; _l < _len3; i = ++_l) {
          item = items[i];
          if (isObject(item) && !Falcon.isModel(item)) {
            items[i] = new this.model(item, this.parent);
          }
        }
        added_models = items;
        if (method === 'replace') {
          new_models_list = items;
        } else if (method === 'prepend') {
          _length = items.length - 1;
          new_models_list = this.models();
          for (i = _m = 0, _len4 = items.length; _m < _len4; i = ++_m) {
            item = items[i];
            new_models_list.unshift(items[_length - i]);
          }
        } else if (method === 'append') {
          new_models_list = this.models();
          new_models_list = new_models_list.concat(items);
        } else if (method === 'insert') {
          insert_index = (_ref2 = options.insert_index) != null ? _ref2 : -1;
          new_models_list = this.models();
          if (insert_index < 0 || insert_index >= new_models_list.length) {
            new_models_list = new_models_list.concat(items);
          } else {
            head = new_models_list.slice(0, insert_index);
            tail = new_models_list.slice(insert_index);
            new_models_list = head.concat(items, tail);
          }
        }
      }
      for (_n = 0, _len5 = added_models.length; _n < _len5; _n++) {
        added_model = added_models[_n];
        _ref3 = this.__falcon_collection__mixins__;
        for (_o = 0, _len6 = _ref3.length; _o < _len6; _o++) {
          mapping = _ref3[_o];
          added_model.mixin(mapping);
        }
      }
      if (isFunction(comparator)) {
        new_models_list.sort(comparator);
      }
      this.models(new_models_list);
      return added_models;
    };

    Collection.prototype.unwrap = function() {
      var i, raw, value, _ref1;
      raw = [];
      _ref1 = this.models();
      for (i in _ref1) {
        value = _ref1[i];
        raw[i] = Falcon.isDataObject(value) ? value.unwrap() : value;
      }
      return raw;
    };

    Collection.prototype.serialize = function(attributes) {
      var i, serialized, value, _ref1;
      serialized = [];
      _ref1 = this.models();
      for (i in _ref1) {
        value = _ref1[i];
        serialized[i] = Falcon.isDataObject(value) ? value.serialize(attributes) : value;
      }
      return serialized;
    };

    Collection.prototype.makeUrl = function(type, parent) {
      var parentPeriodIndex, parentSlashIndex, parentUrl, url;
      url = isFunction(this.url) ? this.url() : this.url;
      if (!isString(url)) {
        url = "";
      }
      url = trim(url);
      if (!isString(type)) {
        type = "";
      }
      type = type.toUpperCase();
      if (type !== 'GET' && type !== 'PUT' && type !== 'POST' && type !== 'DELETE') {
        type = 'GET';
      }
      if (!startsWith(url, "/")) {
        url = "/" + url;
      }
      parent = parent === void 0 ? this.parent : parent;
      if (Falcon.isModel(parent)) {
        parentUrl = parent.makeUrl();
        parentPeriodIndex = parentUrl.lastIndexOf(".");
        parentSlashIndex = parentUrl.lastIndexOf("/");
        if (parentSlashIndex < parentPeriodIndex) {
          if (parentPeriodIndex > -1) {
            parentUrl = parentUrl.slice(0, parentPeriodIndex);
          }
          parentUrl = trim(parentUrl);
        }
        url = "" + parentUrl + url;
      } else if (isString(Falcon.baseApiUrl)) {
        url = "" + Falcon.baseApiUrl + url;
      }
      url = url.replace(/([^:])\/\/+/gi, "$1/").replace(/^\/\//gi, "/");
      return url;
    };

    Collection.prototype.sync = function(type, options, context) {
      return Falcon.adapter.sync(this, type, options, context);
    };

    Collection.prototype.fetch = function(options, context) {
      return this.sync('GET', options, context);
    };

    Collection.prototype.create = function(data, options, context) {
      var model, output_options,
        _this = this;
      if (this.model == null) {
        return null;
      }
      if (!(isObject(data) || Falcon.isModel(data))) {
        data = {};
      }
      model = Falcon.isModel(data) ? data : new this.model(data);
      if (context == null) {
        context = model;
      }
      output_options = Falcon.adapter.standardizeOptions(model, 'POST', options, context);
      if (output_options.fill_options == null) {
        output_options.fill_options = {
          method: 'append'
        };
      }
      output_options.success = function(model) {
        _this.fill(model, output_options);
        if (isFunction(options.success)) {
          return options.success.apply(context, arguments);
        }
      };
      return model.create(output_options, context);
    };

    Collection.prototype.destroy = function(model, options, context) {
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
      output_options = Falcon.adapter.standardizeOptions(model, 'DELETE', options, context);
      output_options.success = function(model) {
        _this.remove(model);
        if (isFunction(options.success)) {
          return options.success.apply(context, arguments);
        }
      };
      return model.destroy(output_options, context);
    };

    Collection.prototype.remove = function(items) {
      var removedItems;
      items = ko.unwrap(items);
      if (Falcon.isCollection(items)) {
        items = items.models();
      }
      this.__falcon_collection__change_count__++;
      removedItems = isArray(items) ? this.models.removeAll(items) : this.models.remove(_makeIterator(items));
      return this;
    };

    Collection.prototype.append = function(items) {
      return this.fill(items, {
        'method': 'append'
      });
    };

    Collection.prototype.prepend = function(items) {
      return this.fill(items, {
        'method': 'prepend'
      });
    };

    Collection.prototype.insert = function(insert_model, model) {
      var insert_index, iterator;
      iterator = _makeIterator(model);
      if (!isFunction(iterator)) {
        return this.fill(insert_model, {
          'method': 'append'
        });
      }
      insert_index = this.indexOf(model);
      return this.fill(insert_model, {
        'method': 'insert',
        'insert_index': insert_index
      });
    };

    Collection.prototype.unshift = function() {
      return this.prepend.apply(this, arguments);
    };

    Collection.prototype.shift = function() {
      var item;
      item = this.models.shift();
      return item;
    };

    Collection.prototype.push = function() {
      return this.append.apply(this, arguments);
    };

    Collection.prototype.pop = function() {
      var item;
      this.__falcon_collection__change_count__++;
      item = this.models.pop();
      return item;
    };

    Collection.prototype.sort = function(comparator) {
      if (!isFunction(comparator)) {
        return models;
      }
      return this.models.sort(comparator);
    };

    Collection.prototype.at = function(index) {
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

    Collection.prototype.indexOf = function(model) {
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

    Collection.prototype.lastIndexOf = function(model) {
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

    Collection.prototype.each = function(iterator, context) {
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

    Collection.prototype.first = function(iterator) {
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

    Collection.prototype.last = function(iterator) {
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

    Collection.prototype.all = function() {
      return this.models();
    };

    Collection.prototype.filter = function(iterator) {
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

    Collection.prototype.any = function(iterator) {
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

    Collection.prototype.without = function(iterator) {
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

    Collection.prototype.pluck = function(attribute, unwrap) {
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

    Collection.prototype.slice = function(start, end) {
      return this.models.slice(start, end);
    };

    Collection.prototype.chain = function() {
      var chainedCollection;
      chainedCollection = new ChainedCollection();
      chainedCollection.model = this.model;
      chainedCollection.fill(this.models());
      return chainedCollection;
    };

    Collection.prototype.mixin = function(mapping) {
      var key, model, models, value, _i, _len, _mapping,
        _this = this;
      if (!isObject(mapping)) {
        mapping = {};
      }
      _mapping = {};
      for (key in mapping) {
        value = mapping[key];
        if (ko.isObservable(value)) {
          _mapping[key] = ko.observable(ko.unwrap(value));
        } else if (isFunction(value)) {
          (function() {
            var _value;
            _value = value;
            _mapping[key] = function() {
              var args;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return _value.apply(args[0], [args[0], _this].concat(args.slice(1)));
            };
            return _mapping[key].length = _value.length;
          })();
        } else {
          _mapping[key] = value;
        }
      }
      models = this.models();
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        if (Falcon.isDataObject(model)) {
          model.mixin(_mapping);
        }
      }
      this.__falcon_collection__mixins__.push(_mapping);
      return this;
    };

    Collection.prototype.clone = function(attributes, parent) {
      var _ref1;
      if (attributes === null || Falcon.isModel(attributes)) {
        _ref1 = [void 0, attributes], attributes = _ref1[0], parent = _ref1[1];
      }
      if (!(parent === null || Falcon.isModel(parent))) {
        parent = this.parent;
      }
      return new this.constructor(this.serialize(attributes), parent);
    };

    Collection.prototype.reset = function() {
      this.__falcon_collection__change_count__++;
      if (this.models != null) {
        this.models([]);
      } else {
        this.models = ko.observableArray([]);
      }
      return this;
    };

    return Collection;

  })(Falcon.Object);

  ChainedCollection = (function(_super) {
    __extends(ChainedCollection, _super);

    function ChainedCollection() {
      _ref1 = ChainedCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    ChainedCollection.prototype.slice = function() {
      this.models(ChainedCollection.__super__.slice.apply(this, arguments));
      return this;
    };

    ChainedCollection.prototype.sort = function() {
      this.models(ChainedCollection.__super__.sort.apply(this, arguments));
      return this;
    };

    ChainedCollection.prototype.filter = function() {
      this.models(ChainedCollection.__super__.filter.apply(this, arguments));
      return this;
    };

    ChainedCollection.prototype.without = function() {
      this.models(ChainedCollection.__super__.without.apply(this, arguments));
      return this;
    };

    return ChainedCollection;

  })(Falcon.Collection);

  ko.bindingHandlers['view'] = (function() {
    var getTemplate, getViewModel, makeTemplateValueAccessor, returnVal;
    makeTemplateValueAccessor = function(viewModel) {
      return function() {
        return {
          'data': viewModel,
          'templateEngine': ko.nativeTemplateEngine.instance
        };
      };
    };
    getViewModel = function(value) {
      var viewModel, _ref2;
      viewModel = {};
      if (value == null) {
        value = {};
      }
      if (value instanceof Falcon.View) {
        viewModel = value.viewModel();
      } else {
        viewModel = ko.utils.unwrapObservable((_ref2 = value.viewModel) != null ? _ref2 : {});
      }
      return viewModel;
    };
    getTemplate = function(value) {
      var template, _ref2;
      template = "";
      if (value == null) {
        value = {};
      }
      if (value instanceof Falcon.View) {
        template = value.template();
      } else {
        template = ko.utils.unwrapObservable((_ref2 = value.template) != null ? _ref2 : "");
      }
      return template;
    };
    returnVal = {
      controlsDescendantBindings: true
    };
    return {
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var container, oldViewModel, subscription, value;
        value = valueAccessor();
        if (ko.isSubscribable(value)) {
          oldViewModel = ko.utils.unwrapObservable(value);
          subscription = value.subscribe(function(newViewModel) {
            if (Falcon.isView(oldViewModel)) {
              oldViewModel._unrender();
            }
            return oldViewModel = newViewModel;
          });
          ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            if (Falcon.isView(oldViewModel)) {
              oldViewModel._unrender();
            }
            return subscription.dispose();
          });
        } else if (Falcon.isView(value)) {
          ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            return value._unrender();
          });
        }
        container = document.createElement('div');
        ko.utils.domData.set(element, "__falcon_view__container__", container);
        new ko.templateSources.anonymousTemplate(element)['nodes'](container);
        return returnVal;
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var childContext, container, template, value;
        value = valueAccessor();
        if (ko.isObservable(value)) {
          value = value();
        }
        viewModel = getViewModel(value);
        template = getTemplate(value);
        if (value == null) {
          ko.virtualElements.emptyNode(element);
        }
        if (!isObject(value)) {
          return returnVal;
        }
        if ((context != null ? context['__falcon_view__addChildView__'] : void 0) != null) {
          context['__falcon_view__addChildView__'](value);
        }
        childContext = context.createChildContext(viewModel).extend({
          '$view': viewModel
        });
        if (isEmpty(viewModel) || isEmpty(template)) {
          ko.virtualElements.emptyNode(element);
        } else if (!Falcon.isView(value) || ko.utils.unwrapObservable(value.is_loaded)) {
          container = ko.utils.domData.get(element, "__falcon_view__container__");
          container.innerHTML = template;
          ko.renderTemplate(element, childContext, {}, element);
          if (Falcon.isView(value)) {
            value._render();
          }
        }
        return returnVal;
      }
    };
  })();

  _getItems = function(value) {
    value = ko.utils.peekObservable(value);
    if (Falcon.isCollection(value) || isArray(value)) {
      value = {
        data: value
      };
    }
    if (!isObject(value)) {
      value = {};
    }
    value.data = ko.utils.unwrapObservable(value.data);
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

  _shouldUpdate = function(element, value) {
    var CId, changeCount, lastCId, lastChangeCount;
    if (!Falcon.isCollection(value)) {
      return true;
    }
    lastCId = ko.utils.domData.get(element, "__falcon_object__cid__");
    CId = value.__falcon_object__cid__;
    changeCount = value.__falcon_collection__change_count__;
    lastChangeCount = ko.utils.domData.get(element, "__falcon_collection___change_count__");
    if (lastChangeCount === changeCount && lastCId === CId) {
      return false;
    }
    ko.utils.domData.set(element, '__falcon_object__cid__', CId);
    ko.utils.domData.set(element, '__falcon_collection___change_count__', changeCount);
    return true;
  };

  _foreach = (_ref2 = ko.bindingHandlers['foreach']) != null ? _ref2 : {};

  ko.bindingHandlers['foreach'] = {
    'init': function() {
      var args, element, value, valueAccessor;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.utils.unwrapObservable(valueAccessor());
      ko.utils.domData.set(element, '__falcon_collection___change_count__', -1);
      return _foreach['init'].apply(_foreach, [element, _getItems(value)].concat(__slice.call(args)));
    },
    'update': function() {
      var args, element, value, valueAccessor;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.utils.unwrapObservable(valueAccessor());
      if (_shouldUpdate(element, value)) {
        return _foreach['update'].apply(_foreach, [element, _getItems(value)].concat(__slice.call(args)));
      }
    }
  };

  for (key in _foreach) {
    value = _foreach[key];
    if (!(key in ko.bindingHandlers['foreach'])) {
      ko.bindingHandlers['foreach'][key] = value;
    }
  }

  _options = (_ref3 = ko.bindingHandlers['options']) != null ? _ref3 : (function() {});

  ko.bindingHandlers['options'] = (function() {
    return {
      'init': function() {
        var args, element, valueAccessor, _ref4;
        element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        value = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.domData.set(element, '__falcon_collection___change_count__', -1);
        return ((_ref4 = _options['init']) != null ? _ref4 : (function() {})).apply(null, [element, _getItems(value)].concat(__slice.call(args)));
      },
      'update': function() {
        var args, element, valueAccessor, _ref4;
        element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        value = ko.utils.unwrapObservable(valueAccessor());
        if (_shouldUpdate(element, value)) {
          return ((_ref4 = _options['update']) != null ? _ref4 : (function() {})).apply(null, [element, _getItems(value)].concat(__slice.call(args)));
        }
      }
    };
  })();

  ko.bindingHandlers['log'] = {
    update: function(element, valueAccessor) {
      return console.log(ko.utils.unwrapObservable(valueAccessor()));
    }
  };

  ko.virtualElements.allowedBindings['view'] = true;

  ko.virtualElements.allowedBindings['log'] = true;

}).call(this);
