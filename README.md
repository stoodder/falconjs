## Installation
Download Production: [falcon.min.js](http://stoodder.github.io/falconjs/assets/scripts/falcon.min.js)
Download Development: [falcon.js](http://stoodder.github.io/falconjs/assets/scripts/falcon.js)

## Documentation
[http://stoodder.github.io/falconjs/](http://stoodder.github.io/falconjs/)

## Change Log
### v1.0.0rc1
**Enhancements**
* Included support for Knockout 3.2.0
* Added support for Knockout components with Falcon.View
* Split adapter in to two new classes Falcon.DataAdapter and Falcon.TemplateAdapter
* Add makeBaseUrl, makeUrlComponents, resovleUrl, and makeUrl methods to Falcon.DataAdapter
* Add displayIf, afterDisplay, beforeDispose to view binding
* Optimizing fill related methods
* Falcon.Collection#sort will now default its comparator to the collections comparator unless one is given
* Added additional context argument to the off() method
* Added subscribe method to collections which delegates its arguments to the internal observable array.
* Added Falcon.onDipose for node disposal callbacks
* Added once and listenToOnce methods to Falcon.Object
* Added $rawView to the view's binding context to provide access to the actual Falcon.View instance, not just it's view model created from createViewModel().
* Added serializeRequestData to transform serialized data in to request data for both models and collections
* Added 'debugger' binding to trigger the debugger on binding value change (to something truthy)
* Support for knockout-3.3.0 and updated performance of components

**Bug Fixes**
* Removed change counter on collections, it was redundant checking and not needed anymore
* Fixed refernece loss issue with Falcon.Collection#mixing
* Fixed view binding to not listen to observable updates in the display and dispose methods
* Fixed fill() method when writting to read-only computed observables or other function. Values should not overwrite unless specifically the 'url' property
* Made it possible to remove callback methods only based on context since create new instances still result in equivalent method calls, just different contexts
* Removed Falcon conductors in favor of knockout components
* Fixed yield binding to allow for iteratable content
* Fixed yield binding to allow for embeddable yields within a component yield

**Breaking Changes**
* When using 'mixin' to add a function to a model or a collection, the function will simply be bound against the model and each argument is verbatim to each call. In the preivous version we would pass in the model or model & collection pair as the first arguments.
* Falcon.Collection#sort now returns 'this' collection rather than the list of sorted models
* Renamed 'url' to 'endpoint' throughout Falcon.
* Falcon.Adapter has been split in to two separate classes Falcon.DataAdapter and Falcon.TemplateAdapter.  The Falcon.adapter instance has also been replaced with Falcon.dataAdapater and Falcon.templateAdapter
* Removed template() method from Falcon.View in favor of a template property which maybe be overridden in the view defintion to hard code a template
* parse has been renamed to parseResponseData

**TODO**
* Add exec binding
* Add change notifications to Falcon.Collection
* Ensure that Falcon will work with require.js
* Add Falcon.Observable to wrap ko.observable in the case that we'd want to switch
* Fallback to local comparator if one isn't given in sort()
* Allow for 'true' in attributes filtering
* use querySelector instead of querySelectorAll where possible
* Bug: Should check the unwrapped value when serializing
* Add Collection#insertAt(index)
* Make constants
* Document makeBaseUrl, makeUrlComponents, resovleUrl, and makeUrl on adapter
* Add 'endpoint' override option to adapter options
* Test displayIf, beforeDispose, afterDisplay of the view binding
* Test Falcon.addComponent
* Test Falcon.onDispose
* Test componeont binding
* Test yield binding
* Test once
* Test listenToOnce
* Document endpoint
* Document Falcon.addComponent
* Document Falcon.onDispose
* Document component binding updates
* Document yield binding
* Document once
* Document listenToOnce


### v0.10.2
**Highlights**
* Fully tested bindings and binding overrides
* The global Falcon object is now its own Falcon.Object which means you can utilize event listeners against it.

**Enhancements**
* Falcon is now its own Falcon.Object and may be utilized for global event handling

**Bugs Fixed**
* Fixed Options Binding

### v0.10.1
**Highlights**
* Fully tested and cross browser compatiable with IE8+!

**Breaking Changes**
* The view binding now only accepts Falcon.View of ko.observable( Falcon.View ) as it's input. If anything else is given, the node's children will be emptied.

**Enhancements**
* Added Falcon.ready to allow for us to execute code when the DOM is loaded. (Same as jQuery's $.ready)
* Re-wrote the binding tests, much cleaner

**Bugs Fixed**
* Prevented model mixin() method from overwritting currently defined values
* When using Falcon.Collections create() method with a raw object, we assign the collection's parent as the newly created model's parent
* Everything is now cross browser compatible with IE8+, Firefox 3.6+, Safari 4+, Chrome 14+, Opera 10.6+ on Windows XP+, OSX Lion+
* Re-tested the view binding
* Fixed 'ready' for IE8

### v0.10.0
**Highlights**
* Added Falcon.Adapter for splitting out dependencies on how we transmit, respond to, and receive data form a backend data source.
* Added Falcon.addConductor to create a 'conductor' which can define custom HTML tags that should bind and utilize the template of a specific view (or anonymous view). `Falcon.addConductor('my_custom_tag', MyViewDefinition)` For the time being, the conductor functionality will remain a separate plugin for Falcon until all of the edge-cases are ironed out. Indepth documentation on how to install and use it can be found in our main documentation.
* Fully Compatible with Knockout 3.1
* New Falcon.Object methods: listenTo and stopListening
* New Falcon.Model methods: increment, decrement
* New Falcon.Collection methods: all, set, merge, replace

**Breaking Changes**
* You must now include the falcon.jquery_adapater.js to support ajax requests with jQuery as Falcon's dependency on jQuery has been completely removed in version 0.10.0.
* Model and Collection constructors will now throw an error if the parent object isn't null/undefined or a model
* Elements with the 'view' binding may now specifiy internal HTML which will override the lookup of a template from the 'url' attribute.  This may break existing apps that provide HTML inside of their view declarations before the binding is applied.
* Falcon.Collection#insert() has breaking changes. You must now pass in an 'options' object as the second parameteter instead of the insert index or model to insert after. In the options parameter, you'll be able to pass in an 'index' attribute for the index to insert the models after. A model attribute to specific which model to insert the models after. Or an iterator to truth test the collection (to find an insert index, based on first success) to insert the models after

**Enhancements**
* Convert Build process to Grunt.js
* Added id override to model makeUrl
* Add 'all' method to collections
* Added 'merge' method to collections
* Added 'replace' method to collections
* Add 'increment' and 'decrement' to models
* Add 'listenTo' and 'stopListening' to Falcon.Object
* Converted unit tests to Jasmine
* Removing the usages of unwrap where not necessary. Models should carry over by reference, not duplication
* Reworked the initialization process
* Removed jQuery for DOM listening/manipulation
* Added base adapter class
* Added jQuery adapter to handle all ajax handling and removed the rest of the jQuery calls from Falcon
* Add 'set' method to collections (sets all values for a key to each model in the collection)
* Divided fill method into separate methods for each type (reverse rolls)
* Support for Knockout 3.1
* Elements with the 'view' binding may now specifiy internal HTML which will override the lookup of a template from the 'url' attribute
* Added Falcon.addConductor
* Removed auto-magic setting of the 'data-bind' attribute of our application elements in favor of programatic application of the bindings (using ko.applyBindingAccessorsToNode instead).

**Bugs Fixed**
* Fixed reference overwritting on colleciton merge method.
* Fixed length() on collection chains
* Added support for arrays and collection in filter methods: first, last, all, any, filter, without


### v0.8.0
* Separated Knockout source code from Falcon
* Updated Falcon to work with Knockout 3
* Added Falcon.getBinding() method
* Allowed Falcon.addBinding() to take just a key and function (as opposed to a key and an object). If a function is given, it's set as the new binding's 'update' key
* Fixed bug in makeUrl when setting baseApiUrl and baseTemplateUrl to "/"
