describe "Test Knockout Bindings", ->
	$application = null
	application_index = 0
	$body = $("body")

	applyApp = (view) ->
		application_index++
		$application.remove() if $application?
		$body.append( $application = $("<div id='application_#{application_index}'></div>") )
		Falcon.apply( view, "#application_#{application_index}" )
	#END applyApp

	describe "Test view binding", ->
		view_binding = ko.bindingHandlers['view']

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

		view_init_spy = view_update_spy = null

		before ->
			$body.append($layout_template)
			$body.append($footer_template)
			$body.append($content_template)

			view_init_spy = sinon.spy( view_binding, 'init' )
			view_update_spy = sinon.spy( view_binding, 'update' )
		#END beforeEach

		after ->
			$layout_template.remove()
			$footer_template.remove()
			$content_template.remove()

			view_init_spy.restore()
			view_update_spy.restore()
		#END afterEach

		it "Should call the view binding on initialization without an observable", ->
			view = new ContentView

			render_spy = sinon.spy( view, '_render' )
			unrender_spy = sinon.spy( view, '_unrender' )

			expect( view_init_spy ).to.not.have.been.called
			expect( view_update_spy ).to.not.have.been.called
			expect( render_spy ).to.not.have.been.called
			expect( unrender_spy ).to.not.have.been.called

			applyApp(view)

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

			render_spy = sinon.spy( view, '_render' )
			unrender_spy = sinon.spy( view, '_unrender' )
			display_spy = sinon.spy( view, 'display' )
			dispose_spy = sinon.spy( view, 'dispose' )
			
			content_render_spy = sinon.spy( content_view, '_render' )
			content_unrender_spy = sinon.spy( content_view, '_unrender' )
			content_display_spy = sinon.spy( content_view, 'display' )
			content_dispose_spy = sinon.spy( content_view, 'dispose' )
			
			footer_render_spy = sinon.spy( footer_view, '_render' )
			footer_unrender_spy = sinon.spy( footer_view, '_unrender' )
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
				applyApp( obs )

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

			it "Should call init, update, and render the correct number of times", ->
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
		foreach_binding = ko.bindingHandlers['foreach']
		foreach_init_spy = foreach_update_spy = null

		class ModelA extends Falcon.Model
			defaults:
				'hello': 'world'
			#END defaults

			observables:
				'foo': 'bar'
			#END observables
		#END ModelA

		class CollectionA extends Falcon.Collection
			model: ModelA
		#END CollectionA

		describe "Test flat bindings against arrays and collections", ->
			class LayoutView extends Falcon.View
				url: '#layout-template'

				defaults:
					'collection_list': -> new CollectionA
					'collection_list_options': -> new CollectionA
				#END defaults

				observables:
					'array_list': []
					'array_list_options': []
				#END observables

				afterAdd: ->
				beforeRemove: (element) -> element.remove()
			#END class
			$layout_template = $("
				<template id='layout-template'>
					<ul class='array_list' data-bind='foreach: $view.array_list'><li>An Item</li></ul>
					<ul class='collection_list' data-bind='foreach: $view.collection_list'><li>An Item</li></ul>
					<ul class='array_list_options' data-bind='foreach: {data: $view.array_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>
					<ul class='collection_list_options' data-bind='foreach: {data: $view.collection_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>
				</template>
			")

			view = null
			view_observable = ko.observable()
			$array_list = $collection_list = null
			$array_list_options = $collection_list_options = null
			after_add_spy = before_remove_spy = null

			before ->
				$body.append($application)
				$body.append($layout_template)

				foreach_init_spy = sinon.spy( foreach_binding, 'init' )
				foreach_update_spy = sinon.spy( foreach_binding, 'update' )

				applyApp( view_observable )
			#END before

			beforeEach ->
				view = new LayoutView
				view_observable( view )

				after_add_spy = sinon.spy( view.viewModel(), 'afterAdd' )
				before_remove_spy = sinon.spy( view.viewModel(), 'beforeRemove' )

				prev_array_list = $array_list
				$array_list = $(".array_list")
				$collection_list = $(".collection_list")
				$array_list_options = $(".array_list_options")
				$collection_list_options = $(".collection_list_options")
			#END beforeEach

			afterEach ->
				$application.empty()

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				after_add_spy.restore()
				before_remove_spy.restore()
			#END afterEach

			after ->
				$application.remove()
				$layout_template.remove()

				foreach_init_spy.restore()
				foreach_update_spy.restore()
			#END after

			it "Should properly list with an observable array", ->
				expect( foreach_init_spy ).to.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_init_spy.callCount ).to.equal 4
				expect( foreach_update_spy.callCount ).to.equal 4

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.array_list.push("Hello")
				view.array_list.push("World", "Foo Bar")
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 2

				expect( $array_list.children().length ).to.equal 3
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_update_spy.reset()

				view.array_list.pop()
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 1

				expect( $array_list.children().length ).to.equal 2
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0
			#END it

			it "Should properly list with a collection", ->
				expect( foreach_init_spy ).to.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_init_spy.callCount ).to.equal 4
				expect( foreach_update_spy.callCount ).to.equal 4

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.collection_list.push(new ModelA)
				view.collection_list.push([new ModelA, new ModelA])
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 2

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 3
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_update_spy.reset()

				view.collection_list.pop()
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 1

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 2
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0
			#END describe

			it "Should properly list with an observable array including options", ->
				expect( foreach_init_spy ).to.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_init_spy.callCount ).to.equal 4
				expect( foreach_update_spy.callCount ).to.equal 4

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.array_list_options.push("Hello2")
				view.array_list_options.push("World2", "Foo Bar2")
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 2
				expect( after_add_spy.callCount ).to.equal 3

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 3
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_update_spy.reset()
				after_add_spy.reset()

				view.array_list_options.pop()
				view.array_list_options.pop()
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 2
				expect( before_remove_spy.callCount ).to.equal 2

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 1
				expect( $collection_list_options.children().length ).to.equal 0
			#END it

			it "Should properly list with a collection including options", ->
				expect( foreach_init_spy ).to.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_init_spy.callCount ).to.equal 4
				expect( foreach_update_spy.callCount ).to.equal 4

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.collection_list_options.push(new ModelA)
				view.collection_list_options.push([new ModelA, new ModelA])
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.have.been.called
				expect( before_remove_spy ).to.not.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 2
				expect( after_add_spy.callCount ).to.equal 3

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 3

				foreach_update_spy.reset()
				after_add_spy.reset()

				view.collection_list_options.pop()
				view.collection_list_options.pop()
				
				expect( foreach_init_spy ).to.not.have.been.called
				expect( foreach_update_spy ).to.have.been.called
				expect( after_add_spy ).to.not.have.been.called
				expect( before_remove_spy ).to.have.been.called
				
				expect( foreach_update_spy.callCount ).to.equal 2
				expect( before_remove_spy.callCount ).to.equal 2

				expect( $array_list.children().length ).to.equal 0
				expect( $collection_list.children().length ).to.equal 0
				expect( $array_list_options.children().length ).to.equal 0
				expect( $collection_list_options.children().length ).to.equal 1
			#END it
		#END describe

		describe "Test observable bindings against collections", ->
			class LayoutView extends Falcon.View
				url: '#layout-template'

				defaults:
					'collection_a1': -> new CollectionA
					'collection_a2': -> new CollectionA
				#END defaults

				observables:
					'selected_number': 1
					'selected_collection': ->
						return ( if @selected_number() is 1 then @collection_a1 else @collection_a2 )
					#END selected_collection
				#END observables
			#END class
			$layout_template = $("
				<template id='layout-template'>
					<ul class='collection_list' data-bind='foreach: $view.selected_collection'><li>An Item</li></ul>
				</template>
			")

			view = null
			view_observable = ko.observable()
			$collection_list = null
			after_add_spy = before_remove_spy = null

			before ->
				$body.append($layout_template)

				foreach_init_spy = sinon.spy( foreach_binding, 'init' )
				foreach_update_spy = sinon.spy( foreach_binding, 'update' )

				applyApp(view_observable)
			#END before

			beforeEach ->
				view = new LayoutView
				view_observable( view )

				$collection_list = $(".collection_list")
			#END beforeEach

			afterEach ->
				$application.empty()

				foreach_init_spy.reset()
				foreach_update_spy.reset()
			#END afterEach

			after ->
				$application.remove()
				$layout_template.remove()

				foreach_init_spy.restore()
				foreach_update_spy.restore()
			#END after

			it "Should properly update if collection is switched to another with same update count", ->
				expect( foreach_init_spy ).to.have.been.called
				expect( foreach_update_spy ).to.have.been.called

				expect( foreach_init_spy.callCount ).to.equal 1
				expect( foreach_update_spy.callCount ).to.equal 1

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.collection_a1.fill([new ModelA, new ModelA])
				view.collection_a2.fill([new ModelA, new ModelA, new ModelA, new ModelA, new ModelA])

				expect( foreach_init_spy ).to.have.not.been.called
				expect( foreach_update_spy ).to.have.been.called

				expect( foreach_update_spy.callCount ).to.equal 1

				expect( $collection_list.children().length ).to.equal( 2 )

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.selected_number( 2 )

				expect( foreach_init_spy ).to.have.not.been.called
				expect( foreach_update_spy ).to.have.been.called

				expect( foreach_update_spy.callCount ).to.equal 1

				expect( $collection_list.children().length ).to.equal( 5 )

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.selected_number( 1 )

				expect( foreach_init_spy ).to.have.not.been.called
				expect( foreach_update_spy ).to.have.been.called

				expect( foreach_update_spy.callCount ).to.equal 1

				expect( $collection_list.children().length ).to.equal( 2 )
			#END it
		#END describe
	#END describe

	describe "Test updated options binding", ->
	#END describe

	describe "Test log binding", ->
	#END describe
#END describe