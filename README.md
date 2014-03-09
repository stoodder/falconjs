## Documentation
[http://stoodder.github.io/falconjs/](http://stoodder.github.io/falconjs/)

## Change Log
**v0.8.0**
* Separated Knockout source code from Falcon
* Updated Falcon to work with Knockout 3
* Added Falcon.getBinding() method
* Allowed Falcon.addBinding() to take just a key and function (as opposed to a key and an object). If a function is given, it's set as the new binding's 'update' key
* Fixed bug in makeUrl when setting baseApiUrl and baseTemplateUrl to "/"


## For The Future
**v0.10.0**
_Highlights_
* Added Falcon.Adapter for splitting out dependencies on how we transmit, respond to, and receive data form a backend data source.
* Falcon.Collection#insert has breaking changes (check breaking changes section for more info)

_TODO_
* Add method support for 'obervables' and 'defaults' (rather than dictionary defintion)
* Add support for Falcon.Collection in the without() method (remove all models from the resultant collection that are in the given collection)
* Add exec binding
* add generate binding and Falcon.register for dynamically creating views
* add listenTo on Falcon.Object
* Cleanup/Redo binding tests

_Breaking Changes_
* Falcon.Collection#insert() has breaking changes. You must now pass in an 'options' object as the second parameteter instead of the insert index or model to insert after. In the options parameter, you'll be able to pass in an 'index' attribute for the index to insert the models after. A model attribute to specific which model to insert the models after. Or an iterator to truth test the collection (to find an insert index, based on first success) to insert the models after

_Enhancements_
* Convert Build process to Grunt.js
* Added id override to model makeUrl
* Add 'all' method to collections
* Added 'merge' method to collections
* Added 'replace' method to collections
* Add 'increment' and 'decrement' to models
* Converted unit tests to Jasmine
* Removing the usages of unwrap where not necessary. Models should carry over by reference, not duplication
* Reworked the initialization process
* Removed jQuery for DOM listening/manipulation
* Added base adapter class
* Added jQuery adapter to handle all ajax handling and removed the rest of the jQuery calls from Falcon
* Add 'set' method to collections (sets all values for a key to each model in the collection)
* Model and Collection constructors will now throw an error if the parent object isn't null/undefined or a model
* Divide fill method into separate methods for each type (reverse rolls)
* Support for Knockout 3.1

_Bugs Fixed_
* Fixed reference overwirtting on colleciton merge method.
* Fix length() on collection chains
