#--------------------------------------------------------
# Class: Falcon.Model
#	Represents a model
#--------------------------------------------------------
class Falcon.Model extends Falcon.Class

	@extend = (properties) -> Falcon.Class.extend(Falcon.Model, properties)

	url: null
	parent: null
	fields: null #TODO: Make this into an object, array reads to object form
	_events: null

	###
	# Method: Falcon.Class()
	#	The constructor for a model
	#
	# Arguments:
	#	**data** _(object)_ - The initial data to load in
	#	**parent** _(mixed)_ - The parent object of this one
	###
	constructor: (data, parent) ->
		data = ko.utils.unwrapObservable( data )
		parent = ko.utils.unwrapObservable( parent )

		[parent, data] = [data, parent] if not parent? and Falcon.isModel( data )

		data = data.unwrap() if Falcon.isModel(data)

		@_events = {}
		@id = ko.observable()
		@fields = [] if @fields is null
		@parent = parent

		@initialize(data)
		@fill(data)

		#Lastly make sure that any of the fields that should exist, do
		this[field] = ko.observable() for field in @fields when not this[field] and isString(field)
	#END constructor

	initialize: (->)

	###
	# Method: Falcon.Model#fill
	#	Method used to 'fill in' and add data to this model
	###
	fill: (data) ->
		return this unless isObject(data)

		protoKeys = objectKeys(Falcon.Model.prototype)
		acceptedKeys = arrayRemove( objectKeys(this), protoKeys )
		rejectedKeys = arrayRemove( protoKeys, acceptedKeys )
		rejectedKeys = arrayRemove( rejectedKeys, "id" )
		rejectedKeys = arrayUnique( rejectedKeys )

		for key, value of data when not (key in rejectedKeys)
			value = ko.utils.unwrapObservable( value )
			if not this[key]?
				unless ko.isObservable(value) or Falcon.isDataObject(value)
					if isArray(value)
						value = ko.observableArray(value)
					else
						value = ko.observable(value)
					#END if
				#END unless
				this[key] = value
			else if Falcon.isDataObject(this[key])
				this[key].fill(value)
			else if ko.isObservable(this[key])
				this[key](value) if ko.isWriteableObservable(this[key])
			else
				this[key] = value
			#END if
		#END for

		return this
	#END fill

	###
	# Method: Falcon.Model#unwrap
	#	Method used to 'unwrap' this object into an anonmous object
	#	Needed to cascade inwards on other Falcon Data objects (like lists)
	#	to unwrap newly added member variables/objects
	#
	# Returns
	#	_Object_ - The 'unwrapped' object
	###
	unwrap: () ->
		raw = {}

		#Get the keys that pertain only to this models added attributes
		keys = arrayRemove( objectKeys(this), objectKeys(Falcon.Model.prototype) )
		keys[keys.length] = "id"
		keys = arrayUnique( keys )

		for key in keys
			value = this[key]
			raw[key] = if Falcon.isDataObject(value) then value.unwrap() else value
		#END fors

		return raw
	#END unwrap

	###
	# Method: Falon.Model#serialize
	#	Serializes the data into a raw json object and only corresponds to the fields
	#	that are primitive and that we wish to be able to send back to the server
	###
	serialize: ->
		raw = {}

		if isArray(@fields) and @fields.length > 0
			keys = @fields
		else
			keys = arrayRemove( objectKeys(this), objectKeys(Falcon.Model.prototype) )
		#END if

		keys[keys.length] = "id"
		keys = arrayUnique( keys )

		for key in keys
			value = this[key]
			if Falcon.isDataObject(value)
				raw[key] =  value.serialize() 
			else if ko.isObservable(value)
				raw[key] = ko.utils.unwrapObservable( value )
			else if not isFunction(value)
				raw[key] = value
		#END for

		return raw
	#END serialize
		
	###
	# Method: Falcon.Model#makeURL
	#	generates a URL based on this model's url, the parent model of this model, 
	#	the type of request we're making and Falcon's defined baseModel
	#
	# Arguments:
	#	**type** _(string)_ - The type of request we're making (GET, POST, PUT, DELETE)
	#
	# Returns:
	#	_String_ - The generated URL
	###
	makeUrl: (type) ->
		url = if isFunction(@url) then @url() else @url
		url = "" unless isString(url)
		url = trim(url)

		type = "" unless isString(type)
		type = type.toUpperCase()
		type = 'GET' unless type in ['GET', 'PUT', 'POST', 'DELETE']

		ext = ""
		periodIndex = url.lastIndexOf(".")

		#Split on the extension if it exists
		if periodIndex > -1
			ext = url.slice(periodIndex)
			url = url.slice(0, periodIndex)
		#END if

		#Make sure the url is now formatted correctly
		url = "/#{url}" unless startsWith(url, "/")

		#Check if a parent model is present
		if Falcon.isModel(@parent)
			parentUrl = @parent.makeUrl()
			parentPeriodIndex = parentUrl.lastIndexOf(".")
			parentUrl = parentUrl.slice(0, parentPeriodIndex) if parentPeriodIndex > -1
			parentUrl = trim(parentUrl)

			url = "#{parentUrl}#{url}"

		#Otherwise consider this the base
		else if isString(Falcon.baseApiUrl)
			url = "#{Falcon.baseApiUrl}#{url}"

		#END if

		#Append the id if it exists
		if type in ["GET", "PUT", "DELETE"]
			url += "/" unless url.slice(-1) is "/"
			url += @id()
		#END if

		#Return the built url
		return "#{url}#{ext}"
	#END makeUrl

	###
	# Method: Falcon.Model#sync
	#	Used to dynamically place calls to the server in order
	#	to create, update, destroy, or read this from/to the
	#	server
	#
	# Arguments:
	#	**type** _(String)_ - The HTTP Method to call to the server with
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	###
	sync: (type, options) ->
		options = {complete:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)
		options.error = (->) unless isFunction(options.error)
		options.complete = (->) unless isFunction(options.complete)

		type = trim( if isString(type) then type.toUpperCase() else "GET" )
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]

		data = {}
		data = @serialize() if type in ["POST", "PUT"]
		###
		if Falcon.isDataObject(options.data)
			data = extend( data, options.data.serialize() ) 
		else if isObject(options.data)
			data = extend( data, options.data ) if isObject(options.data)
		###
		json = if isEmpty(data) then "" else JSON.stringify(data)

		url = @makeUrl(type)

		console.log(type, url, data)
		console.log( JSON.stringify(data) )

		$.ajax(
			url: url
			type: type
			data: json
			dataType: 'json'
			error: (xhr) => 
				response = xhr.responseText
				try
					response = JSON.parse(response) if isString(response)
				catch e

				options.error.call(this, this, response, xhr)
			success: (data) => 
				@fill(data)

				switch type
					when "GET" then @trigger("fetch")
					when "POST" then @trigger("create")
					when "PUT" then @trigger("save")
					when "DELETE" then @trigger("destroy")

				options.success.call(this, this, arguments...)

			complete: => 
				options.complete.call(this, this, arguments...)
		)

		return this

	###
	#
	###
	fetch: (options) -> @sync('GET', options)

	###
	#
	###
	create: (options) -> @sync('POST', options)

	###
	#
	###
	save: (options) -> @sync('PUT', options)

	###
	#
	###
	destroy: (options) -> @sync('DELETE', options)

	###
	#
	###
	map: (mapping) ->

		mapping = {} unless isObject(mapping)

		for key, value of mapping
			if Falcon.isDataObject( this[key] )
				this[key].map(value)
			else 
				if ko.isObservable(value)
					this[key] = ko.observable( ko.utils.unwrapObservable(value) )
				else if isFunction(value)
					do =>
						_value = value
						this[key] = () => 
							_value.call(this, this) 
				else
					this[key] = value 

		return this
	#END map
		
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
	#	_(Flacon.Model)_ - This instance
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
	# Method: Falcon.Model#trigger()
	#	Used to trigger a specific event
	#
	# Arguments:
	#	**event** _(string)_ - The event to trigger
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	###
	trigger: (event) ->
		return this unless isString(event)
		event = trim(event).toLowerCase()

		return this if isEmpty(event) or not @_events[event]?

		evt.action.call(evt.context, this) for evt in @_events[event]

		return this
	#END trigger

	###
	# Method: Falcon.Model#clone
	# 	Method used to deeply clone this model
	#
	# Returns:
	#	_Falcon.Model_ - A clone of this model
	###
	clone: ->
		return new this.constructor(this.unwrap())
	#END clone
#END Falcon.Model
