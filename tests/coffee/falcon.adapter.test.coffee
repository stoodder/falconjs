describe "Falcon.Adapter", ->
	describe "extend", ->
	#END describe
	
	describe "resolveRequestType", ->
		adapter = new Falcon.Adapter
		data_object = new Falcon.Model
		options = {}
		context = null

		it "Should return GET if type isn't a string", ->
			expect( adapter.resolveRequestType(data_object, null, options, context) ).toBe( "GET" )
			expect( adapter.resolveRequestType(data_object, 123, options, context) ).toBe( "GET" )
		#END it

		it "Should return GET is type isn't GET, PUT, POST, DELETE", ->
			expect( adapter.resolveRequestType(data_object, "HELLO WORLD", options, context) ).toBe( "GET" )
		#END it

		it "Should cast get, put, post, delete (lower case) to their proper forms", ->
			expect( adapter.resolveRequestType(data_object, "get", options, context) ).toBe( "GET" )
			expect( adapter.resolveRequestType(data_object, "put", options, context) ).toBe( "PUT" )
			expect( adapter.resolveRequestType(data_object, "post", options, context) ).toBe( "POST" )
			expect( adapter.resolveRequestType(data_object, "delete", options, context) ).toBe( "DELETE" )
		#END it

		it "Should ignore whitespace", ->
			expect( adapter.resolveRequestType(data_object, "  GET  ", options, context) ).toBe( "GET" )
			expect( adapter.resolveRequestType(data_object, "  PUT  ", options, context) ).toBe( "PUT" )
			expect( adapter.resolveRequestType(data_object, "  POST  ", options, context) ).toBe( "POST" )
			expect( adapter.resolveRequestType(data_object, "  DELETE  ", options, context) ).toBe( "DELETE" )
		#END it
	#END describe

	describe "resovleContext", ->
		adapter = new Falcon.Adapter
		data_object = new Falcon.Model(id: 1)
		type = "GET"
		options = {context: {id: 2}}
		context = {id: 3}

		it "Should resolve the context properly if given", ->
			expect( adapter.resolveContext(data_object, type, options, context) ).toBe( context )
		#END it

		it "Should fallback on the options context if no context is given", ->
			expect( adapter.resolveContext(data_object, type, options, null) ).toBe( options.context )
			expect( adapter.resolveContext(data_object, type, options) ).toBe( options.context )
		#END it

		it "Should fall back on the data_object as context if no context or options.context is given", ->
			expect( adapter.resolveContext(data_object, type, {}, null) ).toBe( data_object )
			expect( adapter.resolveContext(data_object, type, {}) ).toBe( data_object )
		#END it
	#END describe

	describe "standardizeOptions", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		type = "GET"
		context = {id: 3}

		beforeEach ->
			spyOn( adapter, 'makeUrl' ).and.callThrough()
			spyOn( adapter, 'serializeData' ).and.callThrough()
		#END beforeEach

		it "Should present standard options if nothing is passed in", ->
			ret = adapter.standardizeOptions(data_object, type, null, context)
			
			expect( ret['id'] ).not.toBeDefined()
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['data'] ).toBeNull()
			expect( ret['attributes'] ).toBeNull()
			expect( ret['fill_options'] ).toBeNull()

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
		#END it

		it "Should maintain options that are passed in", ->
			id = 'hello_world'
			success = (->)
			complete = (->)
			error = (->)
			parent = null
			attributes = ['id', 'hello']
			url = 'http://www.google.com'
			data = {'hello': 'world'}
			attributes = ['id', 'hello']
			fill_options = {'method': 'append'}

			options = {id, success, complete, error, parent, attributes, url, data, attributes, fill_options}

			ret = adapter.standardizeOptions(data_object, type, options, context)

			expect( ret['id'] ).toBe( options.id )
			expect( ret['success'] ).toBe( options.success )
			expect( ret['complete'] ).toBe( options.complete )
			expect( ret['error'] ).toBe( options.error )
			expect( ret['parent'] ).toBe( options.parent )
			expect( ret['url'] ).toBe( options.url )
			expect( ret['data'] ).toBe( options.data )
			expect( ret['attributes'] ).toBe( options.attributes )
			expect( ret['fill_options'] ).toBe( options.fill_options )

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			#The return object should not be the same object as the options
			expect( ret ).not.toBe( options )

			#Make sure the options haven't changed at all
			expect( options ).toEqual({id, success, complete, error, parent, attributes, url, data, attributes, fill_options})
		#END it

		it "Should assign a function to the complete attribute of the options", ->
			options = (->)
			
			ret = adapter.standardizeOptions(data_object, type, options, context)

			expect( ret['id'] ).not.toBeDefined()
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( options )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['attributes'] ).toBeNull()
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['data'] ).toBeNull()
			expect( ret['fill_options'] ).toBeNull()

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
		#END it

		it "Should split a string into an array of attributes", ->
			options = "id,hello_world,title"
			
			ret = adapter.standardizeOptions(data_object, type, options, context)

			expect( ret['id'] ).not.toBeDefined()
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['attributes'] ).toEqual( ['id','hello_world','title'] )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['data'] ).toBeNull()
			expect( ret['fill_options'] ).toBeNull()

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
		#END it

		it "Should pass through an array into the attrbutes attribute of the options", ->
			options = ['id','hello_world','title']
			
			ret = adapter.standardizeOptions(data_object, type, options, context)

			expect( ret['id'] ).not.toBeDefined()
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['attributes'] ).toEqual( options )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['data'] ).toBeNull()
			expect( ret['fill_options'] ).toBeNull()

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
		#END it

		it "Should allow for attributes to be an object", ->
			attributes = {'id': true, 'model_1': {'id': true}}
			options = {attributes}

			ret = adapter.standardizeOptions(data_object, type, options, context)

			expect( ret['id'] ).not.toBeDefined()
			expect( ret['success'] ).toEqual( jasmine.any(Function) )
			expect( ret['complete'] ).toEqual( jasmine.any(Function) )
			expect( ret['error'] ).toEqual( jasmine.any(Function) )
			expect( ret['parent'] ).toEqual( data_object.parent )
			expect( ret['attributes'] ).toEqual( attributes )
			expect( ret['url'] ).toEqual( jasmine.any(String) )
			expect( ret['data'] ).toBeNull()
			expect( ret['fill_options'] ).toBeNull()

			expect( adapter.makeUrl.calls.count() ).toBe( 1 )
			expect( adapter.makeUrl ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			expect( adapter.serializeData.calls.count() ).toBe( 1 )
			expect( adapter.serializeData ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )

			#The return object should not be the same object as the options
			expect( ret ).not.toBe( options )

			#Make sure the options haven't changed at all
			expect( options ).toEqual({attributes})
		#END it
	#END describe

	describe "makeUrl", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		context = {id: 3}
		options = {
			parent: new Falcon.Model
		}

		beforeEach ->
			spyOn( data_object, 'makeUrl' ).and.returnValue("http://www.falconjs.com")
		#END beforeEach

		it "Should return the url of the options if one is present", ->
			ret = adapter.makeUrl( data_object, "GET", {url: 'http://www.google.com'}, null)
			expect( data_object.makeUrl ).not.toHaveBeenCalled()
			expect( ret ).toBe('http://www.google.com')
		#END it

		it "Should call the makeUrl method on the data object properly", ->
			ret = adapter.makeUrl( data_object, "PUT", options, null)
			expect( data_object.makeUrl.calls.count() ).toBe(1)
			expect( data_object.makeUrl ).toHaveBeenCalledWith("PUT", options.parent)
			expect( ret ).toBe('http://www.falconjs.com')
		#END it
	#END describe

	describe "serializeData", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		context = {id: 3}
		options = {
			data: {id: 4}
		}
		attributes = ["id","hello"]
		serialized_data = {'hello': 'world'}

		beforeEach ->
			spyOn( data_object, 'serialize' ).and.returnValue(serialized_data)
		#END beforeEach

		it "Should use the data attribute of options if one is present", ->
			expect( adapter.serializeData( data_object, "GET", options, context ) ).toBe( options.data )
			expect( adapter.serializeData( data_object, "POST", options, context ) ).toBe( options.data )
			expect( adapter.serializeData( data_object, "PUT", options, context ) ).toBe( options.data )
			expect( adapter.serializeData( data_object, "DELETE", options, context ) ).toBe( options.data )

			expect( data_object.serialize ).not.toHaveBeenCalled()
		#END it

		it "Should call the serialize method on the data object if the request type is POST", ->
			ret = adapter.serializeData( data_object, "POST", {attributes}, context )
			
			expect( data_object.serialize.calls.count() ).toBe( 1 )
			expect( data_object.serialize ).toHaveBeenCalledWith( attributes )
			
			expect( ret ).toBe( serialized_data )
		#END it

		it "Should call the serialize method on the data object if the request type is PUT", ->
			ret = adapter.serializeData( data_object, "PUT", {attributes}, context )
			
			expect( data_object.serialize.calls.count() ).toBe( 1 )
			expect( data_object.serialize ).toHaveBeenCalledWith( attributes )
			
			expect( ret ).toBe( serialized_data )
		#END it

		it "Should not call serialzie on GET or DELETE", ->
			ret = adapter.serializeData( data_object, "GET", {attributes}, context )
			ret = adapter.serializeData( data_object, "DELETE", {attributes}, context )
			
			expect( data_object.serialize ).not.toHaveBeenCalled()
			
			expect( ret ).not.toBeDefined()
		#END it
	#END describe

	describe "parseRawResponseData", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		type = "GET"
		context = {id: 3}
		options = {}
		response_args = {id: 5}

		it "Should simply return the response arguments for the base adapter class", ->
			expect( adapter.parseRawResponseData(data_object, type, options, context, response_args) ).toBe( response_args )
		#END it
	#END describe

	describe "successResponseHandler", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		context = new Falcon.Model({id: 2}, parent)
		type = "GET"

		success = sinon.spy()
		error = sinon.spy()
		complete = sinon.spy()
		fill_options = {'method': 'merge'}
		options = {success, error, complete, fill_options}

		parsed_data = {id: 5}
		raw_response_data = {model: parsed_data}
		response_args = {data: JSON.stringify(raw_response_data)}

		beforeEach ->
			spyOn( adapter, 'parseRawResponseData' ).and.returnValue(raw_response_data)

			spyOn( data_object, 'parse' ).and.returnValue(parsed_data)
			spyOn( data_object, 'fill' )
			spyOn( data_object, 'trigger' )

			success.reset()
			error.reset()
			complete.reset()
		#END beforeEach

		it "Should call the correct methods on GET", ->
			type = "GET"
			adapter.successResponseHandler( data_object, type, options, context, response_args )

			expect( adapter.parseRawResponseData.calls.count() ).toBe( 1 )
			expect( adapter.parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, response_args )

			expect( data_object.parse.calls.count() ).toBe( 1 )
			expect( data_object.parse ).toHaveBeenCalledWith( raw_response_data, options )

			expect( data_object.fill.calls.count() ).toBe( 1 )
			expect( data_object.fill ).toHaveBeenCalledWith( parsed_data, options.fill_options )

			expect( data_object.trigger.calls.count() ).toBe( 1 )
			expect( data_object.trigger ).toHaveBeenCalledWith("fetch", parsed_data)

			expect( success.callCount ).toBe( 1 )
			expect( success ).toHaveBeenCalledWith( data_object, raw_response_data, options, response_args )
			expect( success ).toHaveBeenCalledOn( context )

			expect( error ).not.toHaveBeenCalled()
			expect( complete ).not.toHaveBeenCalled()
		#END it

		it "Should call the correct methods on POST", ->
			type = "POST"
			adapter.successResponseHandler( data_object, type, options, context, response_args )

			expect( adapter.parseRawResponseData.calls.count() ).toBe( 1 )
			expect( adapter.parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, response_args )

			expect( data_object.parse.calls.count() ).toBe( 1 )
			expect( data_object.parse ).toHaveBeenCalledWith( raw_response_data, options )

			expect( data_object.fill.calls.count() ).toBe( 1 )
			expect( data_object.fill ).toHaveBeenCalledWith( parsed_data, options.fill_options )

			expect( data_object.trigger.calls.count() ).toBe( 1 )
			expect( data_object.trigger ).toHaveBeenCalledWith("create", parsed_data)

			expect( success.callCount ).toBe( 1 )
			expect( success ).toHaveBeenCalledWith( data_object, raw_response_data, options, response_args )
			expect( success ).toHaveBeenCalledOn( context )

			expect( error ).not.toHaveBeenCalled()
			expect( complete ).not.toHaveBeenCalled()
		#END it

		it "Should call the correct methods on PUT", ->
			type = "PUT"
			adapter.successResponseHandler( data_object, type, options, context, response_args )

			expect( adapter.parseRawResponseData.calls.count() ).toBe( 1 )
			expect( adapter.parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, response_args )

			expect( data_object.parse.calls.count() ).toBe( 1 )
			expect( data_object.parse ).toHaveBeenCalledWith( raw_response_data, options )

			expect( data_object.fill.calls.count() ).toBe( 1 )
			expect( data_object.fill ).toHaveBeenCalledWith( parsed_data, options.fill_options )

			expect( data_object.trigger.calls.count() ).toBe( 1 )
			expect( data_object.trigger ).toHaveBeenCalledWith("save", parsed_data)

			expect( success.callCount ).toBe( 1 )
			expect( success ).toHaveBeenCalledWith( data_object, raw_response_data, options, response_args )
			expect( success ).toHaveBeenCalledOn( context )

			expect( error ).not.toHaveBeenCalled()
			expect( complete ).not.toHaveBeenCalled()
		#END it

		it "Should call the correct methods on DELETE", ->
			type = "DELETE"
			adapter.successResponseHandler( data_object, type, options, context, response_args )

			expect( adapter.parseRawResponseData.calls.count() ).toBe( 1 )
			expect( adapter.parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, response_args )

			expect( data_object.parse.calls.count() ).toBe( 1 )
			expect( data_object.parse ).toHaveBeenCalledWith( raw_response_data, options )

			expect( data_object.fill.calls.count() ).toBe( 1 )
			expect( data_object.fill ).toHaveBeenCalledWith( parsed_data, options.fill_options )

			expect( data_object.trigger.calls.count() ).toBe( 1 )
			expect( data_object.trigger ).toHaveBeenCalledWith("destroy", parsed_data)

			expect( success.callCount ).toBe( 1 )
			expect( success ).toHaveBeenCalledWith( data_object, raw_response_data, options, response_args )
			expect( success ).toHaveBeenCalledOn( context )

			expect( error ).not.toHaveBeenCalled()
			expect( complete ).not.toHaveBeenCalled()
		#END it
	#END describe

	describe "errorResponseHandler", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		context = new Falcon.Model({id: 2}, parent)
		type = "GET"

		success = sinon.spy()
		error = sinon.spy()
		complete = sinon.spy()
		options = {success, error, complete}

		parsed_data = {id: 5}
		raw_response_data = {model: parsed_data}
		response_args = {data: JSON.stringify(raw_response_data)}

		beforeEach ->
			spyOn( adapter, 'parseRawResponseData' ).and.returnValue(raw_response_data)

			success.reset()
			error.reset()
			complete.reset()
		#END beforeEach

		it "Should call the error method correctly", ->
			adapter.errorResponseHandler( data_object, type, options, context, response_args )

			expect( adapter.parseRawResponseData.calls.count() ).toBe( 1 )
			expect( adapter.parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, response_args )

			expect( error.callCount ).toBe( 1 )
			expect( error ).toHaveBeenCalledWith( data_object, raw_response_data, options, response_args )
			expect( error ).toHaveBeenCalledOn( context )

			expect( success ).not.toHaveBeenCalled()
			expect( complete ).not.toHaveBeenCalled()
		#END it
	#END describe

	describe "completeResponseHandler", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		context = new Falcon.Model({id: 2}, parent)
		type = "GET"

		success = sinon.spy()
		error = sinon.spy()
		complete = sinon.spy()
		options = {success, error, complete}

		parsed_data = {id: 5}
		raw_response_data = {model: parsed_data}
		response_args = {data: JSON.stringify(raw_response_data)}

		beforeEach ->
			spyOn( adapter, 'parseRawResponseData' ).and.returnValue(raw_response_data)

			success.reset()
			error.reset()
			complete.reset()
		#END beforeEach

		it "Should call the complete method correctly", ->
			adapter.completeResponseHandler( data_object, type, options, context, response_args )

			expect( adapter.parseRawResponseData.calls.count() ).toBe( 1 )
			expect( adapter.parseRawResponseData ).toHaveBeenCalledWith( data_object, type, options, context, response_args )
			
			expect( complete.callCount ).toBe( 1 )
			expect( complete ).toHaveBeenCalledWith( data_object, raw_response_data, options, response_args )
			expect( complete ).toHaveBeenCalledOn( context )

			expect( success ).not.toHaveBeenCalled()
			expect( error ).not.toHaveBeenCalled()
		#END it
	#END describe

	describe "sync", ->
		adapter = new Falcon.Adapter
		parent = new Falcon.Model
		data_object = new Falcon.Model({id: 1}, parent)
		context = new Falcon.Model({id: 2}, parent)
		type = "GET"
		options = {}

		beforeEach ->
			sinonSpyOn( adapter, 'resolveRequestType' )
			sinonSpyOn( adapter, 'standardizeOptions' )
			sinonSpyOn( adapter, 'resolveContext' )
			sinonSpyOn( data_object, 'validate' )
		#END beforeEach

		it "Should throw if a data object isn't passed in", ->
			expect( -> adapter.sync() ).toThrow()
			expect( -> adapter.sync(123) ).toThrow()
			expect( -> adapter.sync(new Falcon.View) ).toThrow()

			expect( adapter.resolveRequestType ).not.toHaveBeenCalled()
			expect( adapter.standardizeOptions ).not.toHaveBeenCalled()
			expect( adapter.resolveContext ).not.toHaveBeenCalled()
			expect( data_object.validate ).not.toHaveBeenCalled()
		#END it

		it "Should return properly on GET", ->
			type = "GET"
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).not.toHaveBeenCalled()

			expect( ret ).toEqual
				data_object: data_object
				type: "GET"
				options: jasmine.any(Object)
				context: context
				is_valid: true
			#END toEqual
		#END it

		it "Should return properly on POST", ->
			type = "POST"
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).toHaveBeenCalledOnce()
			expect( data_object.validate ).toHaveBeenCalledWith( jasmine.any(Object) )
			expect( data_object.validate ).toHaveBeenCalledAfter( adapter.resolveContext )

			expect( ret ).toEqual
				data_object: data_object
				type: "POST"
				options: jasmine.any(Object)
				context: context
				is_valid: true
			#END toEqual
		#END it

		it "Should return properly on PUT", ->
			type = "PUT"
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).toHaveBeenCalledOnce()
			expect( data_object.validate ).toHaveBeenCalledWith( jasmine.any(Object) )
			expect( data_object.validate ).toHaveBeenCalledAfter( adapter.resolveContext )

			expect( ret ).toEqual
				data_object: data_object
				type: "PUT"
				options: jasmine.any(Object)
				context: context
				is_valid: true
			#END toEqual
		#END it

		it "Should return properly on DELETE", ->
			type = "DELETE"
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).not.toHaveBeenCalled()

			expect( ret ).toEqual
				data_object: data_object
				type: "DELETE"
				options: jasmine.any(Object)
				context: context
				is_valid: true
			#END toEqual
		#END it

		it "Should return properly with a failed POST validation", ->
			type = "POST"
			data_object.validate = sinon.spy( -> return false )
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).toHaveBeenCalledOnce()
			expect( data_object.validate ).toHaveBeenCalledWith( jasmine.any(Object) )
			expect( data_object.validate ).toHaveBeenCalledAfter( adapter.resolveContext )

			expect( ret ).toEqual
				data_object: data_object
				type: "POST"
				options: jasmine.any(Object)
				context: context
				is_valid: false
			#END toEqual
		#END it

		it "Should return properly with a failed PUT validation", ->
			type = "PUT"
			data_object.validate = sinon.spy( -> return false )
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).toHaveBeenCalledOnce()
			expect( data_object.validate ).toHaveBeenCalledWith( jasmine.any(Object) )
			expect( data_object.validate ).toHaveBeenCalledAfter( adapter.resolveContext )

			expect( ret ).toEqual
				data_object: data_object
				type: "PUT"
				options: jasmine.any(Object)
				context: context
				is_valid: false
			#END toEqual
		#END it

		it "Should not call validate on a collection", ->
			type = "POST"
			data_object = new Falcon.Collection
			data_object.validate = sinon.spy( -> return false )
			ret = adapter.sync( data_object, type, options, context )

			expect( adapter.resolveRequestType ).toHaveBeenCalledOnce()
			expect( adapter.resolveRequestType ).toHaveBeenCalledWith( data_object, type, options, context )

			expect( adapter.standardizeOptions ).toHaveBeenCalledOnce()
			expect( adapter.standardizeOptions ).toHaveBeenCalledWith( data_object, type, options, context )
			expect( adapter.standardizeOptions ).toHaveBeenCalledAfter( adapter.resolveRequestType )

			expect( adapter.resolveContext ).toHaveBeenCalledOnce()
			expect( adapter.resolveContext ).toHaveBeenCalledWith( data_object, type, jasmine.any(Object), context )
			expect( adapter.resolveContext ).toHaveBeenCalledAfter( adapter.standardizeOptions )

			expect( data_object.validate ).not.toHaveBeenCalled()

			expect( ret ).toEqual
				data_object: data_object
				type: "POST"
				options: jasmine.any(Object)
				context: context
				is_valid: true
			#END toEqual
		#END it
	#END describe

	describe "getTemplate", ->
		adapter = new Falcon.Adapter
		elm_id = "my-template"
		uri = "##{elm_id}"
		callback = null
		template = "Hello World"
		elm = null

		beforeEach ->
			callback = jasmine.createSpy()
			spyOn( document, 'getElementById' ).and.callThrough()

			elm = document.createElement("div")
			elm.setAttribute("id", elm_id)
			elm.innerHTML = template
			document.body.appendChild( elm )
		#END beforeEach

		afterEach ->
			document.body.removeChild( elm )
		#END afterEach

		it "Should throw if an invalid uri is given", ->
			expect( -> adapter.getTemplate() ).toThrow()
			expect( -> adapter.getTemplate(123) ).toThrow()
		#END it

		it "Should throw if an invalid callback is given", ->
			expect( -> adapter.getTemplate(uri) ).toThrow()
			expect( -> adapter.getTemplate(uri, 123) ).toThrow()
		#END it

		it "Should retrieve the element and assign the inner html", ->
			ret = adapter.getTemplate( uri, callback )

			expect( document.getElementById.calls.count() ).toBe( 1 )
			expect( document.getElementById ).toHaveBeenCalledWith("my-template")

			expect( callback.calls.count() ).toBe( 1 )
			expect( callback ).toHaveBeenCalledWith(template)

			expect( ret ).toBe( adapter )
		#END it

		it "Should assign an empty template to an unfound identifier", ->
			ret = adapter.getTemplate( "#the_wrong_template_id", callback )

			expect( document.getElementById.calls.count() ).toBe( 1 )
			expect( document.getElementById ).toHaveBeenCalledWith("the_wrong_template_id")

			expect( callback.calls.count() ).toBe( 1 )
			expect( callback ).toHaveBeenCalledWith("")

			expect( ret ).toBe( adapter )
		#END it
	#END describe
#END describe