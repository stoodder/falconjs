module Haml::Helpers
 	def ko(expression, &block)
		haml_concat( "<!-- ko #{expression} -->" )
		block.call if block
		haml_concat( "<!-- /ko -->" )
	end
end