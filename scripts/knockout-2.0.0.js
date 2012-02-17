// Knockout JavaScript library v2.0.0
// (c) Steven Sanderson - http://knockoutjs.com/
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

(function(window,undefined){ 
var ko = window["ko"] = {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(publicPath, object) {
	var tokens = publicPath.split(".");
	var target = window;
	for (var i = 0; i < tokens.length - 1; i++)
		target = target[tokens[i]];
	target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
  owner[publicName] = object;
};
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

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
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
        if ((element.tagName != "INPUT") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type.toLowerCase();
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
            for (var i = 0, j = valuesToPush.length; i < j; i++)
                array.push(valuesToPush[i]);	
            return array;
        },

        extend: function (target, source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                ko.utils.arrayForEach(childNodes, function (childNode) {
                    domNode.appendChild(childNode);
                });
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
            if (navigator.userAgent.indexOf("MSIE 6") >= 0)
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

        evalWithinScope: function (expression /*, scope1, scope2, scope3... */) {
            // Build the source for a function that evaluates "expression"
            // For each scope variable, add an extra level of "with" nesting
            // Example result: with(sc[1]) { with(sc[0]) { return (expression) } }
            var scopes = Array.prototype.slice.call(arguments, 1);
            var functionBody = "return (" + expression + ")";
            for (var i = 0; i < scopes.length; i++) {
                if (scopes[i] && typeof scopes[i] == "object")
                    functionBody = "with(sc[" + i + "]) { " + functionBody + " } ";
            }
            return (new Function("sc", functionBody))(scopes);
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
            return ko.utils.domNodeIsContainedBy(node, document);
        },

        registerEventHandler: function (element, eventType, handler) {
            if (typeof jQuery != "undefined") {
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
            } else if (typeof element.addEventListener == "function")
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
                if (eventType == "click") {
                    if ((element.tagName == "INPUT") && ((element.type.toLowerCase() == "checkbox") || (element.type.toLowerCase() == "radio")))
                        element.checked = element.checked !== true;
                }
                element.fireEvent("on" + eventType);
            }
            else
                throw new Error("Browser doesn't support triggering events");
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        domNodeHasCssClass: function (node, className) {
            var currentClassNames = (node.className || "").split(/\s+/);
            return ko.utils.arrayIndexOf(currentClassNames, className) >= 0;
        },

        toggleDomNodeCssClass: function (node, className, shouldHaveClass) {
            var hasClass = ko.utils.domNodeHasCssClass(node, className);
            if (shouldHaveClass && !hasClass) {
                node.className = (node.className || "") + " " + className;
            } else if (hasClass && !shouldHaveClass) {
                var currentClassNames = (node.className || "").split(/\s+/);
                var newClassName = "";
                for (var i = 0; i < currentClassNames.length; i++)
                    if (currentClassNames[i] != className)
                        newClassName += currentClassNames[i] + " ";
                node.className = ko.utils.stringTrim(newClassName);
            }
        },

        outerHTML: function(node) {
            // For Chrome on non-text nodes
            // (Although IE supports outerHTML, the way it formats HTML is inconsistent - sometimes closing </li> tags are omitted, sometimes not. That caused https://github.com/SteveSanderson/knockout/issues/212.)
            if (ieVersion === undefined) {
                var nativeOuterHtml = node.outerHTML;
                if (typeof nativeOuterHtml == "string")
                    return nativeOuterHtml;
            }

            // Other browsers
            var dummyContainer = window.document.createElement("div");
            dummyContainer.appendChild(node.cloneNode(true));
            return dummyContainer.innerHTML;
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            'innerText' in element ? element.innerText = value
                                   : element.textContent = value;
                                   
            if (ieVersion >= 9) {
                // Believe it or not, this actually fixes an IE9 rendering bug. Insane. https://github.com/SteveSanderson/knockout/issues/209
                element.innerHTML = element.innerHTML;
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
        
        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("INPUT")).concat(ko.utils.makeArray(form.getElementsByTagName("TEXTAREA")));
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

        stringifyJson: function (data) {
            if ((typeof JSON == "undefined") || (typeof JSON.stringify == "undefined"))
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data));
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;
            
            // If we were given a form, use its 'action' URL and pick out any requested field values 	
            if((typeof urlOrForm == 'object') && (urlOrForm.tagName == "FORM")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)        				
                        params[fields[j].name] = fields[j].value;
                }
            }        	
            
            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("FORM");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                var input = document.createElement("INPUT");
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            for (var key in params) {
                var input = document.createElement("INPUT");
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

ko.exportSymbol('ko.utils', ko.utils);
ko.utils.arrayForEach([
    ['arrayForEach', ko.utils.arrayForEach],
    ['arrayFirst', ko.utils.arrayFirst],
    ['arrayFilter', ko.utils.arrayFilter],
    ['arrayGetDistinctValues', ko.utils.arrayGetDistinctValues],
    ['arrayIndexOf', ko.utils.arrayIndexOf],
    ['arrayMap', ko.utils.arrayMap],
    ['arrayPushAll', ko.utils.arrayPushAll],
    ['arrayRemoveItem', ko.utils.arrayRemoveItem],
    ['extend', ko.utils.extend],
    ['fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost],
    ['getFormFields', ko.utils.getFormFields],
    ['postJson', ko.utils.postJson],
    ['parseJson', ko.utils.parseJson],
    ['registerEventHandler', ko.utils.registerEventHandler],
    ['stringifyJson', ko.utils.stringifyJson],
    ['range', ko.utils.range],
    ['toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass],
    ['triggerEvent', ko.utils.triggerEvent],
    ['unwrapObservable', ko.utils.unwrapObservable]
], function(item) {
    ko.exportSymbol('ko.utils.' + item[0], item[1]);
});

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
            var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null");
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
            }
        }
    }
})();

