Falcon =
	version: "{{VERSION}}"
	apply: (view) -> 
		$ ->
			$('body').attr('data-bind', 'view: $data')
			ko.applyBindings(view)

	isModel: (object) -> object? and object instanceof Falcon.Model
	isCollection: (object) -> object? and object instanceof Falcon.Collection
	isView: (object) -> object? and object instanceof Falcon.View
	isDataObject: (object) -> object? and ( object instanceof Falcon.Model or object instanceof Falcon.Collection )


#Expose Falcon to the window
@Falcon = Falcon

