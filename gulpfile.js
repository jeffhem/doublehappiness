'use strict';

// general
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;

// babel
var webpack = require("webpack");
var gutil = require("gulp-util");
var path = require('path');

// sass
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// html
var minifyHTML = require('gulp-html-minifier');

// images
var imagemin = require('gulp-imagemin');
var newer = require('gulp-newer');

// javascript
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// browserSync
var browserSync = require('browser-sync').create();

// environment flags
var env = 'dev'; // default
// env = 'prod'; // default
var gulpif = require('gulp-if');

//////////////////////////////////////////////////
// Variables
//////////////////////////////////////////////////

var sourceDir = 'client';
var destDir = 'public';
var tempDir = 'dist';

var config = {
  cssSrcDir: sourceDir + '/scss',
  jsSrcDir: sourceDir + '/js',
  imgSrcDir: sourceDir + '/img',
  autoprefixer: {
    browsers: ['> 1%', 'last 2 versions'],
    cascade: true,
    remove: true
  }
};

//////////////////////////////////////////////////
// Base Tasks
//////////////////////////////////////////////////

gulp.task('serve', ['serve-tasks'], function () {
  browserSync.init({
    proxy: 'localhost:9998/'
  });

  gulp.watch('views/**/*.*', browserSync.reload);
  gulp.watch(config.cssSrcDir + '/**/*.*', ['styles']);
  gulp.watch(config.jsSrcDir + '/**/*.*', ['scripts']);
});

gulp.task('watch', function() {
  // gulp.watch('views/**/*.*', browserSync.reload);
  gulp.watch(config.cssSrcDir + '/**/*.*', ['styles']);
  gulp.watch(config.jsSrcDir + '/**/*.*', ['scripts']);
});

gulp.task('serve-tasks', function (cb) {
  runSequence('build', 'nodemon', cb);
});

gulp.task('build', function (cb) {
  runSequence('clean', ['styles', 'scripts', 'images'], cb);
});

gulp.task('deploy', function () {
  env = 'prod';
  gulp.start('build');
});

gulp.task('default', function () {
  console.log('');
  console.log('');
  console.log('To develop, run "gulp serve"');
  console.log('- Sets up');
  console.log('  - Cleans public/build folder');
  console.log('  - JS/SCSS watch and compile');
  console.log('  - Images watch and minify');
  console.log('  - Sets up browserSync');
  console.log('');
  console.log('To run sitespeed test, run "gulp sitespeed"');
  console.log('');
  console.log('To run casper tests, run "gulp casper"');
  console.log('');
  console.log('To deploy for production, run "gulp deploy"');
  console.log('- Sets up');
  console.log('  - Cleans public/build folder');
  console.log('  - Generates final built files');
  console.log('');
  console.log('');
});

//////////////////////////////////////////////////
// Task Details
//////////////////////////////////////////////////

// Negated glob patterns with node-glob are tricky
// del (package) doesn't support the ignore pattern
// so we have to do some fun with negation to get it to
// work

gulp.task('clean', function (cb) {
  return del([
    'public/**/*',
    '!public/img',
    'public/img/**/*',
    '!public/img/logos',
    '!public/img/logos/**/*'
  ], cb);
});

gulp.task('styles', function () {
  var files = config.cssSrcDir + '/**/*.scss';

  var sassOptions = {
    outputStyle: (env === 'dev') ? 'nested' : 'compressed',
    includePaths: ['node_modules']
  };

  return gulp.src(files)
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(gulp.dest(destDir + '/css'))
    .pipe(gulpif(env === 'dev', browserSync.stream()));
});

gulp.task('images', function () {

  // negate sprites from the glob
  var files = [
    '!' + config.imgSrcDir + '/sprites/*.png',
    config.imgSrcDir + '/**/*.*'
  ];

  return gulp.src(files)
    .pipe(newer(destDir + '/img'))
    .pipe(imagemin())
    .pipe(gulp.dest(destDir + '/img'));
});

gulp.task('lint', function() {
  return gulp.src(config.jsSrcDir + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('scripts', ['scripts:webpack'], function () {
  var files = [
    destDir + '/js/doublehappiness.js'
  ];

  return gulp.src(files)
    // .pipe(newer(destDir + '/js/docs.js'))
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('doublehappiness.js'))
    .pipe(gulpif(env === 'dev', sourcemaps.write()))
    .pipe(gulpif(env === 'prod', uglify()))
    .pipe(gulp.dest(destDir + '/js'))
    .pipe(gulpif(env === 'dev', browserSync.stream()));
});

gulp.task('scripts:webpack', function(callback) {
    // run webpack
    webpack({
      entry: [
        './client/js/app.js'
        ],
      output: {
        path: path.join(__dirname, 'public/js'),
        filename: 'doublehappiness.js'
      },
      module: {
        loaders: [
          {
            test: /\.js?$/,
            loader: "babel-loader",
            query: {
                presets: ['es2015']
            }
          }
        ]
      },
      resolve: {
        // you can now require('file') instead of require('file.js')
        extensions: ['', '.js', '.json']
      }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});


gulp.task('nodemon', function () {
  nodemon({
    script: 'app.js',
    ignore: 'client-src/',
    env: {
      'NODE_ENV': 'development'
    }
  });
});
