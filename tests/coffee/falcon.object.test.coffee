describe "Tesing event functionality", ->
	klass = null

	beforeEach ->
		klass = new Falcon.Object
	#END beforeEach

	it "Should have correct method definitions", ->
		expect(klass.on).to.be.a('function')
		expect(klass.on).to.have.length(3)

		expect(klass.off).to.be.a('function')
		expect(klass.off).to.have.length(2)

		expect(klass.has).to.be.a('function')
		expect(klass.has).to.have.length(2)

		expect(klass.trigger).to.be.a('function')
	#END it

	it "Should test event methods", ->
		klass.on "click", ( click_one = sinon.spy() )
		klass.on "click", ( click_two = sinon.spy() ), (context_two = {})
		klass.on "mouseover", ( mouseover_one = sinon.spy() )

		click_one.should.not.have.been.called
		click_two.should.not.have.been.called
		mouseover_one.should.not.have.been.called

		klass.trigger "click", 1, 2, 3

		click_one.should.have.been.calledOnce
		click_one.should.have.been.calledWith 1, 2, 3

		click_two.should.have.been.calledOnce
		click_two.should.have.been.calledWith 1, 2, 3
		click_two.should.have.been.calledOn context_two

		mouseover_one.should.not.have.been.called

		klass.trigger "mouseover", "go", true, {}

		click_one.should.have.been.calledOnce

		click_two.should.have.been.calledOnce

		mouseover_one.should.have.been.calledOnce
		mouseover_one.should.have.been.calledWith "go", true, {}

		expect( klass.has "click", click_one ).to.be.true
		expect( klass.has "click", click_two ).to.be.true
		expect( klass.has "click", mouseover_one ).to.be.false

		click_one.should.have.been.calledOnce
		click_two.should.have.been.calledOnce
		mouseover_one.should.have.been.calledOnce

		expect( klass.has "mouseover", click_one ).to.be.false
		expect( klass.has "mouseover", click_two ).to.be.false
		expect( klass.has "mouseover", mouseover_one ).to.be.true

		click_one.should.have.been.calledOnce
		click_two.should.have.been.calledOnce
		mouseover_one.should.have.been.calledOnce

		klass.off "click", click_one
		klass.trigger "click", 4,5,6

		click_one.should.have.been.calledOnce

		click_two.should.have.been.calledTwice
		click_two.should.have.been.calledWith 4,5,6

		mouseover_one.should.have.been.calledOnce
	#END its

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
			expect( klass ).to.include.key 'id'
			expect( klass ).to.include.key 'foo'
			expect( klass ).to.include.key 'clazz'
		#END it

		it "Should have added the correct observable attributes", ->
			expect( klass ).to.include.key 'hello'
			expect( klass ).to.include.key 'foo'
			expect( klass ).to.include.key 'test'
			expect( klass ).to.include.key '_another'
			expect( klass ).to.include.key 'another'
		#END it

		it "Should have added the correct default values", ->
			expect( klass.id ).to.equal -1
			expect( klass.foo ).to.not.equal 'bar' #Should have been overitten by
			expect( klass.free ).to.equal 'bird' 
			expect( klass.clazz ).to.be.instanceof Clazz
		#END it

		it "Should have added the correct observable type", ->
			expect( ko.isObservable( klass.hello ) ).to.be.true
			expect( ko.isObservable( klass.foo ) ).to.be.true
			expect( ko.isComputed( klass.test ) ).to.be.true
			expect( ko.isObservable( klass._another ) ).to.be.true
			expect( ko.isComputed( klass.another ) ).to.be.true
		#END it

		it "Should have added the correct writeable observable type", ->
			expect( ko.isWriteableObservable( klass.hello ) ).to.be.true
			expect( ko.isWriteableObservable( klass.foo ) ).to.be.true
			expect( ko.isWriteableObservable( klass.test ) ).to.be.false
			expect( ko.isWriteableObservable( klass._another ) ).to.be.true
			expect( ko.isWriteableObservable( klass.another ) ).to.be.true
		#END it

		it "Should have assigned the correct values to observables", ->
			expect( ko.utils.unwrapObservable( klass.hello ) ).to.equal "world"
			expect( ko.utils.unwrapObservable( klass.foo ) ).to.equal "baz"
			expect( ko.utils.unwrapObservable( klass.test ) ).to.equal "method"
			expect( ko.utils.unwrapObservable( klass._another ) ).to.equal "good"
			expect( ko.utils.unwrapObservable( klass.another ) ).to.equal "good method"

			klass.another("great")
			expect( ko.utils.unwrapObservable( klass.another ) ).to.equal "great method"
		#END it

		it "Should have propogated defaults in the child class", ->
			expect( klass.clazz.id ).to.equal 'z'
			expect( klass.clazz.im ).to.equal 'here'
		#END it

		it "Should have an observable array", ->
			expect( ko.isObservable( klass.arr ) ).to.be.true
			expect( klass.arr() ).to.be.instanceof Array
			expect( klass.arr().length ).to.equal 2
			expect( klass.arr() ).to.not.equal( Klass::observables.arr ) #Make sure this is a clone, not the original array definition
		#END it

		it "Should create RawrClass with defaults that have the correct arguments", ->
			hello_spy = null

			class RawrClass extends Falcon.Object
				defaults:
					'hello': ( hello_spy = sinon.spy() )
				#END defaults
			#END RawrClass
			
			expect( hello_spy ).to.not.have.been.called

			rawr_class = new RawrClass("one", "two", "three")

			expect( hello_spy ).to.have.been.called
			expect( hello_spy.callCount ).to.equal 1
			expect( hello_spy.firstCall.args.length ).to.equal 3
			expect( hello_spy.firstCall.args[0] ).to.equal "one"
			expect( hello_spy.firstCall.args[1] ).to.equal "two"
			expect( hello_spy.firstCall.args[2] ).to.equal "three"
		#END it


	#END describe

	describe "Test the extend method on objects", ->
		ajax_stub = null
		beforeEach ->
			ajax_stub = sinon.stub( $, 'ajax' )
		#END beforeEach

		afterEach ->
			ajax_stub.restore()
		#END afterEach

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

			expect( my_klass ).to.be.instanceof Falcon.Object
			expect( my_klass ).not.to.be.instanceof Falcon.Model
			expect( my_klass ).not.to.be.instanceof Falcon.Collection
			expect( my_klass ).not.to.be.instanceof Falcon.View

			expect( Klass::custom ).to.be.a 'function'
			expect( Klass::text ).to.be.a 'string'
			expect( Klass.things ).to.be.a 'function'

			expect( my_klass.custom ).to.be.a 'function'
			expect( my_klass.text ).to.be.a 'string'

			my_klass.custom()

			expect( custom_spy ).to.have.been.called
			expect( custom_spy.firstCall ).to.have.been.calledOn my_klass

			Klass.things()

			expect( things_spy ).to.have.been.called
			expect( things_spy.firstCall ).to.have.been.calledOn Klass
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

			expect( my_klass ).to.be.instanceof Falcon.Object
			expect( my_klass ).to.be.instanceof Falcon.Model
			expect( my_klass ).not.to.be.instanceof Falcon.Collection
			expect( my_klass ).not.to.be.instanceof Falcon.View

			expect( Klass::initialize ).to.be.a 'function'
			expect( Klass::custom ).to.be.a 'function'
			expect( Klass::text ).to.be.a 'string'
			expect( Klass.things ).to.be.a 'function'

			expect( my_klass.initialize ).to.be.a 'function'
			expect( my_klass.custom ).to.be.a 'function'
			expect( my_klass.text ).to.be.a 'string'

			expect( init_spy ).to.have.been.called
			expect( init_spy.firstCall ).to.have.been.calledOn my_klass

			my_klass.custom()

			expect( custom_spy ).to.have.been.called
			expect( custom_spy.firstCall ).to.have.been.calledOn my_klass

			Klass.things()

			expect( things_spy ).to.have.been.called
			expect( things_spy.firstCall ).to.have.been.calledOn Klass
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

			expect( my_klass ).to.be.instanceof Falcon.Object
			expect( my_klass ).not.to.be.instanceof Falcon.Model
			expect( my_klass ).to.be.instanceof Falcon.Collection
			expect( my_klass ).not.to.be.instanceof Falcon.View

			expect( Klass::initialize ).to.be.a 'function'
			expect( Klass::custom ).to.be.a 'function'
			expect( Klass::text ).to.be.a 'string'
			expect( Klass.things ).to.be.a 'function'

			expect( my_klass.initialize ).to.be.a 'function'
			expect( my_klass.custom ).to.be.a 'function'
			expect( my_klass.text ).to.be.a 'string'

			expect( init_spy ).to.have.been.called
			expect( init_spy.firstCall ).to.have.been.calledOn my_klass

			my_klass.custom()

			expect( custom_spy ).to.have.been.called
			expect( custom_spy.firstCall ).to.have.been.calledOn my_klass

			Klass.things()

			expect( things_spy ).to.have.been.called
			expect( things_spy.firstCall ).to.have.been.calledOn Klass
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

			expect( my_klass ).to.be.instanceof Falcon.Object
			expect( my_klass ).not.to.be.instanceof Falcon.Model
			expect( my_klass ).not.to.be.instanceof Falcon.Collection
			expect( my_klass ).to.be.instanceof Falcon.View

			expect( Klass::initialize ).to.be.a 'function'
			expect( Klass::custom ).to.be.a 'function'
			expect( Klass::text ).to.be.a 'string'
			expect( Klass.things ).to.be.a 'function'

			expect( my_klass.initialize ).to.be.a 'function'
			expect( my_klass.custom ).to.be.a 'function'
			expect( my_klass.text ).to.be.a 'string'

			expect( init_spy ).to.have.been.called
			expect( init_spy.firstCall ).to.have.been.calledOn my_klass

			my_klass.custom()

			expect( custom_spy ).to.have.been.called
			expect( custom_spy.firstCall ).to.have.been.calledOn my_klass

			Klass.things()

			expect( things_spy ).to.have.been.called
			expect( things_spy.firstCall ).to.have.been.calledOn Klass
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

			expect( child_klass ).to.be.instanceof Falcon.Object
			expect( child_klass ).to.be.instanceof Klass
			expect( child_klass ).not.to.be.instanceof Falcon.Model
			expect( child_klass ).not.to.be.instanceof Falcon.Collection
			expect( child_klass ).not.to.be.instanceof Falcon.View

			expect( ChildKlass::custom ).to.be.a 'function'
			expect( ChildKlass::text ).to.be.a 'string'
			expect( ChildKlass::another ).to.be.a 'function'
			expect( ChildKlass.things ).to.be.a 'function'
			expect( ChildKlass.foo ).to.be.a 'string'

			expect( child_klass.custom ).to.be.a 'function'
			expect( child_klass.text ).to.be.a 'string'
			expect( child_klass.another ).to.be.a 'function'

			child_klass.custom()

			expect( custom_spy ).to.have.been.called
			expect( custom_spy.firstCall ).to.have.been.calledOn child_klass

			ChildKlass.things()

			expect( things_spy ).to.have.been.called
			expect( things_spy.firstCall ).to.have.been.calledOn ChildKlass
		#END it
	#END describe
#END describe