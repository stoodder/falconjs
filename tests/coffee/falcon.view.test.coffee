describe "Falcon.View", ->
	class ViewA extends Falcon.View
		url: 'view_a'
	#END class

	class ViewB extends Falcon.View
		url: -> 'view_b'
	#END class

	class ViewC extends Falcon.View
		url: '#view_c'
	#END class

	class ViewD extends Falcon.View
		url: -> '#view_d'
	#END class

	class ViewE extends Falcon.View
		url: '/view_e'
	#END class

	class ViewF extends Falcon.View
		url: -> '/view_f'
	#END class

	class ViewG extends Falcon.View
	#END class

	beforeEach ->
		Falcon.baseTemplateUrl = ""
		Falcon.cache = false
		Falcon.View.resetCache()
	#END beforeEach

	#--------------------------------------------------------------
	#
	# Test the constructor() method
	#
	#--------------------------------------------------------------
	describe "constructor", ->
		beforeEach ->
			spyOn( Falcon.View::, 'initialize' ).and.callThrough()
			spyOn( Falcon.View::, 'makeUrl' ).and.callThrough()
			spyOn( Falcon.View, 'cacheTemplate' ).and.callThrough()
			spyOn( Falcon.adapter, 'getTemplate').and.callThrough()
		#END beforeEach

		it "Should call the correct methods by default", ->
			view = new ( Falcon.View.extend(url: "#hello_world") )

			expect( view.makeUrl.calls.count() ).toBe( 1 )

			expect( view.initialize.calls.count() ).toBe( 1 )
			expect( view.initialize ).toHaveBeenCalledWith()

			expect( Falcon.adapter.getTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.adapter.getTemplate ).toHaveBeenCalledWith( "#hello_world", jasmine.any(Function) )

			expect( Falcon.View.cacheTemplate.calls.count() ).toBe( 1 )
			expect( Falcon.View.cacheTemplate ).toHaveBeenCalledWith( "#hello_world", "" )

			expect( view.is_loaded() ).toBe( true )
		#END it

		it "Should recognized cached templates", ->
			view = new ( Falcon.View.extend(url: "#hello_world") )
			view.makeUrl.calls.reset()
			view.initialize.calls.reset()
			Falcon.adapter.getTemplate.calls.reset()
			Falcon.View.cacheTemplate.calls.reset()

			view = new ( Falcon.View.extend(url: "#hello_world") )

			expect( view.makeUrl.calls.count() ).toBe( 1 )

			expect( view.initialize.calls.count() ).toBe( 1 )
			expect( view.initialize ).toHaveBeenCalledWith()

			expect( Falcon.adapter.getTemplate ).not.toHaveBeenCalled()
			expect( Falcon.View.cacheTemplate ).not.toHaveBeenCalled()

			expect( view.is_loaded() ).toBe( true )
		#END it

		it "Should not call the adapter on an empty template uri", ->
			view = new ( Falcon.View.extend(url: null) )

			expect( view.makeUrl.calls.count() ).toBe( 1 )

			expect( view.initialize.calls.count() ).toBe( 1 )
			expect( view.initialize ).toHaveBeenCalledWith()

			expect( Falcon.adapter.getTemplate ).not.toHaveBeenCalled()

			expect( view.is_loaded() ).toBe( true )
		#END it
	#END describe


	describe "cacheTemplates", ->
		template = document.createElement("template")
		template.setAttribute("id", "test_template_1")
		template.innerHTML = "Hello World 1"

		template2 = document.createElement("template")
		template2.setAttribute("id", "test_template_2")
		template2.innerHTML = "Hello World 2"

		beforeEach ->
			document.body.appendChild( template )
			document.body.appendChild( template2 )

			spyOn( Falcon.View, 'cacheTemplate' )
		#END beforeEach

		it "Should have removed and cached the templates", ->
			templates = document.querySelectorAll("template")
			expect( templates.length ).toBe( 2 )
			
			ret = Falcon.View.cacheTemplates()
			
			templates = document.querySelectorAll("template")
			expect( templates.length ).toBe( 0 )

			expect( Falcon.View.cacheTemplate.calls.count() ).toBe( 2 )
			expect( Falcon.View.cacheTemplate.calls.argsFor(0) ).toEqual [
				'#test_template_1'
				'Hello World 1'
			]

			expect( Falcon.View.cacheTemplate.calls.argsFor(1) ).toEqual [
				'#test_template_2'
				'Hello World 2'
			]

			expect( ret ).toBe( Falcon.View )
		#END it

		it "Should work properly if no templates exist", ->
			document.body.removeChild( template )
			document.body.removeChild( template2 )
			
			templates = document.querySelectorAll("template")
			expect( templates.length ).toBe( 0 )
			
			ret = Falcon.View.cacheTemplates()
			
			templates = document.querySelectorAll("template")
			expect( templates.length ).toBe( 0 )

			expect( ret ).toBe( Falcon.View )
		#END it
	#END describe

	#--------------------------------------------------------------
	#
	# Test the defaults initialization
	#
	#--------------------------------------------------------------
	describe "Testing the 'defaults' implementation", ->
		it "Should create RawrView with defaults that have correct arguments", ->
			hello_spy = null

			class RawrView extends Falcon.View
				defaults:
					'hello': ( hello_spy = sinon.spy() )
				#END defaults
			#END RawrView
			
			expect( hello_spy ).not.toHaveBeenCalled()

			rawr_class = new RawrView("one", "two", "three")

			expect( hello_spy ).toHaveBeenCalled()
			expect( hello_spy.callCount ).toEqual( 1 )
			expect( hello_spy.firstCall.args.length ).toEqual( 3 )
			expect( hello_spy.firstCall.args[0] ).toEqual( "one" )
			expect( hello_spy.firstCall.args[1] ).toEqual( "two" )
			expect( hello_spy.firstCall.args[2] ).toEqual( "three" )
		#END it

		it "Should create RawrVIew with defaults that are numbers", ->
			hello_spy = null

			class RawrView extends Falcon.View
				defaults:
					'hello': ( hello_spy = sinon.spy() )
				#END defaults
			#END RawrView
			
			expect( hello_spy ).not.toHaveBeenCalled()

			rawr_class = new RawrView(1234)

			expect( hello_spy ).toHaveBeenCalled()
			expect( hello_spy.callCount ).toEqual( 1 )
			expect( hello_spy.firstCall.args.length ).toEqual( 1 )
			expect( hello_spy.firstCall.args[0] ).toEqual( 1234 )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the makeUrl() method
	#
	#--------------------------------------------------------------
	describe "makeUrl", ->
		it "Should generate the correct relative url from string", ->
			expect( new ViewA().makeUrl() ).toEqual( "/view_a" )
		#END it

		it "Should generate the correct relative url from function", ->
			expect( new ViewB().makeUrl() ).toEqual( "/view_b" )
		#END it

		it "Should generate the correct element id from string", ->
			expect( new ViewC().makeUrl() ).toEqual( "#view_c" )
		#END it

		it "Should generate the correct element id from function", ->
			expect( new ViewD().makeUrl() ).toEqual( "#view_d" )
		#END it

		it "Should generate the correct relative url from string beginning with '/'", ->
			expect( new ViewE().makeUrl() ).toEqual( "/view_e" )
		#END it

		it "Should generate the correct relative url from function beginning with '/'", ->
			expect( new ViewF().makeUrl() ).toEqual( "/view_f" )
		#END it

			


		it "Should generate the correct relative url from string with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewA().makeUrl() ).toEqual( "http://www.falconjs.com/view_a" )
		#END it

		it "Should generate the correct relative url from function with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewB().makeUrl() ).toEqual( "http://www.falconjs.com/view_b" )
		#END it

		it "Should generate the correct element id from string with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewC().makeUrl() ).toEqual( "#view_c" )
		#END it

		it "Should generate the correct element id from function with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewD().makeUrl() ).toEqual( "#view_d" )
		#END it

		it "Should generate the correct relative url from string beginning with '/' with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewE().makeUrl() ).toEqual( "http://www.falconjs.com/view_e" )
		#END it

		it "Should generate the correct relative url from function beginning with '/' with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewF().makeUrl() ).toEqual( "http://www.falconjs.com/view_f" )
		#END it

			


		it "Should generate the correct relative url from string with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewA().makeUrl() ).toEqual( "http://www.falconjs.com/view_a" )
		#END it

		it "Should generate the correct relative url from function with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewB().makeUrl() ).toEqual( "http://www.falconjs.com/view_b" )
		#END it

		it "Should generate the correct element id from string with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewC().makeUrl() ).toEqual( "#view_c" )
		#END it

		it "Should generate the correct element id from function with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewD().makeUrl() ).toEqual( "#view_d" )
		#END it

		it "Should generate the correct relative url from string beginning with '/' with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewE().makeUrl() ).toEqual( "http://www.falconjs.com/view_e" )
		#END it

		it "Should generate the correct relative url from function beginning with '/' with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewF().makeUrl() ).toEqual( "http://www.falconjs.com/view_f" )
		#END it

		it "Should return an empty string if no url is defined", ->
			expect( new ViewG().makeUrl() ).toEqual( "" )

			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewG().makeUrl() ).toEqual( "" )
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the viewModel() method
	#
	#--------------------------------------------------------------
	describe "Test the viewModel() method", ->
		class FullView extends Falcon.View
			url: 'full_view'

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

			viewModel = view.viewModel()

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
			model1 = view.viewModel()
			model2 = view.viewModel()

			expect( model1 ).toEqual(( model2 ) )
		#END it
	#END describe
#END describe