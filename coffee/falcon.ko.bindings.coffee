#--------------------------------------------------------
# Method: ko.bindingHandlers.view
#	Mehod used to handle view objects, fetching their html
#	and binding them against their memebr objects
#--------------------------------------------------------
ko.bindingHandlers['view'] = 
	'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
		view = valueAccessor()

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
Falcon.__binding__original_foreach__ = ko.bindingHandlers['foreach'] ? {}
ko.bindingHandlers['foreach'] = 
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

Falcon.__binding__original_options__ = ko.bindingHandlers['options'] ? (->)
ko.bindingHandlers['options'] = do ->
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