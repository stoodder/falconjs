describe "Falcon.Object", ->
	klass = null

	beforeEach ->
		klass = new Falcon.Object
	#END beforeEach

	describe "on, off, trigger, has", ->
		click_one = click_two = context_two = mouseover_one = null
		beforeEach ->
			klass.on "click", ( click_one = sinon.spy() )
			klass.on "click", ( click_two = sinon.spy() ), (context_two = {})
			klass.on "mouseover", ( mouseover_one = sinon.spy() )
		#END beforeEach

		it "Should not call any of the methods before trigger", ->
			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()
			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should trigger both click routines", ->
			klass.trigger "click", 1, 2, 3

			expect( click_one ).toHaveBeenCalledOnce()
			expect( click_one ).toHaveBeenCalledWith( 1, 2, 3 )

			expect( click_two ).toHaveBeenCalledOnce()
			expect( click_two ).toHaveBeenCalledWith( 1, 2, 3 )
			expect( click_two ).toHaveBeenCalledOn( context_two )

			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should call the mouseover routine", ->
			klass.trigger "mouseover", "go", true, {}

			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()

			expect( mouseover_one ).toHaveBeenCalledOnce()
			expect( mouseover_one ).toHaveBeenCalledWith( "go", true, {} )
		#END it

		it "Should be able to find the click event methods and shouldn't have attempted to call the methods", ->
			expect( klass.has "click", click_one ).toBe( true )
			expect( klass.has "click", click_two ).toBe( true )
			expect( klass.has "click", mouseover_one ).toBe( false )

			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()
			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should be able to find the mouseover event methods", ->
			expect( klass.has "mouseover", click_one ).toBe( false )
			expect( klass.has "mouseover", click_two ).toBe( false )
			expect( klass.has "mouseover", mouseover_one ).toBe( true )

			expect( click_one ).not.toHaveBeenCalled()
			expect( click_two ).not.toHaveBeenCalled()
			expect( mouseover_one ).not.toHaveBeenCalled()
		#END it

		it "Should be able to remove an event properly", ->
			klass.off "click", click_one
			klass.trigger "click", 4,5,6

			expect( click_one ).not.toHaveBeenCalled()

			expect( click_two ).toHaveBeenCalledOnce()
			expect( click_two ).toHaveBeenCalledWith( 4,5,6 )

			expect( mouseover_one ).not.toHaveBeenCalled()
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

		klass = null

		beforeEach ->
			klass = new Klass
		#END beforeEach

		it "Should have added the correct default attributes", ->
			expect( klass['id'] ).toBeDefined()
			expect( klass['foo'] ).toBeDefined()
			expect( klass['free'] ).toBeDefined()
			expect( klass['def_arr'] ).toBeDefined()
			expect( klass['clazz'] ).toBeDefined()
		#END it

		it "Should have added the correct observable attributes", ->
			expect( klass['hello'] ).toBeDefined()
			expect( klass['foo'] ).toBeDefined()
			expect( klass['test'] ).toBeDefined()
			expect( klass['_another'] ).toBeDefined()
			expect( klass['another'] ).toBeDefined()
		#END it

		it "Should have added the correct default values", ->
			expect( klass.id ).toBe( -1 )
			expect( klass.foo ).not.toBe 'bar' #Should have been overitten by
			expect( klass.free ).toBe( 'bird'  )
			expect( klass.clazz ).toEqual( jasmine.any(Clazz) )
		#END it

		it "Should have the correct values for a default array", ->
			expect( klass.def_arr ).toEqual( [1,2,3] )
			expect( klass.def_arr ).not.toBe( Klass::defaults.def_arr )
		#END it

		it "Should have added the correct observable type", ->
			expect( ko.isObservable( klass.hello ) ).toBe( true )
			expect( ko.isObservable( klass.foo ) ).toBe( true )
			expect( ko.isComputed( klass.test ) ).toBe( true )
			expect( ko.isObservable( klass._another ) ).toBe( true )
			expect( ko.isComputed( klass.another ) ).toBe( true )
		#END it

		it "Should have added the correct writeable observable type", ->
			expect( ko.isWriteableObservable( klass.hello ) ).toBe( true )
			expect( ko.isWriteableObservable( klass.foo ) ).toBe( true )
			expect( ko.isWriteableObservable( klass.test ) ).toBe( false )
			expect( ko.isWriteableObservable( klass._another ) ).toBe( true )
			expect( ko.isWriteableObservable( klass.another ) ).toBe( true )
		#END it

		it "Should have assigned the correct values to observables", ->
			expect( ko.utils.unwrapObservable( klass.hello ) ).toBe( "world" )
			expect( ko.utils.unwrapObservable( klass.foo ) ).toBe( "baz" )
			expect( ko.utils.unwrapObservable( klass.test ) ).toBe( "method" )
			expect( ko.utils.unwrapObservable( klass._another ) ).toBe( "good" )
			expect( ko.utils.unwrapObservable( klass.another ) ).toBe( "good method" )

			klass.another("great")
			expect( ko.utils.unwrapObservable( klass.another ) ).toBe( "great method" )
		#END it

		it "Should have propogated defaults in the child class", ->
			expect( klass.clazz.id ).toBe( 'z' )
			expect( klass.clazz.im ).toBe( 'here' )
		#END it

		it "Should have an observable array", ->
			expect( ko.isObservable( klass.arr ) ).toBe( true )
			expect( klass.arr() ).toEqual( jasmine.any(Array) )
			expect( klass.arr().length ).toBe( 2 )
			expect( klass.arr() ).not.toBe( Klass::observables.arr ) #Make sure this is a clone, not the original array definition
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

			my_klass = new Klass

			expect( my_klass ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.View) )

			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_klass.custom ).toEqual(jasmine.any(Function))
			expect( my_klass.text ).toEqual(jasmine.any(String))

			my_klass.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_klass )

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

			my_klass = new Klass

			expect( my_klass ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_klass ).toEqual( jasmine.any(Falcon.Model) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.View) )

			expect( Klass::initialize ).toEqual(jasmine.any(Function))
			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_klass.initialize ).toEqual(jasmine.any(Function))
			expect( my_klass.custom ).toEqual(jasmine.any(Function))
			expect( my_klass.text ).toEqual(jasmine.any(String))

			expect( init_spy ).toHaveBeenCalled()
			expect( init_spy.firstCall ).toHaveBeenCalledOn( my_klass )

			my_klass.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_klass )

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

			my_klass = new Klass

			expect( my_klass ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( my_klass ).toEqual( jasmine.any(Falcon.Collection) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.View) )

			expect( Klass::initialize ).toEqual(jasmine.any(Function))
			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_klass.initialize ).toEqual(jasmine.any(Function))
			expect( my_klass.custom ).toEqual(jasmine.any(Function))
			expect( my_klass.text ).toEqual(jasmine.any(String))

			expect( init_spy ).toHaveBeenCalled()
			expect( init_spy.firstCall ).toHaveBeenCalledOn( my_klass )

			my_klass.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_klass )

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

			my_klass = new Klass

			expect( my_klass ).toEqual( jasmine.any(Falcon.Object) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( my_klass ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( my_klass ).toEqual( jasmine.any(Falcon.View) )

			expect( Klass::initialize ).toEqual(jasmine.any(Function))
			expect( Klass::custom ).toEqual(jasmine.any(Function))
			expect( Klass::text ).toEqual(jasmine.any(String))
			expect( Klass.things ).toEqual(jasmine.any(Function))

			expect( my_klass.initialize ).toEqual(jasmine.any(Function))
			expect( my_klass.custom ).toEqual(jasmine.any(Function))
			expect( my_klass.text ).toEqual(jasmine.any(String))

			expect( init_spy ).toHaveBeenCalled()
			expect( init_spy.firstCall ).toHaveBeenCalledOn( my_klass )

			my_klass.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( my_klass )

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

			child_klass = new ChildKlass

			expect( child_klass ).toEqual( jasmine.any(Falcon.Object) )
			expect( child_klass ).toEqual( jasmine.any(Klass) )
			expect( child_klass ).not.toEqual( jasmine.any(Falcon.Model) )
			expect( child_klass ).not.toEqual( jasmine.any(Falcon.Collection) )
			expect( child_klass ).not.toEqual( jasmine.any(Falcon.View) )

			expect( ChildKlass::custom ).toEqual(jasmine.any(Function))
			expect( ChildKlass::text ).toEqual(jasmine.any(String))
			expect( ChildKlass::another ).toEqual(jasmine.any(Function))
			expect( ChildKlass.things ).toEqual(jasmine.any(Function))
			expect( ChildKlass.foo ).toEqual(jasmine.any(String))

			expect( child_klass.custom ).toEqual(jasmine.any(Function))
			expect( child_klass.text ).toEqual(jasmine.any(String))
			expect( child_klass.another ).toEqual(jasmine.any(Function))

			child_klass.custom()

			expect( custom_spy ).toHaveBeenCalled()
			expect( custom_spy.firstCall ).toHaveBeenCalledOn( child_klass )

			ChildKlass.things()

			expect( things_spy ).toHaveBeenCalled()
			expect( things_spy.firstCall ).toHaveBeenCalledOn( ChildKlass )
		#END it
	#END describe
#END describe