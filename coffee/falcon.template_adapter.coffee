class FalconTemplateAdapter extends FalconObject
	#--------------------------------------------------------
	# The internal cache of each template identified by 
	# their endpoint or element id
	#--------------------------------------------------------
	__falcon_templateAdapter__cache__ = {}

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter.extend()
	#	Inherit the global extend method
	#------------------------------------------------------------------------
	@extend = FalconObject.extend

	#--------------------------------------------------------
	# Method: Falcon.TemplateAdapter()
	#	The constructor method
	#--------------------------------------------------------
	constructor: ->
		super(arguments...)

		# We must create a template element to force support for older browsers
		document.createElement("template")
	#END constructor

	#--------------------------------------------------------
	# Method: Falcon.View.cacheTemplate( identifier, template )
	#	Method used to manually cache a template
	#
	# Arguments:
	#	**identifier** _(String)_ - The unique identifier for the template (usually a endpoint or an element id)
	#	**template** _(String)_ - The template to store
	#--------------------------------------------------------
	cacheTemplate: (identifier, template) ->
		identifier = "" unless isString( identifier )
		template = "" unless isString( template )

		return @ if isEmpty( identifier )

		__falcon_templateAdapter__cache__[identifier] = template

		return @
	#END cacheTemplate

	#--------------------------------------------------------
	# Method: Falcon.View.cacheTemplates
	#	Method used to cache and remove the template elements
	#
	# Returns:
	#	_(Falcon)_ - This Instance
	#--------------------------------------------------------
	cacheAllTemplates: ->
		templates = (template for template in document.getElementsByTagName("template"))
		
		for template in templates
			identifier = template.getAttribute("id")
			Falcon.templateAdapter.cacheTemplate( "##{identifier}", template.innerHTML ) if identifier?
			template.parentNode?.removeChild(template)
		#END each template

		return @
	#END cacheAllTemplates

	getCachedTemplate: (identifier) ->
		unless isString(identifier)
			throw new Error("identifier must be a string")
		#END unless

		return (__falcon_templateAdapter__cache__[identifier] ? null)
	#END getCachedTemplate

	#--------------------------------------------------------
	# Method: Falcon.View.resetCache()
	#	Method used to manually reset the static template cache
	#--------------------------------------------------------
	resetCache: ->
		__falcon_templateAdapter__cache__ = {}

		return @
	#END resetCache

	#------------------------------------------------------------------------
	# Method: Falcon.TemplateLoader#resolveTemplate( uri, callback )
	#	Method used to lookup a template and execute a callback with the
	#	resultant template's HTML as its only argument.  The base definition
	#	expects to receive a URI beginning with a '#' to signify that we're
	#	looking for an Element in the DOM
	#
	# Arguments:
	#	**view** _(Falcon.View)_ - The view who's template needs to be loaded
	#	**callback** _(Function)_  - Method to call when the template has been loaded. 
	#								 This is here to provide adapters that use asynchronous 
	#								 loading of templates with a way to respond to a 
	#								 completed request.
	#
	# Returns:
	#	_(Falcon.DataAdapter)_ - This instance
	#------------------------------------------------------------------------
	resolveTemplate: (view, callback) ->
		unless Falcon.isView( view )
			throw new Error("view must be a Falcon.View")
		#END unless

		unless isFunction(callback)
			throw new Error("callback must be a function")
		#END unless

		url = view.makeUrl()

		if isEmpty(url)
			callback("")
		else if (template = @getCachedTemplate(url))
			callback(template)
		else
			@loadTemplate(url, callback)
		#END if

		return @
	#END resolveTemplate

	loadTemplate: (url, callback) ->
		unless isString(url)
			throw new Error("url must be a String")
		#END unless

		unless isFunction(callback)
			throw new Error("callback must be a function")
		#END unless

		Falcon.ready =>
			element = document.getElementById(url.slice(1))
			template = if element? then element.innerHTML else ""
			@cacheTemplate( url, template )
			callback( template )
		#END ready

		return @
	#END loadTemplate

	makeUrl: (view) ->
		unless Falcon.isView( view )
			throw new Error("view must be an instanceof Falcon.View")
		#END unless

		endpoint = ko.unwrap( view.endpoint )
		endpoint = endpoint.call(view) if isFunction( endpoint )
		endpoint = if isString(endpoint) then trim(endpoint) else ""

		return endpoint if isEmpty( endpoint )
		return endpoint if endpoint.charAt(0) is '#'

		#Make sure the url is now formatted correctly
		url = "/#{url}" unless endpoint.charAt(0) is '/'

		#Attempt to add on the base url if its set and the url is a uri (not an element ID)
		url = "#{Falcon.baseTemplateUrl}#{url}" if isString(Falcon.baseTemplateUrl)

		#Replace any double slashes outside of the initial protocol
		url = url.replace(/([^:])\/\/+/gi, "$1/")

		return url
	#END makeUrl
#END FalconTemplateAdapter