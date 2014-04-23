#--------------------------------------------------------
# Method: ko.bindingHandlers.view
#	Mehod used to handle view objects, fetching their html
#	and binding them against their memebr objects
#--------------------------------------------------------
ko.bindingHandlers['view'] = do ->
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

	'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
		options = _standardizeOptions(valueAccessor)
		view = options.data
		is_displayed = false
		is_disposing = false
		continuation = (->)

		if ko.isSubscribable( view )
			oldViewModel = ko.unwrap( view )
			subscription = view.subscribe (newViewModel) ->
				oldViewModel._unrender() if Falcon.isView(oldViewModel)
				oldViewModel = newViewModel
			#END subscribe

			ko.utils.domNodeDisposal.addDisposeCallback element, ->
				oldViewModel._unrender() if Falcon.isView(oldViewModel)
				subscription.dispose()
			#END domDisposal
		#END if subscribable

		else if Falcon.isView( view )
			ko.utils.domNodeDisposal.addDisposeCallback element, ->
				view._unrender()
			#END domDisposal
		#END if

		container = document.createElement('div')

		anonymous_template = new ko.templateSources.anonymousTemplate(element)
		anonymous_template['nodes'](container)
		anonymous_template['text']("")

		ko.computed
			disposeWhenNodeIsRemoved: element
			read: ->
				options = _standardizeOptions(valueAccessor)
				afterDisplay = ko.utils.peekObservable( options['afterDisplay'] )
				beforeDispose = ko.utils.peekObservable( options['beforeDispose'] )
				
				view = ko.unwrap( options.data )
				is_view = Falcon.isView( view )
				is_loaded = is_view and ko.unwrap( view.__falcon_view__is_loaded__ )
				should_display = is_loaded and ko.unwrap( options['displayIf'] )
				template = ( if should_display then (view.template() ? "") else "" ).toString()
				should_display = not isEmpty( template )

				continuation = ->
					continuation = (->)
					is_disposing = false
					is_displayed = false

					unless should_display
						if is_view and view.__falcon_view__is_rendered__
							view._unrender()
						#END if

						return ko.virtualElements.emptyNode(element)
					#END unless
					
					childContext = context.createChildContext(viewModel).extend( '$view': view.viewModel() )
							
					container.innerHTML = template
					anonymous_template['text'](template)
					
					ko.renderTemplate(element, childContext, {}, element)

					is_displayed = true

					view._render()

					if isFunction(afterDisplay)
						afterDisplay( ko.virtualElements.childNodes(element) )
					#END if
				#END continuation

				return if is_disposing

				if is_displayed and isFunction(beforeDispose)
					if ( beforeDispose.__falcon_bind__length__ ? beforeDispose.length ) is 2
						is_disposing = true
						beforeDispose ko.virtualElements.childNodes(element), ->
							continuation()
						#END beforeDispose
					else
						beforeDispose( ko.virtualElements.childNodes(element) )
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

#Checks to see (and keeps track) if a collection is actually updated
_shouldUpdate = (element, value) ->
	return true unless Falcon.isCollection(value)

	lastCId = ko.utils.domData.get(element, "__falcon_object__cid__")
	CId = value.__falcon_object__cid__

	changeCount = value.__falcon_collection__change_count__
	lastChangeCount = ko.utils.domData.get(element, "__falcon_collection___change_count__")

	return false if lastChangeCount is changeCount and lastCId is CId

	ko.utils.domData.set(element, '__falcon_object__cid__', CId)
	ko.utils.domData.set(element, '__falcon_collection___change_count__', changeCount)

	return true
#END _shouldUpdate

#Store a copy of the old foreach
_foreach = ko.bindingHandlers['foreach'] ? {}

ko.bindingHandlers['foreach'] = 
	'init': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		ko.utils.domData.set(element, '__falcon_collection___change_count__', -1)
		return _foreach['init'](element, _getForeachItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		if _shouldUpdate(element, value)
			return _foreach['update'](element, _getForeachItems(value), args...)
		#END if
		return
	#END update
#END foreach override

#Map the rest of the values in, right now is just makeValueTemplateAccessor
for key, value of _foreach when key not of ko.bindingHandlers['foreach']
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

_options = ko.bindingHandlers['options'] ? (->)

ko.bindingHandlers['options'] = do ->
	'init': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		ko.utils.domData.set(element, '__falcon_collection___change_count__', -1)
		return ( _options['init'] ? (->) )(element, _getOptionsItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.unwrap( valueAccessor() )
		if _shouldUpdate(element, value)
			return ( _options['update'] ? (->) )(element, _getOptionsItems(value), args...)
		#END if
		return
	#END update
#END foreach override

#--------------------------------------------------------
# Method: ko.bindingHandlers.log
#	Debug binding to log observable values
#--------------------------------------------------------
ko.bindingHandlers['log'] =
	update: (element, valueAccessor) ->
		console.log( ko.unwrap( valueAccessor() ) )
	#END update
#END log


#--------------------------------------------------------
# Extends onto the context varibales utilized in knockout templating
# to include $view (to access this view's members easily)
#--------------------------------------------------------

#Define which bindings should be allowed to be virtual
ko.virtualElements.allowedBindings['view'] = true
ko.virtualElements.allowedBindings['log'] = true