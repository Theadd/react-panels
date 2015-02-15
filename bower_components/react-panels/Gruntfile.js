
'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      styles: {
        files: ['src/less/**'],
        tasks: ['less'],
        options: {
          spawn: true,
          interrupt: true
        }
      },
      sources: {
        files: ['src/jsx/**', 'examples/bootstrap.html_files/src/**'],
        tasks: ['react'],
        options: {
          spawn: true,
          interrupt: true
        }
      },
      docs: {
        files: ['dist/react-panels.js'],
        tasks: ['jsdoc'],
        options: {
          spawn: true,
          interrupt: false
        }
      },
      commonjs: {
        files: ['src/jsx/**'],
        tasks: ['concat'],
        options: {
          spawn: true,
          interrupt: false
        }
      },
      jsmin: {
        files: ['dist/react-panels.js'],
        tasks: ['uglify'],
        options: {
          spawn: true,
          interrupt: false
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ["src/less"]
        },
        files: {
          "dist/react-panels.css": "src/less/main.less",
          "dist/react-panels.base.css": "src/less/base.less"
        }
      },
      production: {
        options: {
          paths: ["src/less"],
          compress: true
        },
        files: {
          "dist/react-panels.min.css": "src/less/main.less",
          "dist/react-panels.base.min.css": "src/less/base.less"
        }
      }
    },
    react: {
      combined_file_output: {
        files: {
          'dist/react-panels.js': [
            'src/jsx/rpanel.jsx',
            'src/jsx/rcontent.jsx',
            'src/jsx/rbutton.jsx'
          ],
          'examples/bootstrap.html_files/main.js': [
            'examples/bootstrap.html_files/src/buttons.jsx',
            'examples/bootstrap.html_files/src/toolbars.jsx',
            'examples/bootstrap.html_files/src/panel-contents.jsx',
            'examples/bootstrap.html_files/src/panels.jsx',
            'examples/bootstrap.html_files/src/main.jsx'
          ]
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['dist/react-panels.js'],
        options: {
          destination: 'docs/dist',
          template : "docs/templates/jaguar",
          configure : "docs/templates/jaguar/conf.json"
        }
      }
    },
    concat: {
      js: {
        src: [
          'src/misc/START',
          'src/jsx/rpanel.jsx',
          'src/jsx/rcontent.jsx',
          'src/jsx/rbutton.jsx',
          'src/misc/END'
        ],
        dest: 'index.js'
      }
    },
    uglify: {
      components: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/react-panels.min.js': ['dist/react-panels.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['less', 'react', 'jsdoc', 'concat', 'uglify']);
  grunt.registerTask('live', ['watch', 'less', 'react', 'jsdoc', 'concat', 'uglify']);
  grunt.registerTask('live-base', ['watch', 'less', 'react']);

};