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
				'if': viewModel
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

	return {
		'init': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)

			ko.bindingHandlers['template']['init'](
				element,
				makeTemplateValueAccessor(viewModel),
				allBindingsAccessor,
				viewModel,
				context
			)

			return { controlsDescendantBindings: true }
		#END init

		'update': (element, valueAccessor, allBindingsAccessor, viewModel, context) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			context['$view'] = value
			viewModel = getViewModel(value)
			template = getTemplate(value)

			return unless isObject( value )

			return if ko.utils.domData.get(element, '__falcon_view_updating__') is true
			ko.utils.domData.set(element, '__falcon_view_updating__', true)

			execScripts = !!ko.utils.unwrapObservable(value.execScripts)

			if not template?
				$(element).html("")
			else if isEmpty(viewModel)
				$(element).html("")
			else
				anonymousTemplate = ko.utils.domData.get(element, '__ko_anon_template__')
				anonymousTemplate.containerData.innerHTML = template

				ko.bindingHandlers['template']['update'](
					element,
					makeTemplateValueAccessor(viewModel),
					allBindingsAccessor, 
					viewModel, 
					context
				)

				if template isnt anonymousTemplate and execScripts is true
					$(element).find("script").each( (index, script) ->
						script = $(script)
						eval( script.text() ) if script.attr('type').toLowerCase() is "text/javascript"
					)
				#END if template updated
			#END if not template?
			
			ko.utils.domData.set(element, '__falcon_view_updating__', false)

			return { controlsDescendantBindings: true }
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
