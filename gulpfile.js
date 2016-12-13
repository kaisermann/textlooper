'use strict';

// Globals
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var name = "textLooper";

// Tasks
gulp.task('lint', function () {
  return gulp.src(['src/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('build', function () {
  return gulp.src('./src/_main.js')
    .pipe($.plumber())
    .pipe($.buble())
    //.pipe($.stripComments())
    .pipe($.rename(name + '.js'))
    .pipe($.size({
      showFiles: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', ['lint', 'build'], function () {
  return gulp.src(['./dist/' + name + '.js'])
    .pipe($.plumber())
    .pipe($.uglify())
    .pipe($.rename(name + '.min.js'))
    .pipe($.size({
      showFiles: true
    }))
    .pipe($.size({
      gzip: true,
      showFiles: true
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch(['src/*.js'], ['minify']);
});

gulp.task('default', ['minify']);
