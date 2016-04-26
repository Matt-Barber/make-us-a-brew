module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: {
        files: {
            src: 'src/js/*',  // source files mask
            dest: 'build/js',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            ext: '.js'   // replace .js to .min.js
        }
    },
    watch: {
        js:  { files: 'src/js/*.js', tasks: [ 'uglify' ] },
    },
    pug: {
        pretty: {
            files: {
                'build/index.html': ['src/views/index.jade']
            },
            options: {
                pretty: true
            }
        }
      }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-pug');
// register at least this one task
grunt.registerTask('default', ['uglify', 'pug']);
};
