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