## Documentation
[http://stoodder.github.io/falconjs/](http://stoodder.github.io/falconjs/)

## Change Log
###v0.10.0
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

**TODO**
<<<<<<< HEAD
* Add method support for 'obervables' and 'defaults' (rather than dictionary defintion)
* Add exec binding
* add generate binding and Falcon.register for dynamically creating views
* Cleanup/Redo binding tests

**Breaking Changes**
* Falcon.Collection#insert() has breaking changes. You must now pass in an 'options' object as the second parameteter instead of the insert index or model to insert after. In the options parameter, you'll be able to pass in an 'index' attribute for the index to insert the models after. A model attribute to specific which model to insert the models after. Or an iterator to truth test the collection (to find an insert index, based on first success) to insert the models after
=======
* Add support for Falcon.Collection in the without() method (remove all models from the resultant collection that are in the given collection)
>>>>>>> conductor

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
<<<<<<< HEAD
* Fixed reference overwirtting on colleciton merge method.
* Fix length() on collection chains
* Added support for arrays and collection in filter methods: first, last, all, any, filter, without
=======
* Fixed reference overwritting on colleciton merge method.
* Fixed length() on collection chains


###v0.8.0
* Separated Knockout source code from Falcon
* Updated Falcon to work with Knockout 3
* Added Falcon.getBinding() method
* Allowed Falcon.addBinding() to take just a key and function (as opposed to a key and an object). If a function is given, it's set as the new binding's 'update' key
* Fixed bug in makeUrl when setting baseApiUrl and baseTemplateUrl to "/"

## For The Future
### 0.10.1
* Cleanup/Redo binding tests
* Pass fill options through recursive calls to the fill methods

### 0.11.0
* Add method support for 'obervables' and 'defaults' (rather than dictionary defintion)
* Add exec binding
>>>>>>> conductor
