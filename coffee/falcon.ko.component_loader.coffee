ko.components.loaders.unshift do ->
	head_element = document.head ? document.getElementsByTagName("head")[0]

	loadComponent: (tag_name, config, callback) ->
		if '__falcon_component_definition__' of config
			view_definition = config['__falcon_component_definition__']
			Falcon.templateAdapter.resolveTemplate view_definition::, (template) ->
				element = document.createElement('div')
				element.innerHTML = template

				if isString(view_definition::style)
					stylesheet = document.createElement("style")
					stylesheet.innerHTML = view_definition::style
					head_element.appendChild(stylesheet)

					(_recurse = (sheet) ->
						rules = sheet.cssRules ? sheet.rules ? []

						for rule, index in rules when index < rules.length and rule?
							switch rule.type
								when CSSRule.STYLE_RULE
									css = trim(rule.cssText)
									if css.indexOf(tag_name) is -1
										sheet.deleteRule(index)
										css = "#{tag_name} #{css}" 
										sheet.insertRule(css, index)
									#END if
								when CSSRule.MEDIA_RULE
									_recurse(rule)
								#END when
							#END switch
						#END for
					)(stylesheet.styleSheet ? stylesheet.sheet ? {})
				#END if

				callback({
					synchronous: view_definition::synchronous
					template: cloneNodes(element.childNodes)
					createViewModel: (params, info) ->
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