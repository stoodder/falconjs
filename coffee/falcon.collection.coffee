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
		[parent, models] = [models, parent] if not parent? and models instanceof Falcon.Model

		@url ?= @model::url if @model?
		@parent = parent
		@_mappings = []
		@reset().add(models)
		@initialize(models)

	###
	#
	###
	initialize: (->)

	###
	#
	###
	data: (models) ->
		if isEmpty(models)
			ret = []

			for i, value of @list()
				if value instanceof Falcon.Model or value instanceof Falcon.Collection
					ret[i] = value.data()
				else
					ret[i] = value

			return ret

		@add(models)

		return this

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

		url = if isFunction(@url) then @url() else @url

		return unless url? and isString(url)

		$.ajax(
			url: trim(url)
			type: type
			data: data
			dataType: 'json'
			success: (args...) =>
				data = args[0] ? {}
				data = JSON.parse( data ) if isString(data)

				@add(data, options) 

				options.success(args...)
			error: options.error
		)

	###
	#
	###
	add: (items, options) ->
		return this unless @model?

		items ?= []
		options ?= {}

		items = @parse(items)
		options = {} unless isObject(options)

		{prepend, append, replace} = options

		prepend = false unless isBoolean(prepend)
		append = false unless isBoolean(append)
		replace = ( not prepend and not append ) unless isBoolean(replace)

		for item in items when item instanceof Falcon.Model or item instanceof Falcon.Collection
			item.on("destroy", (model) => @remove(model)) if item instanceof Falcon.Model
			item.map(mapping) for mapping in @_mappings

		if replace
			@reset().list(items)
		else if prepend
			@list.unshift(items.pop()) while items.length > 0
		else if append
			@list.push(items.shift()) while items.length > 0
		
		@length = @list().length

		return this

	###
	#
	###
	remove: (items) ->
		if isArray(items) then @list.removeAll(items) else @list.remove(items)

		return this

	###
	#
	###
	append: (items) -> @add(items, append:true)

	###
	#
	###
	prepend: (items) -> @add(items, prepend:true)

	###
	#
	###
	create: (data, options) ->
		return unless @model?
		
		options = {success:options} if isFunction(options)
		options = {} unless isObject(options)

		_success = options.success
		options.success = (model) =>
			@add(model, options)
			_success.apply(model, arguments)

		return ( new @model(data, @parent).create(options) )

	###
	#
	###
	at: (index) ->
		index = 0 unless isNumber(index)

		list = @list()
		index = 0 if index < 0
		index = list.length-1 if index >= list.length

		return list[index]

	###
	#
	###
	map: (mapping) ->

		mapping = {} unless isObject(mapping)

		for key, value of mapping
			if isFunction(value) and not ko.isObservable(value)
				value = do =>
					_value = value
					return ( => _value.call(arguments[0], arguments[0], this)  )
			mapping[key] = value

		model.map(mapping) for model in @list() when Falcon.isDataObject( model )
			

		@_mappings.push(mapping)
			
		return this

	###
	#
	###
	parse: (items) ->

		items = [items] unless isArray(items)

		return items unless @model?

		for i, m of items when not ( m instanceof Falcon.Model )
			items[i] = new @model(m, @parent) 
		
		return items

	###
	#
	###
	reset: () -> 
		@list = ko.observableArray([]) unless @list?
		@list([])
		@length = @list().length
		return this


@hfhfhfhfh = 0