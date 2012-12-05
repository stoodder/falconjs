// Knockout JavaScript library v2.2.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(){
var DEBUG=true;
(function(window,document,navigator,jQuery,undefined){
!function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
	var tokens = koPath.split(".");

	// In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
	// At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
	var target = ko;

	for (var i = 0; i < tokens.length - 1; i++)
		target = target[tokens[i]];
	target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
  owner[publicName] = object;
};
ko.version = "2.2.0";

ko.exportSymbol('version', ko.version);
ko.utils = new (function () {
    var stringTrimRegex = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = /Firefox\/2/i.test(navigator.userAgent) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    for (var eventType in knownEvents) {
        var knownEventsForType = knownEvents[eventType];
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    }
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        );
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i]);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i]))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index >= 0)
                array.splice(index, 1);
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i]));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i]))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        extend: function (target, source) {
            if (source) {
                for(var prop in source) {
                    if(source.hasOwnProperty(prop)) {
                        target[prop] = source[prop];
                    }
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return (string || "").replace(stringTrimRegex, "");
        },

        stringTokenize: function (string, delimiter) {
            var result = [];
            var tokens = (string || "").split(delimiter);
            for (var i = 0, j = tokens.length; i < j; i++) {
                var trimmed = ko.utils.stringTrim(tokens[i]);
                if (trimmed !== "")
                    result.push(trimmed);
            }
            return result;
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node != null) {
                if (node == containedByNode)
                    return true;
                node = node.parentNode;
            }
            return false;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && typeof jQuery != "undefined") {
                if (isClickOnCheckableElement(element, eventType)) {
                    // For click events on checkboxes, jQuery interferes with the event handling in an awkward way:
                    // it toggles the element checked state *after* the click event handlers run, whereas native
                    // click events toggle the checked state *before* the event handler.
                    // Fix this by intecepting the handler and applying the correct checkedness before it runs.
                    var originalHandler = handler;
                    handler = function(event, eventData) {
                        var jQuerySuppliedCheckedState = this.checked;
                        if (eventData)
                            this.checked = eventData.checkedStateBeforeEvent !== true;
                        originalHandler.call(this, event);
                        this.checked = jQuerySuppliedCheckedState; // Restore the state jQuery applied
                    };
                }
                jQuery(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined")
                element.attachEvent("on" + eventType, function (event) {
                    handler.call(element, event);
                });
            else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            if (typeof jQuery != "undefined") {
                var eventData = [];
                if (isClickOnCheckableElement(element, eventType)) {
                    // Work around the jQuery "click events on checkboxes" issue described above by storing the original checked state before triggering the handler
                    eventData.push({ checkedStateBeforeEvent: element.checked });
                }
                jQuery(element)['trigger'](eventType, eventData);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (typeof element.fireEvent != "undefined") {
                // Unlike other browsers, IE doesn't change the checked state of checkboxes/radiobuttons when you trigger their "click" event
                // so to make it consistent, we'll do it manually here
                if (isClickOnCheckableElement(element, eventType))
                    element.checked = element.checked !== true;
                element.fireEvent("on" + eventType);
            }
            else
                throw new Error("Browser doesn't support triggering events");
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
            if (classNames) {
                var cssClassNameRegex = /[\w-]+/g,
                    currentClassNames = node.className.match(cssClassNameRegex) || [];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    var indexOfClass = ko.utils.arrayIndexOf(currentClassNames, className);
                    if (indexOfClass >= 0) {
                        if (!shouldHaveClass)
                            currentClassNames.splice(indexOfClass, 1);
                    } else {
                        if (shouldHaveClass)
                            currentClassNames.push(className);
                    }
                });
                node.className = currentClassNames.join(" ");
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            if (element.nodeType === 3) {
                element.data = value;
            } else {
                // We need there to be exactly one child: a text node.
                // If there are no children, more than one, or if it's not a text node,
                // we'll clear everything and create a single text node.
                var innerTextNode = ko.virtualElements.firstChild(element);
                if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                    ko.virtualElements.setDomNodeChildren(element, [document.createTextNode(value)]);
                } else {
                    innerTextNode.data = value;
                }

                ko.utils.forceRefresh(element);
            }
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            if (ieVersion >= 9) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (window.JSON && window.JSON.parse) // Use native parsing where available
                        return window.JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                var input = document.createElement("input");
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            for (var key in params) {
                var input = document.createElement("input");
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
})();

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};
    return {
        get: function (node, key) {
            var allDataForNode = ko.utils.domData.getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (ko.utils.domData.getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = ko.utils.domData.getAll(node, true);
            allDataForNode[key] = value;
        },
        getAll: function (node, createIfNotFound) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
            if (!hasExistingDataStore) {
                if (!createIfNotFound)
                    return undefined;
                dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
                dataStore[dataStoreKey] = {};
            }
            return dataStore[dataStoreKey];
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        }
    }
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Also erase the DOM data
        ko.utils.domData.clear(node);

        // Special support for jQuery here because it's so commonly used.
        // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
        // so notify it to tear down any resources associated with the node & descendants here.
        if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
            jQuery['cleanData']([node]);

        // Also clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        var elems = jQuery['clean']([html]);

        // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
        // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
        // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
        if (elems && elems[0]) {
            // Find the top-most parent element that's a direct child of a document fragment
            var elem = elems[0];
            while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                elem = elem.parentNode;
            // ... then detach it
            if (elem.parentNode)
                elem.parentNode.removeChild(elem);
        }

        return elems;
    }

    ko.utils.parseHtmlFragment = function(html) {
        return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                                            : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (typeof jQuery != 'undefined') {
                jQuery(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always"
            ? function() { return false } // Treat all values as not equal
            : ko.observable["fn"]["equalityComparer"];
        return target;
    }
};

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        for (var key in requestedExtenders) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, requestedExtenders[key]);
            }
        }
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    this._subscriptions = {};

    ko.utils.extend(this, ko.subscribable['fn']);
    ko.exportProperty(this, 'subscribe', this.subscribe);
    ko.exportProperty(this, 'extend', this.extend);
    ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
}

var defaultEvent = "change";

ko.subscribable['fn'] = {
    subscribe: function (callback, callbackTarget, event) {
        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(this, boundCallback, function () {
            ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
        }.bind(this));

        if (!this._subscriptions[event])
            this._subscriptions[event] = [];
        this._subscriptions[event].push(subscription);
        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this._subscriptions[event]) {
            ko.dependencyDetection.ignore(function() {
                ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (subscription && (subscription.isDisposed !== true))
                        subscription.callback(valueToNotify);
                });
            }, this);
        }
    },

    getSubscriptionsCount: function () {
        var total = 0;
        for (var eventName in this._subscriptions) {
            if (this._subscriptions.hasOwnProperty(eventName))
                total += this._subscriptions[eventName].length;
        }
        return total;
    },

    extend: applyExtenders
};


ko.isSubscribable = function (instance) {
    return typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.dependencyDetection = (function () {
    var _frames = [];

    return {
        begin: function (callback) {
            _frames.push({ callback: callback, distinctDependencies:[] });
        },

        end: function () {
            _frames.pop();
        },

        registerDependency: function (subscribable) {
            if (!ko.isSubscribable(subscribable))
                throw new Error("Only subscribable things can act as dependencies");
            if (_frames.length > 0) {
                var topFrame = _frames[_frames.length - 1];
                if (!topFrame || ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
                    return;
                topFrame.distinctDependencies.push(subscribable);
                topFrame.callback(subscribable);
            }
        },

        ignore: function(callback, callbackTarget, callbackArgs) {
            try {
                _frames.push(null);
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                _frames.pop();
            }
        }
    };
})();
var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true };

ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    if (DEBUG) observable._latestValue = _latestValue;
    ko.subscribable.call(observable);
    observable.peek = function() { return _latestValue };
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
    ko.utils.extend(observable, ko.observable['fn']);

    ko.exportProperty(observable, 'peek', observable.peek);
    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
        var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
        return oldValueIsPrimitive ? (a === b) : false;
    }
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    if (arguments.length == 0) {
        // Zero-parameter constructor initializes to empty array
        initialValues = [];
    }
    if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.extend(result, ko.observableArray['fn']);
    return result;
}

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    }
}

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

