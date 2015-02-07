
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-react');

  grunt.registerTask('default', ['less', 'react']);
  grunt.registerTask('live', ['watch', 'less', 'react']);

};