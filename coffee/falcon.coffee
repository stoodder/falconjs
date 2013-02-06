Falcon =
	version: "{{VERSION}}"
	applicationElement: "body"
	baseApiUrl: ""
	baseTemplateUrl: ""
	cache: true

	apply: (root, element, viewCallback) -> 
		[element, viewCallback] = [viewCallback, element] if isFunction( element )

		element = "" unless isString( element )
		element = trim( element )
		element = (Falcon.applicationElement ? "body") if isEmpty( element )
		viewCallback = ( -> ko.observable() ) unless isFunction( viewCallback )

		#We need to create a template element for IE to recognize the tag
		document.createElement("template")

		$ ->
			$('template').each (index, template) ->
				template = $(template)
				identifier = template.attr("id")
				Falcon.View.cacheTemplate( "#" + identifier, template.html() ) if identifier?
				template.remove()
			#END each template

			$element = $(element);
			$element.attr('data-bind', 'view: $data')
			ko.applyBindings( root, $element[0] )
			viewCallback()
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

#Expose Falcon to the window
@Falcon = Falcon

