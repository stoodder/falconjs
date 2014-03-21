/*
	Falcon.js
	by Rick Allen (stoodder)

	Version 0.10.0
	Full source at https://github.com/stoodder/falconjs
	Copyright (c) 2013 Rick Allen, http://www.stoodder.com

	MIT License, https://github.com/stoodder/falconjs/blob/master/LICENSE.md
*/


(function() {
  var isArray, isBoolean, isElement, isEmpty, isFunction, isNaN, isNumber, isObject, isString, startsWith, trim;

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

  Falcon.addConductor = (function() {
    var returnVal, _conductor_count, _conductor_definitions, _conductors, _createConductorCallback, _evaluateAttributes, _preprocessor, _shouldEvaluateAttribute;
    _conductors = {};
    _conductor_count = 0;
    _conductor_definitions = {};
    _preprocessor = ko.bindingProvider.instance.preprocessNode;
    _createConductorCallback = function(node, callback) {
      var c1, c2, childContext, id, view;
      view = null;
      childContext = null;
      id = _conductor_count++;
      _conductor_definitions[id] = function(context, viewModel) {
        var attributes, bindingAccessors, _ref;
        childContext = context.createChildContext(viewModel);
        attributes = _evaluateAttributes(node, childContext);
        view = callback(node, attributes, childContext);
        childContext = childContext.extend({
          '$self': view
        });
        bindingAccessors = (_ref = ko.bindingProvider.instance.getBindingAccessors(node, childContext)) != null ? _ref : {};
        bindingAccessors['view'] = function() {
          return view;
        };
        return ko.applyBindingAccessorsToNode(node, bindingAccessors, childContext);
      };
      ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
        return delete _conductor_definitions[id];
      });
      node.parentNode.insertBefore(c1 = document.createComment("ko conductor_id: " + id), node);
      node.parentNode.insertBefore(c2 = document.createComment("/ko"), node.nextSibling);
      return [c1, c2];
    };
    _shouldEvaluateAttribute = function(value) {
      if (!isString(value)) {
        return false;
      }
      value = trim(value);
      if (value.indexOf("$self") === 0) {
        return true;
      }
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
      var attr, attributes, function_body, name, value, _i, _len, _ref;
      attributes = {};
      _ref = node.attributes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        attr = _ref[_i];
        if (!(attr.name.toLowerCase() !== "data-bind")) {
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
      var added, conductor, tag_name, _ref, _ref1;
      added = [];
      if ((node != null ? node.nodeType : void 0) === 1) {
        tag_name = trim((_ref = node.tagName) != null ? _ref : "").toLowerCase();
        conductor = _conductors[tag_name];
        if (conductor != null) {
          if (Falcon.isView(conductor.prototype)) {
            added = _createConductorCallback(node, function(node, attributes, childContext) {
              return new conductor(attributes);
            });
          } else if (isFunction(conductor)) {
            added = _createConductorCallback(node, function(node, attributes, childContext) {
              var viewModel;
              viewModel = childContext['$data'];
              return conductor(node, attributes, viewModel, childContext);
            });
          }
        }
      }
      added = ((_ref1 = _preprocessor != null ? _preprocessor.call(this, node) : void 0) != null ? _ref1 : []).concat(added);
      return (added.length > 0 ? added : null);
    };
    returnVal = {
      controlsDescendantBindings: true
    };
    Falcon.addBinding('conductor_id', true, {
      'init': function(element, valueAccessor, allBindings, viewModel, context) {
        var id;
        id = valueAccessor();
        if (typeof _conductor_definitions[id] === "function") {
          _conductor_definitions[id](context, viewModel);
        }
        return returnVal;
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
