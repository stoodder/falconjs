# -------------------------------------------------
# STRING FUNCTIONS
# -------------------------------------------------
if String::trim
	trim = (str) -> String::trim.call(str)
else
	trim = (str) -> str.replace(/^\s+/, '').replace(/\s+$/, '')
#END if
startsWith = (haystack, needle) -> haystack.indexOf(needle) is 0