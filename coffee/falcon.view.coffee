#--------------------------------------------------------
# Class: Falcon.View
#	Class hat represents a view on the screen
#
# TODO:
#	Add the on/off methods
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
	# Attribute: Falcon.View#is_loaded
	#	This is
	#--------------------------------------------------------
	is_loaded: false

	#--------------------------------------------------------
	# Attribute: Falcon.View#is_destroyed
	#	This is
	#--------------------------------------------------------
	is_destroyed: false

	#--------------------------------------------------------
	# Method: Falcon.View()
	#	The constuctor method for the view class
	#--------------------------------------------------------
	constructor: () ->
		super()

		# Validate the public variables
		url = @makeUrl()

		# Setup the is_loaded variable
		@is_loaded = ko.observable( false )
		@is_destroyed = false
		@_child_views = []
		
		_loaded = () =>
			@_loaded_url = url
			@is_loaded(true)
			@trigger("load")
		#END _loaded

		@initialize.apply(this, arguments)

		# Attempt to load the template from the server or cache
		if isEmpty(url) or url of _template_cache
			_loaded()

		else if startsWith(url, "#")
			_template_cache[url] = $(url).html()
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
					_template_cache[url] = html
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

	template: () ->
		return "" unless ko.utils.unwrapObservable( @is_loaded )
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
		return if @is_destroyed

		child.destroy() for child in @_child_views
		@dispose.apply(this, arguments)
		
		@_child_views = null
		@is_destroyed = true

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
	# Method: Falcon.View#dispose
	#	Executed when this view is disposed to the garbage collector.  This method will be called
	#	from within the destroy method and is expected to be overridden in any inheritting class.
	#--------------------------------------------------------
	_addChildView: (view) ->
		return unless Falcon.isView( view )
		@_child_views.push( view )
	#END addChildView

	#--------------------------------------------------------
	# Method Falcon.View#viewModel
	#	Get's a view model representing this view
	#--------------------------------------------------------
	viewModel: () ->
		viewModel = {"__falcon_addChildView__": (view) => @_addChildView(view)}
		for key, value of this when not ( key of Falcon.View.prototype )
			if isFunction(value) and not ko.isObservable(value)
				value = do =>
					_value = value
					return (args...) =>  _value.call(this, args...)
			viewModel[key] = value
		return viewModel
	#END viewModel
#END Falcon.View