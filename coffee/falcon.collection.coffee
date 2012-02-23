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

	parent: null

	###
	#
	###
	@extend = (definition) -> Falcon.Class.extend(Falcon.Collection, definition)

	###
	#
	###
	constructor: (models, parent) ->
		[parent, models] = [models, parent] if not parent? and models instanceof Falcon.Model

		@parent = parent
		@reset().add(models)
		@initialize(models)

	###
	#
	###
	initialize: (models) ->

	data: (models) ->
		o = ko.observableArray(["Hello", "World"])

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
	fetch: (options) ->
		options = {success: options} if isFunction(options)

		options = {} unless isObject(options)
		options.data = {} unless isObject(options.data)
		options.success = (->) unless isFunction(options.success)
		options.error = (->) unless isFunction(options.error)

		url = if isFunction(@url) then @url() else @url

		return unless url? and isString(url)

		$.ajax(
			url: trim(url)
			type: 'GET'
			data: options.data
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
	append: (items) -> @add(items, append:true)

	###
	#
	###
	prepend: (items) -> @add(items, prepend:true)

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

