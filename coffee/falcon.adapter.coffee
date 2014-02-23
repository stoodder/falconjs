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
	#	Used to discern the context to call the response handlers on
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
	#	parent - The 'parent' object to make this object's URL with. Can be null.
	#
	# Arguments:
	#	**data_object** _(Model|Collection)_  - The data object in question
	#	**type** _(String)_ - The request type
	#	**options** _(Object|Function|String)_ - The options for perform this sync with. 
	#											 If a function is given, it is assigned to the 
	#											 'compete' attribute. If a string or an array is given, 
	#											 it is turned into an array and assigned to the 
	#											 'attributes' attribute
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
	standardizeOptions: ( data_object, type, options, context ) ->
		options = {complete: options} if isFunction(options)
		options = {attributes: trim( options ).split(",")} if isString(options)
		options = {attributes: options} if isArray( options )

		options = {} unless isObject(options)

		options.success = (->) unless isFunction(options.success)
		options.complete = (->) unless isFunction(options.complete)
		options.error = (->) unless isFunction(options.error)
		options.parent = data_object.parent unless Falcon.isModel( options.parent ) or options.parent is null
		options.attributes = null unless isArray( options.attributes )

		return options
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
		if options.data is null and type in ["POST", "PUT"]
			options.data = data_object.serialize( options.attributes )
		#END if

		return options.data
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
	#	_(mixed)_ - The context to call the response methods on
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
		{data, status, xhr} = response_args

		raw_response_data = @parseRawResponseData( data_object, type, options, context, response_args )
		parsed_data = data_object.parse( raw_response_data, options )
		data_object.fill(parsed_data, options)

		switch type
			when "GET" then data_object.trigger("fetch", parsed_data)
			when "POST" then data_object.trigger("create", parsed_data)
			when "PUT" then data_object.trigger("save", parsed_data)
			when "DELETE" then data_object.trigger("destroy", parsed_data)
		#END switch

		options.success.call(context, data_object, raw_response_data, response_args)
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
		options.error.call(context, data_object, raw_response_data, response_args)
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
		options.complete.call(context, data_object, raw_response_data, response_args)
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
	#	_(Falcon.Adapter)_ - This instance
	#
	# Note:
	#	This is a Data Object (Models and Collections) related
	#	method. which will always have the first four related
	#	arguments regardless if they're used or not.
	#------------------------------------------------------------------------
	sync: ( data_object, type, options, context ) ->
		unless Falcon.isDataObject( data_object )
			throw new Error("Expected data_object to be a Model or Collection in Sync")
		#END unless

		return @
	#END sync

	#------------------------------------------------------------------------
	# Method: Falcon.Adapter#getTemplate( view, uri, loaded_callback )
	#	Method used to retrieve the template html based on a given falcon view
	#	and temlate uri.  The default implementation (here) expects to look for
	#	a template element where the uri is an identifier string starting with
	#	'#'.  If the loaded_callback is provided, it will also be called
	#
	# Arguments:
	#	**view** _(View)_  - The falcon view calling this method
	#	**uri** _(String)_ - The uri to lookup the template with
	#	**loaded_callback** _(Function)_  - Method to call when the template has been loaded. 
	#										This is here to provide adapters that use asynchronous 
	#										loading of templates with a way to respond to a 
	#										completed request.
	#
	# Returns:
	#	_(Falcon.Adapter)_ - This instance
	#------------------------------------------------------------------------
	getTemplate: ( view, uri, loaded_callback ) ->
		template = document.getElementById(uri.slice(1))?.innerHTML ? ""
		Falcon.View.cacheTemplate( uri, template )
		
		loaded_callback() if isFunction( loaded_callback )

		return @
	#END getTemplate
#END class