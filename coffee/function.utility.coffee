bindFunction = (func, self) ->
	ret = -> func.apply(self, arguments)
	ret.__falcon_bind__length__ = func.length
	return ret
#END bindFunction