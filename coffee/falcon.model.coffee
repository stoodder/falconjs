#--------------------------------------------------------
# Class: Falcon.Model
#	Represents a model
#--------------------------------------------------------
class Falcon.Model extends Falcon.Class

	_data: {}
	_id: null
	_url: ""

	@extend = (properties) -> Falcon.Class.extend(Falcon.Model, properties)

	@url: null

	###
	# Method: constructor
	#	The constructor for a model
	###
	constructor: (data) ->
		url = ko.utils.unwrapObservable( @url )

		@url = ko.observable(url)

		@data(data)

	###
	#
	###
	data: (data) ->
		return @_data if isEmpty(data)
		data = {} unless isObject(data)
		
		@set(key, value) for key, value of data

	###
	#
	###
	get: (key) ->
		return undefined unless isString(key)
		ko.utils.unwrapObservable( @_data[key] )
	
	###
	# 
	###
	set: (key, value) ->
		value = ko.utils.unwrapObservable(value)
		@_data[key] ?= ko.observable()
		@_data[key](value)
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

		url = trim( @url() )
		if type in ["GET", "PUT", "DELETE"]
			url += "/" unless url.slice(-1) is "/"
			url += @id()

		$.ajax(
			url: @url()
			type: type
			data: @toJSON()
			error: -> options.error(arguments...)
			success: -> options.success(arguments...)
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