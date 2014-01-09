###
#=================================================
#
#  Setup
#
#=================================================

Install Ruby
Install Node.js (http://nodejs.org/)
npm install -g grunt-cli
gem install haml
npm install coffee-script
npm install grunt --save-dev
npm install grunt-contrib-coffee --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-haml --save-dev
npm install grunt-contrib-copy --save-dev
npm install grunt-contrib-watch --save-dev

###
module.exports = (grunt) ->
	grunt.loadNpmTasks('grunt-contrib-coffee')
	grunt.loadNpmTasks('grunt-contrib-uglify')
	grunt.loadNpmTasks('grunt-contrib-haml')
	grunt.loadNpmTasks('grunt-contrib-copy')
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.registerTask('default', ['coffee', 'uglify', 'haml', 'copy', 'watch'])

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
						"coffee/falcon.model.coffee"
						"coffee/falcon.view.coffee"
						"coffee/falcon.collection.coffee"
						"coffee/falcon.ko.bindings.coffee"
					]
				#END files
			#END coffee:dist

			'test':
				files:
					"tests/scripts/falcon.object.test.js": "tests/coffee/falcon.object.test.coffee"
					"tests/scripts/falcon.model.test.js": "tests/coffee/falcon.model.test.coffee"
					"tests/scripts/falcon.collection.test.js": "tests/coffee/falcon.collection.test.coffee"
					"tests/scripts/falcon.view.test.js": "tests/coffee/falcon.view.test.coffee"
					"tests/scripts/falcon.ko.bindings.test.js": "tests/coffee/falcon.ko.bindings.test.coffee"

					"tests/scripts/demo.js": "tests/coffee/demo.coffee"
				#END files
			#END coffee:test
		#END coffee

		'uglify':
			'dist':
				options:
					banner: banner
				#END options
				files:
					'<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
				#END files
			#END uglifY:dist
		#END uglify

		'haml':
			options:
				'style': 'ugly'
				'double-quote-attributes': true
				'no-escape-attrs': true
				'require': './haml_helpers.rb'
				'bundleExec': false
			#END options
			
			'test':
				'files':
					"tests/demo.html": "tests/demo.haml"
				#END files
			#END haml:test
		#END haml

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
							"scripts/*.js"
						]
					}
				]
			#END copy:test
		#END copy

		'watch':
			'banner_coffee':
				'files': ["coffee/banner.coffee"]
				'tasks': ['coffee:banner']
			#END watch:banner_coffee

			'dist_coffee':
				'files': ["coffee/*.coffee"]
				'tasks': ['coffee:dist', 'uglify:dist']
			#END watch:dist_coffee

			'test_coffee':
				'files': ['tests/coffee/*.coffee']
				'tasks': ['coffee:test']
			#END watch:test_coffee

			'test_haml':
				'files': ['tests/*.haml']
				'tasks': ['haml:test']
			#END watch:test_haml

			'test_copy':
				'files': ['falcon.js', 'falcon.min.js', 'scripts/*.js']
				'tasks': ['copy:test']
			#END test_copy
		#END watch
	#END initConfig
#END exports
