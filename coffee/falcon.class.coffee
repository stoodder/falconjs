class Falcon.Class
	super: () ->

	###
	# Method: Falcon.Class.extend
	#	Used to extend (as in, inherit) from one class to another
	#
	# Arguments:
	#	**parent** _(Object)_ - The parent to extend from
	#	**definition** _(Object)_ - The child's class definition
	#
	# Returns:
	#	_Object_ - The extended class
	###
	@extend = (parent, definition) ->
		parent ?= Falcon.Class
		child = null

		if definition? and definition.hasOwnProperty("constructor")
			child = definition.constructor
		else
			child = -> @__super__(arguments...)
		
		ctor = (->)
		ctor.prototype = parent.prototype
		child.prototype = new ctor
		child.prototype.__super__ = () -> parent.apply(this, arguments)
		child.extend = (definition) -> Falcon.Class.extend(child, definition)

		extend( child.prototype, definition ? {} )

		return child
	#END Falcon.Class.extend

	###
	# Local event storage
	###
	_events: null

	###
	# Method: Falcon.Class()
	#	The constructor method
	###
	constructor: ->
		@_events = {}
	#END constructor

	###
	# Method: Falcon.Model#on()
	#	Adds an event listener to a specific event
	#
	# Arguments:
	#	**event** _(string)_ - The event to listen tpo
	#	**action** _(function)_ - The callback function to attach to this event
	#	**context** _(mixed)_ - The context to apply to the callback. Defaults to this model
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	###
	on: (event, action, context) ->
		return this unless isString(event) and isFunction(action)

		context ?= this
		event = trim(event).toLowerCase()

		return this if isEmpty(event)

		( @_events[event] ?= [] ).push({action, context})

		return this
	#END on

	###
	# Method: Falcon.Model#off()
	#	Removes an event listener from an event
	#
	# Arguments:
	#	**event** _(string)_ - The event to remove from
	#	**action** _(function)_ - The event handler to remove
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	###
	off: (event, action) ->
		return this unless isString(event) and isFunction(action)

		event = trim(event).toLowerCase()

		return this if isEmpty(event) or not @_events[event]?

		@_events[event] = ( evt for evt in @_events[event] when evt.action isnt action )

		return this
	#END off

	###
	# Method: Falcon.Model#has
	#	Method used to see if this model has a specific event attached
	#
	# Arguments:
	#	**event** _(string)_ - The event to look at
	#	**action** _(function)_ - The event handler to look for
	#
	# Returns:
	#	_(boolean)_ - Did we find the event?
	###
	has: (event, action) ->
		return false unless isString(event) and isFunction(action)

		event = trim(event).toLowerCase()

		return false if isEmpty(event) or not @_events[event]?

		return true for evt in @_events[event] when evt.action is action

		return false
	#END has

	###
	# Method: Falcon.Model#relay
	#	Relay's a specific event when called on an object through this object
	#
	# Arguments:
	#	**object** _(string)_ - The event to look at
	#	**event** _(function)_ - The event handler to look for
	#
	# Returns:
	#	_(Falcon.Class)_ - This instance
	###
	relay: (object, event) ->
		[object, event] = [event, object] unless isString(event)
		return this unless Falcon.isFalconObject(object)
		return this if isEmpty(event)

		object.on(event, => @trigger(event, arguments...))

		return this
	#END relay
		
	###
	# Method: Falcon.Model#trigger()
	#	Used to trigger a specific event
	#
	# Arguments:
	#	**event** _(string)_ - The event to trigger
	#	**args...** _(arguments)_ - Additional arguments to pass into the
	#								event listeners
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	###
	trigger: (event, args...) ->
		return this unless isString(event)
		event = trim(event).toLowerCase()

		return this if isEmpty(event) or not @_events[event]?

		evt.action.apply(evt.context, args) for evt in @_events[event]

		return this
	#END trigger