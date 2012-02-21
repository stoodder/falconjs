class Falcon.Class
	super: () ->

	@extend = (parent, definition) ->
		parent ?= Falcon.Class
		child = null

		if definition? and definition.hasOwnProperty("constructor")
			child = definition.constructor
		else
			child = -> @__super__(arguments...)
		
		ctor = (->)
		ctor.prototype = parent.prototype
		child.prototype = new ctor
		child.prototype.__super__ = () -> parent.apply(this, arguments)
		child.extend = (definition) -> Falcon.Class.extend(child, definition)

		extend( child.prototype, definition ? {} )

		return child