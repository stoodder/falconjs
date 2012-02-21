Falcon =
	version: "{{VERSION}}"
	observable: ko.observable
	computed: ko.computed
	attr: (value) -> ko.observable(value).extend(hasState:true)
	apply: (view) -> 
		$ ->
			$('body').attr('data-bind', 'view: $data')
			ko.applyBindings(view)

	__layout__: null

#Expose Falcon to the window
@Falcon = Falcon

