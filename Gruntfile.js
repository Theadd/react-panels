
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
        files: ['src/jsx/**'],
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
    less: {
      development: {
        options: {
          paths: ["src/less"]
        },
        files: {
          "dist/react-panels.css": "src/less/panel.less"
        }
      },
      production: {
        options: {
          paths: ["src/less"],
          compress: true
        },
        files: {
          "dist/react-panels.min.css": "src/less/panel.less"
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
            'src/jsx/ext.jsx'
          ],
          'build/addons.js': [
            'src/jsx/addons/scrollable-tab-content.jsx'
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['less', 'react', 'concat', 'uglify']);
  grunt.registerTask('live', ['watch', 'less', 'react', 'concat', 'uglify']);

};