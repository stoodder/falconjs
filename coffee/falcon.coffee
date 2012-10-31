Falcon =
	version: "{{VERSION}}"
	applicationElement: "body"
	baseApiUrl: ""
	baseTemplateUrl: ""
	cache: true

	apply: (view, element, callback) -> 
		[callback, element] = [element, callback] if isFunction( element )

		element = "" unless isString( element )
		element = trim( element )
		element = (Falcon.applicationElement ? "body") if isEmpty( element )

		$ ->
			$('template').each (index, template) ->
				template = $(template)
				identifier = template.attr("id")
				Falcon.View.cacheTemplate( "#" + identifier, template.html() ) if identifier?
				template.remove()
			#END each template

			if isFunction( callback )
				if view instanceof Falcon.View
					Falcon.View.on("init", callback) 
				else
					callback()
				#END if
			#END if

			$(element).attr('data-bind', 'view: $data')
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

