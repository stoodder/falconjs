class jQueryAdapter extends Falcon.Adapter
	cache: false

	standardizeOptions: ( data_object, type, options, context ) ->
		output_options = super( data_object, type, options, context )

		output_options.dataType = "json" unless isString(output_options.dataType)
		output_options.contentType = "application/json" unless isString(output_options.contentType)
		output_options.params = {} unless isObject( output_options.params )
		output_options.headers = {} unless isObject( output_options.headers )
		output_options.cache = @cache

		return output_options
	#END standardizeOptions

	makeUrl: ( data_object, type, options, context ) ->
		url = super( data_object, type, options, context )

		unless isEmpty( options.params )
			url += "?" unless url.indexOf("?") > -1
			url += ( "#{key}=#{value}" for key, value of options.params ).join("&")
		#END unless

		return url
	#END makeUrl

	serializeData: ( data_object, type, options, context ) ->
		serialized_data = super( data_object, type, options, context )
		return "" unless serialized_data?
		return JSON.stringify(serialized_data)
	#END serializeData

	parseRawResponseData: ( data_object, type, options, context, response_args ) ->
		{data, xhr} = super( data_object, type, options, context, response_args )
		data = JSON.parse( data ) if isString( data )
		data = JSON.parse( xhr.responseText ) if not data? and isString( xhr.responseText )
		data ?= if Falcon.isModel( data_object ) then {} else []
		return data
	#END parseRawResponseData

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
					'data': data,
					'status': status,
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
					'status': status,
					'xhr': xhr
				})
			#END complete
		#END $.ajax
	#END sync

	getTemplate: (view, url, loaded_callback) ->
		if url.charAt(0) is "#"
			return super( view, url, loaded_callback )
		else
			$.ajax
				url: url
				type: "GET"
				cache: @cache
				complete: =>
					loaded_callback() if isFunction( loaded_callback )
				#END complete
				error: () =>
					console.log("Error Loading Template: '#{url}'")
				#END error
				success: (html) =>
					Falcon.View.cacheTemplate(url, html)
				#END success
			#END ajax
		#END if

		return @
	#END getTemplate
#END class

Falcon.adapter = new jQueryAdapter