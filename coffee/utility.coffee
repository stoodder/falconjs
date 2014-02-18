# ==========================================================
# File: utility.coffee
#	Handles internal utitlity methods so we can reduce
#	our dependency on external libraries for this
# ==========================================================

# -------------------------------------------------
# CHECKING FUNCTIONS
# -------------------------------------------------
isObject = (object) -> object? and Object::toString.call( object ) is "[object Object]"
isFunction = (object) -> object? and Object::toString.call( object ) is "[object Function]"
isBoolean = (object) -> object? and Object::toString.call( object ) is "[object Boolean]"
isArray = (object) -> object? and Object::toString.call( object ) is "[object Array]"
isString = (object) -> object? and Object::toString.call( object ) is "[object String]"
isNumber = (object) -> object? and Object::toString.call( object ) is "[object Number]"
isNaN = (object) -> isNumber(object) and object isnt object
isEmpty = (object) ->
	if not object?
		return true
	else if isString(object) or isArray(object)
		return object.length is 0
	else if isObject(object)
		return false for key, value of object
		return true
	return false
#END is empty

if typeof HTMLElement is "object"
	isElement = (object) -> object instanceof HTMLElement
else
	isElement = (object) -> object? and (object.nodeType is 1) and (typeof object.nodeName is "string")
#END if

# -------------------------------------------------
# STRING FUNCTIONS
# -------------------------------------------------
trim = (str) -> str.replace(/^\s+/, '').replace(/\s+$/, '')
startsWith = (haystack, needle) -> haystack.indexOf(needle) is 0

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

# -------------------------------------------------
# ARRAY FUNCTIONS
# -------------------------------------------------
arrayUnique = (arr) ->
	obj = {}
	obj[key] = true for key in arr
	return (key for key, value of obj)

arrayRemove = (arr, items) ->
	return [] unless isArray(arr)
	items = [items] unless isArray(items)
	for item in items
		arr = (_item for _item in arr when _item isnt item)
	return arr
#END arrayRemove