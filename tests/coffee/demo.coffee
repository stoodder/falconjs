class LayoutView extends Falcon.View
	url: "#layout-tmpl"

	observables:
		"current_view": null
	#END observables

	showContentView: ->
		@current_view( new ContentView )
	#END showContentView

	showOtherView: ->
		@current_view( new OtherView )
	#END hideAllViews

	display: -> alert("LAYOUT IN")
	dispose: -> alert("LAYOUT OUT")
#END LayoutView

class OtherView extends Falcon.View
	url: "#other-tmpl"
#END OtherView

class ContentView extends Falcon.View
	url: "#content-tmpl"

	defaults:
		'sub_view': -> new SomeSubView
	#END defaults

	observables:
		the_text: "No Worries"
		a_list: []
	#END observables

	initialize: ->
		@addItem() for i in [0..3]
	#END initialize

	display: ->
		alert("Hello! I am content view")
	#END display

	dispose: ->
		alert("Good Bye! This has been content view")
	#END dispose

	addItem: ->
		@a_list.push(new Date)
	#END addItem

	removeItem: (item) ->
		@a_list.remove(item)
	#END removeItem

	beHappy: ->
		@the_text("Be Happy")
		console.log( @ instanceof ContentView )
	#END beHappy
#END ContentView

class SomeSubView extends Falcon.View
	url: "#subview-tmpl"

	display: ->
		alert("Hello! I am sub view")
	#END display

	dispose: ->
		alert("Good Bye! This has been sub view")
	#END dispose
#END SomeSubView

$root = ko.observable()
Falcon.apply( $root )

$root( new LayoutView )