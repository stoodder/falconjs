Falcon =
	version: "{{VERSION}}"
	observable: ko.observable
	computed: ko.computed
	attr: (value) -> ko.observable(value).extend(hasState:true)
	apply: do ->
		v = null
		return (view) -> ( v ?= ko.observable(new view) )

#Expose Falcon to the window
@Falcon = Falcon

$ -> ko.applyBindings()
