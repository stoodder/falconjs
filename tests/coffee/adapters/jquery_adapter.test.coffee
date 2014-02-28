describe "jQueryAdapter", ->
	describe "standardizeOptions", ->
		adapter = new jQueryAdapter
		parent = new Falcon.Model(id: 0)
		data_object = new Falcon.Model({id: 1}, parent)
		type = "GET"
		options =
			dataType: 'new-json'
			contentType: 'application/new-json'
			params: {'hello': 'world'}
			headers: {'foo': 'bar'}
			cache: true
		#END options
		context = new Falcon.Model(id: 3)

		beforeEach ->
			spyOn( Falcon.Adapter::, 'standardizeOptions' ).and.callThrough()
			spyOn( adapter, 'makeUrl' ).and.callThrough()
			spyOn( adapter, 'serializeData' ).and.callThrough()
		#END beforeEach

		it "Should generate the proper options by default", ->
			ret = adapter.standardizeOptions( data_object, type, null, context )

			expect( adapter.cache ).toBe( false )

			expect( Falcon.Adapter::standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::standardizeOptions ).toHaveBeenCalledWith( data_object, type, null, context )

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( ret ).toEqual
				'success': jasmine.any(Function)
				'error': jasmine.any(Function)
				'complete': jasmine.any(Function)
				'url': jasmine.any(String)
				'attributes': null
				'parent': data_object.parent

				#jQuery Adapter specific options
				'data': ''
				'dataType': 'json'
				'contentType': 'application/json'
				'params': {}
				'headers': {}
				'cache': false
			#END toEqual
		#END it

		it "Should pass through options that are given", ->
			ret = adapter.standardizeOptions( data_object, type, options, context )

			expect( adapter.cache ).toBe( false )

			expect( Falcon.Adapter::standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( ret ).toEqual
				'success': jasmine.any(Function)
				'error': jasmine.any(Function)
				'complete': jasmine.any(Function)
				'url': jasmine.any(String)
				'attributes': null
				'parent': data_object.parent

				#jQuery Adapter specific options
				'data': ''
				'dataType': 'new-json'
				'contentType': 'application/new-json'
				'params': {'hello': 'world'}
				'headers': {'foo': 'bar'}
				'cache': true
			#END toEqual

			expect( ret ).not.toBe( options )
		#END it

		it "Should use the adapter's 'cache' value if on is not present in options", ->
			adapter.cache = true
			ret = adapter.standardizeOptions( data_object, type, null, context )

			expect( Falcon.Adapter::standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::standardizeOptions ).toHaveBeenCalledWith( data_object, type, null, context )

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( ret ).toEqual
				'success': jasmine.any(Function)
				'error': jasmine.any(Function)
				'complete': jasmine.any(Function)
				'url': jasmine.any(String)
				'attributes': null
				'parent': data_object.parent

				#jQuery Adapter specific options
				'data': ''
				'dataType': 'json'
				'contentType': 'application/json'
				'params': {}
				'headers': {}
				'cache': true
			#END toEqual
		#END it
	#END describe
	
	describe "makeUrl", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = "GET"
		options = {url: "http://www.google.com"}
		params = {'hello': 'world', 'foo': 'bar'}
		context = new Falcon.Model(id: 2)

		beforeEach ->
			spyOn( Falcon.Adapter::, 'makeUrl' ).and.callThrough()
		#END beforeEach

		it "Should not have any query string parameters if no params present", ->
			ret = adapter.makeUrl( data_object, type, options, context )

			expect( Falcon.Adapter::makeUrl.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::makeUrl ).toHaveBeenCalledWith( data_object, type, options, context )
			
			expect( ret ).toBe( "http://www.google.com")
		#END it

		it "Should append query string parameters properly", ->
			options.params = params
			ret = adapter.makeUrl( data_object, type, options, context )

			expect( Falcon.Adapter::makeUrl.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::makeUrl ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( ret ).toBe( "http://www.google.com?hello=world&foo=bar")
		#END it

		it "Should append paramters to existing paramters", ->
			options.url = "http://www.google.com?free=bird"
			ret = adapter.makeUrl( data_object, type, options, context )

			expect( Falcon.Adapter::makeUrl.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::makeUrl ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( ret ).toBe( "http://www.google.com?free=bird&hello=world&foo=bar")
		#END it
	#END describe
	
	describe "serializeData", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = "GET"
		options = {
			data: {'hello': 'world'}
		}
		context = new Falcon.Model(id: 2)

		beforeEach ->
			spyOn( Falcon.Adapter::, 'serializeData' ).and.callThrough()
		#END beforeEach

		it "Should return an empty string by default", ->
			ret = adapter.serializeData( data_object, "GET", {}, context )

			expect( Falcon.Adapter::serializeData.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::serializeData ).toHaveBeenCalledWith( data_object, "GET", jasmine.any(Object), context )

			expect( ret ).toBe( "" )
		#END it

		it "Should stringify the data properly", ->
			ret = adapter.serializeData( data_object, "GET", options, context )

			expect( Falcon.Adapter::serializeData.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::serializeData ).toHaveBeenCalledWith( data_object, "GET", options, context )

			expect( ret ).toBe( JSON.stringify(options.data) )
		#END it
	#END describe
	
	describe "parseRawResponseData", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = "GET"
		options = {}
		context = new Falcon.Model(id: 2)
		data = JSON.stringify({"hello": "world"})
		xhr = {responseText: JSON.stringify({"foo": "bar"})}

		beforeEach ->
			spyOn( Falcon.Adapter::, 'parseRawResponseData' ).and.callThrough()
		#END beforeEach

		it "Should parse the response data", ->
			ret = adapter.parseRawResponseData( data_object, type, options, context, {data, xhr})

			expect( Falcon.Adapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {data, xhr})

			expect( ret ).toEqual({"hello": "world"})
		#END it

		it "Should parse the xhr respons text if no data is present", ->
			ret = adapter.parseRawResponseData( data_object, type, options, context, {xhr})

			expect( Falcon.Adapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {xhr})

			expect( ret ).toEqual({"foo": "bar"})
		#END it

		it "Should return an empty object if no parsing happend and a model is pased in", ->
			ret = adapter.parseRawResponseData( data_object, type, options, context, {})

			expect( Falcon.Adapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {})

			expect( ret ).toEqual({})
		#END it

		it "Should return and empty array if no parsing happend and a collection is passed in", ->
			data_object = new Falcon.Collection
			ret = adapter.parseRawResponseData( data_object, type, options, context, {})

			expect( Falcon.Adapter::parseRawResponseData.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, {})

			expect( ret ).toEqual([])
		#END it
	#END describe
	
	describe "sync", ->
		adapter = new jQueryAdapter
		data_object = new Falcon.Model(id: 1)
		type = "GET"
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
			spyOn( Falcon.Adapter::, 'sync' ).and.callThrough()
			spyOn( adapter, 'successResponseHandler' )
			spyOn( adapter, 'errorResponseHandler' )
			spyOn( adapter, 'completeResponseHandler' )
			spyOn( $, "ajax" ).and.returnValue(xhr_return)
		#END beforeEach

		it "Should set up the ajax request properly", ->
			ret = adapter.sync( data_object, "GET", options, context )

			expect( Falcon.Adapter::sync.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::sync ).toHaveBeenCalledWith( data_object, "GET", options, context )

			expect( $.ajax.calls.count() ).toBe( 1 )
			expect( $.ajax ).toHaveBeenCalledWith
				'type': "GET"
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

			expect( Falcon.Adapter::sync ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			expect( adapter.successResponseHandler.calls.count() ).toBe( 1 )
			expect( adapter.successResponseHandler ).toHaveBeenCalledWith( data_object, "GET", jasmine.any(Object), context, {
				data: response_data
				status: response_status
				xhr: response_xhr
			})
		#END it

		it "Should call the error response handler properly", ->
			error( response_xhr )

			expect( Falcon.Adapter::sync ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			expect( adapter.errorResponseHandler.calls.count() ).toBe( 1 )
			expect( adapter.errorResponseHandler ).toHaveBeenCalledWith( data_object, "GET", jasmine.any(Object), context, {
				xhr: response_xhr
			})
		#END it

		it "Should call the complete response handler properly", ->
			complete( response_xhr, response_status )

			expect( Falcon.Adapter::sync ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()

			expect( adapter.completeResponseHandler.calls.count() ).toBe( 1 )
			expect( adapter.completeResponseHandler ).toHaveBeenCalledWith( data_object, "GET", jasmine.any(Object), context, {
				status: response_status
				xhr: response_xhr
			})
		#END it

		it "Should not call the ajax method if we could not validate the model", ->
			data_object.validate = ( -> false )
			ret = adapter.sync( data_object, "POST", options, context )

			expect( Falcon.Adapter::sync.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::sync ).toHaveBeenCalledWith( data_object, "POST", options, context )

			expect( $.ajax ).not.toHaveBeenCalled()
			expect( adapter.successResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.errorResponseHandler ).not.toHaveBeenCalled()
			expect( adapter.completeResponseHandler ).not.toHaveBeenCalled()

			expect( ret ).toBeNull()
		#END it
	#END describe
	
	describe "getTemplate", ->
		adapter = new jQueryAdapter
		view = new Falcon.View
		loaded_callback = jasmine.createSpy("Loaded Callback")
		elm = null
		success = complete = null

		beforeEach ->
			spyOn( Falcon.Adapter::, 'getTemplate' ).and.callThrough()
			spyOn( $, 'ajax' )
			spyOn( Falcon.View, 'cacheTemplate')
			loaded_callback.calls.reset()

			elm = document.createElement("div")
			elm.setAttribute("id", "hello_world")
			elm.innerHTML = "Hello World"
			document.body.appendChild( elm )
		#END beforeEach

		afterEach ->
			document.body.removeChild( elm )
		#END afterEach

		it "Should fall back to the original getTemplate method if an identifier is passed in", ->
			ret = adapter.getTemplate(view, "#hello_world", loaded_callback)

			expect( Falcon.Adapter::getTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.Adapter::getTemplate ).toHaveBeenCalledWith(view, "#hello_world", loaded_callback)

			expect( Falcon.View.cacheTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.View.cacheTemplate ).toHaveBeenCalledWith( "#hello_world", "Hello World" )

			expect( loaded_callback.calls.count() ).toBe( 1 )

			expect( $.ajax ).not.toHaveBeenCalled()

			expect( ret ).toBe( adapter )
		#END it

		it "Should call the ajax method if a url is passed in", ->
			ret = adapter.getTemplate(view, "http://www.google.com", loaded_callback)

			expect( Falcon.Adapter::getTemplate ).not.toHaveBeenCalled()
			expect( loaded_callback ).not.toHaveBeenCalled()
			expect( Falcon.View.cacheTemplate ).not.toHaveBeenCalled()

			expect( $.ajax.calls.count() ).toBe( 1 )
			expect( $.ajax ).toHaveBeenCalledWith
				url: "http://www.google.com"
				type: "GET"
				cache: false
				complete: jasmine.any(Function)
				error: jasmine.any(Function)
				success: jasmine.any(Function)
			#END toHaveBeenCalledWith

			{success, complete} = $.ajax.calls.mostRecent().args[0]

			expect( ret ).toBe( adapter )
		#END it

		it "Should call the success routine properly", ->
			success("Template HTML")

			expect( Falcon.Adapter::getTemplate ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( loaded_callback ).not.toHaveBeenCalled()

			expect( Falcon.View.cacheTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.View.cacheTemplate ).toHaveBeenCalledWith( "http://www.google.com", "Template HTML" )
		#END it

		it "Should call the complete routine properly", ->
			complete()

			expect( Falcon.Adapter::getTemplate ).not.toHaveBeenCalled()
			expect( $.ajax ).not.toHaveBeenCalled()
			expect( Falcon.View.cacheTemplate ).not.toHaveBeenCalled()
			expect( loaded_callback.calls.count() ).toBe( 1 )
		#END it
	#END describe
#END describe