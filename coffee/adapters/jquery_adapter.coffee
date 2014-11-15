class @jQueryRestDataAdapter extends Falcon.DataAdapter
	cache: false

	#------------------------------------------------------------------------
	# Method: jQueryAdapter#standardizeOptions( data_object, type, options, context )
	#	Extends the standard standardize options routine with jQuery specific defaults:
	#		dataType - The data type
	#		contentType - The content mime type
	#		params - The url query string parameters to send along
	#		headers - Request headers to set
	#		cache - Should this result be cached?
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object|Function|String|Array)_ - The options for perform this sync with. 
	#											 		If a function is given, it is assigned to the 
	#											 		'compete' attribute. If a string or an array is given, 
	#											 		it is turned into an array and assigned to the 
	#											 		'attributes' attribute
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(Object)_ - A standardized version of the options
	#------------------------------------------------------------------------
	standardizeOptions: ( data_object, type, options, context ) ->
		output_options = super( data_object, type, options, context )

		output_options.dataType = "json" unless isString(output_options.dataType)
		output_options.contentType = "application/json" unless isString(output_options.contentType)
		output_options.params = {} unless isObject( output_options.params )
		output_options.headers = {} unless isObject( output_options.headers )
		output_options.cache = output_options.cache ? @cache

		return output_options
	#END standardizeOptions

	#------------------------------------------------------------------------
	# Method: jQueryAdapter#resolveUrl( data_object, type, options, context )
	#	Used to make the request url and appends any params in the options onto
	#	the url's query parameters.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(String)_ - The full url
	#------------------------------------------------------------------------
	resolveUrl: ( data_object, type, options, context ) ->
		url = super( data_object, type, options, context )

		unless isEmpty( options.params )
			url += if url.indexOf("?") > -1 then "&" else "?"
			url += ( "#{key}=#{value}" for key, value of options.params ).join("&")
		#END unless

		return url
	#END resolveUrl

	#------------------------------------------------------------------------
	# Method: jQueryAdapter#serializeData( data_object, type, options, context )
	#	Serializes the data into a JSON string
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(Object)_ - The serialized data
	#------------------------------------------------------------------------
	serializeData: ( data_object, type, options, context ) ->
		serialized_data = super( data_object, type, options, context )
		return "" unless serialized_data?
		return serialized_data if isString( serialized_data )
		return JSON.stringify(serialized_data)
	#END serializeData

	#------------------------------------------------------------------------
	# Method: jQueryAdapter#parseRawResponseData( data_object, type, options, context, response_args )
	#	Attempts ot parse the response string or the responseText in the xhr object
	#	to generate the correct javascript object/array.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#	**response_args** _(Object)_ - An object of additional response arguments to pass around
	#								   to other response related methods. This is dependant
	#								   on other adapters inheritting this base adapter defintion
	#
	# Returns:
	#	_(Object|Array)_ - The parsed response data
	#------------------------------------------------------------------------
	parseRawResponseData: ( data_object, type, options, context, response_args ) ->
		{data, xhr} = super( data_object, type, options, context, response_args )
		try
			data = JSON.parse( data ) if isString( data )
			data ?= JSON.parse( xhr.responseText ) if isString( xhr?.responseText )
		catch ex
			data = null
		#END catch
		data ?= if Falcon.isModel( data_object ) then {} else []
		return data
	#END parseRawResponseData

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#sync( data_object, type, options, context )
	#	Created a jQuery ajax request to communicate model and collection data
	#	with the backend server. 'null' is returned if the validations failed.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(XmlHttpRequest)_ - The jQuery ajax request object, null if the validations failed
	#------------------------------------------------------------------------
	sync: ( data_object, type, options, context ) ->
		standardized_inputs = super( data_object, type, options, context )

		#Returns null if the validations failed
		return null unless standardized_inputs.is_valid
		
		{ data_object, type, context, options } = standardized_inputs

		return $.ajax
			'type': type
			'url': options.url
			'data': options.data
			'dataType': options.dataType
			'contentType': options.contentType
			'cache': options.cache
			'headers': options.headers

			'success': (data, status, xhr) =>
				@successResponseHandler( data_object, type, options, context, {
					'data': data
					'status': status
					'xhr': xhr
				})
			#END success

			'error': (xhr) =>
				@errorResponseHandler( data_object, type, options, context, {
					'xhr': xhr
				})
			#END error

			'complete': (xhr, status) =>
				@completeResponseHandler( data_object, type, options, context, {
					'status': status
					'xhr': xhr
				})
			#END complete
		#END $.ajax
	#END sync
#END class

class @jQueryTemplateAdapter extends Falcon.TemplateAdapter
	#------------------------------------------------------------------------
	# Method: jQueryAdapter#resolveTemplate( uri, callback )
	#	Used to retrieve a template from the server using ajax unless the uri
	#	is set to request a local template using the identifier syntax (starting)
	#	with a '#'
	#
	# Arguments:
	#	**uri** _(String)_ - The uri to lookup the template with
	#	**callback** _(Function)_  - Method to call when the template has been loaded. 
	#										This is here to provide adapters that use asynchronous 
	#										loading of templates with a way to respond to a 
	#										completed request.
	#
	# Returns:
	#	_(Falcon.DataAdapter)_ - This instance
	#------------------------------------------------------------------------
	loadTemplate: (uri, callback) ->
		return super(uri, callback) if uri.charAt(0) is "#"

		$.ajax
			url: uri
			type: Falcon.GET
			cache: @cache
			error: => callback("")
			success: (template) =>
				@cacheTemplate( uri, template )
				callback(template)
			#END success
		#END ajax

		return @
	#END loadTemplate
#END jQueryTemplateAdapter

Falcon.dataAdapter = new jQueryRestDataAdapter
Falcon.templateAdapter = new jQueryTemplateAdapter