ko.exportSymbol('observableArray', ko.observableArray);
ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _hasBeenEvaluated = false,
        _isBeingEvaluated = false,
        readFunction = evaluatorFunctionOrOptions;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    function addSubscriptionToDependency(subscribable) {
        _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync));
    }

    function disposeAllSubscriptionsToDependencies() {
        ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = [];
    }

    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else
            evaluateImmediate();
    }

    function evaluateImmediate() {
        if (_isBeingEvaluated) {
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Don't dispose on first evaluation, because the "disposeWhen" callback might
        // e.g., dispose when the associated DOM element isn't in the doc, and it's not
        // going to be in the doc until *after* the first evaluation
        if (_hasBeenEvaluated && disposeWhen()) {
            dispose();
            return;
        }

        _isBeingEvaluated = true;
        try {
            // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
            // Then, during evaluation, we cross off any that are in fact still being used.
            var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {return item.target;});

            ko.dependencyDetection.begin(function(subscribable) {
                var inOld;
                if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0)
                    disposalCandidates[inOld] = undefined; // Don't want to dispose this subscription, as it's still being used
                else
                    addSubscriptionToDependency(subscribable); // Brand new subscription - add it
            });

            var newValue = readFunction.call(evaluatorFunctionTarget);

            // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
            for (var i = disposalCandidates.length - 1; i >= 0; i--) {
                if (disposalCandidates[i])
                    _subscriptionsToDependencies.splice(i, 1)[0].dispose();
            }
            _hasBeenEvaluated = true;

            dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
            _latestValue = newValue;
            if (DEBUG) dependentObservable._latestValue = _latestValue;
        } finally {
            ko.dependencyDetection.end();
        }

        dependentObservable["notifySubscribers"](_latestValue);
        _isBeingEvaluated = false;
        if (!_subscriptionsToDependencies.length)
            dispose();
    }

    function dependentObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            if (!_hasBeenEvaluated)
                evaluateImmediate();
            ko.dependencyDetection.registerDependency(dependentObservable);
            return _latestValue;
        }
    }

    function peek() {
        if (!_hasBeenEvaluated)
            evaluateImmediate();
        return _latestValue;
    }

    function isActive() {
        return !_hasBeenEvaluated || _subscriptionsToDependencies.length > 0;
    }

    // By here, "options" is always non-null
    var writeFunction = options["write"],
        disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhen = options["disposeWhen"] || options.disposeWhen || function() { return false; },
        dispose = disposeAllSubscriptionsToDependencies,
        _subscriptionsToDependencies = [],
        evaluationTimeoutInstance = null;

    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    dependentObservable.peek = peek;
    dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };
    dependentObservable.isActive = isActive;

    ko.subscribable.call(dependentObservable);
    ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

    ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    // Evaluate, unless deferEvaluation is true
    if (options['deferEvaluation'] !== true)
        evaluateImmediate();

    // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values.
    // But skip if isActive is false (there will never be any dependencies to dispose).
    // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
    // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
    if (disposeWhenNodeIsRemoved && isActive()) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, arguments.callee);
            disposeAllSubscriptionsToDependencies();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
        var existingDisposeWhenFunction = disposeWhen;
        disposeWhen = function () {
            return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || existingDisposeWhenFunction();
        }
    }

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject)
                visitorCallback(propertyName);
        }
    };

    function objectLookup() {
        var keys = [];
        var values = [];
        this.save = function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            if (existingIndex >= 0)
                values[existingIndex] = value;
            else {
                keys.push(key);
                values.push(value);
            }
        };
        this.get = function(key) {
            var existingIndex = ko.utils.arrayIndexOf(keys, key);
            return (existingIndex >= 0) ? values[existingIndex] : undefined;
        };
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    for (var i = element.options.length - 1; i >= 0; i--) {
                        if (ko.selectExtensions.readValue(element.options[i]) == value) {
                            element.selectedIndex = i;
                            break;
                        }
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var restoreCapturedTokensRegex = /\@ko_token_(\d+)\@/g;
    var javaScriptReservedWords = ["true", "false"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function restoreTokens(string, tokens) {
        var prevValue = null;
        while (string != prevValue) { // Keep restoring tokens until it no longer makes a difference (they may be nested)
            prevValue = string;
            string = string.replace(restoreCapturedTokensRegex, function (match, tokenIndex) {
                return tokens[tokenIndex];
            });
        }
        return string;
    }

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, ko.utils.stringTrim(expression).toLowerCase()) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    function ensureQuoted(key) {
        var trimmedKey = ko.utils.stringTrim(key);
        switch (trimmedKey.length && trimmedKey.charAt(0)) {
            case "'":
            case '"':
                return key;
            default:
                return "'" + trimmedKey + "'";
        }
    }

    return {
        bindingRewriteValidators: [],

        parseObjectLiteral: function(objectLiteralString) {
            // A full tokeniser+lexer would add too much weight to this library, so here's a simple parser
            // that is sufficient just to split an object literal string into a set of top-level key-value pairs

            var str = ko.utils.stringTrim(objectLiteralString);
            if (str.length < 3)
                return [];
            if (str.charAt(0) === "{")// Ignore any braces surrounding the whole object literal
                str = str.substring(1, str.length - 1);

            // Pull out any string literals and regex literals
            var tokens = [];
            var tokenStart = null, tokenEndChar;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case '"':
                        case "'":
                        case "/":
                            tokenStart = position;
                            tokenEndChar = c;
                            break;
                    }
                } else if ((c == tokenEndChar) && (str.charAt(position - 1) !== "\\")) {
                    var token = str.substring(tokenStart, position + 1);
                    tokens.push(token);
                    var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                    str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                    position -= (token.length - replacement.length);
                    tokenStart = null;
                }
            }

            // Next pull out balanced paren, brace, and bracket blocks
            tokenStart = null;
            tokenEndChar = null;
            var tokenDepth = 0, tokenStartChar = null;
            for (var position = 0; position < str.length; position++) {
                var c = str.charAt(position);
                if (tokenStart === null) {
                    switch (c) {
                        case "{": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "}";
                                  break;
                        case "(": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = ")";
                                  break;
                        case "[": tokenStart = position; tokenStartChar = c;
                                  tokenEndChar = "]";
                                  break;
                    }
                }

                if (c === tokenStartChar)
                    tokenDepth++;
                else if (c === tokenEndChar) {
                    tokenDepth--;
                    if (tokenDepth === 0) {
                        var token = str.substring(tokenStart, position + 1);
                        tokens.push(token);
                        var replacement = "@ko_token_" + (tokens.length - 1) + "@";
                        str = str.substring(0, tokenStart) + replacement + str.substring(position + 1);
                        position -= (token.length - replacement.length);
                        tokenStart = null;
                    }
                }
            }

            // Now we can safely split on commas to get the key/value pairs
            var result = [];
            var keyValuePairs = str.split(",");
            for (var i = 0, j = keyValuePairs.length; i < j; i++) {
                var pair = keyValuePairs[i];
                var colonPos = pair.indexOf(":");
                if ((colonPos > 0) && (colonPos < pair.length - 1)) {
                    var key = pair.substring(0, colonPos);
                    var value = pair.substring(colonPos + 1);
                    result.push({ 'key': restoreTokens(key, tokens), 'value': restoreTokens(value, tokens) });
                } else {
                    result.push({ 'unknown': restoreTokens(pair, tokens) });
                }
            }
            return result;
        },

        preProcessBindings: function (objectLiteralStringOrKeyValueArray) {
            var keyValueArray = typeof objectLiteralStringOrKeyValueArray === "string"
                ? ko.expressionRewriting.parseObjectLiteral(objectLiteralStringOrKeyValueArray)
                : objectLiteralStringOrKeyValueArray;
            var resultStrings = [], propertyAccessorResultStrings = [];

            var keyValueEntry;
            for (var i = 0; keyValueEntry = keyValueArray[i]; i++) {
                if (resultStrings.length > 0)
                    resultStrings.push(",");

                if (keyValueEntry['key']) {
                    var quotedKey = ensureQuoted(keyValueEntry['key']), val = keyValueEntry['value'];
                    resultStrings.push(quotedKey);
                    resultStrings.push(":");
                    resultStrings.push(val);

                    if (val = getWriteableValue(ko.utils.stringTrim(val))) {
                        if (propertyAccessorResultStrings.length > 0)
                            propertyAccessorResultStrings.push(", ");
                        propertyAccessorResultStrings.push(quotedKey + " : function(__ko_value) { " + val + " = __ko_value; }");
                    }
                } else if (keyValueEntry['unknown']) {
                    resultStrings.push(keyValueEntry['unknown']);
                }
            }

            var combinedResult = resultStrings.join("");
            if (propertyAccessorResultStrings.length > 0) {
                var allPropertyAccessors = propertyAccessorResultStrings.join("");
                combinedResult = combinedResult + ", '_ko_property_writers' : { " + allPropertyAccessors + " } ";
            }

            return combinedResult;
        },

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (ko.utils.stringTrim(keyValueArray[i]['key']) == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindingsAccessor: All bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindingsAccessor, key, value, checkIfDifferent) {
            if (!property || !ko.isWriteableObservable(property)) {
                var propWriters = allBindingsAccessor()['_ko_property_writers'];
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (!checkIfDifferent || property.peek() !== value) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*-->$/ : /^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(endCommentRegex);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        virtualNodeBindingValue: function(node) {
            var regexMatch = isStartComment(node);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node) != null; // Comment node
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext);
            return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                throw new Error("Unable to parse bindings.\nMessage: " + ex + ";\nBindings value: " + bindingsString);
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache) {
        var cacheKey = bindingsString;
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString));
    }

    function createBindingsStringEvaluator(bindingsString) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    ko.bindingContext = function(dataItem, parentBindingContext, dataItemAlias) {
        if (parentBindingContext) {
            ko.utils.extend(this, parentBindingContext); // Inherit $root and any custom properties
            this['$parentContext'] = parentBindingContext;
            this['$parent'] = parentBindingContext['$data'];
            this['$parents'] = (parentBindingContext['$parents'] || []).slice(0);
            this['$parents'].unshift(this['$parent']);
        } else {
            this['$parents'] = [];
            this['$root'] = dataItem;
            // Export 'ko' in the binding context so it will be available in bindings and templates
            // even if 'ko' isn't exported as a global, such as when using an AMD loader.
            // See https://github.com/SteveSanderson/knockout/issues/490
            this['ko'] = ko;
        }
        this['$data'] = dataItem;
        if (dataItemAlias)
            this[dataItemAlias] = dataItem;
    }
    ko.bindingContext.prototype['createChildContext'] = function (dataItem, dataItemAlias) {
        return new ko.bindingContext(dataItem, this, dataItemAlias);
    };
    ko.bindingContext.prototype['extend'] = function(properties) {
        var clone = ko.utils.extend(new ko.bindingContext(), this);
        return ko.utils.extend(clone, properties);
    };

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (viewModel, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild, nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(viewModel, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (viewModel, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, viewModel, bindingContextMayDifferFromDomParentElement).shouldBindDescendants;

        if (shouldBindDescendants) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(viewModel, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    function applyBindingsToNodeInternal (node, bindings, viewModelOrBindingContext, bindingContextMayDifferFromDomParentElement) {
        // Need to be sure that inits are only run once, and updates never run until all the inits have been run
        var initPhase = 0; // 0 = before all inits, 1 = during inits, 2 = after all inits

        // Each time the dependentObservable is evaluated (after data changes),
        // the binding attribute is reparsed so that it can pick out the correct
        // model properties in the context of the changed data.
        // DOM event callbacks need to be able to access this changed data,
        // so we need a single parsedBindings variable (shared by all callbacks
        // associated with this node's bindings) that all the closures can access.
        var parsedBindings;
        function makeValueAccessor(bindingKey) {
            return function () { return parsedBindings[bindingKey] }
        }
        function parsedBindingsAccessor() {
            return parsedBindings;
        }

        var bindingHandlerThatControlsDescendantBindings;
        ko.dependentObservable(
            function () {
                // Ensure we have a nonnull binding context to work with
                var bindingContextInstance = viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
                    ? viewModelOrBindingContext
                    : new ko.bindingContext(ko.utils.unwrapObservable(viewModelOrBindingContext));
                var viewModel = bindingContextInstance['$data'];

                // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
                // we can easily recover it just by scanning up the node's ancestors in the DOM
                // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
                if (bindingContextMayDifferFromDomParentElement)
                    ko.storedBindingContextForNode(node, bindingContextInstance);

                // Use evaluatedBindings if given, otherwise fall back on asking the bindings provider to give us some bindings
                var evaluatedBindings = (typeof bindings == "function") ? bindings(bindingContextInstance, node) : bindings;
                parsedBindings = evaluatedBindings || ko.bindingProvider['instance']['getBindings'](node, bindingContextInstance);

                if (parsedBindings) {
                    // First run all the inits, so bindings can register for notification on changes
                    if (initPhase === 0) {
                        initPhase = 1;
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && node.nodeType === 8)
                                validateThatBindingIsAllowedForVirtualElements(bindingKey);

                            if (binding && typeof binding["init"] == "function") {
                                var handlerInitFn = binding["init"];
                                var initResult = handlerInitFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);

                                // If this binding handler claims to control descendant bindings, make a note of this
                                if (initResult && initResult['controlsDescendantBindings']) {
                                    if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                        throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                    bindingHandlerThatControlsDescendantBindings = bindingKey;
                                }
                            }
                        }
                        initPhase = 2;
                    }

                    // ... then run all the updates, which might trigger changes even on the first evaluation
                    if (initPhase === 2) {
                        for (var bindingKey in parsedBindings) {
                            var binding = ko.bindingHandlers[bindingKey];
                            if (binding && typeof binding["update"] == "function") {
                                var handlerUpdateFn = binding["update"];
                                handlerUpdateFn(node, makeValueAccessor(bindingKey), parsedBindingsAccessor, viewModel, bindingContextInstance);
                            }
                        }
                    }
                }
            },
            null,
            { disposeWhenNodeIsRemoved : node }
        );

        return {
            shouldBindDescendants: bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = "__ko_bindingContext__";
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2)
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
        else
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
    }

    ko.applyBindingsToNode = function (node, bindings, viewModel) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, viewModel, true);
    };

    ko.applyBindingsToDescendants = function(viewModel, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(viewModel, rootNode, true);
    };

    ko.applyBindings = function (viewModel, rootNode) {
        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(viewModel, rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        for (var attrName in value) {
            if (typeof attrName == "string") {
                var attrValue = ko.utils.unwrapObservable(value[attrName]);

                // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
                // when someProp is a "no value"-like value (strictly null, false, or undefined)
                // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
                var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
                if (toRemove)
                    element.removeAttribute(attrName);

                // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
                // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
                // but instead of figuring out the mode, we'll just set the attribute through the Javascript
                // property for IE <= 8.
                if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                    attrName = attrHtmlToJavascriptMap[attrName];
                    if (toRemove)
                        element.removeAttribute(attrName);
                    else
                        element[attrName] = attrValue;
                } else if (!toRemove) {
                    element.setAttribute(attrName, attrValue.toString());
                }

                // Treat "name" specially - although you can think of it as an attribute, it also needs
                // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
                // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
                // entirely, and there's no strong reason to allow for such casing in HTML.
                if (attrName === "name") {
                    ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
                }
            }
        }
    }
};
ko.bindingHandlers['checked'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        var updateHandler = function() {
            var valueToWrite;
            if (element.type == "checkbox") {
                valueToWrite = element.checked;
            } else if ((element.type == "radio") && (element.checked)) {
                valueToWrite = element.value;
            } else {
                return; // "checked" binding only responds to checkboxes and selected radio buttons
            }

            var modelValue = valueAccessor(), unwrappedValue = ko.utils.unwrapObservable(modelValue);
            if ((element.type == "checkbox") && (unwrappedValue instanceof Array)) {
                // For checkboxes bound to an array, we add/remove the checkbox value to that array
                // This works for both observable and non-observable arrays
                var existingEntryIndex = ko.utils.arrayIndexOf(unwrappedValue, element.value);
                if (element.checked && (existingEntryIndex < 0))
                    modelValue.push(element.value);
                else if ((!element.checked) && (existingEntryIndex >= 0))
                    modelValue.splice(existingEntryIndex, 1);
            } else {
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'checked', valueToWrite, true);
            }
        };
        ko.utils.registerEventHandler(element, "click", updateHandler);

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if ((element.type == "radio") && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });
    },
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        if (element.type == "checkbox") {
            if (value instanceof Array) {
                // When bound to an array, the checkbox being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(value, element.value) >= 0;
            } else {
                // When bound to anything other value (not an array), the checkbox being checked represents the value being trueish
                element.checked = value;
            }
        } else if (element.type == "radio") {
            element.checked = (element.value == value);
        }
    }
};
var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (typeof value == "object") {
            for (var className in value) {
                var shouldHaveClass = ko.utils.unwrapObservable(value[className]);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            }
        } else {
            value = String(value || ''); // Make sure we don't try to store or set a non-string value
            ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
            element[classesWrittenByBindingKey] = value;
            ko.utils.toggleDomNodeCssClass(element, value, true);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindingsAccessor, viewModel);
        }
    }
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var eventsToHandle = valueAccessor() || {};
        for(var eventNameOutsideClosure in eventsToHandle) {
            (function() {
                var eventName = eventNameOutsideClosure; // Separate variable to be captured by event handler closure
                if (typeof eventName == "string") {
                    ko.utils.registerEventHandler(element, eventName, function (event) {
                        var handlerReturnValue;
                        var handlerFunction = valueAccessor()[eventName];
                        if (!handlerFunction)
                            return;
                        var allBindings = allBindingsAccessor();

                        try {
                            // Take all the event args, and prefix with the viewmodel
                            var argsForHandler = ko.utils.makeArray(arguments);
                            argsForHandler.unshift(viewModel);
                            handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                        } finally {
                            if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                                if (event.preventDefault)
                                    event.preventDefault();
                                else
                                    event.returnValue = false;
                            }
                        }

                        var bubble = allBindings[eventName + 'Bubble'] !== false;
                        if (!bubble) {
                            event.cancelBubble = true;
                            if (event.stopPropagation)
                                event.stopPropagation();
                        }
                    });
                }
            })();
        }
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindingsAccessor, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindingsAccessor) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                isFocused = (ownerDoc.activeElement === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'hasfocus', isFocused, true);
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (!element[hasfocusUpdatingProperty]) {
            value ? element.focus() : element.blur();
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
        }
    }
};
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
var withIfDomDataKey = '__ko_withIfBindingData';
// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.utils.domData.set(element, withIfDomDataKey, {});
            return { 'controlsDescendantBindings': true };
        },
        'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var withIfData = ko.utils.domData.get(element, withIfDomDataKey),
                dataValue = ko.utils.unwrapObservable(valueAccessor()),
                shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                isFirstRender = !withIfData.savedNodes,
                needsRefresh = isFirstRender || isWith || (shouldDisplay !== withIfData.didDisplayOnLastUpdate);

            if (needsRefresh) {
                if (isFirstRender) {
                    withIfData.savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                }

                if (shouldDisplay) {
                    if (!isFirstRender) {
                        ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(withIfData.savedNodes));
                    }
                    ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                } else {
                    ko.virtualElements.emptyNode(element);
                }

                withIfData.didDisplayOnLastUpdate = shouldDisplay;
            }
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */, false /* isNot */,
    function(bindingContext, dataValue) {
        return bindingContext['createChildContext'](dataValue);
    }
);
function ensureDropdownSelectionIsConsistentWithModelValue(element, modelValue, preferModelValue) {
    if (preferModelValue) {
        if (modelValue !== ko.selectExtensions.readValue(element))
            ko.selectExtensions.writeValue(element, modelValue);
    }

    // No matter which direction we're syncing in, we want the end result to be equality between dropdown value and model value.
    // If they aren't equal, either we prefer the dropdown value, or the model value couldn't be represented, so either way,
    // change the model value to match the dropdown.
    if (modelValue !== ko.selectExtensions.readValue(element))
        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
};

