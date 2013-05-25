@Falcon = Falcon =
	#--------------------------------------------------------
	# Attribute: Falcon.version
	#	The current version of Falcon
	#
	# Type: _(String)_
	#--------------------------------------------------------
	version: "{{VERSION}}"

	#--------------------------------------------------------
	# Attribute: Falcon.applicationElement
	#	The default element to apply the bindings to if none is specified in Falcon.apply()
	#
	# Type: _(String)_
	#--------------------------------------------------------
	applicationElement: "body"

	#--------------------------------------------------------
	# Attribute: Falcon.baseApiUrl
	#	The base API url prefix to be added to Models and Collections when makeUrl is called
	#
	# Type: _(String)_
	#--------------------------------------------------------
	baseApiUrl: ""

	#--------------------------------------------------------
	# Attribute: Falcon.baseTemplateUrl
	#	The base template url prefix to be added to Views when makeUrl is called
	#	with a remote uri (rather than an element id)
	#
	# Type: _(String)_
	#--------------------------------------------------------
	baseTemplateUrl: ""

	#--------------------------------------------------------
	# Attribute: Falcon.cache
	#	Should the ajax calls cache their results?  Refer to
	#	the jquery documentation for $.ajax
	#
	# Type: _(String)_
	#--------------------------------------------------------
	cache: true

	#--------------------------------------------------------
	# Method: Falcon.apply
	#	The method to initialize falcon and apply its bindings
	#
	# Arguments:
	#	**root** _(Falcon.View|ko.observable)_ - A view or an observable containing a view to be 
	#											 applied to the application element
	#	**element** _(String|DOMElement)_ - The element to intialize the application in
	#	**callback** _(Function)_ - Method called after the bindings have been initialized and applied
	#--------------------------------------------------------
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

			# Apply the bindings, we need to rewrap the root into its own
			# observable because, by default, the applyBindings will pass
			# in the unwrapped version of the root which causes a change to
			# the root to not be noticed by the view binding and hence will
			# not be able to call the proper dispose methods.
			$element = $(element);
			$element.attr('data-bind', 'view: $data')
			ko.applyBindings( ko.observable( root ), $element[0] )

			#Trigger any callback to notify the application that
			#the app has been initialize and the bindings are applied.
			callback()
		#END onLoad

		return
	#END apply

	#--------------------------------------------------------
	# Method: Falcon.isModel()
	#	Method used to test if an object is a Falcon Model
	#
	# Arguments:
	#	**object** _(mixed)_ -  The object to test
	#
	# Returns:
	#	_(Boolean)_ - Is the object a model?
	#--------------------------------------------------------
	isModel: (object) -> 
		object? and object instanceof Falcon.Model
	#END isModel

	#--------------------------------------------------------
	# Method: Falcon.isCollection()
	#	Method used to test if an object is a Falcon Collection
	#
	# Arguments:
	#	**object** _(mixed)_ -  The object to test
	#
	# Returns:
	#	_(Boolean)_ - Is the object a colleciton?
	#--------------------------------------------------------
	isCollection: (object) -> 
		object? and object instanceof Falcon.Collection
	#END isCollection

	#--------------------------------------------------------
	# Method: Falcon.isView()
	#	Method used to test if an object is a Falcon View
	#
	# Arguments:
	#	**object** _(mixed)_ -  The object to test
	#
	# Returns:
	#	_(Boolean)_ - Is the object a view?
	#--------------------------------------------------------
	isView: (object) -> 
		object? and object instanceof Falcon.View
	#END isView

	#--------------------------------------------------------
	# Method: Falcon.isDataObject()
	#	Method used to test if an object is a Falcon Model or Colleciton
	#
	# Arguments:
	#	**object** _(mixed)_ -  The object to test
	#
	# Returns:
	#	_(Boolean)_ - Is the object a falcon data object?
	#--------------------------------------------------------
	isDataObject: (object) -> 
		object? and ( object instanceof Falcon.Model or object instanceof Falcon.Collection )
	#END isDataObject

	#--------------------------------------------------------
	# Method: Falcon.isFalconObject()
	#	Method used to test if an object is a Falcon Specific 
	#	Object (View, Model, or Collection).
	#
	# Arguments:
	#	**object** _(mixed)_ -  The object to test
	#
	# Returns:
	#	_(Boolean)_ - Is the object a falcon object?
	#--------------------------------------------------------
	isFalconObject: (object) ->
		object? and ( object instanceof Falcon.Class )
	#END isFalconObjext

	#--------------------------------------------------------
	# Method: Falcon.addBinding()
	#	Method used to add a new binding for Knockout
	#
	# Arguments:
	#	**name** _(String)_ -  The binding name
	#	**definition** _(Object)_ -  The binding definition
	#	**allowVirtual** _(Boolean)_ - Should this binding be accessible using ko comments
	#
	# Returns:
	#	_(Object)_ - The binding definition
	#--------------------------------------------------------
	addBinding: (name, definition, allowVirtual) ->
		[definition, allowVirtual] = [allowVirtual, definition] if isBoolean( definition )
		ko.virtualElements.allowedBindings[name] = true if allowVirtual
		ko.bindingHandlers[name] = definition
	#END addBinding
#END Falcon

