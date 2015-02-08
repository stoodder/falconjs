#==============================================================================================
#
# Class: Falcon.Collection
#
#==============================================================================================
class FalconCollection extends FalconObject
	#--------------------------------------------------------
	# Method: Falcon.Collection.extend()
	#	Inherit the global extend method
	#--------------------------------------------------------
	@extend = FalconObject.extend

	#--------------------------------------------------------
	# Method: _makeIterator
	#	Private method used to consistently generate iterators for 
	#	the following search functions.  This won't guarentee an
	#	iterator method, it just tries to provide default handling
	#	for certain types of input values
	#--------------------------------------------------------
	_makeIterator = (iterator) ->
		iterator = ko.unwrap(iterator)
		iterator = iterator.models() if Falcon.isCollection(iterator)

		if Falcon.isModel( iterator )
			_model = iterator
			_model_id = _model.get('id')

			#If the id of the model is set, remove all models with the same id
			if _model_id?
				return (item) ->
					return false unless Falcon.isModel(item)
					id = item.get('id')
					model_id = _model.get('id')
					return ( id is model_id )
				#END return

			#Otherwise remove based on reference
			else
				return (item) ->
					return false unless Falcon.isModel(item)
					return ( item is _model )
				#END return
			#END if
		#END if

		if isNumber(iterator) or isString(iterator)
			_id = iterator
			return (model) -> 
				return false unless Falcon.isModel(model)
				model.get("id") is _id
			#END iterator
		else if isArray(iterator)
			return (model) ->
				return model in iterator
			#END iterator
		#END if

		return iterator
	#END _makeIterator

	#--------------------------------------------------------
	# Member: Falcon.Collection#__falcon_collection__mixins__
	#	Private store of the different mixins to apply to this
	#	collection.
	#
	# Type: _(Array)_
	#--------------------------------------------------------
	__falcon_collection__mixins__: null

	#--------------------------------------------------------
	# Member: Falcon.Collection#models
	#	The internal observable array of models
	#
	# Type: _(ko.observableArray)_
	#--------------------------------------------------------
	models: null

	#--------------------------------------------------------
	# Member: Falcon.Collection#model
	#	The prototype of the model of each item in this collection
	#
	# Type: _(Falcon.Model)_
	#--------------------------------------------------------
	model: null

	#--------------------------------------------------------
	# Member: Falcon.Collection#endpoint
	#	the endpoint to use when generating urls for the adapter.
	#	Derrived typically from the collection's model definition
	#
	# Type: _(String)_
	#--------------------------------------------------------
	endpoint: null

	#--------------------------------------------------------
	# Member: Falcon.Collection#length
	#	The number of elements in this collection.  Will be 
	#	converted into an observable on construction
	#
	# Type: _(Number)_
	#--------------------------------------------------------
	length: 0

	#--------------------------------------------------------
	# Member: Falcon.Collection#parent
	#	This represents the 'parent' object that holds these
	#	models.  Generally this is used for determining the URL
	#	structure of rest objects in the makeURL() routine.
	#	This should also be a Model.
	#
	# Type: _(Falcon.Model)_
	#--------------------------------------------------------
	parent: null

	#--------------------------------------------------------
	# Member: Falcon.Collection#comparator
	#	Method used to sort this collection when a new model(s) is
	#	added.  If left null, no sorting will occur
	#
	# Type: _(Falcon.Model)_
	#--------------------------------------------------------
	comparator: null

	#--------------------------------------------------------
	# Method: Falcon.Collection()
	#	The constructor for a collection
	#
	# Arguments:
	#	**models** _(Array)_ - An array of models to initialize this collection with
	#	**parent** _(Falcon.Model)_ - The parent object of this collection
	#--------------------------------------------------------
	constructor: (models, parent) ->
		super(arguments...)
		
		models = ko.unwrap(models)
		parent = ko.unwrap(parent)

		[parent, models] = [models, parent] if not parent? and Falcon.isModel( models )
		[parent, models] = [models, parent] if Falcon.isModel( models ) and isArray( parent )
		
		unless (not parent?) or Falcon.isModel( parent )
			throw new Error("parent must be null or a Falcon.Model")
		#END unless

		@endpoint ?= @model::endpoint if @model?
		@length = ko.computed
			deferEvaluation: Falcon.deferEvaluation
			read: => @models().length
		#END computed
		@parent = parent

		@__falcon_collection__mixins__ = []
		@models = ko.observableArray([])
		@initialize.apply(this, arguments)
		@replace(models) unless isEmpty( models )

		return this
	#END constructor

	#--------------------------------------------------------
	# Method: Falcon.Collection#initialize()
	#	The psuedo-constructor of the collection.  Useful for ensuring that
	#	the base constructor is called (in the correct spot) without 
	#	having to explicitly call the native Collection constructor
	#
	# Arguments:
	#	**data** _(Array)_ - The initial models that were loaded
	#	**parent** _(Falcon.Model)_ - The parent object of this collection
	#--------------------------------------------------------
	initialize: ( (models, parent) -> )

	#--------------------------------------------------------
	# Method: Falcon.Collection#set()
	#	Sets a value for the specific attribute in each model
	#	of this collection
	#
	# Arguments:
	#	**attribute** _(string)_ - The attribute to look up
	#	**value** -(mixed)_ - The value to assign
	#
	# Arguments:
	#	**attribute** _(Object)_ - An object of values to set
	#
	# Returns:
	#	_(Falcon.Collection)_ - This Collection
	#--------------------------------------------------------
	set: (attribute, value) ->
		@each (model) -> model.set(attribute, value)
		return @
	#END set

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#serializeRequestData()
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

	#--------------------------------------------------------
	# Method: Falcon.Collection#parseResponseData()
	#	parses the response data from an XHR request
	#
	# Arguments:
	#	**response_data** _(Object)_ - The adapter response data
	#	**request_type** _(String)_ - The type of request being performed
	#	**request_options** _(Object)_ - The requst options fed in to the adapter
	#
	# Returns:
	#	_(Array)_ - Parsing on a collection expects an array to be returned
	#--------------------------------------------------------
	parseResponseData: (response_data, request_type, request_options) ->
		return response_data
	#END parseResponseData

	#--------------------------------------------------------
	# Method: Falcon.Collection#unwrap()
	#	Method used to 'unwrap' this object into an anonymous object
	#	Needed to cascade inwards on other Falcon Data objects (like models)
	#	to unwrap newly added member variables/objects
	#
	# Returns:
	#	_(Array)_ - The 'unwrapped' array
	#--------------------------------------------------------
	unwrap: () ->
		raw = []
		for i, value of @models()
			raw[i] = if Falcon.isDataObject(value) then value.unwrap() else value
		return raw
	#END unwrap

	#--------------------------------------------------------
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
	#	_(Array)_ - an array of the serialized raw data to send to the server
	#--------------------------------------------------------
	serialize: (attributes) ->
		serialized = []
		for i, value of @models()
			serialized[i] = if Falcon.isDataObject(value) then value.serialize(attributes) else value
		#END for
		return serialized
	#END serialize

	#--------------------------------------------------------
	# Method: Falcon.Collection#makeUrl
	#	Attempts to generate a URL for this collection based on its parent
	#	and the endpoint that is defined
	#
	# Arguments:
	#	**type**
	#--------------------------------------------------------
	makeUrl: (type, parent) -> Falcon.dataAdapter.makeUrl( @, type, {parent}, @ )

	#--------------------------------------------------------
	# Method: Falcon.Collection#sync()
	#	Used to dynamically place calls to the server in order
	#	to create, update, destroy, or read this from/to the
	#	server.
	#
	# Arguments:
	#	**type** _(String)_ - The HTTP Method to call to the server with
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(mixed)_ - The context to call the adapter response callbacks with
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	sync: (type, options, context) -> Falcon.dataAdapter.sync( @, type, options, context )

	#--------------------------------------------------------
	# Method: Falcon.Collection#fetch
	#	Calls the sync method with 'GET' as the default type
	#	server. Get's this collection's server data.
	#
	# Arguments:
	#	**options** _(Object)_ - Optional object of settings to use on this call
	#	**context** _(mixed)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	fetch: (options, context) -> @sync(Falcon.GET, options, context)

	#--------------------------------------------------------
	# Method: Falcon.Collection#create
	#	Creates a new model and adds it to the list of existing models, 
	#	also sends off a corresponding ajax request
	#
	# Arguments:
	#	**data** _(Falcon.Model|Object)_ - The model data to create
	#	**options** _(Object)_ - optional options for the ajax request
	#	**context** _(Object)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	create: (data, options, context) ->
		return null unless @model?
		
		data = {} unless isObject(data) or Falcon.isModel(data)
		model = if Falcon.isModel(data) then data else new @model(data, @parent)
		context ?= model

		output_options = Falcon.dataAdapter.standardizeOptions( model, Falcon.POST, options, context )
		output_options.fill_options ?= {method: 'append'}
		output_options.success = (model) =>
			@fill(model, output_options.fill_options)
			options.success.apply(context, arguments) if isFunction( options.success )
		#END success
		
		return model.create(output_options, context)
	#END create

	#--------------------------------------------------------
	# Method: Falcon.Collection#destroy
	#	Mehtod used to remove a single model from the server and then removes all instances of the
	#	model from this collection
	#
	# Arguments:
	#	**model** _(Falcon.Model)_ - An array of the models to remove, if this is not an array, 
	#                                it will be placed in one as the only object, if the models 
	#                                is a collection, we will destroy all of the models in the collection.
	#                                When no argument is given for models (or the argument is the 
	#                                string 'all'), we'll destroy everything.
	#
	#	**options** _(Object)_ - An optional object of the settings to call when onto each 
	#							 of the destroy methods of the
	#
	#	**context** _(mixed)_ - Optional object to set the context of the request
	#
	# Returns:
	#	_(mixed)_ - Whatever the response from the adapter's sync method is
	#--------------------------------------------------------
	destroy: (model, options, context) ->
		return null unless @model?

		model = @first( ko.unwrap( model ) )

		return null unless Falcon.isModel( model )

		context ?= model
		output_options = Falcon.dataAdapter.standardizeOptions( model, Falcon.DELETE, options, context )
		output_options.success = (model) =>
			@remove(model)
			options.success.apply(context, arguments) if isFunction( options.success )
		#END success

		return model.destroy(output_options, context)
	#END destroy

	#--------------------------------------------------------
	# Method: Falcon.Collection#remove
	#	Used to remove elements from this collection. This method
	#	does not make any API delete requests and will simply remove
	#	an instance of a model from this collection.
	#
	# Arguments:
	#	**items** _(Array)_ - An array (or an item) to remove from the models
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#--------------------------------------------------------
	remove: (items) ->
		items = ko.unwrap( items )
		items = items.models() if Falcon.isCollection( items )

		removedItems = if isArray(items) then @models.removeAll(items) else @models.remove(_makeIterator(items))

		return this
	#END remove


	#========================================================================================
	#
	# FILL RELATED METHODS
	#
	#========================================================================================
	_fill_standardizeItems = (collection, items) ->
		items = ko.unwrap(items) if ko.isObservable(items)
		items ?= []
		items = items.all() if Falcon.isCollection(items)
		items = [items] unless isArray(items)
		items = items.slice(0) #Shallow clone the items array so that we don't disturb the original input

		return items
	#END _standardizeItems

	_fill_createModels = (collection, items) ->
		#Create new models where needed
		for item, i in items when isObject(item) and not Falcon.isModel(item)
			items[i] = new collection.model(item, collection.parent)
		#END for

		return items
	#END _fill_createModels

	_fill_addMixins = (collection, added_models) ->
		#Add the mixins
		for added_model in added_models
			added_model.mixin(mapping) for mapping in collection.__falcon_collection__mixins__
		#END for

		return added_models
	#END _fill_addMixins

	_fill_standardizeOptions = (collection, options) ->
		options = {} unless isObject(options)
		output_options = {}

		#clone the options so we don't distrub the original object
		output_options[key] = value for key, value of options

		output_options.comparator ?= collection.comparator

		output_options.method = 'replace' unless isString( output_options.method )
		output_options.method = trim( output_options.method.toLowerCase() )
		output_options.method = 'replace' unless output_options.method in ['replace', 'append', 'prepend', 'insert', 'merge']
		
		return output_options
	#END _fill_standardizeOptions

	_fill_updateModels = (collection, new_models_list, options) ->
		new_models_list.sort( options.comparator ) if isFunction( options.comparator )

		collection.models( new_models_list )
	#END _fill_updateModels

	#--------------------------------------------------------
	# Method: Falcon.Collection#fill()
	#	'fills' this collection with new data
	#
	# Arguments:
	#	**items** _(Array)_ - An array of items to fill this collection with
	#	**options** _(Object)_ - The options specific to this fill related method.
	#
	# Returns:
	#	_(Array)_ - An array of the models that were added
	#--------------------------------------------------------
	fill: (items, options) ->
		options = _fill_standardizeOptions( @, options )
		return @[options.method]( items, options )
	#END fill

	#--------------------------------------------------------
	# Method: Falcon.Collection#replace
	#	Replaces all of the items in the collections
	#
	# Arguments:
	#	**items** _(Falcon.Model|Array)_ - The model(s) to add
	#	**options** _(Object)_ - The options specific to this fill related method.
	#		comparator: Method used to sort the resultant list of models (optional)
	#
	# Returns:
	#	_(Array)_ - An array of the models that were added
	#--------------------------------------------------------
	replace: (items, options) ->
		return [] unless @model?

		options = _fill_standardizeOptions( @, options )
		items = _fill_standardizeItems(@, items )
		items = _fill_createModels(@, items )
		_fill_addMixins( @, items )
		_fill_updateModels( @, items, options )

		return items
	#END replace

	#--------------------------------------------------------
	# Method: Falcon.Collection#append
	#	Appends an items or a list of items to the end of the collection
	#
	# Arguments:
	#	**items** _(Falcon.Model|Array)_ - The model(s) to add
	#	**options** _(Object)_ - The options specific to this fill related method.
	#		comparator: Method used to sort the resultant list of models (optional)
	#
	# Returns:
	#	_(Array)_ - An array of the models that were added
	#--------------------------------------------------------
	append: (items, options) ->
		return [] unless @model?

		options = _fill_standardizeOptions( @, options )
		items = _fill_standardizeItems( @, items )
		items = _fill_createModels( @, items ) 
		_fill_addMixins( @, items, options )
		_fill_updateModels( @, @models().concat(items), options )

		return items
	#END append

	#--------------------------------------------------------
	# Method: Falcon.Collection#prepend
	#	Pepends an items or a list of items to the beginning of the collection
	#
	# Arguments:
	#	**items** _(Falcon.Model)_ - The model(s) to add
	#	**options** _(Object)_ - The options specific to this fill related method.
	#		comparator: Method used to sort the resultant list of models (optional)
	#
	# Returns:
	#	_(Array)_ - An array of the models that were added
	#--------------------------------------------------------
	prepend: (items, options) ->
		return [] unless @model?

		options = _fill_standardizeOptions( @, options )
		items = _fill_standardizeItems( @, items )
		items = _fill_createModels( @, items )
		_fill_addMixins( @, items, options )
		_fill_updateModels( @, items.concat(@models()), options )

		return items
	#END prepend

	#--------------------------------------------------------
	# Method: Falcon.Collection#insert
	#	Method used to insert a model before another within the collection.
	#	If no model is found in the collection, the model is added to the end
	#	of the collection.  Alternatively, an iterator can be given and the model
	#	will be inserted before the first model to pass the truth test
	#
	# Arguments:
	#	**items** _(Falcon.Model)_ - The model(s) to insert
	#	**options** _(Object)_ - The options specific to this fill related method.
	#		index: The index to insert at. This will override the iterator attribute
	#		iterator: The iterator (id, model, method) to use to find which model we should insert the new model(s) after
	#				  If no iterator could be made, then we'll append the models instead
	#		model: This is the same as iterator
	#		comparator: Method used to sort the resultant list of models (optional)
	#
	# Returns:
	#	_(Array)_ - An array of the models that were added
	#--------------------------------------------------------
	insert: (items, options) ->
		options = {iterator: options} if isFunction( options )
		options = {model: options} if isNumber( options ) or isString( options ) or Falcon.isModel( options )
		options = _fill_standardizeOptions( @, options )

		items = _fill_standardizeItems( @, items )
		items = _fill_createModels( @, items )
		_fill_addMixins( @, items, options )
		
		insert_index = options.index ? @indexOf( _makeIterator( options.iterator ? options.model ) )
		new_models_list = @models()

		if insert_index < 0 or insert_index >= new_models_list.length
			new_models_list = new_models_list.concat( items )
		else
			head = new_models_list[0...insert_index]
			tail = new_models_list[insert_index..]
			new_models_list = head.concat( items, tail )
		#END if

		_fill_updateModels( @, new_models_list, options )

		return items
	#END insert

	#--------------------------------------------------------
	# Method: Falcon.Collection#merge
	#	Merges a list of objects/models into the current list
	#
	# Arguments:
	#	**items** _(Falcon.Model)_ - The model(s) to insert
	#	**options** _(Object)_ - The options specific to this fill related method.
	#		comparator: Method used to sort the resultant list of models (optional)
	#
	# Returns:
	#	_(Array)_ - An array of the models that were added
	#--------------------------------------------------------
	merge: (items, options) ->
		return [] unless @model?

		options = _fill_standardizeOptions( @, options )
		items = _fill_standardizeItems( @, items)

		added_models = []
		new_models_list = @models()

		#iterate over the new collection
		for item in items
			existing_model = null

			#Check if this new model is already a Model
			if Falcon.isModel( item )
				#Create the appropriate iterator
				iterator = _makeIterator( item )

				#Try to find an existing model in this collection
				for m in new_models_list when iterator( m )
					existing_model = m
					break
				#END for

				#If we found a model, then fill it with the unwrapped data
				#from the input item (so we avoid overwitting references)
				if Falcon.isModel( existing_model )
					existing_model.fill( item.unwrap() )

				#Otherwise simply append the model to the collection
				else
					new_models_list.push( item )
					added_models.push( item )
				#END if

			#Check if this item is an object of data
			else if isObject( item )
				#Create the appropriate iterator
				iterator = _makeIterator( item.id )

				#Attempt to find a item in this collection
				for m in new_models_list when iterator( m )
					existing_model = m
					break
				#END for

				#If we found a item, then just fill it with the data
				if Falcon.isModel( existing_model )
					existing_model.fill( item )

				#Otherwise, create a new item and append it to the collection
				else
					new_model = new @model( item, @parent )
					new_models_list.push( new_model )
					added_models.push( new_model )
				#END if
			#END if
		#END for

		_fill_addMixins( @, added_models )
		_fill_updateModels( @, new_models_list, options )

		return added_models
	#END merge

	#--------------------------------------------------------
	# Method: Falcon.Collection#unshift
	#	Push an element onto the begining of the array, Alias of prepend
	#
	# Arguments:
	#	**items** _(Falcon.Model)_ - The model to add
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#
	# See Also:
	#	Falcon.Colletion#prepend
	#--------------------------------------------------------
	unshift: ->
		@prepend(arguments...)
	#END unshift

	#--------------------------------------------------------
	# Method: Falcon.Collection#shift
	#	Shifts the first element from the models and returns it
	#
	# Returns:
	#	_(Falcon.Model)_ - The first mmodel in this collection
	#--------------------------------------------------------
	shift: ->
		item = @models.shift()
		return item
	#END shift

	#--------------------------------------------------------
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
	#--------------------------------------------------------
	push: ->
		@append(arguments...)
	#END pop

	#--------------------------------------------------------
	# Method: Falcon.Collection#pop
	#	Removes and returns the last model from this collection.
	#
	# Returns:
	#	_(Falcon.Model)_ - The last model on the list, may be null
	#--------------------------------------------------------
	pop: ->
		item = @models.pop()
		return item
	#END pop

	#--------------------------------------------------------
	# Method: Falcon.Collection#sort
	#	Sorts the collection by a given comparator
	#
	# Arguments:
	#	**comparator** _(Function)_ - An iterator to sort the array with
	#
	# Returns:
	#	_(Array)_ - The sorted array
	#--------------------------------------------------------
	sort: (comparator) ->
		comparator ?= @comparator
		return @ unless isFunction( comparator )
		@models.sort( comparator )
		return @
	#END sort

	#--------------------------------------------------------
	# Method: Falcon.Collection#at
	#	Gets a the value at the specified index
	#
	# Arguments:
	#	**index** _(Number)_ - The index to retrieve the value from
	#
	# Returns:
	#	_(Falcon.Model)_ - The model at that index
	#--------------------------------------------------------
	at: (index) ->
		index = parseInt( index )
		return null if isNaN(index)

		models = @models()
		return null if index < 0 or index >= models.length
		return models[index]
	#END at

	#--------------------------------------------------------
	# Method: Falcon.Collection#indexOf
	#	Find the index for the specified model or where the iterator first returns true.
	#	-1 is returned if nothing matches.
	#
	# Arguments:
	#	**model** _(Falcon.Model)_ - The model to lookup
	#
	# Returns:
	#	_(Number)_ - The number of the matched index
	#--------------------------------------------------------
	indexOf: (model) ->
		return @models.indexOf( model ) if Falcon.isModel( model )
		
		iterator = _makeIterator( model )
		return -1 unless isFunction( iterator )

		( return index ) for model, index in @models() when iterator( model )
		return -1
	#END indexOf

	#--------------------------------------------------------
	# Method: Falcon.Collection#lastIndexOf
	#	Find the last index for the specified model or where the iterator first returns true.
	#	-1 is returned if nothing matches.
	#
	# Arguments:
	#	**model** _(Falcon.Model)_ - The model to lookup
	#
	# Returns:
	#	_(Number)_ - The number of the matched index
	#--------------------------------------------------------
	lastIndexOf: (model) ->
		iterator = _makeIterator( model )
		return -1 unless isFunction( iterator )

		models = @models()
		length = models.length
		for model, i in models
			index = length - i - 1
			return index if iterator( models[index] )
		#END for

		return -1
	#END indexOf

	#--------------------------------------------------------
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
	#--------------------------------------------------------
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

	#--------------------------------------------------------
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
	#--------------------------------------------------------
	first: (iterator) ->
		iterator = _makeIterator( iterator )
		iterator = ( -> true ) unless isFunction(iterator)

		for item in @models()
			return item if iterator( item )
		#END for

		return null
	#END first

	#--------------------------------------------------------
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
	#--------------------------------------------------------
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

	#--------------------------------------------------------
	# Method: Falcon.Collection#all
	#	Returns all of the models in a raw array
	#
	# Returns:
	#	_(Array)_ - An array of all the models in the collection
	#--------------------------------------------------------
	all: ->
		return @models()
	#END all

	#--------------------------------------------------------
	# Method: Falcon.Collection#filter
	#	Gets a list of all items that match the iterator.
	#	If no iterator is present, all of the models are returned
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Array)_ - An array of all the matched items
	#--------------------------------------------------------
	filter: (iterator) ->
		iterator = _makeIterator( iterator )
		return @models() unless isFunction(iterator)
		return ( item for item in @models() when iterator(item) )
	#END first

	#--------------------------------------------------------
	# Method: Falcon.Collection#any
	#	Checks to see if any of the values match the iterator in this models
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Boolean)_ - Did the iterator return true once?
	#--------------------------------------------------------
	any: (iterator) ->
		iterator = _makeIterator( iterator )

		return false unless isFunction(iterator)

		for item in @models()
			return true if iterator( item )
		#END for

		return false
	#END any

	#--------------------------------------------------------
	# Method: Falcon.Collection#without
	#	Returns an array of elements that don't match the iterator
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check each model against
	#
	# Returns:
	#	_(Array)_ - The list of models after being filtered by the iterator
	#--------------------------------------------------------
	without: (iterator) ->
		iterator = _makeIterator( iterator )
		return @models() unless isFunction(iterator)
		return ( item for item in @models() when not iterator( item ) )
	#END without

	#--------------------------------------------------------
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
	#	_(Array)_ - An array of the values from each model coresponding to the given attribute. 
	#--------------------------------------------------------
	pluck: (attribute, unwrap) ->
		attribute = "" unless isString( attribute )
		unwrap = true unless isBoolean( unwrap )

		plucked_values = []
		models = @models()

		for model in models
			if model?
				plucked_values.push( if unwrap then ko.unwrap(model[attribute]) else model[attribute] )
			else
				plucked_values.push( undefined )
			#END if
		#END for

		return plucked_values
	#END pluck

	#--------------------------------------------------------
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
	#--------------------------------------------------------
	slice: (start, end) ->
		# This if is needed for ie8
		if end?
			return @models.slice( start, end )
		else
			return @models.slice( start )
		#END if 
	#END slice

	#--------------------------------------------------------
	# Method: Falcon.Collection#chain
	#	Chains collection operations together so we can execute more than one.
	#
	# Returns:
	#	_(Chain Object)_ -  A Chain object with wrapped first, last, slice, without, 
	#						filter, any, and pluck, each, indexOf, lastIndexOf sort, push
	#						methods
	#--------------------------------------------------------
	class FalconChainedCollection extends FalconCollection
		slice: ->
			@models( super(arguments...) )
			return this
		#END slice

		filter: ->
			@models( super(arguments...) )
			return this
		#END filter

		without: ->
			@models( super(arguments...) )
			return this
		#END without
	#END FalconChainedCollection
	chain: ->
		#Create a new chained collection which is defined at the bottom of this file
		chainedCollection = new FalconChainedCollection()
		chainedCollection.model = @model
		chainedCollection.fill( @models() )
		return chainedCollection
	#END chain

	#--------------------------------------------------------
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
	#--------------------------------------------------------
	mixin: (mapping) ->
		return this unless isObject(mapping)

		model.mixin(mapping) for model in @models() when Falcon.isDataObject( model )
		@__falcon_collection__mixins__.push(mapping)
			
		return this
	#END mixin

	#--------------------------------------------------------
	# Method: Falcon.Collection#clone
	# 	Method used to create a clone of this collection.
	#
	# Arguments:
	#	**attributes** _(Array)_ - The attributes of each model to clone to the new collection
	#	**parent** _(Falcon.Model)_ - An override of the parent when attempting to clone. If set to null, 
	#								  no parent will be present on the cloned collection
	#
	# Returns:
	#	_(Falcon.Collection)_ - A clone of this collection
	#--------------------------------------------------------
	clone: (attributes, parent) ->
		[ attributes, parent ] = [ undefined, attributes ] if attributes is null or Falcon.isModel( attributes )
		parent = @parent unless parent is null or Falcon.isModel( parent )
		return new @constructor( @serialize( attributes ), parent )
	#END clone

	#--------------------------------------------------------
	# Method: Falcon.Collection#reset
	#	'resets' the internal array of this collection, 
	#	this will make sure the models is an observable array, 
	#	has no elements, and the length is restored to zero
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#--------------------------------------------------------
	reset: () -> 
		@models([])
		return this
	#END reset

	#--------------------------------------------------------
	# Method: Falcon.Collection#subscribe
	#	Delegates a subscription definiton to the interal
	#	observable array and returns that observable array's
	#	subscription.
	#
	# Returns:
	#	_(ko.subscriotion)_ - The knockout subscription
	#--------------------------------------------------------
	subscribe: (callback, context, event) -> @models.subscribe(callback, context, event)
#END Falcon.Collection