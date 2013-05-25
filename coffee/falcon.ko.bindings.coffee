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

	getTemplate = (value) -> 
		template = ""
		value ?= {}

		if value instanceof Falcon.View
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

			if value? and ko.isSubscribable( value )
				oldViewModel = ko.utils.unwrapObservable( value )
				subscription = value.subscribe (newViewModel) ->
					oldViewModel.unrender() if Falcon.isView(oldViewModel)
					oldViewModel = newViewModel
				#END subscribe

				ko.utils.domNodeDisposal.addDisposeCallback element, ->
					oldViewModel.unrender() if Falcon.isView(oldViewModel)
					subscription.dispose()
				#END domDisposal
			#END if subscribable

			else if Falcon.isView( value )
				ko.utils.domNodeDisposal.addDisposeCallback element, ->
					value.unrender()
				#END domDisposal
			#END if

			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)
				
			ko.bindingHandlers['template']['init'](
				element,
				makeTemplateValueAccessor(viewModel),
				allBindingsAccessor,
				viewModel,
				context
			)
			
			return returnVal
		#END init

		'update': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)
			template = getTemplate(value)

			return returnVal unless isObject( value )

			#Store the original view context to revert later, otherwise syncing issues occur
			parentViewContext = context['$view']

			#Setup the new view context
			context['$view'] = viewModel

			#The method below is added to the viewModel upon creation due to the fact that proto 
			#method are abstracted away during viewModel generation, it's used to notify a view 
			#which views have been created within its context.  This is then used when destroying 
			#the view to also ensure that we destroy child views.
			parentViewContext['__falcon_view__addChildView__']( value ) if parentViewContext?['__falcon_view__addChildView__']?

			if isEmpty( viewModel ) or isEmpty( template )
				$(element).empty()
			else if not (value instanceof Falcon.View) or ko.utils.unwrapObservable( value.is_loaded )

				anonymousTemplate = ko.utils.domData.get(element, '__ko_anon_template__')
				if anonymousTemplate.containerData?.innerHTML?
					anonymousTemplate.containerData.innerHTML = template
				else
					anonymousTemplate.textData = template
				#END if

				ko.bindingHandlers['template']['update'](
					element,
					makeTemplateValueAccessor(viewModel),
					allBindingsAccessor, 
					viewModel, 
					context
				)
				#END evaluateTemplate

				execScripts = !!ko.utils.unwrapObservable(value.execScripts)
				if template isnt anonymousTemplate and execScripts is true
					$(element).find("script").each( (index, script) ->
						script = $(script)
						eval( script.text() ) if script.attr('type').toLowerCase() is "text/javascript"
					)
				#END if template updated

				#Notify the view that it is being displayed
				value.render() if Falcon.isView( value )
			#END if not template?

			#Revert this back to the parent view (so we keep the correct context)
			context['$view'] = parentViewContext

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
	items = ko.utils.unwrapObservable( if Falcon.isCollection(value) then value.models() else value )
	items = [items] unless isArray(items)

	return ( -> items )
#END _getItems

#Checks to see (and keeps track) if a collection is actually updated
_shouldUpdate = (element, value) ->
	return true unless Falcon.isCollection(value)

	changeCount = value.__falcon_collection__change_count__
	lastChangeCount = ko.utils.domData.get(element, "__falcon_collection___change_count__")

	return false if lastChangeCount is changeCount

	ko.utils.domData.set(element, '__falcon_collection___change_count__', changeCount)

	return true
#END _shouldUpdate

#Store a copy of the old foreach
_foreach = ko.bindingHandlers['foreach'] ? (->)

ko.bindingHandlers['foreach'] = 
	'init': (element, valueAccessor, args...) ->
		value = ko.utils.unwrapObservable( valueAccessor() )
		ko.utils.domData.set(element, '__falcon_collection___change_count__', -1)
		return ( _foreach['init'] ? (->) )(element, _getItems(value), args...)
	#END init

	'update': (element, valueAccessor, args...) ->
		value = ko.utils.unwrapObservable( valueAccessor() )
		if _shouldUpdate(element, value)
			return ( _foreach['update'] ? (->) )(element, _getItems(value), args...)
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
_bindingContext = ko.bindingContext
ko.bindingContext = (dataItem, parentBindingContext) ->
	if not this['$view']? and parentBindingContext?
		this['$view'] = parentBindingContext['$view'] or parentBindingContext['$root']
	#end if
	
	_bindingContext.call(this, dataItem, parentBindingContext)
#END ko.bindingContext extension
ko.bindingContext.prototype = _bindingContext.prototype

#Define which bindings should be allowed to be virtual
ko.virtualElements.allowedBindings['view'] = true
ko.virtualElements.allowedBindings['log'] = true