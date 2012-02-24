#--------------------------------------------------------
# Class: Falcon.Model
#	Represents a model
#--------------------------------------------------------
class Falcon.Model extends Falcon.Class

	@extend = (properties) -> Falcon.Class.extend(Falcon.Model, properties)

	url: null

	parent: null

	_events: null

	###
	# Method: constructor
	#	The constructor for a model
	###
	constructor: (data, parent) ->
		[parent, data] = [data, parent] if Falcon.isModel( data )

		@_events = {}
		@id = ko.observable(0)

		@parent = parent
		@initialize(data)
		@data(data)


	initialize: (->)

	###
	#
	###
	data: (data) ->
		if isEmpty(data)
			ret = {}

			for key, value of this when not (key of Falcon.Model.prototype)
				if value instanceof Falcon.Model or value instanceof Falcon.Collection
					ret[key] = value.data()
				else if  ko.isObservable(value) or isFunction(value)
					ret[key] = value
			return ret

		data = {} unless isObject(data)

		@set(key, value) for key, value of data

	###
	#
	###
	get: (key) ->
		return undefined unless isString(key)

		datum = @[key]

		return ko.utils.unwrapObservable( datum )
	
	###
	# 
	###
	set: (key, value) ->
		return this if not key? or key of Falcon.Model.prototype

		value = ko.utils.unwrapObservable(value) if ko.isObservable(value)
		
		datum = ( @[key] ?= ko.observable() )

		if datum instanceof Falcon.Model or datum instanceof Falcon.Collection
			datum.data(value)
		else if ko.isObservable(datum)
			datum(value)

		return this
		
	###
	#
	###
	makeUrl: (type) ->
		url = trim( if isFunction(@url) then @url() else @url )

		ext = ""
		periodIndex = url.lastIndexOf(".")

		if periodIndex > -1
			ext = url.slice(periodIndex)
			url = url.slice(0, periodIndex)

		if type in ["GET", "PUT", "DELETE"]
			url += "/" unless url.slice(-1) is "/"
			url += @id()

		return "#{url}#{ext}"

	###
	#
	###
	sync: (type, options) ->
		options = {complete:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)
		options.error = (->) unless isFunction(options.error)
		options.complete = (->) unless isFunction(options.complete)

		type = if isString(type) then type.toUpperCase() else "GET"
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]
		type = trim(type)

		url = @makeUrl(type)

		$.ajax(
			url: url
			type: type
			data: @toJSON()
			error: => options.error.call(this, this, arguments...)
			success: (data) => 

				@data(data)

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
	map: (mapping) ->

		mapping = {} unless isObject(mapping)

		for key, value of mapping
			if Falcon.isDataObject( this[key] )
				this[key].map(value)
			else 
				if ko.isObservable(value)
					value = ko.observable( ko.utils.unwrapObservable(value) )
				else if isFunction(value)
					value = do =>
						_value = value
						return ( => _value.call(this, this) )
				this[key] = value 

		return this
		
	###
	#
	###
	on: (event, action) ->
		return this unless event? and action?

		event = "" unless isString(event)
		action = (->) unless isFunction(action)

		event = trim(event).toLowerCase()

		return this if isEmpty(event)

		( @_events[event] ?= [] ).push( => action.call(this, this) )

		return this
		
	###
	#
	###
	trigger: (event) ->
		return this unless event?

		event = "" unless isString(event)
		event = trim(event).toLowerCase()

		return this if isEmpty(event) or not @_events[event]?

		action() for action in @_events[event]

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
	toJSON: () -> 
		data = {}
		data[key] = value for key, value of @data()

		ret = (recur = (value) ->
			value = ko.utils.unwrapObservable(value)
			if isArray value
				return ( recur(v) for v in value )
			else if isObject value
				output = {}
				output[k] = recur(v) for k, v of value
				return output
			else
				return value
		)( data )

		ko.utils.stringifyJson( ret ) unless isEmpty(ret)