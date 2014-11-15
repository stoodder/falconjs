describe "jQueryAdapter", ->
	describe "standardizeOptions", ->
		adapter = new jQueryAdapter
		parent = new Falcon.Model(id: 0)
		data_object = new Falcon.Model({id: 1}, parent)
		type = Falcon.GET
		options =
			dataType: 'new-json'
			contentType: 'application/new-json'
			params: {'hello': 'world'}
			headers: {'foo': 'bar'}
			cache: true
		#END options
		context = new Falcon.Model(id: 3)

		beforeEach ->
			spyOn( Falcon.DataAdapter::, 'standardizeOptions' ).and.callThrough()
			spyOn( adapter, 'resolveUrl' ).and.callThrough()
			spyOn( adapter, 'serializeData' ).and.callThrough()
		#END beforeEach

		it "Should generate the proper options by default", ->
			ret = adapter.standardizeOptions( data_object, type, null, context )

			expect( adapter.cache ).toBe( false )

			expect( Falcon.DataAdapter::standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::standardizeOptions ).toHaveBeenCalledWith( data_object, type, null, context )

			expect( adapter.resolveUrl.calls.count() ).toBe( 1 )
			expect( adapter.resolveUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( ret ).toEqual
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['attributes'] ).toEqual( null )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['fill_options'] ).toEqual( null )

			#jQuery Adapter specific options
			expect( ret['data'] ).toEqual( '' )
			expect( ret['dataType'] ).toEqual( 'json' )
			expect( ret['contentType'] ).toEqual( 'application/json' )
			expect( ret['params'] ).toEqual( {} )
			expect( ret['headers'] ).toEqual( {} )
			expect( ret['cache'] ).toEqual( false )
		#END it

		it "Should pass through options that are given", ->
			ret = adapter.standardizeOptions( data_object, type, options, context )

			expect( adapter.cache ).toBe( false )

			expect( Falcon.DataAdapter::standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.resolveUrl.calls.count() ).toBe( 1 )
			expect( adapter.resolveUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( ret ).toEqual
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['attributes'] ).toEqual( null )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['fill_options'] ).toEqual( null )

			#jQuery Adapter specific options
			expect( ret['data'] ).toEqual( '' )
			expect( ret['dataType'] ).toEqual( 'new-json' )
			expect( ret['contentType'] ).toEqual( 'application/new-json' )
			expect( ret['params'] ).toEqual( {'hello': 'world'} )
			expect( ret['headers'] ).toEqual( {'foo': 'bar'} )
			expect( ret['cache'] ).toBe( true )

			expect( ret ).not.toBe( options )
		#END it

		it "Should use the adapter's 'cache' value if on is not present in options", ->
			adapter.cache = true
			ret = adapter.standardizeOptions( data_object, type, null, context )

			expect( Falcon.DataAdapter::standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::standardizeOptions ).toHaveBeenCalledWith( data_object, type, null, context )

			expect( adapter.resolveUrl.calls.count() ).toBe( 1 )
			expect( adapter.resolveUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['attributes'] ).toEqual( null )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['fill_options'] ).toEqual( null )

			#jQuery Adapter specific options
			expect( ret['data'] ).toEqual( '' )
			expect( ret['dataType'] ).toEqual( 'json' )
			expect( ret['contentType'] ).toEqual( 'application/json' )
			expect( ret['params'] ).toEqual( {} )
			expect( ret['headers'] ).toEqual( {} )
			expect( ret['cache'] ).toBe( true )
		#END it
	#END describe
	
	describe "resolveUrl", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = Falcon.GET
		options = {url: "http://www.google.com"}
		params = {'hello': 'world', 'foo': 'bar'}
		context = new Falcon.Model(id: 2)

		beforeEach ->
			spyOn( Falcon.DataAdapter::, 'resolveUrl' ).and.callThrough()
		#END beforeEach

		it "Should not have any query string parameters if no params present", ->
			ret = adapter.resolveUrl( data_object, type, options, context )

			expect( Falcon.DataAdapter::resolveUrl.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::resolveUrl ).toHaveBeenCalledWith( data_object, type, options, context )
			
			expect( ret ).toBe( "http://www.google.com")
		#END it

		it "Should append query string parameters properly", ->
			options.params = params
			ret = adapter.resolveUrl( data_object, type, options, context )

			expect( Falcon.DataAdapter::resolveUrl.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::resolveUrl ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( ret ).toBe( "http://www.google.com?hello=world&foo=bar")
		#END it

		it "Should append paramters to existing paramters", ->
			options.url = "http://www.google.com?free=bird"
			ret = adapter.resolveUrl( data_object, type, options, context )

			expect( Falcon.DataAdapter::resolveUrl.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::resolveUrl ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( ret ).toBe( "http://www.google.com?free=bird&hello=world&foo=bar")
		#END it
	#END describe
	
	describe "serializeData", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = Falcon.GET
		options = {
			data: {'hello': 'world'}
		}
		context = new Falcon.Model(id: 2)

		beforeEach ->
			spyOn( Falcon.DataAdapter::, 'serializeData' ).and.callThrough()
		#END beforeEach

		it "Should return an empty string by default", ->
			ret = adapter.serializeData( data_object, Falcon.GET, {}, context )

			expect( Falcon.DataAdapter::serializeData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::serializeData ).toHaveBeenCalledWith( data_object, Falcon.GET, jasmine.any(Object), context )

			expect( ret ).toBe( "" )
		#END it

		it "Should stringify the data properly", ->
			ret = adapter.serializeData( data_object, Falcon.GET, options, context )

			expect( Falcon.DataAdapter::serializeData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::serializeData ).toHaveBeenCalledWith( data_object, Falcon.GET, options, context )

			expect( ret ).toBe( JSON.stringify(options.data) )
		#END it

		it "Should return early if the data is already a string", ->
			options.data = JSON.stringify(options.data)
			ret = adapter.serializeData( data_object, Falcon.GET, options, context )

			expect( Falcon.DataAdapter::serializeData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::serializeData ).toHaveBeenCalledWith( data_object, Falcon.GET, options, context )

			expect( ret ).toBe( options.data )
		#END it
	#END describe
	
	describe "parseRawResponseData", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = Falcon.GET
		options = {}
		context = new Falcon.Model(id: 2)
		data = JSON.stringify({"hello": "world"})
		xhr = {responseText: JSON.stringify({"foo": "bar"})}

		beforeEach ->
			spyOn( Falcon.DataAdapter::, 'parseRawResponseData' ).and.callThrough()
		#END beforeEach

		it "Should parse the response data", ->
			ret = adapter.parseRawResponseData( data_object, type, options, context, {data, xhr})

			expect( Falcon.DataAdapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {data, xhr})

			expect( ret ).toEqual({"hello": "world"})
		#END it

		it "Should parse the xhr respons text if no data is present", ->
			ret = adapter.parseRawResponseData( data_object, type, options, context, {xhr})

			expect( Falcon.DataAdapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {xhr})

			expect( ret ).toEqual({"foo": "bar"})
		#END it

		it "Should return an empty object if no parsing happend and a model is pased in", ->
			ret = adapter.parseRawResponseData( data_object, type, options, context, {})

			expect( Falcon.DataAdapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {})

			expect( ret ).toEqual({})
		#END it

		it "Should return and empty array if no parsing happend and a collection is passed in", ->
			data_object = new Falcon.Collection
			ret = adapter.parseRawResponseData( data_object, type, options, context, {})

			expect( Falcon.DataAdapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {})

			expect( ret ).toEqual([])
		#END it

		it "Should parse the xhr respons text if no data is present", ->
			data_object = new Falcon.Model
			ret = adapter.parseRawResponseData( data_object, type, options, context, {data: "<h1>Invalid</h1>"})

			expect( Falcon.DataAdapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {data: "<h1>Invalid</h1>"})

			expect( ret ).toEqual({})
		#END it
	#END describe
	
	describe "sync", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = Falcon.GET
		options = {
			url: "http://www.google.com"
			data: {"hello": "world"}
		}
		context = new Falcon.Model(id: 2)
		xhr_return = {}
		success = error = complete = null

		response_data = JSON.stringify(options.data)
		response_status = "success"
		response_xhr = {responseText: JSON.stringify({'foo': 'bar'})}

		beforeEach ->
			spyOn( Falcon.DataAdapter::, 'sync' ).and.callThrough()
			spyOn( adapter, 'successResponseHandler' )
			spyOn( adapter, 'errorResponseHandler' )
			spyOn( adapter, 'completeResponseHandler' )
			spyOn( $, "ajax" ).and.returnValue(xhr_return)
		#END beforeEach

		it "Should set up the ajax request properly", ->
			ret = adapter.sync( data_object, Falcon.GET, options, context )

			expect( Falcon.DataAdapter::sync.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::sync ).toHaveBeenCalledWith( data_object, Falcon.GET, options, context )

			expect( $.ajax.calls.count() ).toBe( 1 )
			expect( $.ajax ).toHaveBeenCalledWith
				'type': Falcon.GET
				'url': "http://www.google.com"
				'data': JSON.stringify({"hello": "world"})
				'dataType': 'json'
				'contentType': 'application/json'
				'cache': false
				'headers': {}

				'success': jasmine.any(Function)
				'error': jasmine.any(Function)
				'complete': jasmine.any(Function)
			#END toHaveBeenCalledWith

			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			{success, error, complete} = $.ajax.calls.mostRecent().args[0]

			expect( ret ).toBe( xhr_return )
		#END it

		it "Should call the success response handler properly", ->
			success( response_data, response_status, response_xhr )

			expect( Falcon.DataAdapter::sync ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			expect( adapter.successResponseHandler.calls.count() ).toBe( 1 )
			expect( adapter.successResponseHandler ).toHaveBeenCalledWith( data_object, Falcon.GET, jasmine.any(Object), context, {
				data: response_data
				status: response_status
				xhr: response_xhr
			})
		#END it

		it "Should call the error response handler properly", ->
			error( response_xhr )

			expect( Falcon.DataAdapter::sync ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			expect( adapter.errorResponseHandler.calls.count() ).toBe( 1 )
			expect( adapter.errorResponseHandler ).toHaveBeenCalledWith( data_object, Falcon.GET, jasmine.any(Object), context, {
				xhr: response_xhr
			})
		#END it

		it "Should call the complete response handler properly", ->
			complete( response_xhr, response_status )

			expect( Falcon.DataAdapter::sync ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()

			expect( adapter.completeResponseHandler.calls.count() ).toBe( 1 )
			expect( adapter.completeResponseHandler ).toHaveBeenCalledWith( data_object, Falcon.GET, jasmine.any(Object), context, {
				status: response_status
				xhr: response_xhr
			})
		#END it

		it "Should not call the ajax method if we could not validate the model", ->
			data_object.validate = ( -> false )
			ret = adapter.sync( data_object, Falcon.POST, options, context )

			expect( Falcon.DataAdapter::sync.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::sync ).toHaveBeenCalledWith( data_object, Falcon.POST, options, context )

			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			expect( ret ).toBeNull()
		#END it
	#END describe
	
	describe "resolveTemplate", ->
		adapter = new jQueryAdapter
		callback = jasmine.createSpy("Loaded Callback")
		elm = null
		success = error = null

		beforeEach ->
			spyOn( Falcon.DataAdapter::, 'resolveTemplate' ).and.callThrough()
			spyOn( $, 'ajax' )
			callback.calls.reset()

			elm = document.createElement("div")
			elm.setAttribute("id", "hello_world")
			elm.innerHTML = "Hello World"
			document.body.appendChild( elm )
		#END beforeEach

		afterEach ->
			document.body.removeChild( elm )
		#END afterEach

		it "Should throw if an invalid uri is given", ->
			expect( -> adapter.resolveTemplate() ).toThrow()
			expect( -> adapter.resolveTemplate(123) ).toThrow()
		#END it

		it "Should throw if an invalid callback is given", ->
			expect( -> adapter.resolveTemplate(uri) ).toThrow()
			expect( -> adapter.resolveTemplate(uri, 123) ).toThrow()
		#END it

		it "Should fall back to the original resolveTemplate method if an identifier is passed in", ->
			ret = adapter.resolveTemplate("#hello_world", callback)

			expect( Falcon.DataAdapter::resolveTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.DataAdapter::resolveTemplate ).toHaveBeenCalledWith("#hello_world", callback)

			expect( callback.calls.count() ).toBe( 1 )

			expect( $.ajax ).not.toHaveBeenCalled()

			expect( ret ).toBe( adapter )
		#END it

		it "Should call the ajax method if a url is passed in", ->
			ret = adapter.resolveTemplate("http://www.google.com", callback)

			expect( Falcon.DataAdapter::resolveTemplate ).not.toHaveBeenCalled()
			expect( callback ).not.toHaveBeenCalled()

			expect( $.ajax.calls.count() ).toBe( 1 )
			expect( $.ajax ).toHaveBeenCalledWith
				url: "http://www.google.com"
				type: Falcon.GET
				cache: false
				error: jasmine.any(Function)
				success: jasmine.any(Function)
			#END toHaveBeenCalledWith

			{success, error} = $.ajax.calls.mostRecent().args[0]

			expect( ret ).toBe( adapter )
		#END it

		it "Should call the success routine properly", ->
			success("Template HTML")

			expect( Falcon.DataAdapter::resolveTemplate ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			
			expect( callback.calls.count() ).toBe( 1 )
			expect( callback ).toHaveBeenCalledWith("Template HTML")
		#END it

		it "Should call the error routine properly", ->
			error()

			expect( Falcon.DataAdapter::resolveTemplate ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()

			expect( callback.calls.count() ).toBe( 1 )
			expect( callback ).toHaveBeenCalledWith("")
		#END it
	#END describe
#END describe