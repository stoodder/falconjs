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
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-jasmine')
	grunt.loadNpmTasks('grunt-contrib-watch')

	grunt.registerTask('test', ['coffee:test', 'jasmine'])
	grunt.registerTask('default', [
		'coffee:banner'
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
			banner = grunt.file.read('scripts/banner.js').toString()
			pkg = grunt.file.readJSON('package.json')
		catch e
			banner = ""
		#END try

		banner = banner.replace(/\{\{VERSION\}\}/gi, pkg.version)

		uglfiy_cfg = grunt.config('uglify')
		uglfiy_cfg.dist.options.banner = banner

		grunt.config('uglify', uglfiy_cfg)
	#END registerTask

	banner = grunt.file.read('scripts/banner.js').toString()
	
	grunt.initConfig
		'pkg': grunt.file.readJSON('package.json')

		'coffee':
			'banner':
				options:
					bare: true
				#END options

				files:
					'scripts/banner.js': ["coffee/banner.coffee"]
				#END files
			#END banner

			'dist':
				options:
					join: true
					banner: banner
				#END options

				files:
					'<%= pkg.name %>.js': [
						"coffee/banner.coffee"

						"coffee/checking.utility.coffee"
						"coffee/string.utility.coffee"
						"coffee/object.utility.coffee"
						"coffee/array.utility.coffee"

						"coffee/falcon.coffee"
						"coffee/falcon.object.coffee"
						"coffee/falcon.adapter.coffee"
						"coffee/falcon.model.coffee"
						"coffee/falcon.view.coffee"
						"coffee/falcon.collection.coffee"
						"coffee/falcon.ko.bindings.coffee"
					]
				#END files
			#END coffee:dist

			'adapters':
				options:
					join: true
					banner: banner
				#END options

				files:
					'adapters/falcon.jquery_adapter.js': [
						"coffee/checking.utility.coffee"
						"coffee/adapters/jquery_adapter.coffee"
					]
				#END files
			#END coffee:dist

			'test':
				files:
					"tests/lib/jasmine2.0.0-sinon.js": ["tests/coffee/jasmine2.0.0-sinon.coffee"]
					"tests/scripts/falcon.tests.js": [
						"tests/coffee/falcon.test.coffee"
						"tests/coffee/falcon.object.test.coffee"
						"tests/coffee/falcon.adapter.test.coffee"
						"tests/coffee/falcon.model.test.coffee"
						"tests/coffee/falcon.collection.test.coffee"
						"tests/coffee/falcon.view.test.coffee"
						"tests/coffee/falcon.ko.bindings.test.coffee"
					]
					"tests/scripts/adapters/falcon.jquery_adapter.test.js": ["tests/coffee/adapters/falcon.jquery_adapter.test.coffee"]
				#END files
			#END coffee:test
		#END coffee

		'uglify':
			'dist':
				options:
					'banner': '' #Updated lated in the update_banner task
				#END options
				files:
					'<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
				#END files
			#END uglify:dist

			'adapters':
				files:
					'adapters/falcon.jquery_adapter.min.js': 'adapters/falcon.jquery_adapter.js'
				#END files
			#END uglify:adapters
		#END uglify

		'jasmine':
			'dist':
				src: [
					'falcon.min.js'
				]
				options:
					vendor: [
						'tests/scripts/sinon-1.7.3.js'
						'tests/scripts/jasmine2.0.0-sinon.js'
						'tests/scripts/knockout-3.0.0.min.js'
					]
					specs: 'tests/scripts/falcon.tests.js'
				#END options
			#END jasmine:dist

			'adapters':
				src: [
					'adapters/falcon.jquery_adapter.min.js'
				]
				options:
					vendor: [
						'tests/scripts/sinon-1.7.3.js'
						'tests/scripts/jasmine2.0.0-sinon.js'
						'tests/scripts/jquery-1.10.2.min.js'
						'tests/scripts/knockout-3.0.0.min.js'
						'tests/scripts/falcon.min.js'
					]
					specs: [
						'tests/scripts/adapters/falcon.jquery_adapter.test.js'
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
				'tasks': ['coffee:banner', 'update_banner', 'coffee:dist', 'uglify:dist']
			#END watch:banner_coffee

			'dist_coffee':
				'files': ["coffee/*.coffee"]
				'tasks': ['coffee:dist', 'uglify:dist']
			#END watch:dist_coffee

			'adapters_coffee':
				'files': ["coffee/adapters/*.coffee"]
				'tasks': ['coffee:adapters', 'uglify:adapters']
			#END watch:dist_coffee

			'test_copy':
				'files': ['falcon.js', 'falcon.min.js', 'scripts/*.js', 'adapters/*.js']
				'tasks': ['copy:test']
			#END test_copy
		#END watch
	#END initConfig
#END exports