ko.bindingHandlers['options'] = {
    'update': function (element, valueAccessor, allBindingsAccessor) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousSelectedValues = ko.utils.arrayMap(ko.utils.arrayFilter(element.childNodes, function (node) {
            return node.tagName && (ko.utils.tagNameLower(node) === "option") && node.selected;
        }), function (node) {
            return ko.selectExtensions.readValue(node) || node.innerText || node.textContent;
        });
        var previousScrollTop = element.scrollTop;

        var value = ko.utils.unwrapObservable(valueAccessor());
        var selectedValue = element.value;

        // Remove all existing <option>s.
        // Need to use .remove() rather than .removeChild() for <option>s otherwise IE behaves oddly (https://github.com/SteveSanderson/knockout/issues/134)
        while (element.length > 0) {
            ko.cleanNode(element.options[0]);
            element.remove(0);
        }

        if (value) {
            var allBindings = allBindingsAccessor(),
                includeDestroyed = allBindings['optionsIncludeDestroyed'];

            if (typeof value.length != "number")
                value = [value];
            if (allBindings['optionsCaption']) {
                var option = document.createElement("option");
                ko.utils.setHtml(option, allBindings['optionsCaption']);
                ko.selectExtensions.writeValue(option, undefined);
                element.appendChild(option);
            }

            for (var i = 0, j = value.length; i < j; i++) {
                // Skip destroyed items
                var arrayEntry = value[i];
                if (arrayEntry && arrayEntry['_destroy'] && !includeDestroyed)
                    continue;

                var option = document.createElement("option");

                function applyToObject(object, predicate, defaultValue) {
                    var predicateType = typeof predicate;
                    if (predicateType == "function")    // Given a function; run it against the data value
                        return predicate(object);
                    else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                        return object[predicate];
                    else                                // Given no optionsText arg; use the data value itself
                        return defaultValue;
                }

                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings['optionsValue'], arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings['optionsText'], optionValue);
                ko.utils.setTextContent(option, optionText);

                element.appendChild(option);
            }

            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            var newOptions = element.getElementsByTagName("option");
            var countSelectionsRetained = 0;
            for (var i = 0, j = newOptions.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[i])) >= 0) {
                    ko.utils.setOptionNodeSelectionState(newOptions[i], true);
                    countSelectionsRetained++;
                }
            }

            element.scrollTop = previousScrollTop;

            if (selectWasPreviouslyEmpty && ('value' in allBindings)) {
                // Ensure consistency between model value and selected option.
                // If the dropdown is being populated for the first time here (or was otherwise previously empty),
                // the dropdown selection state is meaningless, so we preserve the model value.
                ensureDropdownSelectionIsConsistentWithModelValue(element, ko.utils.peekObservable(allBindings['value']), /* preferModelValue */ true);
            }

            // Workaround for IE9 bug
            ko.utils.ensureSelectElementIsRenderedCorrectly(element);
        }
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = '__ko.optionValueDomData__';
ko.bindingHandlers['selectedOptions'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindingsAccessor, 'value', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                ko.utils.setOptionNodeSelectionState(node, isSelected);
            });
        }
    }
};
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        for (var styleName in value) {
            if (typeof styleName == "string") {
                var styleValue = ko.utils.unwrapObservable(value[styleName]);
                element.style[styleName] = styleValue || ""; // Empty string removes the value, whereas null/undefined have no effect
            }
        }
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(viewModel, element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
    'init': function (element, valueAccessor, allBindingsAccessor) {
        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindingsAccessor()["valueUpdate"];
        var propertyChangedFired = false;
        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindingsAccessor, 'value', elementValue);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() { setTimeout(valueUpdateHandler, 0) };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });
    },
    'update': function (element, valueAccessor) {
        var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
        var newValue = ko.utils.unwrapObservable(valueAccessor());
        var elementValue = ko.selectExtensions.readValue(element);
        var valueHasChanged = (newValue != elementValue);

        // JavaScript's 0 == "" behavious is unfortunate here as it prevents writing 0 to an empty text box (loose equality suggests the values are the same).
        // We don't want to do a strict equality comparison as that is more confusing for developers in certain cases, so we specifically special case 0 != "" here.
        if ((newValue === 0) && (elementValue !== 0) && (elementValue !== "0"))
            valueHasChanged = true;

        if (valueHasChanged) {
            var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
            applyValueAction();

            // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
            // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
            // to apply the value as well.
            var alsoApplyAsynchronously = valueIsSelectOption;
            if (alsoApplyAsynchronously)
                setTimeout(applyValueAction, 0);
        }

        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
        // because you're not allowed to have a model value that disagrees with a visible UI selection.
        if (valueIsSelectOption && (element.length > 0))
            ensureDropdownSelectionIsConsistentWithModelValue(element, newValue, /* preferModelValue */ false);
    }
};
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray);

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()})";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[6], /* tagToRetain: */ arguments[1], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                if (domNode.nextSibling)
                    ko.applyBindingsToNode(domNode.nextSibling, bindings, bindingContext);
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, "templateSourceData_" + key);
        } else {
            ko.utils.domData.set(this.domElement, "templateSourceData_" + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = "__ko_anon_template__";
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            if (node.nodeType === 1 || node.nodeType === 8)
                action(node);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0], lastNode = continuousNodeArray[continuousNodeArray.length - 1];

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeOrCommentInContinuousRange(firstNode, lastNode, function(node) {
                ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
        }

        return renderedNodesArray;
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    // Support selecting template as a function of the data being rendered
                    var templateName = typeof(template) == 'function' ? template(bindingContext['$data'], bindingContext) : template;

                    var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](ko.utils.unwrapObservable(arrayValue), options['as']);
            arrayItemContext['$index'] = index;
            var templateName = typeof(template) == 'function' ? template(arrayValue, arrayItemContext) : template;
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

        }, null, { disposeWhenNodeIsRemoved: targetNode });
    };

    var templateComputedDomDataKey = '__ko__templateComputedDomDataKey__';
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if ((typeof bindingValue != "string") && (!bindingValue['name']) && (element.nodeType == 1 || element.nodeType == 8)) {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = element.nodeType == 1 ? element.childNodes : ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var templateName = ko.utils.unwrapObservable(valueAccessor()),
                options = {},
                shouldDisplay = true,
                dataValue,
                templateComputed = null;

            if (typeof templateName != "string") {
                options = templateName;
                templateName = options['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

                dataValue = ko.utils.unwrapObservable(options['data']);
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = ('data' in options) ?
                    bindingContext['createChildContext'](dataValue, options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                    bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, dontLimitMoves) {
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length <= newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, dontLimitMoves);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, dontLimitMoves);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, dontLimitMoves) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                editScript.push({
                    'status': "retained",
                    'value': bigArray[--bigIndex] });
                --smlIndex;
            }
        }

        if (notInSml.length && notInBig.length) {
            // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
            // smlIndexMax keeps the time complexity of this algorithm linear.
            var limitFailedCompares = smlIndexMax * 10, failedCompares,
                a, d, notInSmlItem, notInBigItem;
            // Go through the items that have been added and deleted and try to find matches between them.
            for (failedCompares = a = 0; (dontLimitMoves || failedCompares < limitFailedCompares) && (notInSmlItem = notInSml[a]); a++) {
                for (d = 0; notInBigItem = notInBig[d]; d++) {
                    if (notInSmlItem['value'] === notInBigItem['value']) {
                        notInSmlItem['moved'] = notInBigItem['index'];
                        notInBigItem['moved'] = notInSmlItem['index'];
                        notInBig.splice(d,1);       // This item is marked as moved; so remove it from notInBig list
                        failedCompares = d = 0;     // Reset failed compares count because we're checking for consecutive failures
                        break;
                    }
                }
                failedCompares += d;
            }
        }
        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function fixUpNodesToBeMovedOrRemoved(contiguousNodeArray) {
        // Before moving, deleting, or replacing a set of nodes that were previously outputted by the "map" function, we have to reconcile
        // them against what is in the DOM right now. It may be that some of the nodes have already been removed from the document,
        // or that new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
        // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
        // So, this function translates the old "map" output array into its best guess of what set of current DOM nodes should be removed.
        //
        // Rules:
        //   [A] Any leading nodes that aren't in the document any more should be ignored
        //       These most likely correspond to memoization nodes that were already removed during binding
        //       See https://github.com/SteveSanderson/knockout/pull/440
        //   [B] We want to output a contiguous series of nodes that are still in the document. So, ignore any nodes that
        //       have already been removed, and include any nodes that have been inserted among the previous collection

        // Rule [A]
        while (contiguousNodeArray.length && !ko.utils.domNodeIsAttachedToDocument(contiguousNodeArray[0]))
            contiguousNodeArray.splice(0, 1);

        // Rule [B]
        if (contiguousNodeArray.length > 1) {
            // Build up the actual new contiguous node set
            var current = contiguousNodeArray[0], last = contiguousNodeArray[contiguousNodeArray.length - 1], newContiguousSet = [current];
            while (current !== last) {
                current = current.nextSibling;
                if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                    return;
                newContiguousSet.push(current);
            }

            // ... then mutate the input array to match this.
            // (The following line replaces the contents of contiguousNodeArray with newContiguousSet)
            Array.prototype.splice.apply(contiguousNodeArray, [0, contiguousNodeArray.length].concat(newContiguousSet));
        }
        return contiguousNodeArray;
    }

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(fixUpNodesToBeMovedOrRemoved(mappedNodes), newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.splice(0, mappedNodes.length);
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return (mappedNodes.length == 0) || !ko.utils.domNodeIsAttachedToDocument(mappedNodes[0]) } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = "setDomNodeChildrenFromArrayMapping_lastMappingResult";

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var newMappingResultIndex = 0;

        var nodesToDelete = [];
        var itemsToProcess = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;

        function itemMovedOrRetained(editScriptIndex, oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (newMappingResultIndex !== oldPosition)
                itemsForMoveCallbacks[editScriptIndex] = mapData;
            // Since updating the index might change the nodes, do so before calling fixUpNodesToBeMovedOrRemoved
            mapData.indexObservable(newMappingResultIndex++);
            fixUpNodesToBeMovedOrRemoved(mapData.mappedNodes);
            newMappingResult.push(mapData);
            itemsToProcess.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                        ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                            callback(node, i, items[i].arrayEntry);
                        });
                    }
                }
            }
        }

        for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
            movedIndex = editScriptItem['moved'];
            switch (editScriptItem['status']) {
                case "deleted":
                    if (movedIndex === undefined) {
                        mapData = lastMappingResult[lastMappingResultIndex];

                        // Stop tracking changes to the mapping for these nodes
                        if (mapData.dependentObservable)
                            mapData.dependentObservable.dispose();

                        // Queue these nodes for later removal
                        nodesToDelete.push.apply(nodesToDelete, fixUpNodesToBeMovedOrRemoved(mapData.mappedNodes));
                        if (options['beforeRemove']) {
                            itemsForBeforeRemoveCallbacks[i] = mapData;
                            itemsToProcess.push(mapData);
                        }
                    }
                    lastMappingResultIndex++;
                    break;

                case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;

                case "added":
                    if (movedIndex !== undefined) {
                        itemMovedOrRetained(i, movedIndex);
                    } else {
                        mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                        if (!isFirstExecution)
                            itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
            }
        }

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                if (node !== nextNode)
                    ko.virtualElements.insertAfter(domNode, node, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
            }
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQuery['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQuery['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "</script>");
        };

        if (jQueryTmplVersion > 0) {
            jQuery['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQuery['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
});
})(window,document,navigator,window["jQuery"]);
})();


