###
# Class: Falcon.View
#	Class hat represents a view on the screen
#
# TODO:
#	Add the on/off methods
###
class Falcon.View extends Falcon.Class

	###
	# The internal cache of each template identified by 
	# their url or element id
	###
	templateCache = {}

	###
	# Counter to track how many things are loading
	###
	_loadingCount = 0
	_initialized = false

	###
	# Method: Falcon.View.cacheTemplate( identifier, template )
	#	Method used to manually cache a template
	#
	# Arguments:
	#	**identifier** _(String)_ - The identifier for the templae
	#	**template** _(String)_ - The template to store
	###
	@cacheTemplate = (identifier, template) ->
		identifier = "" unless isString( identifier )
		template = "" unless isString( template )

		identifier = trim( identifier )

		templateCache[identifier] = template

		return
	#END cacheTeplate

	###
	#
	#
	###
	@_events = {}
	@on = -> Falcon.Class::on.apply(this, arguments)
	@off = -> Falcon.Class::off.apply(this, arguments)
	@has = -> Falcon.Class::has.apply(this, arguments)
	@trigger = -> Falcon.Class::trigger.apply(this, arguments)

	# (event, action, context) ->
	#	return this unless isString(event) and isFunction(action)

	#	context ?= this
	#	event = trim(event).toLowerCase()

	#	return this if isEmpty(event)


	#	( _events[event] ?= [] ).push({action, context})

	#	return this
	#END on

	@trigger

	###
	# Method used to track when a template is loaded
	###
	@tick = ->
		_loadingCount++
	#END tick

	@loaded = ->
		_loadingCount--
		if _loadingCount is 0
			if _initialized is false
				Falcon.View.trigger("init") 
				_initialized = true
			#END if

			Falcon.View.trigger("load")
		#END if
	#END initialized
	
	###
	#
	###
	@extend = (definition) -> Falcon.Class.extend(Falcon.View, definition)

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

		Falcon.View.tick()

		# Validate the public variables
		@template = ko.observable()
		url = @makeUrl()

		# Setup the isLoaded variable
		@isLoaded = ko.observable( false )
		
		_loaded = () =>
			@isLoaded(true)
			defer => @trigger("load")

			Falcon.View.loaded()
		#END _loaded

		# Attempt to load the template from the server or cache
		if isEmpty(url)
			_loaded()

		else if url of templateCache
			@template(templateCache[url])
			_loaded()

		else if startsWith(url, "#")
			@template( templateCache[url] ?= $(url).html() )
			
			_loaded()
		else
			$.ajax
				url: url
				type: "GET"
				cache: false
				error: () =>
					console.log("ERROR LOADING TEMPLATE #{url}")
				#END error
				success: (html) =>
					@template( templateCache[@url] = html )
					_loaded()
				#END success
			#END ajax
		#END if

		@initialize.apply(this, arguments)
	#END constructor

	makeUrl: () ->
		url = ko.utils.unwrapObservable( @url )
		url = "" unless isString( url )
		url = trim( url )

		#Make sure the url is now formatted correctly
		#url = "/#{url}" unless startsWith(url, "/")

		#Attempt to add on the base url
		url = "#{Falcon.baseTemplateUrl}#{url}" if isString(Falcon.baseTemplateUrl)

		return url
	#END makeUrl

	###
	#
	###
	initialize: (->)

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
					return (args...) =>  _value.call(this, args...)
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