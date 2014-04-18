describe "Falcon.Object", ->
	obj = null

	beforeEach ->
		obj = new Falcon.Object()
	#END beforeEach

	describe "on, off, trigger, has", ->
		click_one = click_two = context_two = mouseover_one = null
		beforeEach ->
			obj.on "click", ( click_one = sinon.spy() )
			obj.on "click", ( click_two = sinon.spy() ), (context_two = {})
			obj.on "mouseover", ( mouseover_one = sinon.spy() )
		#END beforeEach

		it "Should not call any of the methods before trigger", ->
			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()
			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should trigger both click routines", ->
			obj.trigger "click", 1, 2, 3

			expect( click_one ).toHaveBeenCalledOnce()
			expect( click_one ).toHaveBeenCalledWith( 1, 2, 3 )

			expect( click_two ).toHaveBeenCalledOnce()
			expect( click_two ).toHaveBeenCalledWith( 1, 2, 3 )
			expect( click_two ).toHaveBeenCalledOn( context_two )

			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should call the mouseover routine", ->
			obj.trigger "mouseover", "go", true, {}

			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()

			expect( mouseover_one ).toHaveBeenCalledOnce()
			expect( mouseover_one ).toHaveBeenCalledWith( "go", true, {} )
		#END it

		it "Should be able to find the click event methods and shouldn't have attempted to call the methods", ->
			expect( obj.has "click", click_one ).toBe( true )
			expect( obj.has "click", click_two ).toBe( true )
			expect( obj.has "click", mouseover_one ).toBe( false )

			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()
			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should be able to find the mouseover event methods", ->
			expect( obj.has "mouseover", click_one ).toBe( false )
			expect( obj.has "mouseover", click_two ).toBe( false )
			expect( obj.has "mouseover", mouseover_one ).toBe( true )

			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()
			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should be able to remove an event properly", ->
			obj.off "click", click_one
			obj.trigger "click", 4,5,6

			expect( click_one ).not.toHaveBeenCalled()

			expect( click_two ).toHaveBeenCalledOnce()
			expect( click_two ).toHaveBeenCalledWith( 4,5,6 )

			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it
	#END describe

	describe "listenTo", ->
		object = model = model_2 = collection = view = null
		login_callback = notify_callback = null

		beforeEach ->
			object = new Falcon.Object
			model = new Falcon.Model
			model_2 = new Falcon.Model
			collection = new Falcon.Collection
			view = new Falcon.View

			login_callback = sinon.spy()
			notify_callback = sinon.spy()
		#END beofreEach

		it "Should have no listeners by default", ->
			expect( object.__falcon_object__listeners__ ).toBeNull()
		#END it

		it "Should add listeners properly", ->
			expect( object.listenTo(model, "login", login_callback) ).toBe( object )
			expect( object.listenTo(model_2, "login", notify_callback) ).toBe( object )
			expect( object.listenTo(model_2, "login", login_callback) ).toBe( object )

			expect( login_callback ).not.toHaveBeenCalled()

			expect( object.__falcon_object__listeners__.length ).toBe( 3 )

			model.trigger("login")
			expect( login_callback ).toHaveBeenCalledOnce()
			expect( login_callback ).toHaveBeenCalledOn( object )
			expect( notify_callback ).not.toHaveBeenCalled()
			login_callback.reset()

			model_2.trigger("login")
			expect( login_callback ).toHaveBeenCalledOnce()
			expect( login_callback ).toHaveBeenCalledOn( object )
			expect( notify_callback ).toHaveBeenCalledOnce()
			expect( notify_callback ).toHaveBeenCalledOn( object )
		#END it
	#END describe

	describe "stopListening", ->
		object = model = view = null
		callback_one = callback_two = null

		beforeEach ->
			object = new Falcon.Object
			model = new Falcon.Model
			view = new Falcon.View

			callback_one = sinon.spy()
			callback_two = sinon.spy()

			object.listenTo(model, "login", callback_one)
			object.listenTo(model, "login", callback_one) #Bound twice on purpose
			object.listenTo(model, "notify", callback_two)

			object.listenTo(view, "login", callback_two)
			object.listenTo(view, "notify", callback_one)
		#END beofreEach

		it "Should stop listening to everything", ->
			ret = object.stopListening()

			model.trigger("login", "model login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			view.trigger("notify", "view notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listening to events based on object", ->
			ret = object.stopListening(model)

			model.trigger("login", "model login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("view login")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listening to events based on event", ->
			ret = object.stopListening("login")

			model.trigger("login", "model login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("model notify")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listeing to events based on callback", ->
			ret = object.stopListening(callback_one)

			model.trigger("login", "model login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("model notify")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("view login")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("notify", "view notify")
			expect( callback_one ).not.toHaveBeenCalledOnce()
			expect( callback_two ).not.toHaveBeenCalled()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listening to events based on object and event", ->
			ret = object.stopListening(model, "login")

			model.trigger("login", "model login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("model notify")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("view login")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listening to events based on object and callback", ->
			ret = object.stopListening(model, callback_two)

			model.trigger("login", "model login")
			expect( callback_one ).toHaveBeenCalledTwice()
			expect( callback_one ).toHaveBeenCalledWith("model login")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("view login")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listening to events based on event and callback", ->
			ret = object.stopListening("login", callback_two)

			model.trigger("login", "model login")
			expect( callback_one ).toHaveBeenCalledTwice()
			expect( callback_one ).toHaveBeenCalledWith("model login")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("model notify")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			expect( ret ).toBe( object )
		#END it

		it "Should stop listening to events based on object, event, and callback", ->
			ret = object.stopListening(model, "login", callback_one)

			model.trigger("login", "model login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).not.toHaveBeenCalled()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("model notify")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("view login")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			expect( ret ).toBe( object )
		#END it

		it "Should not remove any events if nothing matches", ->
			invalid_callback = sinon.spy()

			expect( object.stopListening( new Falcon.Collection) ).toBe( object )
			expect( object.stopListening( "invalid_event") ).toBe( object )
			expect( object.stopListening( invalid_callback ) ).toBe( object )
			expect( object.stopListening( model, "invalid_event") ).toBe( object )
			expect( object.stopListening( model, invalid_callback ) ).toBe( object )
			expect( object.stopListening( model, "login", invalid_callback ) ).toBe( object )

			expect( invalid_callback ).not.toHaveBeenCalled()

			model.trigger("login", "model login")
			expect( callback_one ).toHaveBeenCalledTwice()
			expect( callback_one ).toHaveBeenCalledWith("model login")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()

			model.trigger("notify", "model notify")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("model notify")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("login", "view login")
			expect( callback_one ).not.toHaveBeenCalled()
			expect( callback_two ).toHaveBeenCalledOnce()
			expect( callback_two ).toHaveBeenCalledWith("view login")
			expect( callback_two ).toHaveBeenCalledOn( object )
			callback_two.reset()

			view.trigger("notify", "view notify")
			expect( callback_one ).toHaveBeenCalledOnce()
			expect( callback_one ).toHaveBeenCalledWith("view notify")
			expect( callback_one ).toHaveBeenCalledOn( object )
			expect( callback_two ).not.toHaveBeenCalled()
			callback_one.reset()
		#END it
	#END describe

	describe "Test #observables and #defaults", ->
		class Clazz extends Falcon.Object
			defaults:
				'id': 'z'
				'im': -> 'here'
			#END defaults
		#END Clazz

		class Klass extends Falcon.Object
			defaults:
				'id': -1
				'foo': 'bar'
				'free': 'bird'
				'def_arr': [1,2,3]
				'clazz': -> new Clazz
			#END defaults

			observables:
				'hello': 'world'
				'foo': 'baz'
				'arr': ['1', '2']
				'test': -> 'method'
				'_another': 'good'
				'another':
					read: -> @_another() + ' ' + @test()
					write: (value) -> @_another( value )
				#END another
			#END observables
		#END Klass

		obj = null

		beforeEach ->
			obj = new Klass
		#END beforeEach

		it "Should have added the correct default attributes", ->
			expect( obj['id'] ).toBeDefined()
			expect( obj['foo'] ).toBeDefined()
			expect( obj['free'] ).toBeDefined()
			expect( obj['def_arr'] ).toBeDefined()
			expect( obj['clazz'] ).toBeDefined()
		#END it

		it "Should have added the correct observable attributes", ->
			expect( obj['hello'] ).toBeDefined()
			expect( obj['foo'] ).toBeDefined()
			expect( obj['test'] ).toBeDefined()
			expect( obj['_another'] ).toBeDefined()
			expect( obj['another'] ).toBeDefined()
		#END it

		it "Should have added the correct default values", ->
			expect( obj.id ).toBe( -1 )
			expect( obj.foo ).not.toBe 'bar' #Should have been overitten by
			expect( obj.free ).toBe( 'bird'  )
			expect( obj.clazz ).toEqual( jasmine.any(Clazz) )
		#END it

		it "Should have the correct values for a default array", ->
			expect( obj.def_arr ).toEqual( [1,2,3] )
			expect( obj.def_arr ).not.toBe( Klass::defaults.def_arr )
		#END it

		it "Should have added the correct observable type", ->
			expect( ko.isObservable( obj.hello ) ).toBe( true )
			expect( ko.isObservable( obj.foo ) ).toBe( true )
			expect( ko.isComputed( obj.test ) ).toBe( true )
			expect( ko.isObservable( obj._another ) ).toBe( true )
			expect( ko.isComputed( obj.another ) ).toBe( true )
		#END it

		it "Should have added the correct writeable observable type", ->
			expect( ko.isWriteableObservable( obj.hello ) ).toBe( true )
			expect( ko.isWriteableObservable( obj.foo ) ).toBe( true )
			expect( ko.isWriteableObservable( obj.test ) ).toBe( false )
			expect( ko.isWriteableObservable( obj._another ) ).toBe( true )
			expect( ko.isWriteableObservable( obj.another ) ).toBe( true )
		#END it

		it "Should have assigned the correct values to observables", ->
			expect( ko.utils.unwrapObservable( obj.hello ) ).toBe( "world" )
			expect( ko.utils.unwrapObservable( obj.foo ) ).toBe( "baz" )
			expect( ko.utils.unwrapObservable( obj.test ) ).toBe( "method" )
			expect( ko.utils.unwrapObservable( obj._another ) ).toBe( "good" )
			expect( ko.utils.unwrapObservable( obj.another ) ).toBe( "good method" )

			obj.another("great")
			expect( ko.utils.unwrapObservable( obj.another ) ).toBe( "great method" )
		#END it

		it "Should have propogated defaults in the child class", ->
			expect( obj.clazz.id ).toBe( 'z' )
			expect( obj.clazz.im ).toBe( 'here' )
		#END it

		it "Should have an observable array", ->
			expect( ko.isObservable( obj.arr ) ).toBe( true )
			expect( obj.arr() ).toEqual( jasmine.any(Array) )
			expect( obj.arr().length ).toBe( 2 )
			expect( obj.arr() ).not.toBe( Klass::observables.arr ) #Make sure this is a clone, not the original array definition
		#END it

		it "Should create RawrClass with defaults that have the correct arguments", ->
			hello_spy = null

			class RawrClass extends Falcon.Object
				defaults:
					'hello': ( hello_spy = sinon.spy() )
				#END defaults
			#END RawrClass
			
			expect( hello_spy ).not.toHaveBeenCalled()

			rawr_class = new RawrClass("one", "two", "three")

			expect( hello_spy ).toHaveBeenCalled()
			expect( hello_spy.callCount ).toBe( 1 )
			expect( hello_spy.firstCall.args.length ).toBe( 3 )
			expect( hello_spy.firstCall.args[0] ).toBe( "one" )
			expect( hello_spy.firstCall.args[1] ).toBe( "two" )
			expect( hello_spy.firstCall.args[2] ).toBe( "three" )
		#END it
	#END describe

	describe "Test the extend method on objects", ->
		it "Should extend Falcon.Object properly", ->
			custom_spy = sinon.spy()
			things_spy = sinon.spy()

			Klass = Falcon.Object.extend({
				'custom': -> custom_spy.call( @ )
				'text': 'test'
			},{
				'things': -> things_spy.call( @ )
			});

			my_obj = new Klass

			expect( my_obj ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.View) )

			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_obj.custom ).toEqual(jasmine.any(Function))
			expect( my_obj.text ).toEqual(jasmine.any(String))

			my_obj.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			Klass.things()

			expect( things_spy ).toHaveBeenCalled()
			expect( things_spy.firstCall ).toHaveBeenCalledOn( Klass )
		#END it

		it "Should extend Falcon.Model properly", ->
			custom_spy = sinon.spy()
			things_spy = sinon.spy()
			init_spy = sinon.spy()

			Klass = Falcon.Model.extend({
				'initialize': -> init_spy.call( @ )
				'custom': -> custom_spy.call( @ )
				'text': 'test'
			},{
				'things': -> things_spy.call( @ )
			});

			my_obj = new Klass

			expect( my_obj ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_obj ).toEqual( jasmine.any(Falcon.Model) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.View) )

			expect( Klass::initialize ).toEqual(jasmine.any(Function))
			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_obj.initialize ).toEqual(jasmine.any(Function))
			expect( my_obj.custom ).toEqual(jasmine.any(Function))
			expect( my_obj.text ).toEqual(jasmine.any(String))

			expect( init_spy ).toHaveBeenCalled()
			expect( init_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			my_obj.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			Klass.things()

			expect( things_spy ).toHaveBeenCalled()
			expect( things_spy.firstCall ).toHaveBeenCalledOn( Klass )
		#END it

		it "Should extend Falcon.Collection properly", ->
			custom_spy = sinon.spy()
			things_spy = sinon.spy()
			init_spy = sinon.spy()

			Klass = Falcon.Collection.extend({
				'initialize': -> init_spy.call( @ )
				'custom': -> custom_spy.call( @ )
				'text': 'test'
			},{
				'things': -> things_spy.call( @ )
			});

			my_obj = new Klass

			expect( my_obj ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( my_obj ).toEqual( jasmine.any(Falcon.Collection) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.View) )

			expect( Klass::initialize ).toEqual(jasmine.any(Function))
			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_obj.initialize ).toEqual(jasmine.any(Function))
			expect( my_obj.custom ).toEqual(jasmine.any(Function))
			expect( my_obj.text ).toEqual(jasmine.any(String))

			expect( init_spy ).toHaveBeenCalled()
			expect( init_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			my_obj.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			Klass.things()

			expect( things_spy ).toHaveBeenCalled()
			expect( things_spy.firstCall ).toHaveBeenCalledOn( Klass )
		#END it

		it "Should extend Falcon.View properly", ->
			custom_spy = sinon.spy()
			things_spy = sinon.spy()
			init_spy = sinon.spy()

			Klass = Falcon.View.extend({
				'initialize': -> init_spy.call( @ )
				'custom': -> custom_spy.call( @ )
				'text': 'test'
			},{
				'things': -> things_spy.call( @ )
			});

			my_obj = new Klass

			expect( my_obj ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( my_obj ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( my_obj ).toEqual( jasmine.any(Falcon.View) )

			expect( Klass::initialize ).toEqual(jasmine.any(Function))
			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_obj.initialize ).toEqual(jasmine.any(Function))
			expect( my_obj.custom ).toEqual(jasmine.any(Function))
			expect( my_obj.text ).toEqual(jasmine.any(String))

			expect( init_spy ).toHaveBeenCalled()
			expect( init_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			my_obj.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_obj )

			Klass.things()

			expect( things_spy ).toHaveBeenCalled()
			expect( things_spy.firstCall ).toHaveBeenCalledOn( Klass )
		#END it

		it "Should allow for deep inheritence", ->
			custom_spy = sinon.spy()
			things_spy = sinon.spy()

			Klass = Falcon.Object.extend({
				'custom': -> custom_spy.call( @ )
				'text': 'test'
			},{
				'things': -> things_spy.call( @ )
			});

			ChildKlass = Klass.extend({
				'another': (->)
			},{
				'foo': 'bar'
			})

			child_obj = new ChildKlass

			expect( child_obj ).toEqual( jasmine.any(Falcon.Object) )
			expect( child_obj ).toEqual( jasmine.any(Klass) )
			expect( child_obj ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( child_obj ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( child_obj ).not.toEqual( jasmine.any(Falcon.View) )

			expect( ChildKlass::custom ).toEqual(jasmine.any(Function))
			expect( ChildKlass::text ).toEqual(jasmine.any(String))
			expect( ChildKlass::another ).toEqual(jasmine.any(Function))
			expect( ChildKlass.things ).toEqual(jasmine.any(Function))
			expect( ChildKlass.foo ).toEqual(jasmine.any(String))

			expect( child_obj.custom ).toEqual(jasmine.any(Function))
			expect( child_obj.text ).toEqual(jasmine.any(String))
			expect( child_obj.another ).toEqual(jasmine.any(Function))

			child_obj.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( child_obj )

			ChildKlass.things()

			expect( things_spy ).toHaveBeenCalled()
			expect( things_spy.firstCall ).toHaveBeenCalledOn( ChildKlass )
		#END it
	#END describe
#END describe