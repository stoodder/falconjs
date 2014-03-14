#--------------------------------------------------------
# Method: ko.bindingHandlers.view
#	Mehod used to handle view objects, fetching their html
#	and binding them against their memebr objects
#--------------------------------------------------------
ko.bindingHandlers['view'] = do ->
	makeTemplateValueAccessor = (viewModel) ->
		return ->
			return {
				'data': viewModel
				'templateEngine': ko.nativeTemplateEngine.instance
			}
		#END return
	#END makeTemplateValueAccessor
	
	getViewModel = (value) -> 
		viewModel = {}
		value ?= {}

		if value instanceof Falcon.View
			viewModel = value.viewModel()
		else
			viewModel = ko.utils.unwrapObservable( value.viewModel ? {} )
		#END if

		return viewModel
	#END getViewModel

	getTemplate = (element, value) -> 
		template = ""
		value ?= {}

		if element.nodeType is 1 and not isEmpty(trim(element.innerHTML))
			return element.innerHTML
		else if value instanceof Falcon.View
			template = value.template()
		else
			template = ko.utils.unwrapObservable( value.template ? "" )
		#END if

		return template
	#END getTemplate

	returnVal = { controlsDescendantBindings: true }

	return {
		'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
			value = valueAccessor()

			if ko.isSubscribable( value )
				oldViewModel = ko.utils.unwrapObservable( value )
				subscription = value.subscribe (newViewModel) ->
					oldViewModel._unrender() if Falcon.isView(oldViewModel)
					oldViewModel = newViewModel
				#END subscribe

				ko.utils.domNodeDisposal.addDisposeCallback element, ->
					oldViewModel._unrender() if Falcon.isView(oldViewModel)
					subscription.dispose()
				#END domDisposal
			#END if subscribable

			else if Falcon.isView( value )
				ko.utils.domNodeDisposal.addDisposeCallback element, ->
					value._unrender()
				#END domDisposal
			#END if

			#templateNodes = ko.virtualElements.childNodes(element)
			#container = ko.utils.moveCleanedNodesToContainerElement(templateNodes)
			container = document.createElement('div')
			ko.utils.domData.set(element, "__falcon_view__container__", container)
			new ko.templateSources.anonymousTemplate(element)['nodes'](container)

			return returnVal
		#END init

		'update': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
			value = valueAccessor()
			value = value() if ko.isObservable( value )
			viewModel = getViewModel(value)
			template = getTemplate(element, value)

			ko.virtualElements.emptyNode(element) unless value?

			return returnVal unless isObject( value )

			#The method below is added to the viewModel upon creation due to the fact that proto 
			#method are abstracted away during viewModel generation, it's used to notify a view 
			#which views have been created within its context.  This is then used when destroying 
			#the view to also ensure that we destroy child views.
			context['__falcon_view__addChildView__']( value ) if context?['__falcon_view__addChildView__']?

			childContext = context.createChildContext(viewModel).extend('$view': viewModel)

			if isEmpty( viewModel ) or isEmpty( template )
				ko.virtualElements.emptyNode(element)
			else if not Falcon.isView( value ) or ko.utils.unwrapObservable( value.is_loaded )

				container = ko.utils.domData.get(element, "__falcon_view__container__")
				container.innerHTML = template
				ko.renderTemplate(element, childContext, {}, element)

				#TODO: Consider reverting back t using execScripts here

				#Notify the view that it is being displayed
				value._render() if Falcon.isView( value )
			#END if not template?

			return returnVal
		#END update
	} #END return
#END view binding handler


#--------------------------------------------------------
# Method: ko.bindingHandlers.foreach
#	Override the default foreach handler to also take into account
#	Falcon collection objects
#--------------------------------------------------------
#Interal method used to get a the expected models
_getItems = (value) ->
	value = ko.utils.peekObservable( value )
	value = {data: value} if Falcon.isCollection( value ) or isArray( value )
	value = {} unless isObject( value )

	value.data = ko.utils.unwrapObservable( value.data )
	value.data = value.data.models() if Falcon.isCollection( value.data )
	value.data ?= []

	return ( -> value )
#END _getItems

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
		value = ko.utils.unwrapObservable( valueAccessor() )
		ko.utils.domData.set(element, '__falcon_collection___change_count__', -1)
		return _foreach['init'](element, _getItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.utils.unwrapObservable( valueAccessor() )
		if _shouldUpdate(element, value)
			return _foreach['update'](element, _getItems(value), args...)
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
_options = ko.bindingHandlers['options'] ? (->)

ko.bindingHandlers['options'] = do ->
	'init': (element, valueAccessor, args...) ->
		value = ko.utils.unwrapObservable( valueAccessor() )
		ko.utils.domData.set(element, '__falcon_collection___change_count__', -1)
		return ( _options['init'] ? (->) )(element, _getItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.utils.unwrapObservable( valueAccessor() )
		if _shouldUpdate(element, value)
			return ( _options['update'] ? (->) )(element, _getItems(value), args...)
		#END if
		return
	#END update
#END foreach override

ko.bindingHandlers['log'] =
	update: (element, valueAccessor) ->
		console.log( ko.utils.unwrapObservable( valueAccessor() ) )
	#END update
#END log


#--------------------------------------------------------
# Extends onto the context varibales utilized in knockout templating
# to include $view (to access this view's members easily)
#--------------------------------------------------------

#Define which bindings should be allowed to be virtual
ko.virtualElements.allowedBindings['view'] = true
ko.virtualElements.allowedBindings['log'] = true