describe "Falcon.Model", ->
	beforeEach ->
		Falcon.baseApiUrl = ""
		Falcon.baseTemplateUrl = ""
	#END beforeEach

	#--------------------------------------------------------------
	#
	# Test the initialize() method
	#
	#--------------------------------------------------------------
	describe "initialize", ->
		class ModelA extends Falcon.Model
		#END class

		class ModelB extends Falcon.Model
		#END class

		beforeEach ->
			sinonSpyOn( ModelA::, 'initialize' )
			sinonSpyOn( ModelA::, 'fill' )
		#END beforeEach

		it "Should call initialize on construction", ->
			model = new ModelA
			expect( ModelA::initialize ).toHaveBeenCalledOnce()
		#END it

		it "Shoudl allow for a parent model", ->
			modelA = new ModelA( modelB = new ModelB )
			expect( ModelA::initialize ).toHaveBeenCalledOnce()
			expect( ModelA::fill ).not.toHaveBeenCalled()
			expect( modelA.parent ).toBe( modelB )
		#END it

		it "Should allow for input data", ->
			modelA = new ModelA( data = {"hello": "world"} )
			expect( ModelA::initialize ).toHaveBeenCalledOnce()
			expect( ModelA::initialize ).toHaveBeenCalledWith( data )
			expect( ModelA::fill ).toHaveBeenCalledOnce()
			expect( ModelA::fill ).toHaveBeenCalledWith( data )
			expect( modelA.parent ).not.toBeDefined()
		#END it

		it "Should allow for input data and a parent model", ->
			modelA = new ModelA( data = {"hello": "world"}, modelB = new ModelB )
			expect( ModelA::initialize ).toHaveBeenCalledOnce()
			expect( ModelA::initialize ).toHaveBeenCalledWith( data )
			expect( ModelA::fill ).toHaveBeenCalledOnce()
			expect( ModelA::fill ).toHaveBeenCalledWith( data )
			expect( modelA.parent ).toBe( modelB )
		#END it

		it "Should allow for the data and parent to be switched", ->
			modelA = new ModelA( modelB = new ModelB, data = {"hello": "world"} )
			expect( ModelA::initialize ).toHaveBeenCalledOnce()
			expect( ModelA::initialize ).toHaveBeenCalledWith( data )
			expect( ModelA::fill ).toHaveBeenCalledOnce()
			expect( ModelA::fill ).toHaveBeenCalledWith( data )
			expect( modelA.parent ).toBe( modelB )
		#END it

		it "Should allow for a falcon mode to be the datat object", ->
			modelA = new ModelA( dataModel = new Falcon.Model({"hello":"world"}), modelB = new ModelB )
			expect( ModelA::initialize ).toHaveBeenCalledOnce()
			expect( ModelA::initialize ).toHaveBeenCalledWith( dataModel )
			expect( ModelA::fill ).toHaveBeenCalledOnce()
			expect( ModelA::fill ).toHaveBeenCalledWith( dataModel )
			expect( modelA.parent ).toBe( modelB )
		#END it

		it "Should throw if a model isn't passed in as the parent", ->
			expect( -> new modelA(data, {}) ).toThrow()
			expect( -> new modelA(data, new Falcon.Collection) ).toThrow()

			expect( ModelA::initialize ).not.toHaveBeenCalled()
			expect( ModelA::fill ).not.toHaveBeenCalled()
		#END it
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
		
		expect( hello_spy ).not.toHaveBeenCalled()

		rawr_class = new RawrModel(input_data = {"one", "two", "three"})

		expect( hello_spy ).toHaveBeenCalled()
		expect( hello_spy.callCount ).toBe( 1 )
		expect( hello_spy.firstCall.args.length ).toBe( 1 )
		expect( hello_spy.firstCall.args[0] ).toBe( input_data )
	#END it


	#--------------------------------------------------------------
	#
	# Test the get(), set(), toggle(), increment(), and decrement() methods
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

		expect( modelA["hello"] ).toBe( "world")
		expect( modelA["foo"] ).toEqual(jasmine.any(Function))
		expect( modelA["truth"] ).toBe( true )
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toBe( modelB)

		expect( modelA.get("hello") ).toBe( "world")
		expect( modelA.get("foo") ).toBe( "bar")
		expect( modelA.get("truth") ).toBe( true)
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toBe( modelB)

		modelA.set "foo", "baz"
		modelA.set "hello", "goodbye"

		expect( modelA.get("hello") ).toBe( "goodbye")
		expect( modelA.get("foo") ).toBe( "baz")
		expect( modelA.get("truth") ).toBe( true)
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toBe( modelB)

		modelA.set
			"foo": "bar"
			"hello": "world"
		#END set

		expect( modelA.get("hello") ).toBe( "world")
		expect( modelA.get("foo") ).toBe( "bar")
		expect( modelA.get("truth") ).toBe( true)
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toBe( modelB)

		modelA.toggle "truth"

		expect( modelA.get("hello") ).toBe( "world")
		expect( modelA.get("foo") ).toBe( "bar")
		expect( modelA.get("truth") ).toBe( false)
		expect( modelA["model_b"] ).toEqual(jasmine.any(ModelB))
		expect( modelA["model_b"] ).toBe( modelB)

		expect( modelB.get("something") ).toBe( "cool")
	#END it

	it "Should test the increment and decrement methods", ->
		class ModelA extends Falcon.Model
			defaults:
				'first': 1
			#END defaults

			observables:
				'second': 2
			#END observables
		#END class

		model_a = new ModelA

		expect( model_a.get('first') ).toBe( 1)
		expect( model_a.get('second') ).toBe( 2)

		ret = model_a.increment('first')
		expect( ret ).toBe(( model_a ))

		ret = model_a.increment('second')
		expect( ret ).toBe(( model_a ))

		expect( model_a.get('first') ).toBe( 2)
		expect( model_a.get('second') ).toBe( 3)

		ret = model_a.decrement('first')
		expect( ret ).toBe(( model_a ))

		ret = model_a.decrement('second')
		expect( ret ).toBe(( model_a ))

		expect( model_a.get('first') ).toBe( 1)
		expect( model_a.get('second') ).toBe( 2)
	#END it


	#--------------------------------------------------------------
	#
	# Test the fill() and serialize() methods
	#	TODO: Test multiple mapping of data (converting server keys to the same
	#		  model key).
	#
	#--------------------------------------------------------------
	describe "serialize and fill", ->
		modelB = null
		modelB2 = null
		collectionC = null

		class ModelA extends Falcon.Model
			url: "model_a"

			observables:
				'_client': null
			#END observables

			defaults:
				'model_b': -> modelB = new ModelB
				'model_b2': -> modelB2 = new ModelB
				'collection_c': -> collectionC = new CollectionC
				'model_b3': -> new ModelB
			#END defaults
		#END class

		class ModelB extends Falcon.Model
			url: "model_b"
		#END class

		class ModelC extends Falcon.Model
		#END model C

		class CollectionC extends Falcon.Collection
			model: ModelC
		#END collection c

		class ModelD extends Falcon.Model
			defaults:
				'model_e': -> new ModelE
			#END defaults

			observables:
				'hello': 'world'
				'foo': true
			#END observables
		#END class

		class ModelE extends Falcon.Model
			observables:
				'free': 'bird'
				'bar': true
			#END observables
		#END ModelE

		class ModelF extends Falcon.Model
			observables:
				'free': -> 'bird'
			#END obsrvables
		#END ModelF

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
			"model_b3": new ModelB,
			"collection_c": [
				{"that": "That One"}
				{"that": "That Two"}
				{"that": "That Three"}
			]
		}

		modelA = new ModelA()
		original_model_b3 = modelA.get("model_b3")
		modelA.fill( data )

		it "Should fill properly", ->
			expect( modelA.get("id") ).toBe( 33)
			expect( modelA.get("foo") ).toBe( "bar")
			expect( modelA.get("url") ).toBe( "MODEL_A2")
			
			expect( modelA.get("model_b") ).toBe( modelB)
			expect( modelA.get("model_b").get("b_foo") ).toBe( "B BAR")
			expect( modelA.get("model_b").get("url") ).toBe( "model_b")
			
			expect( modelA.get("model_b2") ).toBe( modelB2)
			expect( modelA.get("model_b2").get("id") ).toBe( "test")
			expect( modelA.get("model_b2").get("b_foo") ).toBe( "B BAR 2")
			expect( modelA.get("model_b2").get("url") ).toBe( "model_b2")

			expect( original_model_b3 ).toEqual( jasmine.any(ModelB) )
			expect( data.model_b3 ).toEqual( jasmine.any(ModelB) )
			expect( data.model_b3 ).not.toBe( original_model_b3 )
			expect( modelA.get("model_b3") ).toBe( data.model_b3 )
			
			expect( modelA.get("collection_c") ).toBe( collectionC )
			expect( modelA.get("collection_c").length() ).toBe( 3 )
			expect( modelA.get("collection_c").first() ).toEqual(jasmine.any(ModelC))
			expect( modelA.get("collection_c").first().get("that") ).toBe( "That One" )
		#END it

		it "Should retain reference to the original observables", ->
			model_d = new ModelD()

			expect( model_d.get('hello') ).toBe( 'world' )
			expect( model_d.get('foo') ).toBe( true )

			expect( model_d.model_e.get('free') ).toBe( 'bird' )
			expect( model_d.model_e.get('bar') ).toBe( true )

			hello_obs = model_d.hello
			foo_obs = model_d.foo
			free_obs = model_d.model_e.free
			bar_obs = model_d.model_e.bar

			expect( ko.isWriteableObservable(hello_obs) ).toBe( true )
			expect( ko.isWriteableObservable(foo_obs) ).toBe( true )
			expect( ko.isWriteableObservable(free_obs) ).toBe( true )
			expect( ko.isWriteableObservable(bar_obs) ).toBe( true )

			model_d.fill
				'hello': 'WORLD!'
				'foo': false
				'model_e':
					'free': 'BIRD!'
					'bar': false
				#END model_e 
			#END fill

			expect( model_d.get('hello') ).toBe( 'WORLD!' )
			expect( model_d.get('foo') ).toBe( false )
			expect( model_d.model_e.get('free') ).toBe( 'BIRD!' )
			expect( model_d.model_e.get('bar') ).toBe( false )

			expect( model_d.hello ).toBe( hello_obs )
			expect( model_d.foo ).toBe( foo_obs )
			expect( model_d.model_e.free ).toBe( free_obs )
			expect( model_d.model_e.bar ).toBe( bar_obs )
		#END it

		it "Should not overwrite computed observables", ->
			modelF = new ModelF

			obs = modelF.free
			modelF.fill('free': 'hello world')

			expect( modelF.free ).toBe( obs )
			expect( modelF.get('free') ).toBe( 'bird' )
		#END it

		it "Should serialize properly", ->
			serialized = modelA.serialize()
			expect( serialized['id'] ).toBe( 33 )
			expect( serialized['foo'] ).toBe( "bar" )

			expect( serialized['model_b'] ).toEqual(jasmine.any(Object))
			expect( serialized['model_b']['id'] ).toBeNull()
			expect( serialized['model_b']['b_foo'] ).toBe( "B BAR" )

			expect( serialized['model_b2'] ).toEqual(jasmine.any(Object))
			expect( serialized['model_b2']['id'] ).toBe( "test" )
			expect( serialized['model_b2']['b_foo'] ).toBe( "B BAR 2" )

			expect( serialized['model_b3'] ).toEqual(jasmine.any(Object))

			expect( serialized['collection_c'] ).toEqual(jasmine.any(Array))
			expect( serialized['collection_c'].length ).toBe( 3 )
			expect( serialized['collection_c'][0] ).toEqual(jasmine.any(Object))
			expect( serialized['collection_c'][0]['that'] ).toBe( "That One" )
		#END it


		it "Should serialzie properly with attributes", ->
			serialized = modelA.serialize(["id", "foo"])
			expect( serialized['id'] ).toBe( 33 )
			expect( serialized['foo'] ).toBe( "bar" )

			expect( serialized["model_b"] ).not.toBeDefined()
			expect( serialized["model_b2"] ).not.toBeDefined()
			expect( serialized["collection_c"] ).not.toBeDefined()
		#END it


		it "Should serialzie properly with a single attribute", ->
			serialized = modelA.serialize(["foo"])
			expect( serialized['foo'] ).toBe( "bar" )

			expect( serialized['id'] ).not.toBeDefined()
			expect( serialized["model_b"] ).not.toBeDefined()
			expect( serialized["model_b2"] ).not.toBeDefined()
			expect( serialized["model_b3"] ).not.toBeDefined()
			expect( serialized["collection_c"] ).not.toBeDefined()
		#END it

		it "Should serialzie properly with a deep attributes", ->
			serialized = modelA.serialize {
				"id": null
				"model_b2": {
					"b_foo": null
					"url": null
				}
			}

			expect( serialized['id'] ).toBe( 33 )

			expect( serialized['model_b2'] ).toEqual(jasmine.any(Object))
			expect( serialized['model_b2']['b_foo'] ).toBe( "B BAR 2" )

			expect( serialized["model_b"] ).not.toBeDefined()
			expect( serialized["model_b3"] ).not.toBeDefined()
			expect( serialized["collection_c"] ).not.toBeDefined()
		#END it

		it "Should serialize without prototype elements of Falcon.Object", ->
			serialized = modelA.serialize()

			for key, value of serialized
				expect( Falcon.Object.prototype[key] ).not.toBeDefined()
			#END for

			#TEST serialize shouldn't include prototype elements of Falcon.Model
			serialized = modelA.serialize()

			for key, value of serialized when key isnt "id"
				expect( Falcon.Model.prototype[key] ).not.toBeDefined()
			#END for
		#END it
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
		expect( unwrapped['foo'] ).toEqual(jasmine.any(Function))
		expect( unwrapped['foo']() ).toBe( "bar" )
		expect( unwrapped['model_b'] ).toEqual(jasmine.any(Object))
		expect( unwrapped['model_b']['something'] ).toEqual(jasmine.any(Function))
		expect( unwrapped['model_b']['something']() ).toBe( "cool" )
		expect( unwrapped['collection_c'] ).toEqual(jasmine.any(Array))
		expect( unwrapped['collection_c'].length ).toBe( 2 )
		expect( unwrapped['collection_c'][0]['hello'] ).toBe( "world" )
		expect( unwrapped['collection_c'][1]['hello'] ).toBe( "world2" )

		#Make sure that we avoid having attributes from the Falcon.Model definition
		expect( unwrapped['id'] ).toBeNull()
		expect( unwrapped['parent'] ).not.toBeDefined()
		expect( unwrapped['url'] ).not.toBeDefined()
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

			expect( modelA.makeUrl("GET") ).toBe( "/model_a/1" )
			expect( modelA.makeUrl("POST") ).toBe( "/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "/model_a/1" )
			expect( modelA.makeUrl("DELETE") ).toBe( "/model_a/1" )
		#END it

		it "Should test the makeUrl method, string id, no baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")

			expect( modelB.makeUrl("GET") ).toBe( "/model_b/b" )
			expect( modelB.makeUrl("POST") ).toBe( "/model_b" )
			expect( modelB.makeUrl("PUT") ).toBe( "/model_b/b" )
			expect( modelB.makeUrl("DELETE") ).toBe( "/model_b/b" )
		#END it

		it "Should test the makeUrl method, numeric id, with shorter baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_a/1" )
			expect( modelA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_a/1" )
			expect( modelA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_a/1" )
		#END it

		it "Should test the makeUrl method, string id, with shorter baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelB.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/b" )
			expect( modelB.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b" )
			expect( modelB.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/b" )
			expect( modelB.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/b" )
		#END it

		it "Should test the makeUrl method, numeric id, with baseUrl, no parent, no extension", ->
			modelA = new ModelA(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_a/1" )
			expect( modelA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_a/1" )
			expect( modelA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_a/1" )
		#END it

		it "Should test the makeUrl method, string id, with baseUrl, no parent, no extension", ->
			modelB = new ModelB(id: "b")
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelB.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/b" )
			expect( modelB.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b" )
			expect( modelB.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/b" )
			expect( modelB.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/b" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 2, modelB)

			expect( modelA.makeUrl("GET") ).toBe( "/model_b/b/model_a/2" )
			expect( modelA.makeUrl("POST") ).toBe( "/model_b/b/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "/model_b/b/model_a/2" )
			expect( modelA.makeUrl("DELETE") ).toBe( "/model_b/b/model_a/2" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 2, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/b/model_a/2" )
			expect( modelA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/b/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/b/model_a/2" )
			expect( modelA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/b/model_a/2" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3)

			expect( modelA.makeUrl("GET", modelB) ).toBe( "/model_b/b/model_a/3" )
			expect( modelA.makeUrl("POST", modelB) ).toBe( "/model_b/b/model_a" )
			expect( modelA.makeUrl("PUT", modelB) ).toBe( "/model_b/b/model_a/3" )
			expect( modelA.makeUrl("DELETE", modelB) ).toBe( "/model_b/b/model_a/3" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with explicit parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_a/3" )
			expect( modelA.makeUrl("POST", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_a" )
			expect( modelA.makeUrl("PUT", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_a/3" )
			expect( modelA.makeUrl("DELETE", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_a/3" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with overriden parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3, modelB)

			expect( modelA.makeUrl("GET", null) ).toBe( "/model_a/3" )
			expect( modelA.makeUrl("POST", null) ).toBe( "/model_a" )
			expect( modelA.makeUrl("PUT", null) ).toBe( "/model_a/3" )
			expect( modelA.makeUrl("DELETE", null) ).toBe( "/model_a/3" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with overriden parent, no extension", ->
			modelB = new ModelB(id: "b")
			modelA = new ModelA(id: 3, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET", null) ).toBe( "http://www.falconjs.com/model_a/3" )
			expect( modelA.makeUrl("POST", null) ).toBe( "http://www.falconjs.com/model_a" )
			expect( modelA.makeUrl("PUT", null) ).toBe( "http://www.falconjs.com/model_a/3" )
			expect( modelA.makeUrl("DELETE", null) ).toBe( "http://www.falconjs.com/model_a/3" )
		#END it

		it "Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)

			expect( modelC.makeUrl("GET") ).toBe( "/model_c/1.json" )
			expect( modelC.makeUrl("POST") ).toBe( "/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "/model_c/1.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "/model_c/1.json" )
		#END it

		it "Should test the makeUrl method, numeric index, with shorter baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelC.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_c/1.json" )
			expect( modelC.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_c/1.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_c/1.json" )
		#END it

		it "Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", ->
			modelC = new ModelC(id: 1)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_c/1.json" )
			expect( modelC.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_c/1.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_c/1.json" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 2, modelB)

			expect( modelC.makeUrl("GET") ).toBe( "/model_b/b/model_c/2.json" )
			expect( modelC.makeUrl("POST") ).toBe( "/model_b/b/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "/model_b/b/model_c/2.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "/model_b/b/model_c/2.json" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 2, modelB)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_b/b/model_c/2.json" )
			expect( modelC.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_b/b/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_b/b/model_c/2.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_b/b/model_c/2.json" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 3)

			expect( modelC.makeUrl("GET", modelB) ).toBe( "/model_b/b/model_c/3.json" )
			expect( modelC.makeUrl("POST", modelB) ).toBe( "/model_b/b/model_c.json" )
			expect( modelC.makeUrl("PUT", modelB) ).toBe( "/model_b/b/model_c/3.json" )
			expect( modelC.makeUrl("DELETE", modelB) ).toBe( "/model_b/b/model_c/3.json" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with  explicit parent, with extension", ->
			modelB = new ModelB(id: "b")
			modelC = new ModelC(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_c/3.json" )
			expect( modelC.makeUrl("POST", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_c.json" )
			expect( modelC.makeUrl("PUT", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_c/3.json" )
			expect( modelC.makeUrl("DELETE", modelB) ).toBe( "http://www.falconjs.com/model_b/b/model_c/3.json" )
		#END it

		it "Should test the makeUrl method, string index, no baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")

			expect( modelD.makeUrl("GET") ).toBe( "/model_d/d.json" )
			expect( modelD.makeUrl("POST") ).toBe( "/model_d.json" )
			expect( modelD.makeUrl("PUT") ).toBe( "/model_d/d.json" )
			expect( modelD.makeUrl("DELETE") ).toBe( "/model_d/d.json" )
		#END it

		it "Should test the makeUrl method, string index, with shorter baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")
			Falcon.baseApiUrl = "http://www.falconjs.com"

			expect( modelD.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_d/d.json" )
			expect( modelD.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_d.json" )
			expect( modelD.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_d/d.json" )
			expect( modelD.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_d/d.json" )
		#END it

		it "Should test the makeUrl method, string index, with baseUrl, no parent, with extension", ->
			modelD = new ModelD(id: "d")
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelD.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_d/d.json" )
			expect( modelD.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_d.json" )
			expect( modelD.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_d/d.json" )
			expect( modelD.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_d/d.json" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 2, modelD)

			expect( modelA.makeUrl("GET") ).toBe( "/model_d/d/model_a/2" )
			expect( modelA.makeUrl("POST") ).toBe( "/model_d/d/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "/model_d/d/model_a/2" )
			expect( modelA.makeUrl("DELETE") ).toBe( "/model_d/d/model_a/2" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 2, modelD)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_d/d/model_a/2" )
			expect( modelA.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_d/d/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_d/d/model_a/2" )
			expect( modelA.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_d/d/model_a/2" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 3)

			expect( modelA.makeUrl("GET", modelD) ).toBe( "/model_d/d/model_a/3" )
			expect( modelA.makeUrl("POST", modelD) ).toBe( "/model_d/d/model_a" )
			expect( modelA.makeUrl("PUT", modelD) ).toBe( "/model_d/d/model_a/3" )
			expect( modelA.makeUrl("DELETE", modelD) ).toBe( "/model_d/d/model_a/3" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelA = new ModelA(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelA.makeUrl("GET", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_a/3" )
			expect( modelA.makeUrl("POST", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_a" )
			expect( modelA.makeUrl("PUT", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_a/3" )
			expect( modelA.makeUrl("DELETE", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_a/3" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 2, modelD)

			expect( modelC.makeUrl("GET") ).toBe( "/model_d/d/model_c/2.json" )
			expect( modelC.makeUrl("POST") ).toBe( "/model_d/d/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "/model_d/d/model_c/2.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "/model_d/d/model_c/2.json" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 2, modelD)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET") ).toBe( "http://www.falconjs.com/model_d/d/model_c/2.json" )
			expect( modelC.makeUrl("POST") ).toBe( "http://www.falconjs.com/model_d/d/model_c.json" )
			expect( modelC.makeUrl("PUT") ).toBe( "http://www.falconjs.com/model_d/d/model_c/2.json" )
			expect( modelC.makeUrl("DELETE") ).toBe( "http://www.falconjs.com/model_d/d/model_c/2.json" )
		#END it

		it "Should test the makeUrl method, no baseUrl, with  explicit parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 3)

			expect( modelC.makeUrl("GET", modelD) ).toBe( "/model_d/d/model_c/3.json" )
			expect( modelC.makeUrl("POST", modelD) ).toBe( "/model_d/d/model_c.json" )
			expect( modelC.makeUrl("PUT", modelD) ).toBe( "/model_d/d/model_c/3.json" )
			expect( modelC.makeUrl("DELETE", modelD) ).toBe( "/model_d/d/model_c/3.json" )
		#END it

		it "Should test the makeUrl method, with baseUrl, with explicit parent, with extension", ->
			modelD = new ModelD(id: "d")
			modelC = new ModelC(id: 3)
			Falcon.baseApiUrl = "http://www.falconjs.com/"

			expect( modelC.makeUrl("GET", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_c/3.json" )
			expect( modelC.makeUrl("POST", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_c.json" )
			expect( modelC.makeUrl("PUT", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_c/3.json" )
			expect( modelC.makeUrl("DELETE", modelD) ).toBe( "http://www.falconjs.com/model_d/d/model_c/3.json" )
		#END it

		it "Should be able to use url as a function, no parent", ->
			modelE = new ModelE(id: "e")

			expect( modelE.makeUrl("GET") ).toBe( "/model_e/e" )
			expect( modelE.makeUrl("POST") ).toBe( "/model_e" )
			expect( modelE.makeUrl("PUT") ).toBe( "/model_e/e" )
			expect( modelE.makeUrl("DELETE") ).toBe( "/model_e/e" )
		#END it

		it "Should be able to use url as a function, with parent", ->
			modelE = new ModelE(id: "e", new ModelB(id: "b") )

			expect( modelE.makeUrl("GET") ).toBe( "/model_b/b/model_e/e" )
			expect( modelE.makeUrl("POST") ).toBe( "/model_b/b/model_e" )
			expect( modelE.makeUrl("PUT") ).toBe( "/model_b/b/model_e/e" )
			expect( modelE.makeUrl("DELETE") ).toBe( "/model_b/b/model_e/e" )
		#END it

		it "Should be able to use override the url, no parent", ->
			modelD = new ModelD(id: "d", url: "model_d2")

			expect( modelD.makeUrl("GET") ).toBe( "/model_d2/d" )
			expect( modelD.makeUrl("POST") ).toBe( "/model_d2" )
			expect( modelD.makeUrl("PUT") ).toBe( "/model_d2/d" )
			expect( modelD.makeUrl("DELETE") ).toBe( "/model_d2/d" )
		#END it

		it "Should be able to use override the url,with parent", ->
			modelD = new ModelD({id: "d", url: "model_d3"}, new ModelB(id: "b") )

			expect( modelD.makeUrl("GET") ).toBe( "/model_b/b/model_d3/d" )
			expect( modelD.makeUrl("POST") ).toBe( "/model_b/b/model_d3" )
			expect( modelD.makeUrl("PUT") ).toBe( "/model_b/b/model_d3/d" )
			expect( modelD.makeUrl("DELETE") ).toBe( "/model_b/b/model_d3/d" )
		#END it

		it "Should be able to use override the function url, no parent", ->
			modelE = new ModelD(id: "d", url: "model_d2")

			expect( modelE.makeUrl("GET") ).toBe( "/model_d2/d" )
			expect( modelE.makeUrl("POST") ).toBe( "/model_d2" )
			expect( modelE.makeUrl("PUT") ).toBe( "/model_d2/d" )
			expect( modelE.makeUrl("DELETE") ).toBe( "/model_d2/d" )
		#END it

		it "Should be able to use override the function url,with parent", ->
			modelE = new ModelE({id: "e", url: "model_e3"}, new ModelB(id: "b") )

			expect( modelE.makeUrl("GET") ).toBe( "/model_b/b/model_e3/e" )
			expect( modelE.makeUrl("POST") ).toBe( "/model_b/b/model_e3" )
			expect( modelE.makeUrl("PUT") ).toBe( "/model_b/b/model_e3/e" )
			expect( modelE.makeUrl("DELETE") ).toBe( "/model_b/b/model_e3/e" )
		#END it

		it "Should be able to handle '/' baseApiUrl", ->
			modelA = new ModelA({id: 1})
			Falcon.baseApiUrl = "/"

			expect( modelA.makeUrl("GET") ).toBe( "/model_a/1" )
			expect( modelA.makeUrl("POST") ).toBe( "/model_a" )
			expect( modelA.makeUrl("PUT") ).toBe( "/model_a/1" )
			expect( modelA.makeUrl("DELETE") ).toBe( "/model_a/1" )
		#END it

		it "Should be able to handle have id override", ->
			modelA = new ModelA({id: 1})

			expect( modelA.makeUrl("GET", null, "things") ).toBe( "/model_a/things" )
			expect( modelA.makeUrl("POST", null, "things") ).toBe( "/model_a" )
			expect( modelA.makeUrl("PUT", null, "things") ).toBe( "/model_a/things" )
			expect( modelA.makeUrl("DELETE", null, "things") ).toBe( "/model_a/things" )
		#END it

		it "Should test the makeUrl method having id override with extension", ->
			modelC = new ModelC(id: 1)

			expect( modelC.makeUrl("GET", null, "things") ).toBe( "/model_c/things.json" )
			expect( modelC.makeUrl("POST", null, "things") ).toBe( "/model_c.json" )
			expect( modelC.makeUrl("PUT", null, "things") ).toBe( "/model_c/things.json" )
			expect( modelC.makeUrl("DELETE", null, "things") ).toBe( "/model_c/things.json" )
		#END it

		it "Should be able to handle have id override", ->
			modelA = new ModelA({id: 1})

			expect( modelA.makeUrl("GET", "things") ).toBe( "/model_a/things" )
			expect( modelA.makeUrl("POST", "things") ).toBe( "/model_a" )
			expect( modelA.makeUrl("PUT", "things") ).toBe( "/model_a/things" )
			expect( modelA.makeUrl("DELETE", "things") ).toBe( "/model_a/things" )
		#END it

		it "Should test the makeUrl method having id override with extension", ->
			modelC = new ModelC(id: 1)

			expect( modelC.makeUrl("GET", "things") ).toBe( "/model_c/things.json" )
			expect( modelC.makeUrl("POST", "things") ).toBe( "/model_c.json" )
			expect( modelC.makeUrl("PUT", "things") ).toBe( "/model_c/things.json" )
			expect( modelC.makeUrl("DELETE", "things") ).toBe( "/model_c/things.json" )
		#END it

		it "Should be able to handle have id override with an undefined parent", ->
			modelA = new ModelA({id: 1})

			expect( modelA.makeUrl("GET", undefined, "things") ).toBe( "/model_a/things" )
			expect( modelA.makeUrl("POST", undefined, "things") ).toBe( "/model_a" )
			expect( modelA.makeUrl("PUT", undefined, "things") ).toBe( "/model_a/things" )
			expect( modelA.makeUrl("DELETE", undefined, "things") ).toBe( "/model_a/things" )
		#END it

		it "Should test the makeUrl method having id override with extension and an undefined parent", ->
			modelC = new ModelC(id: 1)

			expect( modelC.makeUrl("GET", undefined, "things") ).toBe( "/model_c/things.json" )
			expect( modelC.makeUrl("POST", undefined, "things") ).toBe( "/model_c.json" )
			expect( modelC.makeUrl("PUT", undefined, "things") ).toBe( "/model_c/things.json" )
			expect( modelC.makeUrl("DELETE", undefined, "things") ).toBe( "/model_c/things.json" )
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
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "GET", undefined )
			#END it

			it "Should call sync correctly on fetch with options", ->
				modelA.fetch({})
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "GET", {} )
			#END it

			it "Should call sync correctly on create without options", ->
				modelA.create()
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "POST", undefined )
			#END it

			it "Should call sync correctly on create with options", ->
				modelA.create({})
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "POST", {} )

			it "Should call sync correctly on save without options", ->
				modelA.set('id',1)
				modelA.save()
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "PUT", undefined )
			#END it

			it "Should call sync correctly on save with options", ->
				modelA.set('id',1)
				modelA.save({})
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "PUT", {} )

			it "Should call sync correctly on destroy without options", ->
				modelA.destroy()
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "DELETE", undefined )
			#END it

			it "Should call sync correctly on destroy with options", ->
				modelA.destroy({})
				expect( sync_stub ).toHaveBeenCalledOnce()
				expect( sync_stub ).toHaveBeenCalledWith( "DELETE", {} )
			#END it
		#END describe

		describe "sync", ->
			model = new Falcon.Model

			beforeEach ->
				spyOn( Falcon.adapter, 'sync' )
			#END beforeEach

			it "Should call the falcon adapter", ->
				type = "GET"
				options = {}
				context = new Falcon.Model
				model.sync(type, options, context)

				expect( Falcon.adapter.sync.calls.count() ).toBe( 1 )
				expect( Falcon.adapter.sync ).toHaveBeenCalledWith(model, type, options, context)
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

		expect( modelA_1.equals( modelA_1 ) ).toBe( true )
		expect( modelA_1.equals( modelA_2 ) ).toBe( false )
		expect( modelA_1.equals( 1 ) ).toBe( true )
		expect( modelA_1.equals( new ModelA(id: 1) ) ).toBe( true )

		expect( modelA_a.equals( modelA_a ) ).toBe( true )
		expect( modelA_a.equals( modelA_2 ) ).toBe( false )
		expect( modelA_a.equals( 'a' ) ).toBe( true )
		expect( modelA_a.equals( new ModelA(id: 'a') ) ).toBe( true )

		expect( modelA_null_1.equals(modelA_null_2) ).toBe( false )
		expect( modelA_null_1.equals(modelA_null_1) ).toBe( true )
	#END if


	#--------------------------------------------------------------
	#
	# Test the mixin() method
	#
	#--------------------------------------------------------------
	describe "mixin", ->
		it "Should implement mixins properly", ->
			class ModelA extends Falcon.Model
				initialize: -> @model_b = new ModelB
			#END model a

			class ModelB extends Falcon.Model
			#END ModelB

			modelA = new ModelA

			expect( modelA.hello ).not.toBeDefined()
			expect( modelA.foo ).not.toBeDefined()
			expect( modelA.model_b.test ).not.toBeDefined()

			modelA.mixin({
				"hello": ( mixin_spy = sinon.spy() )
				"foo": ko.observable( "bar" )
				"model_b": {
					"test": "123"
				}
			})

			expect( modelA.hello ).toBeDefined()
			expect( modelA.hello ).toEqual(jasmine.any(Function))
			expect( ko.isObservable( modelA.foo ) ).toBe( true )
			expect( modelA.foo() ).toBe( 'bar' )
			expect( modelA.model_b.test ).toBeDefined()
			expect( modelA.model_b.test ).toBe( '123' )

			modelA.hello('world')
			expect( mixin_spy ).toHaveBeenCalledOnce()
			expect( mixin_spy ).toHaveBeenCalledOn( modelA )
			expect( mixin_spy.firstCall.args[0] ).toBe( 'world' )
		#END it

		it "Should preserve existing values in the model", ->
			class ModelA extends Falcon.Model
			#END model a

			model_a = new ModelA({"hello": "world", "foo": "bar"})

			expect( model_a.get("hello") ).toBe( "world" )
			expect( model_a.get("foo") ).toBe( "bar" )
			expect( ko.isObservable( model_a.hello ) ).toBe( false )

			model_a.mixin
				"hello": ko.observable()
				"foo": "baz"
			#END mixin

			expect( model_a.get("hello") ).toBe( "world" )
			expect( model_a.get("foo") ).toBe( "bar" )
			expect( ko.isObservable( model_a.hello ) ).toBe( true )
		#END it

		it "Should not overwrite existing values", ->
			class TheModel extends Falcon.Model
			#END TheModel

			the_model = new TheModel
			expect( the_model.get('is_read') ).not.toBeDefined()

			the_model.mixin(is_read: ko.observable(true))
			expect( ko.isObservable(the_model.is_read) ).toBe( true )
			expect( the_model.get('is_read') ).toBe( true )

			the_model.mixin(is_read: ko.observable(false))
			expect( ko.isObservable(the_model.is_read) ).toBe( true )
			expect( the_model.get('is_read') ).toBe( true )
		#END it

		it "Should not lose reference to existing observables", ->
			class TheModel extends Falcon.Model
				observables:
					'hello': 'world'
				#END observables
			#END TheModel

			the_model = new TheModel
			expect( the_model.hello() ).toBe( 'world' )
			original_observable = the_model.hello

			the_model.mixin
				'hello': ko.observable('foo bar')
			#END mixin
			expect( original_observable ).toBe( the_model.hello )
			expect( the_model.hello() ).toBe( 'world' )
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

			expect( modelA1 ).not.toBe( modelA2 )

			expect( modelA2.hello ).toBeDefined()
			expect( modelA2.foo ).toBeDefined()
			expect( modelA2.id ).toBeDefined()
			expect( modelA2.parent ).toBeDefined()

			expect( modelA2.id ).toBe( 1 )
			expect( modelA2.parent ).toBe( modelB )
			expect( ko.isObservable(modelA2.foo) ).toBe( true )
			expect( modelA2.foo() ).toBe( "bar")
		#END it

		it "Should do clone properly additional fields properly", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["id", "foo"])

			expect( modelA1 ).not.toBe( modelA2 )

			expect( modelA2.hello ).not.toBeDefined()
			expect( modelA2.foo ).toBeDefined()
			expect( modelA2.id ).toBeDefined()
			expect( modelA2.parent ).toBeDefined()

			expect( modelA2.id ).toBe( 1 )
			expect( modelA2.parent ).toBe( modelB )
			expect( ko.isObservable(modelA2.foo) ).toBe( true )
			expect( modelA2.foo() ).toBe( "bar")
		#END it

		it "Should do clone properly additional fields properly without parent", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["id", "hello"], null)

			expect( modelA1 ).not.toBe( modelA2 )

			expect( modelA2.hello ).toBeDefined()
			expect( modelA2.foo ).toBeDefined()
			expect( modelA2.id ).toBeDefined()
			expect( modelA2.parent ).toBeNull()

			expect( modelA2.id ).toBe( 1 )
			expect( modelA2.parent ).toBeNull()
			expect( ko.isObservable(modelA2.hello) ).toBe( false )
			expect( modelA2.hello ).toBe( "world")
			expect( ko.isObservable(modelA2.foo) ).toBe( true )
			expect( modelA2.foo() ).not.toBeDefined()
		#END it

		it "Should do clone properly with additional fields properly without parent or id fields", ->
			modelB  = new ModelB()
			modelA1 = new ModelA({
				id:		1
				hello:	"world"
				foo:	ko.observable("bar")
			}, modelB)
			modelA2 = modelA1.clone(["hello"], null)

			expect( modelA1 ).not.toBe( modelA2 )

			expect( modelA2.hello ).toBeDefined()
			expect( modelA2.foo ).toBeDefined()
			expect( modelA2.parent ).toBeNull()

			expect( modelA2.id ).toBeNull()
			expect( modelA2.parent ).toBeNull()
			expect( ko.isObservable(modelA2.hello) ).toBe( false )
			expect( modelA2.hello ).toBe( "world")
			expect( ko.isObservable(modelA2.foo) ).toBe( true )
			expect( modelA2.foo() ).not.toBeDefined()
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

			expect( modelA1 ).not.toBe( modelA2 )

			expect( modelA2.hello ).toBeDefined()
			expect( modelA2.foo ).toBeDefined()
			expect( modelA2.id ).toBeDefined()
			expect( modelA2.parent ).toBeDefined()
			expect( modelA2.parent ).toBe( modelC )

			expect( modelA2.id ).toBe( 1 )
			expect( modelA2.parent ).toBe( modelC )
			expect( ko.isObservable(modelA2.hello) ).toBe( false )
			expect( modelA2.hello ).toBe( "world")
			expect( ko.isObservable(modelA2.foo) ).toBe( true )
			expect( modelA2.foo() ).not.toBeDefined()
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

			expect( modelA1 ).not.toBe( modelA2 )

			expect( modelA2.hello ).toBeDefined()
			expect( modelA2.foo ).toBeDefined()
			expect( modelA2.parent ).toBeDefined()
			expect( modelA2.parent ).toBe( modelC )

			expect( modelA2.id ).toBeNull()
			expect( modelA2.parent ).toBe( modelC )
			expect( ko.isObservable(modelA2.hello) ).toBe( false )
			expect( modelA2.hello ).toBe( "world")
			expect( ko.isObservable(modelA2.foo) ).toBe( true )
			expect( modelA2.foo() ).not.toBeDefined()
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
		expect( modelA.isNew() ).toBe( true )

		modelA = new ModelA(id: 1)
		expect( modelA.isNew() ).toBe( false )

		modelA = new ModelA(id: 'a')
		expect( modelA.isNew() ).toBe( false )
	#END it
#END describe



