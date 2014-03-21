Falcon.addConductor = do ->
	IGNORED_ATTRIBUTES = ["data-bind"]
	_conductors = {}
	_conductor_count = 0
	_conductor_definitions = {}
	_preprocessor = ko.bindingProvider.instance.preprocessNode

	_createConductorCallback = (node, callback) ->
		childContext = null
		id = _conductor_count++

		#Create the conductor definition
		_conductor_definitions[id] = (parentBindingContext) ->
			view = null
			bindingAccessors = ko.bindingProvider.instance.getBindingAccessors(node, parentBindingContext) ? {}
			
			bindingAccessors['view'] = ->
				return view if view?
				attributes = _evaluateAttributes(node, parentBindingContext)
				return ( view = callback(node, attributes, parentBindingContext) )
			#END bindingAccessors

			delete bindingAccessors['conductor'] if bindingAccessors?['conductor']?

			ko.applyBindingAccessorsToNode(node, bindingAccessors, parentBindingContext)
		#END return

		#When this node is removed from the DOM, kill the conductor as well
		ko.utils.domNodeDisposal.addDisposeCallback node, ->
			delete _conductor_definitions[id]
		#END disposal


		data_bind = trim( node.getAttribute("data-bind") ? "" )
		unless isEmpty( data_bind )
			data_bind = "conductor: #{id}, #{data_bind}"
		else
			data_bind = "conductor: #{id}"
		#END unless
		node.setAttribute("data-bind", data_bind)
	#END _createConductorCallback

	_shouldEvaluateAttribute = (value) ->
		return false unless isString( value )
		value = trim( value )
		return true if value.indexOf("$view") is 0
		return true if value.indexOf("$data") is 0
		return true if value.indexOf("$root") is 0
		return true if value.indexOf("$parent") is 0
		return false
	#END _shouldEvaluateAttribute

	_evaluateAttributes = (node, parentBindingContext) ->
		attributes = {}

		for attr in node.attributes when not ( attr.name.toLowerCase() in IGNORED_ATTRIBUTES )
			name = attr.name
			value = attr.value

			if _shouldEvaluateAttribute(value)
				function_body = "with($context){with($data||{}){return " + value + ";}}";
				value = ( new Function("$context", "$element", function_body) )(parentBindingContext, node)
			#END if

			attributes[name] = value
		#END for

		return attributes
	#END _evaluateAttributes

	ko.bindingProvider.instance.preprocessNode = (node) ->
		added = []

		if node?.nodeType is 1
			tag_name = trim( node.tagName ? "" ).toLowerCase()
			conductor = _conductors[tag_name]

			if conductor?
				if Falcon.isView(conductor.prototype)
					_createConductorCallback(node, (node, attributes, childContext) ->
						return new conductor( attributes )
					)
				else if isFunction( conductor )
					_createConductorCallback(node, (node, attributes, childContext) ->
						viewModel = childContext['$data']
						return conductor( node, attributes, viewModel, childContext)
					)
				#END if
			#END if
		#END if

		nodes = _preprocessor?.call(@, node) ? []

		return (if nodes.length > 0 then nodes else null)
	#END preprocessNode

	Falcon.addBinding 'conductor',
		'init': (element, valueAccessor, allBindings, viewModel, context) ->
			id = valueAccessor()
			_conductor_definitions[id]?(context)
			return { controlsDescendantBindings: true }
		#END init
	#END addBinding

	return (tag_name, conductor) ->
		tag_name = trim( tag_name ).toLowerCase()

		document.createElement(tag_name)
		conductor = Falcon.View.extend(conductor) if isObject(conductor) and not Falcon.isFalconObject(conductor)
		_conductors[tag_name] = conductor

		return Falcon
	#END
#END addConductor