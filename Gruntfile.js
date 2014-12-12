'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    root: {
      app: 'app',
      tmp: 'app/.tmp',
      test: 'test',
      dist: 'dist'
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= root.tmp %>',
            '<%= root.dist %>/*',
            '!<%= root.dist %>/.git*'
          ]
        }]
      },
      server: '<%= root.tmp %>'
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= root.app %>',
          dest: '<%= root.dist %>',
          src: [
            '*.{ico,png,txt}',
            '*.html'
          ]
        }]
      },
      fonts: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= root.app %>/fonts',
          dest: '<%= root.dist %>/fonts',
          src: [
            '*.*'
          ]
        }]
      }
    },

    compass: {
      options: {
        sassDir: '<%= root.app %>/styles',
        cssDir: '<%= root.tmp %>/styles',
        generatedImagesDir: '<%= root.tmp %>/images/sprite',
        imagesDir: '<%= root.app %>/images',
        javascriptsDir: '<%= root.app %>/scripts',
        fontsDir: '<%= root.app %>/fonts',
        importPath: '<%= root.app %>/vendor',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          httpImagesPath: '../images',
          httpGeneratedImagesPath: '../images/sprite',
          httpFontsPath: '../fonts'
        }
      },
      app: {
        options: {
          debugInfo: true,
          relativeAssets: true
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%= root.dist %>/styles/main.css': [
            '<%= root.tmp %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= root.app %>/scripts/{,*/}{,*/}*.js',
        '<%= root.test %>/specs/{,*/}{,*/}*.js',
        '<%= root.test %>/runner.js'
      ]
    },

    requirejs: {
      options: {
        optimize: 'uglify',
        preserveLicenseComments: false,
        useStrict: true,
        wrap: false
      },
      dist: {
        options: {
          baseUrl: '<%= root.app %>/scripts',
          include: 'main',
          out: '<%= root.dist %>/scripts/main.js',
          mainConfigFile: '<%= root.app %>/scripts/main.js',
        }
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          '<%= root.dist %>/vendor/requirejs/require.js': ['<%= root.app %>/vendor/requirejs/require.js']
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= root.dist %>/images'
        }]
      }
    },

    svgmin: {
      options: {
        plugins: [{
          removeViewBox: false
        }, {
          removeUselessStrokeAndFill: false
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= root.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= root.dist %>/images'
        }]
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= root.dist %>'
      },
      html: '<%= root.dist %>/index.html'
    },

    usemin: {
      options: {
        assetsDirs: ['<%= root.dist %>']
      },
      html: ['<%= root.dist %>/{,*/}*.html'],
      css: ['<%= root.dist %>/styles/{,*/}*.css']
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= root.dist %>',
          src: '{,*/}*.html',
          dest: '<%= root.dist %>'
        }]
      }
    },

    watch: {
      options: {
        nospawn: true
      },
      compass: {
        files: [
          '<%= root.app %>/styles/{,*/}*{,*/}*.{scss,sass}'
        ],
        tasks: ['compass:app']
      },
      test: {
        files: [
          '<%= root.app %>/scripts/{,*/}{,*/}*.js',
          'Gruntfile.js'
        ],
        tasks: ['test']
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }

  });

  grunt.registerTask('test', [
    'jshint'
  ]);

  grunt.registerTask('build', [
    // 'test',
    'clean:dist',
    'requirejs',
    'useminPrepare',
    'copy',
    'compass:dist',
    'uglify',
    'cssmin',
    'imagemin',
    'svgmin',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'clean:server',
    // 'test',
    'compass:app'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages',
  ]);

};
