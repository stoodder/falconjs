#Add a knockout binding for views
ko.bindingHandlers["view"] = ( ->
	makeTemplateValueAccessor = (viewModel) ->
		() ->
			return {
				'if': viewModel
				'data': viewModel
				'templateEngine': ko.nativeTemplateEngine.instance
			}
	
	getViewModel = (value) -> 
		viewModel = {}
		if value instanceof Falcon.View
			viewModel = value.viewModel()
		else
			viewModel = ko.utils.unwrapObservable( value.viewModel ? {} )
		return viewModel

	getTemplate = (value) -> 
		template = ""
		if value instanceof Falcon.View
			template = value.template()
		else
			template = ko.utils.unwrapObservable( value.template ? {} )
		return template
	
	return {
		'init': (element, valueAccessor) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)


			ko.bindingHandlers['template']['init'](
				element,
				makeTemplateValueAccessor(viewModel)
			)

		'update': (element, valueAccessor, args...) ->
			value = valueAccessor()
			value = ko.utils.unwrapObservable(value)
			viewModel = getViewModel(value)
			template = getTemplate(value)

			console.log template

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
	}
)()