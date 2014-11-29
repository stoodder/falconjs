#==============================================================================================
#
# Class: Falcon.Object
#
#==============================================================================================
class FalconObject
	#--------------------------------------------------------
	# Attribute: Falcon.Object#observables
	#	This is a list of the default observables and values for
	#	this object on each instantiation. If the value is a function
	#	a computed is created. If the value is an object with the keys
	#	'read' and/or 'write' a computed is created with those object
	#	keys as the defining variables. All computeds are created with
	#	this object's instance bound to its callback methods
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
	#	_(Object)_ - The extended class
	#--------------------------------------------------------
	@extend = (protoProps, staticProps) ->
		parent = @

		# The constructor function for the new subclass is either defined by you
		# (the "constructor" property in your `extend` definition), or defaulted
		# by us to simply call the parent's constructor.
		if( protoProps and protoProps.hasOwnProperty('constructor') )
			child = protoProps.constructor
		else
			child = -> parent.apply(@, arguments)
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
	# Local array of event callbacks assigned by the listenTo
	# method
	#--------------------------------------------------------
	__falcon_object__listeners__: null

	#--------------------------------------------------------
	# Method: Falcon.Object()
	#	The constructor method
	#--------------------------------------------------------
	constructor: ->
		#Setup the other defaults
		if isObject( @defaults )
			for attr, value of @defaults
				if isFunction( value )
					@[attr] = value.apply(@, arguments)
				else if isObject( value )
					@[attr] = clone( value )
				else if isArray( value )
					@[attr] =  value.slice(0)
				else
					@[attr] = value
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
						'deferEvaluation': Falcon.deferEvaluation ? true
					#END computed
				else if isObject( value ) and ('read' of value or 'write' of value)
					@[attr] = ko.computed
						'read': value.read
						'write': value.write
						'owner': value.owner ? @
						'deferEvaluation': value.deferEvaluation ? Falcon.deferEvaluation ? true
						'disposeWhen': value.disposeWhen
						'disposeWhenNodeIsRemoved': value.disposeWhenNodeIsRemoved
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
	# Method: Falcon.Object#on()
	#	Adds an event listener to a specific event
	#
	# Arguments:
	#	**event** _(string)_ - The event to listen tpo
	#	**callback** _(function)_ - The callback function to attach to this event
	#	**context** _(mixed)_ - The context to apply to the callback. Defaults to this object
	#
	# Returns:
	#	_(Falcon.Object)_ - This instance
	#--------------------------------------------------------
	on: (event, callback, context, allowance) ->
		return @ unless isString(event) and isFunction(callback)

		context ?= @
		allowance ?= -1 # -1 indicates infinite calls
		event = trim(event).toLowerCase()

		return @ if isEmpty(event)

		@__falcon_object__events__ ?= {}
		( @__falcon_object__events__[event] ?= [] ).push({callback, context, allowance})

		return @
	#END on

	once: (event, callback, context) -> @on(event, callback, context, 1)

	#--------------------------------------------------------
	# Method: Falcon.Model#off()
	#	Removes an event listener from an event
	#
	# Arguments:
	#	**event** _(string)_ - The event to remove from
	#	**callback** _(function)_ - The event handler to remove
	#	**context** _(mixed)_ - The context that the callback should have been called on
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	off: (event, callback, context) ->
		return @ unless isObject(@__falcon_object__events__)

		[callback, context, event] = [event, callback, null] unless isString(event)
		[context, callback] = [callback, null] unless isFunction(callback)

		event = trim(event).toLowerCase() if isString(event)

		should_keep_event = (event_object) =>
			return true if callback? and event_object.callback isnt callback
			return true if context?  and event_object.context  isnt context
			return false
		#END should_keep_event

		update_events_for = (event) =>
			evts = @__falcon_object__events__[event]
			return unless isArray(evts)
			evts = ( evt for evt in evts when should_keep_event(evt) )
			@__falcon_object__events__[event] = if evts.length <= 0 then null else evts
		#DND update_events_for

		if isString(event)
			update_events_for(event)
		else
			update_events_for(event) for event of @__falcon_object__events__
		#END if

		return @
	#END off

	#--------------------------------------------------------
	# Method: Falcon.Model#has
	#	Method used to see if this model has a specific event attached
	#
	# Arguments:
	#	**event** _(string)_ - The event to look at
	#	**callback** _(function)_ - The event handler to look for
	#
	# Returns:
	#	_(boolean)_ - Did we find the event?
	#--------------------------------------------------------
	has: (event, callback) ->
		return false unless isString(event)

		event = trim(event).toLowerCase()

		@__falcon_object__events__ ?= {}

		return false if isEmpty(event) or not @__falcon_object__events__[event]?
		return true if @__falcon_object__events__[event]? and not isFunction( callback )

		return true for evt in @__falcon_object__events__[event] when evt.callback is callback

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
		return @ unless isString(event)
		event = trim(event).toLowerCase()

		@__falcon_object__events__ ?= {}

		return @ if isEmpty(event) or not @__falcon_object__events__[event]?

		resultant_event_array = []

		for evt in @__falcon_object__events__[event]
			if evt.allowance isnt 0
				resultant_event_array.push(evt)
				evt.callback.apply(evt.context, args)
			#END if

			evt.allowance-- if evt.allowance > 0
		#END for

		@__falcon_object__events__[event] = resultant_event_array

		return @
	#END trigger

	#--------------------------------------------------------
	# Method: Falcon.Model#listenTo(object, event, callback)
	# 	This is the same as 'on' except that all of the callbacks
	#	will be called in the context of this object.  Additionally
	#	events assigned using the listenTo method can easily be removed
	#	using the stopListening method without having to hold on to
	#	an instance of the callback method
	#
	# Arguments:
	#	**object** - _(Falcon.Object)_ - The object to listen for events on
	#	**event** - _(String)_ - The event to respond to
	#	**callback** - _(Function)_ - The callback to run when said event is triggered.
	#								  Will be called in context of this
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	listenTo: (object, event, callback) ->
		return @ unless Falcon.isFalconObject( object )
		return @ unless isString(event) and isFunction(callback)

		object.on(event, callback, @)

		@__falcon_object__listeners__ ?= []
		@__falcon_object__listeners__.push({object, event, callback})

		return @
	#END listenTo

	listenToOnce: (object, event, callback) ->
		return @ unless Falcon.isFalconObject( object )
		return @ unless isString(event) and isFunction(callback)

		object.once(event, callback, @)

		@__falcon_object__listeners__ ?= []
		@__falcon_object__listeners__.push({object, event, callback})

		return @
	#END listenTo

	#--------------------------------------------------------
	# Method: Falcon.Model#stopListening([object], [event], [callback])
	# 	Stops listening to events assigned by the listenTo method. Optional
	#	object, event, and callback parameters can be given to filter out
	#	which events specifically we'll stop listening to.
	#
	# Arguments:
	#	**object** - _(Falcon.Object)_ - The object to listen for events on
	#	**event** - _(String)_ - The event to respond to
	#	**callback** - _(Function)_ - The callback to run when said event is triggered.
	#								  Will be called in context of this
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	stopListening: (object, event, callback) ->
		[event, callback, object] = [object, event, null] if isString( object )
		[callback, object] = [object, null] if isFunction( object )
		[callback, event] = [event, null] if isFunction( event )

		_event = if isString( event ) then event else null
		_object = if Falcon.isFalconObject( object ) then object else null
		_callback = if isFunction( callback ) then callback else null

		@__falcon_object__listeners__ ?= []
		new_listeners = []

		for listener in @__falcon_object__listeners__
			{object, event, callback} = listener
			
			if _event? and event isnt _event
				new_listeners.push( listener )
			else if _object? and object isnt _object
				new_listeners.push( listener )
			else if _callback? and callback isnt _callback
				new_listeners.push( listener )
			else
				object.off(event, callback, @)
			#END if
		#END for

		@__falcon_object__listeners__ = new_listeners
		
		return @
	#END stopListening
#END Falcon.Object