#---------------------------------------------------------------------------
# class: Report
#	Class that provides an interface between knockout/falcon and google charts
#---------------------------------------------------------------------------
#-------------------------------------------------------------------------
# Class: Falcon.Report
#-------------------------------------------------------------------------
class Falcon.Report extends Falcon.Class
	#----------------------------------------
	# Class: Axis
	#	Internal class that represents an axis on the reultant graph
	#----------------------------------------
	class Axis
		constructor: ->
			@title = ""
			@format = ""
		#END constructor

		options: () ->
			return { @title, @format }
		#END options
	#END Axis

	###
	# Attribute: Report#columns
	#	A list of columns to use in this format: "[type] [key] [label]"
	#
	#	types: 'string' 'number' 'boolean' 'date' 'datetime' 'timeofday'
	###
	columns: null

	url: null

	_formatting: null

	haxis: null

	vaxis: null

	data: null

	_parameters: null

	response_handler: (->)

	constructor: (url, columns) ->
		super()

		[url, columns] = [columns, url] if isArray(url)
		@url ?= url ? ""
		@columns ?= columns ? []

		@data = ko.observableArray( [] )
		@loading = ko.observable( false )

		@_parameters = {}
		@_formatting = {}
		@_current_request = null

		@haxis = new Axis()
		@vaxis = new Axis()
	#END constructor

	param: (key, value) ->
		@_parameters[key] = value
		return this
	#END param

	fetch: (success) ->

		url = if isFunction( @url ) then @url() else @url
		url = "" unless isString( url )

		return unless isString( url )

		success = (->) unless isFunction( success )

		#Set the loading flag to on
		@loading( true )

		#Generate the parameters list
		params = {}
		for key, _value of @_parameters
			value = ko.utils.unwrapObservable( _value )
			if Falcon.isModel( value )
				params[key] = ko.utils.unwrapObservable( value.id )
			else if isFunction( value )
				params[key] = value()
			else
				params[key] = value
			#END if
		#END for

		#replace any spots in the url where the params match up
		url = url + "/"
		url = url.replace(":#{key}/", "#{value}/") for key, value of params
		url = url.slice(0, -1)

		url = Falcon.baseApiUrl + url

		#Send of and set the current reuqest variable
		@_current_request = $.ajax
			type: "GET"
			url: url
			data: params
			success: (data) => 
				data ?= []
				data = [data] unless isArray( data )
				@data( data )
				@trigger("success", data)

				success.apply( this, arguments )
			#END success

			error: (error) =>
				@trigger("error", error)
			#END error

			complete: () =>
				@_current_request = null
				@loading( false )
			#END complete
		#END ajax
	#END fetch

	request: (chart) ->
		return unless chart?

		@fetch =>
			options = {
				hAxis: @haxis.options()
				vAxis: @vaxis.options()
			}

			chart.draw( @dataTable(), options )
		#END fetch
	#END request



	###
	# Method: Report#format
	#	Formats a specific key as a specific format type
	###
	format: (key, type, options) ->
		key = "" unless _.isString( key )
		type = "" unless _.isString( type )

		key = _.trim( key )
		type = _.trim( type ).toLowerCase()

		return if _.isEmpty( key ) 
		return if _.isEmpty( type )

		formatter = (->)

		if type is "number"
			formatter = -> new google.visualization.NumberFormat(options)
		#END if

		@_formatting[key] = { type, formatter }
	#END format

	parseColumn: ( column_str ) ->
		coumn_str = "" unless _.isString( coumn_str )
		return column_str.split(" ", 3)
	#END parseColumn

	parseItem: ( key, item ) ->
		item = ko.utils.unwrapObservable( item )
		formatting = @_formatting[key]
		if formatting?
			type = formatting['type']
			return parseFloat( item ) if type is "number"
		#END if

		return item
	#END parseItem

	dataTable: ->
		table = new google.visualization.DataTable()
		key_array = []

		#Add the headers and formatting
		for column, index in @columns
			[type, key, label] = @parseColumn( column )
			key_array.push( key )
			table.addColumn( type, label )
			@_formatting[key]['formatter']().format( table, index ) if @_formatting[key]?
		#END for

		#Construct the table rows
		for item in @data() when isObject(item)
			table.addRow( @parseItem( key, item[key] ) for key in key_array )
		#END for

		return table
	#END dataTable
#END Report