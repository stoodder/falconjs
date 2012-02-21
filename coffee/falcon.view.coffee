###
#
###
class Falcon.View extends Falcon.Class

	###
	#
	###
	templateCache = {}
	
	###
	#
	###
	@extend = (definition) -> Falcon.Class.extend(Falcon.View, definition)

	###
	#
	###
	model: null

	###
	#
	###
	url: null

	###
	#
	###
	template: null

	###
	#
	###
	constructor: () ->
		model = ko.utils.unwrapObservable( @model )
		url = ko.utils.unwrapObservable( @url )
		template = ko.utils.unwrapObservable( @template )

		@template = ko.observable(template).extend(throttle: 1)
		@url = ko.observable(url).extend(throttle: 1)
		@model = ko.observable(model)

		@url.subscribe( do => @getTemplateHtml() )

		@initialize()
	
	initialize: (->)
	
	###
	#
	###
	viewModel: () ->
		viewModel = {}

		model = @model()
		model = model.toJS() if model instanceof Falcon.Model

		for key, value of this
			viewModel[key] = value unless key of Falcon.View.prototype

		extend(viewModel, model)

		return viewModel
	
	###
	#
	###
	getTemplateHtml: () ->
		url = @url()
		url = "" unless isString(url)
		url = trim(url)

		return if isEmpty(url)
		return @template(templateCache[url]) if url of templateCache

		$.ajax(
			url: url
			type: "GET"
			success: (html) =>
				templateCache[url] = html
				@template(html)
		)