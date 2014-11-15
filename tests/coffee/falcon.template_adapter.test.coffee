xdescribe "Falcon.TemplateAdapter", ->
	describe "resolveTemplate", ->
		adapter = new Falcon.TemplateAdapter
		elm_id = "my-template"
		uri = "##{elm_id}"
		callback = null
		template = "Hello World"
		elm = null

		beforeEach ->
			callback = jasmine.createSpy()
			spyOn( document, 'getElementById' ).and.callThrough()

			elm = document.createElement("div")
			elm.setAttribute("id", elm_id)
			elm.innerHTML = template
			document.body.appendChild( elm )
		#END beforeEach

		afterEach ->
			document.body.removeChild( elm )
		#END afterEach

		it "Should throw if an invalid uri is given", ->
			expect( -> adapter.resolveTemplate() ).toThrow()
			expect( -> adapter.resolveTemplate(123) ).toThrow()
		#END it

		it "Should throw if an invalid callback is given", ->
			expect( -> adapter.resolveTemplate(uri) ).toThrow()
			expect( -> adapter.resolveTemplate(uri, 123) ).toThrow()
		#END it

		it "Should retrieve the element and assign the inner html", ->
			ret = adapter.resolveTemplate( uri, callback )

			expect( document.getElementById.calls.count() ).toBe( 1 )
			expect( document.getElementById ).toHaveBeenCalledWith("my-template")

			expect( callback.calls.count() ).toBe( 1 )
			expect( callback ).toHaveBeenCalledWith(template)

			expect( ret ).toBe( adapter )
		#END it

		it "Should assign an empty template to an unfound identifier", ->
			ret = adapter.resolveTemplate( "#the_wrong_template_id", callback )

			expect( document.getElementById.calls.count() ).toBe( 1 )
			expect( document.getElementById ).toHaveBeenCalledWith("the_wrong_template_id")

			expect( callback.calls.count() ).toBe( 1 )
			expect( callback ).toHaveBeenCalledWith("")

			expect( ret ).toBe( adapter )
		#END it
	#END describe

	


	describe "cacheTemplates", ->
		template = document.createElement("template")
		template.setAttribute("id", "test_template_1")
		template.innerHTML = "Hello World 1"

		template2 = document.createElement("template")
		template2.setAttribute("id", "test_template_2")
		template2.innerHTML = "Hello World 2"

		beforeEach ->
			document.body.appendChild( template )
			document.body.appendChild( template2 )

			spyOn( Falcon.View, 'cacheTemplate' )
		#END beforeEach

		it "Should have removed and cached the templates", ->
			templates = document.getElementsByTagName("template")
			expect( templates.length ).toBe( 2 )
			
			ret = Falcon.View.cacheTemplates()
			
			templates = document.getElementsByTagName("template")
			expect( templates.length ).toBe( 0 )

			expect( Falcon.View.cacheTemplate.calls.count() ).toBe( 2 )
			expect( Falcon.View.cacheTemplate.calls.argsFor(0) ).toEqual [
				'#test_template_1'
				'Hello World 1'
			]

			expect( Falcon.View.cacheTemplate.calls.argsFor(1) ).toEqual [
				'#test_template_2'
				'Hello World 2'
			]

			expect( ret ).toBe( Falcon.View )
		#END it

		it "Should work properly if no templates exist", ->
			document.body.removeChild( template )
			document.body.removeChild( template2 )
			
			templates = document.getElementsByTagName("template")
			expect( templates.length ).toBe( 0 )
			
			ret = Falcon.View.cacheTemplates()
			
			templates = document.getElementsByTagName("template")
			expect( templates.length ).toBe( 0 )

			expect( ret ).toBe( Falcon.View )
		#END it
	#END describe

	describe "makeUrl", ->
		it "Should generate the correct relative url from string", ->
			expect( new ViewA().makeUrl() ).toEqual( "/view_a" )
		#END it

		it "Should generate the correct relative url from function", ->
			expect( new ViewB().makeUrl() ).toEqual( "/view_b" )
		#END it

		it "Should generate the correct element id from string", ->
			expect( new ViewC().makeUrl() ).toEqual( "#view_c" )
		#END it

		it "Should generate the correct element id from function", ->
			expect( new ViewD().makeUrl() ).toEqual( "#view_d" )
		#END it

		it "Should generate the correct relative url from string beginning with '/'", ->
			expect( new ViewE().makeUrl() ).toEqual( "/view_e" )
		#END it

		it "Should generate the correct relative url from function beginning with '/'", ->
			expect( new ViewF().makeUrl() ).toEqual( "/view_f" )
		#END it

			


		it "Should generate the correct relative url from string with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewA().makeUrl() ).toEqual( "http://www.falconjs.com/view_a" )
		#END it

		it "Should generate the correct relative url from function with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewB().makeUrl() ).toEqual( "http://www.falconjs.com/view_b" )
		#END it

		it "Should generate the correct element id from string with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewC().makeUrl() ).toEqual( "#view_c" )
		#END it

		it "Should generate the correct element id from function with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewD().makeUrl() ).toEqual( "#view_d" )
		#END it

		it "Should generate the correct relative url from string beginning with '/' with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewE().makeUrl() ).toEqual( "http://www.falconjs.com/view_e" )
		#END it

		it "Should generate the correct relative url from function beginning with '/' with baseTemplateUrl", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com"
			expect( new ViewF().makeUrl() ).toEqual( "http://www.falconjs.com/view_f" )
		#END it

			


		it "Should generate the correct relative url from string with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewA().makeUrl() ).toEqual( "http://www.falconjs.com/view_a" )
		#END it

		it "Should generate the correct relative url from function with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewB().makeUrl() ).toEqual( "http://www.falconjs.com/view_b" )
		#END it

		it "Should generate the correct element id from string with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewC().makeUrl() ).toEqual( "#view_c" )
		#END it

		it "Should generate the correct element id from function with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewD().makeUrl() ).toEqual( "#view_d" )
		#END it

		it "Should generate the correct relative url from string beginning with '/' with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewE().makeUrl() ).toEqual( "http://www.falconjs.com/view_e" )
		#END it

		it "Should generate the correct relative url from function beginning with '/' with baseTemplateUrl ending in '/'", ->
			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewF().makeUrl() ).toEqual( "http://www.falconjs.com/view_f" )
		#END it

		it "Should return an empty string if no url is defined", ->
			expect( new ViewG().makeUrl() ).toEqual( "" )

			Falcon.baseTemplateUrl = "http://www.falconjs.com/"
			expect( new ViewG().makeUrl() ).toEqual( "" )
		#END it
	#END describe
#END describe