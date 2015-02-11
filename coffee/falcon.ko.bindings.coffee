#--------------------------------------------------------
# Method: ko.bindingHandlers.view
#	Mehod used to handle view objects, fetching their html
#	and binding them against their memebr objects
#--------------------------------------------------------
Falcon.addBinding 'view', true, do ->
	_standardizeOptions = (valueAccessor) ->
		options = valueAccessor()
		options = {data: options} if Falcon.isView( options ) or ko.isObservable( options )
		options = {} unless isObject(options)
		options['data'] ?= null
		options['displayIf'] ?= true
		options['afterDisplay'] ?= null
		options['beforeDispose'] ?= null
		return options
	#END _standardizeOptions

	_runUnobserved = (callback, context) ->
		computed = ko.computed -> callback?.call(context ? this)
		computed.peek()
		computed.dispose()
	#END _runUnobserved

	_tryUnrender = (view) ->
		return unless Falcon.isView( view )
		return unless view.__falcon_view__is_rendered__
		_runUnobserved(view._unrender, view)
	#END _tryUnrender

	return 'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
		view = null
		oldView = null
		is_displayed = false
		is_disposing = false
		continuation = (->)

		original_template = element.innerHTML ? ""
		container = document.createElement('div')

		anonymous_template = new ko.templateSources.anonymousTemplate(element)
		anonymous_template['nodes'](container)
		anonymous_template['text']("")

		ko.utils.domNodeDisposal.addDisposeCallback element, ->
			_tryUnrender(view)
		#END domDisposal

		ko.computed
			disposeWhenNodeIsRemoved: element
			read: ->
				options = _standardizeOptions(valueAccessor)
				view = ko.unwrap( options.data )

				template = if Falcon.isView( view ) then ko.unwrap(view.__falcon_view__loaded_template__) else original_template
				template = original_template unless isString(template)

				afterDisplay = ko.utils.peekObservable( options['afterDisplay'] )
				beforeDispose = ko.utils.peekObservable( options['beforeDispose'] )
				
				should_display = ko.unwrap( options['displayIf'] ) isnt false
				should_display = should_display and not isEmpty( template )

				continuation = ->
					continuation = (->)
					is_disposing = false
					is_displayed = false

					if view isnt oldView
						_tryUnrender(oldView)
						oldView = view
					#END if

					unless should_display
						_tryUnrender(view)
						return ko.virtualElements.emptyNode(element)
					#END unless
					
					view_model = if Falcon.isView(view) then view.createViewModel() else {}
					childContext = context.createChildContext(viewModel).extend({
						'$rawView': view
						'$view': view_model
						'$data': view_model
						'$root': context['$root'] ? view_model
					})
							
					container.innerHTML = template
					anonymous_template['text'](template)
					
					ko.renderTemplate(element, childContext, {}, element)

					is_displayed = true

					_runUnobserved(view?._render, view)

					if isFunction(afterDisplay)
						afterDisplay( ko.virtualElements.childNodes(element), view )
					#END if
				#END continuation

				return if is_disposing

				if is_displayed and isFunction(beforeDispose)
					beforeDispose_length = beforeDispose.__falcon_bind__length__ ? beforeDispose.length ? 0
					if beforeDispose_length is 3
						is_disposing = true
						beforeDispose ko.virtualElements.childNodes(element), view, ->
							continuation()
						#END beforeDispose
					else if beforeDispose_length is 2
						is_disposing = true
						beforeDispose ko.virtualElements.childNodes(element), ->
							continuation()
						#END beforeDispose
					else
						beforeDispose( ko.virtualElements.childNodes(element), view )
						continuation()
					#END if
				else
					continuation()
				#END if
			#END read
		#END computed

		return { controlsDescendantBindings: true }
	#END init
#END view binding handler


