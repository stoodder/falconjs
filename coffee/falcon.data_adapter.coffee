class FalconDataAdapter extends FalconObject
	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter.extend()
	#	Inherit the global extend method
	#------------------------------------------------------------------------
	@extend = FalconObject.extend

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#resolveRequestType( data_object, type, options, context )
	#	Used to reslve and standardize the request type to either
	#	GET, PUT, POST, or DELETE.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(String)_ - The request type, Falcon.GET if invalid
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	resolveRequestType: ( data_object, type, options, context ) ->
		return Falcon.GET unless isString( type )
		type = trim( type ).toUpperCase()
		return Falcon.GET unless type in Falcon.REQUEST_TYPES
		return type
	#END resolveRequestType

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#resolveContext( data_object, type, options, context )
	#	Used to discern the context to call the response handlers on.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(mixed)_ - The context to call the response methods on
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	resolveContext: ( data_object, type, options, context ) ->
		return context ? options.context ? data_object
	#END resolveContext

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#standardizeOptions( data_object, type, options, context )
	#	Standardizes the options object for the rest of the operations.  The
	#	response object includes:
	#	complete - Method to call when sync is completed
	#	success - Method to call when sync is completed successfully
	#	error - Method to call when sync is completed erroneously
	#	attributes - A list of attributes to restrict the data serialization with. Can be null.
	#	fill_options - The options to pass onto the fill method
	#	parent - The 'parent' object to make this object's URL with. Can be null.
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
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	class FalconDataAdapterOptions
		id: undefined
		url: null
		data: null
		parent: undefined

		attributes: null
		fill_options: null

		success: (->)
		complete: (->)
		error: (->)

		constructor: (options) ->
			if isObject( options )
				@[key] = value for key, value of options
			
			else if isFunction(options)
				@complete = options
			
			else if isString(options)
				@attributes = trim( options ).split(",")
			
			else if isArray( options )
				@attributes = options

			#END if
		#END constructor
	#END class
	standardizeOptions: ( data_object, type, options, context ) ->
		return options if options instanceof FalconDataAdapterOptions

		#Shallow clone the options so as to not disturb the original object
		options = new FalconDataAdapterOptions
		options.parent = data_object.parent unless Falcon.isModel( options.parent ) or options.parent is null
		options.url = @resolveUrl( data_object, type, options, context )
		options.data = @serializeData( data_object, type, options, context )

		return options
	#END standardizeOptions

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#resolveUrl( data_object, type, options, context )
	#	Resovled the url
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(String)_ - The full url
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	resolveUrl: ( data_object, type, options, context ) ->
		return ( options.url ? data_object.makeUrl(type, options.parent) )
	#END resolveUrl

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#makeBaseUrl( data_object, type, options, context )
	#   Makes the base URL piece for a Model or Collection's makeUrl() method
	#   method. This will include the Falcon.baseApiUrl strig, if set and a string
	#	of this data object's parent url pieces and their ids.
	#
	# Example:
	#	Given:
	#		Falcon.baseApiUrl = "http://www.falcon.js/"
	#		my_model = new Falcon.Model({id: 'id1', url: 'my_model'})
	#		my_model.parent = new Falcon.Model({id: 'pid2', url: 'my_model_parent'})
	#		Falcon.dataAdapter.makeBaseUrl(my_model, Falcon.GET, {}, my_model)
	#
	#	Will Return:
	#		http://www.falcon.js/my_model_parent/pid2
	#
	# Arguments:
	#   **data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The resolved request type
	#	**options** _(Object)_ - Non-standardized options. Expects at least the 'parent' 
	#                            property to be defined to override the usage of the 
	#                            data_model's parent
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(String)_ - The base url url
	#------------------------------------------------------------------------
	makeBaseUrl: ( data_object, type, options, context ) ->
		parent = if options.parent is undefined then data_object.parent else options.parent
		base_endpoints = []
		
		while Falcon.isModel( parent )
			if isFunction(parent.url)
				base_endpoint = parent.url(Falcon.GET, parent.parent)
			else
				base_endpoint = parent.url
			#END if

			base_endpoint = "" unless isString( base_endpoint )

			period_index = base_endpoint.lastIndexOf(".")
			base_endpoint = base_endpoint.slice(0, period_index) if period_index > -1
			base_endpoints.unshift( trimSlashes(base_endpoint) + "/" + parent.get('id') )

			parent = parent.parent
		#END while

		#Join the peices to generate a full url without a base, yet
		base_url = "/" + base_endpoints.join("/") + "/"

		#Prepend the base
		base_url = "#{Falcon.baseApiUrl}#{base_url}" if isString( Falcon.baseApiUrl )

		#Remove any double slashes outside of the initial protocol
		return base_url.replace(/([^:])\/\/+/gi, "$1/").replace(/^\/\//gi, "/")
	#END makeBaseUrl
	
	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#makeUrlComponents( data_object, type, options, context )
	#   Standardizes the 'url' attribute on a Model or Collection and returns an
	#	object of the standardized url piece stripped of its extension and the resultant
	#	object has a key for the extension including the '.'
	#
	# Arguments:
	#   **data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The resolved request type
	#	**options** _(Object)_ - Non-standardized options. Expects at least the 'parent' 
	#                            property to be defined to override the usage of the 
	#                            data_model's parent
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(Object)_ - {
	#		base_url: The base url returned from Falcon.DataAdapter#makeBaseUrl
	#		endpoint: This data object's url endpoint with the extension removed
	#		id: The id of the model (if data object is a model) on GET, PUT, DELETE. null by default
	#		extension: The extension of the url piece
	#	}
	#------------------------------------------------------------------------
	makeUrlComponents: ( data_object, type, options, context ) ->
		type = @resolveRequestType( data_object, type, options, context )

		#----------------------------------------------------------
		# Generate The base_url
		#----------------------------------------------------------
		base_url = @makeBaseUrl( data_object, type, options, context )
		
		#----------------------------------------------------------
		# Generate The endpoint
		#----------------------------------------------------------
		endpoint = if isFunction(data_object.url) then data_object.url(type, options.parent) else data_object.url
		endpoint = if isString(endpoint) then trimSlashes(endpoint) else ""

		#----------------------------------------------------------
		# Generate and extract the extension
		#----------------------------------------------------------
		extension = ""
		period_index = endpoint.lastIndexOf(".")
		slash_index = endpoint.lastIndexOf("/")

		# Split on the extension if it exists
		if period_index > slash_index
			extension = endpoint.slice(period_index)
			endpoint = endpoint.slice(0, period_index)
		#END if

		#----------------------------------------------------------
		# Generate the id
		#----------------------------------------------------------
		if Falcon.isModel( data_object )
			id = "#{options.id ? data_object.get('id')}"
		else
			id = null
		#END if

		return {base_url, endpoint, id, extension}
	#END makeUrlComponents

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#makeUrl( data_object, type, options, context )
	#   Method that generates a full url for any given model or collection for
	#	the specified request type.
	#
	# Arguments:
	#   **data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The resolved request type
	#	**options** _(Object)_ - Non-standardized options. Expects at least the 'parent' 
	#                            property to be defined to override the usage of the 
	#                            data_model's parent
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(String)_ - The generated URL
	#------------------------------------------------------------------------
	makeUrl: ( data_object, type, options, context ) ->
		{base_url, endpoint, id, extension} = @makeUrlComponents( data_object, type, options, context )

		#Generate the url
		if Falcon.isModel(data_object)
			if type is Falcon.POST
				return "#{base_url}#{endpoint}#{extension}"
			else
				return "#{base_url}#{endpoint}/#{id}#{extension}"
			#END if
		else if Falcon.isCollection(data_object)
			return "#{base_url}#{endpoint}#{extension}"
		#END if
	#END makeUrl

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#serializeData( data_object, type, options, context )
	#	Serializes the data to send to the server on POST or PUT request
	#	if data has not already been provided in the options
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(Object)_ - The serialized data
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	serializeData: ( data_object, type, options, context ) ->
		if not options.data? and type in [Falcon.POST, Falcon.PUT]
			return data_object.serialize( options.attributes )
		else
			return options.data
		#END if
	#END serializeData

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#parseRawResponseData( data_object, type, options, context, response_args )
	#	Used to parse the response data from a success, error, and completed sync request.  Right
	#	now this is simply a placeholder fo inheritting classes and will directly return the
	#	response_args for inheritting classes
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
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	parseRawResponseData: ( data_object, type, options, context, response_args ) ->
		return response_args
	#END parseRawResponseData

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#successResponseHandler( data_object, type, options, context, response_args )
	#	Method to call on successful responses. This will parse the raw response data, provide that
	#	raw data to the data objects 'parse' method, take that parsed data and fill the data object with it.
	#	This method will then trigger the appropriate event based on the request type and will pass the
	#	parsed data into the event.  Lastly, this method will call the 'success' response method in the
	#	options on the given context and with the data object, raw response data, and the response args
	#	as its arguments
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
	# Events:
	#	fetch - Triggers fetch on the data object with the parsed data if the request type is GET
	#	create - Triggers create on the data object with the parsed data if the request type is POST
	#	save - Triggers save on the data object with the parsed data if the request type is PUT
	#	destroy - Triggers destroy on the data object with the parsed data if the request type is DELETE
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	successResponseHandler: ( data_object, type, options, context, response_args ) ->
		raw_response_data = @parseRawResponseData( data_object, type, options, context, response_args )
		parsed_data = data_object.parse( raw_response_data, options )
		data_object.fill(parsed_data, options.fill_options)

		switch type
			when Falcon.GET then data_object.trigger("fetch", parsed_data)
			when Falcon.POST then data_object.trigger("create", parsed_data)
			when Falcon.PUT then data_object.trigger("save", parsed_data)
			when Falcon.DELETE then data_object.trigger("destroy", parsed_data)
		#END switch

		options.success.call(context, data_object, raw_response_data, options, response_args)
	#END successResponseHandler

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#errorResponseHandler( data_object, type, options, context, response_args )
	#	Method to call on erroneous responses. This will parse the raw response data and call the 'error'
	#	response method provided in the options on the given context and with the data object, 
	#	raw response data, and the response args as its arguments
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
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	errorResponseHandler: ( data_object, type, options, context, response_args ) ->
		raw_response_data = @parseRawResponseData( data_object, type, options, context, response_args )
		options.error.call(context, data_object, raw_response_data, options, response_args)
	#END errorResponseHandler

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#completeResponseHandler( data_object, type, options, context, response_args )
	#	Method to call on completed responses. This will parse the raw response data and call the 'complete'
	#	response method provided in the options on the given context and with the data object, 
	#	raw response data, and the response args as its arguments
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
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	completeResponseHandler: ( data_object, type, options, context, response_args ) ->
		raw_response_data = @parseRawResponseData( data_object, type, options, context, response_args )
		options.complete.call(context, data_object, raw_response_data, options, response_args)
	#END completeResponseHandler

	#------------------------------------------------------------------------
	# Method: Falcon.DataAdapter#sync( data_object, type, options, context )
	#	THE Method to execute a synchronization between the data object and
	#	the data store.  This method is currently a placeholder that simply
	#	checks to ensure that the data object is actually a data object. All
	#	of the other data object related methods should be execute within this method.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object)_ - The options for perform this sync with
	#	**context** _(mixed)_ - The context to call the response handers on
	#
	# Returns:
	#	_(Object)_ - An object of all the processed inputs and an additional key for if the request is valid or not.
	#				 Attributes:
	#					data_object - The data object
	#					type - The resolved request type
	#					options - The standrdized options
	#					context - The resolved context
	#					is_valid - Is the request valid?
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	sync: ( data_object, type, options, context ) ->
		unless Falcon.isDataObject( data_object )
			throw new Error("Expected data_object to be a Model or Collection")
		#END unless

		is_valid = false

		type = @resolveRequestType( data_object, type, options, context )
		options = @standardizeOptions( data_object, type, options, context )
		context = @resolveContext( data_object, type, options, context )

		#Validate any models that are trying to be created or saved
		if Falcon.isModel( data_object )
			return {data_object, type, options, context, is_valid} if (type in [Falcon.POST, Falcon.PUT]) and (not data_object.validate(options))
		#END if

		is_valid = true

		return {data_object, type, options, context, is_valid}
	#END sync
#END class