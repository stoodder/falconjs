/*
	Falcon.js
	by Rick Allen (stoodder)

	Version 0.10.2
	Full source at https://github.com/stoodder/falconjs
	Copyright (c) 2013 Rick Allen, http://www.stoodder.com

	MIT License, https://github.com/stoodder/falconjs/blob/master/LICENSE.md
*/


(function() {
  var isArray, isBoolean, isElement, isEmpty, isFunction, isNaN, isNumber, isObject, isString, startsWith, trim,
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

  startsWith = function(haystack, needle) {
    return haystack.indexOf(needle) === 0;
  };

  Falcon.addConductor = (function() {
    var IGNORED_ATTRIBUTES, _conductor_count, _conductor_definitions, _conductors, _createConductorCallback, _evaluateAttributes, _preprocessor, _shouldEvaluateAttribute;
    IGNORED_ATTRIBUTES = ["data-bind"];
    _conductors = {};
    _conductor_count = 0;
    _conductor_definitions = {};
    _preprocessor = ko.bindingProvider.instance.preprocessNode;
    _createConductorCallback = function(node, callback) {
      var childContext, data_bind, id, _ref;
      childContext = null;
      id = _conductor_count++;
      _conductor_definitions[id] = function(parentBindingContext) {
        var bindingAccessors, view, _ref;
        view = null;
        bindingAccessors = (_ref = ko.bindingProvider.instance.getBindingAccessors(node, parentBindingContext)) != null ? _ref : {};
        bindingAccessors['view'] = function() {
          var attributes;
          if (view != null) {
            return view;
          }
          attributes = _evaluateAttributes(node, parentBindingContext);
          return (view = callback(node, attributes, parentBindingContext));
        };
        if ((bindingAccessors != null ? bindingAccessors['conductor'] : void 0) != null) {
          delete bindingAccessors['conductor'];
        }
        return ko.applyBindingAccessorsToNode(node, bindingAccessors, parentBindingContext);
      };
      ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
        return delete _conductor_definitions[id];
      });
      data_bind = trim((_ref = node.getAttribute("data-bind")) != null ? _ref : "");
      if (!isEmpty(data_bind)) {
        data_bind = "conductor: " + id + ", " + data_bind;
      } else {
        data_bind = "conductor: " + id;
      }
      return node.setAttribute("data-bind", data_bind);
    };
    _shouldEvaluateAttribute = function(value) {
      if (!isString(value)) {
        return false;
      }
      value = trim(value);
      if (value.indexOf("$view") === 0) {
        return true;
      }
      if (value.indexOf("$data") === 0) {
        return true;
      }
      if (value.indexOf("$root") === 0) {
        return true;
      }
      if (value.indexOf("$parent") === 0) {
        return true;
      }
      return false;
    };
    _evaluateAttributes = function(node, parentBindingContext) {
      var attr, attributes, function_body, name, value, _i, _len, _ref, _ref1;
      attributes = {};
      _ref = node.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!(!(_ref1 = attr.name.toLowerCase(), __indexOf.call(IGNORED_ATTRIBUTES, _ref1) >= 0))) {
          continue;
        }
        name = attr.name;
        value = attr.value;
        if (_shouldEvaluateAttribute(value)) {
          function_body = "with($context){with($data||{}){return " + value + ";}}";
          value = (new Function("$context", "$element", function_body))(parentBindingContext, node);
        }
        attributes[name] = value;
      }
      return attributes;
    };
    ko.bindingProvider.instance.preprocessNode = function(node) {
      var added, conductor, nodes, tag_name, _ref, _ref1;
      added = [];
      if ((node != null ? node.nodeType : void 0) === 1) {
        tag_name = trim((_ref = node.tagName) != null ? _ref : "").toLowerCase();
        conductor = _conductors[tag_name];
        if (conductor != null) {
          if (Falcon.isView(conductor.prototype)) {
            _createConductorCallback(node, function(node, attributes, childContext) {
              return new conductor(attributes);
            });
          } else if (isFunction(conductor)) {
            _createConductorCallback(node, function(node, attributes, childContext) {
              var viewModel;
              viewModel = childContext['$data'];
              return conductor(node, attributes, viewModel, childContext);
            });
          }
        }
      }
      nodes = (_ref1 = _preprocessor != null ? _preprocessor.call(this, node) : void 0) != null ? _ref1 : [];
      return (nodes.length > 0 ? nodes : null);
    };
    Falcon.addBinding('conductor', {
      'init': function(element, valueAccessor, allBindings, viewModel, context) {
        var id;
        id = valueAccessor();
        if (typeof _conductor_definitions[id] === "function") {
          _conductor_definitions[id](context);
        }
        return {
          controlsDescendantBindings: true
        };
      }
    });
    return function(tag_name, conductor) {
      tag_name = trim(tag_name).toLowerCase();
      document.createElement(tag_name);
      if (isObject(conductor) && !Falcon.isFalconObject(conductor)) {
        conductor = Falcon.View.extend(conductor);
      }
      _conductors[tag_name] = conductor;
      return Falcon;
    };
  })();

}).call(this);