#--------------------------------------------------------
# Method: ko.bindingHandlers.foreach
#	Override the default foreach handler to also take into account
#	Falcon collection objects
#--------------------------------------------------------
#Interal method used to get a the expected models
_getForeachItems = (value) ->
	value = ko.utils.peekObservable( value )
	value = {data: value} if Falcon.isCollection( value ) or isArray( value )
	value = {} unless isObject( value )

	value.data = ko.unwrap( value.data )
	value.data = value.data.models() if Falcon.isCollection( value.data )
	value.data ?= []

	return ( -> value )
#END _getForeachItems

#Store a copy of the old foreach
Falcon.__binding__original_foreach__ = Falcon.getBinding('foreach') ? {}
Falcon.addBinding 'foreach',
	'init': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		return Falcon.__binding__original_foreach__['init'](element, _getForeachItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		return Falcon.__binding__original_foreach__['update'](element, _getForeachItems(value), args...)
	#END update
#END foreach override

#Map the rest of the values in, right now is just makeValueTemplateAccessor
for key, value of Falcon.__binding__original_foreach__ when key not of ko.bindingHandlers['foreach']
	ko.bindingHandlers['foreach'][key] = value
#END for

#--------------------------------------------------------
# Method: ko.bindingHandlers.options
#	override the options binding to account for collections
#--------------------------------------------------------
_getOptionsItems = (value) ->
	value = ko.unwrap( value )
	value = value.models() if Falcon.isCollection( value )

	return ( -> value )
#END _getOptionsItems

Falcon.__binding__original_options__ = Falcon.getBinding('options') ? {}
Falcon.addBinding 'options',
	'init': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		return ( Falcon.__binding__original_options__['init'] ? (->) )(element, _getOptionsItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		return ( Falcon.__binding__original_options__['update'] ? (->) )(element, _getOptionsItems(value), args...)
	#END update
#END options override

#Map the rest of the values from the original binding
for key, value of Falcon.__binding__original_options__ when key not of ko.bindingHandlers['options']
	ko.bindingHandlers['options'][key] = value
#END for

#--------------------------------------------------------
# Method: ko.bindingHandlers.log
#	Debug binding to log observable values
#--------------------------------------------------------
Falcon.addBinding 'log', true, (element, valueAccessor) ->
	console.log( ko.unwrap( valueAccessor() ) )
#END log

#--------------------------------------------------------
# Method: ko.bindingHandlers.component
#	Overriding the original component binding to account for
#	falcon views
#--------------------------------------------------------
Falcon.__binding__original_component__ = Falcon.getBinding('component') ? {}
Falcon.addBinding 'component', true, 'init': (element, valueAccessor, allBindings, viewModel, bindingContext) ->
	Falcon.onDispose element, ->
		return unless isObject( value = ko.unwrap( valueAccessor() ) )
		return unless isObject( params = value['params'] )
		return unless Falcon.isView( view = params['__falcon_component_view__'] )
		view._unrender()
	#END onDispose

	Falcon.__binding__original_component__['init'].apply(@, arguments)
	ko.virtualElements.emptyNode(element)
#END component

#--------------------------------------------------------
# Method: ko.bindingHandlers.yield
#	Binding used to yield to the original contents of a component
#--------------------------------------------------------
Falcon.addBinding 'yield', true, 'init': (element, valueAccessor, allBindings, viewModel, bindingContext) ->
	yieldedNodes = bindingContext['$componentTemplateNodes']
	defaultNodes = ko.virtualElements.childNodes(element)

	ko.computed
		disposeWhenNodeIsRemoved: element
		read: ->
			value = ko.unwrap( valueAccessor() )

			if value isnt false
				clonedNodes = cloneNodes(yieldedNodes)
			else
				clonedNodes = cloneNodes(defaultNodes)
			#END if

			ko.virtualElements.setDomNodeChildren(element, clonedNodes)
			ko.applyBindingsToDescendants(bindingContext, element)
		#END read
	#END computed

	return {controlsDescendantBindings: true}
#END yield