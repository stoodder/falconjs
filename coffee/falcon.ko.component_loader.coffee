ko.components.loaders.unshift
	loadComponent: (tag_name, view_definition, callback) ->
		if Falcon.isView(view_definition.prototype)
			Falcon.templateAdapter.resolveTemplate view_definition.prototype, (template) ->
				element = document.createElement('div')
				element.innerHTML = template

				callback({
					template: ko.utils.cloneNodes(element.childNodes)
					createViewModel: (params) ->
						view = new view_definition(params)

						params['__falcon_component_view__'] = view
						view._render()

						return view.createViewModel()
					#END createViewModel
				})
			#END resolveTemplate
		else
			callback(null)
		#END if

		return
	#END loadComponent
#END unishift