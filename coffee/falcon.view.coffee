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
	url: null

	###
	#
	###
	template: null

	###
	#
	###
	constructor: () ->
		# Validate the public variables
		@template = ko.observable( ko.utils.unwrapObservable( @template ) )
		@url = "" unless isString(@url)
		@url = trim(@url)


		# Validate the private variables
		@_loaded = false

		# Attempt to load the template from the server or cache
		if isEmpty(@url)
			@_loaded = true

		else if @url of templateCache
			@_loaded = true
			@template(templateCache[@url])

		else
			$.ajax(
				url: @url
				type: "GET"
				cache: false
				success: (html) =>
					templateCache[@url] = html
					@template(html)
					@_loaded = true
					@load()
			)

		@initialize()

	###
	#
	###
	initialize: (->)
	
	###
	#
	###
	viewModel: () ->
		viewModel = {__falcon__: true}
		for key, value of this when not ( key of Falcon.View.prototype )
			if isFunction(value) and not ko.isObservable(value)
				value = do =>
					_value = value
					(args...) => _value.call(this, args...)
			viewModel[key] = value
		return viewModel
	
	###
	#
	###
	isLoaded: () -> @_loaded
	
	###
	#
	###
	load: (callback) ->
		if callback?
			callback = (->) unless isFunction(callback)
			if @_loaded then callback.call(this) else @_loadQueue.push(callback)
		else if @_loaded
			@_loadQueue.shift().call(this) until @_loadQueue.length <= 0
		
		return this