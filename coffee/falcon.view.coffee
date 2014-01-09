#--------------------------------------------------------
# Class: Falcon.View
#	Class that represents a view on the screen
#--------------------------------------------------------
class Falcon.View extends Falcon.Object
	#--------------------------------------------------------
	# The internal cache of each template identified by 
	# their url or element id
	#--------------------------------------------------------
	__falcon_view__template_cache__ = {}

	#--------------------------------------------------------
	# Method: Falcon.View.cacheTemplate( identifier, template )
	#	Method used to manually cache a template
	#
	# Arguments:
	#	**identifier** _(String)_ - The unique identifier for the template (usually a url or an element id)
	#	**template** _(String)_ - The template to store
	#--------------------------------------------------------
	@cacheTemplate = (identifier, template) ->
		identifier = "" unless isString( identifier )
		template = "" unless isString( template )

		identifier = trim( identifier )

		__falcon_view__template_cache__[identifier] = template

		return
	#END cacheTemplate

	#--------------------------------------------------------
	# Method: Falcon.View.resetCache()
	#	Method used to manually reset the static template cache
	#--------------------------------------------------------
	@resetCache = () ->
		__falcon_view__template_cache__ = {}

		return
	#END resetCache

	#--------------------------------------------------------
	# Method: Falcon.View.extend()
	#	Inherit the global extend method
	#--------------------------------------------------------
	@extend = Falcon.Object.extend

	#--------------------------------------------------------
	# Member: Faclon.View#url
	#	The url or element id where this template is defined. 
	#	Can either be a string or a function and can either point 
	#	to a uri or a DOM object identifier.  This attribute 
	#	should be overridden by any inheritting classes
	#--------------------------------------------------------
	url: null

	#--------------------------------------------------------
	# Member: Falcon.View#is_loaded
	#	This will be an observable that specifies if the view has loaded
	#	or not. A view is loaded when its template is found and stored
	#	into the template cache. Making this an observable allows us to
	#	bind against it and for the 'view' binding to update properly.
	#--------------------------------------------------------
	is_loaded: false

	#--------------------------------------------------------
	# Member: Falcon.View#_is_rendered
	#	This will be a flag to determines if the view is being 
	#	displayed on the screen or not. This also acts as a
	#	gate check for render() and unrender()
	#--------------------------------------------------------
	_is_rendered: false

	#--------------------------------------------------------
	# Member: Falcon.View#__falcon_view__child_views__
	#	This private, falcon specific, variable is used to store
	#	an array of falcon views that have been rendered (via the
	#	'view' data-binding) within this view's template
	#--------------------------------------------------------
	__falcon_view__child_views__: null

	#--------------------------------------------------------
	# Member: Falcon.View#__falcon_view__loaded_url__
	#	This private, falcon specific, variable is used to store
	#	the result of the makeUrl() function so that we can lookup
	#	and store the resultant template in the template cache
	#--------------------------------------------------------
	__falcon_view__loaded_url__: null

	#--------------------------------------------------------
	# Method: Falcon.View()
	#	The constuctor method for the view class, calls the super
	#	constructor from Falcon.Object
	#--------------------------------------------------------
	constructor: () ->
		super(arguments...)

		# Validate the public variables
		url = @makeUrl()

		# Setup the is_loaded variable
		@_is_rendered = false
		@is_loaded = ko.observable( false )
		@__falcon_view__child_views__ = []
		
		_loaded = () =>
			@__falcon_view__loaded_url__ = url
			@is_loaded( true )
		#END _loaded

		@initialize.apply(this, arguments)

		# Attempt to load the template from the server or cache
		if isEmpty(url) or url of __falcon_view__template_cache__
			_loaded()

		else if startsWith(url, "#")
			Falcon.View.cacheTemplate( url, $(url).html() )
			_loaded()

		else
			$.ajax
				url: url
				type: "GET"
				cache: Falcon.cache
				error: () =>
					console.log("[FALCON] Error Loading Template: '#{url}'")
					@trigger("error")
				#END error
				success: (html) =>
					Falcon.View.cacheTemplate(url, html)
					_loaded()
				#END success
			#END ajax
		#END if

		return @
	#END constructor

	#--------------------------------------------------------
	# Method: Falcon.View#makeUrl
	#	Method used to intelligently make a url to point to the 
	#	remote version of this template
	#	if the URL begins with a '#' it will leave hte url as is
	#
	# Returns:
	#	_(String)_ - The full url
	#--------------------------------------------------------
	makeUrl: () ->
		return null unless @url?

		url = ko.utils.unwrapObservable( @url )
		url = url() if isFunction( url )
		url = "" unless isString( url )
		url = trim( url )

		return url if url.charAt(0) is '#'

		#Make sure the url is now formatted correctly
		url = "/#{url}" unless url.charAt(0) is '/'

		#Attempt to add on the base url if its set and the url is a uri (not an element ID)
		url = "#{Falcon.baseTemplateUrl}#{url}" if isString(Falcon.baseTemplateUrl)

		#Replace any double slashes outside of the initial protocol
		url = url.replace(/([^:])\/\/+/gi, "$1/")

		return url
	#END makeUrl

	#--------------------------------------------------------
	# Method: Falcon.View#template
	#	Method used to return the string template used for this view
	#
	# Note:
	#	This method should stay as is. It is used by the 'view' binding
	#	to get the template string.
	#--------------------------------------------------------
	template: () ->
		return "" unless ko.utils.unwrapObservable( @is_loaded )
		return ( __falcon_view__template_cache__[@__falcon_view__loaded_url__] ? "" )
	#END template

	#--------------------------------------------------------
	# Method: Falcon.View#_render
	#	Method used to render this and any left-over child views
	#	that will appear as part of this view's rendered template.
	#	This is called by the 'view' binding when this view's template
	#	is visible in the DOM.  At the end of the render routine, the
	#	display() method is called which should be used to handle any
	#	custom display routines
	#
	# Note:
	#	This method should stay as is. Instead, overwrite the 'display'
	#	method when you need to run any custom display routine.
	#--------------------------------------------------------
	_render: () ->
		return if @_is_rendered

		@display.apply(this, arguments)

		@_is_rendered = true
		return
	#END _render

	#--------------------------------------------------------
	# Method: Falcon.View#_unrender
	#	Method used to unrender this view. This is called when
	#	the rendered template is removed from the DOM by knockout
	#	or when the containing observable holding this view changed
	#	its contents. This method will also attempt to unrender
	#	any of it's child views that were bound while this view was active.
	#	after the unrender routine is executed, this method will call the
	#	'dispose' method which should be overwitten to handle any custom
	#	disposal routines such as any additional event handlers.
	#
	# Note:
	#	This method should stay as is. Instead, overwrite the 'dispose'
	#	method when you need to run any custom disposal routine.
	#--------------------------------------------------------
	_unrender: () ->
		return unless @_is_rendered

		child_view._unrender() for child_view in @__falcon_view__child_views__
		@__falcon_view__child_views__ = []
		@dispose.apply(this, arguments)

		@_is_rendered = false
		return
	#END _unrender

	#--------------------------------------------------------
	# Method: Falcon.View#_addChildView
	#	Method that is called withtin the 'view' binding to add
	#	a reference to a child view that was rendered in this views
	#	template.  These views are then used to be handled when this
	#	view is added and removed from the DOM.
	#
	# Note:
	#	This method should not be called manually, it is only meant to
	#	be called by the 'view' binding
	#--------------------------------------------------------
	_addChildView: (view) ->
		return unless Falcon.isView( view )
		@__falcon_view__child_views__.push( view )
	#END _addChildView

	#--------------------------------------------------------
	# Method: Falcon.View#initialize
	#	Initializes this class, this is called within the default contructor
	#	and is expected to be overridden by inheritting classes.
	#--------------------------------------------------------
	initialize: (->)

	#--------------------------------------------------------
	# Method: Falcon.View#display
	#	Executed when this view is displayed (added to the DOM).
	#	This method is called from the render method which itself
	#	is called from the 'view' binding.  This should be
	#	overridden by inheritting classes and should primarily
	#	be used for 'on-display' funcitonality such as certain
	#	event handlers
	#--------------------------------------------------------
	display: (->)

	#--------------------------------------------------------
	# Method: Falcon.View#dispose
	#	Executed when this view is disposed (removed from the DOM).
	#	This method is called from the unrender method which itself
	#	is called from the 'view' binding.  This should be
	#	overridden by inheritting classes and should primarily
	#	be used for removing any 'on-display' funcitonality
	#	that was added in the display method
	#--------------------------------------------------------
	dispose: (->)

	#--------------------------------------------------------
	# Method Falcon.View#viewModel
	#	Get's a view model representing this view. Functions of
	#	this view are converted to be able retain 'this' view as
	#	the context of this instance.
	#--------------------------------------------------------
	@__falcon_view__viewModel__: null
	viewModel: () ->
		return @__falcon_view__viewModel__ if @__falcon_view__viewModel__?

		viewModel = { "__falcon_view__addChildView__": (view) => @_addChildView(view) }

		for key, value of this when not ( key of Falcon.View.prototype )
			if isFunction(value) and not ko.isObservable(value)
				value = do =>
					_value = value
					return (args...) => _value.call(@, args...)
				#END assignment
			#END if
			
			viewModel[key] = value
		#END for

		return (@__falcon_view__viewModel__ = viewModel)
	#END viewModel
#END Falcon.View