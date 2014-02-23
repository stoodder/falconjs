class Falcon.Adapter extends Falcon.Object
	resolveRequestType: ( data_object, type, options, context ) ->
		return "GET" unless isString( type )
		type = trim( type ).toUpperCase()
		return "GET" unless type in ["GET", "PUT", "POST", "DELETE"]
		return type
	#END resolveRequestType

	resolveContext: ( data_object, type, options, context ) ->
		return context ? options.context ? data_object
	#END resolveContext

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

	makeUrl: ( data_object, type, options, context ) ->
		return ( options.url ? data_object.makeUrl(type, options.parent) )
	#END makeUrl

	serializeData: ( data_object, type, options, context ) ->
		if options.data is null and type in ["POST", "PUT"]
			options.data = data_object.serialize( options.attributes )
		#END if

		return options.data
	#END serializeData

	parseRawResponseData: ( data_object, type, options, context, response_args ) ->
		return response_args
	#END parseRawResponseData

	successResponseHandler: ( data_object, type, options, context, response_args ) ->
		{data, status, xhr} = response_args

		raw_data = @parseRawResponseData( data_object, type, options, context, response_args )
		parsed_data = data_object.parse( raw_data, options )
		data_object.fill(parsed_data, options)

		switch type
			when "GET" then data_object.trigger("fetch", parsed_data)
			when "POST" then data_object.trigger("create", parsed_data)
			when "PUT" then data_object.trigger("save", parsed_data)
			when "DELETE" then data_object.trigger("destroy", parsed_data)
		#END switch

		options.success.call(context, data_object, raw_data, response_args)
	#END successResponseHandler

	errorResponseHandler: ( data_object, type, options, context, response_args ) ->
		raw_data = @parseRawResponseData( data_object, type, options, context, response_args )
		options.error.call(context, data_object, raw_data, response_args)
	#END errorResponseHandler

	completeResponseHandler: ( data_object, type, options, context, response_args ) ->
		raw_data = @parseRawResponseData( data_object, type, options, context, response_args )
		options.complete.call(context, data_object, raw_data, response_args)
	#END completeResponseHandler

	sync: ( data_object, type, options, context ) ->
		unless Falcon.isDataObject( data_object )
			throw new Error("Expected data_object to be a Model or Collection in Sync")
		#END unless
	#END sync

	getTemplate: (view, url, loaded_callback) ->
		template = document.getElementById(url.slice(1))?.innerHTML ? ""
		Falcon.View.cacheTemplate( url, template )
		
		loaded_callback() if isFunction( loaded_callback )

		return @
	#END getTemplate
#END class