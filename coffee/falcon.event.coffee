#----------------------------------------
# Class: Falcon.Event
#	Handles gloal events for a specific element. 
#	Better event removal for single page apps
#----------------------------------------
class Falcon.Event
	@UP_KEY = 38
	@DOWN_KEY = 40
	@RIGHT_KEY = 39
	@LEFT_KEY = 37
	@ENTER_KEY = 13

	_element: null

	###
	# Method: Falcon.Event()
	###
	constructor: (element) ->
		unless element?
			throw new Error("Element must be given")

		@_element = $(element)
	#END constructor

	###
	# Method: Falcon.Event#on()
	###
	on: (event, callback) ->
		event = "" unless isString(event)
		element = @_element
		callback = (->) unless isFunction(callback)

		event = trim(event)

		return if isEmpty(event)

		_callback = (args...) ->
			if element.parents('body').length > 0
				callback.call(this, args...)
			else
				$window.off(event, _callback)
			#END if
		#END keydownCallback

		$window.on(event, _callback)
	#END Falcon.on
#END Falcon.Event