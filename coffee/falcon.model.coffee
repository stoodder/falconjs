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
	# Method: Falcon.Model()
	#	The constructor for a model
	#
	# Arguments:
	#	**models** _(Object)_ - An object of data to initialize this model with
	#	**parent** _(Falcon.Model)_ - The parent object of this collection
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

		@parent = parent
		@initialize.apply(this, arguments)
		@fill(data) unless isEmpty( data )

		return this
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
	initialize: (data) ->
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
		return thisundefined unless isString( attribute )
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
			return this
		#END if
		
		return this unless isString( attribute )
		
		if ko.isObservable( @[attribute] )
			@[attribute](value)
		else
			@[attribute] = value
		#END if

		return this
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
		return this
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
		return this
	#END decrement

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Model#parse()
	#	Parses the response data from an XHR request
	#
	# Arguments:
	#	**data** _(Object)_ - The xhr response data
	#	**options** _ - The options fed initially into the XHR request
	#	**xhr** _(Object)_ - The XHR object
	#
	# Returns:
	#	_(Object)_ - Parsing on a model expects an object to be returned
	#----------------------------------------------------------------------------------------------
	parse: (data, options, xhr) ->
		return data
	#END parse

	#--------------------------------------------------------
	# Method: Falcon.Model#fill()
	#	Method used to 'fill in' and add data to this model
	#
	# Arguments:
	#	**data** _(Object)_ - The data to fill
	#
	# Returns:
	#	_(Falcon.Model)_ - This instance
	#--------------------------------------------------------
	fill: (data) ->
		data = {'id': data} if isNumber(data) or isString(data)
		return this unless isObject(data)
		return this if isEmpty(data)

		rejectedAttributes = {}
		for attr, value of Falcon.Model.prototype when attr not in ["id", "url"]
			rejectedAttributes[attr] = true
		#END for

		#Fill in the attributes unless they're attempting to override
		#core functionality
		for attr, value of data when not rejectedAttributes[attr]
			value = ko.unwrap( value )
			
			if Falcon.isModel(this[attr])
				if Falcon.isModel( value )
					this[attr] = value
				else
					this[attr].fill(value)
				#END if
			
			else if Falcon.isCollection(this[attr])
				if Falcon.isCollection( value )
					this[attr] = value
				else
					this[attr].fill(value)
				#END if
			
			else if ko.isWriteableObservable(this[attr])
				this[attr](value)
			
			else
				this[attr] = value
			#END if
		#END for

		return this
	#END fill

	#--------------------------------------------------------
	# Method: Falcon.Model#unwrap()
	#	Method used to 'unwrap' this object into a raw object
	#	Needed to cascade inwards on other Falcon Data objects (like lists)
	#	to unwrap newly added member variables/objects
	#
	# Returns
	#	_(Object)_ - The 'unwrapped' object
	#--------------------------------------------------------
	unwrap: () ->
		unwrapped = {}

		for attr, value of this when ( attr is "id" or not ( attr of Falcon.Model.prototype ) )
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
	#	                      		none given, all attributes from this models 'attributes' 
	#	                      		member are serialized
	#
	# Returns:
	#	_(Object)_ - The resultant 'raw' object to send to the server
	#--------------------------------------------------------
	serialize: (attributes) ->
		serialized = {}

		unless attributes?
			attributes = ( attr for attr of this when ( attr is "id" or not ( attr of Falcon.Model.prototype ) ) )
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
			value = this[attr]

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
	# Method: Falcon.Model#makeURL()
	#	Generates a URL based on this model's url, the parent model of this model, 
	#	the type of request we're making and Falcon's defined baseApiUrl
	#
	# Arguments:
	#	**type** _(String)_ - The type of request we're making (GET, POST, PUT, DELETE)
	#	**parent** _(Falcon.Model)_ - Optional override of the model's parent to generate 
	#								  the url with. If parent is 'null' then this model will 
	#								  act as the root node.
	#	**id** _(String|Number) - Optional override for the model's id
	#
	# Returns:
	#	_(String)_ - The generated URL
	#--------------------------------------------------------
	makeUrl: (type, parent, id) ->
		#Ensure the inputs are set up correctly
		[parent, id] = [id, parent] if id is undefined and (isString( parent ) or isNumber( parent ))

		{base_url, url_piece, id_piece, extension} = Falcon.adapter.makeUrlPieces( @, type, {parent, id}, @ )

		#Generate the url
		return "#{base_url}#{url_piece}#{id_piece}#{extension}"
	#END makeUrl

	#--------------------------------------------------------
	# Method: Falcon.Model#validate()
	#	Method used to validate this model before it is sent
	#	to the server on create or save.  If this method returns
	#	true, saving will continue but if it returns false then
	#	saving is halted
	#
	# Arguments:
	#	**options** _(Object)_ - The options passed into the sync method
	#
	# Returns:
	#	_(Boolean)_ - Is this model valid?
	#--------------------------------------------------------
	validate: (options) ->
		return true
	#END validate

	#--------------------------------------------------------
	# Method: Falcon.Model#sync()
	#	Used to dynamically place calls to the server in order
	#	to create, update, destroy, or read this from/to the
	#	server
	#
	# Arguments:
	#	**type** _(String)_ - The HTTP Method to call to the server with
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	sync: (type, options, context) ->
		return Falcon.adapter.sync( @, type, options, context )
	#END sync

	#--------------------------------------------------------
	# Method: Falcon.Model#fetch()
	#	Calls the sync method with 'GET' as the default type
	#	server. Get's this model's server data.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	fetch: (options, context) -> 
		return @sync('GET', options, context)
	#END fetch

	#--------------------------------------------------------
	# Method: Falcon.Model#create()
	#	Calls the sync method with 'POST' as the default type
	#	server. Creates a new version of this model.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	create: (options, context) -> 
		return @sync('POST', options, context)
	#END create

	#--------------------------------------------------------
	# Method: Falcon.Model#save()
	#	Calls the sync method with 'PUT' as the default type
	#	server. Saves this model to the server.  If the model
	#	is new then create() will be called instead
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	save: (options, context) -> 
		return ( if @isNew() then @create(options, context) else @sync('PUT', options, context) )
	#END save

	#--------------------------------------------------------
	# Method: Falcon.Model#destroy()
	#	Calls the sync method with 'DELETE' as the default type
	#	server.  Deletes this model from the server.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	destroy: (options, context) -> 
		return @sync('DELETE', options, context)
	#END destroy

	#--------------------------------------------------------
	# Method: Falcon.Model#equals()
	#	Determines if this model is equivalent to the input value
	#
	# Arguments 1:
	#	**model** _(Falcon.Model)_ - Is this model the same as the one given, based on id
	#
	# Arguments 2:
	#	**id** _(Number)_ - Treated as an id, checked against this id
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
	#
	# TODO:
	#	Have observables check for 'extends' method
	#--------------------------------------------------------
	mixin: (mapping) ->
		mapping = {} unless isObject(mapping)

		for key, value of mapping
			if Falcon.isDataObject( this[key] )
				this[key].mixin(value)
			else
				if ko.isObservable(value)
					unless ko.isObservable( this[key] )
						this[key] = ko.observable( @get(key) ? ko.unwrap(value) )
					#END unless
				else if isFunction(value)
					this[key] = bindFunction(value, this)
				else
					this[key] ?= value 
				#END if
			#END if
		#END for

		return this
	#END mixin

	#--------------------------------------------------------
	# Method: Falcon.Model#clone()
	#	Method used to clone this model
	#
	# Arguments:
	#	**attributes** _(Array)_ - A list of attributes to copy.
	#	**parent** _(Object)_ - The parent to set on the new model, use 
	#							'null' to unset the parent.
	#
	# Returns:
	#	_(Falcon.Model)_ - A clone of this model
	#--------------------------------------------------------
	clone: (attributes, parent) ->
		[ attributes, parent ] = [ undefined, attributes ] if attributes is null or Falcon.isModel( attributes )
		parent = @parent unless parent is null or Falcon.isModel( parent )
		return new @constructor( @serialize( attributes ), parent )
	#END copy

	#--------------------------------------------------------
	# Method: Falcon.Model#isNew()
	#	Method used to check if this model is new or is from the server.  Based on id.
	#
	# Returns:
	#	_(Boolean)_ - Is this a new model?
	#--------------------------------------------------------
	isNew: ->
		return ( not @get("id")? )
	#END isNew
#END Falcon.Model