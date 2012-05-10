###
# Class: Falcon.View
#	Class hat represents a view on the screen
#
# TODO:
#	Add the on/off methods
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
	# Method: Falcon.View()
	#	The constuctor method for the view class
	###
	constructor: () ->
		super()

		# Validate the public variables
		@template = ko.observable( ko.utils.unwrapObservable( @template ) )
		@url = "" unless isString(@url)
		@url = trim(@url)

		# Setup our private variables for instance usage
		@_loaded = ko.observable( ko.utils.unwrapObservable( @_loaded ) )
		@_loaded.subscribe (loaded) => @trigger("load") if !!loaded
		@isLoaded = ko.computed => !!@_loaded() 

		# Attempt to load the template from the server or cache
		if isEmpty(@url)
			@_loaded(true)

		else if @url of templateCache
			@template(templateCache[@url])
			@_loaded(true)

		else if startsWith(@url, "#")
			templateCache[@url] = $(@url).html()
			@template(templateCache[@url])
			@_loaded(true)

		else
			$.ajax(
				url: @url
				type: "GET"
				cache: false
				success: (html) =>
					templateCache[@url] = html
					@template(html)
					@_loaded(true)
			)

		@initialize.apply(this, arguments)
	#END constructor

	###
	#
	###
	initialize: (->)

	###
	# Method: Falcon.View#isLoaded
	#	Method to check if the view has been loaded, will
	#	be overriden by a computed value later
	###
	isLoaded: ( -> @_loaded )
	
	###
	# Method Falcon.View#viewModel
	#	Get's a view model representing this view
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
	#END viewModel
	
	###
	#
	###
	load: (callback) ->
		@on("load", callback)
		@trigger("load") if @isLoaded()
	#END load

	###
	# Method: Falcon.View#dispose
	#	Executed when this view is disposed to the garbage collector (Doesn't work yet)
	###
	dispose: ( -> )

	###
	# Method: Falcon.View#call()
	#	Used to make a 'call' method of a specific method on this view.
	#	useful for attaching a view's method to events in a template so that
	#	they can be called when an event is fired (without having to do any
	#	currying/method wrapping)
	#
	# Arguments:
	#	**method** _(string)_ - The view method to call
	#
	# Returns:
	#	_(Function)_ - A wrapped version of the method
	###
	call: (method) ->
		(throw new Error("Method must be a string")) unless isString(method)

		_method = this[method]
		(throw new Error("'#{method}' is not a valid method.")) unless isFunction(_method)

		_args = Array::slice.call(arguments, 1)
		return =>
			_method.apply(@, _args)
		#END return
	#END call
#END Falcon.View