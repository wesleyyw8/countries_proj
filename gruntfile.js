module.exports = function(grunt){
  grunt.initConfig({
    concat:{
      js:{
        src: ['ui/controllers/*.js','ui/directives/{,*/}*.js','ui/services/{,*/}*.js' ],
        dest: 'ui/application.js'
      }
    },
      less: {
        'ui/style.css': ['ui/css/*.less','ui/directives/{,*/}*.less']
      },
    watch: {
      scripts: {
        files: ['ui/controllers/*.js','ui/directives/{,*/}*.js','ui/services/{,*/}*.js'],
        tasks: ['concat']
      },
      less: {
        files: ['ui/css/*.less','ui/directives/{,*/}*.less'],
        tasks: ["less"],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['ui/controllers/*.js','ui/css/*.less','ui/directives/{,*/}*.js', 'ui/services/{,*/}*.js', 'ui/directives/{,*/}*.less']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['concat:js','less','watch']);
};