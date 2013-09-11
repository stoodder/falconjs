window.logger = (logger_id, value) ->
	console.log( value )
	if (value instanceof Array) and (first_value = value[0])
		if Falcon.isModel( first_value ) and first_value.get("name")?
			value = ( v.get("name") for v in value )
		#END if
	#END if
	$("##{logger_id}").append("<div>#{value}</div>").toggleClass("visible", true)
#END logger
$ ->
	logger_index = 0

	$("code").each (index, element) ->
		$element = $(element)
		html = $element.html().replace(/\&lt;/gi, "<").replace(/\&gt;/gi, ">")
		$element.text( html )

		if $element.hasClass("runnable")
			code = $element.text()
			logger_id = "__logger_#{logger_index++}__"
			code = code.replace(/console\.log\(/gi, "logger('#{logger_id}',")
			$runner = $("<div class='runner'><i class='glyphicon glyphicon-play'></div>")
			$logger = $("<div class='logger' id='#{logger_id}'></div>")
			$element.append($runner)
			$element.append($logger)

			$runner.on "click", ->
				$(@).siblings(".logger").empty();

				_ajax = $.ajax
				$.ajax = (->)

				aUrl = Falcon.baseApiUrl
				tUrl = Falcon.baseTemplateUrl
				eval( code )
				Falcon.baseApiUrl = aUrl
				Falcon.baseTemplateUrl = tUrl
				
				$.ajax = _ajax
			#END on click
		#END if
	#END
#END onload