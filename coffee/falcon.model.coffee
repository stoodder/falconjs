#==============================================================================================
#
# Class: Falcon.Model
#
#==============================================================================================
class FalconModel extends FalconObject
	#--------------------------------------------------------
	# Method: Falcon.Model.extend()
	#	Inherit the global extend method
	#--------------------------------------------------------
	@extend = FalconObject.extend

	#--------------------------------------------------------
	# Member: Falcon.Model#id
	#	This is the serve's id of @ model.  This value will be converted
	#	to an observable (keeping the same value) once @ model is 
	#	instantiated.
	#--------------------------------------------------------
	id: null

	#--------------------------------------------------------
	# Member: Falcon.Model#endpoint
	#	This model's endpoint. Used by the adapter when generating URLs
	#--------------------------------------------------------
	endpoint: null

	#--------------------------------------------------------
	# Member: Falcon.Model#parent
	#	This represents the 'parent' object that holds @
	#	model.  Generally @ is used for determining the URL
	#	structure of rest objects in the makeURL() routine.
	#	This should also be a Model.
	#
	# Type: Falcon.Model
	#--------------------------------------------------------
	parent: null

	#--------------------------------------------------------
	# Member: Falcon.Model#__falcon_model__is_null__
	#	Status variable that checks if the last value passed in to
	#	the fill method was 'null'
	#
	# Type: Falcon.Model
	#--------------------------------------------------------
	__falcon_model__is_null__: false

	#--------------------------------------------------------
	# Method: Falcon.Model()
	#	The constructor for a model
	#
	# Arguments:
	#	**models** _(Object)_ - An object of data to initialize @ model with
	#	**parent** _(Falcon.Model)_ - The parent object of @ collection
	#--------------------------------------------------------
	constructor: (data, parent) ->
		super(arguments...)
		
		data = ko.unwrap( data )
		parent = ko.unwrap( parent )

		[parent, data] = [data, parent] if parent? and not Falcon.isModel( parent ) and Falcon.isModel( data )
		[parent, data] = [data, parent] if not parent? and Falcon.isModel( data )

		unless (not parent?) or Falcon.isModel( parent )
			throw new Error("parent must be null or a Falcon.Model")
		#END unless

		@__falcon_model__is_null__ = ko.observable(false)
		@parent = parent
		@initialize.apply(@, arguments)
		@fill(data) unless isEmpty( data )

		return @
	#END constructor

	#--------------------------------------------------------
	# Method: Falcon.Model#initialize()
	#	The psuedo-constructor of the model.  Useful for ensuring that
	#	the base constructor is called (in the correct spot) without 
	#	having to explicitly call the native Model constructor
	#
	# Arguments:
	#	**data** _(Object)_ - The initial data to load in
	#--------------------------------------------------------
	initialize: ( (data) -> )
	#END initialize

	#--------------------------------------------------------
	# Method: Falcon.Model#get()
	#	Gets am observable-less value for a specific attribute
	#
	# Arguments:
	#	**attribute** _(string)_ - The attribute to look up
	#
	# Returns:
	#	_(mixed)_ - The unwrapped value at the specific attribute
	#--------------------------------------------------------
	get: (attribute) ->
		return undefined unless isString( attribute )
		return ko.unwrap( @[attribute] )
	#END get

	#--------------------------------------------------------
	# Method: Falcon.Model#set()
	#	Sets a value for the specific attribute, creating one if it does nto exist
	#
	# Arguments:
	#	**attribute** _(string)_ - The attribute to look up
	#	**value** -(mixed)_ - The value to assign
	#
	# Arguments:
	#	**attribute** _(Object)_ - An object of values to set
	#
	# Returns:
	#	_(Falcon.Model)_ - This Model
	#--------------------------------------------------------
	set: (attribute, value) ->
		if isObject( attribute )
			@set(k, v) for k, v of attribute
			return @
		#END if
		
		return @ unless isString( attribute )
		
		if ko.isObservable( @[attribute] )
			@[attribute](value)
		else
			@[attribute] = value
		#END if

		return @
	#END set

	#--------------------------------------------------------
	# Method: Falcon.Model#toggle()
	#	Toggles the value between true/false on the specific attribute
	#
	# Arguments:
	#	**attribute** _(string)_ - The attribute to look up
	#
	# Returns:
	#	_(mixed)_ - The unwrapped value at the specific attribute
	#--------------------------------------------------------
	toggle: (attribute) ->
		return @set(attribute, not @get(attribute) )
	#END toggle

	#--------------------------------------------------------
	# Method: Falcon.Model#increment()
	#	Increments a specific attribute as if it were a number
	#
	# Arguments:
	#	**attribute** _(string)_ - The attribute to increment
	#
	# Returns:
	#	_(Falcon.Model)_ - This Model
	#--------------------------------------------------------
	increment: (attribute) ->
		@set(attribute, @get(attribute)+1 )
		return @
	#END increment

	#--------------------------------------------------------
	# Method: Falcon.Model#decrement()
	#	Decrements a specific attribute as if it were a number
	#
	# Arguments:
	#	**attribute** _(string)_ - The attribute to decrement
	#
	# Returns:
	#	_(Falcon.Model)_ - This Model
	#--------------------------------------------------------
	decrement: (attribute) ->
		@set(attribute, @get(attribute)-1 )
		return @
	#END decrement

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Model#serializeRequestData()
	#	Transforms serialized data in to request data for the adapter
	#
	# Arguments:
	#	**request_type** _(String)_ - The type of request being performed
	#	**request_options** _(Object)_ - The requst options fed in to the adapter
	#
	# Returns:
	#	_(Object)_ - The request data
	#----------------------------------------------------------------------------------------------
	serializeRequestData: (request_type, request_options) ->
		return @serialize( request_options.attributes )
	#END serializeRequestData

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Model#parseResponseData()
	#	Parses the response data from an XHR request
	#
	# Arguments:
	#	**response_data** _(Object)_ - The adapter response data
	#	**request_type** _(String)_ - The type of request being performed
	#	**request_options** _(Object)_ - The requst options fed in to the adapter
	#
	# Returns:
	#	_(Object)_ - Parsing on a model expects an object to be returned
	#----------------------------------------------------------------------------------------------
	parseResponseData: (response_data, request_type, request_options) ->
		return response_data
	#END parseResponseData

	#--------------------------------------------------------
	# Method: Falcon.Model#fill()
	#	Method used to 'fill in' and add data to @ model
	#
	# Arguments:
	#	**data** _(Object)_ - The data to fill
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	fill: (data) ->
		@__falcon_model__is_null__( data is null )
		data = {'id': data} if isNumber(data) or isString(data)
		return @ unless isObject(data)
		return @ if isEmpty(data)

		rejectedAttributes = {}
		for attr, value of Falcon.Model.prototype when attr not in ["id", "endpoint"]
			rejectedAttributes[attr] = true
		#END for

		#Fill in the attributes unless they're attempting to override
		#core functionality
		for attr, value of data when not rejectedAttributes[attr]
			value = ko.unwrap( value )
			
			if Falcon.isModel(@[attr])
				if Falcon.isModel( value )
					@[attr] = value
				else
					@[attr].fill(value)
				#END if
			
			else if Falcon.isCollection(@[attr])
				if Falcon.isCollection( value )
					@[attr] = value
				else
					@[attr].fill(value)
				#END if
			
			else if ko.isWriteableObservable(@[attr])
				@[attr](value)
			
			else unless isFunction(@[attr])
				@[attr] = value
			else if attr is 'endpoint'
				@[attr] = value
			#END if
		#END for

		return @
	#END fill

	#--------------------------------------------------------
	# Method: Falcon.Model#unwrap()
	#	Method used to 'unwrap' @ object into a raw object
	#	Needed to cascade inwards on other Falcon Data objects (like lists)
	#	to unwrap newly added member variables/objects
	#
	# Returns
	#	_(Object)_ - The 'unwrapped' object
	#--------------------------------------------------------
	unwrap: () ->
		unwrapped = {}

		for attr, value of @ when ( attr is "id" or not ( attr of Falcon.Model.prototype ) )
			unwrapped[attr] = if Falcon.isDataObject(value) then value.unwrap() else value
		#END for

		return unwrapped
	#END unwrap

	#--------------------------------------------------------
	# Method: Falon.Model#serialize()
	#	Serializes the data into a raw json object and only corresponds to the attributes
	#	that are primitive and that we wish to be able to send back to the server
	#
	# Arguments:
	#	**attributes** _(Array)_ -	The attributes that should be included in the 
	#	                      		serialization "id" is always included. If 
	#	                      		none given, all attributes from @ models 'attributes' 
	#	                      		member are serialized
	#
	# Returns:
	#	_(Object)_ - The resultant 'raw' object to send to the server
	#--------------------------------------------------------
	serialize: (attributes) ->
		serialized = {}

		unless attributes?
			attributes = ( attr for attr of @ when ( attr is "id" or not ( attr of Falcon.Model.prototype ) ) )
		else if isString( attributes )
			attributes = trim(attributes).split(",")
		#END unless

		if isArray( attributes )
			new_attributes = {}
			new_attributes[attr] = null for attr in attributes
			attributes = new_attributes
		#END if
		
		return serialized unless isObject( attributes )

		for attr, sub_attributes of attributes
			value = @[attr]

			if Falcon.isDataObject(value)
				serialized[attr] = value.serialize(sub_attributes)
			else if ko.isObservable(value)
				serialized[attr] = ko.unwrap( value )
			else if not isFunction(value)
				serialized[attr] = value
			#END if
		#END for

		return serialized
	#END serialize
		
	#--------------------------------------------------------
	# Method: Falcon.Model#makeUrl()
	#	Generates a URL based on @ model's endpoint, the parent model of @ model, 
	#	the type of request we're making and Falcon's defined baseApiUrl
	#
	# Arguments:
	#	**type** _(String)_ - The type of request we're making (GET, POST, PUT, DELETE)
	#	**parent** _(Falcon.Model)_ - Optional override of the model's parent to generate 
	#								  the url with. If parent is 'null' then @ model will 
	#								  act as the root node.
	#	**id** _(String|Number) - Optional override for the model's id
	#
	# Returns:
	#	_(String)_ - The generated URL
	#--------------------------------------------------------
	makeUrl: (type, parent, id) ->
		#Ensure the inputs are set up correctly
		[parent, id] = [id, parent] if id is undefined and (isString( parent ) or isNumber( parent ))
		return Falcon.dataAdapter.makeUrl( @, type, {parent, id}, @ )
	#END makeUrl

	#--------------------------------------------------------
	# Method: Falcon.Model#validate()
	#	Method used to validate @ model before it is sent
	#	to the server on create or save.  If @ method returns
	#	true, saving will continue but if it returns false then
	#	saving is halted
	#
	# Arguments:
	#	**options** _(Object)_ - The options passed into the sync method
	#
	# Returns:
	#	_(Boolean)_ - Is @ model valid?
	#--------------------------------------------------------
	validate: (options) -> true

	#--------------------------------------------------------
	# Method: Falcon.Model#sync()
	#	Used to dynamically place calls to the server in order
	#	to create, update, destroy, or read @ from/to the
	#	server
	#
	# Arguments:
	#	**type** _(String)_ - The HTTP Method to call to the server with
	#	**options** _(Object)_ - Optional object of settings to use on @ call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	sync: (type, options, context) -> Falcon.dataAdapter.sync( @, type, options, context )

	#--------------------------------------------------------
	# Method: Falcon.Model#fetch()
	#	Calls the sync method with 'GET' as the default type
	#	server. Get's @ model's server data.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on @ call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	fetch: (options, context) -> @sync(Falcon.GET, options, context)

	#--------------------------------------------------------
	# Method: Falcon.Model#create()
	#	Calls the sync method with 'POST' as the default type
	#	server. Creates a new version of @ model.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on @ call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	create: (options, context) -> @sync(Falcon.POST, options, context)

	#--------------------------------------------------------
	# Method: Falcon.Model#save()
	#	Calls the sync method with 'PUT' as the default type
	#	server. Saves @ model to the server.  If the model
	#	is new then create() will be called instead
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on @ call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	save: (options, context) -> 
		if @isNew()
			return @create(options, context)
		else
			return @sync(Falcon.PUT, options, context)
		#END if
	#END save

	#--------------------------------------------------------
	# Method: Falcon.Model#destroy()
	#	Calls the sync method with 'DELETE' as the default type
	#	server.  Deletes @ model from the server.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on @ call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	destroy: (options, context) -> @sync(Falcon.DELETE, options, context)

	#--------------------------------------------------------
	# Method: Falcon.Model#equals()
	#	Determines if @ model is equivalent to the input value
	#
	# Arguments 1:
	#	**model** _(Falcon.Model)_ - Is @ model the same as the one given, based on id
	#
	# Arguments 2:
	#	**id** _(Number)_ - Treated as an id, checked against @ id
	#
	# Returns:
	#	_(Boolean)_ - Are these equal?
	#--------------------------------------------------------
	equals: (model) ->
		model = ko.unwrap( model )

		if Falcon.isModel( model )
			id = @get("id")
			other_id = model.get("id")
			return model.get("id") is @get("id") if id? and other_id?
			return model is @
		else if isNumber( model ) or isString( model )
			return model is @get("id")
		#END if

		return false
	#END equals


	#--------------------------------------------------------
	# Method: Falcon.Model#mixin()
	#	Maps extra atributes and methods onto @ model for use
	#	later, mostly in Falcon views. Will ensure that any method
	#	that is not a knockout observable will be called in the
	#	context of @ model as well as pass @ model in as
	#	the first argument, pushing the other arguments down the
	#	list.
	# 
	# Arguments:
	#	**mapping** _(Object)_ - The mapping to augment @ model with
	#
	# Returns:
	#	_(Falcon.Model)_ - This model
	#
	# TODO:
	#	Have observables check for 'extends' method
	#--------------------------------------------------------
	mixin: (mapping) ->
		mapping = {} unless isObject(mapping)

		for key, value of mapping
			if Falcon.isDataObject( @[key] )
				@[key].mixin(value)
			else
				if ko.isObservable(value)
					unless ko.isObservable( @[key] )
						@[key] = ko.observable( @get(key) ? ko.unwrap(value) )
					#END unless
				else if isFunction(value)
					@[key] = bindFunction(value, @)
				else
					@[key] ?= value 
				#END if
			#END if
		#END for

		return @
	#END mixin

	#--------------------------------------------------------
	# Method: Falcon.Model#clone()
	#	Method used to clone @ model
	#
	# Arguments:
	#	**attributes** _(Array)_ - A list of attributes to copy.
	#	**parent** _(Object)_ - The parent to set on the new model, use 
	#							'null' to unset the parent.
	#
	# Returns:
	#	_(Falcon.Model)_ - A clone of @ model
	#--------------------------------------------------------
	clone: (attributes, parent) ->
		[ attributes, parent ] = [ undefined, attributes ] if attributes is null or Falcon.isModel( attributes )
		parent = @parent unless parent is null or Falcon.isModel( parent )
		return new @constructor( @serialize( attributes ), parent )
	#END copy

	#--------------------------------------------------------
	# Method: Falcon.Model#isNew()
	#	Method used to check if @ model is new or is from the server.  Based on id.
	#
	# Returns:
	#	_(Boolean)_ - Is @ a new model?
	#--------------------------------------------------------
	isNew: -> not @get("id")?

	#--------------------------------------------------------
	# Method: Falcon.Model#isNull()
	#	Checks to see if the last value passed in to the 'fill'
	#	method was 'null'. This is useful to know when the server
	#	returns 'null' in the response data
	#
	# Returns:
	#	_(Boolean)_ - Is @ currently a null model?
	#--------------------------------------------------------
	isNull: -> @__falcon_model__is_null__()
#END Falcon.Model