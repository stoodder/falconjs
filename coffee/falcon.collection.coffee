class Falcon.Collection extends Falcon.Class

	###
	#
	###
	list: null

	###
	#
	###
	model: null

	###
	#
	###
	url: null

	###
	#
	###
	length: 0

	###
	#
	###
	parent: null

	@_mappings: null

	###
	#
	###
	@extend = (definition) -> Falcon.Class.extend(Falcon.Collection, definition)

	###
	#
	###
	constructor: (models, parent) ->
		[parent, models] = [models, parent] if not parent? and Falcon.isModel( models )

		@url ?= @model::url if @model?
		@parent = parent
		@length = ko.observable( ko.utils.unwrapObservable( @length ) )
		@populated = ko.computed => ( @length() > 0 )

		@_mappings = []
		@reset().fill(models)
		@initialize(models)
	#END constructor

	###
	#
	###
	initialize: (->)

	###
	# Method: Falcon.Collection#fill
	#	'fills' this collection with new data
	#
	# Arguments:
	#	**items** _(Array)_ - An array of items to fill this collection with
	#
	# Returns:
	#	_Falcon.Collection_ - This instance
	###
	fill: (items, options) ->
		return this unless @model?

		items ?= []
		items = items.list() if Falcon.isCollection(items)
		items = ko.utils.unwrapObservable(items) if ko.isObservable(items)
		items = [items] unless isArray(items)
		
		options ?= {}
		options = {} unless isObject(options)

		{method} = options
		method = '' unless isString(method)
		method = method.toLowerCase()
		method = 'replace' unless method in ['replace', 'append', 'prepend']

		#Make sure each of the items is a model
		for i, m of items when not ( m instanceof @model )
			items[i] = new @model(m, @parent) 

		#Push our mappings onto the items
		for item in items when Falcon.isDataObject( item )
			item.map(mapping) for mapping in @_mappings

		#Determine how we should proceed adding items to the list
		if method is 'replace'
			@reset().list(items)
		else if method is 'prepend'
			@list.unshift(items.pop()) while items.length > 0
		else if method is 'append'
			@list.push(items.shift()) while items.length > 0
		
		#Update the length
		@length( @list().length )

		return this
	#END fill

	###
	# Method: Falcon.Collection#unwrap
	#	Method used to 'unwrap' this object into an anonmous object
	#	Needed to cascade inwards on other Falcon Data objects (like lists)
	#	to unwrap newly added member variables/objects
	#
	# Returns
	#	_Array_ - The 'unwrapped' array
	###
	unwrap: () ->
		raw = []
		for i, value of @list()
			raw[i] = if Falcon.isDataObject(value) then value.unwrap() else value
		return raw
	#END unwrap

	###
	# Method: Falcon.Collection#serialize
	#	Serializes this collection and returns the raw array
	#	of data
	###
	serialize: () ->
		raw = []
		for i, value of @list()
			raw[i] = if Falcon.isDataObject(value) then value.serialize() else value
		return raw
	#END serialize

	###
	# Method: Falcon.Collection#makeUrl
	###
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
			parentUrl = parentUrl.slice(0, parentPeriodIndex) if parentPeriodIndex > -1
			parentUrl = trim(parentUrl)

			url = "#{parentUrl}#{url}"

		#Otherwise consider this the base
		else if isString(Falcon.baseApiUrl)
			url = "#{Falcon.baseApiUrl}#{url}"

		#END if

		#Return the built url
		return url
	#END makeUrl

	###
	#
	###
	fetch: (options) -> @sync('GET', options)

	###
	#
	###
	sync: (type, options) ->
		options = {success: options} if isFunction(options)

		options = {} unless isObject(options)
		options.data = {} unless isObject(options.data)
		options.success = (->) unless isFunction(options.success)
		options.error = (->) unless isFunction(options.error)

		type = if isString(type) then type.toUpperCase() else "GET"
		type = "GET" unless type in ["GET", "POST", "PUT", "DELETE"]
		type = trim(type)

		data = options.data ? {}

		url = @makeUrl(type)

		return unless url? and isString(url)

		$.ajax(
			url: trim(url)
			type: type
			data: data
			dataType: 'json'
			success: (args...) =>
				data = args[0] ? {}
				data = JSON.parse( data ) if isString(data)

				@fill(data, options) if type is "GET"

				options.success(args...)
			error: options.error
		)

		return this

	###
	#
	###
	remove: (items) ->
		if isArray(items) then @list.removeAll(items) else @list.remove(items)

		@length( @list().length )

		return this
	#END remove

	###
	#
	###
	append: (items) -> @fill(items, {'method': 'append'})

	###
	#
	###
	prepend: (items) -> @fill(items, {'method': 'prepend'})

	###
	# Method: Falcon.Collection#create
	#	Creates a new model and adds it to the list of eisting models, 
	#	also sends off a corresponding ajax request
	#
	# Returns:
	#	_XmlHttpRequest_ - The XHR object that corresponds to this create instance
	#
	# TODO:
	#	Re-evaluate this to work more like the 'destroy' method
	###
	create: (data, options) ->
		return unless @model?
		
		options = {success:options} if isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)

		_success = options.success
		options.success = (model) =>
			@fill(model, options)
			_success.apply(model, arguments)

		return ( new @model(data, @parent).create(options) )
	#END create

	###
	# Method: Falcon.Collection#destroy
	#	Removes the specified models from the collection and database
	#	executing each of te models destory method and passing the
	#	'options' parameter along with the destroy call
	#
	# Arguments:
	#	**models** _(Array)_ - An array of the models to remove, if this is not an array, 
	#						   it will be placed in one as the only object, if the models 
	#						   is a collection, we will destory all of the models in the list.
	#						   When no argument is given for models (or the argument is the 
	#						   string 'all'), we'll destory everything.
	#
	#	**options** _(Object)_ - An optional object of the settings to call when onto each 
	#							 of the destroy methods of the 
	#
	# Returns:
	#	_(Falcon.Collection)_ - This instance
	###
	destroy: (models, options) ->
		return this unless @model?

		models = this.list() unless models? and models isnt 'all'
		models = models.list() if Falcon.isCollection(models)
		models = [models] unless isArray(models)

		return this if isEmpty(models)

		options = {success:options} is isFunction(options)
		options = {} unless isObject(options)
		options.success = (->) unless isFunction(options.success)

		_success = options.success
		options.success = (model) =>
			@remove(model)
			_success.apply(model, arguments)

		for model in models when Falcon.isDataObject(model)
			model.destroy(options) 

		return this
	#END destory

	###
	#
	###
	at: (index) ->
		index = 0 unless isNumber(index)

		list = @list()
		index = 0 if index < 0
		index = list.length-1 if index >= list.length

		return list[index]
	#END at

	###
	#
	###
	first: () ->
		return @list()[0]
	#END first

	###
	#
	###
	last: () ->
		return @list()[@length-1]
	#END last

	###
	#
	###
	map: (mapping) ->

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

		model.map(_mapping) for model in @list() when Falcon.isDataObject( model )
			
		@_mappings.push(_mapping)
			
		return this
	#END map

	###
	# Method: Falcon.Collection#reset
	#	'resets' the internal array of this collection, 
	#	this will make sure the list is an observable array, 
	#	has no elements, and the length is restored to zero
	#
	# Returns:
	#	_Falcon.Collection_ - This instance
	###
	reset: () -> 
		@list = ko.observableArray([]) unless @list?
		@list([])
		@length( @list().length )
		return this
	#END reset
#END Falcon.Collection