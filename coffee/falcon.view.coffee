#--------------------------------------------------------
# Class: Falcon.View
#	Class that represents a view on the screen
#--------------------------------------------------------
class Falcon.View extends Falcon.Class

	#--------------------------------------------------------
	# The internal cache of each template identified by 
	# their url or element id
	#--------------------------------------------------------
	_template_cache = {}

	#--------------------------------------------------------
	# Method: Falcon.View.cacheTemplate( identifier, template )
	#	Method used to manually cache a template
	#
	# Arguments:
	#	**identifier** _(String)_ - The identifier for the templae
	#	**template** _(String)_ - The template to store
	#--------------------------------------------------------
	@cacheTemplate = (identifier, template) ->
		identifier = "" unless isString( identifier )
		template = "" unless isString( template )

		identifier = trim( identifier )

		_template_cache[identifier] = template

		return
	#END cacheTeplate

	#--------------------------------------------------------
	# Attribute: Faclon.View#url
	#	The url to locate this template at. Can either be a string or a function 
	#	and can either point to a uri or a DOM object identifier.  This attribute 
	#	should be overridden by any inheritting classes
	#--------------------------------------------------------
	url: null

	_loaded_url: null

	#--------------------------------------------------------
	# Attribute: Falcon.View#__falcon_view__is_loaded__
	#	This is
	#--------------------------------------------------------
	__falcon_view__is_loaded__: false

	#--------------------------------------------------------
	# Attribute: Falcon.View#__falcon_view__is_destroyed__
	#	This is
	#--------------------------------------------------------
	__falcon_view__is_destroyed__: false

	#--------------------------------------------------------
	# Attribute: Falcon.View#__falcon_view__child_views__
	#	This is
	#--------------------------------------------------------
	__falcon_view__child_views__: []

	#--------------------------------------------------------
	# Attribute: Falcon.View#observables
	#	This is a list of the default observables and values for
	#	this view on each instantiation. If the value is a function
	#	a computed is created. If the value is an object with the keys
	#	'read' and/or 'write' a computed is created with those object
	#	keys as the defining variables. All computeds are created with
	#	this view's instance bound to its callback methods
	#--------------------------------------------------------
	observables: null

	#--------------------------------------------------------
	# Method: Falcon.View()
	#	The constuctor method for the view class
	#--------------------------------------------------------
	constructor: () ->
		super()

		# Validate the public variables
		url = @makeUrl()

		# Setup the __falcon_view__is_loaded__ variable
		@__falcon_view__is_loaded__ = ko.observable( false )
		@__falcon_view__is_destroyed__ = false
		@__falcon_view__child_views__ = []

		#Setup the observables
		if isObject( @observables )
			for key, value of @observables
				if isFunction( value )
					@[key] = ko.computed
						'read': value
						'owner': @
					#END computed
				else if isObject( value ) and ('read' of value or 'write' of value)
					@[key] = ko.computed
						'read': value.read
						'write': value.write
						'owner': @
					#END computed
				else if isArray( value )
					@[key] = ko.observableArray( value )
				else
					@[key] = ko.observable( value )
				#END if
			#END for
		#END if
		
		_loaded = () =>
			@_loaded_url = url
			@__falcon_view__is_loaded__( true )
			@trigger("load")
		#END _loaded

		@initialize.apply(this, arguments)

		# Attempt to load the template from the server or cache
		if isEmpty(url) or url of _template_cache
			_loaded()

		else if startsWith(url, "#")
			Falcon.View.cacheTemplate( url, $(url).html() )
			_loaded()

		else
			$.ajax
				url: url
				type: "GET"
				cache: false
				error: () =>
					console.log("ERROR LOADING TEMPLATE #{url}")
					@trigger("error")
				#END error
				success: (html) =>
					Falcon.View.cacheTemplate(url, html)
					_loaded()
				#END success
			#END ajax
		#END if
	#END constructor

	#--------------------------------------------------------
	# Method: Falcon.View#makeUrl
	#	Method used to intelligently make a url to point to the 
	#	remote version of this
	#	url if 
	#
	# Returns:
	#	_(String)_ - The full url
	#--------------------------------------------------------
	makeUrl: () ->
		url = ko.utils.unwrapObservable( @url )
		url = url() if isFunction( url )
		url = "" unless isString( url )
		url = trim( url )

		#Make sure the url is now formatted correctly
		url = "/#{url}" unless url.slice(0,1) in ["/", "#"]

		#Attempt to add on the base url if its set and the url is a uri (not an element ID)
		url = "#{Falcon.baseTemplateUrl}#{url}" if isString(Falcon.baseTemplateUrl) and startsWith(url, "/")

		return url
	#END makeUrl

	#--------------------------------------------------------
	# Method: Falcon.View#template
	#	Method used to return the string template used for this view
	#--------------------------------------------------------
	template: () ->
		return "" unless ko.utils.unwrapObservable( @__falcon_view__is_loaded__ )
		return ( _template_cache[@_loaded_url] ? "" )
	#END template

	#--------------------------------------------------------
	# Method: Falcon.View#destroy
	#	Method used to destroy this view. Will do it's best to
	#	dispose of any memory related to dom elements and events.
	#	This method should not ve overriden and instead inherrting
	#	classes should override the 'dispose' method instead.
	#--------------------------------------------------------
	destroy: () ->
		return if @__falcon_view__is_destroyed__

		child_view.destroy() for child_view in @__falcon_view__child_views__
		@dispose.apply(this, arguments)
		
		@__falcon_view__child_views__ = null
		@__falcon_view__is_destroyed__ = true

		return
	#END destroy

	#--------------------------------------------------------
	# Method: Falcon.View#initialize
	#	Initializes this class, this is called within the default contructor
	#	and is expected to be overridden by inheritting classes.
	#--------------------------------------------------------
	initialize: (->)

	#--------------------------------------------------------
	# Method: Falcon.View#dispose
	#	Executed when this view is disposed to the garbage collector.  This method will be called
	#	from within the destroy method and is expected to be overridden in any inheritting class.
	#--------------------------------------------------------
	dispose: (->)

	#--------------------------------------------------------
	# Method: Falcon.View#isLoaded
	#	Method to tell if this view has already been initialized and the template
	#	loaded
	#--------------------------------------------------------
	isLoaded: ->
		return @__falcon_view__is_loaded__()
	#END isLoaded

	#--------------------------------------------------------
	# Method Falcon.View#viewModel
	#	Get's a view model representing this view
	#--------------------------------------------------------
	viewModel: () ->
		viewModel = {"__falcon_view__addChildView__": (view) =>
			return unless Falcon.isView( view )
			@__falcon_view__child_views__.push( view )
		}

		for key, value of this when not ( key of Falcon.View.prototype )
			if isFunction(value) and not ko.isObservable(value)
				value = do =>
					_value = value
					method = (args...) => _value.call(this, args...)
					method.length = _value.length
					return method
			viewModel[key] = value
		return viewModel
	#END viewModel
#END Falcon.View