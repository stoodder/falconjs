
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-concat')

	grunt.registerTask('default', ['coffee', 'uglify', 'sass', 'concat', 'copy', 'watch'])

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')

		coffee:
			dist:
				options:
					join: true
				#END options
				files:
					"assets/scripts/falcon.docs.js": ["_private/coffee/*.coffee"]
				#END files
			#END dist
		#END coffee

		uglify: 
			dist:
				files:
					'assets/scripts/falcon.docs.min.js': ["assets/scripts/falcon.docs.js"]
				#END files
			#END fist
		#END uglify

		sass:
			dist:
				options:
					style: 'compressed'
					noCache: true
				#END options
				files:
					'assets/css/falcon.docs.min.css': '_private/sass/falcon.docs.sass'
				#END fiels
			#END dist
		#END sass

		concat:
			object:
				options:
					banner: "---\nlayout: object\n---\n"
				#END options
				files:
					'docs/object/index.html': [
						"docs/object/_extend.html"
						"docs/object/_defaults.html"
						"docs/object/_observables.html"
						"docs/object/_on.html"
						"docs/object/_off.html"
						"docs/object/_trigger.html"
						"docs/object/_has.html"
						"docs/object/_listenTo.html"
						"docs/object/_stopListening.html"
						"docs/object/_*.html"
					]
			#END object

			model:
				options:
					banner: "---\nlayout: model\n---\n"
				#END options
				files:
					'docs/model/index.html': [
						"docs/model/_constructor.html"
						"docs/model/_extend.html"
						"docs/model/_url.html"
						"docs/model/_parent.html"
						"docs/model/_defaults.html"
						"docs/model/_observables.html"
						"docs/model/_*.html"
					]
			#END model

			collection:
				options:
					banner: "---\nlayout: collection\n---\n"
				#END options
				files:
					'docs/collection/index.html': [
						"docs/collection/_constructor.html"
						"docs/collection/_extend.html"
						"docs/collection/_model.html"
						"docs/collection/_url.html"
						"docs/collection/_parent.html"
						"docs/collection/_defaults.html"
						"docs/collection/_observables.html"
						"docs/collection/_*.html"
					]
			#END collection

			view:
				options:
					banner: "---\nlayout: view\n---\n"
				#END options
				files:
					'docs/view/index.html': [
						"docs/view/_constructor.html"
						"docs/view/_extend.html"
						"docs/view/_url.html"
						"docs/view/_defaults.html"
						"docs/view/_observables.html"
						"docs/view/_*.html"
					]
			#END view

			adapter:
				options:
					banner: "---\nlayout: adapter\n---\n"
				#END options
				files:
					'docs/adapter/index.html': [
						"docs/adapter/_about_adapters.html"
						"docs/adapter/_list_of_adapters.html"
						"docs/adapter/_extend.html"
						"docs/adapter/_sync.html"
						"docs/adapter/_standardizeOptions.html"
						"docs/adapter/_getTemplate.html"
						"docs/adapter/_successResponseHandler.html"
						"docs/adapter/_errorResponseHandler.html"
						"docs/adapter/_completeResponseHandler.html"
						"docs/adapter/_*.html"
					]
			#END adapter

			bindings:
				options:
					banner: "---\nlayout: bindings\n---\n"
				#END options
				files:
					'docs/bindings/index.html': [
						"docs/bindings/_view.html"
						"docs/bindings/_*.html"
					]
			#END bindings

			utility:
				options:
					banner: "---\nlayout: utility\n---\n"
				#END options
				files:
					'docs/utility/index.html': [
						"docs/utility/_apply.html"
						"docs/utility/_addBinding.html"
						"docs/utility/_*.html"
					]
			#END bindings
		#END concat

		copy:
			dist:
				files: [
					{src: [
						"../falconjs/falcon.js"
						"../falconjs/falcon.min.js"
						"../falconjs/falcon.conductor.js"
						"../falconjs/falcon.conductor.min.js"
					], dest: "assets/scripts/", expand: true, flatten: true, filter: "isFile"}
				]
			#END dist

			adapter:
				files: [
					{src: [
						"../falconjs/adapters/*.js"
					], dest: "assets/scripts/adapters/", expand: true, flatten: true, filter: "isFile"}
				]
			#END adapter

			test:
				files: [
					{cwd: "../falconjs"
					src: [
						"tests/*.*"
						"tests/**/*.*"
					], dest: "../falconjs-pages/", expand: true}
				]
			#END test
		#END copy

		watch:
			coffee:
				files: ["_private/coffee/*.coffee"]
				tasks: ["coffee", "uglify"]
			#END coffee

			sass:
				files: ['_private/sass/*.sass']
				tasks: ['sass']
			#END sass

			'concat:object':
				files: ['docs/object/_*.html']
				tasks: ['concat:object']
			#END concat:model

			'concat:model':
				files: ['docs/model/_*.html']
				tasks: ['concat:model']
			#END concat:model

			'concat:collection':
				files: ['docs/collection/_*.html']
				tasks: ['concat:collection']
			#END concat:collection

			'concat:view':
				files: ['docs/view/_*.html']
				tasks: ['concat:view']
			#END concat:view

			'concat:adapter':
				files: ['docs/adapter/_*.html']
				tasks: ['concat:adapter']
			#END concat:adapter

			'concat:bindings':
				files: ['docs/bindings/_*.html']
				tasks: ['concat:bindings']
			#END concat:bindings

			'concat:utility':
				files: ['docs/utility/_*.html']
				tasks: ['concat:utility']
			#END concat:utility

			'copy:dist':
				files: ['../falconjs/*.js']
				tasks: ['copy:dist']
			#END copy:dist

			'copy:adapter':
				files: ['../falconjs/adapters/*.js']
				tasks: ['copy:adapter']
			#END copy:adapter

			'copy:test':
				files: ['../falconjs/tests/*.*','../falconjs/tests/**/*.*']
				tasks: ['copy:test']
			#END copy:test
		#END watch
	#END initConfig
#END exports