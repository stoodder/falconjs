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
	describe "initialize", ->
		models = [{"hello": "world"},{"hello": "world2"}]
		model = new ModelB

		beforeEach ->
			sinonSpyOn( CollectionA::, 'initialize')
		#END beforeEach

		it "Should initialize properly with an empty collection", ->
			collection = new CollectionA
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith()
			expect( CollectionA::initialize ).toHaveBeenCalledOn( collection )
		#END it

		it "Should initialize properly with an array of objects", ->
			collection = new CollectionA( models )
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith( models )
			expect( collection.parent ).not.toBeDefined()
			expect( collection.length() ).toBe( 2 )
		#END it

		it "Should set up the parent correctly", ->
			collection = new CollectionA( models, model )
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith( models )
			expect( collection.parent ).toBe( model )
			expect( collection.length() ).toBe( 2 )
		#END it

		it "Should be able to switch the order of the models and parent", ->
			collection = new CollectionA( model, models )
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith( models )
			expect( collection.parent ).toBe( model )
			expect( collection.length() ).toBe( 2 )
		#END it

		it "Should be able to accept an array of models", ->
			models = [new ModelA({"hello": "world"}), new ModelA({"hello": "world2"}) ]
			collection = new CollectionA( models )
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith( models )
			expect( collection.parent ).not.toBeDefined()
			expect( collection.length() ).toBe( 2 )
		#END it

		it "Should be able to accept an array of models with a parent model", ->
			collection = new CollectionA( models, model )
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith( models )
			expect( collection.parent ).toBe( model )
			expect( collection.length() ).toBe( 2 )
		#END it

		it "Should be able to switch the order of an array of models and parent", ->
			collection = new CollectionA( model, models )
			expect( CollectionA::initialize ).toHaveBeenCalledOnce()
			expect( CollectionA::initialize ).toHaveBeenCalledWith( models )
			expect( collection.parent ).toBe( model )
			expect( collection.length() ).toBe( 2 )
		#END it

		it "Should throw if the parent isn't a model", ->
			expect( -> new CollectionA( models, {} ) ).toThrow()
		#END 
	#END describe

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

	describe "set", ->
		model_1 = new ModelA({'hello': 'water', 'foo': 'baz'})
		model_2 = new ModelA({'hello': 'earth', 'foo': 'zip'})
		model_3 = new ModelA({'hello': 'mars', 'foo': 'zab'})
		collection = new CollectionA([model_1, model_2, model_3])

		beforeEach ->
			spyOn( model_1, 'set' )
			spyOn( model_2, 'set' )
			spyOn( model_3, 'set' )
		#END beforeEach

		it "Should update all of the values", ->
			ret = collection.set('hello', 'world')

			expect( model_1.set.calls.count() ).toBe( 1 )
			expect( model_1.set ).toHaveBeenCalledWith('hello', 'world')
			
			expect( model_2.set.calls.count() ).toBe( 1 )
			expect( model_2.set ).toHaveBeenCalledWith('hello', 'world')
			
			expect( model_3.set.calls.count() ).toBe( 1 )
			expect( model_3.set ).toHaveBeenCalledWith('hello', 'world')

			expect( ret ).toBe( collection )
		#END it

		it "Should be able to set using an object", ->
			ret = collection.set({'hello': 'world :D', 'foo': 'bar'})

			expect( model_1.set.calls.count() ).toBe( 1 )
			expect( model_1.set ).toHaveBeenCalledWith({'hello': 'world :D', 'foo': 'bar'}, undefined)
			
			expect( model_2.set.calls.count() ).toBe( 1 )
			expect( model_2.set ).toHaveBeenCalledWith({'hello': 'world :D', 'foo': 'bar'}, undefined)
			
			expect( model_3.set.calls.count() ).toBe( 1 )
			expect( model_3.set ).toHaveBeenCalledWith({'hello': 'world :D', 'foo': 'bar'}, undefined)

			expect( ret ).toBe( collection )
		#END it
	#END describe
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

			it "Should not overwrite previous references on merge", ->
				class MergeModel extends Falcon.Model
					defaults:
						'sub': -> new SubMergeModel
					#END defaults

					observables:
						'foo': 'bar'
					#END observables
				#END MergeModel

				class SubMergeModel extends Falcon.Model
					observables:
						'hello': 'world'
					#END observables
				#END SubMergeModel

				class MergeCollection extends Falcon.Collection
					model: MergeModel
				#END class

				merge_model = new MergeModel(id: 1)
				merge_collection = new MergeCollection([merge_model])

				expect( merge_model.get('foo') ).toBe( 'bar' )
				expect( merge_model.sub.get('hello') ).toBe( 'world' )

				foo_obs = merge_model.foo
				hello_obs = merge_model.sub.hello

				expect( ko.isObservable(foo_obs) ).toBe( true )
				expect( ko.isObservable(hello_obs) ).toBe( true )

				expect( merge_collection.all() ).toEqual([merge_model])

				merge_collection.fill([{
					'id': 1,
					'foo': 'BAR',
					'sub': {'hello': 'WORLD'}
				}, (merge_model2 = new MergeModel)], {'method': 'merge'})

				expect( merge_model.get('foo') ).toBe( 'BAR' )
				expect( merge_model.sub.get('hello') ).toBe( 'WORLD' )

				expect( foo_obs ).toBe( merge_model.foo )
				expect( hello_obs ).toBe( merge_model.sub.hello )

				expect( merge_collection.all() ).toEqual([merge_model, merge_model2])
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
			Falcon.debug = true
			serialized = collectionA.serialize()

			expect( serialized ).toEqual( models )
			Falcon.debug = false
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

		describe "sync", ->
			collection = new Falcon.Collection

			beforeEach ->
				spyOn( Falcon.adapter, 'sync' )
			#END beforeEach

			it "Should call the falcon adapter", ->
				type = "GET"
				options = {}
				context = new Falcon.Collection
				collection.sync(type, options, context)

				expect( Falcon.adapter.sync.calls.count() ).toBe( 1 )
				expect( Falcon.adapter.sync ).toHaveBeenCalledWith(collection, type, options, context)
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
	describe "create", ->
		model = new ModelA
		options =
			success: jasmine.createSpy("Success Spy")
		#END options
		context = new ModelA
		collection = new CollectionA
		collection.parent = new ModelB
		success = null

		beforeEach ->
			spyOn( model, 'create' )
			spyOn( collection, 'fill' )
			spyOn( Falcon.adapter, 'standardizeOptions').and.callThrough()

			options.success.calls.reset()
		#END beforeEach

		it "Should return null if no model is set in the collection", ->
			collection.model = null

			expect( collection.create(model, options, context) ).toBeNull()

			expect( model.create ).not.toHaveBeenCalled()
			expect( collection.fill ).not.toHaveBeenCalled()
			expect( options.success ).not.toHaveBeenCalled()
			expect( Falcon.adapter.standardizeOptions ).not.toHaveBeenCalled()

			collection.model = ModelA
		#END it

		it "Should call the model create method", ->
			collection.create(model, options, context)

			expect( Falcon.adapter.standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.standardizeOptions ).toHaveBeenCalledWith(model, 'POST', options, context)

			expect( model.create.calls.count() ).toBe( 1 )
			expect( model.create ).toHaveBeenCalledWith(jasmine.any(Object), context)

			expect( collection.fill ).not.toHaveBeenCalled()
			expect( options.success ).not.toHaveBeenCalled()

			output_options = model.create.calls.mostRecent().args[0]

			expect( output_options ).not.toBe( options )

			{success, fill_options} = output_options
			expect( success ).not.toBe( options.success )
			expect(fill_options).toEqual({'method': 'append'})
		#END it

		it "Should call the proper routines in the success method", ->
			success(model)

			expect( model.create ).not.toHaveBeenCalled()
			expect( Falcon.adapter.standardizeOptions ).not.toHaveBeenCalled()

			expect( collection.fill.calls.count() ).toBe( 1 )
			expect( collection.fill ).toHaveBeenCalledWith( model, {'method': 'append'} )

			expect( options.success.calls.count() ).toBe( 1 )
			expect( options.success ).toHaveBeenCalledWith( model )
			expect( options.success.calls.mostRecent().object ).toBe( context )
		#END it

		it "Should generate a model if raw data is passed in", ->
			spyOn( ModelA::, 'initialize')
			spyOn( ModelA::, 'create')
			data = {}
			collection.create(data, options, context)

			expect( ModelA::initialize.calls.count() ).toBe( 1 )
			expect( ModelA::initialize ).toHaveBeenCalledWith(data)

			model = ModelA::initialize.calls.mostRecent().object

			expect( Falcon.adapter.standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.standardizeOptions ).toHaveBeenCalledWith( model, 'POST', options, context )

			expect( model.create.calls.count() ).toBe( 1 )
			expect( model.create ).toHaveBeenCalledWith(jasmine.any(Object), context)

			expect( collection.fill ).not.toHaveBeenCalled()
			expect( options.success ).not.toHaveBeenCalled()
		#END it

		it "Should set up the correct context if none is given", ->
			collection.create(model, options)

			expect( Falcon.adapter.standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.standardizeOptions ).toHaveBeenCalledWith(model, 'POST', options, model)

			expect( model.create.calls.count() ).toBe( 1 )
			expect( model.create ).toHaveBeenCalledWith(jasmine.any(Object), model)
		#END it

		it "Should not overwrite the fill options", ->
			collection.create(model, {fill_options: {'method': 'merge'}}, context)
			{fill_options} = model.create.calls.mostRecent().args[0]
			expect(fill_options).toEqual({'method': 'merge'})
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the destroy() method
	#
	#--------------------------------------------------------------
	describe "destroy", ->
		model_1 = new ModelA(id: 1)
		model_2 = new ModelA(id: 2)
		model_3 = new ModelA(id: 3)
		model_4 = new ModelA(id: 4)
		collection = new CollectionA([model_1, model_2, model_4])
		context = new ModelA

		options =
			success: jasmine.createSpy("Success Spy")
		#END options

		success = null

		beforeEach ->
			spyOn( model_1, 'destroy' )
			spyOn( model_2, 'destroy' )
			spyOn( model_3, 'destroy' )
			spyOn( model_4, 'destroy' )

			spyOn( collection, 'remove' )

			spyOn( Falcon.adapter, 'standardizeOptions').and.callThrough()
			options.success.calls.reset()
		#END beforeEach

		it "Should return null if a model isn't set on the collection", ->
			collection.model = null

			expect( collection.destroy(model_1, options, context) ).toBeNull()
			expect( Falcon.adapter.standardizeOptions ).not.toHaveBeenCalled()
			expect( model_1.destroy ).not.toHaveBeenCalled()

			collection.model = ModelA
		#END it

		it "Should return null if a model that doesnt exist in the collection is given", ->
			expect( collection.destroy(model_3, options, context) ).toBeNull()
			expect( Falcon.adapter.standardizeOptions ).not.toHaveBeenCalled()
			expect( model_1.destroy ).not.toHaveBeenCalled()
		#END it

		it "Should call the correct method when removing a model that exists in the collection", ->
			collection.destroy(model_1, options, context)

			expect( Falcon.adapter.standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.standardizeOptions ).toHaveBeenCalledWith(model_1, 'DELETE', options, context)

			expect( model_1.destroy.calls.count() ).toBe( 1 )
			expect( model_1.destroy ).toHaveBeenCalledWith(jasmine.any(Object), context)

			expect( collection.remove ).not.toHaveBeenCalled()
			expect( options.success ).not.toHaveBeenCalled()

			output_options = model_1.destroy.calls.mostRecent().args[0]

			expect( output_options ).not.toBe( options )

			{success} = output_options
			expect( success ).not.toBe( options.success )
		#END it

		it "Should call the proper routines in the success method", ->
			success(model_1)

			expect( model_1.destroy ).not.toHaveBeenCalled()
			expect( Falcon.adapter.standardizeOptions ).not.toHaveBeenCalled()

			expect( collection.remove.calls.count() ).toBe( 1 )
			expect( collection.remove ).toHaveBeenCalledWith( model_1 )

			expect( options.success.calls.count() ).toBe( 1 )
			expect( options.success ).toHaveBeenCalledWith( model_1 )
			expect( options.success.calls.mostRecent().object ).toBe( context )
		#END it

		it "Should be able to remove a model based on id", ->
			collection.destroy(2, options, context)

			expect( Falcon.adapter.standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.standardizeOptions ).toHaveBeenCalledWith(model_2, 'DELETE', options, context)

			expect( model_2.destroy.calls.count() ).toBe( 1 )
			expect( model_2.destroy ).toHaveBeenCalledWith(jasmine.any(Object), context)

			expect( collection.remove ).not.toHaveBeenCalled()
			expect( options.success ).not.toHaveBeenCalled()
		#END it

		it "Should set up the correct context if none is given", ->
			collection.destroy(model_4, options)

			expect( Falcon.adapter.standardizeOptions.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.standardizeOptions ).toHaveBeenCalledWith(model_4, 'DELETE', options, model_4)

			expect( model_4.destroy.calls.count() ).toBe( 1 )
			expect( model_4.destroy ).toHaveBeenCalledWith(jasmine.any(Object), model_4)
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

		it "Should keep the length up to date", ->
			chain = collectionA.chain()
			expect( chain.length() ).toBe( 5 )
			expect( collectionA.length() ).toBe( 5 )

			chain.slice(0,3)
			expect( chain.length() ).toBe( 3 )
			expect( collectionA.length() ).toBe( 5 )

			chain.push(new ModelA)
			expect( chain.length() ).toBe( 4 )
			expect( collectionA.length() ).toBe( 5 )
			
			chain.unshift(new ModelA)
			expect( chain.length() ).toBe( 5 )
			expect( collectionA.length() ).toBe( 5 )
		#END it
	#END describe
#END describe