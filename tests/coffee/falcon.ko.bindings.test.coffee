describe "Bindings", ->
	describe "view", ->
		view_binding = Falcon.getBinding('view')

		beforeEach ->
			spyOn( ko.virtualElements, 'emptyNode' ).and.callThrough()

			spyOn( Falcon.View::, '_render' ).and.callThrough()
			spyOn( Falcon.View::, '_unrender' ).and.callThrough()

			# Just intercept some stuff so we can control state betetr
			spyOn( Falcon, 'ready' )
		#END beforeEach

		describe "Basic Exception Cases", ->
			it "Should initialize correctly, but empty the node if a view isn't given", ->
				test_view = {} # Invalid

				element = MockHelper.makeElement()
				                    .bindings("view: test_view")
				                    .html("Hello World")
				                    .andApply({
				                    	test_view: test_view
				                    })

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( Falcon.View::_render ).not.toHaveBeenCalled()
				expect( Falcon.View::_unrender ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("")
			#END it

			it "Should initialize correctly, but empty the node if the view is already loaded", ->
				test_view = new Falcon.View()
				test_view.__falcon_view__is_loaded__(false)

				element = MockHelper.makeElement()
				                    .bindings("view: test_view")
				                    .html("Hello World")
				                    .andApply({
				                    	test_view: test_view
				                    })

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( Falcon.View::_render ).not.toHaveBeenCalled()
				expect( Falcon.View::_unrender ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("")
			#END it

			it "Should initialize correctly, but empty the node if given an empty template", ->
				test_view = new Falcon.View()
				test_view.__falcon_view__is_loaded__(true)
				test_view.template = jasmine.createSpy("Template Spy").and.returnValue("")

				element = MockHelper.makeElement()
				                    .bindings("view: test_view")
				                    .html("Hello World")
				                    .andApply({
				                    	test_view: test_view
				                    })

				expect( test_view.template.calls.count() ).toBe( 1 )

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( Falcon.View::_render ).not.toHaveBeenCalled()
				expect( Falcon.View::_unrender ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("")
			#END it
		#END describe

		describe "Observable Exception Cases", ->
			it "Should initialize correctly with observable, but empty the node if a view isn't given", ->
				test_view = {} # Invalid

				element = MockHelper.makeElement()
				                    .bindings("view: test_view")
				                    .html("Hello World")
				                    .andApply({
				                    	test_view: ko.observable(test_view)
				                    })

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( Falcon.View::_render ).not.toHaveBeenCalled()
				expect( Falcon.View::_unrender ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("")
			#END it

			it "Should initialize correctly with observable, but empty the node if the view is already loaded", ->
				test_view = new Falcon.View()
				test_view.__falcon_view__is_loaded__(false)

				element = MockHelper.makeElement()
				                    .bindings("view: test_view")
				                    .html("Hello World")
				                    .andApply({
				                    	test_view: ko.observable(test_view)
				                    })

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( Falcon.View::_render ).not.toHaveBeenCalled()
				expect( Falcon.View::_unrender ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("")
			#END it

			it "Should initialize correctly with observable, but empty the node if given an empty template", ->
				test_view = new Falcon.View()
				test_view.__falcon_view__is_loaded__(true)
				test_view.template = jasmine.createSpy("Template Spy").and.returnValue("")

				element = MockHelper.makeElement()
				                    .bindings("view: test_view")
				                    .html("Hello World")
				                    .andApply({
				                    	test_view: ko.observable(test_view)
				                    })

				expect( test_view.template.calls.count() ).toBe( 1 )

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( Falcon.View::_render ).not.toHaveBeenCalled()
				expect( Falcon.View::_unrender ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("")
			#END it
		#END describe

		describe "Basic Usage", ->
			view = null
			element = null

			it "Setup", ->
				hello_world = MockHelper.makeElement("template")
				                        .setId("hello_world")
				                        .html("Hello World")
				                        .addToDOM()
			#END setup

			it "Should setup the view binding properly with a basic view", ->
				view = MockHelper.makeView("#hello_world").triggerReady()

				element = MockHelper.makeElement()
				                    .bindings("view: view")
				                    .addToDOM()
				                    .andApply({view})

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view._render.calls.count() ).toBe( 1 )
				expect( view.display.calls.count() ).toBe( 1 )

				expect( view._unrender ).not.toHaveBeenCalled()
				expect( view.dispose ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("Hello World")

				view.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				element.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()
				expect( view._render ).not.toHaveBeenCalled()
				expect( view.display ).not.toHaveBeenCalled()

				expect( view._unrender.calls.count() ).toBe( 1 )
				expect( view.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Observable Usage", ->
			obs = ko.observable()
			element = null
			view_a = view_b = null

			it "Setup", ->
				hello_world = MockHelper.makeElement("template")
				                        .setId("hello_world")
				                        .html("Hello World")
				                        .addToDOM()

				foo_bar = MockHelper.makeElement("template")
				                    .setId("foo_bar")
				                    .html("Foo Bar")
				                    .addToDOM()
			#END setup

			it "Should apply blank observable properly", ->
				element = MockHelper.makeElement()
				                    .bindings("view: obs")
				                    .addToDOM()
				                    .andApply({obs})

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( element.innerHTML ).toBe( "" )
			#END it

			it "Should update the template when a valid view with template is given", ->
				view_a = MockHelper.makeView("#hello_world")
				                   .triggerReady()

				obs( view_a )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render.calls.count() ).toBe( 1 )
				expect( view_a.display.calls.count() ).toBe( 1 )

				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("Hello World")

				view_a.resetSpies()
			#END it

			it "Should swap views properly", ->
				view_b = MockHelper.makeView("#foo_bar")
				                   .triggerReady()

				obs( view_b )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()

				expect( view_a._unrender.calls.count() ).toBe( 1 )
				expect( view_a.dispose.calls.count() ).toBe( 1 )

				expect( view_b._render.calls.count() ).toBe( 1 )
				expect( view_b.display.calls.count() ).toBe( 1 )

				expect( view_b._unrender ).not.toHaveBeenCalled()
				expect( view_b.dispose ).not.toHaveBeenCalled()

				expect( element.innerHTML ).toBe("Foo Bar")

				view_a.resetSpies()
				view_b.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				element.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()
				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( view_b._render ).not.toHaveBeenCalled()
				expect( view_b.display ).not.toHaveBeenCalled()
				expect( view_b._unrender.calls.count() ).toBe( 1 )
				expect( view_b.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Comment Binding Usage", ->
			comment = null
			view = null

			it "Setup", ->
				hello_world = MockHelper.makeElement("template")
				                        .setId("hello_world")
				                        .html("Hello World")
				                        .addToDOM()
			#END setup

			it "Should setup the view binding properly with basic view", ->
				view = MockHelper.makeView("hello_world")
				                 .triggerReady()

				comment = MockHelper.makeCommentBinding("view: view")
									.addToDOM()
				                    .andApply({view})

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view._render.calls.count() ).toBe( 1 )
				expect( view.display.calls.count() ).toBe( 1 )

				expect( view._unrender ).not.toHaveBeenCalled()
				expect( view.dispose ).not.toHaveBeenCalled()

				expect( comment.getInnerHTML() ).toBe("Hello World")

				view.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				comment.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()
				expect( view._render ).not.toHaveBeenCalled()
				expect( view.display ).not.toHaveBeenCalled()

				expect( view._unrender.calls.count() ).toBe( 1 )
				expect( view.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Observable Comment Binding Usage", ->
			obs = ko.observable()
			comment = null
			view_a = view_b = null

			it "Setup", ->
				hello_world = MockHelper.makeElement("template")
				                        .setId("hello_world")
				                        .html("Hello World")
				                        .addToDOM()

				foo_bar = MockHelper.makeElement("template")
				                    .setId("foo_bar")
				                    .html("Foo Bar")
				                    .addToDOM()
			#END setup

			it "Should apply blank observable properly", ->
				comment = MockHelper.makeCommentBinding("view: obs")
				                    .addToDOM()
				                    .andApply({obs})

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( comment.start_comment )

				expect( comment.getInnerHTML() ).toBe( "" )
			#END it

			it "Should update the template when a valid view with template is given", ->
				view_a = MockHelper.makeView("#hello_world")
				                   .triggerReady()

				obs( view_a )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render.calls.count() ).toBe( 1 )
				expect( view_a.display.calls.count() ).toBe( 1 )

				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( comment.getInnerHTML() ).toBe("Hello World")

				view_a.resetSpies()
			#END it

			it "Should swap views properly", ->
				view_b = MockHelper.makeView("#foo_bar")
				                   .triggerReady()

				obs( view_b )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()

				expect( view_a._unrender.calls.count() ).toBe( 1 )
				expect( view_a.dispose.calls.count() ).toBe( 1 )

				expect( view_b._render.calls.count() ).toBe( 1 )
				expect( view_b.display.calls.count() ).toBe( 1 )

				expect( view_b._unrender ).not.toHaveBeenCalled()
				expect( view_b.dispose ).not.toHaveBeenCalled()

				expect( comment.getInnerHTML() ).toBe("Foo Bar")

				view_a.resetSpies()
				view_b.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				comment.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()
				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( view_b._render ).not.toHaveBeenCalled()
				expect( view_b.display ).not.toHaveBeenCalled()
				expect( view_b._unrender.calls.count() ).toBe( 1 )
				expect( view_b.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Nested Usage", ->
			view = null
			parent_view = null
			element = null

			it "Setup", ->
				MockHelper.makeElement("template")
				          .setId("parent_template")
				          .html("<div data-bind='view: $view.child_view'></div>")
				          .addToDOM()

				MockHelper.makeElement("template")
				          .setId("hello_world")
				          .html("Hello World")
				          .addToDOM()
			#END setup

			it "Should setup the view binding properly with a basic view", ->
				view = MockHelper.makeView("#hello_world").triggerReady()
				parent_view = MockHelper.makeView("#parent_template").triggerReady()
				parent_view.child_view = view

				element = MockHelper.makeElement()
				                    .bindings("view: view")
				                    .addToDOM()
				                    .andApply({
				                    	view: parent_view
				                    })

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( parent_view._render.calls.count() ).toBe( 1 )
				expect( parent_view.display.calls.count() ).toBe( 1 )
				expect( parent_view._unrender ).not.toHaveBeenCalled()
				expect( parent_view.dispose ).not.toHaveBeenCalled()

				expect( view._render.calls.count() ).toBe( 1 )
				expect( view.display.calls.count() ).toBe( 1 )
				expect( view._unrender ).not.toHaveBeenCalled()
				expect( view.dispose ).not.toHaveBeenCalled()

				parent_view.resetSpies()
				view.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				element.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()
				
				expect( parent_view._render ).not.toHaveBeenCalled()
				expect( parent_view.display ).not.toHaveBeenCalled()
				expect( parent_view._unrender.calls.count() ).toBe( 1 )
				expect( parent_view.dispose.calls.count() ).toBe( 1 )

				expect( view._render ).not.toHaveBeenCalled()
				expect( view.display ).not.toHaveBeenCalled()
				expect( view._unrender.calls.count() ).toBe( 1 )
				expect( view.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Nested Observable Usage", ->
			obs = ko.observable()
			element = null
			view_a = view_b = null

			it "Setup", ->
				MockHelper.makeElement("template")
				          .setId("parent_template")
				          .html("<div data-bind='view: $view.child_view'></div>")
				          .addToDOM()

				MockHelper.makeElement("template")
				          .setId("hello_world")
				          .html("Hello World")
				          .addToDOM()

				MockHelper.makeElement("template")
				          .setId("foo_bar")
				          .html("Foo Bar")
				          .addToDOM()
			#END setup

			it "Should apply blank observable properly", ->
				element = MockHelper.makeElement()
				                    .bindings("view: obs")
				                    .addToDOM()
				                    .andApply({obs})

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( element )

				expect( element.innerHTML ).toBe( "" )
			#END it

			it "Should update the template when a valid view with template is given", ->
				view_a = MockHelper.makeView("#parent_template").triggerReady()
				view_a.child_view = MockHelper.makeView("#hello_world").triggerReady()

				obs( view_a )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render.calls.count() ).toBe( 1 )
				expect( view_a.display.calls.count() ).toBe( 1 )
				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( view_a.child_view._render.calls.count() ).toBe( 1 )
				expect( view_a.child_view.display.calls.count() ).toBe( 1 )
				expect( view_a.child_view._unrender ).not.toHaveBeenCalled()
				expect( view_a.child_view.dispose ).not.toHaveBeenCalled()

				view_a.resetSpies()
				view_a.child_view.resetSpies()
			#END it

			it "Should swap views properly", ->
				view_b = MockHelper.makeView("#parent_template").triggerReady()
				view_b.child_view = MockHelper.makeView("#hello_world").triggerReady()

				obs( view_b )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()
				expect( view_a._unrender.calls.count() ).toBe( 1 )
				expect( view_a.dispose.calls.count() ).toBe( 1 )

				expect( view_a.child_view._render ).not.toHaveBeenCalled()
				expect( view_a.child_view.display ).not.toHaveBeenCalled()
				expect( view_a.child_view._unrender.calls.count() ).toBe( 1 )
				expect( view_a.child_view.dispose.calls.count() ).toBe( 1 )

				expect( view_b._render.calls.count() ).toBe( 1 )
				expect( view_b.display.calls.count() ).toBe( 1 )
				expect( view_b._unrender ).not.toHaveBeenCalled()
				expect( view_b.dispose ).not.toHaveBeenCalled()

				expect( view_b.child_view._render.calls.count() ).toBe( 1 )
				expect( view_b.child_view.display.calls.count() ).toBe( 1 )
				expect( view_b.child_view._unrender ).not.toHaveBeenCalled()
				expect( view_b.child_view.dispose ).not.toHaveBeenCalled()

				view_a.resetSpies()
				view_a.child_view.resetSpies()
				view_b.resetSpies()
				view_b.child_view.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				element.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()
				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( view_a.child_view._render ).not.toHaveBeenCalled()
				expect( view_a.child_view.display ).not.toHaveBeenCalled()
				expect( view_a.child_view._unrender ).not.toHaveBeenCalled()
				expect( view_a.child_view.dispose ).not.toHaveBeenCalled()

				expect( view_b._render ).not.toHaveBeenCalled()
				expect( view_b.display ).not.toHaveBeenCalled()
				expect( view_b._unrender.calls.count() ).toBe( 1 )
				expect( view_b.dispose.calls.count() ).toBe( 1 )

				expect( view_b.child_view._render ).not.toHaveBeenCalled()
				expect( view_b.child_view.display ).not.toHaveBeenCalled()
				expect( view_b.child_view._unrender.calls.count() ).toBe( 1 )
				expect( view_b.child_view.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Nested Comment Usage", ->
			view = null
			parent_view = null
			comment = null

			it "Setup", ->
				MockHelper.makeElement("template")
				          .setId("parent_template")
				          .html("<div data-bind='view: $view.child_view'></div>")
				          .addToDOM()

				MockHelper.makeElement("template")
				          .setId("hello_world")
				          .html("Hello World")
				          .addToDOM()
			#END setup

			it "Should setup the view binding properly with a basic view", ->
				view = MockHelper.makeView("#hello_world").triggerReady()
				parent_view = MockHelper.makeView("#parent_template").triggerReady()
				parent_view.child_view = view

				comment = MockHelper.makeCommentBinding("view: view")
				                    .addToDOM()
				                    .andApply({
				                    	view: parent_view
				                    })

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( parent_view._render.calls.count() ).toBe( 1 )
				expect( parent_view.display.calls.count() ).toBe( 1 )
				expect( parent_view._unrender ).not.toHaveBeenCalled()
				expect( parent_view.dispose ).not.toHaveBeenCalled()

				expect( view._render.calls.count() ).toBe( 1 )
				expect( view.display.calls.count() ).toBe( 1 )
				expect( view._unrender ).not.toHaveBeenCalled()
				expect( view.dispose ).not.toHaveBeenCalled()

				parent_view.resetSpies()
				view.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				comment.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()
				
				expect( parent_view._render ).not.toHaveBeenCalled()
				expect( parent_view.display ).not.toHaveBeenCalled()
				expect( parent_view._unrender.calls.count() ).toBe( 1 )
				expect( parent_view.dispose.calls.count() ).toBe( 1 )

				expect( view._render ).not.toHaveBeenCalled()
				expect( view.display ).not.toHaveBeenCalled()
				expect( view._unrender.calls.count() ).toBe( 1 )
				expect( view.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe

		describe "Basic Nested Comment Observable Usage", ->
			obs = ko.observable()
			comment = null
			view_a = view_b = null

			it "Setup", ->
				MockHelper.makeElement("template")
				          .setId("parent_template")
				          .html("<div data-bind='view: $view.child_view'></div>")
				          .addToDOM()

				MockHelper.makeElement("template")
				          .setId("hello_world")
				          .html("Hello World")
				          .addToDOM()

				MockHelper.makeElement("template")
				          .setId("foo_bar")
				          .html("Foo Bar")
				          .addToDOM()
			#END setup

			it "Should apply blank observable properly", ->
				comment = MockHelper.makeCommentBinding("view: obs")
				                    .addToDOM()
				                    .andApply({obs})

				expect( ko.virtualElements.emptyNode.calls.count() ).toBe( 1 )
				expect( ko.virtualElements.emptyNode ).toHaveBeenCalledWith( comment.start_comment )
			#END it

			it "Should update the template when a valid view with template is given", ->
				view_a = MockHelper.makeView("#parent_template").triggerReady()
				view_a.child_view = MockHelper.makeView("#hello_world").triggerReady()

				obs( view_a )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render.calls.count() ).toBe( 1 )
				expect( view_a.display.calls.count() ).toBe( 1 )
				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( view_a.child_view._render.calls.count() ).toBe( 1 )
				expect( view_a.child_view.display.calls.count() ).toBe( 1 )
				expect( view_a.child_view._unrender ).not.toHaveBeenCalled()
				expect( view_a.child_view.dispose ).not.toHaveBeenCalled()

				view_a.resetSpies()
				view_a.child_view.resetSpies()
			#END it

			it "Should swap views properly", ->
				view_b = MockHelper.makeView("#parent_template").triggerReady()
				view_b.child_view = MockHelper.makeView("#hello_world").triggerReady()

				obs( view_b )

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()
				expect( view_a._unrender.calls.count() ).toBe( 1 )
				expect( view_a.dispose.calls.count() ).toBe( 1 )

				expect( view_a.child_view._render ).not.toHaveBeenCalled()
				expect( view_a.child_view.display ).not.toHaveBeenCalled()
				expect( view_a.child_view._unrender.calls.count() ).toBe( 1 )
				expect( view_a.child_view.dispose.calls.count() ).toBe( 1 )

				expect( view_b._render.calls.count() ).toBe( 1 )
				expect( view_b.display.calls.count() ).toBe( 1 )
				expect( view_b._unrender ).not.toHaveBeenCalled()
				expect( view_b.dispose ).not.toHaveBeenCalled()

				expect( view_b.child_view._render.calls.count() ).toBe( 1 )
				expect( view_b.child_view.display.calls.count() ).toBe( 1 )
				expect( view_b.child_view._unrender ).not.toHaveBeenCalled()
				expect( view_b.child_view.dispose ).not.toHaveBeenCalled()

				view_a.resetSpies()
				view_a.child_view.resetSpies()
				view_b.resetSpies()
				view_b.child_view.resetSpies()
			#END it

			it "Should unrender properly when removed from the DOM", ->
				comment.removeFromDOM()

				expect( ko.virtualElements.emptyNode ).not.toHaveBeenCalled()

				expect( view_a._render ).not.toHaveBeenCalled()
				expect( view_a.display ).not.toHaveBeenCalled()
				expect( view_a._unrender ).not.toHaveBeenCalled()
				expect( view_a.dispose ).not.toHaveBeenCalled()

				expect( view_a.child_view._render ).not.toHaveBeenCalled()
				expect( view_a.child_view.display ).not.toHaveBeenCalled()
				expect( view_a.child_view._unrender ).not.toHaveBeenCalled()
				expect( view_a.child_view.dispose ).not.toHaveBeenCalled()

				expect( view_b._render ).not.toHaveBeenCalled()
				expect( view_b.display ).not.toHaveBeenCalled()
				expect( view_b._unrender.calls.count() ).toBe( 1 )
				expect( view_b.dispose.calls.count() ).toBe( 1 )

				expect( view_b.child_view._render ).not.toHaveBeenCalled()
				expect( view_b.child_view.display ).not.toHaveBeenCalled()
				expect( view_b.child_view._unrender.calls.count() ).toBe( 1 )
				expect( view_b.child_view.dispose.calls.count() ).toBe( 1 )
			#END it

			it "Teardown", -> Falcon.View.resetCache()
		#END describe
	#END describe
#END describe