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
trimSlashes = (str) -> str.replace(/^\//, '').replace(/\/$/, '')
startsWith = (haystack, needle) -> haystack.indexOf(needle) is 0
endsWith = (haystack, needle) ->  haystack.indexOf(needle, haystack.length - needle.length) isnt -1
countSubstrings = (str, substr) -> str.split(substr).length - 1

# -------------------------------------------------
# OBJECT FUNCTIONS
# -------------------------------------------------
objectKeys = (obj) -> (key for key of obj)
objectValues = (obj) -> (value for key, value of obj)
objectsEqual = (obj1, obj2) ->
	for key, value of obj1
		return false if obj2[key] isnt value
	for key, value of obj2
		return false if obj1[key] isnt value
	return true
compact = (obj) ->
	obj = {} unless isObject(obj)
	newObj = {}
	(newObj[key] = value if value?) for key, value of obj
	return newObj
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

#Flattens the object's keys into an array
#TODO:  Try to optimize things that call this method, 
#		usually this results in being re-inflated to an object later
flattenObjectKeys = (obj, prefix) ->
	flat = []
	prefix = "" unless isString( prefix )

	for key, value of obj
		if isObject( value )
			flat = flat.concat( flattenObjectKeys( value, "#{prefix}#{key}." ) )
		else
			flat.push( "#{prefix}#{key}")
		#END if
	#END for

	return flat
#END flattenObjectKeys

		

# -------------------------------------------------
# ARRAY FUNCTIONS
# -------------------------------------------------
arraysEqual = (arr1, arr2) ->
	return false if arr1.length isnt arr2.length
	for value, index in arr1
		return false if arr2[index] isnt value
	return true
arrayPeek = (arr) -> arr[arr.length - 1]
arrayContains = (haystack, needle) ->
	if isFunction( haystack.indexOf )
		return haystack.indexOf(needle) isnt -1
	else if isArray( haystack )
		for hay in haystack
			return true if hay is needle
	return false
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

# -------------------------------------------------
# TIMING FUNCTIONS
# -------------------------------------------------
delay = (time, callback) ->
	[time, callback] = [callback, time] if isFunction(time)

	time = 1 unless isNumber(time)
	callback = (->) unless isFunction(callback)

	time = 1 if time < 1

	setTimeout(callback, time)

defer = (callback) -> 
	callback = (->) unless isFunction(callback)
	setTimeout(callback, 1)
