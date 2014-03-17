
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-sass')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-contrib-concat')

	grunt.registerTask('default', ['coffee', 'uglify', 'sass', 'concat', 'watch'])

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

			'concat:bindings':
				files: ['docs/bindings/_*.html']
				tasks: ['concat:bindings']
			#END concat:bindings

			'concat:utility':
				files: ['docs/utility/_*.html']
				tasks: ['concat:utility']
			#END concat:utility
		#END watch
	#END initConfig
#END exports