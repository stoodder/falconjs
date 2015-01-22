clone = (object) ->
	return object unless isObject( object )
	return new Date(object.getTime()) if object instanceof Date
	if object instanceof RegExp
		flags = ''
		flags += 'g' if object.global?
		flags += 'i' if object.ignoreCase?
		flags += 'm' if object.multiline?
		flags += 'y' if object.sticky?
		return new RegExp(object.source, flags)
	#END if

	newInstance = new object.constructor()
	(newInstance[key] = clone(object[key])) for key of object
	
	return newInstance
#END clone

cloneNodes = (nodes_array) ->
	nodes_array ?= []
	return (node.cloneNode(true) for node in nodes_array)
#END cloneNodes