describe "Test View Methods", ->
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
	describe "Test the constructor method", ->
		init_stub = ajax_stub = jquery_stub = null

		afterEach ->
			init_stub.restore() if init_stub
			ajax_stub.restore() if ajax_stub
			jquery_stub.restore() if jquery_stub
		#END afterEach

		it "Should call the initialize and ajax methods with the correct arguments", ->
			init_stub = sinon.stub( ViewA::, "initialize" )
			ajax_stub = sinon.stub( $, "ajax" )
			jquery_stub = sinon.stub( window, '$' )

			view = new ViewA("Hello", 123)

			expect( view.is_loaded() ).to.be.false
			expect( view._is_rendered ).to.be.false

			expect( init_stub ).to.have.been.calledOnce
			expect( init_stub ).to.have.been.calledWith "Hello", 123
			expect( init_stub ).to.have.been.calledOn view

			expect( ajax_stub ).to.have.been.calledOnce
			expect( ajax_stub ).to.have.been.calledAfter init_stub
			expect( ajax_stub.firstCall.args[0] ).not.to.be.undefined

			jquery_stub.should.not.have.been.called
		#END it

		it "Should call the initialize and jquery methods with the correct arguments", ->
			init_stub = sinon.stub( ViewC::, "initialize" )
			ajax_stub = sinon.stub( $, "ajax" )
			jquery_stub = sinon.stub( window, '$' ).returns(window.jQuery("<div>"))

			view = new ViewC("Hello", 123)

			expect( view.is_loaded() ).to.be.true
			expect( view._is_rendered ).to.be.false

			expect( init_stub ).to.have.been.calledOnce
			expect( init_stub ).to.have.been.calledWith "Hello", 123
			expect( init_stub ).to.have.been.calledOn view

			expect( jquery_stub ).to.have.been.calledOnce
			expect( jquery_stub ).to.have.been.calledAfter init_stub

			ajax_stub.should.not.have.been.called
		#END it

		it "Should call the ajax method only once", ->
			ajax_stub = sinon.stub( $, "ajax" )
			jquery_stub = sinon.stub( window, '$' )

			#Test the initial call
			view = new ViewA()

			expect( view.is_loaded() ).to.be.false

			expect( ajax_stub ).to.have.been.calledOnce
			expect( ajax_stub.firstCall.args[0] ).not.to.be.undefined

			ajax_stub.firstCall.args[0].success("Hello World")

			expect( view.is_loaded() ).to.be.true
			expect( jquery_stub ).to.not.have.been.called
			ajax_stub.reset()

			#The next call should be cached
			view = new ViewA()

			expect( view.is_loaded() ).to.be.true
			expect( ajax_stub ).to.not.have.been.called
			expect( jquery_stub ).to.not.have.been.called
			ajax_stub.reset()

			#Trying a different url shouldn't be cached
			view = new ViewB()

			expect( view.is_loaded() ).to.be.false

			expect( ajax_stub ).to.have.been.calledOnce
			expect( ajax_stub.firstCall.args[0] ).not.to.be.undefined

			ajax_stub.firstCall.args[0].success("Hello World")

			expect( view.is_loaded() ).to.be.true
			expect( jquery_stub ).to.not.have.been.called
		#END it

		it "Should call the jquery method only once", ->
			ajax_stub = sinon.stub( $, "ajax" )
			jquery_stub = sinon.stub( window, '$' ).returns(window.jQuery("<div>"))

			#Test the initial call
			view = new ViewC()

			expect( view.is_loaded() ).to.be.true
			expect( jquery_stub ).to.have.been.calledOnce
			expect( ajax_stub ).to.not.have.been.called
			jquery_stub.reset()

			#The next call should be cached
			view = new ViewC()

			expect( view.is_loaded() ).to.be.true
			expect( jquery_stub ).to.not.have.been.called
			expect( ajax_stub ).to.not.have.been.called
			jquery_stub.reset()

			#Trying a different url shouldn't be cached
			view = new ViewD()

			expect( view.is_loaded() ).to.be.true
			expect( jquery_stub ).to.have.been.calledOnce
			expect( ajax_stub ).to.not.have.been.called
		#END it

		it "Should not have a template if one is not defined", ->
			ajax_stub = sinon.stub( $, "ajax" )
			jquery_stub = sinon.stub( window, '$' ).returns(window.jQuery("<div>"))

			#Test the initial call
			view = new ViewG()

			expect( view.is_loaded() ).to.be.true
			expect( jquery_stub ).to.not.have.been.called
			expect( ajax_stub ).to.not.have.been.called
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
			
			expect( hello_spy ).to.not.have.been.called

			rawr_class = new RawrView("one", "two", "three")

			expect( hello_spy ).to.have.been.called
			expect( hello_spy.callCount ).to.equal 1
			expect( hello_spy.firstCall.args.length ).to.equal 3
			expect( hello_spy.firstCall.args[0] ).to.equal "one"
			expect( hello_spy.firstCall.args[1] ).to.equal "two"
			expect( hello_spy.firstCall.args[2] ).to.equal "three"
		#END it

		it "Should create RawrVIew with defaults that are numbers", ->
			hello_spy = null

			class RawrView extends Falcon.View
				defaults:
					'hello': ( hello_spy = sinon.spy() )
				#END defaults
			#END RawrView
			
			expect( hello_spy ).to.not.have.been.called

			rawr_class = new RawrView(1234)

			expect( hello_spy ).to.have.been.called
			expect( hello_spy.callCount ).to.equal 1
			expect( hello_spy.firstCall.args.length ).to.equal 1
			expect( hello_spy.firstCall.args[0] ).to.equal 1234
		#END it
	#END describe


	#--------------------------------------------------------------
	#
	# Test the makeUrl() method
	#
	#--------------------------------------------------------------
	describe "Test the makeUrl() method", ->
		ajax_stub = null

		beforeEach ->
			ajax_stub = sinon.stub($, 'ajax')
		#END beforeEach

		afterEach ->
			ajax_stub.restore()
		#END afterEach

		it "Should generate the correct relative url from string", ->
			expect( new ViewA().makeUrl() ).to.equal "/view_a"
		#END it

		it "Should generate the correct relative url from function", ->
			expect( new ViewB().makeUrl() ).to.equal "/view_b"
		#END it

		it "Should generate the correct element id from string", ->
			expect( new ViewC().makeUrl() ).to.equal "#view_c"
		#END it

		it "Should generate the correct element id from function", ->
			expect( new ViewD().makeUrl() ).to.equal "#view_d"
		#END it

		it "Should generate the correct relative url from string beginning with '/'", ->
			expect( new ViewE().makeUrl() ).to.equal "/view_e"
		#END it

		it "Should generate the correct relative url from function beginning with '/'", ->
			expect( new ViewF().makeUrl() ).to.equal "/view_f"
		#END it

			


		it "Should generate the correct relative url from string with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewA().makeUrl() ).to.equal "http://www.falconjs.com/view_a"
		#END it

		it "Should generate the correct relative url from function with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewB().makeUrl() ).to.equal "http://www.falconjs.com/view_b"
		#END it

		it "Should generate the correct element id from string with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewC().makeUrl() ).to.equal "#view_c"
		#END it

		it "Should generate the correct element id from function with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewD().makeUrl() ).to.equal "#view_d"
		#END it

		it "Should generate the correct relative url from string beginning with '/' with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewE().makeUrl() ).to.equal "http://www.falconjs.com/view_e"
		#END it

		it "Should generate the correct relative url from function beginning with '/' with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewF().makeUrl() ).to.equal "http://www.falconjs.com/view_f"
		#END it

			


		it "Should generate the correct relative url from string with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewA().makeUrl() ).to.equal "http://www.falconjs.com/view_a"
		#END it

		it "Should generate the correct relative url from function with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewB().makeUrl() ).to.equal "http://www.falconjs.com/view_b"
		#END it

		it "Should generate the correct element id from string with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewC().makeUrl() ).to.equal "#view_c"
		#END it

		it "Should generate the correct element id from function with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewD().makeUrl() ).to.equal "#view_d"
		#END it

		it "Should generate the correct relative url from string beginning with '/' with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewE().makeUrl() ).to.equal "http://www.falconjs.com/view_e"
		#END it

		it "Should generate the correct relative url from function beginning with '/' with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewF().makeUrl() ).to.equal "http://www.falconjs.com/view_f"
		#END it

		it "Should not make a url for a 'null' url defined", ->
			expect( new ViewG().makeUrl() ).to.equal null

			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewG().makeUrl() ).to.equal null
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

		ajax_stub = null

		beforeEach ->
			ajax_stub = sinon.stub($, 'ajax')
		#END beforeEach

		afterEach ->
			ajax_stub.restore()
		#END afterEach

		it "Should create a valid view model", ->
			view = new FullView
			test_stub = sinon.stub( view, 'test' )
			another_stub = sinon.stub( view, 'another' )

			expect( ko.isObservable(view.hello) ).to.be.true
			expect( view.hello() ).to.be.equal 'world'

			expect( ko.isComputed(view.foo) ).to.be.true
			expect( view.foo() ).to.be.equal 'bar'

			expect( ko.isComputed(view.small) ).to.be.true
			expect( view.small() ).to.be.equal 'world bar'

			expect( view.test ).to.be.a 'function'
			expect( view.another ).to.be.a 'function'

			viewModel = view.viewModel()

			expect( ko.isObservable(viewModel.hello) ).to.be.true
			expect( viewModel.hello() ).to.be.equal 'world'

			expect( ko.isComputed(viewModel.foo) ).to.be.true
			expect( viewModel.foo() ).to.be.equal 'bar'

			expect( ko.isComputed(viewModel.small) ).to.be.true
			expect( viewModel.small() ).to.be.equal 'world bar'

			expect( viewModel.test ).to.be.a 'function'
			expect( viewModel.test ).to.not.equal view.test

			expect( viewModel.another ).to.be.a 'function'
			expect( viewModel.another ).to.not.equal view.another

			expect( test_stub ).to.not.have.been.called
			expect( another_stub ).to.not.have.been.called

			viewModel.test()
			viewModel.another('hello', 'world')

			expect( test_stub ).to.have.been.calledOnce
			expect( test_stub ).to.have.been.calledOn view

			expect( another_stub ).to.have.been.calledOnce
			expect( another_stub ).to.have.been.calledWith 'hello', 'world'
			expect( another_stub ).to.have.been.calledOn view

			test_stub.restore()
			another_stub.restore()
		#END it

		it "Should create equal viewModels after the first has been generated", ->
			view = new FullView
			model1 = view.viewModel()
			model2 = view.viewModel()

			expect( model1 ).to.equal( model2 )
		#END it
	#END describe
#END describe