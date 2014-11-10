@MockHelper = new (class _MockHelper
	makeElement: (tagName) ->
		tagName ?= "div"
		element = document.createElement(tagName)

		element.bindings = (bindings) ->
			element.setAttribute("data-bind", bindings)
			return element
		#END bindingss

		element.andApply = (viewModel) ->
			ko.applyBindings(viewModel, element)
			return element
		#END andApply

		element.setId = (id) ->
			element.setAttribute('id', id)
			return element
		#END setId

		element.html = (html) ->
			element.innerHTML = html
			return element
		#END html

		element.addToDOM = ->
			document.body.appendChild( element )
			return element
		#END addToDOM

		element.removeFromDOM = ->
			ko.removeNode( element )
			return element
		#END removeFromDOM

		return element
	#END makeElement

	makeView: (endpoint, definition) ->
		definition ?= {}
		definition.endpoint = endpoint
		view = new (Falcon.View.extend(definition))
		ready_call = Falcon.ready.calls.mostRecent()

		view._render = jasmine.createSpy("Render Spy").and.callFake(view._render)
		view.display = jasmine.createSpy("Display Spy").and.callFake(view.display)
		view._unrender = jasmine.createSpy("Unrender Spy").and.callFake(view._unrender)
		view.dispose = jasmine.createSpy("Dispose Spy").and.callFake(view.dispose)

		view.resetSpies = ->
			view._render.calls.reset()
			view.display.calls.reset()
			view._unrender.calls.reset()
			view.dispose.calls.reset()
			return view
		#END resetSpies

		view.triggerReady = ->
			ready_call.args[0]()
			return view
		#END triggerReady

		return view
	#END makeView

	makeCommentBinding: (binding) ->
		start_comment = document.createComment(" ko #{binding} ")
		end_comment = document.createComment(" /ko ")
		
		fragment = document.createElement('div')
		fragment.appendChild( start_comment )
		fragment.appendChild( end_comment )

		fragment.start_comment = start_comment
		fragment.end_comment = end_comment

		fragment.andApply = (viewModel) ->
			ko.applyBindings(viewModel, fragment)
			return fragment
		#END andApply

		fragment.getInnerHTML = ->
			childNodes = ko.virtualElements.childNodes(start_comment)
			temp = document.createElement("div")
			temp.appendChild( childNode.cloneNode(true) ) for childNode in childNodes
			return temp.innerHTML
		#END getInnerHTML

		fragment.addToDOM = ->
			document.body.appendChild( fragment )
			return fragment
		#END addToDOM

		fragment.removeFromDOM = ->
			ko.removeNode( fragment )
			return fragment
		#END removeFromDOM

		return fragment
	#END makeCommentBinding
)