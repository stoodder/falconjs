
$ ->
	$("code").each (index, element) ->
		$element = $(element)
		$element.text( $element.html() )

		if $element.hasClass("runnable")
			code = $element.text()
			$runner = $("<div class='runner'><i class='glyphicon glyphicon-play'></div>")
			$element.append($runner)
			$runner.on "click", -> eval( code )
		#END if
	#END
#END onload