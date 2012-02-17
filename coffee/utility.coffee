# ==========================================================
# File: utility.coffee
#	Handles internal utitlity methods so we can reduce
#	our dependency on external libraries for this
# ==========================================================

# -------------------------------------------------
# CHECKING FUNCTIONS
# -------------------------------------------------
isObject = (object) -> (typeof object) is (typeof {}) and object isnt null
isFunction = (object) -> Object::toString.call( object ) is "[object Function]"
isArray = (object) -> Object::toString.call( object ) is "[object Array]"
isString = (object) -> Object::toString.call( object ) is "[object String]"
isNumber = (object) -> Object::toString.call( object ) is "[object Number]"

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
	obj = {} unless isObject(obj)
	extender = {} unless isObject(extender)

	obj[key] = value for key, value of extender

	return obj

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