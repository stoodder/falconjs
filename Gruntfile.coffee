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

	grunt.registerTask('test', ['coffee:test', 'jasmine:dist'])
	grunt.registerTask('default', [
		'coffee:banner'
		'update_banner'
		'coffee:dist'
		'uglify:dist'
		'coffee:test'
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
						"coffee/utility.coffee"
						"coffee/falcon.coffee"
						"coffee/falcon.object.coffee"
						"coffee/falcon.adapter.coffee"
						"coffee/adapters/jquery_adapter.coffee"
						"coffee/falcon.model.coffee"
						"coffee/falcon.view.coffee"
						"coffee/falcon.collection.coffee"
						"coffee/falcon.ko.bindings.coffee"
					]
				#END files
			#END coffee:dist

			'test':
				files:
					"tests/scripts/jasmine2.0.0-sinon.js": ["tests/coffee/jasmine2.0.0-sinon.coffee"]
					"tests/scripts/tests.js": [
						"tests/coffee/falcon.test.coffee"
						"tests/coffee/falcon.object.test.coffee"
						"tests/coffee/falcon.model.test.coffee"
						"tests/coffee/falcon.collection.test.coffee"
						"tests/coffee/falcon.view.test.coffee"
						"tests/coffee/falcon.ko.bindings.test.coffee"
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
					'<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
				#END files
			#END uglifY:dist
		#END uglify

		'jasmine':
			'dist':
				src: 'falcon.min.js'
				options:
					vendor: [
						'tests/scripts/sinon-1.7.3.js'
						'tests/scripts/jasmine2.0.0-sinon.js'
						'tests/scripts/jquery-1.10.2.min.js'
						'tests/scripts/knockout-3.0.0.min.js'
					]
					specs: 'tests/scripts/tests.js'
				#END options
			#END jasmine:dist
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

			'test_copy':
				'files': ['falcon.js', 'falcon.min.js', 'scripts/*.js']
				'tasks': ['copy:test']
			#END test_copy
		#END watch
	#END initConfig
#END exports