/*
	Falcon.js
	by Rick Allen (stoodder)

	Version 0.1.0
	Full source at https://github.com/stoodder/falconjs
	Copyright (c) 2011 RokkinCat, http://www.rokkincat.com

	MIT License, https://github.com/stoodder/falconjs/blob/master/LICENSE.md
	This file is generated by `cake build`, do not edit it by hand.
*/

(function() {
  var $document, $window, Falcon, arrayContains, arrayPeek, arrayRemove, arrayUnique, arraysEqual, compact, countSubstrings, defer, delay, endsWith, extend, findKey, isArray, isBoolean, isEmpty, isFunction, isNumber, isObject, isString, key, objectKeys, objectValues, objectsEqual, startsWith, trim, trimSlashes, value, _bindingContext, _foreach, _getItems, _options, _ref, _shouldUpdate,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isObject = function(object) {
    return Object.prototype.toString.call(object) === "[object Object]";
  };

  isFunction = function(object) {
    return Object.prototype.toString.call(object) === "[object Function]";
  };

  isBoolean = function(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  };

  isArray = function(object) {
    return Object.prototype.toString.call(object) === "[object Array]";
  };

  isString = function(object) {
    return Object.prototype.toString.call(object) === "[object String]";
  };

  isNumber = function(object) {
    return Object.prototype.toString.call(object) === "[object Number]";
  };

  isEmpty = function(object) {
    var key, value;
    if (isObject(object)) {
      for (key in object) {
        value = object[key];
        return false;
      }
      return true;
    } else if (isString(object) || isArray(object)) {
      return object.length === 0;
    } else if (object === null || typeof object === "undefined") {
      return true;
    }
    return false;
  };

  trim = function(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  trimSlashes = function(str) {
    return str.replace(/^\//, '').replace(/\/$/, '');
  };

  startsWith = function(haystack, needle) {
    return haystack.indexOf(needle) === 0;
  };

  endsWith = function(haystack, needle) {
    return haystack.indexOf(needle, haystack.length - needle.length) !== -1;
  };

  countSubstrings = function(str, substr) {
    return str.split(substr).length - 1;
  };

  objectKeys = function(obj) {
    var key, _results;
    _results = [];
    for (key in obj) {
      _results.push(key);
    }
    return _results;
  };

  objectValues = function(obj) {
    var key, value, _results;
    _results = [];
    for (key in obj) {
      value = obj[key];
      _results.push(value);
    }
    return _results;
  };

  objectsEqual = function(obj1, obj2) {
    var key, value;
    for (key in obj1) {
      value = obj1[key];
      if (obj2[key] !== value) return false;
    }
    for (key in obj2) {
      value = obj2[key];
      if (obj1[key] !== value) return false;
    }
    return true;
  };

  compact = function(obj) {
    var key, newObj, value;
    if (!isObject(obj)) obj = {};
    newObj = {};
    for (key in obj) {
      value = obj[key];
      if (value != null) newObj[key] = value;
    }
    return newObj;
  };

  extend = function(obj, extender) {
    var key, value;
    if (obj == null) obj = {};
    if (!isObject(extender)) extender = {};
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
      if (v === value) return k;
    }
  };

  arraysEqual = function(arr1, arr2) {
    var index, value, _len;
    if (arr1.length !== arr2.length) return false;
    for (index = 0, _len = arr1.length; index < _len; index++) {
      value = arr1[index];
      if (arr2[index] !== value) return false;
    }
    return true;
  };

  arrayPeek = function(arr) {
    return arr[arr.length - 1];
  };

  arrayContains = function(haystack, needle) {
    var hay, _i, _len;
    if (isFunction(haystack.indexOf)) {
      return haystack.indexOf(needle) !== -1;
    } else if (isArray(haystack)) {
      for (_i = 0, _len = haystack.length; _i < _len; _i++) {
        hay = haystack[_i];
        if (hay === needle) return true;
      }
    }
    return false;
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
    if (!isArray(arr)) return [];
    if (!isArray(items)) items = [items];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      arr = (function() {
        var _j, _len2, _results;
        _results = [];
        for (_j = 0, _len2 = arr.length; _j < _len2; _j++) {
          _item = arr[_j];
          if (_item !== item) _results.push(_item);
        }
        return _results;
      })();
    }
    return arr;
  };

  delay = function(time, callback) {
    var _ref;
    if (isFunction(time)) {
      _ref = [callback, time], time = _ref[0], callback = _ref[1];
    }
    if (!isNumber(time)) time = 1;
    if (!isFunction(callback)) callback = (function() {});
    if (time < 1) time = 1;
    return setTimeout(callback, time);
  };

  defer = function(callback) {
    if (!isFunction(callback)) callback = (function() {});
    return setTimeout(callback, 1);
  };

  Falcon = {
    version: "0.1.0",
    applicationElement: "body",
    baseApiUrl: "",
    baseTemplateUrl: "",
    cache: true,
    apply: function(view, element, callback) {
      var _ref, _ref2;
      if (isFunction(element)) {
        _ref = [element, callback], callback = _ref[0], element = _ref[1];
      }
      if (!isString(element)) element = "";
      element = trim(element);
      if (isEmpty(element)) {
        element = (_ref2 = Falcon.applicationElement) != null ? _ref2 : "body";
      }
      return $(function() {
        $('template').each(function(index, template) {
          var identifier;
          template = $(template);
          identifier = template.attr("id");
          if (identifier != null) {
            Falcon.View.cacheTemplate("#" + identifier, template.html());
          }
          return template.remove();
        });
        if (isFunction(callback)) {
          if (view instanceof Falcon.View) {
            Falcon.View.on("init", callback);
          } else {
            callback();
          }
        }
        $(element).attr('data-bind', 'view: ko.observable($data)');
        return ko.applyBindings(view);
      });
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
    isFalconObject: function(object) {
      return (object != null) && (object instanceof Falcon.Class);
    }
  };

  this.Falcon = Falcon;

  $window = $(window);

  $document = $(document);

  Falcon.Class = (function() {

    Class.prototype["super"] = function() {};

    /*
    	# Method: Falcon.Class.extend
    	#	Used to extend (as in, inherit) from one class to another
    	#
    	# Arguments:
    	#	**parent** _(Object)_ - The parent to extend from
    	#	**definition** _(Object)_ - The child's class definition
    	#
    	# Returns:
    	#	_Object_ - The extended class
    */

    Class.extend = function(parent, definition) {
      var child, ctor;
      if (parent == null) parent = Falcon.Class;
      child = null;
      if ((definition != null) && definition.hasOwnProperty("constructor")) {
        child = definition.constructor;
      } else {
        child = function() {
          return this.__super__.apply(this, arguments);
        };
      }
      ctor = (function() {});
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.prototype.__super__ = function() {
        return parent.apply(this, arguments);
      };
      child.extend = function(definition) {
        return Falcon.Class.extend(child, definition);
      };
      extend(child.prototype, definition != null ? definition : {});
      return child;
    };

    /*
    	# Local event storage
    */

    Class.prototype._events = null;

    /*
    	# Method: Falcon.Class()
    	#	The constructor method
    */

    function Class() {
      this._events = {};
    }

    /*
    	# Method: Falcon.Model#on()
    	#	Adds an event listener to a specific event
    	#
    	# Arguments:
    	#	**event** _(string)_ - The event to listen tpo
    	#	**action** _(function)_ - The callback function to attach to this event
    	#	**context** _(mixed)_ - The context to apply to the callback. Defaults to this model
    	#
    	# Returns:
    	#	_(Falcon.Model)_ - This instance
    */

    Class.prototype.on = function(event, action, context) {
      var _base, _ref;
      if (!(isString(event) && isFunction(action))) return this;
      if (context == null) context = this;
      event = trim(event).toLowerCase();
      if (isEmpty(event)) return this;
      ((_ref = (_base = this._events)[event]) != null ? _ref : _base[event] = []).push({
        action: action,
        context: context
      });
      return this;
    };

    /*
    	# Method: Falcon.Model#off()
    	#	Removes an event listener from an event
    	#
    	# Arguments:
    	#	**event** _(string)_ - The event to remove from
    	#	**action** _(function)_ - The event handler to remove
    	#
    	# Returns:
    	#	_(Falcon.Model)_ - This instance
    */

    Class.prototype.off = function(event, action) {
      var evt;
      if (!(isString(event) && isFunction(action))) return this;
      event = trim(event).toLowerCase();
      if (isEmpty(event) || !(this._events[event] != null)) return this;
      this._events[event] = (function() {
        var _i, _len, _ref, _results;
        _ref = this._events[event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          evt = _ref[_i];
          if (evt.action !== action) _results.push(evt);
        }
        return _results;
      }).call(this);
      return this;
    };

    /*
    	# Method: Falcon.Model#has
    	#	Method used to see if this model has a specific event attached
    	#
    	# Arguments:
    	#	**event** _(string)_ - The event to look at
    	#	**action** _(function)_ - The event handler to look for
    	#
    	# Returns:
    	#	_(boolean)_ - Did we find the event?
    */

    Class.prototype.has = function(event, action) {
      var evt, _i, _len, _ref;
      if (!(isString(event) && isFunction(action))) return false;
      event = trim(event).toLowerCase();
      if (isEmpty(event) || !(this._events[event] != null)) return false;
      _ref = this._events[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        if (evt.action === action) return true;
      }
      return false;
    };

    /*
    	# Method: Falcon.Model#relay
    	#	Relay's a specific event when called on an object through this object
    	#
    	# Arguments:
    	#	**object** _(string)_ - The event to look at
    	#	**event** _(function)_ - The event handler to look for
    	#
    	# Returns:
    	#	_(Falcon.Class)_ - This instance
    */

    Class.prototype.relay = function(object, event) {
      var _ref,
        _this = this;
      if (!isString(event)) {
        _ref = [event, object], object = _ref[0], event = _ref[1];
      }
      if (!Falcon.isFalconObject(object)) return this;
      if (isEmpty(event)) return this;
      object.on(event, function() {
        return _this.trigger.apply(_this, [event].concat(__slice.call(arguments)));
      });
      return this;
    };

    /*
    	# Method: Falcon.Model#trigger()
    	#	Used to trigger a specific event
    	#
    	# Arguments:
    	#	**event** _(string)_ - The event to trigger
    	#	**args...** _(arguments)_ - Additional arguments to pass into the
    	#								event listeners
    	#
    	# Returns:
    	#	_(Falcon.Model)_ - This instance
    */

    Class.prototype.trigger = function() {
      var args, event, evt, _i, _len, _ref;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!isString(event)) return this;
      event = trim(event).toLowerCase();
      if (isEmpty(event) || !(this._events[event] != null)) return this;
      _ref = this._events[event];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        evt = _ref[_i];
        evt.action.apply(evt.context, args);
      }
      return this;
    };

    return Class;

  })();

  Falcon.Model = (function(_super) {

    __extends(Model, _super);

    Model.extend = function(properties) {
      return Falcon.Class.extend(Falcon.Model, properties);
    };

    Model.prototype.id = null;

    Model.prototype.url = null;

    Model.prototype.parent = null;

    Model.prototype.fields = null;

    Model.prototype.loading = false;

    function Model(data, parent) {
      var field, model_field, _ref, _ref2;
      Model.__super__.constructor.call(this);
      data = ko.utils.unwrapObservable(data);
      parent = ko.utils.unwrapObservable(parent);
      if (!(parent != null) && Falcon.isModel(data)) {
        _ref = [data, parent], parent = _ref[0], data = _ref[1];
      }
      if (Falcon.isModel(data)) data = data.unwrap();
      this.loading = ko.observable(this.loading);
      if (this.fields === null) this.fields = {};
      this.parent = parent;
      this.initialize(data);
      this.fill(data);
      _ref2 = this.fields;
      for (field in _ref2) {
        model_field = _ref2[field];
        if (!(this[model_field] != null) && isString(model_field)) {
          this[model_field] = null;
        }
      }
    }

    Model.prototype.initialize = function(data) {};

    Model.prototype.get = function(key) {
      if (!isString(key)) return this.undefined;
      return ko.utils.unwrapObservable(this[key]);
    };

    Model.prototype.set = function(key, value) {
      var k, v;
      if (isObject(key)) {
        for (k in key) {
          v = key[k];
          this.set(k, v);
        }
        return this;
      }
      if (!isString(key)) return this;
      if (ko.isObservable(this[key])) {
        this[key](value);
      } else {
        this[key] = value;
      }
      return this;
    };

    Model.prototype.toggle = function(key) {
      return this.set(key, !this.get(key));
    };

    Model.prototype.fill = function(_data) {
      var acceptedKeys, data, key, protoKeys, rejectedKeys, value, _ref;
      if (isNumber(_data)) {
        _data = {
          'id': _data
        };
      }
      if (!isObject(_data)) return this;
      if (Falcon.isModel(_data)) _data = _data.unwrap();
      data = {};
      if (isObject(this.fields) && !isEmpty(this.fields)) {
        for (key in _data) {
          value = _data[key];
          data[(_ref = this.fields[key]) != null ? _ref : key] = value;
        }
      } else {
        data = _data;
      }
      protoKeys = objectKeys(Falcon.Model.prototype);
      acceptedKeys = arrayRemove(objectKeys(this), protoKeys);
      rejectedKeys = arrayRemove(protoKeys, acceptedKeys);
      rejectedKeys = arrayRemove(rejectedKeys, "id");
      rejectedKeys = arrayUnique(rejectedKeys);
      for (key in data) {
        value = data[key];
        if (!(!(__indexOf.call(rejectedKeys, key) >= 0))) continue;
        value = ko.utils.unwrapObservable(value);
        if (Falcon.isDataObject(this[key])) {
          this[key].fill(value);
        } else if (ko.isObservable(this[key])) {
          if (ko.isWriteableObservable(this[key])) this[key](value);
        } else {
          this[key] = value;
        }
      }
      return this;
    };

    Model.prototype.unwrap = function() {
      var key, keys, raw, value, _i, _len;
      raw = {};
      keys = arrayRemove(objectKeys(this), objectKeys(Falcon.Model.prototype));
      keys[keys.length] = "id";
      keys = arrayUnique(keys);
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        value = this[key];
        raw[key] = Falcon.isDataObject(value) ? value.unwrap() : value;
      }
      return raw;
    };

    Model.prototype.serialize = function(fields, deep) {
      var field, index, model_field, model_key, model_keys, raw, server_field, server_key, server_keys, value, _i, _j, _len, _len2, _ref, _ref2;
      raw = {};
      if (!isBoolean(deep) && isBoolean(fields)) {
        _ref = [fields, deep], deep = _ref[0], fields = _ref[1];
      }
      if (!isBoolean(deep)) deep = true;
      if (isString(fields)) fields = trim(fields).split(",");
      if (fields == null) fields = this.fields;
      server_keys = [];
      model_keys = [];
      if (isArray(fields) && !isEmpty(fields)) {
        if (isObject(this.fields)) {
          for (_i = 0, _len = fields.length; _i < _len; _i++) {
            field = fields[_i];
            server_keys[server_keys.length] = (_ref2 = findKey(this.fields, field)) != null ? _ref2 : field;
            model_keys[model_keys.length] = field;
          }
        } else {
          for (_j = 0, _len2 = fields.length; _j < _len2; _j++) {
            field = fields[_j];
            server_keys[server_keys.length] = field;
            model_keys[model_keys.length] = field;
          }
        }
      } else if (isObject(fields) && !isEmpty(fields)) {
        for (server_field in fields) {
          model_field = fields[server_field];
          server_keys[server_keys.length] = server_field;
          model_keys[model_keys.length] = model_field in this ? model_field : server_field;
        }
      } else {
        server_keys = model_keys = arrayRemove(objectKeys(this), objectKeys(Falcon.Model.prototype));
      }
      server_keys.push("id");
      server_keys = arrayUnique(server_keys);
      model_keys.push("id");
      model_keys = arrayUnique(model_keys);
      for (index in model_keys) {
        model_key = model_keys[index];
        server_key = server_keys[index];
        value = this[model_key];
        if (Falcon.isDataObject(value)) {
          raw[server_key] = deep ? value.serialize() : value.serialize(["id"]);
        } else if (ko.isObservable(value)) {
          raw[server_key] = ko.utils.unwrapObservable(value);
        } else if (!isFunction(value)) {
          raw[server_key] = value;
        }
      }
      return raw;
    };

    Model.prototype.makeUrl = function(type, parent) {
      var ext, parentPeriodIndex, parentSlashIndex, parentUrl, periodIndex, url;
      url = isFunction(this.url) ? this.url() : this.url;
      if (!isString(url)) url = "";
      url = trim(url);
      if (!isString(type)) type = "";
      type = type.toUpperCase();
      if (type !== 'GET' && type !== 'PUT' && type !== 'POST' && type !== 'DELETE') {
        type = 'GET';
      }
      parent = Falcon.isModel(parent) ? parent : this.parent;
      ext = "";
      periodIndex = url.lastIndexOf(".");
      if (periodIndex > -1) {
        ext = url.slice(periodIndex);
        url = url.slice(0, periodIndex);
      }
      if (!startsWith(url, "/")) url = "/" + url;
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
        if (url.slice(-1) !== "/") url += "/";
        url += ko.utils.unwrapObservable(this.id);
      }
      return "" + url + ext;
    };

    Model.prototype.sync = function(type, options) {
      var data, json, key, url, value, _ref, _ref2,
        _this = this;
      if (isFunction(options)) {
        options = {
          complete: options
        };
      }
      if (isString(options)) {
        options = trim(options);
        options = {
          fields: options.split(",")
        };
      }
      if (isArray(options)) {
        options = {
          fields: options
        };
      }
      if (!isObject(options)) options = {};
      if (!isObject(options.data)) options.data = {};
      if (!isString(options.dataType)) options.dataType = "json";
      if (!isString(options.contentType)) options.contentType = "application/json";
      if (!isFunction(options.success)) options.success = (function() {});
      if (!isFunction(options.complete)) options.complete = (function() {});
      if (!isFunction(options.error)) options.error = (function() {});
      if (!Falcon.isModel(options.parent)) options.parent = this.parent;
      if (!isArray(options.fields)) options.fields = [];
      if (!isObject(options.params)) options.params = {};
      if (!isBoolean(options.fill)) options.fill = true;
      type = trim(isString(type) ? type.toUpperCase() : "GET");
      if (type !== "GET" && type !== "POST" && type !== "PUT" && type !== "DELETE") {
        type = "GET";
      }
      data = {};
      if (!isEmpty(options.data)) {
        _ref = options.data;
        for (key in _ref) {
          value = _ref[key];
          data[key] = value;
        }
      }
      if (type === "POST" || type === "PUT") {
        data = extend(this.serialize(options.fields), data);
      }
      json = isEmpty(data) ? "" : JSON.stringify(data);
      url = (_ref2 = options.url) != null ? _ref2 : this.makeUrl(type, options.parent);
      if (!isEmpty(options.params)) {
        if (!(url.indexOf("?") > -1)) url += "?";
        url += ((function() {
          var _ref3, _results;
          _ref3 = options.params;
          _results = [];
          for (key in _ref3) {
            value = _ref3[key];
            _results.push("" + key + "=" + value);
          }
          return _results;
        })()).join("&");
      }
      this.loading(true);
      $.ajax({
        'url': url,
        'type': type,
        'data': json,
        'dataType': options.dataType,
        'contentType': options.contentType,
        'cache': Falcon.cache,
        'beforeSend': function(xhr) {
          return xhr.withCredentials = true;
        },
        'success': function(data, status, xhr) {
          var _ref3;
          if (options.fill) _this.fill(data);
          switch (type) {
            case "GET":
              _this.trigger("fetch", data);
              break;
            case "POST":
              _this.trigger("create", data);
              break;
            case "PUT":
              _this.trigger("save", data);
              break;
            case "DELETE":
              _this.trigger("destroy", data);
          }
          return (_ref3 = options.success).call.apply(_ref3, [_this, _this].concat(__slice.call(arguments)));
        },
        'error': function(xhr) {
          var response;
          response = xhr.responseText;
          try {
            if (isString(response)) response = JSON.parse(response);
          } catch (e) {

          }
          return options.error.call(_this, _this, response, xhr);
        },
        'complete': function(xhr) {
          var _ref3;
          _this.loading(false);
          return (_ref3 = options.complete).call.apply(_ref3, [_this, _this].concat(__slice.call(arguments)));
        }
      });
      return this;
    };

    Model.prototype.fetch = function(options) {
      return this.sync('GET', options);
    };

    Model.prototype.create = function(options) {
      return this.sync('POST', options);
    };

    Model.prototype.save = function(options) {
      return this.sync('PUT', options);
    };

    Model.prototype.destroy = function(options) {
      return this.sync('DELETE', options);
    };

    Model.prototype.map = function(mapping) {
      var key, value,
        _this = this;
      if (!isObject(mapping)) mapping = {};
      for (key in mapping) {
        value = mapping[key];
        if (Falcon.isDataObject(this[key])) {
          this[key].map(value);
        } else {
          if (ko.isObservable(value)) {
            this[key] = ko.observable(ko.utils.unwrapObservable(value));
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
            this[key] = value;
          }
        }
      }
      return this;
    };

    Model.prototype.clone = function(parent) {
      parent = (parent != null) || parent === null ? parent : this.parent;
      return new this.constructor(this.unwrap(), parent);
    };

    Model.prototype.isNew = function() {
      return isNumber(ko.utils.unwrapObservable(this.id));
    };

    return Model;

  })(Falcon.Class);

  /*
  # Class: Falcon.View
  #	Class hat represents a view on the screen
  #
  # TODO:
  #	Add the on/off methods
  */

  Falcon.View = (function(_super) {
    var templateCache, _initialized, _loadingCount;

    __extends(View, _super);

    /*
    	# The internal cache of each template identified by 
    	# their url or element id
    */

    templateCache = {};

    /*
    	# Counter to track how many things are loading
    */

    _loadingCount = 0;

    _initialized = false;

    /*
    	# Method: Falcon.View.cacheTemplate( identifier, template )
    	#	Method used to manually cache a template
    	#
    	# Arguments:
    	#	**identifier** _(String)_ - The identifier for the templae
    	#	**template** _(String)_ - The template to store
    */

    View.cacheTemplate = function(identifier, template) {
      if (!isString(identifier)) identifier = "";
      if (!isString(template)) template = "";
      identifier = trim(identifier);
      templateCache[identifier] = template;
    };

    /*
    	#
    	#
    */

    View._events = {};

    View.on = function() {
      return Falcon.Class.prototype.on.apply(this, arguments);
    };

    View.off = function() {
      return Falcon.Class.prototype.off.apply(this, arguments);
    };

    View.has = function() {
      return Falcon.Class.prototype.has.apply(this, arguments);
    };

    View.trigger = function() {
      return Falcon.Class.prototype.trigger.apply(this, arguments);
    };

    View.trigger;

    /*
    	# Method used to track when a template is loaded
    */

    View.tick = function() {
      return _loadingCount++;
    };

    View.loaded = function() {
      _loadingCount--;
      if (_loadingCount === 0) {
        if (_initialized === false) {
          Falcon.View.trigger("init");
          _initialized = true;
        }
        return Falcon.View.trigger("load");
      }
    };

    /*
    	#
    */

    View.extend = function(definition) {
      return Falcon.Class.extend(Falcon.View, definition);
    };

    /*
    	#
    */

    View.prototype.url = null;

    /*
    	#
    */

    View.prototype.template = null;

    /*
    	# Method: Falcon.View()
    	#	The constuctor method for the view class
    */

    function View() {
      var url, _loaded, _ref,
        _this = this;
      View.__super__.constructor.call(this);
      Falcon.View.tick();
      this.template = ko.observable();
      url = this.makeUrl();
      this.isLoaded = ko.observable(false);
      _loaded = function() {
        _this.isLoaded(true);
        defer(function() {
          return _this.trigger("load");
        });
        return Falcon.View.loaded();
      };
      if (isEmpty(url)) {
        _loaded();
      } else if (url in templateCache) {
        this.template(templateCache[url]);
        _loaded();
      } else if (startsWith(url, "#")) {
        this.template((_ref = templateCache[url]) != null ? _ref : templateCache[url] = $(url).html());
        _loaded();
      } else {
        $.ajax({
          url: url,
          type: "GET",
          cache: false,
          error: function() {
            return console.log("ERROR LOADING TEMPLATE " + url);
          },
          success: function(html) {
            _this.template(templateCache[_this.url] = html);
            return _loaded();
          }
        });
      }
      this.initialize.apply(this, arguments);
    }

    View.prototype.makeUrl = function() {
      var url;
      url = ko.utils.unwrapObservable(this.url);
      if (!isString(url)) url = "";
      url = trim(url);
      if (isString(Falcon.baseTemplateUrl)) {
        url = "" + Falcon.baseTemplateUrl + url;
      }
      return url;
    };

    /*
    	#
    */

    View.prototype.initialize = (function() {});

    /*
    	# Method Falcon.View#viewModel
    	#	Get's a view model representing this view
    */

    View.prototype.viewModel = function() {
      var key, value, viewModel,
        _this = this;
      viewModel = {
        __falcon__: true
      };
      for (key in this) {
        value = this[key];
        if (!(!(key in Falcon.View.prototype))) continue;
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
      return viewModel;
    };

    /*
    	#
    */

    View.prototype.load = function(callback) {
      this.on("load", callback);
      if (this.isLoaded()) return this.trigger("load");
    };

    /*
    	# Method: Falcon.View#dispose
    	#	Executed when this view is disposed to the garbage collector (Doesn't work yet)
    */

    View.prototype.dispose = (function() {});

    /*
    	# Method: Falcon.View#call()
    	#	Used to make a 'call' method of a specific method on this view.
    	#	useful for attaching a view's method to events in a template so that
    	#	they can be called when an event is fired (without having to do any
    	#	currying/method wrapping)
    	#
    	# Arguments:
    	#	**method** _(string)_ - The view method to call
    	#
    	# Returns:
    	#	_(Function)_ - A wrapped version of the method
    */

    View.prototype.call = function(method) {
      var _args, _method,
        _this = this;
      if (!isString(method)) throw new Error("Method must be a string");
      _method = this[method];
      if (!isFunction(_method)) {
        throw new Error("'" + method + "' is not a valid method.");
      }
      _args = Array.prototype.slice.call(arguments, 1);
      return function() {
        return _method.apply(_this, _args);
      };
    };

    return View;

  })(Falcon.Class);

  Falcon.Collection = (function(_super) {
    var _makeIterator;

    __extends(Collection, _super);

    /*
    	#
    */

    Collection.prototype._mappings = null;

    /*
    	#
    */

    Collection.extend = function(definition) {
      return Falcon.Class.extend(Falcon.Collection, definition);
    };

    /*
    	#
    */

    Collection.prototype.list = null;

    /*
    	#
    */

    Collection.prototype.model = null;

    /*
    	#
    */

    Collection.prototype.__change_count__ = 0;

    Collection.prototype.url = null;

    Collection.prototype.length = 0;

    Collection.prototype.parent = null;

    /*
    	#
    */

    Collection.prototype.loading = false;

    /*
    	#
    */

    function Collection(models, parent) {
      var _ref,
        _this = this;
      Collection.__super__.constructor.call(this);
      models = ko.utils.unwrapObservable(models);
      parent = ko.utils.unwrapObservable(parent);
      if (!(parent != null) && Falcon.isModel(models)) {
        _ref = [models, parent], parent = _ref[0], models = _ref[1];
      }
      if (this.model != null) {
        if (this.url == null) this.url = this.model.prototype.url;
      }
      this.parent = parent;
      this.length = ko.observable(ko.utils.unwrapObservable(this.length));
      this.loading = ko.observable(ko.utils.unwrapObservable(this.loading));
      this.populated = ko.computed(function() {
        return _this.length() > 0;
      });
      this._mappings = [];
      this.reset().fill(models);
      this.initialize(models);
    }

    /*
    	#
    */

    Collection.prototype.initialize = (function() {});

    /*
    	# Method: Falcon.Collection#fill()
    	#	'fills' this collection with new data
    	#
    	# Arguments:
    	#	**items** _(Array)_ - An array of items to fill this collection with
    	#
    	# Returns:
    	#	_Falcon.Collection_ - This instance
    */

    Collection.prototype.fill = function(items, options) {
      var i, item, list, m, mapping, method, models, _i, _len, _len2, _ref, _return;
      if (this.model == null) return this;
      if (items == null) items = [];
      if (Falcon.isCollection(items)) items = items.list();
      if (ko.isObservable(items)) items = ko.utils.unwrapObservable(items);
      if (!isArray(items)) items = [items];
      models = [];
      if (options == null) options = {};
      if (!isObject(options)) options = {};
      method = options.method;
      if (!isString(method)) method = '';
      method = method.toLowerCase();
      if (method !== 'replace' && method !== 'append' && method !== 'prepend') {
        method = 'replace';
      }
      this.__change_count__++;
      _return = [];
      for (i = 0, _len = items.length; i < _len; i++) {
        m = items[i];
        _return[i] = models[i] = new this.model({}, this.parent);
        _ref = this._mappings;
        for (_i = 0, _len2 = _ref.length; _i < _len2; _i++) {
          mapping = _ref[_i];
          models[i].map(mapping);
        }
        models[i].fill(Falcon.isModel(m) ? m.serialize() : m);
      }
      if (method === 'replace') {
        this.list(models);
      } else if (method === 'prepend') {
        list = (function() {
          var _j, _len3, _ref2, _results;
          _ref2 = this.list();
          _results = [];
          for (_j = 0, _len3 = _ref2.length; _j < _len3; _j++) {
            item = _ref2[_j];
            _results.push(item);
          }
          return _results;
        }).call(this);
        while (models.length > 0) {
          list.unshift(models.pop());
        }
        this.list(list);
      } else if (method === 'append') {
        list = this.list();
        list = (function() {
          var _j, _len3, _results;
          _results = [];
          for (_j = 0, _len3 = list.length; _j < _len3; _j++) {
            item = list[_j];
            _results.push(item);
          }
          return _results;
        })();
        while (models.length > 0) {
          list.push(models.shift());
        }
        this.list(list);
      }
      this.length(this.list().length);
      return _return;
    };

    /*
    	# Method: Falcon.Collection#unwrap()
    	#	Method used to 'unwrap' this object into an anonmous object
    	#	Needed to cascade inwards on other Falcon Data objects (like lists)
    	#	to unwrap newly added member variables/objects
    	#
    	# Returns:
    	#	_Array_ - The 'unwrapped' array
    */

    Collection.prototype.unwrap = function() {
      var i, raw, value, _ref;
      raw = [];
      _ref = this.list();
      for (i in _ref) {
        value = _ref[i];
        raw[i] = Falcon.isDataObject(value) ? value.unwrap() : value;
      }
      return raw;
    };

    /*
    	# Method: Falcon.Collection#serialize()
    	#	Serializes this collection and returns the raw array
    	#	of data
    	#
    	# Arguments:
    	#	**fields** _(Array)_ -	The fields that should be included in the 
    	#	                      	serialization "id" is always included. If 
    	#	                      	none given, all fields from this models 'fields' 
    	#	                      	member are serialized
    	#
    	#	**deep** _(Boolean)_ -	should we do a deep copy? In otherwords, should 
    	#	                      	we cascade downwards to serialize data about 
    	#	                      	children models.
    	#
    	# Returns:
    	#	_Array_ - an array of the serialized raw data to send to the server
    */

    Collection.prototype.serialize = function(fields, deep) {
      var i, raw, value, _ref;
      raw = [];
      _ref = this.list();
      for (i in _ref) {
        value = _ref[i];
        raw[i] = Falcon.isDataObject(value) ? value.serialize(fields, deep) : value;
      }
      return raw;
    };

    /*
    	# Method: Falcon.Collection#makeUrl
    */

    Collection.prototype.makeUrl = function(type) {
      var parentPeriodIndex, parentSlashIndex, parentUrl, url;
      url = isFunction(this.url) ? this.url() : this.url;
      if (!isString(url)) url = "";
      url = trim(url);
      if (!isString(type)) type = "";
      type = type.toUpperCase();
      if (type !== 'GET' && type !== 'PUT' && type !== 'POST' && type !== 'DELETE') {
        type = 'GET';
      }
      if (!startsWith(url, "/")) url = "/" + url;
      if (Falcon.isModel(this.parent)) {
        parentUrl = this.parent.makeUrl();
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
      return url;
    };

    /*
    	#
    */

    Collection.prototype.fetch = function(options) {
      return this.sync('GET', options);
    };

    /*
    	#
    */

    Collection.prototype.sync = function(type, options) {
      var data, key, url, value, _ref, _ref2,
        _this = this;
      if (isFunction(options)) {
        options = {
          success: options
        };
      }
      if (!isObject(options)) options = {};
      if (!isObject(options.data)) options.data = {};
      if (!isString(options.dataType)) options.dataType = "json";
      if (!isString(options.contentType)) options.contentType = "application/json";
      if (!isFunction(options.success)) options.success = (function() {});
      if (!isFunction(options.complete)) options.complete = (function() {});
      if (!isFunction(options.error)) options.error = (function() {});
      if (!isObject(options.params)) options.params = {};
      if (!isBoolean(options.fill)) options.fill = true;
      type = isString(type) ? type.toUpperCase() : "GET";
      if (type !== "GET" && type !== "POST" && type !== "PUT" && type !== "DELETE") {
        type = "GET";
      }
      type = trim(type);
      data = {};
      if (!isEmpty(options.data)) {
        _ref = options.data;
        for (key in _ref) {
          value = _ref[key];
          data[key] = value;
        }
      }
      url = (_ref2 = options.url) != null ? _ref2 : trim(this.makeUrl(type));
      if (!((url != null) && isString(url))) return;
      if (!isEmpty(options.params)) {
        if (!(url.indexOf("?") > -1)) url += "?";
        url += ((function() {
          var _ref3, _results;
          _ref3 = options.params;
          _results = [];
          for (key in _ref3) {
            value = _ref3[key];
            _results.push("" + key + "=" + value);
          }
          return _results;
        })()).join("&");
      }
      this.loading(true);
      $.ajax({
        'url': url,
        'type': type,
        'data': data,
        'dataType': options.dataType,
        'contentType': options.contentType,
        'cache': Falcon.cache,
        'beforeSend': function(xhr) {
          return xhr.withCredentials = true;
        },
        'success': function(data, status, xhr) {
          var _ref3;
          if (data == null) data = [];
          if (isString(data)) data = JSON.parse(data);
          if (isEmpty(data)) data = JSON.parse(xhr.responseText);
          if (options.fill && type === "GET") _this.fill(data, options);
          return (_ref3 = options.success).call.apply(_ref3, [_this, _this].concat(__slice.call(arguments)));
        },
        'error': function(xhr) {
          var response;
          response = xhr.responseText;
          try {
            if (isString(response)) response = JSON.parse(response);
          } catch (e) {

          }
          return options.error.call(_this, _this, response, xhr);
        },
        'complete': function() {
          var _ref3;
          _this.loading(false);
          return (_ref3 = options.complete).call.apply(_ref3, [_this, _this].concat(__slice.call(arguments)));
        }
      });
      return this;
    };

    /*
    	# Method: Falcon.Collection#remove
    	#	Used to simplu remove elements from the current collection
    	#	Does not actually delete the data from the server
    	#
    	# Arguments:
    	#	**items** _(Array)_ - An array (or an item) to remove from the list
    	#
    	# Returns:
    	#	_(Falcon.Collection)_ - This instance
    */

    Collection.prototype.remove = function(items) {
      var removedItems;
      items = ko.utils.unwrapObservable(items);
      if (Falcon.isCollection(items)) items = items.list();
      this.__change_count__++;
      removedItems = isArray(items) ? this.list.removeAll(items) : this.list.remove(items);
      if (!isEmpty(removedItems)) this.length(this.list().length);
      return this;
    };

    /*
    	#
    */

    Collection.prototype.append = function(items) {
      return this.fill(items, {
        'method': 'append'
      });
    };

    /*
    	#
    */

    Collection.prototype.prepend = function(items) {
      return this.fill(items, {
        'method': 'prepend'
      });
    };

    /*
    	# Method: Falcon.Collection#unshift
    	#	Push an element onto the begining of the array, Alias of prepend
    	#
    	# Arguments:
    	#	**item** _(Falcon.Model)_ - The model to add
    	#
    	# Returns:
    	#	_(Falcon.Collection)_ - This instance
    	#
    	# See Also:
    	#	Falcon.Colletion#prepend
    */

    Collection.prototype.unshift = function() {
      return this.prepend.apply(this, arguments);
    };

    /*
    	# Method: Falcon.Collection#shift
    	#	Shifts the first element from the list and returns it
    */

    Collection.prototype.shift = function() {
      var item;
      item = this.list.shift();
      this.length(this.list().length);
      return item;
    };

    /*
    	# Method: Falcon.Collection#push
    	#	Push an element onto the end of the array, Alias of append
    	#
    	# Arguments:
    	#	**item** _(Falcon.Model)_ - The model to add
    	#
    	# Returns:
    	#	_(Falcon.Collection)_ - This instance
    	#
    	# See Also:
    	#	Falcon.Colletion#append
    */

    Collection.prototype.push = function() {
      return this.append.apply(this, arguments);
    };

    /*
    	# Method: Falcon.Collection#pop
    	#	Pops the last element from the list and returns it
    */

    Collection.prototype.pop = function() {
      var item;
      item = this.list.pop();
      this.length(this.list().length);
      return item;
    };

    /*
    	# Method: Falcon.Collection#sort
    	#	Sorts the collection by a given sorter
    	#
    	# Arguments:
    	#	**sorter** _(Function)_ - An iterator to sort the array with
    	#
    	# Returns:
    	#	_(Array)_ - The sorted array
    */

    Collection.prototype.sort = function(sorter) {
      var list;
      list = this.list();
      if (!isArray(list)) return;
      if (!isFunction(sorter)) return list;
      return list.sort(sorter);
    };

    /*
    	# Method: Falcon.Collection#create
    	#	Creates a new model and adds it to the list of eisting models, 
    	#	also sends off a corresponding ajax request
    	#
    	# Returns:
    	#	_XmlHttpRequest_ - The XHR object that corresponds to this create instance
    */

    Collection.prototype.create = function(data, options) {
      var _success,
        _this = this;
      if (this.model == null) return;
      if (Falcon.isModel(data)) data = data.unwrap();
      if (!isObject(data)) data = {};
      if (isFunction(options)) {
        options = {
          success: options
        };
      }
      if (!isObject(options)) options = {};
      if (!isFunction(options.success)) options.success = (function() {});
      if (!isString(options.method)) options.method = 'append';
      _success = options.success;
      options.success = function(model) {
        var models;
        models = _this.fill(model, options);
        if (models.length === 1) arguments[0] = models = models[0];
        return _success.apply(models, arguments);
      };
      return new this.model(data, this.parent).create(options);
    };

    /*
    	# Method: Falcon.Collection#destroy
    	#	Removes the specified models from the collection and database
    	#	executing each of te models destroy method and passing the
    	#	'options' parameter along with the destroy call
    	#
    	# Arguments:
    	#	**models** _(Array)_ - An array of the models to remove, if this is not an array, 
    	#						   it will be placed in one as the only object, if the models 
    	#						   is a collection, we will destroy all of the models in the list.
    	#						   When no argument is given for models (or the argument is the 
    	#						   string 'all'), we'll destroy everything.
    	#
    	#	**options** _(Object)_ - An optional object of the settings to call when onto each 
    	#							 of the destroy methods of the 
    	#
    	# Returns:
    	#	_(Falcon.Collection)_ - This instance
    */

    Collection.prototype.destroy = function(models, options) {
      var model, _i, _len, _success,
        _this = this;
      if (this.model == null) return this;
      models = ko.utils.unwrapObservable(models);
      if (!((models != null) && models !== 'all')) models = this.list();
      if (Falcon.isCollection(models)) models = models.list();
      if (!isArray(models)) models = [models];
      if (isEmpty(models)) return this;
      if (isFunction(options)) {
        options = {
          success: options
        };
      }
      if (!isObject(options)) options = {};
      if (!isFunction(options.success)) options.success = (function() {});
      options.parent = this.parent;
      _success = options.success;
      options.success = function(model) {
        _this.remove(model);
        return _success.apply(model, arguments);
      };
      for (_i = 0, _len = models.length; _i < _len; _i++) {
        model = models[_i];
        if (Falcon.isDataObject(model)) model.destroy(options);
      }
      return this;
    };

    /*
    	# Method: Falcon.Collection#at
    	#	Gets a the value at the specified index
    	#
    	# Arguments:
    	#	**index** _(Number)_ - The index to retrieve the value from
    	#
    	# Returns:
    	#	_(Falcon.Model)_ - The model at that index
    */

    Collection.prototype.at = function(index) {
      var list;
      if (!isNumber(index)) index = 0;
      index = parseInt(index);
      list = this.list();
      if (index < 0) index = 0;
      if (index >= list.length) index = list.length - 1;
      return list[index];
    };

    /*
    	# Method: Falcon.Collection#each
    	#
    	# Arguments:
    	#	**iterator** _(Function)_ - The iterator to loop over each value, if one argument is provided 
    	#								the input argument will be each item, if two are provided that input 
    	#								parameters will be index, item.
    	#
    	#	**context** _(mixed)_ - The context to bind the iterator against, if none is provided it defaults
    	#							to this collection.
    	#
    	# Returns:
    	#	_(Falcon.Collection)_ - This instance
    */

    Collection.prototype.each = function(iterator, context) {
      var index, item, _i, _len, _len2, _ref, _ref2;
      if (!isFunction(iterator)) return this;
      if (context == null) context = this;
      if (iterator.length === 1) {
        _ref = this.list();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          iterator.call(context, item);
        }
      } else {
        _ref2 = this.list();
        for (item = 0, _len2 = _ref2.length; item < _len2; item++) {
          index = _ref2[item];
          iterator.call(context, index, item);
        }
      }
      return this;
    };

    /*
    	# Method: _makeIterator
    	#	Private method used to consistently generate iterators for 
    	#	the following search functions
    */

    _makeIterator = function(iterator) {
      var _id, _model;
      if (Falcon.isModel(iterator)) {
        _model = iterator;
        return function(item) {
          var id, model_id;
          if (!Falcon.isModel(item)) return false;
          id = item.get('id');
          model_id = _model.get('id');
          return id === model_id;
        };
      }
      if (isNumber(iterator)) {
        _id = iterator;
        return function(model) {
          return model.get("id") === _id;
        };
      }
      return iterator;
    };

    /*
    	# Method: Falcon.Collection#first
    	#	Retrieves the first value from the internal list based on an interator.  
    	#	If no iterator is present, the first value is returned.  
    	#	If no values match or exist, then null is returned
    */

    Collection.prototype.first = function(iterator) {
      var item, _i, _len, _ref;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        iterator = (function() {
          return true;
        });
      }
      _ref = this.list();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (iterator(item)) return item;
      }
      return null;
    };

    /*
    	#
    */

    Collection.prototype.last = function(iterator) {
      var i, item, list;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) {
        iterator = (function() {
          return true;
        });
      }
      list = this.list();
      for (i in list) {
        item = list[i];
        item = list[list.length - i - 1];
        if (iterator(item)) return item;
      }
      return null;
    };

    /*
    	# Method: Falcon.Collection#slice
    	#	Slices the underlying collection the same way slice works on an array
    	#
    	# Arguments:
    	#	**start** _(Number)_ - Required. An integer that specifies where to start 
    	#						   the selection (The first element has an index of 0). 
    	#						   Use negative numbers to select from the end of an array.
    	#	**end** _(Number)_ - Optional. An integer that specifies where to end the selection. 
    	#						 If omitted, all elements from the start position and to the 
    	#						 end of the array will be selected. Use negative numbers to 
    	#						 select from the end of an array
    	#
    	# Returns:
    	#	_(Array)_ - The sliced array of models from the underlying array in this collection
    */

    Collection.prototype.slice = function(start, end) {
      return this.list.slice(start, end);
    };

    /*
    	# Method: Falcon.Collection#all
    	#	Gets a list of all elements that match the iterator, if one is given
    	#
    	# Arguments:
    	#	**iterator** _(Function)_ - The iterator to check if this item belongs in the response list
    	#
    	# Returns:
    	#	_(Array)_ - An array of all the matched items
    */

    Collection.prototype.all = function(iterator) {
      var item;
      iterator = _makeIterator(iterator);
      return (function() {
        var _i, _len, _ref, _results;
        _ref = this.list();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (iterator(item)) _results.push(item);
        }
        return _results;
      }).call(this);
    };

    /*
    	# Method: Falcon.Collection#any
    	#	Checks to see if any of the values match the iterator in this list
    */

    Collection.prototype.any = function(iterator) {
      var item, _i, _len, _ref;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) return false;
      _ref = this.list();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (iterator(item)) return true;
      }
      return false;
    };

    /*
    	# Method: Falcon.Collection#without
    	#	Returns an array of elements that don't match the iterator
    */

    Collection.prototype.without = function(iterator) {
      var item;
      iterator = _makeIterator(iterator);
      if (!isFunction(iterator)) return this.list();
      return (function() {
        var _i, _len, _ref, _results;
        _ref = this.list();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (!iterator(item)) _results.push(item);
        }
        return _results;
      }).call(this);
    };

    /*
    	# Method: Falcon.Collection#map
    	#	Adds a mapping to all of the models in the current list and any future models that are added.
    	#	Mappings are added onto a stack of mappings.  When the list changes, all of the mappings will
    	#	be re-executed.
    	#
    	# Arguments:
    	#	**mapping** _(object)_ - The mapping to apply and save
    	#
    	# Returns:
    	#	_(Falcon.Collection)_ - This instance
    */

    Collection.prototype.map = function(mapping) {
      var key, model, value, _i, _len, _mapping, _ref,
        _this = this;
      if (!isObject(mapping)) mapping = {};
      _mapping = {};
      for (key in mapping) {
        value = mapping[key];
        if (ko.isObservable(value)) {
          _mapping[key] = ko.observable(ko.utils.unwrapObservable(value));
        } else if (isFunction(value)) {
          (function() {
            var _value;
            _value = value;
            return _mapping[key] = function() {
              return _value.call(arguments[0], arguments[0], _this);
            };
          })();
        } else {
          _mapping[key] = value;
        }
      }
      _ref = this.list();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        if (Falcon.isDataObject(model)) model.map(_mapping);
      }
      this._mappings.push(_mapping);
      return this;
    };

    /*
    	# Method: Falcon.Collection#pluck
    	#	Method used to pluck values from each model in the list of models.
    	#
    	# Arguments:
    	#	**keys** _(String)_ - The key to look at in each mode
    	#			_(Array)_ - An array of keys to pluck from the model, value returned in the same order
    	#	**unwrap** _(Boolean)_ - Flag to state if we should or shouldn't unwrap values that are observables, default is true
    	#
    	# Returns:
    	#	_(Array)_ - An array of the values from each model coresponding to the keys. If the keys was an array, then this is an array of arrays
    */

    Collection.prototype.pluck = function(keys, unwrap) {
      var key, model, plucked_values, _i, _j, _len, _len2, _ref, _ref2;
      if (isString(keys)) keys = keys.split(",");
      if (!isArray(keys)) keys = [];
      if (!(keys.length > 0)) return [];
      if (unwrap == null) unwrap = true;
      plucked_values = [];
      if (keys.length > 1) {
        _ref = this.list();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          if (isObject(model)) {
            plucked_values.push((function() {
              var _j, _len2, _results;
              _results = [];
              for (_j = 0, _len2 = keys.length; _j < _len2; _j++) {
                key = keys[_j];
                _results.push(unwrap ? ko.utils.unwrapObservable(model[key]) : model[key]);
              }
              return _results;
            })());
          } else {
            plucked_values.push(window.undefined);
          }
        }
      } else if (keys.length === 1) {
        key = keys[0];
        _ref2 = this.list();
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          model = _ref2[_j];
          if (isObject(model)) {
            plucked_values.push((unwrap ? ko.utils.unwrapObservable(model[key]) : model[key]));
          } else {
            plucked_values.push(window.undefined);
          }
        }
      }
      return plucked_values;
    };

    /*
    	# Method: Falcon.Collection#clone
    	# 	Method used to deeply clone this colleciton
    	#
    	# Arguments:
    	#	**parent** _(Falcon.Model)_ - The parent of the clone. optional
    	#
    	# Returns:
    	#	_Falcon.Collection_ - A clone of this collection
    */

    Collection.prototype.clone = function(parent) {
      parent = parent === null || Falcon.isModel(parent) ? parent : this.parent;
      return new this.constructor(this.unwrap(), parent);
    };

    /*
    	# Method: Falcon.Collection#reset
    	#	'resets' the internal array of this collection, 
    	#	this will make sure the list is an observable array, 
    	#	has no elements, and the length is restored to zero
    	#
    	# Returns:
    	#	_Falcon.Collection_ - This instance
    */

    Collection.prototype.reset = function() {
      if (this.list == null) this.list = ko.observableArray([]);
      this.list([]);
      this.length(0);
      this.__change_count__ += 1;
      return this;
    };

    return Collection;

  })(Falcon.Class);

  Falcon.Report = (function(_super) {
    var Axis;

    __extends(Report, _super);

    Axis = (function() {

      function Axis() {
        this.title = "";
        this.format = "";
      }

      Axis.prototype.options = function() {
        return {
          title: this.title,
          format: this.format
        };
      };

      return Axis;

    })();

    /*
    	# Attribute: Report#columns
    	#	A list of columns to use in this format: "[type] [key] [label]"
    	#
    	#	types: 'string' 'number' 'boolean' 'date' 'datetime' 'timeofday'
    */

    Report.prototype.columns = null;

    Report.prototype.url = null;

    Report.prototype._formatting = null;

    Report.prototype.haxis = null;

    Report.prototype.vaxis = null;

    Report.prototype.data = null;

    Report.prototype._parameters = null;

    Report.prototype.response_handler = (function() {});

    function Report(url, columns) {
      var _ref;
      Report.__super__.constructor.call(this);
      if (isArray(url)) _ref = [columns, url], url = _ref[0], columns = _ref[1];
      if (this.url == null) this.url = url != null ? url : "";
      if (this.columns == null) this.columns = columns != null ? columns : [];
      this.data = ko.observableArray([]);
      this.loading = ko.observable(false);
      this._parameters = {};
      this._formatting = {};
      this._current_request = null;
      this.haxis = new Axis();
      this.vaxis = new Axis();
    }

    Report.prototype.param = function(key, value) {
      this._parameters[key] = value;
      return this;
    };

    Report.prototype.fetch = function(success) {
      var key, params, url, value, _ref, _value,
        _this = this;
      url = isFunction(this.url) ? this.url() : this.url;
      if (!isString(url)) url = "";
      if (!isString(url)) return;
      if (!isFunction(success)) success = (function() {});
      this.loading(true);
      params = {};
      _ref = this._parameters;
      for (key in _ref) {
        _value = _ref[key];
        value = ko.utils.unwrapObservable(_value);
        if (Falcon.isModel(value)) {
          params[key] = ko.utils.unwrapObservable(value.id);
        } else if (isFunction(value)) {
          params[key] = value();
        } else {
          params[key] = value;
        }
      }
      url = url + "/";
      for (key in params) {
        value = params[key];
        url = url.replace(":" + key + "/", "" + value + "/");
      }
      url = url.slice(0, -1);
      url = Falcon.baseApiUrl + url;
      return this._current_request = $.ajax({
        type: "GET",
        url: url,
        data: params,
        success: function(data) {
          if (data == null) data = [];
          if (!isArray(data)) data = [data];
          _this.data(data);
          _this.trigger("success", data);
          return success.apply(_this, arguments);
        },
        error: function(error) {
          return _this.trigger("error", error);
        },
        complete: function() {
          _this._current_request = null;
          return _this.loading(false);
        }
      });
    };

    Report.prototype.request = function(chart) {
      var _this = this;
      if (chart == null) return;
      return this.fetch(function() {
        var options;
        options = {
          hAxis: _this.haxis.options(),
          vAxis: _this.vaxis.options()
        };
        return chart.draw(_this.dataTable(), options);
      });
    };

    /*
    	# Method: Report#format
    	#	Formats a specific key as a specific format type
    */

    Report.prototype.format = function(key, type, options) {
      var formatter;
      if (!_.isString(key)) key = "";
      if (!_.isString(type)) type = "";
      key = _.trim(key);
      type = _.trim(type).toLowerCase();
      if (_.isEmpty(key)) return;
      if (_.isEmpty(type)) return;
      formatter = (function() {});
      if (type === "number") {
        formatter = function() {
          return new google.visualization.NumberFormat(options);
        };
      }
      return this._formatting[key] = {
        type: type,
        formatter: formatter
      };
    };

    Report.prototype.parseColumn = function(column_str) {
      var coumn_str;
      if (!_.isString(coumn_str)) coumn_str = "";
      return column_str.split(" ", 3);
    };

    Report.prototype.parseItem = function(key, item) {
      var formatting, type;
      item = ko.utils.unwrapObservable(item);
      formatting = this._formatting[key];
      if (formatting != null) {
        type = formatting['type'];
        if (type === "number") return parseFloat(item);
      }
      return item;
    };

    Report.prototype.dataTable = function() {
      var column, index, item, key, key_array, label, table, type, _i, _len, _len2, _ref, _ref2, _ref3;
      table = new google.visualization.DataTable();
      key_array = [];
      _ref = this.columns;
      for (index = 0, _len = _ref.length; index < _len; index++) {
        column = _ref[index];
        _ref2 = this.parseColumn(column), type = _ref2[0], key = _ref2[1], label = _ref2[2];
        key_array.push(key);
        table.addColumn(type, label);
        if (this._formatting[key] != null) {
          this._formatting[key]['formatter']().format(table, index);
        }
      }
      _ref3 = this.data();
      for (_i = 0, _len2 = _ref3.length; _i < _len2; _i++) {
        item = _ref3[_i];
        if (isObject(item)) {
          table.addRow((function() {
            var _j, _len3, _results;
            _results = [];
            for (_j = 0, _len3 = key_array.length; _j < _len3; _j++) {
              key = key_array[_j];
              _results.push(this.parseItem(key, item[key]));
            }
            return _results;
          }).call(this));
        }
      }
      return table;
    };

    return Report;

  })(Falcon.Class);

  Falcon.Event = (function() {

    Event.UP_KEY = 38;

    Event.DOWN_KEY = 40;

    Event.RIGHT_KEY = 39;

    Event.LEFT_KEY = 37;

    Event.ENTER_KEY = 13;

    Event.prototype._element = null;

    /*
    	# Method: Falcon.Event()
    */

    function Event(element) {
      if (element == null) throw new Error("Element must be given");
      this._element = $(element);
    }

    /*
    	# Method: Falcon.Event#on()
    */

    Event.prototype.on = function(event, callback) {
      var element, _callback;
      if (!isString(event)) event = "";
      element = this._element;
      if (!isFunction(callback)) callback = (function() {});
      event = trim(event);
      if (isEmpty(event)) return;
      _callback = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (element.parents('body').length > 0) {
          return callback.call.apply(callback, [this].concat(__slice.call(args)));
        } else {
          return $window.off(event, _callback);
        }
      };
      return $window.on(event, _callback);
    };

    return Event;

  })();

  _shouldUpdate = function(element, value) {
    var changeCount, lastChangeCount;
    if (!Falcon.isCollection(value)) return true;
    changeCount = value.__change_count__;
    lastChangeCount = ko.utils.domData.get(element, "__falcon_collection___change_count__");
    if (lastChangeCount === changeCount) return false;
    ko.utils.domData.set(element, '__falcon_collection___change_count__', changeCount);
    return true;
  };

  _getItems = function(value) {
    var items;
    items = ko.utils.unwrapObservable(Falcon.isCollection(value) ? value.list() : value);
    if (!isArray(items)) items = [items];
    return (function() {
      return items;
    });
  };

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
      var viewModel, _ref;
      viewModel = {};
      if (value == null) value = {};
      if (value instanceof Falcon.View) {
        viewModel = value.viewModel();
      } else {
        viewModel = ko.utils.unwrapObservable((_ref = value.viewModel) != null ? _ref : {});
      }
      return viewModel;
    };
    getTemplate = function(value) {
      var template, _ref;
      template = "";
      if (value == null) value = {};
      if (value instanceof Falcon.View) {
        template = value.template();
      } else {
        template = ko.utils.unwrapObservable((_ref = value.template) != null ? _ref : "");
      }
      return template;
    };
    returnVal = {
      controlsDescendantBindings: true
    };
    return {
      'init': function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var oldViewModel, subscription, value;
        value = valueAccessor();
        if (ko.isSubscribable(value)) {
          oldViewModel = ko.utils.unwrapObservable(value);
          subscription = value.subscribe(function(newViewModel) {
            if (Falcon.isView(oldViewModel)) oldViewModel.dispose();
            return oldViewModel = newViewModel;
          });
          ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            if (Falcon.isView(oldViewModel)) oldViewModel.dispose();
            return subscription.dispose();
          });
        } else if (Falcon.isView(value)) {
          ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            return value.dispose();
          });
        }
        value = ko.utils.unwrapObservable(value);
        viewModel = getViewModel(value);
        if (value instanceof Falcon.View && !value.url) {
          value.template($(element).html());
        }
        ko.bindingHandlers['template']['init'](element, makeTemplateValueAccessor(viewModel), allBindingsAccessor, viewModel, context);
        return returnVal;
      },
      'update': function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var anonymousTemplate, execScripts, originalViewContext, template, value;
        value = valueAccessor();
        value = ko.utils.unwrapObservable(value);
        viewModel = getViewModel(value);
        template = getTemplate(value);
        if (!isObject(value)) return returnVal;
        originalViewContext = context['$view'];
        context['$view'] = viewModel;
        if (isEmpty(viewModel) || !(template != null)) $(element).html(" ");
        if (!(value instanceof Falcon.View) || value.isLoaded()) {
          anonymousTemplate = ko.utils.domData.get(element, '__ko_anon_template__');
          anonymousTemplate.containerData.innerHTML = template;
          if ($.browser.msie && $.browser.version < 9) {
            anonymousTemplate.textData = template;
          }
          ko.bindingHandlers['template']['update'](element, makeTemplateValueAccessor(viewModel), allBindingsAccessor, viewModel, context);
          execScripts = !!ko.utils.unwrapObservable(value.execScripts);
          if (template !== anonymousTemplate && execScripts === true) {
            $(element).find("script").each(function(index, script) {
              script = $(script);
              if (script.attr('type').toLowerCase() === "text/javascript") {
                return eval(script.text());
              }
            });
          }
        }
        if (Falcon.isView(value)) value.trigger("render");
        context['$view'] = originalViewContext;
        return returnVal;
      }
    };
  })();

  _foreach = ko.bindingHandlers['foreach'];

  ko.bindingHandlers['foreach'] = {
    'init': function() {
      var args, element, value, valueAccessor, _ref;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.utils.unwrapObservable(valueAccessor());
      ko.utils.domData.set(element, '__falcon_collection___change_count__', -1);
      return ((_ref = _foreach['init']) != null ? _ref : (function() {})).apply(null, [element, _getItems(value)].concat(__slice.call(args)));
    },
    'update': function() {
      var args, element, value, valueAccessor, _ref;
      element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      value = ko.utils.unwrapObservable(valueAccessor());
      if (_shouldUpdate(element, value)) {
        return ((_ref = _foreach['update']) != null ? _ref : (function() {})).apply(null, [element, _getItems(value)].concat(__slice.call(args)));
      }
      if (Falcon.isCollection(value)) value.trigger("render");
    }
  };

  for (key in _foreach) {
    value = _foreach[key];
    if (!(key in ko.bindingHandlers['foreach'])) {
      ko.bindingHandlers['foreach'][key] = value;
    }
  }

  ko.bindingHandlers['collection'] = ko.bindingHandlers['foreach'];

  _options = (_ref = ko.bindingHandlers['options']) != null ? _ref : (function() {});

  ko.bindingHandlers['options'] = (function() {
    return {
      'init': function() {
        var args, element, valueAccessor, _ref2;
        element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        value = ko.utils.unwrapObservable(valueAccessor());
        ko.utils.domData.set(element, '__falcon_collection___change_count__', -1);
        return ((_ref2 = _options['init']) != null ? _ref2 : (function() {})).apply(null, [element, _getItems(value)].concat(__slice.call(args)));
      },
      'update': function() {
        var args, element, valueAccessor, _ref2;
        element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        value = ko.utils.unwrapObservable(valueAccessor());
        if (_shouldUpdate(element, value)) {
          return ((_ref2 = _options['update']) != null ? _ref2 : (function() {})).apply(null, [element, _getItems(value)].concat(__slice.call(args)));
        }
      }
    };
  })();

  ko.bindingHandlers['log'] = {
    update: function(element, valueAccessor) {
      return console.log(ko.utils.unwrapObservable(valueAccessor()));
    }
  };

  _bindingContext = ko.bindingContext;

  ko.bindingContext = function(dataItem, parentBindingContext) {
    if (!(this['$view'] != null) && (parentBindingContext != null)) {
      this['$view'] = parentBindingContext['$view'] || parentBindingContext['$root'];
    }
    return _bindingContext.call(this, dataItem, parentBindingContext);
  };

  ko.bindingContext.prototype = _bindingContext.prototype;

  ko.virtualElements.allowedBindings['view'] = true;

  ko.virtualElements.allowedBindings['log'] = true;

  ko.virtualElements.allowedBindings['collection'] = true;

  ko.subscribable.fn.classify = function() {
    var extenders, identifier, identifiers, _i, _len;
    identifiers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    extenders = {};
    for (_i = 0, _len = identifiers.length; _i < _len; _i++) {
      identifier = identifiers[_i];
      if (!(isString(identifier) && !isEmpty(trim(identifier)))) continue;
      identifier = trim(identifier);
      extenders[identifier] = true;
    }
    return this.extend(extenders);
  };

}).call(this);
