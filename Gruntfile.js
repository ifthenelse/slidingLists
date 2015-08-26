module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("slidingLists.jquery.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

        // Concat definitions
        concat: {
            dist: {
                src: ["src/<%= pkg.name %>.js"],
                dest: "dist/<%= pkg.name %>.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },

        // Lint definitions
        jshint: {
            files: ["src/<%= pkg.name %>.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        // Minify definitions
        uglify: {
            my_target: {
                src: ["dist/<%= pkg.name %>.js"],
                dest: "dist/<%= pkg.name %>.min.js"
            },
            options: {
                sourceMap: true,
                banner: "<%= meta.banner %>"
            }
        },

        // Compile SASS in CSS
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/<%= pkg.name %>.css': 'src/<%= pkg.name %>.sass'
                }
            }
        },

        // CoffeeScript compilation
        coffee: {
            compile: {
                files: {
                    "dist/<%= pkg.name %>.js": "src/<%= pkg.name %>.coffee"
                }
            }
        },

        // watch for changes to source
        // Better than calling grunt a million times
        // (call 'grunt watch')
        watch: {
            files: ['src/*'],
            tasks: ['default']
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-coffee");
    grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("build", ["concat", "uglify"]);
    grunt.registerTask("default", ["jshint", "concat", "uglify", "sass"]);
    grunt.registerTask("travis", ["jshint"]);

};
