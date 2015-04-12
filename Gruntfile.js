
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
            'src/jsx/styles/themes/chemical.jsx',
            'src/jsx/styles/base.jsx',
            'src/jsx/utils.jsx',
            'src/jsx/mixins.jsx',
            'src/jsx/panel.jsx',
            'src/jsx/tab.jsx',
            'src/jsx/buttons.jsx',
            'src/jsx/ext.jsx'
          ],
          'build/addons.js': [
            'src/jsx/addons/scrollable-tab-content.jsx'
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
  grunt.registerTask('live', ['watch', 'react', 'concat', 'uglify']);
  grunt.registerTask('live-dev', ['watch', 'react', 'concat']);

};