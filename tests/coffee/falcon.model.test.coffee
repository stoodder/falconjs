describe "Testing Model Methods", ->
	beforeEach ->
		Falcon.baseApiUrl = ""
		Falcon.baseTemplateUrl = ""
	#END beforeEach

	#--------------------------------------------------------------
	#
	# Test the initialize() method
	#
	#--------------------------------------------------------------
	it "Should initialize correctly", ->
		class ModelA extends Falcon.Model
		#END class

		class ModelB extends Falcon.Model
		#END class

		init_stub = sinon.stub( ModelA::, "initialize" )

		model = new ModelA
		expect( init_stub ).to.have.been.calledOnce
		expect( init_stub ).to.have.been.calledWith()
		init_stub.reset()

		modelA = new ModelA( modelB = new ModelB )
		expect( init_stub ).to.have.been.calledOnce
		expect( init_stub ).to.have.been.calledWith()
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		modelA = new ModelA( data = {"hello": "world"} )
		expect( init_stub ).to.have.been.calledOnce
		expect( init_stub ).to.have.been.calledWith( data )
		expect( modelA.parent ).to.be.undefined
		init_stub.reset()

		modelA = new ModelA( data = {"hello": "world"}, modelB = new ModelB )
		expect( init_stub ).to.have.been.calledOnce
		expect( init_stub ).to.have.been.calledWith( data )
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		modelA = new ModelA( modelB = new ModelB, data = {"hello": "world"} )
		expect( init_stub ).to.have.been.calledOnce
		expect( init_stub ).to.have.been.calledWith( data )
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		modelA = new ModelA( dataModel = new Falcon.Model({"hello":"world"}), modelB = new ModelB )
		expect( init_stub ).to.have.been.calledOnce
		expect( init_stub ).to.have.been.calledWith( dataModel.unwrap() )
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		init_stub.restore()
	#END it

	#--------------------------------------------------------------
	#
	# Test the defaults initialization
	#
	#--------------------------------------------------------------
	it "Should create RawrModel with defaults that have correct arguments", ->
		hello_spy = null

		class RawrModel extends Falcon.Model
			defaults:
				'hello': ( hello_spy = sinon.spy() )
			#END defaults
		#END RawrModel
		
		expect( hello_spy ).to.not.have.been.called

		rawr_class = new RawrModel(input_data = {"one", "two", "three"})

		expect( hello_spy ).to.have.been.called
		expect( hello_spy.callCount ).to.equal 1
		expect( hello_spy.firstCall.args.length ).to.equal 1
		expect( hello_spy.firstCall.args[0] ).to.equal input_data
	#END it


	#--------------------------------------------------------------
	#
	# Test the get(), set(), and toggle() methods
	#
	#--------------------------------------------------------------
	it "Should test the get, set, and toggle methods", ->
		modelB = null

		class ModelA extends Falcon.Model
			initialize: ->
				@foo = ko.observable()
				@model_b = modelB = new ModelB
			#END initialize
		#END class

		class ModelB extends Falcon.Model
		#END class

		modelA = new ModelA
			"hello": "world"
			"foo": "bar"
			"truth": true
			"model_b": {"something": "cool"}
		#END modelA

		expect( modelA["hello"] ).to.be.equal "world"
		expect( modelA["foo"] ).to.be.a "function"
		expect( modelA["truth"] ).to.be.true
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.equal modelB

		expect( modelA.get("hello") ).to.be.equal "world"
		expect( modelA.get("foo") ).to.be.equal "bar"
		expect( modelA.get("truth") ).to.be.equal true
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.equal modelB

		modelA.set "foo", "baz"
		modelA.set "hello", "goodbye"

		expect( modelA.get("hello") ).to.be.equal "goodbye"
		expect( modelA.get("foo") ).to.be.equal "baz"
		expect( modelA.get("truth") ).to.be.equal true
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.equal modelB

		modelA.set
			"foo": "bar"
			"hello": "world"
		#END set

		expect( modelA.get("hello") ).to.be.equal "world"
		expect( modelA.get("foo") ).to.be.equal "bar"
		expect( modelA.get("truth") ).to.be.equal true
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.equal modelB

		modelA.toggle "truth"

		expect( modelA.get("hello") ).to.be.equal "world"
		expect( modelA.get("foo") ).to.be.equal "bar"
		expect( modelA.get("truth") ).to.be.equal false
		expect( modelA["model_b"] ).to.be.instanceOf ModelB
		expect( modelA["model_b"] ).to.be.equal modelB

		expect( modelB.get("something") ).to.be.equal "cool"
	#END it


	#--------------------------------------------------------------
	#
	# Test the fill() and serialize() methods
	#	TODO: Test multiple mapping of data (converting server keys to the same
	#		  model key).
	#
	#--------------------------------------------------------------
	it "Should test the fill and serialize methods", ->
		modelB = null
		modelB2 = null
		collectionC = null

		class ModelA extends Falcon.Model
			url: "model_a"

			initialize: ->
				@_client = ko.observable()
				@model_b = modelB = new ModelB
				@model_b2 = modelB2 = new ModelB
				@collection_c = collectionC = new CollectionC
			#END initialize
		#END class

		class ModelB extends Falcon.Model
			url: "model_b"
		#END class

		class ModelC extends Falcon.Model
		#END model C

		class CollectionC extends Falcon.Collection
			model: ModelC
		#END collection c

		data = {
			"id": 33
			"foo": "bar"
			"url": "MODEL_A2"
			"model_b": {
				"b_foo": "B BAR"
			}
			"model_b2": {
				"id": "test"
				"b_foo": "B BAR 2"
				"url": "model_b2"
			},
			"collection_c": [
				{"that": "That One"}
				{"that": "That Two"}
				{"that": "That Three"}
			]
		}
		modelA = new ModelA()
		modelA.fill( data )
		#END fill

		#TEST
		expect( modelA.get("id") ).to.be.equal 33
		expect( modelA.get("foo") ).to.be.equal "bar"
		expect( modelA.get("url") ).to.be.equal "MODEL_A2"
		
		expect( modelA.get("model_b") ).to.be.equal modelB
		expect( modelA.get("model_b").get("b_foo") ).to.be.equal "B BAR"
		expect( modelA.get("model_b").get("url") ).to.be.equal "model_b"
		
		expect( modelA.get("model_b2") ).to.be.equal modelB2
		expect( modelA.get("model_b2").get("id") ).to.be.equal "test"
		expect( modelA.get("model_b2").get("b_foo") ).to.be.equal "B BAR 2"
		expect( modelA.get("model_b2").get("url") ).to.be.equal "model_b2"
		
		expect( modelA.get("collection_c") ).to.be.equal collectionC
		expect( modelA.get("collection_c").length() ).to.equal 3
		expect( modelA.get("collection_c").first() ).to.be.instanceOf ModelC
		expect( modelA.get("collection_c").first().get("that") ).to.equal "That One"


		#TEST
		serialized = modelA.serialize()
		expect( serialized['id'] ).to.equal 33
		expect( serialized['foo'] ).to.equal "bar"

		expect( serialized['model_b'] ).to.be.a "object"
		expect( serialized['model_b']['id'] ).to.equal null
		expect( serialized['model_b']['b_foo'] ).to.equal "B BAR"

		expect( serialized['model_b2'] ).to.be.a "object"
		expect( serialized['model_b2']['id'] ).to.equal "test"
		expect( serialized['model_b2']['b_foo'] ).to.equal "B BAR 2"

		expect( serialized['collection_c'] ).to.be.a "array"
		expect( serialized['collection_c'] ).to.have.length 3
		expect( serialized['collection_c'][0] ).to.be.a "object"
		expect( serialized['collection_c'][0]['that'] ).to.equal "That One"


		#TEST
		serialized = modelA.serialize(["id", "foo"])
		expect( serialized['id'] ).to.equal 33
		expect( serialized['foo'] ).to.equal "bar"

		expect( serialized["model_b"] ).to.be.undefined
		expect( serialized["model_b2"] ).to.be.undefined
		expect( serialized["collection_c"] ).to.be.undefined


		#TEST
		serialized = modelA.serialize(["foo"])
		expect( serialized['foo'] ).to.equal "bar"

		expect( serialized['id'] ).to.be.undefined
		expect( serialized["model_b"] ).to.be.undefined
		expect( serialized["model_b2"] ).to.be.undefined
		expect( serialized["collection_c"] ).to.be.undefined

		#TEST
		serialized = modelA.serialize {
			"id": null
			"model_b2": {
				"b_foo": null
				"url": null
			}
		}

		expect( serialized['id'] ).to.equal 33

		expect( serialized['model_b2'] ).to.be.a "object"
		expect( serialized['model_b2']['b_foo'] ).to.equal "B BAR 2"

		expect( serialized["model_b"] ).to.be.undefined
		expect( serialized["collection_c"] ).to.be.undefined

		#TEST serialize shouldn't include prototype elements of Falcon.Object
		serialized = modelA.serialize()

		for key, value of serialized
			expect( Falcon.Object.prototype ).to.not.include.keys( key )
		#END for

		#TEST serialize shouldn't include prototype elements of Falcon.Model
		serialized = modelA.serialize()

		for key, value of serialized when key isnt "id"
			expect( Falcon.Model.prototype ).to.not.include.keys( key )
		#END for
	#END test fill


	#--------------------------------------------------------------
	#
	# Test the unwrap() method
	#
	#--------------------------------------------------------------
	it "Should test the unwrap method", ->
		modelB = null
		collectionC = null

		class ModelA extends Falcon.Model
			initialize: ->
				@foo = ko.observable()
				@model_b = modelB = new ModelB
				@collection_c = collectionC = new CollectionC
			#END initialize
		#END model a

		class ModelB extends Falcon.Model
			initialize: ->
				@something = ko.observable()
			#END initalize
		#END ModelB

		class ModelC extends Falcon.Model
			initialize: ->
				@hello = "world"
			#END initialize
		#END modelc

		class CollectionC extends Falcon.Collection
			model: ModelC
		#END CollectionC

		modelA = new ModelA
			"foo": "bar"
			"model_b": {
				"something": "cool"
			}
			"collection_c": [
				{"hello": "world"}
				{"hello": "world2"}
			]
		#END fill

		unwrapped = modelA.unwrap()
		expect( unwrapped['foo'] ).to.be.a "function"
		expect( unwrapped['foo']() ).to.equal "bar"
		expect( unwrapped['model_b'] ).to.be.a "object"
		expect( unwrapped['model_b']['something'] ).to.be.a "function"
		expect( unwrapped['model_b']['something']() ).to.equal "cool"
		expect( unwrapped['collection_c'] ).to.be.a "array"
		expect( unwrapped['collection_c'] ).to.have.length 2
		expect( unwrapped['collection_c'][0]['hello'] ).to.equal "world"
		expect( unwrapped['collection_c'][1]['hello'] ).to.equal "world2"

		#Make sure that we avoid having attributes from the Falcon.Model definition
		expect( unwrapped['id'] ).to.equal null
		expect( unwrapped['parent'] ).to.be.undefined
		expect( unwrapped['url'] ).to.be.undefined
	#END it


	#--------------------------------------------------------------
	#
	# Test the makeUrl() method
	#
	#--------------------------------------------------------------
	describe "Testing makeUrl combinations", ->
		class ModelA extends Falcon.Model
			url: "model_a"
		#END class Model A

		class ModelB extends Falcon.Model
			url: "/model_b"
		#END class ModelB

		class ModelC extends Falcon.Model
			url: "model_c.json"
		#END class ModelC

		class ModelD extends Falcon.Model
			url: "model_d.json"
		#END class ModelD

		class ModelE extends Falcon.Model
			url: ->
				return "model_e"
			#END url
		#END ModelC

		beforeEach ->
			Falcon.baseApiUrl = null
		#END beforeEach

		it "Should test the makeUrl method, numeric id, no baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)

			expect( modelA.makeUrl("GET") ).to.equal "/model_a/1"
			expect( modelA.makeUrl("POST") ).to.equal "/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "/model_a/1"
			expect( modelA.makeUrl("DELETE") ).to.equal "/model_a/1"
		#END it

		it "Should test the makeUrl method, string id, no baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")

			expect( modelB.makeUrl("GET") ).to.equal "/model_b/b"
			expect( modelB.makeUrl("POST") ).to.equal "/model_b"
			expect( modelB.makeUrl("PUT") ).to.equal "/model_b/b"
			expect( modelB.makeUrl("DELETE") ).to.equal "/model_b/b"
		#END it

		it "Should test the makeUrl method, numeric id, with shorter baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_a/1"
			expect( modelA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_a/1"
			expect( modelA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_a/1"
		#END it

		it "Should test the makeUrl method, string id, with shorter baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelB.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/b"
			expect( modelB.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b"
			expect( modelB.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/b"
			expect( modelB.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/b"
		#END it

		it "Should test the makeUrl method, numeric id, with baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_a/1"
			expect( modelA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_a/1"
			expect( modelA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_a/1"
		#END it

		it "Should test the makeUrl method, string id, with baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelB.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/b"
			expect( modelB.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b"
			expect( modelB.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/b"
			expect( modelB.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/b"
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 2, modelB)

			expect( modelA.makeUrl("GET") ).to.equal "/model_b/b/model_a/2"
			expect( modelA.makeUrl("POST") ).to.equal "/model_b/b/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "/model_b/b/model_a/2"
			expect( modelA.makeUrl("DELETE") ).to.equal "/model_b/b/model_a/2"
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 2, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/b/model_a/2"
			expect( modelA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/b/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/b/model_a/2"
			expect( modelA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/b/model_a/2"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3)

			expect( modelA.makeUrl("GET", modelB) ).to.equal "/model_b/b/model_a/3"
			expect( modelA.makeUrl("POST", modelB) ).to.equal "/model_b/b/model_a"
			expect( modelA.makeUrl("PUT", modelB) ).to.equal "/model_b/b/model_a/3"
			expect( modelA.makeUrl("DELETE", modelB) ).to.equal "/model_b/b/model_a/3"
		#END it

		it "Should test the makeUrl method, with baseUrl, with explicit parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_a/3"
			expect( modelA.makeUrl("POST", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_a"
			expect( modelA.makeUrl("PUT", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_a/3"
			expect( modelA.makeUrl("DELETE", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_a/3"
		#END it

		it "Should test the makeUrl method, no baseUrl, with overriden parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3, modelB)

			expect( modelA.makeUrl("GET", null) ).to.equal "/model_a/3"
			expect( modelA.makeUrl("POST", null) ).to.equal "/model_a"
			expect( modelA.makeUrl("PUT", null) ).to.equal "/model_a/3"
			expect( modelA.makeUrl("DELETE", null) ).to.equal "/model_a/3"
		#END it

		it "Should test the makeUrl method, with baseUrl, with overriden parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET", null) ).to.equal "http://www.falconjs.com/model_a/3"
			expect( modelA.makeUrl("POST", null) ).to.equal "http://www.falconjs.com/model_a"
			expect( modelA.makeUrl("PUT", null) ).to.equal "http://www.falconjs.com/model_a/3"
			expect( modelA.makeUrl("DELETE", null) ).to.equal "http://www.falconjs.com/model_a/3"
		#END it

		it "Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)

			expect( modelC.makeUrl("GET") ).to.equal "/model_c/1.json"
			expect( modelC.makeUrl("POST") ).to.equal "/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "/model_c/1.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "/model_c/1.json"
		#END it

		it "Should test the makeUrl method, numeric index, with shorter baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelC.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_c/1.json"
			expect( modelC.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_c/1.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_c/1.json"
		#END it

		it "Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_c/1.json"
			expect( modelC.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_c/1.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_c/1.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 2, modelB)

			expect( modelC.makeUrl("GET") ).to.equal "/model_b/b/model_c/2.json"
			expect( modelC.makeUrl("POST") ).to.equal "/model_b/b/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "/model_b/b/model_c/2.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "/model_b/b/model_c/2.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 2, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_b/b/model_c/2.json"
			expect( modelC.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_b/b/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_b/b/model_c/2.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_b/b/model_c/2.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 3)

			expect( modelC.makeUrl("GET", modelB) ).to.equal "/model_b/b/model_c/3.json"
			expect( modelC.makeUrl("POST", modelB) ).to.equal "/model_b/b/model_c.json"
			expect( modelC.makeUrl("PUT", modelB) ).to.equal "/model_b/b/model_c/3.json"
			expect( modelC.makeUrl("DELETE", modelB) ).to.equal "/model_b/b/model_c/3.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with  explicit parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_c/3.json"
			expect( modelC.makeUrl("POST", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_c.json"
			expect( modelC.makeUrl("PUT", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_c/3.json"
			expect( modelC.makeUrl("DELETE", modelB) ).to.equal "http://www.falconjs.com/model_b/b/model_c/3.json"
		#END it

		it "Should test the makeUrl method, string index, no baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")

			expect( modelD.makeUrl("GET") ).to.equal "/model_d/d.json"
			expect( modelD.makeUrl("POST") ).to.equal "/model_d.json"
			expect( modelD.makeUrl("PUT") ).to.equal "/model_d/d.json"
			expect( modelD.makeUrl("DELETE") ).to.equal "/model_d/d.json"
		#END it

		it "Should test the makeUrl method, string index, with shorter baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelD.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_d/d.json"
			expect( modelD.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_d.json"
			expect( modelD.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_d/d.json"
			expect( modelD.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_d/d.json"
		#END it

		it "Should test the makeUrl method, string index, with baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelD.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_d/d.json"
			expect( modelD.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_d.json"
			expect( modelD.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_d/d.json"
			expect( modelD.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_d/d.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 2, modelD)

			expect( modelA.makeUrl("GET") ).to.equal "/model_d/d/model_a/2"
			expect( modelA.makeUrl("POST") ).to.equal "/model_d/d/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "/model_d/d/model_a/2"
			expect( modelA.makeUrl("DELETE") ).to.equal "/model_d/d/model_a/2"
		#END it

		it "Should test the makeUrl method, with baseUrl, with non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 2, modelD)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_d/d/model_a/2"
			expect( modelA.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_d/d/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_d/d/model_a/2"
			expect( modelA.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_d/d/model_a/2"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 3)

			expect( modelA.makeUrl("GET", modelD) ).to.equal "/model_d/d/model_a/3"
			expect( modelA.makeUrl("POST", modelD) ).to.equal "/model_d/d/model_a"
			expect( modelA.makeUrl("PUT", modelD) ).to.equal "/model_d/d/model_a/3"
			expect( modelA.makeUrl("DELETE", modelD) ).to.equal "/model_d/d/model_a/3"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_a/3"
			expect( modelA.makeUrl("POST", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_a"
			expect( modelA.makeUrl("PUT", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_a/3"
			expect( modelA.makeUrl("DELETE", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_a/3"
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 2, modelD)

			expect( modelC.makeUrl("GET") ).to.equal "/model_d/d/model_c/2.json"
			expect( modelC.makeUrl("POST") ).to.equal "/model_d/d/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "/model_d/d/model_c/2.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "/model_d/d/model_c/2.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 2, modelD)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET") ).to.equal "http://www.falconjs.com/model_d/d/model_c/2.json"
			expect( modelC.makeUrl("POST") ).to.equal "http://www.falconjs.com/model_d/d/model_c.json"
			expect( modelC.makeUrl("PUT") ).to.equal "http://www.falconjs.com/model_d/d/model_c/2.json"
			expect( modelC.makeUrl("DELETE") ).to.equal "http://www.falconjs.com/model_d/d/model_c/2.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with  explicit parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 3)

			expect( modelC.makeUrl("GET", modelD) ).to.equal "/model_d/d/model_c/3.json"
			expect( modelC.makeUrl("POST", modelD) ).to.equal "/model_d/d/model_c.json"
			expect( modelC.makeUrl("PUT", modelD) ).to.equal "/model_d/d/model_c/3.json"
			expect( modelC.makeUrl("DELETE", modelD) ).to.equal "/model_d/d/model_c/3.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with explicit parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_c/3.json"
			expect( modelC.makeUrl("POST", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_c.json"
			expect( modelC.makeUrl("PUT", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_c/3.json"
			expect( modelC.makeUrl("DELETE", modelD) ).to.equal "http://www.falconjs.com/model_d/d/model_c/3.json"
		#END it

		it "Should be able to use url as a function, no parent", ->
			modelE = new ModelE(id: "e")

			expect( modelE.makeUrl("GET") ).to.equal "/model_e/e"
			expect( modelE.makeUrl("POST") ).to.equal "/model_e"
			expect( modelE.makeUrl("PUT") ).to.equal "/model_e/e"
			expect( modelE.makeUrl("DELETE") ).to.equal "/model_e/e"
		#END it

		it "Should be able to use url as a function, with parent", ->
			modelE = new ModelE(id: "e", new ModelB(id: "b") )

			expect( modelE.makeUrl("GET") ).to.equal "/model_b/b/model_e/e"
			expect( modelE.makeUrl("POST") ).to.equal "/model_b/b/model_e"
			expect( modelE.makeUrl("PUT") ).to.equal "/model_b/b/model_e/e"
			expect( modelE.makeUrl("DELETE") ).to.equal "/model_b/b/model_e/e"
		#END it

		it "Should be able to use override the url, no parent", ->
			modelE = new ModelE(id: "e", url: "model_e2")

			expect( modelE.makeUrl("GET") ).to.equal "/model_e2/e"
			expect( modelE.makeUrl("POST") ).to.equal "/model_e2"
			expect( modelE.makeUrl("PUT") ).to.equal "/model_e2/e"
			expect( modelE.makeUrl("DELETE") ).to.equal "/model_e2/e"
		#END it

		it "Should be able to use override the url,with parent", ->
			modelE = new ModelE({id: "e", url: "model_e3"}, new ModelB(id: "b") )

			expect( modelE.makeUrl("GET") ).to.equal "/model_b/b/model_e3/e"
			expect( modelE.makeUrl("POST") ).to.equal "/model_b/b/model_e3"
			expect( modelE.makeUrl("PUT") ).to.equal "/model_b/b/model_e3/e"
			expect( modelE.makeUrl("DELETE") ).to.equal "/model_b/b/model_e3/e"
		#END it

		it "Should be able to handle '/' baseApiUrl", ->
			modelA = new ModelA({id: 1})
			Falcon.baseApiUrl = "/"

			expect( modelA.makeUrl("GET") ).to.equal "/model_a/1"
			expect( modelA.makeUrl("POST") ).to.equal "/model_a"
			expect( modelA.makeUrl("PUT") ).to.equal "/model_a/1"
			expect( modelA.makeUrl("DELETE") ).to.equal "/model_a/1"
	#END describe


	#--------------------------------------------------------------
	#
	# Test the sync() method
	#	TODO: Break this up
	#
	#--------------------------------------------------------------
	describe "Tesing model sync methods", ->
		describe "Testing Sync Method Aliases", ->
			class ModelA extends Falcon.Model
				url: "model_a"
			#END ModelA

			modelA = null
			sync_stub = null

			beforeEach ->
				sync_stub = sinon.stub( ModelA::, "sync" )
				modelA = new ModelA
			#END beforeEach

			afterEach ->
				sync_stub.restore()
			#END afterEach

			it "Should call sync correctly on fetch without options", ->
				modelA.fetch()
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "GET", undefined
			#END it

			it "Should call sync correctly on fetch with options", ->
				modelA.fetch({})
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "GET", {}
			#END it

			it "Should call sync correctly on create without options", ->
				modelA.create()
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "POST", undefined
			#END it

			it "Should call sync correctly on create with options", ->
				modelA.create({})
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "POST", {}

			it "Should call sync correctly on save without options", ->
				modelA.set('id',1)
				modelA.save()
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "PUT", undefined
			#END it

			it "Should call sync correctly on save with options", ->
				modelA.set('id',1)
				modelA.save({})
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "PUT", {}

			it "Should call sync correctly on destroy without options", ->
				modelA.destroy()
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "DELETE", undefined
			#END it

			it "Should call sync correctly on destroy with options", ->
				modelA.destroy({})
				expect( sync_stub ).to.have.been.calledOnce
				expect( sync_stub ).to.have.been.calledWith "DELETE", {}
			#END it
		#END describe

		describe "Testing sync method $.ajax calls", ->
			class ModelA extends Falcon.Model
				url: "model_a"
			#END ModelA

			ajax_stub = null

			beforeEach ->
				ajax_stub = sinon.stub(jQuery, "ajax")
				Falcon.cache = false
			#END beforeEach

			afterEach ->
				ajax_stub.restore()
			#END afterEach

			it "Should fetch properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.fetch()

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "GET"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("GET")}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: ""}
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: false}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3
				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1
				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
			#END it

			it "Should fetch properly with options", ->
				modelA = new ModelA(id: 1)
				Falcon.cache = true
				modelA.fetch
					url: "http://www.falconjs.com"
					data: {"hello": "world"}
					contentType: "text/html"
					headers: {"User-Agent", "Chrome"}
					success: ( _success = -> )
					error: ( _error = -> )
					complete: ( _complete = -> )
				#END fetch

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "GET"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: JSON.stringify("hello": "world")}
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "text/html"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: true}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {"User-Agent", "Chrome"}}
				
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

			it "Should save properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.save()

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "PUT"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("PUT")}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: JSON.stringify("id": 1) }
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: false}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3
				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1
				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
			#END it

			it "Should save properly with options", ->
				modelA = new ModelA(id: 1)
				Falcon.cache = true
				modelA.save
					url: "http://www.falconjs.com"
					data: {"hello": "world"}
					contentType: "text/html"
					headers: {"User-Agent", "Chrome"}
					success: ( _success = -> )
					error: ( _error = -> )
					complete: ( _complete = -> )
				#END save

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "PUT"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: JSON.stringify("hello": "world")}
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "text/html"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: true}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {"User-Agent", "Chrome"}}
				
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

			it "Should create properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.create()

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "POST"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("POST")}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: JSON.stringify("id": 1) }
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: false}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3
				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1
				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
			#END it

			it "Should create properly with options", ->
				modelA = new ModelA(id: 1)
				Falcon.cache = true
				modelA.create
					url: "http://www.falconjs.com"
					data: {"hello": "world"}
					contentType: "text/html"
					headers: {"User-Agent", "Chrome"}
					success: ( _success = -> )
					error: ( _error = -> )
					complete: ( _complete = -> )
				#END create

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "POST"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: JSON.stringify("hello": "world")}
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "text/html"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: true}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {"User-Agent", "Chrome"}}
				
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

			it "Should destroy properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.destroy()

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "DELETE"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("DELETE")}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: "" }
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: false}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3
				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1
				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
			#END it

			it "Should destroy properly with options", ->
				modelA = new ModelA(id: 1)
				Falcon.cache = true
				modelA.destroy
					url: "http://www.falconjs.com"
					data: {"hello": "world"}
					contentType: "text/html"
					headers: {"User-Agent", "Chrome"}
					success: ( _success = -> )
					error: ( _error = -> )
					complete: ( _complete = -> )
				#END destroy

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "DELETE"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: JSON.stringify("hello": "world")}
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "text/html"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: true}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {"User-Agent", "Chrome"}}
				
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
			class ModelA extends Falcon.Model
				url: "model_a"
			#END ModelA

			server = null
			modelA = null

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

				modelA = new ModelA
				data = {"hello": "world"}
				error_data = {"error": "Something Wrong"}
				success_data = {"foo": "bar"}
				parse_stub = sinon.stub(modelA, "parse").returns( success_data )
				fill_stub = sinon.stub(modelA, "fill")

				modelA.on "fetch", ( fetch_spy = sinon.spy() )
				modelA.on "create", ( create_spy = sinon.spy() )
				modelA.on "save", ( save_spy = sinon.spy() )
				modelA.on "destroy", ( destroy_spy = sinon.spy() )

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
				modelA.fetch( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).to.equal 1
				expect( parse_stub.firstCall.args[0] ).to.deep.equal data

				expect( fill_stub.callCount ).to.equal 1
				expect( fill_stub.firstCall.args[0] ).to.deep.equal success_data

				expect( fill_stub ).to.have.been.calledAfter parse_stub

				expect( fetch_spy ).to.have.been.calledOnce
				expect( create_spy ).to.not.have.been.called
				expect( save_spy ).to.not.have.been.called
				expect( destroy_spy ).to.not.have.been.called

				expect( fetch_spy ).to.have.been.calledAfter fill_stub

				expect( success_spy.callCount ).to.equal 1
				expect( success_spy ).to.have.been.calledOn modelA
				expect( success_spy.firstCall.args.length ).to.equal 4
				expect( success_spy.firstCall.args[0] ).to.equal modelA

				expect( error_spy ).to.not.have.been.called

				expect( complete_spy.callCount ).to.equal 1
				expect( complete_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args.length ).to.equal 3
				expect( complete_spy.firstCall.args[0] ).to.equal modelA
				expect( complete_spy ).to.have.been.calledAfter success_spy
			#END it

			it "Should not fill when fill option is false on fetch", ->
				options.fill = false
				modelA.fetch( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).to.equal 1
				expect( parse_stub.firstCall.args[0] ).to.deep.equal data

				expect( fill_stub.callCount ).to.equal 0

				expect( fetch_spy ).to.have.been.calledOnce
				expect( create_spy ).to.not.have.been.called
				expect( save_spy ).to.not.have.been.called
				expect( destroy_spy ).to.not.have.been.called

				expect( fetch_spy ).to.have.been.calledAfter parse_stub

				expect( success_spy.callCount ).to.equal 1
				expect( success_spy ).to.have.been.calledOn modelA
				expect( success_spy.firstCall.args.length ).to.equal 4
				expect( success_spy.firstCall.args[0] ).to.equal modelA

				expect( error_spy ).to.not.have.been.called

				expect( complete_spy.callCount ).to.equal 1
				expect( complete_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args.length ).to.equal 3
				expect( complete_spy.firstCall.args[0] ).to.equal modelA
				expect( complete_spy ).to.have.been.calledAfter success_spy
			#END it

			it "Should call the error response on an errornous result", ->
				modelA.fetch( options )

				server.respondWith [ 400, {}, JSON.stringify(error_data) ]
				server.respond()

				expect( parse_stub.callCount ).to.equal 0
				expect( fill_stub.callCount ).to.equal 0

				expect( fetch_spy ).to.not.have.been.called
				expect( create_spy ).to.not.have.been.called
				expect( save_spy ).to.not.have.been.called
				expect( destroy_spy ).to.not.have.been.called

				expect( success_spy.callCount ).to.equal 0

				expect( error_spy.callCount ).to.equal 1
				expect( error_spy.firstCall.args.length ).to.equal 3
				expect( error_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args[0] ).to.equal modelA

				expect( complete_spy.callCount ).to.equal 1
				expect( complete_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args.length ).to.equal 3
				expect( complete_spy.firstCall.args[0] ).to.equal modelA
				expect( complete_spy ).to.have.been.calledAfter error_spy
			#END it

			it "Should call the success response on create", ->
				modelA.create( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).to.equal 1
				expect( parse_stub.firstCall.args[0] ).to.deep.equal data

				expect( fill_stub.callCount ).to.equal 1
				expect( fill_stub.firstCall.args[0] ).to.deep.equal success_data

				expect( fill_stub ).to.have.been.calledAfter parse_stub

				expect( fetch_spy ).to.not.have.been.called
				expect( create_spy.callCount ).to.equal 1
				expect( save_spy ).to.not.have.been.called
				expect( destroy_spy ).to.not.have.been.called

				expect( success_spy.callCount ).to.equal 1
				expect( success_spy ).to.have.been.calledOn modelA
				expect( success_spy.firstCall.args.length ).to.equal 4
				expect( success_spy.firstCall.args[0] ).to.equal modelA

				expect( error_spy ).to.not.have.been.called

				expect( complete_spy.callCount ).to.equal 1
				expect( complete_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args.length ).to.equal 3
				expect( complete_spy.firstCall.args[0] ).to.equal modelA
				expect( complete_spy ).to.have.been.calledAfter success_spy
			#END it

			it "Should call the success response on save", ->
				modelA.set('id', 1)
				modelA.save( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).to.equal 1
				expect( parse_stub.firstCall.args[0] ).to.deep.equal data

				expect( fill_stub.callCount ).to.equal 1
				expect( fill_stub.firstCall.args[0] ).to.deep.equal success_data

				expect( fill_stub ).to.have.been.calledAfter parse_stub

				expect( fetch_spy ).to.not.have.been.called
				expect( create_spy ).to.not.have.been.called
				expect( save_spy.callCount ).to.equal 1
				expect( destroy_spy ).to.not.have.been.called

				expect( success_spy.callCount ).to.equal 1
				expect( success_spy ).to.have.been.calledOn modelA
				expect( success_spy.firstCall.args.length ).to.equal 4
				expect( success_spy.firstCall.args[0] ).to.equal modelA

				expect( error_spy ).to.not.have.been.called

				expect( complete_spy.callCount ).to.equal 1
				expect( complete_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args.length ).to.equal 3
				expect( complete_spy.firstCall.args[0] ).to.equal modelA
				expect( complete_spy ).to.have.been.calledAfter success_spy
			#END it

			it "Should call the success response on destroy", ->
				modelA.destroy( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				expect( parse_stub.callCount ).to.equal 1
				expect( parse_stub.firstCall.args[0] ).to.deep.equal data

				expect( fill_stub.callCount ).to.equal 1
				expect( fill_stub.firstCall.args[0] ).to.deep.equal success_data

				expect( fill_stub ).to.have.been.calledAfter parse_stub

				expect( fetch_spy ).to.not.have.been.called
				expect( create_spy ).to.not.have.been.called
				expect( save_spy ).to.not.have.been.called
				expect( destroy_spy.callCount ).to.equal 1

				expect( success_spy.callCount ).to.equal 1
				expect( success_spy ).to.have.been.calledOn modelA
				expect( success_spy.firstCall.args.length ).to.equal 4
				expect( success_spy.firstCall.args[0] ).to.equal modelA

				expect( error_spy ).to.not.have.been.called

				expect( complete_spy.callCount ).to.equal 1
				expect( complete_spy ).to.have.been.calledOn modelA
				expect( complete_spy.firstCall.args.length ).to.equal 3
				expect( complete_spy.firstCall.args[0] ).to.equal modelA
				expect( complete_spy ).to.have.been.calledAfter success_spy
			#END it
		#END describe

		describe "Testing sync method options in depth", ->
			class ModelA extends Falcon.Model
				url: "model_a"
			#END ModelA

			class ModelB extends Falcon.Model
				url: "model_b"
			#END class

			ajax_stub = null

			beforeEach ->
				ajax_stub = sinon.stub(jQuery, "ajax")
				Falcon.cache = false
			#END beforeEach

			afterEach ->
				ajax_stub.restore()
			#END afterEach

			it "Should sync properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.sync('GET')

				expect( ajax_stub ).to.have.been.calledOnce
				expect( ajax_stub ).to.have.been.calledWithMatch {type: "GET"}
				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("GET")}
				expect( ajax_stub ).to.have.been.calledWithMatch {data: ""}
				expect( ajax_stub ).to.have.been.calledWithMatch {contentType: "application/json"}
				expect( ajax_stub ).to.have.been.calledWithMatch {cache: false}
				expect( ajax_stub ).to.have.been.calledWithMatch {headers: {}}
				expect( ajax_stub.firstCall.args[0].success ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].success ).to.have.length 3
				expect( ajax_stub.firstCall.args[0].error ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].error ).to.have.length 1
				expect( ajax_stub.firstCall.args[0].complete ).to.be.a "function"
				expect( ajax_stub.firstCall.args[0].complete ).to.have.length 2
			#END it

			it "Should allow for a specified parent to override", ->
				modelA = new ModelA(id: 1, new ModelB(id: 'b'))
				modelA.sync 'GET',
					parent: (model_b = new ModelB(id: 'b2'))
				#END sync

				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("GET", model_b)}
			#END it

			it "Should allow for a null parent", ->
				modelA = new ModelA(id: 1, new ModelB(id: 'b'))
				modelA.sync 'GET',
					parent: null
				#END sync

				expect( ajax_stub ).to.have.been.calledWithMatch {url: modelA.makeUrl("GET", null)}
			#END it
		#END describe

		describe "Additional miscellaneous sync tests", ->
			class ModelA extends Falcon.Model
				url: "model_a"
			#END ModelA

			class ModelB extends Falcon.Model
				url: "model_b"
			#END class

			server = null

			beforeEach ->
				server = sinon.fakeServer.create()
				Falcon.cache = false
			#END beforeEach

			afterEach ->
				server.restore()
			#END afterEach

			it "Should allow for a third parameter to define the context", ->
				modelB = new ModelB(id: 'b')
				modelA = new ModelA(id: 1)
				modelA.sync("GET", ( success_spy = sinon.spy() ), modelB)

				server.respondWith [ 200, {}, JSON.stringify(modelA.serialize()) ]
				server.respond()

				expect( success_spy ).to.have.been.called
				expect( success_spy ).to.have.been.calledOn modelB
			#END it

			it "Should let pass context from fetch to sync", ->
				modelB = new ModelB(id: 'b')
				modelA = new ModelA(id: 1)

				sync_stub = sinon.stub( modelA, "sync" )
				modelA.fetch( ( success_spy = sinon.spy() ), modelB )

				expect( sync_stub ).to.have.been.called
				expect( sync_stub.firstCall.args[1] ).to.equal success_spy
				expect( sync_stub.firstCall.args[2] ).to.equal modelB
			#END it

			it "Should let pass context from create to sync", ->
				modelB = new ModelB(id: 'b')
				modelA = new ModelA(id: 1)

				sync_stub = sinon.stub( modelA, "sync" )
				modelA.create( ( success_spy = sinon.spy() ), modelB )

				expect( sync_stub ).to.have.been.called
				expect( sync_stub.firstCall.args[1] ).to.equal success_spy
				expect( sync_stub.firstCall.args[2] ).to.equal modelB
			#END it

			it "Should let pass context from save to sync", ->
				modelB = new ModelB(id: 'b')
				modelA = new ModelA(id: 1)

				sync_stub = sinon.stub( modelA, "sync" )
				modelA.save( ( success_spy = sinon.spy() ), modelB )

				expect( sync_stub ).to.have.been.called
				expect( sync_stub.firstCall.args[1] ).to.equal success_spy
				expect( sync_stub.firstCall.args[2] ).to.equal modelB
			#END it

			it "Should let pass context from destroy to sync", ->
				modelB = new ModelB(id: 'b')
				modelA = new ModelA(id: 1)

				sync_stub = sinon.stub( modelA, "sync" )
				modelA.destroy( ( success_spy = sinon.spy() ), modelB )

				expect( sync_stub ).to.have.been.called
				expect( sync_stub.firstCall.args[1] ).to.equal success_spy
				expect( sync_stub.firstCall.args[2] ).to.equal modelB
			#END it
		#END describe
	#END describe


	#--------------------------------------------------------------
	#
	# Test the equals() method
	#
	#--------------------------------------------------------------
	it "Should match equality properly", ->
		class ModelA extends Falcon.Model
		#END modelA

		modelA_1 = new ModelA(id: 1)
		modelA_2 = new ModelA(id: 2)
		modelA_a = new ModelA(id: 'a')
		modelA_null_1 = new ModelA
		modelA_null_2 = new ModelA

		expect( modelA_1.equals( modelA_1 ) ).to.be.true
		expect( modelA_1.equals( modelA_2 ) ).to.be.false
		expect( modelA_1.equals( 1 ) ).to.be.true
		expect( modelA_1.equals( new ModelA(id: 1) ) ).to.be.true

		expect( modelA_a.equals( modelA_a ) ).to.be.true
		expect( modelA_a.equals( modelA_2 ) ).to.be.false
		expect( modelA_a.equals( 'a' ) ).to.be.true
		expect( modelA_a.equals( new ModelA(id: 'a') ) ).to.be.true

		expect( modelA_null_1.equals(modelA_null_2) ).to.be.false
		expect( modelA_null_1.equals(modelA_null_1) ).to.be.true
	#END if


	#--------------------------------------------------------------
	#
	# Test the mixin() method
	#
	#--------------------------------------------------------------
	describe "Testing the mixin method", ->
		it "Should implement mixins properly", ->
			class ModelA extends Falcon.Model
				initialize: -> @model_b = new ModelB
			#END model a

			class ModelB extends Falcon.Model
			#END ModelB

			modelA = new ModelA

			expect( modelA.hello ).to.be.undefined
			expect( modelA.foo ).to.be.undefined
			expect( modelA.model_b.test ).to.be.undefined

			modelA.mixin {
				"hello": ( mixin_spy = sinon.spy() )
				"foo": ko.observable( "bar" )
				"model_b": {
					"test": "123"
				}
			}

			expect( modelA.hello ).not.to.be.undefined
			expect( modelA.hello ).to.be.a 'function'
			expect( ko.isObservable( modelA.foo ) ).to.be.true
			expect( modelA.foo() ).to.equal 'bar'
			expect( modelA.model_b.test ).not.to.be.undefined
			expect( modelA.model_b.test ).to.equal '123'

			modelA.hello('world')
			expect( mixin_spy ).to.have.been.calledOnce
			expect( mixin_spy ).to.have.been.calledOn modelA
			expect( mixin_spy.firstCall.args[0] ).to.equal modelA
			expect( mixin_spy.firstCall.args[1] ).to.equal 'world'
		#END it

		it "Should preserve existing values in the model", ->
			class ModelA extends Falcon.Model
			#END model a

			model_a = new ModelA({"hello": "world", "foo": "bar"})

			expect( model_a.get("hello") ).to.equal "world"
			expect( model_a.get("foo") ).to.equal "bar"
			expect( ko.isObservable( model_a.hello ) ).to.be.false

			model_a.mixin
				"hello": ko.observable()
				"foo": "baz"
			#END mixin

			expect( model_a.get("hello") ).to.equal "world"
			expect( model_a.get("foo") ).to.equal "bar"
			expect( ko.isObservable( model_a.hello ) ).to.be.true
		#END it
	#END describe

	#--------------------------------------------------------------
	#
	# Test the clone() method
	#
	#--------------------------------------------------------------
	describe "Testing clone() method", ->
		class ModelA extends Falcon.Model
			initialize: ->
				@foo = ko.observable()
			#END initialzie
		#END ModelA

		class ModelB extends Falcon.Model
		#END ModelB

		class ModelC extends Falcon.Model
		#END ModelB

		it "Should do a basic clone properly", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone()

			expect( modelA1 ).to.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).to.exist

			expect( modelA2.id ).to.equal 1
			expect( modelA2.parent ).to.equal modelB
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.equal "bar"
		#END it

		it "Should do clone properly additional fields properly", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["id", "foo"])

			expect( modelA1 ).to.not.equal modelA2

			expect( modelA2.hello ).not.to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).to.exist

			expect( modelA2.id ).to.equal 1
			expect( modelA2.parent ).to.equal modelB
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.equal "bar"
		#END it

		it "Should do clone properly additional fields properly without parent", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["id", "hello"], null)

			expect( modelA1 ).to.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).not.to.exist

			expect( modelA2.id ).to.equal 1
			expect( modelA2.parent ).to.equal null
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do clone properly with additional fields properly without parent or id fields", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["hello"], null)

			expect( modelA1 ).to.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.parent ).not.to.exist

			expect( modelA2.id ).to.equal null
			expect( modelA2.parent ).to.equal null
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do clone properly additional fields properly with new parent", ->
			modelC = new ModelC()
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["id", "hello"], modelC)

			expect( modelA1 ).to.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).to.exist
			expect( modelA2.parent ).to.equal modelC

			expect( modelA2.id ).to.equal 1
			expect( modelA2.parent ).to.equal modelC
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do clone properly additional fields properly with new parent or id fields", ->
			modelC = new ModelC()
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["hello"], modelC)

			expect( modelA1 ).to.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.parent ).to.exist
			expect( modelA2.parent ).to.equal modelC

			expect( modelA2.id ).to.equal null
			expect( modelA2.parent ).to.equal modelC
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the isNew() method
	#
	#--------------------------------------------------------------
	it "Should properly detect if the model is new or not", ->
		class ModelA extends Falcon.Model
		#END ModelA

		modelA = new ModelA
		expect( modelA.isNew() ).to.be.true

		modelA = new ModelA(id: 1)
		expect( modelA.isNew() ).to.be.false

		modelA = new ModelA(id: 'a')
		expect( modelA.isNew() ).to.be.false
	#END it
#END describe



