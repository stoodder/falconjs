###
#=================================================
#
#  Setup
#
#=================================================

Install Node.js (http://nodejs.org/)
npm install -g grunt-cli
npm install
grunt

###
CoffeeScript = require('coffee-script')

module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-jasmine')
	grunt.loadNpmTasks('grunt-contrib-watch')

	grunt.registerTask('test', ['coffee:test', 'jasmine'])
	grunt.registerTask('default', [
		'update_banner'
		'coffee:dist'
		'coffee:adapters'
		'uglify:dist'
		'uglify:adapters'
		'copy'
		'watch'
	])

	grunt.registerTask 'update_banner', 'updates the banner information', ->
		try
			banner = grunt.file.read('coffee/banner.coffee').toString()
			banner = CoffeeScript.compile(banner, {bare: true})
		catch e
			banner = ""
		#END try

		uglfiy_cfg = grunt.config('uglify')
		uglfiy_cfg.dist.options.banner = banner

		grunt.config('uglify', uglfiy_cfg)
	#END registerTask
	
	grunt.initConfig
		'pkg': grunt.file.readJSON('package.json')

		'coffee':
			'dist':
				options:
					join: true
				#END options

				files:
					'falcon.js': [
						"coffee/banner.coffee"

						"coffee/checking.utility.coffee"
						"coffee/string.utility.coffee"
						"coffee/function.utility.coffee"

						"coffee/falcon.object.coffee"
						"coffee/falcon.data_adapter.coffee"
						"coffee/falcon.template_adapter.coffee"
						"coffee/falcon.model.coffee"
						"coffee/falcon.collection.coffee"
						"coffee/falcon.view.coffee"
						"coffee/falcon.coffee"
						"coffee/falcon.ko.component_loader.coffee"
						"coffee/falcon.ko.bindings.coffee"
						
					]
				#END files
			#END coffee:dist

			'adapters':
				options:
					join: true
				#END options

				files:
					'adapters/falcon.jquery_rest_adapter.js': [
						"coffee/checking.utility.coffee"
						"coffee/adapters/jquery_rest_adapter.coffee"
					]
				#END files
			#END coffee:dist

			'test':
				files:
					"tests/lib/jasmine2.0.0-sinon.js": [
						"tests/coffee/jasmine2.0.0-sinon.coffee"
					]

					"tests/scripts/test.helpers.js": [
						"tests/coffee/*.helper.coffee"
					]

					"tests/scripts/falcon.test.js": [
						"tests/coffee/falcon.test.coffee"
						"tests/coffee/falcon.object.test.coffee"
						"tests/coffee/falcon.data_adapter.test.coffee"
						"tests/coffee/falcon.template_adapter.test.coffee"
						"tests/coffee/falcon.model.test.coffee"
						"tests/coffee/falcon.collection.test.coffee"
						"tests/coffee/falcon.view.test.coffee"
						"tests/coffee/falcon.ko.bindings.test.coffee"
					]

					"tests/scripts/adapters/falcon.jquery_rest_adapter.test.js": [
						"tests/coffee/adapters/falcon.jquery_rest_adapter.test.coffee"
					]
				#END files
			#END coffee:test
		#END coffee

		'uglify':
			'dist':
				options:
					'banner': '' #Updated lated in the update_banner task
				#END options
				files:
					'falcon.min.js': 'falcon.js'
				#END files
			#END uglify:dist

			'adapters':
				files:
					'adapters/falcon.jquery_rest_adapter.min.js': 'adapters/falcon.jquery_rest_adapter.js'
				#END files
			#END uglify:adapters
		#END uglify

		'jasmine':
			'dist':
				src: 'falcon.min.js'
				options:
					display: 'short'
					summary: true
					vendor: [
						'tests/lib/sinon-1.7.3.js'
						'tests/lib/jasmine2.0.0-sinon.js'
						'tests/lib/knockout-3.2.0.min.js'
					]
					helpers: [
						'tests/scripts/test.helpers.js'
					]
					specs: 'tests/scripts/falcon.test.js'
				#END options
			#END jasmine:dist

			'adapters':
				src: 'adapters/falcon.jquery_rest_adapter.min.js'
				options:
					summary: true
					vendor: [
						'tests/lib/sinon-1.7.3.js'
						'tests/lib/jasmine2.0.0-sinon.js'
						'tests/lib/jquery-1.10.2.min.js'
						'tests/lib/knockout-3.2.0.min.js'
						'tests/scripts/falcon.min.js'
					]
					helpers: [
						'tests/scripts/test.helpers.js'
					]
					specs: [
						'tests/scripts/adapters/falcon.jquery_rest_adapter.test.js'
					]
				#END options
		#END jasmine

		'copy':
			'test':
				files: [
					{
						expand: true
						dest: 'tests/scripts/'
						filter: 'isFile'
						flatten: true
						src: [
							"falcon.js"
							"falcon.min.js"
						]
					},{
						expand: true
						dest: 'tests/scripts/adapters/'
						filter: 'isFile'
						flatten: true
						src: [
							"adapters/*.js"
						]
					}
				]
			#END copy:test
		#END copy

		'watch':
			'banner_coffee':
				'files': ["coffee/banner.coffee"]
				'tasks': ['update_banner', 'coffee:dist', 'uglify:dist']
			#END watch:banner_coffee

			'dist_coffee':
				'files': ["coffee/falcon.coffee", "coffee/falcon.*.coffee", "coffee/*.utility.coffee"]
				'tasks': ['coffee:dist', 'uglify:dist']
			#END watch:dist_coffee

			'adapters_coffee':
				'files': ["coffee/adapters/*.coffee"]
				'tasks': ['coffee:adapters', 'uglify:adapters']
			#END watch:dist_coffee

			'test_copy':
				'files': ['falcon.js', 'falcon.min.js', 'adapters/*.js']
				'tasks': ['copy:test']
			#END test_copy
		#END watch
	#END initConfig
#END exports
