describe "Test Collection Methods", ->
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
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith()
		init_stub.should.have.been.calledOn( collectionA )
		init_stub.reset()

		models = [{"hello": "world"},{"hello": "world2"}]
		collectionA = new CollectionA( models )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( models )
		expect( collectionA.parent ).to.be.undefined
		expect( collectionA.length() ).to.equal 2
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( models, modelB )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( models )
		expect( collectionA.parent ).to.equal modelB
		expect( collectionA.length() ).to.equal 2
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( modelB, models )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( models )
		expect( collectionA.parent ).to.equal modelB
		expect( collectionA.length() ).to.equal 2
		init_stub.reset()

		models = [new ModelA({"hello": "world"}), new ModelA({"hello": "world2"}) ]
		collectionA = new CollectionA( models )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( models )
		expect( collectionA.parent ).to.be.undefined
		expect( collectionA.length() ).to.equal 2
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( models, modelB )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( models )
		expect( collectionA.parent ).to.equal modelB
		expect( collectionA.length() ).to.equal 2
		init_stub.reset()

		modelB = new ModelB
		collectionA = new CollectionA( modelB, models )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( models )
		expect( collectionA.parent ).to.equal modelB
		expect( collectionA.length() ).to.equal 2
		init_stub.reset()

		init_stub.restore()
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

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it

			it "Should properly replace items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 2, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				]

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it
		#END describe

		describe "Test 'replace' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'replace' }

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it

			it "Should properly replace items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 2, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'replace' }

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it
		#END describe

		describe "Test 'append' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'append' }

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it

			it "Should properly append items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 3, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'append' }

				collectionA.length().should.equal 3
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 3
				collectionA.at(0).get('hello').should.equal "world3"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 1
				collectionA.at(1).get('hello').should.equal "world"
				collectionA.at(2).should.be.instanceof ModelA
				collectionA.at(2).get('id').should.equal 2
				collectionA.at(2).get('hello').should.equal "world2"
			#END it
		#END describe

		describe "Test 'prepend' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'prepend' }

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
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
				collectionA.length().should.equal 3

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 1
				collectionA.at(index).get('hello').should.equal "world"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 2
				collectionA.at(index).get('hello').should.equal "world2"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 3
				collectionA.at(index).get('hello').should.equal "world3"
			#END it
		#END describe

		describe "Test 'merge' option", ->
			it "Should properly add items into an empty collection", ->
				collectionA = new CollectionA
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], { 'method': 'merge' }

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
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
				collectionA.length().should.equal 4

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 3
				collectionA.at(index).get('hello').should.equal "world3"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 4
				collectionA.at(index).get('hello').should.equal "world5"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 1
				collectionA.at(index).get('hello').should.equal "world"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 2
				collectionA.at(index).get('hello').should.equal "world2"
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

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
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
				collectionA.length().should.equal 4


				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 3
				collectionA.at(index).get('hello').should.equal "world3"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 1
				collectionA.at(index).get('hello').should.equal "world"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 2
				collectionA.at(index).get('hello').should.equal "world2"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 4
				collectionA.at(index).get('hello').should.equal "world4"
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
				collectionA.length().should.equal 4

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 3
				collectionA.at(index).get('hello').should.equal "world3"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 4
				collectionA.at(index).get('hello').should.equal "world4"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 1
				collectionA.at(index).get('hello').should.equal "world"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 2
				collectionA.at(index).get('hello').should.equal "world2"
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
				collectionA.length().should.equal 4

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 1
				collectionA.at(index).get('hello').should.equal "world"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 2
				collectionA.at(index).get('hello').should.equal "world2"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 3
				collectionA.at(index).get('hello').should.equal "world3"
				index++

				collectionA.at(index).should.be.instanceof ModelA
				collectionA.at(index).get('id').should.equal 4
				collectionA.at(index).get('hello').should.equal "world4"
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

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it

			it "Should properly replace items into a populated collection", ->
				collectionA = new CollectionA [
					{id: 2, "hello": "world3"}
				]
				
				collectionA.fill [
					{id: 1, "hello": "world"}
					{id: 2, "hello": "world2"}
				], {'method': 'invalid'}

				collectionA.length().should.equal 2
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(1).should.be.instanceof ModelA
				collectionA.at(1).get('id').should.equal 2
				collectionA.at(1).get('hello').should.equal "world2"
			#END it
		#END describe

		describe "Test that parent is being set properly on children models", ->
			it "Should properly add items into an empty collection", ->
				modelB = new ModelB
				collectionA = new CollectionA( modelB )
				collectionA.fill [
					{id: 1, "hello": "world"}
				]

				collectionA.length().should.equal 1
				collectionA.at(0).should.be.instanceof ModelA
				collectionA.at(0).get('id').should.equal 1
				collectionA.at(0).get('hello').should.equal "world"
				collectionA.at(0).parent.should.equal modelB
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

			serialized.should.deep.equal models
		#END it

		it "Should test specific fields for serialize method", ->
			serialized = collectionA.serialize(["foo"])

			serialized.should.deep.equal [
				{"foo": "bar"}
				{"foo": "bar2"}
				{"foo": "barA"}
			]
		#END it

		it "Should test specific fields for serialize method, just id", ->
			serialized = collectionA.serialize("id")

			serialized.should.deep.equal [
				{id: 1}
				{id: 2}
				{id: 'a'}
			]
		#END it

		it "Should test specific fields for serialize method, string value", ->
			serialized = collectionA.serialize("foo")

			serialized.should.deep.equal [
				{"foo": "bar"}
				{"foo": "bar2"}
				{"foo": "barA"}
			]
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

			expect( collectionA.makeUrl("GET") ).to.equal "/model_a"
			expect( collectionA.makeUrl("POST") ).to.equal "/model_a"
			expect( collectionA.makeUrl("PUT") ).to.equal "/model_a"
			expect( collectionA.makeUrl("DELETE") ).to.equal "/model_a"
		#END it

		it "Tests the basic makeUrl method, base API url", ->
			collectionA = new CollectionA()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_a"
			expect( collectionA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_a"
			expect( collectionA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_a"
			expect( collectionA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_a"
		#END it

		it "Tests the basic makeUrl method, base API url ending with a '/'", ->
			collectionA = new CollectionA()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_a"
			expect( collectionA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_a"
			expect( collectionA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_a"
			expect( collectionA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_a"
		#END it



		it "Tests the basic makeUrl method, with parent", ->
			collectionA = new CollectionA( new ModelB(id: '1b') )

			expect( collectionA.makeUrl("GET") ).to.equal "/model_b/1b/model_a"
			expect( collectionA.makeUrl("POST") ).to.equal "/model_b/1b/model_a"
			expect( collectionA.makeUrl("PUT") ).to.equal "/model_b/1b/model_a"
			expect( collectionA.makeUrl("DELETE") ).to.equal "/model_b/1b/model_a"
		#END it

		it "Tests the basic makeUrl method, base API url, with parent", ->
			collectionA = new CollectionA( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/2b/model_a"
			expect( collectionA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/2b/model_a"
			expect( collectionA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/2b/model_a"
			expect( collectionA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/2b/model_a"
		#END it

		it "Tests the basic makeUrl method, base API url ending with a '/', with parent", ->
			collectionA = new CollectionA( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/3b/model_a"
			expect( collectionA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/3b/model_a"
			expect( collectionA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/3b/model_a"
			expect( collectionA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/3b/model_a"
		#END it



		#------





		it "Tests the basic makeUrl method, model url is a function", ->
			collectionD = new CollectionD()

			expect( collectionD.makeUrl("GET") ).to.equal "/model_d"
			expect( collectionD.makeUrl("POST") ).to.equal "/model_d"
			expect( collectionD.makeUrl("PUT") ).to.equal "/model_d"
			expect( collectionD.makeUrl("DELETE") ).to.equal "/model_d"
		#END it

		it "Tests the basic makeUrl method, model url is a function, base API url", ->
			collectionD = new CollectionD()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_d"
			expect( collectionD.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_d"
			expect( collectionD.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_d"
			expect( collectionD.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_d"
		#END it

		it "Tests the basic makeUrl method, model url is a function, base API url ending with a '/'", ->
			collectionD = new CollectionD()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_d"
			expect( collectionD.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_d"
			expect( collectionD.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_d"
			expect( collectionD.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_d"
		#END it



		it "Tests the basic makeUrl method, model url is a function, with parent", ->
			collectionD = new CollectionD( new ModelB(id: '1b') )

			expect( collectionD.makeUrl("GET") ).to.equal "/model_b/1b/model_d"
			expect( collectionD.makeUrl("POST") ).to.equal "/model_b/1b/model_d"
			expect( collectionD.makeUrl("PUT") ).to.equal "/model_b/1b/model_d"
			expect( collectionD.makeUrl("DELETE") ).to.equal "/model_b/1b/model_d"
		#END it

		it "Tests the basic makeUrl method, model url is a function, with parent, base API url", ->
			collectionD = new CollectionD( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/2b/model_d"
			expect( collectionD.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/2b/model_d"
			expect( collectionD.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/2b/model_d"
			expect( collectionD.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/2b/model_d"
		#END it

		it "Tests the basic makeUrl method, model url is a function, with parent, base API url ending with a '/'", ->
			collectionD = new CollectionD( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/3b/model_d"
			expect( collectionD.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/3b/model_d"
			expect( collectionD.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/3b/model_d"
			expect( collectionD.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/3b/model_d"
		#END it



		#------





		it "Tests the basic makeUrl method, defined url string", ->
			collectionD2 = new CollectionD2()

			expect( collectionD2.makeUrl("GET") ).to.equal "/collection_d2"
			expect( collectionD2.makeUrl("POST") ).to.equal "/collection_d2"
			expect( collectionD2.makeUrl("PUT") ).to.equal "/collection_d2"
			expect( collectionD2.makeUrl("DELETE") ).to.equal "/collection_d2"
		#END it

		it "Tests the basic makeUrl method, defined url string, base API url", ->
			collectionD2 = new CollectionD2()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD2.makeUrl("GET") ).to.equal "http://www.falconjs.com/collection_d2"
			expect( collectionD2.makeUrl("POST") ).to.equal "http://www.falconjs.com/collection_d2"
			expect( collectionD2.makeUrl("PUT") ).to.equal "http://www.falconjs.com/collection_d2"
			expect( collectionD2.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/collection_d2"
		#END it

		it "Tests the basic makeUrl method, defined url string, base API url ending with a '/'", ->
			collectionD2 = new CollectionD2()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD2.makeUrl("GET") ).to.equal "http://www.falconjs.com/collection_d2"
			expect( collectionD2.makeUrl("POST") ).to.equal "http://www.falconjs.com/collection_d2"
			expect( collectionD2.makeUrl("PUT") ).to.equal "http://www.falconjs.com/collection_d2"
			expect( collectionD2.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/collection_d2"
		#END it



		it "Tests the basic makeUrl method, defined url string, with parent", ->
			collectionD2 = new CollectionD2( new ModelB(id: '1b') )

			expect( collectionD2.makeUrl("GET") ).to.equal "/model_b/1b/collection_d2"
			expect( collectionD2.makeUrl("POST") ).to.equal "/model_b/1b/collection_d2"
			expect( collectionD2.makeUrl("PUT") ).to.equal "/model_b/1b/collection_d2"
			expect( collectionD2.makeUrl("DELETE") ).to.equal "/model_b/1b/collection_d2"
		#END it

		it "Tests the basic makeUrl method, defined url string, with parent, base API url", ->
			collectionD2 = new CollectionD2( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD2.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d2"
			expect( collectionD2.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d2"
			expect( collectionD2.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d2"
			expect( collectionD2.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d2"
		#END it

		it "Tests the basic makeUrl method, defined url string, with parent, base API url ending with a '/'", ->
			collectionD2 = new CollectionD2( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD2.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d2"
			expect( collectionD2.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d2"
			expect( collectionD2.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d2"
			expect( collectionD2.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d2"
		#END it



		#------





		it "Tests the basic makeUrl method, defined url function", ->
			collectionD3 = new CollectionD3()

			expect( collectionD3.makeUrl("GET") ).to.equal "/collection_d3"
			expect( collectionD3.makeUrl("POST") ).to.equal "/collection_d3"
			expect( collectionD3.makeUrl("PUT") ).to.equal "/collection_d3"
			expect( collectionD3.makeUrl("DELETE") ).to.equal "/collection_d3"
		#END it

		it "Tests the basic makeUrl method, defined url function, base API url", ->
			collectionD3 = new CollectionD3()
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD3.makeUrl("GET") ).to.equal "http://www.falconjs.com/collection_d3"
			expect( collectionD3.makeUrl("POST") ).to.equal "http://www.falconjs.com/collection_d3"
			expect( collectionD3.makeUrl("PUT") ).to.equal "http://www.falconjs.com/collection_d3"
			expect( collectionD3.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/collection_d3"
		#END it

		it "Tests the basic makeUrl method, defined url function, base API url ending with a '/'", ->
			collectionD3 = new CollectionD3()
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD3.makeUrl("GET") ).to.equal "http://www.falconjs.com/collection_d3"
			expect( collectionD3.makeUrl("POST") ).to.equal "http://www.falconjs.com/collection_d3"
			expect( collectionD3.makeUrl("PUT") ).to.equal "http://www.falconjs.com/collection_d3"
			expect( collectionD3.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/collection_d3"
		#END it



		it "Tests the basic makeUrl method, defined url function, with parent", ->
			collectionD3 = new CollectionD3( new ModelB(id: '1b') )

			expect( collectionD3.makeUrl("GET") ).to.equal "/model_b/1b/collection_d3"
			expect( collectionD3.makeUrl("POST") ).to.equal "/model_b/1b/collection_d3"
			expect( collectionD3.makeUrl("PUT") ).to.equal "/model_b/1b/collection_d3"
			expect( collectionD3.makeUrl("DELETE") ).to.equal "/model_b/1b/collection_d3"
		#END it

		it "Tests the basic makeUrl method, defined url function, with parent, base API url", ->
			collectionD3 = new CollectionD3( new ModelB(id: '2b') )
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( collectionD3.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d3"
			expect( collectionD3.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d3"
			expect( collectionD3.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d3"
			expect( collectionD3.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/2b/collection_d3"
		#END it

		it "Tests the basic makeUrl method, defined url function, with parent, base API url ending with a '/'", ->
			collectionD3 = new CollectionD3( new ModelB(id: '3b') )
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( collectionD3.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d3"
			expect( collectionD3.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d3"
			expect( collectionD3.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d3"
			expect( collectionD3.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/3b/collection_d3"
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

				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledOn collectionA
				sync_stub.should.have.been.calledWith 'GET', {'hello': 'world'}
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "GET"}
				ajax_stub.should.have.been.calledWithMatch {url: collectionA.makeUrl("GET")}
				ajax_stub.should.have.been.calledWithMatch {data: ""}
				ajax_stub.should.have.been.calledWithMatch {contentType: "application/json"}
				ajax_stub.should.have.been.calledWithMatch {cache: false}
				ajax_stub.should.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3

				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1

				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "GET"}
				ajax_stub.should.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				ajax_stub.should.have.been.calledWithMatch {data: JSON.stringify("hello": "world")}
				ajax_stub.should.have.been.calledWithMatch {contentType: "text/html"}
				ajax_stub.should.have.been.calledWithMatch {cache: true}
				ajax_stub.should.have.been.calledWithMatch {headers: {"User-Agent", "Chrome"}}
				
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3
				expect( ajax_stub.firstCall.args[0].success ).to.not.equal _success

				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1
				expect( ajax_stub.firstCall.args[0].error ).to.not.equal _error

				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
				expect( ajax_stub.firstCall.args[0].complete ).to.not.equal _complete
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

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 1
				fill_stub.firstCall.args[0].should.deep.equal success_data
				fill_stub.should.have.been.calledAfter parse_stub

				fetch_spy.should.have.been.calledOnce
				fetch_spy.should.have.been.calledAfter fill_stub

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn collectionA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal collectionA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn collectionA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal collectionA
				complete_spy.should.have.been.calledAfter success_spy
			#END it

			it "Should not fill when fill option is false on fetch", ->
				options.fill = false
				collectionA.fetch( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 0

				fetch_spy.should.have.been.calledOnce
				fetch_spy.should.have.been.calledAfter parse_stub

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn collectionA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal collectionA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn collectionA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal collectionA
				complete_spy.should.have.been.calledAfter success_spy
			#END it

			it "Should call the error response on an errornous result", ->
				collectionA.fetch( options )

				server.respondWith [ 400, {}, JSON.stringify(error_data) ]
				server.respond()

				parse_stub.callCount.should.equal 0
				fill_stub.callCount.should.equal 0

				fetch_spy.should.not.have.been.called

				success_spy.callCount.should.equal 0

				error_spy.callCount.should.equal 1
				error_spy.firstCall.args.length.should.equal 3
				error_spy.should.have.been.calledOn collectionA
				complete_spy.firstCall.args[0].should.equal collectionA

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn collectionA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal collectionA
				complete_spy.should.have.been.calledAfter error_spy
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "GET"}
				ajax_stub.should.have.been.calledWithMatch {url: collectionA.makeUrl("GET")}
				ajax_stub.should.have.been.calledWithMatch {data: ""}
				ajax_stub.should.have.been.calledWithMatch {contentType: "application/json"}
				ajax_stub.should.have.been.calledWithMatch {cache: false}
				ajax_stub.should.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3

				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1

				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
			#END it

			it "Should allow for a specified parent to override", ->
				collectionA.parent = new ModelB(id: 'b')
				collectionA.sync 'GET',
					parent: (model_b = new ModelB(id: 'b2'))
				#END sync

				ajax_stub.should.have.been.calledWithMatch {url: collectionA.makeUrl("GET", model_b)}
			#END it

			it "Should allow for a specified parent to override", ->
				collectionA.parent = new ModelB(id: 'b')
				collectionA.sync 'GET',
					parent: null
				#END sync

				ajax_stub.should.have.been.calledWithMatch {url: collectionA.makeUrl("GET", null)}
			#END it
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
			expect( collectionA.length() ).to.equal 4

			collectionA.remove( model_a2 )

			expect( collectionA.length() ).to.equal 3
			expect( collectionA.at(0) ).to.equal model_a1
			expect( collectionA.at(1) ).to.equal model_a3
			expect( collectionA.at(2) ).to.equal model_a4
		#END it

		it "Should be able to remove multiple items", ->
			expect( collectionA.length() ).to.equal 4

			collectionA.remove( [model_a2, model_a3] )

			expect( collectionA.length() ).to.equal 2
			expect( collectionA.at(0) ).to.equal model_a1
			expect( collectionA.at(1) ).to.equal model_a4
		#END it

		it "Should be able to remove items with a function", ->
			expect( collectionA.length() ).to.equal 4

			collectionA.remove (model) ->
				return model.get('id') % 2 is 0
			#END remove

			expect( collectionA.length() ).to.equal 2
			expect( collectionA.at(0) ).to.equal model_a1
			expect( collectionA.at(1) ).to.equal model_a3
		#END it

		it "Should be able to remove a different model but with the same id", ->
			expect( collectionA.length() ).to.equal 4

			collectionA.remove( new ModelA(id: 3) )
			expect( collectionA.at(0) ).to.equal model_a1
			expect( collectionA.at(1) ).to.equal model_a2
			expect( collectionA.at(2) ).to.equal model_a4
			#END remove
		#END it

		it "Should be able to remove models who don't have an id, properly", ->
			collectionA = new CollectionA()
			collectionA.append([
				{'text': '1'}
				{'text': '2'}
				{'text': '3'}
			])

			expect( collectionA.length() ).to.equal 3

			model_a1 = collectionA.first()
			collectionA.remove( model_a1 )

			expect( collectionA.length() ).to.equal 2
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

			fill_stub.should.have.been.calledOnce
			fill_stub.should.have.been.deep.calledWith input, {'method': 'append'}
		#END it

		it "Should call the proper fill method when prepending", ->
			collectionA.prepend(input = {'hello': 'world'})

			fill_stub.should.have.been.calledOnce
			fill_stub.should.have.been.deep.calledWith input, {'method': 'prepend'}
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

			fill_stub.should.have.been.calledOnce
			fill_stub.should.have.been.deep.calledWith input, {'method': 'append'}
		#END it

		it "Should call the proper fill method when inserting with a valid model", ->
			collectionA.insert(input = {'hello': 'world'}, 4) #4 is the model id

			fill_stub.should.have.been.calledOnce
			fill_stub.should.have.been.deep.calledWith input, {'method': 'insert', 'insert_index': 1}
		#END it

		it "Should call the proper fill method when appending with an invalid model", ->
			collectionA.insert(input = {'hello': 'world'}, 33)

			fill_stub.should.have.been.calledOnce
			fill_stub.should.have.been.deep.calledWith input, {'method': 'insert', 'insert_index': -1}
		#END it

		it "Should call the proper fill method when inserting with an iterator", ->
			collectionA.insert(input = {'hello': 'world'}, ( (m) -> m.get('id') is 1 ) )

			fill_stub.should.have.been.calledOnce
			fill_stub.should.have.been.deep.calledWith input, {'method': 'insert', 'insert_index': 0}
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
			collectionA.length().should.equal 2

			collectionA.unshift({id: 3})

			append_stub.should.not.have.been.called
			prepend_stub.should.have.been.calledOnce
			prepend_stub.should.have.been.deep.calledWith {id: 3}
		#END it

		it "Should have push be an alias of append", ->
			collectionA.length().should.equal 2

			collectionA.push({id: 3})

			prepend_stub.should.not.have.been.called
			append_stub.should.have.been.calledOnce
			append_stub.should.have.been.deep.calledWith {id: 3}
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

			expect( elm ).to.equal model_a1
			expect( collectionA.length() ).to.equal 2
		#END it

		it "Should shift the first element off the front", ->
			elm = collectionA.pop()

			expect( elm ).to.equal model_a3
			expect( collectionA.length() ).to.equal 2
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

			expect( collectionA.models() ).to.deep.equal([ model_a2, model_a1, model_a3 ])

			collectionA.sort (a, b) ->
				a_id = a.get("id")
				b_id = b.get("id")

				return 1 if a_id > b_id
				return -1 if a_id < b_id
				return 0
			#END sort

			expect( collectionA.models() ).to.deep.equal([ model_a1, model_a2, model_a3 ])
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
			initialize_stub = sinon.stub( ModelA::, "initialize")
			create_stub = sinon.stub( ModelA::, "create")

			expect( initialize_stub ).to.not.have.been.called
			expect( create_stub ).to.not.have.been.called

			collectionA.create(data = {id: 2}, options)

			expect( initialize_stub ).to.have.been.calledOnce
			expect( initialize_stub ).to.have.been.calledWith( data )

			expect( create_stub ).to.have.been.calledOnce
			expect( create_stub ).to.have.been.calledAfter initialize_stub
			expect( create_stub.firstCall.args.length ).to.equal 1
			expect( create_stub.firstCall.args[0] ).to.equal options
			expect( create_stub.firstCall.args[0].success ).to.be.a 'function'
			expect( create_stub.firstCall.args[0].method ).to.equal 'append'

			initialize_stub.restore()
			create_stub.restore()
		#END it

		it "Should respond correctly from the server", ->
			fill_stub = sinon.stub(collectionA, "fill").returns([])
			collectionA.create(data, options)

			expect( collectionA.length() ).to.equal 1

			server.respondWith [ 200, {}, JSON.stringify(data) ]
			server.respond()

			fill_stub.should.have.been.calledOnce
			expect( fill_stub.firstCall.args.length ).to.equal 2
			expect( fill_stub.firstCall.args[0] ).to.be.instanceof Falcon.Model
			expect( fill_stub.firstCall.args[1] ).to.equal options

			new_model = fill_stub.firstCall.args[0]

			expect( success_spy.callCount ).to.equal 1
			expect( success_spy ).to.have.been.calledAfter fill_stub
			expect( success_spy ).to.have.been.calledOn new_model
			expect( success_spy.firstCall.args[0] ).to.equal new_model

			fill_stub.restore()
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the destroy() method
	#
	#--------------------------------------------------------------
	describe "Test the detroy method", ->
		collectionA = null
		model_a1 = model_a2 = null
		options = null
		success_spy = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			collectionA = new CollectionA([model_a1, model_a2])

			options =
				success: ( success_spy = sinon.spy() )
			#END options
		#END beforeEach

		it "Should call the destroy method on the model", ->
			destroy_stub = sinon.stub( model_a1, "destroy" )

			destroy_stub.should.not.have.been.called

			collectionA.destroy( model_a1, options )

			destroy_stub.should.have.been.calledOnce
			destroy_stub.should.have.been.calledWith options

			destroy_stub.restore()
		#END it

		it "Should respond correctly from the server", ->
			server = sinon.fakeServer.create()

			remove_stub = sinon.stub(collectionA, "remove")
			collectionA.destroy(model_a1, options)

			server.respondWith [ 200, {}, JSON.stringify({}) ]
			server.respond()

			remove_stub.should.have.been.calledOnce
			expect( remove_stub.firstCall.args.length ).to.equal 1
			expect( remove_stub.firstCall.args[0] ).to.be.instanceof Falcon.Model

			removed_model = remove_stub.firstCall.args[0]

			expect( success_spy.callCount ).to.equal 1
			expect( success_spy ).to.have.been.calledAfter remove_stub
			expect( success_spy ).to.have.been.calledOn removed_model
			expect( success_spy.firstCall.args[0] ).to.equal removed_model

			remove_stub.restore()
			server.restore()
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
			expect( collectionA.at(0) ).to.equal model_a1
			expect( collectionA.at(1) ).to.equal model_a2
			expect( collectionA.at(2) ).to.equal model_a3
		#END it

		it "Should return null for invalid indices", ->
			expect( collectionA.at(-1) ).to.equal null
			expect( collectionA.at(3) ).to.equal null
			expect( collectionA.at("HELLO") ).to.equal null
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
			expect( collectionA.indexOf( model_a3 ) ).to.equal 2
		#END it

		it "Should find no match index by model", ->
			expect( collectionA.indexOf( new ModelA ) ).to.equal -1
		#END it

		it "Should find the correct match index by id", ->
			expect( collectionA.indexOf( 3 ) ).to.equal 1
		#END it

		it "Should find the correct match index by truth test method", ->
			index = collectionA.indexOf (model) -> model.get('id') > 4
			expect( index ).to.equal 2
		#END it

		it "Should find the no match index by truth test method", ->
			index = collectionA.indexOf (model) -> model.get('id') > 8
			expect( index ).to.equal -1
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

			collectionA = new CollectionA([model_a1, model_a2, model_a3])
		#END beforeEach

		it "Should call the iterator with one argument", ->
			spy = sinon.spy()
			collectionA.each (item) -> spy.call(@, item)

			expect( spy.callCount ).to.equal 3
			expect( spy.firstCall ).to.be.calledWith model_a1
			expect( spy.secondCall ).to.be.calledWith model_a2
			expect( spy.thirdCall ).to.be.calledWith model_a3
			expect( spy ).to.have.always.been.calledOn collectionA
		#END it

		it "Should call the iterator with two arguments", ->
			spy = sinon.spy()
			collectionA.each (index, item) -> spy.call(@, index, item)

			expect( spy.callCount ).to.equal 3
			expect( spy.firstCall ).to.be.calledWith 0, model_a1
			expect( spy.secondCall ).to.be.calledWith 1, model_a2
			expect( spy.thirdCall ).to.be.calledWith 2, model_a3
			expect( spy ).to.have.always.been.calledOn collectionA
		#END it

		it "Should call the iterator with a specific context and one argument", ->
			spy = sinon.spy()
			context = {}
			iterator = (item) -> spy.call(@, item)
			collectionA.each( iterator, context )

			expect( spy.callCount ).to.equal 3
			expect( spy.firstCall ).to.be.calledWith model_a1
			expect( spy.secondCall ).to.be.calledWith model_a2
			expect( spy.thirdCall ).to.be.calledWith model_a3
			expect( spy ).to.have.always.been.calledOn context
		#END it

		it "Should call the iterator with a specific context and two arguments", ->
			spy = sinon.spy()
			context = {}
			iterator = (index, item) -> spy.call(@, index, item)
			collectionA.each( iterator, context )

			expect( spy.callCount ).to.equal 3
			expect( spy.firstCall ).to.be.calledWith 0, model_a1
			expect( spy.secondCall ).to.be.calledWith 1, model_a2
			expect( spy.thirdCall ).to.be.calledWith 2, model_a3
			expect( spy ).to.have.always.been.calledOn context
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
			expect( first ).to.equal( model_a1 )
		#END it

		it "Should get the first matcing mdel based on function iterator", ->
			first = collectionA.first (model) ->
				return model is model_a2
			#END first
			expect( first ).to.equal( model_a2 )
		#END it

		it "Should get the first matching model based on a model", ->
			first = collectionA.first( model_ab )
			expect( first ).to.equal( model_ab )
		#END it

		it "Should get the first matching model based on an id", ->
			first = collectionA.first( 2 )
			expect( first ).to.equal( model_a2 )

			first = collectionA.first( 'b' )
			expect( first ).to.equal( model_ab )
		#END it

		it "Should return the null if nothing passes the iterator", ->
			first = collectionA.first (model) -> false
			expect( first ).to.equal( null )
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
			expect( last ).to.equal( model_a3 )
		#END it

		it "Should get the last matcing mdel based on function iterator", ->
			last = collectionA.last (model) ->
				return model is model_a2
			#END last
			expect( last ).to.equal( model_a2 )
		#END it

		it "Should get the last matching model based on a model", ->
			last = collectionA.last( model_ab )
			expect( last ).to.equal( model_ab )
		#END it

		it "Should get the last matching model based on an id", ->
			last = collectionA.last( 2 )
			expect( last ).to.equal( model_a2 )

			last = collectionA.last( 'b' )
			expect( last ).to.equal( model_ab )
		#END it

		it "Should return the null if nothing passes the iterator", ->
			last = collectionA.last (model) -> false
			expect( last ).to.equal( null )
		#END
	#END describe


	#--------------------------------------------------------------
	#
	# Test the all() method
	#
	#--------------------------------------------------------------
	describe "Test the all() method", ->
		model_a1 = new ModelA(id: 1)
		model_a2 = new ModelA(id: 2)
		model_ab = new ModelA(id: 'b')
		model_ab2 = new ModelA(id: 'b')
		model_a3 = new ModelA(id: 3)

		models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3]

		collectionA = new CollectionA(models)

		it "Should return the all of the models", ->
			all = collectionA.all()
			expect( all.length ).to.equal 6
			expect( all ).to.deep.equal models
		#END it

		it "Should return a limited set of models by function", ->
			all = collectionA.all (model) -> return model in [model_a1, model_ab]
			expect( all.length ).to.equal 3
			expect( all ).to.deep.equal [model_a1, model_ab, model_ab]
		#END it

		it "Should return a limited set of models by model", ->
			all = collectionA.all( model_a2 )
			expect( all.length ).to.equal 1
			expect( all ).to.deep.equal [model_a2]
		#END it

		it "Should return a limited set of models by id", ->
			all = collectionA.all( 3 )
			expect( all.length ).to.equal 1
			expect( all ).to.deep.equal [model_a3 ]

			all = collectionA.all( 'b' )
			expect( all.length ).to.equal 3
			expect( all ).to.deep.equal [model_ab, model_ab, model_ab2]
		#END it

		it "Should return an empty set of models", ->
			all = collectionA.all (model) -> return false
			expect( all.length ).to.equal 0
			expect( all ).to.deep.equal []
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
			expect( any ).to.be.true

			any = collectionA.any (model) -> return model is model_a4
			expect( any ).to.be.false
		#END it

		it "Should match true based on model", ->
			any = collectionA.any( model_a2 )
			expect( any ).to.be.true

			any = collectionA.any( model_a4 )
			expect( any ).to.be.false
		#END it

		it "Should match correctly based on id", ->
			any = collectionA.any( 3 )
			expect( any ).to.be.true

			any = collectionA.any( 'b' )
			expect( any ).to.be.true

			any = collectionA.any( 4 )
			expect( any ).to.be.false

			any = collectionA.any( 'c' )
			expect( any ).to.be.false
		#END it

		it "Should not match true based on empty iterator", ->
			any = collectionA.any()
			expect( any ).to.be.false
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
			expect( without.length ).to.equal 6
			expect( without ).to.deep.equal models
		#END it

		it "Should return a limited set of models by function", ->
			without = collectionA.without (model) -> return model in [model_a1, model_ab]
			expect( without.length ).to.equal 3
			expect( without ).to.deep.equal [model_a2, model_ab2, model_a3]
		#END it

		it "Should return a limited set of models by model", ->
			without = collectionA.without( model_a2 )
			expect( without.length ).to.equal 5
			expect( without ).to.deep.equal [model_a1, model_ab, model_ab, model_ab2, model_a3]
		#END it

		it "Should return a limited set of models by id", ->
			without = collectionA.without( 3 )
			expect( without.length ).to.equal 5
			expect( without ).to.deep.equal [model_a1, model_a2, model_ab, model_ab, model_ab2]

			without = collectionA.without( 'b' )
			expect( without.length ).to.equal 3
			expect( without ).to.deep.equal [model_a1, model_a2, model_a3]
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
			expect(pluck.length).to.equal 3
			expect(pluck).to.deep.equal ['e1', 'e2', 'e3']
		#END it

		it "Should pluck the title and shouldn't unwrap the observables", ->
			pluck = collectionE.pluck("title", false)
			expect(pluck.length).to.equal 3
			expect(pluck).to.not.deep.equal ['e1', 'e2', 'e3']
		#END it

		it "Should pluck the an invalid attribute", ->
			pluck = collectionE.pluck("title2")
			expect(pluck.length).to.equal 3
			expect(pluck).to.deep.equal [undefined, undefined, undefined]
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
			expect( collectionE.slice(0, 3) ).to.deep.equal models
			expect( collectionE.slice(0, 1) ).to.deep.equal [model_e1]
			expect( collectionE.slice(1, 3) ).to.deep.equal [model_e2, model_e3]
			expect( collectionE.slice(-1) ).to.deep.equal [model_e3]
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

			expect( modelA.hello ).to.be.undefined
			expect( modelA.foo ).to.be.undefined
			expect( modelB.test ).to.be.undefined

			collectionA.mixin {
				"hello": ( mixin_spy = sinon.spy() )
				"foo": ko.observable( "bar" )
				"bees": {
					"test": "123"
				}
			}

			expect( modelA.hello ).not.to.be.undefined
			expect( modelA.hello ).to.be.a 'function'
			expect( ko.isObservable( modelA.foo ) ).to.be.true
			expect( modelA.foo() ).to.equal 'bar'
			expect( modelB.test ).not.to.be.undefined
			expect( modelB.test ).to.equal '123'

			modelA.hello('world')
			mixin_spy.should.have.been.calledOnce
			mixin_spy.should.have.been.calledOn modelA
			mixin_spy.firstCall.args[0].should.equal modelA
			mixin_spy.firstCall.args[1].should.equal collectionA
			mixin_spy.firstCall.args[2].should.equal 'world'
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the clone() method
	#
	#--------------------------------------------------------------
	describe "Testing the clone() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		beforeEach ->
			model_a1 = new ModelA(id: 1)
			model_a2 = new ModelA(id: 2)
			model_a3 = new ModelA(id: 3)

			collectionA = new CollectionA([model_a1, model_a2, model_a3], new ModelB)
		#END beforeEach

		it "Should clone properly with same parent", ->
			clone = collectionA.clone()

			expect( clone ).to.not.equal collectionA
			expect( clone.length() ).to.equal 3
			expect( clone.at(0) ).to.equal( model_a1 )
			expect( clone.at(1) ).to.equal( model_a2 )
			expect( clone.at(2) ).to.equal( model_a3 )
			expect( clone.parent ).to.equal( collectionA.parent )
		#END it

		it "Should clone properly with different parent", ->
			clone = collectionA.clone( parent = new ModelD )

			expect( clone ).to.not.equal collectionA
			expect( clone.length() ).to.equal 3
			expect( clone.at(0) ).to.equal( model_a1 )
			expect( clone.at(1) ).to.equal( model_a2 )
			expect( clone.at(2) ).to.equal( model_a3 )
			expect( clone.parent ).to.not.equal( collectionA.parent )
			expect( clone.parent ).to.equal( parent )
		#END it

		it "Should clone properly with different no parent", ->
			clone = collectionA.clone( null )

			expect( clone ).to.not.equal collectionA
			expect( clone.length() ).to.equal 3
			expect( clone.at(0) ).to.equal( model_a1 )
			expect( clone.at(1) ).to.equal( model_a2 )
			expect( clone.at(2) ).to.equal( model_a3 )
			expect( clone.parent ).to.not.equal( collectionA.parent )
			expect( clone.parent ).to.equal( null )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the copy() method
	#
	#--------------------------------------------------------------
	describe "Test the copy() method", ->
		collectionA = null
		model_a1 = model_a2 = model_a3 = null

		beforeEach ->
			model_a1 = new ModelA({id: 1, 'title': 'Hello World'})
			model_a2 = new ModelA({id: 2, 'title': 'Foo Bar'})

			collectionA = new CollectionA([model_a1, model_a2], new ModelB)
		#END beforeEach

		it "Should do a basic copy properly", ->
			copy = collectionA.copy()

			expect( copy ).to.not.equal collectionA
			expect( copy.parent ).to.equal collectionA.parent
			expect( copy.length() ).to.equal 2
			expect( copy.at(0) ).to.not.equal( model_a1 )
			expect( copy.at(0).get('id') ).to.equal 1
			expect( copy.at(0).get('title') ).to.be.undefined
			expect( copy.at(1) ).to.not.equal( model_a2 )
			expect( copy.at(1).get('id') ).to.equal 2
			expect( copy.at(1).get('title') ).to.be.undefined
		#END it

		it "Should do a basic copy properly with extra fields", ->
			copy = collectionA.copy(["id", "title"])

			expect( copy ).to.not.equal collectionA
			expect( copy.parent ).to.equal collectionA.parent
			expect( copy.length() ).to.equal 2
			expect( copy.at(0) ).to.not.equal( model_a1 )
			expect( copy.at(0).get('id') ).to.equal 1
			expect( copy.at(0).get('title') ).to.be.equal "Hello World"
			expect( copy.at(1) ).to.not.equal( model_a2 )
			expect( copy.at(1).get('id') ).to.equal 2
			expect( copy.at(1).get('title') ).to.be.equal "Foo Bar"
		#END it

		it "Should do a basic copy properly without a parent", ->
			copy = collectionA.copy(null)

			expect( copy ).to.not.equal collectionA
			expect( copy.parent ).to.equal null
			expect( copy.length() ).to.equal 2
			expect( copy.at(0) ).to.not.equal( model_a1 )
			expect( copy.at(0).get('id') ).to.equal 1
			expect( copy.at(0).get('title') ).to.be.undefined
			expect( copy.at(1) ).to.not.equal( model_a2 )
			expect( copy.at(1).get('id') ).to.equal 2
			expect( copy.at(1).get('title') ).to.be.undefined
		#END it

		it "Should do a basic copy properly with extra fields without a parent", ->
			copy = collectionA.copy(["id", "title"], null)

			expect( copy ).to.not.equal collectionA
			expect( copy.parent ).to.equal null
			expect( copy.length() ).to.equal 2
			expect( copy.at(0) ).to.not.equal( model_a1 )
			expect( copy.at(0).get('id') ).to.equal 1
			expect( copy.at(0).get('title') ).to.be.equal "Hello World"
			expect( copy.at(1) ).to.not.equal( model_a2 )
			expect( copy.at(1).get('id') ).to.equal 2
			expect( copy.at(1).get('title') ).to.be.equal "Foo Bar"
		#END it

		it "Should do a basic copy properly without a parent", ->
			copy = collectionA.copy( parent = new ModelC )

			expect( copy ).to.not.equal collectionA
			expect( copy.parent ).to.equal parent
			expect( copy.length() ).to.equal 2
			expect( copy.at(0) ).to.not.equal( model_a1 )
			expect( copy.at(0).get('id') ).to.equal 1
			expect( copy.at(0).get('title') ).to.be.undefined
			expect( copy.at(1) ).to.not.equal( model_a2 )
			expect( copy.at(1).get('id') ).to.equal 2
			expect( copy.at(1).get('title') ).to.be.undefined
		#END it

		it "Should do a basic copy properly with extra fields without a parent", ->
			copy = collectionA.copy(["id", "title"],  parent = new ModelC )

			expect( copy ).to.not.equal collectionA
			expect( copy.parent ).to.equal parent
			expect( copy.length() ).to.equal 2
			expect( copy.at(0) ).to.not.equal( model_a1 )
			expect( copy.at(0).get('id') ).to.equal 1
			expect( copy.at(0).get('title') ).to.be.equal "Hello World"
			expect( copy.at(1) ).to.not.equal( model_a2 )
			expect( copy.at(1).get('id') ).to.equal 2
			expect( copy.at(1).get('title') ).to.be.equal "Foo Bar"
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
			expect( collectionA.length() ).to.equal 3
			expect( collectionA.models() ).to.deep.equal models

			collectionA.reset()

			expect( collectionA.length() ).to.equal 0
			expect( collectionA.models() ).to.deep.equal []
		#END it
	#END describe
#END describe