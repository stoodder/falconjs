describe "Knockout Bindings", ->
	$application = null
	application_index = 0
	$body = null

	applyApp = (view) ->
		$body ?= $("body").first()
		$application?.remove()

		application_index++
		$body.append( $application = $("<div id='application_#{application_index}'></div>") )

		Falcon.apply( view, "#application_#{application_index}" )
	#END applyApp

	describe "'view' Binding", ->
		$layout_template = $footer_template = $content_template = null

		view_binding = Falcon.getBinding('view')

		view_init_spy = sinon.spy( view_binding, 'init' )
		view_update_spy = sinon.spy( view_binding, 'update' )

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

		class ContentView extends Falcon.View
			url: '#content-template'
		#END class

		class FooterView extends Falcon.View
			url: '#footer-template'
		#END class

		setup = ->
			$body ?= $("body").first()

			$layout_template = $("
				<template id='layout-template'>
					<div data-bind='view: $view.content_view'></div>
					<div data-bind='view: $view.footer_view'></div>
				</template>
			")
			
			$content_template = $("
				<template id='content-template'>
					The Content
				</template>
			")
			
			$footer_template = $("
				<template id='footer-template'>
					The Footer
				</template>
			")

			$body.append($layout_template)
			$body.append($footer_template)
			$body.append($content_template)
		#END setup

		teardown = ->
			$layout_template.remove()
			$content_template.remove()
			$footer_template.remove()
		#END teardown

		it("Setup", setup)

		it "Should call the view binding on initialization without an observable", ->
			view = new ContentView

			render_spy = sinon.spy( view, '_render' )
			unrender_spy = sinon.spy( view, '_unrender' )

			expect( view_init_spy ).not.toHaveBeenCalled()
			expect( view_update_spy ).not.toHaveBeenCalled()
			expect( render_spy ).not.toHaveBeenCalled()
			expect( unrender_spy ).not.toHaveBeenCalled()

			applyApp(view)

			expect( view_init_spy ).toHaveBeenCalledOnce()
			expect( view_update_spy ).toHaveBeenCalledOnce()
			expect( render_spy ).toHaveBeenCalledOnce()
			expect( unrender_spy ).not.toHaveBeenCalled()
		#END it

		describe "Testing changes in views that are contained in observables", ->
			view = content_view = footer_view = obs = null
			render_spy = unrender_spy = display_spy = dispose_spy = null
			content_render_spy = content_unrender_spy = content_display_spy = content_dispose_spy = null
			footer_render_spy = footer_unrender_spy = footer_display_spy = footer_dispose_spy = null
			
			setup = ->
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
			#END setup

			beforeEach ->
				return unless view?

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
			
			it("Setup", setup)

			it "Should not call any render or unrender methods on unassigned observable", ->
				applyApp( obs )

				expect( view_init_spy ).toHaveBeenCalledOnce()
				expect( view_update_spy ).toHaveBeenCalledOnce()

				expect( render_spy ).not.toHaveBeenCalled()
				expect( content_render_spy ).not.toHaveBeenCalled()
				expect( footer_render_spy ).not.toHaveBeenCalled()

				expect( display_spy ).not.toHaveBeenCalled()
				expect( content_display_spy ).not.toHaveBeenCalled()
				expect( footer_display_spy ).not.toHaveBeenCalled()

				expect( unrender_spy ).not.toHaveBeenCalled()
				expect( content_render_spy ).not.toHaveBeenCalled()
				expect( footer_unrender_spy ).not.toHaveBeenCalled()

				expect( dispose_spy ).not.toHaveBeenCalled()
				expect( content_dispose_spy ).not.toHaveBeenCalled()
				expect( footer_dispose_spy ).not.toHaveBeenCalled()
			#END it

			it "Should call init, update, and render the correct number of times", ->
				obs( view )

				expect( view_init_spy ).toHaveBeenCalledTwice()
				expect( view_update_spy ).toHaveBeenCalledThrice()

				expect( render_spy ).toHaveBeenCalledOnce()
				expect( content_render_spy ).toHaveBeenCalledOnce()
				expect( footer_render_spy ).toHaveBeenCalledOnce()

				expect( display_spy ).toHaveBeenCalledOnce()
				expect( content_display_spy ).toHaveBeenCalledOnce()
				expect( footer_display_spy ).toHaveBeenCalledOnce()

				expect( unrender_spy ).not.toHaveBeenCalled()
				expect( content_unrender_spy ).not.toHaveBeenCalled()
				expect( footer_unrender_spy ).not.toHaveBeenCalled()

				expect( dispose_spy ).not.toHaveBeenCalled()
				expect( content_dispose_spy ).not.toHaveBeenCalled()
				expect( footer_dispose_spy ).not.toHaveBeenCalled()
			#END it

			it "Should react to a child view being updated", ->
				view.content_view( new ContentView )

				expect( view_init_spy ).not.toHaveBeenCalled()
				expect( view_update_spy ).toHaveBeenCalledOnce()

				expect( render_spy ).not.toHaveBeenCalled()
				expect( content_render_spy ).not.toHaveBeenCalled()
				expect( footer_render_spy ).not.toHaveBeenCalled()

				expect( display_spy ).not.toHaveBeenCalled()
				expect( content_display_spy ).not.toHaveBeenCalled()
				expect( footer_display_spy ).not.toHaveBeenCalled()

				expect( unrender_spy ).not.toHaveBeenCalled()
				expect( content_unrender_spy ).toHaveBeenCalledOnce()
				expect( footer_unrender_spy ).not.toHaveBeenCalled()

				expect( dispose_spy ).not.toHaveBeenCalled()
				expect( content_dispose_spy ).toHaveBeenCalledOnce()
				expect( footer_dispose_spy ).not.toHaveBeenCalled()
			#END it

			it "Should react to the entire, root, view being updated", ->
				obs( new ContentView )

				expect( view_init_spy ).not.toHaveBeenCalled()
				expect( view_update_spy ).toHaveBeenCalledOnce()

				expect( render_spy ).not.toHaveBeenCalled()
				expect( content_render_spy ).not.toHaveBeenCalled()
				expect( footer_render_spy ).not.toHaveBeenCalled()

				expect( display_spy ).not.toHaveBeenCalled()
				expect( content_display_spy ).not.toHaveBeenCalled()
				expect( footer_display_spy ).not.toHaveBeenCalled()

				expect( unrender_spy ).toHaveBeenCalled()
				expect( content_unrender_spy ).not.toHaveBeenCalled()
				expect( footer_unrender_spy ).toHaveBeenCalledOnce()
				
				expect( dispose_spy ).toHaveBeenCalledOnce()
				expect( content_dispose_spy ).not.toHaveBeenCalled()
				expect( footer_dispose_spy ).toHaveBeenCalledOnce()
			#END it
		#END describe

		it("Teardown", teardown)
	#END describe

	describe "Test view binding with an observable array of views", ->
		view_binding = ko.bindingHandlers['view']

		class LayoutView extends Falcon.View
			url: '#layout-template'

			observables:
				views: []
			#END observables
		#END LayoutView
		$layout_template = $("
			<template id='layout-template'>
				<!-- ko foreach: $view.views -->
					<div data-bind='view: $data'></div>
				<!-- /ko -->
			</template>
		")

		class ContentView extends Falcon.View
			url: '#content-template2'

			observables:
				"_title": ""
				"title":
					read: -> @_title()
					write: (title) -> @_title(title)
				#END title
			#END observables
		#END class

		$content_template = $("
			<template id='content-template2'>
				<div data-bind='title: $view.title'></div>
			</template>
		")

		beforeEach ->
			$body.append($layout_template)
			$body.append($content_template)
		#END beforeEach

		afterEach ->
			$layout_template.remove()
			$content_template.remove()
		#END afterEach

		it "Should call like observables with their own context and update individually", ->
			layout = new LayoutView
			first_content = new ContentView
			second_content = new ContentView

			Falcon.the_layout = layout

			first_spy = sinon.spy( first_content, "title" )
			second_spy = sinon.spy( second_content, "title" )

			applyApp(layout)
			expect( first_spy ).not.toHaveBeenCalled()
			expect( second_spy ).not.toHaveBeenCalled()

			layout.views.push( first_content )
			expect( first_spy ).not.toHaveBeenCalled()
			expect( second_spy ).not.toHaveBeenCalled()
			first_spy.reset()

			first_content.title("First Title")
			expect( first_spy ).toHaveBeenCalled()
			expect( first_spy ).toHaveBeenCalledOn( first_content )
			expect( first_spy ).toHaveBeenCalledWith("First Title")
			expect( second_spy ).not.toHaveBeenCalled()
			first_spy.reset()

			layout.views.push( second_content )
			expect( first_spy ).not.toHaveBeenCalled()
			expect( second_spy ).not.toHaveBeenCalled()
			first_spy.reset()
			second_spy.reset()

			second_content.title("Second Title")
			expect( first_spy ).not.toHaveBeenCalled()
			expect( second_spy ).toHaveBeenCalled()
			expect( second_spy ).toHaveBeenCalledOn( second_content )
			expect( second_spy ).toHaveBeenCalledWith("Second Title")
			second_spy.reset()

			expect( first_content.title() ).toEqual( "First Title" )
			expect( second_content.title() ).toEqual( "Second Title" )
		#END it
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
				beforeRemove: (element) -> $(element).remove()
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

			setup = ->
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

			teardown = ->
				$application.remove()
				$layout_template.remove()

				foreach_init_spy.restore()
				foreach_update_spy.restore()
			#END after

			it("Setup", setup)

			it "Should properly list with an observable array", ->
				expect( foreach_init_spy ).toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_init_spy.callCount ).toEqual 4
				expect( foreach_update_spy.callCount ).toEqual 4

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.array_list.push("Hello")
				view.array_list.push("World", "Foo Bar")
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 2

				expect( $array_list.children().length ).toEqual 3
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_update_spy.reset()

				view.array_list.pop()
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 1

				expect( $array_list.children().length ).toEqual 2
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0
			#END it

			it "Should properly list with a collection", ->
				expect( foreach_init_spy ).toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_init_spy.callCount ).toEqual 4
				expect( foreach_update_spy.callCount ).toEqual 4

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.collection_list.push(new ModelA)
				view.collection_list.push([new ModelA, new ModelA])
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 2

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 3
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_update_spy.reset()

				view.collection_list.pop()
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 1

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 2
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0
			#END describe

			it "Should properly list with an observable array including options", ->
				expect( foreach_init_spy ).toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_init_spy.callCount ).toEqual 4
				expect( foreach_update_spy.callCount ).toEqual 4

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.array_list_options.push("Hello2")
				view.array_list_options.push("World2", "Foo Bar2")
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 2
				expect( after_add_spy.callCount ).toEqual 3

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 3
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_update_spy.reset()
				after_add_spy.reset()

				view.array_list_options.pop()
				view.array_list_options.pop()
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 2
				expect( before_remove_spy.callCount ).toEqual 2

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 1
				expect( $collection_list_options.children().length ).toEqual 0
			#END it

			it "Should properly list with a collection including options", ->
				expect( foreach_init_spy ).toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_init_spy.callCount ).toEqual 4
				expect( foreach_update_spy.callCount ).toEqual 4

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 0

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.collection_list_options.push(new ModelA)
				view.collection_list_options.push([new ModelA, new ModelA])
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).toHaveBeenCalled()
				expect( before_remove_spy ).not.toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 2
				expect( after_add_spy.callCount ).toEqual 3

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 3

				foreach_update_spy.reset()
				after_add_spy.reset()

				view.collection_list_options.pop()
				view.collection_list_options.pop()
				
				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()
				expect( after_add_spy ).not.toHaveBeenCalled()
				expect( before_remove_spy ).toHaveBeenCalled()
				
				expect( foreach_update_spy.callCount ).toEqual 2
				expect( before_remove_spy.callCount ).toEqual 2

				expect( $array_list.children().length ).toEqual 0
				expect( $collection_list.children().length ).toEqual 0
				expect( $array_list_options.children().length ).toEqual 0
				expect( $collection_list_options.children().length ).toEqual 1
			#END it

			it("Teardown", teardown)
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

			setup = ->
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

			teardown = ->
				$application.remove()
				$layout_template.remove()

				foreach_init_spy.restore()
				foreach_update_spy.restore()
			#END after

			it("Setup", setup)

			it "Should properly update if collection is switched to another with same update count", ->
				expect( foreach_init_spy ).toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()

				expect( foreach_init_spy.callCount ).toEqual 1
				expect( foreach_update_spy.callCount ).toEqual 1

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.collection_a1.fill([new ModelA, new ModelA])
				view.collection_a2.fill([new ModelA, new ModelA, new ModelA, new ModelA, new ModelA])

				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()

				expect( foreach_update_spy.callCount ).toEqual 1

				expect( $collection_list.children().length ).toEqual( 2 )

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.selected_number( 2 )

				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()

				expect( foreach_update_spy.callCount ).toEqual 1

				expect( $collection_list.children().length ).toEqual( 5 )

				foreach_init_spy.reset()
				foreach_update_spy.reset()

				view.selected_number( 1 )

				expect( foreach_init_spy ).not.toHaveBeenCalled()
				expect( foreach_update_spy ).toHaveBeenCalled()

				expect( foreach_update_spy.callCount ).toEqual 1

				expect( $collection_list.children().length ).toEqual( 2 )
			#END it

			it("Teardown", teardown)
		#END describe
	#END describe

	describe "Test updated options binding", ->
	#END describe

	describe "Test log binding", ->
	#END describe

	###
	view_init_spy.restore()
	view_update_spy.restore()
	###
#END describe