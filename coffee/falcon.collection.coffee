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
	#
	#----------------------------------------------------------------------------------------------
	models: null

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	model: null

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	__change_count__: 0

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
	loading: false

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	constructor: (models, parent) ->
		super()
		
		models = ko.utils.unwrapObservable(models)
		parent = ko.utils.unwrapObservable(parent)

		[parent, models] = [models, parent] if not parent? and Falcon.isModel( models )

		@url ?= @model::url if @model?
		@parent = parent
		@length = ko.observable( ko.utils.unwrapObservable( @length ) )
		@loading = ko.observable( ko.utils.unwrapObservable( @loading ) )
		@populated = ko.computed => ( @length() > 0 )

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
	# Method: Falcon.Collection#fill()
	#	'fills' this collection with new data
	#
	# Arguments:
	#	**items** _(Array)_ - An array of items to fill this collection with
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
		
		options ?= {}
		options = {} unless isObject(options)

		{method} = options
		method = '' unless isString(method)
		method = method.toLowerCase()
		method = 'replace' unless method in ['replace', 'append', 'prepend', 'merge']

		return [] if method isnt 'replace' and isEmpty( items ) 

		#Increment the change count
		@__change_count__++

		# Make a clone of each item and ensure that they're models
		# TODO: Should we really make a clone?  This prevents mixins 
		# 		from interfering with the original model, but adds more to
		# 		our memory usage
		#
		# TODO: Optimize this to be called only when it needs to, right now
		#		the 'merge' method still relies on this to be called althogh
		#		it may not actually be necessary.
		for m, i in items
			models[i] = new @model({}, @parent)
			models[i].mixin(mapping) for mapping in @_mappings
			m = m.serialize() if Falcon.isModel(m)
			models[i].fill( m ) unless isEmpty( m )
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
	#	**fields** _(Array)_ -	The fields that should be included in the 
	#	                      	serialization "id" is always included. If 
	#	                      	none given, all fields from this models 'fields' 
	#	                      	member are serialized
	#
	#	**deep** _(Boolean)_ -	should we do a deep copy? In otherwords, should 
	#	                      	we cascade downwards to serialize data about 
	#	                      	children models.
	#
	# Returns:
	#	_Array_ - an array of the serialized raw data to send to the server
	#----------------------------------------------------------------------------------------------
	serialize: (fields, deep) ->
		raw = []
		for i, value of @models()
			raw[i] = if Falcon.isDataObject(value) then value.serialize(fields, deep) else value
		return raw
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

		#Return the built url
		return url
	#END makeUrl

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	fetch: (options) -> 
		@sync('GET', options)
	#END fetch

	#--------------------------------------------------------
	# Method: Falcon.Collection#remoteFieldsArray()
	#	Reserved instance method used for generating a flattened list
	#	of remote fields in an array, used to send up with each reques
	#	on the 'fields' query parameter
	#--------------------------------------------------------
	remoteFieldsArray: (local_fields, prefix) ->
		@model::remoteFieldsArray( local_fields, prefix )
	#END remoteFieldsArray

	#----------------------------------------------------------------------------------------------
	#
	#----------------------------------------------------------------------------------------------
	sync: (type, options) ->
		options = {success: options} if isFunction(options)

		options = {} unless isObject(options)
		options.data = {} unless isObject(options.data)
		options.dataType = "json" unless isString(options.dataType)
		options.contentType = "application/json" unless isString(options.contentType)
		options.success = (->) unless isFunction(options.success)
		options.complete = (->) unless isFunction(options.complete)
		options.error = (->) unless isFunction(options.error)
		options.fields = flattenObjectKeys( options.fields ) if isObject( options.fields )
		options.fields = [] unless isArray( options.fields )
		options.params = {} unless isObject( options.params )
		options.fill = true unless isBoolean( options.fill )
		options.headers = {} unless isObject( options.headers )


		type = if isString(type) then type.toUpperCase() else "GET"
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]
		type = trim(type)

		data = {}
		unless isEmpty(options.data)
			data[key] = value for key, value of options.data
		#END unless

		url = options.url ? trim(@makeUrl(type))

		return unless url? and isString(url)

		unless options.params['fields']? and options['fields'].length > 0
			remote_fields_array = @remoteFieldsArray( options.fields )
			options.params['fields'] = remote_fields_array unless remote_fields_array.length <= 0
		#END unless

		options.params['fields'] = trim( options.params['fields'].join(",") ) if isArray( options.params['fields'] )

		unless isEmpty( options.params )
			url += "?" unless url.indexOf("?") > -1
			url += ( "#{key}=#{value}" for key, value of options.params ).join("&")
		#END if params

		@loading(true)

		$.ajax
			'url': url
			'type': type
			'data': data
			'dataType': options.dataType
			'contentType': options.contentType
			'cache': Falcon.cache
			'headers': options.headers

			'success': (data, status, xhr) =>
				data ?= []
				data = JSON.parse( data ) if isString(data)
				data = JSON.parse( xhr.responseText ) if isEmpty(data)

				@fill(data, options) if options.fill and type is "GET"

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
	#END sync

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
		@__change_count__++
		removedItems = if isArray(items) then @models.removeAll(items) else @models.remove(items)

		unless isEmpty(removedItems)
			@length( @models().length )
		#END unless

		return this
	#END remove

	#----------------------------------------------------------------------------------------------
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
		models = @models()
		return unless isArray( models )
		return models unless isFunction( sorter )
		return models.sort( sorter )
	#END sort

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#create
	#	Creates a new model and adds it to the models of eisting models, 
	#	also sends off a corresponding ajax request
	#
	# Returns:
	#	_XmlHttpRequest_ - The XHR object that corresponds to this create instance
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
			( arguments[0] = models = models[0] ) if models.length is 1
			_success.apply(models, arguments)
		#END success

		return ( new @model(data, @parent).create(options) )
	#END create

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#destroy
	#	Removes the specified models from the collection and database
	#	executing each of te models destroy method and passing the
	#	'options' parameter along with the destroy call
	#
	# Arguments:
	#	**models** _(Array)_ - An array of the models to remove, if this is not an array, 
	#						   it will be placed in one as the only object, if the models 
	#						   is a collection, we will destroy all of the models in the models.
	#						   When no argument is given for models (or the argument is the 
	#						   string 'all'), we'll destroy everything.
	#
	#	**options** _(Object)_ - An optional object of the settings to call when onto each 
	#							 of the destroy methods of the 
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	#----------------------------------------------------------------------------------------------
	destroy: (models, options) ->
		return this unless @model?

		models = ko.utils.unwrapObservable( models )
		models = this.models() unless models? and models isnt 'all'
		models = models.models() if Falcon.isCollection(models)
		models = [models] unless isArray(models)

		return this if isEmpty(models)
		options = {success:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)
		options.parent = @parent

		_success = options.success
		options.success = (model) =>
			@remove(model)
			_success.apply(model, arguments)

		for model in models when Falcon.isDataObject(model)
			model.destroy(options)
		#END for

		return this
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
		index = 0 unless isNumber(index)
		index = parseInt( index )

		models = @models()
		index = 0 if index < 0
		index = models.length-1 if index >= models.length

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
			iterator.call(context, index, item ) for index, item in @models()
		#END if

		return this
	#END each

	#----------------------------------------------------------------------------------------------
	# Method: _makeIterator
	#	Private method used to consistently generate iterators for 
	#	the following search functions.  This won't guarentee an
	#	iterator method, it just tries to provide default handling
	#	for certain values
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
	#_makeIterator


	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#first
	#	Retrieves the first value from the internal models based on an interator.  
	#	If no iterator is present, the first value is returned.  
	#	If no values match or exist, then null is returned
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
	#
	#----------------------------------------------------------------------------------------------
	last: (iterator) ->
		iterator = _makeIterator( iterator )
		iterator = ( -> true ) unless isFunction(iterator)

		models = @models()
		for i, item of models
			item = models[models.length - i - 1]
			return item if iterator( item )
		#END for

		return null
	#END last

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
	# Method: Falcon.Collection#all
	#	Gets a models of all elements that match the iterator, if one is given
	#
	# Arguments:
	#	**iterator** _(Function)_ - The iterator to check if this item belongs in the response models
	#
	# Returns:
	#	_(Array)_ - An array of all the matched items
	#----------------------------------------------------------------------------------------------
	all: (iterator) ->
		iterator = _makeIterator( iterator )
		return ( item for item in @models() when iterator(item) )
	#END first

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#any
	#	Checks to see if any of the values match the iterator in this models
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
	# Method: Falcon.Collection#mixin
	#	Adds a mixin to all of the models in the current models and any future models that are added.
	#	Mappings are added onto a stack of mappings.  When the models changes, all of the mappings will
	#	be re-executed.
	#
	# Arguments:
	#	**mapping** _(object)_ - The mapping to apply and save
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
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
					_mapping[key] = () =>
						_value.call(arguments[0], arguments[0], this)  
			else
				_mapping[key] = value

		model.mixin(_mapping) for model in @models() when Falcon.isDataObject( model )
			
		@_mappings.push(_mapping)
			
		return this
	#END map

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#pluck
	#	Method used to pluck values from each model in the models of models.
	#
	# Arguments:
	#	**keys** _(String)_ - The key to look at in each mode
	#			 _(Array)_  - An array of keys to pluck from the model, value returned in the 
	#						  same order
	#
	#	**unwrap** _(Boolean)_ - Flag to state if we should or shouldn't 
	#							 unwrap values that are observables, default is true
	#
	# Returns:
	#	_(Array)_ - An array of the values from each model coresponding to the keys. 
	#				If the keys was an array, then this is an array of arrays
	#----------------------------------------------------------------------------------------------
	pluck: (keys, unwrap) ->
		keys = keys.split(",") if isString(keys)
		keys = [] unless isArray( keys )
		return [] unless keys.length > 0

		unwrap ?= true

		plucked_values = []
		if keys.length > 1
			for model in @models()
				if isObject( model )
					plucked_values.push( (if unwrap then ko.utils.unwrapObservable(model[key]) else model[key]) for key in keys )
				else
					plucked_values.push( window.undefined )
				#END if
			#END for
		else if keys.length == 1
			key = keys[0]
			for model in @models()
				if isObject( model )
					plucked_values.push( (if unwrap then ko.utils.unwrapObservable(model[key]) else model[key]) )
				else
					plucked_values.push( window.undefined )
				#END if
			#END for
		#END if

		return plucked_values
	#END pluck

	#----------------------------------------------------------------------------------------------
	# Method: Falcon.Collection#clone
	# 	Method used to deeply clone this colleciton
	#
	# Arguments:
	#	**parent** _(Falcon.Model)_ - The parent of the clone. optional
	#
	# Returns:
	#	_Falcon.Collection_ - A clone of this collection
	#----------------------------------------------------------------------------------------------
	clone: (parent) ->
		parent = if parent is null or Falcon.isModel(parent) then parent else @parent
		return new this.constructor(this.unwrap(), parent )
	#END clone

	copy: (fields) ->
		fields = ["id", "parent"] unless isArray( fields )
		copy = new @constructor()
		copy.fill( @serialize( fields ) )
		copy.parent = @parent if arrayContains( fields, "parent" )
		return copy
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
		@__change_count__ += 1
		@models = ko.observableArray([]) unless @models?
		@models.extend("throttle": 1)
		@models([])
		@length(0)
		return this
	#END reset
#END Falcon.Collection