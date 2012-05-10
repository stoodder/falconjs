Falcon =
	version: "{{VERSION}}"
	baseApiUrl: ""

	apply: (view) -> 
		$ ->
			$('body').attr('data-bind', 'view: $data')
			ko.applyBindings(view)
	#END apply

	isModel: (object) -> 
		object? and object instanceof Falcon.Model
	#END isModel

	isCollection: (object) -> 
		object? and object instanceof Falcon.Collection
	#END isCollection

	isView: (object) -> 
		object? and object instanceof Falcon.View
	#END isView

	isDataObject: (object) -> 
		object? and ( object instanceof Falcon.Model or object instanceof Falcon.Collection )
	#END isDataObject

	isFalconObject: (object) ->
		object? and ( object instanceof Falcon.Class )
	#END isFalconObjext
#END Falcon

#Expose Falcon to the window
@Falcon = Falcon

