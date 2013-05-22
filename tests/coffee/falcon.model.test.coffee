describe "Testing Model Methods", ->
	beforeEach ->
		Falcon.baseApiUrl = ""
		Falcon.baseTemplateUrl = ""
	#END beforeEach

	#--------------------------------------------------------------
	#
	# Test the initialize() method
	#	TODO: Test array 'fields' attribute
	#
	#--------------------------------------------------------------
	it "Should initialize correctly", ->
		class ModelA extends Falcon.Model
		#END class

		class ModelB extends Falcon.Model
		#END class

		init_stub = sinon.stub( ModelA::, "initialize" )

		model = new ModelA
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith()
		init_stub.reset()

		modelA = new ModelA( modelB = new ModelB )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith()
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		modelA = new ModelA( data = {"hello": "world"} )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( data )
		expect( modelA.parent ).to.be.undefined
		init_stub.reset()

		modelA = new ModelA( data = {"hello": "world"}, modelB = new ModelB )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( data )
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		modelA = new ModelA( modelB = new ModelB, data = {"hello": "world"} )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( data )
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		modelA = new ModelA( dataModel = new Falcon.Model({"hello":"world"}), modelB = new ModelB )
		init_stub.should.have.been.calledOnce
		init_stub.should.have.been.calledWith( dataModel.unwrap() )
		expect( modelA.parent ).to.be.equal( modelB )
		init_stub.reset()

		init_stub.restore()
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

			fields: {
				"foo"
				"model_b"
				"model_b2"
				"collection_c"
				"_server": "_client"
				"url": "_url"
			}
			initialize: ->
				@_client = ko.observable()
				@model_b = modelB = new ModelB
				@model_b2 = modelB2 = new ModelB
				@collection_c = collectionC = new CollectionC
			#END initialize
		#END class

		class ModelB extends Falcon.Model
			url: "model_b"
			fields: {
				"b_foo": "b_bar"
			}
		#END class

		class ModelC extends Falcon.Model
			fields: {
				"this": "that"
			}
		#END model C

		class CollectionC extends Falcon.Collection
			model: ModelC
		#END collection c

		server_data = {
			"id": 33
			"foo": "bar"
			"_server": "Some Data"
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
				{"this": "That One"}
				{"this": "That Two"}
				{"this": "That Three"}
			]
		}
		modelA = new ModelA()
		modelA.fill( server_data )
		#END fill


		expect( modelA.get("id") ).to.be.equal 33
		expect( modelA.get("foo") ).to.be.equal "bar"
		expect( modelA.get("_server") ).to.be.undefined
		expect( modelA.get("_client") ).to.be.equal "Some Data"
		expect( modelA.get("url") ).to.be.equal "model_a"
		expect( modelA.get("_url") ).to.be.equal "MODEL_A2"
		
		expect( modelA.get("model_b") ).to.be.equal modelB
		expect( modelA.get("model_b").get("b_foo") ).to.be.undefined
		expect( modelA.get("model_b").get("b_bar") ).to.be.equal "B BAR"
		expect( modelA.get("model_b").get("url") ).to.be.equal "model_b"
		
		expect( modelA.get("model_b2") ).to.be.equal modelB2
		expect( modelA.get("model_b2").get("id") ).to.be.equal "test"
		expect( modelA.get("model_b2").get("b_foo") ).to.be.undefined
		expect( modelA.get("model_b2").get("b_bar") ).to.be.equal "B BAR 2"
		expect( modelA.get("model_b2").get("url") ).to.be.equal "model_b2"
		
		expect( modelA.get("collection_c") ).to.be.instanceOf CollectionC
		expect( modelA.get("collection_c") ).to.be.equal collectionC
		expect( modelA.get("collection_c").length() ).to.equal 3
		expect( modelA.get("collection_c").first() ).to.be.instanceOf ModelC
		expect( modelA.get("collection_c").first().get("this") ).to.be.undefined
		expect( modelA.get("collection_c").first().get("that") ).to.equal "That One"


		serialized = modelA.serialize()
		serialized['id'].should.equal 33
		serialized['foo'].should.equal "bar"
		serialized['_server'].should.equal "Some Data"

		serialized['model_b'].should.be.a "object"
		expect( serialized['model_b']['id'] ).to.equal null
		serialized['model_b']['b_foo'].should.equal "B BAR"

		serialized['model_b2'].should.be.a "object"
		serialized['model_b2']['id'].should.equal "test"
		serialized['model_b2']['b_foo'].should.equal "B BAR 2"

		serialized['collection_c'].should.be.a "array"
		serialized['collection_c'].should.have.length 3
		serialized['collection_c'][0].should.be.a "object"
		serialized['collection_c'][0]['this'].should.equal "That One"

		expect( serialized['_client'] ).to.be.undefined
		expect( serialized["model_b"]['b_bar'] ).to.be.undefined
		expect( serialized["model_b2"]['b_bar'] ).to.be.undefined
		expect( serialized['collection_c'][0]['that'] ).to.be.undefined


		serialized = modelA.serialize(["id", "_client"])
		serialized['id'].should.equal 33
		serialized['_server'].should.equal "Some Data"

		expect( serialized['foo'] ).to.be.undefined
		expect( serialized['_client'] ).to.be.undefined
		expect( serialized["model_b"] ).to.be.undefined
		expect( serialized["model_b2"] ).to.be.undefined
		expect( serialized["collection_c"] ).to.be.undefined


		serialized = modelA.serialize(["_client"])
		serialized['_server'].should.equal "Some Data"

		expect( serialized['id'] ).to.be.undefined
		expect( serialized['foo'] ).to.be.undefined
		expect( serialized['_client'] ).to.be.undefined
		expect( serialized["model_b"] ).to.be.undefined
		expect( serialized["model_b2"] ).to.be.undefined
		expect( serialized["collection_c"] ).to.be.undefined
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
			fields: {
				"quux": "foo"
			}
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
		modelA.fill
			"quux": "bar"
			"model_b": {
				"something": "cool"
			}
			"collection_c": [
				{"hello": "world"}
				{"hello": "world2"}
			]
		#END fill

		unwrapped = modelA.unwrap()
		expect( unwrapped['quux'] ).to.be.undefined
		unwrapped['foo'].should.be.a "function"
		unwrapped['foo']().should.equal "bar"
		unwrapped['model_b'].should.be.a "object"
		unwrapped['model_b']['something'].should.be.a "function"
		unwrapped['model_b']['something']().should.equal "cool"
		unwrapped['collection_c'].should.be.a "array"
		unwrapped['collection_c'].should.have.length 2
		unwrapped['collection_c'][0]['hello'].should.equal "world"
		unwrapped['collection_c'][1]['hello'].should.equal "world2"
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

			modelA.makeUrl("GET").should.equal "/model_a/1"
			modelA.makeUrl("POST").should.equal "/model_a"
			modelA.makeUrl("PUT").should.equal "/model_a/1"
			modelA.makeUrl("DELETE").should.equal "/model_a/1"
		#END it

		it "Should test the makeUrl method, string id, no baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")

			modelB.makeUrl("GET").should.equal "/model_b/b"
			modelB.makeUrl("POST").should.equal "/model_b"
			modelB.makeUrl("PUT").should.equal "/model_b/b"
			modelB.makeUrl("DELETE").should.equal "/model_b/b"
		#END it

		it "Should test the makeUrl method, numeric id, with shorter baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com"

			modelA.makeUrl("GET").should.equal "http://www.falconjs.com/model_a/1"
			modelA.makeUrl("POST").should.equal "http://www.falconjs.com/model_a"
			modelA.makeUrl("PUT").should.equal "http://www.falconjs.com/model_a/1"
			modelA.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_a/1"
		#END it

		it "Should test the makeUrl method, string id, with shorter baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")
			Falcon.baseApiUrl = "http://www.falconjs.com"

			modelB.makeUrl("GET").should.equal "http://www.falconjs.com/model_b/b"
			modelB.makeUrl("POST").should.equal "http://www.falconjs.com/model_b"
			modelB.makeUrl("PUT").should.equal "http://www.falconjs.com/model_b/b"
			modelB.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_b/b"
		#END it

		it "Should test the makeUrl method, numeric id, with baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelA.makeUrl("GET").should.equal "http://www.falconjs.com/model_a/1"
			modelA.makeUrl("POST").should.equal "http://www.falconjs.com/model_a"
			modelA.makeUrl("PUT").should.equal "http://www.falconjs.com/model_a/1"
			modelA.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_a/1"
		#END it

		it "Should test the makeUrl method, string id, with baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelB.makeUrl("GET").should.equal "http://www.falconjs.com/model_b/b"
			modelB.makeUrl("POST").should.equal "http://www.falconjs.com/model_b"
			modelB.makeUrl("PUT").should.equal "http://www.falconjs.com/model_b/b"
			modelB.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_b/b"
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 2, modelB)

			modelA.makeUrl("GET").should.equal "/model_b/b/model_a/2"
			modelA.makeUrl("POST").should.equal "/model_b/b/model_a"
			modelA.makeUrl("PUT").should.equal "/model_b/b/model_a/2"
			modelA.makeUrl("DELETE").should.equal "/model_b/b/model_a/2"
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 2, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelA.makeUrl("GET").should.equal "http://www.falconjs.com/model_b/b/model_a/2"
			modelA.makeUrl("POST").should.equal "http://www.falconjs.com/model_b/b/model_a"
			modelA.makeUrl("PUT").should.equal "http://www.falconjs.com/model_b/b/model_a/2"
			modelA.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_b/b/model_a/2"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3)

			modelA.makeUrl("GET", modelB).should.equal "/model_b/b/model_a/3"
			modelA.makeUrl("POST", modelB).should.equal "/model_b/b/model_a"
			modelA.makeUrl("PUT", modelB).should.equal "/model_b/b/model_a/3"
			modelA.makeUrl("DELETE", modelB).should.equal "/model_b/b/model_a/3"
		#END it

		it "Should test the makeUrl method, with baseUrl, with explicit parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelA.makeUrl("GET", modelB).should.equal "http://www.falconjs.com/model_b/b/model_a/3"
			modelA.makeUrl("POST", modelB).should.equal "http://www.falconjs.com/model_b/b/model_a"
			modelA.makeUrl("PUT", modelB).should.equal "http://www.falconjs.com/model_b/b/model_a/3"
			modelA.makeUrl("DELETE", modelB).should.equal "http://www.falconjs.com/model_b/b/model_a/3"
		#END it

		it "Should test the makeUrl method, no baseUrl, with overriden parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3, modelB)

			modelA.makeUrl("GET", null).should.equal "/model_a/3"
			modelA.makeUrl("POST", null).should.equal "/model_a"
			modelA.makeUrl("PUT", null).should.equal "/model_a/3"
			modelA.makeUrl("DELETE", null).should.equal "/model_a/3"
		#END it

		it "Should test the makeUrl method, with baseUrl, with overriden parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelA.makeUrl("GET", null).should.equal "http://www.falconjs.com/model_a/3"
			modelA.makeUrl("POST", null).should.equal "http://www.falconjs.com/model_a"
			modelA.makeUrl("PUT", null).should.equal "http://www.falconjs.com/model_a/3"
			modelA.makeUrl("DELETE", null).should.equal "http://www.falconjs.com/model_a/3"
		#END it

		it "Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)

			modelC.makeUrl("GET").should.equal "/model_c/1.json"
			modelC.makeUrl("POST").should.equal "/model_c.json"
			modelC.makeUrl("PUT").should.equal "/model_c/1.json"
			modelC.makeUrl("DELETE").should.equal "/model_c/1.json"
		#END it

		it "Should test the makeUrl method, numeric index, with shorter baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com"

			modelC.makeUrl("GET").should.equal "http://www.falconjs.com/model_c/1.json"
			modelC.makeUrl("POST").should.equal "http://www.falconjs.com/model_c.json"
			modelC.makeUrl("PUT").should.equal "http://www.falconjs.com/model_c/1.json"
			modelC.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_c/1.json"
		#END it

		it "Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelC.makeUrl("GET").should.equal "http://www.falconjs.com/model_c/1.json"
			modelC.makeUrl("POST").should.equal "http://www.falconjs.com/model_c.json"
			modelC.makeUrl("PUT").should.equal "http://www.falconjs.com/model_c/1.json"
			modelC.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_c/1.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 2, modelB)

			modelC.makeUrl("GET").should.equal "/model_b/b/model_c/2.json"
			modelC.makeUrl("POST").should.equal "/model_b/b/model_c.json"
			modelC.makeUrl("PUT").should.equal "/model_b/b/model_c/2.json"
			modelC.makeUrl("DELETE").should.equal "/model_b/b/model_c/2.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 2, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelC.makeUrl("GET").should.equal "http://www.falconjs.com/model_b/b/model_c/2.json"
			modelC.makeUrl("POST").should.equal "http://www.falconjs.com/model_b/b/model_c.json"
			modelC.makeUrl("PUT").should.equal "http://www.falconjs.com/model_b/b/model_c/2.json"
			modelC.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_b/b/model_c/2.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 3)

			modelC.makeUrl("GET", modelB).should.equal "/model_b/b/model_c/3.json"
			modelC.makeUrl("POST", modelB).should.equal "/model_b/b/model_c.json"
			modelC.makeUrl("PUT", modelB).should.equal "/model_b/b/model_c/3.json"
			modelC.makeUrl("DELETE", modelB).should.equal "/model_b/b/model_c/3.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with  explicit parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelC.makeUrl("GET", modelB).should.equal "http://www.falconjs.com/model_b/b/model_c/3.json"
			modelC.makeUrl("POST", modelB).should.equal "http://www.falconjs.com/model_b/b/model_c.json"
			modelC.makeUrl("PUT", modelB).should.equal "http://www.falconjs.com/model_b/b/model_c/3.json"
			modelC.makeUrl("DELETE", modelB).should.equal "http://www.falconjs.com/model_b/b/model_c/3.json"
		#END it

		it "Should test the makeUrl method, string index, no baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")

			modelD.makeUrl("GET").should.equal "/model_d/d.json"
			modelD.makeUrl("POST").should.equal "/model_d.json"
			modelD.makeUrl("PUT").should.equal "/model_d/d.json"
			modelD.makeUrl("DELETE").should.equal "/model_d/d.json"
		#END it

		it "Should test the makeUrl method, string index, with shorter baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")
			Falcon.baseApiUrl = "http://www.falconjs.com"

			modelD.makeUrl("GET").should.equal "http://www.falconjs.com/model_d/d.json"
			modelD.makeUrl("POST").should.equal "http://www.falconjs.com/model_d.json"
			modelD.makeUrl("PUT").should.equal "http://www.falconjs.com/model_d/d.json"
			modelD.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_d/d.json"
		#END it

		it "Should test the makeUrl method, string index, with baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelD.makeUrl("GET").should.equal "http://www.falconjs.com/model_d/d.json"
			modelD.makeUrl("POST").should.equal "http://www.falconjs.com/model_d.json"
			modelD.makeUrl("PUT").should.equal "http://www.falconjs.com/model_d/d.json"
			modelD.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_d/d.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 2, modelD)

			modelA.makeUrl("GET").should.equal "/model_d/d/model_a/2"
			modelA.makeUrl("POST").should.equal "/model_d/d/model_a"
			modelA.makeUrl("PUT").should.equal "/model_d/d/model_a/2"
			modelA.makeUrl("DELETE").should.equal "/model_d/d/model_a/2"
		#END it

		it "Should test the makeUrl method, with baseUrl, with non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 2, modelD)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelA.makeUrl("GET").should.equal "http://www.falconjs.com/model_d/d/model_a/2"
			modelA.makeUrl("POST").should.equal "http://www.falconjs.com/model_d/d/model_a"
			modelA.makeUrl("PUT").should.equal "http://www.falconjs.com/model_d/d/model_a/2"
			modelA.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_d/d/model_a/2"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 3)

			modelA.makeUrl("GET", modelD).should.equal "/model_d/d/model_a/3"
			modelA.makeUrl("POST", modelD).should.equal "/model_d/d/model_a"
			modelA.makeUrl("PUT", modelD).should.equal "/model_d/d/model_a/3"
			modelA.makeUrl("DELETE", modelD).should.equal "/model_d/d/model_a/3"
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelA.makeUrl("GET", modelD).should.equal "http://www.falconjs.com/model_d/d/model_a/3"
			modelA.makeUrl("POST", modelD).should.equal "http://www.falconjs.com/model_d/d/model_a"
			modelA.makeUrl("PUT", modelD).should.equal "http://www.falconjs.com/model_d/d/model_a/3"
			modelA.makeUrl("DELETE", modelD).should.equal "http://www.falconjs.com/model_d/d/model_a/3"
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 2, modelD)

			modelC.makeUrl("GET").should.equal "/model_d/d/model_c/2.json"
			modelC.makeUrl("POST").should.equal "/model_d/d/model_c.json"
			modelC.makeUrl("PUT").should.equal "/model_d/d/model_c/2.json"
			modelC.makeUrl("DELETE").should.equal "/model_d/d/model_c/2.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 2, modelD)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelC.makeUrl("GET").should.equal "http://www.falconjs.com/model_d/d/model_c/2.json"
			modelC.makeUrl("POST").should.equal "http://www.falconjs.com/model_d/d/model_c.json"
			modelC.makeUrl("PUT").should.equal "http://www.falconjs.com/model_d/d/model_c/2.json"
			modelC.makeUrl("DELETE").should.equal "http://www.falconjs.com/model_d/d/model_c/2.json"
		#END it

		it "Should test the makeUrl method, no baseUrl, with  explicit parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 3)

			modelC.makeUrl("GET", modelD).should.equal "/model_d/d/model_c/3.json"
			modelC.makeUrl("POST", modelD).should.equal "/model_d/d/model_c.json"
			modelC.makeUrl("PUT", modelD).should.equal "/model_d/d/model_c/3.json"
			modelC.makeUrl("DELETE", modelD).should.equal "/model_d/d/model_c/3.json"
		#END it

		it "Should test the makeUrl method, with baseUrl, with explicit parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			modelC.makeUrl("GET", modelD).should.equal "http://www.falconjs.com/model_d/d/model_c/3.json"
			modelC.makeUrl("POST", modelD).should.equal "http://www.falconjs.com/model_d/d/model_c.json"
			modelC.makeUrl("PUT", modelD).should.equal "http://www.falconjs.com/model_d/d/model_c/3.json"
			modelC.makeUrl("DELETE", modelD).should.equal "http://www.falconjs.com/model_d/d/model_c/3.json"
		#END it

		it "Should be able to use url as a function, no parent", ->
			modelE = new ModelE(id: "e")

			modelE.makeUrl("GET").should.equal "/model_e/e"
			modelE.makeUrl("POST").should.equal "/model_e"
			modelE.makeUrl("PUT").should.equal "/model_e/e"
			modelE.makeUrl("DELETE").should.equal "/model_e/e"
		#END it

		it "Should be able to use url as a function, with parent", ->
			modelE = new ModelE(id: "e", new ModelB(id: "b") )

			modelE.makeUrl("GET").should.equal "/model_b/b/model_e/e"
			modelE.makeUrl("POST").should.equal "/model_b/b/model_e"
			modelE.makeUrl("PUT").should.equal "/model_b/b/model_e/e"
			modelE.makeUrl("DELETE").should.equal "/model_b/b/model_e/e"
		#END it

		it "Should be able to use override the url, no parent", ->
			modelE = new ModelE(id: "e", url: "model_e2")

			modelE.makeUrl("GET").should.equal "/model_e2/e"
			modelE.makeUrl("POST").should.equal "/model_e2"
			modelE.makeUrl("PUT").should.equal "/model_e2/e"
			modelE.makeUrl("DELETE").should.equal "/model_e2/e"
		#END it

		it "Should be able to use override the url,with parent", ->
			modelE = new ModelE({id: "e", url: "model_e3"}, new ModelB(id: "b") )

			modelE.makeUrl("GET").should.equal "/model_b/b/model_e3/e"
			modelE.makeUrl("POST").should.equal "/model_b/b/model_e3"
			modelE.makeUrl("PUT").should.equal "/model_b/b/model_e3/e"
			modelE.makeUrl("DELETE").should.equal "/model_b/b/model_e3/e"
		#END it
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
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "GET", undefined
			#END it

			it "Should call sync correctly on fetch with options", ->
				modelA.fetch({})
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "GET", {}
			#END it

			it "Should call sync correctly on create without options", ->
				modelA.create()
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "POST", undefined
			#END it

			it "Should call sync correctly on create with options", ->
				modelA.create({})
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "POST", {}

			it "Should call sync correctly on save without options", ->
				modelA.save()
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "PUT", undefined
			#END it

			it "Should call sync correctly on save with options", ->
				modelA.save({})
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "PUT", {}

			it "Should call sync correctly on destroy without options", ->
				modelA.destroy()
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "DELETE", undefined
			#END it

			it "Should call sync correctly on destroy with options", ->
				modelA.destroy({})
				sync_stub.should.have.been.calledOnce
				sync_stub.should.have.been.calledWith "DELETE", {}
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "GET"}
				ajax_stub.should.have.been.calledWithMatch {url: modelA.makeUrl("GET")}
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

			it "Should save properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.save()

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "PUT"}
				ajax_stub.should.have.been.calledWithMatch {url: modelA.makeUrl("PUT")}
				ajax_stub.should.have.been.calledWithMatch {data: JSON.stringify("id": 1) }
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "PUT"}
				ajax_stub.should.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				ajax_stub.should.have.been.calledWithMatch {data: JSON.stringify("id": 1, "hello": "world")}
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

			it "Should create properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.create()

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "POST"}
				ajax_stub.should.have.been.calledWithMatch {url: modelA.makeUrl("POST")}
				ajax_stub.should.have.been.calledWithMatch {data: JSON.stringify("id": 1) }
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "POST"}
				ajax_stub.should.have.been.calledWithMatch {url: "http://www.falconjs.com"}
				ajax_stub.should.have.been.calledWithMatch {data: JSON.stringify("id": 1, "hello": "world")}
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

			it "Should destroy properly without options", ->
				modelA = new ModelA(id: 1)
				modelA.destroy()

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "DELETE"}
				ajax_stub.should.have.been.calledWithMatch {url: modelA.makeUrl("DELETE")}
				ajax_stub.should.have.been.calledWithMatch {data: "" }
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

				ajax_stub.should.have.been.calledOnce
				ajax_stub.should.have.been.calledWithMatch {type: "DELETE"}
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

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 1
				fill_stub.firstCall.args[0].should.deep.equal success_data

				fill_stub.should.have.been.calledAfter parse_stub

				fetch_spy.should.have.been.calledOnce
				create_spy.should.not.have.been.called
				save_spy.should.not.have.been.called
				destroy_spy.should.not.have.been.called

				fetch_spy.should.have.been.calledAfter fill_stub

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn modelA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal modelA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal modelA
				complete_spy.should.have.been.calledAfter success_spy
			#END it

			it "Should not fill when fill option is false on fetch", ->
				options.fill = false
				modelA.fetch( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 0

				fetch_spy.should.have.been.calledOnce
				create_spy.should.not.have.been.called
				save_spy.should.not.have.been.called
				destroy_spy.should.not.have.been.called

				fetch_spy.should.have.been.calledAfter parse_stub

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn modelA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal modelA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal modelA
				complete_spy.should.have.been.calledAfter success_spy
			#END it

			it "Should call the error response on an errornous result", ->
				modelA.fetch( options )

				server.respondWith [ 400, {}, JSON.stringify(error_data) ]
				server.respond()

				parse_stub.callCount.should.equal 0
				fill_stub.callCount.should.equal 0

				fetch_spy.should.not.have.been.called
				create_spy.should.not.have.been.called
				save_spy.should.not.have.been.called
				destroy_spy.should.not.have.been.called

				success_spy.callCount.should.equal 0

				error_spy.callCount.should.equal 1
				error_spy.firstCall.args.length.should.equal 3
				error_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args[0].should.equal modelA

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal modelA
				complete_spy.should.have.been.calledAfter error_spy
			#END it

			it "Should call the success response on create", ->
				modelA.create( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 1
				fill_stub.firstCall.args[0].should.deep.equal success_data

				fill_stub.should.have.been.calledAfter parse_stub

				fetch_spy.should.not.have.been.called
				create_spy.callCount.should.equal 1
				save_spy.should.not.have.been.called
				destroy_spy.should.not.have.been.called

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn modelA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal modelA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal modelA
				complete_spy.should.have.been.calledAfter success_spy
			#END it

			it "Should call the success response on save", ->
				modelA.save( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 1
				fill_stub.firstCall.args[0].should.deep.equal success_data

				fill_stub.should.have.been.calledAfter parse_stub

				fetch_spy.should.not.have.been.called
				create_spy.should.not.have.been.called
				save_spy.callCount.should.equal 1
				destroy_spy.should.not.have.been.called

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn modelA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal modelA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal modelA
				complete_spy.should.have.been.calledAfter success_spy
			#END it

			it "Should call the success response on destroy", ->
				modelA.destroy( options )

				server.respondWith [ 200, {}, JSON.stringify(data) ]
				server.respond()

				parse_stub.callCount.should.equal 1
				parse_stub.firstCall.args[0].should.deep.equal data

				fill_stub.callCount.should.equal 1
				fill_stub.firstCall.args[0].should.deep.equal success_data

				fill_stub.should.have.been.calledAfter parse_stub

				fetch_spy.should.not.have.been.called
				create_spy.should.not.have.been.called
				save_spy.should.not.have.been.called
				destroy_spy.callCount.should.equal 1

				success_spy.callCount.should.equal 1
				success_spy.should.have.been.calledOn modelA
				success_spy.firstCall.args.length.should.equal 4
				success_spy.firstCall.args[0].should.equal modelA

				error_spy.should.not.have.been.called

				complete_spy.callCount.should.equal 1
				complete_spy.should.have.been.calledOn modelA
				complete_spy.firstCall.args.length.should.equal 3
				complete_spy.firstCall.args[0].should.equal modelA
				complete_spy.should.have.been.calledAfter success_spy
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

		expect( modelA_1.equals( modelA_1 ) ).to.be.true
		expect( modelA_1.equals( modelA_2 ) ).to.be.false
		expect( modelA_1.equals( 1 ) ).to.be.true
		expect( modelA_1.equals( new ModelA(id: 1) ) ).to.be.true

		expect( modelA_a.equals( modelA_a ) ).to.be.true
		expect( modelA_a.equals( modelA_2 ) ).to.be.false
		expect( modelA_a.equals( 'a' ) ).to.be.true
		expect( modelA_a.equals( new ModelA(id: 'a') ) ).to.be.true
	#END if


	#--------------------------------------------------------------
	#
	# Test the mixin() method
	#
	#--------------------------------------------------------------
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
		mixin_spy.should.have.been.calledOnce
		mixin_spy.should.have.been.calledOn modelA
		mixin_spy.firstCall.args[0].should.equal modelA
		mixin_spy.firstCall.args[1].should.equal 'world'
	#END it


	#--------------------------------------------------------------
	#
	# Test the clone() method
	#
	#--------------------------------------------------------------
	describe "Testing clone combinations", ->
		class ModelA extends Falcon.Model
			initialize: ->
				@foo = ko.observable()
			#END initialzie
		#END ModelA

		class ModelB extends Falcon.Model
		#END ModelB

		class ModelC extends Falcon.Model
		#END ModelC

		it "Should clone properly without overridden parent", ->
			modelB = new ModelB
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	"bar"
			}, modelB)
			modelA2 = modelA1.clone()

			modelA1.should.not.equal modelA2
			modelA1.parent.should.equal modelA2.parent
			modelA1.id.should.equal modelA2.id

			modelA2.hello.should.equal "world"
			expect( ko.isObservable( modelA2.foo ) ).to.be.true
			modelA2.foo().should.equal "bar"
		#END it

		it "Should clone properly with overriden parent", ->
			modelB = new ModelB
			modelC = new ModelC
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(modelC)

			modelA2.should.not.equal modelA1
			modelA2.id.should.equal modelA1.id
			modelA2.parent.should.equal modelC

			modelA2.hello.should.equal "world"
			expect( ko.isObservable( modelA2.foo ) ).to.be.true
			modelA2.foo().should.equal "bar"
		#END it

		it "Should clone properly with overriden null parent", ->
			modelB = new ModelB
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(null)

			modelA2.should.not.equal modelA1
			modelA2.id.should.equal modelA1.id
			expect( modelA2.parent ).to.be.equal null

			modelA2.hello.should.equal "world"
			expect( ko.isObservable( modelA2.foo ) ).to.be.true
			modelA2.foo().should.equal "bar"
		#END it
	#END it


	#--------------------------------------------------------------
	#
	# Test the copy() method
	#
	#--------------------------------------------------------------
	describe "Testing copy() method", ->
		class ModelA extends Falcon.Model
			initialize: ->
				@foo = ko.observable()
			#END initialzie
		#END ModelA

		class ModelB extends Falcon.Model
		#END ModelB

		class ModelC extends Falcon.Model
		#END ModelB

		it "Should do a basic copy properly", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.copy()

			modelA1.should.not.equal modelA2

			expect( modelA2.hello ).not.to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).to.exist

			expect( modelA2.id ).to.equal 1
			expect( modelA2.parent ).to.equal modelB
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do copy properly additional fields properly", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.copy(["id", "foo"])

			modelA1.should.not.equal modelA2

			expect( modelA2.hello ).not.to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).to.exist

			expect( modelA2.id ).to.equal 1
			expect( modelA2.parent ).to.equal modelB
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.equal "bar"
		#END it

		it "Should do copy properly additional fields properly without parent", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.copy(["id", "hello"], null)

			modelA1.should.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).not.to.exist

			expect( modelA2.id ).to.equal 1
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do copy properly additional fields properly without parent or id fields", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.copy(["hello"], null)

			modelA1.should.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.parent ).not.to.exist

			expect( modelA2.id ).to.equal null
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do copy properly additional fields properly with new parent", ->
			modelC = new ModelC()
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.copy(["id", "hello"], modelC)

			modelA1.should.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.id ).to.exist
			expect( modelA2.parent ).to.exist
			expect( modelA2.parent ).to.equal modelC

			expect( modelA2.id ).to.equal 1
			expect( ko.isObservable(modelA2.hello) ).to.be.false
			expect( modelA2.hello ).to.be.equal "world"
			expect( ko.isObservable(modelA2.foo) ).to.be.true
			expect( modelA2.foo() ).to.be.undefined
		#END it

		it "Should do copy properly additional fields properly with new parent or id fields", ->
			modelC = new ModelC()
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.copy(["hello"], modelC)

			modelA1.should.not.equal modelA2

			expect( modelA2.hello ).to.exist
			expect( modelA2.foo ).to.exist
			expect( modelA2.parent ).to.exist
			expect( modelA2.parent ).to.equal modelC

			expect( modelA2.id ).to.equal null
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



