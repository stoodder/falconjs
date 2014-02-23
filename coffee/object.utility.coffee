# -------------------------------------------------
# OBJECT FUNCTIONS
# -------------------------------------------------
objectKeys = (obj) -> (key for key of obj)
extend = (obj, extender) ->
	obj ?= {}
	extender = {} unless isObject(extender)

	obj[key] = value for key, value of extender

	return obj

findKey = (obj, value) ->
	for k, v of obj
		return k if v is value 
	return undefined
#END findKey

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