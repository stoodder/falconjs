class LayoutView extends Falcon.View
	url: "#layout-view"

	initialize: ->
		console.log("INIT")
		@current_view = ko.observable()
	#END initialize

	showSettings: ->
		@current_view( new SettingsView )
	#END showSettings

	showList: ->
		@current_view( new ListView )
	#END showList
#END LayoutView

class SettingsView extends Falcon.View
	url: "#settings-view"

	dispose: -> console.log("Settings View Gone")
#END SettingsView

class ListView extends Falcon.View
	url: "#list-view"

	initialize: ->
		@itemA = new ListItemView("A")
		@itemB = new ListItemView("B")
	#END initialize

	dispose: -> console.log("List View Gone")
#END ListView

class ListItemView extends Falcon.View
	url: "#list-item-view"

	initialize: (name) ->
		@name = name
	#END initialize

	dispose: -> console.log("Disposed of list item #{@name}")
#END ListItemView

Falcon.apply "#application", -> new LayoutView