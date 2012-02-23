#--------------------------------------------------------
# Class: Falcon.Model
#	Represents a model
#--------------------------------------------------------
class Falcon.Model extends Falcon.Class

	_id: null
	_url: ""

	@extend = (properties) -> Falcon.Class.extend(Falcon.Model, properties)

	url: null

	parent: null

	###
	# Method: constructor
	#	The constructor for a model
	###
	constructor: (data, parent) ->
		[parent, data] = [data, parent] if not parent? and data instanceof Falcon.Model

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

			for key, value of @ when not (key of Falcon.Model.prototype)
				if value instanceof Falcon.Model or value instanceof Falcon.Collection
					ret[key] = value.data()
				else
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

		return (if ko.isObservable(datum) then ko.utils.unwrapObservable( datum )  else datum)
	
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
	sync: (type, options) ->
		options = {complete:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)
		options.error = (->) unless isFunction(options.error)
		options.complete = (->) unless isFunction(options.complete)

		type = if isString(type) then type.toUpperCase() else "GET"
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]
		type = trim(type)

		console.log("HERE", @url)
		url = trim( if isFunction(@url) then @url() else @url )

		ext = ""
		periodIndex = url.lastIndexOf(".")

		if periodIndex > -1
			ext = url.slice(periodIndex)
			url = url.slice(0, periodIndex)

		if type in ["GET", "PUT", "DELETE"]
			url += "/" unless url.slice(-1) is "/"
			url += @id()

		$.ajax(
			url: "#{url}#{ext}"
			type: type
			data: @toJSON()
			error: -> options.error(arguments...)
			success: (data) => 
				@data(data)
				options.success(arguments...)
			complete: -> options.complete(arguments...)
		)
	
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
	delete: (options) -> @sync('DELETE', options)

	###
	#
	###
	toJS: () ->
		return (recur = (value) ->
			value = ko.utils.unwrapObservable(value)
			if isArray value
				return ( recur(v) for v in value )
			else if isObject value
				output = {}
				output[k] = recur(v) for k, v of value
				return output
			else
				return value
		)(@data())
	
	###
	#
	###
	toJSON: () -> ko.utils.stringifyJson( @toJS() )