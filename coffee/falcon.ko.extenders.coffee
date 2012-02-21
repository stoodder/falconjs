extend( ko.extenders,
	###
	# Method: ko.extenders.hasState
	#	Extender to add state to a knockout observable, with state we
	#	get access to the original value, the previously saved values,
	#	the previous value, and the current 'saved' state of the observable
	###
	hasState: (target, option) ->
		option = {
			initial: target()
		} unless isObject(option)
		
		initial = option.initial ? target()
		saved = ko.observable(initial)
		previous = ko.observable(null)
		current = target()
		changed = ko.observable(false)

		target.subscribe (value) ->
			previous(current)
			current = value
			changed(true)
		
		extend( target, 
			initial: initial
			saved: saved
			previous: previous
			changed: changed
			save: -> 
				saved(current)
				changed(false)
				return target
			revert: ->
				target(saved())
				changed(false)
				return target
		)

		return target
)