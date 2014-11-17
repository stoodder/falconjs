describe "Falcon.View", ->
	beforeEach ->
		Falcon.baseTemplateUrl = ""
		Falcon.templateAdapter.resetCache()
	#END beforeEach

	#--------------------------------------------------------------
	#
	# Test the constructor() method
	#
	#--------------------------------------------------------------
	describe "constructor", ->
		beforeEach ->
			spyOn( Falcon.View::, 'initialize' )
			spyOn( Falcon.templateAdapter, 'resolveTemplate')
		#END beforeEach

		it "Should call the correct methods by default", ->
			view = new ( Falcon.View.extend(endpoint: "#hello_world") )

			expect( Falcon.View::initialize.calls.count() ).toBe( 1 )
			expect( Falcon.View::initialize ).toHaveBeenCalledWith()

			expect( Falcon.templateAdapter.resolveTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.templateAdapter.resolveTemplate ).toHaveBeenCalledWith( view, jasmine.any(Function) )

			callback = Falcon.templateAdapter.resolveTemplate.calls.argsFor(0)[1]
			callback("Some Template")

			expect( view.__falcon_view__loaded_template__() ).toBe( "Some Template" )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the makeUrl() method
	#
	#--------------------------------------------------------------
	describe "makeUrl", ->
		view = null
		beforeEach ->
			spyOn( Falcon.templateAdapter, 'resolveTemplate') # Needed to capcture the chained makeUrl call in the constructor
			spyOn( Falcon.templateAdapter, 'makeUrl').and.returnValue("http://www.falconjs.com/hello_world.tmpl")
			view = new Falcon.View
		#END beforeEach

		it "Should call the makeUrl method on the template adapter", ->
			ret = view.makeUrl()

			expect( Falcon.templateAdapter.makeUrl.calls.count() ).toBe( 1 )
			expect( Falcon.templateAdapter.makeUrl ).toHaveBeenCalledWith( view )

			expect( ret ).toBe( "http://www.falconjs.com/hello_world.tmpl" )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the viewModel() method
	#
	#--------------------------------------------------------------
	describe "createViewModel", ->
		class FullView extends Falcon.View
			endpoint: 'full_view'

			observables:
				'hello': 'world'
				'foo': -> 'bar'
				'small': -> @hello() + " " + @foo()
			#END observables

			'test': -> 'things'
			'another': (something, newer) -> @test() + " " + something + " " + newer
		#END class
			
		it "Should create a valid view model", ->
			view = new FullView
			test_stub = sinon.stub( view, 'test' )
			another_stub = sinon.stub( view, 'another' )

			expect( ko.isObservable(view.hello) ).toBe( true )
			expect( view.hello() ).toBe( 'world' )

			expect( ko.isComputed(view.foo) ).toBe( true )
			expect( view.foo() ).toBe( 'bar' )

			expect( ko.isComputed(view.small) ).toBe( true )
			expect( view.small() ).toBe( 'world bar' )

			expect( view.test ).toEqual( jasmine.any(Function) )
			expect( view.another ).toEqual( jasmine.any(Function) )

			viewModel = view.createViewModel()

			expect( ko.isObservable(viewModel.hello) ).toBe( true )
			expect( viewModel.hello() ).toBe( 'world' )

			expect( ko.isComputed(viewModel.foo) ).toBe( true )
			expect( viewModel.foo() ).toBe( 'bar' )

			expect( ko.isComputed(viewModel.small) ).toBe( true )
			expect( viewModel.small() ).toBe( 'world bar' )

			expect( viewModel.test ).toEqual( jasmine.any(Function) )
			expect( viewModel.test ).not.toEqual( view.test )

			expect( viewModel.another ).toEqual( jasmine.any(Function) )
			expect( viewModel.another ).not.toEqual( view.another )

			expect( test_stub ).not.toHaveBeenCalled()
			expect( another_stub ).not.toHaveBeenCalled()

			viewModel.test()
			viewModel.another('hello', 'world')

			expect( test_stub ).toHaveBeenCalledOnce()
			expect( test_stub ).toHaveBeenCalledOn( view )

			expect( another_stub ).toHaveBeenCalledOnce()
			expect( another_stub ).toHaveBeenCalledWith( 'hello', 'world' )
			expect( another_stub ).toHaveBeenCalledOn( view )

			test_stub.restore()
			another_stub.restore()
		#END it

		it "Should create equal viewModels after the first has been generated", ->
			view = new FullView
			model1 = view.createViewModel()
			model2 = view.createViewModel()

			expect( model1 ).toEqual(( model2 ) )
		#END it
	#END describe
#END describe