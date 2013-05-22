#==============================================================================================
#
# Class: Falcon.Collection
#
#==============================================================================================
class Falcon.Collection extends Falcon.Class
	#----------------------------------------------------------------------------------------------
	# 
	#----------------------------------------------------------------------------------------------
	_mappings: null

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	@extend = (definition) -> Falcon.Class.extend(Falcon.Collection, definition)

	#----------------------------------------------------------------------------------------------
	# Member: Falcon.Collection#models
	#	The internal observable array of models
	#
	# Type: _(ko.observableArray)_
	#----------------------------------------------------------------------------------------------
	models: null

	#----------------------------------------------------------------------------------------------
	# Member: Falcon.Collection#model
	#	The prototype of the model of each item in this collection
	#
	# Type: _(Falcon.Model)_
	#----------------------------------------------------------------------------------------------
	model: null

	#----------------------------------------------------------------------------------------------
	# Member: Falcon.Collection#__falcon_collection__change_count__
	#	Private variable that tracks the change counts of this collection, used to
	#	make sure we don't re-render elements when not necessary
	#
	# Type: _(Number)_
	#----------------------------------------------------------------------------------------------
	__falcon_collection__change_count__: 0

	#----------------------------------------------------------------------------------------------
	# Member: Falcon.Collection#url
	#	This is the top level url for the collection.
	#
	# Type: _(String)_
	#----------------------------------------------------------------------------------------------
	url: null

	#----------------------------------------------------------------------------------------------
	# Member: Falcon.Collection#length
	#	The number of elements in this collection.  Will be 
	#	converted into an observable on construction
	#
	# Type: _(Number)_
	#----------------------------------------------------------------------------------------------
	length: 0

	#----------------------------------------------------------------------------------------------
	# Member: Falcon.Collection#parent
	#	This represents the 'parent' object that holds these
	#	models.  Generally this is used for determining the URL
	#	structure of rest objects in the makeURL() routine.
	#	This should also be a Model.
	#
	# Type: _(Falcon.Model)_
	#----------------------------------------------------------------------------------------------
	parent: null

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	constructor: (models, parent) ->
		super()
		
		models = ko.utils.unwrapObservable(models)
		parent = ko.utils.unwrapObservable(parent)

		[parent, models] = [models, parent] if not parent? and Falcon.isModel( models )
		[parent, models] = [models, parent] if Falcon.isModel( models ) and isArray( parent )

		@url ?= @model::url if @model?
		@length = ko.observable(0)
		@parent = parent

		@_mappings = []
		@reset()
		@fill(models) unless isEmpty( models )
		@initialize(models)
	#END constructor

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	initialize: (->)

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#parse()
	#	parses the response data from an XHR request
	#
	# Arguments:
	#	**data** _(Object)_ - The xhr response data
	#	**options** _ - The options fed initiallyinto the XHR request
	#	**xhr** _(Object)_ - The XHR object
	#
	# Returns:
	#	_Array_ - Parsing on a collection expects an array to be returned
	#----------------------------------------------------------------------------------------------
	parse: (data, options, xhr) ->
		return data
	#END parse

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#fill()
	#	'fills' this collection with new data
	#
	# Arguments:
	#	**items** _(Array)_ - An array of items to fill this collection with
	#	**options** _(Object)_ - An object of options for the fill method
	#
	# Returns:
	#	_Falcon.Collection_ - This instance
	#----------------------------------------------------------------------------------------------
	fill: (items, options) ->
		return this unless @model?

		items ?= []
		items = items.models() if Falcon.isCollection(items)
		items = ko.utils.unwrapObservable(items) if ko.isObservable(items)
		items = [items] unless isArray(items)
		models = []
		
		options = {} unless isObject(options)


		{method} = options
		method = '' unless isString(method)
		method = method.toLowerCase()
		method = 'replace' unless method in ['replace', 'append', 'prepend', 'merge']

		return [] if method isnt 'replace' and isEmpty( items ) 

		#Increment the change count
		@__falcon_collection__change_count__++

		# Make sure that each of the elements passed in are a model that this 
		for m, i in items
			if Falcon.isModel( m )
				#If this is the correct type of model, go ahead, otherwise 
				#serialize the model and re-create as an applicable model
				if m instanceof @model
					models[i] = items[i]
					models[i].parent = @parent if @parent?
				else
					models[i] = new @model(m.serialize(), @parent)
				#END if
			else
				models[i] = new @model(m, @parent)
			#END if

			#Add the mixins
			models[i].mixin(mapping) for mapping in @_mappings
		#END for
		
		#Determine how we should proceed adding models to the models
		if method is 'replace'
			@models(models)

		#merging the models adds new models and updates existing models
		else if method is 'merge'
			_models = @models()

			#iterate over the new collection
			for model in models
				#Create the iterator and initialze the model
				iterator = _makeIterator( model )
				_model = null #The existing model in this collection

				#Try to find this model in this collection
				for m in _models when iterator( m )
					_model = m
					break
				#END for
				
				if _model then _model.fill( model ) else @models.push( model )
			#END for

		#Add the models to the beginning of the list
		else if method is 'prepend'
			_length = models.length-1
			@models.unshift( models[_length-i] ) for model, i in models

		#Add the models to the bottom of the list
		else if method is 'append'
			@models.push( model ) for model in models
		#END if

		#Update the length
		@length( @models().length )

		return models
	#END fill

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#unwrap()
	#	Method used to 'unwrap' this object into an anonymous object
	#	Needed to cascade inwards on other Falcon Data objects (like models)
	#	to unwrap newly added member variables/objects
	#
	# Returns:
	#	_Array_ - The 'unwrapped' array
	#----------------------------------------------------------------------------------------------
	unwrap: () ->
		raw = []
		for i, value of @models()
			raw[i] = if Falcon.isDataObject(value) then value.unwrap() else value
		return raw
	#END unwrap

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#serialize()
	#	Serializes this collection and returns the raw array
	#	of data
	#
	# Arguments:
	#	**attributes** _(Array)_ -	The attributes that should be included in the 
	#	                      	serialization "id" is always included. If 
	#	                      	none given, all attributes from this models 'attributes' 
	#	                      	member are serialized
	#
	# Returns:
	#	_Array_ - an array of the serialized raw data to send to the server
	#----------------------------------------------------------------------------------------------
	serialize: (attributes) ->
		serialized = []
		for i, value of @models()
			serialized[i] = if Falcon.isDataObject(value) then value.serialize(attributes) else value
		#END for
		return serialized
	#END serialize

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#makeUrl
	#	Attempts to generate a URL for this collection based on its parent
	#	and the url that is defined
	#
	# TODO: Add Patch handling
	#----------------------------------------------------------------------------------------------
	makeUrl: (type) ->
		url = if isFunction(@url) then @url() else @url
		url = "" unless isString(url)
		url = trim(url)

		type = "" unless isString(type)
		type = type.toUpperCase()
		type = 'GET' unless type in ['GET', 'PUT', 'POST', 'DELETE']

		#Make sure the url is now formatted correctly
		url = "/#{url}" unless startsWith(url, "/")

		#Check if a parent model is present
		if Falcon.isModel(@parent)
			parentUrl = @parent.makeUrl()
			parentPeriodIndex = parentUrl.lastIndexOf(".")
			parentSlashIndex = parentUrl.lastIndexOf("/")

			if parentSlashIndex < parentPeriodIndex
				parentUrl = parentUrl.slice(0, parentPeriodIndex) if parentPeriodIndex > -1
				parentUrl = trim(parentUrl)
			#END if

			url = "#{parentUrl}#{url}"

		#Otherwise consider this the base
		else if isString(Falcon.baseApiUrl)
			url = "#{Falcon.baseApiUrl}#{url}"

		#END if

		#Replace any double slashes outside of the initial protocol
		url = url.replace(/([^:])\/\/+/gi, "$1/")

		#Return the built url
		return url
	#END makeUrl

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	sync: (type, options) ->
		options = {complete: options} if isFunction(options)
		options = {attributes: trim( options ).split(",")} if isString(options)
		options = {attributes: options} if isArray( options )

		options = {} unless isObject(options)
		options.data = {} unless isObject(options.data)
		options.dataType = "json" unless isString(options.dataType)
		options.contentType = "application/json" unless isString(options.contentType)
		options.success = (->) unless isFunction(options.success)
		options.complete = (->) unless isFunction(options.complete)
		options.error = (->) unless isFunction(options.error)
		options.attributes = null unless options.attributes?
		options.params = {} unless isObject( options.params )
		options.fill = true unless isBoolean( options.fill )
		options.headers = {} unless isObject( options.headers )

		type = trim( if isString(type) then type.toUpperCase() else "GET" )
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]

		data = {}
		unless isEmpty(options.data)
			data[key] = value for key, value of options.data
		#END unless

		#serialize the data to json
		json = if isEmpty(data) then "" else JSON.stringify(data)

		url = options.url ? trim(@makeUrl(type))

		unless isEmpty( options.params )
			url += "?" unless url.indexOf("?") > -1
			url += ( "#{key}=#{value}" for key, value of options.params ).join("&")
		#END if params

		return $.ajax
			'url': url
			'type': type
			'data': json
			'dataType': options.dataType
			'contentType': options.contentType
			'cache': Falcon.cache
			'headers': options.headers

			'success': (data, status, xhr) =>
				data = JSON.parse( data ) if isString(data)
				data = JSON.parse( xhr.responseText ) if not data? and isString( xhr.responseText )
				data ?= []

				data = @parse( data, options, xhr )
				
				if type is "GET"
					@fill(data, options) if options.fill
					@trigger("fetch", data)
				#END if

				options.success.call(this, this, data, status, xhr)
			#END success

			'error': (xhr) => 
				response = xhr.responseText
				try
					response = JSON.parse(response) if isString(response)
				catch e

				options.error.call(this, this, response, xhr)
			#END error

			'complete': (xhr, status) =>
				options.complete.call(this, this, xhr, status)
			#END complete
		#END $.ajax
	#END sync

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	fetch: (options) -> 
		return @sync('GET', options)
	#END fetch

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#remove
	#	Used to simplu remove elements from the current collection
	#	Does not actually delete the data from the server
	#
	# Arguments:
	#	**items** _(Array)_ - An array (or an item) to remove from the models
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#----------------------------------------------------------------------------------------------
	remove: (items) ->
		items = ko.utils.unwrapObservable( items )
		items = items.models() if Falcon.isCollection( items )
		@__falcon_collection__change_count__++

		removedItems = if isArray(items) then @models.removeAll(items) else @models.remove(items)

		unless isEmpty(removedItems)
			@length( @models().length )
		#END unless

		return this
	#END remove

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection@append
	#	Appends an items or a list of items to the end of the collection
	#
	# Arguments:
	#	**item** _(Falcon.Model)_ - The model(s) to add
	#	
	#----------------------------------------------------------------------------------------------
	append: (items) -> @fill(items, {'method': 'append'})

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	prepend: (items) -> @fill(items, {'method': 'prepend'})

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#unshift
	#	Push an element onto the begining of the array, Alias of prepend
	#
	# Arguments:
	#	**item** _(Falcon.Model)_ - The model to add
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#
	# See Also:
	#	Falcon.Colletion#prepend
	#----------------------------------------------------------------------------------------------
	unshift: ->
		@prepend(arguments...)
	#END pop

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#shift
	#	Shifts the first element from the models and returns it
	#----------------------------------------------------------------------------------------------
	shift: ->
		item = @models.shift()
		@length( @models().length )
		return item
	#END pop

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#push
	#	Push an element onto the end of the array, Alias of append
	#
	# Arguments:
	#	**item** _(Falcon.Model)_ - The model to add
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#
	# See Also:
	#	Falcon.Colletion#append
	#----------------------------------------------------------------------------------------------
	push: ->
		@append(arguments...)
	#END pop

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#pop
	#	Pops the last element from the models and returns it
	#----------------------------------------------------------------------------------------------
	pop: ->
		item = @models.pop()
		@length( @models().length )
		return item
	#END pop

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#sort
	#	Sorts the collection by a given sorter
	#
	# Arguments:
	#	**sorter** _(Function)_ - An iterator to sort the array with
	#
	# Returns:
	#	_(Array)_ - The sorted array
	#----------------------------------------------------------------------------------------------
	sort: (sorter) ->
		return models unless isFunction( sorter )
		return @models.sort( sorter )
	#END sort

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#create
	#	Creates a new model and adds it to the list of existing models, 
	#	also sends off a corresponding ajax request
	#
	# Arguments:
	#	**data** _(Object)_ - The model data to create
	#	**options** _(Object)_ - optional options for the ajax request
	#
	# Returns:
	#	_(XmlHttpRequest)_ - The XHR object that corresponds to this create instance
	#----------------------------------------------------------------------------------------------
	create: (data, options) ->
		return unless @model?
		
		data = data.unwrap() if Falcon.isModel(data)
		data = {} unless isObject(data)
		
		options = {success:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)
		options.method = 'append' unless isString(options.method)

		_success = options.success
		options.success = (model) =>
			models = @fill(model, options)
			_success.apply(models[0] ? model, arguments)
		#END success

		return ( new @model(data, @parent).create(options) )
	#END create

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#destroy
	#	Mehtod used to remove a single model from the server and then removes all instances of the
	#	model from this collection
	#
	# Arguments:
	#	**model** _(Falcon.Model)_ - An array of the models to remove, if this is not an array, 
	#						   it will be placed in one as the only object, if the models 
	#						   is a collection, we will destroy all of the models in the collection.
	#						   When no argument is given for models (or the argument is the 
	#						   string 'all'), we'll destroy everything.
	#
	#	**options** _(Object)_ - An optional object of the settings to call when onto each 
	#							 of the destroy methods of the 
	#
	# Returns:
	#	_(XmlHttpRequest)_ - The XHR object that corresponds to this destroy instance
	#----------------------------------------------------------------------------------------------
	destroy: (model, options) ->
		return unless @model?

		model = @first( ko.utils.unwrapObservable( model ) )

		return unless Falcon.isModel( model )

		options = {success:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)
		options.parent = @parent

		_success = options.success
		options.success = (model) =>
			@remove(model)
			_success.apply(model, arguments)
		#END success

		return model.destroy(options)
	#END destroy

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#at
	#	Gets a the value at the specified index
	#
	# Arguments:
	#	**index** _(Number)_ - The index to retrieve the value from
	#
	# Returns:
	#	_(Falcon.Model)_ - The model at that index
	#----------------------------------------------------------------------------------------------
	at: (index) ->
		index = parseInt( index )
		return null if isNaN(index)

		models = @models()
		return null if index < 0 or index >= models.length
		return models[index]
	#END at

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#each
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to loop over each value, if one argument is provided 
	#								the input argument will be each item, if two are provided that input 
	#								parameters will be index, item.
	#
	#	**context** _(mixed)_ - The context to bind the iterator against, if none is provided it defaults
	#							to this collection.
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#----------------------------------------------------------------------------------------------
	each: (iterator, context) ->
		return this unless isFunction( iterator )

		context ?= this

		if iterator.length is 1
			iterator.call(context, item) for item in @models()
		else
			iterator.call(context, index, item ) for item, index in @models()
		#END if

		return this
	#END each

	#----------------------------------------------------------------------------------------------
	# Method: _makeIterator
	#	Private method used to consistently generate iterators for 
	#	the following search functions.  This won't guarentee an
	#	iterator method, it just tries to provide default handling
	#	for certain types of input values
	#----------------------------------------------------------------------------------------------
	_makeIterator = (iterator) ->
		if Falcon.isModel( iterator )
			_model = iterator
			return (item) ->
				return false unless Falcon.isModel(item)
				id = item.get('id')
				model_id = _model.get('id')
				return ( id is model_id )
			#END iterator assignment
		#END if

		if isNumber(iterator) or isString(iterator)
			_id = iterator
			return (model) -> 
				return false unless Falcon.isModel(model)
				model.get("id") is _id
			#END iterator
		#END if

		return iterator
	#END _makeIterator


	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#first
	#	Retrieves the first model from the collection based on the iterator. 
	#	If no iterator is present, the first model is returned.  
	#	If no values match or exist, then null is returned
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Falcon.Model)_ - The model that was found 
	#----------------------------------------------------------------------------------------------
	first: (iterator) ->
		iterator = _makeIterator( iterator )
		iterator = ( -> true ) unless isFunction(iterator)

		for item in @models()
			return item if iterator( item )
		#END for

		return null
	#END first

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#last
	#	Retrieves the last model from the collection based on the iterator. 
	#	If no iterator is present, the last model is returned.  
	#	If no values match or exist, then null is returned
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Falcon.Model)_ - The model that was found
	#----------------------------------------------------------------------------------------------
	last: (iterator) ->
		iterator = _makeIterator( iterator )
		iterator = ( -> true ) unless isFunction(iterator)

		models = @models()
		length = models.length
		for item, index in models
			item = models[length - index - 1]
			return item if iterator( item )
		#END for

		return null
	#END last

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#all
	#	Gets a models of all items that match the iterator.
	#	If no iterator is present, all of the models are returned
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Array)_ - An array of all the matched items
	#----------------------------------------------------------------------------------------------
	all: (iterator) ->
		iterator = _makeIterator( iterator )
		return @models() unless isFunction(iterator)
		return ( item for item in @models() when iterator(item) )
	#END first

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#any
	#	Checks to see if any of the values match the iterator in this models
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Boolean)_ - Did the iterator return true once?
	#----------------------------------------------------------------------------------------------
	any: (iterator) ->
		iterator = _makeIterator( iterator )

		return false unless isFunction(iterator)

		for item in @models()
			return true if iterator( item )
		#END for

		return false
	#END any

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#without
	#	Returns an array of elements that don't match the iterator
	#----------------------------------------------------------------------------------------------
	without: (iterator) ->
		iterator = _makeIterator( iterator )
		return @models() unless isFunction(iterator)
		return ( item for item in @models() when not iterator( item ) )
	#END without

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#pluck
	#	Method used to pluck a list of attributes from each model in the collection.
	#
	# Arguments:
	#	**attribute** _(String)_ - The attribute to pluck from each model
	#
	#	**unwrap** _(Boolean)_ - Flag to state if we should or shouldn't 
	#							 unwrap values that are observables, default is true
	#
	# Returns:
	#	_(Array)_ - An array of the values from each model coresponding to the keys. 
	#				If the keys was an array, then this is an array of arrays
	#----------------------------------------------------------------------------------------------
	pluck: (attribute, unwrap) ->
		attribute = "" unless isString( attribute )
		unwrap = true unless isBoolean( unwrap )

		plucked_values = []
		models = @models()

		for model in models
			if model?
				plucked_values.push( if unwrap then ko.utils.unwrapObservable(model[attribute]) else model[attribute] )
			else
				plucked_values.push( undefined )
			#END if
		#END for

		return plucked_values
	#END pluck

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#slice
	#	Slices the underlying collection the same way slice works on an array
	#
	# Arguments:
	#	**start** _(Number)_ - Required. An integer that specifies where to start 
	#						   the selection (The first element has an index of 0). 
	#						   Use negative numbers to select from the end of an array.
	#	**end** _(Number)_ - Optional. An integer that specifies where to end the selection. 
	#						 If omitted, all elements from the start position and to the 
	#						 end of the array will be selected. Use negative numbers to 
	#						 select from the end of an array
	#
	# Returns:
	#	_(Array)_ - The sliced array of models from the underlying array in this collection
	#----------------------------------------------------------------------------------------------
	slice: (start, end) ->
		return @models.slice( start, end )
	#END slice

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#mixin
	#	Adds attributes to all of the models in the current models and any future models that are added.
	#	Mappings are added onto a stack of mappings.  When the models changes, all of the mappings will
	#	be re-executed.
	#
	# Arguments:
	#	**mapping** _(object)_ - The mapping to apply and save
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#
	# TODO:
	#	Account for knockout observable extensions
	#	Revisit this, make sure that the way this works actually makes sense
	#----------------------------------------------------------------------------------------------
	mixin: (mapping) ->
		mapping = {} unless isObject(mapping)
		_mapping = {}

		for key, value of mapping
			if ko.isObservable(value)
				_mapping[key] = ko.observable( ko.utils.unwrapObservable(value) )
			else if isFunction(value)
				do =>
					_value = value
					_mapping[key] = (args...) => _value.apply( args[0], [args[0], this].concat(args[1..]) )  
					_mapping[key].length = _value.length
				#END do
			else
				_mapping[key] = value
			#END if
		#END for

		models = @models()
		model.mixin(_mapping) for model in models when Falcon.isDataObject( model )
			
		@_mappings.push(_mapping)
			
		return this
	#END mixin

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#clone
	# 	Method used to deeply clone this colleciton
	#
	# Arguments:
	#	**parent** _(Falcon.Model)_ - The parent of the clone. optional
	#
	# Returns:
	#	_Falcon.Collection_ - A clone of this collection
	#
	# TODO:
	#	Add deep cloning
	#----------------------------------------------------------------------------------------------
	clone: (parent) ->
		parent = if parent is null or Falcon.isModel(parent) then parent else @parent
		return new @constructor(@models(), parent )
	#END clone

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#copy
	# 	Method used to primitively 'copy' this collection.  A copy only carries over very basic information
	#	rather than an entire copy of the internal array associated with the original collection. This method
	#	was primarily devised to copy collection for use in URL generation/new parent assignment on models
	#
	# Arguments:
	#	**attributes** _(Array)_ - The attributes to copy over. a special field, 'parent', can also be listed which will copy
	#						   a reference of the orignal collection's 'parent'
	#
	# Returns:
	#	_Falcon.Collection_ - A copy of this collection
	#----------------------------------------------------------------------------------------------
	copy: (attributes, parent) ->
		parent = attributes if attributes is null or Falcon.isModel( attributes )
		attributes = {"id":null} unless isArray( attributes )
		parent = @parent unless parent is null or Falcon.isModel( parent )
		return new @constructor( @serialize( attributes ), parent )
	#END copy

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#reset
	#	'resets' the internal array of this collection, 
	#	this will make sure the models is an observable array, 
	#	has no elements, and the length is restored to zero
	#
	# Returns:
	#	_Falcon.Collection_ - This instance
	#----------------------------------------------------------------------------------------------
	reset: () -> 
		@__falcon_collection__change_count__ += 1
		if @models?
			@models([])
		else
			@models = ko.observableArray([]) 
			@models.extend("throttle": 1)
		#END unless
		@length(0)
		return this
	#END reset
#END Falcon.Collection