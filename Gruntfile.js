
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
      }
    },
    less: {
      development: {
        options: {
          paths: ["src/less"]
        },
        files: {
          "dist/react-panels.css": "src/less/rpanel.less"
        }
      },
      production: {
        options: {
          paths: ["src/less"],
          compress: true
        },
        files: {
          "dist/react-panels.min.css": "src/less/rpanel.less"
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['less', 'react', 'jsdoc']);
  grunt.registerTask('live', ['watch', 'less', 'react', 'jsdoc', 'concat']);

};