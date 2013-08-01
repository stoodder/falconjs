class Falcon.Object
	#--------------------------------------------------------
	# Attribute: __falcon_object__current_cid__
	#	Private variable that acts as a counter for all falcon objects
	#	so that they have a unique client id.
	#--------------------------------------------------------
	__falcon_object__current_cid__ = 0

	#--------------------------------------------------------
	# Attribute: Falcon.Object#observables
	#	This is a list of the default observables and values for
	#	this view on each instantiation. If the value is a function
	#	a computed is created. If the value is an object with the keys
	#	'read' and/or 'write' a computed is created with those object
	#	keys as the defining variables. All computeds are created with
	#	this view's instance bound to its callback methods
	#--------------------------------------------------------
	observables: null

	#--------------------------------------------------------
	# Attribute: Falcon.Object#defaults
	#	This is a hash map of non-observable defaults to create
	#	whenever an instance of this class is initialized. If the
	#	value is a function, the function is called and the return
	#	value is assigned. Functions are called in context of this
	#	instance. Defaults are created before observables which
	#	means that any duplicate attributes between the observables
	#	and defaults will be overriden by those in the observables
	#--------------------------------------------------------
	defaults: null

	#--------------------------------------------------------
	# Method: Falcon.Object.extend
	#	Method used to create a new subclass that inherits from this
	#	class. Credit to Backbone js, snagged code from there
	#
	# Arguments:
	#	**protoProps** _(Object)_ - Properties for the prototype of a class
	#	**staticProps** _(Object)_ - Static properties for a given object
	#
	# Returns:
	#	_(Objec)t_ - The extended class
	#--------------------------------------------------------
	@extend = (protoProps, staticProps) ->
		parent = @

		# The constructor function for the new subclass is either defined by you
		# (the "constructor" property in your `extend` definition), or defaulted
		# by us to simply call the parent's constructor.
		if( protoProps and protoProps.hasOwnProperty('constructor') )
			child = protoProps.constructor
		else
			child = -> parent.apply(this, arguments)
		#END if

		child[key] = value for key, value of parent
		child[key] = value for key, value of staticProps

		# Set the prototype chain to inherit from `parent`, without calling
		# `parent`'s constructor function.
		Surrogate = ->
			@constructor = child
			return
		Surrogate.prototype = parent.prototype
		child.prototype = new Surrogate

		# Add prototype properties (instance properties) to the subclass,
		# if supplied.
		child.prototype[key] = value for key, value of protoProps

		# Set a convenience property in case the parent's prototype is needed
		# later.
		child.__super__ = parent.prototype

		return child
	#END Falcon.Object.extend

	#--------------------------------------------------------
	# Local event storage
	#--------------------------------------------------------
	__falcon_object__events__: null

	#--------------------------------------------------------
	# The unique client id of this falcon object
	#--------------------------------------------------------
	__falcon_object__cid__: null

	#--------------------------------------------------------
	# Method: Falcon.Object()
	#	The constructor method
	#--------------------------------------------------------
	constructor: ->
		@__falcon_object__events__ = {}
		@__falcon_object__cid__ = __falcon_object__current_cid__++

		#Setup the other defaults
		if isObject( @defaults )
			for attr, value of @defaults
				if isFunction( value  )
					this[attr] = value.apply(@, arguments)
				else if isObject( value )
					this[attr] = clone( value )
				else
					this[attr] = value
				#ENd if
			#ENF for
		#END if

		#Setup the observables
		if isObject( @observables )
			for attr, value of @observables
				if isFunction( value )
					@[attr] = ko.computed
						'read': value
						'owner': @
					#END computed
				else if isObject( value ) and ('read' of value or 'write' of value)
					@[attr] = ko.computed
						'read': value.read
						'write': value.write
						'owner': value.owner ? @
					#END computed
				else if isArray( value )
					@[attr] = ko.observableArray( value.slice(0) )
				else
					@[attr] = ko.observable( value )
				#END if
			#END for
		#END if
	#END constructor

	#--------------------------------------------------------
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
	#--------------------------------------------------------
	on: (event, action, context) ->
		return this unless isString(event) and isFunction(action)

		context ?= this
		event = trim(event).toLowerCase()

		return this if isEmpty(event)

		( @__falcon_object__events__[event] ?= [] ).push({action, context})

		return this
	#END on

	#--------------------------------------------------------
	# Method: Falcon.Model#off()
	#	Removes an event listener from an event
	#
	# Arguments:
	#	**event** _(string)_ - The event to remove from
	#	**action** _(function)_ - The event handler to remove
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	off: (event, action) ->
		return this unless isString(event)

		event = trim(event).toLowerCase()

		return this if isEmpty(event) or not @__falcon_object__events__[event]?

		if isFunction( action )
			@__falcon_object__events__[event] = ( evt for evt in @__falcon_object__events__[event] when evt.action isnt action )
			@__falcon_object__events__[event] = null if @__falcon_object__events__[event].length <= 0
		else
			@__falcon_object__events__[event] = null
		#END if

		return this
	#END off

	#--------------------------------------------------------
	# Method: Falcon.Model#has
	#	Method used to see if this model has a specific event attached
	#
	# Arguments:
	#	**event** _(string)_ - The event to look at
	#	**action** _(function)_ - The event handler to look for
	#
	# Returns:
	#	_(boolean)_ - Did we find the event?
	#--------------------------------------------------------
	has: (event, action) ->
		return false unless isString(event)

		event = trim(event).toLowerCase()

		return false if isEmpty(event) or not @__falcon_object__events__[event]?
		return true if @__falcon_object__events__[event]? and not isFunction( action )

		return true for evt in @__falcon_object__events__[event] when evt.action is action

		return false
	#END has
		
	#--------------------------------------------------------
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
	#--------------------------------------------------------
	trigger: (event, args...) ->
		return this unless isString(event)
		event = trim(event).toLowerCase()

		return this if isEmpty(event) or not @__falcon_object__events__[event]?

		evt.action.apply(evt.context, args) for evt in @__falcon_object__events__[event]

		return this
	#END trigger
#END Falcon.Object