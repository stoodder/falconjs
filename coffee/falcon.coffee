window.Falcon = Falcon =
	version: "{{VERSION}}"
	applicationElement: "body"
	baseApiUrl: ""
	baseTemplateUrl: ""
	cache: true

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.apply
	#
	# Arguments:
	#----------------------------------------------------------------------------------------------
	apply: (root, element, callback) -> 
		[element, callback] = [callback, element] if isFunction( element )

		element = "" unless isString( element )
		element = trim( element )
		element = (Falcon.applicationElement ? "body") if isEmpty( element )
		callback = ( -> ) unless isFunction( callback )

		#We need to create a template element for IE to recognize the tag
		document.createElement("template")

		$ ->
			$('template').each (index, template) ->
				template = $(template)
				identifier = template.attr("id")
				Falcon.View.cacheTemplate( "#" + identifier, template.html() ) if identifier?
				template.remove()
			#END each template

			# NOTE
			# This is hacky, I used to do 'view: $data' but $data is always the unwrapped
			# observable and hence I couldn't trigger the correct unrender method when the
			# view was swapped although it should have been able to. I will need to figure
			# out a better way to do this
			Falcon.__falcon_root__ = root
			$element = $(element);
			$element.attr('data-bind', 'view: Falcon.__falcon_root__')
			ko.applyBindings( root, $element[0] )

			callback()
		#END onLoad
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

