#--------------------------------------------------------
# Class: Falcon.View
#	Class that represents a view on the screen
#--------------------------------------------------------
class FalconView extends FalconObject
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

		return Falcon.View if isEmpty( identifier )

		__falcon_view__template_cache__[identifier] = template

		return Falcon.View
	#END cacheTemplate

	#--------------------------------------------------------
	# Method: Falcon.View.cacheTemplates
	#	Method used to cache and remove the template elements
	#
	# Returns:
	#	_(Falcon)_ - This Instance
	#--------------------------------------------------------
	@cacheTemplates = ->
		templates = (template for template in document.getElementsByTagName("template"))
		
		for template in templates
			identifier = template.getAttribute("id")
			Falcon.View.cacheTemplate( "##{identifier}", template.innerHTML ) if identifier?
			template.parentNode?.removeChild(template)
		#END each template

		return Falcon.View
	#END cacheTemplates

	#--------------------------------------------------------
	# Method: Falcon.View.resetCache()
	#	Method used to manually reset the static template cache
	#--------------------------------------------------------
	@resetCache = () ->
		__falcon_view__template_cache__ = {}

		return Falcon.View
	#END resetCache

	#--------------------------------------------------------
	# Method: Falcon.View.extend()
	#	Inherit the global extend method
	#--------------------------------------------------------
	@extend = FalconObject.extend

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
	__falcon_view__is_loaded__: false

	#--------------------------------------------------------
	# Member: Falcon.View#__falcon_view__is_rendered__
	#	This will be a flag to determines if the view is being 
	#	displayed on the screen or not. This also acts as a
	#	gate check for render() and unrender()
	#--------------------------------------------------------
	__falcon_view__is_rendered__: false

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
		@__falcon_view__is_loaded__ = ko.observable( false )
		@__falcon_view__is_rendered__ = false
		@__falcon_view__loaded_url__ = url

		@initialize.apply(this, arguments)

		# Attempt to load the template from the server or cache
		Falcon.ready =>
			if isEmpty(url) or __falcon_view__template_cache__[url]?
				@__falcon_view__is_loaded__( true )
			else
				Falcon.adapter.getTemplate(url, (template) =>
					Falcon.View.cacheTemplate( url, template )
					@__falcon_view__is_loaded__( true )
				)#END getTemplate
			#END if
		#END ready
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
		url = ko.utils.unwrapObservable( @url )
		url = url() if isFunction( url )
		url = "" unless isString( url )
		url = trim( url )

		return url if isEmpty( url ) or url.charAt(0) is '#'

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
		return "" unless ko.utils.unwrapObservable( @__falcon_view__is_loaded__ )
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
		return if @__falcon_view__is_rendered__

		@__falcon_view__is_rendered__ = true
		@display.apply(this, arguments)

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
		return unless @__falcon_view__is_rendered__

		@__falcon_view__is_rendered__ = false
		@dispose.apply(this, arguments)

		return
	#END _unrender

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
	viewModel: do ->
		#Custom bind to work with ie8
		_bind = (value, self) ->
			func = -> value.apply(self, arguments)
			func.__falcon_bind__length__ = value.length
			return func
		#END _bind

		return ->
			return @__falcon_view__viewModel__ if @__falcon_view__viewModel__?

			viewModel = {}

			for key, value of this when not ( key of Falcon.View.prototype )
				if isFunction(value) and not ko.isObservable(value)
					value = _bind(value, this)
				#END if
				
				viewModel[key] = value
			#END for

			return (@__falcon_view__viewModel__ = viewModel)
		#END return
	#END viewModel
#END Falcon.View