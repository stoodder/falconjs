describe "Test Knockout Bindings", ->
	describe "Test view binding", ->
		view_binding = ko.bindingHandlers['view']
		$body = $("body")
		$application = $("<div id='application'></div>")

		class LayoutView extends Falcon.View
			url: '#layout-template'

			observables:
				content_view: null
				footer_view: null
			#END observables

			initialize: ->
				@content_view( new ContentView )
				@footer_view( new FooterView )
			#END initialize
		#END LayoutView
		$layout_template = $("
			<template id='layout-template'>
				<div data-bind='view: $view.content_view'>
				</div>
				<div data-bind='view: $view.footer_view'>
				</div>
			</template>
		")

		class ContentView extends Falcon.View
			url: '#content-template'
		#END class
		$content_template = $("
			<template id='content-template'>
				The Content
			</template>
		")

		class FooterView extends Falcon.View
			url: '#footer-template'
		#END class
		$footer_template = $("
			<template id='footer-template'>
				The Footer
			</template>
		")

		_application = _layout_template = _footer_template = _conent_template = null
		view_init_spy = view_update_spy = null

		before ->
			$body.append($application)
			$body.append($layout_template)
			$body.append($footer_template)
			$body.append($content_template)

			view_init_spy = sinon.spy( view_binding, 'init' )
			view_update_spy = sinon.spy( view_binding, 'update' )
		#END beforeEach

		after ->
			$application.remove()
			$layout_template.remove()
			$footer_template.remove()
			$content_template.remove()

			view_init_spy.restore()
			view_update_spy.restore()
		#END afterEach

		it "Should call the view binding on initialization without an observable", ->
			view = new ContentView

			render_spy = sinon.spy( view, 'render' )
			unrender_spy = sinon.spy( view, 'unrender' )

			expect( view_init_spy ).to.not.have.been.called
			expect( view_update_spy ).to.not.have.been.called
			expect( render_spy ).to.not.have.been.called
			expect( unrender_spy ).to.not.have.been.called

			Falcon.apply( view, "#application" )

			expect( view_init_spy ).to.have.been.calledOnce
			expect( view_update_spy ).to.have.been.calledOnce
			expect( render_spy ).to.have.been.calledOnce
			expect( unrender_spy ).to.not.have.been.called
		#END it

		describe "Testing changes in views that are contained in observales", ->
			view = new LayoutView
			content_view = view.content_view()
			footer_view = view.footer_view()
			obs = ko.observable( null )

			render_spy = sinon.spy( view, 'render' )
			unrender_spy = sinon.spy( view, 'unrender' )
			display_spy = sinon.spy( view, 'display' )
			dispose_spy = sinon.spy( view, 'dispose' )
			
			content_render_spy = sinon.spy( content_view, 'render' )
			content_unrender_spy = sinon.spy( content_view, 'unrender' )
			content_display_spy = sinon.spy( content_view, 'display' )
			content_dispose_spy = sinon.spy( content_view, 'dispose' )
			
			footer_render_spy = sinon.spy( footer_view, 'render' )
			footer_unrender_spy = sinon.spy( footer_view, 'unrender' )
			footer_display_spy = sinon.spy( footer_view, 'display' )
			footer_dispose_spy = sinon.spy( footer_view, 'dispose' )

			beforeEach ->
				view_init_spy.reset()
				view_update_spy.reset()

				render_spy.reset()
				content_render_spy.reset()
				footer_render_spy.reset()

				display_spy.reset()
				content_display_spy.reset()
				footer_display_spy.reset()

				unrender_spy.reset()
				content_unrender_spy.reset()
				footer_unrender_spy.reset()

				dispose_spy.reset()
				content_dispose_spy.reset()
				footer_dispose_spy.reset()
			#END _resetAll

			it "Should not call any render or unrender methods on unassigned observable", ->
				Falcon.apply( obs, "#application" )

				expect( view_init_spy ).to.have.been.calledOnce
				expect( view_update_spy ).to.have.been.calledOnce

				expect( render_spy ).to.not.have.been.called
				expect( content_render_spy ).to.not.have.been.called
				expect( footer_render_spy ).to.not.have.been.called

				expect( display_spy ).to.not.have.been.called
				expect( content_display_spy ).to.not.have.been.called
				expect( footer_display_spy ).to.not.have.been.called

				expect( unrender_spy ).to.not.have.been.called
				expect( content_render_spy ).to.not.have.been.called
				expect( footer_unrender_spy ).to.not.have.been.called

				expect( dispose_spy ).to.not.have.been.called
				expect( content_dispose_spy ).to.not.have.been.called
				expect( footer_dispose_spy ).to.not.have.been.called
			#END it

			it "Should call init, update, and render the correct number od times", ->
				obs( view )

				expect( view_init_spy ).to.have.been.calledTwice
				expect( view_update_spy ).to.have.been.calledThrice

				expect( render_spy ).to.have.been.calledOnce
				expect( content_render_spy ).to.have.been.calledOnce
				expect( footer_render_spy ).to.have.been.calledOnce

				expect( display_spy ).to.have.been.calledOnce
				expect( content_display_spy ).to.have.been.calledOnce
				expect( footer_display_spy ).to.have.been.calledOnce

				expect( unrender_spy ).to.not.have.been.called
				expect( content_unrender_spy ).to.not.have.been.called
				expect( footer_unrender_spy ).to.not.have.been.called

				expect( dispose_spy ).to.not.have.been.called
				expect( content_dispose_spy ).to.not.have.been.called
				expect( footer_dispose_spy ).to.not.have.been.called
			#END it

			it "Should react to a child view being updated", ->
				view.content_view( new ContentView )

				expect( view_init_spy ).to.not.have.been.called
				expect( view_update_spy ).to.have.been.calledOnce

				expect( render_spy ).to.not.have.been.called
				expect( content_render_spy ).to.not.have.been.called
				expect( footer_render_spy ).to.not.have.been.called

				expect( display_spy ).to.not.have.been.called
				expect( content_display_spy ).to.not.have.been.called
				expect( footer_display_spy ).to.not.have.been.called

				expect( unrender_spy ).to.not.have.been.called
				expect( content_unrender_spy ).to.have.been.calledOnce
				expect( footer_unrender_spy ).to.not.have.been.called

				expect( dispose_spy ).to.not.have.been.called
				expect( content_dispose_spy ).to.have.been.calledOnce
				expect( footer_dispose_spy ).to.not.have.been.called
			#END it

			it "Should react to the entire, root, view being updated", ->
				obs( new ContentView )

				expect( view_init_spy ).to.not.have.been.called
				expect( view_update_spy ).to.have.been.calledOnce

				expect( render_spy ).to.not.have.been.called
				expect( content_render_spy ).to.not.have.been.called
				expect( footer_render_spy ).to.not.have.been.called

				expect( display_spy ).to.not.have.been.called
				expect( content_display_spy ).to.not.have.been.called
				expect( footer_display_spy ).to.not.have.been.called

				# These tests are correct but are accounting for redundant calls
				# and should hence fail when the redundacies are fixed.
				expect( unrender_spy ).to.have.been.calledOnce
				expect( content_unrender_spy ).to.have.been.calledOnce 	# This is correct but only because the layout held 
																		# onto a reference to this view, it should get rid of it 
																		# when the view is gone.
				
				expect( footer_unrender_spy ).to.have.been.calledTwice	# This is correct but only because both the layout and
																		# DOM node disposal both attempted to call it

				
				expect( dispose_spy ).to.have.been.calledOnce
				expect( content_dispose_spy ).to.have.not.been.called
				expect( footer_dispose_spy ).to.have.been.calledOnce
			#END it
		#END describe
	#END describe

	describe "Test updated foreach binding", ->
	#END describe

	describe "Test updated options binding", ->
	#END describe

	describe "Test log binding", ->
	#END describe
#END describe