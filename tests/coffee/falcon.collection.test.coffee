describe "Falcon.Collection", ->
	class ModelA extends Falcon.Model
		url: 'model_a'
	#END ModelA

	class ModelB extends Falcon.Model
		url: 'model_b'
	#END ModelB

	class ModelC extends Falcon.Model
		url: 'model_c'
	#END ModelC

	class ModelD extends Falcon.Model
		url:  -> 'model_d'
	#END ModelA

	class CollectionA extends Falcon.Collection
		model: ModelA 
	#END class

	class CollectionB extends Falcon.Collection
		model: ModelB
	#END class

	class CollectionC extends Falcon.Collection
		model: ModelC
	#END class

	class CollectionD extends Falcon.Collection
		model: ModelD
	#END class

	class CollectionD2 extends Falcon.Collection
		model: ModelD

		url: 'collection_d2'
	#END class

	class CollectionD3 extends Falcon.Collection
		model: ModelD

		url: -> 'collection_d3'
	#END class

	class ModelE extends Falcon.Model
		url: 'model_e'
		initialize: ->
			@title = ko.observable()
		#END initialize
	#END ModelE

	class CollectionE extends Falcon.Collection
		model: ModelE
	#END CollectionE

	beforeEach ->
		Falcon.baseApiUrl = ""
		Falcon.baseTemplateUrl = ""
	#END beforeEach


	#--------------------------------------------------------------
	#
	# Test the initialize() method
	#	TODO: Break this down into multiple 'it' statements
	#
	#--------------------------------------------------------------
	it "Should initialize properly", ->
		init_stub = sinon.stub(CollectionA::, "initialize")

		collectionA = new CollectionA
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith()
		expect( init_stub ).toHaveBeenCalledOn( collectionA )
		init_stub.reset()

		models = [{"hello": "world"},{"hello": "world2"}]
		collectionA = new CollectionA( models )
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith( models )
		expect( collectionA.parent ).not.toBeDefined()
		expect( collectionA.length() ).toBe( 2 )
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( models, modelB )
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith( models )
		expect( collectionA.parent ).toBe( modelB )
		expect( collectionA.length() ).toBe( 2 )
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( modelB, models )
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith( models )
		expect( collectionA.parent ).toBe( modelB )
		expect( collectionA.length() ).toBe( 2 )
		init_stub.reset()

		models = [new ModelA({"hello": "world"}), new ModelA({"hello": "world2"}) ]
		collectionA = new CollectionA( models )
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith( models )
		expect( collectionA.parent ).not.toBeDefined()
		expect( collectionA.length() ).toBe( 2 )
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( models, modelB )
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith( models )
		expect( collectionA.parent ).toBe( modelB )
		expect( collectionA.length() ).toBe( 2 )
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( modelB, models )
		expect( init_stub ).toHaveBeenCalledOnce()
		expect( init_stub ).toHaveBeenCalledWith( models )
		expect( collectionA.parent ).toBe( modelB )
		expect( collectionA.length() ).toBe( 2 )
		init_stub.reset()

		init_stub.restore()
	#END it

	#--------------------------------------------------------------
	#
	# Test the defaults initialization
	#
	#--------------------------------------------------------------
	it "Should create RawrCollection with defaults that have correct arguments", ->
		hello_spy = null

		class RawrCollection extends Falcon.Collection
			defaults:
				'hello': ( hello_spy = sinon.spy() )
			#END defaults
		#END RawrCollection
		
		expect( hello_spy ).not.toHaveBeenCalled()

		rawr_class = new RawrCollection(input_data = ["one", "two", "three"])

		expect( hello_spy ).toHaveBeenCalled
		expect( hello_spy.callCount ).toBe( 1 )
		expect( hello_spy.firstCall.args.length ).toBe( 1 )
		expect( hello_spy.firstCall.args[0] ).toBe( input_data )
	#END it


	#--------------------------------------------------------------
	#
	# Test the fill() method
	#
	#--------------------------------------------------------------
	describe "Testing the different fill method combinations", ->
		describe "Test default option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				]

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly replace items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 2, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				]

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it
		#END describe

		describe "Test 'replace' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'replace' }

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly replace items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 2, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'replace' }

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it
		#END describe

		describe "Test 'append' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'append' }

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly append items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'append' }

				expect( collectionA.length() ).toBe( 3 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 3 )
				expect( collectionA.at(0).get('hello') ).toBe( "world3" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 1 )
				expect( collectionA.at(1).get('hello') ).toBe( "world" )
				expect( collectionA.at(2) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(2).get('id') ).toBe( 2 )
				expect( collectionA.at(2).get('hello') ).toBe( "world2" )
			#END it
		#END describe

		describe "Test 'prepend' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'prepend' }

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly prepend items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'prepend' }

				index = 0
				expect( collectionA.length() ).toBe( 3 )

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 1 )
				expect( collectionA.at(index).get('hello') ).toBe( "world" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 2 )
				expect( collectionA.at(index).get('hello') ).toBe( "world2" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 3 )
				expect( collectionA.at(index).get('hello') ).toBe( "world3" )
			#END it
		#END describe

		describe "Test 'merge' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'merge' }

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly merge items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
					{id: 4, "hello": "world4"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
					{id: 4, "hello": "world5"}
				], { 'method': 'merge' }

				index = 0
				expect( collectionA.length() ).toBe( 4 )

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 3 )
				expect( collectionA.at(index).get('hello') ).toBe( "world3" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 4 )
				expect( collectionA.at(index).get('hello') ).toBe( "world5" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 1 )
				expect( collectionA.at(index).get('hello') ).toBe( "world" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 2 )
				expect( collectionA.at(index).get('hello') ).toBe( "world2" )
				index++
			#END it

			it "Should properly merge items into a populated collection that has a specified comparator", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
					{id: 4, "hello": "world4"}
				]

				collectionA.comparator = (model_a, model_b) ->
					a_id = parseInt( model_a.get("id") )
					b_id = parseInt( model_b.get("id") )

					return -1 if a_id > b_id
					return 1 if a_id < b_id
					return 0
				#END comparator
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
					{id: 4, "hello": "world5"}
				], { 'method': 'merge' }

				index = 0
				expect( collectionA.length() ).toBe( 4 )

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 4 )
				expect( collectionA.at(index).get('hello') ).toBe( "world5" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 3 )
				expect( collectionA.at(index).get('hello') ).toBe( "world3" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 2 )
				expect( collectionA.at(index).get('hello') ).toBe( "world2" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 1 )
				expect( collectionA.at(index).get('hello') ).toBe( "world" )
				index++
			#END it
		#END describe

		describe "Test 'insert' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'insert', 'insert_index': 2 }

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly insert items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
					{id: 4, "hello": "world4"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'insert', 'insert_index': 1 }

				index = 0
				expect( collectionA.length() ).toBe( 4 )


				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 3 )
				expect( collectionA.at(index).get('hello') ).toBe( "world3" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 1 )
				expect( collectionA.at(index).get('hello') ).toBe( "world" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 2 )
				expect( collectionA.at(index).get('hello') ).toBe( "world2" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 4 )
				expect( collectionA.at(index).get('hello') ).toBe( "world4" )
				index++
			#END it

			it "Should properly insert items into a populated collection at an invalid index", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
					{id: 4, "hello": "world4"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'insert', 'insert_index': 5 }

				index = 0
				expect( collectionA.length() ).toBe( 4 )

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 3 )
				expect( collectionA.at(index).get('hello') ).toBe( "world3" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 4 )
				expect( collectionA.at(index).get('hello') ).toBe( "world4" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 1 )
				expect( collectionA.at(index).get('hello') ).toBe( "world" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 2 )
				expect( collectionA.at(index).get('hello') ).toBe( "world2" )
				index++
			#END it

			it "Should properly insert items into the beginning of a populated collection", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
					{id: 4, "hello": "world4"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'insert', 'insert_index': 0 }

				index = 0
				expect( collectionA.length() ).toBe( 4 )

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 1 )
				expect( collectionA.at(index).get('hello') ).toBe( "world" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 2 )
				expect( collectionA.at(index).get('hello') ).toBe( "world2" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 3 )
				expect( collectionA.at(index).get('hello') ).toBe( "world3" )
				index++

				expect( collectionA.at(index) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(index).get('id') ).toBe( 4 )
				expect( collectionA.at(index).get('hello') ).toBe( "world4" )
				index++
			#END it
		#END describe

		describe "Test invalid option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], {'method': 'invalid'}

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it

			it "Should properly replace items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 2, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], {'method': 'invalid'}

				expect( collectionA.length() ).toBe( 2 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(1) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(1).get('id') ).toBe( 2 )
				expect( collectionA.at(1).get('hello') ).toBe( "world2" )
			#END it
		#END describe

		describe "Test that parent is being set properly on children models", ->
			it "Should properly add items into an empty collection", ->
				modelB = new ModelB
				collectionA = new CollectionA( modelB )
				collectionA.fill [
					{id: 1, "hello": "world"}
				]

				expect( collectionA.length() ).toBe( 1 )
				expect( collectionA.at(0) ).toEqual( jasmine.any(ModelA) )
				expect( collectionA.at(0).get('id') ).toBe( 1 )
				expect( collectionA.at(0).get('hello') ).toBe( "world" )
				expect( collectionA.at(0).parent ).toBe( modelB )
			#END it
		#END describe
	#END describe


	#--------------------------------------------------------------
	#
	# Test the serialize() method
	#
	#--------------------------------------------------------------
	describe "Testing serialize method with proper options", ->
		collectionA = collectionC = null

		models = [
			{id: 1, "hello": "world", "foo": "bar"}
			{id: 2, "hello": "world2", "foo": "bar2"}
			{id: 'a', "hello": "worldA", "foo": "barA"}
		]

		beforeEach ->
			collectionA = new CollectionA( models )
			collectionC = new CollectionC( models )
		#END beforeEach

		it "Should test basic form of serialize method", ->
			serialized = collectionA.serialize()

			expect( serialized ).toEqual models
		#END it

		it "Should test specific fields for serialize method", ->
			serialized = collectionA.serialize(["foo"])

			expect( serialized ).toEqual([
				{"foo": "bar"}
				{"foo": "bar2"}
				{"foo": "barA"}
			])
		#END it

		it "Should test specific fields for serialize method, just id", ->
			serialized = collectionA.serialize("id")

			expect( serialized ).toEqual([
				{id: 1}
				{id: 2}
				{id: 'a'}
			])
		#END it

		it "Should test specific fields for serialize method, string value", ->
			serialized = collectionA.serialize("foo")

			expect( serialized ).toEqual([
				{"foo": "bar"}
				{"foo": "bar2"}
				{"foo": "barA"}
			])
		#END it
	#END it


	#--------------------------------------------------------------
	#
	# Test the makeUrl() method
	#
	#--------------------------------------------------------------
	describe "Testing the makeUrl() method", ->
		it "Tests the basic makeUrl method", ->
			collectionA = new CollectionA()

			expect( collectionA.makeUrl("GET") ).toBe( "/model_a" )
			expect( collectionA.makeUrl("POST") ).toBe( "/model_a" )
			expect( collectionA.makeUrl("PUT") ).toBe( "/model_a" )
			expect( collectionA.makeUrl("DELETE") ).toBe( "/model_a" )
		#END it

		it "Tests the basic makeUrl method, base API url", ->
			collectionA = new CollectionA()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_a" )
			expect( collectionA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_a" )
			expect( collectionA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_a" )
			expect( collectionA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_a" )
		#END it

		it "Tests the basic makeUrl method, base API url ending with a '/'", ->
			collectionA = new CollectionA()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_a" )
			expect( collectionA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_a" )
			expect( collectionA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_a" )
			expect( collectionA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_a" )
		#END it



		it "Tests the basic makeUrl method, with parent", ->
			collectionA = new CollectionA( new ModelB(id: '1b') )

			expect( collectionA.makeUrl("GET") ).toBe( "/model_b/1b/model_a" )
			expect( collectionA.makeUrl("POST") ).toBe( "/model_b/1b/model_a" )
			expect( collectionA.makeUrl("PUT") ).toBe( "/model_b/1b/model_a" )
			expect( collectionA.makeUrl("DELETE") ).toBe( "/model_b/1b/model_a" )
		#END it

		it "Tests the basic makeUrl method, base API url, with parent", ->
			collectionA = new CollectionA( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/2b/model_a" )
			expect( collectionA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/2b/model_a" )
			expect( collectionA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/2b/model_a" )
			expect( collectionA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/2b/model_a" )
		#END it

		it "Tests the basic makeUrl method, base API url ending with a '/', with parent", ->
			collectionA = new CollectionA( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/3b/model_a" )
			expect( collectionA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/3b/model_a" )
			expect( collectionA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/3b/model_a" )
			expect( collectionA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/3b/model_a" )
		#END it



		#------





		it "Tests the basic makeUrl method, model url is a function", ->
			collectionD = new CollectionD()

			expect( collectionD.makeUrl("GET") ).toBe( "/model_d" )
			expect( collectionD.makeUrl("POST") ).toBe( "/model_d" )
			expect( collectionD.makeUrl("PUT") ).toBe( "/model_d" )
			expect( collectionD.makeUrl("DELETE") ).toBe( "/model_d" )
		#END it

		it "Tests the basic makeUrl method, model url is a function, base API url", ->
			collectionD = new CollectionD()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_d" )
			expect( collectionD.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_d" )
			expect( collectionD.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_d" )
			expect( collectionD.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_d" )
		#END it

		it "Tests the basic makeUrl method, model url is a function, base API url ending with a '/'", ->
			collectionD = new CollectionD()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_d" )
			expect( collectionD.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_d" )
			expect( collectionD.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_d" )
			expect( collectionD.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_d" )
		#END it



		it "Tests the basic makeUrl method, model url is a function, with parent", ->
			collectionD = new CollectionD( new ModelB(id: '1b') )

			expect( collectionD.makeUrl("GET") ).toBe( "/model_b/1b/model_d" )
			expect( collectionD.makeUrl("POST") ).toBe( "/model_b/1b/model_d" )
			expect( collectionD.makeUrl("PUT") ).toBe( "/model_b/1b/model_d" )
			expect( collectionD.makeUrl("DELETE") ).toBe( "/model_b/1b/model_d" )
		#END it

		it "Tests the basic makeUrl method, model url is a function, with parent, base API url", ->
			collectionD = new CollectionD( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/2b/model_d" )
			expect( collectionD.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/2b/model_d" )
			expect( collectionD.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/2b/model_d" )
			expect( collectionD.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/2b/model_d" )
		#END it

		it "Tests the basic makeUrl method, model url is a function, with parent, base API url ending with a '/'", ->
			collectionD = new CollectionD( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/3b/model_d" )
			expect( collectionD.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/3b/model_d" )
			expect( collectionD.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/3b/model_d" )
			expect( collectionD.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/3b/model_d" )
		#END it



		#------





		it "Tests the basic makeUrl method, defined url string", ->
			collectionD2 = new CollectionD2()

			expect( collectionD2.makeUrl("GET") ).toBe( "/collection_d2" )
			expect( collectionD2.makeUrl("POST") ).toBe( "/collection_d2" )
			expect( collectionD2.makeUrl("PUT") ).toBe( "/collection_d2" )
			expect( collectionD2.makeUrl("DELETE") ).toBe( "/collection_d2" )
		#END it

		it "Tests the basic makeUrl method, defined url string, base API url", ->
			collectionD2 = new CollectionD2()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD2.makeUrl("GET") ).toBe( "http://www.falconjs.com/collection_d2" )
			expect( collectionD2.makeUrl("POST") ).toBe( "http://www.falconjs.com/collection_d2" )
			expect( collectionD2.makeUrl("PUT") ).toBe( "http://www.falconjs.com/collection_d2" )
			expect( collectionD2.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/collection_d2" )
		#END it

		it "Tests the basic makeUrl method, defined url string, base API url ending with a '/'", ->
			collectionD2 = new CollectionD2()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD2.makeUrl("GET") ).toBe( "http://www.falconjs.com/collection_d2" )
			expect( collectionD2.makeUrl("POST") ).toBe( "http://www.falconjs.com/collection_d2" )
			expect( collectionD2.makeUrl("PUT") ).toBe( "http://www.falconjs.com/collection_d2" )
			expect( collectionD2.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/collection_d2" )
		#END it



		it "Tests the basic makeUrl method, defined url string, with parent", ->
			collectionD2 = new CollectionD2( new ModelB(id: '1b') )

			expect( collectionD2.makeUrl("GET") ).toBe( "/model_b/1b/collection_d2" )
			expect( collectionD2.makeUrl("POST") ).toBe( "/model_b/1b/collection_d2" )
			expect( collectionD2.makeUrl("PUT") ).toBe( "/model_b/1b/collection_d2" )
			expect( collectionD2.makeUrl("DELETE") ).toBe( "/model_b/1b/collection_d2" )
		#END it

		it "Tests the basic makeUrl method, defined url string, with parent, base API url", ->
			collectionD2 = new CollectionD2( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD2.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d2" )
			expect( collectionD2.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d2" )
			expect( collectionD2.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d2" )
			expect( collectionD2.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d2" )
		#END it

		it "Tests the basic makeUrl method, defined url string, with parent, base API url ending with a '/'", ->
			collectionD2 = new CollectionD2( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD2.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d2" )
			expect( collectionD2.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d2" )
			expect( collectionD2.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d2" )
			expect( collectionD2.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d2" )
		#END it



		#------





		it "Tests the basic makeUrl method, defined url function", ->
			collectionD3 = new CollectionD3()

			expect( collectionD3.makeUrl("GET") ).toBe( "/collection_d3" )
			expect( collectionD3.makeUrl("POST") ).toBe( "/collection_d3" )
			expect( collectionD3.makeUrl("PUT") ).toBe( "/collection_d3" )
			expect( collectionD3.makeUrl("DELETE") ).toBe( "/collection_d3" )
		#END it

		it "Tests the basic makeUrl method, defined url function, base API url", ->
			collectionD3 = new CollectionD3()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD3.makeUrl("GET") ).toBe( "http://www.falconjs.com/collection_d3" )
			expect( collectionD3.makeUrl("POST") ).toBe( "http://www.falconjs.com/collection_d3" )
			expect( collectionD3.makeUrl("PUT") ).toBe( "http://www.falconjs.com/collection_d3" )
			expect( collectionD3.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/collection_d3" )
		#END it

		it "Tests the basic makeUrl method, defined url function, base API url ending with a '/'", ->
			collectionD3 = new CollectionD3()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD3.makeUrl("GET") ).toBe( "http://www.falconjs.com/collection_d3" )
			expect( collectionD3.makeUrl("POST") ).toBe( "http://www.falconjs.com/collection_d3" )
			expect( collectionD3.makeUrl("PUT") ).toBe( "http://www.falconjs.com/collection_d3" )
			expect( collectionD3.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/collection_d3" )
		#END it



		it "Tests the basic makeUrl method, defined url function, with parent", ->
			collectionD3 = new CollectionD3( new ModelB(id: '1b') )

			expect( collectionD3.makeUrl("GET") ).toBe( "/model_b/1b/collection_d3" )
			expect( collectionD3.makeUrl("POST") ).toBe( "/model_b/1b/collection_d3" )
			expect( collectionD3.makeUrl("PUT") ).toBe( "/model_b/1b/collection_d3" )
			expect( collectionD3.makeUrl("DELETE") ).toBe( "/model_b/1b/collection_d3" )
		#END it

		it "Tests the basic makeUrl method, defined url function, with parent, base API url", ->
			collectionD3 = new CollectionD3( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD3.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d3" )
			expect( collectionD3.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d3" )
			expect( collectionD3.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d3" )
			expect( collectionD3.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/2b/collection_d3" )
		#END it

		it "Tests the basic makeUrl method, defined url function, with parent, base API url ending with a '/'", ->
			collectionD3 = new CollectionD3( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD3.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d3" )
			expect( collectionD3.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d3" )
			expect( collectionD3.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d3" )
			expect( collectionD3.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/3b/collection_d3" )
		#END it

		it "Should be able to make a url with just a / baseApiUrl", ->
			class MyModel extends Falcon.Model
				url: 'my_models'
			#END MYModel

			class MyCollection extends Falcon.Collection
				model: MyModel
			#END MyCollection

			Falcon.baseApiUrl = "/"

			my_collection = new MyCollection
			expect( my_collection.makeUrl("GET") ).toBe( "/my_models" )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the sync() method
	#
	#--------------------------------------------------------------
	describe "Tesing collection sync methods", ->
		collectionA = null

		beforeEach ->
			collectionA = new CollectionA
		#END beforeEach

		describe "Testing 'fetch' alias", ->
			it "Should pass the correct options into sync on fetch", ->
				sync_stub = sinon.stub(collectionA, 'sync')

				collectionA.fetch({'hello': 'world'})

				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledOn( collectionA )
				expect( sync_stub ).toHaveBeenCalledWith 'GET', {'hello': 'world'}
			#END it
		#END describe

		describe "Testing sync method $.ajax calls", ->
			ajax_stub = null

			beforeEach ->
				ajax_stub = sinon.stub(jQuery, "ajax")
				Falcon.cache = false
			#END beforeEach

			afterEach ->
				ajax_stub.restore()
			#END afterEach

			it "Should fetch properly without options", ->
				collectionA.fetch()

				expect( ajax_stub ).toHaveBeenCalledOnce()
				expect( ajax_stub ).toHaveBeenCalledWithMatch {type: "GET"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {url: collectionA.makeUrl("GET")}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {data: ""}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {cache: false}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].success.length ).toBe( 3 )

				expect( ajax_stub.firstCall.args[0].error ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].error.length ).toBe( 1 )

				expect( ajax_stub.firstCall.args[0].complete ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].complete.length ).toBe( 2 )
			#END it

			it "Should fetch properly with options", ->
				Falcon.cache = true
				collectionA.fetch
					url: "http://www.falconjs.com"
					data: {"hello": "world"}
					contentType: "text/html"
					headers: {"User-Agent", "Chrome"}
					success: ( _success = -> )
					error: ( _error = -> )
					complete: ( _complete = -> )
				#END fetch

				expect( ajax_stub ).toHaveBeenCalledOnce()
				expect( ajax_stub ).toHaveBeenCalledWithMatch {type: "GET"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {url: "http://www.falconjs.com"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {data: JSON.stringify("hello": "world")}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {contentType: "text/html"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {cache: true}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {headers: {"User-Agent", "Chrome"}}
				
				expect( ajax_stub.firstCall.args[0].success ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].success.length ).toBe( 3 )
				expect( ajax_stub.firstCall.args[0].success ).not.toBe(_success)

				expect( ajax_stub.firstCall.args[0].error ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].error.length ).toBe( 1 )
				expect( ajax_stub.firstCall.args[0].error ).not.toBe(_error)

				expect( ajax_stub.firstCall.args[0].complete ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].complete.length ).toBe( 2 )
				expect( ajax_stub.firstCall.args[0].complete ).not.toBe(_complete)
			#END it
		#END describe

		describe "Testing sync method XHR responses", ->
			server = null
			collectionA = null

			parse_stub = null
			fill_stub = null

			fetch_spy = null
			create_spy = null
			save_spy = null
			destroy_spy = null

			success_spy = null
			error_spy = null
			complete_spy = null

			data = null
			error_data = null
			success_data = null

			options = null

			beforeEach ->
				server = sinon.fakeServer.create()

				collectionA = new CollectionA
				data = {'list': [{"foo": "bar", id: 1}, {"foo": "bar2", id: 2}] }
				error_data = {"error": "Something Wrong"}
				success_data = [{"foo": "bar", id: 1}, {"foo": "bar2", id: 2}]
				parse_stub = sinon.stub(collectionA, "parse").returns( success_data )
				fill_stub = sinon.stub(collectionA, "fill")

				collectionA.on "fetch", ( fetch_spy = sinon.spy() )

				options = {
					success: ( success_spy = sinon.spy() )
					error: ( error_spy = sinon.spy() )
					complete: ( complete_spy = sinon.spy() )
				}
			#END beforeEach

			afterEach ->
				server.restore()
			#END afterEach

			it "Should call the proper success method", ->
				collectionA.fetch( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).toBe( 1 )
				expect( parse_stub.firstCall.args[0] ).toEqual data

				expect( fill_stub.callCount ).toBe( 1 )
				expect( fill_stub.firstCall.args[0] ).toEqual success_data
				expect( fill_stub ).toHaveBeenCalledAfter( parse_stub )

				expect( fetch_spy ).toHaveBeenCalledOnce()
				expect( fetch_spy ).toHaveBeenCalledAfter( fill_stub )

				expect( success_spy.callCount ).toBe( 1 )
				expect( success_spy ).toHaveBeenCalledOn( collectionA )
				expect( success_spy.firstCall.args.length ).toBe( 4 )
				expect( success_spy.firstCall.args[0] ).toBe( collectionA )

				expect( error_spy ).not.toHaveBeenCalled()

				expect( complete_spy.callCount ).toBe( 1 )
				expect( complete_spy ).toHaveBeenCalledOn( collectionA )
				expect( complete_spy.firstCall.args.length ).toBe( 3 )
				expect( complete_spy.firstCall.args[0] ).toBe( collectionA )
				expect( complete_spy ).toHaveBeenCalledAfter( success_spy )
			#END it

			it "Should not fill when fill option is false on fetch", ->
				options.fill = false
				collectionA.fetch( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).toBe( 1 )
				expect( parse_stub.firstCall.args[0] ).toEqual data

				expect( fill_stub.callCount ).toBe( 0 )

				expect( fetch_spy ).toHaveBeenCalledOnce()
				expect( fetch_spy ).toHaveBeenCalledAfter( parse_stub )

				expect( success_spy.callCount ).toBe( 1 )
				expect( success_spy ).toHaveBeenCalledOn( collectionA )
				expect( success_spy.firstCall.args.length ).toBe( 4 )
				expect( success_spy.firstCall.args[0] ).toBe( collectionA )

				expect( error_spy ).not.toHaveBeenCalled()

				expect( complete_spy.callCount ).toBe( 1 )
				expect( complete_spy ).toHaveBeenCalledOn( collectionA )
				expect( complete_spy.firstCall.args.length ).toBe( 3 )
				expect( complete_spy.firstCall.args[0] ).toBe( collectionA )
				expect( complete_spy ).toHaveBeenCalledAfter( success_spy )
			#END it

			it "Should call the error response on an errornous result", ->
				collectionA.fetch( options )

				server.respondWith [ 400, {}, JSON.stringify(error_data) ]
				server.respond()

				expect( parse_stub.callCount ).toBe( 0 )
				expect( fill_stub.callCount ).toBe( 0 )

				expect( fetch_spy ).not.toHaveBeenCalled()

				expect( success_spy.callCount ).toBe( 0 )

				expect( error_spy.callCount ).toBe( 1 )
				expect( error_spy.firstCall.args.length ).toBe( 3 )
				expect( error_spy ).toHaveBeenCalledOn( collectionA )
				expect( complete_spy.firstCall.args[0] ).toBe( collectionA )

				expect( complete_spy.callCount ).toBe( 1 )
				expect( complete_spy ).toHaveBeenCalledOn( collectionA )
				expect( complete_spy.firstCall.args.length ).toBe( 3 )
				expect( complete_spy.firstCall.args[0] ).toBe( collectionA )
				expect( complete_spy ).toHaveBeenCalledAfter( error_spy )
			#END it
		#END describe

		describe "Testing sync method options in depth", ->
			ajax_stub = null

			beforeEach ->
				ajax_stub = sinon.stub(jQuery, "ajax")
				Falcon.cache = false
			#END beforeEach

			afterEach ->
				ajax_stub.restore()
			#END afterEach

			it "Should fetch properly without options", ->
				collectionA.sync('GET')

				expect( ajax_stub ).toHaveBeenCalledOnce()
				expect( ajax_stub ).toHaveBeenCalledWithMatch {type: "GET"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {url: collectionA.makeUrl("GET")}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {data: ""}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {cache: false}
				expect( ajax_stub ).toHaveBeenCalledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].success.length ).toBe( 3 )

				expect( ajax_stub.firstCall.args[0].error ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].error.length ).toBe( 1 )

				expect( ajax_stub.firstCall.args[0].complete ).toEqual( jasmine.any(Function) )
				expect( ajax_stub.firstCall.args[0].complete.length ).toBe( 2 )
			#END it

			it "Should allow for a specified parent to override", ->
				collectionA.parent = new ModelB(id: 'b')
				collectionA.sync 'GET',
					parent: (model_b = new ModelB(id: 'b2'))
				#END sync

				expect( ajax_stub ).toHaveBeenCalledWithMatch {url: collectionA.makeUrl("GET", model_b)}
			#END it

			it "Should allow for a specified parent to override", ->
				collectionA.parent = new ModelB(id: 'b')
				collectionA.sync 'GET',
					parent: null
				#END sync

				expect( ajax_stub ).toHaveBeenCalledWithMatch {url: collectionA.makeUrl("GET", null)}
			#END it
		#END describe

		describe "Additional miscellaneous sync tests", ->
			server = null

			beforeEach ->
				server = sinon.fakeServer.create()
				Falcon.cache = false
			#END beforeEach

			afterEach ->
				server.restore()
			#END afterEach

			it "Should allow for a third parameter to define the context", ->
				collectionB = new CollectionB
				collectionA = new CollectionA
				collectionA.sync("GET", ( success_spy = sinon.spy() ), collectionB)

				server.respondWith [ 200, {}, JSON.stringify(collectionA.serialize()) ]
				server.respond()

				expect( success_spy ).toHaveBeenCalled
				expect( success_spy ).toHaveBeenCalledOn( collectionB )
			#END it

			it "Should pass context from fetch to sync", ->
				collectionB = new CollectionB
				collectionA = new CollectionA

				sync_stub = sinon.stub( collectionA, "sync" )
				collectionA.fetch( ( success_spy = sinon.spy() ), collectionB )

				expect( sync_stub ).toHaveBeenCalled
				expect( sync_stub.firstCall.args[1] ).toBe( success_spy )
				expect( sync_stub.firstCall.args[2] ).toBe( collectionB )
			#END it
		#END describe
	#END describe


	#--------------------------------------------------------------
	#
	# Test the remove() method
	#
	#--------------------------------------------------------------
	describe "Testing the remove method", ->
		collectionA = null
		models = null
		model_a1 = null
		model_a2 = null
		model_a3 = null
		model_a4 = null

		beforeEach ->
			models = [
				model_a1 = new ModelA(id: 1)
				model_a2 = new ModelA(id: 2)
				model_a3 = new ModelA(id: 3)
				model_a4 = new ModelA(id: 4)
			]

			collectionA = new CollectionA( models )
		#END beforeEach

		it "Should be able to remove a single item", ->
			expect( collectionA.length() ).toBe( 4 )

			collectionA.remove( model_a2 )

			expect( collectionA.length() ).toBe( 3 )
			expect( collectionA.at(0) ).toBe( model_a1 )
			expect( collectionA.at(1) ).toBe( model_a3 )
			expect( collectionA.at(2) ).toBe( model_a4 )
		#END it

		it "Should be able to remove multiple items", ->
			expect( collectionA.length() ).toBe( 4 )

			collectionA.remove( [model_a2, model_a3] )

			expect( collectionA.length() ).toBe( 2 )
			expect( collectionA.at(0) ).toBe( model_a1 )
			expect( collectionA.at(1) ).toBe( model_a4 )
		#END it

		it "Should be able to remove items with a function", ->
			expect( collectionA.length() ).toBe( 4 )

			collectionA.remove (model) ->
				return model.get('id') % 2 is 0
			#END remove

			expect( collectionA.length() ).toBe( 2 )
			expect( collectionA.at(0) ).toBe( model_a1 )
			expect( collectionA.at(1) ).toBe( model_a3 )
		#END it

		it "Should be able to remove a different model but with the same id", ->
			expect( collectionA.length() ).toBe( 4 )

			collectionA.remove( new ModelA(id: 3) )
			expect( collectionA.at(0) ).toBe( model_a1 )
			expect( collectionA.at(1) ).toBe( model_a2 )
			expect( collectionA.at(2) ).toBe( model_a4 )
			#END remove
		#END it

		it "Should be able to remove models who don't have an id, properly", ->
			collectionA = new CollectionA()
			collectionA.append([
				{'text': '1'}
				{'text': '2'}
				{'text': '3'}
			])

			expect( collectionA.length() ).toBe( 3 )

			model_a1 = collectionA.first()
			collectionA.remove( model_a1 )

			expect( collectionA.length() ).toBe( 2 )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the append() and prepend() methods
	#
	#--------------------------------------------------------------
	describe "Test the append and prepend methods", ->
		collectionA = null
		fill_stub = null

		beforeEach ->
			collectionA = new CollectionA

			fill_stub = sinon.stub( collectionA, "fill" )
		#END beforeEach

		afterEach ->
			fill_stub.restore()
		#END afterEach

		it "Should call the proper fill method when appending", ->
			collectionA.append(input = {'hello': 'world'})

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub ).toHaveBeenCalledWith( input, jasmine.objectContaining({'method': 'append'}) )
		#END it

		it "Should call the proper fill method when prepending", ->
			collectionA.prepend(input = {'hello': 'world'})

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub ).toHaveBeenCalledWith( input, jasmine.objectContaining({'method': 'prepend'}) )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the insert() method
	#
	#--------------------------------------------------------------
	describe "Test the insert method", ->
		collectionA = null
		fill_stub = null

		beforeEach ->
			collectionA = new CollectionA [
				{id: 1, 'hello': 'foo'}
				{id: 4, 'hello': 'bar'}
			]

			fill_stub = sinon.stub( collectionA, "fill" )
		#END beforeEach

		it "Should call the proper fill method when inserting without a specific model", ->
			collectionA.insert(input = {'hello': 'world'})

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub ).toHaveBeenCalledWith( input, jasmine.objectContaining({'method': 'append'}) )
		#END it

		it "Should call the proper fill method when inserting with a valid model", ->
			collectionA.insert(input = {'hello': 'world'}, 4) #4 is the model id

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub ).toHaveBeenCalledWith( input, jasmine.objectContaining({'method': 'insert', 'insert_index': 1}) )
		#END it

		it "Should call the proper fill method when appending with an invalid model", ->
			collectionA.insert(input = {'hello': 'world'}, 33)

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub ).toHaveBeenCalledWith( input, jasmine.objectContaining({'method': 'insert', 'insert_index': -1}) )
		#END it

		it "Should call the proper fill method when inserting with an iterator", ->
			collectionA.insert(input = {'hello': 'world'}, ( (m) -> m.get('id') is 1 ) )

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub ).toHaveBeenCalledWith( input, jasmine.objectContaining({'method': 'insert', 'insert_index': 0}) )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the unshift() and push() methods
	#
	#--------------------------------------------------------------
	describe "Test the unshift and push methods", ->
		collectionA = null
		prepend_stub = append_stub = null

		beforeEach ->
			collectionA = new CollectionA([{id: 1}, {id: 2}])

			append_stub = sinon.stub(collectionA, 'append')
			prepend_stub = sinon.stub(collectionA, 'prepend')
		#END beforeEach

		afterEach ->
			append_stub.restore()
			prepend_stub.restore()
		#END afterEach

		it "Should have unshift be an alias of prepend", ->
			expect( collectionA.length() ).toBe( 2 )

			collectionA.unshift({id: 3})

			expect( append_stub ).not.toHaveBeenCalled()
			expect( prepend_stub ).toHaveBeenCalledOnce()
			expect( prepend_stub ).toHaveBeenCalledWith( jasmine.objectContaining({id: 3}) )
		#END it

		it "Should have push be an alias of append", ->
			expect( collectionA.length() ).toBe( 2 )

			collectionA.push({id: 3})

			expect( prepend_stub ).not.toHaveBeenCalled()
			expect( append_stub ).toHaveBeenCalledOnce()
			expect( append_stub ).toHaveBeenCalledWith( jasmine.objectContaining({id: 3}) )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the shift() and pop() methods
	#
	#--------------------------------------------------------------
	describe "Test the shift and pop methods", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_a3 = new ModelA(id: 3)
			collectionA = new CollectionA([model_a1, model_a2, model_a3])
		#END beforeEach

		it "Should shift the first element off the front", ->
			elm = collectionA.shift()

			expect( elm ).toBe( model_a1 )
			expect( collectionA.length() ).toBe( 2 )
		#END it

		it "Should shift the first element off the front", ->
			elm = collectionA.pop()

			expect( elm ).toBe( model_a3 )
			expect( collectionA.length() ).toBe( 2 )
		#END it
	#END decribe


	#--------------------------------------------------------------
	#
	# Test the sort() method
	#
	#--------------------------------------------------------------
	describe "Test the sort method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		it "Should sort properly", ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_a3 = new ModelA(id: 3)
			collectionA = new CollectionA([model_a2, model_a1, model_a3])

			expect( collectionA.models() ).toEqual([ model_a2, model_a1, model_a3 ])

			collectionA.sort (a, b) ->
				a_id = a.get("id")
				b_id = b.get("id")

				return 1 if a_id > b_id
				return -1 if a_id < b_id
				return 0
			#END sort

			expect( collectionA.models() ).toEqual([ model_a1, model_a2, model_a3 ])
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the create() method
	#
	#--------------------------------------------------------------
	describe "Test the create method", ->
		collectionA = null
		modelB = null
		modelA = null
		options = null
		server = null
		data = null
		success_spy = null

		beforeEach ->
			server = sinon.fakeServer.create()
			data = {id: 2}
			modelB = new ModelB(id: 'b')
			collectionA = new CollectionA([{id: 1}], modelB)
			modelA = new ModelA(data, collectionA.parent)

			options =
				success: ( success_spy = sinon.spy() )
			#END options
		#END beforeEach

		afterEach ->
			server.restore()
		#END afterEach

		it "Should attempt to initialize and create a new model", ->
			collectionB = new CollectionB
			initialize_stub = sinon.stub( ModelA::, "initialize")
			create_stub = sinon.stub( ModelA::, "create")

			expect( initialize_stub ).not.toHaveBeenCalled()
			expect( create_stub ).not.toHaveBeenCalled()

			collectionA.create(data = {id: 2}, options, collectionB)

			expect( initialize_stub ).toHaveBeenCalledOnce()
			expect( initialize_stub ).toHaveBeenCalledWith( data )

			expect( create_stub ).toHaveBeenCalledOnce()
			expect( create_stub ).toHaveBeenCalledAfter( initialize_stub )
			expect( create_stub.firstCall.args.length ).toBe( 2 )
			expect( create_stub.firstCall.args[0] ).toBe( options )
			expect( create_stub.firstCall.args[0].success ).toEqual( jasmine.any(Function) )
			expect( create_stub.firstCall.args[0].method ).toBe( 'append' )
			expect( create_stub.firstCall.args[1] ).toBe( collectionB )

			initialize_stub.restore()
			create_stub.restore()
		#END it

		it "Should respond correctly from the server", ->
			fill_stub = sinon.stub(collectionA, "fill").returns([])
			collectionA.create(data, options)

			expect( collectionA.length() ).toBe( 1 )

			server.respondWith [ 200, {}, JSON.stringify(data) ]
			server.respond()

			expect( fill_stub ).toHaveBeenCalledOnce()
			expect( fill_stub.firstCall.args.length ).toBe( 2 )
			expect( fill_stub.firstCall.args[0] ).toEqual( jasmine.any(Falcon.Model) )
			expect( fill_stub.firstCall.args[1] ).toBe( options )

			new_model = fill_stub.firstCall.args[0]

			expect( success_spy.callCount ).toBe( 1 )
			expect( success_spy ).toHaveBeenCalledAfter( fill_stub )
			expect( success_spy ).toHaveBeenCalledOn( new_model )
			expect( success_spy.firstCall.args[0] ).toBe( new_model )

			fill_stub.restore()
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the destroy() method
	#
	#--------------------------------------------------------------
	describe "Test the detroy method", ->
		collectionA = collectionB = null
		model_a1 = model_a2 = null
		options = null
		success_spy = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			collectionA = new CollectionA([model_a1, model_a2])
			collectionB = new CollectionB

			options =
				success: ( success_spy = sinon.spy() )
			#END options
		#END beforeEach

		it "Should call the destroy method on the model", ->
			destroy_stub = sinon.stub( model_a1, "destroy" )

			expect( destroy_stub ).not.toHaveBeenCalled()

			collectionA.destroy( model_a1, options, collectionB )

			expect( destroy_stub ).toHaveBeenCalledOnce()
			expect( destroy_stub ).toHaveBeenCalledWith options, collectionB

			destroy_stub.restore()
		#END it

		it "Should respond correctly from the server", ->
			server = sinon.fakeServer.create()

			remove_stub = sinon.stub(collectionA, "remove")
			collectionA.destroy(model_a1, options)

			server.respondWith [ 200, {}, JSON.stringify({}) ]
			server.respond()

			expect( remove_stub ).toHaveBeenCalledOnce()
			expect( remove_stub.firstCall.args.length ).toBe( 1 )
			expect( remove_stub.firstCall.args[0] ).toEqual( jasmine.any(Falcon.Model) )

			removed_model = remove_stub.firstCall.args[0]

			expect( success_spy.callCount ).toBe( 1 )
			expect( success_spy ).toHaveBeenCalledAfter( remove_stub )
			expect( success_spy ).toHaveBeenCalledOn( removed_model )
			expect( success_spy.firstCall.args[0] ).toBe( removed_model )

			remove_stub.restore()
			server.restore()
		#END it

		it "Should destroy using the overriden parent", ->
			model_b = new ModelB(id: 'b')
			collectionA2 = new CollectionA([model_a1, model_a2], model_b)
			server = sinon.fakeServer.create()

			ajax_spy = sinon.spy($, "ajax")
			collectionA2.destroy(model_a1, {parent: null})

			server.respondWith [ 200, {}, JSON.stringify({}) ]
			server.respond()

			ajax_spy.restore()
			server.restore()

			expect( ajax_spy ).toHaveBeenCalled
			expect( ajax_spy.callCount ).toBe( 1 )
			ajax_args = ajax_spy.firstCall.args[0]
			expect( ajax_args['type'] ).toBe(( "DELETE" ) )
			expect( ajax_args['url'] ).toBe(( model_a1.makeUrl("DELETE", null) ) )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the at() method
	#
	#--------------------------------------------------------------
	describe "Test the at() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_a3 = new ModelA(id: 3)

			collectionA = new CollectionA([model_a1, model_a2, model_a3])
		#END beforeEach

		it "Should be able to find the correct element at an index", ->
			expect( collectionA.at(0) ).toBe( model_a1 )
			expect( collectionA.at(1) ).toBe( model_a2 )
			expect( collectionA.at(2) ).toBe( model_a3 )
		#END it

		it "Should return null for invalid indices", ->
			expect( collectionA.at(-1) ).toBe( null )
			expect( collectionA.at(3) ).toBe( null )
			expect( collectionA.at("HELLO") ).toBe( null )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the indexOf() method
	#
	#--------------------------------------------------------------
	describe "Test the indexOf() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = model_a4 = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 3)
			model_a3 = new ModelA(id: 5)
			model_a4 = new ModelA(id: 8)

			collectionA = new CollectionA([model_a1, model_a2, model_a3, model_a4, model_a3])
		#END beforeEach

		it "Should find the correct index by model", ->
			expect( collectionA.indexOf( model_a3 ) ).toBe( 2 )
		#END it

		it "Should find no match index by model", ->
			expect( collectionA.indexOf( new ModelA ) ).toBe( -1 )
		#END it

		it "Should find the correct match index by id", ->
			expect( collectionA.indexOf( 3 ) ).toBe( 1 )
		#END it

		it "Should find the correct match index by truth test method", ->
			index = collectionA.indexOf (model) -> model.get('id') > 4
			expect( index ).toBe( 2 )
		#END it

		it "Should find the no match index by truth test method", ->
			index = collectionA.indexOf (model) -> model.get('id') > 8
			expect( index ).toBe( -1 )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the lastIndexOf() method
	#
	#--------------------------------------------------------------
	describe "Test the lastIndexOf() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = model_a4 = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 3)
			model_a3 = new ModelA(id: 5)
			model_a4 = new ModelA(id: 8)

			collectionA = new CollectionA([model_a1, model_a2, model_a3, model_a4, model_a2, model_a3])
		#END beforeEach

		it "Should find the correct index by model", ->
			expect( collectionA.lastIndexOf( model_a3 ) ).toBe( 5 )
		#END it

		it "Should find no match index by model", ->
			expect( collectionA.lastIndexOf( new ModelA ) ).toBe( -1 )
		#END it

		it "Should find the correct match index by id", ->
			expect( collectionA.lastIndexOf( 3 ) ).toBe( 4 )
		#END it

		it "Should find the correct match index by truth test method", ->
			index = collectionA.lastIndexOf (model) -> model.get('id') > 4
			expect( index ).toBe( 5 )
		#END it

		it "Should find the no match index by truth test method", ->
			index = collectionA.lastIndexOf (model) -> model.get('id') > 8
			expect( index ).toBe( -1 )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the each() method
	#
	#--------------------------------------------------------------
	describe "Test the each() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_a3 = new ModelA(id: 3)

			collectionA = new CollectionA()
			collectionA.fill( [model_a1, model_a2, model_a3] )
		#END beforeEach

		it "Should call the iterator with one argument", ->
			spy = sinon.spy()
			collectionA.each (item) -> spy.call(@, item)

			expect( spy.callCount ).toBe( 3 )
			expect( spy.firstCall ).toHaveBeenCalledWith( model_a1 )
			expect( spy.secondCall ).toHaveBeenCalledWith( model_a2 )
			expect( spy.thirdCall ).toHaveBeenCalledWith( model_a3 )
			expect( spy ).toHaveBeenAlwaysCalledOn( collectionA )
		#END it

		it "Should call the iterator with two arguments", ->
			spy = sinon.spy()
			collectionA.each (index, item) -> spy.call(@, index, item)

			expect( spy.callCount ).toBe( 3 )
			expect( spy.firstCall ).toHaveBeenCalledWith( 0, model_a1 )
			expect( spy.secondCall ).toHaveBeenCalledWith( 1, model_a2 )
			expect( spy.thirdCall ).toHaveBeenCalledWith( 2, model_a3 )
			expect( spy ).toHaveBeenAlwaysCalledOn( collectionA )
		#END it

		it "Should call the iterator with a specific context and one argument", ->
			spy = sinon.spy()
			context = {}
			iterator = (item) -> spy.call(@, item)
			collectionA.each( iterator, context )

			expect( spy.callCount ).toBe( 3 )
			expect( spy.firstCall ).toHaveBeenCalledWith( model_a1 )
			expect( spy.secondCall ).toHaveBeenCalledWith( model_a2 )
			expect( spy.thirdCall ).toHaveBeenCalledWith( model_a3 )
			expect( spy ).toHaveBeenAlwaysCalledOn( context )
		#END it

		it "Should call the iterator with a specific context and two arguments", ->
			spy = sinon.spy()
			context = {}
			iterator = (index, item) -> spy.call(@, index, item)
			collectionA.each( iterator, context )

			expect( spy.callCount ).toBe( 3 )
			expect( spy.firstCall ).toHaveBeenCalledWith( 0, model_a1 )
			expect( spy.secondCall ).toHaveBeenCalledWith( 1, model_a2 )
			expect( spy.thirdCall ).toHaveBeenCalledWith( 2, model_a3 )
			expect( spy ).toHaveBeenAlwaysCalledOn( context )
		#END it
	#END decribe


	#--------------------------------------------------------------
	#
	# Test the first() method
	#
	#--------------------------------------------------------------
	describe "Test the first() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = model_ab = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_ab = new ModelA(id: 'b')
			model_a3 = new ModelA(id: 3)

			collectionA = new CollectionA([model_a1, model_a2, model_ab, model_a3])
		#END beforeEach

		it "Should get the first element", ->
			first = collectionA.first()
			expect( first ).toBe(( model_a1 ) )
		#END it

		it "Should get the first matcing mdel based on function iterator", ->
			first = collectionA.first (model) ->
				return model is model_a2
			#END first
			expect( first ).toBe(( model_a2 ) )
		#END it

		it "Should get the first matching model based on a model", ->
			first = collectionA.first( model_ab )
			expect( first ).toBe(( model_ab ) )
		#END it

		it "Should get the first matching model based on an id", ->
			first = collectionA.first( 2 )
			expect( first ).toBe(( model_a2 ) )

			first = collectionA.first( 'b' )
			expect( first ).toBe(( model_ab ) )
		#END it

		it "Should return the null if nothing passes the iterator", ->
			first = collectionA.first (model) -> false
			expect( first ).toBe(( null ) )
		#END
	#END describe


	#--------------------------------------------------------------
	#
	# Test the last() method
	#
	#--------------------------------------------------------------
	describe "Test the last() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = model_ab = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_ab = new ModelA(id: 'b')
			model_a3 = new ModelA(id: 3)

			collectionA = new CollectionA([model_a1, model_a2, model_ab, model_a3])
		#END beforeEach

		it "Should get the last element", ->
			last = collectionA.last()
			expect( last ).toBe(( model_a3 ) )
		#END it

		it "Should get the last matcing mdel based on function iterator", ->
			last = collectionA.last (model) ->
				return model is model_a2
			#END last
			expect( last ).toBe(( model_a2 ) )
		#END it

		it "Should get the last matching model based on a model", ->
			last = collectionA.last( model_ab )
			expect( last ).toBe(( model_ab ) )
		#END it

		it "Should get the last matching model based on an id", ->
			last = collectionA.last( 2 )
			expect( last ).toBe(( model_a2 ) )

			last = collectionA.last( 'b' )
			expect( last ).toBe(( model_ab ) )
		#END it

		it "Should return the null if nothing passes the iterator", ->
			last = collectionA.last (model) -> false
			expect( last ).toBe(( null ) )
		#END
	#END describe


	#--------------------------------------------------------------
	#
	# Test the filter() method
	#
	#--------------------------------------------------------------
	describe "Test the filter() method", ->
		model_a1 = new ModelA(id: 1)
		model_a2 = new ModelA(id: 2)
		model_ab = new ModelA(id: 'b')
		model_ab2 = new ModelA(id: 'b')
		model_a3 = new ModelA(id: 3)

		models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3]

		collectionA = new CollectionA(models)

		it "Should return the all of the models", ->
			all = collectionA.filter()
			expect( all.length ).toBe( 6 )
			expect( all ).toEqual models
		#END it

		it "Should return a limited set of models by function", ->
			all = collectionA.filter (model) -> return model in [model_a1, model_ab]
			expect( all.length ).toBe( 3 )
			expect( all ).toEqual([model_a1, model_ab, model_ab])
		#END it

		it "Should return a limited set of models by model", ->
			all = collectionA.filter( model_a2 )
			expect( all.length ).toBe( 1 )
			expect( all ).toEqual([model_a2])
		#END it

		it "Should return a limited set of models by id", ->
			all = collectionA.filter( 3 )
			expect( all.length ).toBe( 1 )
			expect( all ).toEqual([model_a3 ])

			all = collectionA.filter( 'b' )
			expect( all.length ).toBe( 3 )
			expect( all ).toEqual([model_ab, model_ab, model_ab2])
		#END it

		it "Should return an empty set of models", ->
			all = collectionA.filter (model) -> return false
			expect( all.length ).toBe( 0 )
			expect( all ).toEqual([])
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the all() method
	#
	#--------------------------------------------------------------
	describe "Test the all() method", ->
		model_a1 = new ModelA(id: 1)
		model_a2 = new ModelA(id: 2)

		models = [model_a1, model_a2]

		collectionA = new CollectionA(models)

		it "Should return all of the models", ->
			all = collectionA.all()
			expect( all.length ).toBe( 2 )
			expect( all ).toEqual models
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the any() method
	#
	#--------------------------------------------------------------
	describe "Test the any() method", ->
		model_a1 = new ModelA(id: 1)
		model_a2 = new ModelA(id: 2)
		model_ab = new ModelA(id: 'b')
		model_ab2 = new ModelA(id: 'b')
		model_a3 = new ModelA(id: 3)
		model_a4 = new ModelA(id: 4)

		models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3]

		collectionA = new CollectionA(models)

		it "Should match true based on function", ->
			any = collectionA.any (model) -> return model in [model_a1, model_ab]
			expect( any ).toBe( true )

			any = collectionA.any (model) -> return model is model_a4
			expect( any ).toBe( false )
		#END it

		it "Should match true based on model", ->
			any = collectionA.any( model_a2 )
			expect( any ).toBe( true )

			any = collectionA.any( model_a4 )
			expect( any ).toBe( false )
		#END it

		it "Should match correctly based on id", ->
			any = collectionA.any( 3 )
			expect( any ).toBe( true )

			any = collectionA.any( 'b' )
			expect( any ).toBe( true )

			any = collectionA.any( 4 )
			expect( any ).toBe( false )

			any = collectionA.any( 'c' )
			expect( any ).toBe( false )
		#END it

		it "Should not match true based on empty iterator", ->
			any = collectionA.any()
			expect( any ).toBe( false )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the without() method
	#
	#--------------------------------------------------------------
	describe "Test the without() method", ->
		model_a1 = new ModelA(id: 1)
		model_a2 = new ModelA(id: 2)
		model_ab = new ModelA(id: 'b')
		model_ab2 = new ModelA(id: 'b')
		model_a3 = new ModelA(id: 3)

		models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3]

		collectionA = new CollectionA(models)

		it "Should return the full set of the models when called without an iterator", ->
			without = collectionA.without()
			expect( without.length ).toBe( 6 )
			expect( without ).toEqual models
		#END it

		it "Should return a limited set of models by function", ->
			without = collectionA.without (model) -> return model in [model_a1, model_ab]
			expect( without.length ).toBe( 3 )
			expect( without ).toEqual([model_a2, model_ab2, model_a3])
		#END it

		it "Should return a limited set of models by model", ->
			without = collectionA.without( model_a2 )
			expect( without.length ).toBe( 5 )
			expect( without ).toEqual([model_a1, model_ab, model_ab, model_ab2, model_a3])
		#END it

		it "Should return a limited set of models by id", ->
			without = collectionA.without( 3 )
			expect( without.length ).toBe( 5 )
			expect( without ).toEqual([model_a1, model_a2, model_ab, model_ab, model_ab2])

			without = collectionA.without( 'b' )
			expect( without.length ).toBe( 3 )
			expect( without ).toEqual([model_a1, model_a2, model_a3])
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the pluck() method
	#
	#--------------------------------------------------------------
	describe "Test the without() method", ->
		model_e1 = new ModelE({'title': 'e1'})
		model_e2 = new ModelE({'title': 'e2'})
		model_e3 = new ModelE({'title': 'e3'})

		models = [model_e1, model_e2, model_e3]

		collectionE = new CollectionE(models)

		it "Should pluck the title and unwrap the observables", ->
			pluck = collectionE.pluck("title")
			expect(pluck.length).toBe( 3 )
			expect(pluck).toEqual(['e1', 'e2', 'e3'])
		#END it

		it "Should pluck the title and shouldn't unwrap the observables", ->
			pluck = collectionE.pluck("title", false)
			expect(pluck.length).toBe( 3 )
			expect(pluck).not.toEqual(['e1', 'e2', 'e3'])
		#END it

		it "Should pluck the an invalid attribute", ->
			pluck = collectionE.pluck("title2")
			expect(pluck.length).toBe( 3 )
			expect(pluck).toEqual([undefined, undefined, undefined])
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the slice() method
	#
	#--------------------------------------------------------------
	describe "Test the slice() method", ->
		model_e1 = new ModelE({'title': 'e1'})
		model_e2 = new ModelE({'title': 'e2'})
		model_e3 = new ModelE({'title': 'e3'})

		models = [model_e1, model_e2, model_e3]

		collectionE = new CollectionE(models)

		it "Should slice properly", ->
			expect( collectionE.slice(0, 3) ).toEqual models
			expect( collectionE.slice(0, 1) ).toEqual([model_e1])
			expect( collectionE.slice(1, 3) ).toEqual([model_e2, model_e3])
			expect( collectionE.slice(-1) ).toEqual([model_e3])
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the mixin() method
	#
	#--------------------------------------------------------------
	describe "Testing the mixin() method", ->
		it "Should implement mixins properly", ->
			modelB = new ModelB
			modelA = new ModelA
			modelA.bees = new CollectionB([modelB])
			collectionA = new CollectionA([modelA])

			expect( modelA.hello ).not.toBeDefined()
			expect( modelA.foo ).not.toBeDefined()
			expect( modelB.test ).not.toBeDefined()

			collectionA.mixin {
				"hello": ( mixin_spy = sinon.spy() )
				"foo": ko.observable( "bar" )
				"bees": {
					"test": "123"
				}
			}

			expect( modelA.hello ).toEqual( jasmine.any(Function) )
			expect( ko.isObservable( modelA.foo ) ).toBe( true )
			expect( modelA.foo() ).toBe( 'bar' )
			expect( modelB.test ).toBe( '123' )

			modelA.hello('world')
			expect( mixin_spy ).toHaveBeenCalledOnce()
			expect( mixin_spy ).toHaveBeenCalledOn( modelA )
			expect( mixin_spy.firstCall.args[0] ).toBe( modelA )
			expect( mixin_spy.firstCall.args[1] ).toBe( collectionA )
			expect( mixin_spy.firstCall.args[2] ).toBe( 'world' )
		#END it

		it "Should allow for models with values to be added post mixin", ->
			class TheModel extends Falcon.Model
				defaults:
					"hello": "world"
				#END defaults
			#END TheModel

			class TheCollection extends Falcon.Collection
				model: TheModel
			#END theCollection

			theCollection = new TheCollection()

			theCollection.mixin
				"hello": ko.observable()
			#END mixin

			theModel = new TheModel

			expect( theModel.get("hello") ).toBe( "world" )

			theCollection.append( theModel )
			
			expect( theModel.get("hello") ).toBe( "world" )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the clone() method
	#
	#--------------------------------------------------------------
	describe "Test the clone() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		beforeEach ->
			model_a1 = new ModelA({id: 1, 'title': 'Hello World', 'extra': 'things'})
			model_a2 = new ModelA({id: 2, 'title': 'Foo Bar', 'extra': 'things2'})

			collectionA = new CollectionA([model_a1, model_a2], new ModelB)
		#END beforeEach

		it "Should do a basic clone properly", ->
			clone = collectionA.clone()

			expect( clone ).not.toBe(collectionA)
			expect( clone.parent ).toBe( collectionA.parent )
			expect( clone.length() ).toBe( 2 )
			expect( clone.at(0) ).not.toBe( model_a1 )
			expect( clone.at(0).get('id') ).toBe( 1 )
			expect( clone.at(0).get('title') ).toBe( "Hello World" )
			expect( clone.at(0).get('extra') ).toBe( "things" )
			expect( clone.at(1) ).not.toBe( model_a2 )
			expect( clone.at(1).get('id') ).toBe( 2 )
			expect( clone.at(1).get('title') ).toBe( "Foo Bar" )
			expect( clone.at(1).get('extra') ).toBe( "things2" )
		#END it

		it "Should do a basic clone properly with extra fields", ->
			clone = collectionA.clone(["id", "title"])

			expect( clone ).not.toBe(collectionA)
			expect( clone.parent ).toBe( collectionA.parent )
			expect( clone.length() ).toBe( 2 )
			expect( clone.at(0) ).not.toBe( model_a1 )
			expect( clone.at(0).get('id') ).toBe( 1 )
			expect( clone.at(0).get('title') ).toBe( "Hello World" )
			expect( clone.at(0).get('extra') ).not.toBeDefined()
			expect( clone.at(1) ).not.toBe( model_a2 )
			expect( clone.at(1).get('id') ).toBe( 2 )
			expect( clone.at(1).get('title') ).toBe( "Foo Bar" )
			expect( clone.at(1).get('extra') ).not.toBeDefined()
		#END it

		it "Should do a basic clone properly without a parent", ->
			clone = collectionA.clone(null)

			expect( clone ).not.toBe(collectionA)
			expect( clone.parent ).toBe( null )
			expect( clone.length() ).toBe( 2 )
			expect( clone.at(0) ).not.toBe( model_a1 )
			expect( clone.at(0).get('id') ).toBe( 1 )
			expect( clone.at(0).get('title') ).toBe( "Hello World" )
			expect( clone.at(0).get('extra') ).toBe( "things" )
			expect( clone.at(1) ).not.toBe( model_a2 )
			expect( clone.at(1).get('id') ).toBe( 2 )
			expect( clone.at(1).get('title') ).toBe( "Foo Bar" )
			expect( clone.at(1).get('extra') ).toBe( "things2" )
		#END it

		it "Should do a basic clone properly with extra fields without a parent", ->
			clone = collectionA.clone(["id", "title"], null)

			expect( clone ).not.toBe(collectionA)
			expect( clone.parent ).toBe( null )
			expect( clone.length() ).toBe( 2 )
			expect( clone.at(0) ).not.toBe( model_a1 )
			expect( clone.at(0).get('id') ).toBe( 1 )
			expect( clone.at(0).get('title') ).toBe( "Hello World" )
			expect( clone.at(0).get('extra') ).not.toBeDefined()
			expect( clone.at(1) ).not.toBe( model_a2 )
			expect( clone.at(1).get('id') ).toBe( 2 )
			expect( clone.at(1).get('title') ).toBe( "Foo Bar" )
			expect( clone.at(1).get('extra') ).not.toBeDefined()
		#END it

		it "Should do a basic clone properly with a new parent", ->
			clone = collectionA.clone( parent = new ModelC )

			expect( clone ).not.toBe(collectionA)
			expect( clone.parent ).toBe( parent )
			expect( clone.length() ).toBe( 2 )
			expect( clone.at(0) ).not.toBe( model_a1 )
			expect( clone.at(0).get('id') ).toBe( 1 )
			expect( clone.at(0).get('title') ).toBe( "Hello World" )
			expect( clone.at(0).get('extra') ).toBe( "things" )
			expect( clone.at(1) ).not.toBe( model_a2 )
			expect( clone.at(1).get('id') ).toBe( 2 )
			expect( clone.at(1).get('title') ).toBe( "Foo Bar" )
			expect( clone.at(1).get('extra') ).toBe( "things2" )
		#END it

		it "Should do a basic clone properly with extra fields without a parent", ->
			clone = collectionA.clone(["id", "title"],  parent = new ModelC )

			expect( clone ).not.toBe(collectionA)
			expect( clone.parent ).toBe( parent )
			expect( clone.length() ).toBe( 2 )
			expect( clone.at(0) ).not.toBe( model_a1 )
			expect( clone.at(0).get('id') ).toBe( 1 )
			expect( clone.at(0).get('title') ).toBe( "Hello World" )
			expect( clone.at(0).get('extra') ).not.toBeDefined()
			expect( clone.at(1) ).not.toBe( model_a2 )
			expect( clone.at(1).get('id') ).toBe( 2 )
			expect( clone.at(1).get('title') ).toBe( "Foo Bar" )
			expect( clone.at(1).get('extra') ).not.toBeDefined()
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the reset() method
	#
	#--------------------------------------------------------------
	describe "Test the reset() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null
		models = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_a3 = new ModelA(id: 3)
			models = [model_a1, model_a2, model_a3]

			collectionA = new CollectionA(models, new ModelB)
		#END beforeEach

		it "Should reset properly", ->
			expect( collectionA.length() ).toBe( 3 )
			expect( collectionA.models() ).toEqual models

			collectionA.reset()

			expect( collectionA.length() ).toBe( 0 )
			expect( collectionA.models() ).toEqual([])
		#END it
	#END describe

	#--------------------------------------------------------------
	#
	# Test the chain() method
	#
	#--------------------------------------------------------------
	describe "Test the chain() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3  = model_a4 = model_a5 = null

		beforeEach ->
			model_a1 = new ModelA({id: 1, title: "Model A 1"})
			model_a2 = new ModelA({id: 2, title: "Model A 2"})
			model_a3 = new ModelA({id: 3, title: "Model A 3"})
			model_a4 = new ModelA({id: 4, title: "Model A 4"})
			model_a5 = new ModelA({id: 5, title: "Model A 5"})

			collectionA = new CollectionA([model_a1, model_a2, model_a3, model_a4, model_a5])
		#END beforeEach

		it "Should be able to chain slice methods", ->
			chain_result = collectionA.chain().slice(1).slice(0, 4).models()

			expect( chain_result ).toEqual( jasmine.any(Array) )
			expect( chain_result.length ).toBe( 4 )
		#END it

		it "Should be able to chain filter methods", ->
			chain_result = collectionA.chain().filter( (model) -> model.get("id") < 4 ).filter( (model) -> model.get("id") isnt 2 ).models()

			expect( chain_result ).toEqual( jasmine.any(Array) )
			expect( chain_result.length ).toBe( 2 )
			expect( chain_result ).toEqual([model_a1, model_a3])
		#END it

		it "Should be able to chain without methods", ->
			chain_result = collectionA.chain().without(2).without(model_a5).models()

			expect( chain_result ).toEqual( jasmine.any(Array) )
			expect( chain_result.length ).toBe( 3 )
			expect( chain_result ).toEqual([model_a1, model_a3, model_a4])
		#END it

		it "Should be able to chain a without method and sort method", ->
			chain_result = collectionA.chain().without(2).sort((a, b) ->
				return -1 if a.id > b.id
				return 1 if a.id < b.id
				return 0
			).models()

			expect( chain_result ).toEqual( jasmine.any(Array) )
			expect( chain_result.length ).toBe( 4 )
			expect( chain_result ).toEqual([model_a5, model_a4, model_a3, model_a1])
		#END it
	#END describe
#END describe