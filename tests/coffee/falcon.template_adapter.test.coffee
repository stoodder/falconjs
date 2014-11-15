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
#END describe