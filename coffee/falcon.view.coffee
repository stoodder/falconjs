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

	_loaded: false
	_loadQueue: []

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

		@template = ko.observable(template)
		@url = ko.observable(url)
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

		@_loaded = true
		if isEmpty(url)
			return this
		else if url of templateCache
			@template(templateCache[url])
			@load()
		else
			@_loaded = false
			$.ajax(
				url: url
				type: "GET"
				success: (html) =>
					templateCache[url] = html
					@template(html)
					@_loaded = true
					@load()
			)

		return this
	
	load: (callback) ->
		if callback?
			callback = (->) unless isFunction(callback)
			if @_loaded then callback() else @_loadQueue.push(callback)
		else if @_loaded
			@_loadQueue.shift()() until @_loadQueue.length <= 0
		
		return this