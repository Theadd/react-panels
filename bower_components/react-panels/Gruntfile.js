
'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    watch: {
      sources: {
        files: ['src/jsx/**', 'examples/floating/src/**'],
        tasks: ['react'],
        options: {
          spawn: true,
          interrupt: true
        }
      },
      build: {
        files: ['build/**'],
        tasks: ['concat'],
        options: {
          spawn: true,
          interrupt: true
        }
      },
      reactdev: {
        files: ['src/jsx/**', 'examples/floating/src/**'],
        tasks: ['react'],
        options: {
          spawn: false,
          interrupt: false
        }
      },
      builddev: {
        files: ['build/react-panels.js'],
        tasks: ['concat:basic'],
        options: {
          spawn: false,
          interrupt: false
        }
      },
      jsmin: {
        files: ['dist/react-panels.js', 'dist/react-panels-with-addons.js'],
        tasks: ['uglify'],
        options: {
          spawn: true,
          interrupt: false
        }
      }
    },
    react: {
      combined_file_output: {
        files: {
          'build/react-panels.js': [
            'src/jsx/styles/themes/flexbox.js',
            'src/jsx/styles/themes/chemical.js',
            'src/jsx/styles/base.js',
            'src/jsx/utils.js',
            'src/jsx/mixins.js',
            'src/jsx/panel.js',
            'src/jsx/tab.js',
            'src/jsx/buttons.js',
            'src/jsx/ext.js'
          ],
          'build/addons.js': [
            'src/jsx/addons/scrollable-tab-content.js'
          ],
          'examples/floating/floating.js': [
            'examples/floating/src/item-tab.jsx',
            'examples/floating/src/main-tab.jsx',
            'examples/floating/src/app.jsx'
          ]
        }
      }
    },
    concat: {
      basic: {
        src: ['src/misc/HEADER', 'build/react-panels.js', 'src/misc/FOOTER'],
        dest: 'dist/react-panels.js'
      },
      addons: {
        src: ['src/misc/HEADER', 'build/react-panels.js', 'build/addons.js', 'src/misc/FOOTER'],
        dest: 'dist/react-panels-with-addons.js'
      },
      basicC: {
        src: ['src/misc/HEADER_C', 'build/react-panels.js', 'src/misc/FOOTER_C'],
        dest: 'index.js'
      },
      addonsC: {
        src: ['src/misc/HEADER_C', 'build/react-panels.js', 'build/addons.js', 'src/misc/FOOTER_C'],
        dest: 'addons.js'
      }
    },
    uglify: {
      components: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/react-panels.min.js': ['dist/react-panels.js'],
          'dist/react-panels-with-addons.min.js': ['dist/react-panels-with-addons.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['react', 'concat', 'uglify']);
  grunt.registerTask('watch-dev', ['watch:reactdev', 'watch:builddev', 'react', 'concat:basic']);
  grunt.registerTask('live', ['watch', 'react', 'concat', 'uglify']);
  grunt.registerTask('live-dev', ['watch', 'react', 'concat']);

};