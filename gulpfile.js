'use strict';

// ----------- dependencies

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    minifyCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    gzip = require('gulp-gzip'),
    del = require('del'),
    runSequence = require('run-sequence'),
    ghPages = require('gulp-gh-pages');

// ----------- variables

var stylesInput  = 'app/scss/**/*.scss';
var scriptsInput = 'app/js/**/*.js';
var markupInput  = 'app/*.html';

// ----------- server

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

// ----------- compile Sass files & reload

gulp.task('sass', function() {
  return gulp.src(stylesInput)
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// ----------- browserSync, Sass, watch files

gulp.task('default', ['browserSync', 'sass'], function (){
  gulp.watch(stylesInput, ['sass']); 
  gulp.watch(scriptsInput, browserSync.reload); 
  gulp.watch(markupInput, browserSync.reload); 
});

// ----------- minify CSS & JS, put everything in /dist

gulp.task('useref', function(){
  var assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe(gulpIf('*.css', minifyCSS()))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// ----------- Images

gulp.task('images', function(){
  //return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
  return gulp.src('app/img/*.svg')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
});

// ----------- cleanup

gulp.task('clean', function(callback) {
  del('dist');
  del('app/css/styles.css');
  return cache.clearAll(callback);
})

// ----------- build

gulp.task('build', function(callback) {
  runSequence('clean', 'sass', 'useref', 'images', callback);
});

// ----------- deploy to GitHub Pages

// Not using this yet, need to address the HTTPS issue

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
