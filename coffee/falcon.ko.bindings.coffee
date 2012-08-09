#--------------------------------------------------------
# INTERNAL PRIVATE METHODS FOR THE BINDING HANDLERS
#--------------------------------------------------------

#Checks to see (and keeps track) if a collection is actually updated
_shouldUpdate = (element, value) ->
	return true unless Falcon.isCollection(value)

	changeCount = value.__change_count__
	lastChangeCount = ko.utils.domData.get(element, "__falcon_collection___change_count__")

	return false if lastChangeCount is changeCount

	ko.utils.domData.set(element, '__falcon_collection___change_count__', changeCount)

	return true
#END _.shouldChange

#Interal method used to get a the expected list
_getItems = (value) ->
	items = ko.utils.unwrapObservable( if Falcon.isCollection(value) then value.list() else value )
	items = [items] unless isArray(items)

	return ( -> items )
#END _getItems

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
		return viewModel
	#END getViewModel

	getTemplate = (value) -> 
		template = ""
		value ?= {}
		if value instanceof Falcon.View
			template = value.template()
		else
			template = ko.utils.unwrapObservable( value.template ? "" )
		return template
	#END getTemplate

	returnVal = { controlsDescendantBindings: true }

	return {
		'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)
			
			value.template( $(element).html() ) if value instanceof Falcon.View and not value.url
				
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
			originalViewContext = context['$view']

			#Setup the new view context
			context['$view'] = viewModel

			if isEmpty( viewModel ) or not template?
				$(element).html(" ")
			if not (value instanceof Falcon.View) or value.isLoaded()
				anonymousTemplate = ko.utils.domData.get(element, '__ko_anon_template__')
				anonymousTemplate.containerData.innerHTML = template
				anonymousTemplate.textData = template if ($.browser.msie and $.browser.version < 9)

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
			#END if not template?

			#Revert this back to the parent view (so we keep the correct context)
			context['$view'] = originalViewContext

			return returnVal
		#END update
	} #END return
#END view binding handler


#--------------------------------------------------------
# Method: ko.bindingHandlers.foreach
#	Override the default foreach handler to also take into account
#	Falcon collection objects
#--------------------------------------------------------
#Store a copy of the old foreach
_foreach = ko.bindingHandlers['foreach']

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

#Map the rest of the values in
for key, value of _foreach when key not of ko.bindingHandlers['foreach']
	ko.bindingHandlers['foreach'][key] = value
#END for

#--------------------------------------------------------
# Method: ko.bindingHandlers.collection
#	An alias for the overriden foreach binding
#--------------------------------------------------------
ko.bindingHandlers['collection'] = ko.bindingHandlers['foreach']


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
	#END update
#END foreach override
