class Falcon.Adapter extends Falcon.Object
	#------------------------------------------------------------------------
	# Method: Falcon.Adapter.extend()
	#	Inherit the global extend method
	#------------------------------------------------------------------------
	@extend = Falcon.Object.extend

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#resolveRequestType( data_object, type, options, context )
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
	#	_(String)_ - The request type, 'GET' if invalid
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	resolveRequestType: ( data_object, type, options, context ) ->
		return "GET" unless isString( type )
		type = trim( type ).toUpperCase()
		return "GET" unless type in ["GET", "PUT", "POST", "DELETE"]
		return type
	#END resolveRequestType

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#resolveContext( data_object, type, options, context )
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
	# Method: Falcon.Adapter#standardizeOptions( data_object, type, options, context )
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
	standardizeOptions: ( data_object, type, options, context ) ->
		#Shallow clone the options so as to not disturb the original object
		if isObject( options )
			output_options = {}
			output_options[key] = value for key, value of options
		
		else if isFunction(options)
			output_options = {complete: options}
		
		else if isString(options)
			output_options = {attributes: trim( options ).split(",")}
		
		else if isArray( options )
			output_options = {attributes: options}
		
		else
			output_options = {}
		#END if

		output_options.success = (->) unless isFunction(output_options.success)
		output_options.complete = (->) unless isFunction(output_options.complete)
		output_options.error = (->) unless isFunction(output_options.error)
		output_options.parent = data_object.parent unless Falcon.isModel( output_options.parent ) or output_options.parent is null
		output_options.attributes = null unless isArray( output_options.attributes ) or isObject( output_options.attributes )
		output_options.fill_options = null unless isObject( output_options.fill_options )

		output_options.url = @makeUrl( data_object, type, output_options, context )
		output_options.data = @serializeData( data_object, type, output_options, context )

		return output_options
	#END standardizeOptions

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#makeUrl( data_object, type, options, context )
	#	Used to dicern the correct url creation method depending
	#	if one is already present in the options or if we should
	#	call the makeUrl method of the data object.
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
	makeUrl: ( data_object, type, options, context ) ->
		return ( options.url ? data_object.makeUrl(type, options.parent) )
	#END makeUrl

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#serializeData( data_object, type, options, context )
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
		if not options.data? and type in ["POST", "PUT"]
			return data_object.serialize( options.attributes )
		else
			return options.data
		#END if
	#END serializeData

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#parseRawResponseData( data_object, type, options, context, response_args )
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
	# Method: Falcon.Adapter#successResponseHandler( data_object, type, options, context, response_args )
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
			when "GET" then data_object.trigger("fetch", parsed_data)
			when "POST" then data_object.trigger("create", parsed_data)
			when "PUT" then data_object.trigger("save", parsed_data)
			when "DELETE" then data_object.trigger("destroy", parsed_data)
		#END switch

		options.success.call(context, data_object, raw_response_data, options, response_args)
	#END successResponseHandler

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#errorResponseHandler( data_object, type, options, context, response_args )
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
	# Method: Falcon.Adapter#completeResponseHandler( data_object, type, options, context, response_args )
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
	# Method: Falcon.Adapter#sync( data_object, type, options, context )
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
			return {data_object, type, options, context, is_valid} if (type in ["PUT", "POST"]) and (not data_object.validate(options))
		#END if

		is_valid = true

		return {data_object, type, options, context, is_valid}
	#END sync

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#getTemplate( uri, callback )
	#	Method used to lookup a template and execute a callback with the
	#	resultant template's HTML as its only argument.  The base definition
	#	expects to receive a URI beginning with a '#' to signify that we're
	#	looking for an Element in the DOM
	#
	# Arguments:
	#	**uri** _(String)_ - The uri to lookup the template with
	#	**callback** _(Function)_  - Method to call when the template has been loaded. 
	#								 This is here to provide adapters that use asynchronous 
	#								 loading of templates with a way to respond to a 
	#								 completed request.
	#
	# Returns:
	#	_(Falcon.Adapter)_ - This instance
	#------------------------------------------------------------------------
	getTemplate: (uri, callback) ->
		unless isString( uri )
			throw new Error("uri must be a String")
		#END unless

		unless isFunction( callback )
			throw new Error("callback must be a Function")
		#END unless

		element = document.getElementById(uri.slice(1))
		callback( if element? then element.innerHTML else "" )

		return @
	#END getTemplate
#END class

Falcon.adapter = new Falcon.Adapter