ko.exportSymbol('ko.utils.domData', ko.utils.domData);
ko.exportSymbol('ko.utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully
ko.utils.domNodeDisposal = new (function () {
    var domDataKey = "__ko_domNodeDisposal__" + (new Date).getTime();
    
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
            if ((node.nodeType != 1) && (node.nodeType != 9))
                return;
            cleanSingleNode(node);
            
            // Clone the descendants list in case it changes during iteration
            var descendants = [];
            ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
            for (var i = 0, j = descendants.length; i < j; i++)
                cleanSingleNode(descendants[i]);
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
ko.exportSymbol('ko.cleanNode', ko.cleanNode); 
ko.exportSymbol('ko.removeNode', ko.removeNode);
ko.exportSymbol('ko.utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('ko.utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('ko.utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);(function () {
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

ko.exportSymbol('ko.utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('ko.utils.setHtml', ko.utils.setHtml);
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

ko.exportSymbol('ko.memoization', ko.memoization);
ko.exportSymbol('ko.memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('ko.memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('ko.memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('ko.memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
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

ko.exportSymbol('ko.extenders', ko.extenders);
ko.subscription = function (callback, disposeCallback) {
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

        var subscription = new ko.subscription(boundCallback, function () {
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
            ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
                // In case a subscription was disposed during the arrayForEach cycle, check
                // for isDisposed on each subscription before invoking its callback
                if (subscription && (subscription.isDisposed !== true))
                    subscription.callback(valueToNotify);
            });
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

ko.exportSymbol('ko.subscribable', ko.subscribable);
ko.exportSymbol('ko.isSubscribable', ko.isSubscribable);

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
                throw "Only subscribable things can act as dependencies";
            if (_frames.length > 0) {
                var topFrame = _frames[_frames.length - 1];
                if (ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
                    return;
                topFrame.distinctDependencies.push(subscribable);
                topFrame.callback(subscribable);
            }
        }
    };
})();var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true };

ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write            
            
            // Ignore writes if the value hasn't changed
            if ((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
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
    ko.subscribable.call(observable);
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
    ko.utils.extend(observable, ko.observable['fn']);

    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);
    
    return observable;
}

ko.observable['fn'] = {
    __ko_proto__: ko.observable,

    "equalityComparer": function valuesArePrimitiveAndEqual(a, b) {
        var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
        return oldValueIsPrimitive ? (a === b) : false;
    }
};

ko.isObservable = function (instance) {
    if ((instance === null) || (instance === undefined) || (instance.__ko_proto__ === undefined)) return false;
    if (instance.__ko_proto__ === ko.observable) return true;
    return ko.isObservable(instance.__ko_proto__); // Walk the prototype chain
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance.__ko_proto__ === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance.__ko_proto__ === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('ko.observable', ko.observable);
ko.exportSymbol('ko.isObservable', ko.isObservable);
ko.exportSymbol('ko.isWriteableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    if (arguments.length == 0) {
        // Zero-parameter constructor initializes to empty array
        initialValues = [];
    }
    if ((initialValues !== null) && (initialValues !== undefined) && !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");
        
    var result = new ko.observable(initialValues);
    ko.utils.extend(result, ko.observableArray['fn']);
    
    ko.exportProperty(result, "remove", result.remove);
    ko.exportProperty(result, "removeAll", result.removeAll);
    ko.exportProperty(result, "destroy", result.destroy);
    ko.exportProperty(result, "destroyAll", result.destroyAll);
    ko.exportProperty(result, "indexOf", result.indexOf);
    ko.exportProperty(result, "replace", result.replace);
    
    return result;
}

ko.observableArray['fn'] = {
    remove: function (valueOrPredicate) {
        var underlyingArray = this();
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

    removeAll: function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this.remove(function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },
    
    destroy: function (valueOrPredicate) {
        var underlyingArray = this();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },
        
    destroyAll: function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this.destroy(function() { return true });
                
        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this.destroy(function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });             
    },

    indexOf: function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },
    
    replace: function(oldItem, newItem) {
        var index = this.indexOf(oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this()[index] = newItem;
            this.valueHasMutated();
        }
    }    
}

// Populate ko.observableArray.fn with read/write functions from native arrays
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () { 
        var underlyingArray = this();
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

ko.exportSymbol('ko.observableArray', ko.observableArray);
function prepareOptions(evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    if (evaluatorFunctionOrOptions && typeof evaluatorFunctionOrOptions == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = evaluatorFunctionOrOptions;
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        options["read"] = evaluatorFunctionOrOptions || options["read"];
    }
    // By here, "options" is always non-null
    
    if (typeof options["read"] != "function")
        throw "Pass a function that returns the value of the dependentObservable";
        
    return options;    
}

ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue, 
        _hasBeenEvaluated = false, 
        options = prepareOptions(evaluatorFunctionOrOptions, evaluatorFunctionTarget, options);

    // Build "disposeWhenNodeIsRemoved" and "disposeWhenNodeIsRemovedCallback" option values
    // (Note: "disposeWhenNodeIsRemoved" option both proactively disposes as soon as the node is removed using ko.removeNode(),
    // plus adds a "disposeWhen" callback that, on each evaluation, disposes if the node was removed by some other means.)
    var disposeWhenNodeIsRemoved = (typeof options["disposeWhenNodeIsRemoved"] == "object") ? options["disposeWhenNodeIsRemoved"] : null;
    var disposeWhenNodeIsRemovedCallback = null;
    if (disposeWhenNodeIsRemoved) {
        disposeWhenNodeIsRemovedCallback = function() { dependentObservable.dispose() };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, disposeWhenNodeIsRemovedCallback);
        var existingDisposeWhenFunction = options["disposeWhen"];
        options["disposeWhen"] = function () {
            return (!ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved)) 
                || ((typeof existingDisposeWhenFunction == "function") && existingDisposeWhenFunction());
        }    	
    }
    
    var _subscriptionsToDependencies = [];
    function disposeAllSubscriptionsToDependencies() {
        ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = [];
    }
    
    var evaluationTimeoutInstance = null;
    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else
            evaluateImmediate();
    }

    function evaluateImmediate() {
        // Don't dispose on first evaluation, because the "disposeWhen" callback might
        // e.g., dispose when the associated DOM element isn't in the doc, and it's not
        // going to be in the doc until *after* the first evaluation
        if ((_hasBeenEvaluated) && typeof options["disposeWhen"] == "function") {
            if (options["disposeWhen"]()) {
                dependentObservable.dispose();
                return;
            }
        }

        try {
            disposeAllSubscriptionsToDependencies();
            ko.dependencyDetection.begin(function(subscribable) {
                _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync));
            });
            var valueForThis = options["owner"] || evaluatorFunctionTarget; // If undefined, it will default to "window" by convention. This might change in the future.
            var newValue = options["read"].call(valueForThis);
            dependentObservable["notifySubscribers"](_latestValue, "beforeChange");
            _latestValue = newValue;
        } finally {
            ko.dependencyDetection.end();
        }

        dependentObservable["notifySubscribers"](_latestValue);
        _hasBeenEvaluated = true;
    }

    function dependentObservable() {
        if (arguments.length > 0) {
            if (typeof options["write"] === "function") {
                // Writing a value
                var valueForThis = options["owner"] || evaluatorFunctionTarget; // If undefined, it will default to "window" by convention. This might change in the future.
                options["write"].apply(valueForThis, arguments);
            } else {
                throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
            }
        } else {
            // Reading the value
            if (!_hasBeenEvaluated)
                evaluateImmediate();
            ko.dependencyDetection.registerDependency(dependentObservable);
            return _latestValue;
        }
    }
    dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; }
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () {
        if (disposeWhenNodeIsRemoved)
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, disposeWhenNodeIsRemovedCallback);
        disposeAllSubscriptionsToDependencies();
    };
    
    ko.subscribable.call(dependentObservable);
    ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

    if (options['deferEvaluation'] !== true)
        evaluateImmediate();
    
    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);
    
    return dependentObservable;
};

ko.dependentObservable['fn'] = {
    __ko_proto__: ko.dependentObservable
};

ko.dependentObservable.__ko_proto__ = ko.observable;

ko.exportSymbol('ko.dependentObservable', ko.dependentObservable);
ko.exportSymbol('ko.computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
(function() {    
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)
    
    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");
        
        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
  