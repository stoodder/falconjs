
$ ->
	startBodyScroll = (event) ->
		document.body.style.overflow = "auto"
		document.body.removeAttribute("scroll")
		event.stopPropagation()
		event.preventDefault()
	#END startBodyScroll

	stopBodyScroll = (event) ->
		document.body.style.overflow = "hidden"
		document.body.setAttribute("scroll", "no")
		event.stopPropagation()
		event.preventDefault()
	#END stopBodyScroll

	$("iframe").on("mouseenter", stopBodyScroll)
	$("iframe").on("mouseleave", startBodyScroll)
	$("body").on("mouseenter", startBodyScroll)
#END onload