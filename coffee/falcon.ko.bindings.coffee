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
			template = ko.utils.unwrapObservable( value.template ? {} )
		return template
	#END getTemplate

	return {
		'init': (element, valueAccessor) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)

			ko.bindingHandlers['template']['init'](
				element,
				makeTemplateValueAccessor(viewModel)
			)
		#END init

		'update': (element, valueAccessor, args...) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)
			template = getTemplate(value)

			return if isEmpty(template)
			return if isEmpty(viewModel)

			return if ko.utils.domData.get(element, '__ko_view_updating__') is true
			ko.utils.domData.set(element, '__ko_view_updating__', true)

			defer ->
				execScripts = !!ko.utils.unwrapObservable(value.execScripts)

				if not template?
					$(element).html("")
				else
					originalTemplate = ko.utils.domData.get(element, '__ko_anon_template__')
					ko.utils.domData.set(element, '__ko_anon_template__', template)

					ko.bindingHandlers['template']['update'](
						element,
						makeTemplateValueAccessor(viewModel),
						args...
					)

					if template isnt originalTemplate and execScripts is true
						$(element).find("script").each( (index, script) ->
							script = $(script)
							eval( script.text() ) if script.attr('type').toLowerCase() is "text/javascript"
						)
					#END if template updated
				#END if not template?
				
				ko.utils.domData.set(element, '__ko_view_updating__', false)
			#END defer
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

ko.bindingHandlers['foreach'] = do ->
	#Interal method used to get a the expected list
	getItems = (items) ->
		items = items.unwrap() if Falcon.isDataObject(items)
		items = [items] unless isArray(items)

		return ( -> items )
	#END getItems

	return {
		'init': (element, valueAccessor, args...) ->
			value = ko.utils.unwrapObservable( valueAccessor() )
			_foreach['init'](element, getItems(value), args...)
		#END init

		'update': (element, valueAccessor, args...) ->
			value = ko.utils.unwrapObservable( valueAccessor() )
			_foreach['update'](element, getItems(value), args...)
		#END update
	} #END return
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