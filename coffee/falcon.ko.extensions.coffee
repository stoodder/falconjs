#--------------------------------------------------------
# Extends onto the context varibales utilized in knockout templating
# to include $view (to access this view's members easily)
#--------------------------------------------------------
_bindingContext = ko.bindingContext
ko.bindingContext = (dataItem, parentBindingContext) ->
	if not this['$view']? and parentBindingContext?
		this['$view'] = parentBindingContext['$view'] or parentBindingContext['$root']
	#end if
	
	_bindingContext.call(this, dataItem, parentBindingContext)
#END ko.bindingContext extension
ko.bindingContext.prototype = _bindingContext.prototype

ko.virtualElements.allowedBindings['view'] = true
ko.virtualElements.allowedBindings['log'] = true
ko.virtualElements.allowedBindings['collection'] = true

ko.subscribable.fn.classify = (identifiers...) ->
	extenders = {}
	
	for identifier in identifiers when isString(identifier) and not isEmpty(trim(identifier))
		identifier = trim(identifier)
		extenders[identifier] = true
	#END for

	return this.extend(extenders) 
#END classify