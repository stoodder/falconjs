
$ ->
	$("code").each (index, element) ->
		$element = $(element)
		html = $element.html().replace(/\&lt;/gi, "<").replace(/\&gt;/gi, ">")
		$element.text( html )

		if $element.hasClass("runnable")
			code = $element.text()
			$runner = $("<div class='runner'><i class='glyphicon glyphicon-play'></div>")
			$element.append($runner)
			$runner.on "click", ->
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