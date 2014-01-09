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
**v0.9.0**
* Add 'merge' method to collections
* Add method support fo obervables and defaults
* Add 'set' method to collections (sets all values for a key to each model in the collection)
* Add 'all' method to collections
* Remove jQuery for document load
* Find a replacement library for jQuery to do Ajax handling that includes promises and typicals response callbacks
* Add support for 'Date' type fields
* Add support for Falcon.Collection in the without() method (remove all models from the resultant collection that are in the given collection)
* Fix length() on collection chains
* Add exec binding
* add generate binding and Falcon.register for dynamically creating views
* add listenTo on Falcon.Object
* Create Falcon.Event object (includes .off method) to return from Falcon.on and Falcon.trigger

Done
* Convert Build process to Grunt.js
* Added id override to model makeUrl