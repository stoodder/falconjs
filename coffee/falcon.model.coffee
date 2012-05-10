#--------------------------------------------------------
# Class: Falcon.Model
#	Represents a model
#--------------------------------------------------------
class Falcon.Model extends Falcon.Class

	#--------------------------------------------------------
	# Method: Falcon.Model.extend()
	#	static method used to replicate inhertiance in
	#	javascript applications.  Used to create a new
	#	model that inherits from the base Falcon.Model
	#
	# Arguments:
	#	**properties** _(Object)_ -  The new class definition
	#
	# Returns:
	#	_(Object)_ - The new class definition
	#--------------------------------------------------------
	@extend = (properties) -> Falcon.Class.extend(Falcon.Model, properties)

	#--------------------------------------------------------
	# Member: Falcon.Model#id
	#	This is the serve's id of this model.  This value will be converted
	#	to an observable (keeping the same value) once this model is 
	#	instantiated.
	#--------------------------------------------------------
	id: null

	#--------------------------------------------------------
	# Member: Falcon.Model#url
	#	This is the top level url for the model.
	#--------------------------------------------------------
	url: null

	#--------------------------------------------------------
	# Member: Falcon.Model#parent
	#	This represents the 'parent' object that holds this
	#	model.  Generally this is used for determining the URL
	#	structure of rest objects in the makeURL() routine.
	#	This should also be a Model.
	#
	# Type: Falcon.Model
	#--------------------------------------------------------
	parent: null

	#--------------------------------------------------------
	# Member: Falcon.Model#fields
	# 	The fields to transfer to/from the server
	# 	Takes 2 forms
	#
	# Form 1: Array
	#	A list of array to directly map (1-to-1) model 
	#	attributes to server attributes
	#
	# Form 2: Object
	# 	A object of mapped fields
	#	The object's keys are the server attributes
	#	The object's values are the model attributes
	#
	# Type: Array, Object
	#--------------------------------------------------------
	fields: null

	#--------------------------------------------------------
	# Member: Falcon.Model#loading
	#	Flag indicating if this model is in a loading state
	#	(if any ajax request is currently executing). Will
	#	be converted to an observable on construction
	#
	# Type: Boolean
	#--------------------------------------------------------
	loading: false

	#--------------------------------------------------------
	# Method: Falcon.Model()
	#	The constructor for a model
	#
	# Arguments:
	#	**data** _(object)_ - The initial data to load in
	#	**parent** _(mixed)_ - The parent object of this one
	#--------------------------------------------------------
	constructor: (data, parent) ->
		super()
		
		data = ko.utils.unwrapObservable( data )
		parent = ko.utils.unwrapObservable( parent )

		[parent, data] = [data, parent] if not parent? and Falcon.isModel( data )

		data = data.unwrap() if Falcon.isModel(data)

		@id = ko.observable( ko.utils.unwrapObservable(@id) )
		@loading = ko.observable( ko.utils.unwrapObservable( @loading ) )
		@fields = {} if @fields is null
		@parent = parent

		@initialize(data)
		@fill(data)

		#Lastly make sure that any of the fields that should exist, do
		this[model_field] = ko.observable() for field, model_field of @fields when not this[model_field] and isString(model_field)
	#END constructor

	#--------------------------------------------------------
	# Method: Falcon.Model#initialize()
	#	The psuedo-constructor of the model.  Useful for ensuring that
	#	the base constructor is called (in the correct spot) without 
	#	having to explicitly call the native Model constructor
	#
	# Arguments:
	#	**data** _(object)_ - The initial data to load in
	#--------------------------------------------------------
	initialize: (data) ->
	#END initialize

	#--------------------------------------------------------
	# Method: Falcon.Model#fill()
	#	Method used to 'fill in' and add data to this model
	#--------------------------------------------------------
	fill: (_data) ->
		return this unless isObject(_data)
		_data = _data.unwrap() if Falcon.isModel(_data)
		data = {}

		#if the fields is an object, map the data
		if isObject(@fields) and not isEmpty(@fields)
			data[ @fields[key] ? key ] = value for key, value of _data
		#Otherwise just directly map it
		else
			data = _data
		#END if

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

	#--------------------------------------------------------
	# Method: Falcon.Model#unwrap()
	#	Method used to 'unwrap' this object into an anonmous object
	#	Needed to cascade inwards on other Falcon Data objects (like lists)
	#	to unwrap newly added member variables/objects
	#
	# Returns
	#	_(Object)_ - The 'unwrapped' object
	#--------------------------------------------------------
	unwrap: () ->
		raw = {}

		#Get the keys that pertain only to this models added attributes
		keys = arrayRemove( objectKeys(this), objectKeys(Falcon.Model.prototype) )
		keys[keys.length] = "id"
		keys = arrayUnique( keys )

		for key in keys
			value = this[key]
			raw[key] = if Falcon.isDataObject(value) then value.unwrap() else value
		#END for

		return raw
	#END unwrap

	#--------------------------------------------------------
	# Method: Falon.Model#serialize()
	#	Serializes the data into a raw json object and only corresponds to the fields
	#	that are primitive and that we wish to be able to send back to the server
	#
	# Returns:
	#	_(Object)_ - The resultant 'raw' object to send to the server
	#--------------------------------------------------------
	serialize: ->
		raw = {}

		server_keys = []
		model_keys = []

		# Get the keys and mapped keys
		# Mapped keys are the local attributes
		# Keys are the server's attributes
		if isArray(@fields) and not isEmpty(@fields)
			for field in @fields
				server_keys[server_keys.length] = field
				model_keys[model_keys.length] = field
			#END for

		else if isObject(@fields) and not isEmpty(@fields)
			for server_field, model_field of @fields
				server_keys[server_keys.length] = server_field
				model_keys[model_keys.length] = if model_field of this then model_field else server_field
			#END for

		else
			server_keys = model_keys = arrayRemove( objectKeys(this), objectKeys(Falcon.Model.prototype) )
		#END if

		#Make sure we pull in the id
		server_keys.push("id")
		server_keys = arrayUnique( server_keys )

		model_keys.push("id")
		model_keys = arrayUnique( model_keys )

		for index, model_key of model_keys
			server_key = server_keys[index]
			value = this[model_key]

			if Falcon.isDataObject(value)
				raw[server_key] =  value.serialize() 
			else if ko.isObservable(value)
				raw[server_key] = ko.utils.unwrapObservable( value )
			else if not isFunction(value)
				raw[server_key] = value
			#END if
		#END for

		return raw
	#END serialize
		
	#--------------------------------------------------------
	# Method: Falcon.Model#makeURL()
	#	generates a URL based on this model's url, the parent model of this model, 
	#	the type of request we're making and Falcon's defined baseApiUrl
	#
	# Arguments:
	#	**type** _(string)_ - The type of request we're making (GET, POST, PUT, DELETE)
	#
	# Returns:
	#	_String_ - The generated URL
	#--------------------------------------------------------
	makeUrl: (type, parent) ->
		url = if isFunction(@url) then @url() else @url
		url = "" unless isString(url)
		url = trim(url)

		type = "" unless isString(type)
		type = type.toUpperCase()
		type = 'GET' unless type in ['GET', 'PUT', 'POST', 'DELETE']

		parent = if Falcon.isModel(parent) then parent else @parent

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
		if Falcon.isModel(parent)
			parentUrl = parent.makeUrl()
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

	#--------------------------------------------------------
	# Method: Falcon.Model#sync()
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
	#--------------------------------------------------------
	sync: (type, options) ->
		options = {complete: options} if isFunction(options)
		options = {} unless isObject(options)
		options.data = {} unless isObject(options.data)
		options.dataType = "json" unless isString(options.dataType)
		options.contentType = "application/json" unless isString(options.contentType)
		options.success = (->) unless isFunction(options.success)
		options.complete = (->) unless isFunction(options.complete)
		options.error = (->) unless isFunction(options.error)
		options.parent = @parent unless Falcon.isModel(options.parent)

		type = trim( if isString(type) then type.toUpperCase() else "GET" )
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]

		data = {}
		unless isEmpty(options.data)
			data[key] = value for key, value of options.data
		#END unless
		data = extend(data, @serialize()) if type in ["POST", "PUT"]

		#serialize the data to json
		json = if isEmpty(data) then "" else JSON.stringify(data)

		url = @makeUrl(type, options.parent)

		@loading(true)

		$.ajax
			'url': url
			'type': type
			'data': json
			'dataType': options.dataType
			'contentType': options.contentType

			'success': (data) => 
				@fill(data) 
				switch type
					when "GET" then @trigger("fetch", data)
					when "POST" then @trigger("create", data)
					when "PUT" then @trigger("save", data)
					when "DELETE" then @trigger("destroy", data)
				#END switch

				options.success.call(this, this, arguments...)
			#END success

			'error': (xhr) => 
				response = xhr.responseText
				try
					response = JSON.parse(response) if isString(response)
				catch e

				options.error.call(this, this, response, xhr)
			#END error

			'complete': => 
				@loading(false)
				options.complete.call(this, this, arguments...)
			#END complete
		#END $.ajax

		return this
	#END sync

	#--------------------------------------------------------
	# Method: Falcon.Model#fetch()
	#	Calls the sync method with 'GET' as the default type
	#	server. Get's this model's server data.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	fetch: (options) -> 
		return @sync('GET', options)
	#END fetch

	#--------------------------------------------------------
	# Method: Falcon.Model#create()
	#	Calls the sync method with 'POST' as the default type
	#	server. Creates a new version of this model.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	create: (options) -> 
		return @sync('POST', options)
	#END create

	#--------------------------------------------------------
	# Method: Falcon.Model#save()
	#	Calls the sync method with 'PUT' as the default type
	#	server. Saves this model to the server.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	save: (options) -> 
		return @sync('PUT', options)
	#END save

	#--------------------------------------------------------
	# Method: Falcon.Model#destroy()
	#	Calls the sync method with 'DELETE' as the default type
	#	server.  Deletes this model from the server.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	destroy: (options) -> 
		return @sync('DELETE', options)
	#END destroy

	#--------------------------------------------------------
	# Method: Falcon.Model#map()
	#	Maps extra atributes and methods onto this model for use
	#	later, mostly in Falcon views. Will ensure that any method
	#	that is not a knockout observable will be called in the
	#	context of this model as well as pass this model in as
	#	the first argument, pushing the other arguments down the
	#	list.
	# 
	# Arguments:
	#	**mapping** _(Object)_ - The mapping to augment this model with
	#
	# Returns:
	#	_(Falcon.Model)_ - This model
	#--------------------------------------------------------
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
						this[key] = (args...) => 
							_value.call(this, this, args...) 
				else
					this[key] = value 

		return this
	#END map

	#--------------------------------------------------------
	# Method: Falcon.Model#clone()
	# 	Method used to deeply clone this model
	#
	# Arguments:
	#	**parent** _(Falcon.Model)_ - The parent of the clone. optional
	#
	# Returns:
	#	_Falcon.Model_ - A clone of this model
	#--------------------------------------------------------
	clone: (parent) ->
		parent = if parent is null or Falcon.isModel(parent) then parent else @parent
		return new this.constructor(this.unwrap(), parent )
	#END clone
#END Falcon.Model
