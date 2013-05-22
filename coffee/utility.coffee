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
	if isObject(object)
		return false for key, value of object
		return true
	else if isString(object) or isArray(object)
		return object.length is 0
	else if object is null or typeof object is "undefined"
		return true
	return false
#END is empty

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