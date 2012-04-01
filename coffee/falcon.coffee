Falcon =
	version: "{{VERSION}}"
	baseApiUrl: ""

	apply: (view) -> 
		$ ->
			$('body').attr('data-bind', 'view: $data')
			ko.applyBindings(view)
	#END apply

	isModel: (object) -> 
		object = ko.utils.unwrapObservable(object)
		object? and object instanceof Falcon.Model
	#END isModel

	isCollection: (object) -> 
		object = ko.utils.unwrapObservable(object)
		object? and object instanceof Falcon.Collection
	#END isCollection

	isView: (object) -> 
		object = ko.utils.unwrapObservable(object)
		object? and object instanceof Falcon.View
	#END isView

	isDataObject: (object) -> 
		object = ko.utils.unwrapObservable(object)
		object? and ( object instanceof Falcon.Model or object instanceof Falcon.Collection )
	#END isDataObject
#END Falcon

#Expose Falcon to the window
@Falcon = Falcon

