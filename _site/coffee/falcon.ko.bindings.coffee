#--------------------------------------------------------
# Method: ko.bindingHandlers.view
#	Mehod used to handle view objects, fetching their html
#	and binding them against their memebr objects
#--------------------------------------------------------
ko.bindingHandlers['view'] = 
	'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
		view = valueAccessor()

		if ko.isSubscribable( view )
			oldViewModel = ko.utils.unwrapObservable( view )
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
				view = ko.unwrap( valueAccessor() )

				return ko.virtualElements.emptyNode(element) unless Falcon.isView( view )
				return ko.virtualElements.emptyNode(element) unless view.__falcon_view__is_loaded__()

				template = ( view.template() ? "" ).toString()

				return ko.virtualElements.emptyNode(element) if isEmpty( template )

				#The method below is added to the viewModel upon creation due to the fact that proto 
				#method are abstracted away during viewModel generation, it's used to notify a view 
				#which views have been created within its context.  This is then used when destroying 
				#the view to also ensure that we destroy child views.
				context['__falcon_view__addChildView__']( view ) if context?['__falcon_view__addChildView__']?
				
				childContext = context.createChildContext(viewModel).extend( '$view': view.viewModel() )
				
				container.innerHTML = template
				anonymous_template['text'](template)
				
				ko.renderTemplate(element, childContext, {}, element)

				view._render()
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
	#END update
#END log


#--------------------------------------------------------
# Extends onto the context varibales utilized in knockout templating
# to include $view (to access this view's members easily)
#--------------------------------------------------------

#Define which bindings should be allowed to be virtual
ko.virtualElements.allowedBindings['view'] = true
ko.virtualElements.allowedBindings['log'] = true