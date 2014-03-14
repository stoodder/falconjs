Falcon.addConductor = do ->
	_conductors = {}
	_conductor_count = 0
	_conductor_definitions = {}
	_preprocessor = ko.bindingProvider.instance.preprocessNode

	_createConductorCallback = (node, callback) ->
		view = null
		childContext = null
		id = _conductor_count++

		#Create the conductor definition
		_conductor_definitions[id] = (context, viewModel) ->
			childContext = context.createChildContext(viewModel)
			attributes = _evaluateAttributes(node, childContext)
			view = callback(node, attributes, childContext)
			childContext = childContext.extend('$self': view)

			bindingAccessors = ko.bindingProvider.instance.getBindingAccessors(node, childContext) ? {}
			bindingAccessors['view'] = -> view
			ko.applyBindingAccessorsToNode(node, bindingAccessors, childContext)
		#END return

		#When this node is removed from the DOM, kill the conductor as well
		ko.utils.domNodeDisposal.addDisposeCallback node, ->
			delete _conductor_definitions[id]
		#END disposal

		node.parentNode.insertBefore( c1 = document.createComment("ko conductor_id: #{id}"), node )
		node.parentNode.insertBefore( c2 = document.createComment("/ko"), node.nextSibling )

		#Return the id of the conductor for potential later use
		return [c1,c2]
	#END _createConductorCallback

	_shouldEvaluateAttribute = (value) ->
		return false unless isString( value )
		value = trim( value )
		return true if value.indexOf("$self") is 0
		return true if value.indexOf("$view") is 0
		return true if value.indexOf("$data") is 0
		return true if value.indexOf("$root") is 0
		return true if value.indexOf("$parent") is 0
		return false
	#END _shouldEvaluateAttribute

	_evaluateAttributes = (node, parentBindingContext) ->
		attributes = {}

		for attr in node.attributes when attr.name.toLowerCase() isnt "data-bind"
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
					added = _createConductorCallback(node, (node, attributes, childContext) ->
						return new conductor( attributes )
					)
				else if isFunction( conductor )
					added = _createConductorCallback(node, (node, attributes, childContext) ->
						viewModel = childContext['$data']
						return conductor( node, attributes, viewModel, childContext)
					)
				#END if
			#END if
		#END if

		added = (_preprocessor?.call(@, node) ? []).concat(added)

		return (if added.length > 0 then added else null)
	#END preprocessNode

	returnVal = { controlsDescendantBindings: true }

	Falcon.addBinding 'conductor_id', true,
		'init': (element, valueAccessor, allBindings, viewModel, context) ->
			id = valueAccessor()
			_conductor_definitions[id]?(context, viewModel)
			return returnVal
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